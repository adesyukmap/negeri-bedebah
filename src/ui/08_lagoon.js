/* ---------- lagoon life ---------- */
function radialFill(x,y,r,c1,c2){var gr=g.createRadialGradient(x-r*0.35,y-r*0.4,r*0.05,x,y,r);gr.addColorStop(0,c1);gr.addColorStop(1,c2);return gr;}
function lagoonWater(now){
  var L2=BN-1.55,lag=[iso(1.55,1.55,0),iso(L2,1.55,0),iso(L2,L2,0),iso(1.55,L2,0)],lg=g.createLinearGradient(0,lag[0].y,0,lag[2].y);lg.addColorStop(0,'#8FDDF3');lg.addColorStop(0.5,'#4DB5DE');lg.addColorStop(1,'#2E95C6');path(lag);g.fillStyle=lg;g.fill();
  g.save();path(lag);g.clip();
  g.strokeStyle='rgba(20,70,110,.25)';g.lineWidth=lw(0.05);path(lag);g.stroke();
  for(var k=0;k<10;k++){var per=3.2,ph=((now/1000+k*0.73)%per)/per,cyc=Math.floor((now/1000+k*0.73)/per),u=2.1+hash(k,cyc)*(BN-4.2),v=2.1+hash(cyc,k+9)*(BN-4.2);var c=iso(u,v,0);g.strokeStyle='rgba(255,255,255,'+(0.4*(1-ph))+')';g.lineWidth=lw(0.01);g.beginPath();g.ellipse(c.x,c.y,TW*0.05+ph*TW*0.25,TH*0.05+ph*TH*0.25,0,0,7);g.stroke();}
  for(var f=0;f<8;f++){var sp=0.12+hash(f,3)*0.1,dir=f%2?1:-1,a=now/1000*sp*dir+f*0.9,rad=2.0+hash(f,7)*2.1,u2=MID+Math.cos(a)*rad,v2=MID+Math.sin(a)*rad,p=iso(u2,v2,0),pn=iso(MID+Math.cos(a+0.05*dir)*rad,MID+Math.sin(a+0.05*dir)*rad,0),ang=Math.atan2(pn.y-p.y,pn.x-p.x);
    var fc=['#FF8A1F','#FFD23F','#FF5C7A','#5FD3EA'][f%4],fl=TW*0.08;ell(p.x+TW*0.03,p.y+TH*0.06,fl*0.9,fl*0.3,'rgba(10,50,90,.18)');
    g.save();g.translate(p.x,p.y);g.rotate(ang);g.globalAlpha=0.8;var wig=Math.sin(now/120+f)*fl*0.25;
    g.beginPath();g.moveTo(-fl*0.8,0);g.lineTo(-fl*1.5,-fl*0.5+wig);g.lineTo(-fl*1.35,0);g.lineTo(-fl*1.5,fl*0.5+wig);g.closePath();g.fillStyle=shade(fc,-0.15);g.fill();
    g.beginPath();g.ellipse(0,0,fl,fl*0.45,0,0,7);var fg=g.createLinearGradient(0,-fl*0.45,0,fl*0.45);fg.addColorStop(0,shade(fc,0.25));fg.addColorStop(1,shade(fc,-0.25));g.fillStyle=fg;g.fill();
    g.beginPath();g.moveTo(-fl*0.1,-fl*0.4);g.lineTo(-fl*0.45,-fl*0.75);g.lineTo(-fl*0.5,-fl*0.35);g.fillStyle=shade(fc,-0.1);g.fill();ell(fl*0.55,-fl*0.08,fl*0.1,fl*0.1,'#fff');ell(fl*0.58,-fl*0.08,fl*0.05,fl*0.05,'#111');g.restore();}
  g.restore();
  var ic=iso(MID,MID,0);
  ell(ic.x,ic.y+TH*0.22,TW*1.46,TH*1.42,'rgba(255,255,255,.28)');ell(ic.x,ic.y+TH*0.16,TW*1.34,TH*1.28,'#CDAE6E');ell(ic.x,ic.y+TH*0.1,TW*1.3,TH*1.2,'#E2C88C');
  ell(ic.x,ic.y,TW*1.26,TH*1.12,radialFill(ic.x,ic.y-TH*0.3,TW*1.3,'#FFF4D6','#EBD3A0'));
  if(isPol())forestGround(ic,now);
  else{ell(ic.x-TW*0.78,ic.y-TH*0.3,TW*0.36,TH*0.28,radialFill(ic.x-TW*0.78,ic.y-TH*0.3,TW*0.36,'#B6E6A6','#5FAE5A'));ell(ic.x+TW*0.82,ic.y+TH*0.2,TW*0.28,TH*0.22,radialFill(ic.x+TW*0.82,ic.y+TH*0.2,TW*0.28,'#B6E6A6','#5FAE5A'));}
}
function forestGround(ic,now){var st=S.kasStage||0;var gg=radialFill(ic.x,ic.y-TH*0.2,TW*1.2,st>=2?'#C9C07A':'#8ED17E',st>=2?'#9A9A4A':'#3F8E4A');ell(ic.x,ic.y-TH*0.04,TW*1.12,TH*0.98,gg);}
var FOREST=(function(){var a=[];for(var k=0;k<22;k++){var ang=hash(k,11)*Math.PI*2,r=0.35+Math.sqrt(hash(k,23))*1.15;a.push({u:MID+Math.cos(ang)*r,v:MID+Math.sin(ang)*r,s:0.28+hash(k,5)*0.14,o:hash(k,99)});}return a;})();
function treeAt(t){var du=t.u-MID+5,dv=t.v-MID+5,near=Math.abs(du-4.6)+Math.abs(dv-5.4)<0.95||Math.abs(du-5.4)+Math.abs(dv-4.6)<0.95||Math.abs(du-3.9)+Math.abs(dv-5.6)<0.7||Math.abs(du-5.85)+Math.abs(dv-5.9)<0.4||(du+dv<9.2&&Math.abs(du-dv)<1.2);return !near;}
function drawRainTree(x,y,s){ell(x+s*0.2,y,s*0.4,s*0.13,'rgba(20,50,20,.28)');g.fillStyle='#6A4A2A';g.fillRect(x-s*0.05,y-s*0.5,s*0.1,s*0.5);
  [[0,-0.75,0.42],[-0.25,-0.6,0.3],[0.25,-0.62,0.32],[0,-1.0,0.3]].forEach(function(c){var cx=x+c[0]*s,cy=y+c[1]*s,r=c[2]*s;g.beginPath();g.arc(cx,cy,r,0,7);g.fillStyle=radialFill(cx,cy,r,'#7FD36E','#1F6E34');g.fill();});}
function lagoonLife(now){
  var items=[],t=now/1000,pol=isPol();
  for(var k=0;k<2;k++){(function(k){var per=7.5,off=k*3.7,cyc=Math.floor((t+off)/per),ph=(t+off)-cyc*per;if(ph>1.5)return;var jt=ph/1.5,a=hash(cyc,k)*Math.PI*2,r=2.4+hash(k,cyc)*1.5,su=MID+Math.cos(a)*r,sv=MID+Math.sin(a)*r,du=-Math.sin(a)*1.15,dv=Math.cos(a)*1.15;
    items.push({d:su+sv+jt*(du+dv)+0.2,f:function(){drawDolphin(su,sv,du,dv,jt);}});})(k);}
  var ta=t*0.06,tu=MID+Math.cos(ta)*3.9,tv=MID+Math.sin(ta)*3.9;items.push({d:tu+tv,f:function(){drawTurtle(tu,tv,ta,now);}});
  var ba=-t*0.035+1.2,bu=MID+Math.cos(ba)*3.1,bv=MID+Math.sin(ba)*3.1;items.push({d:bu+bv,f:function(){drawBoat(bu,bv,ba,now);}});
  if(pol){
    var st=S.kasStage||0,burn=FX.forest,bt=burn?(now-burn.t0)/3200:2;
    FOREST.forEach(function(tr,idx){if(!treeAt(tr))return;var conv=tr.o<st/3,wasConv=burn?tr.o<burn.from/3:conv,burning=bt<1&&conv&&!wasConv;
      items.push({d:tr.u+tr.v,f:function(){var q=iso(tr.u,tr.v,0),s=TW*tr.s;
        if(burning){if(bt<0.55){drawRainTree(q.x,q.y,s);fire(q.x,q.y-s*0.6,s*0.8,now,idx);}else if(bt<0.75){g.fillStyle='#2A1C14';g.fillRect(q.x-s*0.05,q.y-s*0.3,s*0.1,s*0.3);fire(q.x,q.y-s*0.2,s*0.5*(1-(bt-0.55)/0.2),now,idx);}else{var gs=(bt-0.75)/0.25;g.save();g.translate(q.x,q.y);g.scale(gs,gs);g.translate(-q.x,-q.y);sawit(q.x,q.y,s*0.9,idx);g.restore();}}
        else if(conv)sawit(q.x,q.y,s*0.9,idx); else drawRainTree(q.x,q.y,s);}});});
    items.push({d:2*MID-0.5,f:function(){drawIKN(MID-1.1,MID+0.6,now);}});
    items.push({d:2*MID+1.75,f:function(){drawOrangutan(MID+0.85,MID+0.9,now,st,bt<1);}});
    if(bt<1)items.push({d:20,f:function(){var c=iso(MID,MID,0);g.save();g.globalAlpha=Math.sin(Math.PI*bt)*0.55;for(var s2=0;s2<9;s2++){var ph=(t*0.3+s2/9)%1;var sx=c.x+(hash(s2,2)-0.5)*TW*2,sy=c.y-ph*TH*5;g.beginPath();g.arc(sx,sy,TW*(0.25+ph*0.6),0,7);g.fillStyle='rgba(110,105,100,.55)';g.fill();}g.restore();}});
  } else {
    var cx=MID+0.75+Math.sin(t*0.7)*0.3,cy=MID+0.95;items.push({d:cx+cy,f:function(){drawCrab(cx,cy,now);}});
    [[MID-1.1,MID+0.25,0.32],[MID+1.1,MID+0.25,0.34],[MID-0.55,MID+1.15,0.3]].forEach(function(pp){items.push({d:pp[0]+pp[1],f:function(){var q=iso(pp[0],pp[1],0);palm(q.x,q.y,TW*pp[2]);}});});
    var hut=[MID-0.9,MID-0.6];items.push({d:hut[0]+hut[1],f:function(){aoShadow(hut[0],hut[1],0.36,0.32,0);box(hut[0],hut[1],0.36,0.32,TH*0.26,0,'#C8955A','#A9743E');pyramid(hut[0],hut[1],0.5,0.46,TH*0.34,TH*0.26,'#D9B25A');}});
    var bp=FX.beach?(now-FX.beach)/3500:2;if(bp<1)items.push({d:10.2,f:function(){beachParty(now,bp);}});
  }
  return items;
}
function fire(x,y,s,now,seed){for(var k=0;k<5;k++){var ph=((now/260+k/5+seed*0.13)%1),fx=x+(hash(k,seed)-0.5)*s*0.6,fy=y-ph*s*0.9,fs=s*0.3*(1-ph);
  g.beginPath();g.moveTo(fx-fs,fy);g.quadraticCurveTo(fx-fs*0.3,fy-fs*1.6,fx,fy-fs*2.2);g.quadraticCurveTo(fx+fs*0.3,fy-fs*1.6,fx+fs,fy);g.closePath();var fg=g.createLinearGradient(0,fy-fs*2.2,0,fy);fg.addColorStop(0,'rgba(255,230,120,.9)');fg.addColorStop(1,'rgba(240,80,20,.9)');g.fillStyle=fg;g.fill();}}
function drawIKN(u,v,now){aoShadow(u,v,0.8,0.6,0);box(u,v,0.8,0.5,TH*0.2,0,'#E8E0D0','#CFC4AE');
  [-1,1].forEach(function(d){var b=iso(u+d*0.22,v-d*0.18,TH*0.2),t2=iso(u+d*0.36,v-d*0.3,TH*0.95);g.beginPath();g.moveTo(b.x,b.y);g.lineTo(t2.x,t2.y);g.lineTo(t2.x+d*TW*0.04,t2.y+TH*0.25);g.lineTo(b.x+d*TW*0.1,b.y);g.closePath();g.fillStyle=radialFill(b.x,b.y-TH*0.4,TW*0.4,'#E9C46A','#9A6A1A');g.fill();g.strokeStyle='rgba(80,50,10,.6)';g.lineWidth=lw(0.008);g.stroke();
    for(var k=1;k<4;k++){g.beginPath();g.moveTo(b.x+(t2.x-b.x)*k/4,b.y+(t2.y-b.y)*k/4);g.lineTo(b.x+(t2.x-b.x)*k/4+d*TW*0.05,b.y+(t2.y-b.y)*k/4+TH*0.12);g.stroke();}});
  box(u,v,0.22,0.22,TH*1.05,TH*0.2,'#F2E8D2','#D9C9A8');pyramid(u,v,0.28,0.28,TH*0.3,TH*1.25,'#C99A3A');var tp=iso(u,v,TH*1.55);ell(tp.x,tp.y,lw(0.03),lw(0.03),'#F2C230');
  var lb=iso(u,v+0.3,TH*0.2);g.fillStyle=INK;g.font='900 '+(TW*0.07)+'px Nunito, sans-serif';g.textAlign='center';g.fillText('IKN',lb.x,lb.y-TH*0.05);}
function drawOrangutan(u,v,now,stage,burning){var q=iso(u,v,0),s=TW*0.26;ell(q.x,q.y,s*0.4,s*0.12,'rgba(40,20,10,.3)');
  var fur=radialFill(q.x,q.y-s*0.45,s*0.5,'#E0803A','#8A3A12');g.beginPath();g.ellipse(q.x,q.y-s*0.32,s*0.32,s*0.34,0,0,7);g.fillStyle=fur;g.fill();
  [-1,1].forEach(function(d){g.strokeStyle='#A2481A';g.lineWidth=s*0.13;g.lineCap='round';g.beginPath();g.moveTo(q.x+d*s*0.25,q.y-s*0.45);g.quadraticCurveTo(q.x+d*s*0.55,q.y-s*0.2,q.x+d*s*0.35,q.y-s*0.02);g.stroke();});
  g.beginPath();g.arc(q.x,q.y-s*0.78,s*0.24,0,7);g.fillStyle=radialFill(q.x,q.y-s*0.82,s*0.26,'#E88A44','#9A4416');g.fill();
  ell(q.x,q.y-s*0.72,s*0.17,s*0.13,'#F0C49A');var sad=stage>0||burning;
  [-1,1].forEach(function(d){ell(q.x+d*s*0.08,q.y-s*0.8,s*0.03,s*0.035,'#2A1C14');});
  g.strokeStyle='#5A2A10';g.lineWidth=Math.max(1,s*0.03);g.beginPath();if(sad)g.arc(q.x,q.y-s*0.6,s*0.07,1.15*Math.PI,1.85*Math.PI);else g.arc(q.x,q.y-s*0.7,s*0.07,0.15*Math.PI,0.85*Math.PI);g.stroke();
  if(sad){for(var k=0;k<2;k++){var tt=((now/500)+k*0.5)%1;[-1,1].forEach(function(d){ell(q.x+d*s*0.1,q.y-s*0.76+tt*s*0.4,s*0.025,s*0.04,'rgba(90,170,240,'+(1-tt)+')');});}
    if(burning){g.save();g.globalAlpha=0.9;pill(q.x+s*0.5,q.y-s*1.15,'huhu...',TW*0.08,'#fff',INK);g.restore();}}}
function beachParty(now,bp){var c=iso(MID,MID,0);for(var k=0;k<14;k++){var a=k/14*Math.PI*2+now/2000,r=TW*(0.6+0.3*Math.sin(k)),px=c.x+Math.cos(a)*r,py=c.y+Math.sin(a)*r*0.45,j=Math.abs(Math.sin(now/170+k))*TH*0.2;
  ell(px,py,TW*0.03,TH*0.02,'rgba(30,20,10,.2)');rrect(px-TW*0.02,py-TW*0.07-j,TW*0.04,TW*0.05,TW*0.01);g.fillStyle=['#E2483D','#2F80ED','#27AE60','#9B51E0','#F2994A'][k%5];g.fill();ell(px,py-TW*0.09-j,TW*0.018,TW*0.018,'#F2C49B');}
  for(var f=0;f<3;f++){var ft=((now/900+f/3)%1),fx=c.x+(f-1)*TW*0.8,fy=c.y-TH*3;for(var s=0;s<12;s++){var a2=s/12*Math.PI*2;ell(fx+Math.cos(a2)*TW*0.4*ft,fy+Math.sin(a2)*TW*0.4*ft+ft*ft*TH*0.4,TW*0.02*(1-ft),TW*0.02*(1-ft),['#FFD23F','#FF5C7A','#4CC0F0','#7BD389'][s%4]);}}}
function drawDolphin(su,sv,du,dv,jt){
  var z=Math.sin(Math.PI*jt)*TH*1.6,p=iso(su+du*jt,sv+dv*jt,z),p2=iso(su+du*(jt+0.02),sv+dv*(jt+0.02),Math.sin(Math.PI*(jt+0.02))*TH*1.6),ang=Math.atan2(p2.y-p.y,p2.x-p.x),flip=p2.x<p.x;
  var sp=[iso(su,sv,0),iso(su+du,sv+dv,0)];[[0,jt<0.18],[1,jt>0.82]].forEach(function(s){if(!s[1])return;var e=s[0]?(jt-0.82)/0.18:jt/0.18,q=sp[s[0]];g.strokeStyle='rgba(255,255,255,'+(0.8*(1-e*0.6))+')';g.lineWidth=lw(0.015);g.beginPath();g.ellipse(q.x,q.y,TW*(0.08+e*0.14),TH*(0.08+e*0.14),0,0,7);g.stroke();for(var d=0;d<6;d++){var aa=d/6*Math.PI-Math.PI;ell(q.x+Math.cos(aa)*TW*0.1*(0.5+e),q.y-Math.abs(Math.sin(aa))*TH*0.6*e,TW*0.014,TW*0.014,'rgba(255,255,255,.9)');}});
  if(jt<0.06||jt>0.94)return;
  var shp=iso(su+du*jt,sv+dv*jt,0);ell(shp.x,shp.y,TW*0.13*(1-z/(TH*3)),TH*0.07,'rgba(10,60,100,.2)');
  g.save();g.translate(p.x,p.y);g.rotate(ang);if(flip)g.scale(1,-1);var L=TW*0.21;
  g.beginPath();g.moveTo(L*0.62,0);g.quadraticCurveTo(L*0.3,-L*0.3,-L*0.4,-L*0.14);g.lineTo(-L*0.62,-L*0.04);g.quadraticCurveTo(-L*0.2,L*0.22,L*0.62,0.02*L);g.closePath();
  var gr=g.createLinearGradient(0,-L*0.3,0,L*0.2);gr.addColorStop(0,'#3F6E9A');gr.addColorStop(0.55,'#7FA6CC');gr.addColorStop(1,'#F0F6FB');g.fillStyle=gr;g.fill();g.strokeStyle='#26476A';g.lineWidth=Math.max(1,L*0.04);g.stroke();
  g.beginPath();g.moveTo(L*0.4,-L*0.12);g.quadraticCurveTo(0,-L*0.24,-L*0.3,-L*0.12);g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=Math.max(1,L*0.04);g.stroke();
  g.beginPath();g.moveTo(-L*0.05,-L*0.22);g.lineTo(-L*0.2,-L*0.44);g.lineTo(-L*0.25,-L*0.18);g.closePath();g.fillStyle='#3F6E9A';g.fill();g.strokeStyle='#26476A';g.lineWidth=Math.max(1,L*0.04);g.stroke();
  g.beginPath();g.moveTo(-L*0.58,-L*0.04);g.lineTo(-L*0.82,-L*0.24);g.lineTo(-L*0.72,-L*0.02);g.lineTo(-L*0.82,L*0.17);g.closePath();g.fill();g.stroke();
  ell(L*0.38,-L*0.06,L*0.04,L*0.04,'#1A2A3A');ell(L*0.37,-L*0.075,L*0.014,L*0.014,'#fff');g.restore();
}
function drawTurtle(u,v,a,now){var p=iso(u,v,1),pn=iso(MID+Math.cos(a+0.05)*3.9,MID+Math.sin(a+0.05)*3.9,1),ang=Math.atan2(pn.y-p.y,pn.x-p.x),s=TW*0.12;
  ell(p.x+s*0.2,p.y+s*0.25,s*0.7,s*0.3,'rgba(10,50,80,.2)');
  g.save();g.translate(p.x,p.y);g.rotate(ang);var fl=Math.sin(now/300)*0.4;
  [[0.5,1],[0.5,-1],[-0.55,1],[-0.55,-1]].forEach(function(f){g.save();g.translate(f[0]*s,f[1]*s*0.5);g.rotate(f[1]*(0.6+fl*f[0]));g.beginPath();g.ellipse(0,f[1]*s*0.25,s*0.12,s*0.3,0,0,7);g.fillStyle='#6FBF7A';g.fill();g.strokeStyle='#2B5A31';g.lineWidth=1;g.stroke();g.restore();});
  g.beginPath();g.ellipse(s*0.78,0,s*0.2,s*0.16,0,0,7);g.fillStyle=radialFill(s*0.78,0,s*0.2,'#9AD9A0','#4E9A58');g.fill();ell(s*0.86,-s*0.06,s*0.03,s*0.03,'#111');
  g.beginPath();g.ellipse(0,0,s*0.62,s*0.46,0,0,7);g.fillStyle=radialFill(0,0,s*0.62,'#7FBF6A','#2E6A36');g.fill();g.strokeStyle='#1E4A24';g.lineWidth=Math.max(1,s*0.05);g.stroke();
  g.strokeStyle='rgba(180,230,160,.7)';g.lineWidth=Math.max(1,s*0.04);[[0,0,0.2],[-0.3,0.1,0.13],[0.3,0.1,0.13],[-0.15,-0.25,0.12],[0.18,-0.25,0.12]].forEach(function(h2){g.beginPath();for(var k=0;k<6;k++){var aa=k/6*Math.PI*2;g.lineTo(h2[0]*s+Math.cos(aa)*h2[2]*s,h2[1]*s+Math.sin(aa)*h2[2]*s);}g.closePath();g.stroke();});g.restore();}
function drawBoat(u,v,a,now){var bob=Math.sin(now/500)*TH*0.04,p=iso(u,v,bob),pn=iso(MID+Math.cos(a-0.05)*3.1,MID+Math.sin(a-0.05)*3.1,0),flip=pn.x<p.x?-1:1,s=TW*0.26;
  ell(p.x,p.y+TH*0.05,s*0.65,s*0.13,'rgba(10,60,100,.25)');g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=lw(0.01);g.beginPath();g.ellipse(p.x-flip*s*0.6,p.y+TH*0.06,s*0.3,s*0.06,0,0,7);g.stroke();
  g.save();g.translate(p.x,p.y);g.scale(flip,1);OL(s);
  g.beginPath();g.moveTo(-s*0.5,-s*0.12);g.lineTo(s*0.55,-s*0.16);g.quadraticCurveTo(s*0.35,s*0.08,-s*0.35,s*0.06);g.closePath();var hg=g.createLinearGradient(0,-s*0.16,0,s*0.08);hg.addColorStop(0,'#B07A44');hg.addColorStop(1,'#5E3720');g.fillStyle=hg;g.fill();g.stroke();
  g.beginPath();g.moveTo(-s*0.45,-s*0.1);g.lineTo(s*0.5,-s*0.14);g.strokeStyle='#E2483D';g.lineWidth=Math.max(1,s*0.04);g.stroke();OL(s);
  g.beginPath();g.moveTo(0,-s*0.14);g.lineTo(0,-s*0.95);g.stroke();
  g.beginPath();g.moveTo(s*0.03,-s*0.9);g.quadraticCurveTo(s*0.45,-s*0.5,s*0.42,-s*0.2);g.lineTo(s*0.03,-s*0.2);g.closePath();var sg=g.createLinearGradient(0,0,s*0.45,0);sg.addColorStop(0,'#FFFFFF');sg.addColorStop(1,'#DDE3EA');g.fillStyle=sg;g.fill();g.stroke();
  g.fillStyle='#E2483D';g.fillRect(s*0.05,-s*0.42,s*0.3,s*0.06);g.beginPath();g.moveTo(-s*0.03,-s*0.8);g.lineTo(-s*0.36,-s*0.24);g.lineTo(-s*0.03,-s*0.24);g.closePath();g.fillStyle='#FFF1C4';g.fill();g.stroke();
  g.beginPath();g.moveTo(0,-s*0.95);g.lineTo(s*0.16,-s*0.9+Math.sin(now/150)*s*0.02);g.lineTo(0,-s*0.85);g.fillStyle='#E2483D';g.fill();g.restore();}
function drawCrab(u,v,now){var p=iso(u,v,0),s=TW*0.075,w=Math.sin(now/90)*s*0.12;ell(p.x,p.y+s*0.05,s*0.6,s*0.15,'rgba(60,30,10,.25)');g.save();g.translate(p.x,p.y);g.strokeStyle='#A8281E';g.lineWidth=Math.max(1,s*0.12);
  for(var k=-1;k<=1;k+=2){for(var l=0;l<3;l++){g.beginPath();g.moveTo(k*s*0.3,-s*0.15);g.lineTo(k*s*(0.7+l*0.05),-s*0.05+l*s*0.12+(l%2?w:-w));g.stroke();}g.beginPath();g.arc(k*s*0.7,-s*0.5,s*0.18,0,7);g.fillStyle=radialFill(k*s*0.7,-s*0.5,s*0.18,'#FF8A7A','#C0281E');g.fill();}
  g.beginPath();g.ellipse(0,-s*0.25,s*0.45,s*0.3,0,0,7);g.fillStyle=radialFill(0,-s*0.3,s*0.45,'#FF8A7A','#C0281E');g.fill();ell(-s*0.15,-s*0.55,s*0.07,s*0.07,'#111');ell(s*0.15,-s*0.55,s*0.07,s*0.07,'#111');g.restore();}
function drawBirds(now){var t=now/1000;for(var k=0;k<3;k++){var sp=0.035+k*0.008,ph=((t*sp+k*0.37)%1),x=-0.1*CW+ph*CW*1.2,y=CH_*(0.16+k*0.09)+Math.sin(t*0.8+k)*30,s=Math.max(12,TW*0.1*(1+k*0.15)),fl=Math.sin(t*9+k*2);
  g.save();g.globalAlpha=0.16;ell(x+s*2,y+s*7,s*0.9,s*0.25,'#08324F');g.restore();
  g.save();g.lineCap='round';g.lineJoin='round';
  g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x-s*0.45,y-s*0.35-fl*s*0.4,x-s,y-fl*s*0.6);g.quadraticCurveTo(x-s*0.5,y-s*0.05-fl*s*0.2,x,y+s*0.08);g.fillStyle='#E8EEF3';g.fill();g.strokeStyle='#4A5A6A';g.lineWidth=Math.max(1,s*0.06);g.stroke();
  g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+s*0.45,y-s*0.35-fl*s*0.4,x+s,y-fl*s*0.6);g.quadraticCurveTo(x+s*0.5,y-s*0.05-fl*s*0.2,x,y+s*0.08);g.fillStyle='#F7FAFC';g.fill();g.stroke();
  ell(x,y+s*0.05,s*0.2,s*0.12,radialFill(x,y,s*0.2,'#FFFFFF','#C9D3DC'));ell(x+s*0.16,y+s*0.02,s*0.05,s*0.04,'#F2A900');g.restore();}}
function drawCloudShadows(now){var t=now/1000;g.save();for(var k=0;k<2;k++){var ph=((t*0.012+k*0.5)%1),u=-2+ph*(BN+4),v=2+k*5+Math.sin(t*0.05+k)*1.5,p=iso(u,v,0);g.globalAlpha=0.07;[[0,0,1],[0.6,0.1,0.7],[-0.5,0.15,0.6]].forEach(function(c){ell(p.x+c[0]*TW,p.y+c[1]*TH,TW*1.1*c[2],TH*1.0*c[2],'#06243D');});}g.restore();}
function cloud(x,y,s,alpha){g.save();g.globalAlpha=alpha;ell(x,y+s*0.38,s*1.1,s*0.16,'rgba(20,60,90,.18)');
  [[-0.6,0.1,0.42],[0.55,0.12,0.4],[0,-0.12,0.55],[-0.25,0.05,0.45],[0.3,0,0.45]].forEach(function(c){var cx=x+c[0]*s,cy=y+c[1]*s,r=c[2]*s;var gr=g.createRadialGradient(cx-r*0.3,cy-r*0.45,r*0.1,cx,cy,r);gr.addColorStop(0,'#FFFFFF');gr.addColorStop(0.7,'#F1F6FA');gr.addColorStop(1,'#C7D6E3');g.beginPath();g.arc(cx,cy,r,0,7);g.fillStyle=gr;g.fill();});
  g.beginPath();g.ellipse(x,y+s*0.22,s*0.95,s*0.18,0,0,Math.PI);g.fillStyle='rgba(180,200,220,.5)';g.fill();g.restore();}
function drawSkyClouds(now){var t=now/1000;for(var k=0;k<3;k++){var ph=((t*0.008+k*0.33)%1),x=-CW*0.2+ph*CW*1.4,y=40+k*60+(k===1?CH_*0.68:0),s=Math.max(40,TW*(0.55+k*0.1));cloud(x,y,s,0.92*(1-NIGHT*0.6));}}
