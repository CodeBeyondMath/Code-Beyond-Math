///widget interactiv pt impachetarea punctelor in patrat
///se apeleaza dupa ce marked.parse() si-a facut treaba in #theme4-body

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     1. GEOMETRIE
  ═══════════════════════════════════════════════════════════ */

  function gridPts(l) {
    const pts = [], n = Math.floor(l);
    for (let i = 0; i <= n; i++)
      for (let j = 0; j <= n; j++)
        pts.push([i, j]);
    return pts;
  }

  function hexPts(l) {
    const pts = [], dy = Math.sqrt(3) / 2;
    for (let row = 0; row * dy <= l + 1e-9; row++) {
      const y = row * dy;
      const off = row % 2 === 0 ? 0 : 0.5;
      for (let x = off; x <= l + 1e-9; x += 1)
        pts.push([+x.toFixed(9), +y.toFixed(9)]);
    }
    return pts;
  }

  function nearest(pts, idx) {
    const [px, py] = pts[idx];
    let minD = Infinity, minI = -1;
    for (let i = 0; i < pts.length; i++) {
      if (i === idx) continue;
      const d = Math.hypot(pts[i][0] - px, pts[i][1] - py);
      if (d < minD) { minD = d; minI = i; }
    }
    return { idx: minI, dist: minD };
  }

  const style = document.createElement('style');
  style.textContent = `
.ppd-wrap {
  margin-top: 3.5rem;
  border-top: 2px solid var(--accent);
  padding-top: 2.5rem;
}
.ppd-widget-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 0.35rem;
}
.ppd-widget-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

/* tabs */
.ppd-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid var(--border);
}
.ppd-tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.55rem 1.1rem;
  font-family: var(--font);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  margin-bottom: -1px;
  white-space: nowrap;
}
.ppd-tab:hover { color: var(--accent); }
.ppd-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

/* slider */
.ppd-slider-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.25rem;
}
.ppd-slider-row label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  white-space: nowrap;
}
.ppd-slider-row input[type=range] {
  flex: 1;
  accent-color: var(--accent);
  cursor: pointer;
}
.ppd-lval {
  font-size: 0.95rem;
  font-weight: 700;
  min-width: 38px;
  text-align: right;
  color: var(--accent);
  font-family: 'Courier New', monospace;
}

/* canvas panels */
.ppd-canvases {
  display: flex;
  gap: 1rem;
}
.ppd-panel { flex: 1; min-width: 0; }
.ppd-panel-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.4rem;
}
.ppd-panel-label.ppd-grid { color: var(--accent); }
.ppd-panel-label.ppd-hex  { color: var(--accent); opacity: 0.7; }
.ppd-canvas-wrap {
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-card);
  cursor: crosshair;
  transition: background var(--ease), border-color var(--ease);
}
.ppd-canvas-wrap canvas { display: block; width: 100%; }

/* stats */
.ppd-stats {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
.ppd-stat {
  flex: 1;
  min-width: 120px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0.75rem 1rem;
  transition: background var(--ease), border-color 0.2s;
}
.ppd-stat.winner {
  border-color: var(--accent);
  background: var(--bg-card);
}
.ppd-stat-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.35rem;
}
.ppd-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--accent);
  font-family: 'Courier New', monospace;
}
.ppd-stat-formula {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.35rem;
  font-family: 'Courier New', monospace;
  word-break: break-all;
}
.ppd-bar-wrap {
  height: 3px;
  border-radius: 2px;
  background: var(--border);
  margin-top: 0.6rem;
  overflow: hidden;
}
.ppd-bar-fill {
  height: 100%;
  border-radius: 2px;
  background: var(--accent);
  transition: width 0.35s ease;
}
.ppd-bar-label {
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 0.3rem;
  font-family: 'Courier New', monospace;
}
.ppd-gain {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.75rem 1.25rem;
  min-width: 80px;
}
.ppd-gain-num {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--accent);
  font-family: 'Courier New', monospace;
  line-height: 1;
}
.ppd-gain-lbl {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 0.3rem;
  line-height: 1.4;
}

/* toggles */
.ppd-toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-top: 1rem;
}
.ppd-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: var(--text-muted);
  cursor: pointer;
  font-family: var(--font);
}
.ppd-toggle input { accent-color: var(--accent); cursor: pointer; }

/* hint */
.ppd-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.75rem;
  text-align: center;
  opacity: 0.7;
}

@media (max-width: 520px) {
  .ppd-canvases { flex-direction: column; }
  .ppd-stat-value { font-size: 1.25rem; }
}
`;
  document.head.appendChild(style);

  /* ═══════════════════════════════════════════════════════════
     2. HELPERS DOM + CANVAS
  ═══════════════════════════════════════════════════════════ */

  function el(tag, cls) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  ///culorile canvas adaptate la tema site-ului
  function colors() {
    return isDark()
      ? { grid: '#818cf8', hex: '#a78bfa', sq: 'rgba(255,255,255,.03)', border: 'rgba(255,255,255,.14)', ref: 'rgba(255,255,255,.05)', labelBg: 'rgba(15,15,23,.88)' }
      : { grid: '#6366f1', hex: '#7c3aed', sq: 'rgba(0,0,0,.025)',      border: 'rgba(0,0,0,.16)',        ref: 'rgba(0,0,0,.05)',        labelBg: 'rgba(255,255,255,.9)' };
  }

  function roundRect(ctx, x, y, w, h, r) {
    if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); return; }
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);         ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  /*═══════════════════════════════════════════════════════════
      3. WIDGET
    ═══════════════════════════════════════════════════════════ */

  const dpr      = Math.min(window.devicePixelRatio || 1, 2);
  let   mode     = 'grid';
  let   l        = 4;
  let   showCircles = false;
  let   showGrid    = true;
  let   hovered     = { id: null, idx: -1 };
  let   canvases    = {};
  let   raf         = null;
  let   resizeObs   = null;

  ///container principal
  const wrap = el('div', 'ppd-wrap');
  wrap.innerHTML = `
    <div class="ppd-widget-title">Demo interactiv</div>
    <p class="ppd-widget-sub">Explorează cele două configurații de ambalare și compară-le în timp real.</p>
  `;

  ///tabs
  const tabBar = el('div', 'ppd-tabs');
  const tabDefs = [['grid', 'Grilă pătrată'], ['hex', 'Hexagonală'], ['both', 'Comparație']];
  const tabs = {};
  tabDefs.forEach(([id, lbl]) => {
    const btn = el('button', 'ppd-tab' + (id === mode ? ' active' : ''));
    btn.textContent = lbl;
    btn.dataset.mode = id;
    tabBar.appendChild(btn);
    tabs[id] = btn;
  });
  wrap.appendChild(tabBar);

  ///slider
  const sliderRow = el('div', 'ppd-slider-row');
  const slLabel   = el('label'); slLabel.textContent = 'Latura l';
  const slider    = el('input');
  Object.assign(slider, { type: 'range', min: 1, max: 10, step: 0.5, value: l });
  const lVal = el('span', 'ppd-lval'); lVal.textContent = l.toFixed(1);
  sliderRow.append(slLabel, slider, lVal);
  wrap.appendChild(sliderRow);

  ///zona canvasuri
  const canvasArea = el('div', 'ppd-canvases');
  wrap.appendChild(canvasArea);

  ///stats
  const statsArea = el('div', 'ppd-stats');
  wrap.appendChild(statsArea);

  ///toggles
  const toggles    = el('div', 'ppd-toggles');
  const circleChk  = el('input'); circleChk.type = 'checkbox';
  const gridChk    = el('input'); gridChk.type = 'checkbox'; gridChk.checked = true;
  const t1 = el('label', 'ppd-toggle'); t1.append(circleChk, 'Cercuri de excludere (rază ½)');
  const t2 = el('label', 'ppd-toggle'); t2.append(gridChk,   'Linii de referință');
  toggles.append(t1, t2);
  wrap.appendChild(toggles);

  const hint = el('p', 'ppd-hint');
  hint.textContent = 'Treci cu mouse-ul peste un punct pentru a vedea distanța față de vecinul cel mai apropiat.';
  wrap.appendChild(hint);

  ///inserare in pagina
  const bodyEl = document.getElementById('theme4-body');
  if (bodyEl) bodyEl.appendChild(wrap);

  /* ─────── panele canvas ─────── */
  function rebuildPanels() {
    canvasArea.innerHTML = '';
    canvases = {};
    if (resizeObs) resizeObs.disconnect();
    resizeObs = new ResizeObserver(() => schedule());

    function addPanel(id, label, labelCls) {
      const panel = el('div', 'ppd-panel');
      if (label) {
        const lbl = el('div', 'ppd-panel-label ' + labelCls);
        lbl.textContent = label;
        panel.appendChild(lbl);
      }
      const wrap2 = el('div', 'ppd-canvas-wrap');
      const cv    = el('canvas');
      wrap2.appendChild(cv);
      panel.appendChild(wrap2);
      canvasArea.appendChild(panel);
      canvases[id] = cv;
      resizeObs.observe(wrap2);
    }

    if (mode === 'both') {
      addPanel('grid', 'Grilă pătrată', 'ppd-grid');
      addPanel('hex',  'Hexagonală',    'ppd-hex');
    } else {
      addPanel(mode, null, '');
    }

    attachCanvasEvents();
  }

  /* ─────── eventuri ─────── */
  tabBar.addEventListener('click', e => {
    const btn = e.target.closest('.ppd-tab');
    if (!btn || btn.dataset.mode === mode) return;
    mode = btn.dataset.mode;
    Object.values(tabs).forEach(b => b.classList.remove('active'));
    tabs[mode].classList.add('active');
    rebuildPanels();
    schedule();
  });

  slider.addEventListener('input', () => {
    l = parseFloat(slider.value);
    lVal.textContent = l.toFixed(1);
    schedule();
  });

  circleChk.addEventListener('change', () => { showCircles = circleChk.checked; schedule(); });
  gridChk.addEventListener('change',   () => { showGrid    = gridChk.checked;   schedule(); });

  ///tema site-ului se poate schimba la runtime - redeseneaza canvas la toggle
  document.getElementById('themeToggle')?.addEventListener('click', () => {
    ///asteapta sa se aplice atributul data-theme, apoi redeseneaza
    requestAnimationFrame(() => schedule());
  });

  function attachCanvasEvents() {
    Object.entries(canvases).forEach(([id, cv]) => {
      cv.addEventListener('mousemove', e => {
        const pts  = id === 'grid' ? gridPts(l) : hexPts(l);
        const info = scaleInfo(cv);
        const rect = cv.getBoundingClientRect();
        const mx   = (e.clientX - rect.left) * (cv.width / rect.width)  / dpr;
        const my   = (e.clientY - rect.top)  * (cv.height / rect.height) / dpr;

        let minD = Infinity, minI = -1;
        pts.forEach(([px, py], i) => {
          const d = Math.hypot(mx - (info.ox + px * info.sc), my - (info.oy + py * info.sc));
          if (d < minD) { minD = d; minI = i; }
        });
        const thr    = Math.max(14, info.sc * 0.28);
        const newIdx = minD < thr ? minI : -1;
        if (newIdx !== hovered.idx || id !== hovered.id) {
          hovered = { id, idx: newIdx };
          schedule();
        }
      });
      cv.addEventListener('mouseleave', () => { hovered = { id: null, idx: -1 }; schedule(); });
    });
  }

  /* ─────── render ─────── */
  function scaleInfo(cv) {
    const W  = cv.parentElement.clientWidth || 300;
    const pad = 26;
    const sc  = (W - 2 * pad) / l;
    return { sc, ox: pad, oy: pad, W, H: l * sc + 2 * pad };
  }

  function schedule() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(render);
  }

  function render() {
    raf = null;
    updateStats();
    Object.entries(canvases).forEach(([id, cv]) => drawCanvas(cv, id));
  }

  function drawCanvas(cv, id) {
    const { sc, ox, oy, W, H } = scaleInfo(cv);
    const C = colors();
    const col = id === 'grid' ? C.grid : C.hex;
    const pts = id === 'grid' ? gridPts(l) : hexPts(l);

    ///redimensionare
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width  = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.height = H + 'px';
    }

    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    ///patrat
    ctx.fillStyle   = C.sq;
    ctx.strokeStyle = C.border;
    ctx.lineWidth   = 1;
    roundRect(ctx, ox, oy, l * sc, l * sc, 3);
    ctx.fill(); ctx.stroke();

    ///linii de referinta
    if (showGrid) {
      ctx.strokeStyle = C.ref;
      ctx.lineWidth   = 0.5;
      for (let k = 1; k < Math.ceil(l); k++) {
        ctx.beginPath(); ctx.moveTo(ox + k*sc, oy);        ctx.lineTo(ox + k*sc, oy + l*sc); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox,        oy + k*sc); ctx.lineTo(ox + l*sc, oy + k*sc); ctx.stroke();
      }
      if (id === 'hex') {
        const dy = Math.sqrt(3) / 2;
        ctx.strokeStyle = col + '22';
        for (let row = 1; row * dy <= l + 1e-9; row++) {
          const y = oy + row * dy * sc;
          ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(ox + l*sc, y); ctx.stroke();
        }
      }
    }

    ///cercuri de excludere
    if (showCircles) {
      ctx.strokeStyle = col + '30';
      ctx.lineWidth   = 1;
      pts.forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(ox + px*sc, oy + py*sc, sc * 0.5, 0, Math.PI*2);
        ctx.stroke();
      });
    }

    ///hover: linie catre cel mai apropiat vecin
    if (hovered.id === id && hovered.idx >= 0 && hovered.idx < pts.length) {
      const nb = nearest(pts, hovered.idx);
      if (nb.idx >= 0) {
        const [ax, ay] = pts[hovered.idx];
        const [bx, by] = pts[nb.idx];
        const cax = ox + ax*sc, cay = oy + ay*sc;
        const cbx = ox + bx*sc, cby = oy + by*sc;

        ctx.strokeStyle = col + '70';
        ctx.lineWidth   = 1.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(cax, cay); ctx.lineTo(cbx, cby); ctx.stroke();
        ctx.setLineDash([]);

        ///eticheta distanta
        const mx = (cax + cbx) / 2, my = (cay + cby) / 2;
        const lbl = 'd = ' + nb.dist.toFixed(3);
        ctx.font      = 'bold 11px "Courier New", monospace';
        ctx.textAlign = 'center';
        const tw = ctx.measureText(lbl).width + 12;
        ctx.fillStyle = C.labelBg;
        roundRect(ctx, mx - tw/2, my - 10, tw, 18, 4); ctx.fill();
        ctx.fillStyle = col;
        ctx.fillText(lbl, mx, my + 3);
        ctx.textAlign = 'left';

        if (showCircles) {
          ctx.strokeStyle = col + '90';
          ctx.lineWidth   = 1.5;
          ctx.beginPath();
          ctx.arc(cax, cay, sc * 0.5, 0, Math.PI*2);
          ctx.stroke();
        }
      }
    }

    ///puncte
    const rBase = Math.max(3, Math.min(7, sc * 0.13));
    pts.forEach(([px, py], i) => {
      const cx = ox + px*sc, cy = oy + py*sc;
      const isHov = hovered.id === id && hovered.idx === i;
      const isNb  = hovered.id === id && hovered.idx >= 0 && hovered.idx < pts.length
        ? nearest(pts, hovered.idx).idx === i : false;

      const r     = isHov ? rBase * 1.6 : isNb ? rBase * 1.25 : rBase;
      const alpha = isHov ? 'ff' : isNb ? 'cc' : '99';

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI*2);
      ctx.fillStyle = col + alpha;
      ctx.fill();

      if (isHov || isNb) {
        ctx.strokeStyle = col;
        ctx.lineWidth   = 1.5;
        ctx.stroke();
      }
    });

    ///badge numar puncte
    const badge = pts.length + ' puncte';
    ctx.font      = 'bold 11px "Courier New", monospace';
    ctx.textAlign = 'left';
    const bw = ctx.measureText(badge).width + 12;
    ctx.fillStyle = C.labelBg;
    roundRect(ctx, ox + 4, oy + 4, bw, 19, 4); ctx.fill();
    ctx.fillStyle = col;
    ctx.fillText(badge, ox + 10, oy + 16);

    ///badge randuri (hex)
    if (id === 'hex') {
      const rows = Math.floor(l / (Math.sqrt(3) / 2)) + 1;
      const info2 = rows + ' rânduri';
      const iw    = ctx.measureText(info2).width + 12;
      const ix    = ox + l*sc - iw - 4, iy = oy + l*sc - 23;
      ctx.fillStyle = C.labelBg;
      roundRect(ctx, ix, iy, iw, 19, 4); ctx.fill();
      ctx.fillStyle = col + 'aa';
      ctx.fillText(info2, ix + 6, iy + 13);
    }
  }

  /* ─────── stats ─────── */
  function updateStats() {
    const gPts = gridPts(l), hPts = hexPts(l);
    const ng   = gPts.length, nh = hPts.length;
    const nl   = Math.floor(l);
    const area = l * l;
    const gDens = Math.min(100, ng * Math.PI * 0.25 / area * 100);
    const hDens = Math.min(100, nh * Math.PI * 0.25 / area * 100);

    statsArea.innerHTML = '';

    function makeCard(label, n, formula, dens, win, maxTeor) {
      const card = el('div', 'ppd-stat' + (win ? ' winner' : ''));
      card.innerHTML = `
        <div class="ppd-stat-label">${label}</div>
        <div class="ppd-stat-value">${n}</div>
        <div class="ppd-stat-formula">${formula}</div>
        <div class="ppd-bar-wrap">
          <div class="ppd-bar-fill" style="width:${dens.toFixed(1)}%"></div>
        </div>
        <div class="ppd-bar-label">densitate ${dens.toFixed(1)}% · max ${maxTeor}%</div>
      `;
      return card;
    }

    if (mode === 'grid' || mode === 'both') {
      statsArea.appendChild(makeCard(
        'Grilă pătrată',
        ng + ' puncte',
        `(⌊${l}⌋+1)² = (${nl}+1)² = ${ng}`,
        gDens,
        mode === 'both' && ng > nh,
        '78.5'
      ));
    }

    if (mode === 'hex' || mode === 'both') {
      const rows = Math.floor(l / (Math.sqrt(3) / 2)) + 1;
      statsArea.appendChild(makeCard(
        'Hexagonală',
        nh + ' puncte',
        `${rows} rânduri, pas √3/2 ≈ ${(Math.sqrt(3)/2).toFixed(3)}`,
        hDens,
        mode === 'both' && nh >= ng,
        '90.7'
      ));
    }

    if (mode === 'both') {
      const diff  = nh - ng;
      const gain  = el('div', 'ppd-stat ppd-gain');
      gain.innerHTML = `
        <div class="ppd-gain-num" style="color:${diff > 0 ? 'var(--accent)' : diff < 0 ? '#ef4444' : 'var(--text-muted)'}">${diff >= 0 ? '+' : ''}${diff}</div>
        <div class="ppd-gain-lbl">puncte câștigate<br>hex vs grilă</div>
      `;
      statsArea.appendChild(gain);
    }
  }

  /* ─────── init ─────── */
  rebuildPanels();
  schedule();
})();
