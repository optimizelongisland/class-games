/* Unit 5 Lesson 2: extra practice for each station, used by unit-5-lesson-2-practice.html
   and by the "Need an extra example?" button in the station game.
   Each station has one worked example (with steps) and five multiple-choice "try it" problems.
   The printable sheet uses the first two; online, students can ask for up to five.
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
const mapping = (i, o, a) => U.mapping(i, o, a, 'graph mini map');

/* station 12 style: each relation in its own box, graphs drawn as small pictures */
const relBox = items => '<div class="relg">' + items.map((h, i) => '<div><b>' + ['I', 'II', 'III', 'IV'][i] + '</b><span>' + h + '</span></div>').join('') + '</div>';
const RELQ = 'Which relation(s) is a function?';
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
    ex: { q: 'Which of these are functions?' + relBox([set([1, 2], [2, 3], [1, 4]), nw(y + ' = 3' + x + ' ' + M + ' 2'), GR.circle()]),
      steps: ['I: the input 1 goes to 2 and to 4. <b>Not</b> a function.',
        'II: ' + nw(y + ' = 3' + x + ' ' + M + ' 2') + ' is a slanted line. Every ' + x + ' gives one ' + y + '. It <b>is</b> a function.',
        'III: the circle fails the vertical line test. <b>Not</b> a function.'],
      ans: '<b>II only.</b>' },
    tries: [
      { q: RELQ + relBox([set([2, 1], [3, 1], [4, 1]), GR.vertical(), nw(y + ' = ' + M + x + ' + 4'), set([0, 5], [0, 6], [1, 7])]),
        choices: ['I and III', 'II and IV', 'I, only', 'III, only'], right: 0,
        ans: 'I has no repeated input, and III is a slanted line. II fails the vertical line test, and IV repeats the input 0.' },
      { q: RELQ + relBox([GR.sideways(), set([1, 5], [2, 6], [3, 7]), GR.oval(), nw(y + ' = 5')]),
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
        ans: 'The inputs 5, 6, 7 do not repeat.' }] },

  14: { topic: 'Mapping diagrams',
    ex: { q: 'Is this mapping a function?' + mapping([2, 4, 6], [1, 3], [[0, 0], [1, 0], [2, 1]]),
      steps: ['In a mapping, look at the arrows leaving each <b>input</b> (the left oval).',
        'The inputs 2, 4 and 6 each have exactly one arrow.',
        'Two arrows land on the output 1, and that is fine. Only an input with two arrows breaks a function.'],
      ans: '<b>It is a function.</b>' },
    tries: [
      { q: 'Which mapping represents a function?', choices: [mapping([1, 2], [3, 4, 5], [[0, 0], [0, 1], [1, 2]]), mapping([1, 2, 3], [7], [[0, 0], [1, 0], [2, 0]]), mapping([4, 5, 6], [1, 2], [[0, 0], [1, 0], [1, 1], [2, 1]]), mapping([0, 1], [2, 3], [[0, 0], [0, 1], [1, 1]])], right: 1,
        ans: 'Every input has one arrow, all going to 7. Sharing an output is fine.' },
      { q: 'Which mapping represents a function?', choices: [mapping([3, 4], [5, 6], [[0, 0], [0, 1], [1, 1]]), mapping([1, 2, 3], [4, 5], [[0, 0], [1, 0], [2, 0], [2, 1]]), mapping([-2, 0], [1, 2, 3], [[0, 0], [1, 1], [1, 2]]), mapping([-1, 0, 1], [0, 1], [[0, 1], [1, 0], [2, 1]])], right: 3,
        ans: 'The inputs ' + M + '1, 0 and 1 each have exactly one arrow.' },
      { q: 'Which mapping is <b>not</b> a function?', choices: [mapping([6, 7, 8], [1, 2], [[0, 0], [1, 1], [2, 0], [2, 1]]), mapping([1, 2], [5, 6], [[0, 0], [1, 1]]), mapping([3, 4, 5], [9], [[0, 0], [1, 0], [2, 0]]), mapping([0, 2, 4], [1, 3, 5], [[0, 2], [1, 1], [2, 0]])], right: 0,
        ans: 'The input 8 has two arrows, one to 1 and one to 2.' },
      { q: 'Which mapping represents a function?', choices: [mapping([1, 2, 3], [4, 5, 6], [[0, 0], [0, 1], [1, 2], [2, 2]]), mapping([5, 6], [0, 1], [[0, 0], [0, 1], [1, 1]]), mapping([2, 4, 6], [3, 5], [[0, 0], [1, 1], [2, 1]]), mapping([-3, 3], [9, -9], [[0, 0], [0, 1], [1, 0]])], right: 2,
        ans: 'The inputs 2, 4 and 6 each have exactly one arrow.' },
      { q: 'Which mapping is <b>not</b> a function?', choices: [mapping([1, 2, 3], [0], [[0, 0], [1, 0], [2, 0]]), mapping([4, 5], [8, 9], [[0, 1], [1, 0]]), mapping([-1, 0, 1], [2, 3], [[0, 0], [1, 0], [1, 1], [2, 1]]), mapping([7, 8, 9], [1, 2, 3], [[0, 0], [1, 1], [2, 2]])], right: 2,
        ans: 'The input 0 has two arrows, one to 2 and one to 3.' }] },

  15: { topic: 'Equations: function or not?',
    ex: { q: 'Is ' + nw(x + ' = ' + M + '3') + ' a function?',
      steps: ['Picture the graph. Every point on it has ' + nw(x + ' = ' + M + '3') + ', so it is a vertical line.',
        'The one input ' + M + '3 goes to every ' + y + '-value: (' + M + '3, 0), (' + M + '3, 1), (' + M + '3, 2) and so on.',
        'One input with many outputs, so it fails the vertical line test.'],
      ans: '<b>Not a function.</b> (' + nw(y + ' = ' + M + '3') + ', a horizontal line, would be a function.)' },
    tries: [
      { q: 'Which equation does <b>not</b> represent a function?', choices: [nw(y + ' = 2' + x + ' + 3'), nw(y + ' = 7'), nw(x + ' = 1'), nw(y + ' = ' + x + '<sup>2</sup> + 1')], right: 2,
        ans: nw(x + ' = 1') + ' is a vertical line.' },
      { q: 'Which equation represents a function?', choices: [nw(x + ' = ' + M + '5'), nw(x + ' = 0'), nw(y + ' = ' + M + '4' + x + ' + 1'), nw(x + ' = 8')], right: 2,
        ans: nw(y + ' = ' + M + '4' + x + ' + 1') + ' is a slanted line. The others are vertical lines.' },
      { q: 'Which equation does <b>not</b> represent a function?', choices: [nw(y + ' = ' + M + x), nw(x + ' = 6'), nw(y + ' = 4'), nw(y + ' = ' + x + ' ' + M + ' 9')], right: 1,
        ans: nw(x + ' = 6') + ' is a vertical line.' },
      { q: 'Which equation represents a function?', choices: [nw(x + ' = 2'), nw(y + ' = 3'), nw(x + ' = ' + M + '1'), nw(x + ' = 10')], right: 1,
        ans: nw(y + ' = 3') + ' is a horizontal line, so every ' + x + ' goes to 3.' },
      { q: 'Which equation does <b>not</b> represent a function?', choices: [nw(y + ' = 5' + x), nw(y + ' = ' + x + '<sup>2</sup>'), nw(y + ' = 0'), nw(x + ' = ' + M + '7')], right: 3,
        ans: nw(x + ' = ' + M + '7') + ' is a vertical line.' }] },

  16: { topic: 'Missing value in a table',
    ex: { q: 'This table should be a function. Can the <b>?</b> be 4?' + tb(xy, [[2, 1], [4, 3], [6, 5], ['?', 7]]),
      steps: ['The ' + nw(x + '-values') + ' already used are 2, 4 and 6.',
        'If the ? were 4, the input 4 would go to 3 and to 7. That is two outputs.',
        'So the ? has to be a new number, like 8.'],
      ans: '<b>No.</b> The ? can not be 4.' },
    tries: [
      { q: 'This table represents a function. Which value can <b>not</b> replace the <b>?</b>' + tb(xy, [[1, 2], [3, 4], [5, 6], ['?', 8]]), choices: ['2', '3', '4', '7'], right: 1,
        ans: '3 is already used (it goes to 4), so it can’t also go to 8.' },
      { q: 'This table represents a function. Which value can <b>not</b> replace the <b>?</b>' + tb(xy, [[0, 5], [-1, 5], [-2, 5], ['?', 9]]), choices: [N(-2), '1', '2', '3'], right: 0,
        ans: M + '2 is already used (it goes to 5), so it can’t also go to 9.' },
      { q: 'This table represents a function. Which value can <b>not</b> replace the <b>?</b>' + tb(xy, [[10, 1], [20, 2], [30, 3], ['?', 4]]), choices: ['40', '20', '15', '0'], right: 1,
        ans: '20 is already used (it goes to 2), so it can’t also go to 4.' },
      { q: 'Which value of <b>?</b> will make this table a function?' + tb(xy, [[2, 6], [3, 9], [4, 12], ['?', 15]]), choices: ['2', '3', '4', '5'], right: 3,
        ans: '2, 3 and 4 are already used, so the ? must be 5.' },
      { q: 'Which value of <b>?</b> will make this table a function?' + tb(xy, [[-3, 1], [0, 1], [3, 1], ['?', 2]]), choices: [N(-3), '0', '3', '6'], right: 3,
        ans: M + '3, 0 and 3 are already used, so the ? must be 6.' }] }
};

// three more problems per station, so a student can ask for up to 5 (only if they want them)
const notF = 'Which relation is <b>not</b> a function?', isF = 'Which relation is a function?', tbF = 'Which table represents a function?', grF = 'Which graph represents a function?', grN = 'Which graph does <b>not</b> represent a function?';
const fx = f => [x, v(f) + '(' + x + ')'];
const io = ['Input', 'Output'];
const miss3 = (q, nums, right, ans) => ({ q, choices: nums.map(N), right, ans });
const rel = (...R) => RELQ + relBox(R);
const MORE = {
  1: [
    { q: notF, choices: [set([2, 3], [4, 5], [6, 7]), set([1, 2], [3, 2], [5, 2]), set([0, 4], [1, 5], [2, 6]), set([7, 1], [8, 2], [7, 3])], right: 3, ans: nw(x + ' = 7') + ' goes to both 1 and 3.' },
    { q: notF, choices: [set([-2, 0], [-1, 1], [-2, 2]), set([3, 3], [4, 4], [5, 5]), set([0, 9], [1, 9], [2, 9]), set([6, -1], [7, -2], [8, -3])], right: 0, ans: nw(x + ' = ' + M + '2') + ' goes to both 0 and 2.' },
    { q: notF, choices: [set([1, 1], [2, 4], [3, 9]), set([5, 0], [6, 1], [6, 2]), set([-4, 2], [-3, 2], [-2, 2]), set([9, 8], [8, 9], [7, 10])], right: 1, ans: nw(x + ' = 6') + ' goes to both 1 and 2.' }],
  2: [
    { q: isF, choices: [set([3, 1], [4, 1], [5, 6]), set([2, 2], [2, 3], [4, 4]), set([1, 0], [1, 5], [2, 6]), set([8, 1], [9, 2], [8, 3])], right: 0, ans: 'The ' + nw(x + '-values') + ' 3, 4, 5 do not repeat.' },
    { q: isF, choices: [set([0, 0], [0, 1], [1, 2]), set([5, 5], [6, 6], [5, 7]), set([-3, 4], [0, 4], [3, 4]), set([2, -1], [2, 1], [3, 0])], right: 2, ans: 'The ' + nw(x + '-values') + ' ' + M + '3, 0, 3 do not repeat. Repeating the output 4 is allowed.' },
    { q: isF, choices: [set([4, 9], [4, 8], [5, 7]), set([10, 2], [20, 4], [30, 6]), set([-1, -1], [-1, 1], [0, 0]), set([6, 3], [7, 3], [6, 4])], right: 1, ans: 'The ' + nw(x + '-values') + ' 10, 20, 30 do not repeat.' }],
  3: [
    miss3('Given ' + set([2, 6], [4, 1], [7, 3], [x, 8]) + ', which value of ' + x + ' will make this relation a function?', [2, 4, 5, 7], 2, '2, 4 and 7 are already used, so ' + nw(x + ' = 5') + '.'),
    miss3('Given ' + set([-1, 4], [1, 0], [3, 2], [x, 6]) + ', which value of ' + x + ' will make this relation a function?', [-1, 0, 1, 3], 1, M + '1, 1 and 3 are already used, so ' + nw(x + ' = 0') + '.'),
    miss3('Given ' + set([5, 5], [10, 3], [15, 1], [x, 7]) + ', which value of ' + x + ' will make this relation a function?', [20, 5, 10, 15], 0, '5, 10 and 15 are already used, so ' + nw(x + ' = 20') + '.')],
  4: [
    { q: tbF, choices: [tb(xy, [[1, 6], [2, 6], [3, 6]]), tb(xy, [[0, 2], [1, 3], [0, 4]]), tb(xy, [[7, 1], [7, 2], [8, 3]]), tb(xy, [[3, 5], [4, 6], [3, 7]])], right: 0, ans: 'The inputs 1, 2, 3 do not repeat. The output 6 repeating is fine.' },
    { q: tbF, choices: [tb(xy, [[2, 1], [2, 2], [2, 3]]), tb(xy, [[5, 0], [6, 1], [5, 2]]), tb(xy, [[-1, 4], [-2, 5], [-1, 6]]), tb(xy, [[0, 0], [1, -1], [2, -2]])], right: 3, ans: 'The inputs 0, 1, 2 do not repeat.' },
    { q: tbF, choices: [tb(xy, [[4, 3], [5, 3], [4, 8]]), tb(xy, [[-2, 5], [0, 5], [2, 1]]), tb(xy, [[9, 2], [9, 3], [10, 4]]), tb(xy, [[3, -3], [6, 0], [3, 3]])], right: 1, ans: 'The inputs ' + M + '2, 0, 2 do not repeat.' }],
  5: [
    { q: grF, choices: [GR.circle(), GR.sidewaysLeft(), GR.wave(), GR.vertical()], right: 2, ans: 'The wave always moves to the right, so every vertical line hits it once.' },
    { q: grF, choices: [GR.vSide(), GR.segment(), GR.oval(), GR.cubic()], right: 3, ans: 'The rising S curve passes the vertical line test.' },
    { q: grF, choices: [GR.parabolaDown(), GR.sideways(), GR.circle(), GR.sStand()], right: 0, ans: 'The upside-down U passes the vertical line test.' }],
  6: [
    { q: grN, choices: [GR.slant(), GR.circle(), GR.parabolaUp(), GR.vUp()], right: 1, ans: 'The circle: a vertical line through the middle hits it twice.' },
    { q: grN, choices: [GR.wave(), GR.steps(), GR.vSide(), GR.parabolaDown()], right: 2, ans: 'The sideways V: a vertical line to the left of the corner hits it twice.' },
    { q: grN, choices: [GR.horizontal(), GR.cubic(), GR.vUp(), GR.sStand()], right: 3, ans: 'The standing wavy curve: a vertical line near the middle hits it more than once.' }],
  7: [
    { q: grF, choices: [GR.sideways(), GR.cubic(), GR.oval(), GR.sStand()], right: 1, ans: 'The rising S curve never turns back, so it passes.' },
    { q: grF, choices: [GR.circle(), GR.sidewaysLeft(), GR.wave(), GR.segment()], right: 2, ans: 'The wave passes the vertical line test.' },
    { q: grF, choices: [GR.parabolaUp(), GR.sStand(), GR.sideways(), GR.oval()], right: 0, ans: 'The U opening up passes the vertical line test.' }],
  8: [
    { q: grF, choices: [GR.circle(), GR.segment(), GR.parabolaDown(), GR.vSide()], right: 2, ans: 'The upside-down U passes. The circle, vertical segment and sideways V fail.' },
    { q: grF, choices: [GR.oval(), GR.slant(), GR.vertical(), GR.sidewaysLeft()], right: 1, ans: 'The slanted line passes. The oval, vertical line and sideways U fail.' },
    { q: grF, choices: [GR.segment(), GR.circle(), GR.sideways(), GR.horizontal()], right: 3, ans: 'The horizontal line passes. The others are hit twice by a vertical line.' }],
  9: [
    { q: grF, choices: [GR.vUp(), GR.vSide(), GR.sideways(), GR.circle()], right: 0, ans: 'The V opening up passes. The V on its side does not.' },
    { q: grF, choices: [GR.sidewaysLeft(), GR.segment(), GR.parabolaUp(), GR.oval()], right: 2, ans: 'The U opening up passes. The U opening left does not.' },
    { q: grF, choices: [GR.vSide(), GR.vertical(), GR.sStand(), GR.wave()], right: 3, ans: 'The wave passes the vertical line test.' }],
  10: [
    { q: grF, choices: [GR.sideways(), GR.slant(), GR.circle(), GR.segment()], right: 1, ans: 'A slanted straight line passes the vertical line test.' },
    { q: grF, choices: [GR.vertical(), GR.oval(), GR.sStand(), GR.steps()], right: 3, ans: 'The stair-step line never has two points on the same vertical line.' },
    { q: grF, choices: [GR.cubic(), GR.vSide(), GR.sidewaysLeft(), GR.circle()], right: 0, ans: 'The rising S curve passes the vertical line test.' }],
  11: [
    { q: 'Which table could represent a function?', choices: [tb(fx('f'), [[1, 2], [2, 2], [3, 5]]), tb(fx('g'), [[4, 1], [4, 3], [5, 6]]), tb(fx('h'), [[0, 7], [1, 8], [0, 9]]), tb(fx('k'), [[2, 2], [3, 3], [3, 4]])], right: 0, ans: 'Table ' + v('f') + ': the inputs 1, 2, 3 do not repeat.' },
    { q: 'Which table could represent a function?', choices: [tb(fx('p'), [[6, 1], [6, 2], [7, 3]]), tb(fx('q'), [[-1, 0], [0, 1], [-1, 2]]), tb(fx('r'), [[3, 4], [5, 6], [3, 8]]), tb(fx('s'), [[-2, 4], [2, 4], [0, 0]])], right: 3, ans: 'Table ' + v('s') + ': the inputs ' + M + '2, 2, 0 do not repeat. Sharing the output 4 is fine.' },
    { q: 'Which table could represent a function?', choices: [tb(fx('f'), [[0, 3], [0, 4], [1, 5]]), tb(fx('g'), [[8, 2], [9, 2], [8, 1]]), tb(fx('h'), [[10, 0], [11, 1], [12, 0]]), tb(fx('k'), [[1, 6], [2, 7], [2, 8]])], right: 2, ans: 'Table ' + v('h') + ': the inputs 10, 11, 12 do not repeat.' }],
  12: [
    { q: rel(set([1, 3], [1, 4], [2, 5]), nw(y + ' = 2' + x + ' + 1'), GR.circle(), set([0, 2], [1, 2], [2, 2])), choices: ['I and III', 'II and IV', 'II, only', 'I, only'], right: 1,
      ans: 'II is a slanted line, and IV has no repeated input. I repeats the input 1, and the circle fails the vertical line test.' },
    { q: rel(GR.horizontal(), set([4, 1], [4, 2], [5, 3]), GR.parabolaUp(), GR.oval()), choices: ['I and III', 'II and IV', 'III, only', 'I and II'], right: 0,
      ans: 'The horizontal line and the U opening up pass the vertical line test. II repeats the input 4, and the oval fails.' },
    { q: rel(GR.vertical(), set([-1, 0], [0, 1], [1, 2]), nw(y + ' = ' + M + '2' + x), GR.vSide()), choices: ['I and IV', 'II, only', 'II and III', 'III, only'], right: 2,
      ans: 'II has no repeated input, and III is a slanted line. The vertical line and the sideways V fail the vertical line test.' }],
  13: [
    { q: isF, choices: [mapping([1, 2, 3], [4, 5], [[0, 0], [1, 0], [1, 1], [2, 1]]), mapping([4, 5, 6], [0, 1, 2], [[0, 0], [1, 1], [2, 2]]), tb(io, [[2, 3], [2, 4], [3, 5]]), GR.sideways()], right: 1,
      ans: 'In that mapping each input has exactly one arrow.' },
    { q: isF, choices: [set([1, 9], [2, 9], [3, 9]), mapping([0, 1], [2, 3, 4], [[0, 0], [0, 1], [1, 2]]), GR.vertical(), tb(io, [[6, 1], [7, 2], [6, 3]])], right: 0,
      ans: 'The inputs 1, 2, 3 do not repeat. Every output being 9 is fine.' },
    { q: isF, choices: [GR.oval(), set([2, 2], [2, 3], [4, 4]), mapping([-2, 0, 2], [1, 5], [[0, 0], [0, 1], [1, 1], [2, 1]]), tb(io, [[1, 4], [2, 4], [3, 4]])], right: 3,
      ans: 'In the table the inputs 1, 2, 3 do not repeat. The output 4 repeating is fine.' }]
};
Object.keys(MORE).forEach(n => U.PRACTICE[n].tries.push(...MORE[n]));

// every try becomes a list of parts (one part each here), the way the station game reads them
Object.keys(U.PRACTICE).forEach(s_ => U.PRACTICE[s_].tries.forEach(t => {
  if (!t.sub) t.sub = [{ q: null, t: 'mc', choices: t.choices, right: t.right, ans: t.ans }];
  t.sub.forEach(pt => { if (pt.t === 'mc') pt.answer = pt.right; });
}));
})();
