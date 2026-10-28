/* ---------- render loop, camera, effects ---------- */
var cv,ctx,dpr=1,CW=0,CH_=0,anim=null,floaters=[],landFx=[],coins=[],parts=[],BASEV={TW:80,OX:0,OY:0};
var cam={z:1,px:0,py:0,mode:'follow',focus:null,focusUntil:0};
var EXPR={},holdMove=0;
function layout(){
  var r=cv.getBoundingClientRect();dpr=Math.min(2,window.devicePixelRatio||1);CW=r.width;CH_=r.height;cv.width=Math.round(CW*dpr);cv.height=Math.round(CH_*dpr);
  var tw=Math.min(CW/(BN+0.45),CH_/(BN*0.5+1.45));BASEV={TW:tw,OX:CW/2,OY:(CH_-tw*(BN*0.5+1.45))/2+tw/2*2.35};
}
function applyCam(shx,shy){TW=BASEV.TW*cam.z;TH=TW/2;DZ=TH*0.32;ZS=TW*0.61;OX=CW/2+(BASEV.OX-CW/2)*cam.z+cam.px+(shx||0);OY=CH_/2+(BASEV.OY-CH_/2)*cam.z+cam.py+(shy||0);}
function camTarget(u,v,z,zoom){var sx=CW/2+(BASEV.OX+(u-v)*BASEV.TW/2-CW/2)*zoom,sy=CH_/2+(BASEV.OY+(u+v)*BASEV.TW/4-CH_/2)*zoom-(z||0)*zoom;return {z:zoom,px:CW/2-sx,py:CH_*0.56-sy};}
function focusTile(i,ms){cam.focus={u:ZN[i].bu,v:ZN[i].bv,zoom:2.1};cam.focusUntil=performance.now()+(ms||1800);}
function updateCam(now){
  if(cam.mode==='free'){return;}
  var tg;
  if(cam.mode==='all')tg={z:0.96,px:0,py:0};
  else if(cam.focus&&now<cam.focusUntil)tg=camTarget(cam.focus.u,cam.focus.v,0,cam.focus.zoom);
  else if(CONVOY){var cpz=convoyAt(CONVOY.prog*(CONVOY.pts.length-1));tg=camTarget(cpz.u,cpz.v,0,1.7);}
  else if(cup.phase!=='idle'||diceRoll)tg=camTarget(MID,MID,0,isPol()?1.25:1.45);
  else if(S){var tp=tokenPos(S.current,now);tg=camTarget(tp.u,tp.v,tp.z/cam.z,1.75);}
  else tg={z:1,px:0,py:0};
  var k=Math.min(0.12,0.04*SPEED);cam.z+=(tg.z-cam.z)*k;cam.px+=(tg.px-cam.px)*k;cam.py+=(tg.py-cam.py)*k;
}
function setCamMode(m){cam.mode=m;var b=$('camBtn');if(b)b.textContent=m==='all'?'Ikuti pemain':'Lihat semua';}
function tokenSpot(i,k,n){var zn=ZN[i],off=n>1?(k-(n-1)/2)*0.26:0,dep=n>2?(k%2?0.06:-0.06):0;
  if(zn.corner)return {u:zn.tu+off*0.7,v:zn.tv-off*0.7};
  return zn.axis==='u'?{u:zn.tu+off,v:zn.tv+dep}:{u:zn.tu+dep,v:zn.tv-off};}
function animInfo(now){if(!anim||now<anim.start)return null;var el=(now-anim.start)*(anim.spd||1),pts=anim.pts;
  if(anim.mode==='sewer'){var n=pts.length-1,ST=[['open',450],['sink',1000],['trav',Math.max(1100,n*170)],['appear',450],['open2',400],['rise',1000],['close',380]],acc=0;
    for(var q=0;q<ST.length;q++){var dd=ST[q][1];if(el<acc+dd){var f=(el-acc)/dd;return {stage:ST[q][0],f:f,seg:ST[q][0]==='trav'?Math.min(n-1,Math.floor(f*n)):(q<2?0:n)};}acc+=dd;}return {stage:'done'};}
  var seg=Math.floor(el/anim.dur);if(seg>=pts.length-1)return {stage:'done'};return {stage:'walk',f:(el%anim.dur)/anim.dur,seg:seg};}
function tokenPos(pid,now){
  var p=S.players[pid];
  if(anim&&anim.pid===pid){var ai=animInfo(now),pts=anim.pts;
    if(ai&&ai.stage!=='done'){var seg=Math.min(ai.seg,pts.length-1),a=tokenSpot(pts[seg],0,1),b=tokenSpot(pts[Math.min(seg+1,pts.length-1)],0,1),f=ai.f;
      if(anim.mode==='sewer'){var s0=pts[0],s1=pts[pts.length-1],A=tokenSpot(s0,0,1),E=tokenSpot(s1,0,1),dA=RECT[s0].cu+RECT[s0].cv+0.45,dE=RECT[s1].cu+RECT[s1].cv+0.45,ef=f*f*(3-2*f);
        if(ai.stage==='open')return {u:A.u,v:A.v,z:tileTop(s0,now),depth:dA};
        if(ai.stage==='sink')return {u:A.u,v:A.v,z:tileTop(s0,now)-TH*1.2*ef,depth:dA,clip:1-ef,hidden:ef>0.97};
        if(ai.stage==='trav'){var n2=pts.length-1,fi=f*n2,k2=Math.min(n2-1,Math.floor(fi)),fr=fi-k2,P0=tokenSpot(pts[k2],0,1),P1=tokenSpot(pts[k2+1],0,1);return {u:P0.u+(P1.u-P0.u)*fr,v:P0.v+(P1.v-P0.v)*fr,z:0,depth:0,hidden:true,mole:true};}
        if(ai.stage==='appear'||ai.stage==='open2')return {u:E.u,v:E.v,z:0,depth:0,hidden:true};
        if(ai.stage==='rise')return {u:E.u,v:E.v,z:tileTop(s1,now)-TH*1.2*(1-ef),depth:dE,clip:ef};
        return {u:E.u,v:E.v,z:tileTop(s1,now),depth:dE};}
      var hop=Math.sin(f*Math.PI)*TH*(anim.jump?2.8:anim.mode==='ship'?0.15:0.85),za=tileTop(pts[seg],now),zb=tileTop(pts[Math.min(seg+1,pts.length-1)],now);
      return {u:a.u+(b.u-a.u)*f,v:a.v+(b.v-a.v)*f,z:za+(zb-za)*f+hop,depth:Math.max(RECT[pts[seg]].cu+RECT[pts[seg]].cv,RECT[pts[Math.min(seg+1,pts.length-1)]].cu+RECT[pts[Math.min(seg+1,pts.length-1)]].cv)+0.45,ship:anim.mode==='ship'};}}
  var pos=(anim&&anim.pid===pid)?anim.pts[0]:p.pos,here=S.players.filter(function(q){return !q.bankrupt&&((anim&&anim.pid===q.id)?anim.pts[0]:q.pos)===pos;}),k=here.indexOf(p),sp=tokenSpot(pos,k,here.length);
  if(anim&&anim.pid===pid&&now<anim.start&&anim.mode==='ott')return {u:sp.u,v:sp.v,z:tileTop(pos,now),depth:RECT[pos].cu+RECT[pos].cv+0.45};
  return {u:sp.u,v:sp.v,z:tileTop(pos,now),depth:RECT[pos].cu+RECT[pos].cv+0.45};
}
function exprOf(p,now){if(p.inJail)return 'sad';var e=EXPR[p.id];if(e&&now<e.until)return e.e;return null;}
function drawToken(p,tp,now){
  var b=iso(tp.u,tp.v,tp.z),isCur=p.id===S.current,bob=isCur&&!anim?Math.abs(Math.sin(now/300))*TH*0.12:0,s=TW*0.52;
  var opt={expr:exprOf(p,now),vest:p.inJail&&isPol(),cough:FX.forest&&now-FX.forest.t0<5200};
  if(tp.ship){var bs=s*0.9;g.save();g.translate(b.x,b.y+TH*0.05);g.beginPath();g.moveTo(-bs*0.5,-bs*0.05);g.lineTo(bs*0.5,-bs*0.05);g.quadraticCurveTo(bs*0.35,bs*0.18,-bs*0.35,bs*0.15);g.closePath();g.fillStyle='#2C4F9E';g.fill();g.fillStyle='#fff';g.fillRect(-bs*0.4,-bs*0.04,bs*0.8,bs*0.04);g.restore();
    for(var w=0;w<3;w++)ell(b.x-TW*0.2-w*TW*0.08,b.y+TH*0.08,TW*0.04,TH*0.02,'rgba(255,255,255,.7)');}
  if(tp.clip!=null&&tp.clip<1){g.save();g.beginPath();g.rect(b.x-s,b.y-s*1.4-TH*2,s*2,s*1.4+TH*2+(tileTop(p.pos,now)-tp.z)+TH*0.2);var mh=iso(tp.u,tp.v,tileTop(anim?anim.pts[0]:p.pos,now));g.restore();}
  if(tp.clip!=null){var holeP=iso(tp.u,tp.v,tp.z+(tp.clip<1?TH*1.2*(1-tp.clip):0));}
  g.save();
  if(tp.clip!=null&&tp.clip<1){var surf=iso(tp.u,tp.v,tp.z+TH*1.2*(1-tp.clip));g.beginPath();g.rect(b.x-s,surf.y-s*3,s*2,s*3);g.clip();}
  if(FX.shakeTok&&FX.shakeTok[p.id]&&now<FX.shakeTok[p.id])b.x+=Math.sin(now/25)*TW*0.012;
  drawChar(p.char,b.x,b.y-bob,s,p.color,opt);g.restore();
  if(p.inJail&&isPol()){g.strokeStyle='#3A3C44';g.lineWidth=lw(0.012);for(var k=-2;k<=2;k++){g.beginPath();g.moveTo(b.x+k*s*0.13,b.y-s*0.98);g.lineTo(b.x+k*s*0.13,b.y+s*0.02);g.stroke();}g.beginPath();g.moveTo(b.x-s*0.32,b.y-s*0.95);g.lineTo(b.x+s*0.32,b.y-s*0.95);g.stroke();}
  if(p.inJail&&!isPol()){var wt=(now/900)%1;g.strokeStyle='rgba(255,255,255,'+(0.7*(1-wt))+')';g.lineWidth=lw(0.012);g.beginPath();g.ellipse(b.x,b.y,s*(0.4+wt*0.4),s*(0.13+wt*0.13),0,0,7);g.stroke();}
}
function shakeOffset(now){var sx=0,sy=0;if(FX.shake){var t=(now-FX.shake.t0)/(FX.shake.dur||450);if(t<1){var a=FX.shake.amt*(1-t);sx=(Math.random()-0.5)*2*a;sy=(Math.random()-0.5)*2*a;}else FX.shake=null;}return [sx,sy];}
function nightTarget(){if(!S)return 0;var ph=((S.round-1)+S.turnIdx/Math.max(1,S.order.length))/8,v=(1-Math.cos(ph*Math.PI*2))/2;return Math.max(0,Math.min(0.62,v*0.9-0.06));}
var lastBg=-1;
function render(now){
  requestAnimationFrame(render);
  if(!S||$('game').hidden)return;
  drainEvents(now);processPend(now);checkHold(now);updateConvoy(now);
  NIGHT+=(nightTarget()-NIGHT)*0.02;
  if(Math.abs(NIGHT-lastBg)>0.02){lastBg=NIGHT;var hi=mix('#4FB8E0','#1B2A55',NIGHT/0.82),lo=mix('#1C6A9A','#0B1430',NIGHT/0.82);document.body.style.background='radial-gradient(120% 90% at 50% 40%, '+hi+', '+lo+')';}
  updateCam(now);var sh=shakeOffset(now);applyCam(sh[0],sh[1]);
  g=ctx;GD=dpr; g.setTransform(dpr,0,0,dpr,0,0); g.clearRect(0,0,CW,CH_);
  if(NIGHT>0.25){g.save();g.globalAlpha=(NIGHT-0.25)*1.6;for(var st=0;st<40;st++){var sx=hash(st,1)*CW,sy=hash(st,2)*CH_*0.6,tw=0.5+0.5*Math.sin(now/400+st);ell(sx,sy,1.2*tw+0.4,1.2*tw+0.4,'#FFFFFF');}g.restore();}
  drawSkyClouds(now);
  g.save();g.shadowColor='rgba(5,30,60,.45)';g.shadowBlur=TW*0.5;g.shadowOffsetY=TH*0.45;
  path([iso(-0.15,-0.15,0),iso(BN+0.15,-0.15,0),iso(BN+0.15,BN+0.15,0),iso(-0.15,BN+0.15,0)]);g.fillStyle='#C9A66B';g.fill();g.restore();
  box(MID,MID,BN+0.3,BN+0.3,DZ*0.8,-DZ*0.8,isPol()?'#D9CBB0':'#E8CC92',isPol()?'#A8977A':'#C9A66B');
  lagoonWater(now);
  var fsT=TW*0.22,ty=OY+TH*3.0;g.font='800 '+fsT+'px "Baloo 2", sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';
  var title=isPol()?'NEGERI CUAN':'KEPULAUAN CUAN';g.lineWidth=fsT*0.16;g.strokeStyle=isPol()?'#5A1410':'#7A4300';g.strokeText(title,OX,ty);g.fillStyle=isPol()?'#FFD9A0':'#FFE27A';g.fillText(title,OX,ty);
  g.font='900 '+(TW*0.12)+'px Nunito, sans-serif';g.fillStyle='rgba(15,60,95,.85)';g.fillText(S.turnLimit?('Ronde '+S.round+' dari '+S.turnLimit):('Ronde '+S.round),OX,OY+TH*3.42);
  if(S.kas>0||isPol()){var kp=Math.min(1,(S.kas||0)/KAS_LIMIT),kx=OX,ky=OY+TH*3.62,kw=TW*1.0;rrect(kx-kw/2,ky,kw,TH*0.12,TH*0.06);g.fillStyle='rgba(15,40,60,.35)';g.fill();rrect(kx-kw/2,ky,kw*kp,TH*0.12,TH*0.06);g.fillStyle=isPol()?'#E2483D':'#2E9E5B';g.fill();
    g.font='900 '+(TW*0.075)+'px Nunito, sans-serif';g.fillStyle='rgba(15,40,60,.85)';g.fillText(TH_().kasName+' '+short(S.kas||0)+' / '+short(KAS_LIMIT),OX,ky+TH*0.3);}
  var items=[];for(var i=0;i<NT;i++)items.push({d:RECT[i].cu+RECT[i].cv,i:i});
  lagoonLife(now).forEach(function(it){items.push(it);});
  actorItems(now,items);convoyItems(now,items);
  if(anim&&anim.mode==='sewer'){var ai0=animInfo(now);if(ai0&&ai0.stage!=='done'){var st0=ai0.stage,f0=ai0.f,e0=f0*f0*(3-2*f0),sA=anim.pts[0],sE=anim.pts[anim.pts.length-1];
    var srcOpen=st0==='open'?e0:st0==='sink'?1:st0==='trav'?Math.max(0,1-f0/0.25):0,srcVis=(st0==='appear'||st0==='open2'||st0==='rise'||st0==='close')?(st0==='appear'?1-f0:0):1;
    var dVis=st0==='appear'?easeBack(f0):(st0==='open2'||st0==='rise')?1:st0==='close'?(f0>0.6?1-(f0-0.6)/0.4:1):0,dOpen=st0==='open2'?e0:st0==='rise'?1:st0==='close'?Math.max(0,1-f0/0.6):0;
    items.push({d:RECT[sA].cu+RECT[sA].cv+0.44,f:function(){drawManhole(sA,srcOpen,srcVis,now);}});items.push({d:RECT[sE].cu+RECT[sE].cv+0.44,f:function(){drawManhole(sE,dOpen,dVis,now);}});}}
  items.push({d:2*MID+1.3,f:function(){drawDice(now);}});
  S.players.forEach(function(p){if(p.bankrupt||(CONVOY&&CONVOY.pid===p.id))return;var tp=tokenPos(p.id,now);if(tp.hidden){if(tp.mole)items.push({d:tp.u+tp.v,f:function(){var m=iso(tp.u,tp.v,DZ);dust(m.x,m.y,TW*0.12,0.4,'140,110,80');ell(m.x,m.y,TW*0.12,TH*0.07,'#4A4A50');}});return;}items.push({d:tp.depth,p:p,tp:tp});});
  items.sort(function(a,b){return a.d-b.d;});
  var curP=S.players[S.current],pick=S.phase==='turn'&&curP.pelni;
  items.forEach(function(it){
    if(it.f)return it.f();
    if(it.i!==undefined){drawTile(it.i,now);var r=RECT[it.i],h=tileTop(it.i,now);
      if(pick&&it.i!==curP.pos){g.save();g.globalAlpha=0.22+0.18*Math.sin(now/180);flatRect(r.u0+0.04,r.v0+0.04,r.u1-0.04,r.v1-0.04,h+1,'#ffffff');g.restore();}
      if(!anim&&it.i===curP.pos&&(S.phase==='turn'||S.phase==='end'||S.phase==='prompt')){g.save();g.globalAlpha=0.55+0.3*Math.sin(now/220);g.strokeStyle='#FFE27A';g.lineWidth=lw(0.045);path([iso(r.u0+0.05,r.v0+0.05,h+1),iso(r.u1-0.05,r.v0+0.05,h+1),iso(r.u1-0.05,r.v1-0.05,h+1),iso(r.u0+0.05,r.v1-0.05,h+1)]);g.stroke();g.restore();}
    } else drawToken(it.p,it.tp,now);
  });
  drawParts(now);
  drawCloudShadows(now);
  if(isPol()&&(S.kasStage||0)>=2){g.save();g.globalAlpha=0.06*(S.kasStage||0);g.fillStyle='#8A8070';g.fillRect(0,0,CW,CH_);g.restore();}
  if(FX.quake){var qt=(now-FX.quake.t0)/1600;if(qt<1)drawCracks(FX.quake,qt);else FX.quake=null;}
  if(NIGHT>0.05){g.save();g.globalCompositeOperation='multiply';g.fillStyle=mix('#FFFFFF','#45569A',NIGHT);g.fillRect(0,0,CW,CH_);g.restore();
    g.save();g.globalCompositeOperation='lighter';for(var j=0;j<NT;j++){var st2=S.tiles[j];if(st2.owner===null||T[j].type!=='city'||st2.level<1)continue;var zq=iso(ZN[j].bu,ZN[j].bv,tileTop(j,now)+TH*0.4),gl=g.createRadialGradient(zq.x,zq.y,1,zq.x,zq.y,TW*0.45);gl.addColorStop(0,'rgba(255,190,90,'+(0.32*NIGHT)+')');gl.addColorStop(1,'rgba(255,190,90,0)');g.fillStyle=gl;g.beginPath();g.arc(zq.x,zq.y,TW*0.45,0,7);g.fill();}
    if(S.festival!=null){var fz=iso(ZN[S.festival].bu,ZN[S.festival].bv,DZ+TH*0.8),fg2=g.createRadialGradient(fz.x,fz.y,1,fz.x,fz.y,TW*0.8);fg2.addColorStop(0,'rgba(255,120,180,'+(0.4*NIGHT)+')');fg2.addColorStop(1,'rgba(255,120,180,0)');g.fillStyle=fg2;g.beginPath();g.arc(fz.x,fz.y,TW*0.8,0,7);g.fill();}
    g.restore();}
  landFx=landFx.filter(function(f){var t=(now-f.t0)/1300;if(t>1)return false;var zn=ZN[f.tile],p=iso(zn.bu,zn.bv,DZ+TH*1.4);for(var k=0;k<18;k++){var a=k/18*Math.PI*2,r=TW*(0.2+t*0.95);ell(p.x+Math.cos(a)*r,p.y+Math.sin(a)*r*0.6-t*TH,TW*0.045*(1-t),TW*0.045*(1-t),['#FFD23F','#FF5C7A','#4CC0F0','#7BD389'][k%4]);}return true;});
  drawTakeoverOverlay(now);
  drawMafia(now);
  drawCoins(now);
  drawBirds(now);
  floaters=floaters.filter(function(f){var t=(now-f.t0)/1500;if(t<0)return true;if(t>1)return false;var p=iso(f.u,f.v,f.z);g.save();g.globalAlpha=1-t*t;g.font='900 '+(TW*0.2)+'px Nunito, sans-serif';g.textAlign='center';g.lineWidth=TW*0.05;g.strokeStyle='#fff';g.strokeText(f.text,p.x,p.y-t*TH*1.4);g.fillStyle=f.color;g.fillText(f.text,p.x,p.y-t*TH*1.4);g.restore();return true;});
  drawActorBubbles(now);drawQuips(now);
  if(S.phase==='moving'&&S.anim&&!anim&&!cineBusy()){var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,pts=[S.anim.from].concat(S.anim.path),wait=Math.max(diceRoll?diceRoll.t0+DICE_DUR+300-now:0,holdMove-now,0),mode=S.anim.mode||'walk';
    anim={pid:S.anim.pid,pts:pts,jump:!!S.anim.jump,mode:mode,dur:S.anim.jump?620:mode==='ship'?170:(reduce?90:(pts.length>9?360:520)),start:now+wait,spd:SPEED,hopSeg:-1,dbl:S.anim.dbl||0};}
  if(anim){var ai=animInfo(now);if(ai){
    if(anim.mode==='sewer'&&ai.stage!==anim.lastStage){anim.lastStage=ai.stage;if(ai.stage==='open'||ai.stage==='open2')play('pop');if(ai.stage==='sink')play('splash');}
    if(ai.stage==='walk'||ai.stage==='trav'){var sg=ai.seg;if(anim.hopSeg!==sg){anim.hopSeg=sg;if(sg>0){var tl=anim.pts[sg];if(anim.mode!=='sewer'){FX.press[tl]=now;play('hop');}else if(ai.stage==='trav')play('scuttle');}}
      if(anim.dbl>=1&&ai.stage==='walk'){var tp2=tokenPos(anim.pid,now);parts.push({u:tp2.u,v:tp2.v,z:tp2.z+TH*0.1,t0:now,life:500,kind:'flame'});}}
    if(ai.stage==='done'){var last=anim.pts[anim.pts.length-1],md=anim.mode;anim=null;FX.press[last]=now;if(md==='sewer'||md==='jump'||md==='karam'||md==='ott')play('pop');land();refresh();}}}
}
function drainEvents(now){
  while(EVENTS.length){var e=EVENTS.shift();
    if(e.t==='toast')showToast(e.text,e.kind);
    else if(e.t==='sfx')play(e.n);
    else if(e.t==='dice')startDiceRoll(now);
    else if(e.t==='landmark'){landFx.push({tile:e.tile,t0:now+600});focusTile(e.tile,2000);}
    else if(e.t==='build'){FX.build[e.tile]={t0:now,level:e.level};focusTile(e.tile,1300);var bz=ZN[e.tile];coinBurst(tokenPos(S.current,now),{u:bz.bu,v:bz.bv,z:DZ+TH*0.5},5,now);}
    else if(e.t==='takeover'){(function(e){var tk={t0:Infinity,fromColor:S.players[e.from].color,toColor:S.players[e.to].color};FX.take[e.tile]=tk;afterOverlay(function(n2){tk.t0=n2;focusTile(e.tile,2600);setTimeout(function(){play(isPol()?'bulldoze':'stamp');},500);setTimeout(function(){FX.shake={t0:performance.now(),amt:TW*0.05,dur:500};play('takeover');},1150);});})(e);}
    else if(e.t==='festival'){if(isPol()&&e.pid!=null)queueCine('kampanye',{pid:e.pid,tile:e.tile,onEnd:startConvoy});else{landFx.push({tile:e.tile,t0:now});focusTile(e.tile,1800);}}
    else if(e.t==='money'&&S){var tp=tokenPos(e.pid,now);floaters.push({u:tp.u,v:tp.v,z:tp.z+TW*0.6,text:(e.d>0?'+':'-')+short(Math.abs(e.d)),color:e.d>0?'#1E8A4C':'#D03A2F',t0:now+floaters.length*90});
      if(Math.abs(e.d)>=100000)EXPR[e.pid]={e:e.d>0?'happy':'shock',until:now+1800};}
    else if(e.t==='transfer'){coinBurst(tokenPos(e.from,now),tokenPos(e.to,now),Math.min(12,3+Math.round(e.amt/80000)),now);}
    else if(e.t==='toKas'){coinBurst(tokenPos(e.from,now),{u:MID,v:MID,z:ZS*0.6},Math.min(10,3+Math.round(e.amt/80000)),now);}
    else if(e.t==='gain'){var tg=tokenPos(e.pid,now);coinRain(tg,6,now);}
    else if(e.t==='salary'){holdMove=Math.max(holdMove,0);(function(pid){setTimeout(function(){if(S&&S.players[pid])coinRain(tokenPos(pid,performance.now()),10,performance.now());},400);})(e.pid);}
    else if(e.t==='collapse'){play('collapse');e.tiles.forEach(function(c){FX.collapse.push({i:c.i,level:c.level,color:c.color,t0:now});});}
    else if(e.t==='quake'){FX.quake={t0:now,tile:e.tile,seed:Math.random()*99};FX.shake={t0:now,amt:TW*0.07,dur:1400};if(e.tile!=null){focusTile(e.tile,1900);FX.collapse.push({i:e.tile,level:e.level,color:e.color,t0:now+300});}}
    else if(e.t==='mangkrak'){play('collapse');if(e.tile!=null){FX.mangkrak[e.tile]=now;focusTile(e.tile,2000);FX.collapse.push({i:e.tile,level:e.level,color:e.color,t0:now+200});}}
    else if(e.t==='ott'){queueCine('ott',{pid:e.pid,caseText:e.caseText});}
    else if(e.t==='karam'){holdMove=now+500;}
    else if(e.t==='forest'){FX.forest={t0:now,from:e.stage-1,to:e.stage};cam.focus={u:MID,v:MID,zoom:1.6};cam.focusUntil=now+3600;play('cough');setTimeout(function(){play('cough');},1500);}
    else if(e.t==='beachParty'){FX.beach=now;cam.focus={u:MID,v:MID,zoom:1.6};cam.focusUntil=now+3000;}
    else if(e.t==='news'){queueCine('news',{id:e.id,name:e.name,text:e.text,tile:e.tile,onEnd:function(d){if(d.tile!=null)focusTile(d.tile,2200);}});}
    else if(e.t==='fajar'){queueCine('fajar',e);}
    else if(e.t==='pungli'){addActor('preman',S.players[e.pid].pos,isPol()?'Uang keamanan, Bos!':'Bayar dulu, Bos!',e.amt);play('pay');}
    else if(e.t==='parkir'){addActor('tukang',S.players[e.pid].pos,'2rebu ga bikin lo miskin, boss!',e.amt);}
    else if(e.t==='appeal'){play('appeal');addQuip(e.pid,e.ok?(isPol()?'Hakimnya bijak sekali!':'Akhirnya bebas!'):(isPol()?'Kok ditolak?! Saya banding lagi!':'Yah, gagal...'),2600);}
    else if(e.t==='quip'){if(!isPol()||e.key==='lawan'){}else if(e.key==='sorry'){(function(e){afterOverlay(function(){addQuip(e.pid,QUIP_TEXT.sorry,2600,'sorry');},1300);})(e);}else if(QUIP_TEXT[e.key])addQuip(e.pid,QUIP_TEXT[e.key],null,e.key);}
    else if(e.t==='swap'){[e.a,e.b].forEach(function(id){var tp3=tokenPos(id,now);for(var k=0;k<6;k++)parts.push({u:tp3.u,v:tp3.v,z:tp3.z+TH*0.4,t0:now,life:700,kind:'poof',a:k});});}
    else if(e.t==='baliho'){focusTile(e.tile,1600);}
    else if(e.t==='landed'){var t2=T[e.tile],tp4=tokenPos(e.pid,now);if((t2.deco==='raja'||t2.deco==='toba')){for(var k2=0;k2<10;k2++)parts.push({u:tp4.u,v:tp4.v,z:tp4.z,t0:now,life:800,kind:'splash',a:k2});play('splash');}else for(var k3=0;k3<5;k3++)parts.push({u:tp4.u,v:tp4.v,z:tp4.z,t0:now,life:600,kind:'dust',a:k3});}
  }
}
function coinBurst(from,to,n,now){for(var k=0;k<n;k++)coins.push({a:{u:from.u,v:from.v,z:from.z+TH*0.6},b:{u:to.u,v:to.v,z:to.z+TH*0.6},t0:now+k*70,dur:850,arc:TH*(1.4+Math.random()*0.8),rain:false});play('coins');}
function coinRain(at,n,now){for(var k=0;k<n;k++)coins.push({a:{u:at.u+(Math.random()-0.5)*0.4,v:at.v+(Math.random()-0.5)*0.4,z:at.z+TH*3},b:{u:at.u,v:at.v,z:at.z+TH*0.3},t0:now+k*60,dur:600,arc:0,rain:true});}
function drawCoins(now){coins=coins.filter(function(c){var t=(now-c.t0)/c.dur;if(t<0)return true;if(t>1)return false;var e=c.rain?t*t:t,u=c.a.u+(c.b.u-c.a.u)*e,v=c.a.v+(c.b.v-c.a.v)*e,z=c.a.z+(c.b.z-c.a.z)*e+Math.sin(Math.PI*t)*c.arc,p=iso(u,v,z),r=TW*0.05,sp=Math.abs(Math.cos(now/90+c.t0));
  g.save();g.translate(p.x,p.y);g.scale(Math.max(0.15,sp),1);g.beginPath();g.arc(0,0,r,0,7);g.fillStyle='#B07A00';g.fill();g.beginPath();g.arc(0,-r*0.08,r*0.92,0,7);g.fillStyle=radialFill(-r*0.3,-r*0.4,r,'#FFF1A0','#E0A100');g.fill();g.fillStyle='#9A6A00';g.font='900 '+(r*1.1)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('$',0,0);g.restore();return true;});}
function drawParts(now){parts=parts.filter(function(p){var t=(now-p.t0)/p.life;if(t<0)return true;if(t>1)return false;var q=iso(p.u,p.v,p.z);
  if(p.kind==='flame'){var s=TW*0.08*(1-t);g.beginPath();g.moveTo(q.x-s,q.y);g.quadraticCurveTo(q.x,q.y-s*3,q.x+s,q.y);g.closePath();var fg=g.createLinearGradient(0,q.y-s*3,0,q.y);fg.addColorStop(0,'rgba(255,230,120,'+(1-t)+')');fg.addColorStop(1,'rgba(240,80,20,'+(1-t)+')');g.fillStyle=fg;g.fill();}
  else if(p.kind==='poof'){var a=p.a/6*Math.PI*2;ell(q.x+Math.cos(a)*TW*0.3*t,q.y+Math.sin(a)*TH*0.3*t-TH*0.3*t,TW*0.08*(1-t*0.5),TW*0.08*(1-t*0.5),'rgba(255,255,255,'+(0.85*(1-t))+')');}
  else if(p.kind==='splash'){var a2=p.a/10*Math.PI*2;ell(q.x+Math.cos(a2)*TW*0.3*t,q.y-Math.sin(Math.PI*t)*TH*1.2*(0.6+0.4*Math.abs(Math.sin(a2*3)))+Math.sin(a2)*TH*0.2*t,TW*0.025,TW*0.03,'rgba(120,200,255,'+(1-t)+')');}
  else if(p.kind==='dust'){var a3=p.a/5*Math.PI*2;ell(q.x+Math.cos(a3)*TW*0.2*t,q.y+Math.sin(a3)*TH*0.15*t,TW*0.05*(1-t*0.4),TW*0.04*(1-t*0.4),'rgba(220,200,170,'+(0.7*(1-t))+')');}
  return true;});}
function drawCracks(q,t){var c=q.tile!=null?iso(ZN[q.tile].bu,ZN[q.tile].bv,DZ):iso(MID,MID,0);g.save();g.globalAlpha=t<0.7?1:(1-t)/0.3;g.strokeStyle='rgba(50,30,15,.85)';g.lineWidth=lw(0.02);g.lineJoin='miter';
  for(var k=0;k<6;k++){var a=k/6*Math.PI*2+q.seed,len=TW*(0.4+hash(k,q.seed)*0.9)*Math.min(1,t*3),x=c.x,y=c.y;g.beginPath();g.moveTo(x,y);for(var s=1;s<=5;s++){var f=s/5;x=c.x+Math.cos(a)*len*f+(hash(k,s)-0.5)*TW*0.12;y=c.y+Math.sin(a)*len*f*0.5+(hash(s,k)-0.5)*TH*0.12;g.lineTo(x,y);}g.stroke();}
  g.restore();}
function drawTakeoverOverlay(now){for(var key in FX.take){var tk=FX.take[key],t=(now-tk.t0)/2400;if(t<0)continue;if(t>1){delete FX.take[key];continue;}var i=+key,zn=ZN[i],h=DZ,b=iso(zn.bu,zn.bv,h);
  if(isPol()){if(t>0.15&&t<0.75){var bt=Math.min(1,(t-0.15)/0.38),side=zn.axis==='u'?[0,1]:[1,0],du=(1-bt)*1.6*side[0]+0.35*side[0],dv=(1-bt)*1.6*side[1]+0.35*side[1];if(t>0.53){du=0.35*side[0]+Math.sin((t-0.53)*30)*0.04;dv=0.35*side[1];}drawBulldozer(zn.bu+du,zn.bv+dv,h,now);}}
  else if(t>0.25&&t<0.62){var st=(t-0.25)/0.37,sz=TW*0.5*(st<0.6?1.6-st:1),sy=b.y-TH*2.2*(1-Math.min(1,st/0.6));g.save();g.translate(b.x,sy);g.rotate(-0.2);rrect(-sz*0.35,-sz*0.5,sz*0.7,sz*0.32,sz*0.08);g.fillStyle='#8A5A33';g.fill();rrect(-sz*0.12,-sz*0.18,sz*0.24,sz*0.3,sz*0.05);g.fill();rrect(-sz*0.42,sz*0.1,sz*0.84,sz*0.16,sz*0.05);g.fillStyle=tk.toColor;g.fill();g.restore();}
  if(t>0.48&&t<0.85){var dt=(t-0.48)/0.37;dust(b.x,b.y,TW*0.55,dt,isPol()?'180,160,130':'255,255,255');if(!isPol()){for(var k=0;k<12;k++){var a=k/12*Math.PI*2;ell(b.x+Math.cos(a)*TW*0.6*dt,b.y+Math.sin(a)*TH*0.5*dt,TW*0.07*(1-dt),TW*0.05*(1-dt),tk.toColor);}}}
  if(t>0.48&&t<0.95){var pt=(t-0.48)/0.47,sc=pt<0.2?pt/0.2*1.3:1.3-0.3*Math.min(1,(pt-0.2)/0.2);g.save();g.globalAlpha=pt>0.75?(1-pt)/0.25:1;g.translate(b.x,b.y-TH*1.8);g.rotate(-0.08);g.font='800 '+(TW*0.32*sc)+'px "Baloo 2", sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=TW*0.05;g.strokeStyle='#fff';g.strokeText(isPol()?'GUSUR!':'BRAK!',0,0);g.fillStyle='#E2483D';g.fillText(isPol()?'GUSUR!':'BRAK!',0,0);g.restore();}}}
function drawBulldozer(u,v,z,now){var vib=Math.sin(now/30)*0.6;aoShadow(u,v,0.5,0.36,z);box(u,v,0.46,0.3,TH*0.14,z+vib,'#4A4A50','#2A2A30');box(u,v,0.38,0.26,TH*0.22,z+TH*0.14+vib,'#F2B705','#C98F00');box(u+0.06,v-0.02,0.18,0.18,TH*0.22,z+TH*0.36+vib,'#F2B705','#C98F00');
  var w=iso(u+0.06,v-0.02,z+TH*0.47+vib);g.fillStyle='rgba(120,190,230,.8)';path(faceQuad(u+0.06,v-0.02,'L',0.18,0.18,0.15,0.85,z+TH*0.4+vib,z+TH*0.55+vib));g.fill();
  box(u-0.32,v,0.08,0.4,TH*0.26,z,'#8C8C96','#6A6A75');var ex=iso(u+0.1,v,z+TH*0.6+vib);smoke(ex.x,ex.y,TW*0.06,7);}
function showToast(text,kind){var bx=$('toasts'),el=document.createElement('div');el.className='toast '+(kind||'');el.textContent=text;bx.appendChild(el);while(bx.children.length>3)bx.removeChild(bx.firstChild);setTimeout(function(){el.style.transition='opacity .4s';el.style.opacity='0';setTimeout(function(){el.remove();},420);},(kind||'').indexOf('big')>=0?3600:2600);}
function showOTT(pid){var p=S.players[pid],o=$('ott');o.hidden=false;o.classList.remove('run');void o.offsetWidth;o.classList.add('run');$('ottName').textContent='OTT! '+p.name+' terjaring operasi tangkap tangan';
  requestAnimationFrame(function(){portrait($('ottFace'),p.char,p.color,{vest:true,expr:'shock'});});play('siren');setTimeout(function(){play('camera');},700);setTimeout(function(){play('camera');},1000);setTimeout(function(){o.hidden=true;o.classList.remove('run');},3200);}
var newsTimer=null;
function showNews(e){var n=$('news');$('newsEyebrow').textContent=TH_().newsName;$('newsTitle').textContent=e.name;$('newsText').textContent=e.text;n.hidden=false;n.classList.remove('run');void n.offsetWidth;n.classList.add('run');play('news');clearTimeout(newsTimer);newsTimer=setTimeout(function(){n.hidden=true;},4200);}
