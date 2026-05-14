///widget interactiv pt numarul de arbori dintr-un graf
///foloseste teorema lui Kirchhoff cu cofactorul matricei Laplaciene
///se apeleaza dupa ce marked.parse() si-a facut treaba in #theme2-body

(function () {
  "use strict";

  const style = document.createElement("style");
  style.textContent = `
.cbm2-widget {
  margin-top: 3.5rem;
  border-top: 2px solid var(--accent);
  padding-top: 2.5rem;
}
.cbm2-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
  margin-bottom: 0.35rem;
}
.cbm2-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}
.cbm2-toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.cbm2-btn {
  font-family: var(--font);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 5px 14px;
  border: 1px solid var(--border);
  border-radius: 7px;
  background: var(--bg-card);
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.cbm2-btn:hover { color: var(--accent); border-color: var(--accent); }
.cbm2-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.cbm2-btn:disabled { opacity: 0.35; cursor: default; pointer-events: none; }
.cbm2-btn-right { margin-left: auto; }
.cbm2-canvas-wrap {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-alt);
  margin-bottom: 10px;
}
.cbm2-canvas-wrap canvas {
  display: block;
  width: 100%;
  height: 320px;
  cursor: crosshair;
}
.cbm2-hint {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  line-height: 1.5;
}
.cbm2-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px;
  margin-bottom: 1.25rem;
}
.cbm2-stat {
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 10px 14px;
}
.cbm2-stat-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.cbm2-stat-val {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.1;
}
.cbm2-laplacian-wrap {
  margin-bottom: 1.25rem;
  overflow-x: auto;
}
.cbm2-lap-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.cbm2-lap-table {
  border-collapse: collapse;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
}
.cbm2-lap-table td {
  padding: 4px 10px;
  text-align: right;
  border: 1px solid var(--border);
  color: var(--text);
}
.cbm2-lap-table td.diag { color: var(--accent); font-weight: 700; }
.cbm2-lap-table td.neg  { color: #ef4444; }
.cbm2-no-trees {
  font-size: 0.85rem;
  color: var(--text-muted);
  padding: 8px 0;
  display: none;
}
.cbm2-tree-section { display: none; flex-direction: column; gap: 10px; margin-top: 0.5rem; }
.cbm2-tree-section.show { display: flex; }
.cbm2-tree-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.cbm2-tree-counter {
  font-size: 0.82rem;
  color: var(--text-muted);
  min-width: 110px;
}
.cbm2-speed-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-left: auto;
}
.cbm2-speed-wrap input[type=range] { width: 80px; accent-color: var(--accent); }
.cbm2-tree-canvas-wrap {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-alt);
}
.cbm2-tree-canvas-wrap canvas { display: block; width: 100%; height: 320px; }
@media (max-width: 480px) { .cbm2-btn-right { margin-left: 0; } }
`;
  document.head.appendChild(style);

  const widget = document.createElement("div");
  widget.className = "cbm2-widget";
  widget.innerHTML = `
<div class="cbm2-title">Demo interactiv</div>
<p class="cbm2-sub">Construiește un graf și calculează numărul de arbori de acoperire prin teorema lui Kirchhoff.</p>

<div class="cbm2-toolbar">
  <button class="cbm2-btn active" id="cbm2-btn-node">+ Nod</button>
  <button class="cbm2-btn" id="cbm2-btn-edge">~ Muchie</button>
  <button class="cbm2-btn" id="cbm2-btn-del">✕ Șterge</button>
  <button class="cbm2-btn cbm2-btn-right" id="cbm2-btn-clear">Resetare</button>
  <button class="cbm2-btn" id="cbm2-btn-ex1">K₄</button>
  <button class="cbm2-btn" id="cbm2-btn-ex2">C₅</button>
</div>

<div class="cbm2-canvas-wrap">
  <canvas id="cbm2-gc"></canvas>
</div>

<p class="cbm2-hint">
  <strong>Nod</strong>: click pe canvas &nbsp;|&nbsp;
  <strong>Muchie</strong>: click nod → click alt nod (click în gol anulează) &nbsp;|&nbsp;
  <strong>Șterge</strong>: click pe nod sau muchie &nbsp;|&nbsp;
  Trage nodurile cu mouse-ul
</p>

<div class="cbm2-stats">
  <div class="cbm2-stat"><div class="cbm2-stat-label">Noduri</div><div class="cbm2-stat-val" id="cbm2-s-nodes">0</div></div>
  <div class="cbm2-stat"><div class="cbm2-stat-label">Muchii</div><div class="cbm2-stat-val" id="cbm2-s-edges">0</div></div>
  <div class="cbm2-stat"><div class="cbm2-stat-label">Arbori de acoperire</div><div class="cbm2-stat-val" id="cbm2-s-trees">—</div></div>
  <div class="cbm2-stat"><div class="cbm2-stat-label">Cofactor det(L̃)</div><div class="cbm2-stat-val" id="cbm2-s-det">—</div></div>
</div>

<div class="cbm2-laplacian-wrap" id="cbm2-lap-wrap"></div>
<div class="cbm2-no-trees" id="cbm2-no-trees">Graful nu are arbori de acoperire (nu e conex sau are mai puțin de 2 noduri).</div>

<div class="cbm2-tree-section" id="cbm2-tree-section">
  <div class="cbm2-tree-nav">
    <button class="cbm2-btn" id="cbm2-btn-prev" disabled>&#8592;</button>
    <span class="cbm2-tree-counter" id="cbm2-tree-counter">Arborele 1 / 1</span>
    <button class="cbm2-btn" id="cbm2-btn-next">&#8594;</button>
    <button class="cbm2-btn" id="cbm2-btn-anim">&#9654; Animație</button>
    <div class="cbm2-speed-wrap">
      <span>Viteză:</span>
      <input type="range" min="200" max="2000" step="100" value="800" id="cbm2-speed">
    </div>
  </div>
  <div class="cbm2-tree-canvas-wrap">
    <canvas id="cbm2-tc"></canvas>
  </div>
</div>
`;

  const body = document.getElementById("theme2-body");
  if (body) body.appendChild(widget);

  ///canva setup
  const gc   = document.getElementById("cbm2-gc");
  const tc   = document.getElementById("cbm2-tc");
  const gctx = gc.getContext("2d");
  const tctx = tc.getContext("2d");

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const W = 660, H = 320;

  function initCanvas(c) {
    c.width  = W * DPR;
    c.height = H * DPR;
    c.style.width  = "100%";
    c.style.height = H + "px";
    c.getContext("2d").scale(DPR, DPR);
  }
  initCanvas(gc);
  initCanvas(tc);

  const NODE_R = 20;
  let nodes = [], edges = [];
  let mode = "node", selNode = null;
  let trees = [], treeIdx = 0;
  let animTimer = null, animRunning = false;

  ///fizica
  let rafId = null;
  const DAMPING    = 0.82;
  const REPULSION  = 4800;
  const SPRING_LEN = 140;
  const SPRING_K   = 0.045;
  const GRAVITY    = 0.012;  ///trage spre centru
  const MAX_V      = 6;

  ///interactiunea
  let mouseX = 0, mouseY = 0;
  let dragNode = null, dragOffX = 0, dragOffY = 0;
  let isDragging = false;
  let mouseDownNode = -1;

  function cv(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  ///tick-uri
  function physicsStep() {
    if (nodes.length === 0) return;

    const cx = W / 2, cy = H / 2;

    ///forte 0
    nodes.forEach(n => { n.fx = 0; n.fy = 0; });

    ///repulsie intre toate perechile
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = a.x - b.x, dy = a.y - b.y;
        const dist2 = dx * dx + dy * dy || 0.01;
        const dist  = Math.sqrt(dist2);
        const force = REPULSION / dist2;
        const ux = dx / dist, uy = dy / dist;
        a.fx += ux * force;
        a.fy += uy * force;
        b.fx -= ux * force;
        b.fy -= uy * force;
      }
    }

    ///atractie elastica intre muchii
    edges.forEach(e => {
      const a = nodes[e.a], b = nodes[e.b];
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const stretch = dist - SPRING_LEN;
      const force   = SPRING_K * stretch;
      const ux = dx / dist, uy = dy / dist;
      a.fx += ux * force;
      a.fy += uy * force;
      b.fx -= ux * force;
      b.fy -= uy * force;
    });

    ///gravitatie spre centru
    nodes.forEach(n => {
      n.fx += (cx - n.x) * GRAVITY;
      n.fy += (cy - n.y) * GRAVITY;
    });

    ///integreaza
    nodes.forEach(n => {
      if (n === dragNode) return;
      n.vx = (n.vx + n.fx) * DAMPING;
      n.vy = (n.vy + n.fy) * DAMPING;
      const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (spd > MAX_V) { n.vx *= MAX_V / spd; n.vy *= MAX_V / spd; }
      n.x += n.vx;
      n.y += n.vy;
      const pad = NODE_R + 4;
      if (n.x < pad)     { n.x = pad;     n.vx *= -0.4; }
      if (n.x > W - pad) { n.x = W - pad; n.vx *= -0.4; }
      if (n.y < pad)     { n.y = pad;     n.vy *= -0.4; }
      if (n.y > H - pad) { n.y = H - pad; n.vy *= -0.4; }
    });
  }

  function drawMain() {
    gctx.clearRect(0, 0, W, H);

    const accentColor   = cv("--accent");
    const borderColor   = cv("--border");
    const mutedColor    = cv("--text-muted");

    ///muchie fantoma
    if (mode === "edge" && selNode !== null) {
      const sn = nodes[selNode];
      gctx.save();
      gctx.setLineDash([6, 5]);
      gctx.strokeStyle = accentColor;
      gctx.globalAlpha = 0.55;
      gctx.lineWidth = 2;
      gctx.beginPath();
      gctx.moveTo(sn.x, sn.y);
      gctx.lineTo(mouseX, mouseY);
      gctx.stroke();
      gctx.restore();
    }

    edges.forEach(e => {
      const a = nodes[e.a], b = nodes[e.b];
      gctx.beginPath();
      gctx.moveTo(a.x, a.y);
      gctx.lineTo(b.x, b.y);
      gctx.strokeStyle = borderColor;
      gctx.lineWidth = 2;
      gctx.stroke();
    });

    nodes.forEach((n, i) => {
      const isSel    = i === selNode && mode === "edge";
      const isDragN  = n === dragNode;

      ///glow pt nodul selectat
      if (isSel) {
        gctx.beginPath();
        gctx.arc(n.x, n.y, NODE_R + 6, 0, Math.PI * 2);
        gctx.strokeStyle = accentColor;
        gctx.globalAlpha = 0.3;
        gctx.lineWidth = 3;
        gctx.stroke();
        gctx.globalAlpha = 1;
      }

      gctx.beginPath();
      gctx.arc(n.x, n.y, NODE_R, 0, Math.PI * 2);
      gctx.fillStyle   = isSel ? accentColor : (isDragN ? "#f97316" : accentColor);
      gctx.globalAlpha = isDragN ? 0.85 : 1;
      gctx.fill();
      gctx.globalAlpha = 1;
      gctx.strokeStyle = "rgba(0,0,0,0.18)";
      gctx.lineWidth   = 2;
      gctx.stroke();

      gctx.fillStyle    = "#fff";
      gctx.font         = "bold 13px " + (cv("--font") || "sans-serif");
      gctx.textAlign    = "center";
      gctx.textBaseline = "middle";
      gctx.fillText(n.label, n.x, n.y);
    });
  }

  function drawTree(hlEdgesSet, hlNodesSet) {
    tctx.clearRect(0, 0, W, H);
    const hasHL = !!hlEdgesSet;
    const dimC  = cv("--border");

    edges.forEach(e => {
      const a = nodes[e.a], b = nodes[e.b];
      const key1 = e.a + "," + e.b, key2 = e.b + "," + e.a;
      const isHL = hasHL && (hlEdgesSet.has(key1) || hlEdgesSet.has(key2));
      tctx.beginPath();
      tctx.moveTo(a.x, a.y);
      tctx.lineTo(b.x, b.y);
      tctx.strokeStyle = hasHL ? (isHL ? "#1D9E75" : dimC) : dimC;
      tctx.lineWidth   = isHL ? 3.5 : 1.5;
      tctx.globalAlpha = hasHL && !isHL ? 0.35 : 1;
      tctx.stroke();
      tctx.globalAlpha = 1;
    });

    nodes.forEach((n, i) => {
      const isHL = hlNodesSet && hlNodesSet.has(i);
      const fill = hasHL ? (isHL ? "#1D9E75" : dimC) : cv("--accent");
      tctx.beginPath();
      tctx.arc(n.x, n.y, NODE_R, 0, Math.PI * 2);
      tctx.fillStyle   = fill;
      tctx.globalAlpha = hasHL && !isHL ? 0.3 : 1;
      tctx.fill();
      tctx.globalAlpha = 1;
      tctx.strokeStyle = isHL ? "#0F6E56" : "rgba(0,0,0,0.18)";
      tctx.lineWidth   = 2;
      tctx.stroke();

      tctx.fillStyle    = "#fff";
      tctx.globalAlpha = hasHL && !isHL ? 0.4 : 1;
      tctx.font         = "bold 13px " + (cv("--font") || "sans-serif");
      tctx.textAlign    = "center";
      tctx.textBaseline = "middle";
      tctx.fillText(n.label, n.x, n.y);
      tctx.globalAlpha = 1;
    });
  }

  function loop() {
    physicsStep();
    drawMain();
    ///keep tree canvas in sync with node positions
    if (document.getElementById("cbm2-tree-section").classList.contains("show") && trees.length > 0) {
      const t = trees[treeIdx];
      const hlEdges = new Set(), hlNodes = new Set();
      t.forEach(ei => {
        const e = edges[ei];
        hlEdges.add(e.a + "," + e.b); hlEdges.add(e.b + "," + e.a);
        hlNodes.add(e.a); hlNodes.add(e.b);
      });
      drawTree(hlEdges, hlNodes);
    }
    rafId = requestAnimationFrame(loop);
  }

  function canvasXY(ev) {
    const r = gc.getBoundingClientRect();
    return [(ev.clientX - r.left) * (W / r.width),
            (ev.clientY - r.top)  * (H / r.height)];
  }

  function hitNode(x, y) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if ((n.x - x) ** 2 + (n.y - y) ** 2 <= (NODE_R + 4) ** 2) return i;
    }
    return -1;
  }

  function hitEdge(x, y) {
    for (let i = edges.length - 1; i >= 0; i--) {
      const e = edges[i], a = nodes[e.a], b = nodes[e.b];
      const dx = b.x - a.x, dy = b.y - a.y, len2 = dx * dx + dy * dy;
      if (len2 < 1) continue;
      const t  = Math.max(0, Math.min(1, ((x - a.x) * dx + (y - a.y) * dy) / len2));
      const px = a.x + t * dx - x, py = a.y + t * dy - y;
      if (px * px + py * py < 64) return i;
    }
    return -1;
  }

  gc.addEventListener("mousemove", ev => {
    [mouseX, mouseY] = canvasXY(ev);
    if (dragNode) {
      dragNode.x  = mouseX + dragOffX;
      dragNode.y  = mouseY + dragOffY;
      dragNode.vx = 0;
      dragNode.vy = 0;
      isDragging = true;
    }
  });

  gc.addEventListener("mousedown", ev => {
    if (ev.button !== 0) return;
    const [x, y] = canvasXY(ev);
    mouseDownNode = hitNode(x, y);
    isDragging = false;

    if (mode === "node") return;

    if (mode !== "edge" && mouseDownNode >= 0) {
      ///start drag la noduri oricare ar fi modul selectat (lasam drag si pt stergere)
      dragNode = nodes[mouseDownNode];
      dragOffX = dragNode.x - x;
      dragOffY = dragNode.y - y;
    }
    if (mode === "edge" && mouseDownNode >= 0) {
      dragNode = nodes[mouseDownNode];
      dragOffX = dragNode.x - x;
      dragOffY = dragNode.y - y;
    }
  });

  gc.addEventListener("mouseup", ev => {
    const [x, y] = canvasXY(ev);
    const wasDrag = isDragging;
    dragNode  = null;
    isDragging = false;

    if (wasDrag) return;  ///nu e click

    const hi = hitNode(x, y);

    if (mode === "node") {
      if (hi < 0) {
        nodes.push({ x, y, vx: 0, vy: 0, fx: 0, fy: 0, label: String(nodes.length + 1) });
        recalc();
      }
      return;
    }

    if (mode === "edge") {
      if (hi < 0) {
        ///cancel cand e pe empty space
        selNode = null;
        return;
      }
      if (selNode === null) {
        selNode = hi;
        return;
      }
      if (selNode !== hi) {
        const exists = edges.some(e =>
          (e.a === selNode && e.b === hi) || (e.a === hi && e.b === selNode)
        );
        if (!exists) edges.push({ a: selNode, b: hi });
        selNode = null;
        recalc();
      }
      return;
    }

    if (mode === "del") {
      if (hi >= 0) {
        edges = edges
          .filter(e => e.a !== hi && e.b !== hi)
          .map(e => ({ a: e.a > hi ? e.a - 1 : e.a, b: e.b > hi ? e.b - 1 : e.b }));
        nodes.splice(hi, 1);
        nodes.forEach((n, i) => (n.label = String(i + 1)));
        recalc(); return;
      }
      const ei = hitEdge(x, y);
      if (ei >= 0) { edges.splice(ei, 1); recalc(); }
    }
  });

  gc.addEventListener("mouseleave", () => {
    if (dragNode) { dragNode = null; isDragging = false; }
  });

  gc.addEventListener("mousemove", ev => {
    const [x, y] = canvasXY(ev);
    const hi = hitNode(x, y);
    if (mode === "del")
      gc.style.cursor = hi >= 0 || hitEdge(x, y) >= 0 ? "pointer" : "crosshair";
    else if (mode === "edge")
      gc.style.cursor = hi >= 0 ? "pointer" : "crosshair";
    else
      gc.style.cursor = hi >= 0 ? "grab" : "crosshair";
  });

  function setMode(m) {
    mode = m; selNode = null; dragNode = null;
    ["node", "edge", "del"].forEach(id =>
      document.getElementById("cbm2-btn-" + id).classList.toggle("active", id === m)
    );
  }
  document.getElementById("cbm2-btn-node").onclick = () => setMode("node");
  document.getElementById("cbm2-btn-edge").onclick = () => setMode("edge");
  document.getElementById("cbm2-btn-del").onclick  = () => setMode("del");
  document.getElementById("cbm2-btn-clear").onclick = () => {
    nodes = []; edges = []; selNode = null; dragNode = null;
    recalc();
  };

  function makeNode(x, y, i) {
    return { x, y, vx: 0, vy: 0, fx: 0, fy: 0, label: String(i + 1) };
  }

  function loadExample(name) {
    stopAnim();
    if (name === "k4") {
      nodes = [
        makeNode(230, 90,  0), makeNode(430, 90,  1),
        makeNode(430, 230, 2), makeNode(230, 230, 3)
      ];
      edges = [];
      for (let i = 0; i < 4; i++)
        for (let j = i + 1; j < 4; j++)
          edges.push({ a: i, b: j });
    } else {
      const cx = 330, cy = 160, r = 110;
      nodes = Array.from({ length: 5 }, (_, i) => {
        const a = -Math.PI / 2 + i * (2 * Math.PI / 5);
        return makeNode(Math.round(cx + r * Math.cos(a)), Math.round(cy + r * Math.sin(a)), i);
      });
      edges = Array.from({ length: 5 }, (_, i) => ({ a: i, b: (i + 1) % 5 }));
    }
    recalc();
  }
  document.getElementById("cbm2-btn-ex1").onclick = () => loadExample("k4");
  document.getElementById("cbm2-btn-ex2").onclick = () => loadExample("c5");

  function buildLaplacian() {
    const n = nodes.length;
    const L = Array.from({ length: n }, () => Array(n).fill(0));
    edges.forEach(e => {
      L[e.a][e.b]--; L[e.b][e.a]--;
      L[e.a][e.a]++; L[e.b][e.b]++;
    });
    return L;
  }

  function det(M) {
    const n = M.length;
    if (n === 1) return M[0][0];
    if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];
    let d = 0;
    for (let j = 0; j < n; j++) {
      const sub = M.slice(1).map(r => r.filter((_, c) => c !== j));
      d += M[0][j] * (j % 2 === 0 ? 1 : -1) * det(sub);
    }
    return d;
  }

  function cofactor(L) {
    const n = L.length;
    if (n <= 1) return 1;
    return Math.round(det(L.slice(1).map(r => r.slice(1))));
  }

  function isConnected() {
    if (nodes.length === 0) return false;
    const vis = new Set([0]), q = [0];
    const adj = Array.from({ length: nodes.length }, () => []);
    edges.forEach(e => { adj[e.a].push(e.b); adj[e.b].push(e.a); });
    while (q.length) {
      const u = q.shift();
      for (const v of adj[u]) if (!vis.has(v)) { vis.add(v); q.push(v); }
    }
    return vis.size === nodes.length;
  }

  function enumTrees() {
    const n = nodes.length, m = edges.length;
    if (n < 2) return [];
    const MAX = 500, res = [];
    function find(uf, x) { return uf[x] === x ? x : (uf[x] = find(uf, uf[x])); }
    function dfs(start, chosen) {
      if (res.length >= MAX) return;
      if (chosen.length === n - 1) { res.push([...chosen]); return; }
      for (let i = start; i < m; i++) {
        const uf = Array.from({ length: n }, (_, j) => j);
        chosen.push(i);
        let ok = true;
        for (const ei of chosen) {
          const e = edges[ei];
          const ra = find(uf, e.a), rb = find(uf, e.b);
          if (ra === rb) { ok = false; break; }
          uf[ra] = rb;
        }
        if (ok) dfs(i + 1, chosen);
        chosen.pop();
      }
    }
    dfs(0, []);
    return res;
  }

  function renderLaplacian(L) {
    const wrap = document.getElementById("cbm2-lap-wrap");
    const n = L.length;
    if (n === 0) { wrap.innerHTML = ""; return; }
    let html = `<div class="cbm2-lap-label">Matricea Laplaciană L</div>
<table class="cbm2-lap-table">`;
    for (let i = 0; i < n; i++) {
      html += "<tr>";
      for (let j = 0; j < n; j++) {
        const cls = i === j ? "diag" : (L[i][j] < 0 ? "neg" : "");
        html += `<td class="${cls}">${L[i][j]}</td>`;
      }
      html += "</tr>";
    }
    html += "</table>";
    wrap.innerHTML = html;
  }

  function recalc() {
    stopAnim();
    const n = nodes.length, m = edges.length;
    document.getElementById("cbm2-s-nodes").textContent = n;
    document.getElementById("cbm2-s-edges").textContent = m;
    document.getElementById("cbm2-tree-section").classList.remove("show");
    document.getElementById("cbm2-no-trees").style.display = "none";

    if (n < 2 || m === 0 || !isConnected()) {
      document.getElementById("cbm2-s-trees").textContent = "—";
      document.getElementById("cbm2-s-det").textContent   = "—";
      renderLaplacian(n > 0 ? buildLaplacian() : []);
      if (n >= 2 && m > 0)
        document.getElementById("cbm2-no-trees").style.display = "block";
      return;
    }

    const L   = buildLaplacian();
    renderLaplacian(L);
    const cof = cofactor(L);
    document.getElementById("cbm2-s-trees").textContent = cof;
    document.getElementById("cbm2-s-det").textContent   = cof;

    trees   = enumTrees();
    treeIdx = 0;
    if (trees.length > 0) {
      document.getElementById("cbm2-tree-section").classList.add("show");
      updateNav();
    }
  }

  function updateNav() {
    document.getElementById("cbm2-tree-counter").textContent =
      `Arborele ${treeIdx + 1} / ${trees.length}`;
    document.getElementById("cbm2-btn-prev").disabled = treeIdx === 0;
    document.getElementById("cbm2-btn-next").disabled = treeIdx === trees.length - 1;
  }

  document.getElementById("cbm2-btn-prev").onclick = () => {
    if (treeIdx > 0) { treeIdx--; updateNav(); }
  };
  document.getElementById("cbm2-btn-next").onclick = () => {
    if (treeIdx < trees.length - 1) { treeIdx++; updateNav(); }
  };

  function stopAnim() {
    if (animTimer) { clearTimeout(animTimer); animTimer = null; }
    animRunning = false;
    document.getElementById("cbm2-btn-anim").textContent = "▶ Animație";
    if (trees.length > 0) updateNav();
  }

  document.getElementById("cbm2-btn-anim").onclick = () => {
    if (animRunning) { stopAnim(); return; }
    animRunning = true;
    document.getElementById("cbm2-btn-anim").textContent = "⏸ Stop";
    document.getElementById("cbm2-btn-prev").disabled = true;
    document.getElementById("cbm2-btn-next").disabled = true;
    let i = treeIdx;
    function step() {
      treeIdx = i;
      document.getElementById("cbm2-tree-counter").textContent =
        `Arborele ${treeIdx + 1} / ${trees.length}`;
      document.getElementById("cbm2-btn-prev").disabled = true;
      document.getElementById("cbm2-btn-next").disabled = true;
      i = (i + 1) % trees.length;
      const raw = parseInt(document.getElementById("cbm2-speed").value, 10);
      const ms  = 2200 - raw;
      animTimer = setTimeout(step, ms);
    }
    step();
  };

  recalc();
  loadExample("k4");
  loop();
})();