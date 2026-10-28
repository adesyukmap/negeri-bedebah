"""Build index.html: shell + engine + UI + embedded audio (single self-contained file)."""
import base64, glob, os
ROOT=os.path.dirname(os.path.abspath(__file__))
P=lambda *a: os.path.join(ROOT,*a)
b64=lambda f: base64.b64encode(open(f,'rb').read()).decode()
shell=open(P('src/shell.html')).read()
eng=open(P('src/engine.js')).read()
ui=''.join(open(f).read() for f in sorted(glob.glob(P('src/ui/*.js')))).replace('/*@@CHARS@@*/',open(P('src/chars.js')).read())
tracks='var TRACKS={'+','.join("%s:'%s'"%(os.path.basename(f)[:-4],b64(f)) for f in sorted(glob.glob(P('assets/music/*.m4a'))))+'};'
samples='var SAMPLES={'+','.join("%s:'%s'"%(os.path.basename(f)[:-4],b64(f)) for f in sorted(glob.glob(P('assets/sfx/*.m4a'))))+'};'
out=shell+'<script id="engine">'+eng+'</script>\n<script>'+ui+'</script>\n<script>'+tracks+samples+'</script>\n'
os.makedirs(P('dist'),exist_ok=True)
open(P('dist/index.html'),'w').write(out)
if os.environ.get('LOCAL_COPY','1')=='1': open(P('index.html'),'w').write(out)

try: open('/tmp/claude-0/ui.js','w').write(ui)
except OSError: pass
print(len(out))
