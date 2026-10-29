/* ---------- Politik: cerita berkelanjutan di tengah board (Kas Negara yang menipis memajukan babak) ---------- */
var STV={stage:-1,since:0,trans:null,moment:null,rolls:0,nextAt:2,grow:0.35,hold:0,cough:0,uhuk:null,banner:null,stamp:0};
/* stage 2 (Pemadaman) sequence, ms after the story event */
var SEQ2={rainEnd:8000,gemoy:8000,gemoyEnd:11200,crowd:11200,end:13700};
function stStage(){return (S&&S.story)||0;}
function IP(du,dv){return [MID+du*ISL,MID+dv*ISL];}
function storySync(now){var st=stStage();if(st!==STV.stage){if(STV.stage<0)STV.since=now-45000;else STV.since=now;STV.stage=st;}}
function storyBusy(){return STV.hold>performance.now();}
function lockMs(){return 10000/(typeof SPEED!=='undefined'&&SPEED>0?SPEED:1);}
function storySkip(){return; /* center events are not skippable (design: the middle is the heart of the game) */
  if(!storyBusy())return;var now=performance.now(),tr=STV.trans;STV.hold=0;
  if(tr&&tr.len&&now-tr.t0<tr.len){tr.t0=now-tr.len;tr.skipped=true;}
  if(tr&&tr.stage===3)cam.focusUntil=now+3300;else cam.focusUntil=Math.min(cam.focusUntil,now+700);}
function stOnce(tr,key,te,at,fn){tr.f=tr.f||{};if(tr.f[key]||te<at)return;tr.f[key]=1;if(te<at+700)fn();}
/* called from drainEvents */
function onStoryEvent(e,now){if(typeof vo==='function')setTimeout(function(){vo('story_'+e.stage);},900);var st=e.stage,len=st===2?SEQ2.end:st===3?7000:0;
  STV.trans={stage:st,t0:now,len:len};STV.since=now;STV.stage=st;STV.banner={stage:st,t0:now};
  STV.hold=now+Math.max(len,lockMs());cam.focus={u:MID,v:MID+0.3,zoom:1.75};cam.focusUntil=STV.hold+200;
  if(st===1){play('fire');}
  if(st===2){play('plane');}
  if(st===3){STV.grow=0.35;play('treesFall');setTimeout(function(){play('laugh');},1500);}
  if(st===4){play('horn');setTimeout(function(){play('coins');},800);}
  if(st===5){play('ribbon');}
  if(st===6){STV._stampHit=0;setTimeout(function(){play('windCreak');},1400);}
  if(st===7){play('flood');}
  if(st===8){play('camera');}}
/* periodic moments synced to dice throws: guaranteed on camera */
function onStoryRoll(now){if(!isPol())return;STV.rolls++;if(STV.rolls<STV.nextAt)return;STV.rolls=0;STV.nextAt=2+Math.floor(Math.random()*2);
  var st=stStage(),d0=(typeof DICE_DUR!=='undefined'?DICE_DUR:1100)+300;STV.moment={stage:st,t0:now+d0,v:Math.floor(Math.random()*2)}; /* ambient island moment: plays while the token walks, never locks the game or grabs the camera */
  setTimeout(function(){var m=STV.moment;if(!m)return;var t=performance.now();
    if(st===0)play(m.v?'birds':'uuk');
    else if(st===1){play('cough');setTimeout(function(){play('birds');},500);STV.cough=t+3200;STV.uhuk={pid:S?S.current:0,t0:t};}
    else if(st===2){play('cough');STV.cough=t+1800;STV.uhuk={pid:S?S.current:0,t0:t};}
    else if(st===3){play('horn');STV.grow=Math.min(0.95,STV.grow+0.15);}
    else if(st===4){play('horn');setTimeout(function(){play('coins');},900);}
    else if(st===5){play('pile');}
    else if(st===6)play('windCreak');
    else if(st===7)play('splash');
    else play('camera');},d0);}
function storyCoughing(now){return STV.cough>now;}
/* IKN mangkrak: police tape across the frame + big MANGKRAK stamp that slams in when the babak starts */
function segelTape(a,b,now){var dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy),ang=Math.atan2(dy,dx),hw=Math.max(8,TW*0.1);g.save();g.translate(a.x,a.y);g.rotate(ang);
  g.fillStyle='#F7C600';g.fillRect(0,-hw/2,L,hw);g.save();g.beginPath();g.rect(0,-hw/2,L,hw);g.clip();g.fillStyle='#16161E';for(var x=-hw;x<L+hw;x+=hw*1.6){g.beginPath();g.moveTo(x,-hw/2);g.lineTo(x+hw*0.5,-hw/2);g.lineTo(x+hw*0.2,hw/2);g.lineTo(x-hw*0.3,hw/2);g.fill();}g.restore();
  var fs=hw*0.62;g.font='900 '+fs+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';for(var t=L*0.25;t<L;t+=L*0.5){var tw=g.measureText('DISEGEL').width+fs*0.6;g.fillStyle='#F7C600';g.fillRect(t-tw/2,-hw/2,tw,hw);g.fillStyle='#16161E';g.fillText('DISEGEL',t,fs*0.05);}
  g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1;g.strokeRect(0,-hw/2,L,hw);g.restore();}
function drawSegel(cu,cv,now,te){
  var age=Math.min(1,(now-STV.since)/120000);for(var k=0;k<9;k++){var q=iso(cu-0.5+((k*37)%10)/10,cv-0.35+((k*53)%10)/14,0),hh=TH*(0.06+0.16*age)*(0.6+((k*17)%5)/8);g.strokeStyle='#5E8A2E';g.lineWidth=lw(0.006);g.beginPath();g.moveTo(q.x,q.y);g.lineTo(q.x-TW*0.02,q.y-hh);g.moveTo(q.x,q.y);g.lineTo(q.x+TW*0.015,q.y-hh*0.8);g.moveTo(q.x,q.y);g.lineTo(q.x+TW*0.035,q.y-hh*0.6);g.stroke();}
  segelTape(iso(cu-0.55,cv+0.35,TH*1.25),iso(cu+0.55,cv+0.35,TH*0.05),now);segelTape(iso(cu-0.55,cv+0.35,TH*0.05),iso(cu+0.55,cv+0.35,TH*1.25),now);
  var c=iso(cu,cv+0.1,TH*1.75),sc=1,al=1;if(te<1e8){if(te<0)return;var k2=Math.min(1,te/520);sc=1+(1-k2)*2.6;al=k2;if(te>=520&&!STV._stampHit){STV._stampHit=1;play('appeal');play('slam',0.7);STV.shake=now+380;}}
  var fs=Math.max(12,TW*0.17);g.save();g.translate(c.x,c.y);if(STV.shake>now){g.translate((Math.random()-0.5)*8,(Math.random()-0.5)*5);}g.rotate(-0.16);g.scale(sc,sc);g.globalAlpha=al;g.font='900 '+fs+'px "Baloo 2", Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';
  var tw=g.measureText('MANGKRAK').width+fs*0.8,th=fs*1.35;g.fillStyle='rgba(255,240,235,.85)';rrect(-tw/2,-th/2,tw,th,fs*0.2);g.fill();g.lineWidth=Math.max(2,fs*0.12);g.strokeStyle='#C62828';rrect(-tw/2,-th/2,tw,th,fs*0.2);g.stroke();g.lineWidth=Math.max(1,fs*0.05);rrect(-tw/2+fs*0.14,-th/2+fs*0.14,tw-fs*0.28,th-fs*0.28,fs*0.15);g.stroke();
  g.fillStyle='#C62828';g.fillText('MANGKRAK',0,fs*0.05);g.restore();}
/* ground under the forest */
function storyGround(ic,now){var st=stStage(),c1,c2,K=ISL;
  if(st<=1){c1='#8ED17E';c2='#3F8E4A';}else if(st===2){c1='#9A958A';c2='#5A564E';}else if(st===3){c1='#B08A5A';c2='#7A5A36';}else if(st===4){c1='#9FB56A';c2='#5E7A36';}else if(st===5){c1='#C9C2B0';c2='#9A9282';}else if(st===6){c1='#B9BFA0';c2='#7E8A62';}else{c1='#A9A28A';c2='#6E6A5A';}
  ell(ic.x,ic.y-TH*0.04*K,TW*1.12*K,TH*0.98*K,radialFill(ic.x,ic.y-TH*0.2*K,TW*1.2*K,c1,c2));
  if(st===1){var f=burnFrac(now);g.save();g.globalAlpha=0.5*f;ell(ic.x-TW*0.2*K,ic.y-TH*0.3*K,(TW*0.9*f+TW*0.1)*K,(TH*0.7*f+TH*0.1)*K,'#3A2A1A');g.restore();}
  if(st===3||st===4){g.save();g.beginPath();g.ellipse(ic.x,ic.y-TH*0.04*K,TW*1.08*K,TH*0.94*K,0,0,7);g.clip();g.strokeStyle=st===3?'rgba(90,60,30,.5)':'rgba(60,80,30,.35)';g.lineWidth=lw(0.012);
    for(var r=-6;r<=6;r++){var a=iso(MID-2.6,MID+r*0.33,0),b=iso(MID+2.6,MID+r*0.33,0);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();}g.restore();}}
function burnFrac(now){return Math.min(0.85,0.2+(now-STV.since)/90000);}
function charred(x,y,s,seed){g.fillStyle='#2A1C14';g.fillRect(x-s*0.05,y-s*0.55,s*0.1,s*0.55);g.strokeStyle='#2A1C14';g.lineWidth=Math.max(1,s*0.05);g.beginPath();g.moveTo(x,y-s*0.4);g.lineTo(x-s*0.18,y-s*0.62);g.moveTo(x,y-s*0.3);g.lineTo(x+s*0.16,y-s*0.5);g.stroke();ell(x,y,s*0.2,s*0.06,'rgba(0,0,0,.25)');}
function sawitC(x,y,s,seed){var q=Math.max(4,Math.round(s/2)*2),sw=Math.sin(performance.now()/800+seed)*0.05;g.save();g.translate(x,y);g.rotate(sw);g.scale(s/q,s/q);sprite('sw'+q,q*1.4,q*1.4,q*0.7,q*1.3,function(ox,oy){sawit(ox,oy,q,0);});g.restore();}
function drawCrane(u,v,now,moving,rust){var b=iso(u,v,0),top=iso(u,v,TH*2.4),col=rust?'#B8742A':'#F2B705',dk=rust?'#7A4A1A':'#B88400';
  g.strokeStyle=dk;g.lineWidth=lw(0.02);g.beginPath();g.moveTo(b.x-TW*0.04,b.y);g.lineTo(top.x-TW*0.04,top.y);g.moveTo(b.x+TW*0.04,b.y);g.lineTo(top.x+TW*0.04,top.y);g.stroke();
  g.strokeStyle=col;g.lineWidth=lw(0.008);for(var k=0;k<8;k++){var y0=b.y+(top.y-b.y)*k/8,y1=b.y+(top.y-b.y)*(k+1)/8;g.beginPath();g.moveTo(b.x-TW*0.04,y0);g.lineTo(b.x+TW*0.04,y1);g.stroke();}
  var ang=moving?Math.sin(now/2400)*0.6:0.25,L=TW*0.9,ex=top.x+Math.cos(ang)*L,ey=top.y+Math.sin(ang)*L*0.25;g.strokeStyle=col;g.lineWidth=lw(0.025);g.beginPath();g.moveTo(top.x-Math.cos(ang)*L*0.3,top.y-Math.sin(ang)*L*0.08);g.lineTo(ex,ey);g.stroke();
  g.strokeStyle='#444';g.lineWidth=lw(0.004);var hy=ey+TH*(moving?0.8+Math.sin(now/900)*0.3:0.6);g.beginPath();g.moveTo(ex-TW*0.05,ey);g.lineTo(ex-TW*0.05,hy);g.stroke();rrect(ex-TW*0.08,hy,TW*0.06,TH*0.08,2);g.fillStyle='#7A7A80';g.fill();
  return {x:ex,y:ey};}
function drawFrame(u,v,h,grey){var c=grey?'#A8A8A0':'#D9D2C2';for(var k=0;k<3;k++){box(u-0.25+k*0.25,v,0.06,0.06,h,0,c,shade(c,-0.2));}box(u,v,0.62,0.12,TH*0.08,h,c,shade(c,-0.2));}
function drawFence(u0,v0,u1,v1){var a=iso(u0,v0,0),b=iso(u1,v1,0);g.strokeStyle='#8A8A92';g.lineWidth=lw(0.006);for(var k=0;k<=10;k++){var x=a.x+(b.x-a.x)*k/10,y=a.y+(b.y-a.y)*k/10;g.beginPath();g.moveTo(x,y);g.lineTo(x,y-TH*0.35);g.stroke();}
  [0.12,0.24].forEach(function(h){g.beginPath();g.moveTo(a.x,a.y-TH*h);g.lineTo(b.x,b.y-TH*h);g.stroke();});}
function signBoard(u,v,txt,col){var p=iso(u,v,0);g.strokeStyle='#5A4030';g.lineWidth=lw(0.01);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x,p.y-TH*0.7);g.stroke();pill(p.x,p.y-TH*0.85,txt,Math.max(8,TW*0.06),col||'#FFFDF6',col?'#fff':INK);}
function maskedWarga(u,v,now,k){var p=iso(u,v,0),s=TW*0.3,cough=storyCoughing(now)||Math.sin(now/700+k*2)>0.92;var bend=cough?Math.sin(now/90)*s*0.03:0;
  drawMiniPerson(p.x+bend,p.y,s,k%2?'#2F80ED':'#E2483D',0,false);g.fillStyle='#F4F4F4';g.fillRect(p.x-s*0.09+bend,p.y-s*0.68,s*0.18,s*0.07);
  if(cough){for(var q=0;q<3;q++){var ph=((now/400)+q/3)%1;ell(p.x+s*(0.2+ph*0.5)+bend,p.y-s*(0.7+ph*0.2),s*(0.05+ph*0.1),s*(0.05+ph*0.1),'rgba(160,160,160,'+(0.7*(1-ph))+')');}}}
var IKN_AT=IP(-0.55,-0.1),CRANE_AT=IP(0.25,-0.5),FACT_AT=IP(-0.85,0.65);
function storyEx(st){var ex=[];
  if(st===3)ex.push([MID+1.25,MID+1.25,0.5,0.3,1.0]);
  if(st===4||st===5)ex.push([FACT_AT[0],FACT_AT[1],0.5,0.45,1.0]);
  if(st>=5)ex.push([IKN_AT[0],IKN_AT[1],0.62,0.5,1.3],[CRANE_AT[0],CRANE_AT[1],0.3,0.3,1.1]);
  if(st===8)ex.push([MID+0.5,MID+1.6,0.5,0.3,1.0]);
  return ex;}
function storyItems(now,items){storySync(now);var st=stStage(),t=now/1000,f=burnFrac(now),tr0=STV.trans,te=tr0?(now-tr0.t0):1e9,ex=storyEx(st);
  var fall=st===3&&te<1500?te/1500:1;
  FOREST.forEach(function(tr,idx){if(!treeAt(tr,ex))return;items.push({d:tr.u+tr.v,f:function(){var q=iso(tr.u,tr.v,0),s=TW*tr.s,sway=Math.sin(t*0.9+idx)*s*0.02;
    if(st===0){drawRainTree(q.x+sway,q.y,s);}
    else if(st===1){if(tr.o<f){drawRainTree(q.x,q.y,s,true);if(tr.o>f-0.32)fire(q.x,q.y-s*0.6,s*0.9,now,idx);}else drawRainTree(q.x+sway,q.y,s);}
    else if(st===2){charred(q.x,q.y,s,idx);if(tr2(idx,now))smokeWisp(q.x,q.y-s*0.5,s,now,idx);if(tr0&&tr0.stage===2&&te<2500&&idx%2===0)fire(q.x,q.y-s*0.3,s*0.6*(1-te/2500),now,idx);}
    else if(st===3){if(fall<1&&tr.o<fall*1.2){g.save();g.translate(q.x,q.y);g.rotate(Math.min(1,(fall*1.2-tr.o)*3)*1.3);charred(0,0,s,idx);g.restore();}else if(fall<1)charred(q.x,q.y,s,idx);else{var gs=STV.grow*(0.8+tr.o*0.3);g.save();g.translate(q.x,q.y);g.scale(gs,gs);g.translate(-q.x,-q.y);sawitC(q.x,q.y,s*0.9,idx);g.restore();}}
    else if(st===4){sawitC(q.x,q.y,s*1.0,idx);}
    else if(st===5){if(tr.o>0.55)sawitC(q.x,q.y,s*0.95,idx);}
    else if(st===6){if(tr.o>0.75)sawitC(q.x,q.y,s*0.8,idx);else if(tr.o>0.5){ell(q.x,q.y,s*0.12,s*0.05,'#6E8A3A');}}
  }});});
  // workers / warga / landmarks per babak (kept on the lower half of the island, clear of the Mafia)
  if(st===1||st===2){[IP(-0.35,1.0),IP(0.3,1.12)].forEach(function(w,k){items.push({d:w[0]+w[1],f:function(){maskedWarga(w[0],w[1],now,k);}});});}
  if(st===3){[IP(-0.5,0.9),IP(0.15,1.05)].forEach(function(w,k){items.push({d:w[0]+w[1],f:function(){var p=iso(w[0],w[1],0),s=TW*0.3,dig=Math.abs(Math.sin(now/300+k));drawMiniPerson(p.x,p.y,s,'#2E7D32',0,false);g.strokeStyle='#6A4A2A';g.lineWidth=lw(0.01);g.beginPath();g.moveTo(p.x+s*0.2,p.y-s*0.5);g.lineTo(p.x+s*0.35,p.y-s*0.05*dig);g.stroke();}});});
    items.push({d:2*MID+2.4,f:function(){var a=IP(0.45,1.2),b=IP(1.2,0.45),sb=IP(1.1,1.05);drawFence(a[0],a[1],b[0],b[1]);signBoard(sb[0],sb[1],'KONSESI PT SAWIT JAYA ABADI','#7A1A1A');}});}
  if(st===4||st===5){items.push({d:FACT_AT[0]+FACT_AT[1]+0.3,f:function(){var mu=FACT_AT[0],mv=FACT_AT[1];aoShadow(mu,mv,0.6,0.5,0);box(mu,mv,0.56,0.44,TH*0.48,0,'#B0B4BA','#8A8E96');box(mu+0.14,mv-0.12,0.12,0.12,TH*1.05,TH*0.48,'#8A8E96','#6A6E76');var ch=iso(mu+0.14,mv-0.12,TH*1.53);smoke(ch.x,ch.y,TW*0.1,9);
      var bag=iso(mu-0.05,mv+0.4,0),bs=TW*(0.1+Math.min(0.12,(S.kas||0)/(S.kasMax||250000)*0.12));g.beginPath();g.ellipse(bag.x,bag.y-bs,bs*0.9,bs,0,0,7);g.fillStyle=radialFill(bag.x,bag.y-bs*1.2,bs,'#E9C98A','#9A6A3A');g.fill();g.fillStyle='#6B4226';g.font='900 '+(bs*0.8)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('Rp',bag.x,bag.y-bs);}});}
  if(st>=5){items.push({d:IKN_AT[0]+IKN_AT[1]+0.4,f:function(){var cu=IKN_AT[0],cv=IKN_AT[1];if(st===5)drawIKN(cu,cv,now);else drawFrame(cu,cv,TH*1.1,true);var tip=drawCrane(CRANE_AT[0],CRANE_AT[1],now,st===5,st>=6);STV.craneTip=tip;
      if(st===6)drawSegel(cu,cv,now,(tr0&&tr0.stage===6)?te:1e9);
      var sg=IP(-0.1,1.0);if(st>=6)signBoard(sg[0],sg[1],'Proyek Strategis (dalam peninjauan)');else signBoard(sg[0],sg[1],'IBU KOTA BARU','#1F6E52');}});}
  if(st===8){items.push({d:2*MID+2.2,f:function(){var o=IP(0.1,0.9),p=iso(o[0],o[1],0),s=TW*0.34;ell(p.x+s*0.3,p.y,s*0.2,s*0.07,'#6E8A3A');g.strokeStyle='#2E7D32';g.lineWidth=lw(0.01);g.beginPath();g.moveTo(p.x+s*0.3,p.y);g.lineTo(p.x+s*0.3,p.y-s*0.3);g.stroke();ell(p.x+s*0.25,p.y-s*0.32,s*0.08,s*0.05,'#4CAF50');ell(p.x+s*0.36,p.y-s*0.3,s*0.08,s*0.05,'#4CAF50');
      drawMiniPerson(p.x,p.y,s,'#20283A',Math.sin(now/300),false);var co=IP(0.6,1.2),cm=iso(co[0],co[1],0);drawMiniPerson(cm.x,cm.y,s*0.9,'#555',0,false);rrect(cm.x-s*0.12,cm.y-s*0.75,s*0.2,s*0.14,2);g.fillStyle='#111';g.fill();if(Math.floor(now/400)%3===0){var fl=g.createRadialGradient(cm.x,cm.y-s*0.7,0,cm.x,cm.y-s*0.7,s*0.6);fl.addColorStop(0,'rgba(255,255,255,.9)');fl.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=fl;g.fillRect(cm.x-s*0.6,cm.y-s*1.3,s*1.2,s*1.2);}}});}
  // orangutan, the emotional thread of the story
  items.push({d:2*MID+2.6,f:function(){if(st!==7)drawOrangutanStory(now,st);}});
}
function tr2(idx,now){return (Math.floor(now/2000)+idx)%5===0;}
function smokeWisp(x,y,s,now,seed){for(var k=0;k<3;k++){var ph=((now/1600)+k/3+seed*0.07)%1;smokePuff(x+Math.sin(ph*6+seed)*s*0.15,y-ph*s*1.2,s*(0.1+ph*0.2),0.5*(1-ph));}}
/* one soft smoke puff: three overlapping radial blobs, light on top, shadowed underneath */
function smokePuff(x,y,r,a,warm){if(a<=0.01||r<=0.5)return;var lit=warm?'214,206,196':'212,210,208',mid=warm?'150,142,134':'150,150,152',dk=warm?'98,92,88':'96,98,102';
  [[0.18,0.22,0.9,dk,0.45],[-0.12,-0.05,1.0,mid,0.6],[0.05,-0.22,0.72,lit,0.75]].forEach(function(b){var cx=x+b[0]*r,cy=y+b[1]*r,rr=r*b[2],gr=g.createRadialGradient(cx-rr*0.2,cy-rr*0.25,rr*0.05,cx,cy,rr);
    gr.addColorStop(0,'rgba('+b[3]+','+(a*b[4])+')');gr.addColorStop(0.55,'rgba('+b[3]+','+(a*b[4]*0.55)+')');gr.addColorStop(1,'rgba('+b[3]+',0)');g.fillStyle=gr;g.beginPath();g.arc(cx,cy,rr,0,7);g.fill();});}
function drawOrangutanStory(now,st){var o=IP(0.85,0.9),u=o[0],v=o[1],z=0,mood='happy',caged=false,lab=null,mom=STV.moment&&now>STV.moment.t0&&now-STV.moment.t0<2600?STV.moment:null;
  if(st===0){z=Math.abs(Math.sin(now/600))*TH*0.15;if(mom&&!mom.v){z+=Math.abs(Math.sin((now-mom.t0)/120))*TH*0.3;lab='uuk uuk!';}}
  else if(st===1){mood='cry';z=TH*0.6;lab=Math.sin(now/1500)>0.3?'huhu...':null;}
  else if(st===2){mood='sad';lab=Math.sin(now/2100)>0.6?'...':null;}
  else if(st===3){mood='sad';o=IP(1.05,1.0);u=o[0];v=o[1];lab='?';}
  else if(st===4||st===5){mood='sad';caged=true;o=IP(1.0,1.0);u=o[0];v=o[1];}
  else if(st===6&&STV.craneTip){mood='sad';}
  else if(st>=7){mood='sad';}
  if(st===6&&STV.craneTip){var tp=STV.craneTip;g.save();var q0=iso(u,v,0);g.translate(tp.x-q0.x,tp.y-q0.y+TH*0.05);drawOrangutan(u,v,now,1,false);g.restore();return;}
  if(st===7){var lq=iso(u,v,0);rrect(lq.x-TW*0.18,lq.y-TH*0.02,TW*0.36,TH*0.1,TH*0.05);g.fillStyle='#7A4A2A';g.fill();z=Math.sin(now/700)*TH*0.04;}
  g.save();var q=iso(u,v,0);g.translate(0,-z);drawOrangutan(u,v,now,mood==='happy'?0:1,mood==='cry');g.restore();
  if(caged){var c=iso(u,v,0),s=TW*0.3;g.strokeStyle='#5A5C66';g.lineWidth=lw(0.006);for(var k=-3;k<=3;k++){g.beginPath();g.moveTo(c.x+k*s*0.12,c.y+s*0.05);g.lineTo(c.x+k*s*0.12,c.y-s*1.05);g.stroke();}rrect(c.x-s*0.42,c.y-s*1.1,s*0.84,s*0.08,2);g.fillStyle='#5A5C66';g.fill();pill(c.x,c.y-s*1.3,'KONSERVASI',Math.max(7,TW*0.05),'#2E7D32','#fff');}
  if(lab){pill(q.x+TW*0.15,q.y-z-TW*0.32,lab,Math.max(8,TW*0.07),'#fff',INK);}}
function drawWaterBomber(x,y,s,dir){g.save();g.translate(x,y);g.scale(dir,1);g.lineJoin='round';
  ell(0,s*0.9,s*0.9,s*0.12,'rgba(20,30,40,.12)');
  g.beginPath();g.moveTo(-s*0.95,-s*0.02);g.quadraticCurveTo(-s*0.9,-s*0.2,-s*0.5,-s*0.2);g.lineTo(s*0.62,-s*0.16);g.quadraticCurveTo(s*1.0,-s*0.12,s*1.02,0);g.quadraticCurveTo(s*0.95,s*0.14,s*0.55,s*0.16);g.lineTo(-s*0.6,s*0.12);g.closePath();
  var bg=g.createLinearGradient(0,-s*0.2,0,s*0.16);bg.addColorStop(0,'#FFFFFF');bg.addColorStop(1,'#D8DEE6');g.fillStyle=bg;g.fill();g.strokeStyle='#5A6470';g.lineWidth=Math.max(1,s*0.03);g.stroke();
  g.fillStyle='#E2483D';g.fillRect(-s*0.7,-s*0.02,s*1.5,s*0.07);
  g.beginPath();g.moveTo(-s*0.75,-s*0.12);g.lineTo(-s*0.95,-s*0.55);g.lineTo(-s*0.72,-s*0.55);g.lineTo(-s*0.5,-s*0.16);g.closePath();g.fillStyle='#E2483D';g.fill();g.stroke();
  g.beginPath();g.moveTo(-s*0.1,-s*0.18);g.lineTo(s*0.25,-s*0.18);g.lineTo(s*0.05,-s*0.62);g.lineTo(-s*0.18,-s*0.62);g.closePath();g.fillStyle='#F2F4F7';g.fill();g.stroke();
  [0.15,0.35].forEach(function(px){ell(px*s+s*0.3,-s*0.06,s*0.045,s*0.04,'#4A8BC2');});
  ell(s*0.82,-s*0.06,s*0.09,s*0.06,'#4A8BC2');
  rrect(-s*0.25,s*0.1,s*0.5,s*0.14,s*0.05);g.fillStyle='#F2C230';g.fill();g.stroke();
  g.restore();}
/* screen-space overlay: smoke, rain, plane, flood, transitions, the Mafia */
function storyOverlay(now){if(!isPol()||!S)return;var st=stStage(),c=iso(MID,MID,0),K=ISL,tr=STV.trans,te=tr?now-tr.t0:1e9,mom=STV.moment&&now>STV.moment.t0?STV.moment:null,me=mom?now-mom.t0:1e9;
  if(st===1){var bf=burnFrac(now),hz=0.1+0.09*bf;g.save();var hg=g.createLinearGradient(0,0,0,CH_);hg.addColorStop(0,'rgba(128,126,124,'+(hz*1.4)+')');hg.addColorStop(0.55,'rgba(165,162,158,'+hz+')');hg.addColorStop(1,'rgba(196,192,186,'+(hz*0.55)+')');g.fillStyle=hg;g.fillRect(0,0,CW,CH_);
    var gl=g.createRadialGradient(c.x,c.y,TW*0.2,c.x,c.y,TW*2.4);gl.addColorStop(0,'rgba(255,130,50,'+(0.16*bf)+')');gl.addColorStop(1,'rgba(255,130,50,0)');g.fillStyle=gl;g.fillRect(c.x-TW*2.4,c.y-TW*2.4,TW*4.8,TW*4.8);g.restore();
    var src=[IP(-0.6,-0.4),IP(0.35,-0.75),IP(-0.2,0.25),IP(0.75,0.05),IP(-0.95,0.45),IP(0.15,0.9)],nsrc=Math.max(2,Math.ceil(src.length*bf/0.85));
    for(var k=0;k<nsrc;k++){var sp=iso(src[k][0],src[k][1],TH*0.6);for(var j=0;j<5;j++){var ph=((now/6400)+j/5+k*0.17)%1,wind=ph*ph*TW*1.4+Math.sin(now/1300+k+j)*TW*0.06,rr=TW*(0.12+ph*0.62),al=0.6*Math.pow(Math.sin(Math.PI*Math.min(1,ph*1.15)),0.7)*(1-ph*0.35);
      smokePuff(sp.x+wind,sp.y-ph*TH*5.2,rr,al,ph<0.25);}}}
  if(mom&&mom.stage===1&&me<3000){var p=me/3000;g.save();g.globalAlpha=Math.sin(Math.PI*p)*0.5;var bx=-CW*0.4+p*CW*1.8;var gr=g.createLinearGradient(bx-CW*0.4,0,bx+CW*0.4,0);gr.addColorStop(0,'rgba(170,168,165,0)');gr.addColorStop(0.5,'rgba(170,168,165,1)');gr.addColorStop(1,'rgba(170,168,165,0)');g.fillStyle=gr;g.fillRect(0,0,CW,CH_);g.restore();
    for(var sw=0;sw<7;sw++){var sx=bx+(hash(sw,31)-0.5)*CW*0.7,sy=CH_*(0.25+hash(sw,32)*0.6);smokePuff(sx,sy,CW*0.09*(0.7+hash(sw,33)*0.6),0.55*Math.sin(Math.PI*p));}}
  if(mom&&((mom.stage===1)||(mom.stage===0&&mom.v))&&me<2600){for(var b=0;b<7;b++){var bp=me/2600,ang=b/7*Math.PI*2,bx2=c.x+Math.cos(ang)*TW*(0.3+bp*3),by2=c.y-TH*0.6+Math.sin(ang)*TH*(0.3+bp*1.5)-bp*TH*2,fl=Math.sin(now/50+b)*TW*0.04;g.strokeStyle=mom.stage===1?'#2A2A30':'#B23A1E';g.lineWidth=lw(0.012);g.beginPath();g.moveTo(bx2-TW*0.06,by2-fl);g.lineTo(bx2,by2);g.lineTo(bx2+TW*0.06,by2-fl);g.stroke();}}
  if(st===2&&tr&&tr.stage===2&&te<SEQ2.rainEnd+800){
    stOnce(tr,'rain1',te,900,function(){play('rain');});stOnce(tr,'rain2',te,4600,function(){play('rain');});
    var py=CH_*0.3;if(te<2600){var pp=Math.min(1,te/2400),px=-CW*0.15+pp*CW*1.3;drawWaterBomber(px,py,Math.max(30,TW*0.55),1);
      if(te>800&&te<2400){g.save();for(var d=0;d<46;d++){var dt=(te-800)/1600,dx=c.x+(hash(d,8)-0.5)*TW*2.4,dy=py+TW*0.2+dt*(c.y-py)*(0.6+hash(d,9)*0.5);ell(dx,dy,TW*0.025,TW*0.06,'rgba(126,200,240,'+(0.75*(1-dt*0.5))+')');}g.restore();}}
    if(te>1500){var ra=Math.min(1,(te-1500)/600)*Math.min(1,(SEQ2.rainEnd+800-te)/800);g.save();g.globalAlpha=ra*0.32;g.fillStyle='#2A3A55';g.fillRect(0,0,CW,CH_);g.globalAlpha=ra*0.7;g.strokeStyle='#CFEAFF';g.lineWidth=1.3;
      for(var r=0;r<170;r++){var rx=(hash(r,3)*CW*1.2+now*0.35)%(CW*1.2)-CW*0.1,ry=(hash(r,5)*CH_+now*1.1)%CH_;g.beginPath();g.moveTo(rx,ry);g.lineTo(rx-5,ry+16);g.stroke();}
      g.globalAlpha=ra*0.6;for(var sp2=0;sp2<14;sp2++){var sph=((now/500)+hash(sp2,7))%1,spx=c.x+(hash(sp2,8)-0.5)*TW*3.2,spy=c.y+(hash(sp2,9)-0.5)*TH*2.6;g.strokeStyle='rgba(220,240,255,'+(1-sph)+')';g.beginPath();g.ellipse(spx,spy,TW*0.05*sph+1,TH*0.04*sph+1,0,0,7);g.stroke();}g.restore();}}
  if(mom&&mom.stage===3&&me<3000||mom&&mom.stage===4&&me<3000){var tp2=me/3000,ta=IP(-1.3+tp2*2.6,1.25),a=iso(ta[0],ta[1],0);rrect(a.x-TW*0.16,a.y-TH*0.42,TW*0.32,TH*0.32,4);g.fillStyle=mom.stage===3?'#2E7D32':'#E2483D';g.fill();rrect(a.x+TW*0.1,a.y-TH*0.38,TW*0.1,TH*0.28,3);g.fillStyle='#F4F1EA';g.fill();ell(a.x-TW*0.1,a.y-TH*0.08,TW*0.04,TH*0.04,'#111');ell(a.x+TW*0.12,a.y-TH*0.08,TW*0.04,TH*0.04,'#111');
    if(mom.stage===4){for(var o=0;o<5;o++){ell(a.x-TW*0.12+o*TW*0.05,a.y-TH*0.46,TW*0.03,TW*0.03,'#B23A1E');}}else{for(var o2=0;o2<4;o2++){ell(a.x-TW*0.1+o2*TW*0.05,a.y-TH*0.46,TW*0.025,TW*0.035,'#4CAF50');}}}
  if(mom&&mom.stage===5&&me<1600){FX.shake={t0:now,amt:TW*0.008,dur:200};}
  if(mom&&mom.stage===6&&me<3000){var twp=IP(-1.2+me/3000*2.4,1.1),tw=iso(twp[0],twp[1],0);g.save();g.translate(tw.x,tw.y-TH*0.1);g.rotate(me/200);g.strokeStyle='#A08050';g.lineWidth=lw(0.006);for(var w=0;w<6;w++){g.beginPath();g.arc(0,0,TW*0.06,w,w+2);g.stroke();}g.restore();}
  if(st===7){var rise=tr&&tr.stage===7&&te<3000?Math.max(0.02,te/3000):1;g.save();g.globalAlpha=0.75;g.beginPath();g.ellipse(c.x,c.y+TH*0.35*K,TW*1.3*K*rise,TH*0.85*K*rise,0,0,7);var wg=g.createLinearGradient(0,c.y-TH*0.5*K,0,c.y+TH*1.2*K);wg.addColorStop(0,'rgba(120,180,200,.9)');wg.addColorStop(1,'rgba(60,120,150,.95)');g.fillStyle=wg;g.fill();g.restore();STV.orOnTop=1;drawOrangutanStory(now,7);STV.orOnTop=0;
    for(var rp=0;rp<6;rp++){var rph=((now/1800)+rp/6)%1;g.strokeStyle='rgba(255,255,255,'+(0.5*(1-rph))+')';g.lineWidth=1;g.beginPath();g.ellipse(c.x+(hash(rp,2)-0.5)*TW*1.5,c.y+TH*0.5+(hash(rp,3)-0.5)*TH*0.9,TW*0.1+rph*TW*0.2,TH*0.05+rph*TH*0.1,0,0,7);g.stroke();}
    if(mom&&mom.stage>=7&&me<3200){var bq=IP(-1.1+me/3200*2.2,0.7),bo=iso(bq[0],bq[1],0);g.beginPath();g.moveTo(bo.x-TW*0.18,bo.y-TH*0.05);g.lineTo(bo.x+TW*0.18,bo.y-TH*0.05);g.lineTo(bo.x+TW*0.12,bo.y+TH*0.07);g.lineTo(bo.x-TW*0.12,bo.y+TH*0.07);g.closePath();g.fillStyle='#8B5A2B';g.fill();drawMiniPerson(bo.x-TW*0.06,bo.y-TH*0.04,TW*0.22,'#E2483D',Math.sin(now/200),false);drawMiniPerson(bo.x+TW*0.06,bo.y-TH*0.04,TW*0.22,'#2F80ED',0,false);}}
  if(tr&&tr.stage===1&&te<1200){g.save();g.globalAlpha=(1-te/1200)*0.5;g.fillStyle='#FF7A2A';g.fillRect(0,0,CW,CH_);g.restore();}
  if(tr&&tr.stage===5&&te<3500){pill(c.x,c.y+TH*2.2,'PELETAKAN BATU PERTAMA',Math.max(11,TW*0.1),'#1F6E52','#fff');var ra2=IP(-0.6,1.15),rb2=IP(0.6,1.15),a2=iso(ra2[0],ra2[1],0),b2=iso(rb2[0],rb2[1],0),cut=te>1400;g.strokeStyle='#D7261E';g.lineWidth=lw(0.02);g.beginPath();g.moveTo(a2.x,a2.y);g.lineTo(cut?(a2.x+b2.x)/2-6:b2.x,cut?(a2.y+b2.y)/2+8:b2.y);if(cut){g.moveTo((a2.x+b2.x)/2+6,(a2.y+b2.y)/2+8);g.lineTo(b2.x,b2.y);}g.stroke();}
  if(tr&&tr.stage===6&&te<1500){var sc=te<300?2-te/300:1;g.save();g.translate(c.x,c.y-TH*0.4);g.scale(sc,sc);g.rotate(-0.1);pill(0,0,'PROYEK DIHENTIKAN',Math.max(12,TW*0.12),'#C62828','#fff');g.restore();}
  // babak 3: hutan mati, Mafia Sawit tertawa pongah sambil meremas kedua tangan
  if(tr&&tr.stage===3&&te>1300&&te<7000){var fa=Math.min(1,(te-1300)/500)*Math.min(1,(7000-te)/600),s=Math.min(CH_*0.62,CW*0.44);renderMafiaAt(CW/2,CH_*0.82,s,fa,now,true);
    g.save();g.globalAlpha=fa;for(var h=0;h<3;h++){var hp=((now/600)+h/3)%1;g.font='900 '+(s*0.09*(0.8+hp*0.4))+'px "Baloo 2", sans-serif';g.textAlign='center';g.fillStyle='rgba(255,217,90,'+(1-hp)+')';g.strokeStyle='rgba(40,20,10,'+(0.8*(1-hp))+')';g.lineWidth=4;var hx=CW/2+(h-1)*s*0.62,hy=CH_*0.82-s*0.78-hp*s*0.15+(h===1?-s*0.12:0);g.strokeText('HA!',hx,hy);g.fillText('HA!',hx,hy);}
    if(tr&&!(tr.f&&tr.f.mafiaVo)){tr.f=tr.f||{};tr.f.mafiaVo=1;vo('mafia_lahan');}
    pill(CW/2,CH_*0.9,'Lahan ini sekarang milik saya.',Math.max(14,s*0.05),'rgba(20,20,28,.9)','#FFD95A');if(te>2500)pill(CW/2,CH_*0.9+Math.max(14,s*0.05)*2,'tap untuk lanjut',Math.max(11,s*0.032),'rgba(255,255,255,.85)',INK);g.restore();}
}
/* drawn from fxDraw (on top of the Mafia, below HUD overlays) */
function storyFx(now){if(!isPol()||!S)return;var tr=STV.trans,te=tr?now-tr.t0:1e9;
  // uhuk uhuk: the current player coughs in the smoke
  var uh=STV.uhuk;if(uh){var ut=now-uh.t0;if(ut>2500)STV.uhuk=null;else if(S.players[uh.pid]&&!S.players[uh.pid].bankrupt){var tp=tokenPos(uh.pid,now),b=iso(tp.u,tp.v,tp.z+TW*0.98),sc=Math.min(1,ut/180),jx=Math.sin(now/45)*TW*0.012,fs=Math.max(12,TW*0.13);
    bubble(b.x+jx,b.y,'uhuk uhuk!',fs,TW*3,(ut>2200?(2500-ut)/300:1)*sc);}}
  // stage 2: Si Gemoy apologises, everyone scoffs
  if(tr&&tr.stage===2&&te<SEQ2.end){
    if(te>SEQ2.gemoy-200){var dimA=Math.min(1,(te-SEQ2.gemoy+200)/400)*Math.min(1,(SEQ2.end-te)/400);g.save();g.globalAlpha=dimA*0.35;g.fillStyle='#0E0E1A';g.fillRect(0,0,CW,CH_);g.restore();}
    if(te>SEQ2.gemoy&&te<SEQ2.gemoyEnd+400){var gt=te-SEQ2.gemoy,gs=Math.min(CH_*0.8,CW*0.4),rise=easeOutB(Math.min(1,gt/600)),out=te>SEQ2.gemoyEnd?(te-SEQ2.gemoyEnd)/400:0,by=CH_+gs*0.06+(1-rise)*gs*0.9+out*gs*0.9;
      stOnce(tr,'gemoy',te,SEQ2.gemoy,function(){play('pop');setTimeout(function(){play('semaksimal');},700);});
      drawChar('gemoy',CW*0.5,by,gs,null,{expr:'happy',damkar:true});
      if(gt>450&&!out){var fs2=Math.max(14,gs*0.055);bubble(CW*0.5+gs*0.12,by-gs*0.98,'Kami sudah berusaha semaksimal mungkin.',fs2,Math.min(CW*0.5,fs2*16),Math.min(1,(gt-450)/200));}}
    if(te>SEQ2.crowd){var ct=te-SEQ2.crowd,ps=S.players.filter(function(p){return !p.bankrupt;}),n=ps.length,cs=Math.min(CH_*0.5,CW/(n+0.8)*0.95),rise2=easeOutB(Math.min(1,ct/450)),fade=Math.min(1,(SEQ2.end-te)/300);
      stOnce(tr,'omon',te,SEQ2.crowd,function(){play('omon');});
      g.save();g.globalAlpha=fade;ps.forEach(function(p,k){var x=CW*0.5+(k-(n-1)/2)*cs*0.95,jump=Math.abs(Math.sin(now/160+k*1.7))*cs*0.04,by2=CH_+cs*0.1+(1-rise2)*cs*1.1-jump;drawChar(p.char,x,by2,cs,p.color,{expr:'tease'});});
      if(ct>300){var fs3=Math.max(14,cs*0.09);bubble(CW*0.5,CH_+cs*0.1-cs*1.02,'Alah, omon-omon doang lu!',fs3,Math.min(CW*0.6,fs3*14),Math.min(1,(ct-300)/180));}g.restore();}
    if(te>2500&&!STV.banner){var tb2=$('topbar'),ty2=tb2&&cv?Math.max(0,tb2.getBoundingClientRect().bottom-cv.getBoundingClientRect().top):40;pill(CW/2,ty2+Math.max(18,CH_*0.04),Math.max(1,Math.ceil((STV.hold-performance.now())/1000))+' detik',Math.max(11,CH_*0.024),'rgba(255,255,255,.88)',INK);}}
  // stage 3: stamp once the planting transition is over
  if(tr&&tr.stage===3&&te>=7000&&!tr.stamped){tr.stamped=true;STV.stamp=now;play('stamp');FX.shake={t0:now,amt:TW*0.02,dur:250};}
  if(STV.stamp&&now-STV.stamp<3000)drawSawitStamp(now-STV.stamp);
  storyBanner(now);}
function easeOutB(x){var c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);}
function bubble(x,y,text,fs,maxW,al){g.save();g.globalAlpha*=Math.max(0,Math.min(1,al));if(typeof speech==='function')speech(x,y,text,fs,maxW,{W:CW});else pill(x,y-fs,text,fs,'#fff',INK);g.restore();}
function drawSawitStamp(t){var c=iso(MID,MID,0),p=t/3000,sc=t<220?2.4-1.4*(t/220):1,al=p>0.85?(1-p)/0.15:1,fs=Math.max(14,Math.min(TW*0.2,CW*0.032));
  g.save();g.globalAlpha=al;g.translate(c.x,c.y-TH*0.6);g.rotate(-0.12);g.scale(sc,sc);g.font='900 '+fs+'px "Baloo 2", Nunito, sans-serif';var l1='LAHAN INI TELAH',l2='DITANAM SAWIT',w=Math.max(g.measureText(l1).width,g.measureText(l2).width)+fs*1.4,h=fs*3.1;
  rrect(-w/2,-h/2,w,h,fs*0.35);g.fillStyle='rgba(255,248,236,.86)';g.fill();g.strokeStyle='#B3261E';g.lineWidth=fs*0.16;g.stroke();rrect(-w/2+fs*0.25,-h/2+fs*0.25,w-fs*0.5,h-fs*0.5,fs*0.22);g.lineWidth=fs*0.06;g.stroke();
  g.fillStyle='#B3261E';g.textAlign='center';g.textBaseline='middle';g.fillText(l1,0,-fs*0.55);g.fillText(l2,0,fs*0.6);
  g.globalCompositeOperation='destination-out';for(var k=0;k<26;k++){ell((hash(k,41)-0.5)*w,(hash(k,42)-0.5)*h,fs*0.06+hash(k,43)*fs*0.1,fs*0.04+hash(k,44)*fs*0.06,'rgba(0,0,0,.55)');}
  g.restore();}
/* big banner when a new babak starts: name + one line, ~4 s */
var BABAK_COL=['#2E7D32','#E2483D','#2F80ED','#7A4A1A','#8E9A2A','#1F6E52','#6B5A45','#1E6FE8','#2E9E5B'];
function storyBanner(now){var bn=STV.banner;if(!bn)return;var t=now-bn.t0,D=4200;if(t>D){STV.banner=null;return;}if(t<0)return;
  var info=(typeof STORY!=='undefined'&&STORY[bn.stage])||{n:'Babak '+bn.stage},nm=info.n||'',tx=info.t||'',col=BABAK_COL[bn.stage%BABAK_COL.length];
  var tb=$('topbar'),top=tb&&cv?Math.max(0,tb.getBoundingClientRect().bottom-cv.getBoundingClientRect().top):56;top=Math.max(8,top)+8;
  var inn=easeOutB(Math.min(1,t/420)),out=t>D-400?(t-(D-400))/400:0,fsT=Math.max(20,Math.min(CW*0.05,CH_*0.075)),fsS=Math.max(12,fsT*0.42),fsE=Math.max(10,fsT*0.3);
  g.save();g.font='900 '+fsS+'px Nunito, sans-serif';var lines=tx?wrapLn(tx,Math.min(CW*0.8,fsS*36)):[],twd=0;lines.forEach(function(l){twd=Math.max(twd,g.measureText(l).width);});
  g.font='800 '+fsT+'px "Baloo 2", Nunito, sans-serif';var nw=g.measureText(nm.toUpperCase()).width,w=Math.min(CW-24,Math.max(nw,twd)+fsT*1.6),h=fsE*1.6+fsT*1.15+lines.length*fsS*1.3+fsT*0.55;
  var x=CW/2,y=top+(1-inn)*-(h+top)-out*(h+top);g.globalAlpha=1-out*0.6;
  g.translate(x,y);rrect(-w/2,fsT*0.12,w,h,fsT*0.45);g.fillStyle='rgba(0,0,0,.25)';g.fill();rrect(-w/2,0,w,h,fsT*0.45);g.fillStyle='rgba(22,20,30,.94)';g.fill();
  g.save();rrect(-w/2,0,w,h,fsT*0.45);g.clip();g.fillStyle=col;g.fillRect(-w/2,0,fsT*0.28,h);g.restore();
  var eb='BABAK '+bn.stage;g.font='900 '+fsE+'px Nunito, sans-serif';var ew=g.measureText(eb).width+fsE*1.2;rrect(-ew/2,fsE*0.45,ew,fsE*1.35,fsE*0.67);g.fillStyle=col;g.fill();g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';g.fillText(eb,0,fsE*1.14);
  g.font='800 '+fsT+'px "Baloo 2", Nunito, sans-serif';g.fillStyle='#FFD95A';g.fillText(nm.toUpperCase(),0,fsE*1.6+fsT*0.62);
  g.font='800 '+fsS+'px Nunito, sans-serif';g.fillStyle='rgba(255,255,255,.92)';lines.forEach(function(l,k){g.fillText(l,0,fsE*1.6+fsT*1.2+fsS*0.7+k*fsS*1.3);});
  g.restore();}
function wrapLn(text,maxW){var words=text.split(' '),lines=[],cur='';words.forEach(function(wd){var t=cur?cur+' '+wd:wd;if(g.measureText(t).width>maxW&&cur){lines.push(cur);cur=wd;}else cur=t;});if(cur)lines.push(cur);return lines;}
/* nameplate on the island showing the current babak; Karhutla blinks red while the fire burns */
function storyPlate(now){if(!isPol()||!S||(typeof cineBusy==='function'&&CINE.open))return;var st=stStage(),info=STORY[st];if(!info)return;var nm=(info.n||'').toUpperCase(),K=ISL,p=iso(MID+K*0.05,MID+K*0.9,0),fs=Math.max(10,TW*0.12),col=BABAK_COL[st%BABAK_COL.length];
  var burning=st===1&&burnFrac(now)>0.02,blink=burning?0.55+0.45*Math.abs(Math.sin(now/260)):1;
  g.save();g.font='900 '+fs+'px "Baloo 2", Nunito, sans-serif';var tw=g.measureText(nm).width,pw=tw+fs*1.1,ph=fs*1.45,py=p.y-TH*0.55;
  g.strokeStyle='#5A4030';g.lineWidth=Math.max(1.5,fs*0.14);g.beginPath();g.moveTo(p.x-pw*0.3,py);g.lineTo(p.x-pw*0.3,p.y);g.moveTo(p.x+pw*0.3,py);g.lineTo(p.x+pw*0.3,p.y);g.stroke();
  rrect(p.x-pw/2,py-ph+fs*0.12,pw,ph,fs*0.3);g.fillStyle='rgba(0,0,0,.25)';g.fill();rrect(p.x-pw/2,py-ph,pw,ph,fs*0.3);g.fillStyle=burning?'rgba(198,40,40,'+blink+')':col;g.fill();
  g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=Math.max(1,fs*0.08);g.stroke();g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';g.fillText(nm,p.x,py-ph/2+fs*0.05);g.restore();}
function storyBarLabel(){if(!S||!S.kasMax)return ' → '+storyNext();if(S.imf)return ' · utang IMF, gaji -50%';var st=stStage();if(st>=8)return ' · hampir bangkrut';var th=KAS_STEPS[st];return ' · '+STORY[st+1].n+' di '+short(Math.round(S.kasMax*th))+'';}
