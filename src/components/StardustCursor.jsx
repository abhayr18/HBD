import React, { useEffect, useRef } from 'react';

const StardustCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    const particles = [];
    const colors = [
      'rgba(255, 215, 0, ',    // Gold
      'rgba(255, 105, 180, ',  // Hot Pink
      'rgba(255, 182, 193, ',  // Light Rose
      'rgba(255, 255, 255, '   // Starlight White
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const spawnStardust = (x, y) => {
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 1.2,
          vy: Math.random() * 1.5 + 0.6,
          size: Math.random() * 3 + 1.5,
          colorPrefix: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          fade: Math.random() * 0.03 + 0.02,
          isHeart: Math.random() > 0.8
        });
      }
    };

    const handleMouseMove = (e) => {
      spawnStardust(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        spawnStardust(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches.length > 0) {
        spawnStardust(e.touches[0].clientX, e.touches[0].clientY);
        spawnStardust(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.fade;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.colorPrefix + p.alpha + ')';

        if (p.isHeart) {
          const s = p.size * 1.4;
          ctx.beginPath();
          ctx.arc(p.x - s / 2, p.y - s / 2, s / 2, Math.PI, 0, false);
          ctx.arc(p.x + s / 2, p.y - s / 2, s / 2, Math.PI, 0, false);
          ctx.lineTo(p.x, p.y + s);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.shadowColor = p.colorPrefix + '0.8)';
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return <canvas ref={canvasRef} id="stardustCanvas" />;
};

export default StardustCursor;
