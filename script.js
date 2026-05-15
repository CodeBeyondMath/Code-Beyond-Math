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
