const { google } = require('googleapis');
const { oauth2Client } = require('../config/googleConfig');

const getGmailClient = (accessToken) => {
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

const fetchEmailList = async (gmail, maxResults = 20) => {
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults,
    q: 'after:2024/01/01' // Example filter
  });
  return response.data.messages || [];
};

const getEmailDetails = async (gmail, messageId) => {
  const response = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full'
  });
  
  const payload = response.data.payload;
  const headers = payload.headers;
  
  const getHeader = (name) => headers.find(h => h.name === name)?.value;
  
  const subject = getHeader('Subject');
  const from = getHeader('From');
  const date = getHeader('Date');
  
  let body = '';
  if (payload.parts) {
    const part = payload.parts.find(p => p.mimeType === 'text/plain') || payload.parts[0];
    if (part.body.data) {
      body = Buffer.from(part.body.data, 'base64').toString();
    }
  } else if (payload.body.data) {
    body = Buffer.from(payload.body.data, 'base64').toString();
  }

  return {
    messageId,
    threadId: response.data.threadId,
    sender: from,
    subject,
    date: new Date(date),
    body,
    snippet: response.data.snippet
  };
};

module.exports = { getGmailClient, fetchEmailList, getEmailDetails };
