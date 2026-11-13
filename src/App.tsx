import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Playlist {
  _id: string;
  name: string;
  creator: string;
  genre: string;
}

function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [name, setName] = useState('');
  const [creator, setCreator] = useState('');
  const [genre, setGenre] = useState('jazz');
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCreator, setEditCreator] = useState('');
  const [editGenre, setEditGenre] = useState('jazz');

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
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  const handleLogout = () => {
    window.location.href = `${API_URL}/auth/logout`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, creator, genre, songs: [], isPublic: true }),
      });
      if (response.ok) {
        alert('Playlist created!');
        setName(''); setCreator('');
        const updated = await fetchPlaylists();
        if (updated) setPlaylists(updated);
      } else {
        alert('Error creating playlist. Are you logged in?');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this playlist?')) return;
    try {
      const response = await fetch(`${API_URL}/api/playlists/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        alert('Playlist deleted!');
        const updated = await fetchPlaylists();
        if (updated) setPlaylists(updated);
      } else {
        alert('Error deleting playlist. Are you logged in?');
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const response = await fetch(`${API_URL}/api/playlists/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: editName, creator: editCreator, genre: editGenre }),
      });
      if (response.ok) {
        alert('Playlist updated!');
        setEditingId(null); // Close edit mode
        const updated = await fetchPlaylists();
        if (updated) setPlaylists(updated);
      } else {
        alert('Error updating playlist. Are you logged in?');
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  // Start editing
  const startEdit = (playlist: Playlist) => {
    setEditingId(playlist._id);
    setEditName(playlist.name);
    setEditCreator(playlist.creator);
    setEditGenre(playlist.genre);
  };

  if (loading) return <p className="loading">Loading playlists...</p>;

  return (
    <div className="container">
      <header className="header">
        <h1>🎵 Music Playlists</h1>
        <div className="auth-section">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="auth-button logout">Logout</button>
          ) : (
            <button onClick={() => setIsModalOpen(true)} className="auth-button login">Login</button>
          )}
        </div>
      </header>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Sign In</h2>
            <p>Choose a provider to log in:</p>
            <div className="modal-buttons">
              <button onClick={() => handleLoginRedirect('github')} className="provider-btn github">Login with GitHub</button>
              <button onClick={() => handleLoginRedirect('google')} className="provider-btn google">Login with Google</button>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="close-btn">Cancel</button>
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
        <button type="submit" className="submit-btn">Create Playlist</button>
      </form>

      <div className="playlist-grid">
        {playlists.map((playlist) => (
          <div key={playlist._id} className="playlist-card">
            {editingId === playlist._id ? (
              // EDIT MODE
              <form onSubmit={handleEditSubmit} className="edit-form">
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="input" />
                <input type="text" value={editCreator} onChange={(e) => setEditCreator(e.target.value)} required className="input" />
                <select value={editGenre} onChange={(e) => setEditGenre(e.target.value)} className="select">
                  <option value="jazz">Jazz</option>
                  <option value="rock">Rock</option>
                  <option value="pop">Pop</option>
                  <option value="classical">Classical</option>
                </select>
                <div className="edit-actions">
                  <button type="submit" className="submit-btn">Save</button>
                  <button type="button" onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
                </div>
              </form>
            ) : (
              // READ MODE
              <>
                <h2>{playlist.name}</h2>
                <p><strong>Creator:</strong> {playlist.creator}</p>
                <p><strong>Genre:</strong> {playlist.genre}</p>
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