import type { Playlist } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'https://vibe-beat-server.onrender.com';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: { message: string; field?: string }[];
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    }
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body.message || `Error ${response.status}: ${response.statusText}`);
  }

  return body as ApiResponse<T>;
}

export const api = {
  getPlaylists: () => fetchApi<Playlist[]>('/api/playlists'),

  createPlaylist: (data: Partial<Playlist>) =>
    fetchApi<Playlist>('/api/playlists', { method: 'POST', body: JSON.stringify(data) }),

  updatePlaylist: (id: string, data: Partial<Playlist>) =>
    fetchApi<Playlist>(`/api/playlists/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deletePlaylist: (id: string) => fetchApi<void>(`/api/playlists/${id}`, { method: 'DELETE' }),

  checkAuth: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, { credentials: 'include' });
      return res.ok;
    } catch {
      return false;
    }
  },

  register: (name: string, email: string, password: string) =>
    fetchApi('/api/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })
};
