import { useState } from 'react';
import { CustomSelect } from './CustomSelect';

interface Props {
  onSubmit: (playlist: { name: string; creator: string; genre: string; songs: string[] }) => void;
}

const genreOptions = [
  { value: 'jazz', label: 'Jazz' },
  { value: 'rock', label: 'Rock' },
  { value: 'pop', label: 'Pop' },
  { value: 'classical', label: 'Classical' },
  { value: 'electronic', label: 'Electronic' },
  { value: 'hip-hop', label: 'Hip-Hop' },
  { value: 'reggae', label: 'Reggae' },
  { value: 'blues', label: 'Blues' },
  { value: 'folk', label: 'Folk' },
  { value: 'other', label: 'Other' }
];

export const PlaylistForm = ({ onSubmit }: Props) => {
  const [name, setName] = useState('');
  const [creator, setCreator] = useState('');
  const [genre, setGenre] = useState('jazz');
  const [songsArray, setSongsArray] = useState<string[]>([]);
  const [songInput, setSongInput] = useState('');

  const handleAddSong = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && songInput.trim() !== '') {
      e.preventDefault();
      if (!songsArray.includes(songInput.trim())) {
        setSongsArray([...songsArray, songInput.trim()]);
      }
      setSongInput('');
    }
  };

  const handleRemoveSong = (index: number) => {
    setSongsArray(songsArray.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, creator, genre, songs: songsArray });
    // Clear form
    setName(''); setCreator(''); setSongsArray([]); setSongInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="playlist-form">
      <input type="text" placeholder="Playlist Name" value={name} onChange={(e) => setName(e.target.value)} required className="input" />
      <input type="text" placeholder="Creator" value={creator} onChange={(e) => setCreator(e.target.value)} required className="input" />
      
      {/* Use CustomSelect instead of native select */}
      <CustomSelect 
        options={genreOptions} 
        value={genre} 
        onChange={(val) => setGenre(val)} 
      />

      <button type="submit" className="submit-btn">Create Playlist</button>

      <div className="track-builder-container">
        <input 
          type="text" 
          placeholder="Type a song and press Enter..." 
          value={songInput} 
          onChange={(e) => setSongInput(e.target.value)}
          onKeyDown={handleAddSong}
          className="input track-input" 
        />
        <div className="chips-container">
          {songsArray.map((song, index) => (
            <div key={index} className="song-chip">
              <span>♪ {song}</span>
              <button type="button" onClick={() => handleRemoveSong(index)} className="chip-remove">×</button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
};