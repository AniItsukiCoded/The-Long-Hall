/* THE LONG HALLS: multiplayer layer (Firebase Realtime Database, no accounts).
   Everything lives under /p/<CODE> and is deleted when players leave or disconnect:
     m  {h host, s state 0 lobby/1 playing/2 finished, d day, sd seed, df difficulty, r result, pb 1 public/0 private}
     u/<pid> {n nickname, q "x,z,yaw,pitch,flags,locker", a 0 alive/1 dead/2 escaped, k kill signal}
     e  "day|x|z|rot|state|targetPid"     (written by the host only)
     w  {f fuses, x exit, d doors, k unlocked doors, i items}   (cleared every new day)
     ev {id: thrown bottle}               (auto removed after a few seconds)
   /pub/<CODE> {h host nickname, n players, s, d difficulty, t heartbeat}  public list entry, written by the host only
     while the party is public and waiting in the lobby; removed when it starts, goes private, or the host leaves.
   Nothing about a player is stored anywhere else: no accounts, no history. */
const FB_CONFIG={apiKey:"AIzaSyBlfsHSYeqOCo2ftRViCByEUXqpwKFdves",authDomain:"the-long-halls.firebaseapp.com",databaseURL:"https://the-long-halls-default-rtdb.firebaseio.com",projectId:"the-long-halls",storageBucket:"the-long-halls.firebasestorage.app",messagingSenderId:"1083342546433",appId:"1:1083342546433:web:bd6a5ab431cfa1fc39c200"};
const Net={
 MAXP:4,db:null,ref:null,code:null,pid:null,nick:'',m:null,players:{},cb:{},active:false,subs:[],wsubs:[],ok:false,lastE:0,eDay:0,_ctr:0,_lastQ:'',_pubSig:'',_pt:null,_hb:null,
 init(){if(this.ok)return true;try{if(typeof firebase==='undefined')throw 0;if(!firebase.apps.length)firebase.initializeApp(FB_CONFIG);this.db=firebase.database();this.ok=true}catch(e){this.ok=false}return this.ok},
 clean(s){s=String(s||'').replace(/[^\w \-.]/g,'').replace(/\s+/g,' ').trim().slice(0,14);return s||('Player'+(100+Math.random()*900|0))},
 mkCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<5;i++)s+=A[Math.random()*A.length|0];return s},
 mkPid(){return'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,4)},
 isHost(){return!!this.m&&this.m.h===this.pid},
 sorted(){return Object.keys(this.players).sort()},
 slot(pid){return Math.max(0,this.sorted().indexOf(pid))},
 uniqueNick(n,list){let b=n,i=2;while(list.some(x=>x.toLowerCase()===n.toLowerCase())){const s=String(i++);n=b.slice(0,14-s.length)+s}return n},
 /* ---------- party ---------- */
 create(nick,done,pub){pub=pub!==false;if(!this.init())return done('Could not load Firebase.');this.nick=this.clean(nick);this.pid=this.mkPid();let tries=0;
  const attempt=()=>{if(++tries>6)return done('Could not create a party. Try again.');const code=this.mkCode(),r=this.db.ref('p/'+code);
   r.transaction(cur=>cur===null?{m:{h:this.pid,s:0,d:1,sd:1,df:1,pb:pub?1:0},t:firebase.database.ServerValue.TIMESTAMP,u:{[this.pid]:{n:this.nick,a:0}}}:undefined,(err,ok)=>{
    if(err)return done('Could not reach the server.');if(!ok)return attempt();this.enter(code,done)},false)};attempt()},
 join(code,nick,done){if(!this.init())return done('Could not load Firebase.');code=String(code||'').toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length!==5)return done('Enter the 5 character party code.');
  this.nick=this.clean(nick);this.pid=this.mkPid();const r=this.db.ref('p/'+code);
  r.child('m').get().then(ms=>{if(!ms.exists())return done('No party with that code.');return r.child('u').get().then(us=>{const u=us.val()||{},names=Object.values(u).map(x=>x.n);
   if(names.length>=this.MAXP)return done('That party is full.');this.nick=this.uniqueNick(this.nick,names);
   return r.child('u/'+this.pid).set({n:this.nick,a:0}).then(()=>this.enter(code,done))})}).catch(()=>done('Could not reach the server.'))},
 enter(code,done){this.code=code;this.ref=this.db.ref('p/'+code);this.active=true;this.players={};this.m=null;this.lastE=Date.now();this._pubSig='';clearInterval(this._hb);this._hb=setInterval(()=>this.syncPub(true),30000);
  const mine=this.ref.child('u/'+this.pid);mine.onDisconnect().remove();
  const on=(path,ev,fn)=>{const r=this.ref.child(path);r.on(ev,fn);this.subs.push([r,ev,fn])};
  on('m','value',s=>{const v=s.val();if(!v){if(this.active&&this.m){this.m=null;this.cb.gone&&this.cb.gone()}return}const old=this.m;this.m=v;this.cb.meta&&this.cb.meta(v,old);this.fixHost();this.syncPub()});
  on('u','child_added',s=>{this.players[s.key]=s.val();this.cb.player&&this.cb.player(s.key,s.val(),'add');this.dc();this.syncPub()});
  on('u','child_changed',s=>{const o=this.players[s.key];this.players[s.key]=s.val();this.cb.player&&this.cb.player(s.key,s.val(),'chg',o)});
  on('u','child_removed',s=>{const o=this.players[s.key];delete this.players[s.key];this.cb.player&&this.cb.player(s.key,o,'del');this.dc();this.fixHost();this.syncPub()});
  on('e','value',s=>{const v=s.val();if(typeof v==='string'){this.lastE=Date.now();this.cb.enemy&&this.cb.enemy(v)}});
  on('ev','child_added',s=>{this.cb.event&&this.cb.event(s.val(),s.key)});
  done(null)},
 /* when I am alone the whole party is deleted if my connection drops; otherwise only my own entry is */
 dc(){if(!this.active)return;const n=Object.keys(this.players).length;if(n===this._n)return;this._n=n;
  const mine=this.ref.child('u/'+this.pid);if(n<=1){this.ref.onDisconnect().remove()}else{this.ref.onDisconnect().cancel().then(()=>mine.onDisconnect().remove())}},
 fixHost(){if(!this.active||!this.m)return;const ks=this.sorted();if(ks.length&&!this.players[this.m.h]&&ks[0]===this.pid)this.ref.child('m/h').set(this.pid)},
 /* a silent host (frozen tab) is replaced by the next player in line */
 watchdog(){if(!this.active||!this.m||this.isHost()||this.m.s!==1)return;const ks=this.sorted().filter(k=>k!==this.m.h);if(Date.now()-this.lastE>12000&&ks[0]===this.pid){this.lastE=Date.now();this.ref.child('m/h').set(this.pid)}},
 leave(){if(!this.active)return;clearInterval(this._hb);clearTimeout(this._pt);if(this.isHost())this.db.ref('pub/'+this.code).remove();const ref=this.ref,pid=this.pid,alone=Object.keys(this.players).filter(k=>k!==pid).length===0;this.unwatch();this.subs.forEach(([r,e,f])=>r.off(e,f));this.subs=[];this.active=false;
  if(alone)ref.remove();else ref.child('u/'+pid).remove();this.code=null;this.m=null;this.players={};this._n=0},
 /* ---------- public party list ---------- */
 setPub(v){if(this.isHost())this.ref.child('m/pb').set(v?1:0)},
 /* host only: keep /pub/<code> in step with the lobby (public + waiting). Debounced; force = heartbeat. */
 syncPub(force){if(!this.active||!this.m)return;if(!this.isHost()){this._pubSig='';return}
  clearTimeout(this._pt);this._pt=setTimeout(()=>{if(!this.active||!this.m||!this.isHost())return;const ref=this.db.ref('pub/'+this.code);
   if(!this.m.pb||this.m.s!==0){if(this._pubSig!=='off'){this._pubSig='off';ref.remove()}return}
   const me=this.players[this.pid],n=Math.max(1,Math.min(this.MAXP,Object.keys(this.players).length)),h=me?me.n:this.nick,sig=[this.pid,h,n,this.m.df].join('|');
   if(sig===this._pubSig&&!force)return;this._pubSig=sig;ref.onDisconnect().remove();
   ref.set({h:String(h).slice(0,14),n,s:0,d:this.m.df|0,t:firebase.database.ServerValue.TIMESTAMP})},force?0:250)},
 listPublic(cb){if(!this.init())return cb('Could not load Firebase.');
  Promise.all([this.db.ref('.info/serverTimeOffset').once('value'),this.db.ref('pub').once('value')]).then(([o,s])=>{const off=o.val()||0,now=Date.now()+off,v=s.val()||{},out=[];
   for(const c in v){const x=v[c];if(!x||typeof x.h!=='string'||typeof x.t!=='number')continue;if(now-x.t>100000||x.s!==0||x.n>=this.MAXP)continue;out.push({code:c,h:x.h,n:x.n,d:x.d|0,t:x.t})}
   out.sort((a,b)=>b.t-a.t);cb(null,out)}).catch(()=>cb('Could not reach the server.'))},
 /* ---------- lobby / day flow (host) ---------- */
 setDiff(i){if(this.isHost())this.ref.child('m/df').set(i)},
 start(df){if(!this.isHost())return;const up={'m/s':1,'m/d':1,'m/sd':(Math.random()*4294967295)>>>0,'m/df':df,'m/r':null,'w':null,'e':null};this.sorted().forEach(k=>{up['u/'+k+'/a']=0;up['u/'+k+'/q']=null;up['u/'+k+'/k']=null});this.ref.update(up)},
 nextDay(d){if(!this.isHost())return;const up={'m/d':d,'m/sd':(Math.random()*4294967295)>>>0,'w':null,'e':null};this.sorted().forEach(k=>{up['u/'+k+'/a']=0;up['u/'+k+'/q']=null;up['u/'+k+'/k']=null});this.ref.update(up)},
 finish(result){if(!this.isHost())return;this.ref.update({'m/s':2,'m/r':String(result).slice(0,120),'w':null,'e':null})},
 toLobby(){if(!this.isHost())return;const up={'m/s':0,'m/r':null,'w':null,'e':null};this.sorted().forEach(k=>{up['u/'+k+'/a']=0;up['u/'+k+'/q']=null;up['u/'+k+'/k']=null});this.ref.update(up)},
 /* ---------- player ---------- */
 pose(q){if(!this.active||q===this._lastQ)return;this._lastQ=q;this.ref.child('u/'+this.pid+'/q').set(q)},
 resetPose(){this._lastQ=''},
 setA(a){if(!this.active)return;this._lastQ='';const up={};up['u/'+this.pid+'/a']=a;if(a)up['u/'+this.pid+'/q']=null;this.ref.update(up)},
 kill(pid){if(this.active)this.ref.child('u/'+pid+'/k').set(Date.now()%1e9)},
 clearKill(){if(this.active)this.ref.child('u/'+this.pid+'/k').remove()},
 sendEnemy(s){if(this.active)this.ref.child('e').set(s)},
 /* ---------- world ---------- */
 unwatch(){this.wsubs.forEach(([r,e,f])=>r.off(e,f));this.wsubs=[]},
 watchWorld(h){this.unwatch();const w=(path,evs,fn)=>{const r=this.ref.child('w/'+path);evs.forEach(e=>{const f=r.on(e,s=>fn(s.key,s.val(),e));this.wsubs.push([r,e,f])})};
  w('f',['child_added','child_changed'],(k,v)=>h.fuse(+k,v));w('x',['value'],(k,v)=>{if(v)h.exit(v)});
  w('d',['child_added','child_changed'],(k,v)=>h.door(+k,v));w('k',['child_added'],k=>h.unlock(+k));
  w('i',['child_added','child_changed','child_removed'],(k,v,e)=>h.item(k,e==='child_removed'?null:v))},
 fuse(i,done){this.ref.child('w/f/'+i).transaction(c=>c?undefined:this.pid,(e,ok)=>done&&done(!e&&ok),false)},
 exit(){if(this.active)this.ref.child('w/x').set(this.pid)},
 door(id,t){if(this.active)this.ref.child('w/d/'+id).set(t?1:0)},
 unlock(id){if(this.active)this.ref.child('w/k/'+id).set(1)},
 /* base items: absent -> 0 (taken). dropped items are objects: object -> removed (taken) */
 take(nid,dropped,done){this.ref.child('w/i/'+nid).transaction(c=>dropped?(c&&typeof c==='object'?null:undefined):(c===0?undefined:0),(e,ok)=>done(!e&&ok),false)},
 drop(list){if(!this.active||!list.length)return;const up={};list.forEach(d=>{up['w/i/'+d.nid]={t:d.t,x:Math.round(d.x*100)/100,z:Math.round(d.z*100)/100}});this.ref.update(up)},
 nid(){return'd'+this.pid.slice(-5)+(this._ctr++).toString(36)},
 throwB(o){if(!this.active)return;const r=this.ref.child('ev').push(o);setTimeout(()=>r.remove(),5000)}
};
