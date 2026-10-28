/* ---------- Politik: cerita berkelanjutan di tengah board (Kas Pungli memajukan babak) ---------- */
var STV={stage:-1,since:0,trans:null,moment:null,rolls:0,nextAt:2,grow:0.35,hold:0,cough:0};
function stStage(){return (S&&S.story)||0;}
function storySync(now){var st=stStage();if(st!==STV.stage){if(STV.stage<0)STV.since=now-45000;else STV.since=now;STV.stage=st;}}
function storyBusy(){return STV.hold>performance.now();}
function storySkip(){if(storyBusy()){STV.hold=0;if(STV.trans)STV.trans.t0-=8000;}}
/* called from drainEvents */
function onStoryEvent(e,now){STV.trans={stage:e.stage,t0:now};STV.since=now;STV.stage=e.stage;cam.focus={u:MID,v:MID+0.35,zoom:1.6};
  var dur=e.stage===3?7000:4200;cam.focusUntil=now+dur;
  if(e.stage===1){play('fire');}
  if(e.stage===2){play('plane');setTimeout(function(){play('rain');},900);}
  if(e.stage===3){STV.hold=now+7000;STV.grow=0.35;play('treesFall');setTimeout(function(){play('laugh');},1500);}
  if(e.stage===4){play('horn');setTimeout(function(){play('coins');},800);}
  if(e.stage===5){play('ribbon');}
  if(e.stage===6){play('stamp');setTimeout(function(){play('windCreak');},600);}
  if(e.stage===7){play('flood');}
  if(e.stage===8){play('camera');}}
/* periodic moments synced to dice throws: guaranteed on camera */
function onStoryRoll(now){if(!isPol())return;STV.rolls++;if(STV.rolls<STV.nextAt)return;STV.rolls=0;STV.nextAt=2+Math.floor(Math.random()*2);
  var st=stStage();STV.moment={stage:st,t0:now+500,v:Math.floor(Math.random()*2)};
  setTimeout(function(){var m=STV.moment;if(!m)return;
    if(st===0)play(m.v?'birds':'uuk');
    else if(st===1){play('cough');setTimeout(function(){play('birds');},500);STV.cough=performance.now()+3200;}
    else if(st===2){play('cough');STV.cough=performance.now()+1800;}
    else if(st===3){play('horn');STV.grow=Math.min(0.95,STV.grow+0.15);}
    else if(st===4){play('horn');setTimeout(function(){play('coins');},900);}
    else if(st===5){play('pile');}
    else if(st===6)play('windCreak');
    else if(st===7)play('splash');
    else play('camera');},500);}
function storyCoughing(now){return STV.cough>now;}
/* ground under the forest */
function storyGround(ic,now){var st=stStage(),c1,c2;
  if(st<=1){c1='#8ED17E';c2='#3F8E4A';}else if(st===2){c1='#9A958A';c2='#5A564E';}else if(st===3){c1='#B08A5A';c2='#7A5A36';}else if(st===4){c1='#9FB56A';c2='#5E7A36';}else if(st===5){c1='#C9C2B0';c2='#9A9282';}else if(st===6){c1='#B9BFA0';c2='#7E8A62';}else{c1='#A9A28A';c2='#6E6A5A';}
  ell(ic.x,ic.y-TH*0.04,TW*1.12,TH*0.98,radialFill(ic.x,ic.y-TH*0.2,TW*1.2,c1,c2));
  if(st===1){var f=burnFrac(now);g.save();g.globalAlpha=0.55*f;ell(ic.x-TW*0.2,ic.y-TH*0.3,TW*0.9*f+TW*0.1,TH*0.7*f+TH*0.1,'#3A2A1A');g.restore();}
  if(st===3||st===4){g.save();g.strokeStyle=st===3?'rgba(90,60,30,.5)':'rgba(60,80,30,.35)';g.lineWidth=lw(0.012);for(var r=-4;r<=4;r++){var a=iso(MID-1.0,MID+r*0.22,0),b=iso(MID+1.0,MID+r*0.22,0);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();}g.restore();}}
function burnFrac(now){return Math.min(0.85,0.2+(now-STV.since)/90000);}
function charred(x,y,s,seed){g.fillStyle='#2A1C14';g.fillRect(x-s*0.05,y-s*0.55,s*0.1,s*0.55);g.strokeStyle='#2A1C14';g.lineWidth=Math.max(1,s*0.05);g.beginPath();g.moveTo(x,y-s*0.4);g.lineTo(x-s*0.18,y-s*0.62);g.moveTo(x,y-s*0.3);g.lineTo(x+s*0.16,y-s*0.5);g.stroke();ell(x,y,s*0.2,s*0.06,'rgba(0,0,0,.25)');}
function drawCrane(u,v,now,moving,rust){var b=iso(u,v,0),top=iso(u,v,TH*2.4),col=rust?'#B8742A':'#F2B705',dk=rust?'#7A4A1A':'#B88400';
  g.strokeStyle=dk;g.lineWidth=lw(0.02);g.beginPath();g.moveTo(b.x-TW*0.04,b.y);g.lineTo(top.x-TW*0.04,top.y);g.moveTo(b.x+TW*0.04,b.y);g.lineTo(top.x+TW*0.04,top.y);g.stroke();
  g.strokeStyle=col;g.lineWidth=lw(0.008);for(var k=0;k<8;k++){var y0=b.y+(top.y-b.y)*k/8,y1=b.y+(top.y-b.y)*(k+1)/8;g.beginPath();g.moveTo(b.x-TW*0.04,y0);g.lineTo(b.x+TW*0.04,y1);g.stroke();}
  var ang=moving?Math.sin(now/2400)*0.6:0.25,L=TW*0.9,ex=top.x+Math.cos(ang)*L,ey=top.y+Math.sin(ang)*L*0.25;g.strokeStyle=col;g.lineWidth=lw(0.025);g.beginPath();g.moveTo(top.x-Math.cos(ang)*L*0.3,top.y-Math.sin(ang)*L*0.08);g.lineTo(ex,ey);g.stroke();
  g.strokeStyle='#444';g.lineWidth=lw(0.004);var hy=ey+TH*(moving?0.8+Math.sin(now/900)*0.3:0.6);g.beginPath();g.moveTo(ex-TW*0.05,ey);g.lineTo(ex-TW*0.05,hy);g.stroke();rrect(ex-TW*0.08,hy,TW*0.06,TH*0.08,2);g.fillStyle='#7A7A80';g.fill();
  return {x:ex,y:ey};}
function drawFrame(u,v,h,grey){var c=grey?'#A8A8A0':'#D9D2C2';for(var k=0;k<3;k++){box(u-0.25+k*0.25,v,0.06,0.06,h,0,c,shade(c,-0.2));}box(u,v,0.62,0.12,TH*0.08,h,c,shade(c,-0.2));}
function drawFence(u0,v0,u1,v1){var a=iso(u0,v0,0),b=iso(u1,v1,0);g.strokeStyle='#8A8A92';g.lineWidth=lw(0.006);for(var k=0;k<=8;k++){var x=a.x+(b.x-a.x)*k/8,y=a.y+(b.y-a.y)*k/8;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-TH*0.35);g.stroke();}
  [0.12,0.24].forEach(function(h){g.beginPath();g.moveTo(a.x,a.y-TH*h);g.lineTo(b.x,b.y-TH*h);g.stroke();});}
function signBoard(u,v,txt,col){var p=iso(u,v,0);g.strokeStyle='#5A4030';g.lineWidth=lw(0.01);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x,p.y-TH*0.7);g.stroke();pill(p.x,p.y-TH*0.85,txt,Math.max(8,TW*0.06),col||'#FFFDF6',col?'#fff':INK);}
function maskedWarga(u,v,now,k){var p=iso(u,v,0),s=TW*0.26,cough=storyCoughing(now)||Math.sin(now/700+k*2)>0.92;var bend=cough?Math.sin(now/90)*s*0.03:0;
  drawMiniPerson(p.x+bend,p.y,s,k%2?'#2F80ED':'#E2483D',0,false);g.fillStyle='#F4F4F4';g.fillRect(p.x-s*0.09+bend,p.y-s*0.68,s*0.18,s*0.07);
  if(cough){for(var q=0;q<3;q++){var ph=((now/400)+q/3)%1;ell(p.x+s*(0.2+ph*0.5)+bend,p.y-s*(0.7+ph*0.2),s*(0.05+ph*0.1),s*(0.05+ph*0.1),'rgba(160,160,160,'+(0.7*(1-ph))+')');}}}
function storyItems(now,items){storySync(now);var st=stStage(),t=now/1000,f=burnFrac(now),tr0=STV.trans,te=tr0?(now-tr0.t0):1e9;
  var fall=st===3&&te<1500?te/1500:1;
  FOREST.forEach(function(tr,idx){if(!treeAt(tr))return;items.push({d:tr.u+tr.v,f:function(){var q=iso(tr.u,tr.v,0),s=TW*tr.s,sway=Math.sin(t*0.9+idx)*s*0.02;
    if(st===0){drawRainTree(q.x+sway,q.y,s);}
    else if(st===1){if(tr.o<f){g.save();g.filter='brightness(0.55) sepia(0.5)';drawRainTree(q.x,q.y,s);g.restore();fire(q.x,q.y-s*0.6,s*0.9,now,idx);}else drawRainTree(q.x+sway,q.y,s);}
    else if(st===2){charred(q.x,q.y,s,idx);if(tr2(idx,now))smokeWisp(q.x,q.y-s*0.5,s,now,idx);if(tr0&&tr0.stage===2&&te<2500)fire(q.x,q.y-s*0.3,s*0.6*(1-te/2500),now,idx);}
    else if(st===3){if(fall<1&&tr.o<fall*1.2){g.save();g.translate(q.x,q.y);g.rotate(Math.min(1,(fall*1.2-tr.o)*3)*1.3);charred(0,0,s,idx);g.restore();}else if(fall<1)charred(q.x,q.y,s,idx);else{var gs=STV.grow*(0.8+tr.o*0.3);g.save();g.translate(q.x,q.y);g.scale(gs,gs);g.translate(-q.x,-q.y);sawit(q.x,q.y,s*0.9,idx);g.restore();}}
    else if(st===4){sawit(q.x,q.y,s*1.0,idx);}
    else if(st===5){if(tr.o>0.55)sawit(q.x,q.y,s*0.95,idx);}
    else if(st===6){if(tr.o>0.75)sawit(q.x,q.y,s*0.8,idx);else if(tr.o>0.5){ell(q.x,q.y,s*0.12,s*0.05,'#6E8A3A');}}
  }});});
  // workers / warga / landmarks per babak (kept on the lower half of the island, clear of the Mafia)
  if(st===1||st===2){[[MID-0.35,MID+1.0],[MID+0.3,MID+1.12]].forEach(function(w,k){items.push({d:w[0]+w[1],f:function(){maskedWarga(w[0],w[1],now,k);}});});}
  if(st===3){[[MID-0.5,MID+0.9],[MID+0.15,MID+1.05]].forEach(function(w,k){items.push({d:w[0]+w[1],f:function(){var p=iso(w[0],w[1],0),s=TW*0.26,dig=Math.abs(Math.sin(now/300+k));drawMiniPerson(p.x,p.y,s,'#2E7D32',0,false);g.strokeStyle='#6A4A2A';g.lineWidth=lw(0.01);g.beginPath();g.moveTo(p.x+s*0.2,p.y-s*0.5);g.lineTo(p.x+s*0.35,p.y-s*0.05*dig);g.stroke();}});});
    items.push({d:2*MID+1.5,f:function(){drawFence(MID+0.45,MID+1.2,MID+1.2,MID+0.45);signBoard(MID+1.1,MID+1.05,'KONSESI PT SAWIT JAYA ABADI','#7A1A1A');}});}
  if(st===4||st===5){items.push({d:2*MID+0.2,f:function(){var mu=MID-0.85,mv=MID+0.65;aoShadow(mu,mv,0.5,0.4,0);box(mu,mv,0.46,0.36,TH*0.4,0,'#B0B4BA','#8A8E96');box(mu+0.12,mv-0.1,0.1,0.1,TH*0.9,TH*0.4,'#8A8E96','#6A6E76');var ch=iso(mu+0.12,mv-0.1,TH*1.3);smoke(ch.x,ch.y,TW*0.08,9);
      var bag=iso(mu-0.05,mv+0.32,0),bs=TW*(0.08+Math.min(0.1,(S.kas||0)/250000*0.1));g.beginPath();g.ellipse(bag.x,bag.y-bs,bs*0.9,bs,0,0,7);g.fillStyle=radialFill(bag.x,bag.y-bs*1.2,bs,'#E9C98A','#9A6A3A');g.fill();g.fillStyle='#6B4226';g.font='900 '+(bs*0.8)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('Rp',bag.x,bag.y-bs);}});}
  if(st>=5){var sunk=st>=7;items.push({d:2*MID-0.4,f:function(){var cu=MID-0.55,cv=MID-0.1;if(st===5)drawIKN(cu,cv,now);else drawFrame(cu,cv,TH*1.1,true);var tip=drawCrane(MID+0.25,MID-0.5,now,st===5,st>=6);STV.craneTip=tip;
      if(st===6){var a=iso(cu-0.4,cv+0.3,TH*0.3),b=iso(cu+0.4,cv+0.3,TH*0.3);g.strokeStyle='#F2C230';g.lineWidth=lw(0.02);g.setLineDash([lw(0.03),lw(0.03)]);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();g.setLineDash([]);pill((a.x+b.x)/2,a.y-TH*0.15,'STOP',Math.max(8,TW*0.06),'#C62828','#fff');}
      if(st>=6)signBoard(MID-0.1,MID+1.0,'Proyek Strategis (dalam peninjauan)');else signBoard(MID-0.1,MID+1.0,'IBU KOTA BARU','#1F6E52');}});}
  if(st===8){items.push({d:2*MID+1.3,f:function(){var p=iso(MID+0.1,MID+0.9,0),s=TW*0.3;ell(p.x+s*0.3,p.y,s*0.2,s*0.07,'#6E8A3A');g.strokeStyle='#2E7D32';g.lineWidth=lw(0.01);g.beginPath();g.moveTo(p.x+s*0.3,p.y);g.lineTo(p.x+s*0.3,p.y-s*0.3);g.stroke();ell(p.x+s*0.25,p.y-s*0.32,s*0.08,s*0.05,'#4CAF50');ell(p.x+s*0.36,p.y-s*0.3,s*0.08,s*0.05,'#4CAF50');
      drawMiniPerson(p.x,p.y,s,'#20283A',Math.sin(now/300),false);var cm=iso(MID+0.6,MID+1.2,0);drawMiniPerson(cm.x,cm.y,s*0.9,'#555',0,false);rrect(cm.x-s*0.12,cm.y-s*0.75,s*0.2,s*0.14,2);g.fillStyle='#111';g.fill();if(Math.floor(now/400)%3===0){var fl=g.createRadialGradient(cm.x,cm.y-s*0.7,0,cm.x,cm.y-s*0.7,s*0.6);fl.addColorStop(0,'rgba(255,255,255,.9)');fl.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=fl;g.fillRect(cm.x-s*0.6,cm.y-s*1.3,s*1.2,s*1.2);}}});}
  // orangutan, the emotional thread of the story
  items.push({d:2*MID+1.75,f:function(){drawOrangutanStory(now,st);}});
}
function tr2(idx,now){return (Math.floor(now/2000)+idx)%5===0;}
function smokeWisp(x,y,s,now,seed){for(var k=0;k<3;k++){var ph=((now/1600)+k/3+seed*0.07)%1;ell(x+Math.sin(ph*6+seed)*s*0.15,y-ph*s*1.2,s*(0.08+ph*0.18),s*(0.08+ph*0.18),'rgba(130,125,120,'+(0.45*(1-ph))+')');}}
function drawOrangutanStory(now,st){var u=MID+0.85,v=MID+0.9,z=0,mood='happy',caged=false,lab=null,mom=STV.moment&&now>STV.moment.t0&&now-STV.moment.t0<2600?STV.moment:null;
  if(st===0){z=Math.abs(Math.sin(now/600))*TH*0.15;if(mom&&!mom.v){z+=Math.abs(Math.sin((now-mom.t0)/120))*TH*0.3;lab='uuk uuk!';}}
  else if(st===1){mood='cry';z=TH*0.6;lab=Math.sin(now/1500)>0.3?'huhu...':null;}
  else if(st===2){mood='sad';lab=Math.sin(now/2100)>0.6?'...':null;}
  else if(st===3){mood='sad';u=MID+1.05;v=MID+1.0;lab='?';}
  else if(st===4||st===5){mood='sad';caged=true;u=MID+1.0;v=MID+1.0;}
  else if(st===6&&STV.craneTip){mood='sad';}
  else if(st>=7){mood='sad';}
  if(st===6&&STV.craneTip){var tp=STV.craneTip;g.save();var q0=iso(u,v,0);g.translate(tp.x-q0.x,tp.y-q0.y+TH*0.05);drawOrangutan(u,v,now,1,false);g.restore();return;}
  if(st>=7){var lq=iso(u,v,0);rrect(lq.x-TW*0.18,lq.y-TH*0.02,TW*0.36,TH*0.1,TH*0.05);g.fillStyle='#7A4A2A';g.fill();z=Math.sin(now/700)*TH*0.04;}
  g.save();var q=iso(u,v,0);g.translate(0,-z);drawOrangutan(u,v,now,mood==='happy'?0:1,mood==='cry');g.restore();
  if(caged){var c=iso(u,v,0),s=TW*0.3;g.strokeStyle='#5A5C66';g.lineWidth=lw(0.006);for(var k=-3;k<=3;k++){g.beginPath();g.moveTo(c.x+k*s*0.12,c.y+s*0.05);g.lineTo(c.x+k*s*0.12,c.y-s*1.05);g.stroke();}rrect(c.x-s*0.42,c.y-s*1.1,s*0.84,s*0.08,2);g.fillStyle='#5A5C66';g.fill();pill(c.x,c.y-s*1.3,'KONSERVASI',Math.max(7,TW*0.05),'#2E7D32','#fff');}
  if(lab){pill(q.x+TW*0.15,q.y-z-TW*0.32,lab,Math.max(8,TW*0.07),'#fff',INK);}}
/* screen-space overlay: smoke, rain, plane, flood, transitions, the Mafia */
function storyOverlay(now){if(!isPol()||!S)return;var st=stStage(),c=iso(MID,MID,0),tr=STV.trans,te=tr?now-tr.t0:1e9,mom=STV.moment&&now>STV.moment.t0?STV.moment:null,me=mom?now-mom.t0:1e9;
  if(st===1){g.save();g.globalAlpha=0.08+0.06*burnFrac(now);g.fillStyle='#8A6A50';g.fillRect(0,0,CW,CH_);g.restore();
    g.save();for(var k=0;k<7;k++){var ph=((now/5200)+k/7)%1,sx=c.x+(hash(k,4)-0.5)*TW*1.8,sy=c.y-ph*TH*6;g.globalAlpha=0.35*(1-ph);ell(sx,sy,TW*(0.2+ph*0.7),TW*(0.16+ph*0.55),'#6E6A66');}g.restore();}
  if(mom&&mom.stage===1&&me<3000){var p=me/3000;g.save();g.globalAlpha=Math.sin(Math.PI*p)*0.55;var bx=-CW*0.4+p*CW*1.8;var gr=g.createLinearGradient(bx-CW*0.4,0,bx+CW*0.4,0);gr.addColorStop(0,'rgba(120,115,110,0)');gr.addColorStop(0.5,'rgba(120,115,110,1)');gr.addColorStop(1,'rgba(120,115,110,0)');g.fillStyle=gr;g.fillRect(0,0,CW,CH_);g.restore();}
  if(mom&&((mom.stage===1)||(mom.stage===0&&mom.v))&&me<2600){for(var b=0;b<7;b++){var bp=me/2600,ang=b/7*Math.PI*2,bx2=c.x+Math.cos(ang)*TW*(0.3+bp*3),by2=c.y-TH*0.6+Math.sin(ang)*TH*(0.3+bp*1.5)-bp*TH*2,fl=Math.sin(now/50+b)*TW*0.04;g.strokeStyle=mom.stage===1?'#2A2A30':'#B23A1E';g.lineWidth=lw(0.012);g.beginPath();g.moveTo(bx2-TW*0.06,by2-fl);g.lineTo(bx2,by2);g.lineTo(bx2+TW*0.06,by2-fl);g.stroke();}}
  if(st===2&&tr&&tr.stage===2&&te<4200){var pp=Math.min(1,te/1800),px=-CW*0.2+pp*CW*1.4,py=CH_*0.2;g.save();g.translate(px,py);g.fillStyle='#E2483D';rrect(-40,-8,80,16,8);g.fill();g.fillStyle='#fff';g.fillRect(-10,-26,14,52);g.fillStyle='#F2C230';g.fillRect(28,-14,8,28);g.restore();
    if(te>700&&te<2200){g.save();g.globalAlpha=0.55;g.fillStyle='#7EC8F0';for(var d=0;d<40;d++){var dx=c.x+(hash(d,8)-0.5)*TW*2,dy=py+((te-700)/1500)*(c.y-py)*(0.6+hash(d,9)*0.4);ell(dx,dy,TW*0.02,TW*0.05,'#7EC8F0');}g.restore();}
    if(te>1500){g.save();g.globalAlpha=Math.min(1,(te-1500)/500)*Math.min(1,(4200-te)/600)*0.6;g.strokeStyle='#BFE6FF';g.lineWidth=1.2;for(var r=0;r<120;r++){var rx=(hash(r,3)*CW+now*0.3)%CW,ry=(hash(r,5)*CH_+now*0.9)%CH_;g.beginPath();g.moveTo(rx,ry);g.lineTo(rx-4,ry+14);g.stroke();}g.fillStyle='rgba(40,60,90,.15)';g.fillRect(0,0,CW,CH_);g.restore();}}
  if(mom&&mom.stage===3&&me<3000||mom&&mom.stage===4&&me<3000){var tp2=me/3000,a=iso(MID-1.3+tp2*2.6,MID+1.25,0);rrect(a.x-TW*0.16,a.y-TH*0.42,TW*0.32,TH*0.32,4);g.fillStyle=mom.stage===3?'#2E7D32':'#E2483D';g.fill();rrect(a.x+TW*0.1,a.y-TH*0.38,TW*0.1,TH*0.28,3);g.fillStyle='#F4F1EA';g.fill();ell(a.x-TW*0.1,a.y-TH*0.08,TW*0.04,TH*0.04,'#111');ell(a.x+TW*0.12,a.y-TH*0.08,TW*0.04,TH*0.04,'#111');
    if(mom.stage===4){for(var o=0;o<5;o++){ell(a.x-TW*0.12+o*TW*0.05,a.y-TH*0.46,TW*0.03,TW*0.03,'#B23A1E');}}else{for(var o2=0;o2<4;o2++){ell(a.x-TW*0.1+o2*TW*0.05,a.y-TH*0.46,TW*0.025,TW*0.035,'#4CAF50');}}}
  if(mom&&mom.stage===5&&me<1600){FX.shake={t0:now,amt:TW*0.008,dur:200};}
  if(mom&&mom.stage===6&&me<3000){var tw=iso(MID-1.2+me/3000*2.4,MID+1.1,0);g.save();g.translate(tw.x,tw.y-TH*0.1);g.rotate(me/200);g.strokeStyle='#A08050';g.lineWidth=lw(0.006);for(var w=0;w<6;w++){g.beginPath();g.arc(0,0,TW*0.06,w,w+2);g.stroke();}g.restore();}
  if(st>=7){var rise=tr&&tr.stage===7&&te<3000?te/3000:1;g.save();g.globalAlpha=0.75;g.beginPath();g.ellipse(c.x,c.y+TH*0.35,TW*1.3*rise,TH*0.85*rise,0,0,7);var wg=g.createLinearGradient(0,c.y-TH*0.5,0,c.y+TH*1.2);wg.addColorStop(0,'rgba(120,180,200,.9)');wg.addColorStop(1,'rgba(60,120,150,.95)');g.fillStyle=wg;g.fill();g.restore();
    for(var rp=0;rp<4;rp++){var rph=((now/1800)+rp/4)%1;g.strokeStyle='rgba(255,255,255,'+(0.5*(1-rph))+')';g.lineWidth=1;g.beginPath();g.ellipse(c.x+(hash(rp,2)-0.5)*TW,c.y+TH*0.4+(hash(rp,3)-0.5)*TH*0.6,TW*0.1+rph*TW*0.2,TH*0.05+rph*TH*0.1,0,0,7);g.stroke();}
    if(mom&&mom.stage>=7&&me<3200){var bo=iso(MID-1.1+me/3200*2.2,MID+0.7,0);g.beginPath();g.moveTo(bo.x-TW*0.18,bo.y-TH*0.05);g.lineTo(bo.x+TW*0.18,bo.y-TH*0.05);g.lineTo(bo.x+TW*0.12,bo.y+TH*0.07);g.lineTo(bo.x-TW*0.12,bo.y+TH*0.07);g.closePath();g.fillStyle='#8B5A2B';g.fill();drawMiniPerson(bo.x-TW*0.06,bo.y-TH*0.04,TW*0.22,'#E2483D',Math.sin(now/200),false);drawMiniPerson(bo.x+TW*0.06,bo.y-TH*0.04,TW*0.22,'#2F80ED',0,false);}}
  if(tr&&tr.stage===1&&te<1200){g.save();g.globalAlpha=(1-te/1200)*0.5;g.fillStyle='#FF7A2A';g.fillRect(0,0,CW,CH_);g.restore();}
  if(tr&&tr.stage===5&&te<3500){pill(c.x,c.y+TH*1.6,'PELETAKAN BATU PERTAMA',Math.max(11,TW*0.1),'#1F6E52','#fff');var a2=iso(MID-0.6,MID+1.15,0),b2=iso(MID+0.6,MID+1.15,0),cut=te>1400;g.strokeStyle='#D7261E';g.lineWidth=lw(0.02);g.beginPath();g.moveTo(a2.x,a2.y);g.lineTo(cut?(a2.x+b2.x)/2-6:b2.x,cut?(a2.y+b2.y)/2+8:b2.y);if(cut){g.moveTo((a2.x+b2.x)/2+6,(a2.y+b2.y)/2+8);g.lineTo(b2.x,b2.y);}g.stroke();}
  if(tr&&tr.stage===6&&te<1500){var sc=te<300?2-te/300:1;g.save();g.translate(c.x,c.y-TH*0.4);g.scale(sc,sc);g.rotate(-0.1);pill(0,0,'PROYEK DIHENTIKAN',Math.max(12,TW*0.12),'#C62828','#fff');g.restore();}
  // babak 3: hutan mati, Mafia Sawit tertawa pongah sambil meremas kedua tangan
  if(tr&&tr.stage===3&&te>1300&&te<7000){var fa=Math.min(1,(te-1300)/500)*Math.min(1,(7000-te)/600),s=Math.min(CH_*0.62,CW*0.44);renderMafiaAt(CW/2,CH_*0.82,s,fa,now,true);
    g.save();g.globalAlpha=fa;for(var h=0;h<3;h++){var hp=((now/600)+h/3)%1;g.font='900 '+(s*0.09*(0.8+hp*0.4))+'px "Baloo 2", sans-serif';g.textAlign='center';g.fillStyle='rgba(255,217,90,'+(1-hp)+')';g.strokeStyle='rgba(40,20,10,'+(0.8*(1-hp))+')';g.lineWidth=4;var hx=CW/2+(h-1)*s*0.42,hy=CH_*0.2-hp*s*0.15;g.strokeText('HA!',hx,hy);g.fillText('HA!',hx,hy);}
    pill(CW/2,CH_*0.9,'Lahan ini sekarang milik saya.',Math.max(14,s*0.05),'rgba(20,20,28,.9)','#FFD95A');if(te>2500)pill(CW/2,CH_*0.9+Math.max(14,s*0.05)*2,'tap untuk lanjut',Math.max(11,s*0.032),'rgba(255,255,255,.85)',INK);g.restore();}
}
function storyBarLabel(){return ' → '+storyNext();}
