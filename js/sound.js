let audioCtx = null;
let enabled = true;

export function initSound() {
  const saved = localStorage.getItem('scratch-sound');
  if (saved === 'off') enabled = false;

  const btn = document.getElementById('sound-toggle');
  btn.textContent = enabled ? '🔊' : '🔇';
  btn.addEventListener('click', () => {
    enabled = !enabled;
    btn.textContent = enabled ? '🔊' : '🔇';
    localStorage.setItem('scratch-sound', enabled ? 'on' : 'off');
  });
}

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

export function playSound(type) {
  if (!enabled) return;
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();

    if (type === 'win') {
      [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.4);
      });
    } else if (type === 'lose') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch (e) { /* Audio not supported */ }
}
