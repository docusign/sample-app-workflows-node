import axios from 'axios';

// TODO: Enchance and/or correct API logic after setting up backend authentication
const api = axios.create({
    baseURL: '/api',
});

export const login = async ({ authType }) => {
    const res = await api.get('/auth/login');

    // If user has never logged in before, redirect to consent screen
    if (res.status === 210) {
        window.location = res.data;
    }
};