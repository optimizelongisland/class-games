/* Unit 5 Lesson 2: extra practice for each station, used by unit-5-lesson-2-practice.html
   and by the "Need an extra example?" button in the station game.
   Each station has one worked example (with steps) and two multiple-choice "try it" problems.
   These are new problems written for practice, in the same style as packet pages 15-18. */
(function () {
'use strict';
const U = window.U5L2, { v, nw, M } = U.H;
const x = v('x'), y = v('y');
const N = k => k < 0 ? M + (-k) : String(k);
const set = (...P) => nw('{' + P.map(p => '(' + p.map(N).join(', ') + ')').join(', ') + '}');
const tb = (h, rows) => '<table class="tb"><tr><th>' + h[0] + '</th><th>' + h[1] + '</th></tr>' + rows.map(r => '<tr><td>' + N(r[0]) + '</td><td>' + N(r[1]) + '</td></tr>').join('') + '</table>';
const xy = [x, y];

/* small graphs drawn with the shared graph helper */
const G = (curves, label, dots) => U.graph({ x: [-5, 5], y: [-5, 5], curves, dots, label }).replace('class="graph"', 'class="graph mini"');
const pts = (f, a, b, n) => Array.from({ length: n + 1 }, (_, i) => { const t = a + (b - a) * i / n; return f(t); });
const circle = (cx, cy, rx, ry) => ({ p: pts(t => [cx + rx * Math.cos(t), cy + (ry || rx) * Math.sin(t)], 0, 2 * Math.PI, 48) });
const ray = (a, b) => ({ p: [a, b], arrow: true });
const lineB = (a, b) => ({ p: [a, b], arrow: 'both' });
const GR = {
  parabolaUp: () => G([{ p: pts(t => [t, t * t - 3], -2.8, 2.8, 14), arrow: 'both' }], 'A U-shaped curve opening up'),
  parabolaDown: () => G([{ p: pts(t => [t, 3 - t * t / 1.5], -3.2, 3.2, 16), arrow: 'both' }], 'An upside-down U'),
  sideways: () => G([{ p: pts(t => [t * t - 3, t], -2.7, 2.7, 18), arrow: 'both' }], 'A U shape opening to the right'),
  sidewaysLeft: () => G([{ p: pts(t => [3 - t * t, t], -2.7, 2.7, 18), arrow: 'both' }], 'A U shape opening to the left'),
  vUp: () => G([ray([1, -2], [-3.5, 2.5]), ray([1, -2], [4.5, 1.5])], 'A V shape opening up'),
  vSide: () => G([ray([2, 0], [-2.5, 4.5]), ray([2, 0], [-2.5, -4.5])], 'A V shape on its side, opening left'),
  vertical: () => G([lineB([-2, -4.5], [-2, 4.5])], 'A vertical line'),
  horizontal: () => G([lineB([-4.5, 2], [4.5, 2])], 'A horizontal line'),
  slant: () => G([lineB([-4, -3], [4, 3])], 'A slanted straight line'),
  circle: () => G([circle(0, 0, 3)], 'A circle'),
  oval: () => G([circle(0, 1, 3.5, 2)], 'An oval'),
  cubic: () => G([{ p: pts(t => [t, t * t * t / 4], -2.6, 2.6, 16), arrow: 'both' }], 'An S-shaped curve that rises from left to right'),
  sStand: () => G([{ p: pts(t => [2 * Math.sin(t), t * 0.9], -4.4, 4.4, 30), arrow: 'both' }], 'A wavy curve standing up and down'),
  wave: () => G([{ p: pts(t => [t, 2 * Math.sin(t)], -4.5, 4.5, 30), arrow: 'both' }], 'A wave going left to right'),
  steps: () => G([{ p: [[-4.5, -3], [-2, -1]] }, { p: [[-2, -1], [1, -1]] }, { p: [[1, -1], [2, 2]] }, ray([2, 2], [4.5, 2])], 'A line that rises, goes flat, rises again, then stays flat'),
  segment: () => G([{ p: [[3, -3], [3, 3]] }], 'A vertical segment', [[3, -3], [3, 3]])
};
/* a mapping diagram: two ovals, arrows from inputs to outputs */
function mapping(ins, outs, arrows) {
  const H = 40 + Math.max(ins.length, outs.length) * 34, row = (n, i) => 30 + (i + 0.5) * (H - 40) / n;
  let s = '<svg class="graph mini map" viewBox="0 0 240 ' + (H + 20) + '" role="img" aria-label="Mapping: ' + arrows.map(([a, b]) => ins[a] + ' to ' + outs[b]).join(', ') + '">' +
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

const VLT = 'Use the vertical line test: slide a vertical line (a pencil held straight up and down) across the graph from left to right.';
U.PRACTICE = {
  1: { topic: 'Which ordered pairs are not a function?',
    ex: { q: 'Is ' + set([3, 1], [4, 2], [5, 1], [3, 6]) + ' a function?',
      steps: ['List the ' + nw(x + '-values') + ' (the first numbers): 3, 4, 5, 3.',
        'The ' + nw(x + '-value') + ' 3 shows up twice: once with ' + nw(y + ' = 1') + ' and once with ' + nw(y + ' = 6') + '.',
        'One input with two different outputs breaks the rule, so this relation is <b>not</b> a function.'],
      ans: '<b>Not a function.</b> ' + nw(x + ' = 3') + ' goes to both 1 and 6.' },
    tries: [
      { q: 'Which relation is <b>not</b> a function?', choices: [set([1, 3], [2, 3], [3, 3]), set([0, 1], [1, 0], [2, 1]), set([4, 2], [5, 3], [4, 7]), set([-1, 5], [1, 5], [3, 5])], right: 2,
        ans: nw(x + ' = 4') + ' goes to both 2 and 7.' },
      { q: 'Which relation is <b>not</b> a function?', choices: [set([2, 4], [-2, 4], [3, 9]), set([0, 0], [1, 1], [1, -1]), set([5, 1], [6, 2], [7, 3]), set([-3, 0], [0, -3], [3, 0])], right: 1,
        ans: nw(x + ' = 1') + ' goes to both 1 and ' + M + '1.' }] },

  2: { topic: 'Which ordered pairs are a function?',
    ex: { q: 'Is ' + set([1, 4], [2, 4], [3, 4], [4, 4]) + ' a function?',
      steps: ['List the ' + nw(x + '-values') + ': 1, 2, 3, 4.',
        'None of them repeat, so every input has exactly one output.',
        'All the ' + nw(y + '-values') + ' are 4, and that is fine. Repeating a ' + nw(y + '-value') + ' does not break a function.'],
      ans: '<b>It is a function.</b>' },
    tries: [
      { q: 'Which relation is a function?', choices: [set([2, 5], [2, 6], [3, 7]), set([1, 8], [2, 8], [3, 8]), set([0, 1], [0, 2], [0, 3]), set([4, 1], [5, 2], [5, 3])], right: 1,
        ans: 'The ' + nw(x + '-values') + ' 1, 2, 3 do not repeat. Repeating the output 8 is allowed.' },
      { q: 'Which relation is a function?', choices: [set([-1, 2], [0, 3], [-1, 4]), set([6, 0], [7, 1], [6, 2]), set([3, 3], [3, 4], [3, 5]), set([-2, 7], [-1, 7], [0, 9])], right: 3,
        ans: 'The ' + nw(x + '-values') + ' ' + M + '2, ' + M + '1, 0 do not repeat.' }] },

  3: { topic: 'Find a missing x that keeps it a function',
    ex: { q: 'Given ' + set([1, 3], [4, 5], [6, 2], [x, 9]) + ', which value of ' + x + ' would make the relation a function: 1, 4, 6 or 8?',
      steps: ['The ' + nw(x + '-values') + ' already used are 1, 4 and 6.',
        'If ' + x + ' were 1, 4 or 6, that input would have two outputs (for example 1 would go to 3 and 9).',
        'So ' + x + ' must be a new number. Of the choices, only 8 is new.'],
      ans: nw(x + ' = 8') },
    tries: [
      { q: 'Given ' + set([-2, 1], [0, 3], [5, 7], [x, 2]) + ', which value of ' + x + ' will make this relation a function?', choices: [N(-2), '0', '3', '5'], right: 2,
        ans: M + '2, 0 and 5 are already used, so ' + nw(x + ' = 3') + ' is the only choice that keeps one output per input.' },
      { q: 'Given ' + set([3, 8], [6, 2], [9, 4], [x, 5]) + ', which value of ' + x + ' will make this relation a function?', choices: ['6', '9', '3', '12'], right: 3,
        ans: '3, 6 and 9 are already used, so ' + nw(x + ' = 12') + '.' }] },

  4: { topic: 'Which table is a function?',
    ex: { q: 'Is this table a function?' + tb(xy, [[1, 5], [2, 7], [3, 5], [1, 9]]),
      steps: ['Read down the ' + x + ' column: 1, 2, 3, 1.',
        'The input 1 shows up twice, once with 5 and once with 9.',
        'One input with two outputs means the table is <b>not</b> a function. (The output 5 repeating is fine.)'],
      ans: '<b>Not a function.</b>' },
    tries: [
      { q: 'Which table represents a function?', choices: [tb(xy, [[0, 1], [0, 2], [1, 3]]), tb(xy, [[2, 4], [3, 4], [4, 4]]), tb(xy, [[5, 1], [6, 2], [5, 3]]), tb(xy, [[1, 1], [1, 2], [1, 3]])], right: 1,
        ans: 'The inputs 2, 3, 4 do not repeat.' },
      { q: 'Which table represents a function?', choices: [tb(xy, [[-1, 3], [0, 3], [-1, 5]]), tb(xy, [[4, 0], [4, 1], [5, 2]]), tb(xy, [[-3, 6], [-1, 2], [1, -2]]), tb(xy, [[2, 2], [3, 3], [2, -2]])], right: 2,
        ans: 'The inputs ' + M + '3, ' + M + '1, 1 do not repeat.' }] },

  5: { topic: 'Which graph is a function?',
    ex: { q: 'Is this graph a function?' + GR.horizontal(),
      steps: [VLT, 'Every vertical line crosses the horizontal line exactly once.',
        'So each ' + x + ' has only one ' + y + ', and the graph passes the vertical line test.'],
      ans: '<b>It is a function.</b> (A vertical line would NOT be a function.)' },
    tries: [
      { q: 'Which graph represents a function?', choices: [GR.vertical(), GR.sideways(), GR.slant(), GR.circle()], right: 2,
        ans: 'A slanted straight line passes the vertical line test.' },
      { q: 'Which graph represents a function?', choices: [GR.vSide(), GR.parabolaUp(), GR.oval(), GR.segment()], right: 1,
        ans: 'The U opening up passes the vertical line test.' }] },

  6: { topic: 'Which graph is not a function?',
    ex: { q: 'Is this graph a function?' + GR.sidewaysLeft(),
      steps: [VLT, 'A vertical line at ' + nw(x + ' = 0') + ' hits the curve twice, once above the ' + x + '-axis and once below.',
        'Two points on the same vertical line means one ' + x + ' has two ' + nw(y + '-values') + '.'],
      ans: '<b>Not a function.</b> It fails the vertical line test.' },
    tries: [
      { q: 'Which graph does <b>not</b> represent a function?', choices: [GR.parabolaDown(), GR.vUp(), GR.steps(), GR.oval()], right: 3,
        ans: 'The oval: a vertical line through the middle hits it twice.' },
      { q: 'Which graph does <b>not</b> represent a function?', choices: [GR.cubic(), GR.vertical(), GR.wave(), GR.horizontal()], right: 1,
        ans: 'The vertical line: one ' + x + '-value has every ' + y + '-value.' }] },

  7: { topic: 'Curves: which one is a function?',
    ex: { q: 'Is this graph a function?' + GR.cubic(),
      steps: [VLT, 'The curve keeps moving to the right as it goes up. It never turns back.',
        'Every vertical line hits it once, so it passes.'],
      ans: '<b>It is a function.</b>' },
    tries: [
      { q: 'Which graph represents a function?', choices: [GR.sStand(), GR.wave(), GR.circle(), GR.sideways()], right: 1,
        ans: 'The wave goes up and down but always moves right, so every vertical line hits it once.' },
      { q: 'Which graph represents a function?', choices: [GR.oval(), GR.sidewaysLeft(), GR.parabolaDown(), GR.sStand()], right: 2,
        ans: 'The upside-down U passes the vertical line test.' }] },

  8: { topic: 'Circles, segments and arches',
    ex: { q: 'Is this graph a function?' + GR.circle(),
      steps: [VLT, 'A vertical line through the middle of the circle hits it twice: once on top and once on the bottom.',
        'So one ' + x + '-value has two ' + nw(y + '-values') + '.'],
      ans: '<b>Not a function.</b> Circles always fail the vertical line test.' },
    tries: [
      { q: 'Which graph represents a function?', choices: [GR.segment(), GR.vSide(), GR.parabolaUp(), GR.oval()], right: 2,
        ans: 'The U opening up passes. The vertical segment, sideways V and oval all fail.' },
      { q: 'Which graph represents a function?', choices: [GR.vUp(), GR.circle(), GR.vertical(), GR.sideways()], right: 0,
        ans: 'The V opening up passes the vertical line test.' }] },

  9: { topic: 'Sideways shapes and V shapes',
    ex: { q: 'Is this graph a function?' + GR.vUp(),
      steps: [VLT, 'Slide the line across: it touches the V in only one spot each time, even at the corner.',
        'So every ' + x + ' has one ' + y + '.'],
      ans: '<b>It is a function.</b> A V turned on its side would not be.' },
    tries: [
      { q: 'Which graph represents a function?', choices: [GR.sideways(), GR.vertical(), GR.circle(), GR.steps()], right: 3,
        ans: 'The stair-step line never has two points on the same vertical line.' },
      { q: 'Which graph represents a function?', choices: [GR.vSide(), GR.slant(), GR.sStand(), GR.segment()], right: 1,
        ans: 'A slanted straight line passes the vertical line test.' }] },

  10: { topic: 'More graphs: function or not?',
    ex: { q: 'Is this graph a function?' + GR.sStand(),
      steps: [VLT, 'This curve wiggles left and right as it goes up, so it doubles back over itself.',
        'A vertical line near the middle hits it in more than one spot.'],
      ans: '<b>Not a function.</b>' },
    tries: [
      { q: 'Which graph represents a function?', choices: [GR.oval(), GR.segment(), GR.sStand(), GR.parabolaDown()], right: 3,
        ans: 'The upside-down U passes the vertical line test.' },
      { q: 'Which graph represents a function?', choices: [GR.circle(), GR.vUp(), GR.vertical(), GR.sidewaysLeft()], right: 1,
        ans: 'The V opening up passes the vertical line test.' }] },

  11: { topic: 'Function tables with f(x)',
    ex: { q: 'Could this table represent a function?' + tb([x, v('f') + '(' + x + ')'], [[2, 7], [4, 7], [6, 7], [8, 7]]),
      steps: ['Read down the ' + x + ' column: 2, 4, 6, 8. No input repeats.',
        'Every output is 7. A repeated output is fine.',
        'Each input has exactly one output, so it could be a function.'],
      ans: '<b>Yes, it could be a function.</b>' },
    tries: [
      { q: 'Which table could represent a function?', choices: [tb([x, v('f') + '(' + x + ')'], [[1, 3], [2, 5], [1, 7]]), tb([x, v('g') + '(' + x + ')'], [[0, 2], [3, 2], [0, 4]]), tb([x, v('h') + '(' + x + ')'], [[5, 1], [6, 1], [7, 2]]), tb([x, v('k') + '(' + x + ')'], [[4, 4], [4, 5], [6, 6]])], right: 2,
        ans: 'Table ' + v('h') + ': the inputs 5, 6, 7 do not repeat.' },
      { q: 'Which table could represent a function?', choices: [tb([x, v('p') + '(' + x + ')'], [[-2, 1], [-1, 0], [-2, 3]]), tb([x, v('q') + '(' + x + ')'], [[3, 9], [-3, 9], [0, 0]]), tb([x, v('r') + '(' + x + ')'], [[1, 1], [2, 2], [2, 4]]), tb([x, v('s') + '(' + x + ')'], [[7, 0], [7, 1], [8, 2]])], right: 1,
        ans: 'Table ' + v('q') + ': the inputs 3, ' + M + '3, 0 do not repeat. Two inputs sharing the output 9 is fine.' }] },

  12: { topic: 'Which relation(s) is a function?',
    ex: { q: 'Which of these are functions? <b>I</b> ' + set([1, 2], [2, 3], [1, 4]) + ' &nbsp; <b>II</b> ' + nw(y + ' = 3' + x + ' ' + M + ' 2') + ' &nbsp; <b>III</b> a circle',
      steps: ['I: the input 1 goes to 2 and to 4. <b>Not</b> a function.',
        'II: ' + nw(y + ' = 3' + x + ' ' + M + ' 2') + ' is a slanted line. Every ' + x + ' gives one ' + y + '. It <b>is</b> a function.',
        'III: a circle fails the vertical line test. <b>Not</b> a function.'],
      ans: '<b>II only.</b>' },
    tries: [
      { q: 'Which relation(s) is a function?<br><b>I</b> ' + set([2, 1], [3, 1], [4, 1]) + '<br><b>II</b> a vertical line<br><b>III</b> ' + nw(y + ' = ' + M + x + ' + 4') + '<br><b>IV</b> ' + set([0, 5], [0, 6], [1, 7]),
        choices: ['I and III', 'II and IV', 'I, only', 'III, only'], right: 0,
        ans: 'I has no repeated input, and III is a slanted line. II fails the vertical line test, and IV repeats the input 0.' },
      { q: 'Which relation(s) is a function?<br><b>I</b> a U shape opening to the right<br><b>II</b> ' + set([1, 5], [2, 6], [3, 7]) + '<br><b>III</b> an oval<br><b>IV</b> ' + nw(y + ' = 5'),
        choices: ['I and III', 'II, only', 'II and IV', 'IV, only'], right: 2,
        ans: 'II has no repeated input, and ' + nw(y + ' = 5') + ' is a horizontal line. The sideways U and the oval fail the vertical line test.' }] },

  13: { topic: 'Mappings and mixed relations',
    ex: { q: 'Is this mapping a function?' + mapping([1, 2, 3], [4, 6, 8], [[0, 0], [1, 1], [1, 2], [2, 2]]),
      steps: ['In a mapping, look at the arrows leaving each <b>input</b>.',
        'The input 2 has two arrows, one to 6 and one to 8.',
        'One input going to two outputs means it is <b>not</b> a function. (Two arrows landing on 8 would be fine.)'],
      ans: '<b>Not a function.</b>' },
    tries: [
      { q: 'Which relation is a function?', choices: [mapping([1, 2, 3], [5, 6], [[0, 0], [0, 1], [1, 1], [2, 1]]), tb(['Input', 'Output'], [[4, 1], [4, 2], [5, 3]]), mapping([-1, 0, 1], [2, 3], [[0, 0], [1, 1], [2, 0]]), GR.circle()], right: 2,
        ans: 'In that mapping each input has exactly one arrow. Two inputs landing on 2 is fine.' },
      { q: 'Which relation is a function?', choices: [set([3, 1], [3, 2], [4, 5]), mapping([2, 4, 6], [1, 3], [[0, 0], [1, 1], [1, 0], [2, 1]]), GR.oval(), set([5, 2], [6, 3], [7, 2])], right: 3,
        ans: 'The inputs 5, 6, 7 do not repeat.' }] }
};

// every try becomes a list of parts (one part each here), the way the station game reads them
Object.keys(U.PRACTICE).forEach(s_ => U.PRACTICE[s_].tries.forEach(t => {
  if (!t.sub) t.sub = [{ q: null, t: 'mc', choices: t.choices, right: t.right, ans: t.ans }];
  t.sub.forEach(pt => { if (pt.t === 'mc') pt.answer = pt.right; });
}));
})();
