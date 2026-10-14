(function(){
const $=i=>document.getElementById(i),R=Math.random;
const DEVS={pc:{n:'PC',amb:0,fl:1,lk:1,fog:1,vig:.75,pr:1.5,note:'Keyboard and mouse. The game as it was made.'},
chromebook:{n:'Chromebook',amb:.2,fl:1.4,lk:1.6,fog:.72,vig:.4,pr:1.1,note:'Much brighter halls, a lighter picture, and menus that fit small screens.'},
mobile:{n:'Mobile',amb:.3,fl:1.75,lk:2,fog:.58,vig:.28,pr:1,note:'Bright halls and Granny-style touch controls: left stick moves, drag the right side to look. Play in landscape.'}};
const autoDev=()=>{try{if(matchMedia('(pointer:coarse)').matches&&!matchMedia('(pointer:fine)').matches)return'mobile'}catch(e){}return'pc'};
const DEF={dev:autoDev(),sens:1,vol:.8,fov:72,bob:true,grain:true,cmus:true,invy:false,hints:true,diff:1,safe:true},MAXD=3;
let SET=Object.assign({},DEF);try{Object.assign(SET,JSON.parse(localStorage.getItem('lh2')))}catch(e){}
if(!DEVS[SET.dev])SET.dev='pc';const DV=()=>DEVS[SET.dev]||DEVS.pc;
const mt=s=>SET.dev!=='mobile'||!s?s:s.replace(/\[HOLD E\]/g,'[HOLD USE]').replace(/\[E\]/g,'[USE]').replace(/Hold E\b/g,'Hold USE').replace(/ ?\(C\)/g,'').replace(/SPACE TO DROP/g,'TAP DROP');
let JOY={x:0,z:0},lastTv=false;
const DIFF=[
{n:'Easy',spd:.8,hear:9,sight:26,amb:.1,d:['The Boiled One is slower than your sprint all game','He only hears you up close','The halls are a little brighter']},
{n:'Normal',spd:1,hear:11,sight:34,amb:0,d:['Faster than your walk, slower than your sprint','Hears sprinting from a room away','The way it was meant to be']},
{n:'Hard',spd:1.15,hear:14,sight:42,amb:-.05,d:['Faster than your sprint once you hold all 4 fuses','Sprinting carries far','Darker halls']},
{n:'Nightmare',spd:1.35,hear:18,sight:52,amb:-.1,d:['Faster than your sprint by the second fuse','He hears almost everything','Almost no light. Lockers are your only friend']}];
let scene,cam,ren,clock,en,amb,fl,keys=0,state='menu',started=false,stam=1,yaw=0,pitch=0,bob=0,stepT=0,beatT=0,eStep=0,eventT=15,blackout=0,msgT=0,time=0,H=null,hideT=0,wasCh=false,scareT=0,from='menu',grace=0,lockTry=0,mxn=0,myn=0,bat=1,bot=0,hasKey=false,bats=0,sel='bottle',crouch=0,fovK=1,day=1,RUN=null,wakeT=0,W0=.5,wk=0,HELD={},kick=0,SC=null,nNotes=0,proj=[],noteT=0,dust=null,fon=true,NT=6,MP=false,mpPlay=false,dead=false,escd=false,paused=false,av={},specId=null,dying={},ending=false,poseT=0,enT=0,chkT=0,pendKill=false,enNet=null,WOFF={x:0,z:0},lastEStr='',fovCur=72,lastLock=0,visYaw=0,visPitch=0,snapT=0,vp={x:0,y:0,z:0},prMax=1,prCur=1,lastESent=0,enS={buf:null,off:null,lastTs:null,sp:80};
const FY=()=>Level.fy(P.fl),bodies=[];
let exh=0,vfade=0,vk=0,vHint=0,VO=new Set(),trapT=0,scT=30,wReady=0,SEED=0,autoT=0,crouchOn=false,V=null,hasSD=false,py=0,stairFx=null,ventSnd=0;const newSeed=()=>((Math._r||Math.random)()*4294967296)>>>0,ORD=['FIRST','SECOND','THIRD','FOURTH','FIFTH'];
const _e={};function ws(id,p,v){const e=_e[id]||(_e[id]=document.getElementById(id));if(e.style[p]!==v)e.style[p]=v}
const P={x:0,z:0,noisy:false,hidden:false,lk:null,yaw:0,pid:null,fl:0},KEYS={};
const RK='lhrun',loadRun=()=>{try{return JSON.parse(sessionStorage.getItem(RK))}catch(e){return null}},saveRun=r=>{try{r?sessionStorage.setItem(RK,JSON.stringify(r)):sessionStorage.removeItem(RK)}catch(e){}};
const DAYT=['The power failed in the night. Find the fuses.','Second day. The same halls. He is faster, and he remembers you.','The last day. There will not be another.'];
const ease=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u)};
const LID=[[0,0],[.8,0],[1.5,.2],[2.0,.04],[2.8,.5],[3.2,.3],[4.1,1],[99,1]],lidK=t=>{for(let i=1;i<LID.length;i++){if(t<=LID[i][0]){const a=LID[i-1],b=LID[i],u=(t-a[0])/(b[0]-a[0]);return a[1]+(b[1]-a[1])*ease(u)}}return 1};
const say=(t,ms=3500)=>{const m=$('msg');m.textContent=mt(t);m.style.opacity=1;clearTimeout(msgT);msgT=setTimeout(()=>m.style.opacity=0,ms)};
const save=()=>{try{localStorage.setItem('lh2',JSON.stringify(SET))}catch(e){}};
const fmt=t=>Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');
const show=id=>$(id).classList.remove('hidden'),hide_=id=>$(id).classList.add('hidden');
function apply(){const D=DIFF[curDiff()],O=DIFF[SET.diff];if(amb)Level.safe=!!SET.safe;amb.intensity=Math.max(.02,.1+D.amb*.4+DV().amb);Level.lk=DV().lk;
 ['pc','chromebook','mobile'].forEach(k=>document.body.classList.toggle('dev-'+k,SET.dev===k));const md=$('mDev');if(md)md.textContent='Device: '+DV().n+' \u203a';
 if(ren){prMax=Math.min(devicePixelRatio||1,DV().pr);if(prCur>prMax)setPR(prMax)}try{if(scene&&scene.fog&&Level.theme&&state==='play')scene.fog.density=Level.theme.fog*DV().fog}catch(e){}
Aud.vol=SET.vol;Aud.setVol(SET.vol);Aud.cm=SET.cmus;$('grain').style.display=SET.grain?'':'none';$('grain').style.animation=SET.safe?'none':'';
 const dn=$('dName');if(dn){dn.textContent='Difficulty - '+O.n;$('dBox').innerHTML=`<h4>Difficulty: ${O.n}</h4><ul>${O.d.map(x=>`<li>${x}</li>`).join('')}</ul>`}}
function buildOpts(){const cb=(k,t)=>`<label class="cb"><input type="checkbox" data-k="${k}"><i></i><span>${t}</span></label>`,sl=(k,t,a,b,s)=>`<label class="sl"><span>${t}</span><input type="range" data-k="${k}" min="${a}" max="${b}" step="${s}"></label>`;
 $('optBox').innerHTML=`<div class="col"><h3>Device</h3><div class="devs">${Object.keys(DEVS).map(k=>`<button class="dv${SET.dev===k?' on':''}" data-dev="${k}">${DEVS[k].n}</button>`).join('')}</div><div id="devNote">${DV().note}</div><h3>General</h3><div class="cbs">${cb('grain','Film grain')}${cb('bob','Head bob')}${cb('cmus','Chase music')}${cb('invy','Invert Y')}${cb('hints','Prompts')}${cb('safe','Reduce flashing (photosensitivity)')}</div>
 <h3>Audio &amp; View</h3>${sl('vol','Audio volume',0,1,.05)}${sl('sens','Look sensitivity',.4,2.5,.05)}${sl('fov','Field of view',60,100,1)}</div>
 <div class="col"><div id="dName"></div>${sl('diff','',0,3,1)}<div id="dBox"></div><button class="rs" id="rs">Reset to defaults</button></div>`;
 const bind=()=>document.querySelectorAll('[data-k]').forEach(e=>{const k=e.dataset.k;if(e.type==='checkbox')e.checked=!!SET[k];else e.value=SET[k];
  e.oninput=()=>{SET[k]=e.type==='checkbox'?e.checked:+e.value;save();apply()}});bind();document.querySelectorAll('[data-dev]').forEach(b=>b.onclick=()=>{SET.dev=b.dataset.dev;save();apply();buildOpts()});$('rs').onclick=()=>{SET=Object.assign({},DEF);save();bind();apply();buildOpts()}}
function init(){
 cam=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.05,55);cam.rotation.order='YXZ';
 ren=new THREE.WebGLRenderer({canvas:$('gl'),antialias:true});prMax=prCur=Math.min(devicePixelRatio||1,1.5);ren.setPixelRatio(prCur);ren.setSize(innerWidth,innerHeight);
 amb=new THREE.AmbientLight(0x3a2c22,.14);
 fl=new THREE.SpotLight(0xffe2b0,2.1,24,.52,.62,1.4);cam.add(fl);fl.position.set(0,0,0);const tg=new THREE.Object3D();tg.position.set(0,0,-1);cam.add(tg);fl.target=tg;
 {const r0=loadRun();SEED=r0&&r0.seed!=null?r0.seed:newSeed();if(r0&&r0.vo)VO=new Set(r0.vo)}mkWorld(SEED,true);HELD=Props.held();for(const k in HELD){HELD[k].visible=false;HELD[k].position.set(.27,-.27,-.52);cam.add(HELD[k])}clock=new THREE.Clock();Menu3D.init();buildOpts();apply();
 addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();ren.setSize(innerWidth,innerHeight)});
 addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;KEYS[e.code]=1;if(e.code==='Escape'&&(state==='pause'||paused)&&!$('pause').classList.contains('hidden'))return resume();if(state==='spec'&&!paused){if(e.code==='ArrowRight'||e.code==='KeyD')specNext(1);if(e.code==='ArrowLeft'||e.code==='KeyA')specNext(-1)}if(state!=='play'||paused)return;
  if(e.code==='KeyF'&&!H){fon=!fon;Aud.tone(fon&&bat>0?1200:700,.05,'square',.1)}if(e.code==='KeyG'&&!H&&!V)throwHeld();if(e.code==='KeyE')interact();if((e.code==='KeyC'||e.code==='ControlLeft')&&!e.repeat&&!H&&!V)crouchOn=!crouchOn;if((e.code==='KeyQ'||e.code==='Space')&&!H){e.preventDefault();if(!V)dropItem()}if(e.code==='KeyR'&&!H)useBattery();if(e.code==='Digit1')selItem('bottle');if(e.code==='Digit2')selItem('battery');if(e.code==='Digit3')selItem('key');if(e.code==='ControlLeft'||e.code==='ControlRight')e.preventDefault();if(e.code==='KeyP')pause()});
 addEventListener('keyup',e=>KEYS[e.code]=0);
 addEventListener('wheel',e=>{if(state!=='play'||H||paused)return;const a=['bottle','battery','key'].filter(t=>cnt(t)>0);if(a.length<2)return;const i=a.indexOf(sel);sel=a[(i+(e.deltaY>0?1:a.length-1))%a.length];hud()},{passive:true});
 addEventListener('mousemove',e=>{mxn=e.clientX/innerWidth-.5;myn=e.clientY/innerHeight-.5;if(document.pointerLockElement&&state==='play'&&!paused){const dx=e.movementX||0,dy=e.movementY||0;if(performance.now()-lastLock<150||Math.abs(dx)>450||Math.abs(dy)>450)return;/* browsers sometimes report one huge bogus delta right after (re)locking: that was the camera flick */yaw-=dx*.0022*SET.sens;pitch=Math.max(-1.4,Math.min(1.4,pitch+(SET.invy?1:-1)*dy*.0022*SET.sens))}});
 document.addEventListener('pointerdown',()=>{if(!Aud.ctx){Aud.init();apply()}},{once:true});
 document.addEventListener('click',()=>{if(state==='spec'&&!paused)return specNext(1);if((state==='play'||state==='wake')&&!paused&&!document.pointerLockElement)lock()});
 document.addEventListener('pointerlockchange',()=>{if(document.pointerLockElement){lastLock=performance.now();hide_('lockhint')}else if(state==='play'&&performance.now()>grace)pause()});
 const away=()=>{Aud.fade(false);if(!MP)pause()};
 document.addEventListener('visibilitychange',()=>document.hidden?away():Aud.fade(true));addEventListener('blur',away);addEventListener('focus',()=>{if(!document.hidden)Aud.fade(true)});
 document.querySelectorAll('.gb').forEach(b=>b.addEventListener('mouseenter',()=>{if(Aud.ctx&&Aud.ctx.state==='running')Aud.tone(170,.08,'sine',.08)}));
 $('mDev').onclick=()=>{const o=Object.keys(DEVS);SET.dev=o[(o.indexOf(SET.dev)+1)%o.length];save();apply();buildOpts()};bindTouch();
 $('start').onclick=begin;$('mSet').onclick=()=>openSet('menu');$('pRes').onclick=resume;
 $('mHow').onclick=()=>{hide_('menu');show('how')};$('hBack').onclick=()=>{hide_('how');show('menu')};
 $('sBack').onclick=()=>{hide_('settings');show(from)};$('mQuit').onclick=()=>{show('quit');setTimeout(()=>hide_('quit'),2200)};

 $('dayGo').onclick=begin;$('dayNew').onclick=toMenu;$('pAb').onclick=()=>{if(MP)return mpLeave();toMenu()};
 {const r=loadRun();if(r&&r.day>=1&&r.day<=MAXD)showDay(r);else RUN=null}
 let seen=false;try{seen=!!localStorage.getItem('lhw')}catch(e){}if(!seen)try{seen=!!sessionStorage.getItem('lhw')}catch(e){}show('warn');
 const wok=()=>{try{localStorage.setItem('lhw','1')}catch(e){}try{sessionStorage.setItem('lhw','1')}catch(e){}hide_('warn')};$('wOk').onclick=wok;$('wSafe').onclick=()=>{SET.safe=true;save();buildOpts();apply();wok()};
 window.LHHook={compile:()=>{ren.compile(scene,cam);ren.render(scene,cam);if(Menu3D.scene)ren.compile(Menu3D.scene,Menu3D.cam)}};
 bindMP();window.__loopOn=true;loop()}
function openSet(f){from=f;hide_(f);show('settings')}
function lock(){if(SET.dev==='mobile')return;try{const p=ren.domElement.requestPointerLock();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
function begin(){if(!Aud.ctx){Aud.init();apply()}if(SET.dev==='mobile')goFS();Aud.fade(true);Aud.level(1);hide_('menu');hide_('dayscr');hide_('lobby');hide_('mpmenu');show('hud');show('lids');started=true;state='wake';wakeT=0;wk=0;W0=(MP?day>1:RUN)?.6:2.8;WOFF=MP?spawnOff():{x:0,z:0};grace=performance.now()+9000;fon=true;fl.intensity=0;
 if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();floorLook();lock();if(!(MP?day>1:RUN))show('card');hud()}
const lidSet=o=>{const h=(1-o)*52+'%',c=$('lids').children;c[0].style.height=h;c[1].style.height=h};
function endWake(){const st=Level.start;state='play';wk=9;fovCur=SET.fov;snapT=0;P.x=st.x+WOFF.x;P.z=st.z+WOFF.z;yaw=st.yaw;pitch=0;ren.domElement.style.filter='';hide_('lids');grace=performance.now()+1500;if(!document.pointerLockElement)show('lockhint');say(day===1?'Find the fuses.':DAYT[day-1],4500);hud()}
function updWake(dt){wakeT+=dt;const t=wakeT-W0,st=Level.start,n=[-st.s[0],-st.s[1]];en.anim(dt);Props.update(dt,wakeT,P);Level.updLights(st.x,st.z,dt,0,wakeT);updDust(dt);
 const o=t<0?0:lidK(t),sit=ease((t-3.1)/1.6),stand=ease((t-4.6)/1.6);lidSet(o);
 ren.domElement.style.filter=t>5.6?'':`blur(${Math.max(0,(1-o)*10+Math.max(0,1-t/5.6)*6).toFixed(1)}px) brightness(${(.4+.6*Math.min(1,o*1.5)).toFixed(2)}) saturate(${(.5+.5*Math.min(1,t/4)).toFixed(2)})`;
 let x=st.bx+n[0]*.4*sit,z=st.bz+n[1]*.4*sit,y=.84+.36*sit;x+=(st.x+WOFF.x-x)*stand;z+=(st.z+WOFF.z-z)*stand;y+=(1.65-y)*stand;
 const pt=(1.25*(1-sit)+.3*sit)*(1-stand);
 if(t>0&&!(wk&1)){wk|=1;Aud.wake()}if(t>3.1&&!(wk&2)){wk|=2;Aud.rustle()}
 if(t>3.7&&!(wk&4)){wk|=4;const b=$('daybn');b.textContent='DAY '+day;b.classList.remove('show');void b.offsetWidth;b.classList.add('show')}
 if(stand>.9&&!(wk&8)){wk|=8;Aud.tone(1200,.05,'square',.1)}
 if(t>0&&t<4){beatT-=dt;if(beatT<=0){Aud.beat(.7);beatT=.95}}
 fl.intensity=stand>.9?(R()<.15&&!SET.safe?.6:2.1)*DV().fl:0;
 cam.position.set(x,y+FY()+Math.sin(wakeT*1.4)*.01,z);cam.rotation.set(pt+Math.sin(wakeT*.9)*.03,st.yaw+(1-stand)*.4*Math.sin(wakeT*.6),Math.sin(wakeT*1.3)*.05*(1-stand)+(1-sit)*.05);cam.fov=SET.fov;cam.updateProjectionMatrix();
 $('stamfill').style.width='100%';if(t>6.2)endWake()}
function pause(){if(MP){if((state!=='play'&&state!=='spec')||paused)return;paused=true;for(const k in KEYS)KEYS[k]=0;document.exitPointerLock();$('pFuses').textContent=`DAY ${day}  ·  FUSES ${keys}/4`;$('pTime').textContent=fmt(time);hide_('lockhint');$('pAb').textContent='Leave party';show('pause');Aud.level(.25);return}if(state!=='play')return;state='pause';for(const k in KEYS)KEYS[k]=0;document.exitPointerLock();$('pFuses').textContent=`DAY ${day}  ·  FUSES ${keys}/4  ·  NOTES ${nNotes}/${NT}`;$('pTime').textContent=fmt(time);hide_('lockhint');show('pause');Aud.level(.25)}
function resume(){if(MP){if(!paused)return;paused=false;hide_('pause');hide_('settings');Aud.fade(true);Aud.level(1);grace=performance.now()+1800;if(state==='play'){lock();setTimeout(()=>{if(state==='play'&&!paused&&!document.pointerLockElement)show('lockhint')},1900)}return}if(state!=='pause')return;hide_('pause');hide_('settings');state='play';Aud.fade(true);Aud.level(1);grace=performance.now()+1800;lock();setTimeout(()=>{if(state==='play'&&!document.pointerLockElement)show('lockhint')},1900)}
function take(f){if(MP){Net.fuse(f.i,ok=>{if(!ok)say('Someone already took it.',2000)});return}fuseGot(f,null)}
function fuseGot(f,who,q){if(f.taken)return;f.taken=true;f.g.visible=false;f.l.intensity=0;keys++;if(!q)Aud.pickup();document.querySelectorAll('#fuses i').forEach((e,i)=>e.classList.toggle('on',i<keys));
 if(!q)say(who&&who!==Net.pid?`${nickOf(who)} took a fuse. (${keys}/4)`:keys<4?['It hums in your hand.','Something heard that.','It knows where you are.'][keys-1]:'Four fuses. The exit is waiting.');
 if(keys===4){Level.XD.lt.color.set(0x33ff66);Level.XD.sg.material.color.set(0x66ff88);$('obj').textContent=Level.nF>1?'FIND THE EXIT ON THE GROUND FLOOR':'REACH THE EXIT'}}
function hide(l){const pre={x:P.x,z:P.z,hidden:false,crouch:!!P.crouch};H=l;hideT=0;snapT=.3;l.open=false;P.x=l.cx;P.z=l.cz;yaw=l.yaw;pitch=0;if(MP){if(Net.isHost()&&en.fl===P.fl&&en.cansee(pre))en.check(l,true)}else if(en.seen&&en.dist<DIFF[SET.diff].sight)en.check(l,true);
 show('lockerfx');Level.lockLight.position.set(l.cx,1.9+FY(),l.cz);Level.lockLight.intensity=.4;Aud.locker();Aud.muffle(true)}
function leave(){const l=H;H=null;snapT=.25;l.open=true;setTimeout(()=>{if(H!==l)l.open=false},2500);P.x=l.px;P.z=l.pz;hide_('lockerfx');Level.lockLight.intensity=0;Aud.locker();Aud.muffle(false)}
function aimHit(wx,wz,axis,hw,y0,y1,mt){const cp=Math.cos(pitch),dx=-Math.sin(yaw)*cp,dy=Math.sin(pitch),dz=-Math.cos(yaw)*cp,ey=1.65-.6*crouch+py-.25*vk;let t,lat;
 if(axis==='x'){if(Math.abs(dx)<1e-4)return false;t=(wx-P.x)/dx;if(t<0||t>mt)return false;lat=P.z+dz*t-wz}else{if(Math.abs(dz)<1e-4)return false;t=(wz-P.z)/dz;if(t<0||t>mt)return false;lat=P.x+dx*t-wx}
 const y=ey+dy*t;return Math.abs(lat)<hw&&y>y0&&y<y1}
function target(){if(H)return null;let best=null,bs=99;const fx=-Math.sin(yaw),fz=-Math.cos(yaw);
 const tr=(k,o,x,z,lim,fac,label)=>{const dx=x-P.x,dz=z-P.z,d=Math.hypot(dx,dz);if(d>lim)return;const dot=d>.01?(dx*fx+dz*fz)/d:1;if(fac&&dot<.25&&d>1.1)return;const s=d-dot*.8;if(s<bs){bs=s;best={k,o,label}}};
 for(const f of Level.fuses)if(!f.taken&&!!f.duct===!!V)tr('fuse',f,f.x,f.z,1.9,0,'[E] TAKE FUSE');
 if(!V){
 for(const it of Level.items)if(!it.taken)tr('item',it,it.x,it.z,1.7,1,it.t==='note'?'[E] READ NOTE':it.t==='fuse'?'[E] TAKE FUSE':carrying()>0?'HANDS FULL · SPACE TO DROP':it.t==='key'?'[E] TAKE BRASS KEY':it.t==='battery'?'[E] TAKE BATTERY':it.t==='screwdriver'?'[E] TAKE SCREWDRIVER':'[E] TAKE BOTTLE');
 const x=Level.xd;if(x&&!x.open)tr('exit',x,x.x,x.z,2.4,0,keys>=4?'[E] OPEN EXIT':`EXIT SEALED (${keys}/4)`);
 for(const l of Level.lockers)if(!lockerBusy(l))tr('locker',l,l.cx,l.cz,1.9,0,'[E] HIDE');
 /* doors and vents only react while you are actually LOOKING at them */
 for(const d of Level.doors){const dd=Math.hypot(d.wx-P.x,d.wz-P.z);if(d.target&&dd<.9)continue;if(!aimHit(d.wx,d.wz,d.axis,.85,0,2.4,2.8))continue;tr('door',d,d.wx,d.wz,2.8,0,d.locked?(hasKey?'[E] UNLOCK DOOR':'LOCKED'):d.target?'[E] CLOSE DOOR':'[E] OPEN DOOR')}
 }
 /* vents: the cover is held by 4 screws, from either side of it */
 for(const v of Level.vents){const dd=Math.hypot(v.fx-P.x,v.fz-P.z);if(dd>3)continue;const ax=v.n[0]?'x':'z';
  if(v.open){if(!V&&!crouchOn&&dd<2.6&&aimHit(v.fx,v.fz,ax,.7,0,1.4,2.8)&&dd-.8<bs){bs=dd-.8;best={k:'vhint',o:v,label:'CROUCH (C) TO WALK INTO THE VENT'}}continue}
  const s=screwAim(v);if(!s&&!aimHit(v.fx,v.fz,ax,.8,0,1.45,2.8))continue;
  const lb=!hasSD?'SCREWED SHUT · NEEDS A SCREWDRIVER':s?(s.p>0?`UNSCREWING ${Math.round(s.p*100)}%`:`[HOLD E] UNSCREW · ${v.left} OF 4 LEFT`):`AIM AT A SCREW · ${v.left} OF 4 LEFT`;
  if(dd-.8<bs){bs=dd-.8;best={k:s&&hasSD?'screw':'vhint',o:v,s,label:lb}}}
 return best}
const carrying=()=>bot+bats+(hasKey?1:0)+(hasSD?1:0);
const cnt=t=>t==='bottle'?bot:t==='battery'?bats:t==='key'?(hasKey?1:0):hasSD?1:0,heldType=()=>bot?'bottle':bats?'battery':hasKey?'key':hasSD?'screwdriver':null;
function noiseAt(x,z,fl,force){if(V&&!force)return;fl=fl===undefined?P.fl:fl;if(!MP)en.hearNoise(x,z,fl);else if(Net.isHost())en.hearNoise(x,z,fl);else Net.throwB({k:2,u:Net.pid,x:r2(x),z:r2(z),f:fl})}
function hud(){const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};set('botc',bot);set('batc',bats);set('notc',nNotes);
 if(cnt(sel)<=0){const n=['bottle','battery','key','screwdriver'].find(t=>cnt(t)>0);if(n)sel=n}
 {const ne=$('notn');if(ne&&ne.lastElementChild)ne.lastElementChild.textContent='/ '+NT}
 [['botn','bottle'],['batn','battery'],['keyn','key'],['sdn','screwdriver']].forEach(([id,t])=>{const e=$(id);if(!e)return;e.classList.toggle('hidden',cnt(t)<=0);e.classList.toggle('sel',sel===t)})}
function selItem(t){if(cnt(t)>0){sel=t;hud()}}
function useBattery(){if(state!=='play'||H)return;if(bats<=0){say('You have no spare batteries.',2000);return}if(bat>.92){say('Your flashlight is already full.',2200);return}bats--;bat=Math.min(1,bat+.55);Aud.battery();say('Fresh batteries.',2000);hud()}
function trapHit(x,z,fl){const F=Level.FL[fl];if(!F)return;for(const t of F.traps)if(t.armed&&Math.hypot(x-t.x,z-t.z)<.6){t.armed=false;if(fl===P.fl){Aud.bang();say('Something set off the trap.',1600)}}}
function spawnBody(t,x,y,z,vx,vy,vz){const mt=new THREE.Mesh(t==='key'?new THREE.BoxGeometry(.16,.03,.05):t==='battery'?new THREE.CylinderGeometry(.03,.03,.12,10):new THREE.CylinderGeometry(.02,.02,.2,8),new THREE.MeshStandardMaterial({color:t==='key'?0xb08a3a:t==='battery'?0x333333:0xd8a020,metalness:.6,roughness:.4}));mt.position.set(x,y,z);scene.add(mt);bodies.push({m:mt,t,vx,vy,vz,rx:6+R()*8,rz:4+R()*8,rest:0,fl:P.fl})}
function commitItem(b,x,z){const t=b.t;if(MP)Net.drop([{nid:Net.nid(),t:netT(t,b.fl),x,z}]);else{Props.dropItem(t,x,z,undefined,b.fl);trapHit(x,z,b.fl);noiseAt(x,z,b.fl)}Aud.tone(150,.08,'square',.1)}
function stepBodies(dt){for(let i=bodies.length-1;i>=0;i--){const b=bodies[i],q=b.m,ox=q.position.x,oz=q.position.z;b.vy-=16*dt;let nx=ox+b.vx*dt,nz=oz+b.vz*dt,ny=q.position.y+b.vy*dt;
 if(Level.wall(nx,nz)||Level.hitCol(nx,nz)){if(Level.wall(nx,oz)||Level.hitCol(nx,oz))b.vx*=-.35;if(Level.wall(ox,nz)||Level.hitCol(ox,nz))b.vz*=-.35;nx=ox;nz=oz}
 const fl=Level.fy(b.fl)+Level.gy(nx,nz,undefined,ny-Level.fy(b.fl)-.2);let ground=false;if(ny<fl+.05){ny=fl+.05;ground=true;if(b.vy<-2){Aud.tone(110+R()*70,.06,'square',.08);b.vy=-b.vy*.34}else b.vy=0;b.vx*=1-Math.min(1,dt*9);b.vz*=1-Math.min(1,dt*9)}
 q.position.set(nx,ny,nz);const sp=Math.hypot(b.vx,b.vz);q.rotation.x+=b.rx*dt*Math.min(1,sp/3+(ground?0:1));q.rotation.z+=b.rz*dt*Math.min(1,sp/3+(ground?0:1));
 if(ground&&sp<.35&&Math.abs(b.vy)<.6){b.rest+=dt;if(b.rest>.25){scene.remove(q);bodies.splice(i,1);commitItem(b,nx,nz)}}else b.rest=0}}
function dropItem(){if(state!=='play'||H)return;let t=heldType();if(!t){say('You are not carrying anything to drop.',2000);return}
 const fx=-Math.sin(yaw),fz=-Math.cos(yaw);let x=P.x,z=P.z;for(const d of[.9,.65,.4,.15]){const nx=P.x+fx*d,nz=P.z+fz*d;if(!Level.blocked(nx,nz,.15)&&Level.los(P.x,P.z,nx,nz)){x=nx;z=nz;break}}
 if(t==='bottle')bot--;else if(t==='battery')bats--;else if(t==='key')hasKey=false;else hasSD=false;
 spawnBody(t,x,FY()+py+1.0,z,fx*1.3,.5,fz*1.3);kick=1;Aud.tone(180,.08,'sine',.12);say('Dropped '+(t==='bottle'?'the bottle':t==='battery'?'the battery':t==='key'?'the brass key':'the screwdriver')+'. That was loud.',1800);hud()}
function showNote(i){const L=['Day 41. The boiler never stopped. We stopped hearing it. That was the first mistake.','They sent the night watchman down to check the pipes. Nobody saw him come back up. Something did.','Do not run. He hears running. He does not hear breathing, so breathe slowly.','The lockers are safe only because he dislikes the smell. Do not let him watch you climb in.','Four fuses, one for each valve. Someone hid them in the rooms. I think it was me.','The green light means the exit is ready. I never saw green.','If a door is open and you did not open it, he has already been through it.','Throw something. He will go and look. He always goes to look.'],t=L[i%L.length];
 const n=$('note');n.querySelector('p').textContent=t;n.classList.remove('hidden');noteT=Math.min(9,3.5+t.length*.045)}
function addFuse(q,who){keys++;if(!q)Aud.pickup();document.querySelectorAll('#fuses i').forEach((e,i)=>e.classList.toggle('on',i<keys));if(!q)say(who&&who!==Net.pid?`${nickOf(who)} found a loose fuse. (${keys}/4)`:keys<4?'A loose fuse. It hums.':'Four fuses. The exit is waiting.');if(keys===4){Level.XD.lt.color.set(0x33ff66);Level.XD.sg.material.color.set(0x66ff88);$('obj').textContent=Level.nF>1?'FIND THE EXIT ON THE GROUND FLOOR':'REACH THE EXIT'}}
function takeItem(it){if(it.t!=='note'&&it.t!=='fuse'&&carrying()>0){say('Your hands are full. Drop what you are holding first (SPACE).',2600);Aud.tone(110,.12,'square',.1);return}if(MP&&it.t!=='note'){it.mine=true;Net.take(it.nid,!!it.drop,ok=>{if(ok)gotItem(it);else{it.mine=false;say('Someone else grabbed it.',1800)}});return}gotItem(it)}
function gotItem(it){if(it.t==='battery'){if(bats>=3){say("You can't carry any more batteries.",2200);return}bats++;sel='battery';Aud.battery();say('A spare battery. R use · G throw · SPACE drop.',3000)}
 else if(it.t==='bottle'){if(bot>=5){say("You can't carry any more.",2200);return}bot++;sel='bottle';Aud.pickup();say('A bottle. G throw · SPACE drop.',3000)}
 else if(it.t==='key'){hasKey=true;sel='key';Aud.keyget();say('A brass key. Something is locked. G throw · SPACE drop.',3200)}
 else if(it.t==='fuse'){addFuse(false)}
 else if(it.t==='screwdriver'){hasSD=true;sel='screwdriver';Aud.pickup();say('A screwdriver. Hold E at a vent that is screwed shut.',3400)}
 else{nNotes++;Aud.paper();showNote(it.i)}
 it.taken=true;it.g.visible=false;it.sp.visible=false;if(it.drop)rmItem(it);hud()}
function interact(){if(state!=='play')return;if(H){if(hideT>.8)leave();return}
 const t=target();if(!t)return;
 if(t.k==='fuse')take(t.o);
 else if(t.k==='item')takeItem(t.o);
 else if(t.k==='exit'){const x=t.o;if(keys>=4){openExit();if(MP)Net.exit()}else{say(`It needs power. ${keys}/4 fuses.`);Aud.tone(90,.3,'square',.1)}}
 else if(t.k==='locker')hide(t.o);
 else if(t.k==='vhint'){const v=t.o;if(v.open)say('Crouch (C) and walk in.',1800);else if(!hasSD)say('Screwed shut. You need a screwdriver.',2200);else say('Four screws hold it. Aim at one and hold E.',2600)}
 else if(t.k==='door'){const d=t.o;if(d.locked){if(hasKey){hasKey=false;noiseAt(d.wx,d.wz);Level.unlock(d);d.target=1;if(MP){Net.unlock(d.id);Net.door(d.id,1)}Aud.keyget();Aud.dopen();say('The lock gives.',2500);hud()}else{Aud.locked();say('Locked. There must be a key somewhere.',2800)}return}
  d.target=d.target?0:1;if(MP)Net.door(d.id,d.target);d.target?Aud.dopen():Aud.dclose()}}
function throwHeld(){if(state!=='play'||H||V)return;const t=heldType();if(!t)return;if(t==='bottle'){throwBottle();return}
 kick=1;const cp=Math.cos(pitch),f=[-Math.sin(yaw)*cp,Math.sin(pitch),-Math.cos(yaw)*cp];if(t==='battery')bats--;else if(t==='key')hasKey=false;else hasSD=false;
 spawnBody(t,P.x+f[0]*.4,FY()+1.45+py,P.z+f[2]*.4,f[0]*9.5,f[1]*9.5+1.8,f[2]*9.5);Aud.tone(300,.1,'sine',.1,200);hud()}
function throwBottle(){if(state!=='play'||H||V||bot<=0)return;bot--;kick=1;const cp=Math.cos(pitch),f=[-Math.sin(yaw)*cp,Math.sin(pitch),-Math.cos(yaw)*cp];
 const bx=P.x+f[0]*.4,bz=P.z+f[2]*.4,vx=f[0]*12,vy=f[1]*12+1.6,vz=f[2]*12;spawnBottle(bx,1.5,bz,vx,vy,vz);if(MP){const r=n=>Math.round(n*100)/100;Net.throwB({k:1,u:Net.pid,x:r(bx),y:1.5,z:r(bz),a:r(vx),b:r(vy),c:r(vz),f:P.fl})}Aud.tone(300,.1,'sine',.1,200);hud()}
function spawnBottle(x,y,z,vx,vy,vz){const mt=new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,.22,8),new THREE.MeshStandardMaterial({color:0x4a7a4a,transparent:true,opacity:.8,roughness:.2}));mt.position.set(x,y+FY(),z);scene.add(mt);proj.push({m:mt,vx,vy,vz})}
function shatter(x,y,z){Aud.glass(MP?Math.max(.12,1-Math.hypot(x-P.x,z-P.z)/32):1);if(!MP||Net.isHost())en.hearNoise(x,z,P.fl);const n=10,pg=new THREE.BufferGeometry(),a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=x+(R()-.5)*.3;a[i*3+1]=y+R()*.2;a[i*3+2]=z+(R()-.5)*.3}pg.setAttribute('position',new THREE.BufferAttribute(a,3));
 const pt=new THREE.Points(pg,new THREE.PointsMaterial({map:Props.dot(),color:0x9fd8a8,size:.08,transparent:true,opacity:.9,depthWrite:false}));scene.add(pt);setTimeout(()=>{scene.remove(pt);pg.dispose();pt.material.dispose()},900)}
function initDust(){const n=220,pg=new THREE.BufferGeometry(),a=new Float32Array(n*3);for(let i=0;i<n;i++){a[i*3]=(R()-.5)*16;a[i*3+1]=R()*3;a[i*3+2]=(R()-.5)*16}pg.setAttribute('position',new THREE.BufferAttribute(a,3));
 dust=new THREE.Points(pg,new THREE.PointsMaterial({map:Props.dot(),color:0xccbbaa,size:.035,transparent:true,opacity:.5,depthWrite:false}));dust.frustumCulled=false;scene.add(dust)}
function updDust(dt){const a=dust.geometry.attributes.position;for(let i=0;i<a.count;i++){let x=a.getX(i),y=a.getY(i)+dt*.05,z=a.getZ(i);const dx=x-P.x,dz=z-P.z;if(dx>8)x-=16;else if(dx<-8)x+=16;if(dz>8)z-=16;else if(dz<-8)z+=16;const fy=FY();if(y>fy+3||y<fy)y=fy+R()*.3;a.setXYZ(i,x,y,z)}a.needsUpdate=true}
function springTrap(t){t.armed=false;trapT=2.6;kick=1;Aud.bang();Aud.tone(90,.3,'square',.2);say('A BEAR TRAP.',2200);noiseAt(t.x,t.z);if(MP)Net.door(8000+P.fl*10+t.i,1)}
function ventOpened(v){const k=P.fl*10+v.i;VO.add(k);if(MP)Net.unlock(9000+k)}
function screwAim(v){const cp=Math.cos(pitch),dx=-Math.sin(yaw)*cp,dy=Math.sin(pitch),dz=-Math.cos(yaw)*cp,ey=1.65-.6*crouch+py-.25*vk;let b=null,bd=.17;
 for(const s of v.sc){if(s.out)continue;const ax=s.wx-P.x,ay=s.wy-ey,az=s.wz-P.z,t=ax*dx+ay*dy+az*dz;if(t<.1||t>2.8)continue;const d=Math.hypot(ax-dx*t,ay-dy*t,az-dz*t);if(d<bd){bd=d;b=s}}return b}
/* the last screw: the cover drops, clangs on the floor and stays open for good. It is loud: he hears it wherever he is. */
function ventOpen(v){v.open=true;v.left=0;v.vel=0;for(const s of v.sc){s.out=true;s.p=1;if(s.g)s.g.visible=false}
 Aud.tone(150,.4,'square',.2,55);Aud.noise(.55,.7,1400,'bandpass');setTimeout(()=>{Aud.tone(260,.15,'square',.1,120);Aud.noise(.25,.4,2200,'bandpass')},280);
 noiseAt(v.px,v.pz,undefined,true);ventOpened(v);say('The cover clangs to the floor. It stays open now. Crouch (C) and walk in.',4200)}
/* hold E on a screw: it turns out of the plate, then it is gone */
function unscrew(v,s,dt){s.p=Math.min(1,s.p+dt/1.3);ventSnd-=dt;if(ventSnd<=0){ventSnd=.38;Aud.tone(880+R()*520,.06,'sawtooth',.07,640);Aud.noise(.04,.07,4200,'highpass')}
 if(!s.hrd){s.hrd=1;noiseAt(v.px,v.pz,undefined,true)}
 if(s.p>=1){s.out=true;s.hrd=0;v.left--;if(s.g)s.g.visible=false;Aud.tone(1900,.09,'triangle',.12,1200);Aud.noise(.07,.18,5000,'highpass');
  if(v.left<=0)ventOpen(v);else say(v.left+(v.left===1?' screw left.':' screws left.'),1300)}}
function floorLook(){const T=Level.theme;if(scene&&scene.fog)scene.fog.density=T.fog*DV().fog;const e=$('dayl');if(e)e.textContent='DAY '+day+(Level.nF>1?' · '+T.name:'')}
function swFloor(dir){const old=P.fl,to=old+dir;Level.use(to);P.fl=to;py-=dir*Level.FH;floorLook();Level.updVis(P.x,P.z,P.fl);
 if(!MP&&en.fl===old&&!en.cl&&(en.state==='chase'||(en.seen&&en.dist<22))){en.goF=to;en.state='travel';en.follow=true}}
function update(dt){
 time+=dt;const K=paused?{}:KEYS;let mx=(K.KeyD?1:0)-(K.KeyA?1:0)+(paused?0:JOY.x),mz=(K.KeyS?1:0)-(K.KeyW?1:0)+(paused?0:JOY.z),mv=!H&&(mx||mz),run=false;setCfg();P.yaw=yaw;
 if(false&&vfade>0){vfade=Math.max(0,vfade-dt*2.2);const fe=$('flash');fe.style.background='#000';fe.style.opacity=String(+Math.min(1,vfade).toFixed(3))}if(trapT>0){trapT-=dt;mx=0;mz=0;mv=false;K.ShiftLeft=0}
 P.hidden=!!H||!!V;P.lk=H;if(H){P.crouch=false;crouch=0}else if(V){P.crouch=true}
 if(H){hideT+=dt;yaw=H.yaw+Math.max(-.35,Math.min(.35,yaw-H.yaw));pitch=Math.max(-.22,Math.min(.22,pitch))}
 else{if(K.ShiftLeft&&crouchOn&&mv&&!V)crouchOn=false;/* a low shaft or the mouth of an open vent: you cannot stand up there */if(!crouchOn&&!Level.vOK(P.x,P.z,false)&&Level.vOK(P.x,P.z,true))crouchOn=true;const cr=crouchOn;P.crouch=cr;crouch+=((cr?1:0)-crouch)*Math.min(1,dt*10);if(exh>0)exh-=dt;run=!cr&&K.ShiftLeft&&mv&&stam>0&&exh<=0;if(exh<=0)stam=Math.max(0,Math.min(1,stam+(run?-.15:.2)*dt));if(stam<=0&&exh<=0){exh=2.6;K.ShiftLeft=0;Aud.tone(170,.6,'sine',.07,110);say('OUT OF BREATH',1600)}const sp=(V?1.3:cr?1.6:run?5.2:3.1)*(exh>0?.8:1);
  if(mv){const l=Math.hypot(mx,mz);mx/=l;mz/=l;const c=Math.cos(yaw),s=Math.sin(yaw),vx=(mx*c+mz*s)*sp*dt,vz=(-mx*s+mz*c)*sp*dt;
   const stuck=!Level.vOK(P.x,P.z,cr);if(stuck||Level.vOK(P.x+vx,P.z,cr))P.x+=vx;if(stuck||Level.vOK(P.x,P.z+vz,cr))P.z+=vz;bob+=dt*(run?13:cr?5:8);stepT-=dt;if(stepT<=0){if(V)Aud.tone(70+R()*30,.08,'triangle',.05);else if(!cr)Aud.step(run);stepT=run?.3:cr?.7:.5}}}
 /* inside the wall block of a tunnel = in the vent: nothing in the house can see you, hear you or catch you here, even if he watched you climb in */
 {const nv=!H&&Level.inVent(P.x,P.z);if(nv&&!V){V={};Aud.locker();if(!vHint){vHint=1;say('You are inside the walls. Nothing can see you in here.',4200)}}else if(!nv&&V)V=null;P.hidden=!!H||!!V;if(V)P.crouch=true;vk+=(((V||Level.inApron(P.x,P.z))?1:0)-vk)*Math.min(1,dt*8)}
 if(!H&&!V){const us=Level.unitAt(P.x,P.z);if(us&&us.p>=Level.ANX.f1-.05){const hh=Level.FH/2;if(us.t>=0&&py>hh*.5&&P.fl<Level.nF-1)swFloor(1);else if(us.t<0&&py<-hh*.5&&P.fl>0)swFloor(-1)}}
 py+=((V||H?0:Level.gy(P.x,P.z,undefined,py))-py)*Math.min(1,dt*14);if(V||H)py=0;
 if(!H&&!V&&trapT<=0)for(const t of Level.traps)if(t.armed&&Math.hypot(P.x-t.x,P.z-t.z)<.5){springTrap(t)}
 P.noisy=!!(mv&&run);enemyTick(dt);Props.update(dt,time,P);
 scT-=dt;if(scT<=0&&!V){scT=28+R()*40;if(!chaseOn()){const k=R()*4|0;if(k===0)Aud.creak();else if(k===1)Aud.dclose(.35);else if(k===2)Aud.noise(1.8,.06,900,'bandpass');else[0,.28,.56].forEach(t=>setTimeout(()=>Aud.thud(.3),t*1000))}}
 const ch=chaseOn();if(ch!==wasCh){wasCh=ch;Aud.chase(ch);if(ch)say('RUN.',1200)}
 const d=en.dist,fear=Math.max(0,1-d/18);
 if(V){pendKill=false;en.found=false}
 if(MP?pendKill:(en.found||(!V&&(d<1.15&&!H&&en.state!=='patrol'||d<.9&&!H)))){en.found=false;pendKill=false;scare();return}
 if(d<16){eStep-=dt;if(eStep<=0){Aud.thud(1-d/16);eStep=ch?.4:.8}}
 const bs=SET.bob?1:0;if(H)cam.position.set(H.cx-H.nx*.08,FY()+1.55+Math.sin(time*1.6)*.004,H.cz-H.nz*.08);

 else{cam.position.set(P.x,FY()+py+1.65-.6*crouch-.25*vk+Math.sin(bob)*(run?.07:.04)*bs*(1-.6*crouch),P.z);const sh=(fear>.5?(fear-.5)*.02:0)+(trapT>0?.05:0);cam.position.x+=(R()-.5)*sh;cam.position.z+=(R()-.5)*sh}
 {let ry=yaw,rp=pitch;/* entering/leaving a locker used to snap the view: ease it */
  if(snapT>0){snapT-=dt;const k=Math.min(1,dt*12);let dy=yaw-visYaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));visYaw+=dy*k;visPitch+=(pitch-visPitch)*k;vp.x+=(cam.position.x-vp.x)*k;vp.y+=(cam.position.y-vp.y)*k;vp.z+=(cam.position.z-vp.z)*k;ry=visYaw;rp=visPitch;cam.position.set(vp.x,vp.y,vp.z)}
  else{visYaw=yaw;visPitch=pitch;vp.x=cam.position.x;vp.y=cam.position.y;vp.z=cam.position.z}
  cam.rotation.set(rp,ry,Math.sin(bob*.5)*.01*(mv?bs:0))}
 fovK+=((ch&&!H?1.3:1)-fovK)*Math.min(1,dt*6);const tf=Math.min(160,(H?58:SET.fov)*fovK-(ch?0:fear*8));fovCur+=(tf-fovCur)*Math.min(1,dt*8);cam.fov=fovCur;cam.updateProjectionMatrix();
 if(fon&&!H&&bat>0){const b0=bat;bat=Math.max(0,bat-dt/210);if(b0>0&&bat<=0){say('The flashlight dies.',2500);Aud.dead()}}let fi=2.1;if(SET.safe){fi*=1-fear*.4;if(bat<.2)fi*=.6}else{if(fear>.3&&R()<fear*.35)fi=R()*.8;if(bat<.2&&bat>0&&R()<.1+(.2-bat)*1.5)fi*=.25}if(bat<=0||!fon)fi=0;if(blackout>0){blackout-=dt;fi=0}fl.intensity=H?0:fi*DV().fl;
 if(H)Level.lockLight.intensity=blackout>0?0:.3+fear*.3*(R()<.3?1:.4);
 Level.updLights(P.x,P.z,dt,blackout,time);updDust(dt);updHeld(dt,mv,run);
 for(let i=proj.length-1;i>=0;i--){const p=proj[i],q=p.m;p.vy-=14*dt;const nx=q.position.x+p.vx*dt,ny=q.position.y+p.vy*dt,nz=q.position.z+p.vz*dt;if(ny-FY()<.06+py||ny-FY()>(Level.unitAt(nx,nz)?Level.FH:Level.H)||Level.wall(nx,nz)||Level.hitCol(nx,nz)){if(p.item){const lx=q.position.x,lz=q.position.z;if(MP)Net.drop([{nid:Net.nid(),t:netT(p.item,P.fl),x:lx,z:lz}]);else{Props.dropItem(p.item,lx,lz);noiseAt(lx,lz)}Aud.tone(140,.12,'square',.14)}else shatter(q.position.x,Math.max(FY()+.06,q.position.y),q.position.z);scene.remove(q);proj.splice(i,1);continue}q.position.set(nx,ny,nz);q.rotation.x+=dt*14;q.rotation.z+=dt*9}
 stepBodies(dt);
 if(noteT>0){noteT-=dt;if(noteT<=0)$('note').classList.add('hidden')}
 ws('stamfill','background',exh>0?'#a31616':'');ws('batfill','width',Math.round(bat*1000)/10+'%');ws('batfill','background',bat<.2?'#a31616':'');
 beatT-=dt;if(fear>.15&&beatT<=0){Aud.beat(Math.min(1,fear*1.4));beatT=1.1-fear*.7}Aud.setHum(fear*.35,fear);
 ws('vig','opacity',String(+(DV().vig+fear*.25).toFixed(2)));ws('chasefx','opacity',String(ch?+(.55+Math.sin(time*(SET.safe?3:9))*(SET.safe?.1:.25)).toFixed(2):0));
 eventT-=dt;if(eventT<=0){eventT=15+R()*25;if(R()<.5&&!SET.safe){blackout=1.2;Aud.bang()}else Aud.creak()}
 let pr='';if(H)pr=hideT>.8?'[E] LEAVE LOCKER':'';else{
  const x=Level.xd,xd=x?Math.hypot(x.x-P.x,x.z-P.z):99;if(x&&x.open&&x.t>.8&&xd<1.3){$('flash').style.background='#000';$('flash').style.opacity=1;state='won';setTimeout(()=>{$('flash').style.opacity=0;MP?mpEscape():over(true)},900);return}
  const tg=target();pr=tg?tg.label:'';
  if(tg&&tg.k==='screw'&&hasSD&&K.KeyE)unscrew(tg.o,tg.s,dt);for(const v of Level.vents)if(!v.open)for(const s of v.sc)if(!s.out&&s.p>0&&!(tg&&tg.s===s&&K.KeyE)){s.p=Math.max(0,s.p-dt*.6);if(s.p<=0)s.hrd=0}}
 {const pe=$('prompt'),pv=SET.hints?mt(pr):'';if(pe.textContent!==pv)pe.textContent=pv}ws('stamfill','width',Math.round(stam*1000)/10+'%')}
function updHeld(dt,mv,run){const t=!H&&state==='play'&&cnt(sel)>0?sel:null;for(const k in HELD)HELD[k].visible=k===t;if(!t)return;kick=Math.max(0,kick-dt*3.2);const h=HELD[t],bs=SET.bob&&mv?1:0;
 h.position.set(.27+Math.sin(bob*.5)*.01*bs,-.27+Math.abs(Math.sin(bob))*.014*bs-kick*.3-crouch*.02,-.52+kick*.16);h.rotation.set(-.35-kick*1.2,.5+Math.sin(time*.7)*.03,.15+Math.sin(time*1.1)*.02)}
function scare(){paused=false;hide_('pause');state='scare';scareT=0;en.state='scare';for(const k in HELD)HELD[k].visible=false;hide_('hud');
 const g=en.g.position,fin=!MP&&day>=MAXD;let hd=H;
 if(fin&&hd){P.x=hd.px;P.z=hd.pz;hd.open=true;H=null;hide_('lockerfx');Aud.muffle(false);Level.lockLight.intensity=0;hd=null}
 const dx=g.x-P.x,dz=g.z-P.z,dd=Math.hypot(dx,dz);let ux,uz;
 if(hd){ux=hd.nx;uz=hd.nz}else if(dd>.05){ux=dx/dd;uz=dz/dd}else{ux=-Math.sin(yaw);uz=-Math.cos(yaw)}
 SC={ux,uz,H:!!hd,y0:hd?1.55:1.65,fin,fy:FY()+py};
 if(hd){SC.ex=P.x+ux*1.8;SC.ez=P.z+uz*1.8;SC.d=1.8;hd.open=true;hide_('lockerfx');Aud.muffle(false);Level.lockLight.intensity=.8}else{SC.ex=g.x;SC.ez=g.z;SC.d=Math.max(.6,dd)}
 g.set(SC.ex,SC.fy,SC.ez);en.g.rotation.y=Math.atan2(-ux,-uz);pitch=.05;
 if(fin){/* the long drag: he takes you by the ankle and walks you down the longest clear hall */
  let best=[1,0],bc=-1,bs=-1;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){let c=0;while(c<14&&!Level.blocked(P.x+a*(c+1)*.5,P.z+b*(c+1)*.5,.3))c++;const s=c+(a*ux+b*uz<0?.3:0);if(s>bs){bs=s;bc=c;best=[a,b]}}
  SC.dx=best[0];SC.dz=best[1];SC.px=P.x;SC.pz=P.z;SC.sp=Math.min(1.5,Math.max(.4,(bc*.5-.9)/5));SC.snd=0;SC.mf=false;yaw=Math.atan2(-SC.dx,-SC.dz);
  g.set(P.x+SC.dx*1.05,SC.fy,P.z+SC.dz*1.05);en.g.rotation.y=Math.atan2(SC.dx,SC.dz)}
 show('killfx');$('killfx').style.background='transparent';
 Aud.scream();Aud.kill();Aud.chase(false);Aud.setHum(0,0);$('flash').style.background='#000';$('flash').style.opacity=0;$('msg').style.opacity=0}
/* Death: no strobing, no white flashes. One soft red tint, a hard knock, the world tilts and sinks, the edges close in, fade to black. */
function updScare(dt){scareT+=dt;if(SC.fin)return updDrag(dt);const t=scareT;en.anim(dt);Props.update(dt,time,P);
 const tgt=t<.3?.85:.62;SC.d+=(tgt-SC.d)*Math.min(1,dt*(t<.3?14:5));
 if(SC.H){P.x=SC.ex-SC.ux*SC.d;P.z=SC.ez-SC.uz*SC.d}else en.g.position.set(P.x+SC.ux*SC.d,SC.fy,P.z+SC.uz*SC.d);
 en.pv.rotation.x=.25+Math.min(1,t/.9)*.7;en.pv.rotation.z=Math.sin(t*9)*.06*Math.min(1,t*3);en.light.intensity=2.2;
 let dy=Math.atan2(-SC.ux,-SC.uz)-yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));yaw+=dy*Math.min(1,dt*14);
 const fall=ease((t-.3)/1),cy=SC.y0*(1-fall)+.38*fall,tp=Math.atan2(2.15-cy,SC.d);pitch=t<.2?.08:.08+(tp-.08)*ease((t-.15)/.6);
 const hit=t>.3?Math.exp(-(t-.3)*4.5):0,w=Math.sin(t*38)*.045*hit,w2=Math.cos(t*31)*.045*hit;let back=.4*fall;if(Level.wall(P.x-SC.ux*back,P.z-SC.uz*back))back=0;
 cam.position.set(P.x-SC.ux*back+w,cy+w2+SC.fy,P.z-SC.uz*back+w*.6);cam.rotation.set(pitch+hit*.08,yaw,ease((t-.3)/.9)*.5+Math.sin(t*2.1)*.02);
 cam.fov=SET.fov*(1-.18*ease(t/.35)+.06*ease((t-.35)/2));cam.updateProjectionMatrix();
 const f=$('flash');f.style.background=t<2.4?'#4a0000':'#000';f.style.opacity=t<2.4?String(+(.4*ease((t-.28)/.22)*(1-ease((t-.6)/1.7))).toFixed(3)):String(+ease((t-2.55)/.7).toFixed(3));
 ren.domElement.style.filter=`saturate(${(1-.6*ease((t-.3)/2)).toFixed(2)}) blur(${(ease((t-.8)/1.8)*2.5).toFixed(1)}px)`;
 const r=100-ease((t-.6)/2.2)*95;$('killfx').style.background=`radial-gradient(circle at 50% 48%,rgba(0,0,0,0) ${r}%,rgba(35,0,0,.85) ${r+16}%,#000 ${r+40}%)`;
 if(t>3.4)over(false)}
/* Final-day death: dragged away down the hall by the ankle while the lights die one by one. */
function updDrag(dt){const t=scareT,Dx=SC.dx,Dz=SC.dz;en.anim(dt);Props.update(dt,time,P);
 const fall=ease(t/.5),sp=SC.sp*ease((t-.4)/.8)*(t>5.3?Math.max(0,1-(t-5.3)/1.2):1);
 SC.px+=Dx*sp*dt;SC.pz+=Dz*sp*dt;P.x=SC.px;P.z=SC.pz;
 en.g.position.set(SC.px+Dx*1.05,SC.fy,SC.pz+Dz*1.05);en.g.rotation.y=Math.atan2(Dx,Dz);en.pv.rotation.x=.14;en.pv.position.y=Math.abs(Math.sin(t*3.3))*.09*ease((t-.4)/.8);en.light.intensity=1.3;
 yaw=Math.atan2(-Dx,-Dz)+Math.sin(t*1.7)*.05;pitch=.6*fall+Math.sin(t*2.6)*.025;
 const mvK=ease((t-.4)/.8),y=1.65*(1-fall)+.26*fall+Math.abs(Math.sin(t*3.3))*.035*mvK;
 cam.position.set(SC.px+Math.sin(t*3.3)*.03*mvK,y+SC.fy,SC.pz+Math.cos(t*2.9)*.03*mvK);cam.rotation.set(pitch,yaw,.22*fall+Math.sin(t*2.2)*.05*fall);
 cam.fov=SET.fov*(1-.1*ease(t/.4));cam.updateProjectionMatrix();
 fl.intensity=1.8*(1-ease((t-.5)/4.2));if(scene.fog)scene.fog.density=.12+.2*ease((t-1)/4.5);
 Level.updLights(SC.px,SC.pz,dt,t>3.4?1:0,time);updDust(dt);
 SC.snd-=dt;if(SC.snd<=0&&t>.5&&t<5.4){SC.snd=.52;Aud.thud(.8);Aud.noise(.4,.18,500,'bandpass')}
 if(t>3.8&&!SC.mf){SC.mf=true;Aud.muffle(true)}
 const f=$('flash');if(t<3){f.style.background='#4a0000';f.style.opacity=String(+(.35*ease((t-.05)/.25)*(1-ease((t-.4)/1.6))).toFixed(3))}else{f.style.background='#000';f.style.opacity=String(+ease((t-5.2)/1.1).toFixed(3))}
 ren.domElement.style.filter=`saturate(${(1-.55*ease((t-1)/3)).toFixed(2)}) blur(${(ease((t-2)/3.5)*3).toFixed(1)}px)`;
 const r=100-ease((t-1)/4.2)*88;$('killfx').style.background=`radial-gradient(circle at 50% 50%,rgba(0,0,0,0) ${r}%,rgba(30,0,0,.8) ${r+16}%,#000 ${r+40}%)`;
 if(t>6.5)over(false)}
function over(w){if(MP&&!w){mpDie();return}state=w?'won':'dead';const fin=!w&&day>=MAXD;if(w||fin||MP)document.exitPointerLock();hide_('hud');hide_('lockerfx');hide_('killfx');ren.domElement.style.filter='';$('flash').style.opacity=0;const st=`FUSES ${keys}/4 · NOTES ${nNotes}/${NT} · TIME ${fmt(time)}`;
 /* Granny rules: getting caught costs you a day. Survive the five days and you are out; escape on any day and you win. */
 if(!w&&day<MAXD){spNextDay();return}
 if(w)saveRun(null);else saveRun(null);show('over');
 $('overT').textContent=w?'YOU ESCAPED':'THE '+ORD[MAXD-1]+' DAY IS OVER';$('overP').textContent=w?(day===1?'On the very first day. He will not forgive that.':`On day ${day}. The halls fall silent. For now.`):'He dragged you back down the halls. You are part of them now.';$('overS').textContent=`DAY ${day} · `+st;
 const b=$('overBtn');b.textContent=w?'Again':'Start over from day 1';b.onclick=toMenu}
/* ================= WORLD (rebuildable) ================= */
function disposeScene(sc){sc.traverse(o=>{if(o.geometry&&o.geometry.dispose)o.geometry.dispose();const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];for(const m of ms){for(const k in m){const v=m[k];if(v&&v.isTexture)v.dispose()}m.dispose()}})}
function mkWorld(seed,multi){if(scene){scene.remove(cam);scene.remove(amb);disposeScene(scene)}
 scene=new THREE.Scene();scene.background=new THREE.Color(0x020101);scene.fog=new THREE.FogExp2(0x010100,.12);scene.add(amb);scene.add(cam);
 Level.make(scene,seed,multi);Level.FL.forEach((F,f)=>F.items.forEach(it=>it.nid=f+'_'+it.i));NT=Level.noteTotal;VO.forEach(k=>{const F=Level.FL[Math.floor(k/10)],vt=F&&F.vents[k%10];if(vt)Props.ventOpenNow(vt)});bodies.length=0;
 const st=Level.start;P.x=st.x;P.z=st.z;P.fl=Level.sf;py=0;V=null;crouchOn=false;stairFx=null;yaw=st.yaw;pitch=0;
 en=new Enemy(scene,Level.FL[Level.ef].enemyStart);en.fl=Level.ef;en.pfl=P.fl;en.g.position.y=Level.fy(en.fl);en.pv.visible=en.fl===P.fl;en.onDoor=d=>{if(MP&&Net.isHost())Net.door(d.id,1)};
 en.onStairs=un=>{const to=en.fl;en.wait=.6;en.T=null;en.seen=false;
  if(en.goF!=null&&en.goF!==to)en.state='travel';else{en.goF=null;if(en.follow&&P.fl===to){en.follow=false;en.state='chase';en.last=Level.cell(P.x,P.z);en.lost=0}else if(en.noise){en.state='investigate';en.T=Level.cell(en.noise.x,en.noise.z);en.noise=null;en.inv=0;en.it=0}else{en.follow=false;en.state='patrol'}}
  if(P.fl===to)Aud.thud(.4)};
 floorLook();initDust();proj.length=0}
/* ================= MULTIPLAYER ================= */
const ES=['patrol','chase','investigate','check','stare','scare','travel'],TC={bottle:'bo',battery:'ba',key:'ke',screwdriver:'sd',note:'no',fuse:'fu'},TI={bo:'bottle',ba:'battery',ke:'key',sd:'screwdriver',no:'note',fu:'fuse'},HI={bottle:1,battery:2,key:3,screwdriver:4},HKN=[null,'bottle','battery','key','screwdriver'],netT=(t,f)=>TC[t]+(f|0),r2=n=>Math.round(n*100)/100,hx=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function curDiff(){return MP&&Net.m?Net.m.df:SET.diff}
function nickOf(pid){const p=Net.players[pid];return p?p.n:'Someone'}
function lockerBusy(l){if(!MP)return false;for(const k in av){const T=av[k].T;if(T.live&&T.hidden&&T.lk===l)return true}return false}
function setCfg(){const D=DIFF[curDiff()];en.cfg=Object.assign({},D,{spd:D.spd*(1+(day-1)*.07),sight:D.sight*(1+(day-1)*.04)})}
function chaseOn(){return en.state==='chase'&&(!MP||en.tgtPid===Net.pid||en.dist<12)}
function spawnOff(){/* deterministic: every client computes the same spots from the shared seed, all inside the bed room */
 const st=Level.start,s=st.s,t=[-s[1],s[0]],my=Math.min(3,Net.slot(Net.pid)),cand=[];
 for(const fw of[0,.6,-.6,1.1])for(const m of[0,.7,-.7,1.3,-1.3])cand.push([t[0]*m-s[0]*fw,t[1]*m-s[1]*fw]);
 const used=[];for(let k=0;k<=my;k++){let b=null;for(const c of cand){const x=st.x+c[0],z=st.z+c[1];if(Level.blocked(x,z,.4)||!Level.los(st.x,st.z,x,z))continue;if(used.some(u=>Math.hypot(u[0]-c[0],u[1]-c[1])<.65))continue;b=c;break}used.push(b||[0,0])}
 return{x:used[my][0],z:used[my][1]}}
function openExit(q){const x=Level.XD||Level.xd;if(!x||x.open)return;x.open=true;if(!q){Aud.door();say('The door grinds open. Go.')}}
function rmItem(it){rmItemF(it,Level.fi)}
function rmItemF(it,f){it.taken=true;it.g.visible=false;it.sp.visible=false;const a=Level.FL[f].items,i=a.indexOf(it);if(i>=0)a.splice(i,1)}
function findItem(nid){for(let f=0;f<Level.nF;f++){const it=Level.FL[f].items.find(i=>i.nid===nid);if(it)return[it,f]}return[null,0]}
const wLive=()=>performance.now()>wReady;
function netItem(nid,v){const[it,f]=findItem(nid);
 if(v===null||v===0){if(it){if(it.t==='fuse'&&!it.taken&&!it.mine)addFuse(!wLive(),'remote');if(it.drop)rmItemF(it,f);else{it.taken=true;it.g.visible=false;it.sp.visible=false}}return}
 if(typeof v==='object'&&!it){const s=String(v.t),t=TI[s.slice(0,2)]||'bottle',fl=Math.max(0,Math.min(Level.nF-1,+s.slice(2)|0));Props.dropItem(t,v.x,v.z,nid,fl);trapHit(v.x,v.z,fl);if(wLive()&&Net.isHost()&&en)en.hearNoise(v.x,v.z,fl)}}
const WH={fuse:(i,v)=>{for(const F of Level.FL){const f=F.fuses.find(q=>q.i===i);if(f){fuseGot(f,v,!wLive());return}}},exit:()=>openExit(!wLive()),
 door:(id,v)=>{if(id>=8000&&id<9000){const fl=Math.floor((id-8000)/10),tp=Level.FL[fl]&&Level.FL[fl].traps[(id-8000)%10];if(tp)tp.armed=false;return}if(id>=9000){const fl=Math.floor((id-9000)/10),vt=Level.FL[fl]&&Level.FL[fl].vents[(id-9000)%10];if(vt&&v)Props.ventOpenNow(vt);return}
  const d=Level.doorById(id);if(!d||d.target===v)return;d.target=v;d.rate=undefined;const fl=Math.floor(id/100);if(fl===P.fl){const dd=Math.hypot(d.wx-P.x,d.wz-P.z);if(dd<26){const vol=Math.max(.15,1-dd/26);v?Aud.dopen(vol):Aud.dclose(vol)}}},
 unlock:id=>{if(id>=9000){const k=id-9000,F=Level.FL[Math.floor(k/10)],vt=F&&F.vents[k%10];if(vt)Props.ventOpenNow(vt);return}const fl=Math.floor(id/100),d=Level.doorById(id);if(d&&d.locked)Level.withFloor(fl,()=>Level.unlock(d))},item:netItem};
/* ----- avatars of the other players ----- */
function mkAv(pid){if(pid===Net.pid||av[pid])return;const p=Net.players[pid],a=new Avatar(p?p.n:'?',Net.slot(pid),scene);
 a.T={pid,x:0,z:0,px:0,pz:0,hidden:false,lk:null,noisy:false,crouch:false,yaw:0,live:false,fl:0,held:null};try{a.held=Props.held();for(const k in a.held){const g=a.held[k];g.visible=false;g.position.set(.22,1.0,.32);a.g.add(g)}}catch(e){}a.fl=0;a.lit=false;
 a.src={x:0,y:1.4,z:0,col:new THREE.Color(0xffdfae),d:9,I:()=>a.lit&&a.g.visible?.8:0};a.srcFl=0;Level.FL[0].src.push(a.src);av[pid]=a;if(p&&p.q&&p.a===0)parseQ(pid,p.q)}
function rmAv(pid){const a=av[pid];if(!a)return;if(a.g.parent)a.g.parent.remove(a.g);try{a.tag.material.map.dispose();a.tag.material.dispose();a.m.mat.dispose()}catch(e){}const F=Level.FL[a.srcFl],i=F?F.src.indexOf(a.src):-1;if(i>=0)F.src.splice(i,1);delete av[pid];if(specId===pid)specId=null}
function parseQ(pid,q){const a=av[pid];if(!a)return;const p=q.split(','),x=+p[0],z=+p[1],yw=+p[2],pt=+p[3],fx=+p[4]|0,lk=+p[5],T=a.T,wasH=T.hidden,f=Math.max(0,Math.min(Level.nF-1,(fx>>4)&3)),fl=fx&15;T.held=HKN[(fx>>6)&7]||null;
 T.fl=f;a.fl=f;T.hidden=!!(fl&8);T.crouch=!!(fl&1);T.noisy=!!(fl&2);T.lk=lk>=0?(Level.FL[f].lockers[lk]||null):null;T.yaw=yw;if(!T.hidden){T.px=x;T.pz=z}
 if(!wasH&&T.hidden&&T.lk&&Net.isHost()&&en&&en.fl===f&&Level.withFloor(f,()=>en.cansee({x:T.px,z:T.pz,hidden:false,crouch:T.crouch})))en.check(T.lk,true);
 T.x=x;T.z=z;T.live=true;a.lit=!!(fl&4);a.snap(x,z,yw,pt,fl&1,fl&2,+p[6])}
function avFrame(dt){for(const pid in av){const a=av[pid],pl=Net.players[pid],al=pl&&pl.a===0&&a.T.live,f=a.T.fl|0;
 if(a.srcFl!==f&&Level.FL[f]){const o=Level.FL[a.srcFl],i=o?o.src.indexOf(a.src):-1;if(i>=0)o.src.splice(i,1);Level.FL[f].src.push(a.src);a.srcFl=f}
 a.vis(!!(al&&!a.T.hidden&&Level.FG[f]&&Level.FG[f].visible&&!(state==='spec'&&specId===pid)));if(a.held)for(const k in a.held)a.held[k].visible=a.T.held===k;a.update(dt,P.x,P.z);a.g.position.y=Level.fy(f)+Level.gy(a.x,a.z,Level.FL[f].stairs);if(a.has){a.src.x=a.x-Math.sin(a.yaw)*1.4;a.src.z=a.z-Math.cos(a.yaw)*1.4}}}
/* ----- sync tick ----- */
function netTick(dt){poseT-=dt;
 if(poseT<=0){poseT=.08;if(state==='play'&&!dead&&!escd){const fl=(P.crouch?1:0)|(P.noisy?2:0)|(fon&&bat>0&&!H&&!V?4:0)|((H||V)?8:0)|(P.fl<<4)|((HI[heldType()]||0)<<6);Net.pose(`${r2(P.x)},${r2(P.z)},${r2(Math.atan2(Math.sin(yaw),Math.cos(yaw)))},${r2(pitch)},${fl},${H?Level.lockers.indexOf(H):-1}`)}}
 if(Net.isHost()){enT-=dt;if(enT<=0){enT=.08;const g=en.g.position,s=`${day}|${r2(g.x)}|${r2(g.z)}|${r2(en.g.rotation.y)}|${Math.max(0,ES.indexOf(en.state))+10*en.fl}|${en.tgtPid||''}`;const nw=performance.now();if(s!==lastEStr||nw-lastESent>1500){lastEStr=s;lastESent=nw;Net.sendEnemy(s)}}}
 chkT-=dt;if(chkT<=0){chkT=.6;dayCheck();Net.watchdog()}}
function dayCheck(){if(!Net.isHost()||!mpPlay||ending||!Net.m||Net.m.s!==1)return;const ks=Object.keys(Net.players);if(!ks.length||!ks.every(k=>Net.players[k].a>0))return;ending=true;
 setTimeout(()=>{ending=false;if(!Net.active||!Net.isHost()||!Net.m||Net.m.s!==1)return;const ps=Net.players,k2=Object.keys(ps);if(!k2.length||!k2.every(k=>ps[k].a>0))return;
  const ex=k2.filter(k=>ps[k].a===2).map(k=>ps[k].n);if(ex.length)Net.finish('W:'+ex.join(', '));else if(Net.m.d>=MAXD)Net.finish('L');else Net.nextDay(Net.m.d+1)},3600)}
/* ----- the enemy for N players: the host runs him, everyone else follows ----- */
function enemyTick(dt){en.lis=P;setCfg();en.pfl=P.fl;if(!MP){const pf=P.fl;if(en.fl===pf)en.update(dt,P,keys);else{Level.use(en.fl);en.update(dt,EDUMMY,keys);en.dist=99;Level.use(pf)}en.pv.visible=Level.FG[en.fl].visible;if(en.fl===pf&&Math.abs(en.g.position.y-(Level.fy(pf)+py))>1.8)en.dist=99;return}
 if(Net.isHost()){const T=[],now=performance.now();if(state==='play'&&!dead&&!escd)T.push(P);for(const k in av){const a=av[k],p=Net.players[k];if(a.T.live&&p&&p.a===0&&!(dying[k]>now))T.push(a.T)}
  const fOf=t=>t===P?P.fl:(t.fl|0),onF=T.filter(t=>fOf(t)===en.fl),pf=P.fl;
  en.pfl=T.length?fOf(T[Math.floor(now/12000)%T.length]):en.fl;
  Level.use(en.fl);en.update(dt,onF.length?onF:EDUMMY,keys);const g=en.g.position;en.tgtPid=(en.tgt&&en.tgt.pid)||'';
  if(en.found){en.found=false;const v=onF.find(t=>t.hidden&&t.lk&&t.lk===en.lk);if(v)killT(v,now);en.state='patrol';en.T=null;en.cool=3}
  else for(const t of onF){if(t.hidden)continue;const d=Math.hypot(t.x-g.x,t.z-g.z);if(d<1.15&&en.state!=='patrol'||d<.9){killT(t,now);break}}
  Level.use(pf);en.pv.visible=Level.FG[en.fl].visible;en.dist=en.fl===pf?Math.hypot(P.x-g.x,P.z-g.z):99}
 else{en.sb=enS;en.net=enNet&&enNet.day===day?enNet:null;if(en.net&&en.net.fl!==undefined)en.fl=Math.max(0,Math.min(Level.nF-1,en.net.fl));en.tgtPid=en.net?en.net.pid:'';en.puppet(dt);en.pv.visible=Level.FG[en.fl].visible;en.dist=en.fl===P.fl?Math.hypot(P.x-en.g.position.x,P.z-en.g.position.z):99}}

function killT(t,now){if(t===P)pendKill=true;else{Net.kill(t.pid);dying[t.pid]=now+9000}en.wait=2.4;if(en.state!=='scare'){en.state='patrol';en.T=null;en.cool=4}}
/* ----- spectating ----- */
function alivePids(){return Object.keys(av).filter(k=>{const p=Net.players[k];return p&&p.a===0&&av[k].T.live}).sort()}
function pickSpec(){const l=alivePids();if(!l.length){specId=null;return}if(!l.includes(specId))specId=l[0]}
function specNext(d){const l=alivePids();if(!l.length)return;const i=l.indexOf(specId);specId=l[i<0?0:(i+d+l.length)%l.length]}
function updSpec(dt){pickSpec();time+=dt;const a=specId&&av[specId];
 if(a&&a.has){if((a.T.fl|0)!==P.fl){const f=a.T.fl|0;Level.FG[P.fl].visible=false;P.fl=f;Level.FG[f].visible=true;Level.use(f);floorLook()}cam.position.set(a.x,FY()+(a.T.hidden?1.55:1.65-.6*a.crouch)+Level.gy(a.x,a.z),a.z);{const ht=a.T.held;for(const k in HELD)HELD[k].visible=k===ht;if(ht){const h=HELD[ht];h.position.set(.27,-.27,-.52);h.rotation.set(-.35,.5,.15)}}cam.rotation.set(a.spitch||0,a.yaw,0);P.x=a.x;P.z=a.z;P.yaw=a.yaw;P.hidden=a.T.hidden;fl.intensity=a.lit&&!a.T.hidden?2.1:0;cam.fov=SET.fov;cam.updateProjectionMatrix();$('specname').textContent=a.nick}
 else{fl.intensity=0;$('specname').textContent='nobody'}
 Level.updLights(P.x,P.z,dt,0,time);updDust(dt);Props.update(dt,time,P);Aud.setHum(0,0);
 const d=en.dist,ch=chaseOn();if(d<16){eStep-=dt;if(eStep<=0){Aud.thud(1-d/16);eStep=ch?.4:.8}}}
function enterSpec(msg){state='spec';document.exitPointerLock();hide_('lockerfx');hide_('killfx');hide_('lids');hide_('note');for(const k in HELD)HELD[k].visible=false;ren.domElement.style.filter='';$('flash').style.opacity=0;$('chasefx').style.opacity=0;Aud.chase(false);wasCh=false;Aud.muffle(false);
 show('hud');hide_('lockhint');$('hud').classList.add('spec');show('spec');if(msg)say(msg,4500);specId=null;pickSpec()}
function mpDie(){const d=[];let k=0;const put=t=>{const ang=k*2.4,r=.35+.1*k++;let x=P.x+Math.cos(ang)*r,z=P.z+Math.sin(ang)*r;if(Level.blocked(x,z,.15)){x=P.x;z=P.z}d.push({nid:Net.nid(),t:netT(t,P.fl),x,z})};
 for(let i=0;i<bot;i++)put('bottle');for(let i=0;i<bats;i++)put('battery');if(hasKey)put('key');if(hasSD)put('screwdriver');Net.drop(d);bot=0;bats=0;hasKey=false;hasSD=false;hud();
 if(H){const l=H;H=null;setTimeout(()=>{l.open=false},2500)}dead=true;P.hidden=false;P.lk=null;Net.setA(1);en.state='patrol';en.T=null;en.wait=0;en.cool=3;enterSpec('You were caught.')}
function mpEscape(){escd=true;if(H)H=null;Net.setA(2);enterSpec('YOU ESCAPED.');say('YOU ESCAPED.',6000)}
/* ----- day / party flow ----- */
function resetRun(){vk=0;vHint=0;exh=0;vfade=0;bodies.length=0;keys=0;bat=1;bot=0;hasKey=false;hasSD=false;crouchOn=false;V=null;py=0;stairFx=null;bats=0;sel='bottle';nNotes=0;stam=1;H=null;fon=true;blackout=0;crouch=0;dead=false;escd=false;paused=false;pendKill=false;dying={};ending=false;wasCh=false;noteT=0;eventT=15;enNet=null;enS.buf=null;enS.off=null;enS.lastTs=null;lastESent=0;lastEStr='';
 P.hidden=false;P.lk=null;P.crouch=false;P.noisy=false;P.pid=Net.pid;for(const k in KEYS)KEYS[k]=0;Net.resetPose();
 document.querySelectorAll('#fuses i').forEach(e=>e.classList.remove('on'));$('obj').textContent='FIND THE FUSES';$('note').classList.add('hidden');$('hud').classList.remove('spec');
 ['spec','over','pause','killfx','lockerfx'].forEach(hide_);ren.domElement.style.filter='';$('flash').style.opacity=0;$('chasefx').style.opacity=0;Aud.setHum(0,0);hud()}
function mpStartDay(m){mpPlay=false;MP=true;day=m.d;Aud.chase(false);for(const k in av)rmAv(k);state='wait';document.exitPointerLock();
 ['menu','mpmenu','lobby','over','how','settings','pause','hud','spec','lids','card'].forEach(hide_);
 $('dayT').textContent='DAY '+day;$('dayP').textContent=DAYT[day-1];$('dayGo').classList.add('hidden');$('dayNew').classList.add('hidden');show('dayscr');
 setTimeout(()=>{if(!Net.active||!Net.m||Net.m.s!==1)return;const mm=Net.m;mkWorld(mm.sd,true);resetRun();wReady=performance.now()+2200;Net.watchWorld(WH);for(const k of Net.sorted())mkAv(k);apply();mpPlay=true;begin()},day>1?2400:150)}
function onMeta(m,old){lobRender();if(!m)return;if(old&&old.h!==m.h){enS.buf=null;enS.off=null;enS.lastTs=null;lastESent=0}
 if(m.s===1&&(!old||old.s!==1||old.d!==m.d||old.sd!==m.sd))return mpStartDay(m);
 if(m.s===2&&(!old||old.s!==2))return mpEnd(m);
 if(m.s===0&&old&&old.s!==0)mpToLobby()}
function mpEnd(m){mpPlay=false;state='over';document.exitPointerLock();['hud','spec','lids','killfx','lockerfx','pause'].forEach(hide_);Aud.chase(false);Aud.setHum(0,0);ren.domElement.style.filter='';
 const won=m.r&&m.r[0]==='W',names=won?m.r.slice(2):'',me=Net.players[Net.pid],iEsc=me&&me.a===2;
 $('overT').textContent=won?(iEsc?'YOU ESCAPED':'THEY GOT OUT'):'THE '+ORD[MAXD-1]+' DAY IS OVER';$('overP').textContent=won?`${names} escaped on day ${m.d}. The halls fall silent. For now.`:MAXD+' days. He has you all now.';
 $('overS').textContent=`DAY ${m.d} · TIME ${fmt(time)}`;const b=$('overBtn'),host=Net.isHost();b.textContent=host?'Back to lobby':'Waiting for the host…';b.disabled=!host;b.onclick=()=>Net.toLobby();$('overLeave').classList.remove('hidden');show('over')}
function mpToLobby(){mpPlay=false;started=false;state='menu';Net.unwatch();for(const k in av)rmAv(k);document.exitPointerLock();['hud','spec','over','lids','killfx','lockerfx','pause','dayscr','card'].forEach(hide_);$('overLeave').classList.add('hidden');ren.domElement.style.filter='';$('flash').style.opacity=0;Aud.chase(false);Aud.setHum(0,0);Aud.level(.6);show('lobby');lobRender()}
function mpLeaveNow(){try{Net.leave()}catch(e){}toMenu()}
function askConfirm(msg,yes){if($('cfm'))return;const d=document.createElement('div');d.id='cfm';d.style.cssText='position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.72)';
 d.innerHTML='<div style="background:#14100d;border:1px solid #6b5a42;padding:26px 34px;text-align:center;font-family:inherit;color:#e8dcc4;max-width:340px"><p style="margin:0 0 18px;font-size:20px"></p><button class="gb sm" id="cfmN" style="margin:0 8px">Stay</button><button class="gb sm" id="cfmY" style="margin:0 8px">Leave</button></div>';
 d.querySelector('p').textContent=msg;document.body.appendChild(d);const close=()=>{if(d.parentNode)d.parentNode.removeChild(d)};d.querySelector('#cfmN').onclick=e=>{e.stopPropagation();close()};d.querySelector('#cfmY').onclick=e=>{e.stopPropagation();close();yes()};d.onclick=e=>e.stopPropagation()}
function mpLeave(){askConfirm('Leave the party?',mpLeaveNow)}
/* ----- soft resets: the page is NEVER reloaded (reloading breaks about:blank launches) ----- */
function showDay(r,auto){RUN=r;day=r.day;time=r.time||0;hide_('menu');$('dayT').textContent='DAY '+day;const left=MAXD-day+1;$('dayP').textContent=(r.died?`It found you. ${left} ${left===1?'day':'days'} left. `:'')+DAYT[day-1];$('dayGo').classList.toggle('hidden',!!auto);$('dayNew').classList.toggle('hidden',!!auto);show('dayscr');
 clearTimeout(autoT);if(auto)autoT=setTimeout(()=>{if(state==='menu'&&!MP&&!started&&!$('dayscr').classList.contains('hidden'))begin()},3200)}
function softWorld(keep){clearTimeout(autoT);if(!keep)document.exitPointerLock();started=false;state='menu';paused=false;mpPlay=false;hideT=0;kick=0;fovK=1;eStep=0;beatT=0;SC=null;snapT=0;scareT=0;
 for(const k in av)rmAv(k);
 ['menu','hud','spec','over','pause','killfx','lockerfx','lids','dayscr','daydone','card','settings','how','mpmenu','lobby','quit'].forEach(hide_);$('overLeave').classList.add('hidden');
 ren.domElement.style.filter='';$('flash').style.opacity=0;Aud.chase(false);Aud.setHum(0,0);Aud.muffle(false);Aud.level(1);
 mkWorld(SEED,true);resetRun()}
function spNextDay(){const r={day:day+1,time,died:1,seed:SEED,vo:[...VO]};saveRun(r);softWorld(true);showDay(r,true)}
function toMenu(){saveRun(null);RUN=null;MP=false;day=1;time=0;VO.clear();SEED=newSeed();softWorld();$('dayGo').classList.remove('hidden');$('dayNew').classList.remove('hidden');show('menu')}
/* ----- UI ----- */
function tint(slot){return'#'+PModel.TINT[slot%PModel.TINT.length].toString(16).padStart(6,'0')}
function lobRender(){if($('lobby').classList.contains('hidden'))return;const m=Net.m,host=Net.isHost();$('lobCode').textContent=Net.code||'';
 $('lobList').innerHTML=Net.sorted().map(k=>`<li><i style="background:${tint(Net.slot(k))}"></i>${hx(Net.players[k].n)}${m&&m.h===k?' <b>host</b>':''}${k===Net.pid?' <em>you</em>':''}</li>`).join('');
 {const pb=!!(m&&m.pb),b=$('lobPub');b.textContent=pb?(host?'Public party (click to make private)':'Public party'):(host?'Private party (click to make public)':'Private party');b.style.pointerEvents=host?'':'none';b.style.opacity=host?'':'.6'}
 $('lobStart').classList.toggle('hidden',!host);$('lobWait').classList.toggle('hidden',host);$('lobDiff').disabled=!host;const df=m?m.df:1;$('lobDiff').value=df;$('lobDName').textContent='Difficulty - '+DIFF[df].n}
function plistRender(){const e=$('plist');if(!e)return;e.innerHTML=MP?Net.sorted().map(k=>{const p=Net.players[k];return`<div class="${p.a===1?'dd':p.a===2?'es':''}"><i style="background:${tint(Net.slot(k))}"></i>${hx(p.n)}<u>${p.a===1?'✝':p.a===2?'✓':''}</u></div>`}).join(''):''}
function wireNet(){Net.cb={meta:onMeta,
 player:(pid,v,ev,old)=>{if(mpPlay&&pid!==Net.pid){if(ev==='add')mkAv(pid);else if(ev==='del')rmAv(pid);else if(av[pid]){if(v&&v.q&&v.a===0)parseQ(pid,v.q);else av[pid].T.live=false}}
  if(pid===Net.pid&&ev==='chg'&&v&&v.k&&(!old||old.k!==v.k)){if(state==='play'&&!dead&&!escd)pendKill=true;Net.clearKill()}
  if(ev!=='chg'||!old||!v||old.a!==v.a||old.n!==v.n){plistRender();lobRender()}},
 enemy:s=>{const p=s.split('|');if(enNet&&enNet.day!==+p[0]){enS.buf=null;enS.off=null;enS.lastTs=null}enNet={day:+p[0],x:+p[1],z:+p[2],r:+p[3],s:ES[(+p[4])%10]||'patrol',fl:Math.floor((+p[4])/10),pid:p[5]||''};pushSample(enS,{x:enNet.x,z:enNet.z,yaw:enNet.r},+p[6])},
 event:e=>{if(!mpPlay||!e||e.u===Net.pid)return;if(e.k===3)return;if(e.k===2){if(Net.isHost()&&en)en.hearNoise(e.x,e.z,e.f|0);return}if(e.k!==1)return;const ef=e.f|0;if(ef!==P.fl){if(Net.isHost()&&en)en.hearNoise(e.x,e.z,ef);return}spawnBottle(e.x,e.y,e.z,e.a,e.b,e.c)},
 gone:()=>{say('The party was closed.',3000);mpLeaveNow()}}}
function pubRefresh(quiet){const e=$('pubList');if(!e)return;if(!quiet)e.innerHTML='<div class="pe">Looking for parties…</div>';
 Net.listPublic((err,l)=>{if(err){e.innerHTML=`<div class="pe">${hx(err)}</div>`;return}
  e.innerHTML=l.length?l.map(p=>`<div class="pr"><span>${hx(p.h)}'s party</span><em>${p.n}/${Net.MAXP} · ${hx(DIFF[p.d]?DIFF[p.d].n:'')}</em><button class="gb sm" data-code="${hx(p.code)}">Join</button></div>`).join(''):'<div class="pe">No public parties right now. Create one!</div>'})}
function doMP(fn){if(!Net.init()){$('mpErr').textContent='Multiplayer could not load (is the network blocked?).';return}$('mpErr').textContent='Connecting…';
 fn(err=>{if(err){$('mpErr').textContent=err;return}MP=true;wireNet();hide_('mpmenu');show('lobby');for(const k in Net.players)plistRender();lobRender()})}
function bindMP(){$('mMP').onclick=()=>{hide_('menu');show('mpmenu');$('mpErr').textContent='';pubRefresh()};$('mpBack').onclick=()=>{hide_('mpmenu');show('menu')};
 $('mpCreate').onclick=()=>doMP(c=>Net.create($('mpNick').value,c,$('mpPub').checked));
 $('lobPub').onclick=()=>{if(Net.isHost()&&Net.m)Net.setPub(!Net.m.pb)};
 $('pubRef').onclick=pubRefresh;$('pubList').onclick=e=>{const b=e.target.closest('button[data-code]');if(b)doMP(c=>Net.join(b.dataset.code,$('mpNick').value,c))};
 setInterval(()=>{if(!$('mpmenu').classList.contains('hidden')&&!Net.active)pubRefresh(true)},8000);$('mpJoin').onclick=()=>doMP(c=>Net.join($('mpCode').value,$('mpNick').value,c));
 $('mpCode').oninput=e=>{e.target.value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'')};
 $('lobStart').onclick=()=>Net.start(Net.m?Net.m.df:1);$('lobLeave').onclick=mpLeave;$('lobDiff').oninput=e=>Net.setDiff(+e.target.value);
 $('lobCopy').onclick=()=>{try{navigator.clipboard.writeText(Net.code);$('lobCopy').textContent='Copied'}catch(e){}};
 const st=(id,fn)=>$(id).onclick=e=>{e.stopPropagation();fn()};st('specPrev',()=>specNext(-1));st('specNext',()=>specNext(1));st('specLeave',mpLeave);$('overLeave').onclick=mpLeave;
 /* Ctrl+W / closing the tab by accident: ask first while a run or party is in progress */
 addEventListener('beforeunload',e=>{const busy=(started||RUN||(MP&&Net.active))&&state!=='over'&&state!=='won'&&state!=='dead';if(!busy)return;e.preventDefault();e.returnValue='';return''});
 addEventListener('pagehide',()=>{if(MP&&Net.active)Net.leave()})}

/* ---------- touch controls (Mobile device mode) ---------- */
function tkey(code,down){dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code:code,key:code,bubbles:true,cancelable:true}))}
function goFS(){try{const d=document.documentElement,f=d.requestFullscreen||d.webkitRequestFullscreen;if(f){const p=f.call(d);if(p&&p.catch)p.catch(()=>{})}}catch(e){}try{const p=screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape');if(p&&p.catch)p.catch(()=>{})}catch(e){}}
let sprintOn=false;
function syncRun(){KEYS.ShiftLeft=sprintOn?1:0;const b=document.querySelector('.tb.run');if(b)b.classList.toggle('on',sprintOn)}
function resetTouch(){JOY.x=0;JOY.z=0;sprintOn=false;KEYS.ShiftLeft=0;const j=$('joy');if(j){j.classList.remove('on');j.style.left='';j.style.top=''}document.querySelectorAll('.tb.on').forEach(b=>{b.classList.remove('on');if(b.dataset.k)tkey(b.dataset.k,false)})}
function touchVis(){if(sprintOn&&!KEYS.ShiftLeft){sprintOn=false;syncRun()}/* the game clears Shift when you run out of breath */const tv=SET.dev==='mobile'&&started&&state==='play'&&!paused;if(tv===lastTv)return;lastTv=tv;$('touch').classList.toggle('hidden',!tv);if(!tv)resetTouch()}
function bindTouch(){
 const jz=$('joyz'),lz=$('lookz'),joy=$('joy'),jk=$('joyk'),RD=56;let jid=null,jx=0,jy=0,lid=null,lx=0,ly=0;
 const find=(e,id)=>{for(const t of e.changedTouches)if(t.identifier===id)return t;return null};
 jz.addEventListener('touchstart',e=>{e.preventDefault();if(jid!==null)return;const t=e.changedTouches[0];jid=t.identifier;jx=t.clientX;jy=t.clientY;joy.style.left=jx+'px';joy.style.top=jy+'px';jk.style.transform='translate(0,0)';joy.classList.add('on')},{passive:false});
 jz.addEventListener('touchmove',e=>{e.preventDefault();const t=find(e,jid);if(!t)return;let dx=t.clientX-jx,dy=t.clientY-jy;const len=Math.hypot(dx,dy),k=len>RD?RD/len:1;
  jk.style.transform='translate('+(dx*k).toFixed(1)+'px,'+(dy*k).toFixed(1)+'px)';
  if(len<RD*.25){JOY.x=0;JOY.z=0}else{JOY.x=dx*k/RD;JOY.z=dy*k/RD}},{passive:false});
 const jend=e=>{const t=find(e,jid);if(!t)return;jid=null;joy.style.left='';joy.style.top='';jk.style.transform='';JOY.x=0;JOY.z=0;joy.classList.remove('on')};
 jz.addEventListener('touchend',jend);jz.addEventListener('touchcancel',jend);
 lz.addEventListener('touchstart',e=>{e.preventDefault();if(lid!==null)return;const t=e.changedTouches[0];lid=t.identifier;lx=t.clientX;ly=t.clientY},{passive:false});
 lz.addEventListener('touchmove',e=>{e.preventDefault();const t=find(e,lid);if(!t)return;const dx=t.clientX-lx,dy=t.clientY-ly;lx=t.clientX;ly=t.clientY;
  if(state!=='play'||paused)return;yaw-=dx*.0046*SET.sens;pitch=Math.max(-1.4,Math.min(1.4,pitch+(SET.invy?1:-1)*dy*.0046*SET.sens))},{passive:false});
 const lend=e=>{if(find(e,lid))lid=null};lz.addEventListener('touchend',lend);lz.addEventListener('touchcancel',lend);
 document.querySelectorAll('.tb').forEach(b=>{const k=b.dataset.k;
  const dn=e=>{e.preventDefault();e.stopPropagation();b.classList.add('on');if(k==='ShiftLeft'){sprintOn=!sprintOn;syncRun()}else if(k)tkey(k,true);else if(b.id==='tpause')pause()};
  const up=e=>{e.preventDefault();if(k==='ShiftLeft')return;b.classList.remove('on');if(k)tkey(k,false)};
  b.addEventListener('touchstart',dn,{passive:false});b.addEventListener('touchend',up,{passive:false});b.addEventListener('touchcancel',up,{passive:false})});
 addEventListener('contextmenu',e=>{if(SET.dev==='mobile')e.preventDefault()})}

let lastF=0,fAcc=0,fN=0,okT=0,failPR=99,lastAvg=0,lastPR=0,lastRed=false,noGain=false;
function setPR(v){prCur=v;ren.setPixelRatio(v);ren.setSize(innerWidth,innerHeight)}
/* adaptive resolution: drop render scale when the frame rate is low, creep back up when it is healthy */
function perf(ms){if(ms>250||document.hidden||state==='pause'||paused)return;fAcc+=ms;fN++;if(fAcc<1500)return;const avg=fAcc/fN;fAcc=0;fN=0;
 if(avg>24&&prCur>.7&&!noGain){if(lastRed&&avg>lastAvg*.93){setPR(lastPR);noGain=true;lastRed=false}else{lastAvg=avg;lastPR=prCur;lastRed=true;failPR=prCur;okT=0;setPR(Math.max(.7,prCur*.85))}}
 else if(avg<=24){lastRed=false;if(avg<18.5&&prCur<prMax){okT+=1.5;if(okT>=9){okT=0;const n=Math.min(prMax,failPR-.01,prCur+.1);if(n>prCur+.01)setPR(n)}}else okT=0}}
function tickGame(dt,render){
 if(!started){if(render){Menu3D.update(dt,mxn,myn);ren.render(Menu3D.scene,Menu3D.cam)}}
 else{if(state==='play')update(dt);else if(state==='scare')updScare(dt);else if(state==='wake')updWake(dt);else if(state==='spec')updSpec(dt);if(MP&&mpPlay){if(state==='wake'||state==='spec')enemyTick(dt);avFrame(dt);netTick(dt)}Level.updVis(P.x,P.z,P.fl);if(render)ren.render(scene,cam)}}
function loop(){requestAnimationFrame(loop);touchVis();const now=performance.now(),raw=now-lastF;if(raw<11.5)return;lastF=now;perf(raw);/* cap at ~80fps on very fast displays */
 const dt=Math.min(clock.getDelta(),.05);tickGame(dt,true)}
/* browsers stop animation frames in a background tab, so a worker timer keeps the simulation (and the party) alive */
function bgTick(){const now=performance.now();if(now-lastF<130||!window.__loopOn)return;let el=Math.min((now-lastF)/1000,1.5);lastF=now;try{clock.getDelta()}catch(e){}while(el>1e-4){const s=Math.min(el,.05);tickGame(s,false);el-=s}}
try{const w=new Worker(URL.createObjectURL(new Blob(['setInterval(function(){postMessage(1)},50)'],{type:'text/javascript'})));w.onmessage=bgTick}catch(e){setInterval(bgTick,200)}
window.LHBoot?LHBoot.run(init):init();
})();
