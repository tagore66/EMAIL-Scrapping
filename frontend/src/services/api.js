import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: baseURL,
});

export const fetchAuthUrl = () => API.get('/auth/google');
export const syncEmails = (userId) => API.post('/emails/sync', { userId });
export const getEmails = (userId) => API.get(`/emails?userId=${userId}`);
export const getTelemetry = (userId) => API.get(`/emails/telemetry?userId=${userId}`);
export const reprocessEmails = (userId) => API.post('/emails/reprocess', { userId });
export default API;
