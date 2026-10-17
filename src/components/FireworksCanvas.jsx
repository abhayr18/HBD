import React, { useEffect, useRef } from 'react';

const FireworksCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let timeoutId;
    const fireworks = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor(x, y, color, velocity, size = Math.random() * 3 + 1, gravity = 0.1) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.velocity = velocity;
        this.color = color;
        this.alpha = 1;
        this.gravity = gravity;
        this.resistance = 0.98;
        this.fade = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.velocity.x *= this.resistance;
        this.velocity.y *= this.resistance;
        this.velocity.y += this.gravity;

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.fade;
        this.size *= 0.97;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    class Firework {
      constructor(customX, customColor) {
        this.x = customX !== undefined ? customX : Math.random() * canvas.width;
        this.y = canvas.height;
        this.radius = 3;
        this.velocity = {
          x: (Math.random() - 0.5) * 2,
          y: -(Math.random() * 5 + 11)
        };
        this.alpha = 1;
        this.customColor = customColor;
        this.color = customColor || `hsl(${Math.random() * 360}, 100%, 70%)`;
        this.particles = [];
        this.exploded = false;
      }

      update() {
        if (!this.exploded) {
          this.velocity.y += 0.1;
          this.x += this.velocity.x;
          this.y += this.velocity.y;

          if (this.y < canvas.height * 0.25 + Math.random() * 120 || this.velocity.y >= -1) {
            this.explode();
          }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          if (p.alpha <= 0) {
            this.particles.splice(i, 1);
          } else {
            p.update();
          }
        }

        this.alpha -= 0.01;
      }

      explode() {
        this.exploded = true;
        const baseHue = Math.random() * 360;
        const particleCount = 100 + Math.floor(Math.random() * 50);

        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2) * (i / particleCount);
          const speed = Math.random() * 5 + 2;
          const particleColor = this.customColor || `hsla(${baseHue + (Math.random() * 20 - 10)}, 100%, 70%, 0.8)`;

          this.particles.push(
            new Particle(
              this.x,
              this.y,
              particleColor,
              {
                x: Math.cos(angle) * speed + (Math.random() - 0.5),
                y: Math.sin(angle) * speed + (Math.random() - 0.5)
              }
            )
          );
        }

        this.particles.push(new Particle(this.x, this.y, '#ffffff', { x: 0, y: 0 }, 6, 0.5));
      }

      draw() {
        if (!this.exploded) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }

        this.particles.forEach(p => p.draw());
      }
    }

    const launchRandomFirework = () => {
      // Keep ambient fireworks gentle and infrequent so as not to overwhelm the screen
      if (fireworks.length < 5) {
        fireworks.push(new Firework());
      }
      timeoutId = setTimeout(launchRandomFirework, Math.random() * 3000 + 2000);
    };

    // Global hook to launch a firework
    window.launchCustomFirework = (x, color) => {
      fireworks.push(new Firework(x, color));
    };

    timeoutId = setTimeout(launchRandomFirework, 2000);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        fw.update();
        fw.draw();
        if (fw.exploded && fw.particles.length === 0) {
          fireworks.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(timeoutId);
      window.removeEventListener('resize', resize);
      delete window.launchCustomFirework;
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      id="fireworks" 
      style={{ 
        position: 'fixed', 
        inset: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', 
        zIndex: 5 
      }} 
    />
  );
};

export default FireworksCanvas;
