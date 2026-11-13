import { useState, useEffect } from 'react';
import './App.css';

// Use environment variable for the API URL (fallback to localhost for development)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Define the Playlist type based on your backend model
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

  // Fetch playlists on load
  const fetchPlaylists = async () => {
    try {
      const response = await fetch(`${API_URL}/api/playlists`);
      const result = await response.json();
      return result.success ? (result.data as Playlist[]) : undefined;
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };

  useEffect(() => {
    let active = true;
    fetchPlaylists().then((data) => {
      if (active) {
        if (data) setPlaylists(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Create a new playlist
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // <-- IMPORTANT: Send cookies for OAuth
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

  if (loading) return <p>Loading playlists...</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🎵 Music Playlists</h1>
      
      {/* Form to create a playlist */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Playlist Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Creator" 
          value={creator} 
          onChange={(e) => setCreator(e.target.value)} 
          required 
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="jazz">Jazz</option>
          <option value="rock">Rock</option>
          <option value="pop">Pop</option>
          <option value="classical">Classical</option>
        </select>
        <button type="submit">Create Playlist</button>
      </form>

      {/* List of playlists */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {playlists.map((playlist) => (
          <div key={playlist._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
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