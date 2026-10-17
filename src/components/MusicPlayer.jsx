import React, { useState, useEffect, useRef } from 'react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.7;

    const startOnFirstInteraction = () => {
      if (audio && audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log('Audio autoplay prevented:', err);
        });
      }
      window.removeEventListener('click', startOnFirstInteraction);
      window.removeEventListener('touchstart', startOnFirstInteraction);
    };

    window.addEventListener('click', startOnFirstInteraction, { once: true });
    window.addEventListener('touchstart', startOnFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', startOnFirstInteraction);
      window.removeEventListener('touchstart', startOnFirstInteraction);
    };
  }, []);

  const togglePlay = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />
      <div 
        className="music-player-pill" 
        onClick={togglePlay} 
        title={isPlaying ? "Click to Pause Music" : "Click to Play Music"}
        role="button"
        tabIndex={0}
      >
        <div className={`player-disc ${isPlaying ? 'spinning' : ''}`}>
          <span className="disc-center-heart">❤️</span>
        </div>
        <div className="player-details">
          <span className="player-song-title">
            <span>7 Years of Us 🫂❤️</span>
          </span>
          <span className="player-subtitle">Doctor Saheba & Om • Forever ♾️</span>
        </div>
        <div className={`equalizer-bars ${isPlaying ? 'playing' : ''}`}>
          <div className="eq-bar"></div>
          <div className="eq-bar"></div>
          <div className="eq-bar"></div>
          <div className="eq-bar"></div>
        </div>
        <button 
          className="player-toggle-btn" 
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={togglePlay}
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
      </div>
    </>
  );
};

export default MusicPlayer;
