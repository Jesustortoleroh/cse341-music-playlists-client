import { useState, useEffect } from 'react';

interface Props {
  song: string | null;
  onClose: () => void;
}

export const AudioPlayer = ({ song, onClose }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reset player when a new song is selected
  useEffect(() => {
    if (!song) return;

    const resetTimer = setTimeout(() => {
      setIsPlaying(true);
      setProgress(0);
    }, 0);

    return () => clearTimeout(resetTimer);
  }, [song]);

  // Simulate progress bar
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = Math.min(prev + 1, 100);

        if (nextProgress >= 100) {
          setIsPlaying(false);
        }

        return nextProgress;
      });
    }, 500); // Simulates 50 seconds total duration (100 * 500ms)

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!song) return null;

  return (
    <div className="audio-player-floating">
      <div className="player-info">
        <span className="player-note">♪</span>
        <div>
          <p className="player-song-title">{song}</p>
          <p className="player-artist">VibeBeat Simulated Audio</p>
        </div>
      </div>

      <div className="player-controls">
        <button 
          className="player-btn play-pause" 
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <span className="player-time">{Math.floor(progress / 20)}:{(progress % 20 * 3).toString().padStart(2, '0')}</span>
      </div>

      <button className="player-btn close-player" onClick={onClose}>
        ✕
      </button>
    </div>
  );
};