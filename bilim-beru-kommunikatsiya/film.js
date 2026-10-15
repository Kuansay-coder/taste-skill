// ФИЛЬМ: «Білім беру саласындағы тиімді коммуникация негіздері». 13 сурет бөлімі, әрқайсысы дикторлық жолмен үйлеседі.
(function () {
  const U = globalThis.U, G = globalThis.G, Ch = globalThis.Ch, UI = globalThis.UI, Subs = globalThis.Subs, S = globalThis.SCORE, Studio = globalThis.Studio;
  const { clamp, ease, pulse } = U;
  const { T, BEAT, ev, clock, B } = S;
  const W = G.W, H = G.H;
  const BAR = BEAT * 4;
  const FLOOR = 930;
  const C = { ink: '#2A2320', bg: '#F6F1E7', teal: '#2F8F83', orange: '#E0703E', blue: '#3B6FB6', yellow: '#F2B84B', purple: '#8A63C7', rose: '#D9567A', green: '#58A55C', board: '#24493F', white: '#FFFFFF', paper: '#FFFDF7' };
  UI.setTheme({ font: '"Inter", system-ui, sans-serif', ink: C.ink, accent: C.teal });
  let VO = null, SUBS = [];

  const sectionOf = (t) => (t < S.S.intro[1] ? 'intro' : Object.entries(S.S).find(([, [a, b]]) => t >= a && t < b)?.[0] || 'end');
  const talk = (t) => { const m = Subs.mouth(VO, t, 'narrator'); return m.talking ? m : 'smile'; };
  const hop = (t, amp) => amp * Math.sin(Math.PI * clock.phase(t));
  const stamp = (t, t0) => (t < t0 ? 0 : 1 + 0.3 * (1 - ease.outCubic(clamp((t - t0) / 0.2))));
  const A = (sec, bars) => S.S[sec][0] + bars * BAR;           // бөлім басынан бастап тактілер
  const fade = (t, t0, d = 0.35) => clamp((t - t0) / d);

  // ---------- қарапайым құралдар ----------
  const txt = (ctx, str, x, y, size, color = C.ink, o = {}) => G.text(ctx, str, x, y, { size, fam: 'Inter', weight: 800, color, boil: 0, ...o });
  const fit = (ctx, str, x, y, maxW, size, color, o = {}) => { const w = G.measure(ctx, str, size, 'Inter', o.weight || 800); const s = w > maxW ? size * maxW / w : size; txt(ctx, str, x, y, s, color, o); };
  const popAt = (ctx, t, t0, cx, cy, fn) => { const k = UI.pop(t, t0, 0.32); if (k <= 0) return false; ctx.save(); ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-cx, -cy); fn(); ctx.restore(); return true; };
  const card = (ctx, x, y, w, h, fill = C.paper, o = {}) => G.rrect(ctx, x, y, w, h, 28, { fill, lw: 4, seed: Math.round(x + y), ...o });
  const arrow = (ctx, x1, y1, x2, y2, color, p = 1, lw = 8) => {
    if (p <= 0) return;
    const ex = x1 + (x2 - x1) * p, ey = y1 + (y2 - y1) * p;
    G.line(ctx, [[x1, y1], [ex, ey]], { color, lw, seed: 5 });
    if (p > 0.9) { const a = Math.atan2(y2 - y1, x2 - x1); const hx = (d, r) => [x2 - Math.cos(a + d) * r, y2 - Math.sin(a + d) * r]; G.poly(ctx, [[x2, y2], hx(0.5, 34), hx(-0.5, 34)], { fill: color, lw: 3, seed: 6 }); }
  };
  const heading = (ctx, t, sec, text) => {
    const k = stamp(t, S.S[sec][0]); if (k <= 0) return;
    ctx.save(); ctx.translate(70, 46); ctx.scale(k, k);
    UI.pill(ctx, 0, 0, text, { size: 44, h: 84, bg: C.ink, fg: '#FFFFFF' });
    ctx.restore();
  };
  const floor = (ctx, color = '#E6D7B8') => { G.rrect(ctx, -40, FLOOR - 20, W + 80, H - FLOOR + 60, 4, { fill: color, lw: 4, seed: 9, hatch: { color: 'rgba(120,80,40,0.12)', gap: 10 } }); };
  const wallBg = (ctx, c1 = C.bg) => { G.bg(ctx, c1); };

  // ---------- кейіпкерлер ----------
  const ST = {
    teacher: { outfit: 'dress', shirt: C.teal, hairStyle: 'bun', glasses: 'round', skin: '#D9A27A' },
    boy: { outfit: 'hoodie', shirt: C.orange, hairStyle: 'short', skin: '#E6B48C', bottoms: 'pants', pants: '#27305C' },
    girl: { outfit: 'tee', shirt: C.purple, hairStyle: 'ponytail', skin: '#F3D2B3', bottoms: 'skirt', shorts: '#2C3550' },
    parent: { outfit: 'shirt', shirt: C.green, hairStyle: 'short', facialHair: 'mustache', skin: '#C98A62', bottoms: 'pants', pants: '#4A4A55', build: 'broad' },
    colleague: { outfit: 'suit', robe: '#2C3550', hairStyle: 'short', glasses: 'square', skin: '#F3D2B3' },
  };
  const person = (ctx, who, x, y, s, o = {}) => Ch.person(ctx, { x, y, s, pose: 'stand', style: ST[who], seed: 100 + who.length * 13, ...o });
  const open = (t, k = 0) => (Math.sin(t * 11 + k * 3) > 0 ? 'open' : 'smile'); // сөйлеп тұрғандай ауыз

  // ---------- белгішелер ----------
  const iPerson = (ctx, x, y, s, col) => { G.ellipse(ctx, x, y - 50 * s, 26 * s, 26 * s, { fill: col, lw: 4, seed: 11 }); G.rrect(ctx, x - 44 * s, y - 14 * s, 88 * s, 70 * s, 30 * s, { fill: col, lw: 4, seed: 12 }); };
  const iMail = (ctx, x, y, s, col) => { G.rrect(ctx, x - 55 * s, y - 38 * s, 110 * s, 76 * s, 10, { fill: col, lw: 4, seed: 13 }); G.line(ctx, [[x - 55 * s, y - 36 * s], [x, y + 6 * s], [x + 55 * s, y - 36 * s]], { color: C.ink, lw: 4, seed: 14 }); };
  const iWaves = (ctx, x, y, s, col, t = 0) => { G.ellipse(ctx, x - 50 * s, y, 12 * s, 12 * s, { fill: col, lw: 3, seed: 15 }); for (let i = 1; i <= 3; i++) { const r = (26 + i * 26) * s, a = 0.25 + 0.5 * pulse(t, 0, 3) * 0 ; const pts = []; for (let k = -6; k <= 6; k++) { const ang = k * 0.11; pts.push([x - 50 * s + Math.cos(ang) * r, y + Math.sin(ang) * r]); } G.line(ctx, pts, { color: col, lw: 6, seed: 16 + i, alpha: 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 5 - i * 1.2)) }); } };
  const iBulb = (ctx, x, y, s) => { G.ellipse(ctx, x, y - 12 * s, 34 * s, 34 * s, { fill: C.yellow, lw: 4, seed: 17 }); G.rrect(ctx, x - 16 * s, y + 18 * s, 32 * s, 24 * s, 6, { fill: '#B8B2A6', lw: 3, seed: 18 }); };
  const iEye = (ctx, x, y, s, look = 0) => { G.ellipse(ctx, x, y, 52 * s, 30 * s, { fill: '#fff', lw: 4, seed: 19 }); G.ellipse(ctx, x + look * 16 * s, y, 18 * s, 18 * s, { fill: C.blue, lw: 3, seed: 20 }); G.ellipse(ctx, x + look * 16 * s, y, 8 * s, 8 * s, { fill: C.ink, lw: 0, seed: 21 }); };
  const iBars = (ctx, x, y, s, col, t, t0) => { for (let i = 0; i < 4; i++) { const h = (26 + i * 26) * s * ease.outCubic(clamp((t - t0 - i * 0.2) / 0.4)); G.rrect(ctx, x - 62 * s + i * 34 * s, y + 42 * s - h, 26 * s, Math.max(h, 1), 6, { fill: col, lw: 3, seed: 22 + i }); } };
  const iTalk = (ctx, x, y, s, col) => { G.rrect(ctx, x - 50 * s, y - 36 * s, 100 * s, 66 * s, 22 * s, { fill: col, lw: 4, seed: 30 }); G.poly(ctx, [[x - 20 * s, y + 28 * s], [x - 36 * s, y + 52 * s], [x, y + 28 * s]], { fill: col, lw: 3, seed: 31 }); for (let i = 0; i < 3; i++) G.ellipse(ctx, x - 24 * s + i * 24 * s, y - 4 * s, 6 * s, 6 * s, { fill: '#fff', lw: 0, seed: 32 + i }); };

  // ================= 1. кіріспе =================
  function intro(ctx, t) {
    wallBg(ctx, '#EFE6D2');
    // тақта
    G.rrect(ctx, 100, 90, 1240, 640, 20, { fill: C.board, lw: 8, seed: 3, hatch: { color: 'rgba(255,255,255,0.05)', gap: 14 } });
    G.rrect(ctx, 100, 730, 1240, 22, 8, { fill: '#8B5E3C', lw: 4, seed: 4 });
    const k = stamp(t, ev.intro + BEAT * 2);
    if (k > 0) {
      ctx.save(); ctx.translate(720, 0); ctx.scale(k, k); ctx.translate(-720, 0);
      txt(ctx, 'Білім беру саласындағы', 720, 300, 84, '#FFFFFF', { align: 'center' });
      txt(ctx, 'тиімді коммуникация', 720, 420, 96, C.yellow, { align: 'center' });
      txt(ctx, 'негіздері', 720, 540, 96, C.yellow, { align: 'center' });
      ctx.restore();
    }
    G.text(ctx, 'түсіндірме бейнеөлең', 720, 640, { size: 50, fam: 'Caveat', weight: 700, color: '#CFE8DF', align: 'center', boil: 0, alpha: fade(t, ev.intro + BEAT * 5) });
    floor(ctx);
    // сөйлесу «көпіршіктері»
    [[1450, 250, C.orange], [1700, 180, C.blue], [1560, 400, C.purple]].forEach(([x, y, c], i) => { const k2 = UI.pop(t, ev.intro + BEAT * (3 + i), 0.35); if (k2 > 0) { ctx.save(); ctx.translate(x, y + Math.sin(t * 2 + i) * 8); ctx.scale(k2, k2); iTalk(ctx, 0, 0, 0.9, c); ctx.restore(); } });
    person(ctx, 'teacher', 1570, FLOOR + 40 - hop(t, 10), 1.25, { mouth: talk(t), gesture: t > ev.intro + BEAT * 6 ? 'wave' : null, eyes: 'happy', blush: 0.3 });
  }

  // ================= 2. Коммуникация деген не? =================
  function define(ctx, t) {
    wallBg(ctx);
    heading(ctx, t, 'define', '1 · Коммуникация деген не?');
    floor(ctx);
    const t0 = ev.define;
    txt(ctx, 'КОММУНИКАЦИЯ', 960, 260, 120, C.teal, { align: 'center', alpha: fade(t, t0 + BEAT) });
    G.text(ctx, 'латынша «communis» — ортақ, ортақтасу', 960, 330, { size: 50, fam: 'Caveat', weight: 700, color: C.ink, align: 'center', boil: 0, alpha: fade(t, A('define', 0.8)) });
    // екі адам
    person(ctx, 'teacher', 330, FLOOR + 40, 0.95, { mouth: Math.floor((t - t0) / BAR) % 2 === 0 ? open(t) : 'smile', eyes: 'happy', look: 0.4, gesture: null });
    person(ctx, 'boy', 1590, FLOOR + 40, 0.95, { mouth: Math.floor((t - t0) / BAR) % 2 === 1 ? open(t, 2) : 'smile', eyes: 'happy', look: -0.4 });
    // ақпарат, ой, сезім: екі жаққа ұшып жүреді
    const items = [['ақпарат', C.blue], ['ой', C.orange], ['сезім', C.rose]];
    const cycle = BAR * 1;
    items.forEach(([label, col], i) => {
      const tt = t - (A('define', 1.2) + i * BEAT * 1.4);
      if (tt < 0) return;
      const ph = (tt / (cycle * 1.0)) % 2; // 0..1 → оңға, 1..2 → солға
      const u = ph < 1 ? ph : 2 - ph;
      const x = 560 + (1360 - 560) * ease.inOutQuad(u), y = 560 - Math.sin(u * Math.PI) * (120 + i * 40) + i * 90;
      ctx.save(); ctx.translate(x, y);
      const w = UI.pill(ctx, -90, -34, label, { size: 40, h: 68, bg: col, fg: '#FFFFFF' });
      ctx.restore();
    });
    // сызықтар
    arrow(ctx, 520, 760, 1400, 760, C.ink, ease.outCubic(clamp((t - A('define', 2)) / 1.2)), 6);
    arrow(ctx, 1400, 810, 520, 810, C.ink, ease.outCubic(clamp((t - A('define', 2.4)) / 1.2)), 6);
    fit(ctx, 'ақпарат · ой · сезім алмасу', 960, 880, 700, 54, C.ink, { align: 'center', alpha: fade(t, A('define', 2.8)) });
  }

  // ================= 3. Модель =================
  function model(ctx, t) {
    wallBg(ctx);
    heading(ctx, t, 'model', '2 · Коммуникация моделі');
    const t0 = ev.model;
    const BX = [110, 550, 990, 1430], BW = 380, BY = 190, BH = 230;
    const defs = [
      ['Жіберуші', C.teal, (x, y) => iPerson(ctx, x, y, 1.1, C.teal)],
      ['Хабарлама', C.orange, (x, y) => iMail(ctx, x, y, 1.2, C.orange)],
      ['Арна', C.purple, (x, y) => iWaves(ctx, x + 10, y, 1.2, C.purple, t)],
      ['Қабылдаушы', C.blue, (x, y) => iPerson(ctx, x, y, 1.1, C.blue)],
    ];
    const times = [A('model', 0.5), A('model', 1.2), A('model', 1.9), A('model', 2.6)];
    defs.forEach(([label, col, icon], i) => {
      popAt(ctx, t, times[i], BX[i] + BW / 2, BY + BH / 2, () => {
        card(ctx, BX[i], BY, BW, BH, C.paper, { stroke: col });
        icon(BX[i] + BW / 2, BY + 90);
        fit(ctx, label, BX[i] + BW / 2, BY + BH - 28, BW - 40, 46, col, { align: 'center' });
      });
      if (i < 3 && t > times[i + 1]) arrow(ctx, BX[i] + BW + 6, BY + BH / 2, BX[i + 1] - 6, BY + BH / 2, C.ink, ease.outCubic(clamp((t - times[i + 1]) / 0.4)), 6);
    });
    // кері байланыс: тік төрт бұрыш жолы
    const pFB = ease.outCubic(clamp((t - A('model', 3.4)) / 1.2));
    const ax = BX[3] + BW / 2, bx = BX[0] + BW / 2, yb = BY + BH + 6, yy = 560;
    if (pFB > 0) {
      const pts = [[ax, yb], [ax, yy], [bx, yy], [bx, yb + 20]];
      const lens = [yy - yb, ax - bx, yy - yb - 20]; const tot = lens.reduce((a, b) => a + b, 0);
      let d = pFB * tot; const out = [pts[0]];
      for (let i = 0; i < 3; i++) { const a = pts[i], b = pts[i + 1]; if (d >= lens[i]) { out.push(b); d -= lens[i]; } else { out.push([a[0] + (b[0] - a[0]) * d / lens[i], a[1] + (b[1] - a[1]) * d / lens[i]]); break; } }
      G.line(ctx, out, { color: C.rose, lw: 8, seed: 70 });
      if (pFB > 0.97) G.poly(ctx, [[bx, yb], [bx - 20, yb + 36], [bx + 20, yb + 36]], { fill: C.rose, lw: 3, seed: 71 });
    }
    popAt(ctx, t, A('model', 3.9), 960, yy, () => { UI.pill(ctx, 960 - 230, yy - 40, 'Кері байланыс', { size: 46, h: 80, bg: C.rose, fg: '#FFFFFF' }); });
    // 2-бөлік: мысал — хабар барып қайтады
    const t2 = B.model2.t0;
    floor(ctx);
    person(ctx, 'teacher', 300, FLOOR + 40, 0.72, { mouth: t > t2 && t < A('model', 6.2) ? open(t) : 'smile', eyes: 'happy', look: 0.4 });
    person(ctx, 'boy', 1620, FLOOR + 40, 0.72, { mouth: t > A('model', 6.4) ? open(t, 3) : 'smile', eyes: 'happy', look: -0.4 });
    G.bubble(ctx, 'Бүгін жаңа тақырып!', 520, 700, 340, 790, t, A('model', 4.5), A('model', 6.2), { size: 44 });
    G.bubble(ctx, 'Түсіндім! Мен...', 1400, 700, 1580, 790, t, A('model', 6.4), A('model', 7.9), { size: 44 });
    // хат жолда
    const tp = t - A('model', 5.2);
    if (tp > 0 && tp < BAR * 1.2) { const u = clamp(tp / (BAR * 1.0)); const x = 380 + (1540 - 380) * ease.inOutQuad(u); iMail(ctx, x, 560 - Math.sin(u * Math.PI) * 60, 0.6, C.orange); }
    const tq = t - A('model', 6.6);
    if (tq > 0 && tq < BAR * 1.2) { const u = clamp(tq / (BAR * 1.0)); const x = 1540 - (1540 - 380) * ease.inOutQuad(u); G.heart(ctx, x, 620 - Math.sin(u * Math.PI) * 60, 1.8); }
  }

  // ================= 4. Білім берудегі маңызы =================
  function why(ctx, t) {
    wallBg(ctx);
    heading(ctx, t, 'why', '3 · Білім берудегі маңызы');
    const cards = [['Сенім', C.rose, (x, y) => G.heart(ctx, x, y + 10, 4.2)], ['Ынталану', C.yellow, (x, y) => G.star(ctx, x, y + 6, 74, { rot: Math.sin(t * 2) * 0.2 })], ['Нәтиже', C.green, (x, y) => iBars(ctx, x, y, 1.8, C.green, t, A('why', 2.9))]];
    const times = [A('why', 1.3), A('why', 2.6), A('why', 3.6)];
    cards.forEach(([label, col, icon], i) => {
      const x = 150 + i * 560, y = 210, w = 500, h = 540;
      popAt(ctx, t, times[i], x + w / 2, y + h / 2, () => {
        card(ctx, x, y, w, h, C.paper, { stroke: col });
        icon(x + w / 2, y + 190);
        fit(ctx, label, x + w / 2, y + 420, w - 60, 78, col, { align: 'center' });
        G.line(ctx, [[x + 80, y + 455], [x + w - 80, y + 455]], { color: col, lw: 6, seed: 40 + i });
      });
    });
    // жүрек: «сабақтың жүрегі»
    const k = 1 + 0.08 * Math.sin(Math.PI * clock.phase(t));
    const a = fade(t, A('why', 0.1));
    if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.translate(960, 850); ctx.scale(k, k); G.heart(ctx, -600, 0, 2.2); txt(ctx, 'Коммуникация — сабақтың жүрегі', 0, 22, 62, C.ink, { align: 'center' }); G.heart(ctx, 600, 0, 2.2); ctx.restore(); }
  }

  // ================= 5. Вербалды және вербалсыз =================
  function verbal(ctx, t) {
    wallBg(ctx);
    heading(ctx, t, 'verbal', '4 · Вербалды және вербалсыз');
    const tA = B.verbal.t0, tB = B.verbal2.t0;
    if (t < tB - 0.2) {
      floor(ctx);
      // сол жақ: вербалды
      popAt(ctx, t, A('verbal', 0.4), 380, 450, () => { card(ctx, 90, 190, 580, 520, C.paper, { stroke: C.blue }); UI.pill(ctx, 130, 215, 'Вербалды', { size: 48, h: 84, bg: C.blue, fg: '#fff' }); iTalk(ctx, 380, 460, 1.6, C.blue); txt(ctx, 'сөз · үн · екпін', 380, 640, 46, C.ink, { align: 'center' }); });
      // оң жақ: вербалсыз
      popAt(ctx, t, A('verbal', 1.6), 1540, 450, () => {
        card(ctx, 1250, 190, 580, 520, C.paper, { stroke: C.orange }); UI.pill(ctx, 1290, 215, 'Вербалсыз', { size: 48, h: 84, bg: C.orange, fg: '#fff' });
        iEye(ctx, 1370, 440, 1.0, Math.sin(t * 2)); G.ellipse(ctx, 1540, 440, 46, 46, { fill: '#FFE08A', lw: 4, seed: 51 }); G.line(ctx, [[1520, 455], [1540, 465], [1560, 455]], { color: C.ink, lw: 4, seed: 52 }); G.ellipse(ctx, 1528, 428, 5, 5, { fill: C.ink, lw: 0, seed: 53 }); G.ellipse(ctx, 1552, 428, 5, 5, { fill: C.ink, lw: 0, seed: 54 });
        G.ellipse(ctx, 1710, 440, 40, 40, { fill: '#F3D2B3', lw: 4, seed: 55 }); G.line(ctx, [[1690, 400], [1700, 360], [1712, 396], [1724, 354], [1736, 396]], { color: C.ink, lw: 5, seed: 56 });
        txt(ctx, 'ым-ишара · жүз · көзқарас', 1540, 640, 38, C.ink, { align: 'center' });
      });
      // мұғалім ортада ым-ишарамен
      const g = t < A('verbal', 1.6) ? 'point' : t < A('verbal', 3) ? 'wave' : 'thumbsUp';
      person(ctx, 'teacher', 960, FLOOR + 40, 0.95, { mouth: talk(t), gesture: g, eyes: 'happy' });
    } else {
      floor(ctx);
      const t0 = tB;
      txt(ctx, 'Сөз бен дене тілі сәйкес болса — сенім!', 960, 250, 58, C.ink, { align: 'center', alpha: fade(t, t0 + 0.2) });
      // сәйкес
      popAt(ctx, t, A('verbal', 5.6), 500, 560, () => {
        card(ctx, 140, 310, 720, 520, '#E9F5EC', { stroke: C.green });
        person(ctx, 'teacher', 500, 800, 0.62, { gesture: 'thumbsUp', mouth: 'smile', eyes: 'happy' });
        G.bubble(ctx, 'Жарайсың!', 640, 400, 560, 520, t, A('verbal', 5.6) + 0.2, A('verbal', 10), { size: 40 });
        UI.pill(ctx, 340, 760, 'Сәйкес ✓', { size: 40, h: 70, bg: C.green, fg: '#fff' });
      });
      // қайшы
      popAt(ctx, t, A('verbal', 6.8), 1420, 560, () => {
        card(ctx, 1060, 310, 720, 520, '#FBECEA', { stroke: C.rose });
        person(ctx, 'colleague', 1420, 800, 0.62, { crossArms: true, mouth: 'flat', brows: 'worried' });
        G.bubble(ctx, 'Жарайсың...', 1560, 400, 1480, 520, t, A('verbal', 6.8) + 0.2, A('verbal', 10), { size: 40 });
        UI.pill(ctx, 1260, 760, 'Қайшы ✗', { size: 40, h: 70, bg: C.rose, fg: '#fff' });
      });
    }
  }

  // ================= 6. Белсенді тыңдау =================
  function listen(ctx, t) {
    wallBg(ctx);
    heading(ctx, t, 'listen', '5 · Белсенді тыңдау');
    floor(ctx);
    const steps = [['1', 'Көзге қараңыз', C.blue, (x, y) => iEye(ctx, x, y, 0.9, Math.sin(t * 2) * 0.3)], ['2', 'Сөзді бөлмеңіз', C.orange, (x, y) => { G.ellipse(ctx, x, y, 38, 38, { fill: '#fff', lw: 4, seed: 61 }); G.line(ctx, [[x - 22, y - 22], [x + 22, y + 22]], { color: C.rose, lw: 8, seed: 62 }); }], ['3', 'Өз сөзіңізбен қайталаңыз', C.green, (x, y) => { G.ellipse(ctx, x - 20, y, 30, 30, { fill: '#fff', lw: 4, seed: 63 }); G.ellipse(ctx, x + 20, y, 30, 30, { fill: C.yellow, lw: 4, seed: 64 }); }]];
    steps.forEach(([n, label, col, icon], i) => {
      const x = 90 + i * 600, y = 190, w = 540, h = 250;
      popAt(ctx, t, A('listen', 0.7 + i * 1.3), x + w / 2, y + h / 2, () => {
        card(ctx, x, y, w, h, C.paper, { stroke: col });
        G.ellipse(ctx, x + 60, y + 60, 38, 38, { fill: col, lw: 4, seed: 65 + i }); txt(ctx, n, x + 60, y + 78, 52, '#fff', { align: 'center' });
        icon(x + w - 120, y + 90);
        fit(ctx, label, x + w / 2, y + 205, w - 50, 44, col, { align: 'center' });
      });
    });
    const talking = clock.phase(t) >= 0 && t < A('listen', 3.2);
    person(ctx, 'boy', 560, FLOOR + 40, 0.8, { mouth: talking ? open(t, 1) : 'smile', eyes: 'happy', look: 0.4 });
    person(ctx, 'teacher', 1360, FLOOR + 40, 0.8, { mouth: t > A('listen', 3.4) ? talk(t) : 'smile', eyes: 'normal', look: -0.5, gesture: t > A('listen', 3.4) ? null : 'think', headRot: 0.04 * Math.sin(t * 2) });
    G.bubble(ctx, 'Мен былай ойлаймын...', 560, 570, 540, 650, t, A('listen', 1.2), A('listen', 3.3), { size: 40 });
    G.bubble(ctx, 'Сіз ... айтқыңыз келді ме?', 1280, 570, 1330, 650, t, A('listen', 3.5), A('listen', 4.9), { size: 40 });
  }

  // ================= 7. Кері байланыс =================
  function feedback(ctx, t) {
    wallBg(ctx);
    heading(ctx, t, 'feedback', '6 · Кері байланыс');
    floor(ctx);
    ['Нақты', 'Уақтылы', 'Құрметті'].forEach((w, i) => {
      popAt(ctx, t, A('feedback', 0.3 + i * 0.5), 450 + i * 300, 235, () => { UI.pill(ctx, 450 + i * 300 - 130, 200, w, { size: 44, h: 78, bg: [C.blue, C.orange, C.purple][i], fg: '#fff' }); });
    });
    // сэндвич қабаттары
    const L = [['1', 'Жақсысын атаңыз', C.green, '#E4F3E6'], ['2', 'Нені жақсартуға болады', C.orange, '#FCEBDD'], ['3', 'Келесі қадам', C.blue, '#E3ECF8']];
    L.forEach(([n, label, col, bg], i) => {
      const t0 = A('feedback', 2 + i * 1.2);
      if (t < t0) return;
      const k = ease.outBounce(clamp((t - t0) / 0.6));
      const y = 340 + i * 175 - (1 - k) * 260;
      ctx.save(); ctx.globalAlpha = clamp((t - t0) * 6);
      card(ctx, 90, y, 980, 150, bg, { stroke: col });
      G.ellipse(ctx, 170, y + 75, 40, 40, { fill: col, lw: 4, seed: 80 + i }); txt(ctx, n, 170, y + 94, 56, '#fff', { align: 'center' });
      fit(ctx, label, 250, y + 94, 780, 60, col);
      ctx.restore();
    });
    // оң жақ: оқушы мен мұғалім
    person(ctx, 'girl', 1330, FLOOR + 40, 0.82, { mouth: 'smile', eyes: 'happy', blush: 0.4 });
    person(ctx, 'teacher', 1640, FLOOR + 40, 0.82, { mouth: talk(t), gesture: t > A('feedback', 3.2) ? 'thumbsUp' : null, eyes: 'happy', look: -0.3 });
    G.bubble(ctx, 'Жарайсың! Бұл жерді нақтылайық.', 1480, 330, 1440, 480, t, A('feedback', 2.4), A('feedback', 5.4), { size: 38 });
  }

  // ================= 8. Қарым-қатынас түрлері =================
  function people(ctx, t) {
    wallBg(ctx);
    heading(ctx, t, 'people', '7 · Оқушы, ата-ана, әріптес');
    floor(ctx);
    const defs = [['Оқушы', 'түсінікті тіл, жылы үн', 'boy', C.orange], ['Ата-ана', 'ашық әрі тұрақты байланыс', 'parent', C.green], ['Әріптес', 'ортақ мақсат, ынтымақ', 'colleague', C.blue]];
    defs.forEach(([name, tip, who, col], i) => {
      const cx = 340 + i * 620, t0 = A('people', 0.4 + i * 1.9);
      if (t < t0) return;
      const k = UI.pop(t, t0, 0.35);
      ctx.save(); ctx.translate(cx, 0); ctx.scale(k, k); ctx.translate(-cx, 0);
      person(ctx, who, cx, 790, 0.78, { mouth: 'smile', eyes: 'happy', gesture: 'wave', blush: 0.3 });
      card(ctx, cx - 280, 170, 560, 120, C.paper, { stroke: col });
      txt(ctx, name, cx, 245, 64, col, { align: 'center' });
      card(ctx, cx - 290, 815, 580, 110, col + '22', { stroke: col });
      fit(ctx, tip, cx, 880, 540, 38, C.ink, { align: 'center' });
      ctx.restore();
    });
    // мұғалім ортада кішкентай, байланыс сызықтарымен
    const pl = clamp((t - A('people', 4.3)) / 1.2);
    if (pl > 0) { arrow(ctx, 380, 520, 820, 520, C.teal, ease.outCubic(pl), 5); arrow(ctx, 1540, 520, 1100, 520, C.teal, ease.outCubic(pl), 5); G.heart(ctx, 960, 500, 2.3); }
  }

  // ================= 9. Кедергілер және шешімдері =================
  const BRICKS = [['Шу', C.purple], ['Стресс', C.rose], ['Тілдік кедергі', C.orange], ['Стереотиптер', C.blue], ['Алаңдау', '#8B8B95']];
  function barriers(ctx, t) {
    wallBg(ctx);
    heading(ctx, t, 'barriers', '8 · Кедергілер және шешімдері');
    floor(ctx);
    const tS = B.solve.t0;
    // тосқауыл
    BRICKS.forEach(([label, col], i) => {
      const t0 = A('barriers', 0.3 + i * 0.85);
      if (t < t0) return;
      const row = i, bx = 700, by = 790 - row * 130, w = 520, h = 118;
      let off = 0, rot = 0, alpha = 1;
      if (t > tS + i * 0.25) { const u = t - tS - i * 0.25; off = u * u * 500; rot = u * (i % 2 ? 0.8 : -0.8); alpha = clamp(1 - u * 0.8); }
      const drop = ease.outBounce(clamp((t - t0) / 0.6));
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(bx + w / 2, by + h / 2 + off - (1 - drop) * 300); ctx.rotate(rot);
      G.rrect(ctx, -w / 2, -h / 2, w, h, 16, { fill: col, lw: 5, seed: 90 + i, hatch: { color: 'rgba(0,0,0,0.15)', gap: 12 } });
      fit(ctx, label, 0, 20, w - 60, 56, '#fff', { align: 'center' });
      ctx.restore();
    });
    const solved = t > tS + 1.5;
    person(ctx, 'teacher', 290, FLOOR + 40, 0.85, { mouth: talk(t), eyes: solved ? 'happy' : 'normal', brows: solved ? 'neutral' : 'worried', gesture: solved ? 'wave' : null });
    person(ctx, 'boy', 1640, FLOOR + 40, 0.85, { mouth: solved ? 'smile' : 'flat', eyes: solved ? 'happy' : 'normal', brows: solved ? 'neutral' : 'worried', gesture: solved ? 'wave' : null, sweat: solved ? 0 : 0.6 });
    // шешімдер
    const sol = [['Қарапайым сөйле', C.green], ['Сұрақ қойып тексер', C.blue], ['Тыныш орта жаса', C.teal]];
    sol.forEach(([label, col], i) => {
      popAt(ctx, t, tS + BAR * (0.4 + i * 1.0), 960, 300 + i * 150, () => {
        card(ctx, 600, 200 + i * 150, 720, 124, '#FFFFFF', { stroke: col });
        UI.check(ctx, 665, 262 + i * 150, 30, clamp((t - tS - BAR * (0.4 + i)) / 0.5), { color: col });
        fit(ctx, label, 725, 280 + i * 150, 560, 52, col);
      });
    });
  }

  // ================= 10. Эмпатия =================
  function empathy(ctx, t) {
    wallBg(ctx);
    heading(ctx, t, 'empathy', '9 · Эмпатия');
    floor(ctx);
    const phase2 = t > A('empathy', 1.8);
    txt(ctx, 'Эмпатия', 960, 260, 120, C.rose, { align: 'center', alpha: fade(t, A('empathy', 0.2)) });
    fit(ctx, 'екінші адамның орнына өзіңді қоя біл', 960, 340, 1400, 60, C.ink, { align: 'center', alpha: fade(t, A('empathy', 0.8)) });
    person(ctx, 'girl', 1330, FLOOR + 40, 0.95, { mouth: phase2 ? 'smile' : 'flat', eyes: phase2 ? 'happy' : 'normal', brows: phase2 ? 'neutral' : 'worried', sweat: phase2 ? 0 : 0.7, blush: phase2 ? 0.5 : 0 });
    person(ctx, 'teacher', 600, FLOOR + 40, 0.95, { mouth: phase2 ? talk(t) : 'smile', eyes: 'happy', gesture: phase2 ? null : 'think', look: 0.4 });
    G.bubble(ctx, 'Тапсырма қиын көрінеді...', 1330, 500, 1330, 610, t, A('empathy', 0.6), A('empathy', 1.8), { size: 40 });
    G.bubble(ctx, 'Түсінемін, бірге қарайық.', 640, 500, 620, 610, t, A('empathy', 2.0), A('empathy', 3.8), { size: 40 });
    if (phase2) for (let i = 0; i < 6; i++) { const tt = (t - A('empathy', 2.0) + i * 0.5) % 3; G.heart(ctx, 960 + Math.sin(tt * 2 + i) * 90 + (i - 3) * 20, 780 - tt * 85, 1 + (i % 3) * 0.3, { fill: i % 2 ? '#E0506A' : '#F28BA0' }); }
  }

  // ================= 11. Цифрлық коммуникация =================
  function digital(ctx, t) {
    wallBg(ctx);
    heading(ctx, t, 'digital', '10 · Цифрлық коммуникация');
    const t0 = ev.digital;
    UI.phone(ctx, 600, 560, 760, (c, w, h, tt) => {
      c.fillStyle = '#F2F5F7'; c.fillRect(0, 0, w, h);
      c.fillStyle = C.teal; c.fillRect(0, 0, w, 100);
      UI.text(c, 'Сынып чаты', w / 2, 76, { size: 24, color: '#fff', align: 'center' });
      UI.chat(c, w, [
        { t: A('digital', 0.8), who: 'them', text: 'Сәлеметсіз бе! Ертең сабақ 10:00-де.' },
        { t: A('digital', 2.2), who: 'me', text: 'Рахмет, түсінікті!' },
        { t: A('digital', 3.4), who: 'them', text: 'Сұрақ болса жазыңыз 🙂' },
      ], tt, { y0: 130, size: 25 });
    }, t);
    const tips = [['Қысқа әрі айқын', C.blue], ['Сыпайы тон', C.rose], ['Жауап беру уақытын келісу', C.green]];
    tips.forEach(([label, col], i) => {
      popAt(ctx, t, A('digital', 1 + i * 1.3), 1330, 330 + i * 190, () => {
        card(ctx, 900, 250 + i * 190, 900, 150, '#FFFFFF', { stroke: col });
        UI.check(ctx, 975, 325 + i * 190, 34, clamp((t - A('digital', 1 + i * 1.3)) / 0.5), { color: col });
        fit(ctx, label, 1040, 345 + i * 190, 720, 54, col);
      });
    });
  }

  // ================= 12. Қорытынды =================
  function summary(ctx, t) {
    wallBg(ctx);
    heading(ctx, t, 'summary', '11 · Қорытынды: 5 қадам');
    floor(ctx);
    const L = ['Анық сөйле', 'Мұқият тыңда', 'Құрметпен кері байланыс бер', 'Эмпатия таныт', 'Диалогқа ашық бол'];
    const cols = [C.blue, C.orange, C.green, C.rose, C.purple];
    L.forEach((label, i) => {
      popAt(ctx, t, A('summary', 0.6 + i * 0.75), 700, 220 + i * 128, () => {
        card(ctx, 110, 175 + i * 128, 1180, 108, '#FFFFFF', { stroke: cols[i] });
        G.ellipse(ctx, 190, 229 + i * 128, 36, 36, { fill: cols[i], lw: 4, seed: 100 + i }); txt(ctx, String(i + 1), 190, 246 + i * 128, 48, '#fff', { align: 'center' });
        fit(ctx, label, 255, 245 + i * 128, 960, 52, C.ink);
        UI.check(ctx, 1230, 229 + i * 128, 28, clamp((t - A('summary', 0.6 + i * 0.75) - 0.2) / 0.5), { color: cols[i] });
      });
    });
    person(ctx, 'teacher', 1620, FLOOR + 40 - hop(t, 8), 1.1, { mouth: talk(t), gesture: t > A('summary', 4) ? 'thumbsUp' : 'point', eyes: 'happy' });
  }

  // ================= 13. Қорытынды экран =================
  function end(ctx, t) {
    wallBg(ctx, '#FFF4DA');
    G.rays(ctx, 960, 520, { n: 36, r0: 150, r1: 1600, color: 'rgba(242,184,75,0.35)', lw: 18, seed: 9, spin: (t - ev.end) * 0.2 });
    floor(ctx);
    const k = stamp(t, ev.end);
    ctx.save(); ctx.translate(960, 230); ctx.scale(k, k);
    txt(ctx, 'Назарларыңызға рақмет!', 0, 0, 110, C.teal, { align: 'center', stroke: C.ink, strokeW: 12 });
    ctx.restore();
    fit(ctx, 'Тиімді коммуникация — сапалы білімнің кілті', 960, 330, 1500, 62, C.ink, { align: 'center', alpha: fade(t, ev.end + 0.6) });
    person(ctx, 'boy', 480, FLOOR + 40 - hop(t, 18), 0.95, { gesture: 'cheer', mouth: 'open', eyes: 'happy' });
    person(ctx, 'teacher', 800, FLOOR + 40 - hop(t + BEAT / 2, 14), 1.05, { gesture: 'wave', mouth: talk(t), eyes: 'happy' });
    person(ctx, 'girl', 1120, FLOOR + 40 - hop(t, 18), 0.95, { gesture: 'cheer', mouth: 'open', eyes: 'happy' });
    person(ctx, 'parent', 1420, FLOOR + 40 - hop(t + BEAT / 2, 14), 0.95, { gesture: 'clap', mouth: 'smile', eyes: 'happy' });
    person(ctx, 'colleague', 1700, FLOOR + 40 - hop(t, 14), 0.95, { gesture: 'clap', mouth: 'smile', eyes: 'happy' });
    if (t >= ev.end) G.confetti(ctx, t, ev.end, { n: 160, seed: 6 });
  }

  const SECTIONS = { intro, define, model, why, verbal, listen, feedback, people, barriers, empathy, digital, summary, end };
  Studio.film({
    fadeOut: 1.2,
    async init() { VO = await Studio.loadJSON('out/voice.json'); SUBS = Subs.fromVoice(VO, { maxWords: 5 }); },
    draw(ctx, t) {
      G.setStyle('paper');
      const sec = sectionOf(t);
      const cut = ev[sec];
      const shake = t >= cut ? 8 * Math.exp(-(t - cut) * 8) : 0;
      ctx.save(); ctx.translate(U.noise1(t * 30, 1) * shake, U.noise1(t * 30, 2) * shake);
      SECTIONS[sec](ctx, t);
      ctx.restore();
      if (t >= cut && t - cut < 0.18) { ctx.fillStyle = `rgba(255,255,255,${0.6 * (1 - (t - cut) / 0.18)})`; ctx.fillRect(0, 0, W, H); }
      // жалпы прогресс сызығы
      ctx.fillStyle = C.teal; ctx.fillRect(0, 0, W * clamp(t / S.DURATION), 8);
      Subs.draw(ctx, t, SUBS, { style: 'box', size: 48, fam: 'Inter' });
    },
  });
})();
