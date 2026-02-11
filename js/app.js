import { setLanguage, showRandomFact } from './i18n.js';
import { generateGrid, findWinningLine } from './prizes.js';
import { pickTheme, applyTheme } from './themes.js';
import { initScratchListeners, resetCanvas } from './scratch.js';
import { initSound, playSound } from './sound.js';
import {
  renderPrizeGrid, highlightWinLine,
  showResultMsg, hideResultMsg,
  showWinOverlay, hideWinOverlay,
  spawnConfetti,
} from './ui.js';

const $ = id => document.getElementById(id);

let currentGrid = null;
let listenersAttached = false;

function handleReveal() {
  const result = findWinningLine(currentGrid);
  if (result) {
    highlightWinLine(result.line);
    showWinOverlay(result.prize);
    spawnConfetti();
    playSound('win');
  } else {
    showResultMsg(false);
    playSound('lose');
  }
}

function generateNewTicket() {
  const theme = pickTheme();
  applyTheme(theme);

  const { grid } = generateGrid();
  currentGrid = grid;

  renderPrizeGrid($('prize-grid'), grid);

  const serial = 'TW-2026-LNY-' + String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  $('ticket-serial').textContent = serial;

  hideResultMsg();
  hideWinOverlay();
  showRandomFact();

  const canvas = $('scratch-canvas');
  const gridEl = $('prize-grid');

  // Attach listeners only once
  if (!listenersAttached) {
    initScratchListeners(canvas, handleReveal);
    listenersAttached = true;
  }

  // Wait for DOM to settle before sizing canvas
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      resetCanvas(canvas, gridEl);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Language
  const preferZH = navigator.language.startsWith('zh');
  setLanguage(preferZH ? 'zh-TW' : 'en-US');

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  // Sound
  initSound();

  // Buttons
  $('btn-new-ticket').addEventListener('click', generateNewTicket);
  $('btn-overlay-new').addEventListener('click', generateNewTicket);

  // Close overlay on background click
  $('win-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) hideWinOverlay();
  });

  // Resize handling
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const canvas = $('scratch-canvas');
      if (canvas.style.opacity !== '0') {
        resetCanvas(canvas, $('prize-grid'));
      }
    }, 300);
  });

  // First ticket
  generateNewTicket();
});
