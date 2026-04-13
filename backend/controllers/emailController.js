const Email = require('../models/Email');
const User = require('../models/User');
const Telemetry = require('../models/Telemetry');
const { getGmailClient, fetchEmailList, getEmailDetails } = require('../services/gmailService');
const { cleanText, categorizeEmail, extractAmount } = require('../services/processingService');
const { redisClient } = require('../config/redisConfig');

const syncEmails = async (req, res) => {
  const { userId } = req.body;
  const startTime = Date.now();
  let processedCount = 0;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const gmail = getGmailClient(user.accessToken);
    const messages = await fetchEmailList(gmail);

    for (const msg of messages) {
      const existing = await Email.findOne({ messageId: msg.id });
      if (existing) continue;

      const details = await getEmailDetails(gmail, msg.id);
      const cleanedBody = cleanText(details.body);
      const category = categorizeEmail(details.subject, cleanedBody);
      const amount = extractAmount(cleanedBody);

      await Email.create({
        userId,
        ...details,
        body: cleanedBody,
        category,
        amount,
        isProcessed: true
      });
      processedCount++;
    }

    const duration = Date.now() - startTime;
    await Telemetry.create({
      userId,
      operation: 'SYNC_EMAILS',
      count: processedCount,
      durationMs: duration,
      status: 'SUCCESS'
    });

    // Invalidate Cache (safe)
    if (redisClient.isReady) {
      try {
        await redisClient.del(`emails_data:${userId}`);
      } catch (err) {
        console.error('Redis delete error:', err);
      }
    }

    res.json({ message: 'Sync complete', processedCount });
  } catch (error) {
    console.error('Sync error:', error);
    await Telemetry.create({
      userId,
      operation: 'SYNC_EMAILS',
      status: 'FAILURE',
      error: error.message
    });
    res.status(500).json({ error: 'Sync failed' });
  }
};

const getEmails = async (req, res) => {
  const startTime = Date.now();
  try {
    const { userId } = req.query;
    const cacheKey = `emails_data:${userId}`;

    // 1. Try to fetch FULL RESPONSE from Cache (Emails + Stats)
    if (redisClient.isReady) {
      try {
        const cachedData = await Promise.race([
          redisClient.get(cacheKey),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Redis Timeout')), 1000))
        ]);

        if (cachedData) {
          const result = JSON.parse(cachedData);
          const totalDuration = Date.now() - startTime;
          
          // Log CACHE hit
          await Telemetry.create({
            userId,
            operation: 'GET_EMAILS (CACHE)',
            count: result.emails.length,
            durationMs: totalDuration,
            status: 'SUCCESS'
          });

          return res.json({ ...result, dbDuration: totalDuration, source: 'CACHE' });
        }
      } catch (err) {
        console.error('Redis fetch error:', err.message);
      }
    }

    // 2. Slow Path: Query MongoDB
    const emails = await Email.find({ userId }).sort({ date: -1 });
    
    const stats = {
      totalSpending: 0,
      categoryBreakdown: {},
      monthlyTrends: {},
      topSenders: {}
    };

    emails.forEach(email => {
      stats.totalSpending += (email.amount || 0);
      stats.categoryBreakdown[email.category] = (stats.categoryBreakdown[email.category] || 0) + (email.amount || 0);
      const month = new Date(email.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      stats.monthlyTrends[month] = (stats.monthlyTrends[month] || 0) + (email.amount || 0);
      const senderName = email.sender.split('<')[0].trim();
      stats.topSenders[senderName] = (stats.topSenders[senderName] || 0) + 1;
    });

    const totalDuration = Date.now() - startTime;

    // 3. Store EVERYTHING in Cache for 10 minutes (shorter TTL for full data)
    if (redisClient.isReady) {
      try {
        await redisClient.setEx(cacheKey, 600, JSON.stringify({ emails, stats }));
      } catch (err) {
        console.error('Redis store error:', err);
      }
    }

    // Log DB hit
    await Telemetry.create({
      userId,
      operation: 'GET_EMAILS (DB)',
      count: emails.length,
      durationMs: totalDuration,
      status: 'SUCCESS'
    });

    res.json({ emails, stats, dbDuration: totalDuration, source: 'DB' });
  } catch (error) {
    console.error('Fetch emails error:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};

const reprocessEmails = async (req, res) => {
  const { userId } = req.body;
  try {
    const emails = await Email.find({ userId });
    let updatedCount = 0;

    for (const email of emails) {
      const category = categorizeEmail(email.subject, email.body || email.snippet);
      const amount = extractAmount(email.body || email.snippet);
      
      email.category = category;
      email.amount = amount;
      await email.save();
      updatedCount++;
    }

    // Invalidate Cache (safe)
    if (redisClient.isReady) {
      try {
        await redisClient.del(`emails_data:${userId}`);
      } catch (err) {
        console.error('Redis delete error:', err);
      }
    }

    res.json({ message: 'Reprocessing complete', updatedCount });
  } catch (error) {
    console.error('Reprocess error:', error);
    res.status(500).json({ error: 'Reprocessing failed' });
  }
};

const getTelemetry = async (req, res) => {
  try {
    const { userId } = req.query;
    const logs = await Telemetry.find({ userId })
      .sort({ timestamp: -1 })
      .limit(5);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch telemetry' });
  }
};

module.exports = { syncEmails, getEmails, reprocessEmails, getTelemetry };
