// «Білім беру саласындағы тиімді коммуникация негіздері» (16:9, ~3 мин): қазақ тіліндегі түсіндірме анимация.
// Бір score.js: музыканы да, суретті де, дикторлық мәтінді де осы уақыт кестесі басқарады.
(function () {
  const node = typeof require !== 'undefined';
  const U = node ? require('./engine/util') : globalThis.U;
  const MU = node ? require('./engine/music') : globalThis.MUSIC;
  const { m, makeClock, makeChords } = MU;

  const FPS = 30;
  const FORMAT = '16:9';
  const [W, H] = U.formatSize(FORMAT);
  const SAFE = U.safeArea(W, H);
  const clock = makeClock({ bpm: 90, offset: 0.4 });
  const { T, BEAT } = clock;

  // дикторлық мәтін: әр жолға берілген тактілер саны (жол ұзақтығы өлшенген, +ауа)
  const LINES = [
    ['intro', 3, 'Білім беру саласындағы тиімді коммуникация негіздері.'],
    ['define', 4, 'Коммуникация дегеніміз — адамдар арасындағы ақпарат, ой және сезім алмасу процесі.'],
    ['model', 4, 'Оның бес құрамдас бөлігі бар: жіберуші, хабарлама, арна, қабылдаушы және кері байланыс.'],
    ['model2', 4, 'Мұғалім ойын айтады, оқушы оны қабылдайды, ал кері байланыс хабардың шынымен түсінілгенін көрсетеді.'],
    ['why', 5, 'Білім беруде коммуникация сабақтың жүрегі. Ол сенім тудырады, оқушыны ынталандырады және оқу нәтижесін арттырады.'],
    ['verbal', 5, 'Коммуникация вербалды және вербалсыз болады. Сөзіміз бен үнімізден басқа, ым-ишара, жүзіміз және көзқарасымыз да хабар жеткізеді.'],
    ['verbal2', 3, 'Сөз бен дене тілі бір-біріне қайшы келмесе, хабар сенімді естіледі.'],
    ['listen', 5, 'Белсенді тыңдау — тиімді қарым-қатынастың негізі. Көзге қараңыз, сөзді бөлмеңіз, айтқанын өз сөзіңізбен қайталап нақтылаңыз.'],
    ['feedback', 6, 'Кері байланыс нақты, уақтылы және құрметті болуы тиіс. Алдымен жақсысын атаңыз, содан кейін нені жақсартуға болатынын айтып, келесі қадамды ұсыныңыз.'],
    ['people', 6, 'Оқушымен қарым-қатынаста түсінікті тіл мен жылы үн қолданыңыз. Ата-анамен ашық әрі тұрақты байланыста болыңыз. Әріптестермен ортақ мақсат үшін ынтымақтасыңыз.'],
    ['barriers', 5, 'Коммуникацияға кедергілер де жиі кездеседі: шу, стресс, тілдік түсінбеушілік, стереотиптер және назар аудармау.'],
    ['solve', 4, 'Оларды жеңу үшін қарапайым сөйлеңіз, сұрақ қойып тексеріңіз және қарым-қатынас үшін тыныш орта жасаңыз.'],
    ['empathy', 4, 'Эмпатия — екінші адамның орнына өзіңізді қоя білу. Ол оқушы мен мұғалім арасындағы сенімді күшейтеді.'],
    ['digital', 5, 'Цифрлық ортада да коммуникация маңызды. Хабарламаңыз қысқа әрі айқын болсын, сыпайы тонды сақтаңыз және жауап беру уақытын келісіңіз.'],
    ['summary', 5, 'Қорытындылай келе: анық сөйлеңіз, мұқият тыңдаңыз, құрметпен кері байланыс беріңіз, эмпатия танытыңыз және әрдайым диалогқа ашық болыңыз.'],
    ['end', 3, 'Тиімді коммуникация — сапалы білімнің кілті. Назарларыңызға рақмет!'],
  ];
  const B = {}; // әр бөлімнің бастапқы такті мен ұзақтығы
  let bar = 0;
  for (const [id, n] of LINES) { B[id] = { bar, n, t0: T(bar), t1: T(bar + n) }; bar += n; }
  const TOTAL_BARS = bar;
  const DURATION = T(TOTAL_BARS) + 1.6;

  // бөлімдер (сурет бөлімдері); кейбіреуі екі жолды біріктіреді
  const span = (a, b) => [B[a].t0, B[b].t1];
  const S = {
    intro: [0, B.intro.t1], define: span('define', 'define'), model: span('model', 'model2'), why: span('why', 'why'),
    verbal: span('verbal', 'verbal2'), listen: span('listen', 'listen'), feedback: span('feedback', 'feedback'), people: span('people', 'people'),
    barriers: span('barriers', 'solve'), empathy: span('empathy', 'empathy'), digital: span('digital', 'digital'), summary: span('summary', 'summary'), end: [B.end.t0, DURATION],
  };
  S.end[1] = DURATION;

  const loop = ['C', 'G', 'Am', 'F'];
  const { chords, chordAt } = makeChords(clock, {
    C: { notes: ['E3', 'G3', 'C4'], bass: 'C2' }, G: { notes: ['D3', 'G3', 'B3'], bass: 'G1' }, Am: { notes: ['E3', 'A3', 'C4'], bass: 'A1' }, F: { notes: ['F3', 'A3', 'C4'], bass: 'F1' },
  }, [...Array.from({ length: TOTAL_BARS }, (_, b) => [b, 0, 4, loop[b % 4]]), [TOTAL_BARS, 0, 4, 'C']]);

  const vo = LINES.map(([id, , text]) => ({ at: B[id].t0 + BEAT * 0.5, text, who: 'narrator', voice: 'kk', rate: 135 }));
  const ev = {}; // бөлім атаулары кадрда «штамп» болып түседі
  Object.entries(S).forEach(([k, [a]]) => { ev[k] = a; });
  const markers = {};
  ['define', 'model', 'verbal', 'listen', 'feedback', 'barriers', 'empathy', 'summary'].forEach((k) => { markers[k] = { t: ev[k], sync: 'av' }; });

  const SCORE = { FPS, FORMAT, W, H, SAFE, DURATION, clock, T, BEAT, S, B, TOTAL_BARS, m, chords, chordAt, vo, ev, markers };
  if (node) module.exports = SCORE; else globalThis.SCORE = SCORE;
})();
