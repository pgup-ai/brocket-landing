const STAGE_NAMES = [
  '01 · UPLOAD',
  '02 · UNDERSTAND',
  '03 · SCRIPT',
  '04 · FIRST CUT',
  '05 · EDIT',
  '06 · SHIP',
];

class BrocketLanding {
  constructor() {
    this.props = {
      accent: "#F2BB55",
      heroTypeface: "Wide (mockup-style)",
      calmMotion: false,
    };
  }

  bkEnsure() {
    // All driver state lives on a window singleton so it survives instance
    // swaps (stream-complete remounts, hot reloads). No bare instance fields —
    // they can collide with runtime-managed properties.
    const S = (window.__bkLand = window.__bkLand || {
      cur: 0, target: 0, on: false, warned: false,
      lastStage: -1, lastDur: '', lastPct: '', calm: false,
    });
    S.calm = (this.props.calmMotion ?? false) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Brand tweaks — re-applied on every mount/update so prop changes land.
    const HOV = { '#F7C868': '#FBD98F', '#F2BB55': '#F7CB74', '#E8AC4E': '#F2C06A', '#F59E0B': '#FBBF24' };
    const acc = this.props.accent ?? '#F2BB55';
    document.body.style.setProperty('--acc', acc);
    document.body.style.setProperty('--acc-h', HOV[acc] ?? acc);
    const wide = String(this.props.heroTypeface ?? 'Geist (current)').indexOf('Wide') === 0;
    document.body.style.setProperty('--hero-font', wide ? 'Archivo, Geist, sans-serif' : 'Geist, Inter, system-ui, sans-serif');
    document.body.style.setProperty('--hero-track', wide ? '-0.02em' : '-0.045em');
    document.body.style.setProperty('--hero-weight', wide ? '700' : '600');
    document.body.style.setProperty('--hero-stretch', wide ? '125%' : '100%');

    if (S.on) return;
    S.on = true;

    const byId = (id) => document.getElementById(id);
    const measure = () => {
      const sec = byId('how');
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      S.target = Math.min(1, Math.max(0, travel > 0 ? -r.top / travel : 0));
    };
    const fit = () => {
      const vw = window.innerWidth, vh = window.innerHeight;
      // Portrait phones/tablets get their own stage; landscape gets desktop.
      const portrait = vh > vw || vw < 700;
      document.body.dataset.view = portrait ? 'p' : 'l';
      S.mob = !portrait && vw < 900;
      const cv = byId('bk-canvas');
      if (cv) {
        cv.style.setProperty('--fit', Math.min((vw * 0.96) / 1100, ((vh - 72) * 0.95) / 680, 1.2).toFixed(4));
        cv.style.setProperty('--ms', S.mob ? '1.3' : '1');
      }
      const pcv = byId('bk-pcv');
      if (pcv) {
        pcv.style.setProperty('--pfit', Math.min((vw * 0.97) / 420, ((vh - 64) * 0.97) / 780, 1.15).toFixed(4));
      }
      measure();
    };
    const applyFn = BrocketLanding.prototype.apply;
    let frame = 0;
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(loop);
    };
    const loop = () => {
      frame = 0;
      try {
        measure();
        const mode = S.calm ? "calm" : "full";
        if (document.body.dataset.motion !== mode) document.body.dataset.motion = mode;
        const k = S.calm ? 1 : 0.14;
        S.cur += (S.target - S.cur) * k;
        if (Math.abs(S.target - S.cur) < 0.0004) S.cur = S.target;
        applyFn(S.cur, S);
      } catch (err) {
        if (!S.warned) { console.warn("brocket-landing driver error", err); S.warned = true; }
      }
      if (S.cur !== S.target) schedule();
    };
    window.addEventListener("scroll", () => { measure(); schedule(); }, { passive: true });
    window.addEventListener("resize", () => { fit(); schedule(); }, { passive: true });
    fit();
    schedule();
  }


  apply(p, ST) {
    // Vars live on <body> so BOTH stage canvases (landscape + portrait) inherit them.
    const el = document.body;
    if (!el) return;
    const C = (v, a, b) => (v < a ? a : v > b ? b : v);
    const S = (x, a, b) => C((x - a) / (b - a), 0, 1);
    const EO = (t) => 1 - Math.pow(1 - t, 3);
    const EIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const L = (a, b, t) => a + (b - a) * t;
    const V = (n, v) => el.style.setProperty(n, v);
    const fmt = (s) => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
    const cachedNode = (key, id) => {
      const current = ST[key];
      if (current?.isConnected) return current;
      return (ST[key] = document.getElementById(id));
    };

    // header hairline (must live on an ancestor of the fixed header)
    document.body.style.setProperty('--hdr', S(p, 0.01, 0.03).toFixed(3));

    // hero + cue
    const heroOut = S(p, 0.03, 0.10);
    V('--hero-o', (1 - heroOut).toFixed(3));
    V('--hero-y', (-heroOut * 44).toFixed(1) + 'px');
    V('--cue-o', (1 - S(p, 0.02, 0.06)).toFixed(3));
    V('--hro', (1 - S(p, 0.02, 0.075)).toFixed(3));

    // stage headlines
    const H = [[0.10, 0.26], [0.26, 0.42], [0.42, 0.58], [0.58, 0.74], [0.74, 0.88], [0.88, 2]];
    H.forEach(([a, b], i) => {
      const tin = EO(S(p, a + 0.005, a + 0.055));
      const tout = b > 1 ? 0 : S(p, b - 0.035, b);
      V('--h' + (i + 1) + 'o', (tin * (1 - tout)).toFixed(3));
      V('--h' + (i + 1) + 'y', ((1 - tin) * 26 - tout * 26).toFixed(1) + 'px');
    });

    // card wrapper anchors [p, x, y, scale]
    const A = [[0, 0, ST.mob ? 152 : 120, 0.50], [0.13, 0, 95, 0.55], [0.29, -120, 30, 0.66], [0.45, 150, 10, 0.60], [0.61, 0, -75, 0.58], [0.77, -120, -35, 0.56], [0.93, 0, -30, 0.98]];
    let x = A[A.length - 1][1], y = A[A.length - 1][2], s = A[A.length - 1][3];
    for (let i = 0; i < A.length - 1; i++) {
      if (p <= A[i + 1][0] || i === A.length - 2) {
        const t = EIO(S(p, A[i][0], A[i + 1][0]));
        x = L(A[i][1], A[i + 1][1], t); y = L(A[i][2], A[i + 1][2], t); s = L(A[i][3], A[i + 1][3], t);
        break;
      }
    }
    if (p >= A[A.length - 1][0]) { x = A[A.length - 1][1]; y = A[A.length - 1][2]; s = A[A.length - 1][3]; }
    V('--cw-x', x.toFixed(1) + 'px'); V('--cw-y', y.toFixed(1) + 'px'); V('--cw-s', s.toFixed(4));

    // S1 upload
    const dzo = EO(S(p, 0.105, 0.135)) * (1 - S(p, 0.235, 0.26));
    V('--dz-o', dzo.toFixed(3));
    V('--dz-s', (1.06 - EO(S(p, 0.105, 0.15)) * 0.06).toFixed(4));
    V('--upb-o', (EO(S(p, 0.12, 0.145)) * (1 - S(p, 0.24, 0.265))).toFixed(3));
    const up = EO(S(p, 0.14, 0.215));
    V('--upb-w', (up * 100).toFixed(1) + '%');
    V('--upok-o', EO(S(p, 0.215, 0.235)).toFixed(3));
    const pctTxt = Math.round(up * 100) + '%';
    const upEl = cachedNode('upEl', 'bk-uppct');
    const pupEl = cachedNode('pupEl', 'bk-puppct');
    if (pctTxt !== ST.lastPct || upEl?.textContent !== pctTxt || pupEl?.textContent !== pctTxt) {
      if (upEl) upEl.textContent = pctTxt;
      if (pupEl) pupEl.textContent = pctTxt;
      ST.lastPct = pctTxt;
    }

    // S2 understand
    const scano = EO(S(p, 0.262, 0.276)) * (1 - S(p, 0.385, 0.40));
    V('--scan-o', scano.toFixed(3));
    V('--scan-x', S(p, 0.27, 0.385).toFixed(4));
    V('--ticks-w', (S(p, 0.27, 0.385) * 100).toFixed(1) + '%');
    V('--sil-o', (EO(S(p, 0.36, 0.39)) * 0.9).toFixed(3));
    const chOut = S(p, 0.402, 0.425);
    V('--ch1', (EO(S(p, 0.295, 0.325)) * (1 - chOut)).toFixed(3));
    V('--ch2', (EO(S(p, 0.322, 0.352)) * (1 - chOut)).toFixed(3));
    V('--ch3', (EO(S(p, 0.349, 0.379)) * (1 - chOut)).toFixed(3));
    V('--strip-o', (EO(S(p, 0.265, 0.29)) * (1 - S(p, 0.60, 0.64) * 0.75) * (1 - S(p, 0.74, 0.775))).toFixed(3));

    // S3 script
    const scrOut = S(p, 0.565, 0.59);
    V('--scr-o', (EO(S(p, 0.425, 0.455)) * (1 - scrOut)).toFixed(3));
    V('--scr-x', ((1 - EO(S(p, 0.425, 0.455))) * -36).toFixed(1) + 'px');
    V('--ln1', EO(S(p, 0.445, 0.48)).toFixed(3));
    V('--ln2', EO(S(p, 0.475, 0.51)).toFixed(3));
    V('--ln3', EO(S(p, 0.505, 0.54)).toFixed(3));
    V('--con-o', (EO(S(p, 0.455, 0.48)) * (1 - S(p, 0.565, 0.588))).toFixed(3));
    V('--c1', (1 - EO(S(p, 0.455, 0.505))).toFixed(4));
    V('--c2', (1 - EO(S(p, 0.485, 0.535))).toFixed(4));
    V('--c3', (1 - EO(S(p, 0.515, 0.556))).toFixed(4));

    // segments: strip highlight -> cut slot (+ edit shrink on sg2/sg3/outro cap)
    const shrink = EIO(S(p, 0.805, 0.835));
    const cutFade = 1 - S(p, 0.885, 0.905);
    const SEG = [
      { i: 1, x0: 345, w0: 74, x1: 400, w1: 92, f: [0.595, 0.655], gin: 0.46 },
      { i: 2, x0: 520, w0: 96, x1: 496, w1: 108, f: [0.62, 0.68], gin: 0.49 },
      { i: 3, x0: 685, w0: 80, x1: 608, w1: 92, f: [0.645, 0.705], gin: 0.52 },
    ];
    SEG.forEach((g) => {
      const t = EIO(S(p, g.f[0], g.f[1]));
      let gx = L(g.x0, g.x1, t), gw = L(g.w0, g.w1, t);
      if (g.i === 2) gw = L(gw, 84, shrink);
      if (g.i === 3) gx = L(gx, 584, shrink);
      V('--sg' + g.i + 'x', gx.toFixed(1) + 'px');
      V('--sg' + g.i + 'y', L(541, 598, t).toFixed(1) + 'px');
      V('--sg' + g.i + 'w', gw.toFixed(1) + 'px');
      V('--sg' + g.i + 'h', L(8, 26, t).toFixed(1) + 'px');
      V('--sg' + g.i + 'r', L(3, 6, t).toFixed(1) + 'px');
      V('--sg' + g.i + 'o', (EO(S(p, g.gin, g.gin + 0.03)) * cutFade).toFixed(3));
    });
    V('--sglbl', (EO(S(p, 0.68, 0.71)) * cutFade).toFixed(3));
    V('--capo-x', L(704, 680, shrink).toFixed(1) + 'px');
    V('--cut-o', (EO(S(p, 0.60, 0.635)) * cutFade).toFixed(3));

    // duration counter
    let dur = 312;
    if (p >= 0.615) dur = L(312, 31, EO(S(p, 0.615, 0.70)));
    if (p >= 0.805) dur = L(31, 28, EIO(S(p, 0.805, 0.835)));
    const durTxt = fmt(dur);
    const durEl = cachedNode('durEl', 'bk-dur');
    const pdurEl = cachedNode('pdurEl', 'bk-pdur');
    if (durTxt !== ST.lastDur || durEl?.textContent !== durTxt || pdurEl?.textContent !== durTxt) {
      if (durEl) durEl.textContent = durTxt;
      if (pdurEl) pdurEl.textContent = durTxt;
      ST.lastDur = durTxt;
    }

    // card faces + overlays
    V('--face-t', (EO(S(p, 0.585, 0.612)) * (1 - S(p, 0.652, 0.682))).toFixed(3));
    V('--face-o', EO(S(p, 0.895, 0.928)).toFixed(3));
    V('--cap-o', (EO(S(p, 0.66, 0.685)) * (1 - S(p, 0.885, 0.902))).toFixed(3));
    V('--foc-o', (EO(S(p, 0.675, 0.70)) * (1 - S(p, 0.885, 0.90))).toFixed(3));
    V('--red-o', (EO(S(p, 0.845, 0.865)) * (1 - S(p, 0.895, 0.915))).toFixed(3));
    V('--play-w', (S(p, 0.93, 1.0) * 100).toFixed(1) + '%');

    // S5 edit chrome
    const erOut = 1 - S(p, 0.88, 0.90);
    V('--er-o', (EO(S(p, 0.745, 0.775)) * erOut).toFixed(3));
    V('--er-x', ((1 - EO(S(p, 0.745, 0.775))) * 32).toFixed(1) + 'px');
    V('--tp-o', (EO(S(p, 0.752, 0.782)) * erOut).toFixed(3));
    V('--v1-o', (EO(S(p, 0.755, 0.78)) * (1 - S(p, 0.815, 0.832)) * erOut).toFixed(3));
    V('--v2-o', (EO(S(p, 0.822, 0.845)) * erOut).toFixed(3));

    // cursor
    const cmove = EIO(S(p, 0.775, 0.80));
    V('--cur-x', L(640, 890, cmove).toFixed(1) + 'px');
    V('--cur-y', L(430, 356, cmove).toFixed(1) + 'px');
    V('--cur-o', (EO(S(p, 0.765, 0.778)) * (1 - S(p, 0.84, 0.852))).toFixed(3));
    const click = S(p, 0.80, 0.816);
    V('--cur-ro', (click > 0 && click < 1 ? 1 - click : 0).toFixed(3));
    V('--cur-rs', (0.4 + click * 1.5).toFixed(3));
    const shPress = click > 0 && click < 1 ? 1 : shrink > 0 && shrink < 1 ? 1 : 0;
    V('--sh-bd', shPress ? 'var(--acc,#F2BB55)' : 'rgba(255,255,255,0.14)');
    V('--sh-bg', shPress ? 'color-mix(in srgb, var(--acc,#F2BB55) 14%, transparent)' : 'transparent');

    // S6 ship
    V('--glow-o', EO(S(p, 0.90, 0.95)).toFixed(3));
    V('--shl-o', EO(S(p, 0.915, 0.945)).toFixed(3));
    V('--cta-o', EO(S(p, 0.932, 0.962)).toFixed(3));

    // progress rail
    V('--rail-o', S(p, 0.05, 0.09).toFixed(3));
    const W = [[0.10, 0.26], [0.26, 0.42], [0.42, 0.58], [0.58, 0.74], [0.74, 0.88], [0.88, 1.0]];
    W.forEach(([a, b], i) => V('--rf' + (i + 1), (S(p, a, b) * 100).toFixed(1) + '%'));
    let stage = -1;
    W.forEach(([a, b], i) => { if (p >= a) stage = i; });
    const txt = stage >= 0 ? STAGE_NAMES[stage] : '';
    const lblEl = cachedNode('lblEl', 'bk-stglbl');
    const plblEl = cachedNode('plblEl', 'bk-pstglbl');
    if (stage !== ST.lastStage || lblEl?.textContent !== txt || plblEl?.textContent !== txt) {
      if (lblEl) lblEl.textContent = txt;
      if (plblEl) plblEl.textContent = txt;
      ST.lastStage = stage;
    }

    // ---- portrait stage geometry (shares every opacity/timing var above) ----
    const PA = [[0, 430, 0.92], [0.13, 385, 0.96], [0.29, 355, 0.90], [0.45, 340, 0.86], [0.61, 335, 0.88], [0.77, 330, 0.86], [0.93, 350, 1.0]];
    let py = PA[PA.length - 1][1], pcs = PA[PA.length - 1][2];
    for (let i = 0; i < PA.length - 1; i++) {
      if (p <= PA[i + 1][0] || i === PA.length - 2) {
        const t = EIO(S(p, PA[i][0], PA[i + 1][0]));
        py = L(PA[i][1], PA[i + 1][1], t); pcs = L(PA[i][2], PA[i + 1][2], t);
        break;
      }
    }
    if (p >= PA[PA.length - 1][0]) { py = PA[PA.length - 1][1]; pcs = PA[PA.length - 1][2]; }
    V('--pcw-y', py.toFixed(1) + 'px');
    V('--pcw-s', pcs.toFixed(4));
    const PSEG = [
      { i: 1, x0: 88, w0: 42, x1: 104, w1: 64, f: [0.595, 0.655] },
      { i: 2, x0: 195, w0: 53, x1: 172, w1: 76, f: [0.62, 0.68] },
      { i: 3, x0: 290, w0: 46, x1: 252, w1: 64, f: [0.645, 0.705] },
    ];
    PSEG.forEach((g) => {
      const t = EIO(S(p, g.f[0], g.f[1]));
      let gx = L(g.x0, g.x1, t), gw = L(g.w0, g.w1, t);
      if (g.i === 2) gw = L(gw, 58, shrink);
      if (g.i === 3) gx = L(gx, 234, shrink);
      V('--psg' + g.i + 'x', gx.toFixed(1) + 'px');
      V('--psg' + g.i + 'y', L(648, 706, t).toFixed(1) + 'px');
      V('--psg' + g.i + 'w', gw.toFixed(1) + 'px');
      V('--psg' + g.i + 'h', L(7, 20, t).toFixed(1) + 'px');
      V('--psg' + g.i + 'r', L(3, 5, t).toFixed(1) + 'px');
    });
    V('--pcapo-x', L(320, 302, shrink).toFixed(1) + 'px');
    V('--pcur-x', L(300, 95, cmove).toFixed(1) + 'px');
    V('--pcur-y', L(430, 588, cmove).toFixed(1) + 'px');
  }

}

const landing = new BrocketLanding();
landing.bkEnsure();

document.querySelectorAll("[data-bk-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const jumpValue = button.dataset.bkJump?.trim();
    const jump = Number(jumpValue);
    if (!jumpValue || !Number.isFinite(jump)) return;
    const section = document.getElementById("how");
    if (!section) return;
    const scroller = document.scrollingElement || document.documentElement;
    const top = scroller.scrollTop + section.getBoundingClientRect().top;
    const travel = Math.max(0, section.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, jump));
    scroller.scrollTop = top + progress * travel;
  });
});
