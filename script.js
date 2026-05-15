///toggle la teme
const html   = document.documentElement;
const toggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('cbm-theme') || 'light';
html.setAttribute('data-theme', savedTheme);

toggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('cbm-theme', next);
  applyThreeColors(next);
});

///anul (pt footer)
document.getElementById('year').textContent = new Date().getFullYear();

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const card = entry.target;
      setTimeout(() => card.classList.add('visible'), i * 80);
      cardObserver.unobserve(card);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.theme-card').forEach(card => cardObserver.observe(card));

///three.js network (pt particule)
const canvas   = document.getElementById('bg-canvas');
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 14;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

///datele particulelor
const N      = 80;
const SPREAD = 24;

const rawPos = new Float32Array(N * 3);
const vel    = new Float32Array(N * 3);

for (let i = 0; i < N; i++) {
  rawPos[i * 3]     = (Math.random() - 0.5) * SPREAD;
  rawPos[i * 3 + 1] = (Math.random() - 0.5) * SPREAD * 0.55;
  rawPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
  vel[i * 3]        = (Math.random() - 0.5) * 0.007;
  vel[i * 3 + 1]    = (Math.random() - 0.5) * 0.007;
}

///geometria punctelor
const ptGeo  = new THREE.BufferGeometry();
const ptAttr = new THREE.BufferAttribute(rawPos.slice(), 3);
ptGeo.setAttribute('position', ptAttr);

const ptMat = new THREE.PointsMaterial({
  size: 0.1,
  color: 0x6366f1,
  transparent: true,
  opacity: 0.65,
  sizeAttenuation: true,
});
scene.add(new THREE.Points(ptGeo, ptMat));

const MAX_SEGS  = (N * (N - 1)) / 2;
const lineArr   = new Float32Array(MAX_SEGS * 6);
const lineGeo   = new THREE.BufferGeometry();
const lineAttr  = new THREE.BufferAttribute(lineArr, 3);
lineGeo.setAttribute('position', lineAttr);

const lineMat = new THREE.LineBasicMaterial({
  color: 0x6366f1,
  transparent: true,
  opacity: 0.12,
});
scene.add(new THREE.LineSegments(lineGeo, lineMat));

const DIST_SQ = 5 * 5;

function applyThreeColors(theme) {
  const col = theme === 'dark' ? 0x818cf8 : 0x6366f1;
  ptMat.color.setHex(col);
  lineMat.color.setHex(col);
  ptMat.opacity   = theme === 'dark' ? 0.75 : 0.65;
  lineMat.opacity = theme === 'dark' ? 0.18 : 0.12;
}

///aplica culorile imediat bazat pe tema (light/dark mode) salvata
applyThreeColors(savedTheme);

///animatie - loop
function animate() {
  requestAnimationFrame(animate);

  const pos  = ptAttr.array;
  const halfX = SPREAD / 2;
  const halfY = SPREAD * 0.275;

  for (let i = 0; i < N; i++) {
    pos[i * 3]     += vel[i * 3];
    pos[i * 3 + 1] += vel[i * 3 + 1];

    if (pos[i * 3]     >  halfX) pos[i * 3]     = -halfX;
    if (pos[i * 3]     < -halfX) pos[i * 3]     =  halfX;
    if (pos[i * 3 + 1] >  halfY) pos[i * 3 + 1] = -halfY;
    if (pos[i * 3 + 1] < -halfY) pos[i * 3 + 1] =  halfY;
  }
  ptAttr.needsUpdate = true;

  ///reconstruieste liniile de conexiune
  let idx = 0;
  const la = lineAttr.array;

  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const dx = pos[i * 3]     - pos[j * 3];
      const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
      const dz = pos[i * 3 + 2] - pos[j * 3 + 2];

      if (dx * dx + dy * dy + dz * dz < DIST_SQ) {
        la[idx++] = pos[i * 3];     la[idx++] = pos[i * 3 + 1]; la[idx++] = pos[i * 3 + 2];
        la[idx++] = pos[j * 3];     la[idx++] = pos[j * 3 + 1]; la[idx++] = pos[j * 3 + 2];
      }
    }
  }

  lineGeo.setDrawRange(0, idx / 3);
  lineAttr.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();

///redimensioneaza handler
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

marked.setOptions({
  gfm: true,
  breaks: true
});

///incarca fisierele .md
function loadMarkdown(file, elementId) {
  return fetch(file)
    .then(r => r.text())
    .then(text => {
      const el = document.getElementById(elementId);
      const mathStore = [];
      const protect = (match) => {
        const id = mathStore.length;
        mathStore.push(match);
        return `%%MATH_${id}%%`;
      };
      text = text.replace(/\$\$([\s\S]*?)\$\$/g, protect);
      text = text.replace(/\$(?!\$)((?:[^$\\]|\\[\s\S])+?)\$(?!\$)/g, protect);
      let html = marked.parse(text);
      html = html.replace(/%%MATH_(\d+)%%/g, (_, i) => mathStore[+i]);
      el.innerHTML = html;

      renderMathInElement(el, {
        delimiters: [
          { left: "$$", right: "$$", display: true  },
          { left: "$",  right: "$",  display: false }
        ],
        throwOnError: false
      });
    });
}

loadMarkdown('md/tema1.md', 'theme1-body').then(() => {
  const se = document.createElement('script');
  se.src = 'tema1-example-widget.js';
  se.onload = () => {
    const s = document.createElement('script');
    s.src = 'tema1-widget.js';
    document.body.appendChild(s);
  };
  document.body.appendChild(se);
});

loadMarkdown('md/tema2.md', 'theme2-body').then(() => {
  const sp = document.createElement('script');
  sp.src = 'tema2-calc-widget.js';
  sp.onload = () => {
    const s = document.createElement('script');
    s.src = 'tema2-widget.js';
    document.body.appendChild(s);
  };
  document.body.appendChild(sp);
});

loadMarkdown('md/tema3.md', 'theme3-body').then(() => {
  const s = document.createElement('script');
  s.src = 'tema3-widget.js';
  document.body.appendChild(s);
});

loadMarkdown('md/tema4.md', 'theme4-body').then(() => {
  const s = document.createElement('script');
  s.src = 'tema4-widget.js';
  document.body.appendChild(s);
});

loadMarkdown('md/tema5.md', 'theme5-body').then(() => {
  const s = document.createElement('script');
  s.src = 'tema5-widget.js';
  document.body.appendChild(s);
});

loadMarkdown('md/tema6.md', 'theme6-body').then(() => {
  const s = document.createElement('script');
  s.src = 'tema6-widget.js'
  document.body.appendChild(s);
});

///lightbox pt imagini din markdown (.md)
(function () {
  ///creeaza overlay-ul o singura data
  const overlay = document.createElement('div');
  overlay.id = 'lightbox-overlay';
  Object.assign(overlay.style, {
    display:         'none',
    position:        'fixed',
    inset:           '0',
    background:      'rgba(0, 0, 0, 0.85)',
    zIndex:          '9999',
    cursor:          'zoom-out',
    alignItems:      'center',
    justifyContent:  'center',
    backdropFilter:  'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    transition:      'opacity 0.25s ease',
    opacity:         '0',
  });

  const img = document.createElement('img');
  Object.assign(img.style, {
    maxWidth:      '90vw',
    maxHeight:     '90vh',
    borderRadius:  '10px',
    boxShadow:     '0 24px 80px rgba(0,0,0,0.6)',
    transform:     'scale(0.92)',
    transition:    'transform 0.25s ease',
    pointerEvents: 'none',
    userSelect:    'none',
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  Object.assign(closeBtn.style, {
    position:   'fixed',
    top:        '20px',
    right:      '24px',
    background: 'none',
    border:     'none',
    color:      '#fff',
    fontSize:   '1.6rem',
    cursor:     'pointer',
    lineHeight: '1',
    opacity:    '0.7',
    transition: 'opacity 0.15s',
    zIndex:     '10000',
  });
  closeBtn.onmouseenter = () => closeBtn.style.opacity = '1';
  closeBtn.onmouseleave = () => closeBtn.style.opacity = '0.7';

  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  function openLightbox(src, alt) {
    img.src = src;
    img.alt = alt || '';
    overlay.style.display = 'flex';
    ///mica intarziere pt animatie
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      img.style.transform   = 'scale(1)';
    });
  }

  function closeLightbox() {
    overlay.style.opacity = '0';
    img.style.transform   = 'scale(0.92)';
    setTimeout(() => { overlay.style.display = 'none'; }, 250);
  }

  overlay.addEventListener('click', closeLightbox);
  closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  ///"ascultă" click-uri pe imagini din markdown (delegare pe document)
  document.addEventListener('click', function (e) {
    const target = e.target;
    if (
      target.tagName === 'IMG' &&
      target.closest('.markdown-body')
    ) {
      e.preventDefault();
      openLightbox(target.src, target.alt);
    }
  });

  ///aplica cursor pointer pe toate imaginile din markdown (inclusiv cele incarcate dinamic, via MutationObserver)
  function styleMarkdownImages(root) {
    root.querySelectorAll('.markdown-body img').forEach(el => {
      el.style.cursor = 'zoom-in';
    });
  }

  styleMarkdownImages(document);
  new MutationObserver(() => styleMarkdownImages(document))
    .observe(document.body, { childList: true, subtree: true });
})();

(function () {
  'use strict';

  const s = document.createElement('style');
  s.textContent = `

/* ── 1. Progress bar ── */
#cbm-progress {
  position: fixed;
  top: 0; left: 0;
  height: 3px;
  width: 0%;
  background: linear-gradient(90deg, #6c63ff, #a78bfa, #6c63ff);
  background-size: 200% 100%;
  animation: progressShimmer 2s linear infinite;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.3s, width 0.08s linear;
  border-radius: 0 2px 2px 0;
  pointer-events: none;
}
#cbm-progress.visible { opacity: 1; }
@keyframes progressShimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── 2. Scroll reveal ── */
.cbm-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.65s ease, transform 0.65s ease;
}
.cbm-reveal.cbm-revealed {
  opacity: 1;
  transform: translateY(0);
}
.cbm-delay-1 { transition-delay: 0.05s; }
.cbm-delay-2 { transition-delay: 0.12s; }
.cbm-delay-3 { transition-delay: 0.19s; }
.cbm-delay-4 { transition-delay: 0.26s; }
.cbm-delay-5 { transition-delay: 0.33s; }
.cbm-delay-6 { transition-delay: 0.40s; }

/* ── 3. Reading time badge ── */
.cbm-reading-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.76rem;
  font-weight: 500;
  border-radius: 20px;
  padding: 4px 12px;
  margin-top: 10px;
  color: #4a6fa5;
  background: rgba(74, 111, 165, 0.08);
  border: 1px solid rgba(74, 111, 165, 0.18);
}
[data-theme="dark"] .cbm-reading-badge {
  color: #a0b4d8;
  background: rgba(160, 180, 216, 0.08);
  border-color: rgba(160, 180, 216, 0.18);
}

/* ── 4. Page transitions ── */
@keyframes cbmFadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes cbmFadeOut {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-10px); }
}
.cbm-fade-in  { animation: cbmFadeIn  0.3s ease forwards; }
.cbm-fade-out { animation: cbmFadeOut 0.2s ease forwards; }

/* ── 5. Copy code button ── */
.cbm-code-wrap {
  position: relative;
}
.cbm-copy-btn {
  position: absolute;
  top: 10px; right: 10px;
  padding: 4px 11px;
  font-size: 0.72rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  border-radius: 6px;
  border: 1.5px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.07);
  color: #c8d4e8;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background 0.2s, border-color 0.2s, color 0.2s;
  z-index: 3;
  letter-spacing: 0.02em;
}
.cbm-code-wrap:hover .cbm-copy-btn { opacity: 1; }
.cbm-copy-btn:hover {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.35);
}
.cbm-copy-btn.cbm-copied {
  opacity: 1;
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.5);
  background: rgba(74, 222, 128, 0.08);
}

/* ── 6. Table of Contents ── */
#cbm-toc {
  position: fixed;
  top: 50%;
  right: 28px;
  transform: translateY(-50%);
  width: 190px;
  max-height: 68vh;
  overflow-y: auto;
  z-index: 500;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
  scrollbar-width: none;
}
#cbm-toc::-webkit-scrollbar { display: none; }
#cbm-toc.cbm-toc-visible {
  opacity: 1;
  pointer-events: auto;
}
#cbm-toc-label {
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4a6fa5;
  margin: 0 0 10px 12px;
  display: block;
}
[data-theme="dark"] #cbm-toc-label { color: #a0b4d8; }
.cbm-toc-link {
  display: block;
  font-size: 0.74rem;
  color: #888;
  text-decoration: none;
  padding: 4px 8px 4px 12px;
  border-left: 2px solid transparent;
  line-height: 1.4;
  cursor: pointer;
  transition: color 0.18s, border-color 0.18s, padding-left 0.18s;
  border-radius: 0 4px 4px 0;
}
.cbm-toc-link:hover { color: #6c63ff; }
[data-theme="dark"] .cbm-toc-link:hover { color: #a78bfa; }
.cbm-toc-link.cbm-toc-active {
  color: #6c63ff;
  border-left-color: #6c63ff;
  font-weight: 600;
}
[data-theme="dark"] .cbm-toc-link.cbm-toc-active {
  color: #e8c84a;
  border-left-color: #e8c84a;
}
.cbm-toc-h3 {
  padding-left: 22px;
  font-size: 0.69rem;
}
@media (max-width: 1120px) { #cbm-toc { display: none !important; } }

`;
  document.head.appendChild(s);


  ///PROGRESS BAR
  const progressBar = document.createElement('div');
  progressBar.id = 'cbm-progress';
  document.body.prepend(progressBar);

  function updateProgress () {
    const active = document.querySelector('.theme-page.active');
    if (!active) { progressBar.classList.remove('visible'); progressBar.style.width = '0%'; return; }
    progressBar.classList.add('visible');
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });


  ///SCROLL REVEAL
  function initReveal () {
    document.querySelectorAll('.theme-card').forEach(function (el, i) {
      if (el.classList.contains('cbm-reveal')) return;
      el.classList.add('cbm-reveal', 'cbm-delay-' + (i % 6 + 1));
    });
    document.querySelectorAll('.about-inner > *').forEach(function (el, i) {
      if (el.classList.contains('cbm-reveal')) return;
      el.classList.add('cbm-reveal', 'cbm-delay-' + Math.min(i + 1, 6));
    });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('cbm-revealed'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.cbm-reveal').forEach(function (el) { obs.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }


  ///READING TIME
  function addReadingTime (themeEl) {
    var header = themeEl.querySelector('.theme-page-header');
    var body   = themeEl.querySelector('.theme-page-body');
    if (!header || !body || header.querySelector('.cbm-reading-badge')) return;
    var words = (body.innerText || body.textContent || '').trim().split(/\s+/).length;
    var mins  = Math.max(1, Math.round(words / 200));
    var badge = document.createElement('div');
    badge.className = 'cbm-reading-badge';
    badge.innerHTML =
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">' +
        '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>' +
      '</svg>' +
      '&nbsp;~' + mins + ' min citire';
    header.appendChild(badge);
  }


  ///PAGE TRANSITIONS  (patch showTheme / showMain)
  var _origShowTheme = window.showTheme;
  var _origShowMain  = window.showMain;

  function fadeIn (el) {
    el.classList.remove('cbm-fade-in');
    void el.offsetWidth; // reflow
    el.classList.add('cbm-fade-in');
    el.addEventListener('animationend', function h () {
      el.removeEventListener('animationend', h);
      el.classList.remove('cbm-fade-in');
    });
  }

  function fadeOutThen (el, cb) {
    el.classList.remove('cbm-fade-out');
    void el.offsetWidth;
    el.classList.add('cbm-fade-out');
    el.addEventListener('animationend', function h () {
      el.removeEventListener('animationend', h);
      el.classList.remove('cbm-fade-out');
      cb();
    });
  }

  window.showTheme = function (id) {
    var current = document.querySelector('.theme-page.active') || document.getElementById('main-view');
    var proceed = function () {
      _origShowTheme(id);
      var next = document.getElementById(id);
      if (next) { fadeIn(next); }
      updateProgress();
      ///reading time + TOC dupa renderul de markdown
      setTimeout(function () {
        if (next) { addReadingTime(next); buildTOC(next); addCopyButtons(next); }
      }, 350);
    };
    if (current && !current.classList.contains('hidden') &&
        !(current.id === 'main-view' && current.classList.contains('hidden'))) {
      fadeOutThen(current, proceed);
    } else {
      proceed();
    }
  };

  window.showMain = function () {
    var current = document.querySelector('.theme-page.active');
    hideTOC();
    var proceed = function () {
      _origShowMain();
      var mv = document.getElementById('main-view');
      if (mv) fadeIn(mv);
      updateProgress();
    };
    if (current) { fadeOutThen(current, proceed); } else { proceed(); }
  };


  ///COPY CODE BTN
  function addCopyButtons (container) {
    container.querySelectorAll('pre').forEach(function (pre) {
      if (pre.parentElement && pre.parentElement.classList.contains('cbm-code-wrap')) return;
      var wrap = document.createElement('div');
      wrap.className = 'cbm-code-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      var btn = document.createElement('button');
      btn.className = 'cbm-copy-btn';
      btn.textContent = 'Copiază';
      wrap.appendChild(btn);

      btn.addEventListener('click', function () {
        var code = pre.querySelector('code') || pre;
        var text = code.innerText || code.textContent || '';
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = '✓ Copiat!';
          btn.classList.add('cbm-copied');
          setTimeout(function () {
            btn.textContent = 'Copiază';
            btn.classList.remove('cbm-copied');
          }, 2200);
        }).catch(function () {
          btn.textContent = 'Eroare';
          setTimeout(function () { btn.textContent = 'Copiază'; }, 1500);
        });
      });
    });
  }


  ///TABLE OF CONTENTS
  var tocPanel = document.createElement('div');
  tocPanel.id = 'cbm-toc';
  document.body.appendChild(tocPanel);
  var tocObserver = null;

  function hideTOC () {
    tocPanel.classList.remove('cbm-toc-visible');
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    setTimeout(function () { tocPanel.innerHTML = ''; }, 300);
  }

  function buildTOC (themeEl) {
    hideTOC();
    var body = themeEl.querySelector('.theme-page-body');
    if (!body) return;
    var headings = body.querySelectorAll('h2, h3');
    if (headings.length < 3) return;

    ///asignare id-uri
    headings.forEach(function (h, i) {
      if (!h.id) h.id = 'cbm-h-' + i;
    });

    tocPanel.innerHTML = '<span id="cbm-toc-label">Cuprins</span>';
    var links = [];

    headings.forEach(function (h) {
      var a = document.createElement('a');
      a.className = 'cbm-toc-link' + (h.tagName === 'H3' ? ' cbm-toc-h3' : '');
      a.textContent = h.textContent.replace(/^#+\s*/, '');
      a.addEventListener('click', function () {
        h.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      tocPanel.appendChild(a);
      links.push({ a: a, h: h });
    });

    ///delay mic a.i. panel-ul nu e gol la inceput
    requestAnimationFrame(function () {
      tocPanel.classList.add('cbm-toc-visible');
    });

    ///highlight la heading activ
    tocObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.a.classList.remove('cbm-toc-active'); });
          var match = links.find(function (l) { return l.h === entry.target; });
          if (match) match.a.classList.add('cbm-toc-active');
        }
      });
    }, { rootMargin: '-8% 0px -80% 0px', threshold: 0 });

    headings.forEach(function (h) { tocObserver.observe(h); });
  }


  ///MutationObserver — prinde conținutul markdown când e randat
  var mdObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (node) {
        if (node.nodeType !== 1) return;
        var body = node.closest ? node.closest('.theme-page-body') : null;
        if (body) {
          addCopyButtons(body);
          var themeEl = body.closest('.theme-page');
          if (themeEl && themeEl.classList.contains('active')) {
            addReadingTime(themeEl);
            buildTOC(themeEl);
          }
        }
      });
    });
  });
  mdObserver.observe(document.body, { childList: true, subtree: true });

})();
