import { useState } from 'react';
import type { Playlist } from '../types';

interface Props {
  playlist: Playlist;
  isLoggedIn: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedData: Partial<Playlist>) => void;
}

export const PlaylistCard = ({ playlist, isLoggedIn, onDelete, onUpdate }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playlist.name);
  const [editCreator, setEditCreator] = useState(playlist.creator);
  const [editGenre, setEditGenre] = useState(playlist.genre);
  const [editSongsArray, setEditSongsArray] = useState<string[]>(playlist.songs || []);
  const [editSongInput, setEditSongInput] = useState('');

  const handleAddEditSong = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editSongInput.trim() !== '') {
      e.preventDefault();
      if (!editSongsArray.includes(editSongInput.trim())) {
        setEditSongsArray([...editSongsArray, editSongInput.trim()]);
      }
      setEditSongInput('');
    }
  };

  const handleRemoveEditSong = (index: number) => {
    setEditSongsArray(editSongsArray.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(playlist._id, { name: editName, creator: editCreator, genre: editGenre, songs: editSongsArray });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="playlist-card">
        <form onSubmit={handleSave} className="edit-form">
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required className="input" />
          <input type="text" value={editCreator} onChange={(e) => setEditCreator(e.target.value)} required className="input" />
          <select value={editGenre} onChange={(e) => setEditGenre(e.target.value)} className="select">
            <option value="jazz">Jazz</option>
            <option value="rock">Rock</option>
            <option value="pop">Pop</option>
            <option value="classical">Classical</option>
            <option value="electronic">Electronic</option>
            <option value="hip-hop">Hip-Hop</option>
            <option value="reggae">Reggae</option>
            <option value="blues">Blues</option>
            <option value="folk">Folk</option>
            <option value="other">Other</option>
          </select>
          
          <input 
            type="text" 
            placeholder="Type song and press Enter..." 
            value={editSongInput} 
            onChange={(e) => setEditSongInput(e.target.value)}
            onKeyDown={handleAddEditSong}
            className="input track-input" 
          />
          <div className="chips-container">
            {editSongsArray.map((song, index) => (
              <div key={index} className="song-chip">
                <span>♪ {song}</span>
                <button type="button" onClick={() => handleRemoveEditSong(index)} className="chip-remove">×</button>
              </div>
            ))}
          </div>

          <div className="edit-actions">
            <button type="submit" className="submit-btn">Save</button>
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
              <li key={i}>{song}</li>
            ))}
          </ul>
        </div>
      )}
      {isLoggedIn && (
        <div className="card-actions">
          <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
          <button onClick={() => onDelete(playlist._id)} className="delete-btn">Delete</button>
        </div>
      )}
    </div>
  );
};