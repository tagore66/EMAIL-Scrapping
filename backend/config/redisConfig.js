const { createClient } = require('redis');
require('dotenv').config();

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis connected successfully'));

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      // Force a 3-second timeout for the connection itself
      await Promise.race([
        redisClient.connect(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Redis Connection Timeout')), 3000))
      ]);
    }
  } catch (err) {
    console.error('Failed to connect to Redis within 3s:', err.message);
  }
};

module.exports = { redisClient, connectRedis };
