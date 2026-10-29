/* ---------- cinematic overlays (10 s scene, skippable; holds on last frame until tapped), quips, world actors, convoy ---------- */
var SPEED=1;try{SPEED=Math.max(1,Math.min(3,+localStorage.getItem('kc-speed')||1));}catch(e){}
function setSpeed(v){SPEED=v;try{localStorage.setItem('kc-speed',String(v));}catch(e){}var b=$('speedBtn');if(b)b.textContent=v+'x';}
var CINE={open:false,q:[],cur:null,t0:0,el:0,last:0},CINE_DUR=10000,QUIPS=[],ACTORS=[],PEND=[],CONVOY=null;
function cineBusy(){return CINE.open||CINE.q.length>0||!!CONVOY||(typeof storyBusy==='function'&&storyBusy());}
function queueCine(kind,data){CINE.q.push({kind:kind,data:data||{}});if(!CINE.open)nextCine();}
function nextCine(){var c=CINE.q.shift();if(!c){closeCineUI();return;}CINE.cur=c;CINE.open=true;CINE.t0=performance.now();CINE.el=0;CINE.last=CINE.t0;CINE.fired={};CINE.lastType=0;CINE.done=false;CINE.doneAt=0;var sk=$('cineSkip');if(sk){sk.innerHTML='Skip &rsaquo;';sk.classList.remove('done');}$('cine').hidden=false;$('cine').classList.remove('done');refresh();requestAnimationFrame(cineFrame);}
function endCine(){if(!CINE.open)return;if(typeof stopSnd==='function'){stopSnd('bedOtt');stopSnd('bedKampanye');stopSnd('fajar');}var c=CINE.cur;CINE.open=false;CINE.cur=null;if(c&&c.data.onEnd)try{c.data.onEnd(c.data);}catch(e){}
  if(CINE.q.length)nextCine();else closeCineUI();}
function cineFinished(now){CINE.done=true;CINE.doneAt=now;var sk=$('cineSkip');if(sk){sk.textContent='Tutup';sk.classList.add('done');}$('cine').classList.add('done');}
function cineTap(){if(CINE.open&&CINE.done){play('tap');endCine();}}
function closeCineUI(){$('cine').hidden=true;holdMove=performance.now()+450;refresh();}
function once(key,fn){if(!CINE.fired[key]){CINE.fired[key]=1;fn();}}
function cineFrame(now){if(!CINE.open)return;requestAnimationFrame(cineFrame);
  var DUR=(CINE.cur.data&&CINE.cur.data.dur)||CINE_DUR;CINE.el+=Math.min(100,now-CINE.last)*SPEED;CINE.last=now;if(CINE.el>=DUR){CINE.el=DUR;if(!CINE.done)cineFinished(now);}var el=CINE.el;$('cineProg').style.width=(el/DUR*100)+'%';
  var cv2=$('cineCv'),w=window.innerWidth,h=window.innerHeight,d=Math.min(2,window.devicePixelRatio||1);
  if(cv2.width!==Math.round(w*d)||cv2.height!==Math.round(h*d)){cv2.width=Math.round(w*d);cv2.height=Math.round(h*d);}
  var c=cv2.getContext('2d'),old=g;c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);g=c;g.lineJoin='round';g.lineCap='round';
  try{var fn=CINE_SCENES[CINE.cur.kind];if(fn)fn(w,h,el/1000,CINE.cur.data,now);}catch(err){console.error(err);}
  g=old;}
/* text helpers */
function wrapLines(text,maxW){var words=String(text).split(' '),lines=[],ln='';words.forEach(function(wd){var t=ln?ln+' '+wd:wd;if(g.measureText(t).width>maxW&&ln){lines.push(ln);ln=wd;}else ln=t;});if(ln)lines.push(ln);return lines;}
function typed(text,t,start,cps){if(t<start)return '';if(CINE.open&&t<start+String(text).length/(cps||30)){var nw=performance.now();if(nw-CINE.lastType>120){CINE.lastType=nw;play('typing');}}return String(text).slice(0,Math.floor((t-start)*(cps||30)));}
function easeOut(x){x=Math.max(0,Math.min(1,x));return 1-Math.pow(1-x,3);}
function easeBack(x){x=Math.max(0,Math.min(1,x));var c=1.7;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2);}
function speech(x,y,text,fs,maxW,opt){opt=opt||{};if(!text)return;g.font=(opt.weight||800)+' '+fs+'px Nunito, sans-serif';var lines=wrapLines(text,maxW),lw2=0;lines.forEach(function(l){lw2=Math.max(lw2,g.measureText(l).width);});
  var pad=fs*0.6,bw=lw2+pad*2,bh=lines.length*fs*1.25+pad*1.3,bx=x-(opt.anchor==='l'?pad*1.5:opt.anchor==='r'?bw-pad*1.5:bw/2),by=y-bh-fs*0.7;
  bx=Math.max(8,Math.min((opt.W||window.innerWidth)-bw-8,bx));
  g.save();g.shadowColor='rgba(0,0,0,.25)';g.shadowBlur=fs*0.6;g.shadowOffsetY=fs*0.2;rrect(bx,by,bw,bh,fs*0.6);g.fillStyle=opt.bg||'#fff';g.fill();g.restore();
  g.beginPath();g.moveTo(x-fs*0.45,by+bh-1);g.lineTo(x,y);g.lineTo(x+fs*0.45,by+bh-1);g.closePath();g.fillStyle=opt.bg||'#fff';g.fill();
  if(opt.stroke){rrect(bx,by,bw,bh,fs*0.6);g.strokeStyle=opt.stroke;g.lineWidth=Math.max(2,fs*0.12);g.stroke();}
  g.fillStyle=opt.fg||'#1E1A16';g.textAlign='left';g.textBaseline='top';lines.forEach(function(l,i){g.fillText(l,bx+pad,by+pad*0.65+i*fs*1.25);});}
function bandText(x,y,text,fs,bg,fg,skew,font){g.save();g.font=font||('900 '+fs+'px "Baloo 2", sans-serif');var tw=g.measureText(text).width,pw=tw+fs*1.2,ph=fs*1.35;g.translate(x,y);g.transform(1,0,skew||-0.18,1,0,0);g.fillStyle=bg;g.fillRect(-pw/2,-ph/2,pw,ph);g.restore();g.save();g.font=font||('900 '+fs+'px "Baloo 2", sans-serif');g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';g.fillText(text,x,y+fs*0.05);g.restore();return pw;}
function flashes(w,h,t,seed,n){for(var k=0;k<(n||5);k++){var ph=(t*1.7+hash(k,seed))%1;if(ph<0.08){var a=1-ph/0.08,x=hash(k,seed+1)*w,y=h*0.15+hash(k,seed+2)*h*0.35;var gr=g.createRadialGradient(x,y,0,x,y,w*0.12);gr.addColorStop(0,'rgba(255,255,255,'+(0.9*a)+')');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(x-w*0.12,y-w*0.12,w*0.24,w*0.24);}}}
function skyline(w,y,h,col,seed){g.fillStyle=col;g.beginPath();g.moveTo(0,y);var x=0;var k=0;while(x<w){var bw=w*(0.03+hash(k,seed)*0.05),bh=h*(0.3+hash(k,seed+1)*0.7);g.lineTo(x,y-bh);g.lineTo(x+bw,y-bh);x+=bw;k++;}g.lineTo(w,y);g.closePath();g.fill();}
var CINE_SCENES={
  news:function(w,h,t,e,now){var pol=isPol();if(t>1.0)once('kb',function(){play('newsType');});
    once('s',function(){play('news');});if(t>0.35)once('hit',function(){play('sting');play('slam',0.6);});
    var bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,pol?'#1A0A12':'#0A2338');bg.addColorStop(1,pol?'#3A0E16':'#12456A');g.fillStyle=bg;g.fillRect(0,0,w,h);
    g.save();g.globalAlpha=0.08;g.fillStyle='#fff';for(var k=0;k<14;k++){var x=((k*w/7+now*0.05)%(w*2))-w*0.5;g.beginPath();g.moveTo(x,0);g.lineTo(x+w*0.06,0);g.lineTo(x-w*0.2,h);g.lineTo(x-w*0.26,h);g.fill();}g.restore();
    var sk=Math.max(0,1-t/0.6),shx=(t>0.35&&t<0.6)?(Math.random()-0.5)*16*sk:0;g.save();g.translate(shx,0);
    var a=easeOut(t/0.35),b=easeOut((t-0.12)/0.35);
    g.save();g.translate((1-a)*-w*1.2,0);g.beginPath();g.moveTo(-w*0.1,h*0.2);g.lineTo(w*0.95,h*0.16);g.lineTo(w*0.92,h*0.36);g.lineTo(-w*0.1,h*0.4);g.closePath();g.fillStyle=pol?'#D7261E':'#E9A21F';g.fill();g.restore();
    g.save();g.translate((1-b)*w*1.2,0);g.beginPath();g.moveTo(w*0.05,h*0.4);g.lineTo(w*1.1,h*0.37);g.lineTo(w*1.1,h*0.72);g.lineTo(w*0.08,h*0.75);g.closePath();g.fillStyle=pol?'#101018':'#0E2D4A';g.fill();
      g.fillStyle=pol?'#D7261E':'#E9A21F';g.fillRect(w*0.05,h*0.4,w*1.1,h*0.012);g.restore();
    if(t>0.35&&t<0.55){g.fillStyle='rgba(255,255,255,'+(1-(t-0.35)/0.2)+')';g.fillRect(0,0,w,h);}
    var fs=Math.min(w*0.075,h*0.12);
    if(t>0.3){g.save();var sc=easeBack((t-0.3)/0.3);g.translate(w*0.44,h*0.28);g.scale(sc,sc);g.rotate(-0.04);g.font='900 '+fs+'px "Baloo 2", sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=fs*0.14;g.strokeStyle='rgba(0,0,0,.35)';var ttl=pol?'BREAKING NEWS':String(TH_().newsName||'KABAR').toUpperCase();g.strokeText(ttl,0,0);g.fillStyle='#fff';g.fillText(ttl,0,0);g.restore();
      if(Math.floor(t*2)%2===0)pill(w*0.86,h*0.23,'● LIVE',Math.max(14,fs*0.3),'#fff','#D7261E');}
    if(t>0.6){var it=easeOut((t-0.6)/0.4);g.save();g.globalAlpha=it;g.translate((1-it)*40,0);
      var ix=w*0.16,iy=h*0.56,ir=Math.min(w,h)*0.11;g.beginPath();g.arc(ix,iy,ir,0,7);g.fillStyle=pol?'#D7261E':'#E9A21F';g.fill();g.lineWidth=ir*0.08;g.strokeStyle='#fff';g.stroke();newsIcon(e.id,ix,iy,ir,now);
      g.font='900 '+(fs*0.9)+'px "Baloo 2", sans-serif';g.textAlign='left';g.textBaseline='middle';g.fillStyle='#FFD95A';var tl=wrapLines(e.name,w*0.62);tl.forEach(function(l,i){g.fillText(l,w*0.3,h*0.5+i*fs*0.95-(tl.length-1)*fs*0.45);});
      g.font='700 '+Math.max(16,fs*0.36)+'px Nunito, sans-serif';g.fillStyle='#F4F1EA';var tx=typed(e.text,t,1.0,40);wrapLines(tx,w*0.6).forEach(function(l,i){g.fillText(l,w*0.3,h*0.62+i*fs*0.46);});g.restore();}
    g.restore();
    var ty=h*0.86,th2=Math.max(34,h*0.06);g.fillStyle=pol?'#D7261E':'#E9A21F';g.fillRect(0,ty,w*0.2,th2);g.fillStyle='#F4F1EA';g.fillRect(w*0.2,ty,w*0.8,th2);
    g.font='900 '+(th2*0.48)+'px Nunito, sans-serif';g.textBaseline='middle';g.textAlign='center';g.fillStyle='#fff';g.fillText(pol?'NPK TV':'NUSANTARA',w*0.1,ty+th2/2);
    g.save();g.beginPath();g.rect(w*0.2,ty,w*0.8,th2);g.clip();var tick=(e.name+' • '+e.text+' • ').toUpperCase();g.textAlign='left';g.fillStyle='#16161E';var tw=g.measureText(tick).width,off=w*0.2+w*0.8-((now*0.12)%(tw));for(var r=-1;r<4;r++)g.fillText(tick,off+r*tw-w*0.8,ty+th2/2);g.restore();},
  ott:function(w,h,t,e,now){var p=S.players[e.pid];
    once('s',function(){play('siren');setTimeout(function(){play('bedOtt');},900);setTimeout(function(){play('camera');},500);setTimeout(function(){play('camera');},800);});
    var bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0B1636');bg.addColorStop(0.7,'#1A1240');bg.addColorStop(1,'#07070F');g.fillStyle=bg;g.fillRect(0,0,w,h);
    var sx=w*0.1,sy=h*0.08,sw=w*0.8,sh2=h*0.42;rrect(sx,sy,sw,sh2,16);var lg=g.createLinearGradient(0,sy,0,sy+sh2);lg.addColorStop(0,'#1F4FA0');lg.addColorStop(1,'#0E2A60');g.fillStyle=lg;g.fill();
    g.save();rrect(sx,sy,sw,sh2,16);g.clip();g.translate(sx,0);skyline(sw,sy+sh2,sh2*0.55,'rgba(10,20,50,.55)',3);g.restore();
    g.font='900 '+Math.min(w*0.06,h*0.09)+'px "Baloo 2", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='rgba(255,255,255,.92)';g.fillText('RUANG TANYA',w/2,sy+sh2*0.32);
    g.font='800 '+Math.min(w*0.018,h*0.03)+'px Nunito, sans-serif';g.fillStyle='#FFD95A';g.fillText('Talkshow paling bikin keringetan',w/2,sy+sh2*0.48);
    for(var k=0;k<3;k++){var lx=w*(0.2+k*0.3),cone=g.createLinearGradient(0,0,0,h);cone.addColorStop(0,'rgba(255,240,200,.18)');cone.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=cone;g.beginPath();g.moveTo(lx-w*0.02,0);g.lineTo(lx+w*0.02,0);g.lineTo(lx+w*0.12,h);g.lineTo(lx-w*0.12,h);g.fill();}
    var fy=h*0.8;var fl=g.createLinearGradient(0,fy-h*0.12,0,h);fl.addColorStop(0,'#2A2050');fl.addColorStop(1,'#0E0A1E');g.fillStyle=fl;g.fillRect(0,fy-h*0.1,w,h);
    var s=Math.min(h*0.42,w*0.24),hostX=w*0.27,tokX=w*0.66;
    // police behind token
    drawChar('polisi',tokX-s*0.95,fy-h*0.03,s*0.92,null,{});drawChar('polisi',tokX+s*0.95,fy-h*0.03,s*0.92,null,{});
    // host chair + desk
    rrect(hostX-s*0.5,fy-s*0.75,s,s*0.6,s*0.2);g.fillStyle='#3A2A60';g.fill();
    drawChar('host',hostX,fy,s,null,{expr:t>2.6&&t<3.2?'shock':null});
    g.beginPath();g.moveTo(hostX-s*0.8,fy-s*0.12);g.quadraticCurveTo(hostX,fy-s*0.22,hostX+s*0.8,fy-s*0.12);g.lineTo(hostX+s*0.7,fy+h*0.06);g.lineTo(hostX-s*0.7,fy+h*0.06);g.closePath();var dg=g.createLinearGradient(0,fy-s*0.2,0,fy+h*0.06);dg.addColorStop(0,'#F4F1EA');dg.addColorStop(1,'#B9B3C9');g.fillStyle=dg;g.fill();
    g.fillStyle='#FFD95A';g.fillRect(hostX-s*0.6,fy-s*0.05,s*1.2,s*0.04);
    rrect(hostX+s*0.12,fy-s*0.48,s*0.16,s*0.22,s*0.02);g.fillStyle='#fff';g.fill();g.strokeStyle='#bbb';g.lineWidth=1;g.stroke();
    // token in vest on hot seat
    rrect(tokX-s*0.42,fy-s*0.7,s*0.84,s*0.55,s*0.18);g.fillStyle='#5A1E2A';g.fill();
    var tShake=t<6.6?Math.sin(now/40)*s*0.008:0;drawChar(p.char,tokX+tShake,fy,s,p.color,{vest:true,expr:t<6.6?(t>2.8?'sad':'shock'):null});
    var fs=Math.max(16,Math.min(w*0.022,h*0.036));
    if(t>0.8)once('host',function(){play('host');});
    if(t>0.8&&t<3.0)speech(hostX+s*0.1,fy-s*1.05,typed((isFemale(p.char)?'Ibu':'Bapak')+' ketangkap kasus apa?',t,0.8,26),fs,w*0.28,{anchor:'l',W:w});
    if(t>3.0)once('vcase',function(){var ck=caseKey(e.caseText);if(ck)vo(ck);});
    if(t>3.0&&t<6.6)speech(tokX,fy-s*1.02,'"'+typed(e.caseText||'Saya cuma lewat, Mbak.',t,2.8,30)+'"',fs,w*0.34,{anchor:'r',W:w});
    if(t>=6.6){var pp=Math.max(0.3,easeBack((t-6.6)/0.35));speech(tokX,fy-s*1.05,'Saya akan lawan!',fs*1.35*pp,w*0.4,{bg:'#FFE27A',stroke:'#C62828',weight:900,W:w});once('lw',function(){play('slam',0.4);play('quip:lawan');});}
    flashes(w,h,t,11,6);
    if(t>0.4){var it=easeOut((t-0.4)/0.4),ly=h*0.9;g.save();g.translate((1-it)*-w,0);var bw2=bandText(w*0.12,ly,'OTT!',Math.max(20,h*0.045),'#E2483D','#fff',-0.2);
      g.font='900 '+Math.max(15,h*0.03)+'px Nunito, sans-serif';var txt=p.name+' terjaring operasi tangkap tangan';var tw=g.measureText(txt).width;g.fillStyle='#F4F1EA';g.fillRect(w*0.12+bw2/2,ly-h*0.03,tw+w*0.04,h*0.06);g.fillStyle='#16161E';g.textAlign='left';g.textBaseline='middle';g.fillText(txt,w*0.12+bw2/2+w*0.02,ly);g.restore();}
    if(t<0.6){var cl=t<0.25?easeOut(t/0.25):1-easeOut((t-0.25)/0.35);g.fillStyle='#000';g.fillRect(0,0,w,h*0.5*cl);g.fillRect(0,h-h*0.5*cl,w,h*0.5*cl);}
    var sir=Math.floor(now/250)%2;g.save();g.globalAlpha=0.35;var sg=g.createRadialGradient(sir?0:w,0,0,sir?0:w,0,w*0.45);sg.addColorStop(0,sir?'rgba(226,40,40,1)':'rgba(40,90,240,1)');sg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=sg;g.fillRect(0,0,w,h);g.restore();},
  fajar:function(w,h,t,e,now){once('s',function(){play('fajar');});
    var bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0A0F2C');bg.addColorStop(0.75,'#3A2A5A');bg.addColorStop(1,'#E08A5A');g.fillStyle=bg;g.fillRect(0,0,w,h);
    for(var k=0;k<50;k++)ell(hash(k,4)*w,hash(k,5)*h*0.5,1.3,1.3,'rgba(255,255,255,'+(0.4+0.4*Math.sin(now/300+k))+')');
    ell(w*0.82,h*0.18,h*0.07,h*0.07,'#FFF3C0');ell(w*0.8,h*0.17,h*0.065,h*0.065,'#0A0F2C');
    var hy=h*0.66;for(var i=0;i<6;i++){var hx=w*(0.06+i*0.16),hw=w*0.13,hh=h*0.16;g.fillStyle='#15122A';g.fillRect(hx,hy-hh,hw,hh);g.beginPath();g.moveTo(hx-w*0.01,hy-hh);g.lineTo(hx+hw/2,hy-hh-h*0.07);g.lineTo(hx+hw+w*0.01,hy-hh);g.fill();
      var lit=t>0.8+i*0.9;g.fillStyle=lit?'#FFD27A':'#2A2545';g.fillRect(hx+hw*0.15,hy-hh*0.7,hw*0.25,hh*0.3);g.fillRect(hx+hw*0.6,hy-hh*0.7,hw*0.25,hh*0.3);g.fillStyle='#2A1E14';g.fillRect(hx+hw*0.4,hy-hh*0.45,hw*0.2,hh*0.45);
      if(lit){var ft=Math.min(1,(t-0.8-i*0.9)/0.6);g.save();g.globalAlpha=1-ft*0.3;amplopAt(hx+hw*0.5,hy-hh*0.2-ft*h*0.05,w*0.025);g.restore();}}
    g.fillStyle='#0E0B1E';g.fillRect(0,hy,w,h-hy);
    var px=w*(0.02+Math.min(1,t/6)*0.96);drawMiniPerson(px,hy+h*0.02,h*0.09,'#2A2A30',Math.sin(now/120)*0.5+0.5,false);amplopAt(px+h*0.03,hy-h*0.05,w*0.02);
    var fs=Math.min(w*0.07,h*0.11);if(t>0.3){var sc=easeBack((t-0.3)/0.4);g.save();g.translate(w/2,h*0.2);g.scale(sc,sc);g.font='900 '+fs+'px "Baloo 2", sans-serif';g.textAlign='center';g.textBaseline='middle';g.shadowColor='rgba(255,210,120,.8)';g.shadowBlur=fs*0.4;g.fillStyle='#FFE27A';g.fillText(String(e.name||'Serangan Fajar').toUpperCase(),0,0);g.restore();}
    g.font='800 '+Math.max(16,fs*0.3)+'px Nunito, sans-serif';g.textAlign='center';g.fillStyle='#F4F1EA';wrapLines(typed(e.text||'',t,0.9,40),w*0.7).forEach(function(l,i){g.fillText(l,w/2,h*0.32+i*fs*0.4);});
    var got=e.got||[],n=S.players.length,cs=Math.min(h*0.17,w/(n+1)*0.7);S.players.forEach(function(q,i){var x=w*(i+1)/(n+1),y=h*0.97;if(q.bankrupt)return;drawChar(q.char,x,y,cs,q.color,{expr:got.indexOf(q.id)>=0&&t>3?'happy':null,vest:q.inJail&&isPol()});
      if(got.indexOf(q.id)>=0&&t>3){var pt=Math.min(1,(t-3)/0.5);g.save();g.globalAlpha=pt;pill(x,y-cs*1.15-pt*10,'+'+short(100000),Math.max(14,cs*0.14),'#2E9E5B','#fff');g.restore();once('c'+i,function(){play('coins');});}
      else if(got.indexOf(q.id)<0&&t>3){pill(x,y-cs*1.15,'lagi ditahan',Math.max(12,cs*0.11),'rgba(0,0,0,.5)','#fff');}});},
  kampanye:function(w,h,t,e,now){var p=S.players[e.pid],city=tileName(e.tile);once('s',function(){play('festival');play('bedKampanye');setTimeout(function(){play('mic');},600);});
    var bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#7CC8F0');bg.addColorStop(1,'#CDEBF7');g.fillStyle=bg;g.fillRect(0,0,w,h);
    g.fillStyle='#6BBF59';g.fillRect(0,h*0.62,w,h*0.38);
    var bx=w*0.2,by=h*0.06,bw=w*0.6,bh=h*0.36;g.fillStyle='#5A5A66';g.fillRect(bx+bw*0.1,by+bh,w*0.012,h*0.2);g.fillRect(bx+bw*0.9-w*0.012,by+bh,w*0.012,h*0.2);
    rrect(bx,by,bw,bh,10);var bgr=g.createLinearGradient(bx,0,bx+bw,0);bgr.addColorStop(0,shade(p.color,0.15));bgr.addColorStop(1,shade(p.color,-0.25));g.fillStyle=bgr;g.fill();g.strokeStyle='#fff';g.lineWidth=6;g.stroke();
    g.save();rrect(bx,by,bw,bh,10);g.clip();drawChar(p.char,bx+bw*0.2,by+bh*(sprImg(p.char)?1.62:1.25),bh*(sprImg(p.char)?1.5:1.05),null,{expr:'happy'});g.restore();
    var idx=S.players.indexOf(p)+1,tx0=bx+bw*0.4,tmax=bw*0.56;g.textAlign='left';g.textBaseline='middle';
    var fit=function(txt,size,font,y,col){var fz=size;g.font=font.replace('#',fz);while(g.measureText(txt).width>tmax&&fz>8){fz-=1;g.font=font.replace('#',fz);}g.fillStyle=col;g.fillText(txt,tx0,y);};
    fit('COBLOS NO. '+idx,bh*0.2,'900 #px "Baloo 2", sans-serif',by+bh*0.2,'#fff');
    fit(p.name.toUpperCase(),bh*0.11,'900 #px Nunito, sans-serif',by+bh*0.37,'#FFE27A');
    fit(sloganText(e.slogan||0,city),bh*0.085,'800 #px Nunito, sans-serif',by+bh*0.5,'#fff');
    var sy=h*0.72,stw=w*0.5;g.fillStyle='#7A3A1E';g.fillRect(w/2-stw/2,sy-h*0.12,stw,h*0.12);g.fillStyle='#A0522D';g.fillRect(w/2-stw/2,sy-h*0.13,stw,h*0.02);
    for(var k=0;k<12;k++){g.fillStyle=k%2?'#fff':'#D7261E';g.beginPath();var x0=w/2-stw/2+k*stw/12;g.moveTo(x0,sy-h*0.11);g.lineTo(x0+stw/12,sy-h*0.11);g.lineTo(x0+stw/24,sy-h*0.07);g.fill();}
    var ts=Math.min(h*0.28,w*0.16),jump=Math.abs(Math.sin(now/260))*h*0.012;drawChar(p.char,w/2,sy-h*0.13-jump,ts,p.color,{expr:t>4&&t<5.5?'happy':null});
    g.fillStyle='#333';g.fillRect(w/2+ts*0.22,sy-h*0.13-ts*0.55,ts*0.03,ts*0.35);ell(w/2+ts*0.235,sy-h*0.13-ts*0.58,ts*0.05,ts*0.06,'#222');
    rrect(w/2-ts*0.3,sy-h*0.13-ts*0.3,ts*0.6,ts*0.3,ts*0.04);g.fillStyle='#E8E2D2';g.fill();
    var fs=Math.max(16,Math.min(w*0.022,h*0.036));
    if(t>0.8&&t<4.8)speech(w/2+ts*0.2,h*0.62,typed('Saudara-saudara! '+city+' akan kita bangun jadi kota cuan!',t,0.8,30),fs,w*0.34,{W:w,anchor:'l'});
    var slg=sloganText(e.slogan||0,city);if(t>=5)once('slg',function(){vo('kamp_'+((e.slogan||0)%SLOGANS.length+1));});if(t>=5)speech(w/2+ts*0.2,h*0.62,typed(slg,t,5,30),fs,w*0.34,{W:w,bg:'#FFE27A',anchor:'l'});
    for(var r=0;r<3;r++)for(var c=0;c<14;c++){var x=w*(c+0.5+(r%2)*0.5)/14,y=h*(0.84+r*0.07),bob=Math.abs(Math.sin(now/200+c*1.3+r))*h*0.015,sh=['#E2483D','#F2C230','#2F80ED','#2E9E5B','#fff'][(c+r)%5];
      g.strokeStyle='#5A4A3A';g.lineWidth=2;g.beginPath();g.moveTo(x+h*0.02,y-h*0.07-bob);g.lineTo(x+h*0.02,y-h*0.14-bob);g.stroke();g.fillStyle=(c+r)%3?p.color:'#fff';g.beginPath();g.moveTo(x+h*0.02,y-h*0.14-bob);g.lineTo(x+h*0.07+Math.sin(now/120+c)*h*0.006,y-h*0.125-bob);g.lineTo(x+h*0.02,y-h*0.11-bob);g.fill();
      drawMiniPerson(x,y-bob,h*0.1,sh,Math.sin(now/150+c),false);}
    for(var q=0;q<40;q++){var cx=(hash(q,9)*w+now*0.02*(hash(q,3)-0.5))%w,cy=((hash(q,8)*h+now*0.12*(0.5+hash(q,7)))%(h*0.8));g.fillStyle=['#FFD23F','#FF5C7A','#4CC0F0','#7BD389'][q%4];g.save();g.translate(cx,cy);g.rotate(now/300+q);g.fillRect(-4,-2,8,4);g.restore();}
    if(t>0.3){var it=easeOut((t-0.3)/0.4);g.save();g.translate((1-it)*-w,0);bandText(w*0.2,h*0.5,'KAMPANYE AKBAR',Math.max(20,h*0.05),'#D7261E','#fff',-0.2);bandText(w*0.2,h*0.5+Math.max(20,h*0.05)*1.5,city.toUpperCase(),Math.max(18,h*0.042),'#16161E','#FFE27A',-0.2);g.restore();}}
};
function amplopAt(x,y,s){rrect(x-s,y-s*0.65,s*2,s*1.3,s*0.15);g.fillStyle='#F4E6C4';g.fill();g.strokeStyle='#B89A5A';g.lineWidth=1;g.stroke();g.beginPath();g.moveTo(x-s,y-s*0.65);g.lineTo(x,y);g.lineTo(x+s,y-s*0.65);g.stroke();ell(x,y-s*0.1,s*0.18,s*0.18,'#D7261E');}
function newsIcon(id,x,y,r,now){g.save();g.translate(x,y);g.fillStyle='#fff';g.strokeStyle='#fff';g.lineWidth=r*0.09;
  if(id==='diskon'){g.font='900 '+(r*0.95)+'px "Baloo 2", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('%',0,r*0.05);}
  else if(id==='mudik'){rrect(-r*0.6,-r*0.35,r*1.2,r*0.6,r*0.12);g.fill();ell(-r*0.35,r*0.3,r*0.13,r*0.13,'#333');ell(r*0.35,r*0.3,r*0.13,r*0.13,'#333');g.fillStyle='#4CC0F0';g.fillRect(-r*0.5,-r*0.25,r*1.0,r*0.2);}
  else if(id==='banjir'){for(var k=0;k<3;k++){g.beginPath();for(var i=0;i<=20;i++){var xx=-r*0.7+i*r*0.07,yy=-r*0.3+k*r*0.3+Math.sin(i*0.9+now/200)*r*0.08;i?g.lineTo(xx,yy):g.moveTo(xx,yy);}g.stroke();}}
  else if(id==='viral'){g.beginPath();g.moveTo(0,r*0.5);g.bezierCurveTo(-r*0.9,-r*0.1,-r*0.4,-r*0.75,0,-r*0.25);g.bezierCurveTo(r*0.4,-r*0.75,r*0.9,-r*0.1,0,r*0.5);g.fill();}
  else if(id==='krismon'){g.beginPath();g.moveTo(-r*0.6,-r*0.4);g.lineTo(-r*0.2,0);g.lineTo(r*0.05,-r*0.2);g.lineTo(r*0.55,r*0.4);g.stroke();g.beginPath();g.moveTo(r*0.55,r*0.4);g.lineTo(r*0.25,r*0.35);g.lineTo(r*0.5,r*0.1);g.closePath();g.fill();}
  else if(id==='demo'){for(var d=-1;d<=1;d++){g.fillRect(d*r*0.4-r*0.03,-r*0.15,r*0.06,r*0.6);rrect(d*r*0.4-r*0.22,-r*0.55+Math.sin(now/200+d)*r*0.05,r*0.44,r*0.32,r*0.04);g.fill();}}
  else{g.beginPath();g.arc(0,0,r*0.4,0,7);g.stroke();}
  g.restore();}
/* overlays-clear gate: modal + cine gone, then delay */
function afterOverlay(fn,extra){PEND.push({fn:fn,ready:null,extra:extra||0});}
function processPend(now){var clear=!cineBusy()&&$('modal').hidden;for(var i=PEND.length-1;i>=0;i--){var p=PEND[i];if(!clear){p.ready=null;continue;}if(p.ready==null)p.ready=now+800+p.extra;if(now>=p.ready){PEND.splice(i,1);try{p.fn(now);}catch(e){console.error(e);}}}}
/* quips: fictional characters' satirical one-liners */
var QUIP_TEXT={mic:'Maaf, mic-nya mati.',sogok:'Hakimnya pengertian banget.',lawan:'Saya akan lawan!',sorry:'Sorry ye!',repot:'Gitu aja kok repot!',asing:'Ini ulah antek-antek asing!'};
function addQuip(pid,text,dur,key){if(key)play('quip:'+key);QUIPS=QUIPS.filter(function(q){return q.pid!==pid;});QUIPS.push({pid:pid,text:text,t0:performance.now(),dur:dur||2800});}
function drawQuips(now){QUIPS=QUIPS.filter(function(q){var t=(now-q.t0)/q.dur;if(t>1)return false;if(t<0)return true;if(CONVOY&&CONVOY.pid===q.pid)return true;var tp=tokenPos(q.pid,now),b=iso(tp.u,tp.v,tp.z+TW*0.62),sc=easeBack(Math.min(1,t*q.dur/250));
  g.save();g.globalAlpha=t>0.85?(1-t)/0.15:1;speech(b.x,b.y,q.text,Math.max(13,TW*0.13)*Math.max(0.3,sc),TW*2.4,{W:CW,weight:900,stroke:'#4A3426'});g.restore();return true;});}
/* world actors: preman (pungli), tukang parkir */
function addActor(kind,tile,text,amt){if(kind==='tukang'&&typeof parkirFee==='function'&&parkirFee()>2000&&!USER_RAW.tukang)play('pay');else play(kind);ACTORS.push({kind:kind,tile:tile,text:text,amt:amt,t0:performance.now(),dur:4200});focusTile(tile,3000);}
function actorItems(now,items){ACTORS=ACTORS.filter(function(a){var t=(now-a.t0)/a.dur;if(t>1)return false;var zn=ZN[a.tile],h=tileTop(a.tile,now),off=(1-easeOut(t/0.12))*0.9,side=zn.axis==='u'?[0,1]:[1,0];
    var u=zn.bu+0.18*side[0]+off*side[0],v=zn.bv+0.18*side[1]+off*side[1];
    items.push({d:RECT[a.tile].cu+RECT[a.tile].cv+0.5,f:function(){var b=iso(u,v,h);g.save();g.globalAlpha=t>0.9?(1-t)/0.1:1;var bob=t>0.12?Math.abs(Math.sin(now/160))*TH*0.05:Math.abs(Math.sin(now/70))*TH*0.1;
      drawChar(a.kind,b.x,b.y-bob,TW*0.55,null,{expr:a.kind==='preman'?null:'happy'});
      if(a.kind==='tukang'&&t>0.12){g.strokeStyle='#E2483D';g.lineWidth=lw(0.02);var sw=Math.sin(now/140)*0.6;g.beginPath();g.moveTo(b.x+TW*0.16,b.y-TW*0.3);g.lineTo(b.x+TW*0.16+Math.cos(-1.2+sw)*TW*0.25,b.y-TW*0.3+Math.sin(-1.2+sw)*TW*0.25);g.stroke();}
      g.restore();a.sx=b.x;a.sy=b.y-TW*0.62;}});return true;});}
function drawActorBubbles(now){ACTORS.forEach(function(a){var t=(now-a.t0)/a.dur;if(t<0.15||a.sx==null)return;var sc=easeBack(Math.min(1,(t-0.15)*a.dur/250));g.save();g.globalAlpha=t>0.9?(1-t)/0.1:1;
  speech(a.sx,a.sy,a.text,Math.max(13,TW*0.13),TW*2.6*1,{W:CW,weight:900,stroke:'#4A3426',bg:a.kind==='preman'?'#FFF3E0':'#fff'});g.restore();
  if(a.amt&&t>0.3){g.save();g.globalAlpha=t>0.9?(1-t)/0.1:1;pill(a.sx,a.sy+TW*0.72,'-'+short(a.amt),Math.max(12,TW*0.11),'#D03A2F','#fff');g.restore();}});}
/* kampanye convoy: luxury car (no brand), waving candidate, supporters */
function startConvoy(d){var p=S.players[d.pid];if(!p||p.bankrupt)return;var from=p.pos,steps=(d.tile-from+NT)%NT,pts=[];for(var k=0;k<=steps;k++)pts.push((from+k)%NT);if(pts.length<2)pts.push(d.tile);
  CONVOY={pid:d.pid,tile:d.tile,pts:pts,prog:0,last:performance.now(),dur:Math.max(1600,5000*steps/(NT-1)),fast:false,end:0};refresh();}
function convoyAt(idx){var pts=CONVOY.pts,n=pts.length-1,i=Math.max(0,Math.min(n,idx)),k=Math.min(n-1,Math.floor(i)),f=i-k,a=tokenSpot(pts[k],0,1),b=tokenSpot(pts[k+1],0,1);return {u:a.u+(b.u-a.u)*f,v:a.v+(b.v-a.v)*f,du:b.u-a.u,dv:b.v-a.v,tile:pts[f<0.5?k:k+1]};}
function updateConvoy(now){if(!CONVOY)return;var dt=Math.min(64,now-CONVOY.last);CONVOY.last=now;
  if(CONVOY.prog<1){CONVOY.prog=Math.min(1,CONVOY.prog+dt/CONVOY.dur*(CONVOY.fast?4:1)*SPEED);if(now-(CONVOY.honk||0)>1400){CONVOY.honk=now;play('pop');}if(CONVOY.prog>=1){CONVOY.end=now;landFx.push({tile:CONVOY.tile,t0:now});play('festival');}}
  else if(now-CONVOY.end>1500/SPEED){var pid=CONVOY.pid;CONVOY=null;var tp=tokenPos(pid,now);for(var k=0;k<6;k++)parts.push({u:tp.u,v:tp.v,z:tp.z+TH*0.4,t0:now,life:700,kind:'poof',a:k});refresh();}}
function convoyItems(now,items){if(!CONVOY)return;var n=CONVOY.pts.length-1,idx=CONVOY.prog*n,p=S.players[CONVOY.pid];
  for(var k=0;k<7;k++){(function(k){var lag=0.45+k*0.28,c=convoyAt(idx-lag),perp=[c.dv,-c.du],side=(k%2?1:-1)*0.17;var u=c.u+perp[0]*side,v=c.v+perp[1]*side;
    items.push({d:RECT[c.tile].cu+RECT[c.tile].cv+0.4,f:function(){var b=iso(u,v,tileTop(c.tile,now)),bob=Math.abs(Math.sin(now/110+k*1.7))*TH*0.08,s=TW*0.3,sh=['#E2483D','#F2C230','#2F80ED','#2E9E5B','#FFFFFF'][k%5];
      g.strokeStyle='#5A4A3A';g.lineWidth=lw(0.008);g.beginPath();g.moveTo(b.x+s*0.3,b.y-s*0.7-bob);g.lineTo(b.x+s*0.3,b.y-s*1.25-bob);g.stroke();g.fillStyle=k%2?p.color:'#fff';g.beginPath();g.moveTo(b.x+s*0.3,b.y-s*1.25-bob);g.lineTo(b.x+s*0.75+Math.sin(now/90+k)*s*0.05,b.y-s*1.12-bob);g.lineTo(b.x+s*0.3,b.y-s*0.98-bob);g.fill();
      drawMiniPerson(b.x,b.y-bob,s,sh,Math.sin(now/120+k),false);}});})(k);}
  var c=convoyAt(idx);items.push({d:RECT[c.tile].cu+RECT[c.tile].cv+0.47,f:function(){drawCar(c.u,c.v,tileTop(c.tile,now),c.du,c.dv,p,now);}});}
function drawCar(u,v,z,du,dv,p,now){var alongU=Math.abs(du)>=Math.abs(dv),L=0.62,W=0.32,w=alongU?L:W,d=alongU?W:L,bounce=Math.abs(Math.sin(now/90))*TH*0.015;z+=bounce;
  var sh=iso(u,v,z-bounce);ell(sh.x,sh.y+TH*0.05,TW*0.36,TH*0.2,'rgba(0,0,0,.28)');
  [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(function(q){var wp=iso(u+q[0]*w*0.36,v+q[1]*d*0.36,z+TH*0.04);ell(wp.x,wp.y,TW*0.05,TH*0.07,'#0A0A0A');ell(wp.x,wp.y,TW*0.025,TH*0.035,'#9AA0A8');});
  box(u,v,w,d,TH*0.17,z+TH*0.05,'#22232A','#0E0F13');
  box(u,v,w*(alongU?0.55:0.9),d*(alongU?0.9:0.55),TH*0.15,z+TH*0.22,'#2E3442','#171A22');
  var top=iso(u,v,z+TH*0.37);ell(top.x,top.y,TW*0.06,TH*0.05,'#0A0A0A');
  var fr=iso(u+(alongU?Math.sign(du||1)*w*0.5:0),v+(alongU?0:Math.sign(dv||1)*d*0.5),z+TH*0.14);ell(fr.x,fr.y,TW*0.04,TH*0.025,'#FFF6C0');
  g.strokeStyle='rgba(220,225,235,.8)';g.lineWidth=lw(0.006);var c1=iso(u-(alongU?w*0.45:0),v-(alongU?0:d*0.45),z+TH*0.2),c2=iso(u+(alongU?w*0.45:0),v+(alongU?0:d*0.45),z+TH*0.2);g.beginPath();g.moveTo(c1.x,c1.y);g.lineTo(c2.x,c2.y);g.stroke();
  g.save();g.beginPath();g.rect(top.x-TW,top.y-TW*2,TW*2,TW*2);g.clip();var s=TW*0.42;drawChar(p.char,top.x,top.y+s*0.42,s,null,{expr:'happy'});g.restore();
  var wv=Math.sin(now/130)*0.5;g.strokeStyle='#F2C49B';g.lineWidth=lw(0.025);g.beginPath();g.moveTo(top.x+s*0.2,top.y-s*0.12);g.lineTo(top.x+s*0.38+Math.cos(-1.2+wv)*s*0.2,top.y-s*0.3+Math.sin(-1.2+wv)*s*0.2);g.stroke();
  ell(top.x+s*0.38+Math.cos(-1.2+wv)*s*0.2,top.y-s*0.3+Math.sin(-1.2+wv)*s*0.2,s*0.06,s*0.06,'#F2C49B');
  if(Math.floor(now/1400)%2===0)pill(top.x,top.y-s*0.95,'Halo warga!',Math.max(11,TW*0.09),'#fff','#4A3426');}
/* manhole covers for gorong-gorong */
function drawManhole(tile,openF,vis,now){if(vis<=0)return;var sp=tokenSpot(tile,0,1),h=tileTop(tile,now),c=iso(sp.u,sp.v,h),rx=TW*0.17*vis,ry=TH*0.17*vis;
  ell(c.x,c.y,rx*1.1,ry*1.1,'rgba(0,0,0,.25)');g.beginPath();g.ellipse(c.x,c.y,rx,ry,0,0,7);var hg=g.createRadialGradient(c.x,c.y-ry*0.3,0,c.x,c.y,rx);hg.addColorStop(0,'#000');hg.addColorStop(1,'#2A2A30');g.fillStyle=hg;g.fill();
  var ox=c.x+openF*rx*1.6,oy=c.y-openF*ry*0.5;ell(ox,oy+ry*0.12,rx,ry,'#45454C');g.beginPath();g.ellipse(ox,oy,rx,ry,0,0,7);g.fillStyle=rgrad(ox-rx*0.3,oy-ry*0.3,rx*1.2,'#9A9AA2','#5E5E66');g.fill();
  g.strokeStyle='rgba(40,40,46,.7)';g.lineWidth=Math.max(1,TW*0.006);for(var k=-2;k<=2;k++){g.beginPath();g.moveTo(ox+k*rx*0.3,oy-ry*0.8*Math.sqrt(1-(k*0.3)*(k*0.3)));g.lineTo(ox+k*rx*0.3,oy+ry*0.8*Math.sqrt(1-(k*0.3)*(k*0.3)));g.stroke();}
  g.beginPath();g.ellipse(ox,oy,rx*0.85,ry*0.85,0,0,7);g.stroke();}
function fxHold(now){if(PEND.length)return true;if(EVENTS.some(function(e){return e.t==='takeover';}))return true;for(var k in FX.take){var t0=FX.take[k].t0;if(t0===Infinity||now-t0<TK_DUR-100)return true;}return false;}
var HOLDWAS=false;function checkHold(now){var h=fxHold(now);if(HOLDWAS&&!h)refresh();HOLDWAS=h;}
