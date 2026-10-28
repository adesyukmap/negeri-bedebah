/* ---------- tile decorations ---------- */
function palm(x,y,s){
  ell(x+s*0.25,y+s*0.02,s*0.42,s*0.12,'rgba(30,50,20,.22)');
  var tg=g.createLinearGradient(x-s*0.1,0,x+s*0.2,0);tg.addColorStop(0,'#B07A44');tg.addColorStop(1,'#6E4422');
  g.strokeStyle=tg;g.lineWidth=s*0.12;g.lineCap='round';g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+s*0.25,y-s*0.6,x+s*0.1,y-s*1.1);g.stroke();
  g.strokeStyle='rgba(60,35,15,.35)';g.lineWidth=Math.max(1,s*0.02);for(var k=1;k<6;k++){var t=k/6,px=x+(2*(1-t)*t*s*0.25)+t*t*s*0.1,py=y-(2*(1-t)*t*s*0.6+t*t*s*1.1);g.beginPath();g.moveTo(px-s*0.05,py);g.lineTo(px+s*0.05,py-s*0.02);g.stroke();}
  var tx=x+s*0.1,ty=y-s*1.1,sw=Math.sin(Date.now()/900+x)*0.08;
  [[-2.6,0.9],[-1.9,1],[-1.1,1],[-0.5,0.9],[0.2,0.8],[-1.5,0.7]].forEach(function(l){g.save();g.translate(tx,ty);g.rotate(l[0]+sw);var lg=g.createLinearGradient(0,-s*0.1,0,s*0.1);lg.addColorStop(0,'#5BC46A');lg.addColorStop(1,'#1F7A3A');g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(s*0.35*l[1],-s*0.14,s*0.72*l[1],s*0.05);g.quadraticCurveTo(s*0.35*l[1],s*0.08,0,0);g.fillStyle=lg;g.fill();g.strokeStyle='rgba(20,80,40,.6)';g.lineWidth=1;g.stroke();g.restore();});
  [[-0.05,0.04],[0.05,0.06],[0,0.1]].forEach(function(c){var cg=g.createRadialGradient(tx+c[0]*s-s*0.02,ty+c[1]*s-s*0.02,1,tx+c[0]*s,ty+c[1]*s,s*0.07);cg.addColorStop(0,'#9A6A3A');cg.addColorStop(1,'#4A2E14');g.beginPath();g.arc(tx+c[0]*s,ty+c[1]*s,s*0.06,0,7);g.fillStyle=cg;g.fill();});}
function decoCorner(i,z,now){
  var t=T[i],zn=ZN[i],cu=zn.bu,cv=zn.bv,b=iso(cu,cv,z);
  if(t.type==='start'){var Q=function(u,v){return iso(RECT[i].cu+u,RECT[i].cv+v,z+0.5);};
    path([Q(0.5,-0.12),Q(0.0,-0.12),Q(0.0,-0.32),Q(-0.5,0),Q(0.0,0.32),Q(0.0,0.12),Q(0.5,0.12)]);g.fillStyle='#E2483D';g.fill();g.strokeStyle='#fff';g.lineWidth=lw(0.025);g.stroke();
    box(RECT[i].cu-0.45,RECT[i].cv-0.45,0.12,0.12,TH*1.1,z,'#E2483D');box(RECT[i].cu+0.45,RECT[i].cv-0.45,0.12,0.12,TH*1.1,z,'#E2483D');}
  if(t.type==='jail'){ell(b.x,b.y,TW*0.34,TH*0.3,'#F3DFA8');ell(b.x,b.y-TH*0.04,TW*0.29,TH*0.22,'#FBEBC0');palm(b.x-TW*0.06,b.y,TW*0.42);
    var sh=iso(cu+0.32,cv+0.1,z);g.save();g.translate(sh.x,sh.y);g.strokeStyle='#8A5A2E';g.lineWidth=lw(0.02);g.beginPath();g.moveTo(-TW*0.06,0);g.lineTo(TW*0.06,-TH*0.16);g.moveTo(TW*0.06,0);g.lineTo(-TW*0.06,-TH*0.16);g.stroke();g.restore();}
  if(t.type==='festival'){var A=pyramid(cu,cv,0.6,0.6,TH*1.0,z,'#E2483D');var st=iso(cu,cv,z);g.save();g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=lw(0.03);g.beginPath();g.moveTo(st.x-TW*0.15,st.y-TH*0.18);g.lineTo(A.x,A.y);g.lineTo(st.x+TW*0.15,st.y-TH*0.18);g.stroke();g.restore();tinyFlag(A.x,A.y,TH*0.55,'#FFD23F');
    [[0.45,-0.42,'#4CC0F0'],[-0.42,0.45,'#7BD389'],[0.45,0.3,'#FF5C7A']].forEach(function(f){var q=iso(RECT[i].cu+f[0],RECT[i].cv+f[1],z);tinyFlag(q.x,q.y,TH*0.9,f[2]);});}
  if(t.type==='pelni'){var bob=Math.sin(now/600)*TH*0.04;aoShadow(cu,cv,0.86,0.4,z);box(cu,cv,0.86,0.36,TH*0.24,z+bob,'#2C4F9E','#1E3A78');box(cu-0.02,cv,0.86,0.36,TH*0.04,z+TH*0.24+bob,'#E2483D');box(cu-0.04,cv,0.52,0.24,TH*0.26,z+TH*0.28+bob,'#FFFFFF','#E8EEF8');windows(cu-0.04,cv,0.52,0.24,z+TH*0.28+bob,TH*0.26,1,4,'rgba(40,95,160,.7)');box(cu+0.08,cv,0.1,0.1,TH*0.34,z+TH*0.54+bob,'#E2483D');box(cu+0.08,cv,0.1,0.1,TH*0.08,z+TH*0.8+bob,'#FFD23F');
    var sm=iso(cu+0.08,cv,z+TH*0.95+bob),ph=(now/1500)%1;ell(sm.x+ph*TW*0.1,sm.y-ph*TH*0.6,TW*(0.04+ph*0.05),TW*(0.04+ph*0.05),'rgba(240,240,240,'+(0.8-ph*0.7)+')');}
}
function amplop(x,y,w,col){var h=w*0.62;g.save();g.translate(x,y);g.rotate(-0.15);rrect(-w/2,-h,w,h,w*0.06);var ag=g.createLinearGradient(0,-h,0,0);ag.addColorStop(0,shade(col,0.15));ag.addColorStop(1,shade(col,-0.15));g.fillStyle=ag;g.fill();g.strokeStyle='rgba(60,38,24,.55)';g.lineWidth=lw(0.01);g.stroke();
  g.beginPath();g.moveTo(-w/2,-h);g.lineTo(0,-h*0.45);g.lineTo(w/2,-h);g.stroke();g.fillStyle='#7BC27E';g.fillRect(-w*0.3,-h*1.18,w*0.5,h*0.25);g.restore();}
function celengan(x,y,s){ell(x,y,s*0.5,s*0.14,'rgba(60,30,40,.25)');var pg=g.createRadialGradient(x-s*0.15,y-s*0.5,2,x,y-s*0.35,s*0.5);pg.addColorStop(0,'#FFC2D4');pg.addColorStop(1,'#E26A92');g.beginPath();g.ellipse(x,y-s*0.35,s*0.42,s*0.32,0,0,7);g.fillStyle=pg;g.fill();g.strokeStyle='#A8456A';g.lineWidth=lw(0.01);g.stroke();
  ell(x+s*0.4,y-s*0.35,s*0.1,s*0.1,'#F08FAE');ell(x+s*0.43,y-s*0.36,s*0.025,s*0.03,'#A8456A');ell(x+s*0.2,y-s*0.5,s*0.03,s*0.03,'#3A2030');[-0.2,0.15].forEach(function(o){g.fillStyle='#E26A92';g.fillRect(x+o*s,y-s*0.1,s*0.08,s*0.1);});
  g.fillStyle='#A8456A';g.fillRect(x-s*0.1,y-s*0.67,s*0.18,s*0.04);var c=iso(0,0,0);var bob=Math.sin(performance.now()/300)*s*0.05;ell(x-s*0.01,y-s*0.8+bob,s*0.09,s*0.09,'#F2C230');}
function decoTile(i,z,now){
  var t=T[i],zn=ZN[i],b=iso(zn.bu,zn.bv,z),pol=isPol();
  if(zn.corner)return pol?decoCornerPol(i,z,now):decoCorner(i,z,now);
  if(t.type==='chance'){var bob=Math.sin(now/420+i)*TH*0.08,w=TW*0.28,h=TW*0.37,y=b.y-h*0.8+bob;
    ell(b.x,b.y,TW*0.15,TH*0.11,'rgba(40,20,80,.22)'); g.save();g.translate(b.x,y);g.rotate(-0.12+Math.sin(now/700+i)*0.06);
    rrect(-w/2+w*0.06,-h/2+w*0.06,w,h,w*0.18);g.fillStyle='rgba(30,10,60,.25)';g.fill();
    rrect(-w/2,-h/2,w,h,w*0.18);var cg=g.createLinearGradient(-w/2,-h/2,w/2,h/2);cg.addColorStop(0,pol?'#FF8A7A':'#A894FF');cg.addColorStop(1,pol?'#B3261E':'#5A3FC0');g.fillStyle=cg;g.fill();g.strokeStyle='#fff';g.lineWidth=lw(0.02);g.stroke();
    g.fillStyle='rgba(255,255,255,.35)';rrect(-w/2+w*0.1,-h/2+w*0.08,w*0.8,h*0.18,w*0.08);g.fill();
    g.fillStyle='#FFD23F';g.font='800 '+(h*0.6)+'px "Baloo 2", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(pol?'!':'?',0,h*0.04);g.restore();}
  if(t.type==='dana'){if(pol)hibahCase(b.x,b.y,TW*0.46,now,i);else celengan(b.x,b.y,TW*0.4);}
  if(t.type==='tax'){if(pol){decoPortal(zn.bu,zn.bv,z,now);}
    else{for(var k=0;k<3;k++){var yy=b.y-k*TH*0.13;ell(b.x,yy+TH*0.05,TW*0.17,TH*0.13,'#B07A00');var cgr=g.createRadialGradient(b.x-TW*0.05,yy-TH*0.04,1,b.x,yy,TW*0.18);cgr.addColorStop(0,'#FFE27A');cgr.addColorStop(1,'#E0A100');ell(b.x,yy,TW*0.17,TH*0.13,cgr);}g.fillStyle='#8A5A00';g.font='900 '+(TH*0.2)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('Rp',b.x,b.y-TH*0.26);}}
  if(t.type==='wisata'){if(pol)decoWisataPol(t.deco,zn.bu,zn.bv,z,now);else decoWisata(t.deco,zn.bu,zn.bv,z,now);}
  if(t.type==='transport'){if(pol)decoTransportPol(t.deco,zn.bu,zn.bv,z,now,zn.axis);else decoTransport(t.deco,zn.bu,zn.bv,z,now);}
  if(t.type==='utility')decoUtility(t.deco,zn.bu,zn.bv,z,now);
  if(t.type==='parkir')decoParkir(zn.bu,zn.bv,z,now);
}
function decoWisata(d,cu,cv,z,now){
  var b=iso(cu,cv,z);now=now||0;
  if(d==='pln'||d==='pdam')return decoUtility(d,cu,cv,z,now);
  if(d==='boro'){aoShadow(cu,cv,0.66,0.66,z);box(cu,cv,0.66,0.66,TH*0.12,z,'#A89A86');box(cu,cv,0.52,0.52,TH*0.12,z+TH*0.12,'#B3A590');box(cu,cv,0.38,0.38,TH*0.12,z+TH*0.24,'#BEB09B');box(cu,cv,0.24,0.24,TH*0.1,z+TH*0.36,'#C8BBA6');var t=iso(cu,cv,z+TH*0.46);ell(t.x,t.y-TH*0.08,TW*0.08,TH*0.14,'#C8BBA6');g.fillStyle='#BEB09B';g.fillRect(t.x-lw(0.01),t.y-TH*0.34,lw(0.02),TH*0.14);}
  if(d==='bromo'){var gr=g.createLinearGradient(b.x-TW*0.34,0,b.x+TW*0.34,0);gr.addColorStop(0,'#A87C5A');gr.addColorStop(1,'#5E3F2A');g.beginPath();g.moveTo(b.x-TW*0.34,b.y);g.quadraticCurveTo(b.x-TW*0.14,b.y-TH*0.95,b.x-TW*0.08,b.y-TH*1.0);g.lineTo(b.x+TW*0.08,b.y-TH*1.0);g.quadraticCurveTo(b.x+TW*0.14,b.y-TH*0.95,b.x+TW*0.34,b.y);g.closePath();g.fillStyle=gr;g.fill();g.strokeStyle='rgba(60,38,24,.5)';g.lineWidth=lw(0.01);g.stroke();ell(b.x,b.y-TH*1.0,TW*0.08,TH*0.05,'#3A2618');
    var tt=now/900;for(var k=0;k<3;k++){var ph=(tt+k/3)%1;ell(b.x+Math.sin(ph*6)*TW*0.04,b.y-TH*(1.1+ph*0.7),TW*(0.05+ph*0.05),TW*(0.05+ph*0.05),'rgba(240,240,240,'+(0.8-ph*0.7)+')');}}
  if(d==='raja'){ell(b.x,b.y,TW*0.34,TH*0.3,'#2FB7D6');ell(b.x,b.y-TH*0.02,TW*0.3,TH*0.24,'#5FD3EA');[[-0.12,0.02,0.1],[0.08,-0.05,0.12],[0.14,0.08,0.08]].forEach(function(m){var mx=b.x+m[0]*TW,my=b.y+m[1]*TW;g.beginPath();g.ellipse(mx,my,TW*m[2],TH*m[2]*2.6,0,Math.PI,0);g.closePath();g.fillStyle='#2E9E4E';g.fill();g.strokeStyle='#1D6E34';g.lineWidth=1;g.stroke();});}
  if(d==='toba'){ell(b.x,b.y,TW*0.34,TH*0.3,'#2A86C8');ell(b.x,b.y-TH*0.02,TW*0.3,TH*0.24,'#4FA8E0');ell(b.x+TW*0.03,b.y-TH*0.02,TW*0.13,TH*0.09,'#3FA05A');ell(b.x+TW*0.03,b.y-TH*0.05,TW*0.09,TH*0.05,'#59C277');
    var hh=iso(cu+0.05,cv-0.02,z);box(cu+0.05,cv-0.02,0.1,0.08,TH*0.1,z+1,'#8A5A33');}
}

function decoTransport(d,cu,cv,z,now){var b=iso(cu,cv,z);aoShadow(cu,cv,0.7,0.4,z);
  if(d==='plane'){box(cu,cv,0.72,0.16,TH*0.18,z+TH*0.25,'#F4F6F9','#C9D2DC');var n=iso(cu+0.38,cv,z+TH*0.34);ell(n.x,n.y,TW*0.06,TH*0.08,'#E9EEF4');
    path([iso(cu-0.05,cv-0.45,z+TH*0.32),iso(cu+0.12,cv-0.45,z+TH*0.32),iso(cu+0.12,cv+0.45,z+TH*0.32),iso(cu-0.05,cv+0.45,z+TH*0.32)]);g.fillStyle='#D9E0E8';g.fill();g.strokeStyle='rgba(60,70,90,.5)';g.lineWidth=lw(0.008);g.stroke();
    box(cu-0.32,cv,0.1,0.06,TH*0.3,z+TH*0.43,'#E2483D');[-0.2,0.2].forEach(function(o){box(cu+0.02,cv+o,0.08,0.06,TH*0.08,z+TH*0.2,'#8C96A3');});
    g.fillStyle='rgba(50,110,170,.85)';for(var k=0;k<5;k++){var wq=iso(cu-0.2+k*0.11,cv+0.08,z+TH*0.36);ell(wq.x,wq.y,TW*0.012,TH*0.03,'rgba(50,110,170,.85)');}
    [[-0.1,-0.06],[0.25,0]].forEach(function(o){var wb=iso(cu+o[0],cv+o[1],z+TH*0.05);g.fillStyle='#333';g.fillRect(wb.x-1.5,wb.y-TH*0.2,3,TH*0.2);});}
  if(d==='ship'){ell(b.x,b.y,TW*0.38,TH*0.3,'#3FA3CC');box(cu,cv,0.7,0.26,TH*0.18,z,'#2C4F9E','#1E3A78');[['#E2483D',-0.22],['#F2B705',-0.05],['#2E9E5B',0.12]].forEach(function(c){box(cu+c[1],cv,0.15,0.22,TH*0.16,z+TH*0.18,c[0]);});box(cu+0.27,cv,0.12,0.2,TH*0.34,z+TH*0.18,'#FFFFFF','#E3E8EE');}
  if(d==='train'){box(cu,cv,0.8,0.14,TH*0.04,z,'#7A6A5A');box(cu-0.05,cv,0.62,0.16,TH*0.26,z+TH*0.04,'#FBFBF8','#DADDE2');var nose=[iso(cu+0.26,cv-0.08,z+TH*0.04),iso(cu+0.45,cv,z+TH*0.04),iso(cu+0.26,cv+0.08,z+TH*0.04),iso(cu+0.26,cv+0.08,z+TH*0.24)];path(nose);g.fillStyle='#E2483D';g.fill();
    g.fillStyle='#E2483D';path(faceQuad(cu-0.05,cv,'L',0.62,0.16,0,1,z+TH*0.08,z+TH*0.12));g.fill();g.fillStyle='rgba(40,80,130,.8)';for(var k2=0;k2<5;k2++){path(faceQuad(cu-0.05,cv,'L',0.62,0.16,0.05+k2*0.18,0.15+k2*0.18,z+TH*0.15,z+TH*0.23));g.fill();}}
  if(d==='bus'){box(cu,cv,0.6,0.24,TH*0.36,z+TH*0.04,'#2E9E5B','#1F7A44');g.fillStyle='rgba(200,230,255,.9)';for(var k3=0;k3<4;k3++){path(faceQuad(cu,cv,'L',0.6,0.24,0.08+k3*0.22,0.24+k3*0.22,z+TH*0.2,z+TH*0.34));g.fill();}
    box(cu,cv,0.62,0.26,TH*0.03,z+TH*0.4,'#F2B705');[[-0.2,0.12],[0.2,0.12]].forEach(function(o){var wq=iso(cu+o[0],cv+o[1],z+TH*0.05);ell(wq.x,wq.y,TW*0.04,TH*0.05,'#222');});}
}
function decoUtility(d,cu,cv,z,now){var b=iso(cu,cv,z);
  if(d==='pln'){var t=iso(cu,cv,z+TH*1.5);g.strokeStyle='#8C96A3';g.lineWidth=lw(0.02);g.lineCap='round';g.beginPath();g.moveTo(b.x-TW*0.16,b.y);g.lineTo(t.x,t.y);g.lineTo(b.x+TW*0.16,b.y);g.stroke();
    g.lineWidth=lw(0.01);[0.3,0.55,0.8].forEach(function(f){var y=b.y-(b.y-t.y)*f,w=TW*0.16*(1-f);g.beginPath();g.moveTo(b.x-w,y);g.lineTo(b.x+w,y);g.stroke();});
    [0.62,0.86].forEach(function(f){var y=b.y-(b.y-t.y)*f;g.lineWidth=lw(0.016);g.beginPath();g.moveTo(b.x-TW*0.22,y);g.lineTo(b.x+TW*0.22,y);g.stroke();ell(b.x-TW*0.22,y+2,TW*0.012,TW*0.018,'#C9D2DC');ell(b.x+TW*0.22,y+2,TW*0.012,TW*0.018,'#C9D2DC');});
    var fl=(Math.floor(now/600)%2)?'#FFE27A':'#F2B705';g.beginPath();var lx=b.x+TW*0.25,ly=b.y-TH*0.45;g.moveTo(lx,ly-TH*0.3);g.lineTo(lx-TW*0.06,ly);g.lineTo(lx,ly);g.lineTo(lx-TW*0.04,ly+TH*0.25);g.lineTo(lx+TW*0.07,ly-TH*0.06);g.lineTo(lx+TW*0.01,ly-TH*0.06);g.closePath();g.fillStyle=fl;g.fill();g.strokeStyle='#9A6A00';g.lineWidth=lw(0.008);g.stroke();}
  if(d==='pdam'){[[-0.15,-0.15],[0.15,-0.15],[-0.15,0.15],[0.15,0.15]].forEach(function(o){var a=iso(cu+o[0],cv+o[1],z),c=iso(cu+o[0]*0.6,cv+o[1]*0.6,z+TH*0.8);g.strokeStyle='#6A6A75';g.lineWidth=lw(0.018);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(c.x,c.y);g.stroke();});
    var tp=cylinder(cu,cv,0.22,TH*0.5,z+TH*0.8,'#3D7BD9','#6FA8F0');pyramid(cu,cv,0.3,0.3,TH*0.18,z+TH*1.3,'#2C5FB8');
    var dr=(now/700)%1;ell(b.x+TW*0.08,b.y-TH*0.8*(1-dr),TW*0.02,TW*0.028,'rgba(90,170,240,'+(1-dr)+')');}
}
function decoParkir(cu,cv,z,now){var s=iso(cu+0.25,cv-0.25,z),h=TH*1.0;g.strokeStyle='#8C96A3';g.lineWidth=lw(0.02);g.beginPath();g.moveTo(s.x,s.y);g.lineTo(s.x,s.y-h);g.stroke();
  rrect(s.x-TW*0.1,s.y-h-TW*0.18,TW*0.2,TW*0.2,TW*0.03);g.fillStyle='#2F6FB0';g.fill();g.strokeStyle='#fff';g.lineWidth=lw(0.012);g.stroke();g.fillStyle='#fff';g.font='900 '+(TW*0.15)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('P',s.x,s.y-h-TW*0.08);
  var m=iso(cu-0.12,cv+0.08,z);box(cu-0.12,cv+0.08,0.3,0.08,TH*0.14,z+TH*0.06,'#E2483D','#B8322A');[-0.12,0.12].forEach(function(o){var w=iso(cu-0.12+o,cv+0.08,z+TH*0.06);ell(w.x,w.y,TW*0.035,TH*0.05,'#222');});
  var pk=iso(cu+0.18,cv+0.2,z),wave=Math.sin(now/220)*0.4;drawMiniPerson(pk.x,pk.y,TW*0.28,'#FF7A1A',wave,true);}
function drawMiniPerson(x,y,s,shirt,wave,whistle){ell(x,y,s*0.25,s*0.08,'rgba(30,20,10,.25)');rrect(x-s*0.14,y-s*0.55,s*0.28,s*0.5,s*0.1);g.fillStyle=shirt;g.fill();g.strokeStyle='rgba(60,30,10,.5)';g.lineWidth=1;g.stroke();
  g.fillStyle='#fff';g.fillRect(x-s*0.14,y-s*0.35,s*0.28,s*0.04);g.beginPath();g.arc(x,y-s*0.7,s*0.15,0,7);g.fillStyle='#E9B58A';g.fill();ell(x,y-s*0.8,s*0.16,s*0.07,'#2A2A30');
  g.strokeStyle='#E9B58A';g.lineWidth=Math.max(1.5,s*0.07);g.lineCap='round';g.beginPath();g.moveTo(x+s*0.12,y-s*0.48);g.lineTo(x+s*0.3,y-s*0.75-wave*s*0.15);g.stroke();if(whistle)ell(x-s*0.04,y-s*0.64,s*0.04,s*0.03,'#C0C0C0');}
function decoPortal(cu,cv,z,now){box(cu-0.18,cv-0.12,0.24,0.24,TH*0.45,z,'#E9E4DA','#C9C2B4');pyramid(cu-0.18,cv-0.12,0.32,0.32,TH*0.14,z+TH*0.45,'#E2483D');g.fillStyle='rgba(60,100,150,.7)';path(faceQuad(cu-0.18,cv-0.12,'L',0.24,0.24,0.2,0.8,z+TH*0.2,z+TH*0.38));g.fill();
  var a=iso(cu+0.06,cv+0.15,z+TH*0.3),ang=-0.25+Math.sin(now/900)*0.15,len=TW*0.55;g.save();g.translate(a.x,a.y);g.rotate(ang);for(var k=0;k<6;k++){g.fillStyle=k%2?'#FFFFFF':'#E2483D';g.fillRect(k*len/6,-TW*0.018,len/6,TW*0.036);}g.strokeStyle='rgba(60,38,24,.5)';g.lineWidth=1;g.strokeRect(0,-TW*0.018,len,TW*0.036);g.restore();
  box(cu+0.06,cv+0.15,0.08,0.08,TH*0.32,z,'#6A6A75');var pr=iso(cu+0.25,cv-0.2,z);drawMiniPerson(pr.x,pr.y,TW*0.3,'#2A2A30',Math.sin(now/300)*0.5,false);}
/* Politik: Dana Hibah = black briefcase stamped HIBAH with a "Yayasan Keluarga" luggage tag */
function hibahCase(x,y,w,now,seed){var h=w*0.62,bob=Math.sin(now/600+seed)*w*0.015;ell(x,y+w*0.02,w*0.52,w*0.13,'rgba(20,20,30,.3)');
  g.save();g.translate(x,y-w*0.06+bob);g.rotate(-0.08);
  rrect(-w*0.16,-h-w*0.12,w*0.32,w*0.16,w*0.05);g.strokeStyle='#1A1A1E';g.lineWidth=Math.max(1.5,w*0.05);g.stroke();
  rrect(-w/2,-h,w,h,w*0.08);var cg=g.createLinearGradient(0,-h,0,0);cg.addColorStop(0,'#3A3A42');cg.addColorStop(0.5,'#1E1E24');cg.addColorStop(1,'#0E0E12');g.fillStyle=cg;g.fill();g.strokeStyle='#050507';g.lineWidth=Math.max(1,w*0.02);g.stroke();
  g.fillStyle='rgba(255,255,255,.12)';rrect(-w*0.44,-h*0.94,w*0.88,h*0.16,w*0.05);g.fill();
  g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=Math.max(1,w*0.012);g.beginPath();g.moveTo(-w/2,-h*0.62);g.lineTo(w/2,-h*0.62);g.stroke();
  [-0.3,0.3].forEach(function(o){rrect(o*w-w*0.06,-h*0.7,w*0.12,w*0.08,w*0.02);g.fillStyle='#D9B54A';g.fill();});
  g.save();g.translate(0,-h*0.32);g.rotate(-0.12);var sw=w*0.62,sh=h*0.34;rrect(-sw/2,-sh/2,sw,sh,w*0.04);g.strokeStyle='#E53935';g.lineWidth=Math.max(1.2,w*0.03);g.stroke();
  g.fillStyle='#E53935';g.font='900 '+(sh*0.66)+'px "Baloo 2", Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('HIBAH',0,sh*0.05);g.restore();
  g.restore();
  var tx=x+w*0.42,ty=y-h*0.95+bob;g.strokeStyle='#C9A24A';g.lineWidth=Math.max(1,w*0.012);g.beginPath();g.moveTo(x+w*0.12,y-h-w*0.1+bob);g.quadraticCurveTo(tx-w*0.05,ty-w*0.12,tx,ty);g.stroke();
  g.save();g.translate(tx,ty);g.rotate(0.28+Math.sin(now/500+seed)*0.08);var fs=Math.max(6,w*0.085);g.font='900 '+fs+'px Nunito, sans-serif';var lw2=Math.max(g.measureText('Yayasan').width,g.measureText('Keluarga').width)+fs*0.9;
  rrect(-fs*0.2,-fs*0.3,lw2,fs*2.7,fs*0.3);g.fillStyle='#FFF3C9';g.fill();g.strokeStyle='#8A6A2A';g.lineWidth=1;g.stroke();ell(fs*0.25,fs*0.25,fs*0.14,fs*0.14,'#8A6A2A');
  g.fillStyle='#5A3A10';g.textAlign='left';g.textBaseline='top';g.fillText('Yayasan',fs*0.5,fs*0.0);g.fillText('Keluarga',fs*0.5,fs*1.15);g.restore();}
/* Politik transport: Jet Pribadi Pejabat, Pelabuhan Ekspor Nikel, Kereta Cepat Utang, Bus Studi Banding */
function decoTransportPol(d,cu,cv,z,now,axis){var b=iso(cu,cv,z);
  if(d==='plane'){// red carpet to the stairs
    path([iso(cu+0.36,cv+0.12,z+0.4),iso(cu+0.36,cv+0.22,z+0.4),iso(cu-0.02,cv+0.22,z+0.4),iso(cu-0.02,cv+0.12,z+0.4)]);g.fillStyle='#C62828';g.fill();g.strokeStyle='#F2C230';g.lineWidth=lw(0.006);g.stroke();
    [0.0,0.34].forEach(function(o){var pq=iso(cu+o,cv+0.26,z);g.strokeStyle='#D9B54A';g.lineWidth=lw(0.008);g.beginPath();g.moveTo(pq.x,pq.y);g.lineTo(pq.x,pq.y-TH*0.22);g.stroke();ell(pq.x,pq.y-TH*0.22,lw(0.012),lw(0.012),'#F2C230');});
    var ra=iso(0.0+cu,cv+0.26,z+TH*0.2),rb=iso(cu+0.34,cv+0.26,z+TH*0.2);g.strokeStyle='#8E1E16';g.lineWidth=lw(0.008);g.beginPath();g.moveTo(ra.x,ra.y);g.quadraticCurveTo((ra.x+rb.x)/2,(ra.y+rb.y)/2+TH*0.06,rb.x,rb.y);g.stroke();
    aoShadow(cu-0.05,cv-0.12,0.66,0.3,z);
    // fuselage (slim, along u), swept wings, T-tail, engines
    var fz=z+TH*0.28,L=0.66,c0=cu-0.08,v0=cv-0.12;
    path([iso(c0-0.1,v0-0.38,fz),iso(c0+0.04,v0-0.06,fz),iso(c0+0.04,v0+0.06,fz),iso(c0-0.1,v0+0.38,fz),iso(c0-0.17,v0+0.38,fz),iso(c0-0.08,v0+0.05,fz),iso(c0-0.08,v0-0.05,fz),iso(c0-0.17,v0-0.38,fz)]);g.fillStyle='#E6EAF0';g.fill();g.strokeStyle='rgba(60,70,90,.55)';g.lineWidth=lw(0.006);g.stroke();
    box(c0,v0,L,0.12,TH*0.14,fz-TH*0.05,'#FAFBFD','#C9D2DC');
    var nose=[iso(c0+L/2,v0-0.06,fz-TH*0.05),iso(c0+L/2+0.12,v0,fz+TH*0.02),iso(c0+L/2,v0+0.06,fz-TH*0.05),iso(c0+L/2,v0+0.06,fz+TH*0.09)];path(nose);g.fillStyle='#E9EEF4';g.fill();g.stroke();
    var wq=iso(c0+L/2-0.02,v0+0.06,fz+TH*0.05);ell(wq.x,wq.y,TW*0.025,TH*0.03,'#2A3A55');
    g.fillStyle='rgba(50,90,150,.85)';for(var k=0;k<4;k++){var wp=iso(c0-0.16+k*0.1,v0+0.06,fz+TH*0.05);ell(wp.x,wp.y,TW*0.01,TH*0.022,'rgba(50,90,150,.85)');}
    path(faceQuad(c0,v0,'L',L,0.12,0.02,0.98,fz-TH*0.01,fz+TH*0.015));g.fillStyle='#C9A24A';g.fill();
    [-1,1].forEach(function(sd){box(c0-0.24,v0+sd*0.1,0.12,0.06,TH*0.07,fz+TH*0.04,'#D0D6DE','#9AA4B0');});
    path([iso(c0-0.31,v0,fz+TH*0.09),iso(c0-0.37,v0,fz+TH*0.34),iso(c0-0.31,v0,fz+TH*0.34),iso(c0-0.2,v0,fz+TH*0.09)]);g.fillStyle='#1E2A44';g.fill();g.strokeStyle='rgba(20,20,40,.6)';g.lineWidth=lw(0.005);g.stroke();
    path([iso(c0-0.37,v0-0.1,fz+TH*0.34),iso(c0-0.31,v0-0.1,fz+TH*0.34),iso(c0-0.31,v0+0.1,fz+TH*0.34),iso(c0-0.37,v0+0.1,fz+TH*0.34)]);g.fillStyle='#2C3A5C';g.fill();var ft=iso(c0-0.33,v0,fz+TH*0.22);ell(ft.x,ft.y,TW*0.012,TW*0.012,'#F2C230');
    var sb=iso(c0+0.22,v0+0.06,fz-TH*0.03),sg=iso(c0+0.22,v0+0.2,z);g.strokeStyle='#8C96A3';g.lineWidth=lw(0.012);g.beginPath();g.moveTo(sb.x,sb.y);g.lineTo(sg.x,sg.y);g.stroke();
    [[-0.12,0],[0.24,0]].forEach(function(o){var wb=iso(c0+o[0],v0+o[1],z+TH*0.04);g.fillStyle='#333';g.fillRect(wb.x-1.5,wb.y-TH*0.18,3,TH*0.18);});}
  if(d==='ship'){// dock with nickel ore pile + bulk carrier
    ell(b.x+TW*0.06,b.y+TH*0.04,TW*0.42,TH*0.3,'#2E8FB8');ell(b.x+TW*0.06,b.y+TH*0.02,TW*0.36,TH*0.24,'#4FA8D0');
    box(cu-0.22,cv,0.26,0.7,TH*0.1,z,'#9A7A52','#6E5434');for(var pk=0;pk<5;pk++){path(faceQuad(cu-0.22,cv,'R',0.26,0.7,pk*0.2+0.02,pk*0.2+0.04,z,z+TH*0.1));g.fillStyle='rgba(60,40,20,.5)';g.fill();}
    var pile=iso(cu-0.24,cv-0.12,z+TH*0.1);g.beginPath();g.moveTo(pile.x-TW*0.17,pile.y+TH*0.04);g.quadraticCurveTo(pile.x-TW*0.02,pile.y-TH*0.62,pile.x+TW*0.15,pile.y+TH*0.06);g.closePath();
    var ng=g.createLinearGradient(pile.x-TW*0.17,pile.y-TH*0.5,pile.x+TW*0.15,pile.y);ng.addColorStop(0,'#7A8A7E');ng.addColorStop(0.5,'#4E5C52');ng.addColorStop(1,'#2E3832');g.fillStyle=ng;g.fill();g.strokeStyle='rgba(20,30,25,.6)';g.lineWidth=lw(0.006);g.stroke();
    for(var o=0;o<9;o++)ell(pile.x+(hash(o,3)-0.5)*TW*0.22,pile.y-TH*(0.04+hash(o,4)*0.32),TW*0.016,TH*0.02,o%3?'#9AB8A2':'#5E6E62');
    var sw2=Math.sin(now/1600)*0.08,cb=iso(cu-0.3,cv+0.22,z+TH*0.1),ct=iso(cu-0.3,cv+0.22,z+TH*0.95);g.strokeStyle='#F2B705';g.lineWidth=lw(0.016);g.beginPath();g.moveTo(cb.x,cb.y);g.lineTo(ct.x,ct.y);g.lineTo(ct.x+TW*(0.3+sw2),ct.y+TH*0.06);g.stroke();g.strokeStyle='#444';g.lineWidth=lw(0.004);g.beginPath();g.moveTo(ct.x+TW*(0.27+sw2),ct.y+TH*0.05);g.lineTo(ct.x+TW*(0.27+sw2),ct.y+TH*0.45);g.stroke();
    var bob=Math.sin(now/700)*TH*0.02;box(cu+0.16,cv,0.3,0.74,TH*0.16,z+bob,'#B3261E','#7E1A14');box(cu+0.16,cv,0.31,0.75,TH*0.05,z+TH*0.16+bob,'#2A2A30','#1A1A20');
    [-0.2,0.05].forEach(function(o){box(cu+0.16,cv+o,0.22,0.18,TH*0.06,z+TH*0.2+bob,'#3E4A42','#2A332D');var hp=iso(cu+0.16,cv+o,z+TH*0.27+bob);ell(hp.x,hp.y,TW*0.06,TH*0.05,'#5E6E62');});
    box(cu+0.16,cv+0.28,0.22,0.14,TH*0.32,z+TH*0.21+bob,'#F4F6F9','#C9D2DC');windows(cu+0.16,cv+0.28,0.22,0.14,z+TH*0.21+bob,TH*0.32,2,2,'rgba(40,95,160,.7)');
    box(cu+0.2,cv+0.3,0.06,0.06,TH*0.14,z+TH*0.53+bob,'#E2483D');}
  if(d==='train'){// bullet train + huge UTANG price tag
    box(cu,cv,0.86,0.16,TH*0.05,z,'#7A6A5A','#5A4A3A');for(var sl=0;sl<7;sl++){var sq=iso(cu-0.38+sl*0.13,cv,z+TH*0.05);g.fillStyle='rgba(60,45,30,.6)';g.fillRect(sq.x-TW*0.03,sq.y-1,TW*0.06,2);}
    box(cu-0.06,cv,0.6,0.16,TH*0.26,z+TH*0.05,'#FBFBF8','#D6DAE0');
    var nz=[iso(cu+0.24,cv-0.08,z+TH*0.05),iso(cu+0.5,cv,z+TH*0.05),iso(cu+0.24,cv+0.08,z+TH*0.05),iso(cu+0.24,cv+0.08,z+TH*0.31)];path(nz);g.fillStyle='#F4F6F8';g.fill();g.strokeStyle='rgba(60,38,24,.45)';g.lineWidth=lw(0.006);g.stroke();
    path([iso(cu+0.24,cv+0.08,z+TH*0.31),iso(cu+0.24,cv-0.08,z+TH*0.31),iso(cu+0.5,cv,z+TH*0.05)]);g.fillStyle='#E9ECF0';g.fill();g.stroke();
    var wd=iso(cu+0.33,cv+0.04,z+TH*0.17);ell(wd.x,wd.y,TW*0.04,TH*0.04,'#22324A');
    g.fillStyle='#D7261E';path(faceQuad(cu-0.06,cv,'L',0.6,0.16,0,1,z+TH*0.09,z+TH*0.13));g.fill();g.fillStyle='rgba(40,80,130,.8)';for(var k2=0;k2<5;k2++){path(faceQuad(cu-0.06,cv,'L',0.6,0.16,0.05+k2*0.18,0.15+k2*0.18,z+TH*0.16,z+TH*0.25));g.fill();}
    var tg=iso(cu-0.12,cv-0.02,z+TH*0.31),tw=TW*0.42,th=TH*0.4,sw3=Math.sin(now/500)*0.06;g.strokeStyle='#6A4A2A';g.lineWidth=lw(0.006);g.beginPath();g.moveTo(tg.x,tg.y);g.lineTo(tg.x+TW*0.02,tg.y-TH*0.3);g.stroke();
    g.save();g.translate(tg.x+TW*0.02,tg.y-TH*0.3);g.rotate(-0.18+sw3);g.beginPath();g.moveTo(-tw*0.5,-th*0.5);g.lineTo(tw*0.38,-th*0.5);g.lineTo(tw*0.5,0);g.lineTo(tw*0.38,th*0.5);g.lineTo(-tw*0.5,th*0.5);g.closePath();g.fillStyle='#D7261E';g.fill();g.strokeStyle='#7E120C';g.lineWidth=lw(0.008);g.stroke();
    ell(tw*0.34,0,th*0.09,th*0.09,'#FFF3C9');g.fillStyle='#fff';var ufs=th*0.6;g.font='900 '+ufs+'px "Baloo 2", Nunito, sans-serif';var uw=g.measureText('UTANG').width;if(uw>tw*0.74){ufs*=tw*0.74/uw;g.font='900 '+ufs+'px "Baloo 2", Nunito, sans-serif';}g.textAlign='center';g.textBaseline='middle';g.fillText('UTANG',-tw*0.07,th*0.05);g.restore();}
  if(d==='bus'){// tour bus with STUDI BANDING banner
    aoShadow(cu,cv,0.66,0.3,z);box(cu,cv,0.64,0.26,TH*0.38,z+TH*0.05,'#F4F1EA','#D6D0C2');
    g.fillStyle='rgba(30,60,100,.85)';for(var k3=0;k3<5;k3++){path(faceQuad(cu,cv,'L',0.64,0.26,0.05+k3*0.19,0.2+k3*0.19,z+TH*0.24,z+TH*0.38));g.fill();}
    g.fillStyle='rgba(30,60,100,.85)';path(faceQuad(cu,cv,'R',0.64,0.26,0.12,0.88,z+TH*0.22,z+TH*0.39));g.fill();
    g.fillStyle='#E2483D';path(faceQuad(cu,cv,'L',0.64,0.26,0,1,z+TH*0.1,z+TH*0.15));g.fill();g.fillStyle='#F2B705';path(faceQuad(cu,cv,'L',0.64,0.26,0,1,z+TH*0.15,z+TH*0.18));g.fill();
    box(cu,cv,0.66,0.28,TH*0.03,z+TH*0.43,'#D6D0C2');box(cu-0.12,cv,0.18,0.18,TH*0.05,z+TH*0.46,'#8A8E96');
    [[-0.2,0.13],[0.2,0.13]].forEach(function(o){var wq=iso(cu+o[0],cv+o[1],z+TH*0.06);ell(wq.x,wq.y,TW*0.045,TH*0.055,'#222');ell(wq.x,wq.y,TW*0.02,TH*0.025,'#888');});
    var p0=iso(cu-0.3,cv+0.13,z+TH*0.52),p1=iso(cu+0.3,cv+0.13,z+TH*0.52),bh2=TH*0.24,fl=Math.sin(now/260)*TH*0.02;
    [p0,p1].forEach(function(q){g.strokeStyle='#5A4030';g.lineWidth=lw(0.008);g.beginPath();g.moveTo(q.x,q.y+TH*0.08);g.lineTo(q.x,q.y-bh2);g.stroke();});
    g.beginPath();g.moveTo(p0.x,p0.y-bh2);g.lineTo(p1.x,p1.y-bh2+fl);g.lineTo(p1.x,p1.y+fl);g.lineTo(p0.x,p0.y);g.closePath();g.fillStyle='#1F6E52';g.fill();g.strokeStyle='#F2C230';g.lineWidth=lw(0.006);g.stroke();
    var ang=Math.atan2(p1.y-p0.y,p1.x-p0.x),mx=(p0.x+p1.x)/2,my=(p0.y+p1.y)/2-bh2/2+fl/2,len=Math.hypot(p1.x-p0.x,p1.y-p0.y);g.save();g.translate(mx,my);g.rotate(ang);var fs=Math.min(bh2*0.62,len/9.2);g.font='900 '+fs+'px Nunito, sans-serif';g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';g.fillText('STUDI BANDING',0,fs*0.06);g.restore();}
}
