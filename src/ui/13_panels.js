/* ---------- panels ---------- */
var panelEls=[],shownMoney=[];
function buildPanels(){
  var L=$('sideL');L.innerHTML='';panelEls=[];shownMoney=[];
  S.players.forEach(function(p,i){var el=document.createElement('div');el.className='pcard';el.style.setProperty('--pc',p.color);
    el.innerHTML='<canvas></canvas><div style="min-width:0"><div class="pname"></div><div class="pmoney"></div><div class="pmeta"></div><div class="chips"></div></div>';
    L.appendChild(el);panelEls[i]=el;shownMoney[i]=p.money;requestAnimationFrame(function(){portrait(el.querySelector('canvas'),p.char,p.color);});});
}
function updatePanels(){
  S.players.forEach(function(p,i){var el=panelEls[i];if(!el)return;el.classList.toggle('active',i===S.current&&S.phase!=='over');el.classList.toggle('out',p.bankrupt);
    el.querySelector('.pname').textContent=p.name;
    var props=ownedTiles(i).length;el.querySelector('.pmeta').textContent=p.bankrupt?'Keluar dari game':(props+' properti · aset '+short(assets(i)));
    var ch=[];if(p.bankrupt)ch.push(['broke','Bangkrut']);if(p.inJail)ch.push(['jail',isPol()?'Ditahan':'Terdampar']);if(p.pelni)ch.push(['pelni',isPol()?'Blusukan':'Naik Pelni']);if(S.threats[i])ch.push(['threat','Ancaman '+S.threats[i]]);if(S.baliho&&S.baliho.owner===i&&S.round<=S.baliho.until)ch.push(['pelni',isPol()?'Baliho':'Viral']);
    el.querySelector('.chips').innerHTML=ch.map(function(c){return '<span class="chip '+c[0]+'">'+c[1]+'</span>';}).join('');});
}
function tickMoney(){requestAnimationFrame(tickMoney);if(!S||$('game').hidden)return;S.players.forEach(function(p,i){var el=panelEls[i];if(!el)return;var d=p.money-shownMoney[i];if(Math.abs(d)<1){shownMoney[i]=p.money;}else shownMoney[i]+=d*0.18;var txt=fmt(Math.abs(d)<1?p.money:shownMoney[i]),pm=el.querySelector('.pmoney');if(pm.textContent!==txt)pm.textContent=txt;});}

