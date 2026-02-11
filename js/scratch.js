import { t } from './i18n.js';

let canvasCtx = null;
let isScratching = false;
let lastPoint = null;
let onReveal = null;
let revealed = false;

export function initScratchListeners(canvas, revealCallback) {
  onReveal = revealCallback;

  // Mouse events
  canvas.addEventListener('mousedown', e => {
    if (revealed) return;
    isScratching = true;
    lastPoint = getCoords(e, canvas);
    scratch(lastPoint.x, lastPoint.y);
  });
  canvas.addEventListener('mousemove', e => {
    if (!isScratching || revealed) return;
    const pt = getCoords(e, canvas);
    scratchLine(lastPoint, pt);
    lastPoint = pt;
  });
  canvas.addEventListener('mouseup', () => {
    isScratching = false;
    lastPoint = null;
    checkReveal(canvas);
  });
  canvas.addEventListener('mouseleave', () => {
    if (isScratching) {
      isScratching = false;
      lastPoint = null;
      checkReveal(canvas);
    }
  });

  // Touch events
  canvas.addEventListener('touchstart', e => {
    if (revealed) return;
    e.preventDefault();
    isScratching = true;
    lastPoint = getTouchCoords(e, canvas);
    scratch(lastPoint.x, lastPoint.y);
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    if (!isScratching || revealed) return;
    e.preventDefault();
    const pt = getTouchCoords(e, canvas);
    scratchLine(lastPoint, pt);
    lastPoint = pt;
  }, { passive: false });
  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    isScratching = false;
    lastPoint = null;
    checkReveal(canvas);
  }, { passive: false });
}

export function resetCanvas(canvas, grid) {
  revealed = false;
  isScratching = false;
  lastPoint = null;

  canvas.style.opacity = '1';
  canvas.style.pointerEvents = 'auto';

  const dpr = window.devicePixelRatio || 1;
  const rect = grid.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';

  canvasCtx = canvas.getContext('2d', { willReadFrequently: true });
  canvasCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

  drawCoating(rect.width, rect.height);
}

function drawCoating(w, h) {
  const ctx = canvasCtx;
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#C0C0C0');
  grad.addColorStop(0.25, '#D8D8D8');
  grad.addColorStop(0.5, '#ABABAB');
  grad.addColorStop(0.75, '#D0D0D0');
  grad.addColorStop(1, '#B0B0B0');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // NT$ pattern
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.font = '11px sans-serif';
  for (let x = 8; x < w; x += 50) {
    for (let y = 16; y < h; y += 35) {
      ctx.fillText('NT$', x, y);
    }
  }

  // Center hint text
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.font = 'bold 15px "Noto Sans TC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(t('scratchHere'), w / 2, h / 2 - 10);
  ctx.font = '12px sans-serif';
  ctx.fillText('👆 👆 👆', w / 2, h / 2 + 12);
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
}

function getCoords(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function getTouchCoords(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0] || e.changedTouches[0];
  return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
}

function scratch(x, y) {
  canvasCtx.globalCompositeOperation = 'destination-out';
  canvasCtx.beginPath();
  canvasCtx.arc(x, y, 24, 0, Math.PI * 2);
  canvasCtx.fill();
  canvasCtx.globalCompositeOperation = 'source-over';
}

function scratchLine(from, to) {
  canvasCtx.globalCompositeOperation = 'destination-out';
  canvasCtx.lineWidth = 48;
  canvasCtx.lineCap = 'round';
  canvasCtx.lineJoin = 'round';
  canvasCtx.beginPath();
  canvasCtx.moveTo(from.x, from.y);
  canvasCtx.lineTo(to.x, to.y);
  canvasCtx.stroke();
  canvasCtx.globalCompositeOperation = 'source-over';
}

function checkReveal(canvas) {
  if (revealed) return;
  const imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  let transparent = 0;
  // Sample every 8th pixel for performance
  for (let i = 3; i < pixels.length; i += 32) {
    if (pixels[i] === 0) transparent++;
  }
  const sampled = (pixels.length / 4) / 8;
  if (transparent / sampled >= 0.55) {
    revealed = true;
    canvas.style.opacity = '0';
    canvas.style.pointerEvents = 'none';
    if (onReveal) setTimeout(onReveal, 500);
  }
}
