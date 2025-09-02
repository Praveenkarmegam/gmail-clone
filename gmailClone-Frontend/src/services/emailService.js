import axios from 'axios';

// local
// export const API_BASE = 'http://localhost:5000/api';

// render
export const API_BASE = 'https://gmail-clone-1-qw9m.onrender.com/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// Automatically add Authorization header for every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Folder Fetching
export const getInboxEmails = async () => {
  const res = await axiosInstance.get('/emails/inbox');
  return res.data.data;
};

export const getStarredEmails = async () => {
  const res = await axiosInstance.get('/emails/starred');
  return res.data.data;
};

export const getSentEmails = async () => {
  const res = await axiosInstance.get('/emails/sent');
  return res.data.data;
};

export const getDraftEmails = async () => {
  const res = await axiosInstance.get('/emails/drafts');
  return res.data.data;
};

export const getSnoozedEmails = async () => {
  const res = await axiosInstance.get('/emails/snoozed');
  return res.data.data;
};

export const getTrashEmails = async () => {
  const res = await axiosInstance.get('/emails/trash');
  return res.data.data;
};

// Mail By ID
export const getEmailById = async (id) => {
  const res = await axiosInstance.get(`/emails/item/${id}`);
  return res.data.data;
};

// Compose
export const sendEmail = (formData) =>
  axiosInstance.post('/emails/send', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Draft
export const saveDraft = (formData) =>
  axiosInstance.post('/emails/draft', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Star Toggle
export const toggleStar = (id) => axiosInstance.put(`/emails/${id}/star`);

// Mark as Read
export const markAsRead = (id) => axiosInstance.put(`/emails/${id}/read`);

// Snooze
export const snoozeEmail = (id) => axiosInstance.patch(`/emails/${id}/snooze`);

// Move to Trash
export const deleteEmailById = (id) => axiosInstance.delete(`/emails/${id}`);

// Restore
export const restoreFromTrash = (id) => axiosInstance.patch(`/emails/restore/${id}`);

// Delete Forever
export const deleteForever = (id) => axiosInstance.delete(`/emails/delete-forever/${id}`);
