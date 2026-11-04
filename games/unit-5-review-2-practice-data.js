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
const sm = keys => { const out = [keys[0]];
  for (let i = 0; i < keys.length - 1; i++) { const [a, ya] = keys[i], [b, yb] = keys[i + 1];
    for (let t = 1; t <= 8; t++) { const u = t / 8; out.push([a + (b - a) * u, +(ya + (yb - ya) * (1 - Math.cos(Math.PI * u)) / 2).toFixed(3)]); } }
  return out; };

U.PRACTICE = {
  1: { topic: 'Is the graph a function?',
    ex: { q: 'Is the graph below a function? Explain.',
      graph: { x: [-4, 4], y: [-4, 4], ticks: { x: 1, y: 1 }, dots: [[-3, 1], [-1, 3], [1, -2], [1, 2], [3, 0]] },
      steps: ['Look for an ' + nw(x + '-value') + ' that is used more than once.',
        nw(x + ' = 1') + ' is paired with two ' + nw(y + '-values') + ': ' + M + '2 and 2.',
        'A vertical line at ' + nw(x + ' = 1') + ' hits the graph twice, so it fails the vertical line test.'],
      ans: '<b>Not a function.</b> ' + nw(x + ' = 1') + ' goes to two different ' + nw(y + '-values') + '.' },
    tries: [
      { q: 'Is this graph a function? Explain.',
        graph: { x: [-4, 5], y: [-4, 4], ticks: { x: 1, y: 1 }, dots: [[-3, 2], [-1, -1], [0, 2], [2, 3], [4, -2]] },
        ans: 'Yes. Every ' + nw(x + '-value') + ' is used only once. (Two points sharing ' + nw(y + ' = 2') + ' is fine.)' },
      { q: 'Is this graph a function? Explain.',
        graph: { x: [-4, 4], y: [-4, 4], ticks: { x: 1, y: 1 }, curves: [{ p: [[2, -2], [-1, -1], [-2, 0], [-1, 1], [2, 2]] }] },
        ans: 'No. A vertical line at ' + nw(x + ' = ' + M + '1') + ' hits the graph at ' + nw(y + ' = ' + M + '1') + ' and ' + nw(y + ' = 1') + '.' }] },

  2: { topic: 'Which relation is a function?',
    ex: { q: 'Is {(3, 2), (5, 2), (7, 4), (3, 8)} a function?',
      steps: ['List the ' + nw(x + '-values') + ' (the first numbers): 3, 5, 7, 3.',
        'The ' + nw(x + '-value') + ' 3 shows up twice, once with 2 and once with 8.',
        'One input with two different outputs means it is <b>not</b> a function.'],
      ans: '<b>Not a function.</b>' },
    tries: [
      { q: 'Which relation is a function?', choices: ['{(1, 2), (1, 3), (2, 4)}', '{(0, 5), (1, 5), (2, 5)}', '{(4, 1), (5, 2), (4, 3)}', '{(6, 0), (6, 1), (6, 2)}'],
        ans: 'B. Every ' + nw(x + '-value') + ' (0, 1, 2) is different. Repeating the ' + nw(y + '-value') + ' 5 is allowed.' },
      { q: 'Is {(' + M + '2, 0), (0, ' + M + '2), (2, 0), (4, 6)} a function? Explain.',
        ans: 'Yes. The ' + nw(x + '-values') + ' ' + M + '2, 0, 2, 4 are all different.' }] },

  3: { topic: 'Evaluate a function with a fraction and a square root',
    ex: { q: 'If ' + fx() + ' = ' + fr(rt(x + ' + 5'), '2' + x + ' ' + M + ' 3') + ', find ' + fx('f', 4) + '.',
      steps: ['Replace every ' + x + ' with 4: ' + fr(rt('4 + 5'), '2(4) ' + M + ' 3') + '.',
        'Top: ' + nw(rt('9') + ' = 3') + '. Bottom: ' + nw('8 ' + M + ' 3 = 5') + '.',
        'Divide: ' + fr('3', '5') + '.'],
      ans: fx('f', 4) + ' = ' + fr('3', '5') },
    tries: [
      { q: 'If ' + fx('g') + ' = ' + fr(rt('4' + x + ' + 1'), x + ' ' + M + ' 1') + ', find ' + fx('g', 2) + '.',
        ans: fr(rt('9'), '1') + ' = 3' },
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
    ex: { q: 'The graph shows ' + nw(y + ' = ' + fx()) + '. State the domain and range, then find ' + x + ' when ' + nw(fx() + ' = 4') + ', and find ' + fx('f', 3) + '.',
      graph: { x: [-5, 7], y: [-4, 5], ticks: { x: 1, y: 1 }, curves: [sm([[-4, 1], [-1, 4], [3, -2], [6, 0]])], dots: [[-4, 1], [6, 0]] },
      steps: ['Domain: read left to right. The graph starts at ' + nw(x + ' = ' + M + '4') + ' and ends at ' + nw(x + ' = 6') + ' (closed dots).',
        'Range: read bottom to top. The lowest point is ' + nw(y + ' = ' + M + '2') + ' and the highest is ' + nw(y + ' = 4') + '.',
        nw(fx() + ' = 4') + ' means "where is the height 4?" That is at ' + nw(x + ' = ' + M + '1') + '.',
        fx('f', 3) + ' means "go to ' + nw(x + ' = 3') + ', how high is the graph?" It is ' + M + '2.'],
      ans: 'Domain ' + nw(M + '4' + le + x + le + '6') + ', range ' + nw(M + '2' + le + y + le + '4') + ', ' + nw(x + ' = ' + M + '1') + ', ' + nw(fx('f', 3) + ' = ' + M + '2') },
    tries: [
      { q: 'State the domain and range of this function. Then find ' + fx('f', 1) + '.',
        graph: { x: [-6, 5], y: [-3, 4], ticks: { x: 1, y: 1 }, curves: [sm([[-5, 0], [-3, 3], [1, -1], [4, 2]])], dots: [[-5, 0], [4, 2]] },
        ans: 'Domain ' + nw(M + '5' + le + x + le + '4') + ', range ' + nw(M + '1' + le + y + le + '3') + ', ' + nw(fx('f', 1) + ' = ' + M + '1') },
      { q: 'Using the graph from Try It #1, what is ' + x + ' when ' + nw(fx() + ' = 3') + '?', ans: nw(x + ' = ' + M + '3') }] },

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
      graph: { x: [-5, 6], y: [-3, 5], ticks: { x: 1, y: 1 }, curves: [sm([[-3, 2], [-1, 3.5], [4, -1]])], dots: [[-3, 2], [4, -1]] },
      steps: ['Domain = all the ' + nw(x + '-values') + ' the graph covers, left to right.',
        'The left end is at ' + nw(x + ' = ' + M + '3') + ' and the right end is at ' + nw(x + ' = 4') + '.',
        'Both dots are closed (filled in), so use ≤ on both sides.'],
      ans: nw(M + '3' + le + x + le + '4') },
    tries: [
      { q: 'What is the domain of this function?',
        graph: { x: [-4, 6], y: [-4, 5], ticks: { x: 1, y: 1 }, curves: [[[-2, -3], [0, -1.2], [2, 0.6], [3.5, 2.1], [5, 4]]], dots: [[-2, -3], [5, 4]] },
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
      { q: 'The graph shows a plant’s height (cm) over 6 weeks. What is the range?',
        graph: { x: [0, 6], y: [0, 60], gy: 10, ticks: { x: 1, y: 10 }, xTitle: 'Weeks', yTitle: 'Height (cm)', curves: [sm([[0, 10], [6, 50]])] },
        ans: nw('10' + le + y + le + '50') },
      { q: 'A ball starts on the ground, goes up to 48 feet, and lands back on the ground. What is the range of its height?', ans: nw('0' + le + y + le + '48') }] },

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
    ex: { q: 'For 3, 9, 27, 81, … : is it arithmetic, geometric, or neither? Write a rule and find the 6th term.',
      steps: ['Differences: 6, 18, 54 (not the same). Ratios: 9 ÷ 3 = 3, 27 ÷ 9 = 3 (the same). So it is <b>geometric</b> with ' + nw(v('r') + ' = 3') + '.',
        'Rule: ' + nw(an('n') + ' = ' + an('1') + '(' + v('r') + ')' + sup(n + ' ' + M + ' 1')) + ', so ' + nw(an('n') + ' = 3(3)' + sup(n + ' ' + M + ' 1')) + '.',
        nw(an('6') + ' = 3(3)' + sup(5) + ' = 3(243) = 729') + '.'],
      ans: 'Geometric, ' + nw(an('n') + ' = 3(3)' + sup(n + ' ' + M + ' 1')) + ', ' + nw(an('6') + ' = 729') },
    tries: [
      { q: 'For 2, 10, 50, 250, … : arithmetic, geometric, or neither? Write a rule and find the 6th term.', ans: 'Geometric, ' + nw(an('n') + ' = 2(5)' + sup(n + ' ' + M + ' 1')) + ', ' + nw(an('6') + ' = 6250') },
      { q: 'Is 1, 4, 9, 16, … arithmetic, geometric, or neither? Explain.', ans: 'Neither. The differences (3, 5, 7) change and the ratios (4, 2.25, …) change.' }] },

  12: { topic: 'Arithmetic sequence: rule and a later term',
    ex: { q: 'For 6, 11, 16, 21, … : write a rule and find the 10th term.',
      steps: ['Differences: 5, 5, 5, so it is arithmetic with ' + nw(v('d') + ' = 5') + '.',
        'Rule: ' + nw(an('n') + ' = ' + an('1') + ' + ' + v('d') + '(' + n + ' ' + M + ' 1)') + ', so ' + nw(an('n') + ' = 6 + 5(' + n + ' ' + M + ' 1)') + ' (or ' + nw('5' + n + ' + 1') + ').',
        nw(an('10') + ' = 6 + 5(9) = 51') + '.'],
      ans: nw(an('n') + ' = 6 + 5(' + n + ' ' + M + ' 1)') + ', ' + nw(an('10') + ' = 51') },
    tries: [
      { q: 'For 2, 8, 14, 20, … : write a rule and find the 15th term.', ans: nw(an('n') + ' = 2 + 6(' + n + ' ' + M + ' 1)') + ', ' + nw(an('15') + ' = 86') },
      { q: 'For 20, 17, 14, 11, … : write a rule and find the 10th term.', ans: nw(an('n') + ' = 20 ' + M + ' 3(' + n + ' ' + M + ' 1)') + ', ' + nw(an('10') + ' = ' + M + '7') }] },

  13: { topic: 'Arithmetic sequence from two terms',
    ex: { q: 'Write an arithmetic sequence with ' + nw(an('1') + ' = 5') + ' and ' + nw(an('5') + ' = 25') + '. Find the 10th term.',
      steps: ['From ' + an('1') + ' to ' + an('5') + ' is 4 jumps. The total change is ' + nw('25 ' + M + ' 5 = 20') + '.',
        'Each jump: ' + nw('20 ÷ 4 = 5') + ', so ' + nw(v('d') + ' = 5') + '. The sequence is 5, 10, 15, 20, 25, …',
        nw(an('10') + ' = 5 + 5(9) = 50') + '.'],
      ans: '5, 10, 15, 20, 25, … and ' + nw(an('10') + ' = 50') },
    tries: [
      { q: 'Write an arithmetic sequence with ' + nw(an('1') + ' = 2') + ' and ' + nw(an('4') + ' = 20') + '. Find the 11th term.', ans: '2, 8, 14, 20, … and ' + nw(an('11') + ' = 62') },
      { q: 'Write an arithmetic sequence with ' + nw(an('1') + ' = 10') + ' and ' + nw(an('3') + ' = 4') + '. Find the 12th term.', ans: '10, 7, 4, 1, … and ' + nw(an('12') + ' = ' + M + '23') }] },

  14: { topic: 'Geometric sequence with a fraction ratio',
    ex: { q: 'For 1, ' + fr('1', '2') + ', ' + fr('1', '4') + ', ' + fr('1', '8') + ', … : write a rule and find the 6th term.',
      steps: ['Ratio: ' + nw(fr('1', '2') + ' ÷ 1 = ' + fr('1', '2')) + '. Check: ' + nw(fr('1', '4') + ' ÷ ' + fr('1', '2') + ' = ' + fr('1', '2')) + '.',
        'Rule: ' + nw(an('n') + ' = 1(' + fr('1', '2') + ')' + sup(n + ' ' + M + ' 1')) + '.',
        nw(an('6') + ' = (' + fr('1', '2') + ')' + sup(5) + ' = ' + fr('1', '32')) + '. Raise the top and the bottom to the 5th power.'],
      ans: nw(an('n') + ' = 1(' + fr('1', '2') + ')' + sup(n + ' ' + M + ' 1')) + ', ' + nw(an('6') + ' = ' + fr('1', '32')) },
    tries: [
      { q: 'For 1, ' + fr('1', '4') + ', ' + fr('1', '16') + ', ' + fr('1', '64') + ', … : write a rule and find the 5th term.', ans: nw(an('n') + ' = 1(' + fr('1', '4') + ')' + sup(n + ' ' + M + ' 1')) + ', ' + nw(an('5') + ' = ' + fr('1', '256')) },
      { q: 'For 9, 3, 1, ' + fr('1', '3') + ', … : write a rule and find the 6th term.', ans: nw(an('n') + ' = 9(' + fr('1', '3') + ')' + sup(n + ' ' + M + ' 1')) + ', ' + nw(an('6') + ' = ' + fr('1', '27')) }] },

  15: { topic: 'Domain and range with an open dot',
    ex: { q: 'State the domain and range of the function.',
      graph: { x: [-5, 5], y: [-3, 6], ticks: { x: 1, y: 1 }, curves: [[[-4, -1], [3, 5]]], dots: [[-4, -1], [3, 5, true]] },
      steps: ['Left end: closed dot at ' + nw(x + ' = ' + M + '4') + ' (≤). Right end: open dot at ' + nw(x + ' = 3') + ' (&lt;).',
        'Lowest ' + y + ': ' + M + '1 at the closed dot (≤). Highest ' + y + ': 5 at the open dot (&lt;).',
        'An open dot means that exact point is <b>not</b> included.'],
      ans: 'Domain ' + nw(M + '4' + le + x + lt + '3') + ', range ' + nw(M + '1' + le + y + lt + '5') },
    tries: [
      { q: 'State the domain and range.',
        graph: { x: [-4, 5], y: [-4, 4], ticks: { x: 1, y: 1 }, curves: [[[-2, 3], [4, -3]]], dots: [[-2, 3, true], [4, -3]] },
        ans: 'Domain ' + nw(M + '2' + lt + x + le + '4') + ', range ' + nw(M + '3' + le + y + lt + '3') },
      { q: 'State the domain and range.',
        graph: { x: [-4, 4], y: [-3, 5], ticks: { x: 1, y: 1 }, curves: [sm([[-3, 0], [0, 4], [3, -2]])], dots: [[-3, 0], [3, -2, true]] },
        ans: 'Domain ' + nw(M + '3' + le + x + lt + '3') + ', range ' + nw(M + '2' + lt + y + le + '4') }] },

  16: { topic: 'Domain and range when the graph keeps going',
    ex: { q: 'State the domain and range of the function.',
      graph: { x: [-4, 8], y: [-2, 5], ticks: { x: 1, y: 1 }, curves: [{ p: [[-2, 1], [-1.75, 1.5], [-1, 2], [0, 2.41], [2, 3], [4, 3.45], [7, 4]], arrow: true }], dots: [[-2, 1]] },
      steps: ['The graph starts at the closed dot (' + M + '2, 1) and the arrow means it keeps going to the right and up forever.',
        'Domain: ' + x + ' starts at ' + M + '2 and never stops, so ' + nw(x + ' ≥ ' + M + '2') + ' (also written ' + nw(M + '2' + le + x + lt + '∞') + ').',
        'Range: ' + y + ' starts at 1 and keeps rising, so ' + nw(y + ' ≥ 1') + ' (also written ' + nw('1' + le + y + lt + '∞') + ').'],
      ans: 'Domain ' + nw(x + ' ≥ ' + M + '2') + ', range ' + nw(y + ' ≥ 1') },
    tries: [
      { q: 'State the domain and range.',
        graph: { x: [-2, 10], y: [-4, 3], ticks: { x: 1, y: 1 }, curves: [{ p: [[1, -3], [1.25, -2.5], [2, -2], [5, -1], [9, -0.17]], arrow: true }], dots: [[1, -3]] },
        ans: 'Domain ' + nw(x + ' ≥ 1') + ', range ' + nw(y + ' ≥ ' + M + '3') },
      { q: 'State the domain and range. (Both ends have arrows.)',
        graph: { x: [-3, 5], y: [-3, 5], ticks: { x: 1, y: 1 }, curves: [-1, 1].map(sg => ({ p: Array.from({ length: 11 }, (_, i) => { const xx = 1 + sg * i * 0.25; return [xx, (xx - 1) ** 2 - 2]; }), arrow: true })) },
        ans: 'Domain: all real numbers. Range ' + nw(y + ' ≥ ' + M + '2') }] },

  17: { topic: 'Geometric sequence with a negative ratio',
    ex: { q: 'Write the first 4 terms of a geometric sequence that starts at 5 and has a common ratio of ' + M + '3.',
      steps: ['Multiply by ' + M + '3 each time: ' + nw('5 × (' + M + '3) = ' + M + '15') + '.',
        nw(M + '15 × (' + M + '3) = 45') + ', then ' + nw('45 × (' + M + '3) = ' + M + '135') + '.',
        'A negative ratio makes the signs switch back and forth.'],
      ans: '5, ' + M + '15, 45, ' + M + '135, …' },
    tries: [
      { q: 'Which sequence is geometric with a common ratio of ' + M + '3?', choices: ['2, ' + M + '1, ' + M + '4, ' + M + '7, …', '2, ' + M + '6, 18, ' + M + '54, …', '2, 6, 18, 54, …', M + '2, ' + M + '6, ' + M + '18, ' + M + '54, …'],
        ans: 'B. Each term is the one before times ' + M + '3.' },
      { q: 'Find the common ratio of 4, ' + M + '2, 1, ' + M + fr('1', '2') + ', …', ans: M + fr('1', '2') + ' (' + nw(M + '2 ÷ 4 = ' + M + fr('1', '2')) + ')' }] },

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
})();
