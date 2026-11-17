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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSong = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && songInput.trim() !== '') {
      e.preventDefault();
      const trimmedSong = songInput.trim();
      if (!songsArray.includes(trimmedSong)) {
        setSongsArray([...songsArray, trimmedSong]);
      }
      setSongInput('');
    }
  };

  const handleRemoveSong = (index: number) => {
    setSongsArray(songsArray.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !creator.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), creator: creator.trim(), genre, songs: songsArray });
      setName('');
      setCreator('');
      setGenre('jazz');
      setSongsArray([]);
      setSongInput('');
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="playlist-form">
      <div className="form-group">
        <label htmlFor="playlist-name" className="sr-only">
          Playlist Name
        </label>
        <input
          id="playlist-name"
          type="text"
          placeholder="Playlist Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="playlist-creator" className="sr-only">
          Creator
        </label>
        <input
          id="playlist-creator"
          type="text"
          placeholder="Creator"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          required
          className="input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="playlist-genre" className="sr-only">
          Genre
        </label>
        <CustomSelect options={genreOptions} value={genre} onChange={(val) => setGenre(val)} />
      </div>

      <div className="track-builder-container">
        <label htmlFor="song-input" className="sr-only">
          Add Song
        </label>
        <input
          id="song-input"
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
              <button
                type="button"
                onClick={() => handleRemoveSong(index)}
                className="chip-remove"
                aria-label={`Eliminar ${song}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={isSubmitting || !name.trim() || !creator.trim()}
      >
        {isSubmitting ? 'Creating...' : 'Create Playlist'}
      </button>
    </form>
  );
};
