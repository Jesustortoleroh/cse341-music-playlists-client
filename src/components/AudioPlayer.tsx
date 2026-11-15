import { useEffect, useState } from 'react';

interface Props {
  song: string | null;
  onClose: () => void;
}

export const AudioPlayer = ({ song, onClose }: Props) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!song) {
      return;
    }

    // ✅ Usamos una variable local para el intervalo
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // En lugar de setIsPlaying(false) aquí (lo cual puede ser síncrono),
          // lo hacemos asíncronamente o al final del intervalo.
          return 100;
        }
        return prev + 1;
      });
    }, 500);

    return () => {
      clearInterval(interval);
      // Al desmontar o cambiar de canción, reseteamos el progreso
      setProgress(0);
    };
  }, [song]);

  // ✅ Controlamos si está reproduciendo basándonos en el progreso
  const isCurrentlyPlaying = isPlaying && progress < 100;

  const togglePlay = () => {
    if (progress >= 100) {
      setProgress(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
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
