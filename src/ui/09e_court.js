/* ---------- court + cell scenes after OTT (Politik): sogok, banding, hari di sel, bebas ---------- */
function courtRoom(w,h,now){
  var bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#5A3B24');bg.addColorStop(1,'#2E1C10');g.fillStyle=bg;g.fillRect(0,0,w,h);
  g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=Math.max(1,w*0.003);for(var i=1;i<12;i++){var x=w*i/12;g.beginPath();g.moveTo(x,0);g.lineTo(x,h*0.62);g.stroke();}
  g.fillStyle='#7A1E22';rrect(w*0.3,h*0.04,w*0.4,h*0.44,w*0.01);g.fill();g.fillStyle='rgba(255,255,255,.06)';for(var k=0;k<6;k++)g.fillRect(w*(0.31+k*0.065),h*0.04,w*0.012,h*0.44);
  var cr=Math.min(w,h)*0.055,cx=w*0.14,cy=h*0.16;ell(cx,cy,cr,cr,'#F4F1EA');g.strokeStyle='#3A2414';g.lineWidth=cr*0.14;g.beginPath();g.arc(cx,cy,cr,0,7);g.stroke();
  var a=now/9000*Math.PI*2;g.lineWidth=cr*0.1;g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.sin(a)*cr*0.7,cy-Math.cos(a)*cr*0.7);g.moveTo(cx,cy);g.lineTo(cx+Math.sin(a*12)*cr*0.85,cy-Math.cos(a*12)*cr*0.85);g.stroke();
  var fl=g.createLinearGradient(0,h*0.62,0,h);fl.addColorStop(0,'#8A6038');fl.addColorStop(1,'#4A3018');g.fillStyle=fl;g.fillRect(0,h*0.62,w,h*0.38);
}
function courtBench(w,h,s){var bx=w*0.5,by=h*0.5,bw=w*0.46,bh=h*0.2;
  var bg=g.createLinearGradient(0,by,0,by+bh);bg.addColorStop(0,'#9A6A3C');bg.addColorStop(1,'#5E3C1E');rrect(bx-bw/2,by,bw,bh,w*0.008);g.fillStyle=bg;g.fill();
  g.fillStyle='#B98450';g.fillRect(bx-bw/2-w*0.01,by-h*0.012,bw+w*0.02,h*0.024);
  rrect(bx-bw*0.16,by+bh*0.28,bw*0.32,bh*0.3,4);g.fillStyle='#E9D9A8';g.fill();g.fillStyle='#3A2414';g.font='900 '+Math.max(11,bh*0.13)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('HAKIM KETUA',bx,by+bh*0.43);
  return {x:bx,y:by,w:bw,h:bh};}
function gavel(x,y,s,rot){g.save();g.translate(x,y);g.rotate(rot);g.fillStyle='#6A3E1C';g.fillRect(-s*0.012,0,s*0.024,s*0.2);rrect(-s*0.07,-s*0.035,s*0.14,s*0.07,s*0.02);g.fillStyle='#8A5428';g.fill();g.fillStyle='#C9A24A';g.fillRect(-s*0.05,-s*0.035,s*0.012,s*0.07);g.fillRect(s*0.038,-s*0.035,s*0.012,s*0.07);g.restore();}
function envelope(x,y,s,rot){g.save();g.translate(x,y);g.rotate(rot||0);rrect(-s*0.1,-s*0.065,s*0.2,s*0.13,s*0.012);g.fillStyle='#F0E2BC';g.fill();g.strokeStyle='#A98C52';g.lineWidth=Math.max(1,s*0.01);g.stroke();
  g.fillStyle='#4CAF72';g.fillRect(-s*0.07,-s*0.085,s*0.14,s*0.04);g.fillStyle='#E2483D';g.fillRect(-s*0.04,-s*0.095,s*0.1,s*0.035);
  g.beginPath();g.moveTo(-s*0.1,-s*0.065);g.lineTo(0,s*0.01);g.lineTo(s*0.1,-s*0.065);g.strokeStyle='#A98C52';g.stroke();g.restore();}
function slamShake(t,at){if(t>at&&t<at+0.35){var k=1-(t-at)/0.35;g.translate((Math.random()-0.5)*18*k,(Math.random()-0.5)*10*k);}}
function bigVerdict(w,h,t,at,txt,sub,col){if(t<at)return;var sc=easeBack((t-at)/0.35),fs=Math.min(w*0.1,h*0.15);g.save();g.translate(w*0.5,h*0.3);g.scale(sc,sc);g.rotate(-0.05);
  bandText(0,0,txt,fs,col,'#fff',-0.06);g.restore();if(sub&&t>at+0.3){g.save();g.globalAlpha=easeOut((t-at-0.3)/0.3);pill(w*0.5,h*0.3+fs*0.95,sub,Math.max(15,fs*0.3),'#16161E','#FFD95A');g.restore();}}
function irisIn(w,h,t){if(t<0.6){var cl=t<0.25?easeOut(t/0.25):1-easeOut((t-0.25)/0.35);g.fillStyle='#000';g.fillRect(0,0,w,h*0.5*cl);g.fillRect(0,h-h*0.5*cl,w,h*0.5*cl);}}
function courtTitle(w,h,t,txt){if(t>0.3){var it=easeOut((t-0.3)/0.4);g.save();g.translate((1-it)*-w*0.5,0);bandText(w*0.17,h*0.07,txt,Math.max(16,h*0.04),'#16161E','#FFD95A',-0.15);g.restore();}}
CINE_SCENES.court=function(w,h,t,e,now){
  var p=S.players[e.pid];if(!p)return;var kind=e.kind,fs=Math.max(15,Math.min(w*0.021,h*0.034)),s=Math.min(h*0.34,w*0.2),nm=p.name,bu=isFemale(p.char)?'Ibu':'Bapak';
  if(kind==='sel')return courtCell(w,h,t,e,now,p,fs);
  if(kind==='bebas')return courtGate(w,h,t,e,now,p,fs);
  var slamAt=kind==='sogok'?7.6:7.0;
  g.save();slamShake(t,slamAt);courtRoom(w,h,now);
  drawChar('hakim',w*0.5,h*0.56,s*1.05,null,{expr:(kind==='banding'&&t>slamAt&&!e.ok)?'tease':null});
  var B=courtBench(w,h,s);
  var gr=t<slamAt-0.35?-0.5:t<slamAt?-0.5-1.4*((t-(slamAt-0.35))/0.35):t<slamAt+0.25?-1.9+1.9*((t-slamAt)/0.25):0;
  gavel(B.x+B.w*0.34,B.y-s*0.02,s,gr+0.9);
  var fy=h*0.97,tokX=w*0.8;
  rrect(tokX-s*0.55,fy-s*0.62,s*1.1,s*0.5,s*0.12);g.fillStyle='#3A2414';g.fill();
  if(kind==='banding')drawChar('pengacara',w*0.2,fy,s*1.08,null,{});else drawChar('sipir',w*0.16,fy-h*0.02,s*0.95,null,{});
  var tShake=t<slamAt?Math.sin(now/45)*s*0.006:0;
  drawChar(p.char,tokX+tShake,fy,s*1.1,p.color,{vest:true,expr:t>slamAt?(kind==='sogok'||e.ok?'happy':'sad'):'shock'});
  g.restore();
  courtTitle(w,h,t,kind==='sogok'?'SIDANG TIPIKOR':'SIDANG BANDING');
  var hX=B.x-B.w*0.05,hY=h*0.56-s*1.08;
  if(kind==='sogok'){
    if(t>0.8&&t<3.2)speech(hX,hY,typed('Terdakwa '+nm+', ada pembelaan?',t,0.8,30),fs,w*0.3,{anchor:'r',W:w});
    if(t>3.0&&t<6.0)speech(tokX,fy-s*1.25,'"'+typed('Ada, Yang Mulia. Ini pembelaan tertulis.',t,3.0,30)+'"',fs,w*0.32,{anchor:'r',W:w});
    if(t>3.8&&t<5.4){var k=easeOut((t-3.8)/1.4),sx=tokX-s*0.35,sy=fy-s*0.55,ex=B.x+B.w*0.2,ey=B.y+B.h*0.75;envelope(sx+(ex-sx)*k,sy+(ey-sy)*k-Math.sin(k*Math.PI)*h*0.12,s*1.1,k*0.5);once('env',function(){play('whoosh');});}
    if(t>=5.4)once('drawer',function(){play('stamp');});
    if(t>5.4&&t<6.6){g.save();g.globalAlpha=Math.min(1,(t-5.4)/0.3);pill(hX+s*0.2,hY-fs*0.4,'*lirik kiri... lirik kanan*',fs*0.9,'rgba(0,0,0,.7)','#FFD95A');g.restore();}
    if(t>6.4&&t<9.4)speech(hX,hY,typed('Hmm. Setelah ditimbang, berkasnya kurang bukti.',t,6.4,32),fs,w*0.32,{anchor:'r',W:w});
    if(t>slamAt)once('slam',function(){play('appeal');play('slam',0.5);});
    bigVerdict(w,h,t,slamAt,'BEBAS!','Kurang bukti, Rp'+((e.fee||0)/1000)+'rb masuk laci','#2C9A55');
    if(t>8.4)speech(w*0.16,fy-s*1.15,typed('Saya nggak lihat apa-apa.',t,8.4,30),fs*0.92,w*0.26,{anchor:'l',W:w,bg:'#E8F0FF'});
  }else{
    if(t>0.8&&t<3.0)speech(hX,hY,typed('Sidang banding '+bu+' '+nm+' dibuka.',t,0.8,30),fs,w*0.3,{anchor:'r',W:w});
    if(t>2.4&&t<5.0)speech(w*0.2,fy-s*1.25,typed('Klien saya korban kriminalisasi, Yang Mulia!',t,2.4,32),fs,w*0.32,{anchor:'l',W:w});
    if(t>5.0&&t<slamAt+0.1){speech(hX,hY,typed('Majelis memutuskan...',t,5.0,22),fs*1.05,w*0.3,{anchor:'r',W:w});once('drum',function(){play('rattle');});}
    if(t>slamAt)once('slam',function(){play('appeal');play('slam',0.5);});
    bigVerdict(w,h,t,slamAt,e.ok?'DIKABULKAN!':'DITOLAK!',e.ok?bu+' '+nm+' bebas':'Tetap ditahan, masih bisa coba double',e.ok?'#2C9A55':'#C62828');
    if(t>slamAt+0.7){var pp=Math.max(0.3,easeBack((t-slamAt-0.7)/0.35));speech(tokX,fy-s*1.25,e.ok?'Hakimnya bijak sekali!':'Saya akan lawan!',fs*1.25*pp,w*0.36,{anchor:'r',W:w,bg:'#FFE27A',stroke:e.ok?'#2C9A55':'#C62828',weight:900});
      once('q',function(){if(!e.ok)play('quip:lawan');});}
  }
  irisIn(w,h,t);
};
function courtCell(w,h,t,e,now,p,fs){
  var day=e.day||2,s=Math.min(h*0.36,w*0.22);
  var bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#5C6470');bg.addColorStop(1,'#2E333C');g.fillStyle=bg;g.fillRect(0,0,w,h);
  g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=1;for(var y=h*0.08;y<h*0.7;y+=h*0.07){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
  g.fillStyle='#3A3F48';g.fillRect(0,h*0.7,w,h*0.3);
  /* tally marks for the days */
  g.strokeStyle='#E9E4D8';g.lineWidth=Math.max(2,w*0.004);for(var d=0;d<day;d++){var tx=w*0.12+d*w*0.022;g.beginPath();g.moveTo(tx,h*0.22);g.lineTo(tx,h*0.32);g.stroke();}
  /* the "fasilitas" grow with the days: satire of the luxury cell */
  if(day>=2){rrect(w*0.06,h*0.36,w*0.16,h*0.11,6);g.fillStyle='#16161E';g.fill();rrect(w*0.07,h*0.37,w*0.14,h*0.085,4);g.fillStyle=Math.floor(now/400)%2?'#3D7BD9':'#5AA0F0';g.fill();
    rrect(w*0.7,h*0.12,w*0.16,h*0.07,8);g.fillStyle='#F4F1EA';g.fill();g.fillStyle='#9AA3AD';for(var v=0;v<4;v++)g.fillRect(w*0.72,h*0.15+v*h*0.008,w*0.12,h*0.003);}
  rrect(w*0.52,h*0.62,w*0.36,h*0.12,10);g.fillStyle=day>=2?'#C94F6D':'#8A8A80';g.fill();rrect(w*0.53,h*0.6,w*0.1,h*0.05,8);g.fillStyle='#F4F1EA';g.fill();
  drawChar(p.char,w*0.66,h*0.9,s,p.color,{vest:true,expr:day>=2?'happy':'sad'});
  if(t>1.2){var wk=Math.min(1,(t-1.2)/2.2);drawChar('sipir',w*(1.1-wk*0.7),h*0.94,s*0.95,null,{});}
  /* bars in front */
  g.fillStyle='#2A2E34';for(var b=0;b<14;b++){var bx=w*(0.02+b*0.075);g.fillRect(bx,0,w*0.012,h);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(bx,0,w*0.003,h);g.fillStyle='#2A2E34';}
  g.fillRect(0,h*0.06,w,h*0.02);g.fillRect(0,h*0.78,w,h*0.02);
  courtTitle(w,h,t,'HARI KE-'+day+' DI SEL');
  if(t>0.9&&t<3.4)speech(w*0.66,h*0.9-s*1.05,typed(day>=2?'AC-nya kurang dingin nih.':'Kapan remisi, Pak?',t,0.9,28),fs,w*0.3,{anchor:'r',W:w});
  if(t>3.4)speech(w*0.4,h*0.94-s*1.0,typed('Sabar, Bos. Tinggal '+(e.left||1)+' giliran lagi.',t,3.4,30),fs,w*0.32,{anchor:'l',W:w,bg:'#E8F0FF'});
  irisIn(w,h,t);
}
function courtGate(w,h,t,e,now,p,fs){
  var s=Math.min(h*0.36,w*0.22);
  var bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#7FB8E6');bg.addColorStop(1,'#D9ECF7');g.fillStyle=bg;g.fillRect(0,0,w,h);
  g.fillStyle='#8E9299';g.fillRect(0,h*0.2,w*0.42,h*0.55);g.fillStyle='#6E737A';g.fillRect(0,h*0.16,w*0.42,h*0.05);
  g.fillStyle='#3A3F48';g.fillRect(w*0.12,h*0.36,w*0.2,h*0.39);g.fillStyle='#2A2E34';for(var b=0;b<6;b++)g.fillRect(w*(0.13+b*0.032),h*0.36,w*0.008,h*0.39);
  rrect(w*0.1,h*0.24,w*0.24,h*0.08,4);g.fillStyle='#F4F1EA';g.fill();g.fillStyle='#16161E';g.font='900 '+Math.max(12,h*0.035)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('LAPAS',w*0.22,h*0.28);
  g.fillStyle='#B9BEC4';g.fillRect(0,h*0.75,w,h*0.25);
  var k=easeOut(Math.min(1,t/2.6)),px=w*(0.22+k*0.36);
  for(var r=0;r<3;r++){var rx=w*(0.72+r*0.09);drawChar('host',rx,h*0.98,s*0.8,null,{});}
  drawChar(p.char,px,h*0.95,s*1.05,p.color,{expr:'happy'});
  flashes(w,h,t,21,8);if(t>0.6)once('cam',function(){play('camera');setTimeout(function(){play('camera');},350);});
  bigVerdict(w,h,t,2.4,'BEBAS!',e.how==='double'?'Double! Lolos dari jeruji':'Masa tahanan habis','#2C9A55');
  if(t>3.4)speech(px,h*0.95-s*1.1,typed('Saya kembali untuk rakyat!',t,3.4,28),fs*1.1,w*0.32,{anchor:'r',W:w,bg:'#FFE27A',weight:900});
  irisIn(w,h,t);
}
