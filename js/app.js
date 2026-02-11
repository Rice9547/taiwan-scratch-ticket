import { setLanguage, showRandomFact } from './i18n.js';
import { generateGame1, generateGame2, generateGame3, checkGame1, checkGame2, checkGame3 } from './prizes.js';
import { pickTheme, applyTheme } from './themes.js';
import { ScratchCard } from './scratch.js';
import { initSound, playSound } from './sound.js';
import {
  renderGame1, renderGame2, renderGame3,
  highlightGame1, highlightGame2, highlightGame3,
  showResultMsg, hideResultMsg,
  showWinOverlay, hideWinOverlay,
  spawnConfetti,
} from './ui.js';

const $ = id => document.getElementById(id);

let game1Data, game2Data, game3Data;
let sc1, sc2, sc3;
let revealedCount = 0;

function onGameReveal(gameNum) {
  revealedCount++;
  let result;
  if (gameNum === 1) {
    result = checkGame1(game1Data);
    highlightGame1(result, game1Data.winNums);
  } else if (gameNum === 2) {
    result = checkGame2(game2Data);
    highlightGame2(result);
  } else {
    result = checkGame3(game3Data);
    highlightGame3(result);
  }

  // When all 3 are revealed, show final result
  if (revealedCount >= 3) {
    showFinalResult();
  }
}

function showFinalResult() {
  const r1 = checkGame1(game1Data);
  const r2 = checkGame2(game2Data);
  const r3 = checkGame3(game3Data);

  let total = 0;
  if (r1) total += r1.total;
  if (r2) total += r2.winAmount;
  if (r3) total += r3.bonusPrize;

  if (total > 0) {
    showResultMsg(true, total);
    showWinOverlay(total);
    spawnConfetti();
    playSound('win');
  } else {
    showResultMsg(false, 0);
    playSound('lose');
  }
}

function generateNewTicket() {
  revealedCount = 0;

  const theme = pickTheme();
  applyTheme(theme);

  game1Data = generateGame1();
  game2Data = generateGame2();
  game3Data = generateGame3();

  renderGame1($('game1-content'), game1Data);
  renderGame2($('game2-content'), game2Data);
  renderGame3($('game3-content'), game3Data);

  const serial = 'TW-2026-LNY-' + String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  $('ticket-serial').textContent = serial;

  hideResultMsg();
  hideWinOverlay();
  showRandomFact();

  // Init or reset scratch cards
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (!sc1) {
        sc1 = new ScratchCard($('canvas1'), () => onGameReveal(1));
        sc2 = new ScratchCard($('canvas2'), () => onGameReveal(2));
        sc3 = new ScratchCard($('canvas3'), () => onGameReveal(3));
      }
      sc1.reset($('game1-content'));
      sc2.reset($('game2-content'));
      sc3.reset($('game3-content'));
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const preferZH = navigator.language.startsWith('zh');
  setLanguage(preferZH ? 'zh-TW' : 'en-US');

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  initSound();

  $('btn-new-ticket').addEventListener('click', generateNewTicket);
  $('btn-overlay-new').addEventListener('click', generateNewTicket);
  $('win-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) hideWinOverlay();
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (sc1 && !sc1.revealed) sc1.reset($('game1-content'));
      if (sc2 && !sc2.revealed) sc2.reset($('game2-content'));
      if (sc3 && !sc3.revealed) sc3.reset($('game3-content'));
    }, 300);
  });

  generateNewTicket();
});
