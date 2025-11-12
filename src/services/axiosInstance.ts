import axios from 'axios';
import axiosRetry from 'axios-retry';
import type { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_API as string;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => {
    return error.response?.status === 500 || !error.response;
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(new Error(error.response.data.message || 'Server error'));
    } else if (error.request) {
      return Promise.reject(new Error('Network error, please check your connection'));
    } else {
      return Promise.reject(new Error('Error occurred while setting up the request'));
    }
  }
);

export default axiosInstance;
