///widget interactiv pt FFT si NTT
///4 tab-uri: semnale, butterfly, polinoame, compresie DCT (JPEG-like)
///se apeleaza dupa ce marked.parse() populeaza #theme3-body

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
.cbm3-widget { margin-top: 3.5rem; border-top: 2px solid var(--accent); padding-top: 2.5rem; }
.cbm3-title  { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text); margin-bottom: 0.35rem; }
.cbm3-sub    { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem; }
.cbm3-tabs   { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 1.75rem; flex-wrap: wrap; }
.cbm3-tab {
  background: none; border: none; border-bottom: 2px solid transparent;
  padding: 0.55rem 1rem; font-family: var(--font); font-size: 0.875rem;
  font-weight: 600; color: var(--text-muted); cursor: pointer;
  transition: color 0.2s, border-color 0.2s; margin-bottom: -1px;
}
.cbm3-tab:hover { color: var(--accent); }
.cbm3-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
.cbm3-panel { display: none; }
.cbm3-panel.active { display: block; }
.cbm3-btn {
  font-family: var(--font); font-size: 0.8rem; font-weight: 600;
  padding: 5px 14px; border: 1px solid var(--border); border-radius: 7px;
  background: var(--bg-card); color: var(--text-muted); cursor: pointer;
  transition: all 0.15s; display: inline-flex; align-items: center; gap: 5px;
}
.cbm3-btn:hover { color: var(--accent); border-color: var(--accent); }
.cbm3-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
.cbm3-btn:disabled { opacity: 0.35; cursor: default; pointer-events: none; }

/* CANVAS WRAP — overflow-x pt mobile, fara width:100% pe canvas */
.cbm3-canvas-wrap {
  border: 1px solid var(--border); border-radius: 12px;
  overflow-x: auto; overflow-y: hidden;
  background: var(--bg-alt); margin-bottom: 12px;
  display: flex; /* aligns canvas to left, not stretched */
}
.cbm3-canvas-wrap canvas { display: block; flex-shrink: 0; }

/* Tab 1 - Signal */
.cbm3-harmonics { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
.cbm3-h-row { display: flex; align-items: center; gap: 10px; }
.cbm3-h-label { font-size: 0.85rem; color: var(--text-muted); min-width: 155px; font-family: 'Courier New', monospace; }
.cbm3-h-row input[type=range] { flex: 1; accent-color: var(--accent); min-width: 80px; }
.cbm3-h-val { font-size: 0.85rem; min-width: 34px; text-align: right; font-family: 'Courier New', monospace; }

/* Tab 2 - Butterfly */
.cbm3-bf-ctrl { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 10px; }
.cbm3-bf-info-box {
  font-size: 0.9rem; color: var(--text); background: var(--bg-alt);
  border: 1px solid var(--border); border-radius: 8px;
  padding: 10px 14px; margin-bottom: 10px; min-height: 38px;
  font-family: 'Courier New', monospace; line-height: 1.5;
}
.cbm3-bf-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.65; margin-top: 6px; }

/* Tab 3 - Poly */
.cbm3-poly-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.cbm3-poly-field label { display: block; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 5px; }
.cbm3-poly-field input {
  width: 100%; background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 8px; padding: 0.6rem 0.8rem; font-family: 'Courier New', monospace;
  font-size: 0.88rem; color: var(--text); outline: none; box-sizing: border-box;
}
.cbm3-poly-field input:focus { border-color: var(--accent); }
.cbm3-steps { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
.cbm3-step { background: var(--bg-alt); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; }
.cbm3-step-title { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin-bottom: 5px; }
.cbm3-step-body  { font-family: 'Courier New', monospace; font-size: 0.8rem; color: var(--text); line-height: 1.7; word-break: break-all; }
.cbm3-step-sub   { font-size: 0.72rem; color: var(--text-muted); margin-top: 4px; }
.cbm3-cmp { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
.cbm3-cmp-box { background: var(--bg-alt); border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; }
.cbm3-cmp-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; }
.cbm3-cmp-title.fft { color: var(--accent); }
.cbm3-cmp-title.ntt { color: #1D9E75; }
.cbm3-cmp-body { font-family: 'Courier New', monospace; font-size: 0.8rem; color: var(--text); line-height: 1.7; }
.cbm3-ok  { font-size: 0.72rem; color: #1D9E75; margin-top: 4px; }
.cbm3-err { font-size: 0.72rem; color: #ef4444; margin-top: 4px; }

/* Tab 4 - DCT */
.cbm3-dct-ctrl {
  display: flex; gap: 14px; align-items: center; flex-wrap: wrap;
  margin-bottom: 16px;
}
.cbm3-dct-img-btns { display: flex; gap: 6px; }
.cbm3-dct-q-wrap {
  display: flex; align-items: center; gap: 10px;
  flex: 1; min-width: 200px;
}
.cbm3-dct-q-wrap label {
  font-size: 0.8rem; font-weight: 600; color: var(--text-muted);
  white-space: nowrap;
}
.cbm3-dct-q-wrap input[type=range] { flex: 1; accent-color: var(--accent); }
.cbm3-dct-q-val {
  font-size: 0.85rem; font-family: 'Courier New', monospace;
  color: var(--accent); min-width: 30px; text-align: right; font-weight: 700;
}
.cbm3-dct-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 14px;
}
.cbm3-dct-col { display: flex; flex-direction: column; gap: 6px; }
.cbm3-dct-col-label {
  font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--text-muted);
  text-align: center;
}
.cbm3-dct-canvas-wrap {
  border: 1px solid var(--border); border-radius: 8px;
  overflow: hidden; display: flex; justify-content: center;
  background: var(--bg-alt);
}
.cbm3-dct-canvas-wrap canvas { display: block; image-rendering: pixelated; }
.cbm3-dct-stats {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}
.cbm3-dct-stat {
  background: var(--bg-alt); border: 1px solid var(--border);
  border-radius: 8px; padding: 9px 12px;
}
.cbm3-dct-stat-label {
  font-size: 0.68rem; font-weight: 600; letter-spacing: 0.07em;
  text-transform: uppercase; color: var(--text-muted); margin-bottom: 3px;
}
.cbm3-dct-stat-val {
  font-size: 1.35rem; font-weight: 700; color: var(--text); line-height: 1.1;
}
.cbm3-dct-hint { font-size: 0.78rem; color: var(--text-muted); margin-top: 10px; line-height: 1.5; }
@media (max-width: 540px) {
  .cbm3-poly-row { grid-template-columns: 1fr; }
  .cbm3-cmp      { grid-template-columns: 1fr; }
}
`;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.className = "cbm3-widget";
  widget.innerHTML = `
<div class="cbm3-title">Demo interactiv</div>
<p class="cbm3-sub">Explorează FFT și NTT din patru unghiuri: semnale, structura butterfly, înmulțirea polinoamelor și compresia DCT (JPEG).</p>

<div class="cbm3-tabs">
  <button class="cbm3-tab active" data-panel="sig">Semnale</button>
  <button class="cbm3-tab" data-panel="bf">Butterfly</button>
  <button class="cbm3-tab" data-panel="poly">Polinoame</button>
  <button class="cbm3-tab" data-panel="dct">Compresie DCT</button>
</div>

<!-- TAB 1 -->
<div class="cbm3-panel active" id="cbm3-panel-sig">
  <div class="cbm3-canvas-wrap"><canvas id="cbm3-sig-c"></canvas></div>
  <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:0.75rem">
    Ajustează amplitudinea fiecărei armonice. FFT-ul descompune semnalul compus (stânga) în componentele sale sinusoidale (spectrul de magnitudine — dreapta).
  </p>
  <div class="cbm3-harmonics" id="cbm3-harmonics"></div>
</div>

<!-- TAB 2 -->
<div class="cbm3-panel" id="cbm3-panel-bf">
  <div class="cbm3-bf-ctrl">
    <button class="cbm3-btn active" id="cbm3-bf-fft-btn">FFT</button>
    <button class="cbm3-btn" id="cbm3-bf-ntt-btn">NTT (mod 17)</button>
    <button class="cbm3-btn" id="cbm3-bf-prev">&#8592; Anterior</button>
    <button class="cbm3-btn" id="cbm3-bf-next">Următor &#8594;</button>
    <button class="cbm3-btn" id="cbm3-bf-auto">&#9654; Auto</button>
    <button class="cbm3-btn" id="cbm3-bf-rst">Reset</button>
  </div>
  <div class="cbm3-bf-info-box" id="cbm3-bf-info"></div>
  <div class="cbm3-canvas-wrap"><canvas id="cbm3-bf-c"></canvas></div>
  <div class="cbm3-bf-desc" id="cbm3-bf-desc"></div>
</div>

<!-- TAB 3 -->
<div class="cbm3-panel" id="cbm3-panel-poly">
  <div class="cbm3-poly-row">
    <div class="cbm3-poly-field">
      <label>Polinomul A (coeficienți separați prin spații)</label>
      <input id="cbm3-pa" type="text" value="1 2 3 4" placeholder="ex: 1 2 3">
    </div>
    <div class="cbm3-poly-field">
      <label>Polinomul B (coeficienți separați prin spații)</label>
      <input id="cbm3-pb" type="text" value="1 1 1 1" placeholder="ex: 1 1 1">
    </div>
  </div>
  <button class="cbm3-btn active" id="cbm3-poly-run">&#9654; Calculează</button>
  <div id="cbm3-poly-out"></div>
</div>

<!-- TAB 4 -->
<div class="cbm3-panel" id="cbm3-panel-dct">
  <div class="cbm3-dct-ctrl">
    <div class="cbm3-dct-img-btns">
      <button class="cbm3-btn active" data-img="peisaj" id="cbm3-img-peisaj">Peisaj</button>
      <button class="cbm3-btn" data-img="gradient" id="cbm3-img-gradient">Gradient</button>
      <button class="cbm3-btn" data-img="sah" id="cbm3-img-sah">Tablă de șah</button>
    </div>
    <div class="cbm3-dct-q-wrap">
      <label>Calitate</label>
      <input type="range" min="1" max="100" value="85" id="cbm3-dct-q" step="1">
      <span class="cbm3-dct-q-val" id="cbm3-dct-qval">85</span>
    </div>
  </div>
  <div class="cbm3-dct-grid">
    <div class="cbm3-dct-col">
      <div class="cbm3-dct-col-label">Original</div>
      <div class="cbm3-dct-canvas-wrap">
        <canvas id="cbm3-dct-orig" width="240" height="240" style="width:240px;height:240px"></canvas>
      </div>
    </div>
    <div class="cbm3-dct-col">
      <div class="cbm3-dct-col-label">Comprimat DCT (JPEG-like)</div>
      <div class="cbm3-dct-canvas-wrap">
        <canvas id="cbm3-dct-comp" width="240" height="240" style="width:240px;height:240px"></canvas>
      </div>
    </div>
    <div class="cbm3-dct-col">
      <div class="cbm3-dct-col-label">Coeficienți DCT — bloc (0,0)</div>
      <div class="cbm3-dct-canvas-wrap">
        <canvas id="cbm3-dct-heat" width="160" height="160" style="width:160px;height:160px"></canvas>
      </div>
    </div>
  </div>
  <div class="cbm3-dct-stats" id="cbm3-dct-stats"></div>
  <p class="cbm3-dct-hint" id="cbm3-dct-hint"></p>
</div>
`;

  const bodyEl = document.getElementById("theme3-body");
  if (bodyEl) bodyEl.appendChild(widget);

  ///switch la taburi
  document.querySelectorAll(".cbm3-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".cbm3-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".cbm3-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("cbm3-panel-" + tab.dataset.panel).classList.add("active");
    });
  });

  function cv(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  ///initCanvas -> dimensiune fixa in px (fara width:100%), elimina blur-ul de scalare CSS
  function initCanvas(c, w, h) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width  = w * dpr;
    c.height = h * dpr;
    c.style.width  = w + "px";
    c.style.height = h + "px";
    c.getContext("2d").scale(dpr, dpr);
  }

  ///══════════════════════════════════════════════════════════════════════════
  ///TAB 1 — SEMNALE
  ///══════════════════════════════════════════════════════════════════════════
  const SC = document.getElementById("cbm3-sig-c");
  const SCTX = SC.getContext("2d");
  const SW = 660, SH = 320;
  initCanvas(SC, SW, SH);

  const HARMONICS = [
    { freq: 1, amp: 0.85, color: "#6366f1", label: "f₁  fundamental" },
    { freq: 2, amp: 0.45, color: "#1D9E75", label: "f₂  a 2-a armonică" },
    { freq: 3, amp: 0.25, color: "#f97316", label: "f₃  a 3-a armonică" },
    { freq: 4, amp: 0.15, color: "#ec4899", label: "f₄  a 4-a armonică" },
    { freq: 5, amp: 0.00, color: "#8b5cf6", label: "f₅  a 5-a armonică" },
  ];
  const NS = 256;

  const hw = document.getElementById("cbm3-harmonics");
  HARMONICS.forEach((h, i) => {
    const row = document.createElement("div");
    row.className = "cbm3-h-row";
    row.innerHTML = `
      <span class="cbm3-h-label" style="color:${h.color}">${h.label}</span>
      <input type="range" min="0" max="1" step="0.05" value="${h.amp}" id="cbm3-h${i}">
      <span class="cbm3-h-val" style="color:${h.color}" id="cbm3-hv${i}">${h.amp.toFixed(2)}</span>
    `;
    hw.appendChild(row);
    document.getElementById("cbm3-h" + i).addEventListener("input", function() {
      HARMONICS[i].amp = parseFloat(this.value);
      document.getElementById("cbm3-hv" + i).textContent = HARMONICS[i].amp.toFixed(2);
      drawSignal();
    });
  });

  function drawSignal() {
    SCTX.clearRect(0, 0, SW, SH);
    const PAD = 14;
    const halfW = Math.floor((SW - PAD * 3) / 2);
    const wH = SH * 0.46, wCY = wH / 2 + PAD;
    const specX = halfW + PAD * 2, specW = SW - specX - PAD;
    const specY = wH + PAD * 2, specH = SH - specY - PAD;
    const border = cv("--border"), muted = cv("--text-muted"), accent = cv("--accent");
    const font = cv("--font") || "sans-serif";
    const maxSum = HARMONICS.reduce((s, h) => s + h.amp, 0) || 1;

    ///divider
    SCTX.strokeStyle = border; SCTX.lineWidth = 1;
    SCTX.setLineDash([4, 4]);
    SCTX.beginPath(); SCTX.moveTo(halfW + PAD, 0); SCTX.lineTo(halfW + PAD, SH); SCTX.stroke();
    SCTX.setLineDash([]);

    ///labeluri
    SCTX.fillStyle = muted; SCTX.font = "bold 12px " + font;
    SCTX.textAlign = "left"; SCTX.textBaseline = "top";
    SCTX.fillText("Domeniu timp", PAD, PAD / 2);
    SCTX.fillText("Spectru frecvențe (FFT)", specX, PAD / 2);

    ///baseline
    SCTX.strokeStyle = border; SCTX.lineWidth = 0.5;
    SCTX.beginPath(); SCTX.moveTo(PAD, wCY); SCTX.lineTo(halfW - PAD, wCY); SCTX.stroke();

    ///armonicele individuale
    HARMONICS.forEach(h => {
      if (h.amp < 0.01) return;
      SCTX.beginPath(); SCTX.strokeStyle = h.color + "55"; SCTX.lineWidth = 1.2;
      for (let i = 0; i < NS; i++) {
        const x = PAD + (i / NS) * (halfW - PAD * 2);
        const y = wCY - h.amp / maxSum * (wH * 0.42) * Math.sin(2 * Math.PI * h.freq * i / NS);
        i === 0 ? SCTX.moveTo(x, y) : SCTX.lineTo(x, y);
      }
      SCTX.stroke();
    });

    ///wave-ul composit
    SCTX.beginPath(); SCTX.strokeStyle = accent; SCTX.lineWidth = 2.5;
    for (let i = 0; i < NS; i++) {
      const x = PAD + (i / NS) * (halfW - PAD * 2);
      const sum = HARMONICS.reduce((s, h) => s + h.amp * Math.sin(2 * Math.PI * h.freq * i / NS), 0);
      const y = wCY - (sum / maxSum) * (wH * 0.42);
      i === 0 ? SCTX.moveTo(x, y) : SCTX.lineTo(x, y);
    }
    SCTX.stroke();

    ///bare pt spectrum
    const maxAmp = Math.max(...HARMONICS.map(h => h.amp), 0.01);
    const barGap = specW / (HARMONICS.length + 1);
    const barW = barGap * 0.62;

    SCTX.strokeStyle = border; SCTX.lineWidth = 0.5;
    SCTX.beginPath();
    SCTX.moveTo(specX, specY + specH);
    SCTX.lineTo(specX + specW, specY + specH);
    SCTX.stroke();

    HARMONICS.forEach((h, i) => {
      const bx = specX + (i + 1) * barGap - barW / 2;
      const bh = (h.amp / maxAmp) * (specH - 20);
      SCTX.fillStyle = h.amp > 0.01 ? h.color : (h.color + "22");
      SCTX.globalAlpha = h.amp > 0.01 ? 1 : 0.35;
      if (bh > 0) SCTX.fillRect(bx, specY + specH - bh, barW, bh);
      SCTX.globalAlpha = 1;

      SCTX.fillStyle = h.amp > 0.01 ? h.color : muted;
      SCTX.font = "12px " + font; SCTX.textAlign = "center"; SCTX.textBaseline = "top";
      SCTX.fillText("f" + h.freq, bx + barW / 2, specY + specH + 4);

      if (h.amp > 0.01) {
        SCTX.fillStyle = h.color;
        SCTX.font = "bold 11px " + font; SCTX.textBaseline = "bottom";
        SCTX.fillText(h.amp.toFixed(2), bx + barW / 2, specY + specH - bh - 2);
      }
    });
  }

  drawSignal();

  ///══════════════════════════════════════════════════════════════════════════
  ///TAB 2 — BUTTERFLY
  ///══════════════════════════════════════════════════════════════════════════
  const BC = document.getElementById("cbm3-bf-c");
  const BCTX = BC.getContext("2d");
  const BW = 660, BH = 420;
  initCanvas(BC, BW, BH);

  const cadd = (a, b) => ({ re: a.re + b.re, im: a.im + b.im });
  const csub = (a, b) => ({ re: a.re - b.re, im: a.im - b.im });
  const cmul = (a, b) => ({ re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re });
  const cexp = ang => ({ re: Math.cos(ang), im: Math.sin(ang) });
  function cfmt(c) {
    const r = Math.round(c.re * 10) / 10, im = Math.round(c.im * 10) / 10;
    if (Math.abs(im) < 0.05) return r.toFixed(1);
    if (Math.abs(r) < 0.05) return (im >= 0 ? "" : "−") + Math.abs(im).toFixed(1) + "i";
    return r.toFixed(1) + (im >= 0 ? "+" : "−") + Math.abs(im).toFixed(1) + "i";
  }

  const NM = 17, NW8 = 9;
  function npow(b, e, m) { let r = 1; b %= m; while (e > 0) { if (e & 1) r = r * b % m; b = b * b % m; e >>= 1; } return r; }

  const BF_N = 8, BF_S = 3;
  const BF_IN = [1, 2, 3, 4, 5, 6, 7, 8];
  function brev(i) { return ((i & 1) << 2) | (i & 2) | ((i >> 2) & 1); }

  function makeFFTStates() {
    const st = [];
    let cur = Array.from({ length: BF_N }, (_, i) => ({ re: BF_IN[brev(i)], im: 0 }));
    st.push(cur.map(v => ({ ...v })));
    for (let s = 0; s < BF_S; s++) {
      const len = 2 << s, half = len >> 1;
      for (let i = 0; i < BF_N; i += len)
        for (let j = 0; j < half; j++) {
          const u = cur[i + j], v = cmul(cexp(-2 * Math.PI * j / len), cur[i + j + half]);
          cur[i + j] = cadd(u, v); cur[i + j + half] = csub(u, v);
        }
      st.push(cur.map(v => ({ ...v })));
    }
    return st;
  }

  function makeNTTStates() {
    const st = [];
    let cur = Array.from({ length: BF_N }, (_, i) => BF_IN[brev(i)]);
    st.push([...cur]);
    for (let s = 0; s < BF_S; s++) {
      const len = 2 << s, half = len >> 1;
      const wLen = npow(NW8, BF_N / len, NM);
      for (let i = 0; i < BF_N; i += len) {
        let w = 1;
        for (let j = 0; j < half; j++) {
          const u = cur[i + j], v = w * cur[i + j + half] % NM;
          cur[i + j] = (u + v) % NM; cur[i + j + half] = (u - v + NM) % NM;
          w = w * wLen % NM;
        }
      }
      st.push([...cur]);
    }
    return st;
  }

  let bfMode = "fft", bfStep = 0, bfAuto = null, bfFFT, bfNTT;

  function bfInit() { bfFFT = makeFFTStates(); bfNTT = makeNTTStates(); bfStep = 0; drawBF(); }

  ///layout butterfly -> margini mai mari pt text lizibil
  const BL = 96, BR = BW - 28, BT = 32;
  const BROW = (BH - BT * 2) / BF_N;
  const BCOL = (BR - BL) / (BF_S + 1);
  const nx = s => BL + s * BCOL;
  const ny = r => BT + (r + 0.5) * BROW;

  function getVal(row, stage) {
    return bfMode === "fft" ? cfmt(bfFFT[stage][row]) : String(bfNTT[stage][row]);
  }

  function drawBF() {
    BCTX.clearRect(0, 0, BW, BH);
    const accent = cv("--accent"), border = cv("--border");
    const muted = cv("--text-muted"), textCol = cv("--text");
    const HL = "#1D9E75", font = cv("--font") || "sans-serif";

    const activeStage = bfStep - 1;
    const activePairs = new Set();
    if (activeStage >= 0) {
      const len = 2 << activeStage, half = len >> 1;
      for (let i = 0; i < BF_N; i += len)
        for (let j = 0; j < half; j++)
          activePairs.add(i + j + "," + (i + j + half));
    }
    function inPair(row) {
      return [...activePairs].some(p => {
        const [a, b] = p.split(",").map(Number); return a === row || b === row;
      });
    }

    for (let s = 0; s < BF_S; s++) {
      const len = 2 << s, half = len >> 1;
      const x1 = nx(s), x2 = nx(s + 1);
      const isAE = s === activeStage;
      for (let i = 0; i < BF_N; i += len) {
        for (let j = 0; j < half; j++) {
          const top = i + j, bot = i + j + half;
          [[top, top], [bot, bot]].forEach(([r1, r2]) => {
            BCTX.beginPath(); BCTX.moveTo(x1, ny(r1)); BCTX.lineTo(x2, ny(r2));
            BCTX.strokeStyle = isAE ? HL : border; BCTX.lineWidth = isAE ? 2.5 : 1;
            BCTX.setLineDash([]); BCTX.stroke();
          });
          [[top, bot], [bot, top]].forEach(([r1, r2]) => {
            BCTX.beginPath(); BCTX.moveTo(x1, ny(r1)); BCTX.lineTo(x2, ny(r2));
            BCTX.strokeStyle = isAE ? HL + "77" : border + "55";
            BCTX.lineWidth = isAE ? 1.8 : 0.8;
            BCTX.setLineDash([5, 4]); BCTX.stroke(); BCTX.setLineDash([]);
          });
          if (isAE && j === 0) {
            const mx = (x1 + x2) / 2, my = (ny(top) + ny(bot)) / 2;
            const tw = bfMode === "fft"
              ? ((2 << s) === 2 ? "W=1" : "W_{" + (2 << s) + "}")
              : "w=" + npow(NW8, BF_N / (2 << s), NM);
            BCTX.fillStyle = HL; BCTX.font = "bold 11px " + font;
            BCTX.textAlign = "center"; BCTX.textBaseline = "middle";
            BCTX.fillText(tw, mx, my - 10);
          }
        }
      }
    }

    for (let s = 0; s <= BF_S; s++) {
      const shown = s <= bfStep;
      for (let row = 0; row < BF_N; row++) {
        const x = nx(s), y = ny(row);
        const isActive = s === bfStep && inPair(row);
        BCTX.beginPath(); BCTX.arc(x, y, 7, 0, Math.PI * 2);
        BCTX.fillStyle = shown ? (isActive ? HL : accent) : border;
        BCTX.globalAlpha = shown ? 1 : 0.2; BCTX.fill(); BCTX.globalAlpha = 1;

        if (shown) {
          const lbl = getVal(row, s);
          BCTX.fillStyle = isActive ? HL : textCol;
          BCTX.font = "bold 11px 'Courier New', monospace";
          BCTX.textAlign = s === BF_S ? "left" : "center";
          BCTX.textBaseline = "middle";
          const ox = s === BF_S ? 11 : 0, oy = s === BF_S ? 0 : -14;
          BCTX.fillText(lbl, x + ox, y + oy);
        }
      }
    }

    for (let row = 0; row < BF_N; row++) {
      const orig = brev(row);
      BCTX.fillStyle = muted; BCTX.font = "11px 'Courier New', monospace";
      BCTX.textAlign = "right"; BCTX.textBaseline = "middle";
      BCTX.fillText("x[" + orig + "]=" + BF_IN[orig], nx(0) - 12, ny(row));
    }

    const headers = ["Input (bit-rev)", "Etapa 1  len=2", "Etapa 2  len=4", "Etapa 3  len=8"];
    for (let s = 0; s <= BF_S; s++) {
      BCTX.fillStyle = s === bfStep ? accent : muted;
      BCTX.font = (s === bfStep ? "bold " : "") + "11px " + font;
      BCTX.textAlign = "center"; BCTX.textBaseline = "top";
      BCTX.fillText(headers[s], nx(s), 6);
    }

    updateBFText();
  }

  function updateBFText() {
    const infoEl = document.getElementById("cbm3-bf-info");
    const descEl = document.getElementById("cbm3-bf-desc");
    if (bfStep === 0) {
      infoEl.textContent = "Etapa 0: Rearanjare bit-inversă (bit-reversal permutation)";
      descEl.innerHTML = bfMode === "fft"
        ? "Intrările sunt rearanjate în ordinea bit-inversă: x[0], x[4], x[2], x[6], x[1], x[5], x[3], x[7]. Indexul fiecărei intrări are biții inversați (ex: 001₂ → 100₂ = 4)."
        : "Aceeași rearanjare bit-inversă — identică cu FFT. Diferența apare doar la twiddle factors din etapele următoare.";
    } else {
      const len = 2 << (bfStep - 1), half = len >> 1;
      if (bfMode === "fft") {
        infoEl.textContent = `Etapa ${bfStep}: Butterfly cu len=${len},  W_{${len}} = e^(−2πi/${len})`;
        descEl.innerHTML = `Fiecare pereche (u, v) → <strong>u' = u + W·v</strong>,  <strong>v' = u − W·v</strong>  unde W = e<sup>−2πi/${len}</sup>.<br>
          Se aplică ${BF_N / len} grup${BF_N / len > 1 ? "uri" : ""} de câte ${half} butterfly${half > 1 ? "-uri" : ""} simultan.`;
      } else {
        const wLen = npow(NW8, BF_N / len, NM);
        infoEl.textContent = `Etapa ${bfStep}: Butterfly cu len=${len},  w_{${len}} = ${wLen} (mod ${NM})`;
        descEl.innerHTML = `Aceeași structură, dar w<sub>${len}</sub> = ${wLen} (mod ${NM}) în loc de număr complex.<br>
          <strong>u' = (u + w·v) mod ${NM}</strong>,  <strong>v' = (u − w·v) mod ${NM}</strong>.<br>
          Rădăcinile unității există în ℤ<sub>${NM}</sub> deoarece ord(${NW8}) = ${NM - 1} și ${NM - 1} = 2<sup>4</sup>.`;
      }
    }
    document.getElementById("cbm3-bf-prev").disabled = bfStep === 0;
    document.getElementById("cbm3-bf-next").disabled = bfStep === BF_S;
  }

  bfInit();
  document.getElementById("cbm3-bf-fft-btn").onclick = () => {
    bfMode = "fft";
    document.getElementById("cbm3-bf-fft-btn").classList.add("active");
    document.getElementById("cbm3-bf-ntt-btn").classList.remove("active");
    drawBF();
  };
  document.getElementById("cbm3-bf-ntt-btn").onclick = () => {
    bfMode = "ntt";
    document.getElementById("cbm3-bf-ntt-btn").classList.add("active");
    document.getElementById("cbm3-bf-fft-btn").classList.remove("active");
    drawBF();
  };
  document.getElementById("cbm3-bf-prev").onclick = () => { if (bfStep > 0)   { bfStep--; drawBF(); } };
  document.getElementById("cbm3-bf-next").onclick = () => { if (bfStep < BF_S) { bfStep++; drawBF(); } };
  document.getElementById("cbm3-bf-rst").onclick  = () => { stopAuto(); bfStep = 0; drawBF(); };
  function stopAuto() {
    if (bfAuto) { clearInterval(bfAuto); bfAuto = null; }
    document.getElementById("cbm3-bf-auto").textContent = "▶ Auto";
  }
  document.getElementById("cbm3-bf-auto").onclick = function() {
    if (bfAuto) { stopAuto(); return; }
    this.textContent = "⏸ Stop";
    bfAuto = setInterval(() => { bfStep = (bfStep + 1) % (BF_S + 1); drawBF(); }, 1600);
  };

  ///══════════════════════════════════════════════════════════════════════════
  ///TAB 3 — MULTIPLICARE POLINOMIALA
  ///══════════════════════════════════════════════════════════════════════════
  function polyFFT(a, inv) {
    const n = a.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) [a[i], a[j]] = [a[j], a[i]];
    }
    for (let len = 2; len <= n; len <<= 1) {
      const wlen = cexp(2 * Math.PI / len * (inv ? 1 : -1));
      for (let i = 0; i < n; i += len) {
        let w = { re: 1, im: 0 };
        for (let j = 0; j < len / 2; j++) {
          const u = a[i + j], v = cmul(w, a[i + j + len / 2]);
          a[i + j] = cadd(u, v); a[i + j + len / 2] = csub(u, v);
          w = cmul(w, wlen);
        }
      }
    }
    if (inv) { for (let i = 0; i < n; i++) { a[i].re /= n; a[i].im /= n; } }
  }

  const NTTM = 998244353, NTTG = 3;
  function nttmpow(b, e, m) {
    let r = 1n, bb = BigInt(b), mm = BigInt(m), ee = BigInt(e);
    while (ee > 0n) { if (ee & 1n) r = r * bb % mm; bb = bb * bb % mm; ee >>= 1n; }
    return Number(r);
  }
  function polyNTT(a, inv) {
    const n = a.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) [a[i], a[j]] = [a[j], a[i]];
    }
    for (let len = 2; len <= n; len <<= 1) {
      const wPrim = inv
        ? nttmpow(nttmpow(NTTG, (NTTM - 1) / len, NTTM), NTTM - 2, NTTM)
        : nttmpow(NTTG, (NTTM - 1) / len, NTTM);
      for (let i = 0; i < n; i += len) {
        let w = 1;
        for (let j = 0; j < len / 2; j++) {
          const u = a[i + j];
          const v = Number(BigInt(w) * BigInt(a[i + j + len / 2]) % BigInt(NTTM));
          a[i + j] = (u + v) % NTTM;
          a[i + j + len / 2] = (u - v + NTTM) % NTTM;
          w = Number(BigInt(w) * BigInt(wPrim) % BigInt(NTTM));
        }
      }
    }
    if (inv) {
      const ni = nttmpow(n, NTTM - 2, NTTM);
      for (let i = 0; i < n; i++) a[i] = Number(BigInt(a[i]) * BigInt(ni) % BigInt(NTTM));
    }
  }
  function nextP2(n) { let p = 1; while (p < n) p <<= 1; return p; }
  function trimPoly(c) { const t = [...c]; while (t.length > 1 && t[t.length - 1] === 0) t.pop(); return t; }
  function fmtCoeffs(c, max = 10) {
    const t = trimPoly(c);
    if (t.length > max) return t.slice(0, max).join(", ") + " ... (" + t.length + " termeni)";
    return t.join(", ");
  }
  function fmtMath(c, max = 7) {
    const t = trimPoly(c); const terms = [];
    for (let i = Math.min(t.length - 1, max - 1); i >= 0; i--) {
      const v = t[i]; if (v === 0) continue;
      if (i === 0) terms.push(String(v));
      else if (i === 1) terms.push((v === 1 ? "" : v) + "x");
      else terms.push((v === 1 ? "" : v) + "x" + i.toString().split("").map(d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join(""));
    }
    return terms.join(" + ") || "0";
  }
  document.getElementById("cbm3-poly-run").onclick = () => {
    const out = document.getElementById("cbm3-poly-out");
    const parse = s => s.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    const A = parse(document.getElementById("cbm3-pa").value);
    const B = parse(document.getElementById("cbm3-pb").value);
    if (!A.length || !B.length) { out.innerHTML = '<p style="color:#ef4444;font-size:0.82rem">Introdu coeficienți valizi.</p>'; return; }
    const resLen = A.length + B.length - 1, n = nextP2(resLen);
    const fa = A.map(v => ({ re: v, im: 0 })); while (fa.length < n) fa.push({ re: 0, im: 0 });
    const fb = B.map(v => ({ re: v, im: 0 })); while (fb.length < n) fb.push({ re: 0, im: 0 });
    polyFFT(fa, false); polyFFT(fb, false);
    const faSpl = fa.slice(0, 4).map(v => cfmt(v)).join(", ");
    const fc = fa.map((_, i) => cmul(fa[i], fb[i]));
    polyFFT(fc, true);
    const fftRes = fc.slice(0, resLen).map(v => Math.round(v.re));
    const na = A.map(v => ((v % NTTM) + NTTM) % NTTM); while (na.length < n) na.push(0);
    const nb = B.map(v => ((v % NTTM) + NTTM) % NTTM); while (nb.length < n) nb.push(0);
    polyNTT(na, false); polyNTT(nb, false);
    const naSpl = na.slice(0, 4).join(", ");
    const nc = na.map((v, i) => Number(BigInt(v) * BigInt(nb[i]) % BigInt(NTTM)));
    polyNTT(nc, true);
    const nttRes = nc.slice(0, resLen);
    const hasMis = fftRes.some((v, i) => v !== nttRes[i]);
    out.innerHTML = `
<div class="cbm3-steps">
  <div class="cbm3-step">
    <div class="cbm3-step-title">1. Polinoamele de intrare</div>
    <div class="cbm3-step-body">A = [${fmtCoeffs(A)}] → ${fmtMath(A)}<br>B = [${fmtCoeffs(B)}] → ${fmtMath(B)}</div>
    <div class="cbm3-step-sub">grad(A)=${A.length-1}, grad(B)=${B.length-1} → grad(A·B)=${resLen-1}</div>
  </div>
  <div class="cbm3-step">
    <div class="cbm3-step-title">2. Zero-padding la puterea 2</div>
    <div class="cbm3-step-body">n = ${n}  (cea mai mică putere a lui 2 ≥ ${resLen})</div>
    <div class="cbm3-step-sub">Ambele polinoame se completează cu zerouri. Permite FFT/NTT recursiv.</div>
  </div>
  <div class="cbm3-step">
    <div class="cbm3-step-title">3. Transformată înainte</div>
    <div class="cbm3-step-body"><span style="color:var(--accent)">FFT(A)[0..3] = ${faSpl} ...</span><br><span style="color:#1D9E75">NTT(A)[0..3] = ${naSpl} ... (mod ${NTTM})</span></div>
    <div class="cbm3-step-sub">O(n log n) în loc de O(n²). Trecere coeficienți → valori punctuale.</div>
  </div>
  <div class="cbm3-step">
    <div class="cbm3-step-title">4. Înmulțire punct cu punct + transformată inversă</div>
    <div class="cbm3-step-body">Ĉ[i] = Â[i] · B̂[i]  (${n} înmulțiri scalare) → IFFT/INTT</div>
  </div>
</div>
<div class="cbm3-cmp">
  <div class="cbm3-cmp-box">
    <div class="cbm3-cmp-title fft">FFT (virgulă mobilă)</div>
    <div class="cbm3-cmp-body">[${fmtCoeffs(fftRes)}]<br>${fmtMath(fftRes)}</div>
    ${hasMis ? '<div class="cbm3-err">Erori de rotunjire față de NTT!</div>' : '<div class="cbm3-ok">✓ Corect după Math.round()</div>'}
  </div>
  <div class="cbm3-cmp-box">
    <div class="cbm3-cmp-title ntt">NTT (mod 998244353)</div>
    <div class="cbm3-cmp-body">[${fmtCoeffs(nttRes)}]<br>${fmtMath(nttRes)}</div>
    <div class="cbm3-ok">✓ Exact — fără erori de rotunjire</div>
  </div>
</div>`;
  };
  document.getElementById("cbm3-poly-run").click();

  ///══════════════════════════════════════════════════════════════════════════
  ///TAB 4 — COMPRESIE DCT (JPEG-LIKE)
  ///══════════════════════════════════════════════════════════════════════════
  const DCT_N = 8;
  const IMG_N = 240; ///dimensiunea imaginii (240x240, 30x30 blocks)

  ///tabel cosinus precalculat pt DCT 8x8
  const COS8 = Array.from({ length: DCT_N }, (_, k) =>
    Array.from({ length: DCT_N }, (_, n) =>
      Math.cos((2 * n + 1) * k * Math.PI / 16)
    )
  );
  const INVSQRT2 = 1 / Math.SQRT2;

  function dct1(x) {
    const out = new Float32Array(DCT_N);
    for (let k = 0; k < DCT_N; k++) {
      let s = 0;
      for (let n = 0; n < DCT_N; n++) s += x[n] * COS8[k][n];
      out[k] = s * (k === 0 ? INVSQRT2 * 0.5 : 0.5);
    }
    return out;
  }
  function idct1(X) {
    const out = new Float32Array(DCT_N);
    for (let n = 0; n < DCT_N; n++) {
      let s = X[0] * INVSQRT2;
      for (let k = 1; k < DCT_N; k++) s += X[k] * COS8[k][n];
      out[n] = s * 0.5;
    }
    return out;
  }
  function dct2d(block) {
    const tmp = block.map(row => dct1(row));
    const transT = Array.from({ length: DCT_N }, (_, j) => dct1(tmp.map(r => r[j])));
    return Array.from({ length: DCT_N }, (_, i) => Array.from({ length: DCT_N }, (_, j) => transT[j][i]));
  }
  function idct2d(C) {
    const transC = Array.from({ length: DCT_N }, (_, j) => idct1(Array.from({ length: DCT_N }, (_, i) => C[i][j])));
    const tmp = Array.from({ length: DCT_N }, (_, i) => Array.from({ length: DCT_N }, (_, j) => transC[j][i]));
    return tmp.map(row => idct1(row));
  }

  ///matricea de cuantizare JPEG (luma, calitate 50)
  const Q50 = [
    [16,11,10,16,24,40,51,61],
    [12,12,14,19,26,58,60,55],
    [14,13,16,24,40,57,69,56],
    [14,17,22,29,51,87,80,62],
    [18,22,37,56,68,109,103,77],
    [24,35,55,64,81,104,113,92],
    [49,64,78,87,103,121,120,101],
    [72,92,95,98,112,100,103,99]
  ];
  function getQMatrix(quality) {
    const s = quality < 50 ? 5000 / quality : 200 - 2 * quality;
    return Q50.map(row => row.map(q => Math.max(1, Math.min(255, Math.floor((q * s + 50) / 100)))));
  }

  ///generare imagini test (240x240)
  function genImage(type) {
    const c = document.createElement("canvas");
    c.width = IMG_N; c.height = IMG_N;
    const ctx = c.getContext("2d");

    if (type === "peisaj") {
      ///cer
      const sky = ctx.createLinearGradient(0, 0, 0, 150);
      sky.addColorStop(0, "#1565C0"); sky.addColorStop(1, "#64B5F6");
      ctx.fillStyle = sky; ctx.fillRect(0, 0, 240, 150);
      ///soare
      ctx.fillStyle = "#FFD54F";
      ctx.beginPath(); ctx.arc(185, 42, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFF59D";
      ctx.beginPath(); ctx.arc(185, 42, 18, 0, Math.PI * 2); ctx.fill();
      ///pamant
      const ground = ctx.createLinearGradient(0, 148, 0, 240);
      ground.addColorStop(0, "#388E3C"); ground.addColorStop(1, "#1B5E20");
      ctx.fillStyle = ground; ctx.fillRect(0, 148, 240, 92);
      ///deal stanga
      ctx.fillStyle = "#2E7D32";
      ctx.beginPath(); ctx.moveTo(0, 175); ctx.quadraticCurveTo(60, 100, 130, 155); ctx.lineTo(130, 240); ctx.lineTo(0, 240); ctx.closePath(); ctx.fill();
      ///deal dreapta
      ctx.fillStyle = "#388E3C";
      ctx.beginPath(); ctx.moveTo(90, 175); ctx.quadraticCurveTo(165, 95, 240, 160); ctx.lineTo(240, 240); ctx.lineTo(90, 240); ctx.closePath(); ctx.fill();
      ///casa — corp
      ctx.fillStyle = "#8D6E63";
      ctx.fillRect(86, 130, 68, 50);
      ///acoperis
      ctx.fillStyle = "#C62828";
      ctx.beginPath(); ctx.moveTo(76, 132); ctx.lineTo(120, 95); ctx.lineTo(164, 132); ctx.closePath(); ctx.fill();
      ///usa
      ctx.fillStyle = "#4E342E";
      ctx.fillRect(112, 153, 20, 27);
      ///fereastra
      ctx.fillStyle = "#B3E5FC";
      ctx.fillRect(92, 138, 18, 16);
      ctx.strokeStyle = "#4E342E"; ctx.lineWidth = 1.5;
      ctx.strokeRect(92, 138, 18, 16);
      ctx.beginPath(); ctx.moveTo(101, 138); ctx.lineTo(101, 154); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(92, 146); ctx.lineTo(110, 146); ctx.stroke();

    } else if (type === "gradient") {
      ///gradient radial colorat -> zone netede, compresia DCT le pastreaza perfect
      const g = ctx.createRadialGradient(120, 120, 10, 120, 120, 160);
      g.addColorStop(0, "#F06292"); g.addColorStop(0.4, "#7E57C2");
      g.addColorStop(0.7, "#26C6DA"); g.addColorStop(1, "#66BB6A");
      ctx.fillStyle = g; ctx.fillRect(0, 0, 240, 240);
      ///al doilea gradient
      const g2 = ctx.createLinearGradient(0, 0, 240, 240);
      g2.addColorStop(0, "rgba(255,255,200,0.35)"); g2.addColorStop(1, "rgba(0,0,80,0.35)");
      ctx.fillStyle = g2; ctx.fillRect(0, 0, 240, 240);

    } else { ///tablă de șah
      const sz = 24; ///10x10 patrate
      for (let r = 0; r < 10; r++) {
        for (let cc = 0; cc < 10; cc++) {
          ctx.fillStyle = (r + cc) % 2 === 0 ? "#1A237E" : "#F5F5F5";
          ctx.fillRect(cc * sz, r * sz, sz, sz);
        }
      }
    }

    return ctx.getImageData(0, 0, IMG_N, IMG_N);
  }

  ///procesare canal singur (R, G sau B) prin DCT + cuantizare + IDCT
  function processChannel(pixData, ch, quality, storeFirstBlock) {
    const Q = getQMatrix(quality);
    const out = new Uint8ClampedArray(IMG_N * IMG_N);
    let nonzero = 0, total = 0;
    let firstBlock = null;

    const NB = IMG_N / DCT_N; ///30 blocks per dim
    for (let by = 0; by < NB; by++) {
      for (let bx = 0; bx < NB; bx++) {
        ///extrage bloc
        const block = Array.from({ length: DCT_N }, (_, i) =>
          Array.from({ length: DCT_N }, (_, j) => {
            const idx = ((by * DCT_N + i) * IMG_N + (bx * DCT_N + j)) * 4 + ch;
            return pixData[idx] - 128;
          })
        );
        const dct = dct2d(block);
        const quant = dct.map((row, i) => row.map((v, j) => {
          const q = Math.round(v / Q[i][j]);
          total++;
          if (q !== 0) nonzero++;
          return q;
        }));
        if (storeFirstBlock && bx === 0 && by === 0) firstBlock = { dct, quant, Q };
        const deq = quant.map((row, i) => row.map((v, j) => v * Q[i][j]));
        const rec = idct2d(deq);
        for (let i = 0; i < DCT_N; i++)
          for (let j = 0; j < DCT_N; j++)
            out[(by * DCT_N + i) * IMG_N + (bx * DCT_N + j)] =
              Math.max(0, Math.min(255, Math.round(rec[i][j] + 128)));
      }
    }
    return { out, nonzero, total, firstBlock };
  }

  ///deseneaza heatmap coeficienti DCT (primul bloc, canalul R)
  function drawHeatmap(firstBlock) {
    const hCanvas = document.getElementById("cbm3-dct-heat");
    const hCtx = hCanvas.getContext("2d");
    const CELL = 20; ///8x8 * 20 = 160px
    hCtx.clearRect(0, 0, 160, 160);

    if (!firstBlock) return;
    const { dct, quant, Q } = firstBlock;

    ///max magnitude for normalization
    let maxMag = 0;
    for (let i = 0; i < DCT_N; i++)
      for (let j = 0; j < DCT_N; j++)
        maxMag = Math.max(maxMag, Math.abs(dct[i][j]));
    if (maxMag < 1) maxMag = 1;

    for (let i = 0; i < DCT_N; i++) {
      for (let j = 0; j < DCT_N; j++) {
        const val = dct[i][j];
        const t = val / maxMag; ///-1..1
        ///culoare: albastru = negativ, alb = 0, rosu = pozitiv
        const r = t > 0 ? Math.round(220 * t + 35) : 35;
        const g = Math.round(35 + 50 * (1 - Math.abs(t)));
        const b = t < 0 ? Math.round(220 * (-t) + 35) : 35;
        hCtx.fillStyle = `rgb(${r},${g},${b})`;
        hCtx.fillRect(j * CELL, i * CELL, CELL, CELL);

        ///contur celula
        hCtx.strokeStyle = "rgba(0,0,0,0.2)";
        hCtx.lineWidth = 0.5;
        hCtx.strokeRect(j * CELL, i * CELL, CELL, CELL);

        ///daca coeficientul e 0 dupa cuantizare, pune X
        if (quant[i][j] === 0) {
          hCtx.fillStyle = "rgba(255,255,255,0.7)";
          hCtx.font = "bold 13px sans-serif";
          hCtx.textAlign = "center"; hCtx.textBaseline = "middle";
          hCtx.fillText("×", j * CELL + CELL / 2, i * CELL + CELL / 2);
        } else {
          ///valoarea cuantizata
          hCtx.fillStyle = Math.abs(t) > 0.4 ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.6)";
          hCtx.font = "9px 'Courier New', monospace";
          hCtx.textAlign = "center"; hCtx.textBaseline = "middle";
          hCtx.fillText(quant[i][j], j * CELL + CELL / 2, i * CELL + CELL / 2);
        }
      }
    }

    ///etichete frecventa
    hCtx.fillStyle = "rgba(255,255,255,0.6)";
    hCtx.font = "8px sans-serif";
    hCtx.textAlign = "center";
    hCtx.fillText("→ frecvență orizontală", 80, 156);
  }

  ///actualizeaza statistica si canvasurile DCT
  let currentImg = "peisaj";
  let imgDataCache = {};

  function getImgData(type) {
    if (!imgDataCache[type]) imgDataCache[type] = genImage(type);
    return imgDataCache[type];
  }

  function psnr(orig, comp, n) {
    let mse = 0;
    for (let i = 0; i < n; i++) mse += (orig[i] - comp[i]) ** 2;
    mse /= n;
    if (mse === 0) return Infinity;
    return 10 * Math.log10(255 * 255 / mse);
  }

  function updateDCT() {
    const quality = parseInt(document.getElementById("cbm3-dct-q").value, 10);
    document.getElementById("cbm3-dct-qval").textContent = quality;

    const imgData = getImgData(currentImg);
    const orig    = imgData.data;

    ///proceseaza R, G, B separat
    const rRes = processChannel(orig, 0, quality, true);
    const gRes = processChannel(orig, 1, quality, false);
    const bRes = processChannel(orig, 2, quality, false);

    ///deseneaza original
    const origCanvas = document.getElementById("cbm3-dct-orig");
    const origCtx = origCanvas.getContext("2d");
    origCtx.putImageData(imgData, 0, 0);

    ///deseneaza comprimat
    const compCanvas = document.getElementById("cbm3-dct-comp");
    const compCtx = compCanvas.getContext("2d");
    const compData = compCtx.createImageData(IMG_N, IMG_N);
    for (let i = 0; i < IMG_N * IMG_N; i++) {
      compData.data[i * 4]     = rRes.out[i];
      compData.data[i * 4 + 1] = gRes.out[i];
      compData.data[i * 4 + 2] = bRes.out[i];
      compData.data[i * 4 + 3] = 255;
    }
    compCtx.putImageData(compData, 0, 0);

    drawHeatmap(rRes.firstBlock);

    ///statistici
    const totalCoeffs = rRes.total + gRes.total + bRes.total;
    const nonzeroCoeffs = rRes.nonzero + gRes.nonzero + bRes.nonzero;
    const zeroRatio = ((totalCoeffs - nonzeroCoeffs) / totalCoeffs * 100).toFixed(1);
    const psnrR = psnr(orig.filter((_, i) => i % 4 === 0), rRes.out, IMG_N * IMG_N);
    const Q = getQMatrix(quality);
    const avgQ = Q.flat().reduce((s, v) => s + v, 0) / 64;

    document.getElementById("cbm3-dct-stats").innerHTML = `
      <div class="cbm3-dct-stat">
        <div class="cbm3-dct-stat-label">Coeficienți zerificați</div>
        <div class="cbm3-dct-stat-val">${zeroRatio}%</div>
      </div>
      <div class="cbm3-dct-stat">
        <div class="cbm3-dct-stat-label">PSNR (canal R)</div>
        <div class="cbm3-dct-stat-val">${isFinite(psnrR) ? psnrR.toFixed(1) + " dB" : "∞"}</div>
      </div>
      <div class="cbm3-dct-stat">
        <div class="cbm3-dct-stat-label">Cuantizare medie</div>
        <div class="cbm3-dct-stat-val">${avgQ.toFixed(1)}</div>
      </div>
      <div class="cbm3-dct-stat">
        <div class="cbm3-dct-stat-label">Coef. nenuli / bloc</div>
        <div class="cbm3-dct-stat-val">${((nonzeroCoeffs / (totalCoeffs / 64))).toFixed(1)}</div>
      </div>
    `;

    const hints = {
      peisaj: "Peisajul are zone netede (cer, pământ) care se comprimă bine și margini clare (casă, dealuri) unde apar artefacte la calitate scăzută.",
      gradient: "Gradientul pur are aproape exclusiv frecvențe joase — compresia DCT îl păstrează aproape perfect chiar și la calitate 1.",
      sah: "Tabla de șah are frecvențe înalte maximale — DCT nu poate comprima eficient și apar artefacte severe (blocuri 8×8 vizibile) chiar la calitate ridicată."
    };
    document.getElementById("cbm3-dct-hint").textContent = hints[currentImg] || "";
  }

  ["peisaj", "gradient", "sah"].forEach(img => {
    document.getElementById("cbm3-img-" + img).onclick = () => {
      currentImg = img;
      ["peisaj", "gradient", "sah"].forEach(id =>
        document.getElementById("cbm3-img-" + id).classList.toggle("active", id === img)
      );
      updateDCT();
    };
  });

  document.getElementById("cbm3-dct-q").addEventListener("input", updateDCT);

  updateDCT();
})();