import sys,glob,os,json
import numpy as np
from PIL import Image
out='/home/claude/kepulauan-cuan/assets/chars'; meta={}
for f in sorted(glob.glob('/tmp/claude-0/chars/raw/*.png')):
    k=os.path.basename(f)[:-4]
    a=np.asarray(Image.open(f).convert('RGB')).astype(np.float32)
    r,g,b=a[...,0],a[...,1],a[...,2]
    gr=g-np.maximum(r,b)
    al=np.clip(1-(gr-25)/70,0,1)
    # despill on semi/edge pixels
    m=np.maximum(r,b); g2=np.where(gr>0,np.minimum(g,m+ (g-m)*0.15),g)
    rgba=np.dstack([r,g2,b,al*255]).clip(0,255).astype(np.uint8)
    # drop tiny specks: rows/cols bbox with alpha>0.5
    mask=al>0.5
    ys,xs=np.where(mask); y0,y1,x0,x1=ys.min(),ys.max(),xs.min(),xs.max()
    im=Image.fromarray(rgba).crop((x0,y0,x1+1,y1+1))
    H=320; W=round(im.width*H/im.height); im=im.resize((W,H),Image.LANCZOS)
    am=np.asarray(im)[...,3]>128; band=am[int(H*0.9):]
    fx=float(np.where(band)[1].mean())/W if band.any() else 0.5
    im.save(f'{out}/{k}.webp','WEBP',quality=82,method=6)
    meta[k]={'ax':round(fx,3),'ar':round(W/H,3)}
    print(k,W,H,round(fx,3),os.path.getsize(f'{out}/{k}.webp'))
json.dump(meta,open(f'{out}/meta.json','w'))
