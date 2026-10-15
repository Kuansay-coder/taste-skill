// МУЗЫКА: бәрі score.js оқиғаларынан жасалады.   node song.js   (STEMS=1 — stem-дер, LUFS=-14 — қаттылық)
// Жұмсақ lo-fi аңғар, әр бөлім басында қоңырау, қорытындыда мәнерлі аккорд; дикторға қарай музыка басылады.
const path = require('path');
const { SR, Bus, reverb } = require('./engine/audio/dsp');
const I = require('./engine/audio/instruments');
const MIX = require('./engine/audio/mix');
const Genre = require('./engine/audio/genres');
const Voice = require('./engine/audio/voice');
const sc = require('./score');
const { T, BEAT, DURATION, m, ev, clock, chordAt, B, TOTAL_BARS } = sc;

const N = Math.ceil(DURATION * SR);
const bus = () => new Bus(N);
const buses = { drums: bus(), bass: bus(), pad: bus(), keys: bus() };
const lead = bus(), fx = bus(), verb = bus();

// кіріспе: музыкалық қорапша
[['E5', 0], ['G5', 0.5], ['C6', 1], ['B5', 2], ['G5', 2.5], ['E5', 3], ['D5', 3.5], ['C5', 4]].forEach(([n, b]) => { const x = I.musicBox(m(n)); lead.addMono(x, T(0, b), 0.2, 0.2); verb.addMono(x, T(0, b), 0.2); });
// негізгі аңғар
Genre.play('lofi', { clock, from: 0, to: B.intro.n, chordAt, buses, drums: false, bassline: false, gain: 0.8 });
Genre.play('lofi', { clock, from: B.intro.n, to: TOTAL_BARS - B.end.n, chordAt, buses, gain: 0.7 });
Genre.play('lofi', { clock, from: TOTAL_BARS - B.end.n, to: TOTAL_BARS, chordAt, buses, drums: false, gain: 0.8 });

// әр бөлімнің басында: «штамп» дыбысы + қоңырау
Object.entries(sc.S).forEach(([k, [t0]], i) => {
  fx.addMono(I.thud(90, 0.1), t0, 0.5);
  fx.addMono(I.woodTick(0.9), t0, 0.35);
  const x = I.bell(m(['C6', 'E6', 'G6'][i % 3]), 1.2, 1.2, 2.5); lead.addMono(x, t0 + 0.02, 0.1, 0.15); verb.addMono(x, t0 + 0.02, 0.1);
});
// қорытынды: жылы аккорд пен аз ғана «конфетти»
for (const n of [m('C4'), m('E4'), m('G4'), m('C5')]) { const { L, R } = I.padNote(n, 3.2, { attack: 0.01, release: 1.5 }); lead.addStereo(L, R, T(TOTAL_BARS), 0.14); }
fx.addMono(I.crash(3), B.end.t0, 0.2);

// дикторлық мәтін: ElevenLabs қазақ дауысы (Айжан), дайын MP3 файлдары voice/ қалтасында
const fs = require('fs');
const { OnePole } = require('./engine/audio/dsp');
const clean = (s) => String(s).replace(/\s+/g, ' ').trim();
const kkSyl = (w) => Math.max(1, (String(w).toLowerCase().match(/[аәеёиіоөуұүыэюя]+/g) || []).length);
const energy = (x) => { const hop = SR / 100, e = new Float32Array(Math.floor(x.length / hop)); for (let i = 0; i < e.length; i++) { let q = 0; for (let j = 0; j < hop; j++) { const v = x[i * hop + j]; q += v * v; } e[i] = Math.sqrt(q / hop); } return e; };
const trim = (x) => { const e = energy(x), pk = e.reduce((a, v) => Math.max(a, v), 0); let a = 0, b = e.length; while (a < b && e[a] < pk * 0.02) a++; while (b > a && e[b - 1] < pk * 0.02) b--; return x.slice(Math.max(0, (a - 3) * SR / 100), Math.min(x.length, (b + 3) * SR / 100)); };
const vo = (() => {
  const placed = sc.vo.map((l, i) => {
    const audio = trim(Voice.decode(path.join(__dirname, 'voice', `n${String(i + 1).padStart(2, '0')}.mp3`)));
    const ws = clean(l.text).split(' ').filter((w) => /[\p{L}\p{N}]/u.test(w));
    const words = Voice.fit(audio, ws, ws.map(kkSyl)).map((w) => ({ w: w.w, t: +(l.at + w.t).toFixed(3), end: +(l.at + w.end).toFixed(3) }));
    return { l, audio, dur: audio.length / SR, words };
  });
  const bus = new Bus(N), hp = new OnePole();
  for (const p of placed) {
    if (p.l.at + p.dur > DURATION - 0.2) throw new Error(`voice line at ${p.l.at} ends after the film`);
    let q = 0, c = 0; for (let i = 0; i < p.audio.length; i++) if (Math.abs(p.audio[i]) > 0.01) { q += p.audio[i] * p.audio[i]; c++; }
    const g = c ? Math.min(6, 0.12 / Math.sqrt(q / c)) : 0;
    const x = new Float32Array(p.audio.length);
    for (let i = 0; i < x.length; i++) x[i] = hp.hp(p.audio[i] * g, 90);
    bus.addMono(x, p.l.at, 1, 0);
  }
  const out = { engine: 'elevenlabs', lines: placed.map((p) => ({ t: +p.l.at.toFixed(3), end: +(p.l.at + p.dur).toFixed(3), text: clean(p.l.text), who: p.l.who, words: p.words })), mouth: Voice.mouthTrack(bus, 30) };
  fs.writeFileSync(path.join(__dirname, 'out', 'voice.json'), JSON.stringify(out));
  out.bus = bus;
  return out;
})();
const music = [buses.drums, buses.bass, buses.pad, buses.keys, lead];
MIX.duck(music, vo.bus, { depth: 0.6 });

const room = reverb(verb, { room: 0.7, damp: 0.4 });
const stems = { ...buses, lead, fx, voice: vo.bus, verb: room };
const GAIN = { drums: 0.7, bass: 0.7, pad: 0.9, keys: 0.9, lead: 1, fx: 0.8, voice: 1.9, verb: 0.4 };
const mix = MIX.mixdown(stems, GAIN, { stemDir: process.env.STEMS ? path.join(__dirname, 'out') : null });
MIX.highpass(mix, 28);
MIX.fadeOut(mix, DURATION - 1.5, DURATION);
const res = MIX.master(mix, 0.8, undefined, { lufs: process.env.LUFS ? +process.env.LUFS : -14 });
MIX.writeWav(path.join(__dirname, 'out', 'music.wav'), mix);
console.log(`out/music.wav  ${DURATION.toFixed(1)}s  ${res.lufs.toFixed(1)} LUFS  voice: ${vo.engine}`);
