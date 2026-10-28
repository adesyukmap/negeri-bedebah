/* ---------- colour helpers ---------- */
function hexRgb(h){if(h.indexOf('rgb')===0){var m=h.match(/[\d.]+/g);return [+m[0],+m[1],+m[2]];}h=h.replace('#','');if(h.length===3)h=h[0]+h[0]+h[1]+h[1]+h[2]+h[2];return [parseInt(h.substr(0,2),16),parseInt(h.substr(2,2),16),parseInt(h.substr(4,2),16)];}
function shade(h,f){var c=hexRgb(h),t=f<0?0:255,a=Math.abs(f);return 'rgb('+c.map(function(v){return Math.round(v+(t-v)*a);}).join(',')+')';}
function mix(h1,h2,f){var a=hexRgb(h1),b=hexRgb(h2);return '#'+a.map(function(v,i){return ('0'+Math.round(v+(b[i]-v)*f).toString(16)).slice(-2);}).join('');}
function hash(a,b){var x=Math.sin(a*127.1+b*311.7)*43758.5453;return x-Math.floor(x);}

