import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Playlist {
  _id: string;
  name: string;
  creator: string;
  genre: string;
  songs: string[];
}

// Notification type
interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error';
}

function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [name, setName] = useState('');
  const [creator, setCreator] = useState('');
  const [genre, setGenre] = useState('jazz');
  const [songs, setSongs] = useState(''); // Comma-separated string
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCreator, setEditCreator] = useState('');
  const [editGenre, setEditGenre] = useState('jazz');
  const [editSongs, setEditSongs] = useState('');

  // Helper to add notifications
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

  const handleLoginRedirect = (provider: 'github' | 'google') => {
    setIsAuthLoading(true);
    window.location.href = `${API_URL}/auth/${provider}`;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const songsArray = songs.split(',').map((s) => s.trim()).filter((s) => s !== '');
    try {
      const response = await fetch(`${API_URL}/api/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, creator, genre, songs: songsArray, isPublic: true }),
      });
      if (response.ok) {
        addNotification('Playlist created!', 'success');
        setName(''); setCreator(''); setSongs('');
        const updated = await fetchPlaylists();
        if (updated) setPlaylists(updated);
      } else {
        addNotification('Error creating playlist. Are you logged in?', 'error');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleDelete = async (id: string) => {
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    const songsArray = editSongs.split(',').map((s) => s.trim()).filter((s) => s !== '');
    try {
      const response = await fetch(`${API_URL}/api/playlists/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: editName, creator: editCreator, genre: editGenre, songs: songsArray }),
      });
      if (response.ok) {
        addNotification('Playlist updated!', 'success');
        setEditingId(null);
        const updated = await fetchPlaylists();
        if (updated) setPlaylists(updated);
      } else {
        addNotification('Error updating playlist.', 'error');
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const startEdit = (playlist: Playlist) => {
    setEditingId(playlist._id);
    setEditName(playlist.name);
    setEditCreator(playlist.creator);
    setEditGenre(playlist.genre);
    setEditSongs(playlist.songs.join(', '));
  };

  // Skeleton Loading
  if (loading) {
    return (
      <div className="container">
        <header className="header">
          <h1>🎵 Music Playlists</h1>
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

  return (
    <div className="container">
      {/* Notifications Container */}
      <div className="notifications-container">
        {notifications.map((n) => (
          <div key={n.id} className={`toast ${n.type}`}>
            {n.message}
          </div>
        ))}
      </div>

      <header className="header">
        <h1>🎵 Music Playlists</h1>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Sign In</h2>
            <p>Choose a provider to log in:</p>
            <div className="modal-buttons">
              <button onClick={() => handleLoginRedirect('github')} className="provider-btn github" disabled={isAuthLoading}>
                {isAuthLoading ? 'Redirecting...' : 'Login with GitHub'}
              </button>
              <button onClick={() => handleLoginRedirect('google')} className="provider-btn google" disabled={isAuthLoading}>
                {isAuthLoading ? 'Redirecting...' : 'Login with Google'}
              </button>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="close-btn" disabled={isAuthLoading}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="playlist-form">
        <input type="text" placeholder="Playlist Name" value={name} onChange={(e) => setName(e.target.value)} required className="input" />
        <input type="text" placeholder="Creator" value={creator} onChange={(e) => setCreator(e.target.value)} required className="input" />
        <select value={genre} onChange={(e) => setGenre(e.target.value)} className="select">
          <option value="jazz">Jazz</option>
          <option value="rock">Rock</option>
          <option value="pop">Pop</option>
          <option value="classical">Classical</option>
        </select>
        <input type="text" placeholder="Songs (comma separated)" value={songs} onChange={(e) => setSongs(e.target.value)} className="input" />
        <button type="submit" className="submit-btn">Create Playlist</button>
      </form>

      <div className="playlist-grid">
        {playlists.map((playlist) => (
          <div key={playlist._id} className="playlist-card">
            {editingId === playlist._id ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="input" />
                <input type="text" value={editCreator} onChange={(e) => setEditCreator(e.target.value)} required className="input" />
                <select value={editGenre} onChange={(e) => setEditGenre(e.target.value)} className="select">
                  <option value="jazz">Jazz</option>
                  <option value="rock">Rock</option>
                  <option value="pop">Pop</option>
                  <option value="classical">Classical</option>
                </select>
                <input type="text" value={editSongs} onChange={(e) => setEditSongs(e.target.value)} placeholder="Songs (comma separated)" className="input" />
                <div className="edit-actions">
                  <button type="submit" className="submit-btn">Save</button>
                  <button type="button" onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h2>{playlist.name}</h2>
                <p><strong>Creator:</strong> {playlist.creator}</p>
                <p><strong>Genre:</strong> {playlist.genre}</p>
                {playlist.songs.length > 0 && (
                  <div className="songs-list">
                    <strong>Songs:</strong>
                    <ul>
                      {playlist.songs.map((song, i) => (
                        <li key={i}>{song}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {isLoggedIn && (
                  <div className="card-actions">
                    <button onClick={() => startEdit(playlist)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(playlist._id)} className="delete-btn">Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;