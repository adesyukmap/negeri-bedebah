
/* ================= UI + RENDER ================= */
var CHARS_POL=[{id:'solo',name:'Pria Solo'},{id:'gemoy',name:'Si Gemoy'},{id:'gaberner',name:'Abah Gaberner'},{id:'pinguin',name:'Ketua Pinguin'},{id:'banteng',name:'Mak Banteng',f:1},
  {id:'prihatin',name:'Presiden Prihatin'},{id:'opung',name:'Lord Opung'},{id:'izin',name:'Bang Izin Tambang'},{id:'gusur',name:'Raja Gusur'},{id:'fufufafa',name:'Fufufafa'},
  {id:'instan',name:'Ketum Instan'},{id:'saham',name:'Papa Minta Saham'},{id:'slepet',name:'El Slepet'},{id:'taro',name:'El Taro'},{id:'zonk',name:'Lord Zonk'},
  {id:'dungu',name:'El Akal Dungu'},{id:'ratupajak',name:'Ratu Pajak',f:1},{id:'konten',name:'Kang Konten'},{id:'micmati',name:'Mbak Mic Mati',f:1},{id:'imam',name:'Imam Besar 212'},{id:'stoik',name:'Duta Stoikisme'}];
var CHARS_SANTAI=[
  {id:'juragan',name:'Juragan Tuan'},{id:'mbak',name:'Mbak Cuan',f:1},{id:'hoki',name:'Si Hoki'},{id:'kapal',name:'Bos Kapal'},
  {id:'nenek',name:'Nenek Licik',f:1},{id:'kos',name:'Pak Kos'},{id:'dewi',name:'Dewi Penari',f:1},{id:'ojol',name:'Bang Ojol'}];
var CHARS=CHARS_POL.concat(CHARS_SANTAI);
function charsFor(th){return th==='santai'?CHARS_SANTAI:CHARS_POL;}
function isFemale(id){var c=CHARS.filter(function(x){return x.id===id;})[0];return !!(c&&c.f);}
function charName(id){var c=CHARS.filter(function(x){return x.id===id;})[0];return c?c.name:id;}
var INK='#4A3426';
var $=function(id){return document.getElementById(id);};
var NIGHT=0, g=null, GD=1, TW=80, TH=40, DZ=14, ZS=48, OX=0, OY=0;

