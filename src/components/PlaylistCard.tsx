import { useState } from 'react';
import type { Playlist } from '../types';
import { CustomSelect } from './CustomSelect';

interface Props {
  playlist: Playlist;
  isLoggedIn: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedData: Partial<Playlist>) => void;
  onPlay: (song: string) => void;
}

const genreOptions = [
  { value: 'Rock', label: 'Rock' },
  { value: 'Pop', label: 'Pop' },
  { value: 'Jazz', label: 'Jazz' },
  { value: 'Hip-Hop', label: 'Hip-Hop' },
  { value: 'Classical', label: 'Classical' },
  { value: 'Country', label: 'Country' },
];

export const PlaylistCard = ({ playlist, isLoggedIn, onDelete, onUpdate, onPlay }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [songsInput, setSongsInput] = useState('');
  const [formData, setFormData] = useState({
    name: playlist.name,
    creator: playlist.creator,
    genre: playlist.genre,
  });

  // Sincroniza el estado del formulario antes de abrir la edición
  const startEditing = () => {
    setFormData({
      name: playlist.name,
      creator: playlist.creator,
      genre: playlist.genre,
    });
    setSongsInput((playlist.songs || []).join(', '));
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Parseo, limpieza y deduplicación de canciones en un solo paso
    const songs = Array.from(
      new Set(
        songsInput
          .split(',')
          .map((song) => song.trim())
          .filter(Boolean)
      )
    );
    
    onUpdate(playlist._id, { ...formData, songs });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="playlist-card">
        <form onSubmit={handleSubmit} className="edit-playlist-form">
          <label htmlFor={`edit-name-${playlist._id}`}>
            Name:
            <input
              id={`edit-name-${playlist._id}`}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          <label htmlFor={`edit-creator-${playlist._id}`}>
            Creator:
            <input
              id={`edit-creator-${playlist._id}`}
              type="text"
              name="creator"
              value={formData.creator}
              onChange={handleChange}
              required
              className="input"
            />
          </label>
          
          {/* CustomSelect no lleva label htmlFor nativo, asumimos que maneja su accesibilidad internamente */}
          <CustomSelect
            options={genreOptions}
            value={formData.genre}
            onChange={(val) => setFormData((prev) => ({ ...prev, genre: val }))}
          />

          <label htmlFor={`edit-songs-${playlist._id}`}>
            Songs (separadas por coma):
            <input
              id={`edit-songs-${playlist._id}`}
              type="text"
              name="songs"
              value={songsInput}
              onChange={(e) => setSongsInput(e.target.value)}
              placeholder="Ej: Bohemian Rhapsody, Hotel California"
              className="input"
            />
          </label>
          <div className="card-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="playlist-card">
      <h2>{playlist.name}</h2>
      <p><strong>Creator:</strong> {playlist.creator}</p>
      <p><strong>Genre:</strong> {playlist.genre}</p>
      
      {playlist.songs && playlist.songs.length > 0 && (
        <div className="songs-list">
          <strong>Songs:</strong>
          <ul>
            {playlist.songs.map((song, i) => (
              // Usamos song + i por si hay nombres repetidos, aunque ya deduplicamos al guardar
              <li key={`${song}-${i}`}>
                <button
                  type="button"
                  className="play-song-btn"
                  onClick={() => onPlay(song)}
                  title={`Play ${song}`}
                  aria-label={`Reproducir ${song}`}
                >
                  ▶ {song}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isLoggedIn && (
        <div className="card-actions">
          <button onClick={startEditing} className="edit-btn">Edit</button>
          <button onClick={() => onDelete(playlist._id)} className="delete-btn">Delete</button>
        </div>
      )}
    </div>
  );
};