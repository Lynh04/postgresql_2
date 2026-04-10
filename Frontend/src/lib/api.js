import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Using 127.0.0.1 is sometimes more stable than localhost on Windows
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
