export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  provider?: 'local' | 'github' | 'google';
  createdAt?: string;
  updatedAt?: string;
}

export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  creator: string;
  genre: string;
  songs: string[];
  isPublic: boolean;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}
