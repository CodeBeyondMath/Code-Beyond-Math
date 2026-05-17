(function () {
  'use strict';

  const JUDGE0_BASE = 'https://ce.judge0.com';

  const LANGUAGES = [
    { id: 54, name: 'C++ 17' },
    { id: 71, name: 'Python 3' },
    { id: 62, name: 'Java' },
    { id: 50, name: 'C' },
    { id: 63, name: 'JavaScript (Node)' },
    { id: 60, name: 'Go' },
    { id: 73, name: 'Rust' },
  ];

  function normalizeOut(s) {
    return String(s).trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  // ── Problem data ──────────────────────────────────────────────────────────
  const PROBLEMS = [
    // ── INFORMATICĂ ──────────────────────────────────────────────────────────
    {
      id: 'p1', num: '01', type: 'info',
      title: 'Cheie Parțială',
      theme: 'Criptografie · Algebră liniară',
      difficulty: 'Mediu',
      statement: `
## Enunț

**Cifrul Hill** de ordin 3 criptează un text format din litere mici (a–z) astfel:

1. Textul de lungime $n$ (multiplu de 3) este aranjat într-o matrice $P \\in \\mathbb{Z}_{26}^{3 \\times (n/3)}$, unde coloana $j$ conține literele $\\text{pt}[3j],\\, \\text{pt}[3j{+}1],\\, \\text{pt}[3j{+}2]$, convertite la coduri $0$–$25$ (a$\\to$0, b$\\to$1, …, z$\\to$25).

2. Criptarea: $C = K \\cdot P \\pmod{26}$, unde $K \\in \\mathbb{Z}_{26}^{3 \\times 3}$ este cheia.

3. Textul criptat se obține citind $C$ coloană cu coloană: $\\text{ct}[3j{+}r] = C[r][j]$ (cod $\\to$ literă).

Pe serverul de securitate al agenției, cheia $K$ a suferit o corupere: **exact două elemente** au fost înlocuite cu $-1$. Din fericire, au fost recuperate două perechi verificate (plaintext, ciphertext). Determină valorile lipsă și decriptează un mesaj interceptat.

## Format de intrare / ieșire

**Intrare:**
- 3 linii × 3 valori întregi: matricea $K$ (valorile lipsă sunt $-1$)
- Linia 4: șirul plaintext $p_1$ (litere mici, lungime multiplu de 3)
- Linia 5: șirul ciphertext $c_1$
- Linia 6: șirul plaintext $p_2$
- Linia 7: șirul ciphertext $c_2$
- Linia 8: șirul ciphertext final $c_f$ de decriptat

**Ieșire:**
- Linia 1: cele două valori lipsă din $K$, în ordinea apariției (stânga→dreapta, sus→jos)
- Linia 2: plaintext-ul obținut prin decriptarea lui $c_f$

## Restricții

- Toate elementele cunoscute ale lui $K$ și valorile lipsă sunt în $[0, 25]$
- $\\gcd(\\det K,\\, 26) = 1$ (cheia este inversabilă modulo 26)
- Sistemul determinat de cele două perechi este consistent și are soluție unică
- Lungimea textelor este cel mult $300$
`,
      examples: [
        {
          input: `1 2 -1\n0 1 4\n5 -1 0\nabcdef\nijgayn\nghijkl\nsnukcb\ncriugp`,
          output: `3 6\nmnopqr`,
        }
      ],
      tests: [
        {
          input: `1 2 -1\n0 1 4\n5 -1 0\nabcdef\nijgayn\nghijkl\nsnukcb\ncriugp`,
          expected: `3 6\nmnopqr`,
        },
        {
          input: `-1 1 1\n1 3 -1\n1 1 2\nabcdef\ndffpur\nghijkl\nbjdnyp\nxrzjgl`,
          expected: `2 1\nstuvwx`,
        },
        {
          input: `1 2 3\n-1 1 4\n-1 6 0\nabcdefghi\nijgaynsnu\njklmnopqr\nkcbcriugp\nmvwijgayn`,
          expected: `0 5\nstuabcdef`,
        },
      ],
    },

    {
      id: 'p2', num: '02', type: 'info',
      title: 'Muchii Obligatorii',
      theme: 'Teoria grafurilor · Algebră liniară',
      difficulty: 'Mediu-Greu',
      statement: `
## Enunț

Se dă un **graf neorientat conex** cu $n$ noduri și $m$ muchii (fără bucle, fără muchii multiple). O submulțime de $k$ muchii este marcată ca **obligatorie**.

Determină numărul de **arbori parțiali** ai grafului care conțin **toate** muchiile obligatorii, modulo $10^9+7$.

## Format de intrare / ieșire

**Intrare:**
- Linia 1: $n\\ m\\ k$
- Liniile $2$–$m{+}1$: $u_i\\ v_i$ — muchia $i$ (1-indexat)
- Dacă $k > 0$, linia $m{+}2$: $k$ indici ai muchiilor obligatorii (separați prin spații)

**Ieșire:**
- Un singur număr: răspunsul modulo $10^9+7$

## Restricții

- $2 \\le n \\le 500$, $\\;1 \\le m \\le \\min\\!\\left(\\tfrac{n(n-1)}{2},\\, 10^4\\right)$, $\\;0 \\le k \\le n-1$
- Graful este conex
- Muchiile obligatorii sunt distincte
`,
      examples: [
        {
          input: `4 6 1\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4\n1`,
          output: `8`,
        }
      ],
      tests: [
        {
          input: `4 6 0\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4`,
          expected: `16`,
        },
        {
          input: `4 6 1\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4\n1`,
          expected: `8`,
        },
        {
          input: `3 3 2\n1 2\n2 3\n1 3\n1 2`,
          expected: `1`,
        },
        {
          input: `4 6 3\n1 2\n1 3\n1 4\n2 3\n2 4\n3 4\n1 2 4`,
          expected: `0`,
        },
      ],
    },

    {
      id: 'p3', num: '03', type: 'info',
      title: 'Sume de k Pătrate',
      theme: 'NTT · Combinatorică',
      difficulty: 'Mediu',
      statement: `
## Enunț

Se dau $n$ și $k$. Determină numărul de tupluri **ordonate** $(a_1, a_2, \\ldots, a_k)$ cu $a_i \\ge 0$ și

$$\\sum_{i=1}^k a_i^2 = n$$

modulo $10^9 + 7$.

## Format de intrare / ieșire

**Intrare:** O singură linie cu $n\\ k$.

**Ieșire:** Răspunsul modulo $10^9 + 7$.

## Restricții

- $1 \\le n \\le 10^5$
- $1 \\le k \\le 10^6$
`,
      examples: [
        {
          input: `25 2`,
          output: `4`,
        },
        {
          input: `9 3`,
          output: `6`,
        }
      ],
      tests: [
        { input: `25 2`, expected: `4` },
        { input: `9 3`,  expected: `6` },
        { input: `50 2`, expected: `3` },
        { input: `1 4`,  expected: `4` },
      ],
    },

    {
      id: 'p4', num: '04', type: 'info',
      title: 'Sume Ordonate',
      theme: 'FFT · Exponențiere de polinoame',
      difficulty: 'Greu',
      statement: `
## Enunț

Se dă un număr $n$, un exponent $k$ și o mulțime $A$ de $|A|$ numere naturale distincte. Determină în câte moduri **ordonate** poate fi scris $n$ ca sumă de exact $k$ elemente din $A$ (cu repetiție).

Formal, numără tuplurile $(a_1, a_2, \\ldots, a_k)$ cu $a_i \\in A$ și $\\displaystyle\\sum_{i=1}^k a_i = n$.

## Format de intrare / ieșire

**Intrare:**
- Linia 1: $n\\ k$
- Linia 2: elementele mulțimii $A$ (separate prin spații)

**Ieșire:** Răspunsul modulo $10^9 + 7$.

## Restricții

- $1 \\le n \\le 10^5$
- $1 \\le k \\le 10^9$
- $1 \\le |A| \\le 100$, toate elementele din $A$ în $[1, n]$
`,
      examples: [
        {
          input: `6 3\n1 2 3`,
          output: `7`,
        },
        {
          input: `10 2\n3 7`,
          output: `2`,
        }
      ],
      tests: [
        { input: `6 3\n1 2 3`,  expected: `7` },
        { input: `10 2\n3 7`,   expected: `2` },
        { input: `5 5\n1`,      expected: `1` },
        { input: `4 2\n1 2 3 4`, expected: `3` },
      ],
    },

    // ── MATEMATICĂ ────────────────────────────────────────────────────────────
    {
      id: 'p5', num: '05', type: 'math',
      title: 'Disc cu Puncte',
      theme: 'Geometrie combinatorială · Principiul cutiei',
      difficulty: 'Mediu',
      statement: `
## Enunț

Fie $m, k$ numere naturale cu $m \\ge 1$, $k \\ge 2$ și $n = mk^2$ puncte în interiorul unui disc de rază $1$.

**Demonstrează** că există un disc de rază $r = \\dfrac{1}{k-1}$ care conține cel puțin $m+1$ dintre cele $n$ puncte.
`,
      examples: []
    },

    {
      id: 'p6', num: '06', type: 'math',
      title: 'Grădina Rotundă',
      theme: 'Geometrie · Rețele de puncte',
      difficulty: 'Mediu-Greu',
      statement: `
## Enunț

Într-o grădină rotundă de rază 50, copacii sunt plantați în toate nodurile rețelei pătrate de latură 1 aflate în interiorul grădinii. În centrul grădinii se află un chioșc $O$.

Copacii sunt cilindri de rază $\\rho$.

**Demonstrează:**

1. Dacă $\\rho < \\dfrac{1}{\\sqrt{2501}}$, există raze ieșite din $O$ care nu intersectează niciun copac.

2. Dacă $\\rho > \\dfrac{1}{50}$, orice rază ieșită din $O$ intersectează cel puțin un copac.
`,
      examples: []
    },

    {
      id: 'p7', num: '07', type: 'math',
      title: 'Dimensiunea Fractalului',
      theme: 'Fractali · Analiză numerică',
      difficulty: 'Mediu',
      statement: `
## Enunț

**Dimensiunea box-counting** a unui set $S \\subset \\mathbb{R}^2$ este:

$$d = \\lim_{\\varepsilon \\to 0} \\frac{\\log N(\\varepsilon)}{\\log(1/\\varepsilon)}$$

unde $N(\\varepsilon)$ este numărul de pătrate de latură $\\varepsilon$ ce conțin cel puțin un punct din $S$.

Fie $S$ triunghiul Sierpiński, generat prin Jocul Haosului cu $10^6$ iterații.

**Demonstrează** că $d = \\dfrac{\\log 3}{\\log 2} \\approx 1.585$.

**Verificare numerică:** calculează $N(\\varepsilon)$ pentru $\\varepsilon \\in \\{0.5,\\, 0.25,\\, 0.1,\\, 0.05,\\, 0.01\\}$ și estimează $d$ prin regresia dreptei $\\log N(\\varepsilon)$ față de $\\log(1/\\varepsilon)$.
`,
      examples: []
    },
  ];

  // ── Populate global title map ─────────────────────────────────────────────
  window.PROBLEM_TITLES = window.PROBLEM_TITLES || {};
  PROBLEMS.forEach(p => { window.PROBLEM_TITLES[p.id] = p.title; });

  // ── Rendering helpers ─────────────────────────────────────────────────────
  function $id(id) { return document.getElementById(id); }

  function renderMd(text, targetEl) {
    const mathStore = [];
    const protect = m => { mathStore.push(m); return `%%M${mathStore.length - 1}%%`; };
    let t = text
      .replace(/\$\$([\s\S]*?)\$\$/g, protect)
      .replace(/\$(?!\$)((?:[^$\\]|\\[\s\S])+?)\$(?!\$)/g, protect);
    let html = marked.parse(t);
    html = html.replace(/%%M(\d+)%%/g, (_, i) => mathStore[+i]);
    targetEl.innerHTML = html;
    if (window.renderMathInElement) {
      renderMathInElement(targetEl, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
    targetEl.querySelectorAll('pre').forEach(pre => {
      if (pre.parentElement?.classList.contains('cbm-code-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'cbm-code-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      const btn = document.createElement('button');
      btn.className = 'cbm-copy-btn';
      btn.textContent = 'Copiază';
      wrap.appendChild(btn);
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code') || pre;
        navigator.clipboard.writeText(code.innerText || '').then(() => {
          btn.textContent = '✓ Copiat!'; btn.classList.add('cbm-copied');
          setTimeout(() => { btn.textContent = 'Copiază'; btn.classList.remove('cbm-copied'); }, 2200);
        });
      });
    });
  }

  function diffBadge(d) {
    const cls = d.startsWith('Ușor') ? 'easy' : d.startsWith('Mediu') ? 'medium' : 'hard';
    return `<span class="diff-badge diff-badge--${cls}">${d}</span>`;
  }

  // ── Problems list page ────────────────────────────────────────────────────
  function renderProblemsPage() {
    const container = $id('problems-page-body');
    if (!container || container.dataset.rendered) return;
    container.dataset.rendered = '1';

    const infoProbs = PROBLEMS.filter(p => p.type === 'info');
    const mathProbs = PROBLEMS.filter(p => p.type === 'math');

    container.innerHTML = `
      <div class="probs-section">
        <h3 class="probs-section-hdr">
          <span class="probs-section-icon">⌨</span> Probleme de Informatică
        </h3>
        <p class="probs-section-desc">Trimite soluții și primești verdict automat pe toate testele</p>
        <div class="themes-grid probs-grid">
          ${infoProbs.map(p => probCard(p)).join('')}
        </div>
      </div>
      <div class="probs-section probs-section--math">
        <h3 class="probs-section-hdr">
          <span class="probs-section-icon">∑</span> Probleme de Matematică
        </h3>
        <p class="probs-section-desc">Probleme demonstrative · enunț și editorial</p>
        <div class="themes-grid probs-grid">
          ${mathProbs.map(p => probCard(p)).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.theme-card').forEach(card => {
      setTimeout(() => card.classList.add('visible'), 50);
    });
  }

  function probCard(p) {
    return `
      <a href="#" class="theme-card prob-card" onclick="window.showProblem('${p.id}'); return false;">
        <span class="card-num">${p.num}</span>
        <div class="prob-card-type prob-card-type--${p.type}">${p.type === 'info' ? 'Informatică' : 'Matematică'}</div>
        <h3>${p.title}</h3>
        <p>${p.theme}</p>
        ${diffBadge(p.difficulty)}
      </a>`;
  }

  // ── Individual problem page ───────────────────────────────────────────────
  function renderProblemPage(id) {
    const prob = PROBLEMS.find(p => p.id === id);
    if (!prob) return;
    const container = $id(`problem-${id}-content`);
    if (!container) return;

    const isInfo = prob.type === 'info';

    container.innerHTML = `
      <button class="mini-back-btn" onclick="window.showProblems()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Înapoi la probleme
      </button>

      <div class="theme-page-header">
        <span class="theme-page-num">Problema ${prob.num} · ${isInfo ? 'Informatică' : 'Matematică'}</span>
        <h2 class="theme-page-title">${prob.title}</h2>
        <div style="display:flex;gap:10px;align-items:center;margin-bottom:.5rem">
          ${diffBadge(prob.difficulty)}
          <span class="prob-theme-tag">${prob.theme}</span>
        </div>
        <div class="theme-page-accent"></div>
      </div>

      <div class="prob-tabs-bar">
        <button class="prob-tab active" data-tab="statement">Enunț</button>
        ${isInfo ? `
          <button class="prob-tab" data-tab="my-subs">Soluțiile mele</button>
          <button class="prob-tab" data-tab="pub-subs">Soluții publice</button>
        ` : ''}
        <button class="prob-tab" data-tab="editorial">Editorial</button>
      </div>

      <div class="prob-tab-panel" id="prob-panel-statement-${id}">
        <div class="markdown-body prob-statement" id="prob-stmt-${id}"></div>
        ${isInfo ? buildEditor(prob) : ''}
      </div>

      ${isInfo ? `
      <div class="prob-tab-panel hidden" id="prob-panel-my-subs-${id}">
        <div id="my-subs-container-${id}"></div>
      </div>
      <div class="prob-tab-panel hidden" id="prob-panel-pub-subs-${id}">
        <div id="pub-subs-container-${id}"></div>
      </div>
      ` : ''}

      <div class="prob-tab-panel hidden" id="prob-panel-editorial-${id}">
        <div class="markdown-body" id="prob-editorial-${id}">
          <p class="editorial-placeholder">Editorialul va fi adăugat în curând.</p>
        </div>
      </div>
    `;

    renderMd(prob.statement, $id(`prob-stmt-${id}`));

    if (prob.examples?.length) {
      const exDiv = document.createElement('div');
      exDiv.className = 'prob-examples';
      exDiv.innerHTML = `<h3>Exemple</h3>` + prob.examples.map((ex, i) => buildExample(ex, i)).join('');
      $id(`prob-stmt-${id}`).appendChild(exDiv);
      initExampleCopies(exDiv);
    }

    container.querySelectorAll('.prob-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.prob-tab').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.prob-tab-panel').forEach(p => p.classList.add('hidden'));
        btn.classList.add('active');
        const panel = $id(`prob-panel-${btn.dataset.tab}-${id}`);
        if (panel) panel.classList.remove('hidden');

        if (btn.dataset.tab === 'editorial') loadEditorial(id);
        if (btn.dataset.tab === 'my-subs')  loadMySubs(id);
        if (btn.dataset.tab === 'pub-subs') loadPublicSubs(id);
      });
    });

    if (isInfo) wireEditor(prob);
  }

  // ── Example blocks ────────────────────────────────────────────────────────
  function buildExample(ex, i) {
    return `
      <div class="prob-example">
        <div class="prob-example-title">Exemplul ${i + 1}</div>
        <div class="prob-io-row">
          <div class="prob-io-box">
            <div class="prob-io-hdr">Intrare <button class="ex-copy-btn" data-text="${escAttr(ex.input)}">Copiază</button></div>
            <pre class="prob-io-pre">${escHtml(ex.input)}</pre>
          </div>
          <div class="prob-io-box">
            <div class="prob-io-hdr">Ieșire <button class="ex-copy-btn" data-text="${escAttr(ex.output)}">Copiază</button></div>
            <pre class="prob-io-pre">${escHtml(ex.output)}</pre>
          </div>
        </div>
      </div>`;
  }

  function initExampleCopies(container) {
    container.querySelectorAll('.ex-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(btn.dataset.text || '').then(() => {
          btn.textContent = '✓'; setTimeout(() => { btn.textContent = 'Copiază'; }, 1800);
        });
      });
    });
  }

  // ── Code editor ───────────────────────────────────────────────────────────
  function buildEditor(prob) {
    const langOptions = LANGUAGES.map(l =>
      `<option value="${l.id}" data-name="${l.name}">${l.name}</option>`
    ).join('');

    return `
      <div class="prob-editor-section">
        <h3 class="prob-editor-title">Trimite soluție</h3>
        <div class="prob-editor-controls">
          <select class="lang-select" id="lang-sel-${prob.id}">${langOptions}</select>
        </div>
        <textarea class="code-editor" id="code-editor-${prob.id}" spellcheck="false" autocomplete="off" placeholder="Scrie soluția ta aici..."></textarea>
        <div class="prob-editor-footer">
          <div class="editor-btns">
            <button class="submit-btn" id="submit-btn-${prob.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              Trimite soluție
            </button>
          </div>
        </div>
        <div class="judge-result hidden" id="judge-result-${prob.id}"></div>
      </div>`;
  }

  function wireEditor(prob) {
    const submitBtn = $id(`submit-btn-${prob.id}`);
    if (!submitBtn) return;
    submitBtn.addEventListener('click', () => handleSubmit(prob));
  }

  // ── Submission flow (test runner) ─────────────────────────────────────────
  async function handleSubmit(prob) {
    const user = window.currentUser?.();
    if (!user) {
      window.openAuthModal?.('login');
      showJudgeMsg(prob.id, 'auth-required',
        '<b>Trebuie să fii autentificat</b> pentru a trimite soluții. <button class="link-btn" onclick="window.openAuthModal(\'login\')">Autentifică-te</button>');
      return;
    }

    const id        = prob.id;
    const sel       = $id(`lang-sel-${id}`);
    const langId    = parseInt(sel.value);
    const langName  = sel.options[sel.selectedIndex].dataset.name;
    const code      = $id(`code-editor-${id}`)?.value || '';
    const submitBtn = $id(`submit-btn-${id}`);

    if (!code.trim()) {
      showJudgeMsg(id, 'error', 'Editorul este gol. Scrie o soluție înainte de a trimite.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Se procesează...';

    const results = new Array(prob.tests.length).fill(null).map(() => ({ verdict: 'pending' }));
    renderTestTable(id, prob.tests, results);

    for (let i = 0; i < prob.tests.length; i++) {
      results[i] = { verdict: 'running' };
      renderTestTable(id, prob.tests, results);

      let token;
      try {
        token = await submitCode(code, langId, prob.tests[i].input);
      } catch (err) {
        results[i] = { verdict: 'ERR', detail: err.message, timeMs: null, memKb: null };
        renderTestTable(id, prob.tests, results);
        continue;
      }

      const res = await pollJudge0(token);
      results[i] = gradeTest(res, prob.tests[i].expected);
      renderTestTable(id, prob.tests, results);
    }

    const overall = computeOverall(results);
    renderTestTable(id, prob.tests, results, overall);

    try {
      await window.supabaseClient.from('submissions').insert({
        user_id:       user.id,
        problem_id:    id,
        language_id:   langId,
        language_name: langName,
        source_code:   code,
        status:        overall,
      });
    } catch (_) {}

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg> Trimite soluție';
  }

  async function submitCode(code, langId, stdin) {
    const b64 = s => btoa(Array.from(new TextEncoder().encode(s), b => String.fromCharCode(b)).join(''));
    const resp = await fetch(`${JUDGE0_BASE}/submissions?base64_encoded=true&wait=false`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language_id: langId, source_code: b64(code), stdin: b64(stdin) })
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (!data.token) throw new Error('Token lipsă în răspuns');
    return data.token;
  }

  async function pollJudge0(token) {
    const delay  = ms => new Promise(r => setTimeout(r, ms));
    const b64Dec = s => { try { return new TextDecoder().decode(Uint8Array.from(atob(s), c => c.charCodeAt(0))); } catch { return s || ''; } };

    for (let i = 0; i < 20; i++) {
      await delay(i === 0 ? 1500 : 2000);
      try {
        const resp = await fetch(
          `${JUDGE0_BASE}/submissions/${token}?base64_encoded=true&fields=status,stdout,stderr,time,memory`,
          { headers: { Accept: 'application/json' } }
        );
        if (!resp.ok) continue;
        const d = await resp.json();
        if ((d.status?.id ?? 0) <= 2) continue;
        return {
          statusId:  d.status?.id,
          statusTxt: d.status?.description || 'Unknown',
          stdout:    d.stdout  ? b64Dec(d.stdout)  : '',
          stderr:    d.stderr  ? b64Dec(d.stderr)  : '',
          timeMs:    d.time    ? Math.round(parseFloat(d.time) * 1000) : null,
          memKb:     d.memory  || null,
        };
      } catch (_) {}
    }
    return { statusId: -1, statusTxt: 'Timeout', stdout: '', stderr: '', timeMs: null, memKb: null };
  }

  function gradeTest(res, expected) {
    const { statusId, statusTxt, stdout, stderr, timeMs, memKb } = res;
    let verdict;
    if (statusId === 6)                                  verdict = 'CE';
    else if (statusId === 5)                             verdict = 'TLE';
    else if (statusId >= 7 && statusId <= 12)            verdict = 'RE';
    else if (statusId === 3 && normalizeOut(stdout) === normalizeOut(expected)) verdict = 'AC';
    else if (statusId === -1)                            verdict = 'ERR';
    else                                                 verdict = 'WA';
    return { verdict, statusTxt, stdout, stderr, timeMs, memKb };
  }

  function computeOverall(results) {
    const order = ['CE', 'ERR', 'RE', 'TLE', 'WA', 'AC', 'running', 'pending'];
    let worst = 'AC';
    for (const r of results) {
      if (order.indexOf(r.verdict) < order.indexOf(worst)) worst = r.verdict;
    }
    return worst === 'AC' ? 'Accepted' : worst === 'WA' ? 'Wrong Answer' :
           worst === 'TLE' ? 'Time Limit Exceeded' : worst === 'RE' ? 'Runtime Error' :
           worst === 'CE' ? 'Compilation Error' : worst;
  }

  function verdictCls(v) {
    if (v === 'AC') return 'ok';
    if (v === 'TLE') return 'tle';
    if (v === 'CE' || v === 'RE' || v === 'ERR') return 'err';
    if (v === 'pending' || v === 'running') return 'pending';
    return 'wrong';
  }

  function renderTestTable(probId, tests, results, overall) {
    const el = $id(`judge-result-${probId}`);
    if (!el) return;

    const done    = results.filter(r => r.verdict !== 'pending' && r.verdict !== 'running').length;
    const allDone = done === tests.length;

    function overallToCls(o) {
      if (o === 'Accepted') return 'ok';
      if (o === 'Time Limit Exceeded') return 'tle';
      if (o && o.includes('Error')) return 'err';
      return 'wrong';
    }

    const cls = allDone && overall ? overallToCls(overall) : 'processing';

    const overallHtml = allDone && overall ? `
      <div class="judge-status-row">
        <span class="sub-badge sub-badge--${overallToCls(overall)}">${escHtml(overall)}</span>
        <span class="judge-meta">${done}/${tests.length} teste</span>
      </div>` : `
      <div class="judge-status-row">
        <span class="judge-spinner"></span>
        <span class="judge-meta">Test ${done + 1} / ${tests.length}...</span>
      </div>`;

    const rows = results.map((r, i) => {
      const v = r.verdict;
      const badge = v === 'pending' ? '<span style="opacity:.45">—</span>'
        : v === 'running' ? '<span class="judge-spinner" style="width:12px;height:12px"></span>'
        : `<span class="sub-badge sub-badge--${verdictCls(v)}">${v}</span>`;
      const time = r.timeMs != null ? `${r.timeMs} ms` : '—';
      const mem  = r.memKb  != null ? `${r.memKb} KB`  : '—';
      return `<tr><td>#${i + 1}</td><td>${badge}</td><td>${time}</td><td>${mem}</td></tr>`;
    }).join('');

    el.className = `judge-result judge-result--${cls}`;
    el.innerHTML = `
      ${overallHtml}
      <div class="test-results-wrap">
        <table class="test-results-table">
          <thead><tr><th>Test</th><th>Verdict</th><th>Timp</th><th>Memorie</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    el.classList.remove('hidden');
  }

  function showJudgeMsg(probId, type, html) {
    const el = $id(`judge-result-${probId}`);
    if (!el) return;
    el.className = `judge-result judge-result--${type}`;
    el.innerHTML = html;
    el.classList.remove('hidden');
  }

  // ── My submissions panel ──────────────────────────────────────────────────
  async function loadMySubs(probId) {
    const container = $id(`my-subs-container-${probId}`);
    if (!container) return;

    const user = window.currentUser?.();
    if (!user) {
      container.innerHTML = `<div class="subs-login-gate">
        <p>Trebuie să fii autentificat pentru a vedea soluțiile trimise.</p>
        <button class="cta-btn" onclick="window.openAuthModal('login')">Autentifică-te</button>
      </div>`;
      return;
    }

    container.innerHTML = '<p class="loading-txt">Se încarcă...</p>';
    try {
      const { data } = await window.supabaseClient
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('problem_id', probId)
        .order('created_at', { ascending: false })
        .limit(50);

      container.innerHTML = data?.length
        ? buildSubsTable(data, false)
        : '<p class="profile-empty">Nu ai trimis nicio soluție pentru această problemă.</p>';
    } catch (err) {
      container.innerHTML = `<p class="profile-empty">Eroare: ${escHtml(err.message)}</p>`;
    }
  }

  // ── Public submissions panel ──────────────────────────────────────────────
  async function loadPublicSubs(probId) {
    const container = $id(`pub-subs-container-${probId}`);
    if (!container) return;
    if (container.dataset.loaded) return;
    container.dataset.loaded = '1';

    container.innerHTML = '<p class="loading-txt">Se încarcă...</p>';
    try {
      const { data, error } = await window.supabaseClient
        .from('submissions')
        .select('id, user_id, language_name, status, time_ms, memory_kb, created_at')
        .eq('problem_id', probId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      if (!data?.length) {
        container.innerHTML = '<p class="profile-empty">Nicio soluție publică momentan.</p>';
        return;
      }

      // Ia username-urile separat
      const userIds = [...new Set(data.map(s => s.user_id).filter(Boolean))];
      const { data: profiles } = await window.supabaseClient
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      const usernameMap = {};
      (profiles || []).forEach(p => { usernameMap[p.id] = p.username; });

      // Adaugă username pe fiecare submission
      const enriched = data.map(s => ({
        ...s,
        username: usernameMap[s.user_id] || s.user_id?.slice(0, 8) + '…'
      }));

      container.innerHTML = buildSubsTable(enriched, true);
    } catch (err) {
      const isAuthErr = err.message?.toLowerCase().includes('jwt') ||
                        err.message?.toLowerCase().includes('auth') ||
                        err.code === 'PGRST301';
      if (isAuthErr) {
        container.innerHTML = `<div class="subs-login-gate">
          <p>Soluțiile publice sunt disponibile doar utilizatorilor autentificați.</p>
          <button class="cta-btn" onclick="window.openAuthModal('login')">Autentifică-te</button>
        </div>`;
      } else {
        container.innerHTML = `<p class="profile-empty">Eroare: ${escHtml(err.message)}</p>`;
      }
    }
  }

  function buildSubsTable(data, showUser) {
    const rows = data.map(s => {
      const cls  = statusCls(s.status);
      const date = new Date(s.created_at).toLocaleString('ro-RO');
      const userCol = showUser
        ? `<td>${escHtml(s.username || '—')}</td>`
        : '';
      return `<tr>
        ${userCol}
        <td>${escHtml(s.language_name || '—')}</td>
        <td><span class="sub-badge sub-badge--${cls}">${escHtml(s.status || '—')}</span></td>
        <td>${s.time_ms   != null ? s.time_ms  + ' ms' : '—'}</td>
        <td>${s.memory_kb != null ? s.memory_kb + ' KB' : '—'}</td>
        <td>${date}</td>
      </tr>`;
    }).join('');

    const userHeader = showUser ? '<th>Utilizator</th>' : '';
    return `<div class="subs-table-wrap">
      <table class="subs-table">
        <thead><tr>${userHeader}<th>Limbaj</th><th>Status</th><th>Timp</th><th>Memorie</th><th>Dată</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  function statusCls(s) {
    if (!s || s === 'Processing' || s === 'In Queue' || s === 'pending' || s === 'running') return 'pending';
    if (s === 'Accepted') return 'ok';
    if (s === 'Time Limit Exceeded') return 'tle';
    if (s.includes('Error') || s.includes('error')) return 'err';
    return 'wrong';
  }

  // ── Editorial ─────────────────────────────────────────────────────────────
  async function loadEditorial(probId) {
    const el = $id(`prob-editorial-${probId}`);
    if (!el || el.dataset.loaded) return;
    el.dataset.loaded = '1';
    try {
      const resp = await fetch(`md/${probId}.md`);
      if (!resp.ok) throw new Error('not found');
      const text = await resp.text();
      renderMd(text, el);
    } catch (_) {
      el.innerHTML = '<p class="editorial-placeholder">Editorialul va fi adăugat în curând.</p>';
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function showProblems() {
    window._showPageRaw?.('problems-page');
    setTimeout(renderProblemsPage, 50);
  }

  function showProblem(id) {
    window._showPageRaw?.(`problem-${id}`);
    setTimeout(() => renderProblemPage(id), 50);
  }

  // ── Utility ───────────────────────────────────────────────────────────────
  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function escAttr(s) {
    return escHtml(s).replace(/\n/g,'&#10;');
  }

  // ── CSS for test results table ────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
.test-results-wrap { margin-top: .75rem; overflow-x: auto; }
.test-results-table { width: 100%; border-collapse: collapse; font-size: .82rem; }
.test-results-table th,
.test-results-table td { padding: .35rem .7rem; border-bottom: 1px solid var(--border); text-align: left; }
.test-results-table th { font-weight: 700; opacity: .65; font-size: .74rem; text-transform: uppercase; letter-spacing: .05em; }
.test-results-table tbody tr:last-child td { border-bottom: none; }
.judge-result--processing { border-color: var(--border); }
.sub-user-id { font-family: 'Courier New', monospace; font-size: .78rem; opacity: .7; }
`;
  document.head.appendChild(style);

  // ── Expose ────────────────────────────────────────────────────────────────
  window.showProblems = showProblems;
  window.showProblem  = showProblem;
})();
