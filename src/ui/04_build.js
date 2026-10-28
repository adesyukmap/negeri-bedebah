/* ---------- buildings ---------- */
function tinyFlag(x,y,h,col){g.strokeStyle='#5A4030';g.lineWidth=lw(0.016);g.beginPath();g.moveTo(x,y);g.lineTo(x,y-h);g.stroke();g.beginPath();g.moveTo(x,y-h);g.quadraticCurveTo(x+h*0.3,y-h*0.92,x+h*0.5,y-h*0.82);g.quadraticCurveTo(x+h*0.28,y-h*0.7,x,y-h*0.62);g.closePath();g.fillStyle=col;g.fill();g.strokeStyle=shade(col,-0.4);g.lineWidth=lw(0.008);g.stroke();ell(x,y-h,lw(0.016),lw(0.016),'#F2C230');}
function plotFence(cu,cv,w,d,z,col){
  var pts=[],n=5,a=-w/2,b=w/2,c=-d/2,e=d/2,ring=[[a,c],[b,c],[b,e],[a,e]];
  for(var s=0;s<4;s++){var p0=ring[s],p1=ring[(s+1)%4];for(var k=0;k<n;k++){var f=k/n;pts.push([p0[0]+(p1[0]-p0[0])*f,p0[1]+(p1[1]-p0[1])*f]);}}
  flatRect(cu+a,cv+c,cu+b,cv+e,z+0.3,mix(col,'#ffffff',0.78));
  var ph=TH*0.2;g.strokeStyle=shade(col,-0.15);g.lineWidth=lw(0.012);
  g.beginPath();pts.concat([pts[0]]).forEach(function(p,i){var q=iso(cu+p[0],cv+p[1],z+ph*0.72);if(i)g.lineTo(q.x,q.y);else g.moveTo(q.x,q.y);});g.stroke();
  pts.sort(function(p,q){return (p[0]+p[1])-(q[0]+q[1]);}).forEach(function(p){var q=iso(cu+p[0],cv+p[1],z);rrect(q.x-lw(0.012),q.y-ph,lw(0.024),ph,lw(0.008));g.fillStyle='#FFF8EC';g.fill();ell(q.x,q.y-ph,lw(0.016),lw(0.01),col);});
}
function signPost(cu,cv,z,col,label){var b=iso(cu,cv,z),h=TH*0.75;g.strokeStyle='#6B4226';g.lineWidth=lw(0.022);g.beginPath();g.moveTo(b.x,b.y);g.lineTo(b.x,b.y-h);g.stroke();
  var w=TW*0.28,bh=TH*0.32;rrect(b.x-w/2,b.y-h-bh*0.6,w,bh,bh*0.25);g.fillStyle=col;g.fill();g.strokeStyle=shade(col,-0.4);g.lineWidth=lw(0.01);g.stroke();
  g.fillStyle='#fff';g.font='900 '+(bh*0.52)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(label,b.x,b.y-h-bh*0.08);}
function roofEmblem(i,x,y,s){var e=embOf(i);if(e)emblem(e,x,y,s);}
function building(i,cu,cv,z,lvl,own){
  if(lvl===4)return landmark(i,cu,cv,z,own);
  if(isPol())return buildingPol(i,cu,cv,z,lvl,own);
  if(lvl===0){plotFence(cu,cv,0.8,0.74,z,own);signPost(cu-0.05,cv-0.05,z,own,'MILIK');return;}
  aoShadow(cu,cv,0.62,0.56,z);
  if(lvl===1){
    box(cu,cv,0.46,0.4,TH*0.44,z,'#FFF4E2','#FBE3C0');
    g.fillStyle='#7A4A2A';path(faceQuad(cu,cv,'L',0.46,0.4,0.38,0.62,z,z+TH*0.3));g.fill();
    g.fillStyle='rgba(70,130,190,.75)';path(faceQuad(cu,cv,'R',0.46,0.4,0.3,0.7,z+TH*0.18,z+TH*0.34));g.fill();
    box(cu+0.12,cv-0.08,0.07,0.07,TH*0.55,z+TH*0.44,'#B5523B');
    var A=pyramid(cu,cv,0.58,0.52,TH*0.42,z+TH*0.44,own);roofEmblem(i,A.x,A.y+TH*0.04,TH*0.46);}
  if(lvl===2){
    box(cu,cv,0.64,0.5,TH*0.4,z,'#FFF4E2','#FBE3C0');windows(cu,cv,0.64,0.5,z,TH*0.4,1,3,'rgba(70,130,190,.7)');
    box(cu-0.04,cv-0.03,0.5,0.4,TH*0.34,z+TH*0.4,'#FFFAF0','#F6E4C6');windows(cu-0.04,cv-0.03,0.5,0.4,z+TH*0.4,TH*0.34,1,2,'rgba(70,130,190,.7)');
    var rl=[iso(cu-0.32,cv+0.25,z+TH*0.5),iso(cu+0.32,cv+0.25,z+TH*0.5),iso(cu+0.32,cv-0.25,z+TH*0.5)];g.strokeStyle='#FFFFFF';g.lineWidth=lw(0.012);g.beginPath();g.moveTo(rl[0].x,rl[0].y);g.lineTo(rl[1].x,rl[1].y);g.lineTo(rl[2].x,rl[2].y);g.stroke();
    var A2=pyramid(cu-0.04,cv-0.03,0.62,0.52,TH*0.42,z+TH*0.74,own);
    [[-0.34,0.3],[0.36,0.3]].forEach(function(o){var q=iso(cu+o[0],cv+o[1],z);ell(q.x,q.y-TH*0.08,TW*0.07,TH*0.12,'#3FA05A');ell(q.x-TW*0.02,q.y-TH*0.13,TW*0.035,TH*0.05,'#6CCB7A');});
    roofEmblem(i,A2.x,A2.y+TH*0.04,TH*0.58);}
  if(lvl===3){
    box(cu,cv,0.62,0.6,TH*0.22,z,mix(own,'#ffffff',0.2),own);
    box(cu,cv,0.5,0.48,TH*1.35,z+TH*0.22,'#E3ECF5','#C3D3E6');windows(cu,cv,0.5,0.48,z+TH*0.22,TH*1.35,5,3,'rgba(40,95,160,.7)');
    box(cu,cv,0.54,0.52,TH*0.09,z+TH*1.57,own);var top=iso(cu,cv,z+TH*1.66);roofEmblem(i,top.x,top.y,TH*0.7);}
}
function landmark(i,cu,cv,z,own){
  var ic=T[i].icon;
  if(ic==='monas'){aoShadow(cu,cv,0.72,0.72,z);box(cu,cv,0.74,0.74,TH*0.14,z,'#ECE7DD','#D9D2C4');box(cu,cv,0.52,0.52,TH*0.16,z+TH*0.14,'#F4F0E8','#DED7CA');
    var zz=z+TH*0.3; box(cu,cv,0.13,0.13,TH*2.1,zz,'#FBFAF6','#E6E1D6'); zz+=TH*2.1; box(cu,cv,0.3,0.3,TH*0.08,zz,'#F4F0E8','#D9D2C4'); zz+=TH*0.08;
    var tp=iso(cu,cv,zz),fh=TW*0.26,fg=g.createRadialGradient(tp.x-fh*0.1,tp.y-fh*0.5,1,tp.x,tp.y-fh*0.4,fh*0.7);fg.addColorStop(0,'#FFF4B0');fg.addColorStop(0.5,'#F2C230');fg.addColorStop(1,'#C98F00');
    g.beginPath();g.moveTo(tp.x-fh*0.2,tp.y);g.quadraticCurveTo(tp.x-fh*0.32,tp.y-fh*0.5,tp.x+fh*0.02,tp.y-fh);g.quadraticCurveTo(tp.x+fh*0.05,tp.y-fh*0.6,tp.x+fh*0.18,tp.y-fh*0.55);g.quadraticCurveTo(tp.x+fh*0.32,tp.y-fh*0.25,tp.x+fh*0.2,tp.y);g.closePath();g.fillStyle=fg;g.fill();g.strokeStyle='#9A6A00';g.lineWidth=lw(0.012);g.stroke();
    var fb=iso(cu+0.3,cv+0.3,z);tinyFlag(fb.x,fb.y,TH*0.8,own);return;}
  if(ic==='sate'){aoShadow(cu,cv,0.84,0.44,z);box(cu,cv,0.84,0.4,TH*0.42,z,'#FBF6EE','#EFE6D6');windows(cu,cv,0.84,0.4,z,TH*0.42,1,5,'rgba(90,60,40,.45)');pyramid(cu,cv,0.88,0.44,TH*0.24,z+TH*0.42,'#B5523B');
    var zt=z+TH*0.5;box(cu,cv,0.2,0.2,TH*0.3,zt,'#FBF6EE','#EFE6D6');zt+=TH*0.3;
    [[0.34,0.12],[0.26,0.12],[0.18,0.12]].forEach(function(r){pyramid(cu,cv,r[0],r[0],TH*r[1]*1.4,zt,'#6B3E2E');zt+=TH*r[1];});
    var sp=iso(cu,cv,zt+TH*0.05);g.strokeStyle='#3A2A20';g.lineWidth=lw(0.016);g.beginPath();g.moveTo(sp.x,sp.y);g.lineTo(sp.x,sp.y-TH*0.6);g.stroke();
    for(var k=0;k<6;k++)ell(sp.x,sp.y-TH*(0.07+k*0.085),lw(0.032),lw(0.028),k%2?'#E0A100':'#F2C230');
    var fb2=iso(cu+0.36,cv+0.3,z);tinyFlag(fb2.x,fb2.y,TH*0.8,own);return;}
  var reg=REGIONS[T[i].region].color,e=embOf(i),wide=EMBW[e]||1;
  aoShadow(cu,cv,0.78,0.72,z);box(cu,cv,0.8,0.74,TH*0.16,z,'#EDE6D8','#D3C8B4');box(cu,cv,0.64,0.58,TH*0.16,z+TH*0.16,mix(reg,'#ffffff',0.35),reg);
  var top=iso(cu,cv,z+TH*0.32),s=Math.min(TH*1.4,TW*0.6/wide);
  emblem(e,top.x,top.y,s);
  var tw=(performance.now()/700)%1;g.save();g.globalAlpha=Math.sin(tw*Math.PI);g.fillStyle='#FFF6C0';var sx=top.x+s*0.35*wide,sy=top.y-s*0.85;g.beginPath();g.moveTo(sx,sy-s*0.1);g.lineTo(sx+s*0.03,sy-s*0.03);g.lineTo(sx+s*0.1,sy);g.lineTo(sx+s*0.03,sy+s*0.03);g.lineTo(sx,sy+s*0.1);g.lineTo(sx-s*0.03,sy+s*0.03);g.lineTo(sx-s*0.1,sy);g.lineTo(sx-s*0.03,sy-s*0.03);g.closePath();g.fill();g.restore();
  var fb3=iso(cu+0.36,cv+0.32,z);tinyFlag(fb3.x,fb3.y,TH*0.8,own);
}
function wisataGate(cu,cv,z,col,axis){var a=axis==='v'?iso(cu+0.36,cv+0.34,z):iso(cu-0.34,cv+0.36,z),b=axis==='v'?iso(cu+0.36,cv-0.34,z):iso(cu+0.34,cv+0.36,z),h=TH*0.85;if(a.x>b.x){var tmp=a;a=b;b=tmp;}
  [a,b].forEach(function(p){rrect(p.x-lw(0.02),p.y-h,lw(0.04),h,lw(0.01));g.fillStyle='#FFF8EC';g.fill();g.strokeStyle='rgba(60,38,24,.5)';g.lineWidth=lw(0.008);g.stroke();});
  g.beginPath();g.moveTo(a.x-lw(0.03),a.y-h);g.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2-h-TH*0.28,b.x+lw(0.03),b.y-h);g.lineTo(b.x+lw(0.03),b.y-h+TH*0.16);g.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2-h-TH*0.1,a.x-lw(0.03),a.y-h+TH*0.16);g.closePath();g.fillStyle=col;g.fill();g.strokeStyle=shade(col,-0.4);g.stroke();
  var m={x:(a.x+b.x)/2,y:(a.y+b.y)/2-h-TH*0.12};g.fillStyle='#fff';g.font='900 '+(TH*0.17)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(isPol()?'KONSESI':'TIKET',m.x,m.y);
  if(axis==='v')box(cu+0.18,cv-0.3,0.14,0.16,TH*0.34,z,'#FFF8EC',col);else box(cu+0.3,cv+0.18,0.16,0.14,TH*0.34,z,'#FFF8EC',col);}

