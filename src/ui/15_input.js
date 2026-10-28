/* ---------- input: tap, pan, pinch, double-tap ---------- */
function hitTile(x,y){
  var order=[];for(var i=0;i<NT;i++)order.push(i);order.sort(function(a,b){return (RECT[b].cu+RECT[b].cv)-(RECT[a].cu+RECT[a].cv);});
  for(var k=0;k<order.length;k++){var i2=order[k],r=RECT[i2],h=tileH(i2),xp=(x-OX)/(TW/2),yp=(y+h-OY)/(TH/2),u=(xp+yp)/2,v=(yp-xp)/2;if(u>=r.u0&&u<=r.u1&&v>=r.v0&&v<=r.v1)return i2;}
  return -1;}
var PTR={},gest=null,lastTap=0,tapTimer=null;
function ptrList(){return Object.keys(PTR).map(function(k){return PTR[k];});}
function clampCam(){var lim=CW*cam.z*0.65,limy=CH_*cam.z*0.65;cam.px=Math.max(-lim,Math.min(lim,cam.px));cam.py=Math.max(-limy,Math.min(limy,cam.py));cam.z=Math.max(0.85,Math.min(3.2,cam.z));}
function bindBoard(){
  cv.addEventListener('pointerdown',function(e){audioUnlock();if(CONVOY)CONVOY.fast=true;cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);PTR[e.pointerId]={x:e.clientX,y:e.clientY,x0:e.clientX,y0:e.clientY};
    var l=ptrList();
    if(l.length===2){var a=l[0],b=l[1],mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};gest={type:'pinch',d0:Math.hypot(a.x-b.x,a.y-b.y)||1,z0:cam.z,mid0:mid,px0:cam.px,py0:cam.py,moved:true};}
    else if(l.length===1){gest={type:'one',px0:cam.px,py0:cam.py,moved:false};}});
  cv.addEventListener('pointermove',function(e){var p=PTR[e.pointerId];if(!p||!gest)return;p.x=e.clientX;p.y=e.clientY;var l=ptrList(),r=cv.getBoundingClientRect();
    if(gest.type==='pinch'&&l.length>=2){var a=l[0],b=l[1],d=Math.hypot(a.x-b.x,a.y-b.y),mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2},z=Math.max(0.85,Math.min(3.2,gest.z0*d/gest.d0));
      var C={x:CW/2,y:CH_/2},m0={x:gest.mid0.x-r.left,y:gest.mid0.y-r.top},m1={x:mid.x-r.left,y:mid.y-r.top};
      var w={x:C.x+(m0.x-C.x-gest.px0)/gest.z0,y:C.y+(m0.y-C.y-gest.py0)/gest.z0};
      cam.z=z;cam.px=m1.x-C.x-(w.x-C.x)*z;cam.py=m1.y-C.y-(w.y-C.y)*z;setCamMode('free');clampCam();}
    else if(gest.type==='one'&&l.length===1){var dx=p.x-p.x0,dy=p.y-p.y0;if(Math.hypot(dx,dy)>12){gest.moved=true;cam.px=gest.px0+dx;cam.py=gest.py0+dy;setCamMode('free');clampCam();}}});
  var end=function(e){var p=PTR[e.pointerId];delete PTR[e.pointerId];if(!gest)return;
    if(gest.type==='one'&&!gest.moved&&p&&ptrList().length===0){var r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,now=performance.now();
      if(now-lastTap<320){clearTimeout(tapTimer);lastTap=0;setCamMode(cam.mode==='all'?'follow':'all');return;}
      lastTap=now;tapTimer=setTimeout(function(){tapAt(x,y);},260);}
    if(ptrList().length===0)gest=null;else if(gest.type==='pinch')gest={type:'one',px0:cam.px,py0:cam.py,moved:true};};
  cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
  cv.addEventListener('wheel',function(e){e.preventDefault();var r=cv.getBoundingClientRect(),m={x:e.clientX-r.left,y:e.clientY-r.top},C={x:CW/2,y:CH_/2},z0=cam.z,z=Math.max(0.85,Math.min(3.2,z0*Math.exp(-e.deltaY*0.0015)));
    var w={x:C.x+(m.x-C.x-cam.px)/z0,y:C.y+(m.y-C.y-cam.py)/z0};cam.z=z;cam.px=m.x-C.x-(w.x-C.x)*z;cam.py=m.y-C.y-(w.y-C.y)*z;setCamMode('free');clampCam();},{passive:false});
}
function tapAt(x,y){if(!S)return;var i=hitTile(x,y);if(i<0)return;var p=cur();if(S.phase==='turn'&&p.pelni){if(i!==p.pos){play('tap');pelniTo(i);refresh();}return;}play('tap');openDetail(i);}
