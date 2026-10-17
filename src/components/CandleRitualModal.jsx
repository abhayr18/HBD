import React, { useState, useEffect, useRef } from 'react';

const CandleRitualModal = ({ recipientName = "Doctor Saheba", senderName = "Om" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  const [isWishGranted, setIsWishGranted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [micMeterWidth, setMicMeterWidth] = useState(0);

  const audioCtxRef = useRef(null);
  const micStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animFrameRef = useRef(null);
  const smokeCanvasRef = useRef(null);
  const smokeParticlesRef = useRef([]);
  const flamesRef = useRef([null, null, null]);
  const blowStreakRef = useRef(0);

  // Audio Context (pure Web Audio API)
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Breath / Air puff sound
  const playPuffSound = () => {
    try {
      const ctx = getAudioContext();
      const duration = 0.35;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch (e) {
      console.warn('Audio puff failed:', e);
    }
  };

  // Crystal celebration arpeggio
  const playCelebrationChimes = () => {
    try {
      const ctx = getAudioContext();
      const freqs = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98, 2093.00];

      freqs.forEach((freq, index) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          const overtone = ctx.createOscillator();
          const overtoneGain = ctx.createGain();
          overtone.type = 'triangle';
          overtone.frequency.setValueAtTime(freq * 2, ctx.currentTime);
          overtoneGain.gain.setValueAtTime(0.04, ctx.currentTime);
          overtoneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
          overtone.connect(overtoneGain);
          overtoneGain.connect(ctx.destination);

          gain.gain.setValueAtTime(0.22, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          overtone.start();
          osc.stop(ctx.currentTime + 2.2);
          overtone.stop(ctx.currentTime + 1.2);
        }, index * 95);
      });
    } catch (e) {
      console.warn('Celebration chimes failed:', e);
    }
  };

  // Smoke Canvas Loop
  useEffect(() => {
    const canvas = smokeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let smokeId;
    const renderSmoke = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = smokeParticlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx + Math.sin(p.curlAngle) * 0.4;
        p.y += p.vy;
        p.curlAngle += p.curl;
        p.radius = Math.min(p.maxRadius, p.radius + 0.35);
        p.alpha -= p.fade;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 220, 225, ${p.alpha * 0.45})`;
        ctx.fill();
        ctx.restore();
      }

      smokeId = requestAnimationFrame(renderSmoke);
    };

    smokeId = requestAnimationFrame(renderSmoke);

    return () => {
      cancelAnimationFrame(smokeId);
    };
  }, [isOpen]);

  const spawnSmokeBurst = () => {
    const wickXCoords = [118, 180, 242];
    const wickY = 175;

    wickXCoords.forEach((x) => {
      for (let i = 0; i < 35; i++) {
        smokeParticlesRef.current.push({
          x: x + (Math.random() - 0.5) * 4,
          y: wickY,
          vx: (Math.random() - 0.5) * 1.6,
          vy: -(Math.random() * 2.2 + 1.2),
          radius: Math.random() * 3 + 2,
          maxRadius: Math.random() * 18 + 14,
          alpha: 0.75,
          fade: Math.random() * 0.015 + 0.008,
          curl: (Math.random() - 0.5) * 0.06,
          curlAngle: Math.random() * Math.PI * 2
        });
      }
    });
  };

  const stopMicrophone = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsListening(false);
    setMicMeterWidth(0);
  };

  const toggleMicrophone = async () => {
    if (isListening) {
      stopMicrophone();
      return;
    }

    try {
      getAudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;

      const ctx = audioCtxRef.current;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.2;
      source.connect(analyser);

      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      setIsListening(true);
      monitorBlow();
    } catch (err) {
      console.warn('Microphone access denied:', err);
      alert('Microphone access was denied. You can tap the "Tap to Blow" button or click on the cake!');
    }
  };

  const monitorBlow = () => {
    if (!analyserRef.current || isBlownOut) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const data = dataArrayRef.current;

    let lowFreqSum = 0;
    const lowBins = 14;
    for (let i = 0; i < lowBins; i++) {
      lowFreqSum += data[i];
    }
    const lowAvg = lowFreqSum / lowBins;

    let totalSum = 0;
    for (let i = 0; i < data.length; i++) {
      totalSum += data[i];
    }
    const overallAvg = totalSum / data.length;

    const blowMetric = lowAvg * 0.7 + overallAvg * 0.3;
    const meterPercent = Math.min(100, Math.max(0, (blowMetric - 20) * 1.8));
    setMicMeterWidth(meterPercent);

    // Flame skew & jitter physics
    if (blowMetric > 30) {
      const intensity = Math.min(1, (blowMetric - 30) / 60);
      const leanAngle = intensity * 45 * (Math.random() > 0.5 ? 1 : 0.85);
      const scaleX = 1 - intensity * 0.4;
      const scaleY = 1 - intensity * 0.5;

      flamesRef.current.forEach((flame) => {
        if (flame) {
          const jitter = (Math.random() - 0.5) * 8 * intensity;
          flame.style.transform = `translateX(-50%) rotate(${leanAngle + jitter}deg) skewX(${leanAngle * 0.6}deg) scale(${scaleX}, ${scaleY})`;
        }
      });

      if (blowMetric > 55) {
        blowStreakRef.current++;
        if (blowStreakRef.current >= 7) {
          triggerBlowOut();
          return;
        }
      } else {
        blowStreakRef.current = Math.max(0, blowStreakRef.current - 1);
      }
    } else {
      blowStreakRef.current = 0;
      flamesRef.current.forEach((flame) => {
        if (flame) flame.style.transform = '';
      });
    }

    animFrameRef.current = requestAnimationFrame(monitorBlow);
  };

  const triggerBlowOut = () => {
    if (isBlownOut) return;
    setIsBlownOut(true);
    stopMicrophone();

    playPuffSound();
    spawnSmokeBurst();

    setTimeout(() => {
      setIsBlackout(true);

      setTimeout(() => {
        setIsBlackout(false);
        setIsOpen(false);

        playCelebrationChimes();

        if (typeof window.confetti === 'function') {
          window.confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 }
          });
        }
        if (typeof window.launchCustomFirework === 'function') {
          window.launchCustomFirework(window.innerWidth * 0.3, 'hsl(45, 100%, 65%)');
          window.launchCustomFirework(window.innerWidth * 0.7, 'hsl(335, 100%, 70%)');
        }

        setTimeout(() => {
          setIsWishGranted(true);
        }, 800);
      }, 1200);
    }, 600);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    setIsBlownOut(false);
    setIsWishGranted(false);
    smokeParticlesRef.current = [];
    getAudioContext();
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    stopMicrophone();
  };

  const resetCandles = () => {
    setIsWishGranted(false);
    setIsOpen(true);
    setIsBlownOut(false);
    smokeParticlesRef.current = [];
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <div 
        className="ritual-trigger-pill"
        onClick={handleOpenModal}
        title="Make a Birthday Wish"
      >
        <span className="pill-sparkle">✨</span>
        <span>Make a Wish, {recipientName} 🎂</span>
      </div>

      {/* Dramatic Blackout Curtain */}
      <div className={`blackout-curtain ${isBlackout ? 'blackout-active' : ''}`} />

      {/* Candle Ritual Modal */}
      <div className={`cake-modal-backdrop ${isOpen ? 'active' : ''}`}>
        <button 
          className="modal-close-btn" 
          onClick={handleCloseModal}
          title="Close"
        >
          &times;
        </button>

        <div className="ritual-header">
          <div className="ritual-subtitle">// SPECIAL BIRTHDAY RITUAL</div>
          <h1 className="ritual-title">Make a Birthday Wish, {recipientName} 🎂✨</h1>
          <p className="ritual-instructions">
            Blow into your microphone or tap the candles 🎂
          </p>

          <div className="control-pill-group">
            <button 
              className={`mic-toggle-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleMicrophone}
            >
              <span>{isListening ? '🎙️ Listening for your blow...' : '🎙️ Enable Mic to Blow'}</span>
            </button>

            <div className={`mic-meter-wrapper ${isListening ? 'visible' : ''}`}>
              <div 
                className="mic-meter-fill" 
                style={{ width: `${micMeterWidth}%` }} 
              />
            </div>

            <button 
              className="tap-blow-btn"
              onClick={triggerBlowOut}
            >
              <span>💨 Tap to Blow</span>
            </button>
          </div>
        </div>

        {/* 3D Birthday Cake */}
        <div 
          className="cake-stage"
          onClick={() => {
            if (!isBlownOut) triggerBlowOut();
          }}
          title="Click to blow out candles!"
        >
          <canvas 
            ref={smokeCanvasRef} 
            id="smokeCanvas" 
            width={360} 
            height={220} 
          />

          <div className="candles-row">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="candle-unit" data-index={idx}>
                <div 
                  ref={(el) => (flamesRef.current[idx] = el)}
                  className={`flame-box ${isBlownOut ? 'extinguished' : ''}`}
                >
                  <div className="flame-glow" />
                  <div className="flame-body">
                    <div className="flame-inner-core" />
                  </div>
                </div>
                <div className="candle-wick" />
                <div className="candle-stick" />
              </div>
            ))}
          </div>

          <div className="cake-structure">
            <div className="cake-tier-top">
              <div className="frosting-drips" />
              <div className="cake-decor-hearts">
                <span>★</span><span>♥</span><span>★</span><span>♥</span>
              </div>
            </div>
            <div className="cake-tier-bottom">
              <div className="frosting-drips" />
              <div className="cake-decor-hearts">
                <span>♥</span><span>★</span><span>♥</span><span>★</span><span>♥</span>
              </div>
            </div>
            <div className="cake-plate" />
          </div>

          <div className="cake-tap-hint">
            ✨ Tip: Blow softly into your microphone or tap the cake!
          </div>
        </div>
      </div>

      {/* Wish Granted Modal */}
      <div className={`wish-reveal-backdrop ${isWishGranted ? 'active' : ''}`}>
        <div className="wish-card">
          <div className="wish-crown-icon">👑</div>
          <div className="wish-badge">✨ BIRTHDAY WISH GRANTED ✨</div>
          <h1 className="wish-headline">Happy Birthday & Endless Happiness, {recipientName}! 🎂❤️</h1>
          <p className="wish-message">
            "Happy Birthday, Doctor Saheba! 🎂🎉 On your special 18th of October, may every single wish in your heart unfold with grace and beauty this year.
            Seven years of friendship, endless laughter, and unconditional care—thank you for being my comfort person, my safe place, and my favorite soul in this world.
            I wish our friendship will stay ♾️. Have the happiest birthday ever! 🥳❤️"
          </p>
          <div className="wish-signature-block">
            <span className="wish-sign-lead">Yours forever on your special day,</span>
            <span className="wish-sign-author">{senderName} 🫂❤️</span>
          </div>
          <div className="wish-btn-row">
            <button 
              className="wish-action-btn secondary"
              onClick={resetCandles}
            >
              🎂 Make Another Wish
            </button>
            <button 
              className="wish-action-btn primary"
              onClick={() => setIsWishGranted(false)}
            >
              🌸 Return to Celebration
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandleRitualModal;
