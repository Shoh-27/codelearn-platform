import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

// Profile API
export const profileAPI = {
    getProfile: () => api.get('/profile'),
    updateProfile: (data) => api.put('/profile', data),
    getStats: () => api.get('/profile/stats'),
};

// Lessons API
export const lessonsAPI = {
    getAll: (difficulty) => api.get('/lessons', { params: { difficulty } }),
    getBySlug: (slug) => api.get(`/lessons/${slug}`),
};

// Challenges API
export const challengesAPI = {
    getAll: (difficulty) => api.get('/challenges', { params: { difficulty } }),
    getBySlug: (slug) => api.get(`/challenges/${slug}`),
    submit: (id, code) => api.post(`/challenges/${id}/submit`, { code }),
    getProgress: (id) => api.get(`/challenges/${id}/progress`),
};

// Projects API
export const projectsAPI = {
    getAll: (difficulty) => api.get('/projects', { params: { difficulty } }),
    getBySlug: (slug) => api.get(`/projects/${slug}`),
};

// Submissions API
export const submissionsAPI = {
    getAll: () => api.get('/submissions'),
    create: (data) => api.post('/submissions', data),
    getById: (id) => api.get(`/submissions/${id}`),
};

// Gamification API
export const gamificationAPI = {
    getLeaderboard: (limit = 50) => api.get('/gamification/leaderboard', { params: { limit } }),
    getBadges: () => api.get('/gamification/badges'),
    getLevels: () => api.get('/gamification/levels'),
};

// Admin API
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: (params) => api.get('/admin/users', { params }),
    getUser: (id) => api.get(`/admin/users/${id}`),
    toggleUserActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),

    createLesson: (data) => api.post('/admin/lessons', data),
    updateLesson: (id, data) => api.put(`/admin/lessons/${id}`, data),
    deleteLesson: (id) => api.delete(`/admin/lessons/${id}`),

    createChallenge: (data) => api.post('/admin/challenges', data),
    updateChallenge: (id, data) => api.put(`/admin/challenges/${id}`, data),
    deleteChallenge: (id) => api.delete(`/admin/challenges/${id}`),

    createProject: (data) => api.post('/admin/projects', data),
    updateProject: (id, data) => api.put(`/admin/projects/${id}`, data),
    deleteProject: (id) => api.delete(`/admin/projects/${id}`),

    getPendingSubmissions: () => api.get('/admin/submissions/pending'),
    reviewSubmission: (id, data) => api.put(`/admin/submissions/${id}/review`, data),
};

export default api;