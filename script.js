// --- State ---
const S = JSON.parse(localStorage.getItem("abg_state")||"null")||{
  lvl:1, hp:10, maxHp:10, gold:0,
  enemy:{name:"Schleim", hp:5, maxHp:5, base:5},
  auto:false
};

const el = s => document.querySelector(s);
const statsEl = el("#stats"), eBox = el("#enemy"), logEl = el("#log");
const btnAtk = el("#atk"), btnAuto = el("#auto"), btnSave = el("#save"), btnReset = el("#reset");

// --- UI ---
function draw(){
  statsEl.textContent = `Lvl ${S.lvl} | HP ${S.hp}/${S.maxHp} | Gold ${S.gold}`;
  eBox.querySelector(".name").textContent = S.enemy.name;
  eBox.querySelector(".hp").textContent = `HP ${S.enemy.hp}/${S.enemy.maxHp}`;
  btnAuto.textContent = `Auto: ${S.auto?"AN":"AUS"}`;
}
function log(t){ const p=document.createElement("div"); p.textContent = t; logEl.prepend(p); }

// --- Core ---
function attack(){
  const dmg = 1 + Math.floor(S.lvl/3);
  S.enemy.hp = Math.max(0, S.enemy.hp - dmg);
  log(`Du triffst ${S.enemy.name} für ${dmg}.`);
  if(S.enemy.hp===0){ kill(); }
  draw();
}
function kill(){
  const gold = 1 + S.lvl;
  S.gold += gold;
  log(`${S.enemy.name} besiegt! +${gold} Gold.`);
  // simple scaling
  const nMax = Math.ceil(S.enemy.base * (1 + S.lvl*0.2));
  S.enemy = {name:"Schleim", hp:nMax, maxHp:nMax, base:S.enemy.base};
  if(++tickKills % 5 === 0){ S.lvl++; S.maxHp+=2; S.hp=S.maxHp; log(`Level UP → Lvl ${S.lvl}`); }
}
let tickTimer=null, tickKills=0;
function loop(){
  // passiv: kleiner Heal
  if(S.hp < S.maxHp){ S.hp++; draw(); }
}
function startAuto(){
  stopAuto();
  tickTimer = setInterval(()=>{ attack(); loop(); save(); }, 800);
}
function stopAuto(){ if(tickTimer){ clearInterval(tickTimer); tickTimer=null; } }

// --- Persistence ---
function save(){ localStorage.setItem("abg_state", JSON.stringify(S)); }
function reset(){
  localStorage.removeItem("abg_state"); location.reload();
}

// --- Events ---
btnAtk.onclick = ()=>{ attack(); loop(); save(); };
btnAuto.onclick = ()=>{
  S.auto = !S.auto; S.auto?startAuto():stopAuto(); draw(); save();
};
btnSave.onclick = ()=>{ save(); log("Gespeichert."); };
btnReset.onclick = ()=>{ if(confirm("Alles zurücksetzen?")) reset(); };

// --- Init ---
draw(); if(S.auto) startAuto(); log("Willkommen! Tippe auf Angriff oder aktiviere Auto.");