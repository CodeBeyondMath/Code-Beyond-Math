///widget interactiv pt criptarea prin matrice
///se apeleaza dupa ce marked.parse() si-a facut treaba in #theme1-body

(function () {
  "use strict";

  function det3(a) {
    return (
      a[0][0] * (a[1][1] * a[2][2] - a[1][2] * a[2][1]) -
      a[0][1] * (a[1][0] * a[2][2] - a[1][2] * a[2][0]) +
      a[0][2] * (a[1][0] * a[2][1] - a[1][1] * a[2][0])
    );
  }

  ///inversa exacta prin adjugată/determinant (funcționează exact dacă determinantul este 1 sau -1)
  function inv3(a) {
    const d = det3(a);
    if (Math.abs(d) !== 1) return null;
    const adj = [
      [
         a[1][1]*a[2][2] - a[1][2]*a[2][1],
        -(a[0][1]*a[2][2] - a[0][2]*a[2][1]),
         a[0][1]*a[1][2] - a[0][2]*a[1][1],
      ],
      [
        -(a[1][0]*a[2][2] - a[1][2]*a[2][0]),
         a[0][0]*a[2][2] - a[0][2]*a[2][0],
        -(a[0][0]*a[1][2] - a[0][2]*a[1][0]),
      ],
      [
         a[1][0]*a[2][1] - a[1][1]*a[2][0],
        -(a[0][0]*a[2][1] - a[0][1]*a[2][0]),
         a[0][0]*a[1][1] - a[0][1]*a[1][0],
      ],
    ];
    return adj.map(r => r.map(x => x * d));
  }

  function matMul(A, B) {
    const n = A.length, p = B[0].length, m = B.length;
    return Array.from({ length: n }, (_, i) =>
      Array.from({ length: p }, (_, j) =>
        A[i].reduce((s, _, k) => s + A[i][k] * B[k][j], 0)
      )
    );
  }

  const PADDING = "\x01";
  const ORIG = (() => {
    let s = "";
    for (let c = 32; c <= 126; c++) s += String.fromCharCode(c);
    return s + PADDING;
  })();
  const DIM = ORIG.length; ///96

  const FACT = (() => {
    const f = new Array(DIM + 1);
    f[0] = f[1] = 1n;
    for (let i = 2; i <= DIM; i++) f[i] = f[i - 1] * BigInt(i);
    return f;
  })();

  function idxToPerm(k) {
    k = BigInt(k) - 1n;
    const c = ORIG.split("");
    let p = "";
    for (let i = 0; i < DIM; i++) {
      let idx = Number(k / FACT[DIM - 1 - i]);
      if (idx >= c.length) idx = c.length - 1;
      k = k % FACT[DIM - 1 - i];
      p += c[idx];
      c.splice(idx, 1);
    }
    return p;
  }

  function encrypt(msg, key, permIdxStr) {
    const perm = idxToPerm(permIdxStr);
    const pos = {};
    for (let i = 0; i < DIM; i++) pos[perm[i]] = i;
    while (msg.length % 3) msg += PADDING;
    const colLen = msg.length / 3;
    const D = Array.from({ length: 3 }, (_, i) =>
      Array.from({ length: colLen }, (_, j) => pos[msg[i * colLen + j]] ?? 0)
    );
    return matMul(key, D);
  }

  function decrypt(T, keyInv, permIdxStr) {
    const perm = idxToPerm(permIdxStr);
    const D = matMul(keyInv, T);
    let s = "";
    for (let i = 0; i < D.length; i++)
      for (let j = 0; j < D[0].length; j++) {
        const idx = D[i][j];
        s += idx >= 0 && idx < perm.length ? perm[idx] : "?";
      }
    while (s.endsWith(PADDING)) s = s.slice(0, -1);
    return s;
  }

  const style = document.createElement("style");
  style.textContent = `
.cbm-widget {
  margin-top: 3.5rem;
  border-top: 2px solid var(--accent);
  padding-top: 2.5rem;
}
.cbm-widget-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 0.35rem;
}
.cbm-widget-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}
.cbm-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid var(--border);
}
.cbm-tab {
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
}
.cbm-tab:hover { color: var(--accent); }
.cbm-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
.cbm-panel { display: none; }
.cbm-panel.active { display: block; }
.cbm-field { margin-bottom: 1.2rem; }
.cbm-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.45rem;
}
.cbm-input, .cbm-textarea {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  font-family: var(--font);
  font-size: 0.9rem;
  color: var(--text);
  transition: border-color 0.2s;
  outline: none;
  box-sizing: border-box;
}
.cbm-input:focus, .cbm-textarea:focus { border-color: var(--accent); }
.cbm-textarea { resize: vertical; min-height: 90px; }
.cbm-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.cbm-matrix-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.cbm-matrix-label-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.cbm-matrix-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.4rem;
  max-width: 200px;
}
.cbm-cell {
  width: 100%;
  aspect-ratio: 1;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  text-align: center;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  color: var(--text);
  padding: 0;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  -moz-appearance: textfield;
  min-width: 0;
}
.cbm-cell::-webkit-outer-spin-button,
.cbm-cell::-webkit-inner-spin-button { -webkit-appearance: none; }
.cbm-cell:focus { border-color: var(--accent); }
.cbm-det-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  border: 1px solid var(--border);
  color: var(--text-muted);
  background: var(--bg-alt);
  transition: all 0.2s;
  white-space: nowrap;
  font-family: 'Courier New', monospace;
}
.cbm-det-badge.ok  { color: #22c55e; border-color: #22c55e; background: rgba(34,197,94,0.08); }
.cbm-det-badge.err { color: #ef4444; border-color: #ef4444; background: rgba(239,68,68,0.08); }
.cbm-inv-preview {
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  color: var(--accent);
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.6rem 0.85rem;
  line-height: 1.8;
  white-space: pre;
  letter-spacing: 0.03em;
  min-height: 72px;
  transition: opacity 0.2s;
}
.cbm-inv-preview.empty { opacity: 0.45; font-style: italic; }
.cbm-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.6rem;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: var(--font);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 14px var(--accent-glow);
}
.cbm-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px var(--accent-glow); }
.cbm-btn:active { transform: translateY(0); }
.cbm-result-box {
  margin-top: 1.5rem;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
  display: none;
}
.cbm-result-box.show { display: block; }
.cbm-result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  background: var(--bg-alt);
  border-bottom: 1px solid var(--border);
}
.cbm-result-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}
.cbm-copy-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 0.2rem 0.55rem;
  font-size: 0.72rem;
  font-family: var(--font);
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.cbm-copy-btn:hover { color: var(--accent); border-color: var(--accent); }
.cbm-result-content {
  padding: 1rem;
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  color: var(--text);
  line-height: 1.7;
  background: var(--bg-card);
  word-break: break-all;
  white-space: pre-wrap;
}
.cbm-error {
  margin-top: 1rem;
  padding: 0.65rem 1rem;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.3);
  border-radius: 8px;
  font-size: 0.85rem;
  color: #ef4444;
  display: none;
}
.cbm-error.show { display: block; }
.cbm-hint {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 0.35rem;
  line-height: 1.5;
}
@media (max-width: 600px) {
  .cbm-row { grid-template-columns: 1fr; }
}
`;
  document.head.appendChild(style);

  ///grid 3×3 inputuri
  function makeMatrixGrid(idPrefix) {
    let html = `<div class="cbm-matrix-grid" id="${idPrefix}-grid">`;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        html += `<input class="cbm-cell" type="number" id="${idPrefix}-${i}${j}" value="${i===j?1:0}" step="1">`;
    html += `</div>`;
    return html;
  }

  function readMatrix(idPrefix) {
    return Array.from({ length: 3 }, (_, i) =>
      Array.from({ length: 3 }, (_, j) => {
        const v = parseInt(document.getElementById(`${idPrefix}-${i}${j}`).value, 10);
        return isNaN(v) ? 0 : v;
      })
    );
  }

  function matrixPreview(mat) {
    return mat.map(r => "  " + r.map(v => String(v).padStart(4)).join(" ")).join("\n");
  }

  const widget = document.createElement("div");
  widget.className = "cbm-widget";
  widget.innerHTML = `
<div class="cbm-widget-title">Demo interactiv</div>
<p class="cbm-widget-sub">Criptează și decriptează mesaje folosind cifrarea Hill cu permutare de alfabet.</p>

<div class="cbm-tabs">
  <button class="cbm-tab active" data-tab="enc">Criptare</button>
  <button class="cbm-tab" data-tab="dec">Decriptare</button>
</div>

<!-- ENCRYPT -->
<div class="cbm-panel active" id="cbm-panel-enc">
  <div class="cbm-field">
    <label class="cbm-label">Mesaj</label>
    <textarea class="cbm-textarea" id="cbm-msg" placeholder="Scrie mesajul de criptat..."></textarea>
  </div>
  <div class="cbm-row">
    <div class="cbm-field">
      <label class="cbm-label">Cheie matrice (3×3)</label>
      <div class="cbm-matrix-wrap">
        <div class="cbm-matrix-label-row">
          <span class="cbm-det-badge" id="cbm-det-enc">det = ?</span>
        </div>
        ${makeMatrixGrid("cbm-ke")}
        <p class="cbm-hint">Orice întregi — widgetul verifică automat că det = ±1.</p>
      </div>
    </div>
    <div class="cbm-field">
      <label class="cbm-label">Inversă (calculată automat)</label>
      <div class="cbm-inv-preview empty" id="cbm-inv-enc">Introdu o cheie validă...</div>
      <br>
      <label class="cbm-label">Index permutare (nr_perm)</label>
      <input class="cbm-input" id="cbm-perm-enc" type="text" placeholder="Ex: 1" value="1">
      <p class="cbm-hint">Număr întreg pozitiv (poate fi foarte mare, până la 96!).</p>
    </div>
  </div>
  <button class="cbm-btn" id="cbm-btn-enc">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
    Criptează
  </button>
  <div class="cbm-error" id="cbm-err-enc"></div>
  <div class="cbm-result-box" id="cbm-res-enc">
    <div class="cbm-result-header">
      <span class="cbm-result-label">Matricea T (rezultat criptat)</span>
      <button class="cbm-copy-btn" id="cbm-copy-enc">Copiază</button>
    </div>
    <div class="cbm-result-content" id="cbm-res-enc-text"></div>
  </div>
</div>

<!-- DECRYPT -->
<div class="cbm-panel" id="cbm-panel-dec">
  <div class="cbm-field">
    <label class="cbm-label">Matricea T criptată (3 rânduri, valori separate prin spații)</label>
    <textarea class="cbm-textarea" id="cbm-T"
      placeholder="Ex:&#10;45  12  67&#10;33  89  22&#10;11  54  78"></textarea>
    <p class="cbm-hint">Exact 3 rânduri, același număr de coloane pe fiecare rând.</p>
  </div>
  <div class="cbm-row">
    <div class="cbm-field">
      <label class="cbm-label">Cheie matrice (3×3) — aceeași de la criptare</label>
      <div class="cbm-matrix-wrap">
        <div class="cbm-matrix-label-row">
          <span class="cbm-det-badge" id="cbm-det-dec">det = ?</span>
        </div>
        ${makeMatrixGrid("cbm-kd")}
      </div>
    </div>
    <div class="cbm-field">
      <label class="cbm-label">Inversă (calculată automat)</label>
      <div class="cbm-inv-preview empty" id="cbm-inv-dec">Introdu o cheie validă...</div>
      <br>
      <label class="cbm-label">Index permutare (nr_perm)</label>
      <input class="cbm-input" id="cbm-perm-dec" type="text" placeholder="Ex: 1" value="1">
      <p class="cbm-hint">Același nr_perm folosit la criptare.</p>
    </div>
  </div>
  <button class="cbm-btn" id="cbm-btn-dec">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/><line x1="12" y1="15" x2="12" y2="17"/>
    </svg>
    Decriptează
  </button>
  <div class="cbm-error" id="cbm-err-dec"></div>
  <div class="cbm-result-box" id="cbm-res-dec">
    <div class="cbm-result-header">
      <span class="cbm-result-label">Mesaj decriptat</span>
      <button class="cbm-copy-btn" id="cbm-copy-dec">Copiază</button>
    </div>
    <div class="cbm-result-content" id="cbm-res-dec-text"></div>
  </div>
</div>
`;

  const bodyEl = document.getElementById("theme1-body");
  if (bodyEl) bodyEl.appendChild(widget);

  ///determinant + inversă
  function updateDetBadge(prefix, badgeId, invId) {
    const m = readMatrix(prefix);
    const d = det3(m);
    const badge = document.getElementById(badgeId);
    const invBox = document.getElementById(invId);

    badge.textContent = `det = ${d}`;
    if (Math.abs(d) === 1) {
      badge.className = "cbm-det-badge ok";
      invBox.textContent = matrixPreview(inv3(m));
      invBox.classList.remove("empty");
    } else {
      badge.className = "cbm-det-badge err";
      invBox.textContent = d === 0
        ? "Matrice singulară (det = 0)\nnu are inversă."
        : `det = ${d} ≠ ±1\nInversa nu e cu întregi.`;
      invBox.classList.add("empty");
    }
  }

  function bindGrid(prefix, badgeId, invId) {
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        document.getElementById(`${prefix}-${i}${j}`)
          .addEventListener("input", () => updateDetBadge(prefix, badgeId, invId));
    updateDetBadge(prefix, badgeId, invId);
  }

  bindGrid("cbm-ke", "cbm-det-enc", "cbm-inv-enc");
  bindGrid("cbm-kd", "cbm-det-dec", "cbm-inv-dec");

  document.querySelectorAll(".cbm-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".cbm-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".cbm-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("cbm-panel-" + tab.dataset.tab).classList.add("active");
    });
  });

  function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.classList.add("show");
  }
  function hideError(id) { document.getElementById(id).classList.remove("show"); }
  function isValidBigPos(s) { return /^[0-9]+$/.test(s.trim()) && s.trim() !== "0"; }

  ///criptare
  document.getElementById("cbm-btn-enc").addEventListener("click", () => {
    hideError("cbm-err-enc");
    document.getElementById("cbm-res-enc").classList.remove("show");

    const msg = document.getElementById("cbm-msg").value;
    const permStr = document.getElementById("cbm-perm-enc").value.trim();
    const key = readMatrix("cbm-ke");

    if (!msg) return showError("cbm-err-enc", "Mesajul nu poate fi gol.");
    for (let i = 0; i < msg.length; i++) {
      const c = msg.charCodeAt(i);
      if (c < 32 || c > 126)
        return showError("cbm-err-enc", "Mesajul conține caractere neprintabile (doar ASCII 32–126).");
    }
    if (Math.abs(det3(key)) !== 1)
      return showError("cbm-err-enc", "Cheia nu e validă — det trebuie să fie ±1.");
    if (!isValidBigPos(permStr))
      return showError("cbm-err-enc", "nr_perm trebuie să fie un număr întreg pozitiv.");

    try {
      const T = encrypt(msg, key, permStr);
      document.getElementById("cbm-res-enc-text").textContent =
        `[${T.length} × ${T[0].length}]\n\n` + T.map(r => r.join("  ")).join("\n");
      document.getElementById("cbm-res-enc").classList.add("show");
    } catch (e) {
      showError("cbm-err-enc", "Eroare: " + e.message);
    }
  });

  ///decriptare
  document.getElementById("cbm-btn-dec").addEventListener("click", () => {
    hideError("cbm-err-dec");
    document.getElementById("cbm-res-dec").classList.remove("show");

    const raw = document.getElementById("cbm-T").value.trim();
    const permStr = document.getElementById("cbm-perm-dec").value.trim();
    const key = readMatrix("cbm-kd");

    if (!raw) return showError("cbm-err-dec", "Introdu matricea T.");
    if (Math.abs(det3(key)) !== 1)
      return showError("cbm-err-dec", "Cheia nu e validă — det trebuie să fie ±1.");
    if (!isValidBigPos(permStr))
      return showError("cbm-err-dec", "nr_perm trebuie să fie un număr întreg pozitiv.");

    const lines = raw.split(/\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length !== 3)
      return showError("cbm-err-dec", "Matricea T trebuie să aibă exact 3 rânduri.");

    let T;
    try {
      T = lines.map(line =>
        line.split(/[\s,]+/).map(v => {
          const n = parseInt(v, 10);
          if (isNaN(n)) throw new Error("Valoare invalidă: " + v);
          return n;
        })
      );
    } catch (e) {
      return showError("cbm-err-dec", e.message);
    }
    if (T[0].length !== T[1].length || T[1].length !== T[2].length)
      return showError("cbm-err-dec", "Toate rândurile trebuie să aibă același număr de coloane.");

    try {
      const result = decrypt(T, inv3(key), permStr);
      document.getElementById("cbm-res-dec-text").textContent = result;
      document.getElementById("cbm-res-dec").classList.add("show");
    } catch (e) {
      showError("cbm-err-dec", "Eroare: " + e.message);
    }
  });

  ///butonul de copy
  function makeCopy(btnId, contentId) {
    document.getElementById(btnId).addEventListener("click", () => {
      navigator.clipboard.writeText(document.getElementById(contentId).textContent)
        .then(() => {
          const btn = document.getElementById(btnId);
          btn.textContent = "Copiat ✓";
          setTimeout(() => (btn.textContent = "Copiază"), 1800);
        });
    });
  }
  makeCopy("cbm-copy-enc", "cbm-res-enc-text");
  makeCopy("cbm-copy-dec", "cbm-res-dec-text");
})();