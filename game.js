'use strict';

/* ================= DATOS ================= */
const ORGANELLES = [
  { id:'nucleo',       name:'Núcleo',                    color:'#9b30ff', animal:true,  plant:true,  img:'assets/s_nucleo.png'       },
  { id:'mitocondrias', name:'Mitocondrias',              color:'#ff6d00', animal:true,  plant:true,  img:'assets/s_mitocondrias.png'  },
  { id:'rer',          name:'R. endoplasmático rugoso',  color:'#2196f3', animal:true,  plant:true,  img:'assets/s_rer.png'          },
  { id:'rel',          name:'R. endoplasmático liso',    color:'#00b0ff', animal:true,  plant:true,  img:'assets/s_rel.png'          },
  { id:'golgi',        name:'Aparato de Golgi',          color:'#ff2d55', animal:true,  plant:true,  img:'assets/s_golgi.png'        },
  { id:'ribosomas',    name:'Ribosomas',                 color:'#a1662f', animal:true,  plant:true,  img:'assets/s_ribosomas.png'    },
  { id:'lisosomas',    name:'Lisosomas',                 color:'#ffab00', animal:true,  plant:false, img:'assets/s_lisosomas.png'    },
  { id:'centriolos',   name:'Centríolos',                color:'#e040fb', animal:true,  plant:false, img:'assets/s_centriolos.png'   },
  { id:'cloroplastos', name:'Cloroplastos',              color:'#00c853', animal:false, plant:true,  img:'assets/s_cloroplastos.png' },
  { id:'vacuola',      name:'Vacuola central',           color:'#00b8d4', animal:false, plant:true,  img:'assets/s_vacuola.png'      },
];
/* Las 5 categorías de pelotitas (solo estructuras de la tabla).
   El cartel muestra el TIPO; las pelotitas dicen el nombre de la estructura. */
const CATEGORIES = {
  organelas: { type:'Organelas' },
  membrana:  { type:'Membrana biológica', label:'Membrana plasmática', color:'#ff5e8a', img:'assets/s_membrana.png'      },
  rigida:    { type:'Estructura rígida',  label:'Pared celular',       color:'#ff9e00', img:'assets/s_pared.png'         },
  medio:     { type:'Medio interno',      label:'Citoplasma',          color:'#b26bff', img:'assets/s_citoplasma.png'    },
  red:       { type:'Red de fibras',      label:'Citoesqueleto',       color:'#29d8e0', img:'assets/s_citoesqueleto.png' },
};
const CAT_KEYS = Object.keys(CATEGORIES);
/* colores aleatorios de las pelotitas: el color NO identifica la estructura,
   así el estudiante tiene que leer el nombre */
const BALL_COLORS=['#ff3d5e','#ff9500','#ffd000','#7cfc00','#00c853','#00e5d4','#00b0ff','#2979ff','#7c4dff','#e040fb','#ff2d95','#a1662f'];
/* umbrales de llaves por puntaje al atrapar: 55+ → 2 llaves,
   25–54 → 1, menos → ninguna. Máximo 6 llaves en total en la mano
   (así hacen falta ~3 partidas para abrir las 15 puertas). */
const KEYS_2=55, KEYS_1=25;
const MAX_KEYS=6;
/* otorga llaves sin pasar el tope de 6; devuelve cuántas se dieron */
function addKeys(n){
  const g=Math.min(n, Math.max(0, MAX_KEYS-state.keys));
  state.keys+=g; state.keysEarned+=g;
  return g;
}

const STRUCTURES = [
  { name:'Membrana plasmática',             fn:'Controla qué sustancias entran y salen de la célula' },
  { name:'Pared celular',                   fn:'Protege a la célula y le da forma' },
  { name:'Citoplasma',                      fn:'Rodea a las organelas; en él ocurren muchas de las reacciones químicas de la célula' },
  { name:'Citoesqueleto',                   fn:'Sostiene la forma de la célula y mueve sus partes internas' },
  { name:'Núcleo',                          fn:'Guarda la mayor parte de la información genética y dirige las actividades de la célula' },
  { name:'Retículo endoplasmático rugoso',  fn:'Prepara y transporta las proteínas que fabrican los ribosomas pegados a su superficie' },
  { name:'Retículo endoplasmático liso',    fn:'Produce grasas y transforma algunas sustancias tóxicas para que puedan eliminarse' },
  { name:'Aparato de Golgi',                fn:'Empaqueta y envía a su destino las sustancias que fabrica la célula, después de modificarlas' },
  { name:'Lisosomas',                       fn:'Digieren sustancias que ingresan a la célula, desechos y partes dañadas' },
  { name:'Mitocondrias',                    fn:'Liberan la energía de los nutrientes. En ellas ocurre la respiración celular' },
  { name:'Ribosomas',                       fn:'Fabrican las proteínas de la célula' },
  { name:'Cloroplastos',                    fn:'Captan la luz del sol y la usan para transformar agua y dióxido de carbono en alimento. En ellos ocurre la fotosíntesis' },
  { name:'Vacuola central',                 fn:'Almacena agua y otras sustancias, mantiene firme la célula y digiere desechos' },
  { name:'Centríolos',                      fn:'Organizan las fibras que reparten el material genético cuando la célula se divide' },
];

const AVATARS = [
  { id:'nucleo',      label:'Núcleo',          img:'assets/nucleo.png' },
  { id:'mitocondria', label:'Mitocondria',     img:'assets/mitocondria.png' },
  { id:'cloroplasto', label:'Cloroplasto',     img:'assets/cloroplasto.png' },
  { id:'golgi',       label:'Aparato de Golgi',img:'assets/golgi.png' },
  { id:'lisosoma',    label:'Lisosoma',        img:'assets/lisosoma.png' },
];

const ORG_BY_ID  = Object.fromEntries(ORGANELLES.map(o => [o.id, o]));

/* estructuras que no son organelas: id de ítem dentro de cada categoría */
const CAT_ITEM_ID = { membrana:'membrana', rigida:'pared', medio:'citoplasma', red:'citoesqueleto' };
const NONORG = {
  membrana:     { name:'Membrana plasmática', img:'assets/s_membrana.png'      },
  pared:        { name:'Pared celular',       img:'assets/s_pared.png'         },
  citoplasma:   { name:'Citoplasma',          img:'assets/s_citoplasma.png'    },
  citoesqueleto:{ name:'Citoesqueleto',       img:'assets/s_citoesqueleto.png' },
};
const ALL_STRUCT_IDS = [...ORGANELLES.map(o=>o.id), ...Object.keys(NONORG)];

/* Recuadros sobre las flechas de cada diagrama (x,y en % de la imagen).
   Si una estructura tiene varias flechas, una sola ficha las completa todas. */
/* x,y = punto de la estructura en la imagen (%); los circulitos se
   ubican solos apenas fuera del borde, en orden angular (sin cruces) */
const CELL_BOXES = {
  animal: [
    { id:'membrana',      x:88,   y:11,  lx:88, ly:6  },
    { id:'citoesqueleto', x:44,   y:24,  lx:30, ly:5  },
    { id:'citoplasma',    x:15,   y:78,  lx:6,  ly:16 },
    { id:'rel',           x:22,   y:38,  lx:5,  ly:40 },
    { id:'rer',           x:63,   y:31,  lx:60, ly:5  },
    { id:'nucleo',        x:56,   y:39,  lx:50, ly:94 },
    { id:'mitocondrias',  x:17,   y:62,  lx:5,  ly:60,  label:'Mitocondria' },
    { id:'golgi',         x:75,   y:58,  lx:94, ly:55 },
    { id:'centriolos',    x:53,   y:71,  lx:76, ly:94 },
    { id:'ribosomas',     x:44,   y:86,  lx:24, ly:94 },
    { id:'lisosomas',     x:70,   y:77,  lx:94, ly:74,  label:'Lisosoma'    },
  ],
  plant: [
    { id:'citoplasma',    x:24,   y:20,  lx:26, ly:5  },
    { id:'membrana',      x:86,   y:12,  lx:88, ly:6  },
    { id:'rer',           x:48,   y:28,  lx:66, ly:5  },
    { id:'cloroplastos',  x:26,   y:28,  lx:6,  ly:18,  label:'Cloroplasto' },
    { id:'nucleo',        x:81,   y:33,  lx:94, ly:36 },
    { id:'mitocondrias',  x:18,   y:42,  lx:5,  ly:44,  label:'Mitocondria' },
    { id:'pared',         x:11,   y:56,  lx:5,  ly:64 },
    { id:'rel',           x:77,   y:54,  lx:95, ly:54 },
    { id:'vacuola',       x:42,   y:55,  lx:50, ly:94 },
    { id:'ribosomas',     x:56,   y:87,  lx:24, ly:94 },
    { id:'golgi',         x:76,   y:68,  lx:94, ly:74 },
    { id:'citoesqueleto', x:40,   y:72.5,lx:74, ly:94 },
  ],
};
const CELL_REQ = {
  animal:[...new Set(CELL_BOXES.animal.map(b=>b.id))],
  plant: [...new Set(CELL_BOXES.plant .map(b=>b.id))],
};

const NUM_LEVELS = 5, LEVEL_DUR = 45;
/* Los niveles NO escalan en dificultad: solo cambia la categoría a atrapar
   (siempre sorteada al azar). Velocidad suave y pareja, y muchas pelotitas
   para que el estudiante pueda juntar puntaje para las llaves. */
const LEVELS = [
  { spawn:850, speed:1.8 },
  { spawn:830, speed:1.9 },
  { spawn:800, speed:2.0 },
  { spawn:780, speed:2.1 },
  { spawn:750, speed:2.2 },
];

/* ================= ESTADO ================= */
const state = {
  nombre:'', apellido:'', seccion:'', avatar:null,
  inventory:{}, totalCaught:0, decoyErrors:0, score:0,
  placements:{ animal:{}, plant:{} },      // slotIdx -> organelle id
  cellsCompleted:0, animalOk:false, plantOk:false,
  matchRoundErrors:0, matchErrorsTotal:0, matchRounds:0,
  keys:0, exitDoor:null, doorsOpened:[], doorsTried:0, keysEarned:0, doorsRound:0,
  cellErr:{animal:0,plant:0}, cellKey:{animal:false,plant:false},
  countedWrong:{animal:{},plant:{}}, extraFor:'animal',
  keysBy:{catch:0,roulette:0}, rouCorrectTotal:0, cellStage:'animal',
  startTime:null, endTime:null,
};

const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ---------- efectos de sonido (WebAudio, sin archivos) ---------- */
let actx=null, sfxMuted=false;
function ac(){
  try{
    if(!actx) actx=new (window.AudioContext||window.webkitAudioContext)();
    if(actx.state==='suspended') actx.resume();
  }catch(e){}
  return actx;
}
function tone(f,dur,type='square',vol=.12,delay=0,slideTo=null){
  const c=ac(); if(!c) return;
  const t=c.currentTime+delay;
  const o=c.createOscillator(), g=c.createGain();
  o.type=type; o.frequency.setValueAtTime(f,t);
  if(slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20,slideTo),t+dur);
  g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.001,t+dur);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t+dur+.05);
}
function sfx(name){
  if(sfxMuted) return;
  switch(name){
    case 'catch': tone(740,.08,'square',.09); tone(1180,.07,'square',.07,.06); break;
    case 'wrong': tone(230,.22,'sawtooth',.13,0,105); break;
    case 'key':   [660,880,1320].forEach((f,i)=>tone(f,.12,'triangle',.13,i*.09)); break;
    case 'door':  tone(170,.35,'triangle',.11,0,80); tone(95,.3,'sine',.09,.05); break;
    case 'exit':  [523,659,784,1046,1318].forEach((f,i)=>tone(f,.17,'triangle',.15,i*.11)); break;
  }
}

function confettiBurst(){
  const colors=['#ffd93b','#ff6d00','#00c853','#29d8e0','#e040fb','#ff2d55','#2196f3'];
  for(let i=0;i<70;i++){
    const s=document.createElement('span');
    s.className='confetti';
    s.style.left=Math.random()*100+'vw';
    s.style.background=colors[i%colors.length];
    s.style.animationDelay=(Math.random()*.7)+'s';
    s.style.animationDuration=(1.5+Math.random()*1.5)+'s';
    if(Math.random()<.4) s.style.borderRadius='50%';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),3800);
  }
}
function show(id){
  $$('.screen').forEach(sc => sc.classList.remove('active'));
  $('#'+id).classList.add('active');
  window.scrollTo(0,0);
}
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
function orgName(id){ return ORG_BY_ID[id] ? ORG_BY_ID[id].name : NONORG[id].name; }
function structImg(id){ return ORG_BY_ID[id] ? ORG_BY_ID[id].img   : NONORG[id].img; }
function invTotal(){ return Object.values(state.inventory).reduce((a,b)=>a+b,0); }

/* ================= REGISTRO ================= */
let selectedAvatar = null;
let selectedSection = '';

function initRegister(){
  const grid = $('#avatar-grid');
  grid.innerHTML='';
  AVATARS.forEach(av=>{
    const d=document.createElement('button');
    d.type='button'; d.className='avatar-opt';
    d.innerHTML=`<img src="${av.img}" alt="${av.label}"><span>${av.label}</span>`;
    d.onclick=()=>{ selectedAvatar=av; $$('.avatar-opt').forEach(x=>x.classList.remove('selected')); d.classList.add('selected'); };
    grid.appendChild(d);
  });
  $$('.sec-btn').forEach(b=>{
    b.onclick=()=>{ selectedSection=b.dataset.sec; $$('.sec-btn').forEach(x=>x.classList.remove('selected')); b.classList.add('selected'); };
  });
  $('#btn-start').onclick=()=>{
    const nombre=$('#inp-nombre').value.trim(), apellido=$('#inp-apellido').value.trim();
    const err=$('#register-error');
    if(!nombre||!apellido){ err.textContent='Escribe tu nombre y apellido.'; return; }
    if(!selectedSection){ err.textContent='Elige tu sección (A o B).'; return; }
    if(!selectedAvatar){ err.textContent='Elige un avatar.'; return; }
    state.nombre=nombre; state.apellido=apellido; state.seccion=selectedSection;
    state.avatar=selectedAvatar; state.startTime=Date.now();
    show('screen-countdown'); runCountdown(()=>startCatchLevel(0));
  };
  $('#btn-to-register').onclick=()=>show('screen-register');
}

/* ================= CUENTA REGRESIVA ================= */
function runCountdown(done){
  const num=$('#countdown-num');
  $('#countdown-avatar').src = state.avatar ? state.avatar.img : '';
  const seq=['3','2','1','¡Jugamos!'];
  let i=0;
  const tick=()=>{
    num.textContent=seq[i];
    num.style.animation='none'; void num.offsetWidth; num.style.animation='';
    i++;
    if(i<seq.length) setTimeout(tick, 800);
    else setTimeout(done, 800);
  };
  tick();
}

/* ================= ATRAPAR ORGANELAS ================= */
const field=()=>$('#field');
let balls=[], rafId=null, lastSpawn=0, levelEnd=0, curLevel=null, spawnQueue=[];
let playerX=200, holdLeft=false, holdRight=false, catchActive=false, extraRound=false;

/* organelas que aún faltan para completar ambas células (id -> cuántas).
   Las que no son organelas (membrana, pared, citoplasma, citoesqueleto)
   están siempre disponibles en la canasta — nunca faltan. */
function neededStructures(){
  const want={};
  ['animal','plant'].forEach(kind=>{
    CELL_REQ[kind].forEach(id=>{
      if(!ORG_BY_ID[id]) return;
      const pl=state.placements[kind];
      const filled=Object.keys(pl).some(i=>CELL_BOXES[kind][i].id===id && pl[i]===id);
      if(!filled) want[id]=(want[id]||0)+1;
    });
  });
  const need={};
  Object.entries(want).forEach(([id,c])=>{
    const left=c-(state.inventory[id]||0);
    if(left>0) need[id]=left;
  });
  return need;
}

const PLAYER_W=120, PLAYER_H=260;  // imagen 643x1392 escalada
let levelStarted=false, levelTargets=[];

function startCatchLevel(i, extra=false){
  extraRound=extra;
  if(i===0 && !extra) levelTargets=shuffle(CAT_KEYS);   // cada nivel, una categoría distinta al azar
  curLevel = extra ? {spawn:800, speed:2.3} : LEVELS[i];
  curLevel.index=i;
  curLevel.dur=LEVEL_DUR;
  curLevel.target = extra ? 'organelas' : levelTargets[i];
  const need=neededStructures();
  curLevel.needSet = extra ? new Set(Object.keys(need).length?Object.keys(need):ORGANELLES.map(o=>o.id)) : null;
  $('#level-result').classList.add('hidden');
  show('screen-catch');
  balls.forEach(b=>b.el.remove()); balls=[];
  playerX=(field().clientWidth-PLAYER_W)/2;
  $('#hud-level').textContent = extra ? 'Ronda extra' : `Nivel ${i+1} de ${NUM_LEVELS}`;
  $('#hud-pips').textContent = extra ? '★' : Array.from({length:NUM_LEVELS},(_,k)=>k<=i?'●':'○').join('');
  $('#hud-timer').textContent=`⏱ ${curLevel.dur}`;
  $('#timebar-fill').style.width='100%';
  $('#catch-goal').innerHTML = extra ? 'Atrapá: <b>solo lo que te falta</b> · lo demás resta ⚠️'
                                    : `Atrapá: <b>${CATEGORIES[curLevel.target].type}</b>`;
  updateHudCount();
  catchActive=true; levelStarted=false; levelEnd=null; lastSpawn=0;

  const banner=$('#level-banner');
  banner.innerHTML = extra
    ? `¡Ronda extra!<br><span style="font-size:1.3rem">Atrapá: <b>solo lo que te falta</b></span><br><span style="font-size:.95rem">⚠️ No toques otras estructuras: ¡restan puntos y cuestan la llave!</span>`
    : `¡Nivel ${i+1}!<br><span style="font-size:1.3rem">Atrapá: <b>${CATEGORIES[curLevel.target].type}</b></span><br><span style="font-size:.95rem">⏱ El tiempo arranca cuando te movés</span>`;
  banner.classList.remove('hidden');

  cancelAnimationFrame(rafId);
  rafId=requestAnimationFrame(catchLoop);
}

function updateHudCount(){
  $('#hud-count').textContent=`🧺 ${state.score}`;
  $('#hud-keys').textContent=`🔑 ${state.keys}`;
  document.querySelectorAll('.js-keys').forEach(e=>e.textContent=state.keys);
  renderFixedKeys();
}

/* llaves en circulitos, fijas arriba a la izquierda durante todo el juego */
function renderFixedKeys(){
  const kf=$('#hud-keys-fixed');
  if(!kf) return;
  kf.innerHTML=Array.from({length:state.keys},()=>'<span class="key-circle">🔑</span>').join('');
  kf.classList.toggle('hidden', state.keys<=0);
}

function spawnBall(){
  // mezcla balanceada: el objetivo ~40% y el resto repartido parejo,
  // así todas las categorías aparecen en buena cantidad en cada nivel
  let cat;
  if(Math.random()<0.4){
    cat=curLevel.target;
  }else{
    const others=CAT_KEYS.filter(c=>c!==curLevel.target);
    cat=others[Math.floor(Math.random()*others.length)];
  }
  let item;
  if(extraRound){
    // ronda extra: solo caen organelas, priorizando las que faltan
    const ids=[...curLevel.needSet];
    const pool = ids.length && Math.random()<0.65 ? ids : ORGANELLES.map(o=>o.id);
    item=itemForId(pool[Math.floor(Math.random()*pool.length)]);
  }else if(cat==='organelas'){
    const need=Object.keys(neededStructures());
    const pool = need.length && Math.random()<0.5 ? need : ORGANELLES.map(o=>o.id);
    const id=pool[Math.floor(Math.random()*pool.length)];
    item=itemForId(id);
  }else{
    item=itemForId(CAT_ITEM_ID[cat]);
  }
  const w=field().clientWidth;
  const x=10+Math.random()*Math.max(50, w-152);
  const el=document.createElement('div');
  el.className='ball';
  el.innerHTML=`<img class="orb-img" src="${item.img}" alt="" draggable="false"><div class="ball-label">${item.label}</div>`;
  el.style.left='0px'; el.style.top='0px';
  field().appendChild(el);
  balls.push({el, x, y:-110, item, speed:curLevel.speed*(0.75+Math.random()*0.6)});
}

function itemForId(id){
  if(ORG_BY_ID[id]) return {cat:'organelas', orgId:id, label:ORG_BY_ID[id].name, img:ORG_BY_ID[id].img};
  const cat=Object.keys(CAT_ITEM_ID).find(c=>CAT_ITEM_ID[c]===id);
  return {cat, label:NONORG[id].name, img:NONORG[id].img};
}

function catchLoop(t){
  if(!catchActive) return;
  const f=field(), W=f.clientWidth, H=f.clientHeight;

  // mover jugador
  const SPEED=7;
  if(holdLeft)  playerX-=SPEED;
  if(holdRight) playerX+=SPEED;
  playerX=Math.max(0, Math.min(W-PLAYER_W, playerX));
  $('#player').style.transform=`translateX(${playerX}px)`;

  // el temporalizador arranca con el primer movimiento
  if(!levelStarted){
    if(holdLeft||holdRight){
      levelStarted=true; levelEnd=t+curLevel.dur*1000;
      setTimeout(()=>$('#level-banner').classList.add('hidden'),1500);
    }else{
      rafId=requestAnimationFrame(catchLoop);
      return;
    }
  }

  // zona de la canasta: boca de la canasta en la imagen (fracciones medidas)
  const pTop=H-4-PLAYER_H;
  const bTop=pTop+0.56*PLAYER_H, bBot=pTop+0.80*PLAYER_H;
  const bL=playerX+0.24*PLAYER_W, bR=playerX+0.74*PLAYER_W;

  // spawn (solo mientras corre el tiempo)
  if(t<levelEnd && t>=lastSpawn+curLevel.spawn){ spawnBall(); lastSpawn=t; }

  // mover pelotas y detectar captura
  for(let i=balls.length-1;i>=0;i--){
    const b=balls[i];
    b.y+=b.speed;
    b.el.style.transform=`translate(${b.x}px,${b.y}px)`;
    const orbCx=b.x+64, orbBot=b.y+76;
    if(orbBot>=bTop && orbBot<=bBot+24 && orbCx>=bL && orbCx<=bR){
      // atrapada
      const idKey = b.item.cat==='organelas' ? b.item.orgId : CAT_ITEM_ID[b.item.cat];
      const isTarget = extraRound ? curLevel.needSet.has(idKey) : b.item.cat===curLevel.target;
      // toda organela que cae en la canasta se guarda (acierte o no el objetivo)
      if(b.item.cat==='organelas') state.inventory[idKey]=(state.inventory[idKey]||0)+1;
      if(isTarget){
        state.score++; state.totalCaught++;
        updateHudCount();
        catchPop(b.x+30, b.y);
        sfx('catch');
      }else{
        loseThree();
      }
      b.el.remove(); balls.splice(i,1); continue;
    }
    if(b.y>H+80){ b.el.remove(); balls.splice(i,1); }
  }

  const remain=Math.max(0, Math.ceil((levelEnd-t)/1000));
  $('#hud-timer').textContent=`⏱ ${remain}`;
  $('#timebar-fill').style.width=Math.max(0,(levelEnd-t)/(curLevel.dur*10))+'%';

  // terminado el tiempo: cuando ya cayeron las últimas pelotitas pasa de nivel
  if(t>=levelEnd && (balls.length===0 || t>=levelEnd+5000)){ endCatchLevel(); return; }
  rafId=requestAnimationFrame(catchLoop);
}

function catchPop(x,y){
  const p=document.createElement('div');
  p.className='catch-pop'; p.textContent='+1';
  p.style.left=x+'px'; p.style.top=y+'px';
  field().appendChild(p);
  setTimeout(()=>p.remove(),800);
}

function loseThree(){
  state.decoyErrors++;
  state.score=Math.max(0, state.score-3);   // resta puntos; lo recolectado no se pierde
  // errores en la ronda extra cuentan para la llave de la célula que se estaba armando
  if(extraRound) state.cellErr[state.extraFor]++;
  updateHudCount();
  sfx('wrong');
  const p=$('#penalty');
  p.classList.remove('hidden');
  p.style.animation='none'; void p.offsetWidth; p.style.animation='';
  setTimeout(()=>p.classList.add('hidden'),900);
}

function endCatchLevel(){
  catchActive=false;
  cancelAnimationFrame(rafId);
  balls.forEach(b=>b.el.remove()); balls=[];
  if(!extraRound && curLevel.index<NUM_LEVELS-1){
    startCatchLevel(curLevel.index+1);
  }else if(extraRound){
    enterBuild();
  }else{
    awardCatchKeys();
  }
}

function awardCatchKeys(){
  let earned=0;
  if(state.score>=KEYS_2) earned=2;
  else if(state.score>=KEYS_1) earned=1;
  earned=addKeys(earned); state.keysBy.catch+=earned;
  updateHudCount();
  if(earned>0) sfx('key');
  $('#lr-title').textContent='¡Terminaron los 5 niveles!';
  $('#lr-text').innerHTML=`Atrapaste <b>${state.totalCaught}</b> pelotitas correctas · Puntaje: <b>${state.score}</b>.<br>`+
    (earned>0 ? `¡Ganaste <b>${earned} llave${earned>1?'s':''}</b>! 🔑` : `No llegaste al puntaje para llaves esta vez.`);
  $('#level-result').classList.remove('hidden');
}

/* ================= ARMAR CÉLULAS ================= */
let selectedChip=null;

function enterBuild(){
  show('screen-build');
  $('#msg-cell').textContent='';
  $('#build-keys').textContent=`🔑 Llaves de células: Animal ${state.cellKey.animal?'✔':'—'} · Vegetal ${state.cellKey.plant?'✔':'—'}`;
  renderDiagram(); renderTray();
  updateCollectMoreBtn(); updateBuildButtons();
}

function updateBuildButtons(){
  const animal=state.cellStage==='animal';
  $('#btn-back-animal').classList.toggle('hidden', animal);
  $('#btn-next-cell').classList.toggle('hidden', !(animal && state.animalOk));
  $('#btn-to-match').classList.toggle('hidden', animal);
}

let dzEls=[];

function renderDiagram(){
  const kind=state.cellStage;
  $('#cell-title').textContent = kind==='animal' ? 'Célula eucariota animal' : 'Célula eucariota vegetal';
  const img=$('#cell-diagram-img');
  img.onload=()=>layoutDiagram();
  img.src = `assets/celula_${kind}.png`;
  const d=$('#cell-diagram');
  d.querySelectorAll('.dropbox').forEach(e=>e.remove());
  dzEls=[];
  CELL_BOXES[kind].forEach((box,idx)=>{
    const s=document.createElement('div');
    s.className='dropbox';
    const placed=state.placements[kind][idx];
    if(placed){
      s.classList.add('filled');
      s.innerHTML=`<div class="db-circle"><span class="db-q">✓</span></div><div class="db-tag">${box.label||orgName(placed)}</div>`;
    }else{
      s.innerHTML='<div class="db-circle"><span class="db-q">?</span></div>';
    }
    s.onclick=()=>onBoxClick(kind, idx);
    d.appendChild(s);
    dzEls[idx]=s;
  });
  if(img.complete) layoutDiagram();
}

/* Circulitos apenas fuera del borde de la imagen, en el mismo orden angular
   que las estructuras → flechas cortas que nunca se cruzan */
function layoutDiagram(){
  const kind=state.cellStage;
  const svg=$('#cell-lines'), img=$('#cell-diagram-img'), cont=$('#cell-diagram');
  if(!svg || !img.naturalWidth || !dzEls.length) return;
  const cr=cont.getBoundingClientRect(), ir=img.getBoundingClientRect();
  const cx=ir.left-cr.left+ir.width/2, cy=ir.top-cr.top+ir.height/2;
  const items=CELL_BOXES[kind].map((box,idx)=>({
    idx,
    ax: ir.left-cr.left + box.x/100*ir.width,
    ay: ir.top -cr.top  + box.y/100*ir.height,
    ang: 0, circAng:0,
  }));
  items.forEach(it=>{ it.ang=Math.atan2(it.ay-cy, it.ax-cx); });
  items.sort((a,b)=>a.ang-b.ang);
  /* la cadena de circulitos arranca justo después del hueco angular más
     grande entre estructuras → cada circulito queda del mismo lado que su
     estructura y las flechas nunca se cruzan ni se estiran */
  let start=0, best=-1;
  items.forEach((it,i)=>{
    const nxt=items[(i+1)%items.length].ang + (i===items.length-1 ? 2*Math.PI : 0);
    if(nxt-it.ang>best){ best=nxt-it.ang; start=(i+1)%items.length; }
  });
  const ord=[...items.slice(start), ...items.slice(0,start)];
  const minSep=Math.min(26, 300/items.length)*Math.PI/180;
  let prev=null;
  ord.forEach(it=>{
    let a=it.ang;
    if(prev!==null){
      if(a<prev) a+=2*Math.PI;
      it.circAng=Math.max(a, prev+minSep);
    }else it.circAng=a;
    prev=it.circAng;
  });
  const rx=ir.width/2+30, ry=ir.height/2+30;
  svg.setAttribute('viewBox',`0 0 ${cr.width} ${cr.height}`);
  svg.innerHTML='';
  const ns='http://www.w3.org/2000/svg';
  items.forEach(it=>{
    let px=cx+rx*Math.cos(it.circAng), py=cy+ry*Math.sin(it.circAng);
    px=Math.max(28,Math.min(cr.width -28,px));
    py=Math.max(28,Math.min(cr.height-28,py));
    const dz=dzEls[it.idx];
    dz.style.left=px+'px'; dz.style.top=py+'px';
    dz.classList.toggle('tag-above', py>cy+ir.height*0.2);
    const dx=px-it.ax, dy=py-it.ay, len=Math.hypot(dx,dy)||1;
    const ux=dx/len, uy=dy/len;
    const ex=px-ux*24, ey=py-uy*24;
    const ox=-uy, oy=ux;
    const line=document.createElementNS(ns,'line');
    line.setAttribute('x1',it.ax); line.setAttribute('y1',it.ay);
    line.setAttribute('x2',ex); line.setAttribute('y2',ey);
    line.setAttribute('class','leader');
    const dot=document.createElementNS(ns,'circle');
    dot.setAttribute('cx',it.ax); dot.setAttribute('cy',it.ay); dot.setAttribute('r',4.5);
    dot.setAttribute('class','leader-dot');
    const arr=document.createElementNS(ns,'polygon');
    arr.setAttribute('points',`${ex+ux*9},${ey+uy*9} ${ex-ux*2+ox*5},${ey-uy*2+oy*5} ${ex-ux*2-ox*5},${ey-uy*2-oy*5}`);
    arr.setAttribute('class','leader-arrow');
    svg.appendChild(line); svg.appendChild(dot); svg.appendChild(arr);
  });
}

function renderTray(){
  const tray=$('#tray'); tray.innerHTML='';
  // siempre disponibles: las estructuras que no son organelas nunca faltan
  Object.keys(NONORG).forEach(id=>{
    tray.appendChild(makeChip(id, 'base-'+id));
  });
  // una fichita por cada organela atrapada (dos cloroplastos = dos cartelitos)
  const units=[];
  Object.keys(state.inventory).forEach(id=>{
    for(let k=0;k<state.inventory[id];k++) units.push({id, key:id+'-'+k});
  });
  units.forEach(({id,key})=>tray.appendChild(makeChip(id, key)));
}

function makeChip(id, key){
  const chip=document.createElement('div');
  chip.className='chip'+(NONORG[id]?' chip-base':'')+(selectedChip && selectedChip.key===key?' selected':'');
  chip.textContent=orgName(id);   // sin ícono: que relacionen por la palabra
  chip.onclick=()=>{ selectedChip = (selectedChip&&selectedChip.key===key)?null:{id,key}; renderTray(); renderDiagram(); };
  return chip;
}

function onBoxClick(kind, idx){
  const pl=state.placements[kind];
  const placed=pl[idx];
  if(placed){
    // quitar: la ficha vuelve a la canasta (las organelas, al inventario)
    delete pl[idx];
    Object.keys(state.countedWrong[kind]).forEach(k=>{ if(k.startsWith(idx+'=')) delete state.countedWrong[kind][k]; });
    if(ORG_BY_ID[placed]) state.inventory[placed]=(state.inventory[placed]||0)+1;
    state.animalOk=state.plantOk=false;
    renderDiagram(); renderTray(); updateCollectMoreBtn(); updateBuildButtons(); return;
  }
  if(!selectedChip) return;
  const id=selectedChip.id;
  const isOrg=!!ORG_BY_ID[id];
  if(isOrg && !(state.inventory[id]>0)) return;
  pl[idx]=id;
  if(isOrg){
    state.inventory[id]--;
    if(state.inventory[id]<=0) delete state.inventory[id];
  }
  selectedChip=null;
  renderDiagram(); renderTray(); updateCollectMoreBtn(); updateBuildButtons();
}

function updateCollectMoreBtn(){
  const missing=Object.keys(neededStructures());
  $('#btn-collect-more').classList.toggle('hidden', missing.length===0);
}

function verifyCells(){
  const kind=state.cellStage;
  const boxes=CELL_BOXES[kind], pl=state.placements[kind];
  const msgEl=$('#msg-cell');
  const dom=d=>document.querySelectorAll('#cell-diagram .dropbox');
  const missing=[], wrong=[];
  dom().forEach(s=>s.classList.remove('bad'));
  boxes.forEach((b,i)=>{
    const p=pl[i];
    if(!p){
      if(!boxes.some((bb,j)=>bb.id===b.id && pl[j]===b.id) && !missing.includes(b.id)) missing.push(b.id);
    }else if(p!==b.id){
      if(!wrong.includes(p)) wrong.push(p);
      dom()[i].classList.add('bad');
      // cada rótulo mal colocado cuenta 1 error para la llave de esta célula;
      // no se vuelve a contar si se aprieta Controlar otra vez sin moverlo
      const sig=i+'='+p;
      if(!state.countedWrong[kind][sig]){ state.countedWrong[kind][sig]=1; state.cellErr[kind]++; }
    }
  });
  const ok = missing.length===0 && wrong.length===0;
  if(ok){
    msgEl.textContent='✅ ¡Célula completa y correcta!';
    msgEl.className='cell-msg ok';
  }else{
    let txt=[];
    if(missing.length) txt.push('Falta: '+missing.map(orgName).join(', '));
    if(wrong.length)  txt.push('No corresponde ahí: '+wrong.map(orgName).join(', '));
    msgEl.textContent='❌ '+txt.join(' · ');
    msgEl.className='cell-msg bad';
  }
  if(kind==='animal') state.animalOk=ok; else state.plantOk=ok;
  state.cellsCompleted=(state.animalOk?1:0)+(state.plantOk?1:0);
  // 1 llave por célula completa con 0-1 errores
  let keyMsg='';
  if(ok && !state.cellKey[kind]){
    if(state.cellErr[kind]<=1){
      state.cellKey[kind]=true; addKeys(1);
      updateHudCount(); sfx('key');
      keyMsg=' 🔑 ¡Ganaste la llave de esta célula!';
    }else{
      keyMsg=` (sin llave: ${state.cellErr[kind]} errores en esta célula)`;
    }
  }
  if(ok && keyMsg) msgEl.textContent+=keyMsg;
  $('#build-keys').textContent=`🔑 Llaves de células: Animal ${state.cellKey.animal?'✔':'—'} · Vegetal ${state.cellKey.plant?'✔':'—'}`;
  updateBuildButtons();
}

/* re-verifica ambas células en silencio (para el botón Continuar) */
function verifyAllCells(){
  let awarded=false;
  ['animal','plant'].forEach(kind=>{
    const boxes=CELL_BOXES[kind], pl=state.placements[kind];
    let ok=true;
    boxes.forEach((b,i)=>{ const p=pl[i]; if(!p || p!==b.id) ok=false; });
    if(kind==='animal') state.animalOk=ok; else state.plantOk=ok;
    // si quedó bien armada y nunca se verificó, la llave se gana igual
    if(ok && !state.cellKey[kind] && state.cellErr[kind]<=1){
      state.cellKey[kind]=true; if(addKeys(1)) awarded=true;
    }
  });
  state.cellsCompleted=(state.animalOk?1:0)+(state.plantOk?1:0);
  if(awarded){ updateHudCount(); sfx('key'); }
}

/* ================= RULETA DE FUNCIONES ================= */
/* ruleta de 14 números: cada tirada abre la función de una estructura al azar
   (sin repetir dentro de la partida) y el estudiante escribe su nombre.
   Cada acierto = 1 llave. Máximo 7 tiradas. */
const ROULETTE_SPINS = 7;
/* respuestas aceptadas (normalizadas: minúsculas, sin espacios extra,
   tildes OBLIGATORIOS). Orden = índice en STRUCTURES. */
const ROULETTE_ANSWERS = [
  ['membrana plasmática','membrana'],
  ['pared celular'],
  ['citoplasma'],
  ['citoesqueleto'],
  ['núcleo'],
  ['retículo endoplasmático rugoso','r. endoplasmático rugoso','r endoplasmático rugoso','rer'],
  ['retículo endoplasmático liso','r. endoplasmático liso','r endoplasmático liso','rel'],
  ['aparato de golgi','golgi'],
  ['lisosomas','lisosoma'],
  ['mitocondrias','mitocondria'],
  ['ribosomas','ribosoma'],
  ['cloroplastos','cloroplasto'],
  ['vacuola central','vacuola'],
  ['centríolos','centríolo'],
];

let rouStructIdx=[], rouDone=[], rouSpin=0, rouCur=-1, rouAngle=0, rouSpinning=false;
let matchKeysEarned=0, matchErrors=0;

function normAns(s){ return (s||'').toLowerCase().trim().replace(/\s+/g,' ').replace(/\.+$/,''); }
const stripAcc=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');

function enterMatch(){
  show('screen-match');
  rouStructIdx=shuffle(STRUCTURES.map((s,i)=>i));
  rouDone=Array(STRUCTURES.length).fill(false);
  rouSpin=0; rouCur=-1; rouAngle=0; rouSpinning=false;
  matchKeysEarned=0; matchErrors=0;
  $('#rou-spin').textContent='1';
  $('#match-errors').textContent='0';
  $('#rou-card').classList.add('hidden');
  $('#rou-msg').textContent='';
  $('#btn-to-doors').classList.add('hidden');
  $('#btn-spin').classList.remove('hidden');
  buildRoulette();
}

function buildRoulette(){
  const w=$('#roulette'); w.innerHTML='';
  const n=STRUCTURES.length, seg=360/n;
  const cols=[];
  for(let i=0;i<n;i++) cols.push(i%2 ? '#7c4dff' : '#4527a0');
  w.style.background=`conic-gradient(${cols.map((c,i)=>`${c} ${i*seg}deg ${(i+1)*seg}deg`).join(',')})`;
  w.style.transform=`rotate(${rouAngle}deg)`;
  for(let i=0;i<n;i++){
    const s=document.createElement('span');
    s.className='rou-seg'; s.dataset.seg=i; s.textContent=i+1;
    const a=i*seg+seg/2;
    s.style.transform=`rotate(${a}deg) translate(-50%,-112px)`;
    w.appendChild(s);
  }
}

function spinRoulette(){
  if(rouSpinning || rouSpin>=ROULETTE_SPINS) return;
  const avail=[];
  for(let i=0;i<rouDone.length;i++) if(!rouDone[i]) avail.push(i);
  const target=avail[Math.floor(Math.random()*avail.length)];
  rouCur=target; rouDone[target]=true; rouSpin++;
  rouSpinning=true;
  $('#rou-spin').textContent=rouSpin;
  $('#btn-spin').classList.add('hidden');
  sfx('catch');
  const seg=360/STRUCTURES.length;
  const segAngle=target*seg+seg/2;
  // llevar el segmento elegido bajo la flecha (arriba)
  const finalMod=((360-segAngle)%360+360)%360;
  const delta=((finalMod-(rouAngle%360))%360+360)%360 + 360*4 + (Math.random()*10-5);
  rouAngle+=delta;
  const w=$('#roulette');
  w.style.transform=`rotate(${rouAngle}deg)`;
  setTimeout(()=>{ rouSpinning=false; onRouletteStop(); },3700);
}

function onRouletteStop(){
  document.querySelector(`.rou-seg[data-seg="${rouCur}"]`)?.classList.add('used');
  const i=rouStructIdx[rouCur];
  $('#rou-num').textContent='N° '+(rouCur+1);
  $('#rou-fn').textContent=STRUCTURES[i].fn;
  $('#rou-input').value=''; $('#rou-msg').textContent=''; $('#rou-msg').className='rou-msg';
  $('#rou-card').classList.remove('hidden');
  $('#rou-input').focus();
}

function checkRouAnswer(){
  const ans=normAns($('#rou-input').value);
  if(!ans || rouCur<0) return;
  const i=rouStructIdx[rouCur];
  const aliases=ROULETTE_ANSWERS[i];
  const ok=aliases.includes(ans);
  const msg=$('#rou-msg');
  if(!ok && aliases.some(a=>stripAcc(a)===stripAcc(ans))){
    // misma palabra pero sin tilde (o con tilde mal puesta): no es error —
    // se le pide escribirla de nuevo con el acento para fijar la escritura
    msg.textContent='✎ ¡Casi! Esa palabra lleva tilde — escribila de nuevo con el acento.';
    msg.className='rou-msg warn'; sfx('catch');
    $('#rou-input').value=''; $('#rou-input').focus();
    return;
  }
  if(ok){
    matchKeysEarned++;
    updateHudCount(); sfx('key');
    msg.textContent='✔ ¡Correcto!'; msg.className='rou-msg ok';
  }else{
    matchErrors++; state.matchErrorsTotal++;
    $('#match-errors').textContent=matchErrors;
    sfx('wrong');
    msg.textContent='✘ Era: '+STRUCTURES[i].name; msg.className='rou-msg bad';
  }
  $('#rou-card').classList.add('answered');
  setTimeout(()=>{
    $('#rou-card').classList.add('hidden');
    $('#rou-card').classList.remove('answered');
    if(rouSpin<ROULETTE_SPINS){
      $('#btn-spin').classList.remove('hidden');
    }else{
      endRoulette();
    }
  },1700);
}

function endRoulette(){
  state.matchRounds++;
  // llaves al final: 7 aciertos → 2 llaves · 1-2 errores → 1 llave · 3+ → ninguna
  const correctas = ROULETTE_SPINS - matchErrors;
  const tier = matchErrors===0 ? 2 : (matchErrors<=2 ? 1 : 0);
  matchKeysEarned = tier;
  const earned=addKeys(tier); state.keysBy.roulette+=earned;
  state.rouCorrectTotal += correctas;
  updateHudCount(); if(earned>0) sfx('key');
  const doorsBtn=$('#btn-to-doors');
  doorsBtn.classList.remove('hidden');
  doorsBtn.textContent = earned>0
    ? `🚪 Ir a las puertas (${correctas}/7 · ¡ganaste ${earned} llave${earned>1?'s':''}! Tenés ${state.keys})`
    : `🚪 Ir a las puertas (${correctas}/7 · tenés ${state.keys} llave${state.keys===1?'':'s'})`;
}

/* ================= PUERTAS ================= */
const NUM_DOORS=15;
function enterDoors(){
  show('screen-doors');
  state.doorsRound++;
  if(!state.doorsOpened.length){
    state.doorsOpened=Array(NUM_DOORS).fill(false);
  }
  // resiliencia: la salida NO existe en la primera ronda — se ubica recién al
  // volver a jugar, entre las puertas que quedaron cerradas
  if(state.exitDoor===null && state.doorsRound>1){
    const closed=[];
    for(let i=0;i<NUM_DOORS;i++) if(!state.doorsOpened[i]) closed.push(i);
    state.exitDoor=closed[Math.floor(Math.random()*closed.length)];
  }
  renderDoors();
  updateKeysHud();
}

function updateKeysHud(){
  $('#keys-count').textContent=state.keys;
  $('#keys-icons').textContent='🔑'.repeat(state.keys)||'—';
  $('#hud-keys').textContent=`🔑 ${state.keys}`;
  document.querySelectorAll('.js-keys').forEach(e=>e.textContent=state.keys);
  renderFixedKeys();
}

function renderDoors(){
  const g=$('#doors-grid'); g.innerHTML='';
  for(let i=0;i<NUM_DOORS;i++){
    const isExit=i===state.exitDoor, opened=state.doorsOpened[i];
    const d=document.createElement('button');
    d.className='door'+(i%2?' flip':'')+(opened?' open':'')+(!opened && state.keys<=0?' locked':'');
    d.style.animationDelay=(i*35)+'ms';
    // la salida solo se revela al abrir la puerta: todas las cerradas se ven iguales
    const showExit=opened && state.exitDoor!==null && isExit;
    d.innerHTML=`
      <div class="door-inside">
        <img class="in-avatar" src="assets/${showExit?'salida':'no_salida'}.png" alt="${showExit?'Salida':'Esta no es la salida'}">
      </div>
      <div class="door-panel"><span class="door-num">${i+1}</span><span class="door-knob"></span></div>`;
    if(opened){
      d.disabled=true;
    }else if(state.keys<=0){
      d.onclick=()=>{ d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake'); sfx('wrong'); };
    }else{
      d.onclick=()=>openDoor(i,d);
    }
    g.appendChild(d);
  }
  $('#btn-back-keys').classList.toggle('hidden', state.keys>0 || doorsAllOpen());
  updateDoorsHint();
}

function updateDoorsHint(){
  const hint=$('#doors-hint');
  if(state.keys<=0 && !doorsAllOpen()){
    hint.textContent = state.exitDoor===null
      ? 'La salida está muy bien escondida… 🔁 Volvé a jugar: recién en la próxima ronda va a aparecer entre las puertas cerradas.'
      : '¡Te quedaste sin llaves! 🔁 Volvé a jugar para conseguir más y seguir buscando.';
  }else{
    hint.textContent='';
  }
}
function doorsAllOpen(){ return state.doorsOpened.every(x=>x); }

function openDoor(i,el){
  if(state.keys<=0 || state.doorsOpened[i]) return;
  state.keys--; state.doorsTried++; state.doorsOpened[i]=true;
  updateKeysHud();
  sfx('door');
  el.disabled=true;
  setTimeout(()=>el.classList.add('open'),120);   // pequeño "tironeo" antes de abrir
  if(state.exitDoor!==null && i===state.exitDoor){
    const inside=el.querySelector('.door-inside');
    inside.classList.add('exit');
    const av=inside.querySelector('.in-avatar');
    av.src='assets/salida.png'; av.alt='Salida';
    setTimeout(()=>{ sfx('exit'); confettiBurst(); },350);
    setTimeout(finishGame,2000);
    return;
  }
  if(state.keys===0 && !doorsAllOpen()){
    // bloquear el resto y mostrar el botón de volver a jugar
    $$('#doors-grid .door:not(.open)').forEach(d=>{
      d.classList.add('locked');
      d.onclick=()=>{ d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake'); sfx('wrong'); };
    });
    $('#btn-back-keys').classList.remove('hidden');
    updateDoorsHint();
  }
}

// volver a jugar para ganar más llaves (la salida y las puertas abiertas se
// conservan; las células se vuelven a armar para reforzar y poder ganar llaves de nuevo)
function replayForKeys(){
  state.score=0;
  state.placements={animal:{},plant:{}};
  state.cellsCompleted=0; state.animalOk=false; state.plantOk=false;
  state.cellErr={animal:0,plant:0}; state.cellKey={animal:false,plant:false};
  state.countedWrong={animal:{},plant:{}};
  state.cellStage='animal'; state.extraFor='animal';
  levelTargets=shuffle(CAT_KEYS);
  startCatchLevel(0);
}

/* ================= FINAL + PDF ================= */
function finishGame(){
  state.endTime=Date.now();
  const secs=Math.round((state.endTime-state.startTime)/1000);
  const mm=Math.floor(secs/60), ss=secs%60;
  const cellDesc=k=>`${state.cellErr[k]} error${state.cellErr[k]===1?'':'es'} → ${state.cellKey[k]?'1 llave 🔑':'sin llave'}`;
  const errS=n=>`${n} error${n===1?'':'es'}`;
  $('#final-summary').innerHTML=`
    <img src="${state.avatar.img}" alt="${state.avatar.label}">
    <h3>${state.nombre} ${state.apellido} — Sección ${state.seccion}</h3>
    <table>
      <tr><td>Partidas jugadas</td><td>${state.doorsRound}</td></tr>
      <tr><td>Canastas</td><td>${state.totalCaught} aciertos · ${errS(state.decoyErrors)} · puntaje ${state.score} → ${state.keysBy.catch} llave${state.keysBy.catch===1?'':'s'} 🔑</td></tr>
      <tr><td>Célula animal</td><td>${state.animalOk?'correcta':'incompleta'} · ${cellDesc('animal')}</td></tr>
      <tr><td>Célula vegetal</td><td>${state.plantOk?'correcta':'incompleta'} · ${cellDesc('plant')}</td></tr>
      <tr><td>Ruleta</td><td>${state.rouCorrectTotal} aciertos · ${errS(state.matchErrorsTotal)} → ${state.keysBy.roulette} llave${state.keysBy.roulette===1?'':'s'} 🔑</td></tr>
      <tr><td>Llaves totales</td><td>${state.keysEarned}</td></tr>
      <tr><td>Puertas abiertas</td><td>${state.doorsTried}</td></tr>
      <tr><td>Tiempo total</td><td>${mm}m ${ss}s</td></tr>
    </table>`;
  show('screen-final');
}

function generatePDF(){
  const secs=state.endTime?Math.round((state.endTime-state.startTime)/1000):0;
  const mm=Math.floor(secs/60), ss=secs%60;
  const errTxt=n=>`${n} error${n===1?'':'es'}`;
  const cellRow=k=>`${(k==='animal'?state.animalOk:state.plantOk)?'correcta':'incompleta'} · ${errTxt(state.cellErr[k])} · ${state.cellKey[k]?'ganó 1 llave':'sin llave'}`;
  const rows=[
    ['Nombre', `${state.nombre} ${state.apellido}`],
    ['Sección', state.seccion],
    ['Fecha', new Date().toLocaleString('es')],
    ['Partidas jugadas', String(state.doorsRound)],
    ['Canastas', `${state.totalCaught} aciertos · ${errTxt(state.decoyErrors)} · puntaje ${state.score} · ${state.keysBy.catch} llave(s) ganada(s)`],
    ['Célula animal', cellRow('animal')],
    ['Célula vegetal', cellRow('plant')],
    ['Ruleta', `${state.rouCorrectTotal} aciertos de ${state.matchRounds*ROULETTE_SPINS} · ${errTxt(state.matchErrorsTotal)} · ${state.keysBy.roulette} llave(s) ganada(s)`],
    ['Llaves totales', String(state.keysEarned)],
    ['Puertas abiertas', String(state.doorsTried)],
    ['Tiempo total', `${mm}m ${ss}s`],
  ];
  try{
    const { jsPDF } = window.jspdf;
    const doc=new jsPDF();
    let y=32;
    if(logoData){
      const lw=70, lh=lw*logoH/logoW;
      doc.addImage(logoData,'PNG',14,10,lw,lh);
      doc.setFontSize(14); doc.setTextColor(91,63,176);
      doc.text('Reporte del estudiante', 105, 10+lh+9, {align:'center'});
      doc.setFontSize(11); doc.setTextColor(60,60,60);
      y=10+lh+18;
    }else{
      doc.setFontSize(20); doc.setTextColor(91,63,176);
      doc.text('ESCAPE CELULAR — Reporte del estudiante', 14, 18);
      doc.setFontSize(11); doc.setTextColor(60,60,60);
    }
    rows.forEach(([k,v])=>{
      doc.setFont(undefined,'bold'); doc.text(k+':', 14, y);
      doc.setFont(undefined,'normal'); doc.text(String(v), 80, y, {maxWidth:118});
      y+=8;
    });
    // avatar
    try{
      const img=new Image();
      img.onload=()=>{
        try{
          const cv=document.createElement('canvas'); cv.width=cv.height=120;
          cv.getContext('2d').drawImage(img,0,0,120,120);
          doc.addImage(cv.toDataURL('image/png'),'PNG',160,10,36,36);
        }catch(e){}
        doc.save(`resultados_${state.nombre}_${state.apellido}.pdf`);
      };
      img.onerror=()=>doc.save(`resultados_${state.nombre}_${state.apellido}.pdf`);
      img.src=state.avatar.img;
    }catch(e){ doc.save(`resultados_${state.nombre}_${state.apellido}.pdf`); }
  }catch(e){
    // respaldo: imprimir reporte
    const pr=$('#print-report');
    pr.innerHTML=`<h1>ESCAPE CELULAR — Reporte del estudiante</h1>
      <table>${rows.map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>`;
    window.print();
  }
}

/* ================= CONTROLES ================= */
function bindControls(){
  const bl=$('#btn-left'), br=$('#btn-right');
  const on=(el,fn)=>{ el.addEventListener('pointerdown',e=>{e.preventDefault();fn(true);});
                      ['pointerup','pointerleave','pointercancel'].forEach(ev=>el.addEventListener(ev,()=>fn(false))); };
  on(bl,v=>holdLeft=v); on(br,v=>holdRight=v);
  window.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'||e.key==='a') holdLeft=true;
    if(e.key==='ArrowRight'||e.key==='d') holdRight=true;
  });
  window.addEventListener('keyup',e=>{
    if(e.key==='ArrowLeft'||e.key==='a') holdLeft=false;
    if(e.key==='ArrowRight'||e.key==='d') holdRight=false;
  });

  // en la ruleta no se puede copiar la función (clic derecho / Ctrl+C)
  // así el estudiante responde de memoria y no pega la consigna en otro lado
  const matchScr=$('#screen-match');
  matchScr.addEventListener('contextmenu',e=>e.preventDefault());
  matchScr.addEventListener('copy',e=>e.preventDefault());

  $('#btn-verify-cells').onclick=verifyCells;
  $('#btn-collect-more').onclick=()=>{ state.extraFor=state.cellStage; startCatchLevel(0,true); };
  $('#btn-next-cell').onclick=()=>{
    state.cellStage='plant';
    $('#msg-cell').textContent='';
    renderDiagram(); renderTray(); updateCollectMoreBtn(); updateBuildButtons();
  };
  $('#btn-back-animal').onclick=()=>{
    state.cellStage='animal';
    $('#msg-cell').textContent='';
    renderDiagram(); renderTray(); updateCollectMoreBtn(); updateBuildButtons();
  };
  $('#btn-to-match').onclick=()=>{
    verifyAllCells();
    if(state.animalOk && state.plantOk) enterMatch();
    else{
      sfx('wrong');
      const hint=$('#build-keys');
      hint.textContent='⚠️ Todavía hay errores en las células. Usá 🔍 Controlar para ver qué falta o qué no corresponde.';
      $('#btn-to-match').classList.remove('shake'); void $('#btn-to-match').offsetWidth; $('#btn-to-match').classList.add('shake');
      if(!state.animalOk){ state.cellStage='animal'; $('#msg-cell').textContent=''; renderDiagram(); renderTray(); updateBuildButtons(); }
    }
  };
  $('#btn-spin').onclick=spinRoulette;
  $('#btn-rou-check').onclick=checkRouAnswer;
  $('#rou-input').addEventListener('keydown',e=>{ if(e.key==='Enter') checkRouAnswer(); });
  $('#btn-to-doors').onclick=enterDoors;
  $('#btn-back-keys').onclick=replayForKeys;
  $('#btn-lr-continue').onclick=enterBuild;
  $('#btn-pdf').onclick=generatePDF;
  $('#btn-restart').onclick=()=>location.reload();
  window.addEventListener('resize',()=>{ if($('#screen-build').classList.contains('active')) layoutDiagram(); });

  // música de fondo (arranca con el primer toque, se puede silenciar)
  const bgm=$('#bgm'); let musicOn=true;
  document.addEventListener('pointerdown',()=>{ bgm.play().catch(()=>{}); },{once:true});
  $('#btn-mute').onclick=()=>{
    musicOn=!musicOn; bgm.muted=!musicOn; sfxMuted=!musicOn;
    $('#btn-mute').textContent=musicOn?'🔊':'🔇';
    if(musicOn) bgm.play().catch(()=>{});
  };
}

/* ================= INIT ================= */
/* portada: un clic o cualquier tecla pasa a las instrucciones */
let logoData=null, logoW=0, logoH=0;
function initCover(){
  const cover=$('#screen-cover');
  const leave=()=>{ if(cover.classList.contains('active')) show('screen-rules'); };
  cover.addEventListener('click', leave);
  window.addEventListener('keydown', ()=>{ if(cover.classList.contains('active')) leave(); });
  const l=new Image();
  l.onload=()=>{ try{
    logoW=l.width; logoH=l.height;
    const c=document.createElement('canvas'); c.width=l.width; c.height=l.height;
    c.getContext('2d').drawImage(l,0,0); logoData=c.toDataURL('image/png');
  }catch(e){} };
  l.src='assets/logo.png';
}
window.addEventListener('DOMContentLoaded',()=>{
  initCover(); initRegister(); bindControls();
});
