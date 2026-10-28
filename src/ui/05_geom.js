/* ---------- board geometry ---------- */
function mkRect(u0,u1,v0,v1,side){return {u0:u0,u1:u1,v0:v0,v1:v1,side:side,cu:(u0+u1)/2,cv:(v0+v1)/2,w:u1-u0,d:v1-v0};}
var BN=12,MID=6,E1=BN-1.5;
var RECT=[];(function(){for(var i=0;i<NT;i++){var k;
  if(i===0)RECT[i]=mkRect(E1,BN,E1,BN,'c');else if(i<10)RECT[i]=mkRect(E1-i,E1+1-i,E1,BN,1);
  else if(i===10)RECT[i]=mkRect(0,1.5,E1,BN,'c');else if(i<20){k=i-10;RECT[i]=mkRect(0,1.5,E1-k,E1+1-k,2);}
  else if(i===20)RECT[i]=mkRect(0,1.5,0,1.5,'c');else if(i<30){k=i-21;RECT[i]=mkRect(1.5+k,2.5+k,0,1.5,3);}
  else if(i===30)RECT[i]=mkRect(E1,BN,0,1.5,'c');else{k=i-31;RECT[i]=mkRect(E1,BN,1.5+k,2.5+k,4);}}})();
function zones(i){var r=RECT[i];
  switch(r.side){
    case 1: return {axis:'u',lu:r.cu,lv:BN-0.3,bu:r.cu,bv:BN-1.03,tu:r.cu,tv:BN-0.6,band:[r.u0,BN-0.17,r.u1,BN]};
    case 4: return {axis:'v',lu:BN-0.3,lv:r.cv,bu:BN-1.03,bv:r.cv,tu:BN-0.6,tv:r.cv,band:[BN-0.17,r.v0,BN,r.v1]};
    case 2: return {axis:'v',lu:1.2,lv:r.cv,bu:0.47,bv:r.cv,tu:0.93,tv:r.cv,band:[1.33,r.v0,1.5,r.v1]};
    case 3: return {axis:'u',lu:r.cu,lv:1.2,bu:r.cu,bv:0.47,tu:r.cu,tv:0.93,band:[r.u0,1.33,r.u1,1.5]};
  }
  var ax=(i===30)?'v':'u',lu=ax==='u'?r.cu:r.u1-0.24,lv=ax==='u'?r.v1-0.24:r.cv;
  return {axis:ax,lu:lu,lv:lv,bu:r.cu-0.12,bv:r.cv-0.12,tu:r.cu+0.14,tv:r.cv+0.14,corner:true};
}
var ZN=[];for(var zi=0;zi<NT;zi++)ZN[zi]=zones(zi);
function tileH(i){return RECT[i].side==='c'?DZ*1.3:DZ;}
function isPol(){return S&&S.theme==='politik';}
function regionCol(i){var t=T[i];return (t&&t.region!=null&&REGIONS[t.region])?REGIONS[t.region].color:'#888888';}
/* city tiles carry their region colour on the whole tile (pale top, saturated side + band) so a region reads as one group */
function tileColors(i){
  var t=T[i],st=S?S.tiles[i]:{owner:null,level:-1},own=st.owner!==null?S.players[st.owner].color:null,pol=isPol(),ty=t.type;
  if(ty==='city'){var rc=regionCol(i);return {top:own?mix(own,'#FFF6E4',0.7):mix(rc,'#FFFFFF',pol?0.68:0.62),side:shade(rc,-0.08),region:rc};}
  if(t.deco==='pln')return {top:own?mix(own,'#FFF6E4',0.72):(pol?'#F6EBC2':'#FFF3C4'),side:'#B98A00'};
  if(t.deco==='pdam')return {top:own?mix(own,'#FFF6E4',0.72):(pol?'#D6E6F6':'#DCEBFF'),side:'#2C6FB8'};
  if(pol){switch(ty){
    case 'wisata': return {top:own?mix(own,'#FFF6E4',0.72):'#E9E2CF', side:'#7A6A3A'};
    case 'chance': return {top:'#FBE3DF', side:'#C0392B'};
    case 'dana': return {top:'#E9E6E1', side:'#2A2A30'};
    case 'tax': return {top:'#EADFCB', side:'#6B5A45'};
    case 'start': return {top:'#E6F2D8', side:'#3E8E4A'};
    case 'jail': return {top:'#DADBE0', side:'#5E606B'};
    case 'festival': return {top:'#FFE0D0', side:'#E2483D'};
    case 'pelni': return {top:'#D9D5CB', side:'#6B6255'};
    case 'transport': return {top:own?mix(own,'#FFF6E4',0.72):'#E1E3E6', side:'#55606B'};
    case 'utility': return {top:own?mix(own,'#FFF6E4',0.72):'#ECEADF', side:'#6B6A5A'};
    case 'parkir': return {top:'#E6E2DA', side:'#C9741E'};
  }}
  switch(ty){
    case 'dana': return {top:'#FFF0D8', side:'#E08A1E'};
    case 'transport': return {top:own?mix(own,'#FFF6E4',0.72):'#E3ECF6', side:'#4A6A8A'};
    case 'utility': return {top:own?mix(own,'#FFF6E4',0.72):'#F1F0E4', side:'#7A7A6A'};
    case 'parkir': return {top:'#E9EEF2', side:'#2F6FB0'};
    case 'wisata': return {top:own?mix(own,'#FFF6E4',0.72):'#E2F4EA', side:'#2FA36B'};
    case 'chance': return {top:'#EEE8FF', side:'#6E56CF'};
    case 'tax': return {top:'#F1E6D3', side:'#8A6A4A'};
    case 'start': return {top:'#FFE58A', side:'#E0A100'};
    case 'jail': return {top:'#A8DDF0', side:'#3B8FC2'};
    case 'festival': return {top:'#FFDDE9', side:'#E04F86'};
    case 'pelni': return {top:'#DCE7FF', side:'#2C4F9E'};
  }
  return {top:'#EEE8DC',side:'#8A7A6A'};
}

