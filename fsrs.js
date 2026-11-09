/* FSRS-5（標準パラメータ）で、単語ごとの「記憶の安定度 S」「難しさ D」と次の復習間隔を計算する。
   g: 1=わからなかった 2=正解だが遅い 3=正解 4=即答 */
(function () {
  const W = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 1.54575, 0.1192,
             1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 2.9898, 0.51655, 0.6621];
  const DECAY = -0.5, FACTOR = 19 / 81;
  const RETENTION = 0.9;   // 復習時に思い出せる確率の目標
  const MAX_IVL = 365;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

  const initS = g => Math.max(W[g - 1], 0.1);
  const initD = g => clamp(W[4] - Math.exp(W[5] * (g - 1)) + 1, 1, 10);
  const R = (t, s) => Math.pow(1 + FACTOR * t / s, DECAY);
  function nextD(d, g) {
    const d1 = d + (-W[6] * (g - 3)) * (10 - d) / 9;
    return clamp(W[7] * initD(4) + (1 - W[7]) * d1, 1, 10);
  }
  function recallS(d, s, r, g) {
    const hard = g === 2 ? W[15] : 1, easy = g === 4 ? W[16] : 1;
    return s * (1 + Math.exp(W[8]) * (11 - d) * Math.pow(s, -W[9]) * (Math.exp((1 - r) * W[10]) - 1) * hard * easy);
  }
  function forgetS(d, s, r) {
    return Math.min(s, W[11] * Math.pow(d, -W[12]) * (Math.pow(s + 1, W[13]) - 1) * Math.exp((1 - r) * W[14]));
  }
  const shortS = (s, g) => s * Math.exp(W[17] * (g - 3 + W[18]));
  const interval = s => s / FACTOR * (Math.pow(RETENTION, 1 / DECAY) - 1);

  /* card: 前回までの状態（初めてなら null）／ elapsedDays: 前回から何日たったか（同じ日なら0） */
  function review(card, g, elapsedDays) {
    let s, d;
    if (!card) { s = initS(g); d = initD(g); }
    else if (elapsedDays < 1) { s = shortS(card.s, g); d = nextD(card.d, g); }
    else {
      const r = R(elapsedDays, card.s);
      s = g === 1 ? forgetS(card.d, card.s, r) : recallS(card.d, card.s, r, g);
      d = nextD(card.d, g);
    }
    s = clamp(s, 0.01, 36500);
    let ivl = 0;
    if (g > 1) {
      ivl = Math.round(interval(s));
      if (ivl >= 3) ivl = Math.round(ivl * (0.95 + Math.random() * 0.1));
      ivl = clamp(ivl, 1, MAX_IVL);
    }
    return { s, d, ivl };
  }

  window.FSRS = { review, R, initS, initD, RETENTION };
})();
