/* ---------- Politik: Bos Mafia Sawit (fictional) shakes & throws the dice ---------- */
var MAF={vis:0,fist:null,cv:null};
function mafiaWant(now){if(!S||!isPol())return 0;if(typeof cineBusy==='function'&&cineBusy())return 0;return cup.phase==='shake'?1:0;} /* only while the shake button is held; gone the moment the dice are thrown */
function mafiaGeom(vis){var s=Math.min(CH_*0.46,CW*0.34),cx=CW/2,nw=performance.now();if(!MAF.topAt||nw-MAF.topAt>1000){MAF.topAt=nw;MAF.top=($('topbar')?$('topbar').getBoundingClientRect().bottom-cv.getBoundingClientRect().top:80);}var top=MAF.top,by=Math.max(0,top)+6+s*0.86-(1-vis)*s*1.05;return {s:s,cx:cx,by:by};}
function screenToWorld(sx,sy,sum){var d=(sx-OX)/(TW/2),z=OY+sum*TH/2-sy;if(z<ZS*0.5){z=ZS*0.5;}return {u:(sum+d)/2,v:(sum-d)/2,cz:z/ZS};}
function miniDie2D(x,y,w,rot,val){g.save();g.translate(x,y);g.rotate(rot);rrect(-w/2,-w/2,w,w,w*0.28);var gr=g.createLinearGradient(-w/2,-w/2,w/2,w/2);gr.addColorStop(0,'#FFFFFF');gr.addColorStop(1,'#D6D9E2');g.fillStyle=gr;g.fill();g.strokeStyle='rgba(60,60,80,.5)';g.lineWidth=Math.max(1,w*0.04);g.stroke();
  (PIPS[val]||PIPS[5]).forEach(function(p){ell(p[0]*w*0.25,p[1]*w*0.25,w*(val===1?0.16:0.09),w*(val===1?0.16:0.09),val===1?'#D8262A':'#111');});g.restore();}
function mafiaFist(x,y,s,open,flip){g.save();g.translate(x,y);if(flip)g.scale(-1,1);
  var sk=rgrad(-s*0.03,-s*0.04,s*0.13,'#F6C9A0','#C98A5E');
  if(open>0.5){g.beginPath();g.ellipse(0,0,s*0.085,s*0.07,0,0,7);g.fillStyle=sk;g.fill();g.strokeStyle='#8A5636';g.lineWidth=Math.max(1,s*0.006);g.stroke();
    for(var f=0;f<4;f++){g.save();g.rotate(-0.9+f*0.38);rrect(-s*0.017,s*0.04,s*0.034,s*0.075,s*0.017);g.fillStyle=sk;g.fill();g.stroke();g.restore();}}
  else{rrect(-s*0.09,-s*0.075,s*0.18,s*0.15,s*0.055);g.fillStyle=sk;g.fill();g.strokeStyle='#8A5636';g.lineWidth=Math.max(1,s*0.006);g.stroke();
    g.strokeStyle='rgba(120,70,40,.55)';for(var k=1;k<4;k++){g.beginPath();g.moveTo(-s*0.09+k*s*0.045,-s*0.075);g.lineTo(-s*0.09+k*s*0.045,-s*0.02);g.stroke();}
    rrect(-s*0.045,-s*0.08,s*0.04,s*0.03,s*0.012);g.fillStyle='#F2C230';g.fill();ell(-s*0.025,-s*0.07,s*0.012,s*0.01,'#2FA7E0');}
  g.restore();}
function drawMafiaBody(s,cx,by,now,pw,thr){
  var t=now/1000,jx=0,jy=0;if(MAF.laugh){jy=Math.abs(Math.sin(now/130))*s*-0.012;}if(cup.phase==='shake'){var amp=0.3+pw;jx=Math.sin(now/36)*s*0.035*amp;jy=Math.cos(now/29)*s*0.03*amp;}
  var lean=cup.phase==='shake'?pw*0.06:0,bob=Math.sin(t*1.6)*s*0.006;
  g.save();g.translate(cx,by);g.scale(1+lean,1+lean);g.translate(-cx,-by);
  var sh=by-s*0.42+bob,hw=s*0.5;
  // torso
  g.beginPath();g.moveTo(cx-hw*0.98,by+s*0.05);g.quadraticCurveTo(cx-hw*1.05,sh+s*0.04,cx-hw*0.55,sh-s*0.02);g.lineTo(cx+hw*0.55,sh-s*0.02);g.quadraticCurveTo(cx+hw*1.05,sh+s*0.04,cx+hw*0.98,by+s*0.05);g.closePath();
  var tg=g.createLinearGradient(cx-hw,0,cx+hw,0);tg.addColorStop(0,'#3A3A46');tg.addColorStop(0.45,'#1E1E26');tg.addColorStop(1,'#0E0E14');g.fillStyle=tg;g.fill();
  g.save();g.clip();g.strokeStyle='rgba(212,170,70,.35)';g.lineWidth=Math.max(1,s*0.008);for(var i=0;i<14;i++){var px=cx-hw+hash(i,3)*hw*2,py=sh+hash(i,4)*s*0.45;g.beginPath();g.arc(px,py,s*0.03,0,Math.PI*1.4);g.stroke();g.beginPath();g.arc(px+s*0.02,py,s*0.012,0,7);g.stroke();}
  // open collar
  g.beginPath();g.moveTo(cx-s*0.13,sh-s*0.02);g.lineTo(cx,sh+s*0.2);g.lineTo(cx+s*0.13,sh-s*0.02);g.closePath();g.fillStyle=rgrad(cx,sh+s*0.03,s*0.2,'#EDB78C','#B87A50');g.fill();
  g.fillStyle='#2A2A34';[-1,1].forEach(function(d){g.beginPath();g.moveTo(cx+d*s*0.13,sh-s*0.03);g.lineTo(cx+d*s*0.02,sh+s*0.22);g.lineTo(cx+d*s*0.22,sh+s*0.05);g.closePath();g.fill();});
  g.restore();
  // gold chain
  for(var c=0;c<15;c++){var a=Math.PI*(0.12+c/14*0.76),ex=cx+Math.cos(a)*s*0.12,ey=sh-s*0.02+Math.sin(a)*s*0.17;ell(ex,ey,s*0.016,s*0.012,c%2?'#E8B923':'#FFD95A');}
  rrect(cx-s*0.03,sh+s*0.15,s*0.06,s*0.07,s*0.015);g.fillStyle='#F2C230';g.fill();g.fillStyle='#8A6010';g.font='900 '+(s*0.05)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('$',cx,sh+s*0.188);
  // neck + head
  var hx=cx,hy=sh-s*0.2,r=s*0.19;
  rrect(hx-s*0.11,hy+r*0.4,s*0.22,s*0.14,s*0.05);g.fillStyle='#C98A5E';g.fill();
  ell(hx-r*1.02,hy+r*0.08,r*0.17,r*0.24,'#D99B6E');ell(hx+r*1.02,hy+r*0.08,r*0.17,r*0.24,'#D99B6E');
  g.beginPath();g.moveTo(hx-r,hy-r*0.3);g.quadraticCurveTo(hx-r*1.05,hy+r*0.85,hx-r*0.45,hy+r*1.05);g.quadraticCurveTo(hx,hy+r*1.2,hx+r*0.45,hy+r*1.05);g.quadraticCurveTo(hx+r*1.05,hy+r*0.85,hx+r,hy-r*0.3);g.quadraticCurveTo(hx+r,hy-r*1.05,hx,hy-r*1.05);g.quadraticCurveTo(hx-r,hy-r*1.05,hx-r,hy-r*0.3);g.closePath();
  g.fillStyle=rgrad(hx-r*0.35,hy-r*0.4,r*1.5,'#F6C9A0','#C48256');g.fill();g.strokeStyle='#8A5636';g.lineWidth=Math.max(1,s*0.006);g.stroke();
  ell(hx,hy+r*0.8,r*0.6,r*0.25,'rgba(60,40,40,.18)');
  // slick hair
  g.beginPath();g.moveTo(hx-r*1.02,hy-r*0.1);g.quadraticCurveTo(hx-r*1.1,hy-r*1.2,hx,hy-r*1.18);g.quadraticCurveTo(hx+r*1.15,hy-r*1.15,hx+r*1.02,hy-r*0.1);g.quadraticCurveTo(hx+r*0.8,hy-r*0.7,hx+r*0.1,hy-r*0.75);g.quadraticCurveTo(hx-r*0.7,hy-r*0.72,hx-r*1.02,hy-r*0.1);g.closePath();
  g.fillStyle=rgrad(hx-r*0.3,hy-r*1.0,r*1.3,'#4A4A58','#101016');g.fill();g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=Math.max(1,s*0.008);g.beginPath();g.moveTo(hx-r*0.6,hy-r*0.95);g.quadraticCurveTo(hx,hy-r*1.12,hx+r*0.55,hy-r*0.95);g.stroke();
  // brows (predatory V)
  g.strokeStyle='#15151C';g.lineWidth=s*0.022;[-1,1].forEach(function(d){g.beginPath();g.moveTo(hx+d*r*0.12,hy-r*0.28);g.lineTo(hx+d*r*0.7,hy-r*0.46);g.stroke();});
  // sunglasses
  [-1,1].forEach(function(d){rrect(hx+d*r*0.44-r*0.36,hy-r*0.24,r*0.72,r*0.4,r*0.16);var lg=g.createLinearGradient(0,hy-r*0.24,0,hy+r*0.16);lg.addColorStop(0,'#3A3A50');lg.addColorStop(1,'#08080E');g.fillStyle=lg;g.fill();g.strokeStyle='#E8B923';g.lineWidth=Math.max(1,s*0.008);g.stroke();
    g.save();g.globalAlpha=0.55+0.3*Math.sin(t*2+d);g.strokeStyle='#fff';g.lineWidth=Math.max(1,s*0.008);g.beginPath();g.moveTo(hx+d*r*0.44-r*0.2,hy-r*0.14);g.lineTo(hx+d*r*0.44-r*0.05,hy-r*0.2);g.stroke();g.restore();});
  g.strokeStyle='#E8B923';g.lineWidth=Math.max(1,s*0.01);g.beginPath();g.moveTo(hx-r*0.08,hy-r*0.12);g.lineTo(hx+r*0.08,hy-r*0.12);g.stroke();
  ell(hx,hy+r*0.3,r*0.15,r*0.11,'#C48256');
  // mustache + grin with gold tooth
  g.fillStyle='#15151C';g.beginPath();g.moveTo(hx,hy+r*0.42);g.quadraticCurveTo(hx-r*0.45,hy+r*0.34,hx-r*0.62,hy+r*0.55);g.quadraticCurveTo(hx-r*0.3,hy+r*0.5,hx,hy+r*0.52);g.quadraticCurveTo(hx+r*0.3,hy+r*0.5,hx+r*0.62,hy+r*0.55);g.quadraticCurveTo(hx+r*0.45,hy+r*0.34,hx,hy+r*0.42);g.fill();
  var grin=MAF.laugh?0.3+Math.abs(Math.sin(now/130))*0.06:cup.phase==='shake'?0.1+pw*0.08:0.1;
  g.beginPath();g.moveTo(hx-r*0.5,hy+r*0.58);g.quadraticCurveTo(hx,hy+r*(0.62+grin*4),hx+r*0.5,hy+r*0.58);g.quadraticCurveTo(hx,hy+r*0.66,hx-r*0.5,hy+r*0.58);g.fillStyle='#4A1010';g.fill();
  g.save();g.clip();g.fillStyle='#FBF6EA';g.fillRect(hx-r*0.5,hy+r*0.58,r,r*0.12);for(var tq=-3;tq<=3;tq++){g.strokeStyle='rgba(120,100,80,.6)';g.lineWidth=1;g.beginPath();g.moveTo(hx+tq*r*0.12,hy+r*0.58);g.lineTo(hx+tq*r*0.12,hy+r*0.7);g.stroke();}g.fillStyle='#F2C230';g.fillRect(hx+r*0.12,hy+r*0.585,r*0.12,r*0.1);g.restore();
  // cigar + smoke
  g.save();g.translate(hx+r*0.42,hy+r*0.66);g.rotate(0.28);rrect(0,-r*0.06,r*0.62,r*0.12,r*0.05);g.fillStyle='#6E4422';g.fill();g.fillStyle='#C9A050';g.fillRect(r*0.08,-r*0.06,r*0.07,r*0.12);g.fillStyle='#FF6A1A';g.globalAlpha=0.7+0.3*Math.sin(t*5);ell(r*0.63,0,r*0.05,r*0.06,'#FF6A1A');g.restore();
  for(var k=0;k<4;k++){var pt=((t*0.35+k/4)%1),sx=hx+r*1.05+Math.sin(pt*5+k)*r*0.2,sy=hy+r*0.8-pt*s*0.3;g.save();g.globalAlpha=0.35*(1-pt);ell(sx,sy,r*(0.1+pt*0.3),r*(0.1+pt*0.3),'#D8D8D8');g.restore();}
  // arms + fists
  var fx=cx+jx,fy=by-s*0.16+jy+bob,open=0,spread=s*0.1;
  if(thr!=null){var e=thr;if(e<0.3){fy-=Math.sin(e/0.3*Math.PI/2)*s*0.08;}else{var q2=(e-0.3)/0.7;fy+=q2*s*0.14;spread=s*0.1+q2*s*0.12;open=q2>0.15?1:0;}}
  if(cup.phase==='shake')spread=s*0.07;
  [-1,1].forEach(function(d){var shx=cx+d*hw*0.82,shy=sh+s*0.05,ex=cx+d*hw*0.9,ey=by-s*0.05,hx2=fx+d*spread*0.5;
    g.beginPath();g.moveTo(shx-d*s*0.02,shy);g.quadraticCurveTo(ex+d*s*0.06,ey,hx2+d*s*0.04,fy+s*0.03);g.lineWidth=s*0.15;g.strokeStyle='#22222C';g.lineCap='round';g.stroke();
    g.lineWidth=s*0.04;g.strokeStyle='rgba(255,255,255,.06)';g.stroke();
    ell(hx2+d*s*0.02,fy+s*0.04,s*0.075,s*0.04,'#F4F1EA');});
  // sash: MAFIA SAWIT
  g.save();var sx0=cx-hw*0.78,sy0=sh+s*0.01,sx1=cx+hw*0.92,sy1=by-s*0.02,ang=Math.atan2(sy1-sy0,sx1-sx0),len=Math.hypot(sx1-sx0,sy1-sy0),sw=s*0.085;
  g.translate(sx0,sy0);g.rotate(ang);g.fillStyle='#B71C1C';g.fillRect(0,-sw/2,len,sw);g.fillStyle='#F2C230';g.fillRect(0,-sw/2,len,sw*0.1);g.fillRect(0,sw/2-sw*0.1,len,sw*0.1);
  g.font='900 '+(sw*0.62)+'px "Baloo 2", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#FFD95A';g.font='900 '+(sw*0.6)+'px "Baloo 2", sans-serif';g.fillText('MAFIA SAWIT',len*0.3,sw*0.04);g.restore();
  if(cup.phase==='shake'){miniDie2D(fx-s*0.02,fy-s*0.05,s*0.07,now/60,3);miniDie2D(fx+s*0.03,fy-s*0.04,s*0.07,-now/50,5);}
  if(MAF.laugh){var rb=Math.sin(now/110)*s*0.022;mafiaFist(fx-s*0.035,fy+rb,s,0,false);mafiaFist(fx+s*0.035,fy-rb,s,0,true);}else{mafiaFist(fx-spread*0.5,fy,s,open,false);mafiaFist(fx+spread*0.5,fy,s,open,true);}
  MAF.fist={x:fx,y:fy};
  g.restore();
}
function drawMafia(now){
  var want=mafiaWant(now);MAF.vis+=(want-MAF.vis)*(want>MAF.vis?0.38:0.32);if(want===0&&MAF.vis<0.08)MAF.vis=0;if(MAF.vis<0.01){MAF.fist=null;return;}
  var G=mafiaGeom(MAF.vis),s=G.s,pw=cupPower(now),thr=null;
  if(diceRoll&&diceRoll.pol){var el=now-diceRoll.t0;if(el<700)thr=el/700;}
  var w=Math.ceil(s*1.3),h=Math.ceil(s*1.05),d2=Math.min(dpr,1);if(!MAF.cv)MAF.cv=document.createElement('canvas');var mc=MAF.cv;
  if(mc.width!==Math.ceil(w*d2)||mc.height!==Math.ceil(h*d2)){mc.width=Math.ceil(w*d2);mc.height=Math.ceil(h*d2);}
  var lcx=w/2,lby=h*0.86,old=g,calm=cup.phase==='idle'&&!diceRoll&&thr==null,rk=w+'x'+h+':'+d2+':'+cup.phase+':'+(MAF.vis>0.98?1:Math.round(MAF.vis*20));
  /* calm (no shake, no dice): redraw the offscreen mafia at ~8fps instead of every frame */
  if(!calm||MAF.rk!==rk||now-(MAF.rAt||0)>120||!MAF.fl){MAF.rk=rk;MAF.rAt=now;var c=mc.getContext('2d');c.setTransform(d2,0,0,d2,0,0);c.clearRect(0,0,w,h);g=c;drawMafiaBody(s,lcx,lby,now,pw,thr);MAF.fl=MAF.fist;
  // fade lower body so he rises from behind the board
  c.globalCompositeOperation='destination-in';var fg=c.createLinearGradient(0,h*0.78,0,h*0.98);fg.addColorStop(0,'rgba(0,0,0,1)');fg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=fg;c.fillRect(0,0,w,h);c.globalCompositeOperation='source-over';g=old;}
  else MAF.fist=MAF.fl?{x:MAF.fl.x,y:MAF.fl.y}:null;
  var ox=G.cx-lcx,oy=G.by-lby;
  if(MAF.fist)MAF.fist={x:MAF.fist.x+ox,y:MAF.fist.y+oy};
  g.save();g.globalAlpha=Math.min(1,MAF.vis*1.6);g.drawImage(mc,ox,oy,w,h);g.restore();
}

function renderMafiaAt(cx,by,s,alpha,now,laugh){var w=Math.ceil(s*1.3),h=Math.ceil(s*1.05),d2=dpr;if(!MAF.cv2)MAF.cv2=document.createElement('canvas');var mc=MAF.cv2;
  if(mc.width!==Math.ceil(w*d2)||mc.height!==Math.ceil(h*d2)){mc.width=Math.ceil(w*d2);mc.height=Math.ceil(h*d2);}
  var c=mc.getContext('2d'),old=g,fs=MAF.fist;c.setTransform(d2,0,0,d2,0,0);c.clearRect(0,0,w,h);g=c;MAF.laugh=!!laugh;var lcx=w/2,lby=h*0.86;drawMafiaBody(s,lcx,lby,now,0,null);MAF.laugh=false;MAF.fist=fs;
  c.globalCompositeOperation='destination-in';var fg=c.createLinearGradient(0,h*0.8,0,h*0.99);fg.addColorStop(0,'rgba(0,0,0,1)');fg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=fg;c.fillRect(0,0,w,h);c.globalCompositeOperation='source-over';
  g=old;g.save();g.globalAlpha=alpha;g.drawImage(mc,cx-lcx,by-lby,w,h);g.restore();}
