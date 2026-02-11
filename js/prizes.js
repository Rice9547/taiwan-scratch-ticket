// ==========================================
//  Game 1: Lucky Numbers (幸運號碼)
//  3 winning numbers vs 6 player numbers
// ==========================================

const GAME1_PRIZES = [100, 200, 200, 300, 500, 888, 1000, 1688, 2000];

function uniqueRandomNumbers(count, max) {
  const set = new Set();
  while (set.size < count) set.add(Math.floor(Math.random() * max) + 1);
  return [...set];
}

export function generateGame1() {
  const winNums = uniqueRandomNumbers(3, 39);
  const shouldWin = Math.random() < 0.30;

  let myNums;
  if (shouldWin) {
    // Ensure 1-2 matches
    const matchCount = Math.random() < 0.7 ? 1 : 2;
    const matched = winNums.slice(0, matchCount);
    const others = uniqueRandomNumbers(10, 39).filter(n => !winNums.includes(n));
    myNums = [...matched, ...others.slice(0, 6 - matchCount)];
    // Shuffle
    for (let i = myNums.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [myNums[i], myNums[j]] = [myNums[j], myNums[i]];
    }
  } else {
    myNums = uniqueRandomNumbers(10, 39).filter(n => !winNums.includes(n)).slice(0, 6);
    if (myNums.length < 6) {
      const extra = uniqueRandomNumbers(5, 39).filter(n => !winNums.includes(n) && !myNums.includes(n));
      myNums.push(...extra.slice(0, 6 - myNums.length));
    }
  }

  // Assign prizes to each player number
  const shuffledPrizes = [...GAME1_PRIZES].sort(() => Math.random() - 0.5);
  const cells = myNums.map((num, i) => ({
    number: num,
    prize: shuffledPrizes[i % shuffledPrizes.length],
  }));

  return { winNums, cells };
}

export function checkGame1(data) {
  const { winNums, cells } = data;
  const wins = cells.filter(c => winNums.includes(c.number));
  if (wins.length === 0) return null;
  const total = wins.reduce((sum, w) => sum + w.prize, 0);
  return { matchedCells: wins, total };
}

// ==========================================
//  Game 2: Match Three (刮出相同金額)
//  9 cells, 3 matching amounts = win
// ==========================================

const GAME2_AMOUNTS = [50, 100, 200, 300, 500, 888, 1000, 2000];

export function generateGame2() {
  const shouldWin = Math.random() < 0.25;
  const cells = [];

  if (shouldWin) {
    const winAmount = GAME2_AMOUNTS[Math.floor(Math.random() * GAME2_AMOUNTS.length)];
    // Place exactly 3 of the winning amount
    for (let i = 0; i < 3; i++) cells.push(winAmount);
    // Fill rest with non-matching (no other amount appears 3+ times)
    const others = GAME2_AMOUNTS.filter(a => a !== winAmount);
    for (let i = 0; i < 6; i++) {
      cells.push(others[Math.floor(Math.random() * others.length)]);
    }
    // Validate: no other amount appears 3+ times
    const counts = {};
    cells.forEach(a => counts[a] = (counts[a] || 0) + 1);
    for (const [amt, count] of Object.entries(counts)) {
      if (Number(amt) !== winAmount && count >= 3) {
        // Replace extras
        let fixed = 0;
        for (let i = 3; i < cells.length && fixed < count - 2; i++) {
          if (cells[i] === Number(amt)) {
            const replacement = others.filter(o => o !== Number(amt));
            cells[i] = replacement[Math.floor(Math.random() * replacement.length)];
            fixed++;
          }
        }
      }
    }
    // Shuffle
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
  } else {
    // Ensure no amount appears 3+ times
    let attempts = 0;
    let valid = false;
    while (!valid && attempts < 100) {
      cells.length = 0;
      for (let i = 0; i < 9; i++) {
        cells.push(GAME2_AMOUNTS[Math.floor(Math.random() * GAME2_AMOUNTS.length)]);
      }
      const counts = {};
      cells.forEach(a => counts[a] = (counts[a] || 0) + 1);
      valid = Object.values(counts).every(c => c < 3);
      attempts++;
    }
  }

  return { cells };
}

export function checkGame2(data) {
  const counts = {};
  data.cells.forEach(a => counts[a] = (counts[a] || 0) + 1);
  for (const [amt, count] of Object.entries(counts)) {
    if (count >= 3) return { winAmount: Number(amt) };
  }
  return null;
}

// ==========================================
//  Game 3: Bonus Round (加碼紅利)
//  3 cells, all 🧧 = win bonus
// ==========================================

const BONUS_SYMBOLS = ['🧧', '🏮', '🎆', '🧨', '🎊'];

export function generateGame3() {
  const shouldWin = Math.random() < 0.15;
  const bonusPrize = [300, 500, 888, 1000][Math.floor(Math.random() * 4)];

  let symbols;
  if (shouldWin) {
    symbols = ['🧧', '🧧', '🧧'];
  } else {
    // Ensure NOT all three the same
    let attempts = 0;
    do {
      symbols = Array.from({ length: 3 }, () =>
        BONUS_SYMBOLS[Math.floor(Math.random() * BONUS_SYMBOLS.length)]
      );
      attempts++;
    } while (symbols[0] === symbols[1] && symbols[1] === symbols[2] && attempts < 50);
  }

  return { symbols, bonusPrize };
}

export function checkGame3(data) {
  const { symbols, bonusPrize } = data;
  if (symbols[0] === '🧧' && symbols[1] === '🧧' && symbols[2] === '🧧') {
    return { bonusPrize };
  }
  return null;
}
