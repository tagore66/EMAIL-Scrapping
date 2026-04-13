import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: baseURL,
});

export const fetchAuthUrl = () => API.get('/auth/google');
export const syncEmails = (userId) => API.post('/emails/sync', { userId });
export const getEmails = (userId) => API.get(`/emails?userId=${userId}`);
export const reprocessEmails = (userId) => API.post('/emails/reprocess', { userId });
export const getAnalytics = (userId) => API.get(`/analytics?userId=${userId}`);
export const getTelemetry = (userId) => API.get(`/analytics/telemetry?userId=${userId}`);

export default API;
