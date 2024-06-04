import axios from 'axios';

let apiUrl = process.env.BACKEND_HOST;

const api = axios.create({
  baseURL: `${apiUrl}/api`,
  withCredentials: true,
});

export const loginJwt = async () => {
  const res = await api.get('/auth/login');

  // If user has never logged in before, redirect to consent screen
  if (res.status === 210) {
    window.location = res.data;
  }
};
