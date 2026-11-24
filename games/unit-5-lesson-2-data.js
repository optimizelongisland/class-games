/* Unit 5 Lesson 2 (Identifying Functions Continued): station problems, answer checking and hints.
   Used by unit-5-lesson-2-stations.html (students) and tools/build-unit-5-lesson-2-pdf.py (printed stations).
   Nothing is sent anywhere: everything stays on the device. */
(function () {
'use strict';
const SITE = 'https://optimizelongisland.github.io/class-games/';
const IMG = (window.U5L2_IMG || 'unit-5-lesson-2-img/');

/* ---------- tiny math markup helpers ---------- */
const v = s => '<i>' + s + '</i>';                          // italic variable
const fr = (a, b) => '<span class="fr"><span>' + a + '</span><span>' + b + '</span></span>';
const sup = s => '<sup>' + s + '</sup>';
const nw = s => '<span class="nw">' + s + '</span>';            // keep a formula on one line
// square root: the check mark and the bar are one drawn shape, so they always meet
const rt = s => '<span class="rt"><svg viewBox="0 0 10 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0.5 12.5 L2.8 11 L5.6 19.2 L9.6 1"/></svg><span>' + s + '</span><span class="sr">square root of ' + s.replace(/<[^>]+>/g, '') + '</span></span>';
const M = '−';                                          // real minus sign

/* ---------- graph drawing (SVG, styled by the page) ---------- */
function curvePath(pts, X, Y) {             // Catmull-Rom through the points, as cubic Beziers
  let d = 'M' + X(pts[0][0]).toFixed(2) + ' ' + Y(pts[0][1]).toFixed(2);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ' C' + [X(c1[0]), Y(c1[1]), X(c2[0]), Y(c2[1]), X(p2[0]), Y(p2[1])].map(n => n.toFixed(2)).join(' ');
  }
  return d;
}
/* g: { x:[min,max], y:[min,max] (default -10..10), gx/gy: units per grid square (default 1),
        ticks: {x:step, y:step} to print numbers on the axes, xTitle/yTitle,
        curves: [ [[x,y],...] or {p:[[x,y],...], arrow:true|'both'} ], dots: [[x,y,open?]] } */
function graph(g) {
  const [x0, x1] = g.x || [-10, 10], [y0, y1] = g.y || [-10, 10], gx = g.gx || 1, gy = g.gy || 1;
  const nx = (x1 - x0) / gx, ny = (y1 - y0) / gy, cell = 400 / Math.max(nx, ny);
  const pl = g.yTitle ? 80 : g.ticks ? 40 : 26, pr = 30, pt = 30, pb = g.xTitle ? 70 : g.ticks ? 44 : 30;
  const W = nx * cell + pl + pr, H = ny * cell + pt + pb;
  const X = x => pl + (x - x0) / gx * cell, Y = y => pt + (y1 - y) / gy * cell;
  const ax = x0 <= 0 && 0 <= x1 ? 0 : x0, ay = y0 <= 0 && 0 <= y1 ? 0 : y0;
  const f = n => +n.toFixed(1);
  let s = '<svg class="graph" viewBox="0 0 ' + f(W) + ' ' + f(H) + '" role="img" aria-label="' + (g.label || 'graph') + '">';
  for (let i = 0; i <= nx; i++) s += '<line class="g-grid" x1="' + f(X(x0 + i * gx)) + '" y1="' + Y(y1) + '" x2="' + f(X(x0 + i * gx)) + '" y2="' + f(Y(y0)) + '"/>';
  for (let i = 0; i <= ny; i++) s += '<line class="g-grid" x1="' + X(x0) + '" y1="' + f(Y(y0 + i * gy)) + '" x2="' + f(X(x1)) + '" y2="' + f(Y(y0 + i * gy)) + '"/>';
  const e = 16, a = 10;
  const L = X(x0) - (x0 < 0 ? e : 0), R = X(x1) + e, T = Y(y1) - e, B = Y(y0) + (y0 < 0 ? e : 0);
  s += '<path class="g-axis" d="M' + f(L) + ' ' + f(Y(ay)) + 'H' + f(R) + 'M' + f(X(ax)) + ' ' + f(B) + 'V' + f(T) + '"/>';
  let ar = 'M' + f(R) + ' ' + f(Y(ay)) + 'l-' + a + ' -5.5v11zM' + f(X(ax)) + ' ' + f(T) + 'l-5.5 ' + a + 'h11z';
  if (x0 < 0) ar += 'M' + f(L) + ' ' + f(Y(ay)) + 'l' + a + ' -5.5v11z';
  if (y0 < 0) ar += 'M' + f(X(ax)) + ' ' + f(B) + 'l-5.5 -' + a + 'h11z';
  s += '<path class="g-arrow" d="' + ar + '"/>';
  s += '<text class="g-lab" x="' + f(R - 2) + '" y="' + f(Y(ay) + 24) + '">x</text><text class="g-lab" x="' + f(X(ax) + 10) + '" y="' + f(T + 6) + '">y</text>';
  if (g.ticks) {
    const lab = (v) => v < 0 ? '−' + -v : String(v);
    for (let v = Math.ceil(x0 / g.ticks.x) * g.ticks.x; v <= x1 + 1e-9; v += g.ticks.x) if (v) s += '<text class="g-num" text-anchor="middle" x="' + f(X(v)) + '" y="' + f(Y(ay) + 20) + '">' + lab(v) + '</text>';
    for (let v = Math.ceil(y0 / g.ticks.y) * g.ticks.y; v <= y1 + 1e-9; v += g.ticks.y) if (v || y0 === 0) s += '<text class="g-num" text-anchor="end" x="' + f(X(ax) - 7) + '" y="' + f(Y(v) + 5) + '">' + lab(v) + '</text>';
  }
  if (g.xTitle) s += '<text class="g-title" text-anchor="middle" x="' + f((X(x0) + X(x1)) / 2) + '" y="' + f(H - 14) + '">' + g.xTitle + '</text>';
  if (g.yTitle) s += '<text class="g-title" text-anchor="middle" transform="translate(22 ' + f((Y(y0) + Y(y1)) / 2) + ') rotate(-90)">' + g.yTitle + '</text>';
  (g.curves || []).forEach(c => {
    const P = Array.isArray(c) ? c : c.p;
    s += '<path class="g-curve" d="' + curvePath(P, X, Y) + '"/>';
    if (c.arrow === 'both') {
      const [p, q] = [P[1], P[0]], ang = Math.atan2(Y(q[1]) - Y(p[1]), X(q[0]) - X(p[0])) * 180 / Math.PI;
      s += '<path class="g-arrow g-carrow" transform="translate(' + f(X(q[0])) + ' ' + f(Y(q[1])) + ') rotate(' + f(ang) + ')" d="M4 0l-14 -7v14z"/>';
    }
    if (c.arrow) {
      const [p, q] = [P[P.length - 2], P[P.length - 1]], ang = Math.atan2(Y(q[1]) - Y(p[1]), X(q[0]) - X(p[0])) * 180 / Math.PI;
      s += '<path class="g-arrow g-carrow" transform="translate(' + f(X(q[0])) + ' ' + f(Y(q[1])) + ') rotate(' + f(ang) + ')" d="M4 0l-14 -7v14z"/>';
    }
  });
  (g.dots || []).forEach(p => { s += '<circle class="g-dot' + (p[2] ? ' open' : '') + '" cx="' + f(X(p[0])) + '" cy="' + f(Y(p[1])) + '" r="6"/>'; });
  return s + '</svg>';
}


// small graph on a -5..5 grid (station 15)
const G15 = (curves, dots, label) => graph({ x: [-5, 5], y: [-5, 5], ticks: { x: 1, y: 1 }, curves, dots, label });

/* ---------- the questions ----------
   Stations 1-13 are the packet problems from pages 15-18 (Lesson 2: Identifying Functions Continued),
   in packet order. `src` says where each one is in the packet.
   Every part is multiple choice: choices[], answer = index of the right choice.
   Choice pictures (graphs, the mapping) are cut from the packet: unit-5-lesson-2-img/<name>.png.
   `pq` replaces the part's wording on the printed station sheet; '' leaves it off.
   `hints` are shown one at a time on the device. */
const N = k => k < 0 ? M + (-k) : String(k);
const set = (...P) => nw('{' + P.map(p => '(' + p.map(N).join(', ') + ')').join(', ') + '}');
const tb = (h, rows) => '<table class="tb"><tr><th>' + h[0] + '</th><th>' + h[1] + '</th></tr>' + rows.map(r => '<tr><td>' + N(r[0]) + '</td><td>' + N(r[1]) + '</td></tr>').join('') + '</table>';
const im = (name, alt) => '<img class="cimg" src="' + IMG + name + '.png" alt="' + alt + '">';
const xy = [v('x'), v('y')];
/* a mapping diagram: two ovals, arrows from inputs to outputs */
function mapping(ins, outs, arrows, cls) {
  const H = 40 + Math.max(ins.length, outs.length) * 34, row = (n, i) => 30 + (i + 0.5) * (H - 40) / n;
  let s = '<svg class="' + (cls || 'graph map') + '" viewBox="0 0 240 ' + (H + 20) + '" role="img" aria-label="Mapping: ' + arrows.map(([a, b]) => ins[a] + ' to ' + outs[b]).join(', ') + '">' +
    '<text x="45" y="16" text-anchor="middle" class="g-title">Input</text><text x="195" y="16" text-anchor="middle" class="g-title">Output</text>' +
    '<ellipse cx="45" cy="' + (H / 2 + 12) + '" rx="32" ry="' + (H / 2 - 8) + '" class="g-axis"/><ellipse cx="195" cy="' + (H / 2 + 12) + '" rx="32" ry="' + (H / 2 - 8) + '" class="g-axis"/>';
  ins.forEach((t, i) => { s += '<text x="45" y="' + (row(ins.length, i) + 6) + '" text-anchor="middle" class="g-num" style="font-size:17px">' + N(t) + '</text>'; });
  outs.forEach((t, i) => { s += '<text x="195" y="' + (row(outs.length, i) + 6) + '" text-anchor="middle" class="g-num" style="font-size:17px">' + N(t) + '</text>'; });
  arrows.forEach(([a, b]) => {
    const x1 = 62, y1 = row(ins.length, a), x2 = 176, y2 = row(outs.length, b), ang = Math.atan2(y2 - y1, x2 - x1);
    s += '<line x1="' + x1 + '" y1="' + y1.toFixed(1) + '" x2="' + x2 + '" y2="' + y2.toFixed(1) + '" class="g-axis" style="stroke-width:1.8"/>' +
      '<path class="g-arrow" transform="translate(' + x2 + ' ' + y2.toFixed(1) + ') rotate(' + (ang * 180 / Math.PI).toFixed(1) + ')" d="M2 0l-11 -5v10z"/>';
  });
  return s + '</svg>';
}

const H_SET = ['In a function, every <b>x-value</b> (the first number in each pair) goes to only ONE y-value.',
  'Look at the first number of every ordered pair. Does any first number show up twice?',
  'Repeating <b>y-values</b> is OK! Only an x-value that repeats with a different y-value breaks a function.'];
const H_TAB = ['In a function, each number in the <b>x column</b> goes to only ONE output.',
  'Read down the x column of each table. Does any x-value show up twice?',
  'A repeated output (y) is fine. A repeated input (x) with a different output is NOT a function.'];
const H_GRAPH = ['Use the <b>vertical line test</b>: slide a pencil, held straight up and down, across the graph from left to right.',
  'If the pencil ever touches the graph in <b>two places at once</b>, that graph is NOT a function.',
  'Shapes that open sideways, loop back over themselves, or stand straight up and down fail the test.'];
const Q = [
  { n: 1, src: 'Page 15, #5', title: 'Ordered pairs',
    text: 'Which relation is <b>not</b> a function?',
    parts: [{ t: 'mc', q: 'Choose the relation that is <b>not</b> a function.', pq: '', labels: '1234', answer: 3, hints: H_SET,
      choices: [set([2, 4], [1, 2], [0, 0], [-1, 2], [-2, 4]), set([2, 4], [1, 1], [0, 0], [-1, 1], [-2, 4]),
                set([2, 2], [1, 1], [0, 0], [-1, 1], [-2, 2]), set([2, 2], [1, 1], [0, 0], [1, -1], [2, -2])] }] },
  { n: 2, src: 'Page 15, #6', title: 'Ordered pairs',
    text: 'Which relation is a function?',
    parts: [{ t: 'mc', q: 'Choose the relation that is a function.', pq: '', labels: '1234', answer: 0, hints: H_SET,
      choices: [set([2, 1], [3, 1], [4, 1], [5, 1]), set([1, 2], [1, 3], [1, 4], [1, 5]),
                set([2, 3], [3, 2], [4, 2], [2, 4]), set([1, 6], [2, 8], [3, 9], [3, 12])] }] },
  { n: 3, src: 'Page 15, #7', title: 'Find the missing x',
    text: 'Given the relation: ' + set([0, 4], [2, 6], [4, 8], [v('x'), 7]) + '<br>Which value of ' + v('x') + ' will make this relation a function?',
    parts: [{ t: 'mc', q: 'Choose the value of ' + v('x') + '.', pq: '', labels: '1234', answer: 2, choices: ['0', '2', '6', '4'],
      hints: ['In a function, an x-value can’t repeat with a different y-value.',
              'Which x-values are already used? Look at the first number of the first three pairs.',
              '0, 2 and 4 already have outputs (4, 6 and 8). If ' + v('x') + ' were one of them, it would have two outputs.'] }] },
  { n: 4, src: 'Page 15, #8', title: 'Tables',
    text: 'Which table represents a function?',
    parts: [{ t: 'mc', q: 'Choose the table that is a function.', pq: '', labels: '1234', answer: 3, hints: H_TAB, wide: true,
      choices: [tb(xy, [[2, -3], [3, 0], [4, -3], [2, 1]]), tb(xy, [[1, 2], [1, 3], [1, 4], [1, 5]]),
                tb(xy, [[-3, 0], [-2, 1], [-3, 2], [2, 3]]), tb(xy, [[-2, -4], [0, 2], [2, 4], [4, 6]])] }] },
  { n: 5, src: 'Page 16, #9', title: 'Graphs',
    text: 'Which graph represents a function?',
    parts: [{ t: 'mc', q: 'Choose the graph that is a function.', pq: '', labels: '1234', answer: 3, hints: H_GRAPH, pics: true,
      choices: [im('q9-1', 'A sideways U opening to the right from the origin'), im('q9-2', 'Two rays leaving the origin to the left, one up and one down'),
                im('q9-3', 'A vertical line to the right of the y-axis'), im('q9-4', 'A horizontal line above the x-axis')] }] },
  { n: 6, src: 'Page 16, #10', title: 'Graphs',
    text: 'Which graph does <b>not</b> represent a function?',
    parts: [{ t: 'mc', q: 'Choose the graph that is <b>not</b> a function.', pq: '', labels: '1234', answer: 2, hints: H_GRAPH, pics: true,
      choices: [im('q10-1', 'A V shape opening up'), im('q10-2', 'A narrow upside-down U'),
                im('q10-3', 'A sideways U opening to the right'), im('q10-4', 'A line going up, then flat, up a step, then flat')] }] },
  { n: 7, src: 'Page 16, #11', title: 'Graphs',
    text: 'Which graph represents a function?',
    parts: [{ t: 'mc', q: 'Choose the graph that is a function.', pq: '', labels: '1234', answer: 0, hints: H_GRAPH, pics: true,
      choices: [im('q11-1', 'An S-shaped curve that always rises from left to right'), im('q11-2', 'A sideways U opening to the right'),
                im('q11-3', 'An S shape standing up, curving back over itself'), im('q11-4', 'An oval')] }] },
  { n: 8, src: 'Page 16, #12', title: 'Graphs',
    text: 'Which graph represents a function?',
    parts: [{ t: 'mc', q: 'Choose the graph that is a function.', pq: '', labels: '1234', answer: 2, hints: H_GRAPH, pics: true,
      choices: [im('q12-1', 'A circle'), im('q12-2', 'A vertical line segment'),
                im('q12-3', 'An upside-down U with its top at the origin'), im('q12-4', 'Two rays leaving the origin, one up-left and one down-left')] }] },
  { n: 9, src: 'Page 17, #3', title: 'Graphs',
    text: 'Which graph represents a function?',
    parts: [{ t: 'mc', q: 'Choose the graph that is a function.', pq: '', labels: '1234', answer: 3, hints: H_GRAPH, pics: true,
      choices: [im('ip3-1', 'A sideways U opening to the right'), im('ip3-2', 'A vertical line'),
                im('ip3-3', 'A small circle around the origin'), im('ip3-4', 'A V shape opening up')] }] },
  { n: 10, src: 'Page 17, #4', title: 'Graphs',
    text: 'Which graph represents a function?',
    parts: [{ t: 'mc', q: 'Choose the graph that is a function.', pq: '', labels: '1234', answer: 3, hints: H_GRAPH, pics: true,
      choices: [im('ip4-1', 'An oval'), im('ip4-2', 'A vertical line'),
                im('ip4-3', 'An S shape standing up'), im('ip4-4', 'A V shape opening up from the origin')] }] },
  { n: 11, src: 'Page 17, #5', title: 'Tables',
    text: 'Which table could represent a function?',
    parts: [{ t: 'mc', q: 'Choose the table that could be a function.', pq: '', labels: '1234', answer: 1, hints: H_TAB, wide: true,
      choices: [tb([v('x'), v('f') + '(' + v('x') + ')'], [[1, 4], [2, 2], [3, 4], [2, 6]]), tb([v('x'), v('g') + '(' + v('x') + ')'], [[1, 2], [2, 4], [3, 6], [4, 2]]),
                tb([v('x'), v('h') + '(' + v('x') + ')'], [[2, 6], [0, 4], [1, 6], [2, 2]]), tb([v('x'), v('k') + '(' + v('x') + ')'], [[2, 2], [3, 2], [4, 6], [3, 6]])] }] },
  { n: 12, src: 'Page 18, #6', title: 'Four relations',
    text: 'Which relation(s) is a function?' +
      '<div class="rels"><div><b>I</b>' + tb(xy, [[2, 6], [3, -12], [4, 7], [5, 5], [2, -6]]) + '</div>' +
      '<div><b>III</b>' + im('ip6-3', 'A sideways U opening to the right from the origin') + '</div>' +
      '<div class="r2"><b>II</b>' + set([1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8], [7, 13]) + '</div>' +
      '<div><b>IV</b>' + nw(v('y') + ' = 2' + v('x') + ' + 1') + '</div></div>',
    parts: [{ t: 'mc', q: 'Which relation(s) is a function?', pq: '', labels: '1234', answer: 1, choices: ['I and II', 'II and IV', 'III, only', 'IV, only'],
      hints: ['Check each relation one at a time: I is a table, II is ordered pairs, III is a graph, IV is an equation.',
              'I: does any x repeat? II: does any x repeat? III: does it pass the vertical line test?',
              'IV is a line that is not vertical, so every x gives exactly one y. That makes it a function.'] }] },
  { n: 13, src: 'Page 18, #7', title: 'Four ways to show a relation',
    text: 'Which relation is a function?',
    parts: [{ t: 'mc', q: 'Choose the relation that is a function.', pq: '', labels: '1234', answer: 0, pics: true,
      choices: [set([1, 3], [2, 1], [3, 1], [4, 7]), tb(['Input', 'Output'], [[-6, -2], [-4, 2], [7, 3], [7, 5]]),
                im('ip7-3', 'A circle centered at the origin'), im('ip7-4', 'A mapping: 3 to 4, 6 to 5, 6 to 7, 11 to 7, and 8 with no arrow')],
      hints: ['Each choice shows a relation a different way: ordered pairs, a table, a graph and a mapping.',
              'In a mapping, a function has only ONE arrow leaving each input. In a table, an input can’t repeat with a different output.',
              'Choice 1: look at the x-values 1, 2, 3, 4. Do any of them repeat?'] }] },
  { n: 14, src: 'New problem', title: 'Mapping diagrams',
    text: 'Which mapping represents a function?',
    parts: [{ t: 'mc', q: 'Choose the mapping that is a function.', pq: '', labels: '1234', answer: 2, wide: true,
      choices: [mapping([1, 2, 3], [4, 5], [[0, 0], [1, 0], [1, 1], [2, 1]]), mapping([0, 1, 2], [3, 6, 9], [[0, 0], [1, 1], [1, 2], [2, 2]]),
                mapping([-1, 0, 1], [2, 4], [[0, 0], [1, 1], [2, 0]]), mapping([5, 6], [1, 2, 3], [[0, 0], [0, 1], [1, 2]])],
      hints: ['In a mapping, look at the arrows leaving each <b>input</b> (the left oval).',
              'A function has exactly ONE arrow leaving every input. Does any input have two arrows?',
              'Two arrows landing on the same output is fine. Two arrows leaving the same input is NOT.'] }] },
  { n: 15, src: 'New problem', title: 'Vertical line test',
    text: 'Use the vertical line test. Which graph does <b>not</b> represent a function?',
    parts: [{ t: 'mc', q: 'Choose the graph that is <b>not</b> a function.', pq: '', labels: '1234', answer: 2, pics: true,
      choices: [G15([{ p: Array.from({ length: 31 }, (_, i) => { const t = -4.5 + 9 * i / 30; return [t, 2 * Math.sin(t)]; }), arrow: 'both' }], [], 'A wave going left to right'),
                G15([], [[-4, -1], [-2, 3], [0, 1], [1, -3], [3, 2]], 'Five dots, no two in the same column'),
                G15([], [[-3, -2], [-1, 1], [2, 4], [2, -1], [4, 2]], 'Five dots, two of them stacked at x = 2'),
                G15([{ p: [[0, -1], [-4.5, 3.5]], arrow: true }, { p: [[0, -1], [4.5, 3.5]], arrow: true }], [], 'A V shape opening up')],
      hints: ['Slide a pencil, held straight up and down, across each graph from left to right.',
              'If the pencil ever touches the graph in <b>two places at once</b>, that graph is NOT a function.',
              'Dots count too: two dots in the same column (same ' + v('x') + ') means one input has two outputs.'] }] },
  { n: 16, src: 'New problem', title: 'Missing value in a table',
    text: 'This table should represent a function.' + tb(xy, [[1, 5], [2, 7], [3, 9], ['?', 11]]) + 'Which value can <b>not</b> replace the <b>?</b>',
    parts: [{ t: 'mc', q: 'Choose the value that can <b>not</b> go in the table.', pq: '', labels: '1234', answer: 2, choices: ['4', '0', '2', '6'],
      hints: ['In a function, an ' + v('x') + '-value can’t repeat with a different ' + v('y') + '-value.',
              'Which ' + v('x') + '-values are already in the table?',
              '1, 2 and 3 already have outputs (5, 7 and 9). If the ? were one of them, that input would have two outputs.'] }] }
];
Q.forEach(q => { q.ready = true; q.est = 2;
  q.parts.forEach(p => { const c = p.choices[p.answer], L = p.labels[p.answer] + ') ', alt = /alt="([^"]*)"/.exec(c);
    if (alt) p.key = L + alt[1]; else if (/<table/.test(c)) p.key = L + 'the table in choice ' + p.labels[p.answer]
    else if (/<svg/.test(c)) p.key = L + (/aria-label="Mapping/.test(c) ? 'the mapping in choice ' + p.labels[p.answer] : /aria-label="([^"]*)"/.exec(c)[1]); }); });

/* ---------- answer checking ---------- */
function clean(s) {
  return String(s).toLowerCase()
    .replace(/[−–—]/g, '-').replace(/[×·]/g, '*').replace(/÷/g, '/')
    .replace(/²/g, '^2').replace(/³/g, '^3').replace(/\*\*/g, '^').replace(/\s+/g, '');
}
// expression evaluator: numbers, one variable, + - * / ^, parentheses, implied multiplication
function parse(src, vr) {
  const s = clean(src); let i = 0;
  const peek = () => s[i];
  function num() {
    let j = i; while (/[0-9.]/.test(s[i] || '')) i++;
    if (j === i) return null; const n = parseFloat(s.slice(j, i)); if (isNaN(n)) throw 0; return () => n;
  }
  function atom() {
    const c = peek();
    if (c === '(') { i++; const e = add(); if (s[i] !== ')') throw 0; i++; return e; }
    if (c === vr) { i++; return x => x; }
    const n = num(); if (n) return n;
    throw 0;
  }
  function pow() {
    const b = atom();
    if (peek() === '^') { i++; const e = unary(); return x => Math.pow(b(x), e(x)); }
    return b;
  }
  function unary() {
    if (peek() === '-') { i++; const e = unary(); return x => -e(x); }
    if (peek() === '+') { i++; return unary(); }
    return pow();
  }
  function mul() {
    let l = unary();
    for (;;) {
      const c = peek();
      if (c === '*' || c === '/') { i++; const r = unary(), a = l; l = c === '*' ? x => a(x) * r(x) : x => a(x) / r(x); }
      else if (c === '(' || c === vr || /[0-9.]/.test(c || '')) { const r = pow(), a = l; l = x => a(x) * r(x); }
      else return l;
    }
  }
  function add() {
    let l = mul();
    for (;;) {
      const c = peek();
      if (c === '+' || c === '-') { i++; const r = mul(), a = l; l = c === '+' ? x => a(x) + r(x) : x => a(x) - r(x); }
      else return l;
    }
  }
  const e = add(); if (i !== s.length) throw 0; return e;
}
function rhs(s) { const p = clean(s).split('='); return p[p.length - 1]; }
function tryParse(s, vr) { try { return parse(s, vr || '@'); } catch (e) { return null; } }
const close = (a, b) => isFinite(a) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
function toNum(s) { const f = tryParse(rhs(s)); return f ? f(0) : NaN; }
function toList(s) {
  const t = clean(String(s).replace(/…|\.\.\./g, ' ').replace(/[;,]+/g, ',').replace(/\s+/g, ',')).replace(/^,+|,+$/g, '');
  if (!t) return [];
  return t.split(/,+/).map(toNum);
}
// returns {ok, msg}; msg explains a near miss
function check(part, input) {
  const raw = String(input || '').trim();
  if (!raw && part.t !== 'mc') return { ok: false, empty: true, msg: 'Type an answer first.' };
  if (part.t === 'mc') return { ok: +input === part.answer };
  if (part.t === 'num') {
    const n = toNum(raw);
    if (isNaN(n)) return { ok: false, msg: 'Type a number (fractions like 1/3 are OK).' };
    return { ok: close(n, part.answer) };
  }
  if (part.t === 'seq') {
    const L = toList(raw);
    if (L.some(isNaN)) return { ok: false, msg: 'Type numbers separated by commas.' };
    if (L.length < part.answer.length) return { ok: false, msg: 'We need ' + part.answer.length + ' terms. You typed ' + L.length + '.' };
    return { ok: part.answer.every((a, k) => close(L[k], a)) };
  }
  if (part.t === 'aseq') {
    const L = toList(raw);
    if (L.some(isNaN)) return { ok: false, msg: 'Type numbers separated by commas.' };
    if (L.length < part.min) return { ok: false, msg: 'Type at least ' + part.min + ' terms.' };
    return { ok: L.every((a, k) => close(a, part.first + k * part.d)) };
  }
  if (part.t === 'expr') {
    const vr = part.vr, want = parse(part.answer, vr);
    const pts = vr === 'n' ? [1, 2, 3, 4, 5, 7] : [-2, -0.5, 0, 1, 3, 7];
    const same = f => f && pts.every(p => close(f(p), want(p)));
    const body = rhs(raw);
    const f = tryParse(body, vr);
    if (!f) {
      if (/[a-z]/.test(body.replace(new RegExp(vr, 'g'), ''))) return { ok: false, msg: 'Use the letter ' + vr + ' for the variable.' };
      return { ok: false, msg: 'Check your typing. Use ^ for exponents and * or parentheses for multiplying.' };
    }
    if (same(f)) return { ok: true };
    // common slip: 2^n-1 instead of 2^(n-1)
    const fixed = body.replace(/\^([a-z0-9]+)([-+][0-9]+)/, '^($1$2)');
    if (fixed !== body && same(tryParse(fixed, vr))) return { ok: false, msg: 'So close! The whole n − 1 has to be up in the exponent.' };
    return { ok: false };
  }
  return { ok: false };
}
function keyOf(part) {
  if (part.key) return part.key;
  if (part.t === 'mc') return (part.labels || 'ABCDEF')[part.answer] + ') ' + part.choices[part.answer].replace(/<br>/g, ', ').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<');
  if (part.t === 'seq') return part.answer.join(', ');
  if (part.t === 'num') return String(part.answer).replace('-', '\u2212');
  return String(part.answer);
}

// Practice codes: partners share one computer, so each student gets a short code like "Fox7K"
// to open their own sheet later on any device. The letters after the animal are the stations as a
// bitmask, written without look-alike characters (no 0, O, 1, I, L). The animal is a check: it is
// worked out from the stations, so a typo almost always gives the wrong animal. Not case-sensitive.
const ANIMALS = ['Bear', 'Fox', 'Owl', 'Wolf', 'Hawk', 'Otter', 'Tiger', 'Panda', 'Koala', 'Moose', 'Lynx', 'Eagle', 'Shark', 'Zebra', 'Llama', 'Gecko', 'Bison', 'Raven'];
const ABC = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
const animalOf = m => ANIMALS[(Math.imul(m, 2654435761) >>> 0) % ANIMALS.length];
function practiceCode(list) {
  let m = list.reduce((a, n) => a | (1 << (n - 1)), 0), t = '';
  if (!m) return '';
  const m0 = m;
  while (m) { t = ABC[m % ABC.length] + t; m = Math.floor(m / ABC.length); }
  return animalOf(m0) + t;
}
function readCode(code) {
  const c = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const an = ANIMALS.find(a => c.startsWith(a.toUpperCase()));
  if (!an) return null;
  let m = 0;
  for (const ch of c.slice(an.length)) { const d = ABC.indexOf(ch); if (d < 0) return null; m = m * ABC.length + d; }
  if (!m || m >= (1 << 18) || animalOf(m) !== an) return null;
  const out = [];
  for (let n = 1; n <= 18; n++) if (m & (1 << (n - 1))) out.push(n);
  return out;
}


window.U5L2 = { mapping, Q, H: { v, fr, sup, nw, rt, M }, READY: Q, byN: n => Q.find(q => q.n === +n), graph, check, keyOf, clean, SITE, dbBase: () => '',
  practiceCode, readCode, practiceURL: (name, list, period) => 'unit-5-lesson-2-practice.html?name=' + encodeURIComponent(name) + '&q=' + list.join(',') + (period ? '&p=' + period : '') };
})();
