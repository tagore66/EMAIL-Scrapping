const cheerio = require('cheerio');

const categories = {
  Shopping: ['order', 'amazon', 'purchase', 'shipping', 'delivery', 'receipt', 'invoice', 'cart', 'buy'],
  Food: ['swiggy', 'zomato', 'uber eats', 'restaurant', 'food', 'meal', 'pizza', 'burger', 'delivery'],
  Travel: ['flight', 'airline', 'hotel', 'booking', 'ticket', 'reservation', 'expedia', 'airbnb', 'train', 'irctc'],
  Work: ['zoom', 'teams', 'slack', 'jira', 'confluence', 'meeting', 'calendar', 'document', 'project'],
  Finance: ['bank', 'credit card', 'debit card', 'transaction', 'payment', 'paid', 'statement', 'investment', 'stock'],
};

const cleanText = (html) => {
  if (!html) return '';
  const $ = cheerio.load(html);
  // Remove scripts and styles
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
  // Simple regex for amounts like $100.00, Rs. 500, INR 1000, 50.00 USD
  const amountRegex = /(?:\$|Rs\.|INR|€|£)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:USD|INR|EUR|GBP)/gi;
  const matches = [...text.matchAll(amountRegex)];
  
  if (matches.length > 0) {
    // Return the first match or logic to find the largest/most relevant
    const val = matches[0][1] || matches[0][2];
    return parseFloat(val.replace(/,/g, ''));
  }
  
  return 0;
};

module.exports = { cleanText, categorizeEmail, extractAmount };
