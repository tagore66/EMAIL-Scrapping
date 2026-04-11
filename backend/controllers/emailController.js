const Email = require('../models/Email');
const User = require('../models/User');
const Telemetry = require('../models/Telemetry');
const { getGmailClient, fetchEmailList, getEmailDetails } = require('../services/gmailService');
const { cleanText, categorizeEmail, extractAmount } = require('../services/processingService');

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
  try {
    const emails = await Email.find({ userId: req.query.userId }).sort({ date: -1 });
    res.json(emails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};

module.exports = { syncEmails, getEmails };
