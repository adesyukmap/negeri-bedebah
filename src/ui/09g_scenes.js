/* ---------- Politik full scenes: Blusukan lewat gorong-gorong, Gajian Pejabat ---------- */
function clapper(x,y,s,open){g.save();g.translate(x,y);rrect(-s*0.5,-s*0.05,s,s*0.6,s*0.04);g.fillStyle='#1E1E24';g.fill();g.fillStyle='#F4F1EA';g.font='900 '+(s*0.085)+'px Nunito, sans-serif';g.textAlign='left';g.textBaseline='middle';g.font='900 '+(s*0.13)+'px Nunito, sans-serif';g.fillText('TAKE '+(open>1?'2':'1'),-s*0.42,s*0.2);g.font='900 '+(s*0.085)+'px Nunito, sans-serif';g.fillText('KONTEN BLUSUKAN',-s*0.42,s*0.42);
  g.save();g.translate(-s*0.5,-s*0.05);g.rotate(open%1>0.5?0:-0.45);g.fillStyle='#1E1E24';g.fillRect(0,-s*0.14,s,s*0.14);g.fillStyle='#F4F1EA';for(var k=0;k<5;k++){g.beginPath();g.moveTo(k*s*0.2,-s*0.14);g.lineTo(k*s*0.2+s*0.1,-s*0.14);g.lineTo(k*s*0.2+s*0.05,0);g.lineTo(k*s*0.2-s*0.05,0);g.fill();}g.restore();g.restore();}
function camRig(x,y,s,now){g.save();g.translate(x,y);g.strokeStyle='#2A2A30';g.lineWidth=s*0.03;g.beginPath();g.moveTo(0,0);g.lineTo(-s*0.18,s*0.5);g.moveTo(0,0);g.lineTo(s*0.18,s*0.5);g.moveTo(0,0);g.lineTo(0,s*0.5);g.stroke();
  rrect(-s*0.16,-s*0.16,s*0.32,s*0.18,s*0.03);g.fillStyle='#1E1E24';g.fill();ell(-s*0.2,-s*0.07,s*0.06,s*0.06,'#3A3A44');if(Math.floor(now/500)%2)ell(s*0.12,-s*0.12,s*0.02,s*0.02,'#E2483D');g.restore();}
function softbox(x,y,s){g.save();g.translate(x,y);g.strokeStyle='#2A2A30';g.lineWidth=s*0.025;g.beginPath();g.moveTo(0,0);g.lineTo(0,s*0.8);g.stroke();var lg=g.createRadialGradient(0,-s*0.1,0,0,-s*0.1,s*0.5);lg.addColorStop(0,'rgba(255,250,220,.9)');lg.addColorStop(1,'rgba(255,250,220,0)');g.fillStyle=lg;g.fillRect(-s*0.6,-s*0.6,s*1.2,s*1.0);rrect(-s*0.18,-s*0.22,s*0.36,s*0.26,s*0.03);g.fillStyle='#F4F1EA';g.fill();g.restore();}
CINE_SCENES.blusukan=function(w,h,t,e,now){
  var p=S.players[e.pid];if(!p)return;var fs=Math.max(15,Math.min(w*0.021,h*0.034)),s=Math.min(h*0.36,w*0.21),dest=tileName(e.tile);
  var bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#1B2340');bg.addColorStop(0.6,'#2C3A5E');bg.addColorStop(1,'#3A3F48');g.fillStyle=bg;g.fillRect(0,0,w,h);
  skyline(w,h*0.62,h*0.3,'rgba(10,14,30,.7)',7);g.fillStyle='#4A4E58';g.fillRect(0,h*0.62,w,h*0.38);g.fillStyle='#5E636E';g.fillRect(0,h*0.62,w,h*0.03);
  for(var k=0;k<6;k++){g.fillStyle='rgba(255,255,255,.18)';g.fillRect(w*(0.05+k*0.18),h*0.82,w*0.08,h*0.012);}
  var mx=w*0.5,my=h*0.86,mw=s*0.62;ell(mx,my,mw,mw*0.28,'#1A1A1E');g.strokeStyle='#6E737A';g.lineWidth=Math.max(2,s*0.03);g.beginPath();g.ellipse(mx,my,mw,mw*0.28,0,0,7);g.stroke();
  var lidOff=t>0.6?Math.min(1,(t-0.6)/0.5):0;ell(mx+mw*1.25*lidOff,my+mw*0.05,mw*0.9,mw*0.25,'#5A5F68');
  softbox(w*0.2,h*0.42,s*0.9);camRig(w*0.82,h*0.6,s*0.9,now);drawChar('tukang',w*0.9,h*0.98,s*0.85,null,{});
  drawChar('pengacara',w*0.12,h*0.98,s*0.9,null,{expr:t>2.6&&t<3.6?'shock':null});
  /* token goes down the manhole twice (take 1 cut, take 2 ok) */
  var down=0;if(t>1.2&&t<2.6)down=Math.min(1,(t-1.2)/0.9);else if(t>=2.6&&t<3.4)down=1-Math.min(1,(t-2.6)/0.6);else if(t>4.6&&t<6.2)down=Math.min(1,(t-4.6)/1.0);else if(t>=6.2)down=1;
  g.save();g.beginPath();g.rect(0,0,w,my+mw*0.05);g.clip();drawChar(p.char,mx,my+down*s*1.2,s,p.color,{expr:t>2.6&&t<3.6?'sad':'happy'});g.restore();
  ell(mx,my+mw*0.02,mw*0.98,mw*0.27,'rgba(26,26,30,'+(down>0.05?0.0:0)+')');
  if(t>0.4)clapper(w*0.5,h*0.12,s*0.55,t<4?(t<0.9?0.2:1):2.2);
  if(t>0.6)once('act',function(){vo('dir_action');play('stamp');});
  if(t>2.6)once('cut',function(){vo('dir_cut');play('sting');});
  if(t>4.2)once('act2',function(){play('stamp');});
  if(t>6.6)once('ok',function(){vo('dir_ok');play('camera');});
  if(t>1.6)once('tb',function(){vo('token_blusuk');});
  if(t>7.6)once('wg',function(){vo('warga_got');});
  if(t>0.6&&t<1.4)speech(w*0.12,h*0.98-s*1.0,'Action!',fs*1.1,w*0.2,{anchor:'l',W:w,weight:900});
  if(t>1.6&&t<2.6)speech(mx,my-s*1.05+down*s*1.2,typed('Saya blusukan demi rakyat!',t,1.6,30),fs,w*0.3,{anchor:'r',W:w});
  if(t>2.6&&t<4.4)speech(w*0.12,h*0.98-s*1.0,typed('Cut! Sekali lagi, Pak, kurang natural.',t,2.6,32),fs,w*0.34,{anchor:'l',W:w,bg:'#FFE27A'});
  if(t>6.6&&t<8.4)speech(w*0.12,h*0.98-s*1.0,typed('Oke, bagus! Langsung upload!',t,6.6,30),fs,w*0.3,{anchor:'l',W:w,bg:'#E8F7EC'});
  if(t>7.6)speech(w*0.9,h*0.98-s*0.95,typed('Wah, Bapak masuk got!',t,7.6,30),fs,w*0.26,{anchor:'r',W:w,bg:'#E8F0FF'});
  if(t>8.2){var it=easeOut((t-8.2)/0.4);g.save();g.globalAlpha=it;bandText(w*0.5,h*0.32,'BLUSUKAN',Math.min(w*0.08,h*0.12),'#1F6E52','#fff',-0.05);pill(w*0.5,h*0.32+Math.min(w*0.08,h*0.12)*0.95,'Muncul di '+dest,Math.max(14,fs),'#16161E','#FFD95A');g.restore();}
  if(t>6.4)flashes(w,h,t,33,4);
  if(t<0.6){var cl=t<0.25?easeOut(t/0.25):1-easeOut((t-0.25)/0.35);g.fillStyle='#000';g.fillRect(0,0,w,h*0.5*cl);g.fillRect(0,h-h*0.5*cl,w,h*0.5*cl);}
};
CINE_SCENES.gajian=function(w,h,t,e,now){
  var p=S.players[e.pid];if(!p)return;var fs=Math.max(14,Math.min(w*0.02,h*0.032)),s=Math.min(h*0.4,w*0.24),amt=e.amt||200000;
  var bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#F3E7C9');bg.addColorStop(1,'#D9C49A');g.fillStyle=bg;g.fillRect(0,0,w,h);
  g.fillStyle='rgba(120,90,50,.08)';for(var k=0;k<20;k++)g.fillRect(0,k*h/20,w,h/40);
  drawChar(p.char,w*0.2,h*0.95,s,p.color,{expr:t>6?'happy':null});
  var pokok=Math.round(amt*0.1/1000)*1000,items=[['Tunjangan rumah dinas',0.22],['Tunjangan transport',0.14],['Tunjangan komunikasi',0.12],['Dana reses',0.18],['Kunjungan kerja',0.14],['Uang sidang',0.1]],acc=pokok;
  var px=w*0.42,pw=w*0.46,lh=fs*1.7,top=h*0.12,shown=Math.max(0,Math.min(items.length,Math.floor((t-2.2)/0.55)+1));
  var ph=lh*(3.2+(t>2.2?shown:0))+fs*2,maxH=h*0.86-top,scroll=Math.max(0,ph-maxH);
  g.save();g.beginPath();g.rect(0,top-fs,w,h*0.86-top+fs*2);g.clip();g.translate(0,-scroll);
  g.save();g.shadowColor='rgba(0,0,0,.25)';g.shadowBlur=12;g.shadowOffsetY=4;g.fillStyle='#FFFDF6';g.fillRect(px,top,pw,ph);g.restore();
  g.fillStyle='#1F6E52';g.fillRect(px,top,pw,lh*1.2);g.fillStyle='#fff';g.font='900 '+(fs*1.05)+'px Nunito, sans-serif';g.textAlign='left';g.textBaseline='middle';g.fillText('SLIP GAJI PEJABAT',px+fs,top+lh*0.6);
  g.fillStyle='#16161E';g.font='800 '+fs+'px Nunito, sans-serif';var y=top+lh*1.9;
  var row=function(lbl,val,col){g.fillStyle=col||'#16161E';g.textAlign='left';g.fillText(lbl,px+fs,y);g.textAlign='right';g.fillText(val,px+pw-fs,y);y+=lh;};
  if(t>0.8)row('Gaji pokok',fmt(pokok));
  if(t>1.6&&t<2.4){g.fillStyle='#8A7560';g.textAlign='left';g.fillText('(kecil ya...)',px+fs,y);}
  if(t>1.6)once('tj',function(){vo('gaji_tunj');});
  for(var i=0;i<shown;i++){var a=Math.round(amt*items[i][1]/1000)*1000;row('+ '+items[i][0],fmt(a),'#1F6E52');}
  if(shown>0)once('it'+shown,function(){play('coins',0.4);});
  acc=pokok;for(var j=0;j<items.length;j++)acc+=Math.round(amt*items[j][1]/1000)*1000;
  if(t>6.0){g.strokeStyle='#16161E';g.lineWidth=2;g.beginPath();g.moveTo(px+fs,y-lh*0.5);g.lineTo(px+pw-fs,y-lh*0.5);g.stroke();g.font='900 '+(fs*1.15)+'px Nunito, sans-serif';row('TOTAL DITERIMA',fmt(amt));}
  g.restore();
  if(t>6.6){var sc=easeBack((t-6.6)/0.3),cfs=Math.min(w*0.09,h*0.14);var sy=Math.min(h*0.9-cfs*0.7,top+ph+cfs*0.5-scroll);cfs*=0.7;g.save();g.translate(px+pw*0.5,sy);g.rotate(-0.12);g.scale(sc,sc);g.font='900 '+cfs+'px "Baloo 2", sans-serif';g.textAlign='center';g.textBaseline='middle';var cw=g.measureText('CAIR!').width+cfs*0.6;
    g.lineWidth=cfs*0.1;g.strokeStyle='#C62828';rrect(-cw/2,-cfs*0.7,cw,cfs*1.4,cfs*0.15);g.stroke();g.fillStyle='rgba(198,40,40,.92)';g.fillText('CAIR!',0,cfs*0.05);g.restore();once('cair',function(){vo('gaji_cair');play('stamp');play('coins');});}
  if(t>7.2){speech(w*0.2,h*0.95-s*1.05,typed('Alhamdulillah, rezeki pejabat.',t,7.2,30),fs,w*0.28,{anchor:'l',W:w,bg:'#FFE27A'});once('tg',function(){vo('token_gaji');});}
  courtTitle(w,h,t,'GAJIAN PEJABAT');
  if(t<0.6){var cl=t<0.25?easeOut(t/0.25):1-easeOut((t-0.25)/0.35);g.fillStyle='#000';g.fillRect(0,0,w,h*0.5*cl);g.fillRect(0,h-h*0.5*cl,w,h*0.5*cl);}
};
/* Telepon dari Kim Jong Ah: red phone rings, the call, missile, mushroom cloud over the chosen city */
function redPhone(x,y,s,ring){g.save();g.translate(x+(ring?Math.sin(performance.now()/30)*s*0.03:0),y);
  rrect(-s*0.5,-s*0.1,s,s*0.45,s*0.08);g.fillStyle='#B71C1C';g.fill();rrect(-s*0.5,-s*0.1,s,s*0.12,s*0.06);g.fillStyle='#D32F2F';g.fill();
  ell(0,s*0.15,s*0.16,s*0.12,'#7F1010');for(var k=0;k<10;k++){var a=k/10*Math.PI*2;ell(Math.cos(a)*s*0.11,s*0.15+Math.sin(a)*s*0.08,s*0.02,s*0.015,'#F4F1EA');}
  if(!ring||Math.floor(performance.now()/90)%4){rrect(-s*0.55,-s*0.32,s*1.1,s*0.18,s*0.09);g.fillStyle='#C62828';g.fill();ell(-s*0.45,-s*0.2,s*0.14,s*0.1,'#C62828');ell(s*0.45,-s*0.2,s*0.14,s*0.1,'#C62828');}
  g.restore();}
CINE_SCENES.nuke=function(w,h,t,e,now){
  var p=S.players[e.pid];if(!p)return;var fs=Math.max(14,Math.min(w*0.021,h*0.034)),s=Math.min(h*0.34,w*0.2),city=tileName(e.tile),ow=S.players[e.owner];
  var boom=t>5.2,bt=Math.max(0,t-5.2);
  var bg=g.createLinearGradient(0,0,0,h);if(!boom){bg.addColorStop(0,'#2B2140');bg.addColorStop(1,'#4A3A5E');}else{var f=Math.min(1,bt/0.4);bg.addColorStop(0,'rgb('+Math.round(255-60*f)+','+Math.round(240-130*f)+','+Math.round(200-170*f)+')');bg.addColorStop(1,'#3A2418');}
  g.fillStyle=bg;g.fillRect(0,0,w,h);
  if(t<4.4){/* office: phone + player */
    g.fillStyle='#3A2C22';g.fillRect(0,h*0.72,w,h*0.28);g.fillStyle='#5A4232';g.fillRect(0,h*0.72,w,h*0.025);
    drawChar(p.char,w*0.28,h*0.98,s,p.color,{expr:t>1.6?'shock':null});
    redPhone(w*0.66,h*0.66,s*0.8,t<1.6);
    if(t<1.6)once('ring',function(){play('alarm');});
    if(t>0.3&&t<1.6){g.save();g.globalAlpha=0.6+0.4*Math.sin(now/80);pill(w*0.66,h*0.4,'KIM JONG AH memanggil...',Math.max(13,fs*0.95),'#16161E','#FFD95A');g.restore();}
    if(t>1.6){speech(w*0.66,h*0.5,typed('Halo kawan! Saya titip satu nuklir. Pilih kotanya.',t,1.6,32),fs,w*0.36,{anchor:'r',W:w,bg:'#FFE2E2'});once('call',function(){vo('nuke_call');});}
    if(t>3.4){speech(w*0.28,h*0.98-s*1.05,typed(city+'!',t,3.4,20),fs*1.1,w*0.26,{anchor:'l',W:w,weight:900,bg:'#FFE27A'});once('pick',function(){vo('nuke_pick');});}
  } else {
    /* city skyline, missile falls, flash, mushroom */
    skyline(w,h*0.78,h*0.32,boom?'rgba(40,20,10,.85)':'#1C1630',21);g.fillStyle=boom?'#2A1A10':'#241C34';g.fillRect(0,h*0.78,w,h*0.22);
    if(!boom){var mt=Math.min(1,(t-4.4)/0.8),mx=w*(0.85-0.35*mt),my=h*(-0.05+0.78*mt*mt);g.save();g.translate(mx,my);g.rotate(Math.atan2(0.78*2*mt*h,-0.35*w)+Math.PI);
      rrect(-s*0.3,-s*0.05,s*0.6,s*0.1,s*0.05);g.fillStyle='#D8D8DC';g.fill();g.fillStyle='#C62828';g.beginPath();g.moveTo(-s*0.3,-s*0.05);g.lineTo(-s*0.42,0);g.lineTo(-s*0.3,s*0.05);g.fill();
      ell(s*0.36,0,s*0.1+Math.random()*s*0.04,s*0.05,'rgba(255,170,40,.9)');g.restore();once('whoosh',function(){play('jet');});}
    else{once('boom',function(){play('quake');play('collapse');vo('nuke_boom');});
      if(bt<0.35){g.fillStyle='rgba(255,255,240,'+(1-bt/0.35)+')';g.fillRect(0,0,w,h);}
      var gr=easeOut(Math.min(1,bt/1.4)),cx=w*0.5,base=h*0.78,stemH=h*0.42*gr,capR=s*1.1*gr;
      g.fillStyle='#8A5A3A';rrect(cx-s*0.18*gr,base-stemH,s*0.36*gr,stemH,s*0.1);g.fill();
      for(var k=0;k<9;k++){var a=k/9*Math.PI*2+bt*0.4;ell(cx+Math.cos(a)*capR*0.55,base-stemH-capR*0.25+Math.sin(a)*capR*0.25,capR*0.45,capR*0.32,k%2?'#C47A45':'#A8603A');}
      ell(cx,base-stemH-capR*0.3,capR*0.6,capR*0.4,'#E09A55');ell(cx,base,capR*1.2,capR*0.22,'rgba(160,90,50,.8)');
      if(t>6.4){var it=easeBack((t-6.4)/0.35);g.save();g.globalAlpha=Math.min(1,(t-6.4)/0.2);bandText(w*0.5,h*0.18,'RATA!',Math.min(w*0.09,h*0.13)*it,'#C62828','#fff',-0.1);
        pill(w*0.5,h*0.18+Math.min(w*0.09,h*0.13)*0.95,city+' tinggal '+levelName(0),Math.max(14,fs),'#16161E','#FFD95A');g.restore();}
      if(t>4.9){FX.shake=Math.max(FX.shake||0,0);}
    }
  }
  if(t>=4.4)pill(w*0.5,h*0.92,city+(ow?' · milik '+ow.name:''),Math.max(13,fs),'#16161E','#fff');
  courtTitle(w,h,t,'TELEPON MERAH');
  if(t<0.6){var cl=t<0.25?easeOut(t/0.25):1-easeOut((t-0.25)/0.35);g.fillStyle='#000';g.fillRect(0,0,w,h*0.5*cl);g.fillRect(0,h-h*0.5*cl,w,h*0.5*cl);}
};
