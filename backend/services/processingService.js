const cheerio = require('cheerio');

const categories = {
  Shopping: ['order', 'amazon', 'purchase', 'shipping', 'delivery', 'receipt', 'invoice', 'cart', 'buy', 'flipkart', 'myntra', 'ajio'],
  Food: ['swiggy', 'zomato', 'uber eats', 'restaurant', 'food', 'meal', 'pizza', 'burger', 'delivery', 'starbucks', 'kfc'],
  Travel: ['flight', 'airline', 'hotel', 'booking', 'ticket', 'reservation', 'expedia', 'airbnb', 'train', 'irctc', 'uber', 'ola', 'indigo', 'vistara'],
  Bills: ['bill', 'electricity', 'water', 'gas', 'due', 'utility', 'payment due', 'invoice', 'internet', 'broadband', 'recharge', 'mobile bill'],
  Subscriptions: ['subscription', 'netflix', 'spotify', 'prime', 'membership', 'renew', 'renewal', 'monthly plan', 'yearly plan', 'youtube premium']
};

const cleanText = (html) => {
  if (!html) return '';
  const $ = cheerio.load(html);
  $('script, style').remove();
  let text = $('body').text() || html;
  return text.replace(/\s+/g, ' ').trim();
};

const categorizeEmail = (subject, body) => {
  const content = `${subject} ${body}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return category;
    }
  }
  
  return 'Others';
};

const extractAmount = (text) => {
  // Fixed regex: now correctly handles large numbers with or without commas
  const amountRegex = /(?:₹|\$|Rs\.|INR|€|£)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/gi;
  const matches = [...text.matchAll(amountRegex)];
  
  if (matches.length > 0) {
    const values = matches.map(m => parseFloat(m[1].replace(/,/g, '')));
    return Math.max(...values);
  }
  
  // Secondary check for "Amount: 500" or equivalent patterns
  const textMatches = text.match(/(?:amount|total|paid|price|cost)\s*(?::|is)?\s*(?:₹|\$|Rs\.|INR)?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i);
  if (textMatches) {
    return parseFloat(textMatches[1].replace(/,/g, ''));
  }

  return 0;
};

module.exports = { cleanText, categorizeEmail, extractAmount };
