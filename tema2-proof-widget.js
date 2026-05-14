///widget demonstratie pas-cu-pas pt cofactorul matricei laplaciene
///se injecteaza in #theme2-body dupa ce marked.parse() a terminat
///depinde doar de stilurile CSS ale platformei (variabile --accent, --bg-card etc.)

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
.cbm2-proof {
  margin-top: 2.5rem;
  border-top: 2px solid var(--accent);
  padding-top: 2rem;
}
.cbm2-proof-title {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 0.25rem;
}
.cbm2-proof-sub {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

/* bara de progres */
.cbm2-pf-steps {
  display: flex;
  gap: 0;
  margin-bottom: 1.75rem;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
}
.cbm2-pf-step-btn {
  flex: 1;
  font-family: var(--font);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 9px 4px;
  border: none;
  border-right: 1px solid var(--border);
  background: var(--bg-alt);
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-align: center;
  line-height: 1.35;
}
.cbm2-pf-step-btn:last-child { border-right: none; }
.cbm2-pf-step-btn:hover { background: var(--bg-card); color: var(--text); }
.cbm2-pf-step-btn.active {
  background: var(--accent);
  color: #fff;
}
.cbm2-pf-step-btn.done {
  background: var(--bg-card);
  color: var(--accent);
}

/* layout principal */
.cbm2-pf-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  align-items: start;
}
@media (max-width: 640px) {
  .cbm2-pf-body { grid-template-columns: 1fr; }
}

/* panoul stang - vizual */
.cbm2-pf-visual {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

/* matricea */
.cbm2-pf-mat-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.cbm2-pf-mat-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
  align-self: flex-start;
}
.cbm2-pf-matrix {
  display: inline-grid;
  gap: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
}
.cbm2-pf-cell {
  width: 44px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text);
  transition: background 0.25s, color 0.25s, opacity 0.25s, transform 0.25s;
  font-weight: 500;
}
.cbm2-pf-cell.diag {
  color: var(--accent);
  font-weight: 700;
}
.cbm2-pf-cell.neg {
  color: #ef4444;
}
.cbm2-pf-cell.eliminated {
  opacity: 0.18;
  background: transparent;
  border-color: transparent;
  transform: scale(0.85);
}
.cbm2-pf-cell.cofactor-hl {
  background: color-mix(in srgb, var(--accent) 12%, var(--bg-card));
  border-color: var(--accent);
}
.cbm2-pf-cell.result-hl {
  background: #d1fae5;
  border-color: #10b981;
  color: #065f46;
  font-weight: 700;
}
[data-theme="dark"] .cbm2-pf-cell.result-hl {
  background: #064e3b;
  border-color: #10b981;
  color: #6ee7b7;
}

/* bracket SVG */
.cbm2-pf-bracket-row {
  display: flex;
  align-items: center;
  gap: 4px;
}
.cbm2-pf-bracket {
  color: var(--text-muted);
  font-size: 2.2rem;
  font-weight: 200;
  line-height: 1;
  user-select: none;
  font-family: 'Courier New', monospace;
}

/* rezultat det */
.cbm2-pf-det-result {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  color: var(--text);
  text-align: center;
  line-height: 1.7;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.35s, transform 0.35s;
}
.cbm2-pf-det-result.show {
  opacity: 1;
  transform: translateY(0);
}
.cbm2-pf-det-val {
  display: inline-block;
  padding: 2px 14px;
  background: #d1fae5;
  border-radius: 20px;
  color: #065f46;
  font-weight: 700;
  font-size: 1.15rem;
}
[data-theme="dark"] .cbm2-pf-det-val {
  background: #064e3b;
  color: #6ee7b7;
}

/* formula pasilor */
.cbm2-pf-formula {
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--text);
  line-height: 1.8;
  width: 100%;
  text-align: center;
  white-space: pre-wrap;
  opacity: 0;
  transition: opacity 0.3s;
}
.cbm2-pf-formula.show { opacity: 1; }

/* panoul drept - explicatie */
.cbm2-pf-explain {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.cbm2-pf-explain-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
}
.cbm2-pf-explain-body {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.7;
}
.cbm2-pf-explain-body strong { color: var(--text); }
.cbm2-pf-explain-body code {
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  background: var(--bg-alt);
  padding: 1px 5px;
  border-radius: 4px;
  color: var(--accent);
}

/* selector graf */
.cbm2-pf-graph-select {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
  align-items: center;
}
.cbm2-pf-graph-select label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-right: 4px;
}
.cbm2-pf-graph-btn {
  font-family: var(--font);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 5px 13px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--bg-card);
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.cbm2-pf-graph-btn:hover { color: var(--accent); border-color: var(--accent); }
.cbm2-pf-graph-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }

/* nav */
.cbm2-pf-nav {
  display: flex;
  gap: 8px;
  margin-top: 1.25rem;
  align-items: center;
}
.cbm2-pf-nav .spacer { flex: 1; }
.cbm2-pf-nav-btn {
  font-family: var(--font);
  font-size: 0.82rem;
  font-weight: 600;
  padding: 7px 18px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  gap: 5px;
}
.cbm2-pf-nav-btn:hover { color: var(--accent); border-color: var(--accent); }
.cbm2-pf-nav-btn.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
.cbm2-pf-nav-btn.primary:hover { opacity: 0.88; }
.cbm2-pf-nav-btn:disabled { opacity: 0.3; cursor: default; pointer-events: none; }

/* badge */
.cbm2-pf-badge {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 2px 9px;
  border-radius: 20px;
  background: color-mix(in srgb, var(--accent) 14%, var(--bg-card));
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
}

/* rezultat final */
.cbm2-pf-final-box {
  margin-top: 1rem;
  background: var(--bg-alt);
  border: 1.5px solid var(--accent);
  border-radius: 10px;
  padding: 0.85rem 1.1rem;
  font-size: 0.88rem;
  color: var(--text);
  line-height: 1.7;
  display: none;
}
.cbm2-pf-final-box.show { display: block; }
.cbm2-pf-final-box strong { color: var(--accent); font-size: 1.05rem; }
`;
  document.head.appendChild(style);

  ///============================================================
  /// Date grafuri predefinite
  ///============================================================
  const GRAPHS = {
    k3: {
      name: "K₃ (triunghi)",
      n: 3,
      edges: [[0,1],[0,2],[1,2]],
      desc: "Graful complet cu 3 noduri. Simplu de verificat manual."
    },
    k4: {
      name: "K₄",
      n: 4,
      edges: [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]],
      desc: "Graful complet cu 4 noduri. Formula Cayley: τ(K₄) = 4² = 16."
    },
    c4: {
      name: "C₄ (pătrat)",
      n: 4,
      edges: [[0,1],[1,2],[2,3],[3,0]],
      desc: "Ciclu cu 4 noduri. τ(C₄) = 4 (număr egal cu nodurile)."
    },
    c5: {
      name: "C₅",
      n: 5,
      edges: [[0,1],[1,2],[2,3],[3,4],[4,0]],
      desc: "Ciclu cu 5 noduri. τ(C₅) = 5."
    },
    petersen_sub: {
      name: "Rotiță (roată W₄)",
      n: 5,
      edges: [[0,1],[0,2],[0,3],[0,4],[1,2],[2,3],[3,4],[4,1]],
      desc: "Graful roată cu 5 noduri. Hub central conectat la un ciclu."
    }
  };

  ///============================================================
  /// Stare
  ///============================================================
  let currentGraph = "k3";
  let currentStep  = 0;
  const TOTAL_STEPS = 4;

  ///============================================================
  /// Algebra liniară
  ///============================================================
  function buildLaplacian(n, edges) {
    const L = Array.from({length: n}, () => Array(n).fill(0));
    edges.forEach(([a, b]) => {
      L[a][b]--; L[b][a]--;
      L[a][a]++; L[b][b]++;
    });
    return L;
  }

  function detMatrix(M) {
    const n = M.length;
    if (n === 0) return 1;
    if (n === 1) return M[0][0];
    if (n === 2) return M[0][0]*M[1][1] - M[0][1]*M[1][0];
    let d = 0;
    for (let j = 0; j < n; j++) {
      const sub = M.slice(1).map(r => r.filter((_, c) => c !== j));
      d += M[0][j] * (j % 2 === 0 ? 1 : -1) * detMatrix(sub);
    }
    return d;
  }

  ///cofactorul L_{nn} - elimina ultima linie si ultima coloana
  function computeCofactor(L) {
    const n = L.length;
    if (n <= 1) return 1;
    const sub = L.slice(0, n-1).map(r => r.slice(0, n-1));
    return Math.round(detMatrix(sub));
  }

  ///extinde determinantul 2x2 sau 3x3 ca sir pentru afisare
  function detFormula(M) {
    const n = M.length;
    if (n === 1) return `${M[0][0]}`;
    if (n === 2) {
      return `(${M[0][0]})·(${M[1][1]}) − (${M[0][1]})·(${M[1][0]})\n= ${M[0][0]*M[1][1]} − ${M[0][1]*M[1][0]}\n= ${M[0][0]*M[1][1] - M[0][1]*M[1][0]}`;
    }
    ///3x3: dezvoltare dupa primul rand
    let lines = [];
    let total = 0;
    for (let j = 0; j < 3; j++) {
      const sub = M.slice(1).map(r => r.filter((_,c) => c !== j));
      const s = j % 2 === 0 ? 1 : -1;
      const minor = detMatrix(sub);
      total += M[0][j] * s * minor;
      const sign = s > 0 ? "+" : "−";
      lines.push(`${sign} (${M[0][j]})·${minor}`);
    }
    return lines.join("  ") + ` = ${total}`;
  }

  const widget = document.createElement("div");
  widget.className = "cbm2-proof";
  widget.innerHTML = `
<div class="cbm2-proof-title">Demonstrație pas cu pas — Teorema lui Kirchhoff</div>
<p class="cbm2-proof-sub">Urmărește cum se calculează cofactorul matricei laplaciene și de ce este egal cu numărul de arbori.</p>

<div class="cbm2-pf-graph-select">
  <label>Graf:</label>
  <button class="cbm2-pf-graph-btn active" data-g="k3">K₃</button>
  <button class="cbm2-pf-graph-btn" data-g="k4">K₄</button>
  <button class="cbm2-pf-graph-btn" data-g="c4">C₄</button>
  <button class="cbm2-pf-graph-btn" data-g="c5">C₅</button>
  <button class="cbm2-pf-graph-btn" data-g="petersen_sub">W₄</button>
</div>

<div class="cbm2-pf-steps" id="cbm2-pf-steps"></div>

<div class="cbm2-pf-body">
  <div class="cbm2-pf-visual" id="cbm2-pf-visual">
    <!-- continut dinamic -->
  </div>
  <div class="cbm2-pf-explain" id="cbm2-pf-explain">
    <!-- continut dinamic -->
  </div>
</div>

<div class="cbm2-pf-final-box" id="cbm2-pf-final"></div>

<div class="cbm2-pf-nav">
  <button class="cbm2-pf-nav-btn" id="cbm2-pf-prev" disabled>&#8592; Înapoi</button>
  <span class="spacer"></span>
  <button class="cbm2-pf-nav-btn primary" id="cbm2-pf-next">Înainte &#8594;</button>
</div>
`;

  const body = document.getElementById("theme2-body");
  if (body) body.appendChild(widget);

  ///============================================================
  ///Randarea pasilor
  ///============================================================
  const STEP_LABELS = ["Construim L", "Ștergem L̃", "Calculăm det", "Concluzie"];

  function renderStepNav() {
    const cont = document.getElementById("cbm2-pf-steps");
    cont.innerHTML = STEP_LABELS.map((lbl, i) => {
      let cls = "cbm2-pf-step-btn";
      if (i === currentStep) cls += " active";
      else if (i < currentStep) cls += " done";
      return `<button class="${cls}" data-s="${i}">${lbl}</button>`;
    }).join("");
    cont.querySelectorAll("[data-s]").forEach(btn => {
      btn.addEventListener("click", () => {
        currentStep = parseInt(btn.dataset.s);
        render();
      });
    });
  }

  function matrixHTML(L, elimRow, elimCol, highlightCofactor) {
    const n = L.length;
    let cols = "";
    for (let j = 0; j < n; j++) cols += "auto ";
    let html = `<div class="cbm2-pf-bracket-row">`;
    html += `<span class="cbm2-pf-bracket">⎡<br>${Array(n-1).fill("⎢").join("<br>")}<br>⎣</span>`;
    html += `<div class="cbm2-pf-matrix" style="grid-template-columns:${cols}">`;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const isElim = (elimRow !== undefined && (i === elimRow || j === elimCol));
        const isCof  = highlightCofactor && !isElim;
        const isDiag = i === j;
        const isNeg  = L[i][j] < 0;
        let cls = "cbm2-pf-cell";
        if (isElim) cls += " eliminated";
        else if (isCof) cls += " cofactor-hl";
        else if (isDiag) cls += " diag";
        else if (isNeg) cls += " neg";
        html += `<div class="${cls}">${L[i][j]}</div>`;
      }
    }
    html += `</div>`;
    html += `<span class="cbm2-pf-bracket">⎤<br>${Array(n-1).fill("⎥").join("<br>")}<br>⎦</span>`;
    html += `</div>`;
    return html;
  }

  function submatrixHTML(M) {
    const n = M.length;
    let cols = "";
    for (let j = 0; j < n; j++) cols += "auto ";
    let html = `<div class="cbm2-pf-bracket-row">`;
    html += `<span class="cbm2-pf-bracket">⎡<br>${Array(n-1).fill("⎢").join("<br>")}<br>⎣</span>`;
    html += `<div class="cbm2-pf-matrix" style="grid-template-columns:${cols}">`;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const isDiag = i === j;
        const isNeg  = M[i][j] < 0;
        let cls = "cbm2-pf-cell cofactor-hl";
        if (isDiag) cls += " diag";
        else if (isNeg) cls += " neg";
        html += `<div class="${cls}">${M[i][j]}</div>`;
      }
    }
    html += `</div>`;
    html += `<span class="cbm2-pf-bracket">⎤<br>${Array(n-1).fill("⎥").join("<br>")}<br>⎦</span>`;
    html += `</div>`;
    return html;
  }

  function render() {
    const g   = GRAPHS[currentGraph];
    const L   = buildLaplacian(g.n, g.edges);
    const n   = g.n;
    const cof = computeCofactor(L);
    const sub = L.slice(0, n-1).map(r => r.slice(0, n-1));

    renderStepNav();

    const visual  = document.getElementById("cbm2-pf-visual");
    const explain = document.getElementById("cbm2-pf-explain");
    const finalBox = document.getElementById("cbm2-pf-final");
    const prevBtn  = document.getElementById("cbm2-pf-prev");
    const nextBtn  = document.getElementById("cbm2-pf-next");

    prevBtn.disabled = currentStep === 0;
    nextBtn.disabled = currentStep === TOTAL_STEPS - 1;
    nextBtn.textContent = currentStep === TOTAL_STEPS - 2 ? "Concluzie →" : (currentStep === TOTAL_STEPS - 1 ? "Gata ✓" : "Înainte →");

    finalBox.classList.remove("show");

    ///pasul initial - construim L
    if (currentStep === 0) {
      visual.innerHTML = `
        <div class="cbm2-pf-mat-wrap">
          <div class="cbm2-pf-mat-label">Matricea Laplaciană L (${n}×${n})</div>
          ${matrixHTML(L)}
        </div>
        <div class="cbm2-pf-formula show" style="max-width:260px">L = D − A\nD = matricea gradelor\nA = matricea de adiacență</div>
      `;
      explain.innerHTML = `
        <span class="cbm2-pf-badge">Pasul 1 / 4</span>
        <div class="cbm2-pf-explain-title">Construim matricea Laplaciană</div>
        <div class="cbm2-pf-explain-body">
          Graful <strong>${g.name}</strong> are <strong>${n} noduri</strong> și <strong>${g.edges.length} muchii</strong>.<br><br>
          ${g.desc}<br><br>
          <strong>Regula:</strong> pe diagonală punem gradul fiecărui nod, iar în afara diagonalei punem −1 dacă există muchia {i, j}, altfel 0.<br><br>
          <code>L[i][i] = grad(i)</code><br>
          <code>L[i][j] = −1</code> dacă {i,j} ∈ E<br><br>
          Observă că suma fiecărei <em>linii</em> este 0 — de aceea <code>det(L) = 0</code> întotdeauna.
        </div>
      `;
    }

    ///pasul 1 - stergem ultima linie si coloana
    else if (currentStep === 1) {
      visual.innerHTML = `
        <div class="cbm2-pf-mat-wrap">
          <div class="cbm2-pf-mat-label">L cu linia ${n} și coloana ${n} eliminate</div>
          ${matrixHTML(L, n-1, n-1, true)}
        </div>
        <div class="cbm2-pf-formula show" style="max-width:260px">L̃ = submatricea (${n-1})×(${n-1})\nobținută ștergând linia ${n}\nși coloana ${n}</div>
      `;
      explain.innerHTML = `
        <span class="cbm2-pf-badge">Pasul 2 / 4</span>
        <div class="cbm2-pf-explain-title">Ștergem o linie și o coloană</div>
        <div class="cbm2-pf-explain-body">
          Deoarece <code>det(L) = 0</code>, nu putem calcula direct determinantul lui L.<br><br>
          <strong>Trucul:</strong> eliminăm ultima linie și ultima coloană (celulele estompate) și obținem submatricea <code>L̃</code> de dimensiune <strong>${n-1}×${n-1}</strong> (evidențiată în albastru).<br><br>
          Cofactorul <code>L̃<sub>nn</sub> = det(L̃)</code> este ceea ce calculăm în pasul următor.<br><br>
          <strong>Remarcabil:</strong> nu contează ce linie și coloană eliminăm — toți cofactorii dau același rezultat!
        </div>
      `;
    }

    ///pasul 2 - calculam determinantul
    else if (currentStep === 2) {
      const formula = detFormula(sub);
      visual.innerHTML = `
        <div class="cbm2-pf-mat-wrap">
          <div class="cbm2-pf-mat-label">Submatricea L̃ (${n-1}×${n-1})</div>
          ${submatrixHTML(sub)}
        </div>
        <div class="cbm2-pf-formula show" style="max-width:280px">${n <= 3 ? "det(L̃) = " + formula : "det(L̃) = " + cof}</div>
        <div class="cbm2-pf-det-result show">
          det(L̃) = <span class="cbm2-pf-det-val">${cof}</span>
        </div>
      `;
      explain.innerHTML = `
        <span class="cbm2-pf-badge">Pasul 3 / 4</span>
        <div class="cbm2-pf-explain-title">Calculăm determinantul</div>
        <div class="cbm2-pf-explain-body">
          Determinantul submatricei <code>L̃</code> de dimensiune ${n-1}×${n-1} se calculează prin ${n-1 === 2 ? "formula directă 2×2" : n-1 === 3 ? "dezvoltare Laplace pe primul rând" : "eliminare Gauss"}.<br><br>
          ${n <= 3 ? `<code>det = ${formula.split("\\n").join("</code><br><code>")}</code><br><br>` : ""}
          Rezultatul <strong class="cbm2-pf-det-val" style="padding:1px 8px;border-radius:4px">${cof}</strong> este cofactorul matricei laplaciene.<br><br>
          Conform <strong>Teoremei lui Kirchhoff</strong>, acesta este exact numărul de arbori de acoperire ai grafului.
        </div>
      `;
    }

    ///pasul 3 - concluzie
    else if (currentStep === 3) {
      visual.innerHTML = `
        <div style="text-align:center; padding: 0.5rem 0;">
          <div style="font-size:0.78rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-muted);margin-bottom:0.75rem;">Rezultat final</div>
          <div style="font-family:'Courier New',monospace;font-size:1.05rem;color:var(--text);margin-bottom:1rem;line-height:2;">
            τ(${g.name}) = det(L̃) = <span class="cbm2-pf-det-val">${cof}</span>
          </div>
          <div style="font-size:0.82rem;color:var(--text-muted);max-width:260px;line-height:1.6;">
            ${cof === 1 ? "Un singur mod de a conecta graful — este deja un arbore!" :
              cof <= 5 ? `Există exact ${cof} arbori de acoperire diferiți.` :
              `Există ${cof} arbori de acoperire — verificabil cu demo-ul din secțiunea următoare.`}
          </div>
        </div>
      `;
      explain.innerHTML = `
        <span class="cbm2-pf-badge">Concluzie</span>
        <div class="cbm2-pf-explain-title">De ce funcționează?</div>
        <div class="cbm2-pf-explain-body">
          Ideea esențială: scriem <code>L = B·Bᵀ</code> (matricea de incidență orientată × transpusa ei), apoi aplicăm <strong>formula Cauchy-Binet</strong>:<br><br>
          <code>det(L̃) = Σ det(B̃_S)²</code><br><br>
          Fiecare termen este <code>det(B̃_S)² = 1</code> dacă <code>S</code> formează un arbore, și <code>0</code> altfel — deci suma numără exact arborii.<br><br>
          <strong>Invarianța cofactorului:</strong> oricare linie și coloană am elimina, rezultatul este același — demonstrat prin proprietățile matricei adjuncte.
        </div>
      `;
      finalBox.innerHTML = `
        <strong>τ(${g.name}) = ${cof}</strong> arbori de acoperire
        &nbsp;·&nbsp; Calculat via: <code>det(L̃<sub>nn</sub>)</code>
        &nbsp;·&nbsp; Verifică vizual în demo-ul interactiv de mai jos.
      `;
      finalBox.classList.add("show");
    }
  }

  document.getElementById("cbm2-pf-prev").addEventListener("click", () => {
    if (currentStep > 0) { currentStep--; render(); }
  });
  document.getElementById("cbm2-pf-next").addEventListener("click", () => {
    if (currentStep < TOTAL_STEPS - 1) { currentStep++; render(); }
  });

  ///selector de graf
  widget.querySelectorAll("[data-g]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentGraph = btn.dataset.g;
      currentStep  = 0;
      widget.querySelectorAll("[data-g]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      render();
    });
  });

  ///randare initiala
  render();
})();
