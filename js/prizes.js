export const PRIZE_POOL = [
  { id: 'gxfc', zh: '恭喜發財', en: 'Wishing You Prosperity', amount: 888, icon: '🧧', tier: 'high' },
  { id: 'nnyy', zh: '年年有餘', en: 'Abundance Year After Year', amount: 666, icon: '🐟', tier: 'high' },
  { id: 'djdl', zh: '大吉大利', en: 'Great Luck & Fortune', amount: 2000, icon: '🍊', tier: 'jackpot' },
  { id: 'bbgs', zh: '步步高升', en: 'Rising Step by Step', amount: 200, icon: '📈', tier: 'medium' },
  { id: 'wsry', zh: '萬事如意', en: 'May All Go As You Wish', amount: 500, icon: '✨', tier: 'high' },
  { id: 'xxsc', zh: '心想事成', en: 'Dreams Come True', amount: 300, icon: '💫', tier: 'medium' },
  { id: 'flsq', zh: '福祿壽全', en: 'Fortune, Prosperity & Longevity', amount: 3000, icon: '🏮', tier: 'jackpot' },
  { id: 'zctb', zh: '招財進寶', en: 'Ushering In Wealth', amount: 1688, icon: '💰', tier: 'jackpot' },
  { id: 'boba', zh: '珍珠奶茶', en: 'Bubble Tea', amount: 50, icon: '🧋', tier: 'cultural' },
  { id: 'cake', zh: '鳳梨酥', en: 'Pineapple Cake', amount: 100, icon: '🍍', tier: 'cultural' },
  { id: 'xiao', zh: '小籠包', en: 'Soup Dumplings', amount: 80, icon: '🥟', tier: 'cultural' },
  { id: 'mang', zh: '芒果冰', en: 'Mango Shaved Ice', amount: 60, icon: '🍧', tier: 'cultural' },
  { id: 'taro', zh: '芋圓', en: 'Taro Balls', amount: 45, icon: '🍡', tier: 'cultural' },
  { id: 'lanp', zh: '天燈', en: 'Sky Lantern', amount: 150, icon: '🪔', tier: 'cultural' },
];

const WIN_RATE = 0.35;
const TIER_WEIGHTS = { cultural: 50, medium: 30, high: 15, jackpot: 5 };

const LINES = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6],
];

function pickTier() {
  const total = Object.values(TIER_WEIGHTS).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [tier, w] of Object.entries(TIER_WEIGHTS)) {
    r -= w;
    if (r <= 0) return tier;
  }
  return 'cultural';
}

function pickPrize(tier) {
  const pool = PRIZE_POOL.filter(p => p.tier === tier);
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickRandomPrize() {
  return PRIZE_POOL[Math.floor(Math.random() * PRIZE_POOL.length)];
}

function hasWinningLine(grid) {
  return LINES.some(([a, b, c]) => grid[a].id === grid[b].id && grid[b].id === grid[c].id);
}

export function findWinningLine(grid) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (grid[a].id === grid[b].id && grid[b].id === grid[c].id) {
      return { line, prize: grid[a] };
    }
  }
  return null;
}

function generateWinningGrid() {
  const tier = pickTier();
  const winPrize = pickPrize(tier);
  const lineIdx = Math.floor(Math.random() * LINES.length);
  const line = LINES[lineIdx];
  const grid = new Array(9);

  for (const idx of line) grid[idx] = { ...winPrize };

  const others = PRIZE_POOL.filter(p => p.id !== winPrize.id);
  for (let i = 0; i < 9; i++) {
    if (!grid[i]) {
      grid[i] = { ...others[Math.floor(Math.random() * others.length)] };
    }
  }

  // Ensure no accidental extra winning lines
  for (const checkLine of LINES) {
    if (checkLine === line) continue;
    const [a, b, c] = checkLine;
    if (grid[a].id === grid[b].id && grid[b].id === grid[c].id) {
      const replaceIdx = checkLine.find(i => !line.includes(i));
      if (replaceIdx !== undefined) {
        const replacement = others.filter(p => p.id !== grid[replaceIdx].id);
        grid[replaceIdx] = { ...replacement[Math.floor(Math.random() * replacement.length)] };
      }
    }
  }

  return grid;
}

function generateLosingGrid() {
  let grid;
  let attempts = 0;
  do {
    grid = Array.from({ length: 9 }, () => ({ ...pickRandomPrize() }));
    attempts++;
  } while (hasWinningLine(grid) && attempts < 200);
  return grid;
}

export function generateGrid() {
  const isWinner = Math.random() < WIN_RATE;
  return {
    grid: isWinner ? generateWinningGrid() : generateLosingGrid(),
    isWinner,
  };
}
