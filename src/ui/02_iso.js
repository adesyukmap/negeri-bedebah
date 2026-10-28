/* ---------- iso primitives (u,v = board units, z = px) ---------- */
function iso(u,v,z){return {x:OX+(u-v)*TW/2, y:OY+(u+v)*TH/2-(z||0)};}
function path(pts){g.beginPath();g.moveTo(pts[0].x,pts[0].y);for(var i=1;i<pts.length;i++)g.lineTo(pts[i].x,pts[i].y);g.closePath();}
function fillGrad(pts,c1,c2){var y0=1e9,y1=-1e9;pts.forEach(function(p){y0=Math.min(y0,p.y);y1=Math.max(y1,p.y);});var gr=g.createLinearGradient(0,y0,0,y1+0.01);gr.addColorStop(0,c1);gr.addColorStop(1,c2);path(pts);g.fillStyle=gr;g.fill();}
function lw(f){return Math.max(1,TW*f);}
function box(cu,cv,w,d,h,z0,top,side,noOutline){
  side=side||top; var z1=z0+h,a=-w/2,b=w/2,c=-d/2,e=d/2;
  var Q=function(x,y,z){return iso(cu+x,cv+y,z);};
  var Lf=[Q(a,e,z0),Q(b,e,z0),Q(b,e,z1),Q(a,e,z1)], Rf=[Q(b,e,z0),Q(b,c,z0),Q(b,c,z1),Q(b,e,z1)], Tp=[Q(a,c,z1),Q(b,c,z1),Q(b,e,z1),Q(a,e,z1)];
  g.lineJoin='round';
  if(h>0.3){fillGrad(Lf,shade(side,-0.06),shade(side,-0.22)); fillGrad(Rf,shade(side,-0.30),shade(side,-0.44));}
  fillGrad(Tp,shade(top,0.16),shade(top,-0.03));
  g.strokeStyle='rgba(255,255,255,.72)'; g.lineWidth=lw(0.014);
  g.beginPath();g.moveTo(Tp[3].x,Tp[3].y);g.lineTo(Tp[2].x,Tp[2].y);g.lineTo(Tp[1].x,Tp[1].y);g.stroke();
  if(!noOutline){g.strokeStyle='rgba(60,38,24,.5)'; g.lineWidth=lw(0.01); path([Tp[0],Tp[1],Rf[1],Rf[0],Lf[0],Tp[3]]); g.stroke();}
  return {top:Tp,left:Lf,right:Rf};
}
function pyramid(cu,cv,w,d,h,z0,col){
  var a=-w/2,b=w/2,c=-d/2,e=d/2,Q=function(x,y){return iso(cu+x,cv+y,z0);},A=iso(cu,cv,z0+h);
  [[[Q(a,c),Q(b,c),A],0.04],[[Q(a,e),Q(a,c),A],0.2],[[Q(a,e),Q(b,e),A],-0.06],[[Q(b,e),Q(b,c),A],-0.28]].forEach(function(f){path(f[0]);g.fillStyle=shade(col,f[1]);g.fill();});
  g.strokeStyle='rgba(60,38,24,.5)'; g.lineWidth=lw(0.01);
  g.beginPath();g.moveTo(Q(a,e).x,Q(a,e).y);g.lineTo(Q(b,e).x,Q(b,e).y);g.lineTo(Q(b,c).x,Q(b,c).y);g.moveTo(Q(a,e).x,Q(a,e).y);g.lineTo(A.x,A.y);g.lineTo(Q(b,c).x,Q(b,c).y);g.moveTo(Q(b,e).x,Q(b,e).y);g.lineTo(A.x,A.y);g.stroke();
  g.strokeStyle='rgba(255,255,255,.45)';g.beginPath();g.moveTo(Q(a,e).x,Q(a,e).y);g.lineTo(Q(b,e).x,Q(b,e).y);g.stroke();
  return A;
}
function ell(x,y,rx,ry,fill){g.beginPath();g.ellipse(x,y,Math.max(0.1,rx),Math.max(0.1,ry),0,0,Math.PI*2);g.fillStyle=fill;g.fill();}
function rrect(x,y,w,h,r){r=Math.max(0,Math.min(r,Math.abs(w)/2,Math.abs(h)/2));g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function flatRect(u0,v0,u1,v1,z,fill){path([iso(u0,v0,z),iso(u1,v0,z),iso(u1,v1,z),iso(u0,v1,z)]);g.fillStyle=fill;g.fill();}
function aoShadow(cu,cv,w,d,z){flatRect(cu-w*0.5+0.04,cv-d*0.5+0.04,cu+w*0.62+0.04,cv+d*0.62+0.04,z,'rgba(50,30,15,.2)');}
function faceQuad(cu,cv,face,w,d,u0,u1,z0,z1){ // face 'L' = +v side, 'R' = +u side; u0,u1 fractions along the face
  if(face==='L'){var a=-w/2+w*u0,b=-w/2+w*u1;return [iso(cu+a,cv+d/2,z0),iso(cu+b,cv+d/2,z0),iso(cu+b,cv+d/2,z1),iso(cu+a,cv+d/2,z1)];}
  var c=d/2-d*u0,e=d/2-d*u1;return [iso(cu+w/2,cv+c,z0),iso(cu+w/2,cv+e,z0),iso(cu+w/2,cv+e,z1),iso(cu+w/2,cv+c,z1)];
}
function windows(cu,cv,w,d,z0,h,rows,cols,col){
  g.fillStyle=NIGHT>0.3?'rgba(255,214,110,'+(0.55+0.45*NIGHT)+')':col;
  for(var r=0;r<rows;r++){var za=z0+h*(r+0.28)/rows,zb=z0+h*(r+0.72)/rows;
    for(var k=0;k<cols;k++){var f0=(k+0.25)/cols,f1=(k+0.75)/cols;path(faceQuad(cu,cv,'L',w,d,f0,f1,za,zb));g.fill();path(faceQuad(cu,cv,'R',w,d,f0,f1,za,zb));g.fill();}}
}
/* text printed flat on a tile surface. axis 'u': reads along +u; axis 'v': reads along -v. "down" always points to the tile's near edge */
function isoBasis(axis){return axis==='u'?[[TW/2,TH/2],[-TW/2,TH/2]]:[[TW/2,-TH/2],[TW/2,TH/2]];}
function isoText(text,cu,cv,z,axis,fu,maxW,color,opts){
  opts=opts||{}; var o=iso(cu,cv,z),B=isoBasis(axis),k=fu/100,weight=opts.weight||900,fam=opts.family||'Nunito, sans-serif';
  g.font=weight+' 100px '+fam; var w=g.measureText(text).width;
  if(w*k>maxW)k=maxW/w;
  g.save(); g.setTransform(GD*B[0][0]*k,GD*B[0][1]*k,GD*B[1][0]*k,GD*B[1][1]*k,GD*o.x,GD*o.y);
  if(opts.pill){var pw=w+70,ph=128;rrect(-pw/2,-ph/2+10,pw,ph,ph/2);g.fillStyle='rgba(40,25,10,.25)';g.fill();rrect(-pw/2,-ph/2,pw,ph,ph/2);g.fillStyle=opts.pill;g.fill();}
  g.textAlign='center';g.textBaseline='middle';
  if(opts.stroke){g.lineWidth=opts.strokeW||14;g.strokeStyle=opts.stroke;g.lineJoin='round';g.strokeText(text,0,4);}
  g.fillStyle=color;g.fillText(text,0,4); g.restore();
}
function pill(x,y,text,size,bg,fg){
  g.font='900 '+size+'px Nunito, sans-serif'; var w=g.measureText(text).width+size*0.9, h=size*1.45;
  rrect(x-w/2,y-h/2+size*0.14,w,h,h/2); g.fillStyle='rgba(0,0,0,.18)'; g.fill();
  rrect(x-w/2,y-h/2,w,h,h/2); g.fillStyle=bg; g.fill();
  g.fillStyle=fg; g.textAlign='center'; g.textBaseline='middle'; g.fillText(text,x,y+size*0.05);
}

/*@@CHARS@@*/

