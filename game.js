'use strict';

/* ================= DATOS ================= */
const ORGANELLES = [
  { id:'nucleo',       name:'Núcleo',                    color:'#9b30ff', animal:true,  plant:true  },
  { id:'mitocondrias', name:'Mitocondrias',              color:'#ff6d00', animal:true,  plant:true  },
  { id:'rer',          name:'R. endoplasmático rugoso',  color:'#2196f3', animal:true,  plant:true  },
  { id:'rel',          name:'R. endoplasmático liso',    color:'#00b0ff', animal:true,  plant:true  },
  { id:'golgi',        name:'Aparato de Golgi',          color:'#ff2d55', animal:true,  plant:true  },
  { id:'ribosomas',    name:'Ribosomas',                 color:'#a1662f', animal:true,  plant:true  },
  { id:'lisosomas',    name:'Lisosomas',                 color:'#ffab00', animal:true,  plant:false },
  { id:'centriolos',   name:'Centríolos',                color:'#e040fb', animal:true,  plant:false },
  { id:'cloroplastos', name:'Cloroplastos',              color:'#00c853', animal:false, plant:true  },
  { id:'vacuola',      name:'Vacuola central',           color:'#00b8d4', animal:false, plant:true  },
];
/* Las 5 categorías de pelotitas (solo estructuras de la tabla).
   El cartel muestra el TIPO; las pelotitas dicen el nombre de la estructura. */
const CATEGORIES = {
  organelas: { type:'Organelas' },
  membrana:  { type:'Membrana biológica', label:'Membrana plasmática', color:'#ff5e8a' },
  rigida:    { type:'Estructura rígida',  label:'Pared celular',       color:'#ff9e00' },
  medio:     { type:'Medio interno',      label:'Citoplasma',          color:'#b26bff' },
  red:       { type:'Red de fibras',      label:'Citoesqueleto',       color:'#29d8e0' },
};
const CAT_KEYS = Object.keys(CATEGORIES);
/* colores aleatorios de las pelotitas: el color NO identifica la estructura,
   así el estudiante tiene que leer el nombre */
const BALL_COLORS=['#ff3d5e','#ff9500','#ffd000','#7cfc00','#00c853','#00e5d4','#00b0ff','#2979ff','#7c4dff','#e040fb','#ff2d95','#a1662f'];
/* umbrales de llaves por puntaje al atrapar: 70+ → 3 llaves, 45–69 → 2,
   20–44 → 1, menos → ninguna (~55 pelotitas del objetivo por nivel) */
const KEYS_3=70, KEYS_2=45, KEYS_1=20;

const STRUCTURES = [
  { name:'Membrana plasmática',             fn:'Controla qué sustancias entran y salen de la célula' },
  { name:'Pared celular',                   fn:'Protege y da forma a la célula vegetal' },
  { name:'Citoplasma',                      fn:'Contiene a las organelas y permite que ocurran las reacciones químicas de la célula' },
  { name:'Citoesqueleto',                   fn:'Sostiene la forma de la célula y mueve sus partes internas' },
  { name:'Núcleo',                          fn:'Guarda la información genética y dirige las actividades de la célula' },
  { name:'Retículo endoplasmático rugoso',  fn:'Fabrica proteínas para ser transportadas' },
  { name:'Retículo endoplasmático liso',    fn:'Fabrica grasas y elimina sustancias tóxicas' },
  { name:'Aparato de Golgi',                fn:'Modifica, empaqueta y envía las sustancias de la célula' },
  { name:'Lisosomas',                       fn:'Digiere desechos y partes dañadas de la célula' },
  { name:'Mitocondrias',                    fn:'Libera energía a partir de los nutrientes' },
  { name:'Ribosomas',                       fn:'Fabrica las proteínas de la célula' },
  { name:'Cloroplastos',                    fn:'Usa la luz del sol para transformar agua y dióxido de carbono en alimento' },
  { name:'Vacuola central',                 fn:'Almacena agua y sustancias, y mantiene firme la célula' },
  { name:'Centríolos',                      fn:'Participa en la división de la célula' },
];

const AVATARS = [
  { id:'nucleo',      label:'Núcleo',          img:'assets/nucleo.png' },
  { id:'mitocondria', label:'Mitocondria',     img:'assets/mitocondria.png' },
  { id:'cloroplasto', label:'Cloroplasto',     img:'assets/cloroplasto.png' },
  { id:'golgi',       label:'Aparato de Golgi',img:'assets/golgi.png' },
  { id:'lisosoma',    label:'Lisosoma',        img:'assets/lisosoma.png' },
];

const ANIMAL_REQ = ORGANELLES.filter(o => o.animal).map(o => o.id);
const PLANT_REQ  = ORGANELLES.filter(o => o.plant).map(o => o.id);
const ORG_BY_ID  = Object.fromEntries(ORGANELLES.map(o => [o.id, o]));

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

/* Posiciones de los círculos dentro de cada célula (%) */
const SLOTS_ANIMAL = [
  [50,46],[28,30],[72,30],[24,60],[76,60],[38,74],[62,74],[50,18]
];
const SLOTS_PLANT = [
  [50,50],[26,28],[74,28],[22,62],[78,62],[38,76],[62,76],[50,16]
];

/* ================= ESTADO ================= */
const state = {
  nombre:'', apellido:'', seccion:'', avatar:null,
  inventory:{}, totalCaught:0, decoyErrors:0, score:0,
  placements:{ animal:{}, plant:{} },      // slotIdx -> organelle id
  cellsCompleted:0, animalOk:false, plantOk:false,
  matchRoundErrors:0, matchErrorsTotal:0, matchRounds:0,
  keys:0, exitDoor:null, doorsOpened:[], doorsTried:0, keysEarned:0, doorsRound:0,
  buildHadError:false, cellKeyAwarded:false,
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
function orgName(id){ return ORG_BY_ID[id].name; }
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

function neededOrganelles(){
  const need={};
  const want={};
  ANIMAL_REQ.forEach(id=>want[id]=(want[id]||0)+1);
  PLANT_REQ.forEach(id=>want[id]=(want[id]||0)+1);
  // restar lo ya colocado y lo que hay en inventario
  Object.values(state.placements.animal).forEach(id=>{ if(want[id]) want[id]--; });
  Object.values(state.placements.plant).forEach(id=>{ if(want[id]) want[id]--; });
  Object.entries(state.inventory).forEach(([id,c])=>{ if(want[id]) want[id]-=c; });
  Object.entries(want).forEach(([id,c])=>{ if(c>0) need[id]=c; });
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
  $('#level-result').classList.add('hidden');
  show('screen-catch');
  balls.forEach(b=>b.el.remove()); balls=[];
  playerX=(field().clientWidth-PLAYER_W)/2;
  $('#hud-level').textContent = extra ? 'Ronda extra' : `Nivel ${i+1} de ${NUM_LEVELS}`;
  $('#hud-pips').textContent = extra ? '★' : Array.from({length:NUM_LEVELS},(_,k)=>k<=i?'●':'○').join('');
  $('#hud-timer').textContent=`⏱ ${curLevel.dur}`;
  $('#timebar-fill').style.width='100%';
  $('#catch-goal').innerHTML=`Atrapá: <b>${CATEGORIES[curLevel.target].type}</b>`;
  updateHudCount();
  catchActive=true; levelStarted=false; levelEnd=null; lastSpawn=0;

  const banner=$('#level-banner');
  banner.innerHTML = `¡Nivel ${extra?'extra':i+1}!<br><span style="font-size:1.3rem">Atrapá: <b>${CATEGORIES[curLevel.target].type}</b></span><br><span style="font-size:.95rem">⏱ El tiempo arranca cuando te movés</span>`;
  banner.classList.remove('hidden');

  cancelAnimationFrame(rafId);
  rafId=requestAnimationFrame(catchLoop);
}

function updateHudCount(){
  $('#hud-count').textContent=`🧺 ${state.score}`;
  $('#hud-keys').textContent=`🔑 ${state.keys}`;
  document.querySelectorAll('.js-keys').forEach(e=>e.textContent=state.keys);
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
  const color=BALL_COLORS[Math.floor(Math.random()*BALL_COLORS.length)];
  if(cat==='organelas'){
    const need=Object.keys(neededOrganelles());
    const pool = need.length && Math.random()<0.5 ? need : ORGANELLES.map(o=>o.id);
    const id=pool[Math.floor(Math.random()*pool.length)];
    item={cat, orgId:id, label:ORG_BY_ID[id].name, color};
  }else{
    item={cat, label:CATEGORIES[cat].label, color};
  }
  const w=field().clientWidth;
  const x=10+Math.random()*Math.max(50, w-152);
  const el=document.createElement('div');
  el.className='ball';
  el.innerHTML=`<div class="orb" style="background:${item.color}"></div><div class="ball-label">${item.label}</div>`;
  el.style.left='0px'; el.style.top='0px';
  field().appendChild(el);
  balls.push({el, x, y:-80, item, speed:curLevel.speed*(0.75+Math.random()*0.6)});
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
    const orbCx=b.x+64, orbBot=b.y+62;
    if(orbBot>=bTop && orbBot<=bBot+24 && orbCx>=bL && orbCx<=bR){
      // atrapada
      if(b.item.cat===curLevel.target){
        state.score++; state.totalCaught++;
        if(b.item.cat==='organelas') state.inventory[b.item.orgId]=(state.inventory[b.item.orgId]||0)+1;
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
  let n=3;
  const ids=Object.keys(state.inventory).filter(id=>state.inventory[id]>0);
  while(n>0 && ids.length){
    const id=ids[Math.floor(Math.random()*ids.length)];
    state.inventory[id]--; if(state.inventory[id]<=0){ delete state.inventory[id]; ids.splice(ids.indexOf(id),1); }
    n--;
  }
  if(n>0) state.score=Math.max(0, state.score-n);   // si no hay organelas, descuenta aciertos
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
  if(state.score>=KEYS_3) earned=3;
  else if(state.score>=KEYS_2) earned=2;
  else if(state.score>=KEYS_1) earned=1;
  state.keys+=earned; state.keysEarned+=earned;
  updateHudCount();
  if(earned>0) sfx('key');
  $('#lr-title').textContent='¡Terminaron los 5 niveles!';
  $('#lr-text').innerHTML=`Atrapaste <b>${state.score}</b> pelotitas correctas.<br>`+
    (earned>0 ? `¡Ganaste <b>${earned} llave${earned>1?'s':''}</b>! 🔑` : `No llegaste al puntaje para llaves esta vez.`);
  $('#level-result').classList.remove('hidden');
}

/* ================= ARMAR CÉLULAS ================= */
let selectedChip=null;

function enterBuild(){
  show('screen-build');
  renderCells(); renderTray();
  $('#msg-animal').textContent=''; $('#msg-plant').textContent='';
  updateCollectMoreBtn();
}

function renderCells(){
  [['animal', '#cell-animal', SLOTS_ANIMAL], ['plant', '#cell-plant', SLOTS_PLANT]].forEach(([kind, sel, slots])=>{
    const cell=$(sel); cell.innerHTML='';
    slots.forEach(([px,py],idx)=>{
      const s=document.createElement('div');
      s.className='slot'; s.style.left=px+'%'; s.style.top=py+'%';
      const placed=state.placements[kind][idx];
      if(placed){
        s.classList.add('filled');
        const o=ORG_BY_ID[placed];
        s.innerHTML=`<div class="mini-orb" style="background:${o.color}">${shortName(o.name)}</div>`;
      }
      s.onclick=()=>onSlotClick(kind, idx, s);
      cell.appendChild(s);
    });
  });
}
function shortName(n){ return n.replace('R. endoplasmático','R.E.').replace(' central','').replace('Vacuola','Vacuola'); }

function renderTray(){
  const tray=$('#tray'); tray.innerHTML='';
  const units=[];
  Object.keys(state.inventory).forEach(id=>{
    for(let k=0;k<state.inventory[id];k++) units.push({id, key:id+'-'+k});
  });
  if(!units.length){ tray.innerHTML='<p style="align-self:center;font-weight:700;color:#888">Canasta vacía — ¡recolecta más organelas!</p>'; }
  // una fichita por cada organela atrapada (dos cloroplastos = dos cartelitos)
  units.forEach(({id,key})=>{
    const o=ORG_BY_ID[id];
    const chip=document.createElement('div');
    chip.className='chip'+(selectedChip && selectedChip.key===key?' selected':'');
    chip.innerHTML=`<span class="dot" style="background:${o.color}"></span>${o.name}`;
    chip.onclick=()=>{ selectedChip = (selectedChip&&selectedChip.key===key)?null:{id,key}; renderTray(); };
    tray.appendChild(chip);
  });
}

function onSlotClick(kind, idx, slotEl){
  const placed=state.placements[kind][idx];
  if(placed){
    state.inventory[placed]=(state.inventory[placed]||0)+1;
    delete state.placements[kind][idx];
    renderCells(); renderTray(); updateCollectMoreBtn(); return;
  }
  if(!selectedChip || !state.inventory[selectedChip.id]) return;
  state.placements[kind][idx]=selectedChip.id;
  state.inventory[selectedChip.id]--;
  if(state.inventory[selectedChip.id]<=0) delete state.inventory[selectedChip.id];
  selectedChip=null;
  renderCells(); renderTray(); updateCollectMoreBtn();
}

function updateCollectMoreBtn(){
  const missing=missingRequired();
  $('#btn-collect-more').classList.toggle('hidden', missing.length===0);
  if(missing.length) $('#btn-collect-more').textContent='🧺 Recolectar más organelas';
}

function missingRequired(){
  const missing=[];
  const placedAnimal=new Set(Object.values(state.placements.animal));
  const placedPlant =new Set(Object.values(state.placements.plant));
  const inv=Object.keys(state.inventory);
  const avail=id => (state.inventory[id]||0)>0;
  // organelas que faltan considerando inventario + colocadas
  const allIds=[...ANIMAL_REQ, ...PLANT_REQ];
  const counts={};
  Object.values(state.placements.animal).forEach(id=>counts[id]=(counts[id]||0)+1);
  Object.values(state.placements.plant).forEach(id=>counts[id]=(counts[id]||0)+1);
  allIds.forEach(id=>{
    if(counts[id]===undefined) counts[id]=0;
  });
  // para cada requerida de cada célula: si no está colocada ni disponible → falta
  const needed={};
  ANIMAL_REQ.forEach(id=>{ if(!placedAnimal.has(id)) needed[id]=(needed[id]||0)+1; });
  PLANT_REQ.forEach(id=>{ if(!placedPlant.has(id)) needed[id]=(needed[id]||0)+1; });
  Object.entries(needed).forEach(([id,c])=>{
    const have=state.inventory[id]||0;
    if(have<c) missing.push(orgName(id));
  });
  return missing;
}

function verifyCells(){
  const res={};
  [['animal', ANIMAL_REQ, state.placements.animal, '#msg-animal'],
   ['plant',  PLANT_REQ,  state.placements.plant,  '#msg-plant']].forEach(([kind, req, pl, msgSel])=>{
    const placedIds=Object.values(pl);
    const placedSet=new Set(placedIds);
    const missing=req.filter(id=>!placedSet.has(id));
    const foreign=placedIds.filter(id=>!req.includes(id));
    const msgEl=$(msgSel);
    const slots=$('#cell-'+kind).querySelectorAll('.slot');
    slots.forEach(s=>s.classList.remove('bad'));
    if(missing.length===0 && foreign.length===0){
      res[kind]=true;
      msgEl.textContent='✅ ¡Célula completa y correcta!';
      msgEl.className='cell-msg ok';
    }else{
      res[kind]=false;
      state.buildHadError=true;
      let txt=[];
      if(missing.length) txt.push('Falta: '+missing.map(orgName).join(', '));
      if(foreign.length) txt.push('No corresponde: '+[...new Set(foreign)].map(orgName).join(', '));
      msgEl.textContent='❌ '+txt.join(' · ');
      msgEl.className='cell-msg bad';
      // marcar slots con organelas fuera de lugar
      Object.entries(pl).forEach(([idx,id])=>{
        if(!req.includes(id)) slots[idx].classList.add('bad');
      });
    }
  });
  state.animalOk=!!res.animal; state.plantOk=!!res.plant;
  state.cellsCompleted=(res.animal?1:0)+(res.plant?1:0);
  // llave extra si armó ambas células sin equivocarse
  if(res.animal && res.plant && !state.buildHadError && !state.cellKeyAwarded){
    state.cellKeyAwarded=true; state.keys+=1; state.keysEarned+=1;
    updateHudCount(); sfx('key');
    $('#build-keys').textContent='🔑 ¡Células perfectas! Ganaste 1 llave extra.';
  }else{
    $('#build-keys').textContent='';
  }
}

/* ================= EMPAREJAR ================= */
let matchSel=null, matchSelColor='', matchPairs=0, matchErrors=0, matchBlocks=[], matchBlockIdx=0;
let pairColorIdx=0, blockStartErrors=0, matchKeysEarned=0;
const BLOCK_SIZES=[5,5,4], DISTRACTORS_PER_BLOCK=2;
/* cada pareja estructura-función correcta queda marcada con el mismo color */
const PAIR_COLORS=['#ffd93b','#ff9e6b','#7ee08a','#6ec6ff','#ce93d8','#ff8fb3','#4dd0e1','#fff176','#a8e063','#f48fb1'];

function enterMatch(){
  show('screen-match');
  matchErrors=0; matchBlockIdx=0; pairColorIdx=0; blockStartErrors=0; matchKeysEarned=0;
  // repartir las 14 estructuras en tres bloques de 5, 5 y 4 (aleatorio)
  const idxs=shuffle(STRUCTURES.map((s,i)=>i));
  matchBlocks=[idxs.slice(0,BLOCK_SIZES[0]), idxs.slice(BLOCK_SIZES[0],BLOCK_SIZES[0]+BLOCK_SIZES[1]), idxs.slice(BLOCK_SIZES[0]+BLOCK_SIZES[1])];
  renderMatchBlock();
}

function renderMatchBlock(){
  matchSel=null; matchPairs=0; blockStartErrors=matchErrors;
  $('#match-block').textContent=matchBlockIdx+1;
  $('#match-errors').textContent=matchErrors;
  $('#match-keys').textContent=matchKeysEarned;
  $('#btn-to-doors').classList.add('hidden');
  $('#btn-retry-match').classList.add('hidden');
  $('#btn-next-block').classList.add('hidden');
  const left=$('#match-left'), right=$('#match-right');
  left.innerHTML=''; right.innerHTML='';
  const block=matchBlocks[matchBlockIdx];
  // funciones: las del bloque + 2 distractoras de estructuras de otros bloques
  const notInBlock=STRUCTURES.map((s,i)=>i).filter(i=>!block.includes(i));
  const distractors=shuffle(notInBlock).slice(0,DISTRACTORS_PER_BLOCK);
  const rightItems=shuffle([...block.map(i=>({idx:i,decoy:false})), ...distractors.map(i=>({idx:i,decoy:true}))]);
  block.forEach(i=>{
    const el=document.createElement('div');
    el.className='match-item'; el.textContent=STRUCTURES[i].name; el.dataset.idx=i;
    el.onclick=()=>{
      if(el.classList.contains('done')) return;
      left.querySelectorAll('.match-item').forEach(x=>{ x.classList.remove('selected'); if(!x.classList.contains('done')) x.style.background=''; });
      // cada estructura elegida recibe un color distinto
      matchSelColor=PAIR_COLORS[pairColorIdx++ % PAIR_COLORS.length];
      el.classList.add('selected'); el.style.background=matchSelColor;
      matchSel=i;
    };
    left.appendChild(el);
  });
  rightItems.forEach(({idx,decoy})=>{
    const el=document.createElement('div');
    el.className='match-item fn'+(decoy?' decoy-fn':''); el.textContent=STRUCTURES[idx].fn; el.dataset.idx=idx;
    el.onclick=()=>{
      if(matchSel===null || el.classList.contains('done')) return;
      const leftEl=left.querySelector(`.match-item[data-idx="${matchSel}"]`);
      if(Number(el.dataset.idx)===matchSel){
        el.classList.add('done'); leftEl.classList.add('done'); leftEl.classList.remove('selected');
        el.style.background=matchSelColor; leftEl.style.background=matchSelColor;
        matchSel=null; matchSelColor=''; matchPairs++;
        if(matchPairs===block.length) finishMatchBlock();
      }else{
        matchErrors++; state.matchErrorsTotal++;
        $('#match-errors').textContent=matchErrors;
        el.classList.add('wrong'); el.style.background='#ffcdd2';
        leftEl.classList.add('wrong'); leftEl.style.background='#ffcdd2';
        setTimeout(()=>{
          el.classList.remove('wrong'); el.style.background='';
          leftEl.classList.remove('wrong'); leftEl.classList.remove('selected'); leftEl.style.background='';
        },450);
        matchSel=null; matchSelColor='';
      }
    };
    right.appendChild(el);
  });
}

function finishMatchBlock(){
  // revelar las distractoras que quedaron sin pareja
  document.querySelectorAll('#match-right .match-item.decoy-fn:not(.done)').forEach(el=>{
    el.classList.add('revealed');
    el.textContent='🚫 '+el.textContent;
  });
  if(matchBlockIdx<matchBlocks.length-1){
    $('#btn-next-block').classList.remove('hidden');
  }else{
    state.matchRounds++;
    // 1 llave por BLOQUE completado con 0 o 1 error (hasta 3 en total)
    const blockErr=matchErrors-blockStartErrors;
    const earned = blockErr<=1 ? 1 : 0;
    matchKeysEarned+=earned;
    state.keys+=earned; state.keysEarned+=earned;
    updateHudCount(); if(earned>0) sfx('key');
    $('#match-keys').textContent=matchKeysEarned;
    const doorsBtn=$('#btn-to-doors');
    doorsBtn.classList.remove('hidden');
    doorsBtn.textContent = matchKeysEarned>0
      ? `🚪 Ir a las puertas (¡ganaste ${matchKeysEarned} llave${matchKeysEarned>1?'s':''}! Tenés ${state.keys})`
      : `🚪 Ir a las puertas (tenés ${state.keys} llave${state.keys===1?'':'s'})`;
  }
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
}

function renderDoors(){
  const g=$('#doors-grid'); g.innerHTML='';
  for(let i=0;i<NUM_DOORS;i++){
    const isExit=i===state.exitDoor, opened=state.doorsOpened[i];
    const d=document.createElement('button');
    d.className='door'+(i%2?' flip':'')+(opened?' open':'')+(!opened && state.keys<=0?' locked':'');
    d.style.animationDelay=(i*35)+'ms';
    const showExit=state.exitDoor!==null && isExit;
    d.innerHTML=`
      <div class="door-inside${showExit?' exit':''}">
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

// volver a jugar para ganar más llaves (la salida y las puertas abiertas se conservan)
function replayForKeys(){
  state.score=0;
  levelTargets=shuffle(CAT_KEYS);
  startCatchLevel(0);
}

/* ================= FINAL + PDF ================= */
function finishGame(){
  state.endTime=Date.now();
  const secs=Math.round((state.endTime-state.startTime)/1000);
  const mm=Math.floor(secs/60), ss=secs%60;
  const cellsDesc=[state.animalOk?'animal ✔':'animal ✘', state.plantOk?'vegetal ✔':'vegetal ✘'].join(' · ');
  $('#final-summary').innerHTML=`
    <img src="${state.avatar.img}" alt="${state.avatar.label}">
    <h3>${state.nombre} ${state.apellido} — Sección ${state.seccion}</h3>
    <table>
      <tr><td>Avatar</td><td>${state.avatar.label}</td></tr>
      <tr><td>Pelotitas correctas atrapadas</td><td>${state.totalCaught}</td></tr>
      <tr><td>Errores (pelotitas incorrectas)</td><td>${state.decoyErrors}</td></tr>
      <tr><td>Células completas</td><td>${state.cellsCompleted} de 2 (${cellsDesc})</td></tr>
      <tr><td>Errores en emparejamiento</td><td>${state.matchErrorsTotal}</td></tr>
      <tr><td>Llaves obtenidas</td><td>${state.keysEarned}</td></tr>
      <tr><td>Puertas abiertas</td><td>${state.doorsTried}</td></tr>
      <tr><td>Tiempo total</td><td>${mm}m ${ss}s</td></tr>
    </table>`;
  show('screen-final');
}

function generatePDF(){
  const secs=state.endTime?Math.round((state.endTime-state.startTime)/1000):0;
  const mm=Math.floor(secs/60), ss=secs%60;
  const rows=[
    ['Nombre', `${state.nombre} ${state.apellido}`],
    ['Sección', state.seccion],
    ['Avatar elegido', state.avatar.label],
    ['Organelas atrapadas', String(state.totalCaught)],
    ['Errores al atrapar (pelotitas incorrectas)', String(state.decoyErrors)],
    ['Célula animal completa', state.animalOk?'Sí':'No'],
    ['Célula vegetal completa', state.plantOk?'Sí':'No'],
    ['Células completas', `${state.cellsCompleted} de 2`],
    ['Errores en emparejamiento estructura-función', String(state.matchErrorsTotal)],
    ['Rondas de emparejamiento jugadas', String(state.matchRounds)],
    ['Llaves obtenidas', String(state.keysEarned)],
    ['Puertas abiertas hasta encontrar la salida', String(state.doorsTried)],
    ['Tiempo total de juego', `${mm}m ${ss}s`],
    ['Fecha', new Date().toLocaleString('es')],
  ];
  try{
    const { jsPDF } = window.jspdf;
    const doc=new jsPDF();
    let y=32;
    if(logoData){
      const lw=92, lh=lw*logoH/logoW;
      doc.addImage(logoData,'PNG',(210-lw)/2,8,lw,lh);
      doc.setFontSize(14); doc.setTextColor(91,63,176);
      doc.text('Reporte del estudiante', 105, 8+lh+9, {align:'center'});
      doc.setFontSize(11); doc.setTextColor(60,60,60);
      y=8+lh+18;
    }else{
      doc.setFontSize(20); doc.setTextColor(91,63,176);
      doc.text('ESCAPE CELULAR — Reporte del estudiante', 14, 18);
      doc.setFontSize(11); doc.setTextColor(60,60,60);
    }
    rows.forEach(([k,v])=>{
      doc.setFont(undefined,'bold'); doc.text(k+':', 14, y);
      doc.setFont(undefined,'normal'); doc.text(String(v), 95, y);
      y+=8;
    });
    // organelas recolectadas
    y+=4; doc.setFont(undefined,'bold'); doc.text('Organelas recolectadas:',14,y); y+=7;
    doc.setFont(undefined,'normal');
    const inv=Object.entries(state.inventory);
    if(!inv.length){ doc.text('—',14,y); y+=7; }
    inv.forEach(([id,c])=>{ doc.text(`• ${orgName(id)}: ${c}`,18,y); y+=6; });
    // placements finales
    const placedA=[...new Set(Object.values(state.placements.animal))].map(orgName);
    const placedP=[...new Set(Object.values(state.placements.plant))].map(orgName);
    y+=4; doc.setFont(undefined,'bold'); doc.text('Organelas colocadas en la célula animal:',14,y); y+=7; doc.setFont(undefined,'normal');
    doc.text(placedA.join(', ')||'—',18,y,{maxWidth:170}); y+=doc.getTextDimensions(placedA.join(', ')||'—',{maxWidth:170}).h+4;
    doc.setFont(undefined,'bold'); doc.text('Organelas colocadas en la célula vegetal:',14,y); y+=7; doc.setFont(undefined,'normal');
    doc.text(placedP.join(', ')||'—',18,y,{maxWidth:170});
    // avatar
    try{
      const img=new Image();
      img.onload=()=>{
        try{
          const cv=document.createElement('canvas'); cv.width=cv.height=120;
          cv.getContext('2d').drawImage(img,0,0,120,120);
          doc.addImage(cv.toDataURL('image/png'),'PNG',163,8,36,36);
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

  $('#btn-verify-cells').onclick=verifyCells;
  $('#btn-collect-more').onclick=()=>startCatchLevel(0,true);
  $('#btn-to-match').onclick=()=>{
    verifyCells();
    if(state.animalOk && state.plantOk) enterMatch();
    else{
      sfx('wrong');
      const hint=$('#build-keys');
      hint.textContent='⚠️ Todavía hay errores en las células. Usá 🔍 Controlar para ver qué falta o qué no corresponde.';
      $('#btn-to-match').classList.remove('shake'); void $('#btn-to-match').offsetWidth; $('#btn-to-match').classList.add('shake');
    }
  };
  $('#btn-next-block').onclick=()=>{ matchBlockIdx++; renderMatchBlock(); };
  $('#btn-to-doors').onclick=enterDoors;
  $('#btn-retry-match').onclick=enterMatch;
  $('#btn-back-keys').onclick=replayForKeys;
  $('#btn-lr-continue').onclick=enterBuild;
  $('#btn-pdf').onclick=generatePDF;
  $('#btn-restart').onclick=()=>location.reload();

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
