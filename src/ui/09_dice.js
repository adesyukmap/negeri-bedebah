/* ---------- dice: rounded 3D dice + bamboo shaker cup ---------- */
function rotAxis(ax,a){var x=ax[0],y=ax[1],z=ax[2],c=Math.cos(a),s=Math.sin(a),t=1-c;return [[t*x*x+c,t*x*y-s*z,t*x*z+s*y],[t*x*y+s*z,t*y*y+c,t*y*z-s*x],[t*x*z-s*y,t*y*z+s*x,t*z*z+c]];}
function mm(a,b){var r=[[0,0,0],[0,0,0],[0,0,0]];for(var i=0;i<3;i++)for(var j=0;j<3;j++)for(var k=0;k<3;k++)r[i][j]+=a[i][k]*b[k][j];return r;}
function mv(m,v){return [m[0][0]*v[0]+m[0][1]*v[1]+m[0][2]*v[2],m[1][0]*v[0]+m[1][1]*v[1]+m[1][2]*v[2],m[2][0]*v[0]+m[2][1]*v[1]+m[2][2]*v[2]];}
var HP=Math.PI/2,BASE={1:rotAxis([1,0,0],0),6:rotAxis([1,0,0],Math.PI),2:rotAxis([0,1,0],-HP),5:rotAxis([0,1,0],HP),3:rotAxis([1,0,0],HP),4:rotAxis([1,0,0],-HP)};
var FACES=[{n:[0,0,1],a:[1,0,0],b:[0,1,0],v:1},{n:[0,0,-1],a:[1,0,0],b:[0,1,0],v:6},{n:[1,0,0],a:[0,1,0],b:[0,0,1],v:2},{n:[-1,0,0],a:[0,1,0],b:[0,0,1],v:5},{n:[0,1,0],a:[1,0,0],b:[0,0,1],v:3},{n:[0,-1,0],a:[1,0,0],b:[0,0,1],v:4}];
var PIPS={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[-1,0],[-1,1],[1,-1],[1,0],[1,1]]};
function nrm(v){var l=Math.hypot(v[0],v[1],v[2])||1;return [v[0]/l,v[1]/l,v[2]/l];}
var VIEW=nrm([1,1,0.82]),LIGHT=nrm([-0.35,0.15,1]);
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
function finalRot(val,yaw){return mm(rotAxis([0,0,1],yaw),BASE[val]);}
function roundPoly(pts,f){var n=pts.length;g.beginPath();for(var i=0;i<n;i++){var p=pts[i],a=pts[(i+n-1)%n],b=pts[(i+1)%n],p1={x:p.x+(a.x-p.x)*f,y:p.y+(a.y-p.y)*f},p2={x:p.x+(b.x-p.x)*f,y:p.y+(b.y-p.y)*f};if(i===0)g.moveTo(p1.x,p1.y);else g.lineTo(p1.x,p1.y);g.quadraticCurveTo(p.x,p.y,p2.x,p2.y);}g.closePath();}
function drawDie3(cu,cv,cz,R,hs,alpha){
  var P=function(l){var w=mv(R,l);return iso(cu+w[0],cv+w[1],(cz+w[2])*ZS);};
  var sh=iso(cu,cv,0),hf=Math.max(0,1-cz/3);ell(sh.x+TW*0.04,sh.y+TH*0.03,TW*0.32*(0.5+hf*0.5),TH*0.3*(0.5+hf*0.5),'rgba(40,40,60,'+(0.25*hf+0.08)+')');
  if(alpha!=null){g.save();g.globalAlpha=alpha;}
  var vis=FACES.map(function(f){return {f:f,nw:mv(R,f.n)};}).filter(function(o){return dot(o.nw,VIEW)>0.001;}).sort(function(a,b){return dot(a.nw,VIEW)-dot(b.nw,VIEW);});
  var quads=vis.map(function(o){var f=o.f,n=f.n,a=f.a,b=f.b;return [[-1,-1],[1,-1],[1,1],[-1,1]].map(function(c){return P([n[0]*hs+a[0]*c[0]*hs+b[0]*c[1]*hs,n[1]*hs+a[1]*c[0]*hs+b[1]*c[1]*hs,n[2]*hs+a[2]*c[0]*hs+b[2]*c[1]*hs]);});});
  g.lineJoin='round';var edgeW=Math.max(3,hs*TW*0.5);
  // rounded silhouette: fat round-joined stroke, slightly darker = soft bevel edge
  quads.forEach(function(q,k){var br=0.955+0.045*Math.max(0,dot(vis[k].nw,LIGHT));path(q);var c='rgb('+Math.round(253*br)+','+Math.round(253*br)+','+Math.round(255*br)+')';g.fillStyle=c;g.fill();g.strokeStyle=c;g.lineWidth=edgeW;g.stroke();});
  quads.forEach(function(q,k){var o=vis[k],f=o.f,n=f.n,a=f.a,b=f.b,lt=Math.max(0,dot(o.nw,LIGHT)),br=0.96+0.04*lt;
    var cx=(q[0].x+q[2].x)/2,cy=(q[0].y+q[2].y)/2,ins=q.map(function(p){return {x:cx+(p.x-cx)*0.95,y:cy+(p.y-cy)*0.95};});
    roundPoly(ins,0.42);var gr=g.createLinearGradient(ins[0].x,ins[0].y,ins[2].x,ins[2].y),hi=1;
    gr.addColorStop(0,'rgb('+Math.round(255*hi)+','+Math.round(255*hi)+','+Math.round(255*hi)+')');gr.addColorStop(1,'rgb('+Math.round(250*br)+','+Math.round(250*br)+','+Math.round(253*br)+')');g.fillStyle=gr;g.fill();
    var vis2=dot(o.nw,VIEW);
    PIPS[f.v].forEach(function(pp){var one=f.v===1,pr=(one?0.36:0.235)*hs,sp=f.v===6?0.52:0.5,cen=[n[0]*hs*1.002+(a[0]*pp[0]+b[0]*pp[1])*hs*sp,n[1]*hs*1.002+(a[1]*pp[0]+b[1]*pp[1])*hs*sp,n[2]*hs*1.002+(a[2]*pp[0]+b[2]*pp[1])*hs*sp],ring=[];
      for(var k2=0;k2<18;k2++){var th=k2/18*Math.PI*2,cs=Math.cos(th)*pr,sn=Math.sin(th)*pr;ring.push(P([cen[0]+a[0]*cs+b[0]*sn,cen[1]+a[1]*cs+b[1]*sn,cen[2]+a[2]*cs+b[2]*sn]));}
      var mx=0,my=0;ring.forEach(function(r){mx+=r.x;my+=r.y;});mx/=ring.length;my/=ring.length;
      path(ring);var pg2=g.createRadialGradient(mx-pr*TW*0.15,my-pr*TW*0.15,0,mx,my,pr*TW*0.75);
      if(one){pg2.addColorStop(0,'#7A0E10');pg2.addColorStop(1,'#D8262A');}else{pg2.addColorStop(0,'#000');pg2.addColorStop(1,'#2A2A30');}
      g.fillStyle=pg2;g.fill();
      if(vis2>0.3){g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=Math.max(0.8,TW*0.006);g.beginPath();g.moveTo(ring[2].x,ring[2].y);g.lineTo(ring[5].x,ring[5].y);g.stroke();}});
    // glossy specular streak on faces facing the light
    if(lt>0.55){g.save();roundPoly(ins,0.42);g.clip();var hx=ins[0].x+(ins[1].x-ins[0].x)*0.3+(ins[3].x-ins[0].x)*0.22,hy=ins[0].y+(ins[1].y-ins[0].y)*0.3+(ins[3].y-ins[0].y)*0.22;
      var rr=Math.hypot(ins[2].x-ins[0].x,ins[2].y-ins[0].y)*0.28;var sg=g.createRadialGradient(hx,hy,0,hx,hy,rr);sg.addColorStop(0,'rgba(255,255,255,'+(0.75*(lt-0.55)/0.45)+')');sg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=sg;g.fillRect(hx-rr,hy-rr,rr*2,rr*2);g.restore();}
  });
  if(alpha!=null)g.restore();
}
var DICE_POS=[[MID-0.93,MID+1.53],[MID+1.53,MID-0.93]],diceRoll=null,DICE_DUR=1100,restR=[finalRot(3,0.12),finalRot(4,-0.1)];
var cup={phase:'idle',t0:0,power:0,auto:0,rel:0,npc:null},CUP_PERIOD=2400;
/* hold-to-shake power ping-pongs 0 -> 1 -> 0 (period CUP_PERIOD), so holding too long drops back to low power */
function cupTri(el){var f=(el%CUP_PERIOD)/(CUP_PERIOD/2);return f<=1?f:2-f;}
function cupRising(now){return ((now-cup.t0)%CUP_PERIOD)<CUP_PERIOD/2;}
function cupPower(now){if(cup.phase!=='shake')return cup.power;var el=now-cup.t0;if(cup.npc){var f=Math.min(1,el/cup.npc.dur),e=f*f*(3-2*f);return cup.npc.power*e;}return cupTri(el);}
function cupStart(){var now=performance.now();if(!S||S.phase!=='turn'||cup.phase!=='idle'||cup.npc||cur().pelni)return;audioUnlock();cup.phase='shake';cup.t0=now;cup.auto=0;cup.lastRattle=0;refresh();}
function cupRelease(){var now=performance.now();if(cup.phase!=='shake'||cup.npc)return;var held=now-cup.t0;if(held<380){cup.auto=cup.t0+850;return;}doRelease(now);}
function doRelease(now){if(isPol())play('mafia');cup.power=cup.npc?cup.npc.power:cupPower(now);cup.npc=null;cup.phase='slam';cup.rel=now;roll(cup.power);refresh();}
/* NPC: shake ~0.9-1.4 s (Mafia shaker in Politik, cup in Santai), then release with exactly this power */
function npcRoll(power){var now=performance.now();if(!S||S.phase!=='turn'||cup.phase!=='idle'||cup.npc)return false;power=power==null||isNaN(power)?0.5:Math.max(0,Math.min(1,+power));
  cup.npc={power:power,dur:900+Math.random()*500};cup.phase='shake';cup.t0=now;cup.auto=0;cup.lastRattle=0;refresh();return true;}
function startDiceRoll(now){var vals=S.dice,pw=cup.power||0.4;diceRoll={t0:now,power:pw,dice:vals.map(function(v,k){var ax=nrm([Math.random()-0.5,Math.random()-0.5,Math.random()-0.5]);return {val:v,axis:ax,R:finalRot(v,(Math.random()-0.5)*0.6)};}),dbl:vals[0]===vals[1],sum:vals[0]+vals[1]};
  if(isPol()){diceRoll.pol=true;var F=MAF.fist||{x:CW/2,y:CH_*0.3};diceRoll.from=screenToWorld(F.x,F.y+TH*0.3,2*MID-2.5);}if(cup.phase!=='slam'){cup.phase='slam';cup.rel=now;cup.power=pw;}}
function drawCup(x,y,s,tilt,alpha){g.save();g.globalAlpha=alpha==null?1:alpha;g.translate(x,y);g.rotate(tilt);
  var w=s*0.62,h=s*1.05,wt=w*0.82;ell(0,s*0.02,w*1.05,w*0.3,'rgba(40,25,10,.25)');
  g.beginPath();g.moveTo(-w,0);g.lineTo(-wt,-h);g.ellipse(0,-h,wt,wt*0.32,0,Math.PI,0,false);g.lineTo(w,0);g.ellipse(0,0,w,w*0.32,0,0,Math.PI,false);g.closePath();
  var bg=g.createLinearGradient(-w,0,w,0);bg.addColorStop(0,'#E9D58A');bg.addColorStop(0.35,'#C9A94E');bg.addColorStop(0.75,'#8F7A2E');bg.addColorStop(1,'#6E5A1E');g.fillStyle=bg;g.fill();g.strokeStyle='#5A4818';g.lineWidth=Math.max(1,s*0.03);g.stroke();
  [0.3,0.68].forEach(function(f){var yy=-h*f,ww=w-(w-wt)*f;g.beginPath();g.ellipse(0,yy,ww,ww*0.32,0,0,Math.PI);g.strokeStyle='#7A6420';g.lineWidth=Math.max(1,s*0.045);g.stroke();g.beginPath();g.ellipse(0,yy-s*0.02,ww,ww*0.32,0,0.1*Math.PI,0.9*Math.PI);g.strokeStyle='rgba(255,240,180,.5)';g.lineWidth=Math.max(1,s*0.015);g.stroke();});
  g.beginPath();g.ellipse(0,-h,wt,wt*0.32,0,0,7);g.fillStyle=radialFill(0,-h,wt,'#F3E3A6','#B89A42');g.fill();g.strokeStyle='#5A4818';g.lineWidth=Math.max(1,s*0.025);g.stroke();
  g.beginPath();g.moveTo(-w*0.55,-h*0.15);g.lineTo(-wt*0.6,-h*0.9);g.strokeStyle='rgba(255,250,220,.55)';g.lineWidth=Math.max(1,s*0.05);g.stroke();
  g.restore();}
function drawDice(now){
  var hs=0.27,c=iso(MID,MID,0),s=TW*0.62;
  if(cup.phase==='shake'&&((cup.auto&&now>=cup.auto)||(cup.npc&&now-cup.t0>=cup.npc.dur)))doRelease(now);
  if(cup.phase==='shake'){var pw=cupPower(now),amp=0.25+pw*0.95,jx=Math.sin(now/38)*TW*0.06*amp+Math.sin(now/23)*TW*0.03*amp,jy=Math.cos(now/31)*TH*0.08*amp,tilt=Math.sin(now/45)*0.22*amp;
    if(now-(cup.lastRattle||0)>Math.max(55,140-pw*80)){cup.lastRattle=now;play('rattle',pw);}
    if(!isPol())drawCup(c.x+jx,c.y-TH*(0.9+pw*0.4)+jy,s,tilt);
    powerMeter(now,pw);
    return;}
  if(diceRoll&&diceRoll.pol){drawPolRoll(now,hs);return;}
  if(diceRoll){var el=now-diceRoll.t0,pw2=diceRoll.power,slamT=170,holdT=260,liftT=520;
    var reveal=el>slamT+holdT,lt=Math.max(0,Math.min(1,(el-slamT-holdT)/liftT));
    if(reveal){var wt=Math.max(0,1-lt*1.3);diceRoll.dice.forEach(function(d,k){var R=mm(d.R,rotAxis(d.axis,(0.25+pw2*0.5)*Math.sin(lt*Math.PI*3)*wt));drawDie3(DICE_POS[k][0],DICE_POS[k][1],hs+Math.abs(Math.sin(lt*Math.PI*2))*0.12*wt*pw2,R,hs);if(lt>=1)restR[k]=d.R;});}
    if(el<slamT){var f=el/slamT;drawCup(c.x,c.y-TH*(0.9+pw2*0.4)*(1-f*f),s,0);}
    else if(!reveal){if(!diceRoll.thud){diceRoll.thud=true;play('slam',pw2);FX.shake={t0:now,amt:TW*0.02*(0.4+pw2)};}drawCup(c.x,c.y,s,0);dust(c.x,c.y,TW*0.5,(el-slamT)/holdT,'230,215,180');}
    else if(lt<1){drawCup(c.x+lt*TW*0.9,c.y-lt*TH*2.4,s,lt*0.5,1-lt);}
    var bt=(el-DICE_DUR)/1500;
    if(bt>=0&&bt<1){var cc=iso(MID,MID,ZS*1.2),sc=bt<0.15?bt/0.15:1;g.save();g.globalAlpha=bt>0.8?(1-bt)/0.2:1;pill(cc.x,cc.y-TH*0.7*sc,diceRoll.dbl?('DOUBLE! '+diceRoll.sum):String(diceRoll.sum),TW*0.2*(0.7+sc*0.3),diceRoll.dbl?'#E2483D':'#4A3426','#fff');g.restore();}
    if(bt>=1){diceRoll=null;cup.phase='idle';}
    return;}
  if(cup.phase==='slam'&&now-cup.rel>2500)cup.phase='idle';
  DICE_POS.forEach(function(p,k){drawDie3(p[0],p[1],hs,restR[k],hs);});
  if(!isPol()){var cs=iso(MID+0.3,MID-1.55,0);drawCup(cs.x,cs.y,s*0.7,0.1);}
}
/* power bar under the island centre: three zones, moving marker, direction arrow */
function powerMeter(now,pw){var m=iso(MID,MID,0),bw=TW*1.5,bh=Math.max(8,TH*0.2),x0=m.x-bw/2,y0=m.y+TH*1.35,zc=pw>0.67?'#E2483D':pw>0.34?'#F2B705':'#2E9E5B',lab=pw>0.67?'Besar':pw>0.34?'Sedang':'Kecil';
  g.save();rrect(x0-bh*0.35,y0-bh*0.35,bw+bh*0.7,bh*1.7,bh*0.85);g.fillStyle='rgba(30,20,10,.45)';g.fill();
  ['#2E9E5B','#F2B705','#E2483D'].forEach(function(c,k){g.save();rrect(x0,y0,bw,bh,bh/2);g.clip();g.globalAlpha=0.32;g.fillStyle=c;g.fillRect(x0+bw*k/3,y0,bw/3,bh);g.restore();});
  g.save();rrect(x0,y0,bw,bh,bh/2);g.clip();var fg=g.createLinearGradient(x0,0,x0+bw,0);fg.addColorStop(0,'#2E9E5B');fg.addColorStop(0.5,'#F2B705');fg.addColorStop(1,'#E2483D');g.fillStyle=fg;g.fillRect(x0,y0,bw*pw,bh);g.restore();
  g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=Math.max(1,bh*0.12);[1,2].forEach(function(k){g.beginPath();g.moveTo(x0+bw*k/3,y0+bh*0.15);g.lineTo(x0+bw*k/3,y0+bh*0.85);g.stroke();});
  var mx=x0+bw*pw;ell(mx,y0+bh/2,bh*0.75,bh*0.75,'#fff');ell(mx,y0+bh/2,bh*0.5,bh*0.5,zc);
  if(!cup.npc){var up=cupRising(now);g.fillStyle='#fff';g.beginPath();if(up){g.moveTo(mx+bh*1.1,y0+bh*0.5-bh*0.45);g.lineTo(mx+bh*1.6,y0+bh*0.5);g.lineTo(mx+bh*1.1,y0+bh*0.5+bh*0.45);}else{g.moveTo(mx-bh*1.1,y0+bh*0.5-bh*0.45);g.lineTo(mx-bh*1.6,y0+bh*0.5);g.lineTo(mx-bh*1.1,y0+bh*0.5+bh*0.45);}g.closePath();g.fill();}
  g.restore();
  var fs=Math.max(11,TW*0.11);pill(m.x,y0+bh+fs*1.2,lab,fs,zc,'#fff');
  if(!cup.npc&&now-cup.t0>CUP_PERIOD*0.55){g.save();g.globalAlpha=0.85;pill(m.x,y0+bh+fs*2.8,'lepas pas di zona yang kamu mau',Math.max(9,fs*0.62),'rgba(255,248,236,.95)',INK);g.restore();}}

function drawPolRoll(now,hs){var el=now-diceRoll.t0,pw=diceRoll.power,FL=560,fr=diceRoll.from;
  diceRoll.dice.forEach(function(d,k){var tu=DICE_POS[k][0],tv=DICE_POS[k][1];
    if(el<FL){var f=el/FL,e=f*f*(3-2*f),u=fr.u+(tu-fr.u)*e+(k?0.25:-0.25)*Math.sin(f*Math.PI),v=fr.v+(tv-fr.v)*e,cz=fr.cz+(hs-fr.cz)*f+Math.sin(f*Math.PI)*1.1;
      drawDie3(u,v,cz,mm(d.R,rotAxis(d.axis,(1-f)*(9+pw*6))),hs);}
    else{var lt=Math.min(1,(el-FL)/(DICE_DUR-FL+200)),wt=Math.max(0,1-lt*1.3);drawDie3(tu,tv,hs+Math.abs(Math.sin(lt*Math.PI*2))*0.14*wt*(0.5+pw),mm(d.R,rotAxis(d.axis,(0.3+pw*0.5)*Math.sin(lt*Math.PI*3)*wt)),hs);if(lt>=1)restR[k]=d.R;}});
  if(el>=FL&&!diceRoll.thud){diceRoll.thud=true;play('slam',pw);FX.shake={t0:now,amt:TW*0.02*(0.4+pw)};var c=iso(MID,MID,0);diceRoll.dustAt=now;}
  if(diceRoll.dustAt&&now-diceRoll.dustAt<400){var c2=iso(MID,MID,0);dust(c2.x,c2.y,TW*0.5,(now-diceRoll.dustAt)/400,'230,215,180');}
  var bt=(el-DICE_DUR)/1500;
  if(bt>=0&&bt<1){var cc=iso(MID,MID,ZS*1.2),sc=bt<0.15?bt/0.15:1;g.save();g.globalAlpha=bt>0.8?(1-bt)/0.2:1;pill(cc.x,cc.y-TH*0.7*sc,diceRoll.dbl?('DOUBLE! '+diceRoll.sum):String(diceRoll.sum),TW*0.2*(0.7+sc*0.3),diceRoll.dbl?'#E2483D':'#4A3426','#fff');g.restore();}
  if(bt>=1){diceRoll=null;cup.phase='idle';}}
