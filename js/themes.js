import { getLang } from './i18n.js';

const THEMES = [
  { zh: '新春福氣', en: 'Spring Fortune', decoLeft: '🧧', decoRight: '🏮', accent: '#D4262C' },
  { zh: '夜市美食', en: 'Night Market Feast', decoLeft: '🍢', decoRight: '🧋', accent: '#E65100' },
  { zh: '廟宇祈福', en: 'Temple Blessings', decoLeft: '🏯', decoRight: '🎐', accent: '#880E4F' },
  { zh: '寶島風情', en: 'Island Paradise', decoLeft: '🌺', decoRight: '🍍', accent: '#2E7D32' },
  { zh: '招財進寶', en: 'Wealth & Treasure', decoLeft: '💰', decoRight: '💎', accent: '#BF360C' },
];

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xFF) + amount);
  const g = Math.min(255, ((num >> 8) & 0xFF) + amount);
  const b = Math.min(255, (num & 0xFF) + amount);
  return `rgb(${r},${g},${b})`;
}

export function pickTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

export function applyTheme(theme) {
  const header = document.getElementById('ticket-header');
  header.style.background = `linear-gradient(135deg, ${theme.accent}, ${adjustColor(theme.accent, 30)})`;
  header.querySelector('.deco-left').textContent = theme.decoLeft;
  header.querySelector('.deco-right').textContent = theme.decoRight;
  document.getElementById('theme-name').textContent =
    getLang() === 'zh-TW' ? theme.zh : theme.en;
}
