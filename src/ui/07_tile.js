/* ---------- full tile ---------- */
var FX={press:{},build:{},take:{},collapse:[],mangkrak:{},quake:null,party:{},splash:[]};
function pressOff(i,now){var t0=FX.press[i];if(t0==null)return 0;var t=(now-t0)/480;if(t<0||t>1)return 0;return -DZ*0.6*Math.sin(Math.PI*Math.min(1,t*1.6))*(t<0.62?1:0)+(t>=0.62?DZ*0.18*Math.sin(Math.PI*(t-0.62)/0.38):0);}
function tileTop(i,now){return tileH(i)+pressOff(i,now||performance.now());}
function dust(x,y,s,t,col){for(var k=0;k<7;k++){var a=k/7*Math.PI*2,r=s*(0.3+t*0.9),al=Math.max(0,0.75*(1-t));var dg=g.createRadialGradient(x+Math.cos(a)*r,y+Math.sin(a)*r*0.5-t*s*0.4,1,x+Math.cos(a)*r,y+Math.sin(a)*r*0.5-t*s*0.4,s*(0.25+t*0.35));dg.addColorStop(0,'rgba('+(col||'200,180,150')+','+al+')');dg.addColorStop(1,'rgba('+(col||'200,180,150')+',0)');g.beginPath();g.arc(x+Math.cos(a)*r,y+Math.sin(a)*r*0.5-t*s*0.4,s*(0.25+t*0.35),0,7);g.fillStyle=dg;g.fill();}}
function scaffold(cu,cv,z,h,t){var c=[[-0.3,-0.28],[0.3,-0.28],[0.3,0.28],[-0.3,0.28]];g.strokeStyle='#B07A3A';g.lineWidth=lw(0.014);
  c.forEach(function(p){var a=iso(cu+p[0],cv+p[1],z),b=iso(cu+p[0],cv+p[1],z+h*t);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();});
  for(var l=1;l<=3;l++){var zz=z+h*t*l/3;g.beginPath();c.concat([c[0]]).forEach(function(p,k){var q=iso(cu+p[0],cv+p[1],zz);if(k)g.lineTo(q.x,q.y);else g.moveTo(q.x,q.y);});g.stroke();}}
function drawTile(i,now){
  var r=RECT[i],zn=ZN[i],t=T[i],col=tileColors(i),off=pressOff(i,now),h0=tileH(i),h=h0+off,st=S.tiles[i];
  box(r.cu,r.cv,r.w-0.06,r.d-0.06,h0,off,col.top,col.side);
  if(zn.band){var bc=t.type==='city'?REGIONS[t.region].color:col.side;flatRect(zn.band[0]+(zn.axis==='u'?0.03:0),zn.band[1]+(zn.axis==='v'?0.03:0),zn.band[2]-0.03,zn.band[3]-0.03,h+0.4,bc);}
  if(S.festival===i){g.save();g.globalAlpha=0.3+0.2*Math.sin(now/200);flatRect(r.u0+0.05,r.v0+0.05,r.u1-0.05,r.v1-0.05,h+0.5,'#FFD23F');g.restore();}
  var fsz=zn.corner?0.22:0.19,nm=tileName(i);
  if(buyable(i)){
    var tag,bg;if(st.owner===null){tag=fmtTag(t.type==='city'?buyCost(i,0):assetPrice(i));bg=t.type==='city'?shade(REGIONS[t.region].color,-0.05):col.side;}else{tag=t.type==='utility'?('Dadu x'+short(UTIL_MUL[countType(st.owner,'utility')])):'Sewa '+short(rentOf(i));bg=S.players[st.owner].color;}
    var du=zn.axis==='u'?0:1,dv=zn.axis==='u'?1:0;
    isoText(nm,zn.lu-du*0.11,zn.lv-dv*0.11,h,zn.axis,fsz,0.9,INK);
    isoText(tag,zn.lu+du*0.15,zn.lv+dv*0.15,h,zn.axis,0.14,0.8,'#fff',{pill:bg});
  } else isoText(nm,zn.lu,zn.lv,h,zn.axis,fsz,zn.corner?1.3:0.9,INK);
  if(!zn.corner&&t.type==='city'&&st.owner===null){g.save();g.setLineDash([lw(0.03),lw(0.03)]);g.strokeStyle='rgba(120,90,50,.35)';g.lineWidth=lw(0.012);path([iso(zn.bu-0.38,zn.bv-0.35,h+0.4),iso(zn.bu+0.38,zn.bv-0.35,h+0.4),iso(zn.bu+0.38,zn.bv+0.35,h+0.4),iso(zn.bu-0.38,zn.bv+0.35,h+0.4)]);g.stroke();g.restore();}
  decoTile(i,h,now);
  // collapse ghosts (bankrupt / sold)
  FX.collapse.forEach(function(c){if(c.i!==i)return;var ct=(now-c.t0)/1300;if(ct<0||ct>1)return;var b=iso(zn.bu,zn.bv,h);g.save();g.translate(b.x+Math.sin(now/30)*TW*0.01*(1-ct),b.y+ct*TH*0.4);g.scale(1,Math.max(0.02,1-ct*1.1));g.translate(-b.x,-b.y);g.globalAlpha=1-ct*0.6;if(T[i].type==='city')building(i,zn.bu,zn.bv,h,c.level,c.color);else wisataGate(zn.bu,zn.bv,h,c.color,zn.axis);g.restore();dust(b.x,b.y,TW*0.3,ct);});
  if(st.owner!==null){
    var own=S.players[st.owner].color,b2=iso(zn.bu,zn.bv,h),tk=FX.take[i],bf=FX.build[i],wob=0,sx=1,sy=1,hide=false;
    if(off<0)wob=Math.sin(now/40)*TW*0.012;
    if(tk){var tt=(now-tk.t0)/TK_DUR;if(tt<0)own=tk.fromColor;if(tt>=0&&tt<1){var psh=(tt>0.4&&tt<0.5)||(tt>0.55&&tt<0.66);if(tt<0.66){own=tk.fromColor;wob=Math.sin(now/25)*TW*0.02*(psh?2.5:0.4);if(psh)sx=0.96;}else if(tt<0.78){hide=true;}else{var pt=(tt-0.78)/0.22;sy=pt<0.6?pt/0.6*1.12:1.12-0.12*(pt-0.6)/0.4;}}}
    if(bf&&!tk){var bt=(now-bf.t0)/900;if(bt>=0&&bt<1){if(bt<0.35){scaffold(zn.bu,zn.bv,h,TH*0.9,bt/0.35);dust(b2.x,b2.y,TW*0.25,bt/0.35);hide=bf.level>0;}else{var pt2=(bt-0.35)/0.65;sy=pt2<0.55?0.3+pt2/0.55*0.82:1.12-0.12*(pt2-0.55)/0.45;sx=1+0.06*Math.sin(pt2*Math.PI);}}}
    if(!hide){g.save();g.translate(b2.x+wob,b2.y);g.scale(sx,sy);g.translate(-b2.x,-b2.y);
      if(t.type==='city')building(i,zn.bu,zn.bv,h,st.level,own); else if(t.type==='wisata')wisataGate(zn.bu,zn.bv,h,own,zn.axis); else {var fq=iso(zn.bu-0.34,zn.bv+0.3,h);tinyFlag(fq.x,fq.y,TH*0.9,own);}
      g.restore();}
    var mk=FX.mangkrak[i];if(mk){var mt=(now-mk)/2600;if(mt>=0&&mt<1){scaffold(zn.bu,zn.bv,h,TH*1.1,1);g.save();g.globalAlpha=Math.min(1,(1-mt)*3);pill(b2.x,b2.y-TH*1.6,'MANGKRAK',TW*0.11,'#6B5A45','#fff');g.restore();}}
  }
  if(balihoOn(i)){var bb=iso(zn.bu+0.34,zn.bv-0.3,h),bh=TH*1.15,bw=TW*0.42;g.strokeStyle='#5A4030';g.lineWidth=lw(0.014);g.beginPath();g.moveTo(bb.x,bb.y);g.lineTo(bb.x,bb.y-bh);g.stroke();baliho(bb.x,bb.y-bh,bw,bh*0.6,isPol()?'PILIH SAYA!':'VIRAL!',isPol()?'#E2483D':'#6E56CF');}
  if(S.festival===i)drawParty(i,h,now);
  if(typeof sealed==='function'&&sealed(i))drawSeal(i,h,now);
  if(off<0||FX.press[i]!=null){var pt3=(now-FX.press[i])/700;if(pt3>=0&&pt3<1){g.save();g.globalAlpha=0.7*(1-pt3);g.strokeStyle=st.owner!==null?S.players[st.owner].color:'#FFFFFF';g.lineWidth=lw(0.025);var rc=iso(r.cu,r.cv,h+1);g.beginPath();g.ellipse(rc.x,rc.y,TW*(0.25+pt3*0.45)*r.w,TH*(0.25+pt3*0.45)*r.d,0,0,7);g.stroke();g.restore();}}
}
function drawParty(i,h,now){
  var zn=ZN[i],st=S.tiles[i],lvl=S.festLevel||2,b=iso(zn.bu,zn.bv,h),pol=isPol();
  var p0=iso(zn.bu-0.42,zn.bv+0.38,h),p1=iso(zn.bu+0.42,zn.bv-0.38,h),poleH=TH*1.3;
  g.strokeStyle='#5A4030';g.lineWidth=lw(0.012);[p0,p1].forEach(function(p){g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x,p.y-poleH);g.stroke();});
  g.strokeStyle='rgba(60,40,20,.6)';g.lineWidth=lw(0.006);g.beginPath();g.moveTo(p0.x,p0.y-poleH);g.quadraticCurveTo((p0.x+p1.x)/2,(p0.y+p1.y)/2-poleH*0.55,p1.x,p1.y-poleH);g.stroke();
  for(var k=0;k<=8;k++){var f=k/8,x=(1-f)*(1-f)*p0.x+2*(1-f)*f*(p0.x+p1.x)/2+f*f*p1.x,y=(1-f)*(1-f)*(p0.y-poleH)+2*(1-f)*f*((p0.y+p1.y)/2-poleH*0.55)+f*f*(p1.y-poleH);
    var on=Math.floor(now/250+k)%2;var cc=pol?['#E2483D','#FFFFFF'][k%2]:['#FF5C7A','#FFD23F','#4CC0F0','#7BD389'][k%4];
    if(pol){g.beginPath();g.moveTo(x-TW*0.025,y);g.lineTo(x+TW*0.025,y);g.lineTo(x,y+TH*0.12);g.closePath();g.fillStyle=cc;g.fill();}
    else{g.save();if(on){g.shadowColor=cc;g.shadowBlur=TW*0.08;}ell(x,y+TH*0.03,TW*0.022,TW*0.026,cc);g.restore();}}
  for(var q=0;q<3+lvl;q++){var ph=((now/1000*(0.5+hash(q,i)*0.4)+hash(i,q))%1),cx=b.x+(hash(q,7)-0.5)*TW*0.7,cy=b.y-TH*1.6+ph*TH*1.7;g.save();g.translate(cx+Math.sin(now/200+q)*TW*0.03,cy);g.rotate(now/150+q);g.fillStyle=['#FF5C7A','#FFD23F','#4CC0F0','#7BD389','#B28DFF'][q%5];g.fillRect(-TW*0.014,-TW*0.007,TW*0.028,TW*0.014);g.restore();}
  for(var m=0;m<Math.min(5,2+lvl);m++){var px=zn.bu-0.28+m*0.14,pv=zn.bv+0.3-m*0.04,pp=iso(px,pv,h),jump=Math.abs(Math.sin(now/180+m*1.3))*TH*0.16,sz=TW*0.09;
    ell(pp.x,pp.y,sz*0.3,sz*0.1,'rgba(30,20,10,.25)');rrect(pp.x-sz*0.18,pp.y-sz*0.75-jump,sz*0.36,sz*0.5,sz*0.12);g.fillStyle=['#E2483D','#2F80ED','#27AE60','#9B51E0','#F2994A'][m];g.fill();
    g.beginPath();g.arc(pp.x,pp.y-sz*0.9-jump,sz*0.16,0,7);g.fillStyle='#F2C49B';g.fill();
    g.strokeStyle='#F2C49B';g.lineWidth=Math.max(1,sz*0.08);g.beginPath();g.moveTo(pp.x-sz*0.16,pp.y-sz*0.65-jump);g.lineTo(pp.x-sz*0.3,pp.y-sz*0.95-jump-Math.sin(now/150+m)*sz*0.1);g.moveTo(pp.x+sz*0.16,pp.y-sz*0.65-jump);g.lineTo(pp.x+sz*0.3,pp.y-sz*0.95-jump+Math.sin(now/150+m)*sz*0.1);g.stroke();
    if(pol&&m%2===0){g.fillStyle='#E2483D';g.fillRect(pp.x+sz*0.3,pp.y-sz*1.25-jump,sz*0.25,sz*0.16);}}
  var fwt=(now/2600)%1;if(fwt<0.5){var ft=fwt/0.5,fc=iso(zn.bu,zn.bv,h+TH*2.4);for(var s2=0;s2<12;s2++){var a=s2/12*Math.PI*2;ell(fc.x+Math.cos(a)*TW*0.32*ft,fc.y+Math.sin(a)*TW*0.32*ft+ft*ft*TH*0.3,TW*0.016*(1-ft),TW*0.016*(1-ft),['#FFD23F','#FF5C7A','#4CC0F0'][s2%3]);}}
  var fp=iso(zn.bu,zn.bv,h+TH*(st.level===3?2.4:st.level>=4?2.2:1.6)+Math.sin(now/250)*3);pill(fp.x,fp.y,(pol?'KAMPANYE x':'PESTA x')+lvl,TW*0.13,'#E2483D','#fff');
}
function fmtTag(n){return 'Rp'+short(n);}

function drawSeal(i,h,now){var zn=ZN[i],a=iso(zn.bu-0.42,zn.bv-0.4,h+TH*0.3),b=iso(zn.bu+0.42,zn.bv+0.4,h+TH*0.3),c=iso(zn.bu+0.42,zn.bv-0.4,h+TH*0.3),d=iso(zn.bu-0.42,zn.bv+0.4,h+TH*0.3);
  [[a,b],[c,d]].forEach(function(l){g.save();g.strokeStyle='#F2C230';g.lineWidth=lw(0.05);g.beginPath();g.moveTo(l[0].x,l[0].y);g.lineTo(l[1].x,l[1].y);g.stroke();g.setLineDash([lw(0.04),lw(0.04)]);g.strokeStyle='#222';g.lineWidth=lw(0.05);g.beginPath();g.moveTo(l[0].x,l[0].y);g.lineTo(l[1].x,l[1].y);g.stroke();g.restore();});
  for(var k=0;k<4;k++){var pp=iso(zn.bu-0.3+k*0.2,zn.bv+0.35,h),j=Math.abs(Math.sin(now/250+k))*TH*0.1;drawMiniPerson(pp.x,pp.y-j,TW*0.22,['#F2C230','#2F80ED','#E2483D','#27AE60'][k],Math.sin(now/200+k),false);rrect(pp.x+TW*0.03,pp.y-TW*0.3-j,TW*0.12,TW*0.07,2);g.fillStyle='#fff';g.fill();}
  var sp=iso(zn.bu,zn.bv,h+TH*1.4);pill(sp.x,sp.y,isPol()?'DISEGEL DEMO':'DITUTUP',TW*0.11,'#222','#F2C230');}
