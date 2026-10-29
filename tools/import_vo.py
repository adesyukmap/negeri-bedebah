#!/usr/bin/env python3
"""Import Hermes voice-over takes into the game.

For every key listed in VO-STATUS.md that has takes in <hermes>/vo/<key>_v1..v3.wav:
  1. transcribe each take with faster-whisper (Indonesian, word timestamps),
  2. keep the take whose transcript best matches the expected line (from the brief table),
  3. cut right after the last expected word (drops stray tails), fade out, peak -1 dB,
  4. write assets/sfx/vo_<key>.m4a (quip_<k> -> v_quip_<k>.m4a),
  5. mark the key 'ada'/'game' in VO-STATUS.md.
Existing files in assets/sfx are never overwritten unless --force. Player clips from Sound Studio
live in the browser, not here, so they are never touched.

Usage: python3 tools/import_vo.py /path/to/hermes-office/audio/kepulauan-cuan [--force] [--only key1,key2]
"""
import sys, os, re, subprocess, difflib, tempfile
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SFX = os.path.join(ROOT, 'assets', 'sfx')


def norm(s):
    s = s.lower().replace('bos', 'bos')
    return re.sub(r'[^a-z0-9 ]+', ' ', s).split()


def brief_lines(brief):
    out = {}
    for m in re.finditer(r'^\| `vo/([A-Za-z0-9_]+)` \| "(.*?)" \|', open(brief, encoding='utf-8').read(), re.M):
        out[m.group(1)] = m.group(2)
    return out


def load(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def main():
    if len(sys.argv) < 2:
        print(__doc__); sys.exit(1)
    src = sys.argv[1]; force = '--force' in sys.argv
    only = None
    if '--only' in sys.argv:
        only = set(sys.argv[sys.argv.index('--only') + 1].split(','))
    lines = brief_lines(os.path.join(src, 'BRIEF-stable-audio.md'))
    from faster_whisper import WhisperModel
    model = WhisperModel('small', device='cpu', compute_type='int8')
    done = []
    for key, text in lines.items():
        if only and key not in only:
            continue
        out = os.path.join(SFX, ('v_' + key if key.startswith('quip_') else 'vo_' + key) + '.m4a')
        if os.path.exists(out) and not force:
            continue
        takes = [os.path.join(src, 'vo', '%s_v%d.wav' % (key, i)) for i in (1, 2, 3)]
        takes = [t for t in takes if os.path.exists(t)]
        if not takes:
            continue
        want = norm(text); best = None
        for t in takes:
            segs, _ = model.transcribe(load(t), language='id', word_timestamps=True, beam_size=5)
            words = [w for s in segs for w in (s.words or [])]
            got = norm(' '.join(w.word for w in words))
            score = difflib.SequenceMatcher(None, want, got).ratio()
            end = None
            if words:
                # end of the last word that belongs to the expected line
                for w in reversed(words):
                    if norm(w.word) and norm(w.word)[-1] in want:
                        end = w.end; break
                end = end or words[-1].end
            if best is None or score > best[0]:
                best = (score, t, end)
        score, take, end = best
        if score < 0.6:
            print('SKIP %s: transcript match %.2f too low' % (key, score)); continue
        flt = 'afade=t=out:st=%.3f:d=0.05,' % max(0, (end or 0) + 0.05) if end else ''
        cut = ['-t', '%.3f' % ((end or 0) + 0.12)] if end else []
        with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', take] + cut + ['-af', flt + 'silenceremove=start_periods=1:start_threshold=-45dB,loudnorm=I=-16:TP=-1', '-ar', '48000', '-ac', '1', tmp.name], check=True)
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp.name, '-c:a', 'aac', '-b:a', '64k', out], check=True)
        done.append(key); print('OK %s (%.2f) <- %s' % (key, score, os.path.basename(take)))
    st = os.path.join(src, 'VO-STATUS.md')
    if done and os.path.exists(st):
        s = open(st, encoding='utf-8').read()
        for k in done:
            s = re.sub(r'^\| %s \| [^|]* \| [^|]* \|' % re.escape(k), '| %s | ada | game |' % k, s, flags=re.M)
        open(st, 'w', encoding='utf-8').write(s)
    print('imported', len(done))


if __name__ == '__main__':
    main()
