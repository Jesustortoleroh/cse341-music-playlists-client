import { useState, useEffect } from 'react';
import './App.css';
import type { Playlist, Notification } from './types';
import { Notifications } from './components/Notifications';
import { PlaylistForm } from './components/PlaylistForm';
import { PlaylistCard } from './components/PlaylistCard';
import { AuthModal } from './components/AuthModal';
import { AudioPlayer } from './components/AudioPlayer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  const addNotification = (message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${API_URL}/api/playlists`, { credentials: 'include' });
      const result = await response.json();
      return result.success ? (result.data as Playlist[]) : undefined;
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, { credentials: 'include' });
      return response.ok;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([fetchPlaylists(), checkAuth()]).then(([loadedPlaylists, authenticated]) => {
      if (active) {
        if (loadedPlaylists) setPlaylists(loadedPlaylists);
        setIsLoggedIn(authenticated);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  const handleCreatePlaylist = async (data: { name: string; creator: string; genre: string; songs: string[] }) => {
    try {
      const response = await fetch(`${API_URL}/api/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...data, isPublic: true }),
      });
      if (response.ok) {
        addNotification('Playlist created!', 'success');
        const updated = await fetchPlaylists();
        if (updated) setPlaylists(updated);
      } else {
        addNotification('Error creating playlist. Are you logged in?', 'error');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleUpdatePlaylist = async (id: string, updatedData: Partial<Playlist>) => {
    try {
      const response = await fetch(`${API_URL}/api/playlists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        addNotification('Playlist updated!', 'success');
        const updated = await fetchPlaylists();
        if (updated) setPlaylists(updated);
      } else {
        addNotification('Error updating playlist.', 'error');
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;
    try {
      const response = await fetch(`${API_URL}/api/playlists/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        addNotification('Playlist deleted!', 'success');
        const updated = await fetchPlaylists();
        if (updated) setPlaylists(updated);
      } else {
        addNotification('Error deleting playlist.', 'error');
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  const handleLogin = (provider: 'github' | 'google') => {
    setIsAuthLoading(true);
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  // 👇 CORREGIDO: Ahora captura y lanza el mensaje real del backend
  const handleRegister = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      // Intentamos leer el JSON de error del backend
      const errorData = await response.json().catch(() => null);
      // Lanzamos el mensaje exacto del backend o uno por defecto
      const message = errorData?.message || errorData?.error || 'Error al registrar usuario. Intenta de nuevo.';
      throw new Error(message);
    }
  };

  const handleLogout = async () => {
    setIsAuthLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/logout`, { credentials: 'include' });
      if (response.ok) {
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
        <header className="header"><h1>🎵 VibeBeat</h1></header>
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
            <button onClick={() => setIsModalOpen(true)} className="auth-button login">Login</button>
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

      <AudioPlayer 
        song={currentSong} 
        onClose={() => setCurrentSong(null)} 
      />
    </div>
  );
}

export default App;