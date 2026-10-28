/* ---------- politik theme: buildings, konsesi, corners ---------- */
function smoke(x,y,s,seed){var t=performance.now()/1000;for(var k=0;k<4;k++){var ph=((t*0.45+k/4+seed*0.37)%1),r=s*(0.25+ph*0.7);
  var sg=g.createRadialGradient(x+ph*s*0.6-r*0.3,y-ph*s*2.2-r*0.3,r*0.1,x+ph*s*0.6,y-ph*s*2.2,r);sg.addColorStop(0,'rgba(245,245,245,'+(0.85*(1-ph))+')');sg.addColorStop(1,'rgba(170,170,175,'+(0.5*(1-ph))+')');
  g.beginPath();g.arc(x+ph*s*0.6,y-ph*s*2.2,r,0,7);g.fillStyle=sg;g.fill();}}
function cylinder(cu,cv,r,h,z,col,top){var b=iso(cu,cv,z),t=iso(cu,cv,z+h),rx=r*TW*0.72,ry=rx*0.5;
  var gr=g.createLinearGradient(b.x-rx,0,b.x+rx,0);gr.addColorStop(0,shade(col,0.15));gr.addColorStop(0.55,shade(col,-0.1));gr.addColorStop(1,shade(col,-0.4));
  g.beginPath();g.moveTo(b.x-rx,t.y);g.lineTo(b.x-rx,b.y);g.ellipse(b.x,b.y,rx,ry,0,Math.PI,0,true);g.lineTo(b.x+rx,t.y);g.closePath();g.fillStyle=gr;g.fill();g.strokeStyle='rgba(60,38,24,.45)';g.lineWidth=lw(0.008);g.stroke();
  g.beginPath();g.ellipse(t.x,t.y,rx,ry,0,0,7);g.fillStyle=shade(top||col,0.2);g.fill();g.stroke();return t;}
function barrierFence(cu,cv,w,d,z){
  var a=-w/2,b=w/2,c=-d/2,e=d/2,h=TH*0.16;flatRect(cu+a,cv+c,cu+b,cv+e,z+0.3,'#C9A57A');
  for(var k=0;k<6;k++){var u=cu+a+0.06+k*(w-0.12)/5,v=cv+c+0.06+((k*7)%5)*(d-0.12)/5;ell(iso(u,v,z).x,iso(u,v,z).y,TW*0.03,TH*0.02,'rgba(120,80,40,.35)');}
  [[a,e,b,e],[b,c,b,e]].forEach(function(s2){var p0=iso(cu+s2[0],cv+s2[1],z),p1=iso(cu+s2[2],cv+s2[3],z);
    g.save();g.beginPath();g.moveTo(p0.x,p0.y-h*0.3);g.lineTo(p1.x,p1.y-h*0.3);g.lineTo(p1.x,p1.y-h);g.lineTo(p0.x,p0.y-h);g.closePath();g.clip();
    var len=Math.hypot(p1.x-p0.x,p1.y-p0.y);for(var q=-2;q<len/6+4;q++){g.beginPath();var x=p0.x+(p1.x-p0.x)*q*6/len,y=p0.y+(p1.y-p0.y)*q*6/len;g.moveTo(x,y);g.lineTo(x+6,y-h*1.2);g.lineTo(x+12,y-h*1.2);g.lineTo(x+6,y);g.closePath();g.fillStyle=q%2?'#FFFFFF':'#E2483D';g.fill();}
    g.restore();g.strokeStyle='rgba(60,38,24,.5)';g.lineWidth=lw(0.006);g.beginPath();g.moveTo(p0.x,p0.y-h);g.lineTo(p1.x,p1.y-h);g.stroke();});
}
function sawtoothRoof(cu,cv,w,d,z,col){var n=3;for(var k=0;k<n;k++){var u=cu-w/2+w*(k+0.5)/n;
  var a=iso(u-w/(2*n),cv-d/2,z),b=iso(u+w/(2*n),cv-d/2,z),c=iso(u+w/(2*n),cv+d/2,z),dd=iso(u-w/(2*n),cv+d/2,z),a2=iso(u-w/(2*n),cv-d/2,z+TH*0.22),d2=iso(u-w/(2*n),cv+d/2,z+TH*0.22);
  path([a2,b,c,d2]);g.fillStyle=shade(col,-0.05);g.fill();g.strokeStyle='rgba(60,38,24,.5)';g.lineWidth=lw(0.008);g.stroke();
  path([dd,c,d2]);g.fillStyle=shade(col,-0.3);g.fill();g.stroke();
  path([a,a2,d2,dd]);g.fillStyle='rgba(120,190,230,.85)';g.fill();g.stroke();}}
function buildingPol(i,cu,cv,z,lvl,own){
  if(lvl===0){barrierFence(cu,cv,0.8,0.74,z);signPost(cu-0.05,cv-0.05,z,own,'IZIN');var ex=iso(cu+0.18,cv+0.12,z);ell(ex.x,ex.y,TW*0.12,TH*0.08,'rgba(110,70,30,.35)');return;}
  aoShadow(cu,cv,0.66,0.6,z);
  if(lvl===1){box(cu,cv,0.6,0.46,TH*0.4,z,'#C9D2DC','#AEB9C6');windows(cu,cv,0.6,0.46,z,TH*0.4,1,3,'rgba(60,90,130,.6)');sawtoothRoof(cu,cv,0.6,0.46,z+TH*0.4,own);
    var ch=cylinder(cu+0.2,cv-0.14,0.06,TH*0.75,z+TH*0.4,'#E2483D','#666');var st=iso(cu+0.2,cv-0.14,z+TH*0.98);g.fillStyle='#fff';path([iso(cu+0.14,cv-0.14,z+TH*0.86),iso(cu+0.26,cv-0.14,z+TH*0.86),iso(cu+0.26,cv-0.14,z+TH*0.94),iso(cu+0.14,cv-0.14,z+TH*0.94)]);g.fill();
    smoke(ch.x,ch.y,TW*0.08,i);var tp=iso(cu-0.08,cv+0.02,z+TH*0.62);roofEmblem(i,tp.x,tp.y,TH*0.44);}
  if(lvl===2){var pile=iso(cu+0.12,cv+0.12,z);g.beginPath();g.moveTo(pile.x-TW*0.26,pile.y);g.quadraticCurveTo(pile.x,pile.y-TH*0.9,pile.x+TW*0.26,pile.y);g.closePath();var pg=g.createLinearGradient(pile.x-TW*0.26,0,pile.x+TW*0.26,0);pg.addColorStop(0,'#8A6A4A');pg.addColorStop(1,'#4E3A28');g.fillStyle=pg;g.fill();g.strokeStyle='rgba(40,25,15,.5)';g.lineWidth=lw(0.008);g.stroke();
    for(var k=0;k<5;k++)ell(pile.x+(hash(k,i)-0.5)*TW*0.3,pile.y-TH*(0.15+hash(i,k)*0.4),TW*0.025,TH*0.03,'#6B8E9E');
    var bx=cu-0.16,by=cv-0.16,b0=iso(bx,by,z),top=iso(bx,by,z+TH*1.45);g.strokeStyle=own;g.lineWidth=lw(0.03);g.lineCap='round';
    g.beginPath();g.moveTo(b0.x-TW*0.12,b0.y);g.lineTo(top.x,top.y);g.lineTo(b0.x+TW*0.12,b0.y);g.moveTo(b0.x-TW*0.08,b0.y-TH*0.45);g.lineTo(b0.x+TW*0.08,b0.y-TH*0.45);g.moveTo(b0.x-TW*0.05,b0.y-TH*0.9);g.lineTo(b0.x+TW*0.05,b0.y-TH*0.9);g.stroke();
    g.strokeStyle='rgba(40,25,15,.6)';g.lineWidth=lw(0.01);g.beginPath();g.moveTo(b0.x-TW*0.12,b0.y);g.lineTo(b0.x+TW*0.08,b0.y-TH*0.45);g.moveTo(b0.x+TW*0.12,b0.y);g.lineTo(b0.x-TW*0.08,b0.y-TH*0.45);g.stroke();
    var wheel=performance.now()/600;g.beginPath();g.arc(top.x,top.y+TH*0.08,TW*0.06,0,7);g.fillStyle='#555';g.fill();g.strokeStyle='#ddd';g.lineWidth=lw(0.008);g.beginPath();g.moveTo(top.x+Math.cos(wheel)*TW*0.05,top.y+TH*0.08+Math.sin(wheel)*TW*0.05);g.lineTo(top.x-Math.cos(wheel)*TW*0.05,top.y+TH*0.08-Math.sin(wheel)*TW*0.05);g.stroke();
    roofEmblem(i,top.x,top.y-TH*0.02,TH*0.5);}
  if(lvl===3){box(cu-0.05,cv-0.04,0.6,0.5,TH*0.55,z,'#B9C4CF','#97A4B3');windows(cu-0.05,cv-0.04,0.6,0.5,z,TH*0.55,2,3,'rgba(60,90,130,.6)');box(cu-0.05,cv-0.04,0.62,0.52,TH*0.06,z+TH*0.55,own);
    cylinder(cu+0.28,cv+0.26,0.11,TH*0.42,z,'#E8E8E8','#CFCFCF');cylinder(cu+0.04,cv+0.32,0.09,TH*0.34,z,'#E8E8E8','#CFCFCF');
    var c1=cylinder(cu-0.22,cv-0.2,0.06,TH*1.0,z+TH*0.55,'#E2483D','#555'),c2=cylinder(cu+0.08,cv-0.22,0.06,TH*0.8,z+TH*0.55,'#E2483D','#555');smoke(c1.x,c1.y,TW*0.09,i);smoke(c2.x,c2.y,TW*0.08,i+3);
    var tp3=iso(cu-0.05,cv-0.04,z+TH*0.61);roofEmblem(i,tp3.x,tp3.y,TH*0.55);}
}
function decoWisataPol(d,cu,cv,z,now){
  var b=iso(cu,cv,z);
  if(d==='raja'){ell(b.x,b.y,TW*0.34,TH*0.3,'#1F7FA8');ell(b.x,b.y-TH*0.02,TW*0.3,TH*0.24,'#3FA3CC');
    box(cu,cv,0.3,0.3,TH*0.4,z,'#8C8C96','#6A6A75');box(cu,cv,0.36,0.36,TH*0.08,z+TH*0.4,'#F2C230');var tw=iso(cu+0.1,cv-0.1,z+TH*0.48),tt=iso(cu+0.1,cv-0.1,z+TH*1.3);
    g.strokeStyle='#E2483D';g.lineWidth=lw(0.02);g.beginPath();g.moveTo(tw.x-TW*0.05,tw.y);g.lineTo(tt.x,tt.y);g.lineTo(tw.x+TW*0.05,tw.y);g.stroke();var fl=0.6+0.4*Math.sin(now/120);ell(tt.x,tt.y-TH*0.08,TW*0.03*fl,TH*0.1*fl,'#FF8A1F');ell(tt.x,tt.y-TH*0.06,TW*0.015,TH*0.05,'#FFE27A');}
  if(d==='boro'){for(var k=0;k<4;k++){var s2=0.72-k*0.16;flatRect(cu-s2/2,cv-s2/2,cu+s2/2,cv+s2/2,z+0.3-k*TH*0.0,['#A08060','#8A6A4A','#74563A','#5E432C'][k]);}
    var pb=iso(cu-0.05,cv-0.05,z);ell(pb.x,pb.y,TW*0.08,TH*0.06,'#3A6E8A');box(cu+0.2,cv-0.2,0.16,0.1,TH*0.12,z,'#F2C230','#C99A00');box(cu+0.17,cv-0.2,0.08,0.08,TH*0.1,z+TH*0.12,'#F2C230');}
  if(d==='toba'){ell(b.x,b.y,TW*0.34,TH*0.3,'#2A86C8');ell(b.x,b.y-TH*0.02,TW*0.3,TH*0.24,'#4FA8E0');ell(b.x,b.y-TH*0.02,TW*0.2,TH*0.15,'#E9D29A');ell(b.x,b.y-TH*0.04,TW*0.16,TH*0.11,'#F6E7C1');
    var cb=iso(cu+0.08,cv-0.05,z),ct=iso(cu+0.08,cv-0.05,z+TH*1.1);g.strokeStyle='#F2A900';g.lineWidth=lw(0.025);g.beginPath();g.moveTo(cb.x,cb.y);g.lineTo(ct.x,ct.y);g.lineTo(ct.x+TW*0.28,ct.y);g.moveTo(ct.x,ct.y);g.lineTo(ct.x-TW*0.08,ct.y);g.stroke();g.strokeStyle='#555';g.lineWidth=lw(0.006);g.beginPath();g.moveTo(ct.x+TW*0.24,ct.y);g.lineTo(ct.x+TW*0.24,ct.y+TH*0.4+Math.sin(now/500)*TH*0.05);g.stroke();box(cu+0.25,cv-0.22,0.07,0.07,TH*0.06,z+TH*0.4,'#888');}
  if(d==='bromo'){for(var r=0;r<3;r++)for(var c=0;c<3;c++){var q=iso(cu-0.24+c*0.24,cv-0.24+r*0.24,z);ell(q.x,q.y,TW*0.05,TH*0.04,'rgba(60,40,10,.25)');sawit(q.x,q.y,TW*0.17,r*3+c);}}
}
function sawit(x,y,s,seed){var sw=Math.sin(performance.now()/800+seed)*0.06;g.strokeStyle='#6A4A2A';g.lineWidth=Math.max(1,s*0.14);g.lineCap='round';g.beginPath();g.moveTo(x,y);g.lineTo(x,y-s*0.6);g.stroke();
  for(var k=0;k<7;k++){var a=-Math.PI/2+(k-3)*0.42+sw;g.save();g.translate(x,y-s*0.6);g.rotate(a);var lg=g.createLinearGradient(0,0,s*0.55,0);lg.addColorStop(0,'#5E8A2A');lg.addColorStop(1,'#A7C64A');g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(s*0.3,-s*0.1,s*0.55,s*0.12);g.quadraticCurveTo(s*0.3,s*0.06,0,0);g.fillStyle=lg;g.fill();g.restore();}
  ell(x,y-s*0.58,s*0.07,s*0.06,'#C0522A');}
function decoCornerPol(i,z,now){
  var t=T[i],zn=ZN[i],cu=zn.bu,cv=zn.bv,r=RECT[i];
  if(t.type==='start'){var Q=function(u,v){return iso(r.cu+u,r.cv+v,z+0.5);};path([Q(0.5,-0.12),Q(0.0,-0.12),Q(0.0,-0.32),Q(-0.5,0),Q(0.0,0.32),Q(0.0,0.12),Q(0.5,0.12)]);g.fillStyle='#2E9E5B';g.fill();g.strokeStyle='#fff';g.lineWidth=lw(0.025);g.stroke();
    var mb=iso(r.cu-0.32,r.cv-0.32,z);g.beginPath();g.ellipse(mb.x,mb.y-TH*0.3,TW*0.16,TH*0.36,0,0,7);var bg=g.createRadialGradient(mb.x-TW*0.05,mb.y-TH*0.45,2,mb.x,mb.y-TH*0.3,TW*0.18);bg.addColorStop(0,'#E9C98A');bg.addColorStop(1,'#9A6A3A');g.fillStyle=bg;g.fill();g.strokeStyle='#6B4226';g.lineWidth=lw(0.01);g.stroke();
    g.fillStyle='#6B4226';g.font='900 '+(TH*0.34)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('Rp',mb.x,mb.y-TH*0.28);g.beginPath();g.moveTo(mb.x-TW*0.06,mb.y-TH*0.64);g.lineTo(mb.x+TW*0.06,mb.y-TH*0.64);g.lineWidth=lw(0.02);g.stroke();}
  if(t.type==='jail'){aoShadow(cu,cv,0.86,0.8,z);box(cu,cv,0.84,0.7,TH*0.55,z,'#B8BAC2','#9497A2');
    g.strokeStyle='#3A3C44';g.lineWidth=lw(0.014);for(var k=0;k<6;k++){var f=(k+0.5)/6;var q=faceQuad(cu,cv,'L',0.84,0.7,f-0.02,f+0.02,z+TH*0.15,z+TH*0.45);path(q);g.fillStyle='#3A3C44';g.fill();}
    box(cu,cv,0.86,0.72,TH*0.06,z+TH*0.55,'#8A8C96');box(cu-0.3,cv-0.28,0.2,0.2,TH*0.6,z+TH*0.61,'#C9CBD2','#A3A6B0');pyramid(cu-0.3,cv-0.28,0.28,0.28,TH*0.22,z+TH*1.21,'#5E606B');
    var lamp=iso(cu-0.3,cv-0.28,z+TH*1.0),sw=Math.sin(now/700);g.save();g.globalAlpha=0.25;g.beginPath();g.moveTo(lamp.x,lamp.y);g.lineTo(lamp.x+TW*(0.5+sw*0.3),lamp.y+TH*0.9);g.lineTo(lamp.x+TW*(0.2+sw*0.3),lamp.y+TH*1.1);g.closePath();g.fillStyle='#FFF4B0';g.fill();g.restore();
    g.strokeStyle='#6A6A70';g.lineWidth=lw(0.008);var w0=iso(r.u0+0.08,r.v1-0.08,z+TH*0.25),w1=iso(r.u1-0.08,r.v1-0.08,z+TH*0.25);g.beginPath();for(var q2=0;q2<=16;q2++){var f2=q2/16;g.lineTo(w0.x+(w1.x-w0.x)*f2,w0.y+(w1.y-w0.y)*f2-(q2%2?TH*0.05:0));}g.stroke();}
  if(t.type==='festival'){box(cu,cv,0.7,0.42,TH*0.16,z,'#5E3A8A','#462A6A');var st=iso(cu,cv,z+TH*0.16);
    [-0.3,0.3].forEach(function(o){box(cu+o,cv+0.05,0.12,0.12,TH*0.32,z+TH*0.16,'#2A2A30');var sp=iso(cu+o,cv+0.11,z+TH*0.32);ell(sp.x,sp.y,TW*0.025,TW*0.025,'#888');});
    var pb=iso(cu,cv-0.18,z+TH*0.16),bh=TH*1.0,bw=TW*0.46;g.strokeStyle='#5A4030';g.lineWidth=lw(0.016);g.beginPath();g.moveTo(pb.x-bw*0.35,pb.y);g.lineTo(pb.x-bw*0.35,pb.y-bh);g.moveTo(pb.x+bw*0.35,pb.y);g.lineTo(pb.x+bw*0.35,pb.y-bh);g.stroke();
    baliho(pb.x,pb.y-bh*0.55,bw,bh*0.62,'PILIH SAYA!','#E2483D');
    for(var n=0;n<3;n++){var ph=((now/900+n/3)%1),nx=st.x+TW*(0.1+n*0.08),ny=st.y-TH*(0.3+ph*1.2);g.save();g.globalAlpha=1-ph;g.fillStyle=['#E2483D','#2F80ED','#27AE60'][n];g.font='900 '+(TH*0.35)+'px sans-serif';g.textAlign='center';g.fillText('♪',nx,ny);g.restore();}}
  if(t.type==='pelni'){var mc=iso(cu,cv,z+0.6);ell(mc.x,mc.y+TH*0.03,TW*0.3,TH*0.17,'#4A4A50');var mg=g.createRadialGradient(mc.x-TW*0.08,mc.y-TH*0.05,2,mc.x,mc.y,TW*0.3);mg.addColorStop(0,'#8A8A92');mg.addColorStop(1,'#55555C');g.beginPath();g.ellipse(mc.x,mc.y,TW*0.28,TH*0.15,0,0,7);g.fillStyle=mg;g.fill();
    g.strokeStyle='rgba(30,30,35,.6)';g.lineWidth=lw(0.008);for(var k2=-2;k2<=2;k2++){g.beginPath();g.moveTo(mc.x+k2*TW*0.09-TW*0.08,mc.y-TH*0.08);g.lineTo(mc.x+k2*TW*0.09+TW*0.08,mc.y+TH*0.08);g.stroke();}
    [[0.42,-0.38],[-0.38,0.42],[0.42,0.32]].forEach(function(c2){var cb=iso(r.cu+c2[0],r.cv+c2[1],z);g.beginPath();g.moveTo(cb.x-TW*0.06,cb.y);g.lineTo(cb.x,cb.y-TH*0.5);g.lineTo(cb.x+TW*0.06,cb.y);g.closePath();var cg=g.createLinearGradient(cb.x-TW*0.06,0,cb.x+TW*0.06,0);cg.addColorStop(0,'#FF9A3C');cg.addColorStop(1,'#D9530C');g.fillStyle=cg;g.fill();g.fillStyle='#fff';g.fillRect(cb.x-TW*0.025,cb.y-TH*0.32,TW*0.05,TH*0.06);});}
}
function baliho(x,y,w,h,text,col){
  rrect(x-w/2,y-h/2,w,h,w*0.04);var bg=g.createLinearGradient(0,y-h/2,0,y+h/2);bg.addColorStop(0,'#FFFFFF');bg.addColorStop(1,'#E9E4DA');g.fillStyle=bg;g.fill();g.strokeStyle='rgba(60,38,24,.6)';g.lineWidth=lw(0.01);g.stroke();
  g.fillStyle=col;g.fillRect(x-w/2+w*0.04,y+h*0.18,w*0.92,h*0.26);
  var fx=x-w*0.24,fy=y-h*0.05,fr=h*0.2;ell(fx,fy+fr*1.5,fr*1.2,fr*0.8,'#2C3E66');g.beginPath();g.arc(fx,fy,fr,0,7);g.fillStyle='#F2C49B';g.fill();ell(fx,fy-fr*0.6,fr*0.95,fr*0.5,'#2A1C14');
  g.strokeStyle='#7A3B2A';g.lineWidth=Math.max(1,fr*0.12);g.beginPath();g.arc(fx,fy+fr*0.2,fr*0.4,0.15*Math.PI,0.85*Math.PI);g.stroke();ell(fx-fr*0.35,fy,fr*0.08,fr*0.1,'#222');ell(fx+fr*0.35,fy,fr*0.08,fr*0.1,'#222');
  g.fillStyle='#fff';g.font='900 '+(h*0.17)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,x,y+h*0.31);
  g.fillStyle=col;g.font='900 '+(h*0.15)+'px Nunito, sans-serif';g.fillText('NO. 1',x+w*0.18,y-h*0.12);}
