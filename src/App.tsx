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
  
  // State for the login modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${API_URL}/api/playlists`, {
        credentials: 'include',
      });
      const result = await response.json();
      return result.success ? (result.data as Playlist[]) : undefined;
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        credentials: 'include',
      });
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
    return () => {
      active = false;
    };
  }, []);

  const handleLoginRedirect = (provider: 'github' | 'google') => {
    // Redirect to backend OAuth endpoint
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
        setName('');
        setCreator('');
        const updatedPlaylists = await fetchPlaylists();
        if (updatedPlaylists) setPlaylists(updatedPlaylists);
      } else {
        alert('Error creating playlist. Are you logged in?');
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  if (loading) return <p className="loading">Loading playlists...</p>;

  return (
    <div className="container">
      <header className="header">
        <h1>🎵 Music Playlists</h1>
        <div className="auth-section">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="auth-button logout">
              Logout
            </button>
          ) : (
            <button onClick={() => setIsModalOpen(true)} className="auth-button login">
              Login
            </button>
          )}
        </div>
      </header>

      {/* Login Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Sign In</h2>
            <p>Choose a provider to log in:</p>
            <div className="modal-buttons">
              <button onClick={() => handleLoginRedirect('github')} className="provider-btn github">
                Login with GitHub
              </button>
              <button onClick={() => handleLoginRedirect('google')} className="provider-btn google">
                Login with Google
              </button>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="close-btn">
              Cancel
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="playlist-form">
        <input 
          type="text" 
          placeholder="Playlist Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          className="input"
        />
        <input 
          type="text" 
          placeholder="Creator" 
          value={creator} 
          onChange={(e) => setCreator(e.target.value)} 
          required 
          className="input"
        />
        <select 
          value={genre} 
          onChange={(e) => setGenre(e.target.value)}
          className="select"
        >
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
            <h2>{playlist.name}</h2>
            <p><strong>Creator:</strong> {playlist.creator}</p>
            <p><strong>Genre:</strong> {playlist.genre}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;