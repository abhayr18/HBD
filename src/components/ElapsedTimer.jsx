import React, { useState, useEffect } from 'react';

const MODES = [
  {
    id: 'birth',
    label: '🎂 Born 18 Oct 2006',
    tag: "✨ Time You've Blessed This Earth ✨",
    date: '2006-10-18T00:00:00'
  },
  {
    id: 'friendship',
    label: '🫂 7 Years of Us',
    tag: '✨ 7 Years of Friendship & Memories ✨',
    date: '2019-05-13T18:13:00'
  }
];

const ElapsedTimer = ({ 
  birthDate = "2006-10-18T00:00:00", 
  friendshipDate = "2019-05-13T18:13:00",
  defaultMode = "birth"
}) => {
  const [activeMode, setActiveMode] = useState(defaultMode);
  const [time, setTime] = useState({ days: 0, hours: "00", minutes: "00", seconds: "00" });

  const currentConfig = activeMode === 'birth' 
    ? { ...MODES[0], date: birthDate } 
    : { ...MODES[1], date: friendshipDate };

  useEffect(() => {
    const target = new Date(currentConfig.date).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, now - target) / 1000;

      const days = Math.floor(diff / (3600 * 24));
      const hours = Math.floor((diff % (3600 * 24)) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = Math.floor(diff % 60);

      setTime({
        days,
        hours: hours < 10 ? `0${hours}` : `${hours}`,
        minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
        seconds: seconds < 10 ? `0${seconds}` : `${seconds}`
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [currentConfig.date]);

  return (
    <div className="elapsed-timer-container my-3 px-4 py-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-pink-300/30 inline-flex flex-col items-center shadow-lg transition-all">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 mb-2 bg-black/30 p-1 rounded-full border border-pink-400/20 text-xs">
        <button
          type="button"
          onClick={() => setActiveMode('birth')}
          className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
            activeMode === 'birth'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
              : 'text-pink-200/70 hover:text-white'
          }`}
        >
          🎂 Born 18 Oct 2006
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('friendship')}
          className={`px-3 py-1 rounded-full font-medium transition-all cursor-pointer ${
            activeMode === 'friendship'
              ? 'bg-gradient-to-r from-amber-500 to-rose-400 text-white shadow-sm'
              : 'text-pink-200/70 hover:text-white'
          }`}
        >
          🫂 7 Years of Us
        </button>
      </div>

      <div className="text-[11px] md:text-xs uppercase tracking-widest text-pink-300 font-medium mb-1">
        {currentConfig.tag}
      </div>

      <div className="text-sm md:text-base text-white/95 flex items-center gap-1.5 flex-wrap justify-center">
        <span className="text-amber-300 font-bold text-lg md:text-xl drop-shadow" style={{ fontFamily: 'digit, monospace' }}>
          {time.days.toLocaleString()}
        </span>
        <span className="text-xs text-pink-200">days</span>
        <span className="text-amber-300 font-bold text-lg md:text-xl drop-shadow" style={{ fontFamily: 'digit, monospace' }}>
          {time.hours}
        </span>
        <span className="text-xs text-pink-200">hrs</span>
        <span className="text-amber-300 font-bold text-lg md:text-xl drop-shadow" style={{ fontFamily: 'digit, monospace' }}>
          {time.minutes}
        </span>
        <span className="text-xs text-pink-200">min</span>
        <span className="text-amber-300 font-bold text-lg md:text-xl drop-shadow" style={{ fontFamily: 'digit, monospace' }}>
          {time.seconds}
        </span>
        <span className="text-xs text-pink-200">sec</span>
      </div>
    </div>
  );
};

export default ElapsedTimer;
