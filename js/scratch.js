import { t } from './i18n.js';

export class ScratchCard {
  constructor(canvas, onReveal) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    this.onReveal = onReveal;
    this.revealed = false;
    this.scratching = false;
    this.lastPt = null;
    this._addListeners();
  }

  reset(sizeRefEl) {
    this.revealed = false;
    this.scratching = false;
    this.lastPt = null;
    this.canvas.style.opacity = '1';
    this.canvas.style.pointerEvents = 'auto';

    const dpr = window.devicePixelRatio || 1;
    const rect = sizeRefEl.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._drawCoating(rect.width, rect.height);
  }

  _drawCoating(w, h) {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#C0C0C0');
    grad.addColorStop(0.25, '#D8D8D8');
    grad.addColorStop(0.5, '#ABABAB');
    grad.addColorStop(0.75, '#D0D0D0');
    grad.addColorStop(1, '#B0B0B0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.font = '10px sans-serif';
    for (let x = 6; x < w; x += 45) {
      for (let y = 14; y < h; y += 28) {
        ctx.fillText('NT$', x, y);
      }
    }

    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.font = `bold ${Math.min(14, w * 0.04)}px "Noto Sans TC", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t('scratchHere'), w / 2, h / 2);
    ctx.textAlign = 'start';
    ctx.textBaseline = 'alphabetic';
  }

  _coords(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  _touchCoords(e) {
    const r = this.canvas.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    return { x: touch.clientX - r.left, y: touch.clientY - r.top };
  }

  _scratch(x, y) {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.arc(x, y, 20, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.globalCompositeOperation = 'source-over';
  }

  _scratchLine(from, to) {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.lineWidth = 40;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
    this.ctx.globalCompositeOperation = 'source-over';
  }

  _checkReveal() {
    if (this.revealed) return;
    const { width, height } = this.canvas;
    const data = this.ctx.getImageData(0, 0, width, height).data;
    let clear = 0;
    for (let i = 3; i < data.length; i += 32) {
      if (data[i] === 0) clear++;
    }
    const sampled = (data.length / 4) / 8;
    if (clear / sampled >= 0.50) {
      this.revealed = true;
      this.canvas.style.opacity = '0';
      this.canvas.style.pointerEvents = 'none';
      if (this.onReveal) setTimeout(() => this.onReveal(), 400);
    }
  }

  _addListeners() {
    const c = this.canvas;

    c.addEventListener('mousedown', e => {
      if (this.revealed) return;
      this.scratching = true;
      this.lastPt = this._coords(e);
      this._scratch(this.lastPt.x, this.lastPt.y);
    });
    c.addEventListener('mousemove', e => {
      if (!this.scratching || this.revealed) return;
      const pt = this._coords(e);
      this._scratchLine(this.lastPt, pt);
      this.lastPt = pt;
    });
    c.addEventListener('mouseup', () => {
      this.scratching = false;
      this.lastPt = null;
      this._checkReveal();
    });
    c.addEventListener('mouseleave', () => {
      if (this.scratching) {
        this.scratching = false;
        this.lastPt = null;
        this._checkReveal();
      }
    });

    c.addEventListener('touchstart', e => {
      if (this.revealed) return;
      e.preventDefault();
      this.scratching = true;
      this.lastPt = this._touchCoords(e);
      this._scratch(this.lastPt.x, this.lastPt.y);
    }, { passive: false });
    c.addEventListener('touchmove', e => {
      if (!this.scratching || this.revealed) return;
      e.preventDefault();
      const pt = this._touchCoords(e);
      this._scratchLine(this.lastPt, pt);
      this.lastPt = pt;
    }, { passive: false });
    c.addEventListener('touchend', e => {
      e.preventDefault();
      this.scratching = false;
      this.lastPt = null;
      this._checkReveal();
    }, { passive: false });
  }
}
