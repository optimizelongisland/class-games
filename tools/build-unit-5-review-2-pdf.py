"""Builds resources/algebra/unit-5-review-2-stations.pdf: one station per page, each with a
"Need a hint?" QR code. Questions come from games/unit-5-review-2-data.js, so edit them there.
Needs: python3 with `pip install qrcode`, node, and Playwright (Chromium).
Run from the repo root:  python3 tools/build-unit-5-review-2-pdf.py"""
import json, os, re, subprocess, sys, tempfile, io
import qrcode, qrcode.image.svg

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'resources', 'algebra', 'unit-5-review-2-stations.pdf')

dump = r"""
global.window = {}; global.location = { search: '' }; global.localStorage = { getItem: () => null };
require(process.argv[1]); const U = window.U5R2;
console.log(JSON.stringify(U.Q.map(q => ({ n: q.n, ready: q.ready, title: q.title, text: q.text, graph: q.graph ? U.graph(q.graph) : '',
  hint: U.hintURL(q.n), alt: q.alt ? { title: q.alt.title, url: U.hintURL(q.n, true) } : null, parts: q.parts.filter(p => !p.noprint).map(p => ({ q: p.pq !== undefined ? p.pq : p.q, t: p.t, labels: p.labels || 'ABCDEF', choices: p.pc === false ? null : p.choices || null })) }))));
"""
qs = json.loads(subprocess.check_output(['node', '-e', dump, os.path.join(ROOT, 'games', 'unit-5-review-2-data.js')]))

def qr(url):
    img = qrcode.make(url, image_factory=qrcode.image.svg.SvgPathImage, box_size=10, border=1)
    buf = io.BytesIO(); img.save(buf)
    s = buf.getvalue().decode()
    return s[s.index('<svg'):]

pages = []
for q in qs:
    parts = []
    many = len(q['parts']) > 1
    for i, p in enumerate(q['parts']):
        lead = '<span class="pl">' + 'abcdefg'[i] + ')</span> ' if many else ''
        if not p['q'] and not p['choices']: continue
        h = '<div class="part">' + ('<p>' + lead + p['q'] + '</p>' if p['q'] else '')
        if p['choices']:
            h += '<ol class="chs' + (' wide' if any(len(re.sub(r'<[^>]+>', '', c)) > 30 for c in p['choices']) else '') + '" style="grid-template-rows:repeat(' + str((len(p['choices']) + 1) // 2) + ',auto)">' + ''.join(
                '<li><b>' + p['labels'][k] + ')</b><span>' + c + '</span></li>' for k, c in enumerate(p['choices'])) + '</ol>'
        parts.append(h + '</div>')
    pages.append(f'''<section class="page{' dense' if q['graph'] and (len(q['parts']) > 1 or any(p['choices'] for p in q['parts'])) else ''}">
  <header><div class="num"><small>Station</small>{q['n']}</div><div class="ttl"><small>Unit 5 Review #2</small><b>{q['title']}</b></div></header>
  <div class="q">{q['text']}</div>
  {('<div class="g">' + q['graph'] + '</div>') if q['graph'] else ''}
  {'' if q['ready'] else '<div class="todo">DRAFT: this station still needs its graph, table or answer choices from the original packet. It is not in the game yet.</div>'}
  <div class="parts">{''.join(parts)}</div>
  <footer>
    <div class="jobs"><b>Recorder</b> writes the work and types the answer<br><b>Explainer</b> talks it through<br>Switch jobs at every station</div>
    <div class="qrs">{('<div class="qr alt">' + qr(q['alt']['url']) + '<div><b>' + q['alt']['title'] + '</b><span>Scan me</span></div></div>') if q['alt'] else ''}
    <div class="qr">{qr(q['hint'])}<div><b>Need a hint?</b><span>Scan me</span></div></div></div>
  </footer>
</section>''')

css = """
@page{size:letter;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:'IBM Plex Sans','Segoe UI',Arial,sans-serif;color:#111}
i{font-style:italic} sup{font-size:.7em}
.page{width:8.5in;height:11in;padding:.55in .6in .5in;display:flex;flex-direction:column;page-break-after:always;overflow:hidden}
header{display:flex;align-items:center;gap:.25in;border-bottom:4px solid #111;padding-bottom:.18in}
.num{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:1.45in;height:1.45in;background:#111;color:#fff;border-radius:.2in;font:800 72pt/1 'Bricolage Grotesque',Arial,sans-serif}
.num small{font:700 12pt 'IBM Plex Sans',Arial;letter-spacing:.2em;text-transform:uppercase;margin-bottom:.04in}
.ttl small{display:block;font-size:12pt;letter-spacing:.16em;text-transform:uppercase;color:#555;font-weight:600}
.ttl b{font:800 28pt/1.1 'Bricolage Grotesque',Arial,sans-serif}
.q{font-size:22pt;line-height:1.5;margin:.35in 0 .2in}
.page.dense .q{margin-top:.14in;margin-bottom:0}.page.dense .graph{width:3.1in;height:3.1in}.page.dense .parts{font-size:17pt}.page.dense .part{margin-top:.2in}
.g{display:flex;justify-content:center;margin:.05in 0}
.graph{width:3.9in;height:3.9in}
.g-grid{stroke:#9a9a9a;stroke-width:1}.g-axis{stroke:#111;stroke-width:2.6;fill:none}.g-arrow{fill:#111}
.g-lab{fill:#111;font:italic 600 18px 'IBM Plex Sans',Arial}.g-curve{stroke:#111;stroke-width:3.6;fill:none}.g-dot{fill:#111}
.g-num{fill:#222;font:500 15px 'IBM Plex Sans',Arial}.g-title{fill:#222;font:600 15px 'IBM Plex Sans',Arial}.g-dot.open{fill:#fff;stroke:#111;stroke-width:3}.rt{display:inline-flex;align-items:stretch;white-space:nowrap;vertical-align:bottom}.rt svg{width:.55em;flex:none;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linejoin:round;overflow:visible}.rt>span{border-top:2px solid currentColor;padding:.08em .12em 0 .08em;margin-top:1px}.rt .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);border:0;padding:0}
.nw{white-space:nowrap}
.terms{display:inline-block;margin-top:.2in;font-size:1.1em}
.fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;line-height:1.1;margin:0 .1em}
.fr>span:first-child{border-bottom:2px solid currentColor;padding:0 .2em}
.parts{font-size:19pt;line-height:1.35}
.part{margin-top:.6in}
.part p{margin:0}
.pl{font-weight:700}
.chs{list-style:none;margin:.3in 0 0;padding:0 0 0 .3in;display:grid;grid-template-columns:1fr 1fr;grid-auto-flow:column;gap:.5in .4in}
.page.dense .chs{gap:.24in .4in;margin-top:.16in}
.chs.wide{grid-template-columns:1fr 1fr;font-size:15pt;line-height:1.25}
.chs li{display:flex;gap:.08in}
.chs.wide li span{white-space:normal}
footer{margin-top:auto;display:flex;align-items:flex-end;justify-content:space-between;gap:.3in;border-top:2px solid #111;padding-top:.15in}
.jobs{font-size:11.5pt;color:#333;max-width:4.6in}
.qr{display:flex;align-items:center;gap:.15in;border:3px dashed #111;border-radius:.15in;padding:.1in .16in}
.qr svg{width:1.45in;height:1.45in}
.qr b{display:block;font:800 19pt 'Bricolage Grotesque',Arial,sans-serif}
.todo{margin-top:.4in;border:4px dashed #111;border-radius:.2in;padding:.4in;font:700 20pt/1.35 'IBM Plex Sans',Arial;text-align:center}
.qrs{display:flex;gap:.15in;align-items:flex-end}
.qr.alt b{font-size:15pt;max-width:1.5in}
.qr span{font-size:12pt;color:#333}
"""
html = ('<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800'
        '&family=IBM+Plex+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap"><style>' + css + '</style></head><body>' + ''.join(pages) + '</body></html>')

tmp = tempfile.mkdtemp()
src = os.path.join(tmp, 'stations.html')
open(src, 'w').write(html)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
render = """
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://' + process.argv[1], { waitUntil: 'load' }).catch(() => {}); await p.waitForTimeout(800);
  // shrink a page's graph until the page (footer and QR included) fits on one sheet
  const tight = await p.evaluate(() => [...document.querySelectorAll('.page')].map(pg => {
    const g = pg.querySelector('.graph'); let w = g ? g.getBoundingClientRect().width : 0, n = 0;
    while (g && pg.scrollHeight > pg.clientHeight + 1 && w > 150 && n++ < 40) { w -= 8; g.style.width = g.style.height = w + 'px'; }
    return pg.scrollHeight > pg.clientHeight + 1 ? pg.querySelector('.num').textContent : null; }).filter(Boolean));
  if (tight.length) console.error('Still too long:', tight.join(', '));
  await p.pdf({ path: process.argv[2], format: 'Letter', printBackground: true, preferCSSPageSize: true }); await b.close(); })();
"""
subprocess.check_call(['node', '-e', render, src, OUT])
print('wrote', OUT, len(qs), 'stations,', sum(1 for q in qs if not q['ready']), 'still drafts')
if '--html' in sys.argv: print(src)
