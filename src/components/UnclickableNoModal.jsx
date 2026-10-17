import React, { useState } from 'react';

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

const UnclickableNoModal = ({ isOpen, onClose, recipientName = "Doctor Saheba" }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [saidYes, setSaidYes] = useState(false);

  const handleNoClick = (e) => {
    e.stopPropagation();
    setMsgIndex((prev) => (prev + 1) % guiltTripMessages.length);
    setYesScale((prev) => Math.min(prev * 1.25, 2.5));
  };

  const handleYesClick = (e) => {
    e.stopPropagation();
    setSaidYes(true);

    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 150,
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

  const handleClose = () => {
    handleReset();
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="unclickable-modal-backdrop active" onClick={handleClose}>
      <div className="unclickable-card" onClick={(e) => e.stopPropagation()}>
        <button className="unclickable-close-btn" onClick={handleClose} aria-label="Close">
          &times;
        </button>

        {!saidYes ? (
          <>
            <h1 className="unclickable-title">Hey Birthday Girl {recipientName}!! 🎂💖</h1>
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
              <button className="capsule-btn secondary" onClick={handleClose}>
                🌸 Return to Celebration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnclickableNoModal;
