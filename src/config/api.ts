// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const API = {
  base: API_BASE_URL,
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    me: `${API_BASE_URL}/auth/me`,
  },
  chats: {
    list: `${API_BASE_URL}/chats`,
    getById: (id: string) => `${API_BASE_URL}/chats/${encodeURIComponent(id)}`,
    create: `${API_BASE_URL}/chats`,
    delete: (id: string) => `${API_BASE_URL}/chats/${encodeURIComponent(id)}`,
  },
  gemini: `${API_BASE_URL}/api/gemini/generate-content`,
};
