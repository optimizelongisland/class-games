/* Carnival bonus games for the Unit 5 review stations.
   After a correct answer the page calls Carnival.play({ msg, who, total, onDone }).
   A random game (never the same twice in a row) runs in an overlay; onDone(points) returns the new team total. */
(function () {
if (window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {   // older browsers
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r); this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r); this.closePath(); return this; };
}
const CSS = `
.cvn{position:fixed;inset:0;z-index:1000;background:rgba(5,6,15,.82);display:flex;align-items:center;justify-content:center;padding:12px;animation:cvnin .2s}
@keyframes cvnin{from{opacity:0}}
.cvn[hidden]{display:none}
.cvn-box{width:min(920px,100%);display:flex;flex-direction:column;gap:.6rem}
.cvn-top{display:flex;justify-content:space-between;align-items:center;gap:.8rem;flex-wrap:wrap;color:#f2f4ff;font:700 1.05rem 'Fredoka',var(--disp,system-ui),sans-serif}
.cvn-top b{color:#ffd23f}
.cvn-skip{background:none;border:1px solid rgba(255,255,255,.3);color:#c7cbe0;border-radius:999px;padding:.35rem .9rem;cursor:pointer;font:600 .9rem system-ui,sans-serif}
#cvn-stage{position:relative;height:clamp(340px,72vh,560px);border-radius:20px;overflow:hidden;border:2px solid #2a3050;background:#121733;touch-action:none;user-select:none;-webkit-user-select:none;font-family:'Fredoka',var(--disp,system-ui),sans-serif}
#cvn-cv{position:absolute;inset:0;width:100%;height:100%}
#cvn-layer{position:absolute;inset:0;pointer-events:none}
#cvn-hud{position:absolute;top:10px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:center;pointer-events:none;font-weight:700;font-size:1rem;z-index:3;color:#fff}
#cvn-hud span{background:rgba(0,0,0,.5);border-radius:999px;padding:.3rem .8rem}
#cvn-pts{color:#ffd23f}
#cvn-bar{position:absolute;left:0;bottom:0;height:6px;background:#3ff09a;width:0;z-index:3}
#cvn-over{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:.45rem;background:rgba(6,8,18,.74);padding:16px;color:#fff}
#cvn-over[hidden]{display:none}
#cvn-big{font:700 clamp(2rem,1.4rem + 3vw,3.2rem) 'Fredoka',var(--disp,system-ui),sans-serif;color:#3ff09a;margin:0}
#cvn-sub{font:600 1.1rem system-ui,sans-serif;margin:0 0 .3rem;max-width:36ch;line-height:1.45}
#cvn-how{font:500 .98rem system-ui,sans-serif;color:#c7cbe0;margin:0 0 .5rem;max-width:44ch;line-height:1.45}
#cvn-go{font:700 1.25rem 'Fredoka',var(--disp,system-ui),sans-serif;background:#3ff09a;color:#06210f;border:0;border-radius:999px;padding:.75rem 2rem;cursor:pointer;box-shadow:0 6px 0 #1d9a5d}
#cvn-go:active{transform:translateY(3px);box-shadow:0 3px 0 #1d9a5d}
.cvn .float{font-family:'Fredoka',var(--disp,system-ui),sans-serif}

.cvn .bal{position:absolute;left:0;top:0;width:var(--w);padding:0;border:0;background:none;cursor:pointer;pointer-events:auto;will-change:transform}
.cvn .bal svg{display:block;width:100%;height:auto;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35));pointer-events:none}
.cvn .bal.gold svg{filter:drop-shadow(0 0 12px rgba(255,210,63,.9))}
.cvn .bit{position:absolute;width:9px;height:9px;border-radius:2px;pointer-events:none;animation:cvnburst .6s ease-out forwards}
@keyframes cvnburst{to{transform:translate(var(--dx),var(--dy)) rotate(220deg);opacity:0}}
.cvn .float{position:absolute;transform:translate(-50%,-50%);margin:0;font:700 1.6rem 'Fredoka',var(--disp,system-ui),sans-serif;color:#fff;pointer-events:none;animation:cvnup .8s ease-out forwards;text-shadow:0 3px 10px rgba(0,0,0,.6)}
@keyframes cvnup{to{transform:translate(-50%,-150%) scale(1.2);opacity:0}}
`;
const COL = ['#ff5fa2', '#33d6ff', '#ffd23f', '#3ff09a', '#b18cff', '#ff8a3a'];
const GAMES = {
  balloon: { name: 'Balloon Pop', how: 'Tap balloons to pop them. You have 8 seconds. Gold balloons are worth 3 points.' },
  toss: { name: 'Paper Toss', how: 'Drag up and let go to flick the paper ball (on a computer, click and drag up). Aim for the moving bucket. 5 tosses.' },
  ring: { name: 'Ring Toss', how: 'Drag up to aim. The dotted circle shows where the ring will land (it wiggles a little). Let go when it is around a peg. Far pegs are worth more. 5 rings.' },
  cans: { name: 'Can Knockdown', how: 'Tap where you want the bean bag to go. Knock down cans for 1 point each. Hit the bottom row and the cans on top fall too. Clear them all for a 3-point bonus. 5 bean bags.' },
  wheel: { name: 'Spin the Wheel', how: 'The wheel spins fast. Tap STOP and it slows to a stop. Time it to land on the 10. 1 spin.' },
  splat: { name: 'Paint Splat', how: 'Tap a moving target to throw a paint ball at it. 5 paint balls. Smaller targets are worth more.' }
};
let root, stage, cv, ctx, layer, W = 0, H = 0, game = 'balloon', lastG = '', running = false, pts = 0, raf = 0, last = 0, tick = null, opts = {}, phase = '';
const q = id => document.getElementById(id);
function build() {
  if (root) return;
  const fl = document.createElement('link'); fl.rel = 'stylesheet'; fl.href = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&display=swap'; document.head.appendChild(fl);
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  root = document.createElement('div'); root.className = 'cvn'; root.hidden = true;
  root.innerHTML = '<div class="cvn-box" role="dialog" aria-label="Bonus game"><div class="cvn-top"><span id="cvn-title"></span><span id="cvn-team"></span></div>' +
    '<div id="cvn-stage"><canvas id="cvn-cv"></canvas><div id="cvn-layer"></div><div id="cvn-hud"><span id="cvn-st"></span><span id="cvn-pts">+0</span></div><div id="cvn-bar"></div>' +
    '<div id="cvn-over"><p id="cvn-big"></p><p id="cvn-sub"></p><p id="cvn-how"></p><button id="cvn-go" type="button">Play</button></div></div>' +
    '<div style="text-align:right"><button class="cvn-skip" id="cvn-skip" type="button">Skip game</button></div></div>';
  document.body.appendChild(root);
  stage = q('cvn-stage'); cv = q('cvn-cv'); ctx = cv.getContext('2d'); layer = q('cvn-layer');
  q('cvn-go').onclick = () => phase === 'intro' ? start() : close();
  q('cvn-skip').onclick = close;
  wire();
  window.addEventListener('resize', () => { if (!root.hidden) { fit(); if (!running && phase === 'intro') drawIdle(); } });
}
// Shuffle-bag: every game comes up once before any game repeats (kept across page reloads).
function pick() {
  const keys = Object.keys(GAMES); let bag = [];
  try { bag = JSON.parse(localStorage.getItem('cvn-bag') || '[]').filter(g => keys.includes(g)); } catch (e) {}
  if (!bag.length) {
    bag = keys.slice(); for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
    if (bag[0] === lastG) bag.push(bag.shift());
  }
  const g = bag.shift(); lastG = g;
  try { localStorage.setItem('cvn-bag', JSON.stringify(bag)); } catch (e) {}
  return g;
}
// scores: [{ name, pts }] shown at the top, highest first
function board(scores) {
  const el = q('cvn-team'); if (!scores || !scores.length) { el.textContent = ''; return; }
  el.innerHTML = scores.map(x => '<span style="margin-left:.9rem">' + x.name.replace(/[<>&"]/g, '') + ' <b>' + x.pts + '</b></span>').join('');
}
function fit() {
  const r = stage.getBoundingClientRect(); W = r.width; H = r.height;
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(W * d); cv.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0);
}
function hud(st) { q('cvn-st').textContent = GAMES[game].name + ' · ' + st; q('cvn-pts').textContent = '+' + pts; }
function bar(f) { q('cvn-bar').style.width = (Math.max(0, Math.min(1, f)) * 100) + '%'; }
function float(x, y, txt, color) {
  const p = document.createElement('p'); p.className = 'float'; p.textContent = txt;
  p.style.left = x + 'px'; p.style.top = y + 'px'; if (color) p.style.color = color;
  layer.appendChild(p); setTimeout(() => p.remove(), 850);
}
function confetti(x, y, n) {
  for (let k = 0; k < n; k++) {
    const d = document.createElement('i'); d.className = 'bit';
    const a = Math.random() * Math.PI * 2, dist = 30 + Math.random() * 60;
    d.style.cssText = 'left:' + x + 'px;top:' + y + 'px;background:' + COL[k % 6] + ';--dx:' + (Math.cos(a) * dist).toFixed(0) + 'px;--dy:' + (Math.sin(a) * dist).toFixed(0) + 'px';
    layer.appendChild(d); setTimeout(() => d.remove(), 650);
  }
}
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now;
  if (tick) tick(now, dt);
  if (running) raf = requestAnimationFrame(loop);
}
function drawIdle() {
  const now = performance.now(); ctx.clearRect(0, 0, W, H);
  ({ balloon: () => balloonBack(now), toss: () => { tossSetup(); tossDraw(now); }, splat: () => { splatSetup(); splatDraw(now); },
     ring: () => { rtSetup(); ringDraw(now); }, cans: () => { cansSetup(); cansDraw(now); }, wheel: () => { wheelSetup(); wheelDraw(now); } })[game]();
}
function play(o) {
  build(); opts = o || {};
  game = GAMES[opts.game] ? opts.game : pick();
  running = false; tick = null; cancelAnimationFrame(raf); layer.innerHTML = ''; pts = 0; bar(0); phase = 'intro';
  q('cvn-title').textContent = opts.who ? opts.who + '’s turn' : 'Bonus game';
  board(opts.scores);
  q('cvn-big').textContent = opts.msg || 'Correct!';
  q('cvn-sub').textContent = (opts.who ? opts.who + ', your bonus game: ' : 'Bonus game: ') + GAMES[game].name + '!';
  q('cvn-how').textContent = GAMES[game].how;
  q('cvn-go').textContent = 'Play';
  q('cvn-over').hidden = false; q('cvn-skip').hidden = false;
  root.hidden = false; fit(); hud('Get ready'); drawIdle();
  setTimeout(() => q('cvn-go').focus(), 50);
}
function start() {
  phase = 'play'; q('cvn-over').hidden = true; layer.innerHTML = ''; pts = 0; running = true; last = performance.now();
  float(W / 2, H * 0.45, GAMES[game].name + '!', '#3ff09a');
  ({ balloon: balloonStart, toss: tossStart, splat: splatStart, ring: ringStart, cans: cansStart, wheel: wheelStart })[game]();
  cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
}
function finish(msg) {
  running = false; tick = null; bar(0); phase = 'done';
  const got = pts, scores = opts.onDone ? opts.onDone(got) : null;
  board(scores); q('cvn-skip').hidden = true;
  setTimeout(() => {
    const u = opts.unit || 'points', u1 = u === 'tickets' ? 'ticket' : 'point';
    q('cvn-big').textContent = '+' + got + ' ' + (got === 1 ? u1 : u);
    q('cvn-sub').textContent = msg + (opts.team && scores && scores[0] ? ' ' + opts.team + ' now has ' + scores[0].pts + ' ' + (scores[0].pts === 1 ? u1 : u) + '.' :
      opts.who ? ' ' + opts.who + ' now has ' + ((scores || []).find(x => x.name === opts.who) || { pts: got }).pts + ' ' + u + '.' : '');
    q('cvn-how').textContent = '';
    q('cvn-go').textContent = 'Back to the station';
    q('cvn-over').hidden = false; q('cvn-go').focus();
  }, 700);
}
function close() {
  running = false; tick = null; cancelAnimationFrame(raf); phase = '';
  if (root) { root.hidden = true; layer.innerHTML = ''; }
  if (opts.onClose) opts.onClose();
}

/* ---------------- shared carnival backdrop ---------------- */
function booth(now, o) {
  const sw = Math.max(36, W / 14), A = o.a || '#e8455a', B = o.b || '#fff1dc', bottom = o.bottom || H;
  for (let x = 0, i = 0; x < W; x += sw, i++) { ctx.fillStyle = i % 2 ? B : A; ctx.fillRect(x, 0, sw, bottom); }
  ctx.fillStyle = 'rgba(10,10,30,' + (o.dim || 0.42) + ')'; ctx.fillRect(0, 0, W, bottom);
  ctx.fillStyle = '#2f6fd6'; ctx.fillRect(0, 0, W, 34);
  for (let x = 0, i = 0; x < W + sw; x += sw, i++) { ctx.fillStyle = i % 2 ? '#ffd23f' : '#2f6fd6'; ctx.beginPath(); ctx.arc(x + sw / 2, 34, sw / 2, 0, Math.PI); ctx.fill(); }
  const FC = ['#ffd23f', '#3ff09a', '#33d6ff', '#ff8a3a', '#b18cff'], sag = x => 70 + Math.sin(Math.PI * x / W) * 22;
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, sag(0)); for (let x = 0; x <= W; x += 10) ctx.lineTo(x, sag(x)); ctx.stroke();
  for (let i = 0, x = 14; x < W; x += 34, i++) { const y = sag(x), sway = Math.sin(now / 400 + i) * 2; ctx.fillStyle = FC[i % 5]; ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x + 10, y); ctx.lineTo(x + sway, y + 22); ctx.closePath(); ctx.fill(); }
  if (o.sign) {
    const w = Math.min(240, W * 0.5), h = 46, x0 = W / 2 - w / 2, y0 = o.signY || 104;
    ctx.fillStyle = '#7a1f9e'; ctx.beginPath(); ctx.roundRect(x0, y0, w, h, 12); ctx.fill(); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 3; ctx.stroke();
    for (let i = 0; i < 14; i++) { const t = i / 14, on = (Math.floor(now / 180) + i) % 2; ctx.fillStyle = on ? '#fff6b0' : '#a8862a';
      const px = i < 7 ? x0 + 10 + t * 2 * (w - 20) : x0 + 10 + (t - 0.5) * 2 * (w - 20), py = i < 7 ? y0 + 6 : y0 + h - 6; ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#fff'; ctx.font = '700 ' + Math.round(h * 0.48) + 'px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(o.sign, W / 2, y0 + h / 2 + 1); ctx.textBaseline = 'alphabetic';
  }
  if (o.counter) { ctx.fillStyle = '#b5763f'; ctx.fillRect(0, H - 46, W, 46); ctx.fillStyle = '#e8455a'; ctx.fillRect(0, H - 52, W, 8); ctx.fillStyle = 'rgba(0,0,0,.15)'; for (let x = 0; x < W; x += 60) ctx.fillRect(x, H - 44, 2, 44); }
}

/* ---------------- 1. Balloon Pop ---------------- */
function balloonBack(now) { ctx.clearRect(0, 0, W, H); booth(now, { sign: "POP 'EM!", counter: true }); }
const BAL_SVG = '<svg viewBox="0 0 60 90" aria-hidden="true"><path d="M30 2C14 2 4 15 4 30c0 18 15 32 24 36h4c9-4 24-18 24-36C56 15 46 2 30 2z" fill="var(--c)"/><path d="M27 66l3 6 3-6z" fill="var(--c)"/><path d="M30 72c-4 6 4 10 0 17" stroke="#ddd" stroke-width="1.5" fill="none"/><ellipse cx="20" cy="22" rx="5" ry="9" fill="#fff" opacity=".35"/></svg>';
let bals = [], spawnAt = 0, bEnd = 0, bLen = 8000;
function balloonStart() {
  bals = []; const t0 = performance.now(); bEnd = t0 + bLen; spawnAt = t0;
  tick = balloonTick;
}
function spawnBalloon() {
  const w = Math.max(54, Math.min(84, W * 0.09)), gold = Math.random() < 0.14;
  const el = document.createElement('button'); el.type = 'button'; el.className = 'bal' + (gold ? ' gold' : '');
  el.setAttribute('aria-label', 'Pop balloon'); el.style.setProperty('--w', w + 'px');
  el.style.setProperty('--c', gold ? '#ffd23f' : COL[Math.floor(Math.random() * 6) === 2 ? 0 : Math.floor(Math.random() * 6)]);
  el.innerHTML = BAL_SVG;
  const b = { el, w, gold, x: 8 + Math.random() * (W - w - 16), y: H + 10, v: H / (1.9 + Math.random() * 1.3), ph: Math.random() * 6, dead: false };
  el.addEventListener('pointerdown', e => { e.preventDefault(); if (b.dead || !running) return; pop(b); });
  layer.appendChild(el); bals.push(b);
}
function pop(b) {
  b.dead = true; const cx = b.bx + b.w / 2, cy = b.y + b.w * 0.5;
  b.el.remove(); confetti(cx, cy, 14);
  const p = b.gold ? 3 : 1; pts += p; float(cx, cy, '+' + p, b.gold ? '#ffd23f' : '#fff');
}
function balloonTick(now, dt) {
  balloonBack(now);
  if (now >= spawnAt && now < bEnd - 300) { spawnBalloon(); spawnAt = now + 230 + Math.random() * 200; }
  for (const b of bals) {
    if (b.dead) continue;
    b.y -= b.v * dt; b.bx = b.x + Math.sin(now / 450 + b.ph) * 12;
    b.el.style.transform = 'translate(' + b.bx.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px)';
    if (b.y < -b.w * 1.6) { b.dead = true; b.el.remove(); }
  }
  bals = bals.filter(b => !b.dead);
  const left = Math.max(0, bEnd - now);
  hud('Time ' + Math.ceil(left / 1000)); bar(left / bLen);
  if (left <= 0) { bals.forEach(b => b.el.remove()); bals = []; finish(pts ? 'Nice popping!' : 'Too slow this time!'); }
}

/* ---------------- 2. Paper Toss ---------------- */
let toss = {};
function tossSetup() {
  toss = { left: 5, ball: { x: W / 2, y: H - 64, r: Math.max(18, Math.min(26, W * 0.03)) }, fly: null, drag: null, speed: 0.7, t0: performance.now(), trail: [], streak: 0, face: 'idle', faceAt: 0, wob: 0, look: null };
}
function binX(now) { return W / 2 + Math.sin((now - toss.t0) / 1000 * toss.speed) * W * 0.3; }
function binGeo() { const w = Math.max(76, Math.min(120, W * 0.14)); return { w, h: w * 1.05, y: H * 0.26 }; }
function tossLand(d, p) { const g = binGeo(), dy = d.y0 - p.y; return toss.ball.x + (p.x - d.x0) / dy * (toss.ball.y - g.y); }
function tossPath(f, e, g) { return { x: f.sx + (f.lx - f.sx) * e, y: f.sy + (g.y - f.sy) * e - Math.sin(Math.PI * e) * H * 0.22 }; }
function tossStart() { tossSetup(); tick = tossTick; hud('Tosses left 5'); }
function tossTick(now) {
  const f = toss.fly;
  if (f) {
    const e = Math.min(1, (now - f.t) / f.dur);
    if (f.phase === 'up' && e >= 1) {
      const bx = binX(now), g = binGeo(), d = Math.abs(f.lx - bx);
      if (d < g.w * 0.3) {
        pts += 3; f.result = 'in'; toss.streak++; toss.face = 'happy';
        float(bx, g.y - 24, toss.streak >= 2 ? 'ON FIRE! +3' : 'SWISH! +3', toss.streak >= 2 ? '#ff8a3a' : '#3ff09a');
        confetti(bx, g.y, 28); toss.wob = now; toss.wobA = 0.06;
      } else if (d < g.w * 0.58) {
        pts += 1; f.result = 'in'; toss.streak = 0; toss.face = 'happy';
        float(bx, g.y - 24, 'Off the rim... in! +1', '#ffd23f'); toss.wob = now; toss.wobA = 0.16;
      } else {
        f.result = 'miss'; toss.streak = 0; toss.face = 'sad';
        float(f.lx, g.y - 24, 'So close!', '#ff5fa2'); toss.wob = now; toss.wobA = 0.1;
      }
      toss.faceAt = now; toss.trail = [];
      f.phase = 'after'; f.t = now; f.dur = 650; f.binAt = bx;
    } else if (f.phase === 'after' && e >= 1) {
      toss.fly = null; toss.left--; toss.speed += 0.15;
      if (toss.left <= 0) { tossDraw(now); return finish(pts >= 5 ? 'Great shooting!' : pts ? 'Nice toss!' : 'Better luck next time!'); }
    }
  }
  if (toss.face !== 'idle' && toss.face !== 'wow' && now - toss.faceAt > 1100) toss.face = 'idle';
  hud('Tosses left ' + toss.left);
  tossDraw(now);
}
function tossScene(g, now) {
  const fy = g.y + g.h * 0.85, sw = Math.max(36, W / 14);
  // tent stripes
  for (let x = 0, i = 0; x < W; x += sw, i++) { ctx.fillStyle = i % 2 ? '#fff1dc' : '#e8455a'; ctx.fillRect(x, 0, sw, fy); }
  ctx.fillStyle = 'rgba(10,10,30,.3)'; ctx.fillRect(0, 0, W, fy);
  // scalloped valance
  ctx.fillStyle = '#2f6fd6'; ctx.fillRect(0, 0, W, 34);
  for (let x = 0, i = 0; x < W + sw; x += sw, i++) { ctx.fillStyle = i % 2 ? '#ffd23f' : '#2f6fd6'; ctx.beginPath(); ctx.arc(x + sw / 2, 34, sw / 2, 0, Math.PI); ctx.fill(); }
  // bunting flags
  const FC = ['#ffd23f', '#3ff09a', '#33d6ff', '#ff8a3a', '#b18cff'];
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.5; ctx.beginPath();
  const sag = x => 70 + Math.sin(Math.PI * x / W) * 22; ctx.moveTo(0, sag(0)); for (let x = 0; x <= W; x += 10) ctx.lineTo(x, sag(x)); ctx.stroke();
  for (let i = 0, x = 14; x < W; x += 34, i++) { const y = sag(x), sway = Math.sin(now / 400 + i) * 2; ctx.fillStyle = FC[i % 5]; ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x + 10, y); ctx.lineTo(x + sway, y + 22); ctx.closePath(); ctx.fill(); }
  // marquee sign with blinking bulbs
  const sw2 = Math.min(240, W * 0.5), sh = 46, sx = W / 2 - sw2 / 2, sy = Math.min(fy - sh - 20, 104);
  ctx.fillStyle = '#7a1f9e'; ctx.beginPath(); ctx.roundRect(sx, sy, sw2, sh, 12); ctx.fill();
  ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 3; ctx.stroke();
  for (let i = 0; i < 14; i++) { const t = i / 14, on = (Math.floor(now / 180) + i) % 2; ctx.fillStyle = on ? '#fff6b0' : '#a8862a';
    const px = i < 7 ? sx + 10 + t * 2 * (sw2 - 20) : sx + 10 + (t - 0.5) * 2 * (sw2 - 20), py = i < 7 ? sy + 6 : sy + sh - 6; ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#fff'; ctx.font = '700 ' + Math.round(sh * 0.48) + 'px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('TOSS IT!', W / 2, sy + sh / 2 + 1);
  // booth counter floor
  ctx.fillStyle = '#c98a52'; ctx.fillRect(0, fy, W, H - fy);
  ctx.strokeStyle = 'rgba(80,40,15,.35)'; ctx.lineWidth = 1.5;
  for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + i * W * 0.035, fy); ctx.lineTo(W / 2 + i * W * 0.14, H); ctx.stroke(); }
  for (let k = 1; k < 7; k++) { const y = fy + (H - fy) * (k / 7) ** 1.7; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  const sh2 = ctx.createLinearGradient(0, fy, 0, H); sh2.addColorStop(0, 'rgba(0,0,0,.35)'); sh2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sh2; ctx.fillRect(0, fy, W, H - fy);
  ctx.fillStyle = '#e8455a'; ctx.fillRect(0, fy - 8, W, 8);
  ctx.textBaseline = 'alphabetic'; ctx.lineCap = 'butt';
}
function tossDraw(now) {
  ctx.clearRect(0, 0, W, H);
  const g = binGeo(), f = toss.fly;
  tossScene(g, now);
  const bx = f && f.phase === 'after' && f.result === 'in' ? f.binAt : binX(now);
  let ball = null;
  if (f) {
    const e = Math.min(1, (now - f.t) / f.dur);
    if (f.phase === 'up') {
      const q = tossPath(f, e, g); ball = { x: q.x, y: q.y, s: 1 - 0.45 * e, rot: e * 9 };
      toss.trail.push({ x: q.x, y: q.y, s: ball.s }); if (toss.trail.length > 12) toss.trail.shift();
      toss.face = 'wow';
      // shadow on floor
      const sy = f.sy + 12 + (g.y + g.h - f.sy - 12) * e;
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(q.x, sy, toss.ball.r * ball.s, toss.ball.r * ball.s * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    } else if (f.result === 'in') {
      ball = { x: f.binAt, y: g.y + e * g.h * 0.5, s: 0.55, rot: 9, clip: true };
    } else {
      ball = { x: f.lx, y: g.y + e * (H * 0.5), s: 0.55 + e * 0.2, rot: 9 + e * 6 };
    }
  } else if (toss.left > 0) {
    const d = toss.drag;
    ball = { x: toss.ball.x + (d ? (d.x - d.x0) * 0.15 : 0), y: toss.ball.y + (d ? Math.min(0, d.y - d.y0) * 0.1 : 0), s: 1, rot: 0 };
    if (d && d.y0 - d.y >= 25) { // aim dots (first half of the path only)
      const af = { sx: toss.ball.x, sy: toss.ball.y, lx: tossLand(d, d) };
      for (let e = 0.08; e < 0.5; e += 0.07) { const q = tossPath(af, e, g); ctx.fillStyle = 'rgba(255,255,255,' + (0.8 - e) + ')'; ctx.beginPath(); ctx.arc(q.x, q.y, 4, 0, Math.PI * 2); ctx.fill(); }
    }
  }
  toss.look = ball;
  // trail
  const fire = toss.streak >= 1;
  toss.trail.forEach((t, i) => {
    const a = (i + 1) / toss.trail.length;
    ctx.fillStyle = fire ? (i % 2 ? 'rgba(255,138,58,' + a * 0.7 + ')' : 'rgba(255,210,63,' + a * 0.7 + ')') : 'rgba(255,255,255,' + a * 0.3 + ')';
    ctx.beginPath(); ctx.arc(t.x, t.y, toss.ball.r * t.s * (fire ? 1.1 : 0.8) * a, 0, Math.PI * 2); ctx.fill();
  });
  if (!f) toss.trail = [];
  const front = ball && f && f.phase === 'after' && f.result === 'in';
  drawBin(bx, g, 'back', now);
  if (ball && !front) drawPaper(ball);
  if (ball && front) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, g.y + 4); ctx.rect(bx - g.w / 2 + 4, g.y, g.w - 8, g.h); ctx.clip(); drawPaper(ball); ctx.restore(); }
  drawBin(bx, g, 'front', now);
  if (!f && toss.left > 0 && !toss.drag) {
    const bob = Math.sin(now / 200) * 4;
    ctx.fillStyle = '#fff'; ctx.font = '700 17px Fredoka, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(fire ? '🔥 Flick up ↑' : 'Flick up ↑', toss.ball.x, toss.ball.y - toss.ball.r - 16 + bob);
  }
}
function drawBin(x, g, part, now) {
  const top = g.y, w = g.w, h = g.h;
  if (part === 'back') {
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(x, top + h + 2, w * 0.45, 9, 0, 0, Math.PI * 2); ctx.fill();
  }
  const age = now - (toss.wob || 0), wob = toss.wob && age < 700 ? Math.sin(age / 45) * (1 - age / 700) * (toss.wobA || 0.1) : 0;
  ctx.save(); ctx.translate(x, top + h); ctx.rotate(wob); ctx.translate(-x, -(top + h));
  if (part === 'back') { ctx.fillStyle = '#152a55'; ctx.beginPath(); ctx.ellipse(x, top, w / 2, w * 0.14, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); return; }
  const grd = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
  grd.addColorStop(0, '#2a5fc0'); grd.addColorStop(0.45, '#5b9bff'); grd.addColorStop(1, '#244fa3');
  ctx.fillStyle = grd; ctx.beginPath();
  ctx.moveTo(x - w / 2, top); ctx.lineTo(x + w / 2, top); ctx.lineTo(x + w * 0.38, top + h); ctx.lineTo(x - w * 0.38, top + h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(x - w * 0.4, top + h * 0.86, w * 0.8, h * 0.06);
  ctx.fillStyle = 'rgba(255,210,63,.9)'; for (let k = -1; k <= 1; k += 2) ctx.fillRect(x + k * w * 0.36 - 3, top + 4, 6, h * 0.8);
  ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(x, top, w / 2, w * 0.14, 0, 0, Math.PI); ctx.stroke();
  // face
  const ey = top + h * 0.4, ex = w * 0.17, er = w * 0.11, L = toss.look;
  for (const sx of [-1, 1]) {
    const cx = x + sx * ex;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx, ey, er, 0, Math.PI * 2); ctx.fill();
    let dx = 0, dy = 0; if (L) { const vx = L.x - cx, vy = L.y - ey, m = Math.hypot(vx, vy) || 1; dx = vx / m * er * 0.45; dy = vy / m * er * 0.45; }
    if (toss.face === 'happy') { ctx.strokeStyle = '#123'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, ey + er * 0.3, er * 0.55, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else { ctx.fillStyle = '#123'; ctx.beginPath(); ctx.arc(cx + dx, ey + dy, er * 0.5, 0, Math.PI * 2); ctx.fill(); }
  }
  const my = top + h * 0.68;
  ctx.strokeStyle = '#123'; ctx.fillStyle = '#123'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  if (toss.face === 'wow') { ctx.beginPath(); ctx.ellipse(x, my, w * 0.07, w * 0.09, 0, 0, Math.PI * 2); ctx.fill(); }
  else if (toss.face === 'happy') {
    ctx.beginPath(); ctx.arc(x, my - w * 0.03, w * 0.15, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ff7aa8'; ctx.beginPath(); ctx.arc(x, my + w * 0.07, w * 0.06, Math.PI, 0); ctx.fill();
    ctx.fillStyle = 'rgba(255,95,162,.5)'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + sx * w * 0.3, my - w * 0.04, w * 0.06, w * 0.035, 0, 0, Math.PI * 2); ctx.fill(); }
  } else if (toss.face === 'sad') { ctx.beginPath(); ctx.arc(x, my + w * 0.08, w * 0.1, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
  else { ctx.beginPath(); ctx.arc(x, my - w * 0.04, w * 0.1, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
  ctx.lineCap = 'butt'; ctx.restore();
}
function drawPaper(b) {
  const r = toss.ball.r * b.s;
  ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot);
  ctx.fillStyle = '#f4f4f0'; ctx.beginPath();
  for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2, rr = r * (0.86 + 0.14 * ((i * 7) % 3) / 2); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#b9b9c4'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-r * 0.5, -r * 0.2); ctx.lineTo(r * 0.1, r * 0.1); ctx.lineTo(r * 0.4, -r * 0.4); ctx.moveTo(-r * 0.2, r * 0.5); ctx.lineTo(r * 0.3, r * 0.3); ctx.stroke();
  ctx.restore();
}

/* ---------------- 3. Paint Splat ---------------- */
let sp = {};
const PCOL = ['#ff5fa2', '#33d6ff', '#ffd23f', '#3ff09a', '#b18cff', '#ff8a3a'];
function spTarget() {
  const m = Math.min(W, H), kind = Math.floor(Math.random() * 3), r = [0.12, 0.09, 0.065][kind] * m;
  const v = (60 + Math.random() * 60) * (1 + kind * 0.35) * (sp.speed || 1), a = Math.random() * Math.PI * 2;
  return { x: r + Math.random() * (W - 2 * r), y: 56 + r + Math.random() * Math.max(1, H - 146 - 2 * r), r, p: kind + 1, vx: Math.cos(a) * v, vy: Math.sin(a) * v, hit: 0 };
}
function splatSetup() { sp = { left: 5, blobs: [], fly: null, speed: 1 }; sp.targets = [spTarget(), spTarget(), spTarget()]; }
function splatStart() { splatSetup(); tick = splatTick; hud('Paint balls 5'); }
function makeBlob(x, y, c) {
  const r = Math.min(W, H) * 0.07, dots = [], drips = [];
  for (let i = 0; i < 10; i++) { const a = Math.random() * Math.PI * 2, d = r * (0.7 + Math.random() * 0.9); dots.push([Math.cos(a) * d, Math.sin(a) * d, r * (0.12 + Math.random() * 0.25)]); }
  for (let i = 0; i < 3; i++) drips.push([(Math.random() - 0.5) * r * 1.2, r * (0.6 + Math.random() * 1.1), r * (0.08 + Math.random() * 0.08)]);
  return { x, y, r, c, dots, drips, t: performance.now() };
}
function splatTick(now, dt) {
  for (const t of sp.targets) {
    if (t.hit) continue;
    t.x += t.vx * dt; t.y += t.vy * dt;
    if (t.x < t.r) { t.x = t.r; t.vx = Math.abs(t.vx); }
    if (t.x > W - t.r) { t.x = W - t.r; t.vx = -Math.abs(t.vx); }
    if (t.y < 56 + t.r) { t.y = 56 + t.r; t.vy = Math.abs(t.vy); }
    if (t.y > H - 90 - t.r) { t.y = H - 90 - t.r; t.vy = -Math.abs(t.vy); }
  }
  sp.targets = sp.targets.map(t => t.hit && now - t.hit > 450 ? spTarget() : t);
  const f = sp.fly;
  if (f && now - f.t >= 200) {
    sp.fly = null; const b = makeBlob(f.x, f.y, f.c); sp.blobs.push(b); let got = 0;
    for (const t of sp.targets) if (!t.hit && Math.hypot(t.x - f.x, t.y - f.y) < t.r + b.r * 0.35) { t.hit = now; t.hc = f.c; got += t.p; }
    if (got) { pts += got; float(f.x, f.y - 30, 'Splat! +' + got, '#3ff09a'); confetti(f.x, f.y, 12); }
    else float(f.x, f.y - 30, 'Missed', '#ff5fa2');
    sp.left--; sp.speed += 0.15;
    if (sp.left <= 0) { splatDraw(now); return finish(pts >= 8 ? 'What a masterpiece!' : pts ? 'Nice splatting!' : 'Better luck next time!'); }
  }
  hud('Paint balls ' + sp.left);
  splatDraw(now);
}
function splatDraw(now) {
  ctx.clearRect(0, 0, W, H);
  booth(now, { a: '#7a1f9e', b: '#fff1dc', sign: 'SPLAT!', signY: H - 62, dim: 0.5 });
  for (const b of sp.blobs) drawBlob(b, now);
  for (const t of sp.targets) drawTarget(t, now);
  const f = sp.fly;
  if (f) {
    const e = Math.min(1, (now - f.t) / 200), x = W / 2 + (f.x - W / 2) * e, y = H + 20 + (f.y - H - 20) * e, r = Math.min(W, H) * 0.035 * (1.6 - 0.6 * e);
    ctx.fillStyle = f.c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, Math.PI * 2); ctx.fill();
  }
}
function drawBlob(b, now) {
  const g = Math.min(1, (now - b.t) / 120), dg = Math.min(1, (now - b.t) / 900);
  ctx.save(); ctx.translate(b.x, b.y); ctx.scale(0.4 + 0.6 * g, 0.4 + 0.6 * g); ctx.fillStyle = b.c;
  ctx.beginPath(); ctx.arc(0, 0, b.r, 0, Math.PI * 2); ctx.fill();
  for (const [dx, dy, r] of b.dots) { ctx.beginPath(); ctx.arc(dx, dy, r, 0, Math.PI * 2); ctx.fill(); }
  for (const [dx, len, w] of b.drips) { ctx.fillRect(dx - w / 2, 0, w, len * dg); ctx.beginPath(); ctx.arc(dx, len * dg, w * 0.75, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
function drawTarget(t, now) {
  const ring = ['#33d6ff', '#ffd23f', '#3ff09a'][t.p - 1];
  ctx.save(); ctx.translate(t.x, t.y);
  if (t.hit) { const e = Math.min(1, (now - t.hit) / 450); ctx.globalAlpha = 1 - e; ctx.scale(1 + e * 0.4, 1 + e * 0.4); ctx.fillStyle = t.hc; ctx.beginPath(); ctx.arc(0, 0, t.r, 0, Math.PI * 2); ctx.fill(); ctx.restore(); return; }
  ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.beginPath(); ctx.arc(0, 0, t.r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
  ctx.strokeStyle = ring; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, t.r * 0.62, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = '700 ' + Math.round(Math.max(14, t.r * 0.55)) + 'px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('+' + t.p, 0, 1); ctx.restore(); ctx.textBaseline = 'alphabetic';
}

/* ---------------- 4. Ring Toss ---------------- */
let rt = {};
const RCOL = ['#ff5fa2', '#33d6ff', '#ffd23f'];
function rtR() { return Math.min(W, H) * 0.075; }
function rtSc(y) { return Math.max(0.45, Math.min(1.05, 0.55 + (y - H * 0.40) / (H * 0.28) * 0.4)); }
function rtSetup() {
  rt = { left: 5, fly: null, drag: null, stuck: [], miss: [], wait: 0, mult: 1,
    rows: [{ y: H * 0.40, p: 3, xs: [0.3, 0.5, 0.7] }, { y: H * 0.54, p: 2, xs: [0.2, 0.4, 0.6, 0.8] }, { y: H * 0.68, p: 1, xs: [0.14, 0.32, 0.5, 0.68, 0.86] }],
    ring: { x: W / 2, y: H - 56 } };
}

function rtLand(d, p) {
  const dx = p.x - d.x0, dy = d.y0 - p.y, t = performance.now(), R = rtR();
  const jx = Math.sin(t / 170) * R * 0.3, jy = Math.cos(t / 230) * R * 0.2; // a little hand wobble
  return { x: Math.max(20, Math.min(W - 20, rt.ring.x + dx * 1.7 + jx)), y: Math.max(H * 0.3, Math.min(H - 110, rt.ring.y - dy * 1.7 + jy)) };
}
function ringStart() { rtSetup(); tick = ringTick; hud('Rings left 5'); }
function ringTick(now, dt) {
  const f = rt.fly;
  if (f && !f.done && now - f.t >= 550) {
    f.done = true; const R = rtR(); let hit = null, near = false;
    rt.rows.forEach((r, i) => r.xs.forEach((fx, k) => {
      const s = rtSc(r.y), px = fx * W, dx = Math.abs(f.lx - px), dy = Math.abs(f.ly - r.y);
      if (!hit && dx < R * s * 0.6 && dy < R * s * 0.7) hit = { i, k };
      else if (dx < R * s * 1.3 && dy < R * s * 1.6) near = true;
    }));
    if (hit) {
      const r = rt.rows[hit.i], px = r.xs[hit.k] * W; pts += r.p; rt.stuck.push({ row: hit.i, k: hit.k, c: f.c, t: now });
      const s = rtSc(r.y); float(px, r.y - R * s * 2, 'RINGER! +' + r.p, '#3ff09a'); confetti(px, r.y - R * s, 20);
    } else {
      rt.miss.push({ x: f.lx, y: f.ly, c: f.c, t: now });
      float(f.lx, f.ly - 30, near ? 'Clank! So close!' : 'Missed!', '#ff5fa2');
    }
    rt.wait = now + 650;
  }
  if (f && f.done && now >= rt.wait) {
    rt.fly = null; rt.left--; rt.mult += 0.25;
    if (rt.left <= 0) { ringDraw(now); return finish(pts >= 6 ? 'Carnival champ!' : pts ? 'Nice ringer!' : 'Better luck next time!'); }
  }
  hud('Rings left ' + rt.left);
  ringDraw(now);
}
function ringEll(x, y, rx, ry, c, part) {
  const a0 = part === 'back' ? Math.PI : 0, a1 = part === 'back' ? Math.PI * 2 : part === 'front' ? Math.PI : Math.PI * 2;
  ctx.lineWidth = Math.max(3, rx * 0.3); ctx.strokeStyle = c;
  ctx.beginPath(); ctx.ellipse(x, y, rx, Math.max(1, ry), 0, a0, a1); ctx.stroke();
  ctx.lineWidth = Math.max(1, rx * 0.08); ctx.strokeStyle = 'rgba(255,255,255,.55)';
  ctx.beginPath(); ctx.ellipse(x, y - rx * 0.06, rx * 0.95, Math.max(1, ry * 0.9), 0, a0, a1); ctx.stroke();
}
function ringScene(now) {
  const top = H * 0.3, sw = Math.max(36, W / 14);
  for (let x = 0, i = 0; x < W; x += sw, i++) { ctx.fillStyle = i % 2 ? '#fff1dc' : '#e8455a'; ctx.fillRect(x, 0, sw, top); }
  ctx.fillStyle = 'rgba(10,10,30,.25)'; ctx.fillRect(0, 0, W, top);
  for (let x = 0, i = 0; x < W + sw; x += sw, i++) { ctx.fillStyle = i % 2 ? '#fff1dc' : '#e8455a'; ctx.beginPath(); ctx.arc(x + sw / 2, top, sw / 2, 0, Math.PI); ctx.fill(); }
  // string lights
  const LC = ['#ffd23f', '#ff5fa2', '#33d6ff', '#3ff09a'];
  for (let i = 0; i <= 16; i++) {
    const x = W * i / 16, y = 62 + Math.sin(Math.PI * ((i % 8) / 8)) * 16, on = (Math.floor(now / 300) + i) % 3;
    ctx.fillStyle = LC[i % 4]; ctx.globalAlpha = on ? 1 : 0.35; ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // felt table
  const fg = ctx.createLinearGradient(0, top, 0, H); fg.addColorStop(0, '#145c3b'); fg.addColorStop(1, '#2a9a63');
  ctx.fillStyle = fg; ctx.fillRect(0, top + 6, W, H - top);
  ctx.fillStyle = '#8a5c34'; ctx.fillRect(0, top, W, 8);
  for (const r of rt.rows) {
    const s = rtSc(r.y);
    ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(W * 0.12, r.y - 3 * s, W * 0.76, 6 * s);
    ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '700 ' + Math.round(14 + 6 * s) + 'px Fredoka, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('+' + r.p, 10, r.y); ctx.textAlign = 'right'; ctx.fillText('+' + r.p, W - 10, r.y);
  }
  ctx.textBaseline = 'alphabetic';
}
function drawPeg(x, y, s, p) {
  const R = rtR(), pw = R * 0.3 * s, ph = R * 1.4 * s, col = ['#33d6ff', '#ffd23f', '#ff5fa2'][p - 1];
  ctx.fillStyle = 'rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(x + 3, y + 2, pw * 1.4, pw * 0.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f4f0e6'; ctx.fillRect(x - pw / 2, y - ph, pw, ph);
  ctx.fillStyle = col; for (let k = 0; k < 3; k++) ctx.fillRect(x - pw / 2, y - ph + ph * (0.2 + k * 0.28), pw, ph * 0.1);
  ctx.beginPath(); ctx.arc(x, y - ph, pw * 0.85, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(x - pw * 0.25, y - ph - pw * 0.25, pw * 0.25, 0, Math.PI * 2); ctx.fill();
}
function ringDraw(now) {
  ctx.clearRect(0, 0, W, H); ringScene(now);
  const R = rtR();
  rt.miss = rt.miss.filter(m => now - m.t < 1200);
  for (const m of rt.miss) { const s = rtSc(m.y); ctx.globalAlpha = 1 - (now - m.t) / 1200; ringEll(m.x, m.y, R * s, R * s * 0.32, m.c); ctx.globalAlpha = 1; }
  rt.rows.forEach((r, i) => r.xs.forEach((fx, pk) => {
    const s = rtSc(r.y), x = fx * W, mine = rt.stuck.filter(k => k.row === i && k.k === pk);
    const ys = k => { const e = Math.min(1, (now - k.t) / 220), ph = R * 1.4 * s; return r.y - ph + (ph - mine.indexOf(k) * R * 0.12 * s) * e; };
    for (const k of mine) ringEll(x, ys(k), R * s, R * s * 0.32, k.c, 'back');
    drawPeg(x, r.y, s, r.p);
    for (const k of mine) ringEll(x, ys(k), R * s, R * s * 0.32, k.c, 'front');
  }));
  const f = rt.fly, c = RCOL[(3 - rt.left) % 3];
  if (f && !f.done) {
    const e = Math.min(1, (now - f.t) / 550), s = 1 + (rtSc(f.ly) - 1) * e;
    const x = f.sx + (f.lx - f.sx) * e, y = f.sy + (f.ly - f.sy) * e - Math.sin(Math.PI * e) * H * 0.18;
    ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(x, f.sy + (f.ly - f.sy) * e, R * s, R * s * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    ringEll(x, y, R * s, R * s * (0.3 + 0.5 * Math.abs(Math.sin(e * Math.PI * 3))), f.c);
  } else if (!f && rt.left > 0) {
    const d = rt.drag, ok = d && d.y0 - d.y >= 25;
    if (ok) {
      const L = rtLand(d, d), s = rtSc(L.y);
      ctx.setLineDash([6, 6]); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(L.x, L.y, R * s, R * s * 0.32, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    }
    ringEll(rt.ring.x + (d ? (d.x - d.x0) * 0.1 : 0), rt.ring.y, R, R * 0.45, c);
    if (!d) { ctx.fillStyle = '#fff'; ctx.font = '700 17px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('Drag up to aim ↑', rt.ring.x, rt.ring.y - R - 14 + Math.sin(now / 200) * 4); }
  }
}

/* ---------------- 5. Can Knockdown ---------------- */
let ck = {};
function ckGeo() { const w = Math.min(W, H) * 0.075; return { w, h: w * 1.35, shelf: H * 0.56 }; }
function cansSetup() {
  const g = ckGeo(), cans = [], cx = W / 2;
  const rows = [[-1, 0, 1], [-0.5, 0.5], [0]];
  rows.forEach((row, r) => row.forEach(o => cans.push({ x: cx + o * g.w * 1.08, base: g.shelf - r * g.h, r, state: 'up', vx: 0, vy: 0, rot: 0, vr: 0, dy: 0 })));
  ck = { cans, sup: { 3: [0, 1], 4: [1, 2], 5: [3, 4] }, left: 5, fly: null, wait: 0, cleared: false };
}
function cansStart() { cansSetup(); tick = cansTick; hud('Bean bags 5'); }
function knock(c, ix, now, hard) {
  if (c.state !== 'up') return;
  c.state = 'fall'; pts += 1; float(c.x, c.base - ckGeo().h - 10, '+1', '#fff');
  const s = Math.sign(c.x - ix) || (Math.random() < 0.5 ? -1 : 1);
  if (hard) { c.vx = s * (140 + Math.random() * 200); c.vy = -(220 + Math.random() * 220); c.vr = s * (5 + Math.random() * 6); }
  else { c.vx = (Math.random() - 0.5) * 120; c.vy = -40; c.vr = (Math.random() - 0.5) * 6; }
}
function cansTick(now, dt) {
  const g = ckGeo(), f = ck.fly;
  if (f && !f.done && now - f.t >= 380) {
    f.done = true; let hits = 0;
    for (const c of ck.cans) {
      if (c.state !== 'up') continue;
      const cy = c.base - g.h / 2;
      if (Math.abs(f.x - c.x) < g.w * 0.85 && Math.abs(f.y - cy) < g.h * 0.75) { knock(c, f.x, now, true); hits++; }
    }
    if (!hits) float(f.x, f.y - 30, 'Missed!', '#ff5fa2'); else confetti(f.x, f.y, 10);
    f.vy = hits ? 120 : -60; ck.wait = now + 900;
  }
  // cans with a missing support fall too
  for (let k = 0; k < 3; k++) for (const [i, ss] of Object.entries(ck.sup)) { const c = ck.cans[i]; if (c.state === 'up' && ss.some(j => ck.cans[j].state !== 'up')) knock(c, c.x, now, false); }
  for (const c of ck.cans) if (c.state === 'fall') { c.vy += 1500 * dt; c.x += c.vx * dt; c.dy += c.vy * dt; c.rot += c.vr * dt; }
  if (f && f.done) { f.vy += 1500 * dt; f.y += f.vy * dt; }
  if (!ck.cleared && ck.cans.every(c => c.state !== 'up')) { ck.cleared = true; pts += 3; float(W / 2, g.shelf - g.h * 3.4, 'ALL DOWN! +3 bonus', '#3ff09a'); confetti(W / 2, g.shelf - g.h * 2, 30); ck.wait = Math.max(ck.wait, now + 900); }
  if (f && f.done && now >= ck.wait) {
    ck.fly = null; ck.left--;
    if (ck.left <= 0 || ck.cleared) { cansDraw(now); return finish(ck.cleared ? 'Knocked them all down!' : pts ? 'Nice throwing!' : 'Better luck next time!'); }
  }
  hud('Bean bags ' + ck.left);
  cansDraw(now);
}
function drawCan(c, g) {
  ctx.save(); ctx.translate(c.x, c.base + c.dy - g.h / 2); ctx.rotate(c.rot);
  const w = g.w, h = g.h, grd = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
  grd.addColorStop(0, '#9aa3b5'); grd.addColorStop(0.4, '#f2f4fa'); grd.addColorStop(1, '#7d8699');
  ctx.fillStyle = grd; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = '#e8455a'; ctx.fillRect(-w / 2, -h * 0.25, w, h * 0.5);
  ctx.fillStyle = '#fff'; ctx.font = '700 ' + Math.round(w * 0.32) + 'px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('POP', 0, 1);
  ctx.fillStyle = '#c3c9d6'; ctx.beginPath(); ctx.ellipse(0, -h / 2, w / 2, w * 0.12, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore(); ctx.textBaseline = 'alphabetic';
}
function drawBag(x, y, s, rot) {
  const r = ckGeo().w * 0.45 * s;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = '#d9472b'; ctx.beginPath(); ctx.roundRect(-r, -r * 0.8, r * 2, r * 1.6, r * 0.5); ctx.fill();
  ctx.setLineDash([3, 3]); ctx.strokeStyle = '#ffd9a0'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(-r * 0.78, -r * 0.6, r * 1.56, r * 1.2, r * 0.35); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
}
function cansDraw(now) {
  ctx.clearRect(0, 0, W, H);
  const g = ckGeo(), sw = Math.max(36, W / 14);
  for (let x = 0, i = 0; x < W; x += sw, i++) { ctx.fillStyle = i % 2 ? '#ffe28a' : '#2f6fd6'; ctx.fillRect(x, 0, sw, H); }
  ctx.fillStyle = 'rgba(10,12,35,.45)'; ctx.fillRect(0, 0, W, H);
  // shelf
  ctx.fillStyle = '#8a5c34'; ctx.fillRect(W * 0.2, g.shelf, W * 0.6, 14); ctx.fillStyle = '#6b4526'; ctx.fillRect(W * 0.2, g.shelf + 14, W * 0.6, 8);
  ctx.fillStyle = '#5a3a20'; ctx.fillRect(W * 0.26, g.shelf + 22, 10, H); ctx.fillRect(W * 0.74 - 10, g.shelf + 22, 10, H);
  // counter at the bottom
  ctx.fillStyle = '#b5763f'; ctx.fillRect(0, H - 70, W, 70); ctx.fillStyle = '#e8455a'; ctx.fillRect(0, H - 76, W, 8);
  for (const c of ck.cans) if (c.base + c.dy < H + 80) drawCan(c, g);
  const f = ck.fly;
  if (f) {
    if (!f.done) { const e = Math.min(1, (now - f.t) / 380), x = W / 2 + (f.x - W / 2) * e, y = H - 40 + (f.y - H + 40) * e - Math.sin(Math.PI * e) * H * 0.15; drawBag(x, y, 1.5 - 0.5 * e, e * 8); }
    else drawBag(f.x, f.y, 1, 8);
  } else if (ck.left > 0) {
    drawBag(W / 2, H - 40, 1.5, 0);
    ctx.fillStyle = '#fff'; ctx.font = '700 17px Fredoka, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Tap the cans to throw', W / 2, H - 92 + Math.sin(now / 200) * 4);
  }
}

/* ---------------- 6. Spin the Wheel ---------------- */
let wh = {};
const WVALS = [2, 5, 3, 10, 2, 4, 3, 7], WCOL = ['#ff5fa2', '#33d6ff', '#ffd23f', '#3ff09a', '#b18cff', '#ff8a3a', '#33d6ff', '#ffd23f'];
function wheelSetup() { wh = { a: Math.random() * 6.28, w: 9, stopAt: 0, a0: 0, done: false, auto: performance.now() + 6000 }; }
function wheelStart() { wheelSetup(); tick = wheelTick; hud('Tap to STOP!'); }
function wheelStop(now) { if (wh.stopAt || wh.done) return; wh.stopAt = now; wh.a0 = wh.a; }
function wheelTick(now, dt) {
  const T = 1400;
  if (!wh.stopAt) { wh.a += wh.w * dt; if (now > wh.auto) wheelStop(now); }
  else if (!wh.done) {
    const e = Math.min(1, (now - wh.stopAt) / T); wh.a = wh.a0 + wh.w * (T / 1000) * (e - e * e / 2);
    if (e >= 1) {
      wh.done = true; const n = WVALS.length, seg = Math.PI * 2 / n;
      const rel = ((-Math.PI / 2 - wh.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2), i = Math.floor(rel / seg);
      pts += WVALS[i]; const b = wheelGeo();
      float(b.x, b.y - b.r - 10, WVALS[i] >= 6 ? 'JACKPOT! +' + WVALS[i] : '+' + WVALS[i], WVALS[i] >= 6 ? '#3ff09a' : '#ffd23f');
      if (WVALS[i] >= 6) confetti(b.x, b.y, 30);
      wh.wait = now + 600;
    }
  }
  if (wh.done && now >= wh.wait) { wheelDraw(now); return finish(pts >= 6 ? 'Big win!' : 'Nice spin!'); }
  hud(wh.stopAt ? 'Slowing down...' : 'Tap to STOP!');
  wheelDraw(now);
}
function wheelGeo() { return { x: W / 2, y: H * 0.5, r: Math.min(W * 0.42, H * 0.36) }; }
function wheelDraw(now) {
  ctx.clearRect(0, 0, W, H);
  const b = wheelGeo(), n = WVALS.length, seg = Math.PI * 2 / n;
  booth(now, { counter: true });
  ctx.fillStyle = '#1d2450'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r + 16, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; ctx.fillStyle = (Math.floor(now / 150) + i) % 2 ? '#ffd23f' : '#fff6cc'; ctx.beginPath(); ctx.arc(b.x + Math.cos(a) * (b.r + 8), b.y + Math.sin(a) * (b.r + 8), 3.5, 0, Math.PI * 2); ctx.fill(); }
  ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(wh.a);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = WCOL[i]; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, b.r, i * seg, (i + 1) * seg); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.save(); ctx.rotate(i * seg + seg / 2); ctx.fillStyle = '#121733'; ctx.font = '700 ' + Math.round(b.r * 0.2) + 'px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(WVALS[i], b.r * 0.68, 0); ctx.restore();
  }
  ctx.restore();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e8455a'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.08, 0, Math.PI * 2); ctx.fill();
  // pointer
  ctx.fillStyle = '#fff'; ctx.strokeStyle = '#121733'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(b.x - 16, b.y - b.r - 26); ctx.lineTo(b.x + 16, b.y - b.r - 26); ctx.lineTo(b.x, b.y - b.r + 8); ctx.closePath(); ctx.fill(); ctx.stroke();
  // stop button
  if (!wh.stopAt && running) {
    const by = Math.min(H - 34, b.y + b.r + 46), pulse = 1 + Math.sin(now / 120) * 0.04;
    ctx.save(); ctx.translate(b.x, by); ctx.scale(pulse, pulse);
    ctx.fillStyle = '#9b1c2e'; ctx.beginPath(); ctx.roundRect(-70, -20, 140, 46, 23); ctx.fill();
    ctx.fillStyle = '#e8455a'; ctx.beginPath(); ctx.roundRect(-70, -26, 140, 46, 23); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = '700 22px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('STOP!', 0, -3);
    ctx.restore();
  }
  ctx.textBaseline = 'alphabetic';
}

function wire() {
function pos(e) { const r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
cv.addEventListener('pointerdown', e => {
  if (!running) return; const p = pos(e);
  if (game === 'splat' && !sp.fly && sp.left > 0) sp.fly = { x: p.x, y: p.y, t: performance.now(), c: PCOL[Math.floor(Math.random() * 6)] };
  if (game === 'cans' && !ck.fly && ck.left > 0 && !ck.cleared) ck.fly = { x: p.x, y: p.y, t: performance.now() };
  if (game === 'wheel') wheelStop(performance.now());
  if (game === 'ring' && !rt.fly && rt.left > 0) { rt.drag = { x0: p.x, y0: p.y, x: p.x, y: p.y }; cv.setPointerCapture(e.pointerId); }
  if (game === 'toss' && !toss.fly && toss.left > 0) { toss.drag = { x0: p.x, y0: p.y, x: p.x, y: p.y }; cv.setPointerCapture(e.pointerId); }
});
cv.addEventListener('pointermove', e => { if (rt.drag) { const p = pos(e); rt.drag.x = p.x; rt.drag.y = p.y; } if (toss.drag) { const p = pos(e); toss.drag.x = p.x; toss.drag.y = p.y; } });
cv.addEventListener('pointerup', e => {
  if (game === 'ring' && rt.drag && running) {
    const d = rt.drag, p = pos(e); rt.drag = null;
    if (d.y0 - p.y < 25) { float(rt.ring.x, rt.ring.y - 60, 'Drag up!', '#fff'); return; }
    const L = rtLand(d, p); rt.fly = { sx: rt.ring.x, sy: rt.ring.y, lx: L.x, ly: L.y, t: performance.now(), c: RCOL[(3 - rt.left) % 3] }; return;
  }
  if (game !== 'toss' || !toss.drag || !running) return;
  const d = toss.drag, p = pos(e); toss.drag = null;
  const dy = d.y0 - p.y;
  if (dy < 25) { float(toss.ball.x, toss.ball.y - 50, 'Flick up!', '#fff'); return; }
  const lx = tossLand(d, p);
  toss.fly = { sx: toss.ball.x, sy: toss.ball.y, lx, t: performance.now(), dur: 650, phase: 'up' };
});
cv.addEventListener('pointercancel', () => { toss.drag = null; rt.drag = null; });
}

window.Carnival = { play, close, pick, isOpen: () => !!root && !root.hidden };
})();
