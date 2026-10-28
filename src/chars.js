/* ---------- characters (cosmetic chibis, all fictional archetypes) ---------- */
var CH={juragan:{shirt:'#8B5A2B',pants:'#3A2A20'},mbak:{shirt:'#E86A92',pants:'#5A2A40'},hoki:{shirt:'#F4C430',pants:'#2F4A7A'},kapal:{shirt:'#23395B',pants:'#1A2840'},
  nenek:{shirt:'#7E57C2',pants:'#4A2E7A'},kos:{shirt:'#F3F1EC',pants:'#2E7D5B'},dewi:{shirt:'#1FA39A',pants:'#C0392B'},ojol:{shirt:'#1E9E57',pants:'#2A2A30'},
  jenderal:{shirt:'#5E6B3A',pants:'#46512A'},ketum:{shirt:'#C2185B',pants:'#6A1040'},gubernur:{shirt:'#F4F1EA',pants:'#2A2A30'},tambang:{shirt:'#3E4048',pants:'#26282E'},
  kyai:{shirt:'#F4F1E8',pants:'#2E7D5B'},sawit:{shirt:'#F4F1E8',pants:'#5A3A22'},buzzer:{shirt:'#333A48',pants:'#22262E'},influencer:{shirt:'#FF6FA5',pants:'#3A3A48'},
  host:{shirt:'#13897A',pants:'#2A2A30'},polisi:{shirt:'#8A6A44',pants:'#4A3826'},preman:{shirt:'#1C1C20',pants:'#3A4A6A'},tukang:{shirt:'#F28C28',pants:'#3A3A44'}};
var SKIN='#F2C49B';
function chHash(id){var h=0;for(var i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))%997;return h/997;}
function bodyPath(x,bt,bw,by){var tw=bw*0.78,rr=bw*0.22;g.beginPath();g.moveTo(x-tw/2+rr,bt);g.lineTo(x+tw/2-rr,bt);g.quadraticCurveTo(x+tw/2,bt,x+tw/2+(bw-tw)/4,bt+rr);g.lineTo(x+bw/2,by-rr*0.6);g.quadraticCurveTo(x+bw/2,by,x+bw/2-rr,by);g.lineTo(x-bw/2+rr,by);g.quadraticCurveTo(x-bw/2,by,x-bw/2,by-rr*0.6);g.lineTo(x-tw/2-(bw-tw)/4,bt+rr);g.quadraticCurveTo(x-tw/2,bt,x-tw/2+rr,bt);g.closePath();}
function hairCap(hx,hy,r,col,depth){g.beginPath();g.arc(hx,hy-r*0.05,r*1.03,Math.PI*1.02,Math.PI*1.98);g.quadraticCurveTo(hx+r*0.4,hy-r*(depth||0.45),hx,hy-r*0.55);g.quadraticCurveTo(hx-r*0.5,hy-r*0.4,hx-r*1.0,hy-r*0.12);g.closePath();g.fillStyle=col;g.fill();}
function rgrad(x,y,r,a,b){var q=g.createRadialGradient(x,y,r*0.1,x,y,r);q.addColorStop(0,a);q.addColorStop(1,b);return q;}
function glasses(hx,ey,r,s,col,dark){[-1,1].forEach(function(sx){g.beginPath();g.arc(hx+sx*r*0.38,ey,r*0.2,0,7);if(dark){g.fillStyle='rgba(20,20,30,.88)';g.fill();}g.strokeStyle=col;g.lineWidth=s*0.018;g.stroke();});g.beginPath();g.moveTo(hx-r*0.18,ey);g.lineTo(hx+r*0.18,ey);g.stroke();}
function drawChar(id,x,y,s,ring,opt){
  opt=opt||{}; var o=Math.max(1,s*0.028),C=CH[id]||CH.juragan,sh=C.shirt,t=Date.now()/1000,seed=chHash(id);
  var breathe=1+Math.sin(t*2.2+seed*6)*0.018,blink=((t+seed*4)%3.6)<0.13&&!opt.expr;
  g.save(); g.lineJoin='round'; g.lineCap='round';
  ell(x,y,s*0.36,s*0.11,'rgba(20,40,60,.3)');
  if(ring){ell(x,y-s*0.005,s*0.32,s*0.1,shade(ring,-0.35));ell(x,y-s*0.03,s*0.32,s*0.1,ring);ell(x-s*0.08,y-s*0.05,s*0.14,s*0.035,'rgba(255,255,255,.35)');}
  g.translate(x,y);g.scale(1,breathe);g.translate(-x,-y);
  var bw=s*0.5,by=y-s*0.1,bt=y-s*0.5,hx=x,hy=y-s*0.7,r=s*0.25;
  [-1,1].forEach(function(d){rrect(x+d*s*0.1-s*0.06,by-s*0.04,s*0.12,s*0.1,s*0.04);g.fillStyle=C.pants;g.fill();ell(x+d*s*0.11,y-s*0.04,s*0.08,s*0.04,'#2A1E18');});
  // back hair / veils
  if(id==='mbak'||id==='dewi'||id==='influencer'){g.beginPath();g.ellipse(hx,hy+(id==='dewi'?r*0.4:r*0.1),r*1.12,id==='dewi'?r*1.35:r*1.1,0,0,Math.PI*2);g.fillStyle=id==='influencer'?'#6A3A20':'#2B1E1A';g.fill();}
  if(id==='mbak')ell(hx,hy-r*1.02,r*0.42,r*0.36,'#2B1E1A');
  if(id==='host'){g.beginPath();g.ellipse(hx,hy+r*0.55,r*1.15,r*1.45,0,0,7);g.fillStyle='#3A2418';g.fill();g.beginPath();g.ellipse(hx+r*1.05,hy+r*0.5,r*0.28,r*0.9,-0.2,0,7);g.fill();}
  if(id==='nenek')ell(hx,hy-r*0.98,r*0.4,r*0.34,'#B9B9C9');
  if(id==='ketum'){g.beginPath();g.ellipse(hx,hy+r*0.3,r*1.22,r*1.32,0,0,7);g.fillStyle=rgrad(hx-r*0.3,hy-r*0.4,r*1.4,'#FF9CC0','#B0124E');g.fill();}
  // arms
  var sway=Math.sin(t*2+seed*5)*0.12;
  [-1,1].forEach(function(d){g.save();g.translate(x+d*bw*0.46,bt+s*0.06);g.rotate(d*(0.35+sway*d));rrect(-s*0.055,0,s*0.11,s*0.26,s*0.05);g.fillStyle=opt.vest?'#E8590C':id==='preman'?'#D9A274':shade(sh,-0.08);g.fill();g.strokeStyle=shade(opt.vest?'#E8590C':sh,-0.5);g.lineWidth=o*0.8;g.stroke();ell(0,s*0.27,s*0.055,s*0.055,SKIN);g.restore();});
  // body
  bodyPath(x,bt,bw,by); var gr=g.createLinearGradient(x-bw/2,0,x+bw/2,0); gr.addColorStop(0,shade(sh,0.22)); gr.addColorStop(0.6,sh); gr.addColorStop(1,shade(sh,-0.28)); g.fillStyle=gr; g.fill();
  g.save(); bodyPath(x,bt,bw,by); g.clip();
  var mid=function(){g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x-s*0.008,bt,s*0.016,by-bt);};
  if(id==='juragan'){g.fillStyle='#E7C27A';for(var yy=bt+s*0.05;yy<by;yy+=s*0.08)for(var xx=x-bw/2;xx<x+bw/2;xx+=s*0.08){g.beginPath();g.arc(xx,yy,s*0.014,0,7);g.fill();}}
  if(id==='mbak'||id==='nenek'||id==='ketum'){g.strokeStyle=id==='mbak'?'#FFE3EC':id==='ketum'?'#FFD2E2':'#E6D7FF';g.lineWidth=s*0.03;g.beginPath();g.moveTo(x-bw*0.22,bt);g.lineTo(x,bt+s*0.16);g.lineTo(x+bw*0.22,bt);g.stroke();}
  if(id==='hoki'){ell(x,bt+s*0.2,s*0.085,s*0.075,'#fff');ell(x-s*0.03,bt+s*0.2,s*0.01,s*0.012,INK);ell(x+s*0.03,bt+s*0.2,s*0.01,s*0.012,INK);}
  if(id==='kapal'){ell(x,bt+s*0.14,s*0.018,s*0.018,'#F2C230');ell(x,bt+s*0.27,s*0.018,s*0.018,'#F2C230');}
  if(id==='kos'||id==='kyai'){g.fillStyle=C.pants;g.fillRect(x-bw,by-s*0.12,bw*2,s*0.12);g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=s*0.012;for(var k=-6;k<7;k++){g.beginPath();g.moveTo(x+k*s*0.05,by-s*0.12);g.lineTo(x+k*s*0.05,by);g.stroke();}}
  if(id==='kyai'){for(var b2=0;b2<4;b2++)ell(x,bt+s*(0.08+b2*0.07),s*0.012,s*0.012,'#C9B990');}
  if(id==='dewi'){['#FF5C7A','#FFC93C','#4CC0F0'].forEach(function(c,i){g.strokeStyle=c;g.lineWidth=s*0.05;g.beginPath();g.moveTo(x-bw*0.6,bt+s*0.02+i*s*0.05);g.lineTo(x+bw*0.6,by-s*0.12+i*s*0.05);g.stroke();});}
  if(id==='ojol'){g.fillStyle='#FFD23F';g.fillRect(x-bw,bt+s*0.18,bw*2,s*0.045);mid();}
  if(id==='jenderal'){mid();g.fillStyle='#E2483D';g.fillRect(x-bw*0.42,bt+s*0.1,s*0.05,s*0.03);g.fillStyle='#F2C230';g.fillRect(x-bw*0.42+s*0.055,bt+s*0.1,s*0.05,s*0.03);g.fillStyle='#2F80ED';g.fillRect(x-bw*0.42+s*0.11,bt+s*0.1,s*0.05,s*0.03);ell(x+s*0.05,bt+s*0.16,s*0.018,s*0.018,'#F2C230');ell(x+s*0.05,bt+s*0.26,s*0.018,s*0.018,'#F2C230');}
  if(id==='gubernur'){mid();g.strokeStyle='rgba(0,0,0,.12)';g.lineWidth=s*0.01;for(var q=0;q<4;q++){g.beginPath();g.moveTo(x-bw/2,bt+s*0.1+q*s*0.08);g.lineTo(x+bw/2,bt+s*0.1+q*s*0.08);g.stroke();}}
  if(id==='tambang'){mid();g.fillStyle='#F2F2F2';g.beginPath();g.moveTo(x-bw*0.16,bt);g.lineTo(x,bt+s*0.16);g.lineTo(x+bw*0.16,bt);g.fill();g.fillStyle='#B71C1C';g.beginPath();g.moveTo(x-s*0.02,bt+s*0.04);g.lineTo(x+s*0.02,bt+s*0.04);g.lineTo(x+s*0.03,bt+s*0.2);g.lineTo(x,bt+s*0.24);g.lineTo(x-s*0.03,bt+s*0.2);g.fill();}
  if(id==='sawit'){g.fillStyle='#6E4422';g.fillRect(x-bw*0.5,bt,bw*0.36,by-bt);g.fillRect(x+bw*0.14,bt,bw*0.36,by-bt);}
  if(id==='buzzer'){g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=s*0.012;g.beginPath();g.moveTo(x-s*0.04,bt);g.lineTo(x-s*0.05,bt+s*0.14);g.moveTo(x+s*0.04,bt);g.lineTo(x+s*0.05,bt+s*0.14);g.stroke();rrect(x-bw*0.3,by-s*0.17,bw*0.6,s*0.1,s*0.03);g.fillStyle='rgba(0,0,0,.25)';g.fill();}
  if(id==='influencer'){g.fillStyle='#fff';g.fillRect(x-s*0.06,bt,s*0.12,by-bt);ell(x+bw*0.2,bt+s*0.18,s*0.03,s*0.03,'#FFD23F');}
  if(id==='host'){g.fillStyle='#F4F1EA';g.beginPath();g.moveTo(x-bw*0.2,bt);g.lineTo(x,bt+s*0.2);g.lineTo(x+bw*0.2,bt);g.fill();g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=s*0.012;g.beginPath();g.moveTo(x-bw*0.2,bt);g.lineTo(x-bw*0.05,by);g.moveTo(x+bw*0.2,bt);g.lineTo(x+bw*0.05,by);g.stroke();}
  if(id==='polisi'){mid();rrect(x-bw*0.38,bt+s*0.1,s*0.09,s*0.07,s*0.015);g.fillStyle='rgba(0,0,0,.15)';g.fill();rrect(x+bw*0.38-s*0.09,bt+s*0.1,s*0.09,s*0.07,s*0.015);g.fill();ell(x+s*0.03,bt+s*0.14,s*0.015,s*0.015,'#F2C230');ell(x+s*0.03,bt+s*0.24,s*0.015,s*0.015,'#F2C230');g.fillStyle='#2A1E14';g.fillRect(x-bw,by-s*0.1,bw*2,s*0.035);}
  if(id==='preman'){g.fillStyle='#D9A274';g.beginPath();g.moveTo(x-bw,bt);g.lineTo(x-bw*0.2,bt);g.lineTo(x-bw*0.28,bt+s*0.16);g.lineTo(x-bw,bt+s*0.2);g.fill();g.beginPath();g.moveTo(x+bw,bt);g.lineTo(x+bw*0.2,bt);g.lineTo(x+bw*0.28,bt+s*0.16);g.lineTo(x+bw,bt+s*0.2);g.fill();g.strokeStyle='rgba(40,60,120,.6)';g.lineWidth=s*0.012;g.beginPath();g.arc(x-bw*0.42,bt+s*0.08,s*0.035,0,5);g.stroke();}
  if(id==='tukang'){g.fillStyle='#F7F2C0';g.fillRect(x-bw,bt+s*0.12,bw*2,s*0.035);g.fillRect(x-bw,bt+s*0.24,bw*2,s*0.035);g.fillStyle='rgba(0,0,0,.15)';g.fillRect(x-s*0.008,bt,s*0.016,by-bt);}
  g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.ellipse(x-bw*0.28,bt+(by-bt)*0.4,bw*0.08,(by-bt)*0.35,0,0,7);g.fill();
  if(opt.vest){var vg=g.createLinearGradient(0,bt,0,by);vg.addColorStop(0,'#FF9A3C');vg.addColorStop(1,'#E8590C');g.fillStyle=vg;g.fillRect(x-bw,bt,bw*2,by-bt);
    g.fillStyle='#F4F1EC';g.beginPath();g.moveTo(x-bw*0.16,bt);g.lineTo(x,bt+s*0.14);g.lineTo(x+bw*0.16,bt);g.closePath();g.fill();
    if(s>40){g.fillStyle='#fff';g.font='900 '+(s*0.07)+'px Nunito, sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('TAHANAN',x,bt+s*0.26);}}
  g.restore();
  bodyPath(x,bt,bw,by); g.strokeStyle=shade(opt.vest?'#E8590C':sh,-0.55); g.lineWidth=o; g.stroke();
  if(opt.vest){g.strokeStyle='#9AA3AD';g.lineWidth=Math.max(1,s*0.03);g.beginPath();g.arc(x-s*0.06,by-s*0.12,s*0.045,0,7);g.stroke();g.beginPath();g.arc(x+s*0.06,by-s*0.12,s*0.045,0,7);g.stroke();g.beginPath();g.moveTo(x-s*0.015,by-s*0.12);g.lineTo(x+s*0.015,by-s*0.12);g.stroke();}
  if(!opt.vest){
    if(id==='juragan'||id==='sawit'){g.strokeStyle='#F2C230';g.lineWidth=s*0.025;g.beginPath();g.arc(x,bt-s*0.02,s*0.11,0.25*Math.PI,0.75*Math.PI);g.stroke();}
    if(id==='nenek'){g.save();g.translate(x+bw*0.58,by-s*0.2);g.rotate(-0.5);g.beginPath();g.moveTo(0,0);g.arc(0,0,s*0.16,Math.PI*1.05,Math.PI*1.95);g.closePath();g.fillStyle='#E2483D';g.fill();g.strokeStyle='#8E1E16';g.lineWidth=o;g.stroke();g.restore();}
    if(id==='kyai'){g.strokeStyle='#8A5A33';g.lineWidth=s*0.02;g.setLineDash([s*0.015,s*0.012]);g.beginPath();g.arc(x+bw*0.55,by-s*0.14,s*0.06,0,7);g.stroke();g.setLineDash([]);}
    if(id==='ketum'){ell(x,bt+s*0.05,s*0.05,s*0.04,'#F2C230');ell(x,bt+s*0.05,s*0.025,s*0.02,'#E2483D');}
    if(id==='tambang'){rrect(x+bw*0.45,by-s*0.18,s*0.16,s*0.12,s*0.02);g.fillStyle='#2A1C14';g.fill();g.fillStyle='#F2C230';g.fillRect(x+bw*0.45+s*0.06,by-s*0.19,s*0.04,s*0.02);}
    if(id==='buzzer'||id==='influencer'){var px=x+bw*0.62,py=by-s*0.22;rrect(px-s*0.05,py-s*0.09,s*0.1,s*0.17,s*0.02);g.fillStyle='#1A1A22';g.fill();rrect(px-s*0.04,py-s*0.075,s*0.08,s*0.13,s*0.015);g.fillStyle=(Math.floor(t*3)%2)?'#8FD3FF':'#B3E5FF';g.fill();}
    if(id==='influencer'){g.strokeStyle='#888';g.lineWidth=s*0.015;g.beginPath();g.moveTo(x+bw*0.62,by-s*0.3);g.lineTo(x+bw*0.95,bt-s*0.25);g.stroke();g.beginPath();g.arc(x+bw*0.95,bt-s*0.3,s*0.07,0,7);g.strokeStyle='#FFF6C0';g.lineWidth=s*0.025;g.stroke();}
  }
  // head
  ell(hx-r*0.98,hy+r*0.12,r*0.16,r*0.2,'#E5A97C');ell(hx+r*0.98,hy+r*0.12,r*0.16,r*0.2,'#E5A97C');
  g.beginPath();g.arc(hx,hy,r,0,Math.PI*2);g.fillStyle=rgrad(hx-r*0.35,hy-r*0.4,r*1.15,'#FFE6CC','#E2A276');g.fill();g.strokeStyle='#A8684A';g.lineWidth=o;g.stroke();
  var ey=hy+r*0.14,ex=opt.expr;
  if(id==='ketum'){g.save();g.beginPath();g.arc(hx,hy,r*1.02,0,7);g.clip();g.beginPath();g.arc(hx,hy-r*0.05,r*1.1,Math.PI,0);g.lineTo(hx+r*1.1,hy+r*0.1);g.quadraticCurveTo(hx+r*0.9,hy-r*0.55,hx,hy-r*0.62);g.quadraticCurveTo(hx-r*0.9,hy-r*0.55,hx-r*1.1,hy+r*0.1);g.closePath();g.fillStyle='#D81B60';g.fill();g.restore();}
  g.strokeStyle='#4A2E1E';g.lineWidth=s*0.02;[-1,1].forEach(function(d){var tilt=ex==='shock'?-0.06:ex==='sad'?0.05:id==='buzzer'?-0.05:0;g.beginPath();g.moveTo(hx+d*r*0.24,ey-r*0.3+tilt*r);g.lineTo(hx+d*r*0.52,ey-r*0.32-tilt*r);g.stroke();});
  if(blink||ex==='happy'||(id==='nenek'&&!ex)){g.strokeStyle='#2A1C14';g.lineWidth=s*0.022;[-1,1].forEach(function(sx){g.beginPath();if(blink&&ex!=='happy'){g.moveTo(hx+sx*r*0.28,ey);g.lineTo(hx+sx*r*0.5,ey);}else g.arc(hx+sx*r*0.38,ey+r*0.04,r*0.13,Math.PI*1.1,Math.PI*1.9);g.stroke();});}
  else if(ex==='shock'){[-1,1].forEach(function(sx){ell(hx+sx*r*0.38,ey,r*0.16,r*0.19,'#fff');g.strokeStyle='#2A1C14';g.lineWidth=Math.max(1,s*0.01);g.beginPath();g.ellipse(hx+sx*r*0.38,ey,r*0.16,r*0.19,0,0,7);g.stroke();ell(hx+sx*r*0.38,ey+r*0.02,r*0.06,r*0.07,'#2A1C14');});}
  else{[-1,1].forEach(function(sx){ell(hx+sx*r*0.38,ey,r*0.12,r*0.15,'#2A1C14');ell(hx+sx*r*0.38-r*0.035,ey-r*0.055,r*0.045,r*0.05,'#fff');ell(hx+sx*r*0.38+r*0.04,ey+r*0.05,r*0.02,r*0.02,'rgba(255,255,255,.7)');});}
  ell(hx-r*0.62,hy+r*0.42,r*0.15,r*0.09,'rgba(240,110,110,.45)'); ell(hx+r*0.62,hy+r*0.42,r*0.15,r*0.09,'rgba(240,110,110,.45)');
  ell(hx,hy+r*0.3,r*0.06,r*0.04,'rgba(170,90,60,.45)');
  if(ex==='happy'){g.beginPath();g.arc(hx,hy+r*0.4,r*0.2,0.05*Math.PI,0.95*Math.PI);g.closePath();g.fillStyle='#8E2B1E';g.fill();}
  else if(ex==='shock'){ell(hx,hy+r*0.54,r*0.1,r*0.14,'#5A1E14');}
  else if(ex==='sad'){g.strokeStyle='#7A3B2A';g.lineWidth=s*0.018;g.beginPath();g.arc(hx,hy+r*0.64,r*0.16,1.15*Math.PI,1.85*Math.PI);g.stroke();var tt=(Date.now()/600)%1;ell(hx-r*0.42,ey+r*0.2+tt*r*0.6,r*0.05,r*0.08,'rgba(90,170,240,'+(1-tt)+')');}
  else if(id==='buzzer'){g.strokeStyle='#7A3B2A';g.lineWidth=s*0.018;g.beginPath();g.moveTo(hx-r*0.15,hy+r*0.5);g.quadraticCurveTo(hx+r*0.1,hy+r*0.55,hx+r*0.22,hy+r*0.42);g.stroke();}
  else{g.strokeStyle='#7A3B2A'; g.lineWidth=s*0.018; g.beginPath(); g.arc(hx,hy+r*0.44,r*0.17,0.15*Math.PI,0.85*Math.PI); g.stroke();}
  // headwear & face accessories
  if(id==='juragan'){g.beginPath();g.arc(hx,hy-r*0.08,r*1.04,Math.PI,Math.PI*2);g.lineTo(hx+r*1.04,hy-r*0.02);g.lineTo(hx-r*1.04,hy-r*0.02);g.closePath();var bg=g.createLinearGradient(0,hy-r*1.1,0,hy);bg.addColorStop(0,'#6B4A33');bg.addColorStop(1,'#3B2A20');g.fillStyle=bg;g.fill();
    g.strokeStyle='#E7C27A';g.lineWidth=s*0.022;g.beginPath();g.moveTo(hx-r*1.0,hy-r*0.14);g.lineTo(hx+r*1.0,hy-r*0.14);g.stroke();
    g.fillStyle='#2A1C14';g.beginPath();g.ellipse(hx-r*0.2,hy+r*0.33,r*0.22,r*0.08,-0.25,0,7);g.ellipse(hx+r*0.2,hy+r*0.33,r*0.22,r*0.08,0.25,0,7);g.fill();}
  if(id==='mbak'){hairCap(hx,hy,r,'#2B1E1A');glasses(hx,ey,r,s,'#3A2A60');}
  if(id==='hoki'){g.fillStyle='#6A4326';g.beginPath();g.moveTo(hx-r*1.02,hy-r*0.05);for(var i=0;i<=6;i++){var ang=Math.PI*(1+i/6);var rr2=i%2?r*1.0:r*1.32;g.lineTo(hx+Math.cos(ang)*rr2,hy-r*0.12+Math.sin(ang)*rr2);}g.lineTo(hx+r*1.02,hy-r*0.05);g.quadraticCurveTo(hx,hy-r*0.5,hx-r*1.02,hy-r*0.05);g.fill();}
  if(id==='kapal'){g.beginPath();g.moveTo(hx-r*0.95,hy+r*0.25);g.quadraticCurveTo(hx-r*0.9,hy+r*1.25,hx,hy+r*1.25);g.quadraticCurveTo(hx+r*0.9,hy+r*1.25,hx+r*0.95,hy+r*0.25);g.quadraticCurveTo(hx,hy+r*0.75,hx-r*0.95,hy+r*0.25);g.fillStyle='#F4F4F2';g.fill();g.strokeStyle='#C9C9C2';g.lineWidth=o;g.stroke();
    rrect(hx-r*0.95,hy-r*1.15,r*1.9,r*0.8,r*0.35);g.fillStyle='#FBFBF8';g.fill();g.strokeStyle='#B8B8B0';g.stroke();ell(hx,hy-r*0.33,r*1.1,r*0.2,'#1E1E2A');ell(hx,hy-r*0.82,r*0.18,r*0.14,'#F2C230');}
  if(id==='nenek')hairCap(hx,hy,r,'#C9C9D8');
  if(id==='kos'){g.strokeStyle='#3A2A20';g.lineWidth=s*0.014;for(var q2=-1;q2<=1;q2++){g.beginPath();g.moveTo(hx+q2*r*0.2,hy-r*0.98);g.quadraticCurveTo(hx+q2*r*0.2+r*0.15,hy-r*1.2,hx+q2*r*0.2+r*0.25,hy-r*1.05);g.stroke();}g.fillStyle='#2A1C14';g.fillRect(hx-r*0.32,hy+r*0.28,r*0.64,r*0.07);}
  if(id==='dewi'){hairCap(hx,hy,r,'#2B1E1A');g.fillStyle='#F2C230';g.beginPath();g.moveTo(hx-r*0.45,hy-r*0.85);g.lineTo(hx-r*0.3,hy-r*1.3);g.lineTo(hx-r*0.1,hy-r*0.95);g.lineTo(hx,hy-r*1.4);g.lineTo(hx+r*0.1,hy-r*0.95);g.lineTo(hx+r*0.3,hy-r*1.3);g.lineTo(hx+r*0.45,hy-r*0.85);g.closePath();g.fill();
    for(var f=0;f<5;f++){var fa=f/5*Math.PI*2;ell(hx+r*0.92+Math.cos(fa)*r*0.14,hy-r*0.1+Math.sin(fa)*r*0.14,r*0.12,r*0.12,'#FF5C7A');}ell(hx+r*0.92,hy-r*0.1,r*0.08,r*0.08,'#FFD23F');}
  if(id==='ojol'){g.beginPath();g.arc(hx,hy,r*1.12,Math.PI*0.92,Math.PI*2.08);g.closePath();var og=g.createLinearGradient(0,hy-r*1.1,0,hy);og.addColorStop(0,'#3FD07E');og.addColorStop(1,'#16803F');g.fillStyle=og;g.fill();g.strokeStyle='#0E5A2C';g.lineWidth=o;g.stroke();
    rrect(hx-r*0.85,hy-r*0.42,r*1.7,r*0.3,r*0.15);g.fillStyle='rgba(30,40,60,.75)';g.fill();}
  if(id==='jenderal'){hairCap(hx,hy,r,'#2A1C14',0.3);g.beginPath();g.ellipse(hx,hy-r*0.66,r*1.08,r*0.5,0,Math.PI,0);g.closePath();g.fillStyle=rgrad(hx-r*0.3,hy-r*1.0,r*1.2,'#8A9A55','#46512A');g.fill();g.strokeStyle='#2A3014';g.lineWidth=o;g.stroke();
    g.beginPath();g.ellipse(hx,hy-r*0.62,r*1.15,r*0.2,0,0,Math.PI);g.fillStyle='#1E1E14';g.fill();ell(hx,hy-r*0.92,r*0.14,r*0.14,'#F2C230');g.fillStyle='#2A1C14';g.fillRect(hx-r*0.3,hy+r*0.3,r*0.6,r*0.07);}
  if(id==='ketum'){rrect(hx-r*0.6,hy-r*1.12,r*1.2,r*0.22,r*0.11);g.fillStyle='#2A1C14';g.fill();ell(hx-r*0.32,hy-r*1.01,r*0.16,r*0.09,'#666');ell(hx+r*0.32,hy-r*1.01,r*0.16,r*0.09,'#666');}
  if(id==='gubernur'){hairCap(hx,hy,r,'#2A1C14');rrect(hx-r*0.85,hy-r*1.15,r*1.7,r*0.5,r*0.1);g.fillStyle='#1E1E22';g.fill();g.fillStyle='rgba(255,255,255,.14)';g.fillRect(hx-r*0.8,hy-r*1.05,r*1.6,r*0.06);glasses(hx,ey,r,s,'#3A2A20');}
  if(id==='tambang'){g.beginPath();g.ellipse(hx,hy-r*0.5,r*1.08,r*0.66,0,Math.PI,0);g.closePath();g.fillStyle=rgrad(hx-r*0.3,hy-r*0.9,r*1.2,'#FFE27A','#E0A100');g.fill();g.strokeStyle='#9A6A00';g.lineWidth=o;g.stroke();g.beginPath();g.ellipse(hx,hy-r*0.48,r*1.25,r*0.14,0,0,Math.PI);g.fillStyle='#E0A100';g.fill();
    rrect(hx-r*0.12,hy-r*0.95,r*0.24,r*0.2,r*0.05);g.fillStyle='#ddd';g.fill();ell(hx,hy-r*0.85,r*0.08,r*0.07,'#FFF6C0');}
  if(id==='kyai'){rrect(hx-r*0.82,hy-r*1.15,r*1.64,r*0.55,r*0.15);g.fillStyle='#FBFAF5';g.fill();g.strokeStyle='#D9D4C4';g.lineWidth=o;g.stroke();
    g.beginPath();g.moveTo(hx-r*0.35,hy+r*0.7);g.quadraticCurveTo(hx,hy+r*1.25,hx+r*0.35,hy+r*0.7);g.fillStyle='#E8E4DA';g.fill();g.strokeStyle='#BDB6A6';g.stroke();}
  if(id==='sawit'){g.fillStyle=rgrad(hx-r*0.4,hy-r*0.7,r*1.6,'#E9C98A','#A8803A');g.beginPath();g.ellipse(hx,hy-r*0.6,r*1.55,r*0.28,0,0,7);g.fill();g.strokeStyle='#7A5A20';g.lineWidth=o;g.stroke();g.beginPath();g.ellipse(hx,hy-r*0.68,r*0.72,r*0.48,0,Math.PI,0);g.closePath();g.fill();g.stroke();g.fillStyle='#5A3A10';g.fillRect(hx-r*0.7,hy-r*0.8,r*1.4,r*0.1);
    g.fillStyle='#2A1C14';g.beginPath();g.ellipse(hx,hy+r*0.32,r*0.32,r*0.09,0,0,7);g.fill();g.save();g.translate(hx+r*0.3,hy+r*0.48);g.rotate(0.25);g.fillStyle='#7A4A2A';g.fillRect(0,-r*0.05,r*0.5,r*0.1);g.fillStyle='#FF8A1F';g.fillRect(r*0.48,-r*0.05,r*0.06,r*0.1);g.restore();}
  if(id==='buzzer'){g.beginPath();g.arc(hx,hy,r*1.1,Math.PI*0.95,Math.PI*2.05);g.closePath();g.fillStyle='#2A303C';g.fill();g.strokeStyle='#111';g.lineWidth=s*0.03;g.beginPath();g.arc(hx,hy-r*0.1,r*1.05,Math.PI*1.1,Math.PI*1.9);g.stroke();ell(hx-r*1.0,hy+r*0.05,r*0.16,r*0.22,'#111');ell(hx+r*1.0,hy+r*0.05,r*0.16,r*0.22,'#111');}
  if(id==='influencer'){hairCap(hx,hy,r,'#6A3A20');ell(hx+r*0.65,hy-r*0.65,r*0.14,r*0.1,'#FF6FA5');}
  if(id==='host'){hairCap(hx,hy,r,'#3A2418',0.35);glasses(hx,ey,r,s,'#C9A24A');ell(hx-r*1.0,hy+r*0.4,r*0.07,r*0.07,'#F2C230');ell(hx+r*1.0,hy+r*0.4,r*0.07,r*0.07,'#F2C230');}
  if(id==='polisi'){hairCap(hx,hy,r,'#1E1610',0.3);g.beginPath();g.ellipse(hx,hy-r*0.66,r*1.08,r*0.48,0,Math.PI,0);g.closePath();g.fillStyle=rgrad(hx-r*0.3,hy-r*1.0,r*1.2,'#9A7A50','#5A4228');g.fill();g.strokeStyle='#3A2A18';g.lineWidth=o;g.stroke();g.beginPath();g.ellipse(hx,hy-r*0.6,r*1.12,r*0.18,0,0,Math.PI);g.fillStyle='#14100C';g.fill();ell(hx,hy-r*0.9,r*0.13,r*0.13,'#F2C230');g.fillStyle='#2A1C14';g.fillRect(hx-r*0.28,hy+r*0.3,r*0.56,r*0.06);}
  if(id==='preman'){g.beginPath();g.arc(hx,hy-r*0.05,r*1.04,Math.PI*1.0,Math.PI*2.0);g.closePath();g.fillStyle='#C62828';g.fill();g.fillStyle='rgba(255,255,255,.7)';for(var pd=0;pd<5;pd++)ell(hx-r*0.7+pd*r*0.35,hy-r*0.55,r*0.05,r*0.05,'#fff');g.save();g.translate(hx+r*0.95,hy-r*0.15);g.rotate(0.6);rrect(0,-r*0.08,r*0.45,r*0.16,r*0.06);g.fillStyle='#C62828';g.fill();g.restore();
    g.fillStyle='rgba(40,30,30,.35)';for(var sb=0;sb<14;sb++)ell(hx-r*0.5+hash(sb,7)*r,hy+r*0.55+hash(sb,8)*r*0.3,r*0.02,r*0.02,'#333');g.strokeStyle='#A0583A';g.lineWidth=s*0.012;g.beginPath();g.moveTo(hx+r*0.55,hy-r*0.2);g.lineTo(hx+r*0.7,hy+r*0.15);g.stroke();ell(hx+r*0.08,hy+r*0.49,r*0.05,r*0.04,'#F2C230');}
  if(id==='tukang'){g.beginPath();g.arc(hx,hy-r*0.05,r*1.05,Math.PI*1.0,Math.PI*2.0);g.closePath();g.fillStyle=rgrad(hx-r*0.3,hy-r*0.8,r*1.2,'#FFB066','#D9661A');g.fill();g.beginPath();g.ellipse(hx-r*0.5,hy-r*0.08,r*0.75,r*0.14,0,0,7);g.fillStyle='#B8540F';g.fill();ell(hx-r*0.05,hy+r*0.52,r*0.11,r*0.07,'#C0C0C8');g.strokeStyle='#C0C0C8';g.lineWidth=s*0.01;g.beginPath();g.moveTo(hx-r*0.05,hy+r*0.55);g.quadraticCurveTo(hx-r*0.3,hy+r*1.1,hx,hy+r*1.4);g.stroke();}
  if(opt.cough){var ct=(Date.now()/500)%1;for(var c2=0;c2<3;c2++){var cp=(ct+c2/3)%1;ell(hx+r*(0.6+cp*1.2),hy+r*(0.4-cp*0.8),r*(0.15+cp*0.3),r*(0.15+cp*0.3),'rgba(150,150,150,'+(0.7*(1-cp))+')');}}
  g.restore();
}
function portrait(cv,id,color,opt){var c=cv.getContext('2d'),dpr=Math.min(3,window.devicePixelRatio||1),w=cv.clientWidth||cv.width,h=cv.clientHeight||cv.height;cv.width=w*dpr;cv.height=h*dpr;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);var old=g;g=c;drawChar(id,w/2,h*0.95,Math.min(h*0.9,w*1.1),color,opt);g=old;}
