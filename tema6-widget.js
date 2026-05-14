///Conway's Game of Life — minimal
(function () {
  'use strict';

  const mk = (x,y) => x+','+y;
  const pk = k => { const i=k.indexOf(','); return [+k.slice(0,i),+k.slice(i+1)]; };
  let cells = new Set(), gen = 0, running = false, loopId = null;

  function step() {
    const cnt = new Map();
    for (const k of cells) {
      const [x,y] = pk(k);
      for (let dx=-1;dx<=1;dx++) for (let dy=-1;dy<=1;dy++) {
        if (!dx&&!dy) continue;
        const nk=mk(x+dx,y+dy); cnt.set(nk,(cnt.get(nk)||0)+1);
      }
    }
    const next = new Set();
    for (const [k,c] of cnt) if (c===3||(c===2&&cells.has(k))) next.add(k);
    cells=next; gen++;
  }

  ///dom
  const wrap = document.createElement('div');
  wrap.style.cssText='margin-top:3.5rem;border-top:2px solid var(--accent);padding-top:2rem';
  wrap.innerHTML=`
<div style="display:flex;gap:.4rem;align-items:center;margin-bottom:.4rem;flex-wrap:wrap">
  <button id="gc-p" style="padding:.32rem .75rem;border-radius:6px;border:1px solid #333;background:#111;color:#eee;font-size:.8rem;font-weight:600;cursor:pointer">▶ Play</button>
  <button id="gc-s" style="padding:.32rem .75rem;border-radius:6px;border:1px solid #333;background:#111;color:#eee;font-size:.8rem;cursor:pointer">⏭</button>
  <button id="gc-c" style="padding:.32rem .75rem;border-radius:6px;border:1px solid #333;background:#111;color:#eee;font-size:.8rem;cursor:pointer">✕</button>
  <input id="gc-sp" type="range" min="1" max="30" value="10" style="width:70px;accent-color:#818cf8">
  <span id="gc-i" style="font-size:.75rem;color:#555;font-family:monospace;margin-left:auto">gen 0 · pop 0</span>
</div>
<canvas id="gc-cv" style="display:block;width:100%;border-radius:8px;border:1px solid #111;cursor:crosshair;touch-action:none"></canvas>`;
  document.getElementById('theme6-body')?.appendChild(wrap);

  const cv=document.getElementById('gc-cv'), ctx=cv.getContext('2d');
  const dpr=Math.min(devicePixelRatio||1,2);
  let W=0,H=0,ox=0,oy=0,sc=16;
  const info=()=>{ document.getElementById('gc-i').textContent=`gen ${gen} · pop ${cells.size}`; };

  new ResizeObserver(()=>{
    W=cv.clientWidth||600; H=Math.round(W*0.55);
    cv.height=H; cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
    if(!ox&&!oy){ox=W/2;oy=H/2;} draw();
  }).observe(cv);

  function draw() {
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H);
    if(sc>=8){
      ctx.strokeStyle='rgba(255,255,255,.06)'; ctx.lineWidth=.5;
      const x0=(((-ox%sc)+sc)%sc), y0=(((-oy%sc)+sc)%sc);
      ctx.beginPath();
      for(let x=x0;x<=W;x+=sc){ctx.moveTo(x,0);ctx.lineTo(x,H);}
      for(let y=y0;y<=H;y+=sc){ctx.moveTo(0,y);ctx.lineTo(W,y);}
      ctx.stroke();
    }
    ctx.fillStyle='#fff';
    const x0=Math.floor(-ox/sc)-1, x1=Math.ceil((W-ox)/sc)+1;
    const y0=Math.floor(-oy/sc)-1, y1=Math.ceil((H-oy)/sc)+1;
    for(const k of cells){
      const [x,y]=pk(k);
      if(x<x0||x>x1||y<y0||y>y1) continue;
      ctx.fillRect(Math.floor(ox+x*sc)+.5,Math.floor(oy+y*sc)+.5,sc-1,sc-1);
    }
  }

  function setRun(r){
    running=r; clearInterval(loopId);
    if(r) loopId=setInterval(()=>{step();info();draw();},Math.max(16,1000/+document.getElementById('gc-sp').value));
    document.getElementById('gc-p').textContent=r?'⏸ Pauză':'▶ Play';
  }

  ///mouse
  let drag=false,dist=0,mx=0,my=0;
  const cpos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height];};
  const cell=(px,py)=>[Math.floor((px-ox)/sc),Math.floor((py-oy)/sc)];

  cv.addEventListener('mousedown',e=>{e.preventDefault();[mx,my]=cpos(e);dist=0;drag=false;});
  cv.addEventListener('mousemove',e=>{
    const[px,py]=cpos(e);
    if(e.buttons===1){dist+=Math.hypot(px-mx,py-my);if(dist>4){drag=true;ox+=px-mx;oy+=py-my;draw();}mx=px;my=py;}
  });
  cv.addEventListener('mouseup',e=>{
    if(!drag){const[px,py]=cpos(e);const k=mk(...cell(px,py));cells.has(k)?cells.delete(k):cells.add(k);info();draw();}
    drag=false;
  });
  cv.addEventListener('wheel',e=>{
    e.preventDefault();const[px,py]=cpos(e);
    const ns=Math.max(4,Math.min(80,sc*(e.deltaY<0?1.2:1/1.2)));
    ox=px-(px-ox)*(ns/sc);oy=py-(py-oy)*(ns/sc);sc=Math.round(ns);draw();
  },{passive:false});
  cv.addEventListener('contextmenu',e=>e.preventDefault());

  ///touch
  let lt0=0,lt1=0,td=null,tm=false;
  cv.addEventListener('touchstart',e=>{e.preventDefault();tm=false;
    if(e.touches.length===1){const r=cv.getBoundingClientRect();lt0=(e.touches[0].clientX-r.left)*W/r.width;lt1=(e.touches[0].clientY-r.top)*H/r.height;}
    else if(e.touches.length===2){td=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);tm=true;}
  },{passive:false});
  cv.addEventListener('touchmove',e=>{e.preventDefault();const r=cv.getBoundingClientRect();
    if(e.touches.length===1){const px=(e.touches[0].clientX-r.left)*W/r.width,py=(e.touches[0].clientY-r.top)*H/r.height;
      if(Math.hypot(px-lt0,py-lt1)>5)tm=true;ox+=px-lt0;oy+=py-lt1;lt0=px;lt1=py;draw();}
    else if(e.touches.length===2&&td){const nd=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
      const mx=((e.touches[0].clientX+e.touches[1].clientX)/2-r.left)*W/r.width;
      const my=((e.touches[0].clientY+e.touches[1].clientY)/2-r.top)*H/r.height;
      const ns=Math.max(4,Math.min(80,sc*nd/td));ox=mx-(mx-ox)*(ns/sc);oy=my-(my-oy)*(ns/sc);sc=Math.round(ns);td=nd;draw();}
  },{passive:false});
  cv.addEventListener('touchend',e=>{
    if(!tm&&e.touches.length===0){const k=mk(...cell(lt0,lt1));cells.has(k)?cells.delete(k):cells.add(k);info();draw();}
    if(e.touches.length<2)td=null;
  });

  document.getElementById('gc-p').addEventListener('click',()=>setRun(!running));
  document.getElementById('gc-s').addEventListener('click',()=>{if(running)setRun(false);step();info();draw();});
  document.getElementById('gc-c').addEventListener('click',()=>{setRun(false);cells.clear();gen=0;info();draw();});
  document.getElementById('gc-sp').addEventListener('input',()=>{if(running)setRun(true);});

  ///glider initial
  [[1,0],[2,1],[0,2],[1,2],[2,2]].forEach(([x,y])=>cells.add(mk(x,y)));
  info();
})();
