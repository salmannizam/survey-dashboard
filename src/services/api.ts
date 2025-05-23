
// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.3:3001'; // Your NestJS server URL

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // ✅
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ attaches token to every request
  }
  return config;
});

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getSurveyData = async (params: any) => {
  try {
    const response = await api.get('/survey/pivot-data', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching survey data:', error);
    throw error;
  }
};

// api.ts (or wherever your API calls live)
export const downloadSingleImage = async (projectId: string, file: string) => {
  return await api.post(
    '/survey/download-single-image',
    { projectId, file },
    { responseType: 'blob' }
  );
};

export const downloadImagesZip = async (projectId: string, files: string[]) => {
  return await api.post(
    '/survey/download-zip-image',
    { projectId, files },
    { responseType: 'blob' }
  );
};

// Username: admin

// Password: dabur2025@123