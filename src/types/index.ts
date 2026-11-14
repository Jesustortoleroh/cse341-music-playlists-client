export interface Playlist {
  _id: string;
  name: string;
  creator: string;
  genre: string;
  songs: string[];
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}