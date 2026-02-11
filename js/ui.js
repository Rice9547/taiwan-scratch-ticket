import { t } from './i18n.js';

// ============ Game 1: Lucky Numbers ============
export function renderGame1(container, data) {
  const { winNums, cells } = data;
  container.innerHTML = `
    <div class="g1-winning">
      <div class="g1-label" data-i18n="winningNumbers">${t('winningNumbers')}</div>
      <div class="g1-winning-row">
        ${winNums.map(n => `<div class="g1-num winning">${String(n).padStart(2, '0')}</div>`).join('')}
      </div>
    </div>
    <div class="g1-mine">
      <div class="g1-label" data-i18n="myNumbers">${t('myNumbers')}</div>
      <div class="g1-mine-row">
        ${cells.map(c => `
          <div class="g1-cell" data-num="${c.number}">
            <span class="g1-num">${String(c.number).padStart(2, '0')}</span>
            <span class="g1-prize">NT$${c.prize.toLocaleString()}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function highlightGame1(result, winNums) {
  if (!result) return;
  result.matchedCells.forEach(mc => {
    const el = document.querySelector(`.g1-cell[data-num="${mc.number}"]`);
    if (el) el.classList.add('matched');
  });
}

// ============ Game 2: Match Three ============
export function renderGame2(container, data) {
  container.innerHTML = `
    <div class="g2-grid">
      ${data.cells.map(amount => `
        <div class="g2-cell">NT$${amount.toLocaleString()}</div>
      `).join('')}
    </div>
  `;
}

export function highlightGame2(result) {
  if (!result) return;
  document.querySelectorAll('.g2-cell').forEach(el => {
    const amt = parseInt(el.textContent.replace(/[^0-9]/g, ''));
    if (amt === result.winAmount) el.classList.add('matched');
  });
}

// ============ Game 3: Bonus ============
export function renderGame3(container, data) {
  container.innerHTML = `
    <div class="g3-row">
      ${data.symbols.map(s => `<div class="g3-cell">${s}</div>`).join('')}
    </div>
    <div class="g3-prize">${t('bonusPrize')}: NT$${data.bonusPrize.toLocaleString()}</div>
  `;
}

export function highlightGame3(result) {
  if (!result) return;
  document.querySelectorAll('.g3-cell').forEach(el => el.classList.add('matched'));
}

// ============ Result overlay ============
export function showWinOverlay(totalAmount) {
  document.getElementById('win-total').textContent = `NT$ ${totalAmount.toLocaleString()}`;
  document.getElementById('win-overlay').classList.add('visible');
}

export function hideWinOverlay() {
  document.getElementById('win-overlay').classList.remove('visible');
}

export function showResultMsg(isWin, amount) {
  const msg = document.getElementById('result-msg');
  if (isWin) {
    msg.className = 'result-msg show win';
    msg.innerHTML = `${t('youWon')} <strong>NT$ ${amount.toLocaleString()}</strong>`;
  } else {
    msg.className = 'result-msg show lose';
    msg.textContent = `${t('noWin')} ${t('noWinSub')}`;
  }
}

export function hideResultMsg() {
  document.getElementById('result-msg').className = 'result-msg';
}

// ============ Confetti ============
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
