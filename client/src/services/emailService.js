import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/emails';

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

// 📥 Folder Fetching
export const getInboxEmails = async () => {
  const res = await axiosInstance.get('/inbox');
  return res.data.data;
};

export const getStarredEmails = async () => {
  const res = await axiosInstance.get('/starred');
  return res.data.data;
};

export const getSentEmails = async () => {
  const res = await axiosInstance.get('/sent');
  return res.data.data;
};

export const getDraftEmails = async () => {
  const res = await axiosInstance.get('/drafts');
  return res.data.data;
};

export const getSnoozedEmails = async () => {
  const res = await axiosInstance.get('/snoozed');
  return res.data.data;
};

export const getTrashEmails = async () => {
  const res = await axiosInstance.get('/trash');
  return res.data.data;
};

// 📧 Mail By ID
export const getEmailById = async (id) => {
  const res = await axiosInstance.get(`/item/${id}`);
  return res.data.data; // expecting an object or null
};



// ✉️ Compose
export const sendEmail = (formData) =>
  axiosInstance.post('/send', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// 📝 Draft
export const saveDraft = (formData) =>
  axiosInstance.post('/draft', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// ⭐ Star Toggle
export const toggleStar = (id) => axiosInstance.put(`/${id}/star`);

// ✅ Mark as Read
export const markAsRead = (id) => axiosInstance.put(`/${id}/read`);

// 💤 Snooze
export const snoozeEmail = (id) => axiosInstance.patch(`/${id}/snooze`);

// 🗑️ Move to Trash
export const deleteEmailById = (id) => axiosInstance.delete(`/${id}`);

// ♻️ Restore
export const restoreFromTrash = (id) => axiosInstance.patch(`/restore/${id}`);

// ❌ Delete Forever
export const deleteForever = (id) => axiosInstance.delete(`/delete-forever/${id}`);
