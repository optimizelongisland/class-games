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
function graph(g) {
  const n = g.size || 10, cell = 20, pad = 26, W = 2 * n * cell + 2 * pad;
  const X = x => pad + (x + n) * cell, Y = y => pad + (n - y) * cell;
  let s = '<svg class="graph" viewBox="0 0 ' + W + ' ' + W + '" role="img" aria-label="' + (g.label || 'graph') + '">';
  for (let i = -n; i <= n; i++) {
    s += '<line class="g-grid" x1="' + X(i) + '" y1="' + Y(n) + '" x2="' + X(i) + '" y2="' + Y(-n) + '"/>';
    s += '<line class="g-grid" x1="' + X(-n) + '" y1="' + Y(i) + '" x2="' + X(n) + '" y2="' + Y(i) + '"/>';
  }
  const a = 9, L = pad - 14, R = W - pad + 14;
  s += '<path class="g-axis" d="M' + L + ' ' + Y(0) + 'H' + R + 'M' + X(0) + ' ' + L + 'V' + R + '"/>';
  s += '<path class="g-arrow" d="M' + R + ' ' + Y(0) + 'l-' + a + ' -5v10zM' + L + ' ' + Y(0) + 'l' + a + ' -5v10zM' + X(0) + ' ' + L + 'l-5 ' + a + 'h10zM' + X(0) + ' ' + R + 'l-5 -' + a + 'h10z"/>';
  s += '<text class="g-lab" x="' + (R - 4) + '" y="' + (Y(0) + 22) + '">x</text><text class="g-lab" x="' + (X(0) + 10) + '" y="' + (L + 6) + '">y</text>';
  (g.curves || []).forEach(c => { s += '<path class="g-curve" d="' + curvePath(c, X, Y) + '"/>'; });
  (g.dots || []).forEach(p => { s += '<circle class="g-dot' + (p[2] ? ' open' : '') + '" cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="6"/>'; });
  return s + '</svg>';
}

/* ---------- the questions ----------
   part types:
     mc   : choices[], answer = index of the right choice
     num  : answer = number (fractions and expressions like (1/3)^6 are accepted)
     expr : answer = expression in variable `vr` (any equivalent form is accepted)
     seq  : answer = list of numbers (the first terms)
     aseq : arithmetic sequence that starts at `first` with difference `d` (at least `min` terms)
   `pq` (optional) replaces the part's wording on the printed station sheet; '' leaves it off.
   `hints` are shown one at a time on the hint page and on the device. */
const Q = [
  { n: 1, ready: false, title: 'Is it a function?', text: 'Marcel claims that the graph below represents a function. State whether Marcel is correct. Justify your answer.', parts: [] },
  { n: 2, ready: false, title: 'Which relation is a function?', text: 'Which relation is a function?', parts: [] },
  { n: 3, ready: false, title: 'Evaluate a function', text: 'If f(x) = ?, then f(?) = ?   Choices: a) 1  b) −2  c) −1  d) −13/3', parts: [] },
  { n: 4, ready: false, title: 'Evaluate a function', text: 'A function is defined as ?. The value of ? is   Choices: a) 54  b) 36  c) 0  d) −18', parts: [] },
  { n: 5, ready: true, title: 'Reading a graph',
    text: 'The graph below represents the function ' + v('y') + ' = ' + v('f') + '(' + v('x') + ').',
    graph: { label: 'Curve starting at the closed point (-5, -3), rising to a high point at (0, 2), crossing the x-axis at 4, dipping to about -1.7 near x = 7, and ending at the closed point (8, -1).',
      curves: [[[-5, -3], [-2.65, 0], [-0.6, 1.75], [0.4, 2], [2, 1.35], [4, 0], [6, -1.45], [7, -1.72], [7.65, -1.5], [8, -1]]],
      dots: [[-5, -3], [8, -1]] },
    parts: [
      { t: 'mc', q: 'State the domain and range of this function.',
        choices: ['Domain: ' + M + '5 ≤ ' + v('x') + ' ≤ 8<br>Range: ' + M + '3 ≤ ' + v('y') + ' ≤ 2',
                  'Domain: ' + M + '3 ≤ ' + v('x') + ' ≤ 2<br>Range: ' + M + '5 ≤ ' + v('y') + ' ≤ 8',
                  'Domain: ' + M + '5 ≤ ' + v('x') + ' ≤ 8<br>Range: ' + M + '3 ≤ ' + v('y') + ' ≤ ' + M + '1',
                  'Domain: ' + M + '10 ≤ ' + v('x') + ' ≤ 10<br>Range: ' + M + '10 ≤ ' + v('y') + ' ≤ 10'],
        answer: 0, key: 'Domain ' + M + '5 ≤ x ≤ 8, Range ' + M + '3 ≤ y ≤ 2',
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
    text: 'What is (' + v('x') + ' ' + M + ' 4)' + sup(2) + ' subtracted from (' + v('x') + sup(2) + ' + 3' + v('x') + ' ' + M + ' 4)?',
    parts: [
      { t: 'expr', vr: 'x', q: 'Type your simplified answer.', pq: '', answer: '11x-20', key: '11x ' + M + ' 20', prefix: '',
        hints: ['"A subtracted from B" means B ' + M + ' A. So start with (' + v('x') + sup(2) + ' + 3' + v('x') + ' ' + M + ' 4) ' + M + ' (' + v('x') + ' ' + M + ' 4)' + sup(2) + '.',
                '(' + v('x') + ' ' + M + ' 4)' + sup(2) + ' means (' + v('x') + ' ' + M + ' 4)(' + v('x') + ' ' + M + ' 4). Multiply it out first. It is NOT ' + v('x') + sup(2) + ' + 16.',
                'Put the expanded square in parentheses, then distribute the subtraction to EVERY term before combining like terms.'] }
    ] },
  { n: 7, ready: false, title: 'Domain from a graph', text: 'What is the domain of the function shown below?', parts: [] },
  { n: 8, ready: false, title: 'Range of data', text: 'Data collected during an experiment are shown in the accompanying graph. What is the range of this set of data?', parts: [] },
  { n: 9, ready: true, title: 'Terms from a formula',
    text: 'Find the first 5 terms given the formula ' + v('f') + '(' + v('n') + ') = 3(' + v('n') + ' ' + M + ' 1) + 4',
    parts: [
      { t: 'seq', q: 'Type the first 5 terms, separated by commas.', pq: '', answer: [4, 7, 10, 13, 16], placeholder: 'e.g. 1, 2, 3, 4, 5',
        hints: ['The first term is ' + v('f') + '(1). Replace ' + v('n') + ' with 1.',
                v('f') + '(1) = 3(1 ' + M + ' 1) + 4 = 3(0) + 4. Now do ' + v('f') + '(2), ' + v('f') + '(3), ' + v('f') + '(4), ' + v('f') + '(5).',
                'Check: do the terms go up by the same amount each time? They should!'] }
    ] },
  { n: 10, ready: true, title: 'Terms from a formula',
    text: 'Find the first 5 terms given the formula ' + v('f') + '(' + v('n') + ') = 2(5)' + sup(v('n') + ' ' + M + ' 1'),
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
                'Type exponents with ^ and put the exponent in parentheses, like 3(4)^(n-1).'] },
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
    text: 'Write an arithmetic sequence in which ' + v('a') + '<sub>1</sub> = 3 and ' + v('a') + '<sub>4</sub> = 15. Find the 13th term.',
    parts: [
      { t: 'aseq', q: 'Write the sequence. Type at least the first 4 terms, separated by commas.', pq: 'Write the sequence.', first: 3, d: 4, min: 4, key: '3, 7, 11, 15, …', placeholder: 'e.g. 1, 2, 3, 4',
        hints: ['You know the 1st term (3) and the 4th term (15). Draw 4 blanks: 3, __, __, 15.',
                'To get from the 1st term to the 4th term you add the common difference 3 times. So 3 + 3' + v('d') + ' = 15.',
                'Solve for ' + v('d') + ', then keep adding ' + v('d') + ' to fill in the blanks.'] },
      { t: 'num', q: 'Find the 13th term.', answer: 51, prefix: v('a') + '<sub>13</sub> =',
        hints: ['Use ' + v('a') + '<sub>' + v('n') + '</sub> = ' + v('a') + '<sub>1</sub> + (' + v('n') + ' ' + M + ' 1)' + v('d') + ' with ' + v('n') + ' = 13.',
                'From the 1st term to the 13th term you add ' + v('d') + ' twelve times.'] }
    ] },
  { n: 14, ready: true, title: 'Geometric sequence with fractions',
    text: 'The terms of a geometric sequence are given below.<br>1, &nbsp;' + fr('1', '3') + ', &nbsp;' + fr('1', '9') + ', &nbsp;' + fr('1', '27') + ', …',
    parts: [
      { t: 'expr', vr: 'n', q: 'Write a rule for the ' + v('n') + 'th term of this geometric sequence.', answer: '(1/3)^(n-1)', key: 'aₙ = 1(1/3)ⁿ⁻¹', prefix: v('a') + '<sub>' + v('n') + '</sub> =', keypad: true,
        hints: ['Geometric rule: ' + v('a') + '<sub>' + v('n') + '</sub> = ' + v('a') + '<sub>1</sub> · ' + v('r') + sup('(' + v('n') + ' ' + M + ' 1)') + '.',
                'To find ' + v('r') + ', divide any term by the term before it: ' + fr('1', '3') + ' ÷ 1 = ?',
                'Type fractions with / and put them in parentheses, like (2/5)^(n-1).'] },
      { t: 'num', q: 'Determine the 7th term.', answer: 1 / 729, key: '1/729', prefix: v('a') + '<sub>7</sub> =',
        hints: ['Replace ' + v('n') + ' with 7 in your rule.', '(' + fr('1', '3') + ')' + sup('6') + ' = ' + fr('1' + sup('6'), '3' + sup('6')) + '. Type it as a fraction like 1/100.'] }
    ] },
  { n: 15, ready: false, title: 'Domain and range', text: 'State the domain and range of the function.', parts: [] },
  { n: 16, ready: false, title: 'Domain and range', text: 'State the domain and range of the function.', parts: [] },
  { n: 17, ready: true, title: 'Common ratio of −2',
    text: 'A geometric sequence with a common ratio of ' + M + '2 is',
    parts: [
      { t: 'mc', q: 'Choose the sequence.', pq: '', letters: true,
        choices: ['6, 4, 2, 0, …', '5, 7, 9, 11, …', M + '3, 6, ' + M + '12, 24, …', M + '10, ' + M + '8, ' + M + '6, ' + M + '4, …'], answer: 2,
        hints: ['Common ratio ' + M + '2 means you MULTIPLY by ' + M + '2 to get the next term.',
                'Multiplying by a negative flips the sign every time, so the signs should alternate.',
                'Test each choice: divide the 2nd term by the 1st term. Which one gives ' + M + '2?'] }
    ] },
  { n: 18, ready: true, title: 'Solve for x',
    text: 'If ' + v('f') + '(' + v('x') + ') = ' + fr('5' + v('x') + ' ' + M + ' 9', '2') + ', algebraically determine the value of ' + v('x') + ' when ' + v('f') + '(' + v('x') + ') = 8.',
    parts: [
      { t: 'num', q: 'What is ' + v('x') + '? (Writer: show every step on paper!)', pq: 'Show every step.', answer: 5, prefix: v('x') + ' =',
        hints: [v('f') + '(' + v('x') + ') = 8 means the whole fraction equals 8. Write ' + fr('5' + v('x') + ' ' + M + ' 9', '2') + ' = 8.',
                'Undo the division first: multiply both sides by 2.',
                'Then add 9 to both sides and divide by 5. Check by plugging your answer back in.'] }
    ] }
];

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
    if (fixed !== body && same(tryParse(fixed, vr))) return { ok: false, msg: 'So close! Put the exponent in parentheses: ^(n−1).' };
    return { ok: false };
  }
  return { ok: false };
}
function keyOf(part) {
  if (part.key) return part.key;
  if (part.t === 'mc') return String.fromCharCode(65 + part.answer) + ') ' + part.choices[part.answer].replace(/<br>/g, ', ').replace(/<[^>]+>/g, '');
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

window.U5R2 = { Q, READY: Q.filter(q => q.ready), byN: n => Q.find(q => q.n === +n), graph, check, keyOf, clean,
  SITE, dbBase, dbWrite, dbPush, dbRead, currentSession, today,
  hintURL: n => SITE + 'games/unit-5-review-2-hints.html?q=' + n };
})();
