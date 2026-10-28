/* ---------- board FX driven by events: build construction, PLN zap, story extras ---------- */
var ZAP=null,BUILD_DUR=2500;
function fxEvent(e,now){if(!e||!S)return;
  if(e.t==='build'&&e.tile!=null&&T[e.tile]){var bf=FX.build[e.tile];if(!bf||bf.t0!==now){bf=FX.build[e.tile]={t0:now,level:e.level};}bf.dur=BUILD_DUR;bf.f={};
    play('construct');var zn=ZN[e.tile];cam.focus={u:zn.bu,v:zn.bv,zoom:2.1};cam.focusUntil=Math.max(cam.focusUntil||0,now+BUILD_DUR+300);
    if(T[e.tile].deco==='pln')startZap(S.current,now,e.tile);}}
function fxDraw(now){if(!S)return;
  for(var k in FX.build){var bf=FX.build[k];if(!bf||!bf.dur)continue;var t=(now-bf.t0)/bf.dur;if(t>=0&&t<0.6&&S.tiles[k]&&S.tiles[k].owner!==null)buildWorkers(+k,ZN[k],tileTop(+k,now),bf,t,now);if(t>=0.68&&t<1&&S.tiles[k]&&S.tiles[k].owner!==null)ribbonCut(+k,ZN[k],tileTop(+k,now),(t-0.68)/0.32,bf,now,S.players[S.tiles[k].owner].color);}
  if(ZAP)drawZap(now);
  if(typeof storyFx==='function')storyFx(now);}
/* ---------- construction: scaffolding, crane, 2 workers, dust, pop, ribbon cut + confetti ---------- */
function buildPhase(bf,now){var D=bf.dur||900,t=(now-bf.t0)/D;if(t<0||t>=1)return null;
  if(!bf.dur){if(t<0.35)return {t:t,old:true,hide:bf.level>0,sx:1,sy:1};var p=(t-0.35)/0.65;return {t:t,old:true,hide:false,sx:1+0.06*Math.sin(p*Math.PI),sy:p<0.55?0.3+p/0.55*0.82:1.12-0.12*(p-0.55)/0.45};}
  var r={t:t,hide:t<0.6,sx:1,sy:1};
  if(t>=0.6&&t<0.76){var p2=(t-0.6)/0.16;r.sy=p2<0.5?0.15+p2/0.5*1.05:1.2-0.2*(p2-0.5)/0.5;r.sx=1+0.12*Math.sin(Math.min(1,p2*1.4)*Math.PI)*(p2<0.5?-0.6:1);}
  return r;}
function buildUnder(i,zn,h,bf,bs,now){if(bs.old){if(bs.t<0.35){scaffold(zn.bu,zn.bv,h,TH*0.9,bs.t/0.35);var b0=iso(zn.bu,zn.bv,h);dust(b0.x,b0.y,TW*0.25,bs.t/0.35);}return;}
  var t=bs.t,lv=bf.level,H=TH*(lv>=4?2.1:lv===3?1.8:lv===0?1.0:1.15+lv*0.18),b=iso(zn.bu,zn.bv,h);bf.f=bf.f||{};
  if(t<0.12){var pt=t/0.12;g.save();g.globalAlpha=0.6*(1-pt*0.3);g.setLineDash([lw(0.03),lw(0.02)]);g.strokeStyle='#F2C230';g.lineWidth=lw(0.014);path([iso(zn.bu-0.36,zn.bv-0.34,h+0.5),iso(zn.bu+0.36,zn.bv-0.34,h+0.5),iso(zn.bu+0.36,zn.bv+0.34,h+0.5),iso(zn.bu-0.36,zn.bv+0.34,h+0.5)]);g.stroke();g.restore();dust(b.x,b.y,TW*0.3,pt,'215,195,160');}
  // crane at the back corner
  var ca=t<0.6?1:t<0.7?1-(t-0.6)/0.1:0;if(ca>0){g.save();g.globalAlpha=ca;buildCrane(zn.bu-0.36,zn.bv-0.36,h,H,t,now);g.restore();}
  // scaffold rises then falls away when the building pops
  var rise=Math.min(1,Math.max(0,(t-0.04)/0.4)),sa=t<0.6?1:Math.max(0,1-(t-0.6)/0.08);if(sa>0&&rise>0){g.save();g.globalAlpha=sa;scaffoldB(zn.bu,zn.bv,h,H,rise,t<0.6?0:(t-0.6)/0.08);g.restore();}
  if(t>0.06&&t<0.6){for(var k=0;k<3;k++){var dp=((t-0.06)*9+k/3)%1;dust(b.x+(hash(k,i)-0.5)*TW*0.5,b.y+TH*0.1,TW*0.13,dp,'210,190,155');}}
  if(t>=0.6&&!bf.f.pop){bf.f.pop=1;play('pop');FX.shake={t0:now,amt:TW*0.012,dur:220};}
  if(t>0.6&&t<0.8)dust(b.x,b.y,TW*0.55,(t-0.6)/0.2,'225,205,170');}
/* along-the-row offsets so workers and ribbon posts stand beside (not behind) a token parked on the tile */
function rowPt(zn,along,depth){return zn.axis==='u'?[zn.bu+along,zn.bv+depth]:[zn.bu+depth,zn.bv-along];}
function buildWorkers(i,zn,h,bf,t,now){{var lv=bf.level,H=TH*(lv>=4?2.1:lv===3?1.8:lv===0?1.0:1.15+lv*0.18),rise=Math.min(1,Math.max(0,(t-0.04)/0.4)),up=rowPt(zn,-0.36,-0.2),q1=iso(up[0],up[1],h+H*rise);buildWorker(q1.x,q1.y,TW*0.22,now,0);
    var gp=rowPt(zn,0.5,0.05),q2=iso(gp[0],gp[1],h);buildWorker(q2.x,q2.y,TW*0.24,now,1);}}
function scaffoldB(cu,cv,z,H,rise,fall){var c=[[-0.33,-0.31],[0.33,-0.31],[0.33,0.31],[-0.33,0.31]],hh=H*rise,dz=fall*TH*0.6;
  g.save();g.translate(0,dz);
  g.fillStyle='rgba(60,150,80,.28)';path([iso(cu+c[3][0],cv+c[3][1],z),iso(cu+c[2][0],cv+c[2][1],z),iso(cu+c[2][0],cv+c[2][1],z+hh),iso(cu+c[3][0],cv+c[3][1],z+hh)]);g.fill();
  g.strokeStyle='#A06A30';g.lineWidth=lw(0.016);g.lineCap='round';
  c.forEach(function(p){var a=iso(cu+p[0],cv+p[1],z),b=iso(cu+p[0],cv+p[1],z+hh);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();});
  var lv=Math.max(1,Math.round(H/(TH*0.3)));for(var l=1;l<=lv;l++){var zz=z+H*l/lv;if(zz>z+hh)break;g.lineWidth=lw(0.02);g.strokeStyle='#C48A48';g.beginPath();c.concat([c[0]]).forEach(function(p,k){var q=iso(cu+p[0],cv+p[1],zz);if(k)g.lineTo(q.x,q.y);else g.moveTo(q.x,q.y);});g.stroke();
    g.lineWidth=lw(0.008);g.strokeStyle='rgba(120,70,30,.8)';var a2=iso(cu+c[3][0],cv+c[3][1],zz-H/lv),b2=iso(cu+c[2][0],cv+c[2][1],zz);g.beginPath();g.moveTo(a2.x,a2.y);g.lineTo(b2.x,b2.y);g.stroke();
    var a3=iso(cu+c[2][0],cv+c[2][1],zz-H/lv),b3=iso(cu+c[1][0],cv+c[1][1],zz);g.beginPath();g.moveTo(a3.x,a3.y);g.lineTo(b3.x,b3.y);g.stroke();}
  g.restore();}
function buildCrane(u,v,z,H,t,now){var up=Math.min(1,t/0.12),mh=(H+TH*0.9)*up,b=iso(u,v,z),top=iso(u,v,z+mh);
  g.strokeStyle='#C98F00';g.lineWidth=lw(0.012);g.beginPath();g.moveTo(b.x-TW*0.025,b.y);g.lineTo(top.x-TW*0.025,top.y);g.moveTo(b.x+TW*0.025,b.y);g.lineTo(top.x+TW*0.025,top.y);g.stroke();
  g.strokeStyle='#F2B705';g.lineWidth=lw(0.006);for(var k=0;k<6;k++){var y0=b.y+(top.y-b.y)*k/6,y1=b.y+(top.y-b.y)*(k+1)/6;g.beginPath();g.moveTo(b.x-TW*0.025,y0);g.lineTo(b.x+TW*0.025,y1);g.stroke();}
  if(up<1)return;var cyc=((t-0.12)/0.24)%1,ang=0.35+Math.sin(cyc*Math.PI*2)*0.55,L=TW*0.42,ex=top.x+Math.cos(ang)*L,ey=top.y+Math.sin(ang)*L*0.3;
  g.strokeStyle='#F2B705';g.lineWidth=lw(0.016);g.beginPath();g.moveTo(top.x-Math.cos(ang)*L*0.3,top.y-Math.sin(ang)*L*0.09);g.lineTo(ex,ey);g.stroke();
  rrect(top.x-Math.cos(ang)*L*0.3-TW*0.025,top.y-Math.sin(ang)*L*0.09-TW*0.015,TW*0.05,TW*0.035,2);g.fillStyle='#6A6A72';g.fill();
  var lift=cyc<0.5?cyc/0.5:1-(cyc-0.5)/0.5,hy=ey+TH*0.15+(1-lift)*(H*0.9);g.strokeStyle='#333';g.lineWidth=Math.max(1,lw(0.003));g.beginPath();g.moveTo(ex,ey);g.lineTo(ex,hy);g.stroke();
  var bw=TW*0.1,bh=TW*0.05;rrect(ex-bw/2,hy,bw,bh,2);g.fillStyle=lift>0.05?'#D9C2A0':'#B8A07C';g.fill();g.strokeStyle='rgba(60,38,24,.6)';g.lineWidth=1;g.stroke();}
function buildWorker(x,y,s,now,k){var hit=Math.abs(Math.sin(now/150+k*1.6)),jx=k?Math.sin(now/300)*s*0.04:0;drawMiniPerson(x+jx,y,s,k?'#FF7A1A':'#2F80ED',0,false);
  g.beginPath();g.ellipse(x+jx,y-s*0.82,s*0.2,s*0.11,0,Math.PI,0);g.closePath();g.fillStyle='#F2C230';g.fill();g.fillStyle='#D9A200';g.fillRect(x+jx-s*0.24,y-s*0.83,s*0.48,s*0.035);
  g.save();g.translate(x+jx+s*0.24,y-s*0.58);g.rotate(-1.2+hit*1.3);g.strokeStyle='#6A4A2A';g.lineWidth=Math.max(1,s*0.06);g.beginPath();g.moveTo(0,0);g.lineTo(s*0.32,0);g.stroke();g.fillStyle='#55555C';g.fillRect(s*0.27,-s*0.08,s*0.1,s*0.16);g.restore();
  if(hit>0.96){g.strokeStyle='#FFE27A';g.lineWidth=Math.max(1,s*0.03);for(var q=0;q<4;q++){var a=q/4*Math.PI*2+0.4;g.beginPath();g.moveTo(x+jx+s*0.55+Math.cos(a)*s*0.06,y-s*0.5+Math.sin(a)*s*0.06);g.lineTo(x+jx+s*0.55+Math.cos(a)*s*0.16,y-s*0.5+Math.sin(a)*s*0.16);g.stroke();}}}
function ribbonCut(i,zn,h,p,bf,now,own){var A=rowPt(zn,-0.45,0.12),B=rowPt(zn,0.45,0.12),ph=TH*1.25,a=iso(A[0],A[1],h),b=iso(B[0],B[1],h),fade=p>0.85?(1-p)/0.15:1,cut=0.32;
  g.save();g.globalAlpha=fade;
  [a,b].forEach(function(q){g.strokeStyle='#E9E2D2';g.lineWidth=lw(0.014);g.beginPath();g.moveTo(q.x,q.y);g.lineTo(q.x,q.y-ph);g.stroke();ell(q.x,q.y-ph,lw(0.016),lw(0.016),'#F2C230');});
  var mx=(a.x+b.x)/2,my=(a.y+b.y)/2-ph+TH*0.08;g.strokeStyle='#D7261E';g.lineWidth=lw(0.018);g.lineCap='round';
  if(p<cut){var sag=TH*0.08;g.beginPath();g.moveTo(a.x,a.y-ph);g.quadraticCurveTo(mx,my+sag,b.x,b.y-ph);g.stroke();
    ell(mx,my+sag*0.5,TW*0.035,TW*0.025,'#D7261E');g.beginPath();g.moveTo(mx,my+sag*0.5);g.lineTo(mx-TW*0.03,my+sag*0.5+TW*0.06);g.moveTo(mx,my+sag*0.5);g.lineTo(mx+TW*0.03,my+sag*0.5+TW*0.06);g.stroke();
    var sp=Math.min(1,p/cut),sx=mx+TW*0.25*(1-sp),sy=my-TH*0.25*(1-sp),open=Math.abs(Math.sin(now/70))*0.45*(sp<0.85?1:0.2);scissors(sx,sy,TW*0.12,open);}
  else{var fp=Math.min(1,(p-cut)/0.25);if(!bf.f.cut){bf.f.cut=1;play('ribbon');}
    [[a,1],[b,-1]].forEach(function(hl){var q=hl[0],d=hl[1],len=Math.hypot(mx-q.x,my-(q.y-ph))*0.92,ang0=Math.atan2(my-(q.y-ph),mx-q.x),ang=ang0+(Math.PI/2-ang0)*fp*0.9*(d>0?1:1);if(d<0){ang=ang0+((Math.PI/2)-ang0)*fp*0.9;}
      g.beginPath();g.moveTo(q.x,q.y-ph);var ex=q.x+Math.cos(ang)*len,ey=q.y-ph+Math.sin(ang)*len;g.quadraticCurveTo((q.x+ex)/2+Math.sin(now/90)*TW*0.01,(q.y-ph+ey)/2+TH*0.05,ex,ey);g.stroke();});
    var cc=now-(bf.cutAt||(bf.cutAt=now)),ta=cc/1000;if(ta<1.3){for(var k=0;k<44;k++){var sp=0.6+hash(k,5)*0.8,vx=(hash(k,7)-0.5)*TW*2.4*sp,vy=-TH*(2.2+hash(k,9)*2.6),cx=mx+vx*ta,cy=my+vy*ta+TH*4.2*ta*ta,rot=ta*9+k,cw=TW*0.05;
      g.save();g.globalAlpha=fade*(ta>1?(1.3-ta)/0.3:1);g.translate(cx,cy);g.rotate(rot);g.fillStyle=['#FF5C7A','#FFD23F','#4CC0F0','#7BD389','#B28DFF',own||'#E2483D'][k%6];g.fillRect(-cw/2,-cw/4,cw,cw/2*Math.max(0.25,Math.abs(Math.cos(ta*10+k))));g.restore();}}
    if(fp>0.1){var sc=easeOutB2(Math.min(1,(fp-0.1)/0.4));var pb=iso(zn.bu,zn.bv,h);g.save();g.translate(pb.x,pb.y+TH*0.75);g.scale(sc,sc);pill(0,0,isPol()?'DIRESMIKAN!':'RESMI DIBUKA!',Math.max(10,TW*0.1),'#D7261E','#fff');g.restore();}}
  g.restore();}
function easeOutB2(x){var c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);}
function scissors(x,y,s,open){g.save();g.translate(x,y);g.rotate(0.6);[-1,1].forEach(function(d){g.save();g.rotate(d*open*0.5);g.fillStyle='#C9CED6';g.beginPath();g.moveTo(0,0);g.lineTo(-s*0.9,d*s*0.06);g.lineTo(-s*0.9,d*s*0.12);g.closePath();g.fill();g.strokeStyle='#4A505A';g.lineWidth=Math.max(1,s*0.05);g.stroke();
  g.beginPath();g.arc(s*0.32,d*s*0.16,s*0.16,0,7);g.strokeStyle=d>0?'#E2483D':'#2F80ED';g.lineWidth=Math.max(1.5,s*0.08);g.stroke();g.restore();});ell(0,0,s*0.05,s*0.05,'#333');g.restore();}
/* ---------- PLN concession: the buyer gets electrocuted ---------- */
function startZap(pid,now,tile){if(pid==null||!S.players[pid])return;ZAP={pid:pid,t0:now+450,tile:tile,seed:Math.random()*99};
  setTimeout(function(){play('zap');},450);
  FX.shakeTok=FX.shakeTok||{};FX.shakeTok[pid]=now+450+1600;
  if(typeof EXPR!=='undefined')EXPR[pid]={e:'shock',until:now+450+2200};}
function boltPath(x0,y0,x1,y1,seg,amp,seed){var pts=[[x0,y0]];for(var k=1;k<seg;k++){var f=k/seg,nx=-(y1-y0),ny=x1-x0,l=Math.hypot(nx,ny)||1;var off=(hash(k,seed)-0.5)*2*amp;pts.push([x0+(x1-x0)*f+nx/l*off,y0+(y1-y0)*f+ny/l*off]);}pts.push([x1,y1]);return pts;}
function strokeBolt(pts,w,col){g.beginPath();pts.forEach(function(p,k){if(k)g.lineTo(p[0],p[1]);else g.moveTo(p[0],p[1]);});g.strokeStyle=col;g.lineWidth=w;g.stroke();}
function drawZap(now){var z=ZAP,t=(now-z.t0)/1600;if(t>=1){ZAP=null;return;}if(t<0)return;var p=S.players[z.pid];if(!p||p.bankrupt){ZAP=null;return;}
  var tp=tokenPos(z.pid,now),s=TW*0.52,b=iso(tp.u,tp.v,tp.z),hx=b.x,hy=b.y-s*0.7,fr=Math.floor(now/55),on=fr%2===0;
  // screen flash
  if(t<0.3){g.save();g.globalAlpha=(on?0.45:0.15)*(1-t/0.3);g.fillStyle='#FFFBE0';g.fillRect(0,0,CW,CH_);g.restore();}
  // bolts from the PLN tower top (or the sky) into the token
  var zn=z.tile!=null?ZN[z.tile]:null,src=zn?iso(zn.bu,zn.bv,DZ+TH*1.5):{x:hx,y:hy-TH*4};
  g.save();g.lineCap='round';g.lineJoin='miter';
  var nb=t<0.75?3:1;for(var k=0;k<nb;k++){var sd=fr*7+k*13+z.seed,ex=hx+(hash(k,fr)-0.5)*s*0.4,ey=hy+(hash(fr,k)-0.2)*s*0.5,pts=boltPath(src.x+(k-1)*TW*0.04,src.y,ex,ey,9,TW*0.09,sd);
    strokeBolt(pts,lw(0.05),'rgba(120,190,255,.35)');strokeBolt(pts,lw(0.022),'#FFF27A');strokeBolt(pts,lw(0.008),'#FFFFFF');}
  // arcs crawling around the body
  for(var a=0;a<5;a++){var a0=hash(a,fr)*Math.PI*2,r0=s*(0.3+hash(fr,a)*0.25),a1=a0+1.2+hash(a,fr+3),pts2=boltPath(hx+Math.cos(a0)*r0,hy+s*0.25+Math.sin(a0)*r0*0.9,hx+Math.cos(a1)*r0,hy+s*0.25+Math.sin(a1)*r0*0.9,5,TW*0.04,fr*3+a);strokeBolt(pts2,lw(0.014),on?'#FFF27A':'#9FD8FF');}
  // skeleton flicker (x-ray)
  if(on&&t<0.85){g.globalAlpha=0.92;xraySkeleton(b.x+Math.sin(now/25)*TW*0.012,b.y,s);}
  // sparks + smoke at the end
  for(var q=0;q<8;q++){var sp=((now/300)+q/8)%1,sa=q/8*Math.PI*2+fr*0.3;ell(hx+Math.cos(sa)*s*(0.4+sp*0.4),hy+s*0.2+Math.sin(sa)*s*(0.3+sp*0.4)-sp*s*0.2,lw(0.012),lw(0.012),'rgba(255,240,140,'+(1-sp)+')');}
  if(t>0.7){g.globalAlpha=1;for(var m=0;m<3;m++){var mp=((t-0.7)/0.3+m*0.2)%1;if(typeof smokePuff==='function')smokePuff(hx+(m-1)*s*0.15,hy-s*0.35-mp*s*0.6,s*(0.12+mp*0.2),0.6*(1-mp));}}
  g.restore();
  if(t<0.6){g.save();var fs=Math.max(14,TW*0.2),sc=1+0.15*Math.sin(now/40);g.translate(hx+s*0.55,hy-s*0.75);g.rotate(-0.15);g.scale(sc,sc);g.font='900 '+fs+'px "Baloo 2", sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=fs*0.18;g.strokeStyle='#1A1A28';g.strokeText('BZZZT!',0,0);g.fillStyle='#FFE600';g.fillText('BZZZT!',0,0);g.restore();}}
function xraySkeleton(x,y,s){var hx=x,hy=y-s*0.7,r=s*0.25;
  g.save();var gl=g.createRadialGradient(x,y-s*0.5,s*0.05,x,y-s*0.5,s*0.62);gl.addColorStop(0,'rgba(40,90,220,.9)');gl.addColorStop(1,'rgba(40,90,220,0)');g.fillStyle=gl;g.fillRect(x-s*0.7,y-s*1.15,s*1.4,s*1.25);
  g.beginPath();g.ellipse(hx,hy,r*1.02,r*1.0,0,0,7);g.fillStyle='rgba(20,40,120,.85)';g.fill();
  g.fillStyle='#F4F8FF';g.strokeStyle='#F4F8FF';g.beginPath();g.ellipse(hx,hy-r*0.08,r*0.8,r*0.72,0,0,7);g.fill();rrect(hx-r*0.42,hy+r*0.4,r*0.84,r*0.32,r*0.1);g.fill();
  ell(hx-r*0.32,hy,r*0.2,r*0.24,'#13204A');ell(hx+r*0.32,hy,r*0.2,r*0.24,'#13204A');g.beginPath();g.moveTo(hx,hy+r*0.18);g.lineTo(hx-r*0.08,hy+r*0.32);g.lineTo(hx+r*0.08,hy+r*0.32);g.closePath();g.fillStyle='#13204A';g.fill();
  g.strokeStyle='#13204A';g.lineWidth=Math.max(1,r*0.05);for(var k=-2;k<=2;k++){g.beginPath();g.moveTo(hx+k*r*0.16,hy+r*0.42);g.lineTo(hx+k*r*0.16,hy+r*0.7);g.stroke();}
  g.strokeStyle='#F4F8FF';g.lineCap='round';g.lineWidth=Math.max(1.5,s*0.035);g.beginPath();g.moveTo(x,y-s*0.48);g.lineTo(x,y-s*0.15);g.stroke();
  g.lineWidth=Math.max(1,s*0.022);for(var rb=0;rb<4;rb++){var ry=y-s*(0.43-rb*0.065),rw=s*(0.17-rb*0.015);g.beginPath();g.moveTo(x-rw,ry+s*0.02);g.quadraticCurveTo(x,ry-s*0.03,x+rw,ry+s*0.02);g.stroke();}
  g.lineWidth=Math.max(1.5,s*0.03);[-1,1].forEach(function(d){g.beginPath();g.moveTo(x+d*s*0.2,y-s*0.45);g.lineTo(x+d*s*0.36,y-s*0.6);g.lineTo(x+d*s*0.44,y-s*0.78);g.stroke();ell(x+d*s*0.45,y-s*0.8,s*0.035,s*0.035,'#F4F8FF');
    g.beginPath();g.moveTo(x+d*s*0.06,y-s*0.15);g.lineTo(x+d*s*0.1,y-s*0.02);g.stroke();});
  g.beginPath();g.ellipse(x,y-s*0.15,s*0.12,s*0.04,0,0,7);g.stroke();g.restore();}
