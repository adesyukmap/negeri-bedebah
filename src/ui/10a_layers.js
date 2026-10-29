/* ---------- board layer cache ----------
   The 40 tiles (base, labels, buildings, deco) were redrawn from scratch every frame. Now they are rendered into
   three depth bands (back, sides, front) and the bands are re-blitted. A band is rebuilt only when one of its
   tiles changes, the camera settles somewhere new, or every ~180 ms so subtle deco animation keeps moving.
   While the camera moves, the cached band is scaled/translated (linear iso transform), rebuilt if it drifts too far.
   Tiles with a live effect (press bounce, takeover, build, collapse, mangkrak, kampanye, segel, label pop) are
   skipped by the cache and drawn live in depth order as before. */
var BL={on:false,c:[null,null,null],prev:{TW:0,OX:0,OY:0},REFRESH:180};
function blEdges(){return [BN-1.5,BN+1.5];}
function tileBand(i){var d=RECT[i].cu+RECT[i].cv,e=blEdges();return d<e[0]?0:d<e[1]?1:2;}
function tileLive(i,now){if(FX.press[i]!=null&&now-FX.press[i]<760)return true;if(FX.take[i]||FX.build[i])return true;
  if(FX.mangkrak[i]&&now-FX.mangkrak[i]<2700)return true;if(S.festival===i)return true;if(typeof sealed==='function'&&sealed(i))return true;
  if(FX.lmPop&&FX.lmPop[i]&&now-FX.lmPop[i]<700)return true;for(var k=0;k<FX.collapse.length;k++)if(FX.collapse[k].i===i)return true;return false;}
function tileKey(i){var st=S.tiles[i],t=T[i];var k=st.owner+':'+st.level+':'+(st.v||1)+':'+tileName(i);
  if(typeof buyable==='function'&&buyable(i))k+=':'+(st.owner===null?(t.type==='city'?buyCost(i,0):assetPrice(i)):rentOf(i));
  if(t.type==='city'&&st.level===4&&typeof rentMult==='function')k+=':m'+rentMult(i);if(typeof balihoOn==='function'&&balihoOn(i))k+=':b';return k;}
function blBand(b,now,moving){
  var e=blEdges(),list=[],live=[],key=[S.theme,CW,CH_,dpr,typeof stStage==='function'?stStage():0,S.news?S.news.id+S.news.round:'',typeof escStep==='function'?escStep():0].join('|');
  for(var i=0;i<NT;i++){if(tileBand(i)!==b)continue;if(tileLive(i,now)){live.push(i);continue;}list.push(i);key+='|'+i+'='+tileKey(i);}
  key+='|L'+live.join(',');
  var c=BL.c[b];if(!c){c=BL.c[b]={cv:document.createElement('canvas'),key:null,TW0:0,OX0:0,OY0:0,t:0};c.ctx=c.cv.getContext('2d');}
  var r=TW/(c.TW0||TW),dx=OX-c.OX0*r,dy=OY-c.OY0*r,drift=Math.hypot(OX-c.OX0,OY-c.OY0);
  var camSame=Math.abs(TW-c.TW0)<0.01&&Math.abs(OX-c.OX0)<0.5&&Math.abs(OY-c.OY0)<0.5;
  var need=c.key!==key||c.cv.width!==Math.round(CW*dpr)||c.cv.height!==Math.round(CH_*dpr)||(!moving&&!camSame)||(moving&&(r<0.95||r>1.18||drift>CW*0.06))||(!moving&&now-c.t>BL.REFRESH);
  if(need){if(c.cv.width!==Math.round(CW*dpr)||c.cv.height!==Math.round(CH_*dpr)){c.cv.width=Math.round(CW*dpr);c.cv.height=Math.round(CH_*dpr);}
    var old=g;g=c.ctx;g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,CW,CH_);list.sort(function(a,z){return (RECT[a].cu+RECT[a].cv)-(RECT[z].cu+RECT[z].cv);});
    list.forEach(function(i){try{drawTile(i,now);}catch(err){console.error(err);}});g=old;c.key=key;c.TW0=TW;c.OX0=OX;c.OY0=OY;c.t=now;r=1;dx=0;dy=0;}
  g.drawImage(c.cv,0,0,c.cv.width,c.cv.height,dx,dy,CW*r,CH_*r);
  return live;}
try{BL.on=localStorage.getItem('nb-light')==='1';}catch(e){}
