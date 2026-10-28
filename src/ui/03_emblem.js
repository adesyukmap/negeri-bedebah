/* ---------- city emblems (2D, base at x,y, height s) ---------- */
function OL(s){g.strokeStyle='rgba(45,28,18,.7)';g.lineWidth=Math.max(1,s*0.045);g.lineJoin='round';g.lineCap='round';}
function vgrad(y0,y1,c1,c2){var gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,c1);gr.addColorStop(1,c2);return gr;}
function rect2(x,y,w,h,fill){g.beginPath();g.rect(x,y,w,h);g.fillStyle=fill;g.fill();g.stroke();}
var EMBN={Jayapura:'youtefa',Ambon:'gong',Kupang:'sasando',Mataram:'kubah','Labuan Bajo':'komodo',Manado:'ikan',Palu:'jkuning',Makassar:'pinisi',Pontianak:'khatulistiwa',Banjarmasin:'jukung',Balikpapan:'beruang',Padang:'gonjong',Palembang:'ampera',Medan:'maimun',Yogyakarta:'tugu',Bandung:'sate',Surabaya:'suroboyo',Bali:'bentar',Jakarta:'monas'};
var EMB={get:0};function embOf(i){return T[i]?EMBN[T[i].name]:undefined;}
var EMBW={youtefa:1.6,jkuning:1.5,ampera:1.3,pinisi:1.2,jukung:1.2,komodo:1.4,bentar:1.1,gonjong:1.3,maimun:1.2,suroboyo:1.2,gong:1,kubah:1,ikan:1,khatulistiwa:0.9,beruang:0.9,sasando:0.8,tugu:0.6,sate:0.5,monas:0.6};
function emblem(name,x,y,s){
  g.save(); OL(s);
  switch(name){
  case 'youtefa': rect2(x-s*0.8,y-s*0.22,s*1.6,s*0.1,'#8C8C96');
    g.lineWidth=s*0.09;g.strokeStyle='#D8392E';[-0.4,0.4].forEach(function(o){g.beginPath();g.arc(x+o*s,y-s*0.2,s*0.38,Math.PI,0);g.stroke();});
    g.lineWidth=Math.max(1,s*0.02);g.strokeStyle='#F7D0C8';for(var k=-6;k<=6;k++){var xx=x+k*s*0.11,o2=xx<x?-0.4:0.4,dx=xx-(x+o2*s),hh=Math.sqrt(Math.max(0,Math.pow(s*0.38,2)-dx*dx));g.beginPath();g.moveTo(xx,y-s*0.2);g.lineTo(xx,y-s*0.2-hh);g.stroke();}
    OL(s);g.strokeStyle='rgba(120,20,15,.6)';g.lineWidth=Math.max(1,s*0.03);[-0.4,0.4].forEach(function(o){g.beginPath();g.arc(x+o*s,y-s*0.2,s*0.42,Math.PI,0);g.stroke();});break;
  case 'gong': g.fillStyle='#6B4226';rect2(x-s*0.38,y-s*0.95,s*0.1,s*0.95,'#6B4226');rect2(x+s*0.28,y-s*0.95,s*0.1,s*0.95,'#6B4226');rect2(x-s*0.45,y-s*1.0,s*0.9,s*0.1,'#8A5A33');
    g.beginPath();g.moveTo(x,y-s*0.9);g.lineTo(x,y-s*0.78);g.stroke();
    var gg=g.createRadialGradient(x-s*0.08,y-s*0.55,s*0.02,x,y-s*0.48,s*0.28);gg.addColorStop(0,'#FFF1A8');gg.addColorStop(0.6,'#E3A500');gg.addColorStop(1,'#9A6A00');g.beginPath();g.arc(x,y-s*0.48,s*0.27,0,7);g.fillStyle=gg;g.fill();g.stroke();
    g.beginPath();g.arc(x,y-s*0.48,s*0.09,0,7);g.fillStyle='#F2C230';g.fill();g.stroke();break;
  case 'sasando': g.beginPath();g.moveTo(x-s*0.34,y-s*0.95);g.quadraticCurveTo(x-s*0.42,y-s*0.15,x,y-s*0.12);g.quadraticCurveTo(x+s*0.42,y-s*0.15,x+s*0.34,y-s*0.95);g.quadraticCurveTo(x,y-s*0.7,x-s*0.34,y-s*0.95);g.fillStyle=vgrad(y-s,y,'#F3D98A','#C99A3A');g.fill();g.stroke();
    g.lineWidth=Math.max(1,s*0.015);for(var k2=-3;k2<=3;k2++){g.beginPath();g.moveTo(x,y-s*0.15);g.lineTo(x+k2*s*0.1,y-s*0.85+Math.abs(k2)*s*0.03);g.stroke();}
    OL(s);rect2(x-s*0.07,y-s*0.85,s*0.14,s*0.85,'#8A5A33');g.strokeStyle='#F7E7C0';g.lineWidth=Math.max(1,s*0.012);for(var k3=-1;k3<=1;k3++){g.beginPath();g.moveTo(x+k3*s*0.035,y-s*0.82);g.lineTo(x+k3*s*0.035,y-s*0.05);g.stroke();}break;
  case 'kubah': rect2(x-s*0.45,y-s*0.9,s*0.08,s*0.9,'#F6F1E6');rect2(x+s*0.37,y-s*0.9,s*0.08,s*0.9,'#F6F1E6');
    g.beginPath();g.moveTo(x-s*0.47,y-s*0.9);g.lineTo(x-s*0.41,y-s*1.05);g.lineTo(x-s*0.35,y-s*0.9);g.fillStyle='#2FA36B';g.fill();g.stroke();g.beginPath();g.moveTo(x+s*0.35,y-s*0.9);g.lineTo(x+s*0.41,y-s*1.05);g.lineTo(x+s*0.47,y-s*0.9);g.fill();g.stroke();
    rect2(x-s*0.28,y-s*0.38,s*0.56,s*0.38,'#F6F1E6');g.beginPath();g.ellipse(x,y-s*0.38,s*0.28,s*0.34,0,Math.PI,0);g.closePath();g.fillStyle=vgrad(y-s*0.75,y-s*0.38,'#6FD39B','#1E8A55');g.fill();g.stroke();
    g.beginPath();g.moveTo(x,y-s*0.72);g.lineTo(x,y-s*0.9);g.stroke();g.beginPath();g.arc(x,y-s*0.92,s*0.04,0,7);g.fillStyle='#F2C230';g.fill();break;
  case 'komodo': g.beginPath();g.moveTo(x-s*0.2,y-s*0.24);g.quadraticCurveTo(x-s*0.6,y-s*0.2,x-s*0.68,y-s*0.04);g.quadraticCurveTo(x-s*0.5,y-s*0.12,x-s*0.18,y-s*0.1);g.fillStyle='#6F6E35';g.fill();g.stroke();
    [-0.18,0.18].forEach(function(o){rect2(x+o*s-s*0.04,y-s*0.14,s*0.08,s*0.14,'#5E5D2C');});
    g.beginPath();g.ellipse(x,y-s*0.22,s*0.3,s*0.12,0,0,7);g.fillStyle=vgrad(y-s*0.34,y-s*0.1,'#9A9850','#5E5D2C');g.fill();g.stroke();
    g.beginPath();g.ellipse(x+s*0.36,y-s*0.27,s*0.13,s*0.08,-0.2,0,7);g.fillStyle='#8A8844';g.fill();g.stroke();
    g.strokeStyle='#E2483D';g.lineWidth=Math.max(1,s*0.02);g.beginPath();g.moveTo(x+s*0.48,y-s*0.27);g.lineTo(x+s*0.6,y-s*0.26);g.lineTo(x+s*0.64,y-s*0.3);g.moveTo(x+s*0.6,y-s*0.26);g.lineTo(x+s*0.64,y-s*0.23);g.stroke();
    ell(x+s*0.38,y-s*0.3,s*0.02,s*0.02,'#1A1A10');break;
  case 'ikan': g.lineWidth=s*0.07;g.strokeStyle='#FF7BA8';[[-0.25,-0.55],[-0.05,-0.75],[0.2,-0.6],[0.32,-0.4]].forEach(function(b){g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+b[0]*s*0.5,y+b[1]*s*0.5,x+b[0]*s,y+b[1]*s);g.stroke();});
    OL(s);var fx=x,fy=y-s*0.78;g.beginPath();g.moveTo(fx-s*0.22,fy);g.lineTo(fx-s*0.36,fy-s*0.1);g.lineTo(fx-s*0.36,fy+s*0.1);g.closePath();g.fillStyle='#FF8A1F';g.fill();g.stroke();
    g.beginPath();g.ellipse(fx,fy,s*0.25,s*0.14,0,0,7);g.fillStyle='#FF8A1F';g.fill();g.save();g.clip();g.fillStyle='#fff';g.fillRect(fx-s*0.1,fy-s*0.2,s*0.06,s*0.4);g.fillRect(fx+s*0.08,fy-s*0.2,s*0.06,s*0.4);g.restore();g.stroke();ell(fx+s*0.16,fy-s*0.03,s*0.025,s*0.025,'#111');break;
  case 'jkuning': rect2(x-s*0.75,y-s*0.2,s*1.5,s*0.09,'#8C8C96');g.lineWidth=s*0.1;g.strokeStyle='#F2C230';g.beginPath();g.ellipse(x,y-s*0.18,s*0.62,s*0.72,0,Math.PI,0);g.stroke();
    g.lineWidth=Math.max(1,s*0.02);g.strokeStyle='#FFF3C4';for(var k4=-5;k4<=5;k4++){var xx2=x+k4*s*0.11,hy=s*0.72*Math.sqrt(Math.max(0,1-Math.pow((xx2-x)/(s*0.62),2)));g.beginPath();g.moveTo(xx2,y-s*0.18);g.lineTo(xx2,y-s*0.18-hy);g.stroke();}
    OL(s);g.lineWidth=Math.max(1,s*0.03);g.beginPath();g.ellipse(x,y-s*0.18,s*0.67,s*0.77,0,Math.PI,0);g.stroke();break;
  case 'pinisi': g.beginPath();g.moveTo(x-s*0.6,y-s*0.24);g.quadraticCurveTo(x,y+s*0.06,x+s*0.6,y-s*0.3);g.lineTo(x+s*0.45,y-s*0.16);g.lineTo(x-s*0.45,y-s*0.1);g.closePath();g.fillStyle=vgrad(y-s*0.3,y,'#A0623A','#5E3720');g.fill();g.stroke();
    [-0.18,0.18].forEach(function(o){g.beginPath();g.moveTo(x+o*s,y-s*0.15);g.lineTo(x+o*s,y-s*1.0);g.stroke();});
    [[-0.18,-0.95,-0.5],[0.18,-0.95,-0.15],[0.18,-0.95,0.55]].forEach(function(t){g.beginPath();g.moveTo(x+t[0]*s,y+t[1]*s);g.lineTo(x+t[0]*s,y-s*0.3);g.lineTo(x+t[2]*s,y-s*0.3);g.closePath();g.fillStyle='#FBF6EA';g.fill();g.stroke();});break;
  case 'khatulistiwa': rect2(x-s*0.3,y-s*0.12,s*0.6,s*0.12,'#E8E0D0');rect2(x-s*0.05,y-s*0.62,s*0.1,s*0.5,'#F4EFE4');
    g.lineWidth=s*0.05;g.strokeStyle='#B8862E';g.beginPath();g.arc(x,y-s*0.8,s*0.2,0,7);g.stroke();g.beginPath();g.ellipse(x,y-s*0.8,s*0.08,s*0.2,0,0,7);g.stroke();
    g.beginPath();g.moveTo(x-s*0.34,y-s*0.8);g.lineTo(x+s*0.34,y-s*0.8);g.stroke();g.fillStyle='#B8862E';g.beginPath();g.moveTo(x+s*0.42,y-s*0.8);g.lineTo(x+s*0.3,y-s*0.86);g.lineTo(x+s*0.3,y-s*0.74);g.fill();break;
  case 'jukung': g.beginPath();g.moveTo(x-s*0.6,y-s*0.22);g.quadraticCurveTo(x,y+s*0.02,x+s*0.6,y-s*0.22);g.lineTo(x+s*0.5,y-s*0.12);g.quadraticCurveTo(x,y,x-s*0.5,y-s*0.12);g.closePath();g.fillStyle='#7A4A2A';g.fill();g.stroke();
    [['#FF8A1F',-0.32],['#7BD389',-0.18],['#FFD23F',0.3],['#E2483D',0.42]].forEach(function(f){ell(x+f[1]*s,y-s*0.24,s*0.07,s*0.07,f[0]);});
    ell(x,y-s*0.38,s*0.1,s*0.16,'#1F9D55');g.beginPath();g.moveTo(x-s*0.24,y-s*0.5);g.lineTo(x,y-s*0.72);g.lineTo(x+s*0.24,y-s*0.5);g.closePath();g.fillStyle='#E8C46A';g.fill();g.stroke();break;
  case 'beruang': g.beginPath();g.ellipse(x,y-s*0.22,s*0.32,s*0.24,0,0,7);g.fillStyle='#3A2618';g.fill();g.stroke();g.beginPath();g.moveTo(x-s*0.16,y-s*0.36);g.quadraticCurveTo(x,y-s*0.2,x+s*0.16,y-s*0.36);g.lineWidth=s*0.06;g.strokeStyle='#F2C230';g.stroke();OL(s);
    [-1,1].forEach(function(d){g.beginPath();g.arc(x+d*s*0.2,y-s*0.86,s*0.08,0,7);g.fillStyle='#3A2618';g.fill();g.stroke();});
    g.beginPath();g.arc(x,y-s*0.66,s*0.25,0,7);g.fillStyle=vgrad(y-s*0.9,y-s*0.4,'#5A3A26','#2E1D12');g.fill();g.stroke();
    ell(x,y-s*0.57,s*0.12,s*0.08,'#D9A86C');ell(x,y-s*0.6,s*0.04,s*0.03,'#111');ell(x-s*0.09,y-s*0.72,s*0.025,s*0.03,'#111');ell(x+s*0.09,y-s*0.72,s*0.025,s*0.03,'#111');break;
  case 'gonjong': rect2(x-s*0.5,y-s*0.42,s*1.0,s*0.42,'#B5523B');g.fillStyle='#F2C230';g.fillRect(x-s*0.5,y-s*0.3,s*1.0,s*0.05);g.fillRect(x-s*0.5,y-s*0.16,s*1.0,s*0.04);
    g.beginPath();g.moveTo(x-s*0.66,y-s*1.0);g.quadraticCurveTo(x-s*0.5,y-s*0.5,x-s*0.25,y-s*0.6);g.quadraticCurveTo(x-s*0.1,y-s*0.66,x,y-s*0.92);g.quadraticCurveTo(x+s*0.1,y-s*0.66,x+s*0.25,y-s*0.6);g.quadraticCurveTo(x+s*0.5,y-s*0.5,x+s*0.66,y-s*1.0);
    g.quadraticCurveTo(x+s*0.6,y-s*0.42,x+s*0.56,y-s*0.4);g.lineTo(x-s*0.56,y-s*0.4);g.quadraticCurveTo(x-s*0.6,y-s*0.42,x-s*0.66,y-s*1.0);g.closePath();g.fillStyle=vgrad(y-s,y-s*0.4,'#4A3528','#2A1C12');g.fill();g.stroke();break;
  case 'ampera': [-0.32,0.32].forEach(function(o){rect2(x+o*s-s*0.09,y-s*1.0,s*0.18,s*1.0,'#D8392E');g.fillStyle='#8E1E16';g.fillRect(x+o*s-s*0.04,y-s*0.85,s*0.08,s*0.2);});
    rect2(x-s*0.41,y-s*1.02,s*0.82,s*0.1,'#C42F25');rect2(x-s*0.65,y-s*0.3,s*1.3,s*0.1,'#8C8C96');
    g.lineWidth=Math.max(1,s*0.02);g.strokeStyle='#F7D0C8';[[-0.32,-0.62],[-0.32,-0.05],[0.32,0.05],[0.32,0.62]].forEach(function(c){g.beginPath();g.moveTo(x+c[0]*s,y-s*0.9);g.lineTo(x+c[1]*s,y-s*0.3);g.stroke();});break;
  case 'maimun': rect2(x-s*0.55,y-s*0.42,s*1.1,s*0.42,'#F2C230');g.fillStyle='#7A4A2A';[-0.36,-0.12,0.12,0.36].forEach(function(o){g.beginPath();g.ellipse(x+o*s,y-s*0.15,s*0.06,s*0.14,0,Math.PI,0);g.fill();g.fillRect(x+o*s-s*0.06,y-s*0.15,s*0.12,s*0.15);});
    [[-0.38,0.13],[0,0.22],[0.38,0.13]].forEach(function(d){var dy=y-s*0.42;g.beginPath();g.moveTo(x+d[0]*s-d[1]*s,dy);g.quadraticCurveTo(x+d[0]*s-d[1]*s*1.3,dy-d[1]*s*1.4,x+d[0]*s,dy-d[1]*s*2.4);g.quadraticCurveTo(x+d[0]*s+d[1]*s*1.3,dy-d[1]*s*1.4,x+d[0]*s+d[1]*s,dy);g.closePath();g.fillStyle=vgrad(dy-d[1]*s*2.4,dy,'#3F8A63','#1E5A3D');g.fill();g.stroke();ell(x+d[0]*s,dy-d[1]*s*2.5,s*0.03,s*0.03,'#F2C230');});break;
  case 'tugu': rect2(x-s*0.24,y-s*0.1,s*0.48,s*0.1,'#E8E0D0');g.beginPath();g.moveTo(x-s*0.14,y-s*0.1);g.lineTo(x-s*0.09,y-s*0.72);g.lineTo(x+s*0.09,y-s*0.72);g.lineTo(x+s*0.14,y-s*0.1);g.closePath();g.fillStyle=vgrad(y-s*0.72,y,'#FFFFFF','#DCD5C6');g.fill();g.stroke();
    g.beginPath();g.moveTo(x-s*0.1,y-s*0.72);g.lineTo(x,y-s*1.05);g.lineTo(x+s*0.1,y-s*0.72);g.closePath();g.fillStyle='#E3A500';g.fill();g.stroke();
    g.strokeStyle='#9A6A00';g.lineWidth=Math.max(1,s*0.015);for(var q=0;q<3;q++){g.beginPath();g.moveTo(x-s*0.08+q*s*0.02,y-s*(0.76+q*0.08));g.lineTo(x+s*0.08-q*s*0.02,y-s*(0.8+q*0.08));g.stroke();}break;
  case 'sate': g.lineWidth=s*0.05;g.strokeStyle='#6B4226';g.beginPath();g.moveTo(x,y);g.lineTo(x,y-s*1.02);g.stroke();OL(s);
    for(var b2=0;b2<5;b2++){var by=y-s*(0.22+b2*0.16);var bg2=g.createRadialGradient(x-s*0.04,by-s*0.04,1,x,by,s*0.1);bg2.addColorStop(0,'#C9744A');bg2.addColorStop(1,'#6E3418');g.beginPath();g.arc(x,by,s*0.09,0,7);g.fillStyle=bg2;g.fill();g.stroke();}break;
  case 'suroboyo': rect2(x-s*0.45,y-s*0.12,s*0.9,s*0.12,'#E8E0D0');
    g.beginPath();g.moveTo(x-s*0.05,y-s*0.12);g.quadraticCurveTo(x-s*0.55,y-s*0.3,x-s*0.3,y-s*0.95);g.lineTo(x-s*0.12,y-s*0.85);g.quadraticCurveTo(x-s*0.34,y-s*0.4,x+s*0.02,y-s*0.2);g.closePath();g.fillStyle=vgrad(y-s,y,'#6FA8F0','#2C5FB8');g.fill();g.stroke();
    g.beginPath();g.moveTo(x-s*0.38,y-s*0.62);g.lineTo(x-s*0.5,y-s*0.66);g.lineTo(x-s*0.38,y-s*0.52);g.fillStyle='#2C5FB8';g.fill();g.stroke();
    g.beginPath();g.moveTo(x+s*0.05,y-s*0.12);g.quadraticCurveTo(x+s*0.55,y-s*0.3,x+s*0.32,y-s*0.92);g.lineTo(x+s*0.14,y-s*0.84);g.quadraticCurveTo(x+s*0.36,y-s*0.42,x-s*0.02,y-s*0.22);g.closePath();g.fillStyle=vgrad(y-s,y,'#7BC96A','#2E7D3A');g.fill();g.stroke();
    g.fillStyle='#fff';for(var t2=0;t2<4;t2++){g.beginPath();g.moveTo(x+s*(0.16+t2*0.02),y-s*(0.84-t2*0.12));g.lineTo(x+s*(0.22+t2*0.02),y-s*(0.82-t2*0.12));g.lineTo(x+s*(0.18+t2*0.02),y-s*(0.78-t2*0.12));g.fill();}
    ell(x-s*0.22,y-s*0.86,s*0.025,s*0.025,'#111');ell(x+s*0.26,y-s*0.84,s*0.025,s*0.025,'#111');break;
  case 'bentar': [-1,1].forEach(function(d){for(var t3=0;t3<4;t3++){var w0=s*(0.42-t3*0.08),yb=y-s*t3*0.24,cx=x+d*(s*0.08+w0/2),col=t3%2?'#B5523B':'#6A6A70';g.beginPath();g.moveTo(cx-w0/2,yb);g.lineTo(cx+w0/2,yb);g.lineTo(cx+w0/2-s*0.03,yb-s*0.24);g.lineTo(cx-w0/2+s*0.03,yb-s*0.24);g.closePath();g.fillStyle=col;g.fill();g.stroke();}
      var tx=x+d*(s*0.08+s*0.09);g.beginPath();g.moveTo(tx-s*0.06,y-s*0.96);g.lineTo(tx,y-s*1.1);g.lineTo(tx+s*0.06,y-s*0.96);g.closePath();g.fillStyle='#6A6A70';g.fill();g.stroke();});break;
  case 'monas': rect2(x-s*0.2,y-s*0.1,s*0.4,s*0.1,'#E8E0D0');rect2(x-s*0.06,y-s*0.72,s*0.12,s*0.62,'#FBFAF6');rect2(x-s*0.13,y-s*0.78,s*0.26,s*0.06,'#E8E0D0');
    var fg=g.createRadialGradient(x,y-s*0.9,1,x,y-s*0.88,s*0.16);fg.addColorStop(0,'#FFF4B0');fg.addColorStop(1,'#E3A500');g.beginPath();g.moveTo(x-s*0.09,y-s*0.78);g.quadraticCurveTo(x-s*0.14,y-s*0.95,x+s*0.01,y-s*1.08);g.quadraticCurveTo(x+s*0.02,y-s*0.96,x+s*0.08,y-s*0.94);g.quadraticCurveTo(x+s*0.14,y-s*0.86,x+s*0.09,y-s*0.78);g.closePath();g.fillStyle=fg;g.fill();g.stroke();break;
  }
  g.restore();
}

