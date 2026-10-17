import React, { useEffect, useRef } from 'react';

const HEARTS = ['💕', '💗', '💖', '💓', '💝', '❤️', '🌸', '✨'];
const SHAKE_THRESHOLD = 15;
const SHAKE_COOLDOWN = 1800;

const SendKiss = ({ recipientName = "Doctor Saheba" }) => {
  const lastKissTimeRef = useRef(0);
  const lastCoordsRef = useRef({ x: null, y: null, z: null });

  const triggerKiss = (cx, cy) => {
    const now = Date.now();
    if (now - lastKissTimeRef.current < SHAKE_COOLDOWN) return;
    lastKissTimeRef.current = now;

    const x = cx != null ? `${cx}px` : `${25 + Math.random() * 50}vw`;
    const y = cy != null ? `${cy}px` : `${20 + Math.random() * 40}vh`;

    // 1. Giant Kiss Emoji
    const kissEl = document.createElement('div');
    kissEl.className = 'shake-kiss-emoji';
    kissEl.innerHTML = '😘';
    kissEl.style.left = x;
    kissEl.style.top = y;
    document.body.appendChild(kissEl);
    setTimeout(() => kissEl.remove(), 1500);

    // 2. Radiating Ripple Ring
    const ripple = document.createElement('div');
    ripple.className = 'shake-ripple';
    ripple.style.cssText = `left:${x};top:${y};width:80px;height:80px;`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 950);

    // 3. Radial Heart Burst
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * 360 + Math.random() * 20;
      const distance = 70 + Math.random() * 90;
      const tx = Math.cos((angle * Math.PI) / 180) * distance;
      const ty = Math.sin((angle * Math.PI) / 180) * distance;

      const heart = document.createElement('div');
      heart.className = 'shake-burst-heart';
      heart.innerHTML = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      heart.style.cssText = `left:${x};top:${y};--tx:${tx}px;--ty:${ty}px;`;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1200);
    }

    // 4. Toast notification
    const toast = document.createElement('div');
    toast.className = 'shake-toast';
    toast.innerHTML = `💋 Love & Hug Sent to ${recipientName}! 🤗❤️`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2300);

    // 5. Confetti mini blast
    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.8 }
      });
    }
  };

  useEffect(() => {
    // Keyboard 'K' listener
    const handleKeyDown = (e) => {
      if (e.key === 'k' || e.key === 'K') {
        triggerKiss(null, null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Device motion (shake) listener
    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const { x, y, z } = acc;
      const last = lastCoordsRef.current;
      if (last.x === null) {
        lastCoordsRef.current = { x, y, z };
        return;
      }
      const delta = Math.abs(x - last.x) + Math.abs(y - last.y) + Math.abs(z - last.z);
      lastCoordsRef.current = { x, y, z };

      if (delta > SHAKE_THRESHOLD) {
        triggerKiss(null, null);
      }
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [recipientName]);

  return (
    <button
      className="shake-fab"
      onClick={(e) => {
        e.stopPropagation();
        triggerKiss(window.innerWidth / 2, window.innerHeight * 0.45);
      }}
      title="Send a Kiss! 💋 (or press 'K' on your keyboard)"
      aria-label="Send a kiss"
    >
      💋
    </button>
  );
};

export default SendKiss;
