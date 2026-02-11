const I18N = {
  'zh-TW': {
    title: '新春刮刮樂',
    subtitle: '台灣新年特別版',
    scratchHere: '刮開此處',
    newTicket: '再來一張',
    youWon: '恭喜中獎！',
    noWin: '再接再厲！',
    noWinSub: '好運就在下一張 🍀',
    instructions: '用手指或滑鼠刮開銀色區域',
    matchThree: '刮出三個相同圖案即可中獎！',
    culturalTitle: '你知道嗎？',
    culturalFacts: [
      '刮刮樂是台灣過年最受歡迎的活動之一！許多人會買來試手氣，希望新的一年好運旺旺。',
      '台灣人過年時會在門上貼春聯，用紅紙寫上吉祥話祈求好運和平安。',
      '紅包（壓歲錢）是長輩給晚輩的祝福，紅色象徵喜氣與好運。',
      '過年期間，台灣各地的廟宇會舉辦熱鬧的慶典活動，包括搶頭香和點光明燈。',
      '年夜飯是台灣過年最重要的一餐，全家人團聚在一起吃團圓飯。',
      '台灣過年必吃的年菜包括：長年菜（長壽）、魚（年年有餘）、蘿蔔糕（好彩頭）。',
      '除夕夜守歲是台灣的傳統習俗，據說守歲可以為父母祈福延壽。',
    ],
    ticketSerial: '彩券編號',
    footer: '本遊戲僅供娛樂及文化教育用途',
  },
  'en-US': {
    title: 'Scratch & Win',
    subtitle: 'Taiwan Lunar New Year Edition',
    scratchHere: 'Scratch Here',
    newTicket: 'New Ticket',
    youWon: 'You Won!',
    noWin: 'Better Luck Next Time!',
    noWinSub: 'Good fortune awaits on the next ticket 🍀',
    instructions: 'Use your finger or mouse to scratch the silver area',
    matchThree: 'Match 3 identical symbols to win!',
    culturalTitle: 'Did You Know?',
    culturalFacts: [
      'Scratch tickets (刮刮樂, guā guā lè) are one of the most popular Lunar New Year activities in Taiwan! People buy them hoping for good luck in the new year.',
      'Taiwanese people paste spring couplets (春聯, chūn lián) on their doors — red paper banners with blessings written in calligraphy.',
      'Red envelopes (紅包, hóng bāo) filled with money are given by elders to younger family members as blessings. Red symbolizes luck and joy.',
      'During Lunar New Year, temples across Taiwan host colorful festivals, including the tradition of being the first to offer incense (搶頭香).',
      'The reunion dinner (年夜飯, nián yè fàn) on New Year\'s Eve is the most important meal — the whole family gathers together.',
      'Traditional New Year dishes include: long vegetables (longevity), fish (abundance, 年年有餘), and turnip cake (good fortune, 好彩頭).',
      'Staying up on New Year\'s Eve (守歲, shǒu suì) is a tradition believed to bring longevity to one\'s parents.',
    ],
    ticketSerial: 'Ticket No.',
    footer: 'This game is for entertainment and cultural education purposes only',
  }
};

let currentLang = 'zh-TW';

export function t(key) {
  return I18N[currentLang][key] || key;
}

export function getLang() {
  return currentLang;
}

export function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'zh-TW' ? 'zh-Hant' : 'en';
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (I18N[currentLang][key]) el.textContent = I18N[currentLang][key];
  });
  showRandomFact();
}

export function showRandomFact() {
  const facts = I18N[currentLang].culturalFacts;
  const el = document.getElementById('cultural-fact');
  if (el) el.textContent = facts[Math.floor(Math.random() * facts.length)];
}
