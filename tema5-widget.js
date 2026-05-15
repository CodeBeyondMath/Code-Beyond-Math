/// Widget Fractali — Sierpiński Triangle + Hexagon + Dragon Curve
/// Adaptat pentru Code Beyond Math (light + dark mode)
(function () {
  'use strict';

  // ─── STILURI GLOBALE WIDGET ─────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
/* ── Variabile temă – light (default) ── */
.fr-widget {
  --fr-accent:       #1a3575;
  --fr-accent-tab:   #1a3575;
  --fr-sub:          #4a6fa5;
  --fr-border:       #c5d0e8;
  --fr-border-light: rgba(0,0,0,0.08);
  --fr-btn-bg:       #eef2fb;
  --fr-btn-bg-h:     #dde5f7;
  --fr-btn-text:     #1a3575;
  --fr-btn-border:   #c5d0e8;
  --fr-btn-border-h: #1a3575;
  --fr-badge-bg:     #eef2fb;
  --fr-badge-text:   #2a4580;
  --fr-sp-bg:        #f5f7fd;
  --fr-sp-text:      #4a6fa5;
  --fr-sp-border:    #c5d0e8;
  --fr-canvas-bg:    #0b0f1e;
  --fr-canvas-bdr:   #c5d0e8;
}

/* ── Variabile temă – dark ── */
[data-theme="dark"] .fr-widget {
  --fr-accent:       #e8c84a;
  --fr-accent-tab:   #e8c84a;
  --fr-sub:          #a0b4d8;
  --fr-border:       #2d4070;
  --fr-border-light: rgba(255,255,255,0.07);
  --fr-btn-bg:       #1a2540;
  --fr-btn-bg-h:     #1f2e55;
  --fr-btn-text:     #e8c84a;
  --fr-btn-border:   #3a4d7a;
  --fr-btn-border-h: #e8c84a;
  --fr-badge-bg:     #0f1a35;
  --fr-badge-text:   #a0c8ff;
  --fr-sp-bg:        #0f1a35;
  --fr-sp-text:      #a0b4d8;
  --fr-sp-border:    #2d4070;
  --fr-canvas-bg:    #0b0f1e;
  --fr-canvas-bdr:   #2d4070;
}

/* ── Layout ── */
.fr-widget {
  margin-top: 3.5rem;
  border-top: 2px solid var(--fr-border);
  padding-top: 2rem;
  font-family: 'Montserrat', sans-serif;
  transition: border-color 0.3s;
}

.fr-title {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--fr-accent);
  margin-bottom: 0.25rem;
  transition: color 0.3s;
}

.fr-sub {
  font-size: 0.82rem;
  color: var(--fr-sub);
  margin-bottom: 1.4rem;
  transition: color 0.3s;
}

/* ── Taburi ── */
.fr-tabs {
  display: flex;
  border-bottom: 1px solid var(--fr-border);
  margin-bottom: 1.6rem;
  flex-wrap: wrap;
  transition: border-color 0.3s;
}

.fr-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.5rem 1.1rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--fr-sub);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  margin-bottom: -1px;
  letter-spacing: 0.03em;
}
.fr-tab:hover  { color: var(--fr-accent-tab); }
.fr-tab.active { color: var(--fr-accent-tab); border-bottom-color: var(--fr-accent-tab); }

.fr-panel { display: none; }
.fr-panel.active { display: block; }

/* ── Butoane principale ── */
.fr-btn {
  background: var(--fr-btn-bg);
  color: var(--fr-btn-text);
  border: 1.5px solid var(--fr-btn-border);
  border-radius: 8px;
  padding: 0.4rem 0.9rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.fr-btn:hover {
  border-color: var(--fr-btn-border-h);
  background: var(--fr-btn-bg-h);
}

/* ── Butoane viteză ── */
.fr-sp-btn {
  background: var(--fr-sp-bg);
  color: var(--fr-sp-text);
  border: 1.5px solid var(--fr-sp-border);
  border-radius: 6px;
  padding: 0.25rem 0.55rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.fr-sp-btn:hover { color: var(--fr-accent); border-color: var(--fr-accent); }
.fr-sp-btn.active {
  background: var(--fr-btn-bg);
  color: var(--fr-accent);
  border-color: var(--fr-accent);
  font-weight: 700;
}

/* ── Rând control ── */
.fr-ctrl {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.6rem;
  flex-wrap: wrap;
}
.fr-slider-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.7rem;
  font-size: 0.78rem;
  color: var(--fr-sub);
  flex-wrap: wrap;
  transition: color 0.3s;
}
.fr-slider-row input[type=range] { accent-color: var(--fr-accent); }
.fr-val {
  min-width: 44px;
  color: var(--fr-accent);
  font-family: 'Courier New', monospace;
  font-weight: 600;
  transition: color 0.3s;
}

/* ── Canvas ── */
.fr-canvas-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}
.fr-canvas-wrap canvas {
  display: block;
  border-radius: 10px;
  border: 1.5px solid var(--fr-canvas-bdr);
  background: var(--fr-canvas-bg);
  transition: border-color 0.3s;
}

/* ── Badges info ── */
.fr-badges {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: center;
  flex-wrap: wrap;
}
.fr-badge {
  font-size: 0.72rem;
  color: var(--fr-badge-text);
  font-family: 'Courier New', monospace;
  background: var(--fr-badge-bg);
  border: 1px solid var(--fr-border);
  padding: 3px 10px;
  border-radius: 6px;
  transition: background 0.3s, border-color 0.3s, color 0.3s;
}

/* ── Grup viteză ── */
.fr-speed-group {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-left: 0.4rem;
}
.fr-speed-group span {
  font-size: 0.78rem;
  color: var(--fr-sub);
  transition: color 0.3s;
}
`;
  document.head.appendChild(style);

  // ─── MARKUP WIDGET ─────────────────────────────────────────────────────────
  const widget = document.createElement('div');
  widget.className = 'fr-widget';
  widget.innerHTML = `
<div class="fr-title">Fractali — Chaos Game &amp; L-Systems</div>
<p class="fr-sub">Explorează trei fractali clasici: Triunghiul Sierpiński, Hexagonul Sierpiński și Dragonul Heighway.</p>

<div class="fr-tabs">
  <button class="fr-tab active" data-panel="sg">Sierpiński</button>
  <button class="fr-tab"        data-panel="hx">Hexagon</button>
  <button class="fr-tab"        data-panel="dg">Dragon</button>
</div>

<!-- TAB 1 — Sierpiński Triangle -->
<div class="fr-panel active" id="fr-panel-sg">
  <div class="fr-ctrl">
    <button class="fr-btn" id="sg-p">▶ Play</button>
    <button class="fr-btn" id="sg-s">⏭ Step</button>
    <button class="fr-btn" id="sg-c">✕ Reset</button>
  </div>
  <div class="fr-slider-row">
    <label>Puncte</label>
    <input id="sg-n" type="range" min="100" max="50000" step="100" value="5000" style="width:80px">
    <span class="fr-val" id="sg-no">5,000</span>
    <label style="margin-left:.4rem">x₀</label>
    <input id="sg-px" type="range" min="0" max="100" step="1" value="50" style="width:60px">
    <span class="fr-val" id="sg-pxo" style="min-width:22px">50</span>
    <label style="margin-left:.4rem">y₀</label>
    <input id="sg-py" type="range" min="0" max="100" step="1" value="50" style="width:60px">
    <span class="fr-val" id="sg-pyo" style="min-width:22px">50</span>
  </div>
  <div class="fr-canvas-wrap">
    <canvas id="sg-cv" width="380" height="360" style="cursor:crosshair"></canvas>
  </div>
  <div class="fr-badges">
    <span class="fr-badge" id="sg-i">puncte: 0</span>
    <span class="fr-badge" id="sg-p0">P₀: (50, 50)</span>
  </div>
</div>

<!-- TAB 2 — Hexagon -->
<div class="fr-panel" id="fr-panel-hx">
  <div class="fr-ctrl">
    <button class="fr-btn" id="hx-p">▶ Play</button>
    <button class="fr-btn" id="hx-st">⏭ Step</button>
    <button class="fr-btn" id="hx-c">✕ Reset</button>
    <div class="fr-speed-group">
      <span>Viteză</span>
      <button class="fr-sp-btn" data-sp="0.5" data-grp="hx">0.5×</button>
      <button class="fr-sp-btn active" data-sp="1" data-grp="hx">1×</button>
      <button class="fr-sp-btn" data-sp="2" data-grp="hx">2×</button>
      <button class="fr-sp-btn" data-sp="5" data-grp="hx">5×</button>
    </div>
  </div>
  <div class="fr-slider-row">
    <label>Puncte</label>
    <input id="hx-n" type="range" min="100" max="60000" step="100" value="8000" style="width:80px">
    <span class="fr-val" id="hx-no">8,000</span>
  </div>
  <div class="fr-canvas-wrap">
    <canvas id="hx-cv" width="380" height="360" style="cursor:crosshair"></canvas>
  </div>
  <div class="fr-badges">
    <span class="fr-badge" id="hx-info">puncte: 0</span>
    <span class="fr-badge">Chaos Game · 6 vârfuri · raport ½</span>
  </div>
</div>

<!-- TAB 3 — Dragon Curve -->
<div class="fr-panel" id="fr-panel-dg">
  <div class="fr-ctrl">
    <button class="fr-btn" id="dg-p">▶ Play</button>
    <button class="fr-btn" id="dg-st">⏭ Step</button>
    <button class="fr-btn" id="dg-c">✕ Reset</button>
    <div class="fr-speed-group">
      <span>Viteză</span>
      <button class="fr-sp-btn" data-sp="0.5" data-grp="dg">0.5×</button>
      <button class="fr-sp-btn active" data-sp="1" data-grp="dg">1×</button>
      <button class="fr-sp-btn" data-sp="2" data-grp="dg">2×</button>
      <button class="fr-sp-btn" data-sp="5" data-grp="dg">5×</button>
    </div>
  </div>
  <div class="fr-slider-row">
    <label>Iterații</label>
    <input id="dg-n" type="range" min="1" max="18" step="1" value="12" style="width:80px">
    <span class="fr-val" id="dg-no" style="min-width:22px">12</span>
    <span style="margin-left:.4rem">segmente: <span class="fr-val" id="dg-seg" style="min-width:auto">4,096</span></span>
  </div>
  <div class="fr-canvas-wrap">
    <canvas id="dg-cv" width="380" height="360"></canvas>
  </div>
  <div class="fr-badges">
    <span class="fr-badge" id="dg-info">iterații: 12</span>
    <span class="fr-badge">L-System · rotație 90° · Dragon Heighway</span>
  </div>
</div>
`;

  const bodyEl = document.getElementById('theme5-body') || document.body;
  bodyEl.appendChild(widget);

  // ─── TAB SWITCHING ──────────────────────────────────────────────────────────
  document.querySelectorAll('.fr-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.fr-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.fr-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('fr-panel-' + tab.dataset.panel).classList.add('active');
    });
  });

  // Speed buttons helper
  function initSpeedBtns(grp, onSet) {
    document.querySelectorAll(`.fr-sp-btn[data-grp="${grp}"]`).forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll(`.fr-sp-btn[data-grp="${grp}"]`).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        onSet(parseFloat(btn.dataset.sp));
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 1 — SIERPIŃSKI TRIANGLE
  // ═══════════════════════════════════════════════════════════════════════════
  (function () {
    const W = 380, H = 360;
    const PAD = 30;
    const AX = PAD, AY = H - PAD;
    const BX = W - PAD, BY = H - PAD;
    const CX = W / 2, CY = PAD + 8;
    const VERTS = [[AX / W, AY / H], [BX / W, BY / H], [CX / W, CY / H]];

    let animId = null, isAnimating = false;

    function generatePoints(x0, y0, n) {
      const pts = [];
      let x = x0 / 100, y = y0 / 100;
      for (let i = 0; i < n; i++) {
        const v = VERTS[Math.floor(Math.random() * 3)];
        x = (x + v[0]) / 2; y = (y + v[1]) / 2;
        pts.push([x * W, y * H]);
      }
      return pts;
    }

    function drawTriangle(ctx) {
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      ctx.moveTo(AX, AY); ctx.lineTo(BX, BY); ctx.lineTo(CX, CY);
      ctx.closePath();
      ctx.strokeStyle = '#4a6fa5'; ctx.lineWidth = 1.2; ctx.stroke();
      [['A', AX, AY, -13, 13], ['B', BX, BY, 7, 13], ['C', CX, CY, -3, -8]].forEach(([lbl, vx, vy, dx, dy]) => {
        ctx.beginPath(); ctx.arc(vx, vy, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#4a8cdb'; ctx.fill();
        ctx.fillStyle = '#a0c8ff'; ctx.font = '11px monospace';
        ctx.fillText(lbl, vx + dx, vy + dy);
      });
    }

    function drawP0(ctx, x0, y0) {
      const px = AX + (x0 / 100) * (BX - AX);
      const py = AY - (y0 / 100) * (AY - CY);
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ff4444'; ctx.fill();
      ctx.fillStyle = '#ff7777'; ctx.font = '11px monospace';
      ctx.fillText('P₀', px + 8, py - 4);
    }

    function drawPoints(ctx, pts, limit) {
      const lim = limit !== undefined ? limit : pts.length;
      for (let i = 0; i < lim; i++) {
        const t = i / pts.length;
        ctx.fillStyle = `rgb(${Math.round(232 - t * 40)},${Math.round(200 - t * 60)},${Math.round(74 + t * 20)})`;
        ctx.fillRect(pts[i][0], pts[i][1], 1.4, 1.4);
      }
    }

    const cv  = document.getElementById('sg-cv');
    const ctx = cv.getContext('2d');
    const nSlider  = document.getElementById('sg-n');
    const pxSlider = document.getElementById('sg-px');
    const pySlider = document.getElementById('sg-py');
    const nOut  = document.getElementById('sg-no');
    const pxOut = document.getElementById('sg-pxo');
    const pyOut = document.getElementById('sg-pyo');
    const infoEl = document.getElementById('sg-i');
    const p0El   = document.getElementById('sg-p0');
    const playBtn = document.getElementById('sg-p');

    function run() {
      if (animId) { cancelAnimationFrame(animId); animId = null; isAnimating = false; playBtn.textContent = '▶ Play'; }
      const n  = parseInt(nSlider.value);
      const x0 = parseInt(pxSlider.value);
      const y0 = parseInt(pySlider.value);
      const pts = generatePoints(x0, y0, n);
      drawTriangle(ctx); drawPoints(ctx, pts); drawP0(ctx, x0, y0);
      infoEl.textContent = 'puncte: ' + n.toLocaleString();
    }

    function animate() {
      if (isAnimating) { cancelAnimationFrame(animId); animId = null; isAnimating = false; playBtn.textContent = '▶ Play'; return; }
      isAnimating = true; playBtn.textContent = '⏸ Pauză';
      const n  = parseInt(nSlider.value);
      const x0 = parseInt(pxSlider.value);
      const y0 = parseInt(pySlider.value);
      const pts = generatePoints(x0, y0, n); let drawn = 0;
      const step = Math.max(1, Math.floor(n / 200));
      function frame() {
        if (!isAnimating) return;
        drawTriangle(ctx);
        drawn = Math.min(drawn + step, n);
        drawPoints(ctx, pts, drawn);
        drawP0(ctx, x0, y0);
        infoEl.textContent = 'puncte: ' + drawn.toLocaleString() + ' / ' + n.toLocaleString();
        if (drawn < n) animId = requestAnimationFrame(frame);
        else { isAnimating = false; playBtn.textContent = '▶ Play'; }
      }
      animId = requestAnimationFrame(frame);
    }

    nSlider.oninput  = () => { nOut.textContent = parseInt(nSlider.value).toLocaleString(); };
    pxSlider.oninput = () => { pxOut.textContent = pxSlider.value; p0El.textContent = 'P₀: (' + pxSlider.value + ', ' + pySlider.value + ')'; run(); };
    pySlider.oninput = () => { pyOut.textContent = pySlider.value; p0El.textContent = 'P₀: (' + pxSlider.value + ', ' + pySlider.value + ')'; run(); };
    playBtn.addEventListener('click', animate);
    document.getElementById('sg-s').addEventListener('click', () => { if (!isAnimating) run(); });
    document.getElementById('sg-c').addEventListener('click', () => {
      if (animId) { cancelAnimationFrame(animId); animId = null; isAnimating = false; }
      playBtn.textContent = '▶ Play';
      nSlider.value = 5000; nOut.textContent = '5,000';
      pxSlider.value = 50; pxOut.textContent = '50';
      pySlider.value = 50; pyOut.textContent = '50';
      p0El.textContent = 'P₀: (50, 50)'; infoEl.textContent = 'puncte: 0';
      drawTriangle(ctx); drawP0(ctx, 50, 50);
    });
    cv.addEventListener('click', e => {
      const r   = cv.getBoundingClientRect();
      const mcx = (e.clientX - r.left) * (W / r.width);
      const mcy = (e.clientY - r.top)  * (H / r.height);
      const nx  = Math.max(0, Math.min(100, Math.round((mcx - AX) / (BX - AX) * 100)));
      const ny  = Math.max(0, Math.min(100, Math.round((AY - mcy) / (AY - CY) * 100)));
      pxSlider.value = nx; pxOut.textContent = nx;
      pySlider.value = ny; pyOut.textContent = ny;
      p0El.textContent = 'P₀: (' + nx + ', ' + ny + ')'; run();
    });
    drawTriangle(ctx); run();
  })();

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 2 — HEXAGON SIERPIŃSKI
  // ═══════════════════════════════════════════════════════════════════════════
  (function () {
    const W = 380, H = 360;
    const cx = W / 2, cy = H / 2, R = 155;
    const VERTS = [];
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 2 + i * Math.PI / 3;
      VERTS.push([cx + R * Math.cos(a), cy - R * Math.sin(a)]);
    }

    let animId = null, isAnimating = false, speedMult = 1;

    function generatePoints(n) {
      const pts = [];
      let x = cx, y = cy;
      for (let i = 0; i < n; i++) {
        const v = VERTS[Math.floor(Math.random() * 6)];
        x = (x + v[0]) / 2; y = (y + v[1]) / 2;
        pts.push([x, y]);
      }
      return pts;
    }

    function drawHexagon(ctx) {
      ctx.clearRect(0, 0, W, H);
      ctx.beginPath();
      VERTS.forEach((v, i) => { i === 0 ? ctx.moveTo(v[0], v[1]) : ctx.lineTo(v[0], v[1]); });
      ctx.closePath();
      ctx.strokeStyle = '#4a6fa5'; ctx.lineWidth = 1.2; ctx.stroke();
      const lbls = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
      const off  = [[0, -14], [12, -7], [12, 12], [0, 16], [-18, 12], [-18, -7]];
      VERTS.forEach((v, i) => {
        ctx.beginPath(); ctx.arc(v[0], v[1], 4, 0, Math.PI * 2);
        ctx.fillStyle = '#4a8cdb'; ctx.fill();
        ctx.fillStyle = '#a0c8ff'; ctx.font = '10px monospace';
        ctx.fillText(lbls[i], v[0] + off[i][0], v[1] + off[i][1]);
      });
    }

    function drawPoints(ctx, pts, limit) {
      const lim = limit !== undefined ? limit : pts.length;
      for (let i = 0; i < lim; i++) {
        const t = i / pts.length;
        ctx.fillStyle = `rgb(${Math.round(232 - t * 50)},${Math.round(200 - t * 70)},${Math.round(74 + t * 30)})`;
        ctx.fillRect(pts[i][0], pts[i][1], 1.4, 1.4);
      }
    }

    const cv  = document.getElementById('hx-cv');
    const ctx = cv.getContext('2d');
    const nSlider = document.getElementById('hx-n');
    const nOut    = document.getElementById('hx-no');
    const infoEl  = document.getElementById('hx-info');
    const playBtn = document.getElementById('hx-p');

    initSpeedBtns('hx', v => { speedMult = v; });

    function run() {
      if (animId) { cancelAnimationFrame(animId); animId = null; isAnimating = false; playBtn.textContent = '▶ Play'; }
      const n   = parseInt(nSlider.value);
      const pts = generatePoints(n);
      drawHexagon(ctx); drawPoints(ctx, pts);
      infoEl.textContent = 'puncte: ' + n.toLocaleString();
    }

    function animate() {
      if (isAnimating) { cancelAnimationFrame(animId); animId = null; isAnimating = false; playBtn.textContent = '▶ Play'; return; }
      isAnimating = true; playBtn.textContent = '⏸ Pauză';
      const n   = parseInt(nSlider.value);
      const pts = generatePoints(n); let drawn = 0;
      const baseStep = Math.max(1, Math.floor(n / 200));
      function frame() {
        if (!isAnimating) return;
        drawHexagon(ctx);
        const step = Math.max(1, Math.round(baseStep * speedMult));
        drawn = Math.min(drawn + step, n);
        drawPoints(ctx, pts, drawn);
        infoEl.textContent = 'puncte: ' + drawn.toLocaleString() + ' / ' + n.toLocaleString();
        if (drawn < n) animId = requestAnimationFrame(frame);
        else { isAnimating = false; playBtn.textContent = '▶ Play'; }
      }
      animId = requestAnimationFrame(frame);
    }

    nSlider.oninput = () => { nOut.textContent = parseInt(nSlider.value).toLocaleString(); };
    playBtn.addEventListener('click', animate);
    document.getElementById('hx-st').addEventListener('click', () => { if (!isAnimating) run(); });
    document.getElementById('hx-c').addEventListener('click', () => {
      if (animId) { cancelAnimationFrame(animId); animId = null; isAnimating = false; }
      playBtn.textContent = '▶ Play';
      nSlider.value = 8000; nOut.textContent = '8,000';
      infoEl.textContent = 'puncte: 0';
      drawHexagon(ctx);
    });
    drawHexagon(ctx); run();
  })();

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB 3 — DRAGON CURVE
  // ═══════════════════════════════════════════════════════════════════════════
  (function () {
    const W = 380, H = 360;
    let animId = null, isAnimating = false, speedMult = 1;

    function dragonSegs(n) {
      let dirs = [0];
      for (let i = 0; i < n; i++) {
        const copy = dirs.slice();
        dirs.push(1);
        for (let j = copy.length - 1; j >= 0; j--) dirs.push(1 - copy[j]);
      }
      return dirs;
    }

    function buildPoints(segs) {
      let x = 0, y = 0, angle = 0;
      const pts = [[x, y]];
      for (let i = 0; i < segs.length; i++) {
        angle += segs[i] === 1 ? 90 : -90;
        const r = angle * Math.PI / 180;
        x += Math.cos(r); y += Math.sin(r);
        pts.push([x, y]);
      }
      return pts;
    }

    function fitPoints(pts) {
      let mnx = Infinity, mxx = -Infinity, mny = Infinity, mxy = -Infinity;
      pts.forEach(([x, y]) => {
        mnx = Math.min(mnx, x); mxx = Math.max(mxx, x);
        mny = Math.min(mny, y); mxy = Math.max(mxy, y);
      });
      const pw = mxx - mnx || 1, ph = mxy - mny || 1;
      const sc = Math.min((W - 60) / pw, (H - 60) / ph);
      const ox = (W - pw * sc) / 2 - mnx * sc;
      const oy = (H - ph * sc) / 2 - mny * sc;
      return pts.map(([x, y]) => [x * sc + ox, y * sc + oy]);
    }

    const cv  = document.getElementById('dg-cv');
    const ctx = cv.getContext('2d');
    const nSlider = document.getElementById('dg-n');
    const nOut    = document.getElementById('dg-no');
    const segEl   = document.getElementById('dg-seg');
    const infoEl  = document.getElementById('dg-info');
    const playBtn = document.getElementById('dg-p');

    initSpeedBtns('dg', v => { speedMult = v; });

    function drawFull() {
      const n    = parseInt(nSlider.value);
      const segs = dragonSegs(n);
      const pts  = fitPoints(buildPoints(segs));
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 0.9;
      for (let i = 1; i < pts.length; i++) {
        const t = (i - 1) / (pts.length - 1);
        ctx.strokeStyle = `rgb(${Math.round(232 - t * 100)},${Math.round(180 - t * 60)},${Math.round(74 + t * 80)})`;
        ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
      }
      segEl.textContent  = segs.length.toLocaleString();
      infoEl.textContent = 'iterații: ' + n + ' · segmente: ' + segs.length.toLocaleString();
    }

    function animate() {
      if (isAnimating) { cancelAnimationFrame(animId); animId = null; isAnimating = false; playBtn.textContent = '▶ Play'; return; }
      isAnimating = true; playBtn.textContent = '⏸ Pauză';
      const n    = parseInt(nSlider.value);
      const segs = dragonSegs(n);
      const pts  = fitPoints(buildPoints(segs));
      const total = pts.length; let drawn = 1;
      const baseStep = Math.max(1, Math.floor(total / 300));
      ctx.clearRect(0, 0, W, H);
      function frame() {
        if (!isAnimating) return;
        const step = Math.max(1, Math.round(baseStep * speedMult));
        const end  = Math.min(drawn + step, total);
        ctx.lineWidth = 0.9;
        for (let i = drawn; i < end; i++) {
          const t = (i - 1) / (total - 1);
          ctx.strokeStyle = `rgb(${Math.round(232 - t * 100)},${Math.round(180 - t * 60)},${Math.round(74 + t * 80)})`;
          ctx.beginPath(); ctx.moveTo(pts[i - 1][0], pts[i - 1][1]); ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke();
        }
        drawn = end;
        infoEl.textContent = 'segmente: ' + drawn.toLocaleString() + ' / ' + total.toLocaleString();
        if (drawn < total) animId = requestAnimationFrame(frame);
        else {
          isAnimating = false; playBtn.textContent = '▶ Play';
          infoEl.textContent = 'iterații: ' + n + ' · segmente: ' + total.toLocaleString();
        }
      }
      animId = requestAnimationFrame(frame);
    }

    nSlider.oninput = () => { nOut.textContent = nSlider.value; if (!isAnimating) drawFull(); };
    playBtn.addEventListener('click', animate);
    document.getElementById('dg-st').addEventListener('click', () => { if (!isAnimating) drawFull(); });
    document.getElementById('dg-c').addEventListener('click', () => {
      if (animId) { cancelAnimationFrame(animId); animId = null; isAnimating = false; }
      playBtn.textContent = '▶ Play';
      nSlider.value = 12; nOut.textContent = '12';
      infoEl.textContent = 'iterații: 12';
      drawFull();
    });
    drawFull();
  })();

})();