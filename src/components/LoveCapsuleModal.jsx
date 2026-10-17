import React, { useState } from 'react';

const reasonsList = [
  "Happy Birthday to the most amazing Doctor Saheba! 🎂🎉 May all your dreams come true.",
  "You came into my life as a friend, but somewhere along the way, you became so much more than that. 🫶🏻",
  "You became my comfort person, my safe place, and my biggest supporter in everything.",
  "Because you are my personal Doctor madam ❤️🩺 and always take the best care of me.",
  "Our countless stupid conversations that no one else in the world would ever understand 😂",
  "Seven whole years… honestly, I don't even know how to put these seven years into words 🥹❤️",
  "I don't know what I did to deserve someone like you, but I know how lucky I am to have you. 🫶🏻",
  "You are not just my best friend 🥰 — you are one of the most important persons in my life 🤗.",
  "Happiest Birthday dear Doctor Saheba 💞 I wish our friendship will stay ♾️.",
  "The quiet comfort and warmth in every conversation we have had since 2019.",
  "Because no matter how crazy life gets, your advice and presence are my calm.",
  "How genuine, kind-hearted, and wonderfully caring you have always been.",
  "Because loving our friendship is the easiest and most natural thing in the world.",
  "Thank you for being someone who truly feels like a part of me.",
  "Wishing you endless smiles, success, and good health on your special day! 🌸✨",
  "Happiest Birthday dear Sweetheart 🎂❣️🫶🏼 — Yours forever, Om 🫂❤️"
];

const LoveCapsuleModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentReason, setCurrentReason] = useState("");
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [pool, setPool] = useState([...reasonsList]);
  const [isFading, setIsFading] = useState(false);

  const drawReason = () => {
    let currentPool = pool;
    if (currentPool.length === 0) {
      currentPool = [...reasonsList];
    }
    const randIdx = Math.floor(Math.random() * currentPool.length);
    const selected = currentPool[randIdx];
    const newPool = currentPool.filter((_, idx) => idx !== randIdx);
    
    setPool(newPool);
    setIsFading(true);

    setTimeout(() => {
      setCurrentReason(selected);
      setUnlockedCount(prev => prev + 1);
      setIsFading(false);
    }, 200);

    // Trigger celebratory confetti / firework if available
    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
    if (typeof window.launchCustomFirework === 'function') {
      const randColor = Math.random() > 0.5 ? 'hsl(45, 100%, 65%)' : 'hsl(335, 100%, 70%)';
      window.launchCustomFirework(window.innerWidth * (0.3 + Math.random() * 0.4), randColor);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!currentReason) {
      drawReason();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className="capsule-trigger-btn"
        id="capsuleTriggerBtn"
        onClick={handleOpen}
        title="Open sweet birthday memories"
      >
        <span>🎂</span>
        <span>Birthday Memories ✨</span>
      </button>

      <div 
        className={`capsule-backdrop ${isOpen ? 'active' : ''}`}
        id="capsuleBackdrop"
        onClick={handleClose}
      >
        <div 
          className="capsule-card"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="modal-close-btn" 
            id="capsuleCloseBtn"
            onClick={handleClose}
            aria-label="Close"
          >
            &times;
          </button>
          
          <div className="capsule-tag">// HAPPY BIRTHDAY • DOCTOR SAHEBA 🎂❤️</div>
          <h2 className="capsule-title">Birthday Wishes & Memories 🎂🫂</h2>
          
          <div className="capsule-note-display">
            <p 
              className="capsule-note-text"
              id="capsuleNoteText"
              style={{ opacity: isFading ? 0 : 1 }}
            >
              "{currentReason || "Tap below to reveal a sweet birthday wish and memory written from my heart to yours..."}"
            </p>
            <span className="capsule-count-badge" id="capsuleCountBadge">
              Birthday memories unlocked: {unlockedCount} / {reasonsList.length} ✨
            </span>
          </div>

          <div className="capsule-action-row">
            <button 
              className="capsule-btn primary" 
              id="drawReasonBtn"
              onClick={drawReason}
            >
              ✨ Pick Another Note
            </button>
            <button 
              className="capsule-btn secondary" 
              id="closeCapsuleActionBtn"
              onClick={handleClose}
            >
              🌸 Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoveCapsuleModal;
