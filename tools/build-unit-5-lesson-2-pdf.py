"""Builds resources/algebra/unit-5-lesson-2-stations.pdf for Unit 5 Lesson 2 (Identifying Functions Continued):
  - one station card per page (13 stations = packet pages 15-18), to post around the room
  - a student recording sheet
  - an answer key
Questions come from games/unit-5-lesson-2-data.js, so edit them there.
Needs: node and Playwright (Chromium).  Run from the repo root:  python3 tools/build-unit-5-lesson-2-pdf.py"""
import json, os, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'resources', 'algebra', 'unit-5-lesson-2-stations.pdf')
IMG = 'file://' + os.path.join(ROOT, 'games', 'unit-5-lesson-2-img') + '/'

dump = r"""
global.window = { U5L2_IMG: process.argv[2] };
require(process.argv[1]); const U = window.U5L2;
console.log(JSON.stringify(U.Q.map(q => ({ n: q.n, src: q.src, title: q.title, text: q.text,
  parts: q.parts.map(p => ({ q: p.pq !== undefined ? p.pq : p.q, labels: p.labels, choices: p.choices, pics: !!p.pics, wide: !!p.wide, answer: p.answer, key: U.keyOf(p) })) }))));
"""
qs = json.loads(subprocess.check_output(['node', '-e', dump, os.path.join(ROOT, 'games', 'unit-5-lesson-2-data.js'), IMG]))

# one line on why the right answer is right, for the key
WHY = {
  1: 'x = 1 goes to 1 and to −1 (and x = 2 goes to 2 and −2), so an input has two outputs.',
  2: 'Every pair has a different x-value. The y-values all being 1 is fine.',
  3: '0, 2 and 4 already have outputs. x = 6 is new, so every x still has one output.',
  4: 'The x-values −2, 0, 2, 4 never repeat.',
  5: 'A horizontal line passes the vertical line test. The others are hit twice by a vertical line.',
  6: 'The sideways U fails the vertical line test: one x-value has two y-values.',
  7: 'The rising S curve passes the vertical line test. The sideways U, standing S and oval fail.',
  8: 'The upside-down U passes the vertical line test. The circle, vertical segment and sideways V fail.',
  9: 'The V shape passes the vertical line test. The sideways U, vertical line and circle fail.',
  10: 'The V shape passes the vertical line test. The oval, vertical line and standing S fail.',
  11: 'Table g has x-values 1, 2, 3, 4 with no repeats. The others each repeat an x-value.',
  12: 'I repeats x = 2 (6 and −6); III fails the vertical line test. II has no repeated x, and IV is a non-vertical line.',
  13: 'The x-values 1, 2, 3, 4 never repeat. The table repeats 7, the circle fails the vertical line test, and 6 maps to 5 and 7.',
}

def choices(p, big):
    cls = 'chs' + (' pics' if p['pics'] else '') + (' wide' if p['wide'] else '')
    return '<ol class="' + cls + '">' + ''.join('<li><b>' + p['labels'][k] + ')</b><div>' + c + '</div></li>' for k, c in enumerate(p['choices'])) + '</ol>'

pages = []
for q in qs:
    p = q['parts'][0]
    pages.append(f'''<section class="page st{' rel' if q['n'] == 12 else ''}">
  <header><div class="num"><small>Station</small>{q['n']}</div><div class="ttl"><small>Unit 5 · Lesson 2 · Identifying Functions</small><b>{q['title']}</b></div></header>
  <div class="q">{q['text']}</div>
  {choices(p, True)}
  <footer><span>Write your answer and your reason on your recording sheet.</span><span>Packet {q['src']}</span></footer>
</section>''')

rows = ''.join(f'<tr><td class="sn">{q["n"]}</td><td class="ab"></td><td></td></tr>' for q in qs)
pages.append(f'''<section class="page sheet">
  <h1>Lesson 2 Stations: Identifying Functions</h1>
  <p class="nm">Name: ______________________________ &nbsp; Partner: ______________________________ &nbsp; Period: ______</p>
  <p class="dir">At each station, circle or write the choice number. Then explain <b>why</b> in a few words: which x-value repeats, or how the vertical line test works on the graph.</p>
  <table class="rec"><tr><th>Station</th><th>Answer</th><th>Why? (show how you know)</th></tr>{rows}</table>
</section>''')

krows = ''.join(f'<tr><td class="sn">{q["n"]}</td><td class="src">{q["src"]}</td><td class="ka"><b>{q["parts"][0]["labels"][q["parts"][0]["answer"]]}</b></td><td>{WHY[q["n"]]}</td></tr>' for q in qs)
pages.append(f'''<section class="page sheet key">
  <h1>Answer Key: Lesson 2 Stations</h1>
  <p class="dir">Station numbers match packet pages 15 to 18 in order.</p>
  <table class="rec"><tr><th>Station</th><th>Packet</th><th>Answer</th><th>Why</th></tr>{krows}</table>
</section>''')

css = """
@page{size:letter;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:'IBM Plex Sans','Segoe UI',Arial,sans-serif;color:#111}
i{font-style:italic;font-family:'Times New Roman',serif;font-size:1.08em}
.nw{white-space:nowrap}
.page{width:8.5in;height:11in;padding:.5in .6in .45in;display:flex;flex-direction:column;page-break-after:always;overflow:hidden}
header{display:flex;align-items:center;gap:.25in;border-bottom:4px solid #111;padding-bottom:.16in}
.num{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:1.35in;height:1.35in;background:#111;color:#fff;border-radius:.18in;font:700 66pt/1 'Oswald',Impact,sans-serif}
.num small{font:600 12pt 'IBM Plex Sans',Arial;letter-spacing:.2em;text-transform:uppercase;margin-bottom:.03in}
.ttl small{display:block;font-size:11.5pt;letter-spacing:.14em;text-transform:uppercase;color:#555;font-weight:600}
.ttl b{font:700 30pt/1.1 'Oswald',Impact,sans-serif;text-transform:uppercase;letter-spacing:.01em}
.q{font-size:23pt;line-height:1.4;margin:.3in 0 .25in}
.chs{list-style:none;margin:0;padding:0 0 0 .1in;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;grid-auto-flow:column;gap:.45in .35in;font-size:19pt;flex:1;align-content:start}
.chs li{display:flex;gap:.12in;align-items:flex-start}
.chs li>b{flex:none;min-width:.4in}
.chs.pics{gap:.3in .3in}
.cimg{display:block;width:2.7in;height:2.7in;object-fit:contain}
.chs:not(.pics):not(.wide){grid-template-columns:1fr;grid-auto-flow:row;gap:.32in;font-size:21pt}
.tb{border-collapse:collapse;font-size:17pt;text-align:center}
.tb th,.tb td{border:2px solid #111;padding:.04in .3in;min-width:.9in}
.tb th{background:#e8e8e8}
.rel .q{font-size:20pt;margin-bottom:.15in}
.rels{display:grid;grid-template-columns:1fr 1fr;gap:.2in .4in;margin-top:.2in;font-size:17pt;align-items:center}
.rels>div{display:flex;gap:.15in;align-items:center}
.rels>div>b{font:700 18pt 'Times New Roman',serif;min-width:.4in}
.rels .r2{font-size:14pt}
.rels .cimg{width:2.2in;height:2in}
.rels .tb{font-size:14pt}.rels .tb th,.rels .tb td{padding:.01in .22in;min-width:.6in}
.rel .chs{grid-template-columns:1fr 1fr;grid-auto-flow:column;font-size:20pt;gap:.25in .4in;margin-top:.15in}
footer{margin-top:auto;display:flex;justify-content:space-between;border-top:2px solid #111;padding-top:.1in;font-size:11pt;color:#333}
.sheet h1{font:700 24pt 'Oswald',Impact,sans-serif;text-transform:uppercase;margin:0 0 .12in;border-bottom:4px solid #111;padding-bottom:.08in}
.nm{font-size:12pt;margin:.05in 0 .1in}
.dir{font-size:12pt;margin:0 0 .15in;line-height:1.4}
.rec{width:100%;border-collapse:collapse;font-size:12pt}
.rec th{background:#111;color:#fff;text-align:left;padding:.06in .1in;font-weight:600}
.rec td{border:1.5px solid #111;height:.58in;padding:.04in .1in;vertical-align:middle}
.rec td.sn{width:.8in;text-align:center;font:700 18pt 'Oswald',Impact,sans-serif}
.rec td.ab{width:1in}
.key .rec td{height:.6in;font-size:11.5pt;line-height:1.3}
.key .rec td.src{width:1.15in;font-size:10.5pt;color:#333}
.key .rec td.ka{width:.85in;text-align:center;font-size:20pt}
"""
html = ('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@600;700'
        '&family=IBM+Plex+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap"><style>' + css + '</style></head><body>' + ''.join(pages) + '</body></html>')

tmp = tempfile.mkdtemp()
src = os.path.join(tmp, 'stations.html')
open(src, 'w').write(html)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
render = """
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + process.argv[1], { waitUntil: 'load' }).catch(() => {}); await p.waitForTimeout(900);
  // shrink a page's pictures until the page fits on one sheet
  const tight = await p.evaluate(() => [...document.querySelectorAll('.page')].map((pg, i) => {
    let n = 0; const ims = [...pg.querySelectorAll('.cimg')];
    while (ims.length && pg.scrollHeight > pg.clientHeight + 1 && n++ < 40) ims.forEach(im => { const h = im.getBoundingClientRect().height - 6; im.style.height = h + 'px'; im.style.width = h + 'px'; });
    return pg.scrollHeight > pg.clientHeight + 1 ? 'page ' + (i + 1) : null; }).filter(Boolean));
  if (tight.length) console.error('Still too long:', tight.join(', '));
  await p.pdf({ path: process.argv[2], format: 'Letter', printBackground: true, preferCSSPageSize: true }); await b.close(); })();
"""
subprocess.check_call(['node', '-e', render, src, OUT])
print('wrote', OUT, len(qs), 'stations')
if '--html' in sys.argv: print(src)
