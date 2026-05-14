///widget interactiv pt criptarea prin matrice (Tema 01)
///doua taburi: Criptare si Decriptare
///urmeaza exact logica din tema1.md:
///  permutare ASCII → matrice T → inmultire cu K → C
///  si invers: K^-1 * C → T → permutare inversa → text

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
.cbm1-widget {
  margin-top: 3.5rem;
  border-top: 2px solid var(--accent);
  padding-top: 2.5rem;
}
.cbm1-widget-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 0.25rem;
}
.cbm1-widget-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1.75rem;
  line-height: 1.55;
}

/* tab-uri */
.cbm1-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 1.75rem;
}
.cbm1-tab {
  font-family: var(--font);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 9px 24px 8px;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
  letter-spacing: 0.01em;
}
.cbm1-tab:hover { color: var(--text); }
.cbm1-tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

/* panoul tabului */
.cbm1-panel { display: none; }
.cbm1-panel.active { display: block; }

/* sectiune input */
.cbm1-section {
  margin-bottom: 1.5rem;
}
.cbm1-section-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.6rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
.cbm1-section-label span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* input text */
.cbm1-input {
  width: 100%;
  font-family: var(--font);
  font-size: 0.9rem;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text);
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  resize: none;
}
.cbm1-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.cbm1-input::placeholder { color: var(--text-muted); opacity: 0.7; }
.cbm1-input[readonly] {
  background: var(--bg-alt);
  cursor: default;
}

/* grid 2 coloane */
.cbm1-grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media (max-width: 600px) {
  .cbm1-grid2 { grid-template-columns: 1fr; }
}

/* matricea K — grid 3x3 */
.cbm1-mat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  max-width: 210px;
}
.cbm1-mat-cell {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  text-align: center;
  padding: 7px 4px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text);
  outline: none;
  width: 100%;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.cbm1-mat-cell:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent-glow);
}
.cbm1-mat-cell.invalid {
  border-color: #ef4444;
  background: #fef2f2;
}
[data-theme="dark"] .cbm1-mat-cell.invalid {
  background: #2d1515;
}

/* info det */
.cbm1-det-info {
  margin-top: 8px;
  font-size: 0.78rem;
  font-family: 'Courier New', monospace;
  color: var(--text-muted);
  min-height: 20px;
  transition: color 0.15s;
}
.cbm1-det-info.ok   { color: #10b981; }
.cbm1-det-info.err  { color: #ef4444; }

/* permutare index */
.cbm1-perm-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.cbm1-perm-wrap input[type=range] {
  flex: 1;
  min-width: 120px;
  accent-color: var(--accent);
}
.cbm1-perm-val {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: var(--accent);
  font-weight: 700;
  min-width: 32px;
  text-align: right;
}

/* buton principal */
.cbm1-run-btn {
  font-family: var(--font);
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 11px 28px;
  border: none;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 14px var(--accent-glow);
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 7px;
}
.cbm1-run-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px var(--accent-glow);
}
.cbm1-run-btn:active { transform: translateY(0); }
.cbm1-run-btn:disabled { opacity: 0.35; cursor: default; transform: none; box-shadow: none; }

/* zona de rezultate */
.cbm1-results {
  margin-top: 1.75rem;
  display: none;
}
.cbm1-results.show { display: block; }

/* pipeline vizual */
.cbm1-pipeline {
  display: flex;
  align-items: flex-start;
  gap: 0;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.cbm1-pipe-step {
  flex: 1;
  min-width: 120px;
  text-align: center;
  position: relative;
  padding: 0 6px;
}
.cbm1-pipe-step + .cbm1-pipe-step::before {
  content: "→";
  position: absolute;
  left: -10px;
  top: 28px;
  font-size: 1.1rem;
  color: var(--text-muted);
}
.cbm1-pipe-box {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 8px 8px;
  transition: border-color 0.3s, background 0.3s;
}
.cbm1-pipe-box.highlight {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 7%, var(--bg-card));
}
.cbm1-pipe-icon {
  font-size: 1.3rem;
  margin-bottom: 4px;
}
.cbm1-pipe-name {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 5px;
}
.cbm1-pipe-val {
  font-family: 'Courier New', monospace;
  font-size: 0.72rem;
  color: var(--accent);
  word-break: break-all;
  line-height: 1.4;
  min-height: 18px;
}

/* separator */
.cbm1-sep {
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.25rem 0;
}

/* bloc matriceal afisat */
.cbm1-mat-display-wrap {
  overflow-x: auto;
  margin: 0.5rem 0;
}
.cbm1-mat-display {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
}
.cbm1-mat-bracket {
  color: var(--text-muted);
  font-size: 1.8rem;
  font-weight: 200;
  line-height: 1;
  user-select: none;
}
.cbm1-mat-inner {
  display: grid;
  gap: 3px;
}
.cbm1-mat-el {
  min-width: 44px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 0.78rem;
  transition: background 0.2s;
}
.cbm1-mat-el.acc {
  background: color-mix(in srgb, var(--accent) 12%, var(--bg-card));
  border-color: var(--accent);
  color: var(--accent);
  font-weight: 700;
}

/* pasii detaliat */
.cbm1-step-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.cbm1-step-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  font-size: 0.83rem;
  line-height: 1.65;
  color: var(--text-muted);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.35s, transform 0.35s;
}
.cbm1-step-item.show {
  opacity: 1;
  transform: translateY(0);
}
.cbm1-step-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.cbm1-step-body strong { color: var(--text); }
.cbm1-step-body code {
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 1px 5px;
  border-radius: 4px;
  color: var(--accent);
}

/* rezultat final */
.cbm1-final {
  margin-top: 1rem;
  padding: 14px 18px;
  background: color-mix(in srgb, var(--accent) 9%, var(--bg-card));
  border: 1.5px solid var(--accent);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.cbm1-final-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 4px;
}
.cbm1-final-val {
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
  word-break: break-all;
}
.cbm1-copy-btn {
  font-family: var(--font);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  flex-shrink: 0;
}
.cbm1-copy-btn:hover { color: var(--accent); border-color: var(--accent); }

/* eroare */
.cbm1-error {
  margin-top: 1rem;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  font-size: 0.83rem;
  color: #991b1b;
  display: none;
}
[data-theme="dark"] .cbm1-error {
  background: #2d1515;
  border-color: #7f1d1d;
  color: #fca5a5;
}
.cbm1-error.show { display: block; }

/* textarea pentru C in decriptare */
.cbm1-c-input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
  gap: 5px;
  padding: 10px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 8px;
}
.cbm1-c-cell {
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  text-align: center;
  padding: 6px 2px;
  border: 1px solid var(--border);
  border-radius: 5px;
  background: var(--bg-card);
  color: var(--text);
  width: 100%;
  outline: none;
  transition: border-color 0.15s;
}
.cbm1-c-cell:focus { border-color: var(--accent); }

.cbm1-c-dims {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 6px;
  font-family: 'Courier New', monospace;
}
`;
  document.head.appendChild(style);

  ///generare permutare a codurilor ASCII 32..126 (95 caractere)
  ///din seed numeric (indicele permutarii — simplificat LCG)
  function buildPermutation(seed) {
    const N = 95; ///32..126
    const arr = Array.from({ length: N }, (_, i) => i + 32);
    ///Fisher-Yates cu LCG ca generator pseudo-random din seed
    let s = (seed % 1000000) + 1;
    for (let i = N - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) & 0x7fffffff;
      const j = s % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr; ///arr[i] = codul ASCII la care se mapeaza caracterul cu codul 32+i
  }

  function buildInversePermutation(perm) {
    const inv = new Array(128).fill(0);
    for (let i = 0; i < perm.length; i++) {
      inv[perm[i]] = i + 32;
    }
    return inv;
  }

  function applyPermutation(code, perm) {
    const idx = code - 32;
    if (idx < 0 || idx >= perm.length) return code;
    return perm[idx];
  }

  function applyInversePermutation(code, invPerm) {
    if (code < 32 || code > 126) return code;
    return invPerm[code];
  }

  ///inmultire matrice 3x3 * matrice 3xm
  function matMul(K, T) {
    const rows = K.length;
    const cols = T[0].length;
    const inner = T.length;
    return Array.from({ length: rows }, (_, i) =>
      Array.from({ length: cols }, (_, j) =>
        K[i].reduce((sum, _, k) => sum + K[i][k] * T[k][j], 0)
      )
    );
  }

  ///determinant 3x3
  function det3(M) {
    return (
      M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) -
      M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) +
      M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0])
    );
  }

  ///inversa 3x3 (doar daca det = ±1, rezultat intreg)
  function inv3(M, d) {
    const adj = [
      [M[1][1]*M[2][2]-M[1][2]*M[2][1], -(M[0][1]*M[2][2]-M[0][2]*M[2][1]),  M[0][1]*M[1][2]-M[0][2]*M[1][1]],
      [-(M[1][0]*M[2][2]-M[1][2]*M[2][0]), M[0][0]*M[2][2]-M[0][2]*M[2][0], -(M[0][0]*M[1][2]-M[0][2]*M[1][0])],
      [M[1][0]*M[2][1]-M[1][1]*M[2][0], -(M[0][0]*M[2][1]-M[0][1]*M[2][0]),  M[0][0]*M[1][1]-M[0][1]*M[1][0]]
    ];
    return adj.map(row => row.map(v => Math.round(v / d)));
  }

  ///normalizeaza textul: pastreaza doar ASCII 32-126
  function normalizeText(s) {
    return s.split("").filter(c => {
      const code = c.charCodeAt(0);
      return code >= 32 && code <= 126;
    }).join("");
  }

  const widget = document.createElement("div");
  widget.className = "cbm1-widget";
  widget.innerHTML = `
<div class="cbm1-widget-title">Exemplu interactiv</div>
<p class="cbm1-widget-sub">
  Explorează pas cu pas criptarea și decriptarea unui mesaj prin metoda matriceală cu permutare ASCII.
  Introduce un text și o cheie, apoi urmărește transformările.
</p>

<div class="cbm1-tabs">
  <button class="cbm1-tab active" data-tab="enc">🔒 Criptare</button>
  <button class="cbm1-tab" data-tab="dec">🔓 Decriptare</button>
</div>

<div class="cbm1-panel active" id="cbm1-enc">
  <div class="cbm1-grid2">
    <div>
      <div class="cbm1-section">
        <div class="cbm1-section-label"><span>1</span> Textul de criptat</div>
        <textarea class="cbm1-input" id="cbm1-enc-text" rows="3" placeholder="Ex: HELLO WORLD">HELLO</textarea>
      </div>

      <div class="cbm1-section">
        <div class="cbm1-section-label"><span>2</span> Indicele permutării ASCII</div>
        <div class="cbm1-perm-wrap">
          <input type="range" id="cbm1-enc-perm" min="0" max="999" value="17" step="1">
          <span class="cbm1-perm-val" id="cbm1-enc-perm-val">17</span>
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">
          Rearanjează codurile ASCII 32–126 (95 caractere) și paddingul printr-o permutare determinată de indice (de la 0 la 999).
        </div>
      </div>
    </div>

    <div>
      <div class="cbm1-section">
        <div class="cbm1-section-label"><span>3</span> Matricea-cheie K (det = ±1)</div>
        <div class="cbm1-mat-grid" id="cbm1-enc-K">
          <input class="cbm1-mat-cell" type="number" value="1">
          <input class="cbm1-mat-cell" type="number" value="2">
          <input class="cbm1-mat-cell" type="number" value="1">
          <input class="cbm1-mat-cell" type="number" value="0">
          <input class="cbm1-mat-cell" type="number" value="1">
          <input class="cbm1-mat-cell" type="number" value="0">
          <input class="cbm1-mat-cell" type="number" value="1">
          <input class="cbm1-mat-cell" type="number" value="1">
          <input class="cbm1-mat-cell" type="number" value="0">
        </div>
        <div class="cbm1-det-info" id="cbm1-enc-det">det(K) = 1 ✓</div>
      </div>

      <div class="cbm1-section">
        <div class="cbm1-section-label" style="margin-bottom:0.85rem"></div>
        <button class="cbm1-run-btn" id="cbm1-enc-run">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          Criptează
        </button>
      </div>
    </div>
  </div>

  <div class="cbm1-error" id="cbm1-enc-err"></div>
  <div class="cbm1-results" id="cbm1-enc-results"></div>
</div>

<div class="cbm1-panel" id="cbm1-dec">
  <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1.25rem;line-height:1.6;">
    Introdu matricea criptată C (ca șir de numere separate prin virgulă sau spațiu), cheia K și indicele permutării folosite la criptare.
  </p>

  <div class="cbm1-grid2">
    <div>
      <div class="cbm1-section">
        <div class="cbm1-section-label"><span>1</span> Matricea criptată C (numere separate prin virgulă)</div>
        <textarea class="cbm1-input" id="cbm1-dec-C" rows="4"
          placeholder="Ex: 318, 155, 265, 195, ...">308, 75, 132, 431, 111, 212</textarea>
        <div style="font-size:0.72rem;color:var(--text-muted);margin-top:5px;">
          Numerele vor fi aranjate în 3 linii (câte o coloană per triplet de caractere).
        </div>
      </div>

      <div class="cbm1-section">
        <div class="cbm1-section-label"><span>2</span> Indicele permutării ASCII (același ca la criptare)</div>
        <div class="cbm1-perm-wrap">
          <input type="range" id="cbm1-dec-perm" min="0" max="999" value="17" step="1">
          <span class="cbm1-perm-val" id="cbm1-dec-perm-val">17</span>
        </div>
      </div>
    </div>

    <div>
      <div class="cbm1-section">
        <div class="cbm1-section-label"><span>3</span> Matricea-cheie K (aceeași ca la criptare)</div>
        <div class="cbm1-mat-grid" id="cbm1-dec-K">
          <input class="cbm1-mat-cell" type="number" value="1">
          <input class="cbm1-mat-cell" type="number" value="2">
          <input class="cbm1-mat-cell" type="number" value="1">
          <input class="cbm1-mat-cell" type="number" value="0">
          <input class="cbm1-mat-cell" type="number" value="1">
          <input class="cbm1-mat-cell" type="number" value="0">
          <input class="cbm1-mat-cell" type="number" value="1">
          <input class="cbm1-mat-cell" type="number" value="1">
          <input class="cbm1-mat-cell" type="number" value="0">
        </div>
        <div class="cbm1-det-info" id="cbm1-dec-det">det(K) = 1 ✓</div>
      </div>

      <div class="cbm1-section">
        <div class="cbm1-section-label" style="margin-bottom:0.85rem"></div>
        <button class="cbm1-run-btn" id="cbm1-dec-run">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Decriptează
        </button>
      </div>
    </div>
  </div>

  <div class="cbm1-error" id="cbm1-dec-err"></div>
  <div class="cbm1-results" id="cbm1-dec-results"></div>
</div>
`;

  const body = document.getElementById("theme1-body");
  if (body) body.appendChild(widget);

  widget.querySelectorAll(".cbm1-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      widget.querySelectorAll(".cbm1-tab").forEach(t => t.classList.remove("active"));
      widget.querySelectorAll(".cbm1-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("cbm1-" + tab.dataset.tab).classList.add("active");
    });
  });

  function readK(gridId) {
    const cells = document.getElementById(gridId).querySelectorAll("input");
    const vals  = Array.from(cells).map(c => parseInt(c.value) || 0);
    return [
      [vals[0], vals[1], vals[2]],
      [vals[3], vals[4], vals[5]],
      [vals[6], vals[7], vals[8]]
    ];
  }

  function updateDetInfo(gridId, detInfoId) {
    const K = readK(gridId);
    const d = det3(K);
    const el = document.getElementById(detInfoId);
    const cells = document.getElementById(gridId).querySelectorAll("input");
    if (d === 1 || d === -1) {
      el.textContent = `det(K) = ${d} ✓`;
      el.className = "cbm1-det-info ok";
      cells.forEach(c => c.classList.remove("invalid"));
    } else {
      el.textContent = `det(K) = ${d} — cheia nu este validă (det ≠ ±1)`;
      el.className = "cbm1-det-info err";
      cells.forEach(c => c.classList.add("invalid"));
    }
    return d;
  }

  ["cbm1-enc-K", "cbm1-dec-K"].forEach(gridId => {
    const detId = gridId === "cbm1-enc-K" ? "cbm1-enc-det" : "cbm1-dec-det";
    document.getElementById(gridId).querySelectorAll("input").forEach(inp => {
      inp.addEventListener("input", () => updateDetInfo(gridId, detId));
    });
  });

  function bindSlider(sliderId, valId) {
    const sl = document.getElementById(sliderId);
    const vl = document.getElementById(valId);
    sl.addEventListener("input", () => { vl.textContent = sl.value; });
  }
  bindSlider("cbm1-enc-perm", "cbm1-enc-perm-val");
  bindSlider("cbm1-dec-perm", "cbm1-dec-perm-val");

  function matDisplayHTML(rows, label, highlight) {
    const cols = rows[0].length;
    let gridCols = "";
    for (let j = 0; j < cols; j++) gridCols += "auto ";
    let html = `<div class="cbm1-mat-display">`;
    html += `<span class="cbm1-mat-bracket">⎡<br>${Array(rows.length - 1).fill("⎢").join("<br>")}<br>⎣</span>`;
    html += `<div class="cbm1-mat-inner" style="grid-template-columns:${gridCols}">`;
    rows.forEach(row => row.forEach(v => {
      const cls = "cbm1-mat-el" + (highlight ? " acc" : "");
      html += `<div class="${cls}">${v}</div>`;
    }));
    html += `</div>`;
    html += `<span class="cbm1-mat-bracket">⎤<br>${Array(rows.length - 1).fill("⎥").join("<br>")}<br>⎦</span>`;
    html += `</div>`;
    return html;
  }

  function pipelineHTML(steps) {
    let html = `<div class="cbm1-pipeline">`;
    steps.forEach(s => {
      html += `
        <div class="cbm1-pipe-step">
          <div class="cbm1-pipe-box${s.highlight ? " highlight" : ""}">
            <div class="cbm1-pipe-icon">${s.icon}</div>
            <div class="cbm1-pipe-name">${s.name}</div>
            <div class="cbm1-pipe-val">${s.val}</div>
          </div>
        </div>`;
    });
    html += `</div>`;
    return html;
  }

  ///animatie pt aparitia pasilor
  function animateSteps(container) {
    const items = container.querySelectorAll(".cbm1-step-item");
    items.forEach((item, i) => {
      setTimeout(() => item.classList.add("show"), i * 140);
    });
  }

  ///criptare
  document.getElementById("cbm1-enc-run").addEventListener("click", () => {
    const errEl     = document.getElementById("cbm1-enc-err");
    const resultsEl = document.getElementById("cbm1-enc-results");
    errEl.classList.remove("show");
    resultsEl.classList.remove("show");
    resultsEl.innerHTML = "";

    const rawText = document.getElementById("cbm1-enc-text").value;
    const text    = normalizeText(rawText);
    if (text.length === 0) {
      errEl.textContent = "Introdu un text valid (caractere ASCII 32–126).";
      errEl.classList.add("show");
      return;
    }

    const K = readK("cbm1-enc-K");
    const d = det3(K);
    if (d !== 1 && d !== -1) {
      errEl.textContent = `Cheia K are det(K) = ${d}. Cheia trebuie să aibă determinantul ±1 pentru decriptare exactă. Ajustează valorile.`;
      errEl.classList.add("show");
      return;
    }

    const permSeed = parseInt(document.getElementById("cbm1-enc-perm").value);
    const perm     = buildPermutation(permSeed);

    ///cod ASCII original
    const asciiCodes = text.split("").map(c => c.charCodeAt(0));

    ///aplicare permutare
    const permCodes = asciiCodes.map(c => applyPermutation(c, perm));

    ///completare la multiplu de 3 (cu spatiu ASCII = 32)
    const padded = [...permCodes];
    while (padded.length % 3 !== 0) padded.push(applyPermutation(32, perm));
    const numCols = padded.length / 3;

    ///formare matrice T (3 x numCols)
    const T = [[], [], []];
    for (let j = 0; j < numCols; j++) {
      T[0].push(padded[j * 3]);
      T[1].push(padded[j * 3 + 1]);
      T[2].push(padded[j * 3 + 2]);
    }

    const C = matMul(K, T);

    ///sirul plat al lui C pentru afisare / copiere
    const Cflat = C[0].concat(C[1]).concat(C[2]);
    ///reordonat coloana-major (cum ar fi transmis)
    const CflatCol = [];
    for (let j = 0; j < numCols; j++) {
      CflatCol.push(C[0][j], C[1][j], C[2][j]);
    }

    ///truncheaza pt afisare daca textul e lung
    const MAX_SHOW_COLS = 5;
    const showCols = Math.min(numCols, MAX_SHOW_COLS);
    const Tshow = [T[0].slice(0, showCols), T[1].slice(0, showCols), T[2].slice(0, showCols)];
    const Cshow = [C[0].slice(0, showCols), C[1].slice(0, showCols), C[2].slice(0, showCols)];
    const Kshow = K;

    const truncNote = numCols > MAX_SHOW_COLS
      ? `<div style="font-size:0.73rem;color:var(--text-muted);margin-top:4px;">(afișate primele ${MAX_SHOW_COLS} coloane din ${numCols})</div>`
      : "";

    resultsEl.innerHTML = `
      ${pipelineHTML([
        { icon: "", name: "Text", val: text.length > 20 ? text.slice(0, 18) + "…" : text, highlight: false },
        { icon: "", name: "Permutare", val: `seed=${permSeed}`, highlight: false },
        { icon: "", name: "Matrice T", val: `3×${numCols}`, highlight: false },
        { icon: "", name: "K · T", val: "=", highlight: false },
        { icon: "", name: "Matrice C", val: `3×${numCols}`, highlight: true },
      ])}

      <hr class="cbm1-sep">

      <div class="cbm1-section-label" style="margin-bottom:0.75rem;">Detalii transformare</div>

      <div class="cbm1-step-list" id="cbm1-enc-steps">

        <div class="cbm1-step-item">
          <div class="cbm1-step-dot">1</div>
          <div class="cbm1-step-body">
            <strong>Cod ASCII original:</strong><br>
            <code>${asciiCodes.slice(0, 18).join(", ")}${asciiCodes.length > 18 ? ", …" : ""}</code>
            <br><span style="font-size:0.75rem;color:var(--text-muted);">pentru textul: "${text.slice(0, 18)}${text.length > 18 ? "…" : ""}"</span>
          </div>
        </div>

        <div class="cbm1-step-item">
          <div class="cbm1-step-dot">2</div>
          <div class="cbm1-step-body">
            <strong>După permutare (seed = ${permSeed}):</strong><br>
            <code>${permCodes.slice(0, 18).join(", ")}${permCodes.length > 18 ? ", …" : ""}</code>
            <br><span style="font-size:0.75rem;color:var(--text-muted);">aceleași caractere, coduri rearanjate prin permutare</span>
          </div>
        </div>

        <div class="cbm1-step-item">
          <div class="cbm1-step-dot">3</div>
          <div class="cbm1-step-body">
            <strong>Matricea T (3×${numCols}) — primele ${showCols} coloane:</strong><br>
            <div class="cbm1-mat-display-wrap">${matDisplayHTML(Tshow, "T")}</div>
            ${truncNote}
            <span style="font-size:0.75rem;color:var(--text-muted);">câte 3 caractere pe coloană${padded.length > permCodes.length ? ", completat cu padding" : ""}</span>
          </div>
        </div>

        <div class="cbm1-step-item">
          <div class="cbm1-step-dot">4</div>
          <div class="cbm1-step-body">
            <strong>Matricea-cheie K (det = ${d}):</strong><br>
            <div class="cbm1-mat-display-wrap">${matDisplayHTML(Kshow, "K")}</div>
            <span style="font-size:0.75rem;color:var(--text-muted);">det(K) = ${d} → inversabilă în ℤ, decriptare exactă garantată</span>
          </div>
        </div>

        <div class="cbm1-step-item">
          <div class="cbm1-step-dot">5</div>
          <div class="cbm1-step-body">
            <strong>C = K · T — primele ${showCols} coloane:</strong><br>
            <div class="cbm1-mat-display-wrap">${matDisplayHTML(Cshow, "C", true)}</div>
            ${truncNote}
            <span style="font-size:0.75rem;color:var(--text-muted);">valorile nu mai corespund niciunui caracter recognoscibil fără cheie</span>
          </div>
        </div>

      </div>

      <div class="cbm1-final" style="margin-top:1.25rem;">
        <div>
          <div class="cbm1-final-label">Mesaj criptat C (coloană-major)</div>
          <div class="cbm1-final-val" id="cbm1-enc-final-val">${CflatCol.join(", ")}</div>
        </div>
        <button class="cbm1-copy-btn" id="cbm1-enc-copy">Copiază</button>
      </div>

      <div style="margin-top:0.75rem;font-size:0.78rem;color:var(--text-muted);line-height:1.55;">
        💡 Copiază valorile de mai sus în tab-ul <strong>Decriptare</strong> pentru a verifica că recuperezi textul original.
        Folosește aceleași K și seed.
      </div>
    `;

    resultsEl.classList.add("show");
    animateSteps(resultsEl);

    ///copiere C
    document.getElementById("cbm1-enc-copy").addEventListener("click", () => {
      navigator.clipboard.writeText(CflatCol.join(", ")).then(() => {
        const btn = document.getElementById("cbm1-enc-copy");
        btn.textContent = "Copiat ✓";
        setTimeout(() => { btn.textContent = "Copiază"; }, 1800);
      });
    });

    ///autopopulare tab decriptare
    document.getElementById("cbm1-dec-C").value = CflatCol.join(", ");
    document.getElementById("cbm1-dec-perm").value = permSeed;
    document.getElementById("cbm1-dec-perm-val").textContent = permSeed;
    const decKCells = document.getElementById("cbm1-dec-K").querySelectorAll("input");
    K.flat().forEach((v, i) => { decKCells[i].value = v; });
    updateDetInfo("cbm1-dec-K", "cbm1-dec-det");
  });

  ///decriptare
  document.getElementById("cbm1-dec-run").addEventListener("click", () => {
    const errEl     = document.getElementById("cbm1-dec-err");
    const resultsEl = document.getElementById("cbm1-dec-results");
    errEl.classList.remove("show");
    resultsEl.classList.remove("show");
    resultsEl.innerHTML = "";

    ///citire C
    const rawC   = document.getElementById("cbm1-dec-C").value;
    const Cflat  = rawC.split(/[\s,]+/).map(s => parseInt(s)).filter(n => !isNaN(n));
    if (Cflat.length === 0 || Cflat.length % 3 !== 0) {
      errEl.textContent = `Matricea C trebuie să conțină un număr de valori multiplu de 3 (primit: ${Cflat.length}). Verifică sirul copiat.`;
      errEl.classList.add("show");
      return;
    }

    const K = readK("cbm1-dec-K");
    const d = det3(K);
    if (d !== 1 && d !== -1) {
      errEl.textContent = `Cheia K are det(K) = ${d}. Trebuie det = ±1.`;
      errEl.classList.add("show");
      return;
    }

    const permSeed = parseInt(document.getElementById("cbm1-dec-perm").value);
    const perm     = buildPermutation(permSeed);
    const invPerm  = buildInversePermutation(perm);

    ///reconstruieste C ca matrice 3 x numCols (coloana-major)
    const numCols = Cflat.length / 3;
    const C = [[], [], []];
    for (let j = 0; j < numCols; j++) {
      C[0].push(Cflat[j * 3]);
      C[1].push(Cflat[j * 3 + 1]);
      C[2].push(Cflat[j * 3 + 2]);
    }

    const Kinv = inv3(K, d);
    const T = matMul(Kinv, C);

    ///codul permutate din T (coloana-major)
    const permCodes = [];
    for (let j = 0; j < numCols; j++) {
      permCodes.push(T[0][j], T[1][j], T[2][j]);
    }

    ///inversa permutare → coduri ASCII originale
    const asciiCodes = permCodes.map(c => applyInversePermutation(c, invPerm));

    ///conversie la text, ignoram padding (32 = spatiu in original)
    const recovered = asciiCodes
      .map(c => (c >= 32 && c <= 126) ? String.fromCharCode(c) : "?")
      .join("")
      .trimEnd();

    const MAX_SHOW_COLS = 5;
    const showCols = Math.min(numCols, MAX_SHOW_COLS);
    const Cshow   = [C[0].slice(0, showCols),    C[1].slice(0, showCols),    C[2].slice(0, showCols)];
    const Kinvshow = Kinv;
    const Tshow   = [T[0].slice(0, showCols),    T[1].slice(0, showCols),    T[2].slice(0, showCols)];
    const truncNote = numCols > MAX_SHOW_COLS
      ? `<div style="font-size:0.73rem;color:var(--text-muted);margin-top:4px;">(afișate primele ${showCols} coloane din ${numCols})</div>`
      : "";

    resultsEl.innerHTML = `
      ${pipelineHTML([
        { icon: "", name: "Matrice C", val: `3×${numCols}`, highlight: false },
        { icon: "", name: "K⁻¹ · C", val: "=", highlight: false },
        { icon: "", name: "Matrice T", val: `3×${numCols}`, highlight: false },
        { icon: "", name: "Perm. inversă", val: `seed=${permSeed}`, highlight: false },
        { icon: "", name: "Text original", val: recovered.length > 14 ? recovered.slice(0, 12) + "…" : recovered, highlight: true },
      ])}

      <hr class="cbm1-sep">

      <div class="cbm1-section-label" style="margin-bottom:0.75rem;">Detalii transformare inversă</div>

      <div class="cbm1-step-list" id="cbm1-dec-steps">

        <div class="cbm1-step-item">
          <div class="cbm1-step-dot">1</div>
          <div class="cbm1-step-body">
            <strong>Matricea criptată C (primele ${showCols} coloane):</strong><br>
            <div class="cbm1-mat-display-wrap">${matDisplayHTML(Cshow, "C")}</div>
            ${truncNote}
          </div>
        </div>

        <div class="cbm1-step-item">
          <div class="cbm1-step-dot">2</div>
          <div class="cbm1-step-body">
            <strong>Inversa K⁻¹ (calculată din adj(K) / det(K) = ${d}):</strong><br>
            <div class="cbm1-mat-display-wrap">${matDisplayHTML(Kinvshow, "K⁻¹")}</div>
            <span style="font-size:0.75rem;color:var(--text-muted);">K⁻¹ are tot elemente întregi deoarece det(K) = ±1</span>
          </div>
        </div>

        <div class="cbm1-step-item">
          <div class="cbm1-step-dot">3</div>
          <div class="cbm1-step-body">
            <strong>T = K⁻¹ · C (primele ${showCols} coloane):</strong><br>
            <div class="cbm1-mat-display-wrap">${matDisplayHTML(Tshow, "T", true)}</div>
            ${truncNote}
            <span style="font-size:0.75rem;color:var(--text-muted);">valorile sunt codurile ASCII după permutare (nu direct caractere)</span>
          </div>
        </div>

        <div class="cbm1-step-item">
          <div class="cbm1-step-dot">4</div>
          <div class="cbm1-step-body">
            <strong>Coduri după permutare inversă (seed = ${permSeed}):</strong><br>
            <code>${asciiCodes.slice(0, 18).join(", ")}${asciiCodes.length > 18 ? ", …" : ""}</code>
            <br><span style="font-size:0.75rem;color:var(--text-muted);">permutarea inversă recuperează codurile ASCII originale</span>
          </div>
        </div>

        <div class="cbm1-step-item">
          <div class="cbm1-step-dot">5</div>
          <div class="cbm1-step-body">
            <strong>Conversie la caractere:</strong><br>
            <code>${asciiCodes.slice(0, 18).map(c => String.fromCharCode(c)).join(" ")}${asciiCodes.length > 18 ? " …" : ""}</code>
          </div>
        </div>

      </div>

      <div class="cbm1-final" style="margin-top:1.25rem;">
        <div>
          <div class="cbm1-final-label">Text recuperat</div>
          <div class="cbm1-final-val">${recovered}</div>
        </div>
      </div>
    `;

    resultsEl.classList.add("show");
    animateSteps(resultsEl);
  });

  updateDetInfo("cbm1-enc-K", "cbm1-enc-det");
  updateDetInfo("cbm1-dec-K", "cbm1-dec-det");
})();
