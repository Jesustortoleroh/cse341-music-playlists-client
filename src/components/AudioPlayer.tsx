import { useEffect, useState } from 'react';

interface Props {
  song: string | null;
  onClose: () => void;
}

export const AudioPlayer = ({ song, onClose }: Props) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!song || !isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          clearInterval(interval);
          return 100;
        }

        return prev + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [song, isPlaying]);

  const isCurrentlyPlaying = isPlaying && progress < 100;

  const togglePlay = () => {
    if (!song) return;

    if (progress >= 100) {
      setProgress(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((prev) => !prev);
  };

  if (!song) return null;

  return (
    <div className="audio-player-floating">
      <div className="player-info">
        <span className="player-note">♪</span>
        <div>
          <div className="player-song-title">{song}</div>
          <div className="player-artist">Vibe Beat Collection</div>
        </div>
      </div>

      <div className="player-controls">
        <button
          className="player-btn"
          onClick={togglePlay}
          aria-label={isCurrentlyPlaying ? 'Pausar' : 'Reproducir'}
        >
          {isCurrentlyPlaying ? '⏸' : '▶'}
        </button>

        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <span className="player-time">0:{progress < 10 ? `0${progress}` : progress}</span>
      </div>

      <button className="player-btn close-player" onClick={onClose} aria-label="Cerrar reproductor">
        ✕
      </button>
    </div>
  );
};
