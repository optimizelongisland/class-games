/* Unit 5 Review #2: extra practice for each station, used by unit-5-review-2-practice.html.
   Each station has one worked example (with steps) and two "try it" problems with answers.
   These are new problems written for practice, in the same style as the review packet. */
(function () {
'use strict';
const U = window.U5R2, { v, fr, sup, nw, rt, M } = U.H;
const x = v('x'), y = v('y'), n = v('n'), f = v('f');
const fx = (name, arg) => nw(v(name || 'f') + '(' + (arg === undefined ? x : arg) + ')');
const an = s => v('a') + '<sub>' + s + '</sub>';
const le = ' ≤ ', lt = ' &lt; ';
// smooth curve through key points, flat at each one (so a max/min is exactly where it says)
// Smooth curve through key points (quintic Hermite). Turning points stay exactly on the keys with a
// flat top/bottom, the bend is matched on both sides of each turn so it doesn't look lumpy, and the
// ends leave at a natural slope instead of starting flat.
const sm = keys => {
  const n = keys.length, h = [], d = [];
  for (let i = 0; i < n - 1; i++) { h.push(keys[i + 1][0] - keys[i][0]); d.push((keys[i + 1][1] - keys[i][1]) / h[i]); }
  const m = keys.map((_, i) => {
    if (i === 0) return n > 2 && d[0] * d[1] < 0 ? d[0] * 0.9 : d[0];
    if (i === n - 1) return n > 2 && d[n - 2] * d[n - 3] < 0 ? d[n - 2] * 0.9 : d[n - 2];
    if (d[i - 1] * d[i] <= 0) return 0;
    return 2 / (1 / d[i - 1] + 1 / d[i]) * (h[i - 1] + h[i]) / (h[i - 1] + h[i]);
  });
  const c = keys.map((_, i) => {
    if (i === 0 || i === n - 1 || m[i] !== 0 || d[i - 1] === d[i]) return 0;
    const k = 0.8 * Math.min(6 * Math.abs(d[i - 1]) / h[i - 1], 6 * Math.abs(d[i]) / h[i]);
    return d[i - 1] > 0 ? -k : k;
  });
  const out = [keys[0]], N = 24;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = keys[i], y1 = keys[i + 1][1], H = h[i];
    for (let t = 1; t <= N; t++) {
      const u = t / N, u3 = u * u * u, u4 = u3 * u, u5 = u4 * u;
      const y = y0 * (1 - 10 * u3 + 15 * u4 - 6 * u5) + H * m[i] * (u - 6 * u3 + 8 * u4 - 3 * u5) + H * H * c[i] * (u * u - 3 * u3 + 3 * u4 - u5) / 2 +
        H * H * c[i + 1] * (u3 - 2 * u4 + u5) / 2 + H * m[i + 1] * (-4 * u3 + 7 * u4 - 3 * u5) + y1 * (10 * u3 - 15 * u4 + 6 * u5);
      out.push([+(x0 + H * u).toFixed(3), +y.toFixed(3)]);
    }
  }
  return out; };

U.PRACTICE = {
  1: { topic: 'Is the graph a function?',
    ex: { q: 'Is the graph below a function? Explain.',
      graph: { x: [-4, 4], y: [-4, 4], ticks: { x: 1, y: 1 }, curves: [{ p: [[-4, -1], [-1, 3]] }, { p: [[-1, 3], [1, 1]] }, { p: Array.from({ length: 25 }, (_, i) => { const t = Math.sqrt(3) * i / 24; return [1 + t * t, 1.732 * t - 2]; }) }], dots: [[1, 1], [1, -2]] },
      steps: ['Check if the graph passes the vertical line test: does any vertical line hit the graph more than once?',
        'When ' + nw(x + ' = 1') + ', both pieces have a <b>closed</b> dot: (1, 1) on the upside-down V and (1, ' + M + '2) at the start of the curve.',
        'The vertical line at ' + nw(x + ' = 1') + ' hits the graph twice, so it fails the vertical line test.',
        'If one of those dots were open, the graph would pass and be a function.'],
      ans: '<b>Not a function.</b> It does not pass the vertical line test: the vertical line ' + nw(x + ' = 1') + ' hits the graph twice, at (1, 1) and (1, ' + M + '2).' },
    tries: [
      { q: 'Is this graph a function? Explain.',
        graph: { x: [-4, 4], y: [-4, 4], ticks: { x: 1, y: 1 }, curves: [sm([[-4, 3], [-2, -2], [1, 1]]), { p: [[1, 3], [4, 3]] }], dots: [[1, 1], [1, 3, true]] },
        ans: 'Yes. When ' + nw(x + ' = 1') + ', the dot at (1, 3) is <b>open</b>, so only (1, 1) is on the graph. Every vertical line hits the graph once.' },
      { q: 'Is this graph a function? Explain.',
        graph: { x: [-4, 4], y: [-4, 4], ticks: { x: 1, y: 1 }, curves: [{ p: [[2, -2], [-1, -1], [-2, 0], [-1, 1], [2, 2]] }], dots: [[2, 2], [2, -2]] },
        ans: 'No. It does not pass the vertical line test: the vertical line ' + nw(x + ' = ' + M + '1') + ' hits the graph twice, at (' + M + '1, ' + M + '1) and (' + M + '1, 1).' }] },

  2: { topic: 'Which relation is a function?',
    ex: { q: 'Is {(3, 2), (5, 2), (7, 4), (3, 8)} a function?',
      steps: ['List the ' + nw(x + '-values') + ' (the first numbers): 3, 5, 7, 3.',
        'The ' + nw(x + '-value') + ' 3 shows up twice, once with 2 and once with 8.',
        'One input with two different outputs means it is <b>not</b> a function.'],
      ans: '<b>Not a function.</b>' },
    tries: [
      { q: 'Which relation is a function?', choices: ['{(1, 2), (1, 3), (2, 4)}', '{(0, 5), (1, 5), (2, 5)}', '{(4, 1), (5, 2), (4, 3)}', '{(6, 0), (6, 1), (6, 2)}'],
        ans: 'B. The ' + nw(x + '-values') + ' (0, 1, 2) do not repeat. Repeating the ' + nw(y + '-value') + ' 5 is allowed.' },
      { q: 'Is {(' + M + '2, 0), (0, ' + M + '2), (2, 0), (4, 6)} a function? Explain.',
        ans: 'Yes. The ' + nw(x + '-values') + ' ' + M + '2, 0, 2, 4 do not repeat.' }] },

  3: { topic: 'Evaluate a function with a fraction and a square root',
    ex: { q: 'If ' + fx() + ' = ' + fr(rt('6' + x + ' + 7'), '3' + x + ' + 1') + ', find ' + fx('f', fr('1', '3')) + '.',
      steps: ['Replace every ' + x + ' with ' + fr('1', '3') + ': ' + fr(rt('6(' + fr('1', '3') + ') + 7'), '3(' + fr('1', '3') + ') + 1') + '.',
        'Multiply first: ' + nw('6 · ' + fr('1', '3') + ' = 2') + ' and ' + nw('3 · ' + fr('1', '3') + ' = 1') + '.',
        'Top: ' + nw(rt('2 + 7') + ' = ' + rt('9') + ' = 3') + '. Bottom: ' + nw('1 + 1 = 2') + '.',
        'Divide: ' + fr('3', '2') + '.'],
      ans: fx('f', fr('1', '3')) + ' = ' + fr('3', '2') },
    tries: [
      { q: 'If ' + fx('g') + ' = ' + fr(rt('10' + x + ' + 2'), '5' + x + ' + 3') + ', find ' + fx('g', fr('1', '5')) + '.',
        ans: 'Multiply first: ' + nw('10 · ' + fr('1', '5') + ' = 2') + ' and ' + nw('5 · ' + fr('1', '5') + ' = 1') + '. Top: ' + nw(rt('2 + 2') + ' = 2') + '. Bottom: ' + nw('1 + 3 = 4') + '. Answer: ' + fr('2', '4') + ' = ' + fr('1', '2') },
      { q: 'If ' + fx('h') + ' = ' + fr(rt('6' + x + ' + 1'), '4' + x + ' ' + M + ' 3') + ', find ' + fx('h', fr('1', '2')) + '.',
        ans: 'Top: ' + nw(rt('3 + 1') + ' = 2') + '. Bottom: ' + nw('2 ' + M + ' 3 = ' + M + '1') + '. Answer: ' + M + '2' }] },

  4: { topic: 'Evaluate a function with a negative input',
    ex: { q: 'If ' + fx() + ' = 3' + x + sup(2) + ' ' + M + ' 2' + x + ' + 1, find ' + fx('f', M + '2') + '.',
      steps: ['Put ' + M + '2 in parentheses everywhere: ' + nw('3(' + M + '2)' + sup(2) + ' ' + M + ' 2(' + M + '2) + 1') + '.',
        'Exponent first: ' + nw('(' + M + '2)' + sup(2) + ' = 4') + ', so ' + nw('3(4) = 12') + '.',
        nw(M + '2(' + M + '2) = +4') + '. Add: ' + nw('12 + 4 + 1 = 17') + '.'],
      ans: fx('f', M + '2') + ' = 17' },
    tries: [
      { q: 'If ' + fx('g') + ' = ' + x + sup(2) + ' + 4' + x + ' ' + M + ' 5, find ' + fx('g', M + '3') + '.', ans: nw('9 ' + M + ' 12 ' + M + ' 5 = ' + M + '8') },
      { q: 'If ' + fx('p') + ' = 2' + x + sup(2) + ' ' + M + ' ' + x + ' + 6, find ' + fx('p', M + '4') + '.', ans: nw('32 + 4 + 6 = 42') }] },

  5: { topic: 'Read domain, range and values from a graph',
    ex: { lead: 'The graph shows ' + nw(y + ' = ' + fx()) + '.', q: 'The graph shows ' + nw(y + ' = ' + fx()) + '. State the domain and range, then find ' + x + ' when ' + nw(fx() + ' = 4') + ', and find ' + fx('f', 3) + '.',
      graph: { x: [-5, 7], y: [-4, 5], ticks: { x: 1, y: 1 }, curves: [sm([[-4, 1], [-1, 4], [3, -2], [6, 0]])], dots: [[-4, 1], [6, 0]] },
      steps: ['Domain: read left to right. The graph starts at ' + nw(x + ' = ' + M + '4') + ' and ends at ' + nw(x + ' = 6') + ' (closed dots).',
        'Range: read bottom to top. The lowest point is ' + nw(y + ' = ' + M + '2') + ' and the highest is ' + nw(y + ' = 4') + '.',
        nw(fx() + ' = 4') + ' means "where is the height 4?" That is at ' + nw(x + ' = ' + M + '1') + '.',
        fx('f', 3) + ' means "go to ' + nw(x + ' = 3') + ', how high is the graph?" It is ' + M + '2.'],
      ans: 'Domain: ' + nw(M + '4' + le + x + le + '6') + '<br>Range: ' + nw(M + '2' + le + y + le + '4') + ', ' + nw(x + ' = ' + M + '1') + ', ' + nw(fx('f', 3) + ' = ' + M + '2') },
      parts: [
        { q: 'State the domain.', how: 'Read left to right. The graph starts at ' + nw(x + ' = ' + M + '4') + ' and ends at ' + nw(x + ' = 6') + '. Both dots are closed, so use ≤.', ans: nw(M + '4' + le + x + le + '6') },
        { q: 'State the range.', how: 'Read bottom to top. The lowest point is ' + nw(y + ' = ' + M + '2') + ' and the highest point is ' + nw(y + ' = 4') + '.', ans: nw(M + '2' + le + y + le + '4') },
        { q: 'Find ' + x + ' when ' + nw(fx() + ' = 4') + '.', how: nw(fx() + ' = 4') + ' means "where is the height 4?" Go across from 4 on the ' + y + '-axis. The graph touches it at ' + nw(x + ' = ' + M + '1') + '.', ans: nw(x + ' = ' + M + '1') },
        { q: 'Find ' + fx('f', 3) + '.', how: fx('f', 3) + ' means "go to ' + nw(x + ' = 3') + '. How high is the graph?" It is at ' + nw(y + ' = ' + M + '2') + '.', ans: nw(fx('f', 3) + ' = ' + M + '2') }],
    tries: [
      { q: 'State the domain and range of this function. Then find ' + fx('f', 1) + '.',
        graph: { x: [-6, 5], y: [-3, 4], ticks: { x: 1, y: 1 }, curves: [sm([[-5, 0], [-3, 3], [1, -1], [4, 2]])], dots: [[-5, 0], [4, 2]] },
        ans: 'Domain: ' + nw(M + '5' + le + x + le + '4') + '<br>Range: ' + nw(M + '1' + le + y + le + '3') + ', ' + nw(fx('f', 1) + ' = ' + M + '1') },
      { q: 'Use the same graph. What is ' + x + ' when ' + nw(fx() + ' = 3') + '?',
        graph: { x: [-6, 5], y: [-3, 4], ticks: { x: 1, y: 1 }, curves: [sm([[-5, 0], [-3, 3], [1, -1], [4, 2]])], dots: [[-5, 0], [4, 2]] },
        ans: 'Find the height 3 on the graph. It happens at ' + nw(x + ' = ' + M + '3') + '.' }] },

  6: { topic: 'Subtract polynomials with a squared binomial',
    ex: { q: 'Subtract ' + nw('(' + x + ' + 3)' + sup(2)) + ' from ' + nw('(' + x + sup(2) + ' + 5' + x + ' + 2)') + '.',
      steps: ['"Subtract A from B" means B ' + M + ' A: ' + nw('(' + x + sup(2) + ' + 5' + x + ' + 2) ' + M + ' (' + x + ' + 3)' + sup(2)) + '.',
        'Expand the square: ' + nw('(' + x + ' + 3)(' + x + ' + 3) = ' + x + sup(2) + ' + 6' + x + ' + 9') + '.',
        'Distribute the minus to every term: ' + nw(x + sup(2) + ' + 5' + x + ' + 2 ' + M + ' ' + x + sup(2) + ' ' + M + ' 6' + x + ' ' + M + ' 9') + '.',
        'Combine like terms.'],
      ans: nw(M + x + ' ' + M + ' 7') },
    tries: [
      { q: 'Subtract ' + nw('(' + x + ' ' + M + ' 2)' + sup(2)) + ' from ' + nw('(2' + x + sup(2) + ' + ' + x + ' ' + M + ' 3)') + '.', ans: nw(x + sup(2) + ' + 5' + x + ' ' + M + ' 7') },
      { q: 'Simplify ' + nw('(3' + x + sup(2) + ' ' + M + ' 2' + x + ' + 5) ' + M + ' (' + x + sup(2) + ' + 4' + x + ' ' + M + ' 1)') + '.', ans: nw('2' + x + sup(2) + ' ' + M + ' 6' + x + ' + 6') }] },

  7: { topic: 'Domain from a graph',
    ex: { q: 'What is the domain of the function shown?',
      graph: { x: [-5, 6], y: [-3, 5], ticks: { x: 1, y: 1 }, curves: [sm([[-3, 2], [-1, 4], [4, -1]])], dots: [[-3, 2], [4, -1]] },
      steps: ['Domain = all the ' + nw(x + '-values') + ' the graph covers, left to right.',
        'The left end is at ' + nw(x + ' = ' + M + '3') + ' and the right end is at ' + nw(x + ' = 4') + '.',
        'Both dots are closed (filled in), so use ≤ on both sides.'],
      ans: nw(M + '3' + le + x + le + '4') },
    tries: [
      { q: 'What is the domain of this function?',
        graph: { x: [-4, 6], y: [-4, 5], ticks: { x: 1, y: 1 }, curves: [sm([[-2, -3], [1, 2], [3, 0], [5, 4]])], dots: [[-2, -3], [5, 4]] },
        ans: nw(M + '2' + le + x + le + '5') },
      { q: 'What is the domain of this function? Look carefully at the dots.',
        graph: { x: [-2, 7], y: [-2, 5], ticks: { x: 1, y: 1 }, curves: [[[0, 1], [6, 3]]], dots: [[0, 1], [6, 3, true]] },
        ans: nw('0' + le + x + lt + '6') + ' (open dot at 6, so it is &lt; not ≤)' }] },

  8: { topic: 'Range of data on a graph',
    ex: { q: 'The graph shows the temperature (°F) in a room over 8 hours. What is the range?',
      graph: { x: [0, 8], y: [0, 80], gy: 10, ticks: { x: 1, y: 20 }, xTitle: 'Hours', yTitle: 'Temperature (°F)',
        curves: [sm([[0, 30], [2, 60], [5, 20], [8, 40]])] },
      steps: ['Range = the ' + nw(y + '-values') + ', from the lowest point to the highest point.',
        'Lowest point: 20 (at hour 5). Highest point: 60 (at hour 2).'],
      ans: nw('20' + le + y + le + '60') },
    tries: [
      { q: 'The graph shows the water level (inches) in a rain barrel over 6 days. What is the range?',
        graph: { x: [0, 6], y: [0, 60], gy: 10, ticks: { x: 1, y: 10 }, xTitle: 'Days', yTitle: 'Water level (in.)', curves: [sm([[0, 40], [2, 10], [4, 50], [6, 30]])], dots: [[0, 40], [6, 30]] },
        ans: nw('10' + le + y + le + '50') + '. The lowest point is 10 (day 2) and the highest is 50 (day 4). The start and end values are not the answer.' },
      { q: 'The graph shows the height of a ball from when it is thrown until it lands. What is the range of its height?',
        graph: { x: [0, 4], y: [0, 56], gx: 0.5, gy: 8, ticks: { x: 1, y: 8 }, xTitle: 'Seconds', yTitle: 'Height (ft)', curves: [{ p: Array.from({ length: 33 }, (_, i) => { const t = i / 8; return [t, 48 - 12 * (t - 2) ** 2]; }) }], dots: [[0, 0], [4, 0]] },
        ans: nw('0' + le + y + le + '48') }] },

  9: { topic: 'First 5 terms from a formula (arithmetic)',
    ex: { q: 'Find the first 5 terms of ' + nw(fx('f', n) + ' = 2(' + n + ' ' + M + ' 1) + 5') + '.',
      steps: [nw(n + ' = 1') + ': ' + nw('2(0) + 5 = 5') + '.',
        nw(n + ' = 2') + ': ' + nw('2(1) + 5 = 7') + '.',
        'Keep going for ' + nw(n + ' = 3, 4, 5') + '. Each term goes up by 2.'],
      ans: '5, 7, 9, 11, 13' },
    tries: [
      { q: 'Find the first 5 terms of ' + nw(fx('f', n) + ' = 4(' + n + ' ' + M + ' 1) + 1') + '.', ans: '1, 5, 9, 13, 17' },
      { q: 'Find the first 5 terms of ' + nw(fx('f', n) + ' = ' + M + '3(' + n + ' ' + M + ' 1) + 10') + '.', ans: '10, 7, 4, 1, ' + M + '2' }] },

  10: { topic: 'First 5 terms from a formula (geometric)',
    ex: { q: 'Find the first 5 terms of ' + nw(fx('f', n) + ' = 3(2)' + sup(n + ' ' + M + ' 1')) + '.',
      steps: [nw(n + ' = 1') + ': exponent is 0, ' + nw('3(2)' + sup(0) + ' = 3(1) = 3') + '.',
        nw(n + ' = 2') + ': ' + nw('3(2)' + sup(1) + ' = 6') + '. ' + nw(n + ' = 3') + ': ' + nw('3(2)' + sup(2) + ' = 3(4) = 12') + '.',
        'Each term is the one before times 2. Do the exponent before you multiply by 3.'],
      ans: '3, 6, 12, 24, 48' },
    tries: [
      { q: 'Find the first 5 terms of ' + nw(fx('f', n) + ' = 4(3)' + sup(n + ' ' + M + ' 1')) + '.', ans: '4, 12, 36, 108, 324' },
      { q: 'Find the first 5 terms of ' + nw(fx('f', n) + ' = 5(' + M + '2)' + sup(n + ' ' + M + ' 1')) + '.', ans: '5, ' + M + '10, 20, ' + M + '40, 80' }] },

  11: { topic: 'Geometric sequence: rule and a later term',
    ex: { lead: 'Look at the sequence 3, 9, 27, 81, …', q: 'For 3, 9, 27, 81, … : is it arithmetic, geometric, or neither? Write a rule and find the 6th term.',
      steps: ['Differences: 6, 18, 54 (not the same). Ratios: 9 ÷ 3 = 3, 27 ÷ 9 = 3 (the same). So it is <b>geometric</b> with ' + nw(v('r') + ' = 3') + '.',
        'Rule: ' + nw(an('n') + ' = ' + an('1') + '(' + v('r') + ')' + sup(n + ' ' + M + ' 1')) + ', so ' + nw(an('n') + ' = 3(3)' + sup(n + ' ' + M + ' 1')) + '.',
        nw(an('6') + ' = 3(3)' + sup(5) + ' = 3(243) = 729') + '.'],
      ans: 'Geometric, ' + nw(an('n') + ' = 3(3)' + sup(n + ' ' + M + ' 1')) + ', ' + nw(an('6') + ' = 729') },
      parts: [
        { q: 'Is it arithmetic, geometric, or neither?', how: 'Differences: 6, 18, 54 (not the same). Ratios: 9 ÷ 3 = 3, 27 ÷ 9 = 3 (the same). Same ratio means geometric, with ' + nw(v('r') + ' = 3') + '.', ans: '<b>Geometric</b>' },
        { q: 'Write a rule.', how: 'Use ' + nw(an('n') + ' = ' + an('1') + '(' + v('r') + ')' + sup(n + ' ' + M + ' 1')) + ' with ' + nw(an('1') + ' = 3') + ' and ' + nw(v('r') + ' = 3') + '.', ans: nw(an('n') + ' = 3(3)' + sup(n + ' ' + M + ' 1')) },
        { q: 'Find the 6th term.', how: 'Put in ' + nw(n + ' = 6') + ': ' + nw(an('6') + ' = 3(3)' + sup(5) + ' = 3(243)') + '.', ans: nw(an('6') + ' = 729') }],
    tries: [
      { q: 'For 2, 10, 50, 250, … : arithmetic, geometric, or neither? Write a rule and find the 6th term.', ans: 'Geometric, ' + nw(an('n') + ' = 2(5)' + sup(n + ' ' + M + ' 1')) + ', ' + nw(an('6') + ' = 6250') },
      { q: 'Is 1, 4, 9, 16, … arithmetic, geometric, or neither? Explain.', ans: 'Neither. The differences (3, 5, 7) change and the ratios (4, 2.25, …) change.' }] },

  12: { topic: 'Arithmetic sequence: rule and a later term',
    ex: { lead: 'Look at the sequence 6, 11, 16, 21, …', q: 'For 6, 11, 16, 21, … : write a rule and find the 10th term.',
      steps: ['Differences: 5, 5, 5, so it is arithmetic with ' + nw(v('d') + ' = 5') + '.',
        'Rule: ' + nw(an('n') + ' = ' + an('1') + ' + ' + v('d') + '(' + n + ' ' + M + ' 1)') + ', so ' + nw(an('n') + ' = 6 + 5(' + n + ' ' + M + ' 1)') + ' (or ' + nw('5' + n + ' + 1') + ').',
        nw(an('10') + ' = 6 + 5(9) = 51') + '.'],
      ans: nw(an('n') + ' = 6 + 5(' + n + ' ' + M + ' 1)') + ', ' + nw(an('10') + ' = 51') },
      parts: [
        { q: 'Write a rule.', how: 'Differences: 5, 5, 5, so it is arithmetic with ' + nw(v('d') + ' = 5') + '. Use ' + nw(an('n') + ' = ' + an('1') + ' + ' + v('d') + '(' + n + ' ' + M + ' 1)') + ' with ' + nw(an('1') + ' = 6') + '.', ans: nw(an('n') + ' = 6 + 5(' + n + ' ' + M + ' 1)') + ' (or ' + nw('5' + n + ' + 1') + ')' },
        { q: 'Find the 10th term.', how: 'Put in ' + nw(n + ' = 10') + ': ' + nw(an('10') + ' = 6 + 5(9) = 6 + 45') + '.', ans: nw(an('10') + ' = 51') }],
    tries: [
      { q: 'For 2, 8, 14, 20, … : write a rule and find the 15th term.', ans: nw(an('n') + ' = 2 + 6(' + n + ' ' + M + ' 1)') + ', ' + nw(an('15') + ' = 86') },
      { q: 'For 20, 17, 14, 11, … : write a rule and find the 10th term.', ans: nw(an('n') + ' = 20 ' + M + ' 3(' + n + ' ' + M + ' 1)') + ', ' + nw(an('10') + ' = ' + M + '7') }] },

  13: { topic: 'Arithmetic rule from two terms',
    ex: { lead: 'An arithmetic sequence has ' + nw(an('1') + ' = 5') + ' and ' + nw(an('5') + ' = 25') + '.', q: 'Write a rule for the arithmetic sequence with ' + nw(an('1') + ' = 5') + ' and ' + nw(an('5') + ' = 25') + '. Find the 10th term.',
      steps: ['From ' + an('1') + ' to ' + an('5') + ' is 4 jumps. The total change is ' + nw('25 ' + M + ' 5 = 20') + '.',
        'Each jump: ' + nw('20 ÷ 4 = 5') + ', so ' + nw(v('d') + ' = 5') + ' (the sequence is 5, 10, 15, 20, 25, …).',
        'Rule: ' + nw(an('n') + ' = ' + an('1') + ' + ' + v('d') + '(' + n + ' ' + M + ' 1)') + ', so ' + nw(an('n') + ' = 5 + 5(' + n + ' ' + M + ' 1)') + '.',
        nw(an('10') + ' = 5 + 5(9) = 50') + '.'],
      ans: nw(an('n') + ' = 5 + 5(' + n + ' ' + M + ' 1)') + ' and ' + nw(an('10') + ' = 50') },
      parts: [
        { q: 'Write a rule.', how: 'From ' + an('1') + ' to ' + an('5') + ' is 4 jumps, and the total change is ' + nw('25 ' + M + ' 5 = 20') + '. Each jump is ' + nw('20 ÷ 4 = 5') + ', so ' + nw(v('d') + ' = 5') + '. Use ' + nw(an('n') + ' = ' + an('1') + ' + ' + v('d') + '(' + n + ' ' + M + ' 1)') + '.', ans: nw(an('n') + ' = 5 + 5(' + n + ' ' + M + ' 1)') },
        { q: 'Find the 10th term.', how: 'Put in ' + nw(n + ' = 10') + ': ' + nw(an('10') + ' = 5 + 5(9) = 5 + 45') + '.', ans: nw(an('10') + ' = 50') }],
    tries: [
      { q: 'Write a rule for the arithmetic sequence with ' + nw(an('1') + ' = 2') + ' and ' + nw(an('4') + ' = 20') + '. Find the 11th term.', ans: nw(an('n') + ' = 2 + 6(' + n + ' ' + M + ' 1)') + ' and ' + nw(an('11') + ' = 62') },
      { q: 'Write a rule for the arithmetic sequence with ' + nw(an('1') + ' = 10') + ' and ' + nw(an('3') + ' = 4') + '. Find the 12th term.', ans: nw(an('n') + ' = 10 ' + M + ' 3(' + n + ' ' + M + ' 1)') + ' and ' + nw(an('12') + ' = ' + M + '23') }] },

  14: { topic: 'Geometric sequence with a fraction ratio',
    ex: { lead: 'Look at the sequence 1, ' + fr('1', '2') + ', ' + fr('1', '4') + ', ' + fr('1', '8') + ', …', q: 'For 1, ' + fr('1', '2') + ', ' + fr('1', '4') + ', ' + fr('1', '8') + ', … : write a rule and find the 6th term.',
      steps: ['Ratio: ' + nw(fr('1', '2') + ' ÷ 1 = ' + fr('1', '2')) + '. Check: ' + nw(fr('1', '4') + ' ÷ ' + fr('1', '2') + ' = ' + fr('1', '2')) + '.',
        'Rule: ' + nw(an('n') + ' = 1(' + fr('1', '2') + ')' + sup(n + ' ' + M + ' 1')) + '.',
        nw(an('6') + ' = (' + fr('1', '2') + ')' + sup(5) + ' = ' + fr('1', '32')) + '. Raise the top and the bottom to the 5th power.'],
      ans: nw(an('n') + ' = 1(' + fr('1', '2') + ')' + sup(n + ' ' + M + ' 1')) + ', ' + nw(an('6') + ' = ' + fr('1', '32')) },
      parts: [
        { q: 'Write a rule.', how: 'Ratio: ' + nw(fr('1', '2') + ' ÷ 1 = ' + fr('1', '2')) + '. Check: ' + nw(fr('1', '4') + ' ÷ ' + fr('1', '2') + ' = ' + fr('1', '2')) + '. Use ' + nw(an('n') + ' = ' + an('1') + '(' + v('r') + ')' + sup(n + ' ' + M + ' 1')) + ' with ' + nw(an('1') + ' = 1') + '.', ans: nw(an('n') + ' = 1(' + fr('1', '2') + ')' + sup(n + ' ' + M + ' 1')) },
        { q: 'Find the 6th term.', how: 'Put in ' + nw(n + ' = 6') + ': ' + nw(an('6') + ' = (' + fr('1', '2') + ')' + sup(5)) + '. Raise the top and the bottom to the 5th power: ' + nw('1' + sup(5) + ' = 1') + ' and ' + nw('2' + sup(5) + ' = 32') + '.', ans: nw(an('6') + ' = ' + fr('1', '32')) }],
    tries: [
      { q: 'For 1, ' + fr('1', '4') + ', ' + fr('1', '16') + ', ' + fr('1', '64') + ', … : write a rule and find the 5th term.', ans: nw(an('n') + ' = 1(' + fr('1', '4') + ')' + sup(n + ' ' + M + ' 1')) + ', ' + nw(an('5') + ' = ' + fr('1', '256')) },
      { q: 'For 9, 3, 1, ' + fr('1', '3') + ', … : write a rule and find the 6th term.', ans: nw(an('n') + ' = 9(' + fr('1', '3') + ')' + sup(n + ' ' + M + ' 1')) + ', ' + nw(an('6') + ' = ' + fr('1', '27')) }] },

  15: { topic: 'Domain and range with an open dot',
    ex: { lead: 'Use the graph of the function.', q: 'State the domain and range of the function.',
      graph: { x: [-5, 5], y: [-3, 6], ticks: { x: 1, y: 1 }, curves: [sm([[-4, -1], [-2, 2], [0, 1], [3, 5]])], dots: [[-4, -1], [3, 5, true]] },
      steps: ['Left end: closed dot at ' + nw(x + ' = ' + M + '4') + ' (≤). Right end: open dot at ' + nw(x + ' = 3') + ' (&lt;).',
        'Lowest ' + y + ': ' + M + '1 at the closed dot (≤). Highest ' + y + ': 5 at the open dot (&lt;).',
        'An open dot means that exact point is <b>not</b> included.'],
      ans: 'Domain: ' + nw(M + '4' + le + x + lt + '3') + '<br>Range: ' + nw(M + '1' + le + y + lt + '5') },
      parts: [
        { q: 'State the domain.', how: 'Left end: closed dot at ' + nw(x + ' = ' + M + '4') + ', so use ≤. Right end: open dot at ' + nw(x + ' = 3') + ', so use &lt; (that point is <b>not</b> included).', ans: nw(M + '4' + le + x + lt + '3') },
        { q: 'State the range.', how: 'Lowest ' + y + ': ' + M + '1 at the closed dot, so use ≤. Highest ' + y + ': 5 at the open dot, so use &lt;.', ans: nw(M + '1' + le + y + lt + '5') }],
    tries: [
      { q: 'State the domain and range.',
        graph: { x: [-4, 5], y: [-4, 4], ticks: { x: 1, y: 1 }, curves: [sm([[-2, 3], [0, -1], [2, 1], [4, -3]])], dots: [[-2, 3, true], [4, -3]] },
        ans: 'Domain: ' + nw(M + '2' + lt + x + le + '4') + '<br>Range: ' + nw(M + '3' + le + y + lt + '3') },
      { q: 'State the domain and range.',
        graph: { x: [-4, 4], y: [-3, 5], ticks: { x: 1, y: 1 }, curves: [sm([[-3, 0], [0, 4], [3, -2]])], dots: [[-3, 0], [3, -2, true]] },
        ans: 'Domain: ' + nw(M + '3' + le + x + lt + '3') + '<br>Range: ' + nw(M + '2' + lt + y + le + '4') }] },

  16: { topic: 'Domain and range when the graph keeps going',
    ex: { lead: 'Use the graph of the function.', q: 'State the domain and range of the function.',
      graph: { x: [-4, 8], y: [-2, 5], ticks: { x: 1, y: 1 }, curves: [{ p: Array.from({ length: 33 }, (_, i) => { const t = Math.sqrt(10) * i / 32; return [-2 + t * t, t + 1]; }), arrow: true }], dots: [[-2, 1]] },
      steps: ['The graph starts at the closed dot (' + M + '2, 1) and the arrow means it keeps going to the right and up forever.',
        'Domain: ' + x + ' starts at ' + M + '2 and never stops, so ' + nw(x + ' ≥ ' + M + '2') + ' (also written ' + nw(M + '2' + le + x + lt + '∞') + ').',
        'Range: ' + y + ' starts at 1 and keeps rising, so ' + nw(y + ' ≥ 1') + ' (also written ' + nw('1' + le + y + lt + '∞') + ').'],
      ans: 'Domain: ' + nw(x + ' ≥ ' + M + '2') + '<br>Range: ' + nw(y + ' ≥ 1') },
      parts: [
        { q: 'State the domain.', how: 'The graph starts at the closed dot where ' + nw(x + ' = ' + M + '2') + '. The arrow means it keeps going to the right forever.', ans: nw(x + ' ≥ ' + M + '2') + ' (also written ' + nw(M + '2' + le + x + lt + '∞') + ')' },
        { q: 'State the range.', how: 'The lowest point is the dot at ' + nw(y + ' = 1') + '. The arrow keeps going up forever.', ans: nw(y + ' ≥ 1') + ' (also written ' + nw('1' + le + y + lt + '∞') + ')' }],
    tries: [
      { q: 'State the domain and range.',
        graph: { x: [-2, 10], y: [-4, 3], ticks: { x: 1, y: 1 }, curves: [{ p: Array.from({ length: 43 }, (_, i) => { const t = Math.sqrt(18) * i / 42; return [1 + t * t / 2, t - 3]; }), arrow: true }], dots: [[1, -3]] },
        ans: 'Domain: ' + nw(x + ' ≥ 1') + '<br>Range: ' + nw(y + ' ≥ ' + M + '3') },
      { q: 'State the domain and range. (Both ends have arrows.)',
        graph: { x: [-3, 5], y: [-3, 5], ticks: { x: 1, y: 1 }, curves: [{ p: Array.from({ length: 49 }, (_, i) => { const xx = 1 - Math.sqrt(7) + i * Math.sqrt(7) / 24; return [xx, (xx - 1) ** 2 - 2]; }), arrow: 'both' }] },
        ans: 'Domain: all real numbers<br>Range: ' + nw(y + ' ≥ ' + M + '2') }] },

  17: { topic: 'Geometric sequence with a negative ratio',
    ex: { q: 'Write the first 4 terms of a geometric sequence that starts at 5 and has a common ratio of ' + M + '3.',
      steps: ['Multiply by ' + M + '3 each time: ' + nw('5 × (' + M + '3) = ' + M + '15') + '.',
        nw(M + '15 × (' + M + '3) = 45') + ', then ' + nw('45 × (' + M + '3) = ' + M + '135') + '.',
        'A negative ratio makes the signs switch back and forth.'],
      ans: '5, ' + M + '15, 45, ' + M + '135, …' },
    tries: [
      { q: 'Which sequence is geometric with a common ratio of ' + M + '3?', choices: ['2, ' + M + '1, ' + M + '4, ' + M + '7, …', '2, ' + M + '6, 18, ' + M + '54, …', '2, 6, 18, 54, …', M + '2, ' + M + '6, ' + M + '18, ' + M + '54, …'],
        ans: 'B. Each term is the one before times ' + M + '3.' },
      { q: 'Find the common ratio of 4,&ensp;' + M + '2,&ensp;1,&ensp;' + nw(M + fr('1', '2') + ',') + '&ensp;…', ans: M + fr('1', '2') + ' (' + nw(M + '2 ÷ 4 = ' + M + fr('1', '2')) + ')' }] },

  18: { topic: 'Solve for x when f(x) equals a number',
    ex: { q: 'If ' + fx() + ' = ' + fr('3' + x + ' + 4', '5') + ', find ' + x + ' when ' + nw(fx() + ' = 2') + '.',
      steps: ['Set the function equal to 2: ' + fr('3' + x + ' + 4', '5') + ' = 2.',
        'Multiply both sides by 5: ' + nw('3' + x + ' + 4 = 10') + '.',
        'Subtract 4: ' + nw('3' + x + ' = 6') + '. Divide by 3: ' + nw(x + ' = 2') + '.',
        'Check: ' + nw('(3(2) + 4) ÷ 5 = 10 ÷ 5 = 2') + ' ✓'],
      ans: nw(x + ' = 2') },
    tries: [
      { q: 'If ' + fx('g') + ' = ' + fr('4' + x + ' ' + M + ' 6', '2') + ', find ' + x + ' when ' + nw(fx('g') + ' = 9') + '.', ans: nw(x + ' = 6') },
      { q: 'If ' + fx('h') + ' = ' + fr('2' + x, '3') + ' + 1, find ' + x + ' when ' + nw(fx('h') + ' = 7') + '.', ans: nw(x + ' = 9') }] }
};

// Answer choices for every "your turn" problem, so online practice works like the stations:
// students tap a choice and it checks itself. right = index of the correct choice.
const m = s => s.replace(/-(?=\d)/g, M);            // '-3' -> '−3'
const iv = (a, o1, v_, o2, b) => nw(m(String(a)) + o1 + v_ + o2 + m(String(b)));
const dr = (d, r) => 'Domain: ' + d + '<br>Range: ' + r;
const ar = (a1, d) => nw(an('n') + ' = ' + m(String(a1)) + (d < 0 ? ' ' + M + ' ' + (-d) : ' + ' + d) + '(' + n + ' ' + M + ' 1)');
const gr = (a1, r) => nw(an('n') + ' = ' + a1 + '(' + r + ')' + sup(n + ' ' + M + ' 1'));
const MC = {
  '1.0': [['Yes, it is a function.', 'No, it fails at ' + nw(x + ' = 1') + '.', 'No, it fails at ' + nw(x + ' = ' + M + '2') + '.', 'No, a function can’t have a jump.'], 0],
  '1.1': [['Yes, every ' + nw(x + '-value') + ' has a ' + nw(y + '-value') + '.', 'Yes, it passes the vertical line test.', 'No, the vertical line ' + nw(x + ' = ' + M + '1') + ' hits it twice.', 'No, because it has two dots.'], 2],
  '2.1': [['No, 0 is used twice as a ' + nw(y + '-value') + '.', 'Yes, the ' + nw(x + '-values') + ' do not repeat.', 'No, ' + M + '2 shows up twice.', 'Yes, the ' + nw(y + '-values') + ' do not repeat.'], 1],
  '3.0': [['2', fr('1', '2'), '4', fr('1', '4')], 1],
  '3.1': [['2', fr('1', '2'), m('-2'), m('-1')], 2],
  '4.0': [[m('-8'), '16', m('-26'), '2'], 0],
  '4.1': [['30', '42', '34', '26'], 1],
  '7.0': [[iv(-3, le, y, le, 4), iv(-2, le, x, le, 5), iv(-2, lt, x, lt, 5), iv(-4, le, x, le, 6)], 1],
  '7.1': [[iv(0, le, x, le, 6), iv(1, le, y, lt, 3), iv(0, le, x, lt, 6), iv(0, lt, x, le, 6)], 2],
  '8.0': [[iv(30, le, y, le, 40), iv(0, le, x, le, 6), iv(10, le, y, le, 50), iv(0, le, y, le, 60)], 2],
  '8.1': [[iv(0, le, x, le, 4), iv(0, le, y, le, 48), iv(0, le, y, le, 56), iv(2, le, y, le, 48)], 1],
  '11.1': [['Arithmetic, it goes up by 3 each time.', 'Geometric, it multiplies by 4 each time.', 'Neither. The differences (3, 5, 7) change and the ratios change.', 'Arithmetic, the differences go up by 2.'], 2],
  '17.1': [['2', M + '2', fr('1', '2'), M + fr('1', '2')], 3],
};
Object.keys(MC).forEach(k => { const [s_, i] = k.split('.'), t = U.PRACTICE[s_].tries[+i]; t.choices = MC[k][0]; t.right = MC[k][1]; });
// Multi-part tries: one question per part, each with its own choices (like the station game)
const SUB = {
  '5.0': ['Use this graph of ' + nw(y + ' = ' + fx()) + '.', [
    ['State the domain.', [iv(-5, le, x, le, 4), iv(-1, le, y, le, 3), iv(-5, lt, x, lt, 4), iv(-6, le, x, le, 5)], 0, 'The graph starts at the closed dot ' + nw(x + ' = ' + M + '5') + ' and ends at the closed dot ' + nw(x + ' = 4') + '.'],
    ['State the range.', [iv(-1, le, y, le, 3), iv(-5, le, x, le, 4), iv(0, le, y, le, 2), iv(-3, le, y, le, 4)], 0, 'The lowest point is ' + nw(y + ' = ' + M + '1') + ' and the highest point is ' + nw(y + ' = 3') + '.'],
    ['Find ' + fx('f', 1) + '.', [m('-1'), '0', '1', '3'], 0, 'Go to ' + nw(x + ' = 1') + '. The graph is at height ' + M + '1, so ' + nw(fx('f', 1) + ' = ' + M + '1') + '.']]],
  '11.0': ['Look at the sequence 2, 10, 50, 250, …', [
    ['Is it arithmetic, geometric, or neither?', ['Arithmetic', 'Geometric', 'Neither'], 1, 'Geometric. Each term is 5 times the one before (10 ÷ 2 = 5).'],
    ['Write a rule.', [gr(2, 5), gr(5, 2), ar(2, 8), gr(2, 10)], 0, 'Start at 2 and multiply by 5: ' + gr(2, 5) + '.'],
    ['Find the 6th term.', ['6250', '1250', '160', '3125'], 0, nw(an('6') + ' = 2(5)' + sup('5') + ' = 2(3125) = 6250') + '.']]],
  '12.0': ['Look at the sequence 2, 8, 14, 20, …', [
    ['Is it arithmetic, geometric, or neither?', ['Arithmetic', 'Geometric', 'Neither'], 0, 'Arithmetic. It adds 6 each time.'],
    ['Write a rule.', [ar(2, 6), ar(6, 2), ar(2, 8), gr(2, 4)], 0, 'Start at 2 and add 6 each time: ' + ar(2, 6) + '.'],
    ['Find the 15th term.', ['86', '92', '34', '90'], 0, nw(an('15') + ' = 2 + 6(14) = 2 + 84 = 86') + '.']]],
  '12.1': ['Look at the sequence 20, 17, 14, 11, …', [
    ['Is it arithmetic, geometric, or neither?', ['Arithmetic', 'Geometric', 'Neither'], 0, 'Arithmetic. It subtracts 3 each time.'],
    ['Write a rule.', [ar(20, 3), ar(20, -3), ar(11, -3), ar(17, -3)], 1, 'Start at 20 and subtract 3 each time: ' + ar(20, -3) + '.'],
    ['Find the 10th term.', [m('-7'), m('-10'), '47', m('-4')], 0, nw(an('10') + ' = 20 ' + M + ' 3(9) = 20 ' + M + ' 27 = ' + M + '7') + '.']]],
  '13.0': ['An arithmetic sequence has ' + nw(an('1') + ' = 2') + ' and ' + nw(an('4') + ' = 20') + '.', [
    ['Write a rule.', [ar(2, 6), ar(2, 18), ar(2, 5), ar(20, 6)], 0, 'From ' + an('1') + ' to ' + an('4') + ' is 3 jumps: ' + nw('(20 ' + M + ' 2) ÷ 3 = 6') + ', so ' + nw(v('d') + ' = 6') + '. Rule: ' + ar(2, 6) + '.'],
    ['Find the 11th term.', ['62', '68', '182', '52'], 0, nw(an('11') + ' = 2 + 6(10) = 62') + '.']]],
  '13.1': ['An arithmetic sequence has ' + nw(an('1') + ' = 10') + ' and ' + nw(an('3') + ' = 4') + '.', [
    ['Write a rule.', [ar(10, 3), ar(10, -6), ar(10, -3), ar(4, -3)], 2, 'From ' + an('1') + ' to ' + an('3') + ' is 2 jumps: ' + nw('(4 ' + M + ' 10) ÷ 2 = ' + M + '3') + ', so ' + nw(v('d') + ' = ' + M + '3') + '. Rule: ' + ar(10, -3) + '.'],
    ['Find the 12th term.', [m('-23'), m('-26'), '43', m('-56')], 0, nw(an('12') + ' = 10 ' + M + ' 3(11) = 10 ' + M + ' 33 = ' + M + '23') + '.']]],
  '14.0': ['Look at the sequence 1, ' + fr('1', '4') + ', ' + fr('1', '16') + ', ' + fr('1', '64') + ', …', [
    ['Write a rule.', [gr(1, fr('1', '4')), gr(1, '4'), gr(fr('1', '4'), '1'), gr(4, fr('1', '4'))], 0, 'Start at 1 and multiply by ' + fr('1', '4') + ' each time: ' + gr(1, fr('1', '4')) + '.'],
    ['Find the 5th term.', [fr('1', '256'), fr('1', '1024'), '256', fr('1', '64')], 0, nw(an('5') + ' = 1(' + fr('1', '4') + ')' + sup('4') + ' = ' + fr('1', '256')) + '.']]],
  '14.1': ['Look at the sequence 9, 3, 1, ' + fr('1', '3') + ', …', [
    ['Write a rule.', [gr(9, '3'), gr(9, fr('1', '3')), gr(3, fr('1', '3')), ar(9, -6)], 1, 'Start at 9 and multiply by ' + fr('1', '3') + ' each time: ' + gr(9, fr('1', '3')) + '.'],
    ['Find the 6th term.', [fr('1', '27'), fr('1', '9'), fr('1', '81'), '2187'], 0, nw(an('6') + ' = 9(' + fr('1', '3') + ')' + sup('5') + ' = ' + fr('9', '243') + ' = ' + fr('1', '27')) + '.']]],
  '15.0': ['Use the graph.', [
    ['State the domain.', [iv(-2, le, x, le, 4), iv(-2, lt, x, le, 4), iv(-2, le, x, lt, 4), iv(-3, le, y, lt, 3)], 1, 'Open dot at ' + nw(x + ' = ' + M + '2') + ', so use &lt;. Closed dot at ' + nw(x + ' = 4') + ', so use ≤.'],
    ['State the range.', [iv(-3, le, y, le, 3), iv(-3, le, y, lt, 3), iv(-3, lt, y, le, 3), iv(-2, lt, x, le, 4)], 1, 'Lowest point: the closed dot at ' + nw(y + ' = ' + M + '3') + ' (≤). Highest: the open dot at ' + nw(y + ' = 3') + ' (&lt;).']]],
  '15.1': ['Use the graph.', [
    ['State the domain.', [iv(-3, le, x, lt, 3), iv(-3, le, x, le, 3), iv(-3, lt, x, le, 3), iv(-2, lt, y, le, 4)], 0, 'Closed dot at ' + nw(x + ' = ' + M + '3') + ' (≤). Open dot at ' + nw(x + ' = 3') + ' (&lt;).'],
    ['State the range.', [iv(-2, lt, y, le, 4), iv(-2, le, y, le, 4), iv(-2, le, y, lt, 4), iv(-3, le, x, lt, 3)], 0, 'Lowest point: the open dot at ' + nw(y + ' = ' + M + '2') + ' (&lt;). Highest: the peak at ' + nw(y + ' = 4') + ' (≤).']]],
  '16.0': ['Use the graph.', [
    ['State the domain.', [nw(x + ' ≥ 1'), nw(y + ' ≥ ' + M + '3'), iv(1, le, x, le, 10), nw(x + ' ≤ 1')], 0, 'The graph starts at the dot ' + nw(x + ' = 1') + ' and the arrow keeps going right.'],
    ['State the range.', [nw(y + ' ≥ ' + M + '3'), nw(x + ' ≥ 1'), iv(-3, le, y, le, 1), nw(y + ' ≤ ' + M + '3')], 0, 'The lowest point is ' + nw(y + ' = ' + M + '3') + ' and the arrow keeps going up.']]],
  '16.1': ['Use the graph. (Both ends have arrows.)', [
    ['State the domain.', ['all real numbers', nw(x + ' ≥ 1'), iv(-2, le, x, le, 4), nw(y + ' ≥ ' + M + '2')], 0, 'Both arrows keep going left and right forever, so every ' + x + ' works.'],
    ['State the range.', ['all real numbers', nw(y + ' ≥ ' + M + '2'), nw(y + ' ≤ ' + M + '2'), nw(y + ' ≥ 1')], 1, 'The lowest point is the vertex at ' + nw(y + ' = ' + M + '2') + ' and both arrows go up.']]]
};
Object.keys(SUB).forEach(k => {
  const [s_, i] = k.split('.'), t = U.PRACTICE[s_].tries[+i], [lead, parts] = SUB[k];
  t.q = lead; delete t.choices; delete t.right;
  t.sub = parts.map(([q, ch, r, a], j) => {
    const rot = ch.length === 4 ? (+s_ + +i + j) % 4 : 0, c2 = ch.map((_, z) => ch[(z + rot) % ch.length]);
    return { q, t: 'mc', choices: c2, right: (r - rot + ch.length) % ch.length, ans: a };
  });
});
U.PRACTICE[2].tries[0].right = 1; U.PRACTICE[17].tries[0].right = 1;

// Typed answers, the same way the station game takes them:
// num = a number (fractions OK), expr = a rule or expression, seq = terms separated by commas
const anP = an('n') + ' =', rule = { t: 'expr', vr: 'n', prefix: anP, keypad: true };
const TYPED = {
  '5.0.2': { t: 'num', answer: -1, prefix: fx('f', 1) + ' =' },
  '5.1': { t: 'num', answer: -3, prefix: x + ' =' },
  '6.0': { t: 'expr', vr: 'x', answer: 'x^2+5x-7' },
  '6.1': { t: 'expr', vr: 'x', answer: '2x^2-6x+6' },
  '9.0': { t: 'seq', answer: [1, 5, 9, 13, 17], placeholder: 'e.g. 1, 2, 3, 4, 5' },
  '9.1': { t: 'seq', answer: [10, 7, 4, 1, -2], placeholder: 'e.g. 1, 2, 3, 4, 5' },
  '10.0': { t: 'seq', answer: [4, 12, 36, 108, 324], placeholder: 'e.g. 1, 2, 3, 4, 5' },
  '10.1': { t: 'seq', answer: [5, -10, 20, -40, 80], placeholder: 'e.g. 1, 2, 3, 4, 5' },
  '11.0.1': Object.assign({ answer: '2(5)^(n-1)' }, rule),
  '11.0.2': { t: 'num', answer: 6250, prefix: an('6') + ' =' },
  '12.0.1': Object.assign({ answer: '2+6(n-1)' }, rule),
  '12.0.2': { t: 'num', answer: 86, prefix: an('15') + ' =' },
  '12.1.1': Object.assign({ answer: '20-3(n-1)' }, rule),
  '12.1.2': { t: 'num', answer: -7, prefix: an('10') + ' =' },
  '13.0.0': Object.assign({ answer: '2+6(n-1)' }, rule),
  '13.0.1': { t: 'num', answer: 62, prefix: an('11') + ' =' },
  '13.1.0': Object.assign({ answer: '10-3(n-1)' }, rule),
  '13.1.1': { t: 'num', answer: -23, prefix: an('12') + ' =' },
  '14.0.0': Object.assign({ answer: '(1/4)^(n-1)' }, rule),
  '14.0.1': { t: 'num', answer: 1 / 256, prefix: an('5') + ' =' },
  '14.1.0': Object.assign({ answer: '9(1/3)^(n-1)' }, rule),
  '14.1.1': { t: 'num', answer: 1 / 27, prefix: an('6') + ' =' },
  '18.0': { t: 'num', answer: 6, prefix: x + ' =' },
  '18.1': { t: 'num', answer: 9, prefix: x + ' =' }
};
// every try becomes a list of parts; a one-part try has no part label
Object.keys(U.PRACTICE).forEach(s_ => U.PRACTICE[s_].tries.forEach((t, i) => {
  if (!t.sub) t.sub = [{ q: null, t: 'mc', choices: t.choices, right: t.right, ans: t.ans }];
  t.sub.forEach((pt, j) => {
    const spec = TYPED[s_ + '.' + i + '.' + j] || (t.sub.length === 1 && TYPED[s_ + '.' + i]);
    if (spec) { delete pt.choices; delete pt.right; Object.assign(pt, spec); }
    if (pt.t === 'mc') pt.answer = pt.right;
  });
}));

// Match the 16 stations used in class (see restation() in unit-5-review-2-data.js): drop packet
// questions 6, 13, 14 and 18, split packet question 5 into three stations, and renumber 1 to 16.
(function restation() {
  const P = U.PRACTICE, o = P[5], e = o.ex, tg = o.tries[1].graph;
  const one = (q, graph, sub) => ({ q, graph, sub: [Object.assign({ q: null }, sub)] });
  const g2 = { x: [-7, 6], y: [-4, 3], ticks: { x: 1, y: 1 }, curves: [sm([[-6, 2], [-2, -3], [2, 1], [5, -1]])], dots: [[-6, 2], [5, -1]] };
  const s5 = { topic: 'Domain and range from a graph',
    ex: { lead: e.lead, q: e.lead + ' State the domain and range.', graph: e.graph, steps: e.steps.slice(0, 2), ans: e.ans.split(', ')[0] },
    parts: o.parts.slice(0, 2),
    tries: [
      { q: 'Use this graph of ' + nw(y + ' = ' + fx()) + '.', graph: o.tries[0].graph, sub: o.tries[0].sub.filter(x_ => !/^Find/.test(x_.q)) },
      { q: 'Use this graph of ' + nw(y + ' = ' + fx()) + '.', graph: g2, sub: [
        { q: 'State the domain.', t: 'mc', choices: [iv(-3, le, y, le, 2), iv(-6, le, x, le, 5), iv(-6, lt, x, lt, 5), iv(-7, le, x, le, 6)], right: 1, answer: 1,
          ans: 'The graph starts at the closed dot ' + nw(x + ' = ' + M + '6') + ' and ends at the closed dot ' + nw(x + ' = 5') + '.' },
        { q: 'State the range.', t: 'mc', choices: [iv(-6, le, x, le, 5), iv(-1, le, y, le, 2), iv(-3, le, y, le, 2), iv(-3, le, y, le, 1)], right: 2, answer: 2,
          ans: 'The lowest point is ' + nw(y + ' = ' + M + '3') + '. The highest point is the left dot at ' + nw(y + ' = 2') + '.' }] }] };
  const s6 = { topic: 'Find ' + x + ' when ' + fx() + ' equals a number',
    ex: { lead: e.lead, q: e.lead + ' Find ' + x + ' when ' + nw(fx() + ' = 4') + '.', graph: e.graph, steps: [e.steps[2]], ans: nw(x + ' = ' + M + '1') },
    parts: [o.parts[2]],
    tries: [Object.assign({}, o.tries[1], { q: 'Use this graph of ' + nw(y + ' = ' + fx()) + '. What is ' + x + ' when ' + nw(fx() + ' = 3') + '?' }),
      one('Use the same graph. What is ' + x + ' when ' + nw(fx() + ' = ' + M + '1') + '?', tg,
        { t: 'num', answer: 1, prefix: x + ' =', ans: 'Find the height ' + M + '1 on the graph. It happens at ' + nw(x + ' = 1') + '.' })] };
  const s7 = { topic: 'Find ' + fx('f', 'a') + ' from a graph',
    ex: { lead: e.lead, q: e.lead + ' Find ' + fx('f', 3) + '.', graph: e.graph, steps: [e.steps[3]], ans: nw(fx('f', 3) + ' = ' + M + '2') },
    parts: [o.parts[3]],
    tries: [
      one('Use this graph of ' + nw(y + ' = ' + fx()) + '. Find ' + fx('f', 1) + '.', tg,
        { t: 'num', answer: -1, prefix: fx('f', 1) + ' =', ans: 'Go to ' + nw(x + ' = 1') + '. The graph is at height ' + M + '1, so ' + nw(fx('f', 1) + ' = ' + M + '1') + '.' }),
      one('Use the same graph. Find ' + fx('f', M + '3') + '.', tg,
        { t: 'num', answer: 3, prefix: fx('f', M + '3') + ' =', ans: 'Go to ' + nw(x + ' = ' + M + '3') + '. The graph is at height 3, so ' + nw(fx('f', M + '3') + ' = 3') + '.' })] };
  const out = {}; let k = 0;
  [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 15, 16, 17].forEach(n_ => {
    if (n_ === 5) { out[++k] = s5; out[++k] = s6; out[++k] = s7; } else out[++k] = P[n_];
  });
  U.PRACTICE = out;
})();
})();
