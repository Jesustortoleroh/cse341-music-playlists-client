import { useState, useEffect, useCallback } from 'react';
import './App.css';
import type { Playlist, Notification } from './types';
import { Notifications } from './components/Notifications';
import { PlaylistForm } from './components/PlaylistForm';
import { PlaylistCard } from './components/PlaylistCard';
import { AuthModal } from './components/AuthModal';
import { AudioPlayer } from './components/AudioPlayer';
import { api } from './services/api';

function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  const addNotification = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [playlistsRes, auth] = await Promise.all([api.getPlaylists(), api.checkAuth()]);
      if (playlistsRes.data) setPlaylists(playlistsRes.data);
      setIsLoggedIn(auth);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
      addNotification(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [playlistsRes, auth] = await Promise.all([api.getPlaylists(), api.checkAuth()]);

        if (!isMounted) return;

        if (playlistsRes.data) setPlaylists(playlistsRes.data);
        setIsLoggedIn(auth);
      } catch (err: unknown) {
        if (!isMounted) return;

        const message = err instanceof Error ? err.message : 'Failed to load data';
        setError(message);
        addNotification(message, 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [addNotification]);

  const handleCreatePlaylist = async (data: {
    name: string;
    creator: string;
    genre: string;
    songs: string[];
  }) => {
    try {
      await api.createPlaylist({ ...data, isPublic: true });
      addNotification('Playlist created!', 'success');
      await loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error creating playlist';
      addNotification(message, 'error');
    }
  };

  const handleUpdatePlaylist = async (id: string, updatedData: Partial<Playlist>) => {
    try {
      await api.updatePlaylist(id, updatedData);
      addNotification('Playlist updated!', 'success');
      await loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error updating playlist';
      addNotification(message, 'error');
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;
    try {
      await api.deletePlaylist(id);
      addNotification('Playlist deleted!', 'success');
      await loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error deleting playlist';
      addNotification(message, 'error');
    }
  };

  const handleLogin = (provider: 'github' | 'google') => {
    setIsAuthLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'https://vibe-beat-server.onrender.com';
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      await api.register(name, email, password);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error registering user';
      // ✅ Pasamos el error original como "cause" para preservar el stack trace
      throw new Error(message, { cause: err });
    }
  };

  const handleLogout = async () => {
    setIsAuthLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://vibe-beat-server.onrender.com';
      const res = await fetch(`${API_URL}/auth/logout`, {
        credentials: 'include',
        method: 'POST'
      });
      if (res.ok) {
        setIsLoggedIn(false);
        setIsModalOpen(false);
        addNotification('Logged out successfully', 'success');
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <header className="header">
          <h1>🎵 VibeBeat</h1>
        </header>
        <div className="playlist-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="playlist-card skeleton">
              <div className="skeleton-line title"></div>
              <div className="skeleton-line text"></div>
              <div className="skeleton-line text"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <header className="header">
          <h1>🎵 VibeBeat</h1>
        </header>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#ef4444' }}>{error}</p>
          <button onClick={loadData} className="auth-button login">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Notifications notifications={notifications} />

      <header className="header">
        <h1>🎵 VibeBeat</h1>
        <div className="auth-section">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="auth-button logout" disabled={isAuthLoading}>
              {isAuthLoading ? 'Logging out...' : 'Logout'}
            </button>
          ) : (
            <button onClick={() => setIsModalOpen(true)} className="auth-button login">
              Login
            </button>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isModalOpen}
        isAuthLoading={isAuthLoading}
        onClose={() => setIsModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSuccess={(msg) => addNotification(msg, 'success')}
      />

      <PlaylistForm onSubmit={handleCreatePlaylist} />

      <div className="playlist-grid">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist._id}
            playlist={playlist}
            isLoggedIn={isLoggedIn}
            onDelete={handleDeletePlaylist}
            onUpdate={handleUpdatePlaylist}
            onPlay={(song) => setCurrentSong(song)}
          />
        ))}
      </div>

      <AudioPlayer song={currentSong} onClose={() => setCurrentSong(null)} />
    </div>
  );
}

export default App;
