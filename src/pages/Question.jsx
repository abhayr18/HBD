import React, { useState } from 'react';
import { Link } from 'react-router';

const guiltTripMessages = [
  "No",
  "Are you sure? 🥺",
  "Really sure??",
  "Doctor Saheba please... 🥹",
  "Don't do this to me :(",
  "I will bring you your favorite snacks! 🍫",
  "Who will have 2 AM stupid talks with me?! 😂",
  "I'll always listen to your medical rants! 🩺",
  "If you say no, I'm gonna be so sad...",
  "7 years of friendship down the drain?! 😭",
  "My heart is breaking... 💔",
  "Pretty please with sprinkles on top? 🍒",
  "Ok fine, I will stop asking...",
  "Just kidding, SAY YES DOCTOR SAHEBA! 🫂❤️"
];

const Question = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [saidYes, setSaidYes] = useState(false);

  const handleNoClick = () => {
    setMsgIndex((prev) => (prev + 1) % guiltTripMessages.length);
    setYesScale((prev) => Math.min(prev * 1.25, 2.5));
  };

  const handleYesClick = () => {
    setSaidYes(true);

    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
    if (typeof window.launchCustomFirework === 'function') {
      window.launchCustomFirework(window.innerWidth * 0.35, 'hsl(330, 100%, 70%)');
      window.launchCustomFirework(window.innerWidth * 0.65, 'hsl(45, 100%, 65%)');
    }
  };

  const handleReset = () => {
    setSaidYes(false);
    setMsgIndex(0);
    setYesScale(1);
  };

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{
        backgroundColor: '#fffaf0',
        backgroundImage: `
          radial-gradient(circle, rgba(255, 105, 180, 0.08) 1px, transparent 1px),
          radial-gradient(circle, rgba(255, 193, 204, 0.12) 2px, transparent 2px)
        `,
        backgroundSize: '24px 24px, 48px 48px',
        backgroundPosition: '0 0, 12px 12px'
      }}
    >
      <div className="unclickable-card" style={{ transform: 'rotate(-1deg)' }}>
        <Link
          to="/"
          className="unclickable-close-btn"
          title="Back to Birthday celebration"
          aria-label="Back"
        >
          &times;
        </Link>

        {!saidYes ? (
          <>
            <h1 className="unclickable-title">Hey Birthday Girl Doctor Saheba!! 🎂💖</h1>
            <h2 className="unclickable-subtitle">Will you stay my best friend & comfort person for all birthdays to come? 🫂❤️</h2>

            <div className="unclickable-buttons">
              <button
                className="unclickable-yes-btn"
                onClick={handleYesClick}
                style={{
                  transform: `scale(${yesScale})`,
                  zIndex: 20
                }}
              >
                Yes ❤️
              </button>

              <button className="unclickable-no-btn" onClick={handleNoClick}>
                {guiltTripMessages[msgIndex]}
              </button>
            </div>

            <div className="unclickable-gif-box">
              <img src="/waiting.webp" alt="Waiting for your answer" fetchPriority="high" />
            </div>
          </>
        ) : (
          <div className="celebration-view">
            <h1 className="celebration-headline">Yay! You made my day! 🥰🫂</h1>
            <h2 className="celebration-subtext">Hehe knew you would say YES! ;)</h2>

            <div className="unclickable-gif-box">
              <img src="/yes.webp" alt="Celebration Yes" fetchPriority="high" />
            </div>

            <p className="font-dancingScript text-2xl text-pink-600 mt-4 font-bold">
              Happy Birthday Doctor Saheba! I wish our friendship will stay ♾️! Yours forever, Om 🎂🫂❤️
            </p>

            <div className="mt-5 flex gap-3 justify-center">
              <button className="capsule-btn primary" onClick={handleReset}>
                ✨ Ask Me Again
              </button>
              <Link to="/" className="capsule-btn secondary">
                🌸 Back to Celebration
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Question;
