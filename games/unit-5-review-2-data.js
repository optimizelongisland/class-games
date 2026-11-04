/* Unit 5 Review #2 (packet pages 102 to 107): questions, answer checking, hints and shared settings.
   Used by unit-5-review-2-stations.html (students), unit-5-review-2-teacher.html (teacher board)
   and unit-5-review-2-hints.html (the "Need a hint?" QR page).

   LIVE BOARD SETUP: paste your Firebase Realtime Database URL below, e.g.
   'https://unit5-review-default-rtdb.firebaseio.com'. Leave it empty and the game still works,
   it just can't report to the teacher board. */
(function () {
'use strict';
const FIREBASE_URL = '';
const SITE = 'https://optimizelongisland.github.io/class-games/';
const ROOT = 'u5r2';                       // top-level key in the database

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
  let d = 'M' + X(pts[0][0]) + ' ' + Y(pts[0][1]);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ' C' + [X(c1[0]), Y(c1[1]), X(c2[0]), Y(c2[1]), X(p2[0]), Y(p2[1])].map(n => n.toFixed(1)).join(' ');
  }
  return d;
}
/* g: { x:[min,max], y:[min,max] (default -10..10), gx/gy: units per grid square (default 1),
        ticks: {x:step, y:step} to print numbers on the axes, xTitle/yTitle,
        curves: [ [[x,y],...] or {p:[[x,y],...], arrow:true} ], dots: [[x,y,open?]] } */
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
    if (c.arrow) {
      const [p, q] = [P[P.length - 2], P[P.length - 1]], ang = Math.atan2(Y(q[1]) - Y(p[1]), X(q[0]) - X(p[0])) * 180 / Math.PI;
      s += '<path class="g-arrow" transform="translate(' + f(X(q[0])) + ' ' + f(Y(q[1])) + ') rotate(' + f(ang) + ')" d="M4 0l-14 -7v14z"/>';
    }
  });
  (g.dots || []).forEach(p => { s += '<circle class="g-dot' + (p[2] ? ' open' : '') + '" cx="' + f(X(p[0])) + '" cy="' + f(Y(p[1])) + '" r="6"/>'; });
  return s + '</svg>';
}

/* ---------- the questions ----------
   part types:
     mc   : choices[], answer = index of the right choice
     num  : answer = number (fractions and expressions like (1/3)^6 are accepted)
     expr : answer = expression in variable `vr` (any equivalent form is accepted)
     seq  : answer = list of numbers (the first terms)
     aseq : arithmetic sequence that starts at `first` with difference `d` (at least `min` terms)
   `noprint: true` leaves a part off the printed sheet; `pc: false` prints it without its choices.
   `pq` (optional) replaces the part's wording on the printed station sheet; '' leaves it off.
   `hints` are shown one at a time on the hint page and on the device. */
const Q = [
  { n: 1, ready: true, title: 'Is it a function?',
    text: 'Marcel claims that the graph below represents a function.',
    graph: { x: [-4, 4], y: [-4, 4], ticks: { x: 1, y: 1 },
      label: 'A V shape from (-4, 3) down to (-1, 0) and up to a closed dot at (2, 3); a second piece starts at a closed dot at (2, -1) and curves up through (3, 0) to (4, 3).',
      curves: [[[-4, 3], [-1, 0]], [[-1, 0], [2, 3]], [[2, -1], [2.55, -0.65], [3, 0], [3.45, 0.9], [3.8, 2], [4, 3]]],
      dots: [[2, 3], [2, -1]] },
    parts: [
      { t: 'mc', q: 'State whether Marcel is correct. Justify your answer.', labels: '1234',
        choices: ['Yes, Marcel is correct. The graph passes the vertical line test.',
                  'Yes, Marcel is correct. Every ' + nw(v('x') + '-value') + ' on the graph has a ' + nw(v('y') + '-value') + '.',
                  'No, Marcel is not correct. ' + nw(v('x') + ' = 2') + ' is paired with two ' + nw(v('y') + '-values') + ', 3 and ' + M + '1, so the graph fails the vertical line test.',
                  'No, Marcel is not correct. The graph has a V shape, so it cannot be a function.'], answer: 2,
        hints: ['A graph is a function if every x-value has only ONE y-value.',
                'Use the vertical line test: slide a pencil held straight up and down across the graph. Does it ever touch the graph in two places at once?',
                'Look closely at the two closed dots. What x-value are they both at?'] }
    ] },
  { n: 2, ready: true, title: 'Which relation is a function?',
    text: 'Which relation is a function?',
    parts: [
      { t: 'mc', q: 'Choose the relation that is a function.', pq: '', labels: '1234',
        choices: ['{(2, 1), (3, 1), (4, 1), (5, 1)}', '{(1, 2), (1, 3), (1, 4), (1, 5)}', '{(2, 3), (3, 2), (4, 2), (2, 4)}', '{(1, 6), (2, 8), (3, 9), (3, 12)}'], answer: 0,
        hints: ['In a function, each x-value (the first number in each pair) shows up only ONCE.',
                'Look at the first number of every ordered pair. Does any first number repeat?',
                'Repeating y-values is OK! Only repeating x-values with different y-values breaks a function.'] }
    ] },
  { n: 3, ready: true, title: 'Evaluate a function',
    text: 'If ' + v('f') + '(' + v('x') + ') = ' + fr(rt('2' + v('x') + ' + 3'), '6' + v('x') + ' ' + M + ' 5') + ', then ' + v('f') + '(' + fr('1', '2') + ') =',
    parts: [
      { t: 'mc', q: 'Choose the value.', pq: '', labels: 'abcd',
        choices: ['1', M + '2', M + '1', M + '\u2009' + fr('13', '3')], answer: 2,
        hints: ['Replace EVERY ' + v('x') + ' with ' + fr('1', '2') + '.',
                'Top: 2(' + fr('1', '2') + ') + 3 = 1 + 3. Bottom: 6(' + fr('1', '2') + ') ' + M + ' 5 = 3 ' + M + ' 5.',
                'Take the square root of the top, then divide by the bottom.'] }
    ] },
  { n: 4, ready: true, title: 'Evaluate a function',
    text: 'A function is defined as ' + nw(v('K') + '(' + v('x') + ') = 2' + v('x') + sup(2) + ' ' + M + ' 5' + v('x') + ' + 3') + '. The value of ' + nw(v('K') + '(' + M + '3)') + ' is',
    parts: [
      { t: 'mc', q: 'Choose the value.', pq: '', labels: 'abcd', choices: ['54', '36', '0', M + '18'], answer: 1,
        hints: ['Replace every ' + v('x') + ' with (' + M + '3). Keep the parentheses!',
                '2(' + M + '3)' + sup(2) + ' ' + M + ' 5(' + M + '3) + 3. Do the exponent first: (' + M + '3)' + sup(2) + ' = 9, not ' + M + '9.',
                M + '5 times ' + M + '3 is positive 15.'] }
    ] },
  { n: 5, ready: true, title: 'Reading a graph',
    text: 'The graph below represents the function ' + v('y') + ' = ' + v('f') + '(' + v('x') + ').',
    graph: { x: [-7, 10], y: [-5, 5], label: 'Curve starting at the closed point (-5, -3), rising to a high point at (0, 2), crossing the x-axis at 4, dipping to about -1.7 near x = 7, and ending at the closed point (8, -1).',
      curves: [[[-5, -3], [-2.65, 0], [-0.6, 1.75], [0.4, 2], [2, 1.35], [4, 0], [6, -1.45], [7, -1.72], [7.65, -1.5], [8, -1]]],
      dots: [[-5, -3], [8, -1]] },
    parts: [
      { t: 'mc', q: 'State the domain and range of this function.',
        choices: ['Domain: ' + M + '5 ≤ ' + v('x') + ' ≤ 8<br>Range: ' + M + '3 ≤ ' + v('y') + ' ≤ ' + M + '1',
                  'Domain: ' + M + '5 ≤ ' + v('x') + ' ≤ 8<br>Range: ' + M + '3 ≤ ' + v('y') + ' ≤ 2',
                  'Domain: ' + M + '3 ≤ ' + v('x') + ' ≤ 2<br>Range: ' + M + '5 ≤ ' + v('y') + ' ≤ 8',
                  'Domain: ' + M + '10 ≤ ' + v('x') + ' ≤ 10<br>Range: ' + M + '10 ≤ ' + v('y') + ' ≤ 10'],
        answer: 1, key: 'Domain ' + M + '5 ≤ x ≤ 8, Range ' + M + '3 ≤ y ≤ 2',
        hints: ['Domain = every x-value the graph covers, from left to right. Find the x-value of the leftmost dot and the rightmost dot.',
                'Range = every y-value the graph covers, from bottom to top. Look for the lowest point and the highest point on the whole graph. They are not always the endpoints!',
                'The highest point is the top of the hill. The lowest point is the left endpoint.'] },
      { t: 'num', q: 'What is the value of ' + v('x') + ' when ' + v('f') + '(' + v('x') + ') = ' + M + '3?', answer: -5, prefix: v('x') + ' =',
        hints: [v('f') + '(' + v('x') + ') is the same as ' + v('y') + '. So you are looking for the point where ' + v('y') + ' = ' + M + '3.',
                'Find ' + M + '3 on the y-axis. Slide across until you hit the graph.',
                'Read the x-value of that point. (It is one of the dots.)'] },
      { t: 'num', q: 'What is ' + v('f') + '(4)?', answer: 0, prefix: v('f') + '(4) =',
        hints: ['The 4 inside the parentheses is an x-value.',
                'Find 4 on the x-axis, then move up or down until you hit the graph.',
                'What is the y-value of the graph at that spot?'] }
    ] },
  { n: 6, ready: true, title: 'Subtracting polynomials',
    text: 'What is ' + nw('(' + v('x') + ' ' + M + ' 4)' + sup(2)) + ' subtracted from ' + nw('(' + v('x') + sup(2) + ' + 3' + v('x') + ' ' + M + ' 4)') + '?',
    parts: [
      { t: 'expr', vr: 'x', q: 'Type your simplified answer.', pq: '', answer: '11x-20', key: '11x ' + M + ' 20', prefix: '',
        hints: ['"A subtracted from B" means B ' + M + ' A. So start with (' + v('x') + sup(2) + ' + 3' + v('x') + ' ' + M + ' 4) ' + M + ' (' + v('x') + ' ' + M + ' 4)' + sup(2) + '.',
                '(' + v('x') + ' ' + M + ' 4)' + sup(2) + ' means (' + v('x') + ' ' + M + ' 4)(' + v('x') + ' ' + M + ' 4). Multiply it out first. It is NOT ' + v('x') + sup(2) + ' + 16.',
                'Put the expanded square in parentheses, then distribute the subtraction to EVERY term before combining like terms.'] }
    ] },
  { n: 7, ready: true, title: 'Domain from a graph',
    text: 'What is the domain of the function shown below?',
    graph: { x: [-4, 9], y: [-5, 7],
      label: 'A curve that starts at a closed dot at (-1, 1), dips to (0, -1), rises to a peak at (3, 5), and falls to a closed dot at (6, -2).',
      curves: [[[-1, 1], [-0.75, 0], [-0.4, -0.65], [0, -1], [0.35, -0.5], [0.7, 1.6], [1.2, 3], [2.2, 4.5], [3, 5], [3.5, 4.3], [4.4, 1.8], [5, 0], [6, -2]]],
      dots: [[-1, 1], [6, -2]] },
    parts: [
      { t: 'mc', q: 'Choose the domain.', pq: '', labels: '1234',
        choices: [M + '1 ≤ ' + v('x') + ' ≤ 6', M + '1 ≤ ' + v('y') + ' ≤ 6', M + '2 ≤ ' + v('x') + ' ≤ 5', M + '2 ≤ ' + v('y') + ' ≤ 5'], answer: 0,
        hints: ['Domain is about x-values, so the answer uses ' + v('x') + ', not ' + v('y') + '.',
                'Find the leftmost point of the graph and the rightmost point.',
                'Read the x-value of each endpoint dot. Count the grid boxes carefully from the y-axis.'] }
    ] },
  { n: 8, ready: true, title: 'Range of data',
    text: 'Data collected during an experiment are shown in the accompanying graph.',
    graph: { x: [0, 10], y: [0, 100], gy: 12.5, ticks: { x: 1, y: 25 }, xTitle: 'pH', yTitle: 'Percent Maximum Activity of Trypsin',
      label: 'Percent maximum activity of trypsin versus pH. The curve starts at (2.5, 0), rises to a peak of 100 near pH 6.3, then falls to about 8 at pH 9.5.',
      curves: [[[2.5, 0], [3.2, 8], [3.9, 26], [4.9, 59], [5.7, 88], [6.3, 100], [6.8, 92], [7.4, 72], [8.0, 55], [8.3, 40], [8.5, 22], [9, 13], [9.5, 8]]],
      dots: [[2.5, 0], [9.5, 8]] },
    parts: [
      { t: 'mc', q: 'What is the range of this set of data?', labels: '1234',
        choices: ['2.5 ≤ ' + v('y') + ' ≤ 9.5', '2.5 ≤ ' + v('x') + ' ≤ 9.5', '0 ≤ ' + v('y') + ' ≤ 100', '1 ≤ ' + v('x') + ' ≤ 10'], answer: 2,
        hints: ['Range is about the y-values (up and down), so the answer uses ' + v('y') + '.',
                'Find the lowest point and the highest point of the curve on the y-axis.',
                'Read the y-axis numbers: the y-axis shows Percent Maximum Activity, not pH.'] }
    ] },
  { n: 9, ready: true, title: 'Terms from a formula',
    text: 'Find the first 5 terms given the formula ' + nw(v('f') + '(' + v('n') + ') = 3(' + v('n') + ' ' + M + ' 1) + 4'),
    parts: [
      { t: 'seq', q: 'Type the first 5 terms, separated by commas.', pq: '', answer: [4, 7, 10, 13, 16], placeholder: 'e.g. 1, 2, 3, 4, 5',
        hints: ['The first term is ' + v('f') + '(1). Replace ' + v('n') + ' with 1.',
                v('f') + '(1) = 3(1 ' + M + ' 1) + 4 = 3(0) + 4. Now do ' + v('f') + '(2), ' + v('f') + '(3), ' + v('f') + '(4), ' + v('f') + '(5).',
                'Check: do the terms go up by the same amount each time? They should!'] }
    ] },
  { n: 10, ready: true, title: 'Terms from a formula',
    text: 'Find the first 5 terms given the formula ' + nw(v('f') + '(' + v('n') + ') = 2(5)' + sup(v('n') + ' ' + M + ' 1')),
    parts: [
      { t: 'seq', q: 'Type the first 5 terms, separated by commas.', pq: '', answer: [2, 10, 50, 250, 1250], placeholder: 'e.g. 1, 2, 3, 4, 5',
        hints: ['The first term is ' + v('f') + '(1). Replace ' + v('n') + ' with 1: 2(5)' + sup('1 ' + M + ' 1') + ' = 2(5)' + sup('0') + '.',
                'Anything to the 0 power is 1. Do the exponent BEFORE you multiply by 2.',
                'Each term is 5 times the one before it.'] }
    ] },
  { n: 11, ready: true, title: 'Sequence: 1, 2, 4, 8, ...',
    text: 'Given the following: &nbsp;1, 2, 4, 8, 16, 32, …',
    parts: [
      { t: 'mc', q: 'Is the pattern Arithmetic, Geometric, or Neither?', choices: ['Arithmetic', 'Geometric', 'Neither'], answer: 1,
        hints: ['Arithmetic = you ADD the same number each time. Geometric = you MULTIPLY by the same number each time.',
                'Is 1 → 2 → 4 → 8 adding the same number each time, or multiplying by the same number?'] },
      { t: 'expr', vr: 'n', q: 'Write a rule that represents the ' + v('n') + 'th term of the sequence.', answer: '2^(n-1)', key: 'aₙ = 1(2)ⁿ⁻¹', prefix: v('a') + '<sub>' + v('n') + '</sub> =', keypad: true,
        hints: ['Geometric rule: ' + v('a') + '<sub>' + v('n') + '</sub> = ' + v('a') + '<sub>1</sub> · ' + v('r') + sup('(' + v('n') + ' ' + M + ' 1)') + '.',
                v('a') + '<sub>1</sub> is the first term. ' + v('r') + ' is what you multiply by each time.',
                'Tap ^ to go up into the exponent, type ' + v('n') + ' ' + M + ' 1 there, then tap ↓ to come back down.'] },
      { t: 'num', q: 'Find the 10th term of the sequence.', answer: 512, prefix: v('a') + '<sub>10</sub> =',
        hints: ['Use your rule and replace ' + v('n') + ' with 10.', 'Do the exponent first: 2' + sup('9') + ' means 2 multiplied by itself 9 times.'] }
    ] },
  { n: 12, ready: true, title: 'Sequence: 4, 7, 10, ...',
    text: 'Given the following: &nbsp;4, 7, 10, 13, 16, …',
    parts: [
      { t: 'mc', q: 'Is the pattern Arithmetic, Geometric, or Neither?', choices: ['Arithmetic', 'Geometric', 'Neither'], answer: 0,
        hints: ['Arithmetic = you ADD the same number each time. Geometric = you MULTIPLY by the same number each time.',
                'What do you do to 4 to get 7? To 7 to get 10?'] },
      { t: 'expr', vr: 'n', q: 'Write a rule that represents the ' + v('n') + 'th term of the sequence.', answer: '3n+1', key: 'aₙ = 4 + 3(n ' + M + ' 1)  or  aₙ = 3n + 1', prefix: v('a') + '<sub>' + v('n') + '</sub> =', keypad: true,
        hints: ['Arithmetic rule: ' + v('a') + '<sub>' + v('n') + '</sub> = ' + v('a') + '<sub>1</sub> + (' + v('n') + ' ' + M + ' 1)' + v('d') + '.',
                v('a') + '<sub>1</sub> is the first term. ' + v('d') + ' is the common difference (what you add each time).',
                'Check your rule: when ' + v('n') + ' = 1 it should give 4, and when ' + v('n') + ' = 2 it should give 7.'] },
      { t: 'num', q: 'Find the 12th term of the sequence.', answer: 37, prefix: v('a') + '<sub>12</sub> =',
        hints: ['Use your rule and replace ' + v('n') + ' with 12.', 'Remember order of operations: parentheses, then multiply, then add.'] }
    ] },
  { n: 13, ready: true, title: 'Build an arithmetic sequence',
    text: 'Write an arithmetic sequence in which ' + nw(v('a') + '<sub>1</sub> = 3') + ' and ' + nw(v('a') + '<sub>4</sub> = 15') + '. Find the 13th term.',
    parts: [
      { t: 'expr', vr: 'n', q: 'Write a rule for the ' + v('n') + 'th term of the sequence.', pq: 'Write a rule for the ' + v('n') + 'th term.', answer: '3+4(n-1)', key: 'aₙ = 3 + 4(n − 1)  or  aₙ = 4n − 1', prefix: v('a') + '<sub>' + v('n') + '</sub> =', keypad: true,
        hints: ['You know the 1st term (3) and the 4th term (15). Draw 4 blanks: 3, __, __, 15.',
                'To get from the 1st term to the 4th term you add the common difference 3 times. So 3 + 3' + v('d') + ' = 15. Solve for ' + v('d') + '.',
                'Put ' + v('a') + '<sub>1</sub> and ' + v('d') + ' into ' + nw(v('a') + '<sub>' + v('n') + '</sub> = ' + v('a') + '<sub>1</sub> + ' + v('d') + '(' + v('n') + ' ' + M + ' 1)') + '.'] },
      { t: 'num', q: 'Find the 13th term.', answer: 51, prefix: v('a') + '<sub>13</sub> =',
        hints: ['Use ' + v('a') + '<sub>' + v('n') + '</sub> = ' + v('a') + '<sub>1</sub> + (' + v('n') + ' ' + M + ' 1)' + v('d') + ' with ' + v('n') + ' = 13.',
                'From the 1st term to the 13th term you add ' + v('d') + ' twelve times.'] }
    ] },
  { n: 14, ready: true, title: 'Geometric sequence with fractions',
    text: 'The terms of a geometric sequence are given below.<br><span class="terms">1, &nbsp;&nbsp;' + fr('1', '3') + ', &nbsp;&nbsp;' + fr('1', '9') + ', &nbsp;&nbsp;' + fr('1', '27') + ', &nbsp;…</span>',
    parts: [
      { t: 'expr', vr: 'n', q: 'Write a rule for the ' + v('n') + 'th term of this geometric sequence.', answer: '(1/3)^(n-1)', key: 'aₙ = 1(1/3)ⁿ⁻¹', prefix: v('a') + '<sub>' + v('n') + '</sub> =', keypad: true,
        hints: ['Geometric rule: ' + v('a') + '<sub>' + v('n') + '</sub> = ' + v('a') + '<sub>1</sub> · ' + v('r') + sup('(' + v('n') + ' ' + M + ' 1)') + '.',
                'To find ' + v('r') + ', divide any term by the term before it: ' + fr('1', '3') + ' ÷ 1 = ?',
                'Type the fraction with / inside parentheses, like (2/5). Then tap ^ and type ' + v('n') + ' ' + M + ' 1 up in the exponent.'] },
      { t: 'num', q: 'Determine the 7th term.', answer: 1 / 729, key: '1/729', prefix: v('a') + '<sub>7</sub> =',
        hints: ['Replace ' + v('n') + ' with 7 in your rule.', '(' + fr('1', '3') + ')' + sup('6') + ' = ' + fr('1' + sup('6'), '3' + sup('6')) + '. Type it as a fraction like 1/100.'] }
    ] },
  { n: 15, ready: true, title: 'Domain and range',
    text: 'State the domain and range of the function.',
    graph: { x: [-5, 5], y: [-5, 5], ticks: { x: 1, y: 1 },
      label: 'A downward parabola starting at a closed dot at (-3, -5), rising to a high point at (0, 4), and ending at an open circle at (2, 0).',
      curves: [[[-3, -5], [-2.5, -2.25], [-2, 0], [-1, 3], [0, 4], [1, 3], [1.5, 1.75], [2, 0]]],
      dots: [[-3, -5], [2, 0, 1]] },
    parts: [
      { t: 'mc', q: 'Choose the domain and range.', pq: '',
        choices: ['Domain: ' + M + '3 ≤ ' + v('x') + ' ≤ 2<br>Range: ' + M + '5 ≤ ' + v('y') + ' ≤ 4',
                  'Domain: ' + M + '5 ≤ ' + v('x') + ' ≤ 4<br>Range: ' + M + '3 ≤ ' + v('y') + ' &lt; 2',
                  'Domain: ' + M + '3 ≤ ' + v('x') + ' &lt; 2<br>Range: ' + M + '5 ≤ ' + v('y') + ' ≤ 4',
                  'Domain: ' + M + '3 ≤ ' + v('x') + ' &lt; 2<br>Range: ' + M + '5 ≤ ' + v('y') + ' ≤ 0'], answer: 2,
        hints: ['Domain: read the x-values from the left end to the right end. Range: read the y-values from the lowest point to the highest point.',
                'An OPEN circle means that point is NOT included, so use &lt; instead of ≤ on that side.',
                'The highest point is the top of the curve, not an endpoint.'] }
    ] },
  { n: 16, ready: true, title: 'Domain and range',
    text: 'State the domain and range of the function.',
    alt: { title: 'Another way to write it',
      html: 'Domain: ' + M + '3 \u2264 ' + v('x') + ' &lt; \u221e<br>Range: 0 \u2264 ' + v('y') + ' &lt; \u221e',
      note: 'The \u221e (infinity) symbol means the graph keeps going forever, which is what the arrow shows. Use &lt; next to \u221e, never \u2264, because you can never actually reach infinity.' },
    graph: { x: [-5, 5], y: [-5, 5],
      label: 'A square-root shaped curve starting at a closed point at (-3, 0) and rising slowly to the right, with an arrow showing it keeps going.',
      curves: [{ p: [[-3, 0], [-2.85, 0.39], [-2.5, 0.71], [-2, 1], [-1, 1.41], [0, 1.73], [1, 2], [2.5, 2.35], [4, 2.65], [5.3, 2.88]], arrow: true }] },
    parts: [
      { t: 'mc', q: 'Choose the domain and range.', pq: '',
        choices: ['Domain: ' + v('x') + ' ≥ 0<br>Range: ' + v('y') + ' ≥ ' + M + '3',
                  'Domain: ' + M + '3 ≤ ' + v('x') + ' ≤ 5<br>Range: 0 ≤ ' + v('y') + ' ≤ 3',
                  'Domain: all real numbers<br>Range: ' + v('y') + ' ≥ 0',
                  'Domain: ' + v('x') + ' ≥ ' + M + '3<br>Range: ' + v('y') + ' ≥ 0'], answer: 3,
        hints: ['Where does the graph start? Find its x-value and y-value.',
                'The arrow means the graph keeps going forever to the right AND keeps going up (slowly).',
                'So x starts at the starting point and never stops, and y starts at the starting point and never stops.'] }
    ] },
  { n: 17, ready: true, title: 'Common ratio of −2',
    text: 'A geometric sequence with a common ratio of ' + M + '2 is',
    parts: [
      { t: 'mc', q: 'Choose the sequence.', pq: '', labels: 'abcd',
        choices: ['6, 4, 2, 0, …', '5, 7, 9, 11, …', M + '3, 6, ' + M + '12, 24, …', M + '10, ' + M + '8, ' + M + '6, ' + M + '4, …'], answer: 2,
        hints: ['Common ratio ' + M + '2 means you MULTIPLY by ' + M + '2 to get the next term.',
                'Multiplying by a negative flips the sign every time, so the signs should alternate.',
                'Test each choice: divide the 2nd term by the 1st term. Which one gives ' + M + '2?'] }
    ] },
  { n: 18, ready: true, title: 'Solve for x',
    text: 'If ' + nw(v('f') + '(' + v('x') + ') =') + ' ' + fr('5' + v('x') + ' ' + M + ' 9', '2') + ', algebraically determine the value of ' + v('x') + ' when ' + nw(v('f') + '(' + v('x') + ') = 8') + '.',
    parts: [
      { t: 'num', q: 'What is ' + v('x') + '? (Recorder: show every step on paper!)', pq: '', answer: 5, prefix: v('x') + ' =',
        hints: [v('f') + '(' + v('x') + ') = 8 means the whole fraction equals 8. Write ' + fr('5' + v('x') + ' ' + M + ' 9', '2') + ' = 8.',
                'Undo the division first: multiply both sides by 2.',
                'Then add 9 to both sides and divide by 5. Check by plugging your answer back in.'] }
    ] }
];

// estimated minutes a pair of partners needs at each station (writing the work, explaining, typing)
const EST = { 1: 3, 2: 2, 3: 3, 4: 3, 5: 5, 6: 4, 7: 2, 8: 2, 9: 3, 10: 3, 11: 5, 12: 5, 13: 4, 14: 5, 15: 3, 16: 3, 17: 2, 18: 4 };
Q.forEach(q => { q.est = EST[q.n] || 3; });

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

/* ---------- live board (Firebase Realtime Database over plain REST) ---------- */
function dbBase() {
  let u = '';
  try { u = new URLSearchParams(location.search).get('db') || localStorage.getItem('u5r2-db') || ''; } catch (e) {}
  u = (u || FIREBASE_URL || '').trim().replace(/\/+$/, '');
  return /^https:\/\/[a-z0-9.-]+\.(firebaseio\.com|firebasedatabase\.app)$/i.test(u) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(u) ? u : '';
}
function url(path, method) {
  const b = dbBase(); if (!b) return '';
  return b + '/' + ROOT + '/' + path + '.json' + (method ? '?x-http-method-override=' + method : '');
}
// Writes go out as POST + text/plain with a method override, which avoids CORS preflight
// requests that some school web filters choke on.
async function dbWrite(path, data, method) {
  const u = url(path, method || 'PUT'); if (!u) return false;
  try { const r = await fetch(u, { method: 'POST', body: JSON.stringify(data), keepalive: true }); return r.ok; } catch (e) { return false; }
}
async function dbPush(path, data) {
  const u = url(path); if (!u) return false;
  try { const r = await fetch(u, { method: 'POST', body: JSON.stringify(data), keepalive: true }); return r.ok; } catch (e) { return false; }
}
async function dbRead(path) {
  const u = url(path); if (!u) return undefined;
  try { const r = await fetch(u, { cache: 'no-store' }); if (!r.ok) return undefined; return await r.json(); } catch (e) { return undefined; }
}
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
// the teacher board sets the current class period; if it never has, everyone shares a per-day session
async function currentSession() {
  const c = await dbRead('current');
  if (c && c.id) return c;
  return { id: 'day-' + today(), label: 'Today' };
}

// students pick their class period; each period gets its own session for the day
const PERIODS = [1, 3];
const periodSession = p => ({ id: 'day-' + today() + '-p' + p, label: 'Period ' + p, period: +p });

window.U5R2 = { Q, PERIODS, periodSession, H: { v, fr, sup, nw, rt, M }, READY: Q.filter(q => q.ready), byN: n => Q.find(q => q.n === +n), graph, check, keyOf, clean,
  SITE, dbBase, dbWrite, dbPush, dbRead, currentSession, today,
  practiceURL: (name, list, period) => 'unit-5-review-2-practice.html?name=' + encodeURIComponent(name) + '&q=' + list.join(',') + (period ? '&p=' + period : ''),
  hintURL: (n, alt) => SITE + 'games/unit-5-review-2-hints.html?q=' + n + (alt ? '&alt=1' : '') };
})();
