import { t } from './i18n.js';

export function renderPrizeGrid(container, grid) {
  container.innerHTML = '';
  grid.forEach((prize, i) => {
    const cell = document.createElement('div');
    cell.className = 'prize-cell';
    cell.dataset.index = i;
    cell.innerHTML = `
      <span class="icon">${prize.icon}</span>
      <span class="prize-zh">${prize.zh}</span>
      <span class="prize-en">${prize.en}</span>
      <span class="prize-amount">NT$${prize.amount.toLocaleString()}</span>
    `;
    container.appendChild(cell);
  });
}

export function highlightWinLine(line) {
  line.forEach(idx => {
    const cell = document.querySelector(`.prize-cell[data-index="${idx}"]`);
    if (cell) cell.classList.add('winning');
  });
}

export function showResultMsg(isWin) {
  const msg = document.getElementById('result-msg');
  if (isWin) {
    msg.className = 'result-msg show win';
    msg.textContent = t('youWon');
  } else {
    msg.className = 'result-msg show lose';
    msg.textContent = t('noWin') + ' ' + t('noWinSub');
  }
}

export function hideResultMsg() {
  document.getElementById('result-msg').className = 'result-msg';
}

export function showWinOverlay(prize) {
  document.getElementById('win-icon').textContent = prize.icon;
  document.getElementById('win-name').innerHTML = `
    <span class="prize-zh">${prize.zh}</span>
    <span class="prize-en">${prize.en}</span>
  `;
  animateCount(document.getElementById('win-amount'), 0, prize.amount, 1200);
  document.getElementById('win-overlay').classList.add('visible');
  showResultMsg(true);
}

export function hideWinOverlay() {
  document.getElementById('win-overlay').classList.remove('visible');
}

function animateCount(el, from, to, duration) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `NT$ ${Math.floor(from + (to - from) * eased).toLocaleString()}`;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function spawnConfetti() {
  const colors = ['#D4262C', '#FFD700', '#FF69B4', '#FFA500', '#FF4444', '#8B0000', '#FF6347'];
  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--fall-delay', (Math.random() * 1.5) + 's');
    piece.style.setProperty('--fall-duration', (2.5 + Math.random() * 2) + 's');
    piece.style.setProperty('--rotate-end', (360 + Math.random() * 720) + 'deg');
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    if (Math.random() > 0.5) piece.style.borderRadius = '50%';
    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}
