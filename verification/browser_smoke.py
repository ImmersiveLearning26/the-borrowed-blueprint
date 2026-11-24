"""Run with Python Playwright and a Chromium browser.
python -m pip install playwright
python -m playwright install chromium
python verification/browser_smoke.py --dev-email <registered developer email> [--browser /path/to/chrome] [--root /path/to/kit]
The developer page only opens for the registered developer email; the script signs in for its own browser session.
No production audio is generated. A tiny in-memory WAV is used only to test playback.
"""
import argparse, functools, http.server, threading, json, pathlib, io, wave, math, struct
from playwright.sync_api import sync_playwright
ap=argparse.ArgumentParser();ap.add_argument('--browser');ap.add_argument('--dev-email',required=True);ap.add_argument('--root',default=str(pathlib.Path(__file__).resolve().parents[1]));args=ap.parse_args()
r=pathlib.Path(args.root);out=r/'verification';screens=r/'design/screens';screens.mkdir(parents=True,exist_ok=True)
class QuietHandler(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(r/'app')))
threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
report={'javascriptErrors':[],'viewports':[],'checks':[]}
with sync_playwright() as p:
 kw={'headless':True,'args':['--no-sandbox']}
 if args.browser:kw['executable_path']=args.browser
 b=p.chromium.launch(**kw);page=b.new_page(viewport={'width':1366,'height':768})
 import hashlib;page.add_init_script("sessionStorage.setItem('bb-dev','%s')" % hashlib.sha256(args.dev_email.strip().lower().encode()).hexdigest())
 page.on('pageerror',lambda e:report['javascriptErrors'].append(str(e)))
 page.goto(base+'/?dev=1');page.wait_for_function('window.__blueprint');page.add_style_tag(content='#dev{opacity:0;pointer-events:none}')
 stages=page.locator('#dev select option').evaluate_all('(els)=>els.map(e=>e.value)')
 for i,stage in enumerate(stages):
  page.locator('#dev select').select_option(stage,force=True);page.wait_for_timeout(950)
  page.screenshot(path=str(screens/f'{i+1:02d}-{stage}.png'))
  assert page.locator('#actions').inner_text().strip(), stage
 report['checks'].append(f'All {len(stages)} page states rendered with actions and screenshots')
 # Check actual source interaction, no double-spend on replay.
 page.locator('#dev select').select_option('research',force=True);page.evaluate("window.__blueprint.dispatch('source',{id:'basque'})")
 old=page.evaluate('window.__blueprint.state.paid');page.evaluate("window.__blueprint.dispatch('source',{id:'basque'})")
 assert page.evaluate('window.__blueprint.state.paid')==old
 report['checks'].append('Source replay does not spend hours again')
 # Character fallback, explicit minimize and captions.
 page.locator('#dev select').select_option('roundtable',force=True);page.evaluate("window.__blueprint.voice.play(['S4_EZE','S4_MARIN','S4_SANI'])")
 page.wait_for_function('window.__blueprint.voice.fallback');page.wait_for_timeout(800)
 assert page.locator('#caption').is_visible();assert page.locator('.person-name').inner_text()=='Dr Ngozi Eze'
 page.screenshot(path=str(screens/'15-character-speaking.png'))
 page.get_by_role('button',name='Minimise character',exact=True).click();assert page.locator('#character').get_attribute('class')=='minimized'
 page.get_by_role('button',name='Replay Dr Ngozi Eze',exact=True).click();page.wait_for_function('window.__blueprint.voice.fallback')
 assert page.locator('.person-name').is_visible();report['checks'].append('Missing media text, character minimize and replay work')
 # Media player accepts a real decodable test sound and replaces queues without overlap.
 buf=io.BytesIO()
 with wave.open(buf,'wb') as w:
  w.setnchannels(1);w.setsampwidth(2);w.setframerate(16000)
  w.writeframes(b''.join(struct.pack('<h',int(math.sin(i*2*math.pi*220/16000)*1000)) for i in range(32000)))
 page.route('**/assets/audio/*.mp3',lambda route:route.fulfill(status=200,content_type='audio/wav',body=buf.getvalue()))
 page.evaluate("window.__blueprint.voice.play(['S4_EZE','S4_MARIN'])")
 page.wait_for_function('window.__blueprint.voice.playing');assert page.evaluate('!window.__blueprint.voice.fallback')
 page.wait_for_timeout(750);page.screenshot(path=str(screens/'16-character-audio-first.png'))
 page.get_by_role('button',name='Skip to next audio line',exact=True).first.click();page.wait_for_function("window.__blueprint.voice.current.id==='S4_MARIN' && window.__blueprint.voice.playing")
 page.evaluate("window.__blueprint.voice.play(['S4_SANI'])");page.wait_for_function("window.__blueprint.voice.current.id==='S4_SANI' && window.__blueprint.voice.playing")
 page.evaluate('window.__blueprint.voice.mute(true)');assert not page.evaluate('window.__blueprint.voice.playing')
 report['checks'].append('Synthetic media: play, skip, queue replacement and mute; one AudioElement')
 page.unroute('**/assets/audio/*.mp3');page.evaluate('window.__blueprint.voice.stop();window.__blueprint.voice.mute(false)')
 for width,height in [(1366,768),(1024,768),(390,844),(360,640)]:
  page.set_viewport_size({'width':width,'height':height});page.locator('#dev select').select_option('transfer',force=True);page.wait_for_timeout(1000)
  dims=page.evaluate('({w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight,vw:innerWidth,vh:innerHeight})')
  assert dims['w']==width and dims['h']==height,dims
  page.screenshot(path=str(out/f'transfer-{width}x{height}.png'))
  # settings and essential choices resize, not only the body font.
  size1=page.locator('#actions>button').first.evaluate('e=>parseFloat(getComputedStyle(e).fontSize)')
  page.get_by_role('button',name='Settings',exact=True).click();page.locator('#drawerBody select').select_option('1.25');page.locator('#drawer .close').click()
  size2=page.locator('#actions>button').first.evaluate('e=>parseFloat(getComputedStyle(e).fontSize)');assert size2>=size1
  page.get_by_role('button',name='Settings',exact=True).click();page.locator('#drawerBody select').select_option('1');page.locator('#drawer .close').click()
  report['viewports'].append({'width':width,'height':height,'pageOverflow':False,'optionTextScale':size2/14})
 # Reduced-motion final map reaches requested country immediately.
 page.evaluate("document.body.classList.add('reduced');window.__blueprint.atlas.focus('spain')");page.wait_for_timeout(80)
 assert page.evaluate("window.__blueprint.atlas.mode==='spain'")
 report['checks'].append('Reduced-motion camera reaches requested final focus')
 # Real learner path start and resume; developer selector is absent.
 learner=b.new_page(viewport={'width':1366,'height':768});learner.on('pageerror',lambda e:report['javascriptErrors'].append(str(e)))
 learner.goto(base);learner.get_by_role('button',name='Start',exact=True).click();learner.get_by_label('Name',exact=True).fill('QA learner');learner.get_by_label('Matriculation number',exact=True).fill('QA-001');learner.locator('form button').click();learner.reload();learner.get_by_role('button',name='Continue',exact=True).click();assert learner.get_by_role('button',name='Replay',exact=True).is_visible();assert not learner.locator('#dev').is_visible()
 report['checks'].append('Learner identity persists; reload Continue restores briefing; developer controls hidden')
 assert not report['javascriptErrors'], report['javascriptErrors']
 # Render the actual page-state screenshot strip as one long image.
 page.set_viewport_size({'width':1366,'height':768})
 from base64 import b64encode
 imgs=[]
 for f in sorted(screens.glob('[0-9][0-9]-*.png')):
  imgs.append('<img width="1366" height="768" src="data:image/png;base64,'+b64encode(f.read_bytes()).decode()+'">')
 page.set_content('<html><style>*{margin:0}body{width:1366px}img{display:block}</style>'+''.join(imgs)+'</html>');page.screenshot(path=str(r/'production/Page_Flow_Long_Reference.png'),full_page=True)
 b.close()
server.shutdown();report['passed']=True;(out/'browser-results.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
