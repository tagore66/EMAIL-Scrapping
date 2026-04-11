import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const fetchAuthUrl = () => API.get('/auth/google');
export const syncEmails = (userId) => API.post('/emails/sync', { userId });
export const getEmails = (userId) => API.get(`/emails?userId=${userId}`);
export const getAnalytics = (userId) => API.get(`/analytics?userId=${userId}`);
export const getTelemetry = (userId) => API.get(`/analytics/telemetry?userId=${userId}`);

export default API;
