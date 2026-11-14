import { useState } from 'react';

interface Props {
  onSubmit: (playlist: { name: string; creator: string; genre: string; songs: string[] }) => void;
}

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
      <select value={genre} onChange={(e) => setGenre(e.target.value)} className="select">
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