/* Sports Arena bonus games for the Unit 5 Lesson 2 stations.
   Same calling pattern as the Review #2 carnival games, but a different look and different games:
   Arena.play({ msg, who, game, scores, onDone(points) -> scores, onClose }).
   Arena.pick() deals the next game from a shuffle bag, so all 6 games come up before any repeats. */
(function () {
if (window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r); this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r); this.closePath(); return this; };
}
const F = "'Oswald',Impact,'Arial Narrow',sans-serif";
const CSS = `
.arn{position:fixed;inset:0;z-index:1000;background:rgba(4,8,16,.86);display:flex;align-items:center;justify-content:center;padding:12px;animation:arnin .2s}
@keyframes arnin{from{opacity:0}}
.arn[hidden]{display:none}
.arn-box{width:min(920px,100%);display:flex;flex-direction:column;gap:.6rem}
.arn-top{display:flex;justify-content:space-between;align-items:center;gap:.8rem;flex-wrap:wrap;color:#eef4ff;font:600 1.1rem ${F};letter-spacing:.03em;text-transform:uppercase}
.arn-top b{color:#ffcc33}
.arn-skip{background:none;border:1px solid rgba(255,255,255,.3);color:#c5d0e4;border-radius:6px;padding:.35rem .9rem;cursor:pointer;font:600 .9rem system-ui,sans-serif}
#arn-stage{position:relative;height:clamp(340px,72vh,560px);border-radius:14px;overflow:hidden;border:3px solid #1e2a44;background:#0b1424;touch-action:none;user-select:none;-webkit-user-select:none;font-family:${F}}
#arn-cv{position:absolute;inset:0;width:100%;height:100%}
#arn-layer{position:absolute;inset:0;pointer-events:none}
#arn-hud{position:absolute;top:10px;left:12px;right:12px;display:flex;justify-content:space-between;align-items:center;pointer-events:none;font:600 1rem ${F};letter-spacing:.04em;text-transform:uppercase;z-index:3;color:#fff}
#arn-hud span{background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.18);border-radius:6px;padding:.25rem .75rem}
#arn-pts{color:#ffcc33;font-variant-numeric:tabular-nums}
#arn-bar{position:absolute;left:0;bottom:0;height:6px;background:#ff4d3d;width:0;z-index:3}
#arn-over{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:.45rem;background:rgba(4,8,18,.78);padding:16px;color:#fff}
#arn-over[hidden]{display:none}
#arn-big{font:700 clamp(2.1rem,1.4rem + 3vw,3.4rem) ${F};letter-spacing:.02em;text-transform:uppercase;color:#ffcc33;margin:0}
#arn-sub{font:600 1.1rem system-ui,sans-serif;margin:0 0 .3rem;max-width:36ch;line-height:1.45}
#arn-how{font:500 .98rem system-ui,sans-serif;color:#c5d0e4;margin:0 0 .5rem;max-width:44ch;line-height:1.45}
#arn-go{font:700 1.3rem ${F};letter-spacing:.06em;text-transform:uppercase;background:#ff4d3d;color:#fff;border:0;border-radius:8px;padding:.7rem 2.2rem;cursor:pointer;box-shadow:0 6px 0 #a82418}
#arn-go:active{transform:translateY(3px);box-shadow:0 3px 0 #a82418}
.arn .bit{position:absolute;width:9px;height:9px;border-radius:2px;pointer-events:none;animation:arnburst .6s ease-out forwards}
@keyframes arnburst{to{transform:translate(var(--dx),var(--dy)) rotate(220deg);opacity:0}}
.arn .float{position:absolute;transform:translate(-50%,-50%);margin:0;font:700 1.7rem ${F};letter-spacing:.03em;text-transform:uppercase;color:#fff;pointer-events:none;white-space:nowrap;animation:arnup .9s ease-out forwards;text-shadow:0 3px 10px rgba(0,0,0,.7)}
@keyframes arnup{to{transform:translate(-50%,-150%) scale(1.15);opacity:0}}
`;
const COL = ['#ff4d3d', '#ffcc33', '#2fd4ff', '#3be37a', '#ffffff', '#ff8a2a'];
const GAMES = {
  hoops: { name: 'Free Throw', how: 'Drag up and let go to shoot (on a computer, click and drag up). The hoop slides slowly, so aim where it will be. Swish = 3, in = 2. 5 shots.' },
  penalty: { name: 'Penalty Kick', how: 'Tap one of the 6 boxes in the goal to kick the ball there. Top corners are worth 3, bottom corners 2, the middle 1. The goalie shuffles side to side and usually dives the way he is leaning, so shoot away from him! 5 kicks.' },
  homerun: { name: 'Home Run Derby', how: 'Tap SWING (or anywhere) when the pitch reaches the glowing zone. Perfect timing = home run (3). Close = base hit (1). 6 pitches.' },
  fieldgoal: { name: 'Field Goal', how: 'The arrow swings back and forth. Tap to kick when it points between the posts. Watch the wind! Each kick is farther and worth more. 5 kicks.' },
  bowling: { name: 'Bowling', how: 'The ball slides across the lane. Tap to roll it. Hit the front pin dead on for a strike (4). 7 or more pins = 2, 3 or more = 1. 3 rolls.' },
  goalie: { name: 'Goalie Save', how: 'You are the goalie! Watch the striker: a ring shows where each shot is going. Move your gloves there (drag on a phone) to block it. 1 point per save, gold balls = 2, and every 3 saves in a row = +1 bonus. 12 seconds.' }
};
let root, stage, cv, ctx, layer, W = 0, H = 0, game = 'hoops', lastG = '', running = false, pts = 0, raf = 0, last = 0, tick = null, opts = {}, phase = '';
const q = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.random() * (b - a);
function build() {
  if (root) return;
  const fl = document.createElement('link'); fl.rel = 'stylesheet'; fl.href = 'https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap'; document.head.appendChild(fl);
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  root = document.createElement('div'); root.className = 'arn'; root.hidden = true;
  root.innerHTML = '<div class="arn-box" role="dialog" aria-label="Bonus game"><div class="arn-top"><span id="arn-title"></span><span id="arn-team"></span></div>' +
    '<div id="arn-stage"><canvas id="arn-cv"></canvas><div id="arn-layer"></div><div id="arn-hud"><span id="arn-st"></span><span id="arn-pts">+0</span></div><div id="arn-bar"></div>' +
    '<div id="arn-over"><p id="arn-big"></p><p id="arn-sub"></p><p id="arn-how"></p><button id="arn-go" type="button">Play</button></div></div>' +
    '<div style="text-align:right"><button class="arn-skip" id="arn-skip" type="button">Skip game</button></div></div>';
  document.body.appendChild(root);
  stage = q('arn-stage'); cv = q('arn-cv'); ctx = cv.getContext('2d'); layer = q('arn-layer');
  q('arn-go').onclick = () => phase === 'intro' ? start() : close();
  q('arn-skip').onclick = close;
  wire();
  window.addEventListener('resize', () => { if (!root.hidden) { fit(); if (!running && phase === 'intro') drawIdle(); } });
}
function pick() {
  const keys = Object.keys(GAMES); let bag = [];
  try { bag = JSON.parse(localStorage.getItem('arn-bag') || '[]').filter(g => keys.includes(g)); } catch (e) {}
  if (!bag.length) {
    bag = keys.slice(); for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
    if (bag[0] === lastG) bag.push(bag.shift());
  }
  const g = bag.shift(); lastG = g;
  try { localStorage.setItem('arn-bag', JSON.stringify(bag)); } catch (e) {}
  return g;
}
function board(scores) {
  const el = q('arn-team'); if (!scores || !scores.length) { el.textContent = ''; return; }
  el.innerHTML = scores.map(x => '<span style="margin-left:.9rem">' + x.name.replace(/[<>&"]/g, '') + ' <b>' + x.pts + '</b></span>').join('');
}
function fit() {
  const r = stage.getBoundingClientRect(); W = r.width; H = r.height;
  const d = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(W * d); cv.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0);
}
function hud(st) { q('arn-st').textContent = GAMES[game].name + ' · ' + st; q('arn-pts').textContent = '+' + pts; }
function bar(f) { q('arn-bar').style.width = (clamp(f, 0, 1) * 100) + '%'; }
function float(x, y, txt, color) {
  const p = document.createElement('p'); p.className = 'float'; p.textContent = txt;
  p.style.left = clamp(x, 70, W - 70) + 'px'; p.style.top = y + 'px'; if (color) p.style.color = color;
  layer.appendChild(p); setTimeout(() => p.remove(), 950);
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
const SETUP = { hoops: () => hpSetup(), penalty: () => pkSetup(), homerun: () => hrSetup(), fieldgoal: () => fgSetup(), bowling: () => bwSetup(), goalie: () => glSetup() };
const DRAW = { hoops: n => hpDraw(n), penalty: n => pkDraw(n), homerun: n => hrDraw(n), fieldgoal: n => fgDraw(n), bowling: n => bwDraw(n), goalie: n => glDraw(n) };
function drawIdle() { SETUP[game](); DRAW[game](performance.now()); }
function play(o) {
  build(); opts = o || {};
  game = GAMES[opts.game] ? opts.game : pick();
  running = false; tick = null; cancelAnimationFrame(raf); layer.innerHTML = ''; pts = 0; bar(0); phase = 'intro';
  q('arn-title').textContent = opts.who ? opts.who + ' is up' : 'Bonus round';
  board(opts.scores);
  q('arn-big').textContent = opts.msg || 'Correct!';
  q('arn-sub').textContent = (opts.who ? opts.who + ', your bonus round: ' : 'Bonus round: ') + GAMES[game].name + '!';
  q('arn-how').textContent = GAMES[game].how;
  q('arn-go').textContent = 'Play';
  q('arn-over').hidden = false; q('arn-skip').hidden = false;
  root.hidden = false; fit(); hud('Get ready'); drawIdle();
  setTimeout(() => q('arn-go').focus(), 50);
}
function start() {
  phase = 'play'; q('arn-over').hidden = true; layer.innerHTML = ''; pts = 0; running = true; last = performance.now();
  SETUP[game]();
  float(W / 2, H * 0.45, GAMES[game].name + '!', '#ffcc33');
  tick = { hoops: hpTick, penalty: pkTick, homerun: hrTick, fieldgoal: fgTick, bowling: bwTick, goalie: glTick }[game];
  cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
}
function finish(msg) {
  running = false; tick = null; bar(0); phase = 'done';
  const got = pts, scores = opts.onDone ? opts.onDone(got) : null;
  board(scores); q('arn-skip').hidden = true;
  setTimeout(() => {
    q('arn-big').textContent = '+' + got + (got === 1 ? ' point' : ' points');
    q('arn-sub').textContent = msg + (opts.who ? ' ' + opts.who + ' now has ' + ((scores || []).find(x => x.name === opts.who) || { pts: got }).pts + ' points.' : '');
    q('arn-how').textContent = '';
    q('arn-go').textContent = 'Back to the station';
    q('arn-over').hidden = false; q('arn-go').focus();
  }, 700);
}
function close() {
  running = false; tick = null; cancelAnimationFrame(raf); phase = '';
  if (root) { root.hidden = true; layer.innerHTML = ''; }
  if (opts.onClose) opts.onClose();
}

/* ---------------- shared stadium backdrop ---------------- */
const CROWD = ['#ff4d3d', '#ffcc33', '#2fd4ff', '#ffffff', '#3be37a', '#c88bff', '#ff8a2a'];
function stadium(now, o) {
  const bot = o.crowdBot || H * 0.3;
  const sky = ctx.createLinearGradient(0, 0, 0, bot); sky.addColorStop(0, '#03060e'); sky.addColorStop(1, '#101a30');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, bot);
  // stands: tiers of fans (head + shoulders), darker toward the back, a few jumping
  const SKIN = ['#f1c9a5', '#e0a878', '#c68642', '#8d5524', '#ffdbac'], SHIRT = ['#ff4d3d', '#ffcc33', '#2fd4ff', '#ffffff', '#1b2a4a', '#ff8a2a', '#3be37a'];
  for (let r = 0, y = 26; y < bot - 18; y += 9, r++) {
    const shade = 0.45 + 0.5 * (y / bot);
    ctx.fillStyle = 'rgba(30,40,60,' + (0.6 * shade) + ')'; ctx.fillRect(0, y + 3, W, 2);
    for (let i = 0, x = (r % 2) * 5 + 3; x < W; x += 10, i++) {
      const h1 = pkHash(i * 31 + r * 7), jump = Math.sin(now / 200 + i * 1.3 + r * 2) > 0.92 ? 2.5 : 0;
      ctx.globalAlpha = shade;
      ctx.fillStyle = SHIRT[Math.floor(h1 * SHIRT.length)]; ctx.beginPath(); ctx.roundRect(x - 4, y - jump, 8, 6, 3); ctx.fill();
      ctx.fillStyle = SKIN[Math.floor(pkHash(i + r * 13) * SKIN.length)]; ctx.beginPath(); ctx.arc(x, y - 3 - jump, 2.8, 0, 7); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  // camera flashes
  for (let k = 0; k < 3; k++) { const fx = pkHash(Math.floor(now / 700) * 3 + k) * W, fy = 26 + pkHash(Math.floor(now / 700) + k * 9) * (bot - 50);
    if ((now / 700 % 1) < 0.12) { ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(fx, fy, 2.5, 0, 7); ctx.fill(); } }
  // floodlights
  for (const lx of [W * 0.06, W * 0.94]) {
    const lg = ctx.createRadialGradient(lx, 6, 2, lx, 6, W * 0.35); lg.addColorStop(0, 'rgba(255,250,225,.55)'); lg.addColorStop(0.2, 'rgba(255,250,225,.18)'); lg.addColorStop(1, 'rgba(255,250,225,0)');
    ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H * 0.6);
    ctx.fillStyle = '#fffbe6'; for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { ctx.beginPath(); ctx.arc(lx - 10 + i * 10, 6 + j * 8, 3.2, 0, 7); ctx.fill(); }
  }
  // LED ad boards
  const ab = ctx.createLinearGradient(0, bot - 18, 0, bot); ab.addColorStop(0, '#0b1730'); ab.addColorStop(1, '#050b18');
  ctx.fillStyle = ab; ctx.fillRect(0, bot - 18, W, 18);
  ctx.fillStyle = 'rgba(255,255,255,.08)'; for (let x = 0; x < W; x += W / 6) ctx.fillRect(x, bot - 18, 2, 18);
  ctx.fillStyle = '#ffcc33'; ctx.font = '700 11px ' + F; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const msg = '  FUNCTION ARENA  ·  ONE INPUT, ONE OUTPUT  ·  VERTICAL LINE TEST  ·  GO TEAM  ·', mw = ctx.measureText(msg).width, off = (now / 30) % mw;
  for (let x = -off; x < W; x += mw) ctx.fillText(msg, x, bot - 9);
  ctx.textBaseline = 'alphabetic';
}
// grass with mowing stripes that widen toward the camera, lit in the middle
function grass(y0, y1, stripes) {
  const n = stripes || 10;
  for (let k = 0; k < n; k++) {
    const ya = y0 + (y1 - y0) * Math.pow(k / n, 1.5), yb = y0 + (y1 - y0) * Math.pow((k + 1) / n, 1.5);
    ctx.fillStyle = k % 2 ? '#2e8b3e' : '#37a049'; ctx.fillRect(0, ya, W, yb - ya + 1);
  }
  const gl = ctx.createRadialGradient(W / 2, (y0 + y1) / 2, 10, W / 2, (y0 + y1) / 2, W * 0.7); gl.addColorStop(0, 'rgba(255,255,220,.10)'); gl.addColorStop(1, 'rgba(0,0,0,.28)');
  ctx.fillStyle = gl; ctx.fillRect(0, y0, W, y1 - y0);
}
// a soft shadow under a ball or player
function shadow(x, y, rx, ry, a) { ctx.fillStyle = 'rgba(0,0,0,' + (a || 0.25) + ')'; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); }
function ballSoccer(x, y, r) { pkBall(x, y, r, 0); }
function ballBasket(x, y, r, spin) {
  const bg = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); bg.addColorStop(0, '#ffa257'); bg.addColorStop(0.65, '#e8691a'); bg.addColorStop(1, '#9a3f0a');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
  ctx.strokeStyle = '#2a1203'; ctx.lineWidth = Math.max(1, r * 0.08);
  ctx.translate(x, y); ctx.rotate(spin || 0);
  ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(-r, 0, r * 0.6, r, 0, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(r, 0, r * 0.6, r, 0, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(x - r * 0.38, y - r * 0.42, r * 0.22, r * 0.12, -0.6, 0, 7); ctx.fill();
}
function ballFootball(x, y, r, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot || 0);
  const bg = ctx.createRadialGradient(-r * 0.4, -r * 0.4, r * 0.1, 0, 0, r * 1.5); bg.addColorStop(0, '#b46a33'); bg.addColorStop(0.7, '#7a3e16'); bg.addColorStop(1, '#4a230a');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(0, 0, r * 1.5, r, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(1, r * 0.1);
  ctx.beginPath(); ctx.moveTo(-r * 1.15, -r * 0.45); ctx.lineTo(-r * 1.15, r * 0.45); ctx.moveTo(r * 1.15, -r * 0.45); ctx.lineTo(r * 1.15, r * 0.45); ctx.stroke();
  ctx.lineWidth = Math.max(1, r * 0.12); ctx.beginPath(); ctx.moveTo(-r * 0.5, 0); ctx.lineTo(r * 0.5, 0); ctx.stroke();
  ctx.lineWidth = Math.max(1, r * 0.08);
  for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * r * 0.2, -r * 0.2); ctx.lineTo(i * r * 0.2, r * 0.2); ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.beginPath(); ctx.ellipse(-r * 0.3, -r * 0.5, r * 0.6, r * 0.15, 0, 0, 7); ctx.fill();
  ctx.restore();
}
function label(txt, x, y, size, color) {
  ctx.font = '700 ' + size + 'px ' + F; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(0,0,0,.55)'; ctx.strokeText(txt, x, y); ctx.lineJoin = 'miter';
  ctx.fillStyle = color || '#fff'; ctx.fillText(txt, x, y); ctx.textBaseline = 'alphabetic';
}

/* ---------------- 1. Free Throw ---------------- */
let hp = {};
function hpSetup() { hp = { left: 5, drag: null, fly: null, wait: 0, t0: performance.now() }; }
function hpGeo(now) {
  const r = clamp(W * 0.055, 26, 44), hy = H * 0.36, amp = (W / 2 - r - 40) * 0.55;
  return { r, hy, hx: W / 2 + Math.sin((now - (hp.t0 || 0)) / 1900) * amp, bx: W / 2, by: H - 62, br: clamp(W * 0.03, 16, 24) };
}
function hpLand(d, p) {
  const g = hpGeo(performance.now()), dy = Math.max(25, d.y0 - p.y), dx = p.x - d.x0;
  return clamp(g.bx + dx / dy * (g.by - g.hy) * 0.9, 20, W - 20);
}
function hpDraw(now) {
  ctx.clearRect(0, 0, W, H);
  stadium(now, { crowdBot: H * 0.24 });
  // hardwood floor
  const fy = H * 0.24;
  const wood = ctx.createLinearGradient(0, fy, 0, H); wood.addColorStop(0, '#b97a3d'); wood.addColorStop(1, '#e0a865');
  ctx.fillStyle = wood; ctx.fillRect(0, fy, W, H - fy);
  // floor boards that run toward the hoop, with a little grain
  ctx.strokeStyle = 'rgba(90,50,15,.22)'; ctx.lineWidth = 1;
  for (let k = -14; k <= 14; k++) { ctx.beginPath(); ctx.moveTo(W / 2 + k * W * 0.012, fy); ctx.lineTo(W / 2 + k * W * 0.09, H); ctx.stroke(); }
  for (let k = 1; k < 10; k++) { const y = fy + (H - fy) * Math.pow(k / 10, 1.6); ctx.strokeStyle = 'rgba(90,50,15,.1)'; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  // painted lane and free-throw circle
  ctx.fillStyle = 'rgba(200,40,40,.55)'; ctx.beginPath(); ctx.moveTo(W / 2 - W * 0.07, fy + 2); ctx.lineTo(W / 2 + W * 0.07, fy + 2); ctx.lineTo(W / 2 + W * 0.2, H - 60); ctx.lineTo(W / 2 - W * 0.2, H - 60); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(W / 2, H - 60, W * 0.2, 30, 0, 0, Math.PI); ctx.stroke();
  ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.ellipse(W / 2, H - 60, W * 0.2, 30, 0, Math.PI, 0); ctx.stroke(); ctx.setLineDash([]);
  // floor shine under the lights
  const sh = ctx.createRadialGradient(W / 2, fy + (H - fy) * 0.35, 10, W / 2, fy + (H - fy) * 0.35, W * 0.5); sh.addColorStop(0, 'rgba(255,245,220,.22)'); sh.addColorStop(1, 'rgba(0,0,0,.18)');
  ctx.fillStyle = sh; ctx.fillRect(0, fy, W, H - fy);
  const g = hpGeo(now);
  // backboard + rim (back half)
  const bw = g.r * 3.4, bh = g.r * 2.3;
  ctx.fillStyle = '#3a4152'; ctx.fillRect(g.hx - 4, g.hy - bh - 6 - 40, 8, 40);   // support arm
  const gb = ctx.createLinearGradient(g.hx - bw / 2, g.hy - bh, g.hx + bw / 2, g.hy); gb.addColorStop(0, 'rgba(235,245,255,.85)'); gb.addColorStop(0.5, 'rgba(255,255,255,.65)'); gb.addColorStop(1, 'rgba(210,225,240,.85)');
  ctx.fillStyle = gb; ctx.fillRect(g.hx - bw / 2, g.hy - bh - 6, bw, bh); ctx.strokeStyle = '#ff4d3d'; ctx.lineWidth = 3; ctx.strokeRect(g.hx - bw / 2, g.hy - bh - 6, bw, bh);
  ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.moveTo(g.hx - bw / 2 + 6, g.hy - bh); ctx.lineTo(g.hx - bw / 2 + bw * 0.3, g.hy - bh); ctx.lineTo(g.hx - bw / 2 + 6, g.hy - 12); ctx.fill();
  ctx.strokeRect(g.hx - g.r * 0.7, g.hy - g.r * 1.3, g.r * 1.4, g.r);
  ctx.fillStyle = '#555'; ctx.fillRect(g.hx - 3, g.hy - 6, 6, 6);
  ctx.strokeStyle = '#d23a1a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(g.hx, g.hy, g.r, g.r * 0.28, 0, Math.PI, Math.PI * 2); ctx.stroke();
  let ball = null;
  if (hp.fly) {
    const f = hp.fly, t = clamp((now - f.t) / f.dur, 0, 1), peak = g.hy - H * 0.2;
    const x = f.sx + (f.lx - f.sx) * t, y = (1 - t) * (1 - t) * f.sy + 2 * t * (1 - t) * peak + t * t * g.hy;
    ball = { x, y, r: g.br * (1 - 0.3 * t), spin: t * 9 };
  } else if (hp.left > 0) ball = { x: g.bx, y: g.by, r: g.br, spin: 0 };
  const behind = hp.fly && (now - hp.fly.t) / hp.fly.dur > 0.82;
  if (ball && behind) ballBasket(ball.x, ball.y, ball.r, ball.spin);
  // net + front rim
  ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.5;
  for (let i = 0; i <= 6; i++) { const a = g.hx - g.r + i * g.r / 3; ctx.beginPath(); ctx.moveTo(a, g.hy); ctx.lineTo(g.hx - g.r * 0.6 + i * g.r * 0.2, g.hy + g.r * 1.1); ctx.stroke(); }
  ctx.strokeStyle = '#ff5a2a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(g.hx, g.hy, g.r, g.r * 0.28, 0, 0, Math.PI); ctx.stroke();
  if (ball && !behind) { if (!hp.fly) shadow(ball.x, ball.y + ball.r * 1.05, ball.r * 0.9, ball.r * 0.25); ballBasket(ball.x, ball.y, ball.r, ball.spin); }
  if (hp.drag && !hp.fly) {
    const lx = hpLand(hp.drag, hp.drag), ok = hp.drag.y0 - hp.drag.y >= 25;
    if (ok) { ctx.setLineDash([6, 8]); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(g.bx, g.by); ctx.quadraticCurveTo((g.bx + lx) / 2, g.hy - H * 0.25, lx, g.hy); ctx.stroke(); ctx.setLineDash([]); }
  }
  label('SHOTS ' + hp.left, W - 60, H - 24, 18, '#fff');
}
function hpTick(now) {
  const g = hpGeo(now), f = hp.fly;
  if (f && now - f.t >= f.dur && !f.done) {
    f.done = true; const off = Math.abs(f.lx - g.hx);
    if (off < g.r * 0.5) { pts += 3; float(g.hx, g.hy - 40, 'SWISH! +3', '#ffcc33'); confetti(g.hx, g.hy, 18); }
    else if (off < g.r * 1.25) { pts += 2; float(g.hx, g.hy - 40, 'Bucket! +2', '#3be37a'); confetti(g.hx, g.hy, 10); }
    else float(f.lx, g.hy - 40, f.lx < g.hx ? 'Missed left' : 'Missed right', '#fff');
    hp.wait = now + 650;
  }
  if (f && f.done && now >= hp.wait) { hp.fly = null; if (hp.left <= 0) { hpDraw(now); return finish(pts >= 9 ? 'All-star shooting!' : pts ? 'Nice shooting!' : 'Tough night on the court!'); } }
  hud(hp.left + ' shots left'); bar(1 - hp.left / 5); hpDraw(now);
}

/* ---------------- 2. Penalty Kick ---------------- */
// The goal is split into 6 boxes with their points written in them. Tap a box to kick there.
// The goalie shuffles side to side and dives when you kick. He usually dives the way he is leaning,
// so shooting away from him is the smart play. Pick a different side than the goalie to score.
let pk = {};
const PK_P = [[3, 1, 3], [2, 1, 2]];   // [row][col]: top corners 3, bottom corners 2, middle 1
const PK_FLY = 560;
function pkSetup() {
  const g = pkGeo(), now = performance.now();
  pk = { left: 5, fly: null, wait: 0, dive: null, hover: null, msg: null, flash: null, ripple: null, streak: 0,
    gx: g.x0 + g.w / 2, gt: g.x0 + g.w / 2, gNext: now + 500, step: 0 };
}
function pkGeo() { const x0 = W * 0.12, x1 = W * 0.88, y0 = H * 0.3, y1 = H * 0.7; return { x0, x1, y0, y1, w: x1 - x0, h: y1 - y0 }; }
function pkZone(x, y) {
  const g = pkGeo(); if (x < g.x0 || x > g.x1 || y < g.y0 || y > g.y1) return null;
  const col = Math.min(2, Math.floor((x - g.x0) / (g.w / 3))), row = y < g.y0 + g.h / 2 ? 0 : 1;
  return { col, row, p: PK_P[row][col] };
}
const pkBox = (g, c, r) => ({ x: g.x0 + g.w * c / 3, y: g.y0 + g.h * r / 2, w: g.w / 3, h: g.h / 2 });
const pkHash = n => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };

// night stadium: stands full of fans, floodlights, LED boards, mowed grass in perspective
function pkScene(now) {
  const bot = H * 0.24;
  const sky = ctx.createLinearGradient(0, 0, 0, bot); sky.addColorStop(0, '#03060e'); sky.addColorStop(1, '#101a30');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, bot);
  // stands: tiers of fans (head + shoulders), darker toward the back
  const SKIN = ['#f1c9a5', '#e0a878', '#c68642', '#8d5524', '#ffdbac'], SHIRT = ['#ff4d3d', '#ffcc33', '#2fd4ff', '#ffffff', '#1b2a4a', '#ff8a2a', '#3be37a'];
  for (let r = 0, y = 26; y < bot - 18; y += 9, r++) {
    const shade = 0.45 + 0.5 * (y / bot);
    ctx.fillStyle = 'rgba(30,40,60,' + (0.6 * shade) + ')'; ctx.fillRect(0, y + 3, W, 2);
    for (let i = 0, x = (r % 2) * 5 + 3; x < W; x += 10, i++) {
      const h1 = pkHash(i * 31 + r * 7), jump = Math.sin(now / 200 + i * 1.3 + r * 2) > 0.92 ? 2.5 : 0;
      ctx.globalAlpha = shade;
      ctx.fillStyle = SHIRT[Math.floor(h1 * SHIRT.length)]; ctx.beginPath(); ctx.roundRect(x - 4, y - jump, 8, 6, 3); ctx.fill();
      ctx.fillStyle = SKIN[Math.floor(pkHash(i + r * 13) * SKIN.length)]; ctx.beginPath(); ctx.arc(x, y - 3 - jump, 2.8, 0, 7); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  // floodlight glow
  for (const lx of [W * 0.06, W * 0.94]) {
    const lg = ctx.createRadialGradient(lx, 6, 2, lx, 6, W * 0.35); lg.addColorStop(0, 'rgba(255,250,225,.55)'); lg.addColorStop(0.2, 'rgba(255,250,225,.18)'); lg.addColorStop(1, 'rgba(255,250,225,0)');
    ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H * 0.6);
    ctx.fillStyle = '#fffbe6'; for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { ctx.beginPath(); ctx.arc(lx - 10 + i * 10, 6 + j * 8, 3.2, 0, 7); ctx.fill(); }
  }
  // LED ad boards
  const ab = ctx.createLinearGradient(0, bot - 18, 0, bot); ab.addColorStop(0, '#0b1730'); ab.addColorStop(1, '#050b18');
  ctx.fillStyle = ab; ctx.fillRect(0, bot - 18, W, 18);
  ctx.fillStyle = 'rgba(255,255,255,.08)'; for (let x = 0; x < W; x += W / 6) ctx.fillRect(x, bot - 18, 2, 18);
  ctx.fillStyle = '#ffcc33'; ctx.font = '700 11px ' + F; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  const msg = '  FUNCTION ARENA  ·  ONE INPUT, ONE OUTPUT  ·  VERTICAL LINE TEST  ·  GO TEAM  ·', mw = ctx.measureText(msg).width, off = (now / 30) % mw;
  for (let x = -off; x < W; x += mw) ctx.fillText(msg, x, bot - 9);
  ctx.textBaseline = 'alphabetic';
  // grass: mowing stripes that get wider as they come closer
  const n = 12;
  for (let k = 0; k < n; k++) {
    const ya = bot + (H - bot) * Math.pow(k / n, 1.5), yb = bot + (H - bot) * Math.pow((k + 1) / n, 1.5);
    ctx.fillStyle = k % 2 ? '#2e8b3e' : '#37a049'; ctx.fillRect(0, ya, W, yb - ya + 1);
  }
  const gl = ctx.createRadialGradient(W / 2, H * 0.55, 10, W / 2, H * 0.55, W * 0.7); gl.addColorStop(0, 'rgba(255,255,220,.10)'); gl.addColorStop(1, 'rgba(0,0,0,.28)');
  ctx.fillStyle = gl; ctx.fillRect(0, bot, W, H - bot);
}
// a shaded ball whose pattern turns as it spins
function pkBall(x, y, r, spin) {
  ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.arc(x + r * 0.12, y + r * 0.12, r, 0, 7); ctx.fill();
  const bg = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); bg.addColorStop(0, '#ffffff'); bg.addColorStop(0.7, '#e9edf2'); bg.addColorStop(1, '#aeb6c2');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip();
  ctx.fillStyle = '#1d222b';
  const pent = (cx, cy, s) => { ctx.beginPath(); for (let i = 0; i < 5; i++) { const a = spin - Math.PI / 2 + i * Math.PI * 2 / 5; ctx.lineTo(cx + Math.cos(a) * s, cy + Math.sin(a) * s); } ctx.fill(); };
  pent(x, y, r * 0.34);
  for (let i = 0; i < 5; i++) { const a = spin - Math.PI / 2 + i * Math.PI * 2 / 5 + Math.PI / 5; pent(x + Math.cos(a) * r * 0.95, y + Math.sin(a) * r * 0.95, r * 0.3); }
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.ellipse(x - r * 0.38, y - r * 0.42, r * 0.22, r * 0.13, -0.6, 0, 7); ctx.fill();
}
// the goalie: crouched and ready, stepping as he shuffles; arms stretched out while diving
function pkKeeper(x, footY, h, tilt, reach, step) {
  const w = h * 0.3, sk = '#d9a273';
  ctx.save(); ctx.translate(x, footY);
  ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(0, 2, w * 1.2, h * 0.04, 0, 0, 7); ctx.fill();
  ctx.rotate(tilt); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // legs: hips -> bent knees -> feet, one foot lifting as he steps
  const lift = Math.max(0, Math.sin(step)) * h * 0.05, lift2 = Math.max(0, -Math.sin(step)) * h * 0.05;
  ctx.strokeStyle = '#141f38'; ctx.lineWidth = w * 0.3;
  ctx.beginPath(); ctx.moveTo(-w * 0.22, -h * 0.44); ctx.lineTo(-w * 0.5, -h * 0.24 - lift); ctx.lineTo(-w * 0.42, -h * 0.04 - lift); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w * 0.22, -h * 0.44); ctx.lineTo(w * 0.5, -h * 0.24 - lift2); ctx.lineTo(w * 0.42, -h * 0.04 - lift2); ctx.stroke();
  ctx.strokeStyle = '#f2f2f2'; ctx.lineWidth = w * 0.27;
  ctx.beginPath(); ctx.moveTo(-w * 0.47, -h * 0.17 - lift); ctx.lineTo(-w * 0.43, -h * 0.06 - lift); ctx.moveTo(w * 0.47, -h * 0.17 - lift2); ctx.lineTo(w * 0.43, -h * 0.06 - lift2); ctx.stroke();
  ctx.fillStyle = '#0d0d0d'; ctx.beginPath(); ctx.ellipse(-w * 0.5, -h * 0.025 - lift, w * 0.24, h * 0.03, 0, 0, 7); ctx.ellipse(w * 0.5, -h * 0.025 - lift2, w * 0.24, h * 0.03, 0, 0, 7); ctx.fill();
  // shorts
  ctx.fillStyle = '#141f38'; ctx.beginPath(); ctx.roundRect(-w * 0.52, -h * 0.52, w * 1.04, h * 0.13, w * 0.1); ctx.fill();
  // arms (behind the body while ready, stretched while diving)
  const arm = reach ? [[-w * 0.45, -h * 0.78, -w * 1.95, -h * 1.0], [w * 0.45, -h * 0.78, w * 1.95, -h * 1.02]]
                    : [[-w * 0.45, -h * 0.76, -w * 1.15, -h * 0.6], [w * 0.45, -h * 0.76, w * 1.15, -h * 0.6]];
  ctx.strokeStyle = '#e06f12'; ctx.lineWidth = w * 0.26;
  for (const a of arm) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo((a[0] + a[2]) / 2, (a[1] + a[3]) / 2 + (reach ? -h * 0.03 : h * 0.06), a[2], a[3]); ctx.stroke(); }
  // jersey with shading, stripe and number
  const jg = ctx.createLinearGradient(-w * 0.6, 0, w * 0.6, 0); jg.addColorStop(0, '#d9620d'); jg.addColorStop(0.45, '#ff8a2a'); jg.addColorStop(1, '#c95a0a');
  ctx.fillStyle = jg; ctx.beginPath(); ctx.roundRect(-w * 0.58, -h * 0.84, w * 1.16, h * 0.37, w * 0.22); ctx.fill();
  ctx.fillStyle = 'rgba(20,31,56,.85)'; ctx.fillRect(-w * 0.58, -h * 0.63, w * 1.16, h * 0.03);
  ctx.fillStyle = '#141f38'; ctx.font = '700 ' + Math.round(h * 0.12) + 'px ' + F; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('1', 0, -h * 0.72); ctx.textBaseline = 'alphabetic';
  // gloves
  for (const a of arm) {
    ctx.fillStyle = '#f7f7f7'; ctx.beginPath(); ctx.ellipse(a[2], a[3], w * 0.24, w * 0.3, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#2bb35c'; ctx.beginPath(); ctx.ellipse(a[2], a[3] + w * 0.08, w * 0.17, w * 0.12, 0, 0, 7); ctx.fill();
  }
  // head: neck, face, hair, eyes looking at you
  ctx.fillStyle = sk; ctx.fillRect(-w * 0.1, -h * 0.88, w * 0.2, h * 0.05);
  ctx.beginPath(); ctx.arc(0, -h * 0.93, w * 0.3, 0, 7); ctx.fill();
  ctx.fillStyle = '#2b1a0e'; ctx.beginPath(); ctx.arc(0, -h * 0.955, w * 0.31, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
  ctx.fillStyle = '#1a1a1a'; ctx.beginPath(); ctx.arc(-w * 0.1, -h * 0.925, w * 0.035, 0, 7); ctx.arc(w * 0.1, -h * 0.925, w * 0.035, 0, 7); ctx.fill();
  ctx.restore(); ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
}
function pkDraw(now) {
  ctx.clearRect(0, 0, W, H); const g = pkGeo();
  let shake = 0; if (pk.flash && pk.flash.c === 'goal') shake = Math.max(0, 1 - (now - pk.flash.t) / 300) * 5;
  ctx.save(); if (shake) ctx.translate(rnd(-shake, shake), rnd(-shake, shake));
  pkScene(now);
  // pitch markings: goal line, six-yard box, penalty box edges
  ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, g.y1 + 2); ctx.lineTo(W, g.y1 + 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(g.x0 - W * 0.04, g.y1 + 2); ctx.lineTo(g.x0 - W * 0.08, g.y1 + H * 0.09); ctx.lineTo(g.x1 + W * 0.08, g.y1 + H * 0.09); ctx.lineTo(g.x1 + W * 0.04, g.y1 + 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W * 0.0, H * 0.93); ctx.lineTo(W * 0.03, g.y1 + 2); ctx.moveTo(W, H * 0.93); ctx.lineTo(W * 0.97, g.y1 + 2); ctx.stroke();
  // net: shaded back panel with a diamond mesh, and side panels going back
  const d = g.w * 0.05, by0 = g.y0 + d * 0.6;
  ctx.fillStyle = 'rgba(8,16,30,.45)'; ctx.fillRect(g.x0, g.y0, g.w, g.h);
  ctx.save(); ctx.beginPath(); ctx.rect(g.x0, g.y0, g.w, g.h); ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1;
  for (let s = -g.h; s < g.w + g.h; s += 12) { ctx.beginPath(); ctx.moveTo(g.x0 + s, g.y0); ctx.lineTo(g.x0 + s + g.h, g.y1); ctx.moveTo(g.x0 + s, g.y0); ctx.lineTo(g.x0 + s - g.h, g.y1); ctx.stroke(); }
  ctx.restore();
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(g.x0, g.y0, g.w, d * 0.6);
  for (const [px, ix] of [[g.x0, g.x0 + d], [g.x1, g.x1 - d]]) {
    ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.moveTo(px, g.y0); ctx.lineTo(ix, by0); ctx.lineTo(ix, g.y1); ctx.lineTo(px, g.y1); ctx.fill();
  }
  // shadow of the frame on the grass
  ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.moveTo(g.x0, g.y1 + 2); ctx.lineTo(g.x1, g.y1 + 2); ctx.lineTo(g.x1 + W * 0.05, g.y1 + 14); ctx.lineTo(g.x0 + W * 0.05, g.y1 + 14); ctx.fill();
  // net ripple where the ball went in
  if (pk.ripple) { const t = (now - pk.ripple.t) / 700; if (t < 1) { ctx.strokeStyle = 'rgba(255,255,255,' + (0.9 * (1 - t)) + ')'; ctx.lineWidth = 2.5; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(pk.ripple.x, pk.ripple.y, 8 + t * 55 + k * 12, 0, 7); ctx.stroke(); } } }
  // the 6 target boxes (light, so the goal still looks real)
  const ready = running && !pk.fly && pk.left > 0, pulse = 0.5 + 0.5 * Math.sin(now / 250);
  const boxes = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
    const b = pkBox(g, c, r), p = PK_P[r][c], hov = pk.hover && pk.hover.row === r && pk.hover.col === c;
    const hit = pk.fly && pk.fly.z && pk.fly.z.row === r && pk.fly.z.col === c;
    if (hit || hov) { ctx.fillStyle = 'rgba(255,204,51,.25)'; ctx.fillRect(b.x + 6, b.y + 6, b.w - 12, b.h - 12); }
    ctx.setLineDash([7, 7]); ctx.lineWidth = hov || hit ? 3 : 1.5;
    ctx.strokeStyle = hov || hit ? '#ffcc33' : 'rgba(255,255,255,' + (ready ? 0.3 + 0.3 * pulse : 0.25) + ')';
    ctx.strokeRect(b.x + 6, b.y + 6, b.w - 12, b.h - 12); ctx.setLineDash([]);
    boxes.push([b, p]);
  }
  // goalie: shuffles side to side until you kick, then dives
  const kh = Math.min(g.h * 0.82, g.w * 0.5);
  let gx = pk.gx, tilt = 0, lift = 0, reach = false;
  if (pk.dive) { const t = clamp((now - pk.dive.t) / 360, 0, 1); gx = pk.dive.from + (pk.dive.to - pk.dive.from) * t; tilt = pk.dive.tilt * t; lift = Math.sin(Math.PI * t) * kh * (pk.dive.col === 1 ? 0.12 : 0.16); reach = true; }
  pkKeeper(gx, g.y1 - lift, kh, tilt, reach, pk.dive ? 0 : pk.step);
  // points on dark tags so they can always be read
  for (const [b, p] of boxes) {
    const sz = Math.round(clamp(b.h * 0.2, 13, 24)), txt = p + (p === 1 ? ' PT' : ' PTS'), cx = b.x + b.w / 2, cy = b.y + (b.y === g.y0 ? sz * 0.9 + 8 : b.h - sz * 0.9 - 8);
    ctx.font = '700 ' + sz + 'px ' + F; const tw = ctx.measureText(txt).width;
    ctx.fillStyle = 'rgba(5,10,22,.62)'; ctx.beginPath(); ctx.roundRect(cx - tw / 2 - 8, cy - sz * 0.62, tw + 16, sz * 1.24, sz * 0.5); ctx.fill();
    label(txt, cx, cy, sz, p === 3 ? '#ffcc33' : p === 2 ? '#2fd4ff' : '#fff');
  }
  // round posts + crossbar with shading
  const pw = Math.max(7, W * 0.009);
  const post = (x1, y1, x2, y2) => { const vg = x1 === x2 ? ctx.createLinearGradient(x1 - pw / 2, 0, x1 + pw / 2, 0) : ctx.createLinearGradient(0, y1 - pw / 2, 0, y1 + pw / 2);
    vg.addColorStop(0, '#c9d1dc'); vg.addColorStop(0.4, '#ffffff'); vg.addColorStop(1, '#9aa5b4'); ctx.strokeStyle = vg; ctx.lineWidth = pw; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.lineCap = 'butt'; };
  post(g.x0, g.y1, g.x0, g.y0); post(g.x1, g.y1, g.x1, g.y0); post(g.x0, g.y0, g.x1, g.y0);
  // penalty spot, ball and your boot
  const br = clamp(W * 0.03, 16, 26), bx = W / 2, by = H - 64;
  ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.ellipse(bx, H - 48, 11, 4, 0, 0, 7); ctx.fill();
  const f = pk.fly;
  if (f) {
    const t = clamp((now - f.t) / PK_FLY, 0, 1);
    const at = u => [bx + (f.x - bx) * u + Math.sin(Math.PI * u) * f.curve, by + (f.y - by) * u - Math.sin(Math.PI * u) * 26, br * (1 - 0.5 * u)];
    if (!f.done || f.goal) {
      const u = f.done ? 1 : t;
      for (let k = 3; k >= 1; k--) { const [x, y, r] = at(Math.max(0, u - k * 0.05)); ctx.fillStyle = 'rgba(255,255,255,' + (0.06 * (4 - k)) + ')'; ctx.beginPath(); ctx.arc(x, y, r * 0.9, 0, 7); ctx.fill(); }
      const [x, y, r] = at(u), gy = (H - 48) + (g.y1 - (H - 48)) * u;
      ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(x, gy, r * 0.9, r * 0.28, 0, 0, 7); ctx.fill();
      pkBall(x, y, r, u * 9);
    } else {   // saved: the ball bounces back off the gloves
      const s = (now - f.doneAt) / 1000, [x0, y0, r] = at(1);
      pkBall(x0 + f.bounce * s, y0 - 380 * s + 900 * s * s, r, 9 + s * 12);
    }
  } else if (pk.left > 0) { ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(bx + 3, by + br * 0.9, br, br * 0.3, 0, 0, 7); ctx.fill(); pkBall(bx, by, br, 0); }
  // your leg: sock, shin pad and boot, swinging through on the kick
  let ka = -0.5; if (f) { const t = (now - f.t) / 160; ka = t < 1 ? -0.5 + 1.3 * t : 0.8 - Math.min(1, (t - 1) / 4) * 1.3; }
  ctx.save(); ctx.translate(bx - br * 2.6, by + br * 2.4); ctx.rotate(ka); ctx.lineCap = 'round';
  ctx.strokeStyle = '#141f38'; ctx.lineWidth = br * 1.05; ctx.beginPath(); ctx.moveTo(-br * 0.6, br * 2.4); ctx.lineTo(-br * 0.4, br * 1.4); ctx.stroke();
  ctx.strokeStyle = '#f2f2f2'; ctx.lineWidth = br * 0.95; ctx.beginPath(); ctx.moveTo(-br * 0.4, br * 1.4); ctx.lineTo(0, -br * 1.5); ctx.stroke();
  ctx.strokeStyle = '#ff4d3d'; ctx.lineWidth = br * 0.95; ctx.beginPath(); ctx.moveTo(-br * 0.12, -br * 0.3); ctx.lineTo(-br * 0.02, -br * 0.8); ctx.stroke();
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(br * 0.35, -br * 1.95, br * 0.8, br * 0.46, 0.2, 0, 7); ctx.fill();
  ctx.fillStyle = '#ffcc33'; ctx.beginPath(); ctx.ellipse(br * 0.3, -br * 1.95, br * 0.4, br * 0.1, 0.2, 0, 7); ctx.fill();
  ctx.restore(); ctx.lineCap = 'butt';
  // what to do / what happened
  if (pk.msg) label(pk.msg.big, W / 2, g.y1 + 44, 34, pk.msg.c);
  if (pk.msg && pk.msg.small) label(pk.msg.small, W / 2, g.y1 + 80, 18, '#fff');
  else if (ready) {
    const fs = Math.round(clamp(W * 0.03, 15, 22)), tx = 'TAP A BOX IN THE GOAL TO SHOOT';
    ctx.font = '700 ' + fs + 'px ' + F; const tw = ctx.measureText(tx).width + fs * 1.4;
    ctx.fillStyle = 'rgba(8,20,12,.55)'; ctx.beginPath(); ctx.roundRect(W / 2 - tw / 2, g.y1 + 44 - fs * 0.85, tw, fs * 1.7, fs * 0.85); ctx.fill();
    label(tx, W / 2, g.y1 + 44, fs, 'rgba(255,255,255,' + (0.7 + 0.3 * pulse) + ')');
  }
  if (pk.streak >= 2) label('🔥 ' + pk.streak + ' goals in a row', 110, H - 24, 17, '#ffcc33');
  label('KICKS ' + pk.left, W - 60, H - 24, 18, '#fff');
  ctx.restore();
  if (pk.flash) { const t = (now - pk.flash.t) / 300; if (t < 1) { ctx.fillStyle = (pk.flash.c === 'goal' ? 'rgba(255,204,51,' : 'rgba(47,212,255,') + (0.22 * (1 - t)) + ')'; ctx.fillRect(0, 0, W, H); } }
}
function pkTap(p) {
  if (pk.fly || pk.left <= 0) return;
  const g = pkGeo(), z = pkZone(p.x, p.y), now = performance.now();
  if (!z) { float(p.x, p.y, 'Tap inside the goal', '#fff'); return; }   // a miss-tap doesn't use up a kick
  // aim at the middle of the box you picked, with a little bend on the way
  const b = pkBox(g, z.col, z.row);
  pk.left--; pk.msg = null; pk.fly = { x: b.x + b.w / 2, y: b.y + b.h / 2, z, t: now, curve: (z.col - 1) * -W * 0.04 };
  // the goalie usually dives the way he is leaning (half the time), otherwise one of the other two
  const off = (pk.gx - (g.x0 + g.w / 2)) / (g.w / 3), lean = off < -0.2 ? 0 : off > 0.2 ? 2 : 1;
  const others = [0, 1, 2].filter(c => c !== lean), guess = Math.random() < 0.5 ? lean : others[Math.floor(Math.random() * 2)];
  pk.dive = { from: pk.gx, to: g.x0 + g.w * (guess + 0.5) / 3, t: now + 90, tilt: guess === 0 ? -1.15 : guess === 2 ? 1.15 : 0, col: guess };
}
const PK_SIDE = ['left', 'middle', 'right'];
function pkTick(now, dt) {
  const f = pk.fly, g = pkGeo();
  // shuffle: pick a new spot every so often and step toward it
  if (!pk.dive) {
    if (now >= pk.gNext) { pk.gt = g.x0 + g.w / 2 + rnd(-1, 1) * g.w * 0.26; pk.gNext = now + rnd(500, 1000); }
    const dx = pk.gt - pk.gx, sp = g.w * 0.45 * (dt || 0.016);
    if (Math.abs(dx) > 1) { pk.gx += Math.sign(dx) * Math.min(Math.abs(dx), sp); pk.step += (dt || 0.016) * 16; }
  }
  if (f && now - f.t >= PK_FLY && !f.done) {
    f.done = true; f.doneAt = now;
    if (pk.dive.col === f.z.col) {
      pk.streak = 0; f.bounce = (f.z.col === 0 ? -1 : f.z.col === 2 ? 1 : (Math.random() < 0.5 ? -1 : 1)) * W * 0.35;
      pk.msg = { big: 'SAVED!', c: '#2fd4ff', small: 'The goalie dove ' + PK_SIDE[pk.dive.col] + ' too. Shoot away from where he leans!' };
      pk.flash = { c: 'save', t: now };
    } else {
      f.goal = true; pts += f.z.p; pk.streak++;
      pk.msg = { big: 'GOAL! +' + f.z.p, c: '#ffcc33', small: 'The goalie dove ' + PK_SIDE[pk.dive.col] + '.' };
      pk.ripple = { x: f.x, y: f.y, t: now }; pk.flash = { c: 'goal', t: now }; confetti(f.x, f.y, 22);
    }
    pk.wait = now + 1600;
  }
  if (f && f.done && now >= pk.wait) { pk.fly = null; pk.dive = null; pk.msg = null; if (pk.left <= 0) { pkDraw(now); return finish(pts >= 9 ? 'Hat trick hero!' : pts ? 'Nice finishing!' : 'The goalie was on fire!'); } }
  hud(pk.left + ' kicks left'); bar(1 - pk.left / 5); pkDraw(now);
}

/* ---------------- 3. Home Run Derby ---------------- */
let hr = {};
function hrSetup() { hr = { left: 6, pitch: null, wait: performance.now() + 700, swing: 0, hit: null }; }
function hrGeo() { return { px: W / 2, py: H * 0.4, plate: H * 0.86, sweet: H * 0.76, zone: H * 0.045 }; }
function hrDraw(now) {
  ctx.clearRect(0, 0, W, H); const g = hrGeo();
  stadium(now, { crowdBot: H * 0.22 });
  const wl = ctx.createLinearGradient(0, H * 0.22, 0, H * 0.22 + 12); wl.addColorStop(0, '#1f6a33'); wl.addColorStop(1, '#123d1d');
  ctx.fillStyle = wl; ctx.fillRect(0, H * 0.22, W, 12);  // outfield wall
  ctx.fillStyle = '#ffcc33'; ctx.fillRect(0, H * 0.22, W, 2);
  grass(H * 0.22 + 12, H, 12);
  const dirt = ctx.createLinearGradient(0, H * 0.34, 0, H); dirt.addColorStop(0, '#a8703f'); dirt.addColorStop(1, '#c98f58');
  ctx.fillStyle = dirt; ctx.beginPath(); ctx.moveTo(W / 2, H * 0.34); ctx.lineTo(W * 0.92, H); ctx.lineTo(W * 0.08, H); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#34964a'; ctx.beginPath(); ctx.moveTo(W / 2, H * 0.5); ctx.lineTo(W * 0.74, H); ctx.lineTo(W * 0.26, H); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(W / 2, H * 0.34); ctx.lineTo(W * 0.92, H); ctx.moveTo(W / 2, H * 0.34); ctx.lineTo(W * 0.08, H); ctx.stroke();
  // bases
  for (const [bx, by] of [[W * 0.71, H * 0.66], [W * 0.29, H * 0.66], [W / 2, H * 0.47]]) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(bx, by - 6); ctx.lineTo(bx + 9, by); ctx.lineTo(bx, by + 6); ctx.lineTo(bx - 9, by); ctx.fill(); }
  const md = ctx.createRadialGradient(g.px, g.py + 4, 2, g.px, g.py + 6, 32); md.addColorStop(0, '#d39a62'); md.addColorStop(1, '#a8703f');
  ctx.fillStyle = md; ctx.beginPath(); ctx.ellipse(g.px, g.py + 6, 32, 10, 0, 0, 7); ctx.fill();
  // pitcher: cap, jersey, glove
  shadow(g.px, g.py - 6, 12, 3);
  ctx.fillStyle = '#1b2a4a'; ctx.fillRect(g.px - 6, g.py - 16, 5, 10); ctx.fillRect(g.px + 1, g.py - 16, 5, 10);
  const jg = ctx.createLinearGradient(g.px - 8, 0, g.px + 8, 0); jg.addColorStop(0, '#ffffff'); jg.addColorStop(1, '#c9d1e0');
  ctx.fillStyle = jg; ctx.beginPath(); ctx.roundRect(g.px - 8, g.py - 32, 16, 18, 4); ctx.fill();
  ctx.fillStyle = '#ff4d3d'; ctx.fillRect(g.px - 1, g.py - 32, 2, 18);
  ctx.fillStyle = '#7a4a1c'; ctx.beginPath(); ctx.arc(g.px + 11, g.py - 24, 4.5, 0, 7); ctx.fill();
  ctx.fillStyle = '#e0a878'; ctx.beginPath(); ctx.arc(g.px, g.py - 37, 6, 0, 7); ctx.fill();
  ctx.fillStyle = '#ff4d3d'; ctx.beginPath(); ctx.arc(g.px, g.py - 39, 6.2, Math.PI, 0); ctx.fill(); ctx.fillRect(g.px - 1, g.py - 40, 10, 2.5);
  // sweet zone
  const glow = 0.25 + 0.15 * Math.sin(now / 150);
  ctx.fillStyle = 'rgba(255,204,51,' + glow + ')'; ctx.fillRect(W / 2 - 60, g.sweet - g.zone, 120, g.zone * 2);
  ctx.strokeStyle = 'rgba(255,204,51,.8)'; ctx.lineWidth = 2; ctx.strokeRect(W / 2 - 60, g.sweet - g.zone, 120, g.zone * 2);
  // plate
  ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 2; ctx.strokeRect(W / 2 - 70, g.plate - 34, 36, 60); ctx.strokeRect(W / 2 + 34, g.plate - 34, 36, 60);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(W / 2 - 22, g.plate); ctx.lineTo(W / 2 + 22, g.plate); ctx.lineTo(W / 2 + 22, g.plate + 8); ctx.lineTo(W / 2, g.plate + 18); ctx.lineTo(W / 2 - 22, g.plate + 8); ctx.closePath(); ctx.fill();
  // ball
  if (hr.pitch) { const t = (now - hr.pitch.t) / hr.pitch.dur, y = g.py - 20 + (H + 30 - g.py) * t; hr.pitch.y = y; ballBaseball(g.px + Math.sin(t * 3) * hr.pitch.curve, y, 5 + 11 * t); }
  if (hr.hit) { const t = clamp((now - hr.hit.t) / 900, 0, 1); ballBaseball(W / 2 + hr.hit.dx * t, g.sweet - (g.sweet - H * 0.05) * Math.sin(t * Math.PI / 2) * hr.hit.h, 14 - 10 * t); }
  // bat
  const sw = clamp((now - hr.swing) / 180, 0, 1), ang = hr.swing && sw < 1 ? -1.2 + 2.6 * sw : -1.2;
  ctx.save(); ctx.translate(W / 2 + 70, g.sweet + 10); ctx.rotate(Math.PI + ang);
  const batg = ctx.createLinearGradient(0, -8, 0, 8); batg.addColorStop(0, '#f0c27a'); batg.addColorStop(0.5, '#d8a35a'); batg.addColorStop(1, '#9a6a2c');
  ctx.fillStyle = batg; ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(80, -6); ctx.quadraticCurveTo(114, -9, 114, 0); ctx.quadraticCurveTo(114, 9, 80, 6); ctx.lineTo(0, 3); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#222'; ctx.fillRect(-4, -5, 18, 10); ctx.restore();
  // swing button
  const bx = W - 90, by = H - 46;
  ctx.fillStyle = '#ff4d3d'; ctx.beginPath(); ctx.roundRect(bx - 62, by - 24, 124, 48, 10); ctx.fill(); label('SWING', bx, by + 1, 22, '#fff');
  label('PITCHES ' + hr.left, 70, H - 24, 18, '#fff');
}
function ballBaseball(x, y, r) {
  const bg = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); bg.addColorStop(0, '#ffffff'); bg.addColorStop(0.7, '#f1efe6'); bg.addColorStop(1, '#b9b5a8');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  if (r > 7) { ctx.strokeStyle = '#d23a1a'; ctx.lineWidth = 1.5; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.arc(x - r * 1.1, y, r * 0.8, -0.6, 0.6); ctx.stroke(); ctx.beginPath(); ctx.arc(x + r * 1.1, y, r * 0.8, Math.PI - 0.6, Math.PI + 0.6); ctx.stroke(); ctx.setLineDash([]); }
}
function hrSwing() {
  const now = performance.now(); if (!running || (hr.swing && now - hr.swing < 400)) return;
  hr.swing = now; const p = hr.pitch, g = hrGeo();
  if (!p || p.done) return;
  const err = Math.abs(p.y - g.sweet) / H; p.done = true;
  if (err < 0.03) { pts += 3; hr.hit = { t: now, dx: rnd(-W * 0.3, W * 0.3), h: 1 }; float(W / 2, H * 0.3, 'HOME RUN! +3', '#ffcc33'); confetti(W / 2, g.sweet, 20); }
  else if (err < 0.075) { pts += 1; hr.hit = { t: now, dx: rnd(-W * 0.4, W * 0.4), h: 0.55 }; float(W / 2, H * 0.42, 'Base hit! +1', '#3be37a'); }
  else float(W / 2, g.sweet - 40, p.y < g.sweet ? 'Too early!' : 'Too late!', '#fff');
  hr.pitch = null; hr.wait = now + 1000;
}
function hrTick(now) {
  const g = hrGeo();
  if (!hr.pitch && now >= hr.wait) {
    if (hr.left <= 0) { hrDraw(now); return finish(pts >= 9 ? 'Derby champion!' : pts ? 'Nice hitting!' : 'Strikeout city!'); }
    hr.left--; hr.hit = null; hr.pitch = { t: now, dur: rnd(850, 1350), curve: rnd(-12, 12) };
  }
  if (hr.pitch && now - hr.pitch.t > hr.pitch.dur) { float(W / 2, g.sweet - 40, 'Strike!', '#fff'); hr.pitch = null; hr.wait = now + 800; }
  hud(hr.left + ' pitches left'); bar(1 - hr.left / 6); hrDraw(now);
}

/* ---------------- 4. Field Goal ---------------- */
let fg = {};
const FG_W = [0.23, 0.2, 0.17, 0.14, 0.12], FG_P = [2, 2, 2, 3, 3], FG_YD = [20, 30, 40, 45, 50];
function fgSetup() { fg = { i: 0, fly: null, wait: 0, t0: performance.now(), wind: rnd(-1, 1) }; }
function fgGeo() { return { cy: H * 0.42, top: H * 0.12, bx: W / 2, by: H - 70, maxA: 0.6 }; }
function fgAngle(now) { const sp = 1 + fg.i * 0.3; return Math.sin((now - fg.t0) / 430 * sp) * fgGeo().maxA; }
function fgDraw(now) {
  ctx.clearRect(0, 0, W, H); const g = fgGeo(), i = Math.min(fg.i, 4), uw = W * FG_W[i];
  stadium(now, { crowdBot: H * 0.26 }); grass(H * 0.26, H, 10);
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2;
  for (let k = 1; k < 7; k++) { const y = H * 0.26 + (H * 0.74) * Math.pow(k / 7, 1.5); ctx.lineWidth = 1 + 2 * k / 7; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '700 ' + Math.round(10 + 14 * k / 7) + 'px ' + F; ctx.textAlign = 'center'; const yd = 60 - k * 10; if (k > 1 && yd > 0) { ctx.fillText(String(yd), W * 0.12, y - 6); ctx.fillText(String(yd), W * 0.88, y - 6); } }
  // goal post base pad and shadow
  shadow(W / 2 + 14, H * 0.6 + 2, uw * 0.35, 5, 0.22);
  ctx.fillStyle = '#1b2a4a'; ctx.beginPath(); ctx.roundRect(W / 2 - 7, H * 0.55, 14, H * 0.05 + 2, 3); ctx.fill();
  // uprights
  ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(W / 2 + 3, H * 0.6); ctx.lineTo(W / 2 + 3, g.cy + 3); ctx.moveTo(W / 2 - uw / 2 + 3, g.cy + 3); ctx.lineTo(W / 2 + uw / 2 + 3, g.cy + 3); ctx.moveTo(W / 2 - uw / 2 + 3, g.cy + 3); ctx.lineTo(W / 2 - uw / 2 + 3, g.top + 3); ctx.moveTo(W / 2 + uw / 2 + 3, g.cy + 3); ctx.lineTo(W / 2 + uw / 2 + 3, g.top + 3); ctx.stroke();
  for (const sx of [W / 2 - uw / 2, W / 2 + uw / 2]) { ctx.fillStyle = '#ff4d3d'; ctx.beginPath(); ctx.moveTo(sx, g.top); ctx.lineTo(sx + 12 + 4 * Math.sin(now / 150), g.top + 4); ctx.lineTo(sx, g.top + 9); ctx.fill(); }
  ctx.strokeStyle = '#ffcc33'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(W / 2, H * 0.6); ctx.lineTo(W / 2, g.cy); ctx.moveTo(W / 2 - uw / 2, g.cy); ctx.lineTo(W / 2 + uw / 2, g.cy);
  ctx.moveTo(W / 2 - uw / 2, g.cy); ctx.lineTo(W / 2 - uw / 2, g.top); ctx.moveTo(W / 2 + uw / 2, g.cy); ctx.lineTo(W / 2 + uw / 2, g.top); ctx.stroke(); ctx.lineCap = 'butt';
  // wind
  const wd = fg.wind, wx = 80, wy = H * 0.31;
  ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.roundRect(wx - 62, wy - 18, 124, 36, 8); ctx.fill();
  ctx.strokeStyle = '#2fd4ff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wx - 26 * Math.sign(wd || 1) * Math.abs(wd), wy); ctx.lineTo(wx + 26 * wd, wy); ctx.stroke();
  ctx.fillStyle = '#2fd4ff'; ctx.beginPath(); ctx.moveTo(wx + 26 * wd + 8 * Math.sign(wd), wy); ctx.lineTo(wx + 26 * wd, wy - 6); ctx.lineTo(wx + 26 * wd, wy + 6); ctx.fill();
  label('WIND', wx - 44, wy + 1, 12, '#c5d0e4');
  label(FG_YD[i] + ' YD · ' + FG_P[i] + ' PTS', W - 90, H * 0.31, 18, '#ffcc33');
  // ball
  if (fg.fly) {
    const f = fg.fly, t = clamp((now - f.t) / 850, 0, 1);
    const x = g.bx + (f.lx - g.bx) * t, y = g.by + (g.cy - 30 - g.by) * t - Math.sin(Math.PI * t) * H * 0.12;
    ballFootball(x, y, 14 * (1 - 0.55 * t), t * 10);
  } else if (fg.i < 5) {
    const a = fgAngle(now); ctx.save(); ctx.translate(g.bx, g.by); ctx.rotate(a);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(0, -H * 0.3); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(0, -H * 0.3 - 14); ctx.lineTo(-9, -H * 0.3); ctx.lineTo(9, -H * 0.3); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#ff4d3d'; ctx.beginPath(); ctx.moveTo(g.bx - 10, g.by + 20); ctx.lineTo(g.bx + 10, g.by + 20); ctx.lineTo(g.bx + 3, g.by + 6); ctx.lineTo(g.bx - 3, g.by + 6); ctx.fill();
    shadow(g.bx + 4, g.by + 20, 14, 4);
    ballFootball(g.bx, g.by, 14, -Math.PI / 2);
  }
}
function fgKick() {
  if (fg.fly || fg.i >= 5 || !running) return;
  const g = fgGeo(), a = fgAngle(performance.now());
  fg.fly = { t: performance.now(), lx: g.bx + Math.tan(a) * (g.by - g.cy) + fg.wind * W * 0.08 * (1 + fg.i * 0.2) };
}
function fgTick(now) {
  const f = fg.fly;
  if (f && now - f.t >= 850 && !f.done) {
    f.done = true; const uw = W * FG_W[fg.i], off = f.lx - W / 2;
    if (Math.abs(off) < uw / 2 - 4) { pts += FG_P[fg.i]; float(W / 2, H * 0.22, 'IT’S GOOD! +' + FG_P[fg.i], '#ffcc33'); confetti(W / 2, H * 0.3, 18); }
    else float(f.lx, H * 0.3, off < 0 ? 'Wide left' : 'Wide right', '#fff');
    fg.wait = now + 800;
  }
  if (f && f.done && now >= fg.wait) {
    fg.fly = null; fg.i++; fg.wind = rnd(-1, 1); fg.t0 = now;
    if (fg.i >= 5) { fgDraw(now); return finish(pts >= 9 ? 'Clutch kicker!' : pts ? 'Nice kicking!' : 'The wind won this time!'); }
  }
  hud((5 - fg.i) + ' kicks left'); bar(fg.i / 5); fgDraw(now);
}

/* ---------------- 5. Bowling ---------------- */
let bw = {};
function bwSetup() { bw = { left: 3, roll: null, wait: 0, pins: bwRack(), t0: performance.now() }; }
function bwRack() { const p = []; for (let r = 0; r < 4; r++) for (let j = 0; j <= r; j++) p.push({ r, c: j - r / 2, down: 0 }); return p; }
function bwGeo() { const lw = clamp(W * 0.36, 190, 300), s = Math.min(lw / 5.2, H * 0.1); return { lw, s, x0: W / 2 - lw / 2, headY: H * 0.62, by: H - 56, br: s * 0.42 }; }
function bwBallX(now) { const g = bwGeo(); return W / 2 + Math.sin((now - bw.t0) / 650) * (g.lw / 2 - g.br - 6); }
function bwDraw(now) {
  ctx.clearRect(0, 0, W, H); const g = bwGeo();
  stadium(now, { crowdBot: H * 0.2 });
  const y0 = H * 0.2;
  // neighbouring lanes, dim, with their own boards
  const side = ctx.createLinearGradient(0, y0, 0, H); side.addColorStop(0, '#3a2a1c'); side.addColorStop(1, '#6b4a2c');
  ctx.fillStyle = side; ctx.fillRect(0, y0, W, H - y0);
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1; for (let x = 0; x < W; x += 12) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, H); ctx.stroke(); }
  ctx.fillStyle = 'rgba(5,8,18,.55)'; ctx.fillRect(0, y0, W, H - y0);
  // pin deck back wall
  ctx.fillStyle = '#070a14'; ctx.fillRect(g.x0 - 22, y0, g.lw + 44, 16);
  // gutters: rounded channels
  for (const gx of [g.x0 - 22, g.x0 + g.lw]) { const gg = ctx.createLinearGradient(gx, 0, gx + 22, 0); gg.addColorStop(0, '#0b0f1c'); gg.addColorStop(0.5, '#2a3146'); gg.addColorStop(1, '#0b0f1c'); ctx.fillStyle = gg; ctx.fillRect(gx, y0 + 16, 22, H - y0 - 16); }
  const lg = ctx.createLinearGradient(g.x0, 0, g.x0 + g.lw, 0); lg.addColorStop(0, '#c89258'); lg.addColorStop(0.5, '#f2cf98'); lg.addColorStop(1, '#c89258');
  ctx.fillStyle = lg; ctx.fillRect(g.x0, y0 + 16, g.lw, H - y0 - 16);
  ctx.strokeStyle = 'rgba(120,70,20,.22)'; ctx.lineWidth = 1; for (let x = g.x0; x < g.x0 + g.lw; x += g.lw / 20) { ctx.beginPath(); ctx.moveTo(x, y0 + 16); ctx.lineTo(x, H); ctx.stroke(); }
  // glossy oil reflection of the lights
  const gloss = ctx.createLinearGradient(0, y0, 0, H); gloss.addColorStop(0, 'rgba(255,255,255,.28)'); gloss.addColorStop(0.35, 'rgba(255,255,255,0)'); gloss.addColorStop(0.7, 'rgba(255,255,255,.12)'); gloss.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gloss; ctx.fillRect(g.x0 + g.lw * 0.3, y0 + 16, g.lw * 0.4, H - y0 - 16);
  // approach dots
  ctx.fillStyle = 'rgba(80,40,10,.5)'; for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.arc(W / 2 + k * g.lw / 9, H - 14, 2.5, 0, 7); ctx.fill(); }
  for (let k = -2; k <= 2; k++) { const x = W / 2 + k * g.s * 0.8, y = H * 0.7; ctx.fillStyle = '#7a3a1a'; ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x - 6, y + 6); ctx.lineTo(x + 6, y + 6); ctx.fill(); }
  ctx.fillStyle = '#ff4d3d'; ctx.fillRect(g.x0, g.by - g.br - 14, g.lw, 3);
  // pins (back rows first)
  for (const p of bw.pins.slice().sort((a, b) => b.r - a.r)) {
    const x = W / 2 + p.c * g.s + (p.down ? p.dx || 0 : 0), y = g.headY - p.r * g.s * 0.85;
    if (p.down) { ctx.save(); ctx.translate(x, y); ctx.rotate(p.rot || 1.2); ctx.globalAlpha = 0.6; bwPin(0, 0, g.s); ctx.restore(); ctx.globalAlpha = 1; }
    else bwPin(x, y, g.s);
  }
  // ball
  let bx = null, by = g.by;
  if (bw.roll) { const t = clamp((now - bw.roll.t) / 900, 0, 1); bx = bw.roll.x; by = g.by + (g.headY - g.s * 3.5 - g.by) * t; }
  else if (bw.left > 0) bx = bwBallX(now);
  if (bx !== null) {
    const rr = g.br * (bw.roll ? 1 - 0.3 * clamp((now - bw.roll.t) / 900, 0, 1) : 1);
    shadow(bx + rr * 0.15, by + rr * 0.85, rr * 0.95, rr * 0.25, 0.3);
    const bg = ctx.createRadialGradient(bx - rr * 0.3, by - rr * 0.3, 1, bx, by, rr); bg.addColorStop(0, '#7a95ff'); bg.addColorStop(0.5, '#2c40b8'); bg.addColorStop(1, '#0d164f');
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(bx, by, rr, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(150,120,255,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx + rr * 0.1, by, rr * 0.6, 0.4, 2.2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.ellipse(bx - rr * 0.4, by - rr * 0.45, rr * 0.22, rr * 0.12, -0.6, 0, 7); ctx.fill();
    ctx.fillStyle = '#0a0f2e'; [[-0.25, -0.3], [0.2, -0.35], [0, 0.05]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(bx + a * rr, by + b * rr, rr * 0.12, 0, 7); ctx.fill(); });
  }
  label('ROLLS ' + bw.left, W - 60, H - 24, 18, '#fff');
}
function bwPin(x, y, s) {
  const h = s * 0.95, w = s * 0.32;
  shadow(x + w * 0.2, y + h * 0.38, w * 0.9, h * 0.1, 0.3);
  const pg = ctx.createLinearGradient(x - w, 0, x + w, 0); pg.addColorStop(0, '#d9dde6'); pg.addColorStop(0.35, '#ffffff'); pg.addColorStop(1, '#a9afbd');
  ctx.fillStyle = pg; ctx.beginPath(); ctx.ellipse(x, y, w, h * 0.4, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x, y - h * 0.5, w * 0.55, h * 0.2, 0, 0, 7); ctx.fill();
  ctx.fillRect(x - w * 0.32, y - h * 0.42, w * 0.64, h * 0.2);
  ctx.fillStyle = '#e22d2d'; ctx.fillRect(x - w * 0.45, y - h * 0.4, w * 0.9, h * 0.05); ctx.fillRect(x - w * 0.42, y - h * 0.32, w * 0.84, h * 0.05);
  ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(x, y, w, h * 0.4, 0, 0, 7); ctx.stroke();
}
function bwRoll() {
  if (bw.roll || bw.left <= 0 || !running) return;
  bw.left--; bw.roll = { t: performance.now(), x: bwBallX(performance.now()) };
}
function bwKnock(bx) {
  const g = bwGeo(), c = (bx - W / 2) / g.s;
  const hit = bw.pins.filter(p => Math.abs(p.c - c) < 0.62);
  hit.forEach(p => { p.down = 1; p.dx = (p.c - c) * g.s * 0.5; p.rot = (p.c >= c ? 1 : -1) * rnd(1, 1.6); });
  // each falling pin can take down the pins right behind it
  for (let r = 0; r < 4; r++) bw.pins.filter(p => p.down && p.r === r).forEach(p => {
    bw.pins.filter(o => !o.down && o.r === r + 1 && Math.abs(o.c - p.c) <= 0.5 && Math.random() < 0.85)
      .forEach(o => { o.down = 1; o.dx = (o.c - p.c) * g.s * 0.6; o.rot = (o.c >= p.c ? 1 : -1) * rnd(1, 1.6); });
  });
  if (Math.abs(c) < 0.18) bw.pins.forEach(p => { if (!p.down) { p.down = 1; p.rot = rnd(-1.6, 1.6); } });
  return bw.pins.filter(p => p.down).length;
}
function bwTick(now) {
  const f = bw.roll;
  if (f && now - f.t >= 900 && !f.done) {
    f.done = true; const n = bwKnock(f.x), g = bwGeo();
    const p = n === 10 ? 4 : n >= 7 ? 2 : n >= 3 ? 1 : 0; pts += p;
    float(W / 2, g.headY - g.s * 4.2, n === 10 ? 'STRIKE! +4' : n + (n === 1 ? ' pin' : ' pins') + (p ? ' +' + p : ''), n === 10 ? '#ffcc33' : '#fff');
    if (n === 10) confetti(W / 2, g.headY - g.s * 1.5, 24);
    bw.wait = now + 1100;
  }
  if (f && f.done && now >= bw.wait) { bw.roll = null; bw.pins = bwRack(); bw.t0 = now; if (bw.left <= 0) { bwDraw(now); return finish(pts >= 8 ? 'Bowling legend!' : pts ? 'Nice rolling!' : 'Gutter trouble!'); } }
  hud(bw.left + ' rolls left'); bar(1 - bw.left / 3); bwDraw(now);
}

/* ---------------- 6. Goalie Save ---------------- */
// You are in the goal looking out at the field. A striker winds up, a ring shows where the shot
// is going, and you slide your gloves there. Saves knock the ball away; 3 saves in a row = bonus.
let gl = {};
const GL_LEN = 12000, GL_WIND = 450;
function glSetup() { const now = performance.now(); gl = { shots: [], away: [], next: now + 700, end: now + GL_LEN, x: W / 2, y: H * 0.64, streak: 0, flash: null, kick: null, ripple: null }; }
function glGoal() { return { x0: W * 0.06, x1: W * 0.94, y0: H * 0.26, y1: H * 0.94 }; }
const glR = () => clamp(W * 0.055, 30, 48);
function glGlove(x, y, r, side, now, punch) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(side * 0.18); const s = punch ? 1.18 : 1; ctx.scale(s, s);
  // wrist band
  ctx.fillStyle = '#ff4d3d'; ctx.beginPath(); ctx.roundRect(-r * 0.55, r * 0.55, r * 1.1, r * 0.45, r * 0.12); ctx.fill();
  // palm
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(-r * 0.7, -r * 0.35, r * 1.4, r * 1.0, r * 0.35); ctx.fill();
  // fingers
  for (let f = 0; f < 4; f++) { const fx = -r * 0.62 + f * r * 0.36; ctx.beginPath(); ctx.roundRect(fx, -r * 1.05 + Math.abs(f - 1.5) * r * 0.12, r * 0.32, r * 0.85, r * 0.16); ctx.fill(); }
  // thumb
  ctx.beginPath(); ctx.ellipse(side * -r * 0.72, r * 0.05, r * 0.2, r * 0.38, side * -0.6, 0, 7); ctx.fill();
  // green grip + stripes
  ctx.fillStyle = '#3be37a'; ctx.beginPath(); ctx.roundRect(-r * 0.55, -r * 0.15, r * 1.1, r * 0.6, r * 0.2); ctx.fill();
  ctx.fillStyle = '#0a1a3a'; ctx.font = '700 ' + Math.round(r * 0.42) + 'px ' + F; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('1', 0, r * 0.16);
  ctx.strokeStyle = 'rgba(10,26,58,.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(-r * 0.7, -r * 1.05, r * 1.4, r * 2.05, r * 0.3); ctx.stroke();
  ctx.restore(); ctx.textBaseline = 'alphabetic';
}
function glStriker(now) {
  const k = gl.kick, fy = H * 0.45, h = H * 0.13, x = k ? k.sx : W / 2;
  let leg = 0.15; if (k) { const d = now - k.t0; if (d < 0) leg = 0.15 + (-0.9 - 0.15) * clamp(1 + d / GL_WIND, 0, 1); else if (d < 180) leg = -0.9 + 2.0 * (d / 180); else leg = 1.1 - Math.min(1, (d - 180) / 300) * 0.95; }
  // shadow
  ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x, fy, h * 0.28, h * 0.07, 0, 0, 7); ctx.fill();
  ctx.lineCap = 'round'; ctx.strokeStyle = '#0a1a3a'; ctx.lineWidth = h * 0.1;
  ctx.beginPath(); ctx.moveTo(x, fy - h * 0.45); ctx.lineTo(x - h * 0.08, fy); ctx.stroke();                    // standing leg
  ctx.beginPath(); ctx.moveTo(x, fy - h * 0.45); ctx.lineTo(x + Math.sin(leg) * h * 0.45, fy - h * 0.45 + Math.cos(leg) * h * 0.45); ctx.stroke(); // kicking leg
  ctx.fillStyle = '#ff4d3d'; ctx.beginPath(); ctx.roundRect(x - h * 0.17, fy - h * 0.85, h * 0.34, h * 0.45, h * 0.08); ctx.fill();   // jersey
  ctx.fillStyle = '#fff'; ctx.font = '700 ' + Math.round(h * 0.2) + 'px ' + F; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('9', x, fy - h * 0.62); ctx.textBaseline = 'alphabetic';
  ctx.strokeStyle = '#ff4d3d'; ctx.lineWidth = h * 0.08; ctx.beginPath(); ctx.moveTo(x - h * 0.15, fy - h * 0.8); ctx.lineTo(x - h * 0.32, fy - h * 0.55); ctx.moveTo(x + h * 0.15, fy - h * 0.8); ctx.lineTo(x + h * 0.32, fy - h * 0.6); ctx.stroke();
  ctx.fillStyle = '#c98b5e'; ctx.beginPath(); ctx.arc(x, fy - h * 0.97, h * 0.13, 0, 7); ctx.fill();
  ctx.lineCap = 'butt';
}
function glDraw(now) {
  ctx.clearRect(0, 0, W, H); const g = glGoal(), r = glR();
  let shake = 0; if (gl.flash && gl.flash.c === 'goal') shake = Math.max(0, 1 - (now - gl.flash.t) / 300) * 6;
  ctx.save(); if (shake) ctx.translate(rnd(-shake, shake), rnd(-shake, shake));
  stadium(now, { crowdBot: H * 0.2 }); grass(H * 0.2, H, 10);
  // field markings in perspective: the penalty box and the spot
  ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(W * 0.02, H * 0.98); ctx.lineTo(W * 0.24, H * 0.5); ctx.lineTo(W * 0.76, H * 0.5); ctx.lineTo(W * 0.98, H * 0.98); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(W / 2, H * 0.5, W * 0.12, H * 0.035, 0, 0, Math.PI); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(W / 2, H * 0.47, 6, 2.5, 0, 0, 7); ctx.fill();
  glStriker(now);
  // target rings: where each shot is heading
  for (const s of gl.shots) {
    const a = clamp((now - (s.t - GL_WIND)) / GL_WIND, 0, 1), pulse = 1 + 0.15 * Math.sin(now / 80);
    ctx.strokeStyle = s.gold ? 'rgba(255,204,51,' + (0.9 * a) + ')' : 'rgba(255,255,255,' + (0.85 * a) + ')'; ctx.lineWidth = 3; ctx.setLineDash([8, 6]);
    ctx.beginPath(); ctx.arc(s.tx, s.ty, r * 0.9 * pulse, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(s.tx - 8, s.ty); ctx.lineTo(s.tx + 8, s.ty); ctx.moveTo(s.tx, s.ty - 8); ctx.lineTo(s.tx, s.ty + 8); ctx.stroke();
  }
  // shots: grow as they come toward you, with a trail
  for (const s of gl.shots) {
    if (now < s.t) { ballSoccer(s.sx + H * 0.03, H * 0.44, 6); continue; }
    const pos = u => { const e = u * u * (3 - 2 * u) * 0.35 + u * 0.65; return [s.sx + (s.tx - s.sx) * e, s.sy + (s.ty - s.sy) * e - Math.sin(Math.PI * u) * s.arc, 5 + 34 * Math.pow(u, 1.6)]; };
    const t = clamp((now - s.t) / s.dur, 0, 1);
    for (let k = 4; k >= 1; k--) { const [tx, ty, tr] = pos(Math.max(0, t - k * 0.05)); ctx.fillStyle = s.gold ? 'rgba(255,170,40,' + (0.12 * (5 - k)) + ')' : 'rgba(255,255,255,' + (0.07 * (5 - k)) + ')'; ctx.beginPath(); ctx.arc(tx, ty, tr * 0.9, 0, 7); ctx.fill(); }
    const [x, y, br] = pos(t); s.x = x; s.y = y;
    if (s.gold) { ctx.fillStyle = 'rgba(255,204,51,.55)'; ctx.beginPath(); ctx.arc(x, y, br + 7, 0, 7); ctx.fill(); }
    ballSoccer(x, y, br);
  }
  // goal frame (you stand in it) with side netting
  ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 12; i++) { const y = g.y0 + (H - g.y0) * i / 12; ctx.beginPath(); ctx.moveTo(0, y - H * 0.08); ctx.lineTo(g.x0, y); ctx.moveTo(W, y - H * 0.08); ctx.lineTo(g.x1, y); ctx.stroke(); }
  for (let i = 0; i <= 4; i++) { const xl = g.x0 * i / 4; ctx.beginPath(); ctx.moveTo(xl, g.y0 - H * 0.08 * (1 - i / 4)); ctx.lineTo(xl, H); ctx.moveTo(W - xl, g.y0 - H * 0.08 * (1 - i / 4)); ctx.lineTo(W - xl, H); ctx.stroke(); }
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(g.x0, H + 10); ctx.lineTo(g.x0, g.y0); ctx.lineTo(g.x1, g.y0); ctx.lineTo(g.x1, H + 10); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(g.x0 + 6, H); ctx.lineTo(g.x0 + 6, g.y0 + 6); ctx.lineTo(g.x1 - 6, g.y0 + 6); ctx.lineTo(g.x1 - 6, H); ctx.stroke(); ctx.lineJoin = 'miter';
  // net ripple where a goal went in
  if (gl.ripple) { const t = (now - gl.ripple.t) / 500; if (t < 1) { ctx.strokeStyle = 'rgba(255,255,255,' + (1 - t) + ')'; ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(gl.ripple.x, gl.ripple.y, 10 + t * 60 + k * 14, 0, 7); ctx.stroke(); } } }
  // balls you knocked away
  for (const b of gl.away) { const t = (now - b.t) / 1000; ballSoccer(b.x + b.vx * t, b.y + b.vy * t + 900 * t * t, b.r * (1 - t * 0.4)); }
  // gloves
  const punch = gl.flash && gl.flash.c === 'save' && now - gl.flash.t < 160;
  glGlove(gl.x - r * 0.95, gl.y, r, -1, now, punch); glGlove(gl.x + r * 0.95, gl.y, r, 1, now, punch);
  if (gl.streak >= 2) label('🔥 ' + gl.streak + ' in a row', W / 2, H - 26, 20, '#ffcc33');
  ctx.restore();
  // flash: green for a save, red for a goal
  if (gl.flash) { const t = (now - gl.flash.t) / 260; if (t < 1) { ctx.fillStyle = (gl.flash.c === 'save' ? 'rgba(59,227,122,' : 'rgba(255,77,61,') + (0.25 * (1 - t)) + ')'; ctx.fillRect(0, 0, W, H); } }
}
function glTick(now) {
  const g = glGoal(), r = glR();
  if (now >= gl.next && now < gl.end - 1100) {
    const sp = 1 - 0.3 * clamp(1 - (gl.end - now) / GL_LEN, 0, 1), sx = W / 2 + rnd(-W * 0.12, W * 0.12), t0 = now + GL_WIND;
    gl.shots.push({ t: t0, dur: 820 * sp + rnd(0, 220), sx, sy: H * 0.42, arc: rnd(10, 60), tx: rnd(g.x0 + r * 1.6, g.x1 - r * 1.6), ty: rnd(g.y0 + r * 1.2, g.y1 - r * 1.4), gold: Math.random() < 0.18 });
    gl.kick = { sx, t0 };
    gl.next = t0 + rnd(700, 1050) * sp;
  }
  glDraw(now);
  gl.away = gl.away.filter(b => now - b.t < 1000);
  gl.shots = gl.shots.filter(s => {
    if (now < s.t || now - s.t < s.dur) return true;
    if (Math.abs(s.tx - gl.x) < r * 2.1 && Math.abs(s.ty - gl.y) < r * 1.6) {
      const p = s.gold ? 2 : 1; pts += p; gl.streak++;
      float(s.tx, s.ty - 50, (s.gold ? 'GOLDEN SAVE! +' : 'SAVE! +') + p, s.gold ? '#ffcc33' : '#3be37a'); confetti(s.tx, s.ty, s.gold ? 18 : 10);
      if (gl.streak % 3 === 0) { pts += 1; float(W / 2, H * 0.32, 'Streak bonus +1', '#ffcc33'); }
      gl.away.push({ x: s.tx, y: s.ty, vx: (s.tx < gl.x ? -1 : 1) * rnd(250, 450), vy: -rnd(450, 650), r: 39, t: now });
      gl.flash = { c: 'save', t: now };
    } else {
      gl.streak = 0; float(s.tx, s.ty - 40, 'GOAL!', '#ff8a7a'); gl.ripple = { x: s.tx, y: s.ty, t: now }; gl.flash = { c: 'goal', t: now };
    }
    return false;
  });
  const left = Math.max(0, gl.end - now);
  hud(Math.ceil(left / 1000) + 's'); bar(1 - left / GL_LEN);
  if (left <= 0 && !gl.shots.length) finish(pts >= 10 ? 'Brick wall!' : pts ? 'Nice saves!' : 'They got past you this time!');
}

/* ---------------- input ---------------- */
function wire() {
  const pos = e => { const r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  cv.addEventListener('pointerdown', e => {
    if (!running) return; const p = pos(e);
    if (game === 'hoops' && !hp.fly && hp.left > 0) { hp.drag = { x0: p.x, y0: p.y, x: p.x, y: p.y }; cv.setPointerCapture(e.pointerId); }
    if (game === 'penalty') pkTap(p);
    if (game === 'homerun') hrSwing();
    if (game === 'fieldgoal') fgKick();
    if (game === 'bowling') bwRoll();
    if (game === 'goalie') { gl.x = p.x; gl.y = clamp(p.y, H * 0.3, H * 0.9); cv.setPointerCapture(e.pointerId); }
  });
  cv.addEventListener('pointermove', e => {
    const p = pos(e);
    if (hp.drag) { hp.drag.x = p.x; hp.drag.y = p.y; }
    if (game === 'goalie' && running) { gl.x = p.x; gl.y = clamp(p.y, H * 0.3, H * 0.9); }
    if (game === 'penalty' && running) pk.hover = pkZone(p.x, p.y);
  });
  cv.addEventListener('pointerup', e => {
    if (game !== 'hoops' || !hp.drag || !running) return;
    const d = hp.drag, p = pos(e); hp.drag = null;
    if (d.y0 - p.y < 25) { float(W / 2, H - 120, 'Drag up!', '#fff'); return; }
    hp.left--; hp.fly = { sx: W / 2, sy: H - 62, lx: hpLand(d, p), t: performance.now(), dur: 750 };
  });
  cv.addEventListener('pointercancel', () => { hp.drag = null; });
  document.addEventListener('keydown', e => {
    if (!running || (e.key !== ' ' && e.key !== 'Enter')) return;
    if (game === 'homerun') { e.preventDefault(); hrSwing(); }
    if (game === 'fieldgoal') { e.preventDefault(); fgKick(); }
    if (game === 'bowling') { e.preventDefault(); bwRoll(); }
  });
}

window.Arena = { play, close, pick, games: Object.keys(GAMES), isOpen: () => !!root && !root.hidden };
})();
