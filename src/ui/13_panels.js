/* ---------- player bar (compact chips) + players detail panel ---------- */
var panelEls=[],shownMoney=[];
var ICO={jail:'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="7" width="11" height="8" rx="2" fill="currentColor"/><path d="M5 7V5.2a3 3 0 0 1 6 0V7" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  pelni:'<svg viewBox="0 0 16 16" aria-hidden="true"><ellipse cx="8" cy="11.5" rx="6.5" ry="3" fill="currentColor"/><path d="M8 1.5v6M5 5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  threat:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5 15 14H1z" fill="currentColor"/><path d="M8 6v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="12" r="1.1" fill="#fff"/></svg>',
  baliho:'<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2" width="13" height="8" rx="1.5" fill="currentColor"/><path d="M5 10v5M11 10v5" stroke="currentColor" stroke-width="2"/></svg>',
  broke:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>'};
function lvlName(l){return {mudah:'Mudah',sedang:'Sedang',sulit:'Sulit'}[l]||'Sedang';}
function pStatus(p,i){var st=[],pol=isPol();if(p.bankrupt)st.push(['broke','Bangkrut']);if(p.inJail)st.push(['jail',(pol?'Ditahan':'Terdampar')+' · sisa '+Math.max(0,jailMax(p)-p.jailTurns)+' giliran']);if(p.pelni)st.push(['pelni',pol?'Siap blusukan':'Naik Pelni']);
  if(S.threats&&S.threats[i])st.push(['threat','Ancaman: '+S.threats[i]]);if(S.baliho&&S.baliho.owner===i&&S.round<=S.baliho.until)st.push(['baliho',pol?'Baliho':'Viral']);return st;}
function buildPanels(){
  var L=$('sideL');L.innerHTML='';panelEls=[];shownMoney=[];
  S.players.forEach(function(p,i){var el=document.createElement('div');el.className='pchip';el.style.setProperty('--pc',p.color);
    el.innerHTML='<span class="pav"><canvas></canvas>'+(p.npc?'<i class="pnpc">NPC</i>':'')+'</span><span class="pct"><b class="pname"></b><span class="pmoney"></span></span><span class="picons"></span>';
    L.appendChild(el);panelEls[i]=el;shownMoney[i]=p.money;requestAnimationFrame(function(){portrait(el.querySelector('canvas'),p.char,p.color);});});
  L.onclick=function(){audioUnlock();play('tap');openPlayers();};
  L.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openPlayers();}};
}
function updatePanels(){
  S.players.forEach(function(p,i){var el=panelEls[i];if(!el)return;el.classList.toggle('active',i===S.current&&S.phase!=='over');el.classList.toggle('out',p.bankrupt);
    var nm=el.querySelector('.pname');if(nm.textContent!==p.name)nm.textContent=p.name;
    var ic=pStatus(p,i).map(function(c){return '<i class="ico '+c[0]+'" title="'+escapeHtml(c[1])+'">'+ICO[c[0]]+'</i>';}).join('');var pi=el.querySelector('.picons');if(pi.innerHTML!==ic)pi.innerHTML=ic;});
  if(!$('players').hidden)renderPlayers();
}
function tickMoney(){requestAnimationFrame(tickMoney);if(!S||$('game').hidden)return;S.players.forEach(function(p,i){var el=panelEls[i];if(!el)return;var d=p.money-shownMoney[i];if(Math.abs(d)<1){shownMoney[i]=p.money;}else shownMoney[i]+=d*0.18;var txt=short(Math.abs(d)<1?p.money:shownMoney[i]),pm=el.querySelector('.pmoney');if(pm.textContent!==txt)pm.textContent=txt;el.classList.toggle('up',d>1);el.classList.toggle('down',d<-1);});}
function openPlayers(){if(!S)return;$('players').hidden=false;renderPlayers(true);}
function renderPlayers(full){var box=$('plList');if(!box)return;
  $('plRound').textContent=S.turnLimit?('Ronde '+S.round+' dari '+S.turnLimit):('Ronde '+S.round);
  if(full||box.children.length!==S.players.length){box.innerHTML='';S.players.forEach(function(p,i){var row=document.createElement('div');row.className='plrow';row.style.setProperty('--pc',p.color);
    row.innerHTML='<canvas></canvas><div class="plmain"><div class="plname"></div><div class="plchar"></div><div class="plpsv"></div><div class="plst"></div></div><div class="plnum"><b class="plmoney"></b><span class="plassets"></span><span class="plprops"></span></div>';
    box.appendChild(row);requestAnimationFrame(function(){portrait(row.querySelector('canvas'),p.char,p.color,p.inJail&&isPol()?{vest:true}:null);});});}
  S.players.forEach(function(p,i){var row=box.children[i];if(!row)return;row.classList.toggle('active',i===S.current&&S.phase!=='over');row.classList.toggle('out',p.bankrupt);
    var nh=escapeHtml(p.name)+(i===S.current&&S.phase!=='over'?' <span class="pltag cur">Giliran</span>':'')+(p.npc?' <span class="pltag">NPC · '+lvlName(p.level)+'</span>':''),ne=row.querySelector('.plname');if(ne.innerHTML!==nh)ne.innerHTML=nh;
    row.querySelector('.plchar').textContent=charName(p.char);
    var pv=row.querySelector('.plpsv');if(S.passives&&typeof PASSIVES!=='undefined'&&PASSIVES[p.char]){pv.hidden=false;pv.innerHTML='<b>'+escapeHtml(PASSIVES[p.char].n)+'</b> · '+escapeHtml(PASSIVES[p.char].d);}else pv.hidden=true;
    var st=pStatus(p,i),sh=st.length?st.map(function(c){return '<span class="plchip '+c[0]+'">'+ICO[c[0]]+escapeHtml(c[1])+'</span>';}).join(''):'<span class="plok">Aman</span>',se=row.querySelector('.plst');if(se.innerHTML!==sh)se.innerHTML=sh;
    row.querySelector('.plmoney').textContent=fmt(p.money);row.querySelector('.plassets').textContent='Aset '+short(assets(i));
    var own=ownedTiles(i),nc=own.filter(function(t){return T[t].type==='city';}).length;row.querySelector('.plprops').textContent=own.length+' properti'+(own.length?' · '+nc+' kota':'');});
}
