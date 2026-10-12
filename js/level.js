/* Deterministic helpers: every player in a party builds the SAME halls from a shared seed.
   Comparator-based shuffles are engine specific, so shuffles use Fisher-Yates on Math.random (seeded during a build). */
if(!Array.prototype.shuf)Object.defineProperty(Array.prototype,'shuf',{value:function(){for(let i=this.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)),t=this[i];this[i]=this[j];this[j]=t}return this},enumerable:false});
Math._r=Math._r||Math.random;
const unseeded=f=>function(...a){const s=Math.random;Math.random=Math._r;try{return f.apply(this,a)}finally{Math.random=s}};
const mulberry=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const THEMES={
 basement:{name:'BASEMENT',wall:'brick',floor:'#2b2b28',rooms:['storage','boiler','cells','storage'],hk:['crate','barrel','shelf','bucket','trunk','crate','barrel','cabinet','boiler'],pipe:.92,fog:.17},
 house:{name:'GROUND FLOOR',wall:'#2a2519',floor:'#1f150d',rooms:['study','parlor','bedroom','storage'],hk:null,pipe:.15,fog:.145},
 house2:{name:'SECOND FLOOR',wall:'#1b2a24',floor:'#241a12',rooms:['bedroom','study','parlor','bedroom'],hk:null,pipe:.1,fog:.145},
 attic:{name:'ATTIC',wall:'#33261a',floor:'#2a2018',rooms:['storage','bedroom','storage','study'],hk:['trunk','crate','candles','stool','table','bucket','trunk','plant'],pipe:.05,fog:.125}};
const Level={S:3,H:3.2,W:23,D:23,FL:[],FG:[],nF:1,sf:0,ef:0,stairs:[],vents:[],g:[],doors:[],dmap:{},col:[],rooms:[],items:[],keys:[],src:[],pool:[],lockers:[],fuses:[],lamps:[],_lt:0,
rnd(){return Math.random()},
paper(base){const N=512,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d'),wy=N*.66;
 x.fillStyle=base||'#2a2519';x.fillRect(0,0,N,N);
 for(let i=0;i<N;i+=32){x.fillStyle=(i/32)%2?'rgba(10,8,4,.30)':'rgba(130,112,70,.10)';x.fillRect(i,0,16,wy)}
 for(let y=20;y<wy-10;y+=44)for(let X=16;X<N;X+=32){const o=((X-16)/32)%2?22:0;x.fillStyle='rgba(12,8,4,.38)';x.beginPath();x.arc(X,y+o,4,0,6.3);x.fill();x.fillRect(X-1,y+o-12,2,8)}
 /* water stains running down from the ceiling */
 for(let i=0;i<7;i++){const px=Math.random()*N,w=14+Math.random()*50,h=60+Math.random()*180,g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(12,8,2,.5)');g.addColorStop(1,'rgba(12,8,2,0)');x.fillStyle=g;x.fillRect(px,0,w,h)}
 /* dark wood wainscot */
 x.fillStyle='#24170e';x.fillRect(0,wy,N,N-wy);
 for(let i=0;i<8;i++){x.fillStyle='rgba(0,0,0,.55)';x.fillRect(i*64,wy,3,N-wy);x.fillStyle=`rgba(${Math.random()*40|0},${Math.random()*20|0},0,.25)`;x.fillRect(i*64+3,wy,61,N-wy)}
 for(let i=0;i<260;i++){x.strokeStyle=`rgba(0,0,0,${.1+Math.random()*.15})`;x.beginPath();const X=Math.random()*N,Y=wy+Math.random()*(N-wy);x.moveTo(X,Y);x.lineTo(X+(Math.random()-.5)*4,Y+8+Math.random()*30);x.stroke()}
 x.fillStyle='#120a05';x.fillRect(0,wy-8,N,12);x.fillStyle='rgba(170,125,70,.28)';x.fillRect(0,wy-8,N,2);x.fillStyle='#0f0804';x.fillRect(0,N-26,N,26);x.fillStyle='rgba(170,125,70,.12)';x.fillRect(0,N-26,N,2);
 for(let i=0;i<30000;i++){const v=Math.random()*70|0;x.fillStyle=`rgba(${v},${v},${v},.1)`;x.fillRect(Math.random()*N,Math.random()*N,1,1)}
 const blob=(px,py,r,col)=>{for(const ox of[-N,0,N]){const X=px+ox,gr=x.createRadialGradient(X,py,0,X,py,r);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(X-r,py-r,r*2,r*2)}};
 for(let i=0;i<14;i++)blob(Math.random()*N,Math.random()*N,30+Math.random()*80,Math.random()<.6?'rgba(5,3,0,.35)':'rgba(30,45,25,.16)');
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return t},
brick(){const N=512,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.fillStyle='#121010';x.fillRect(0,0,N,N);
 for(let r=0;r<16;r++)for(let k=-1;k<9;k++){const X=k*64+(r%2?32:0),v=Math.random(),h=18+(v*18|0);x.fillStyle=`rgb(${60+h+Math.random()*20|0},${34+h*.5+Math.random()*10|0},${28+h*.4|0})`;x.fillRect(X+2,r*32+2,60,28);if(Math.random()<.2){x.fillStyle='rgba(0,0,0,.35)';x.fillRect(X+2,r*32+2,60,28)}}
 for(let i=0;i<9;i++){const px=Math.random()*N,w=10+Math.random()*40,h=60+Math.random()*200,g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(10,18,8,.55)');g.addColorStop(1,'rgba(10,18,8,0)');x.fillStyle=g;x.fillRect(px,0,w,h)}
 for(let i=0;i<28000;i++){const v=Math.random()*70|0;x.fillStyle=`rgba(${v},${v},${v},.12)`;x.fillRect(Math.random()*N,Math.random()*N,1,1)}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;return t},
planks(base,rep){const N=512,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,N,N);const nb=8,bh=N/nb;
 for(let i=0;i<nb;i++){const v=(Math.random()-.5)*40;x.fillStyle=v>0?`rgba(255,215,160,${v/300})`:`rgba(0,0,0,${-v/150})`;x.fillRect(0,i*bh,N,bh);
  for(let k=0;k<70;k++){x.strokeStyle=`rgba(0,0,0,${.05+Math.random()*.12})`;x.lineWidth=1;const y=i*bh+3+Math.random()*(bh-6);x.beginPath();x.moveTo(0,y);x.bezierCurveTo(N*.3,y+(Math.random()-.5)*5,N*.6,y+(Math.random()-.5)*5,N,y+(Math.random()-.5)*2);x.stroke()}
  x.fillStyle='rgba(0,0,0,.8)';x.fillRect(Math.random()*N,i*bh,3,bh);
  if(Math.random()<.45){const kx=Math.random()*N,ky=i*bh+bh/2;for(let r=9;r>2;r-=2){x.strokeStyle=`rgba(0,0,0,${.12+(9-r)*.05})`;x.beginPath();x.ellipse(kx,ky,r*1.6,r*.8,0,0,6.3);x.stroke()}}
  x.fillStyle='rgba(0,0,0,.8)';x.fillRect(0,i*bh,N,3)}
 for(let i=0;i<24000;i++){const v=Math.random()*60|0;x.fillStyle=`rgba(${v},${v},${v},.1)`;x.fillRect(Math.random()*N,Math.random()*N,1+(Math.random()<.2?1:0),1)}
 for(let i=0;i<9;i++){const px=Math.random()*N,py=Math.random()*N,r=40+Math.random()*90,gr=x.createRadialGradient(px,py,0,px,py,r);gr.addColorStop(0,'rgba(8,3,0,.45)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(px-r,py-r,r*2,r*2)}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep,rep);t.anisotropy=8;return t},
tex(base,line,stain,rep){const N=512,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,N,N);
 /* fine grain, 1px, so close-up surfaces do not show big square blotches */
 for(let i=0;i<26000;i++){const v=Math.random()*60|0;x.fillStyle=`rgba(${v},${v},${v},.12)`;x.fillRect(Math.random()*N,Math.random()*N,1+(Math.random()<.2?1:0),1)}
 /* soft low-frequency mottling, drawn wrapped so the tile has no seams */
 const blob=(px,py,r,col)=>{for(const ox of[-N,0,N])for(const oy of[-N,0,N]){const X=px+ox,Y=py+oy;if(X+r<0||X-r>N||Y+r<0||Y-r>N)continue;const gr=x.createRadialGradient(X,Y,0,X,Y,r);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(X-r,Y-r,r*2,r*2)}};
 for(let i=0;i<10;i++)blob(Math.random()*N,Math.random()*N,50+Math.random()*90,Math.random()<.5?'rgba(0,0,0,.07)':'rgba(255,255,255,.03)');
 for(let i=0;i<stain;i++)blob(Math.random()*N,Math.random()*N,40+Math.random()*100,'rgba(20,10,5,.4)');
 if(line){x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=6;x.beginPath();x.moveTo(0,0);x.lineTo(N,0);x.moveTo(0,N);x.lineTo(N,N);x.moveTo(0,0);x.lineTo(0,N);x.moveTo(N,0);x.lineTo(N,N);x.moveTo(N/2,0);x.lineTo(N/2,N);x.moveTo(0,N/2);x.lineTo(N,N/2);x.stroke()}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep,rep);t.anisotropy=8;return t},
pass(x,z){const r=this.g[z];if(!r)return false;const v=r[x];if(v===0)return true;if(v===2){const d=this.dmap[x+','+z];return !!d&&!d.locked}return false},
gen(nocut){const W=this.W=23,D=this.D=23,S=this.S,R=Math.random,P=this.fp,g=this.g=Array.from({length:D},()=>Array(W).fill(1)),L=[1,11,21],dirs=[[1,0],[-1,0],[0,1],[0,-1]];
 const rs=this.roomOf=Array.from({length:D},()=>Array(W).fill(-1));this.rooms=[];this.doors=[];this.dmap={};this.items=[];this.col=[];this.stairs=[];this.vents=[];this.xd=null;
 for(const a of L)for(let i=1;i<=W-2;i++){g[i][a]=0;g[a][i]=0}
 if(!nocut)for(let k=1;k<L.length-1;k++){const a=L[k];for(let j=0;j<L.length-1;j++){if(R()<.2)for(let i=L[j]+1;i<L[j+1];i++)g[i][a]=1;if(R()<.2)for(let i=L[j]+1;i<L[j+1];i++)g[a][i]=1}}
 const room=(x0,z0,x1,z1)=>{const id=this.rooms.length;this.rooms.push({id,x0,z0,x1,z1,doors:[]});for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){g[z][x]=0;rs[z][x]=id}};
 const split=(x0,z0,x1,z1,dp)=>{const w=x1-x0+1,h=z1-z0+1,cv=w>=7,ch=h>=7;
  if((cv||ch)&&R()<(dp?.4:.7)){if(cv&&(!ch||R()<.5)){const m=x0+((w-1)>>1);split(x0,z0,m-1,z1,dp+1);split(m+1,z0,x1,z1,dp+1)}else{const m=z0+((h-1)>>1);split(x0,z0,x1,m-1,dp+1);split(x0,m+1,x1,z1,dp+1)}}else room(x0,z0,x1,z1)};
 for(const a of L.slice(0,-1))for(const b of L.slice(0,-1))if(R()>.04)split(a+2,b+2,a+8,b+8,0);
 const setDoor=(x,z)=>{g[z][x]=2};
 for(const r of this.rooms){const o=[];
  for(let x=r.x0;x<=r.x1;x++){o.push([x,r.z0-1,0,-1,'z']);o.push([x,r.z1+1,0,1,'z'])}
  for(let z=r.z0;z<=r.z1;z++){o.push([r.x0-1,z,-1,0,'x']);o.push([r.x1+1,z,1,0,'x'])}
  const c=o.filter(([x,z,a,b,ax])=>{if(g[z][x]!==1)return false;const X=x+a,Z=z+b;if(X<1||Z<1||X>W-2||Z>D-2||g[Z][X]===1)return false;
   if(ax==='z')return g[z][x-1]===1&&g[z][x+1]===1;return g[z-1][x]===1&&g[z+1][x]===1}).shuf();
  const n=1+(R()<.4?1:0)+((r.x1-r.x0+1)*(r.z1-r.z0+1)>=40&&R()<.6?1:0);let k=0;
  for(const[x,z]of c){if(k>=n)break;if(dirs.some(([a,b])=>g[z+b][x+a]===2))continue;setDoor(x,z);k++}}
 const reach=()=>{const d=Array.from({length:D},()=>Array(W).fill(0)),q=[[1,1]];d[1][1]=1;while(q.length){const[x,z]=q.pop();for(const[a,b]of dirs){const X=x+a,Z=z+b;if(g[Z]&&g[Z][X]!==undefined&&g[Z][X]!==1&&!d[Z][X]){d[Z][X]=1;q.push([X,Z])}}}return d};
 for(let it=0;it<90;it++){const r=reach();let un=false;for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===0&&!r[z][x])un=true;if(!un)break;
  const c=[];for(let z=2;z<D-2;z++)for(let x=2;x<W-2;x++)if(g[z][x]===1){
   if(g[z][x-1]!==1&&g[z][x+1]!==1&&g[z-1][x]===1&&g[z+1][x]===1&&r[z][x-1]!==r[z][x+1])c.push([x,z]);
   else if(g[z-1][x]!==1&&g[z+1][x]!==1&&g[z][x-1]===1&&g[z][x+1]===1&&r[z-1][x]!==r[z+1][x])c.push([x,z])}
  if(!c.length)return false;const[x,z]=c[R()*c.length|0];setDoor(x,z)}
 {const r=reach();for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===0&&!r[z][x])return false}
 for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===2){const ax=(g[z][x-1]!==1&&g[z][x+1]!==1)?'x':'z',d={gx:x,gz:z,axis:ax,wx:x*S,wz:z*S,o:0,target:0,locked:false,sw:R()<.5?1:-1,id:this.doors.length};
  this.doors.push(d);this.dmap[x+','+z]=d;(ax==='x'?[[x-1,z],[x+1,z]]:[[x,z-1],[x,z+1]]).forEach(([a,b])=>{const q=rs[b][a];if(q>=0)this.rooms[q].doors.push(d)})}
 const d0=this.bfs(1,1);this.lockRoom=null;
 if(P.lock){const lc=this.rooms.filter(r=>r.doors.length===1&&(r.x1-r.x0+1)*(r.z1-r.z0+1)>=9&&d0[(r.z0+r.z1)>>1][(r.x0+r.x1)>>1]>8);
  if(!lc.length)return false;const r=lc[R()*lc.length|0];r.doors[0].locked=true;this.lockRoom=r}
 const ndd=(x,z)=>dirs.some(([a,b])=>g[z+b][x+a]===2);
 /* stair units: 1 cell wide, 2 cells deep, backed against a plain wall of an ordinary room */
 const H1=1.4,sset=new Set();
 for(const kind of['up','down']){if(!P[kind])continue;const cand=[];
  for(const r of this.rooms){if(r===this.lockRoom||r.stair)continue;const inR=(X,Z)=>X>=r.x0&&X<=r.x1&&Z>=r.z0&&Z<=r.z1;
   for(let z=r.z0;z<=r.z1;z++)for(let x=r.x0;x<=r.x1;x++)for(const[a,b]of dirs){
    if(g[z+b][x+a]!==1)continue;const x1=x-a,z1=z-b,x2=x-2*a,z2=z-2*b;if(!inR(x1,z1)||!inR(x2,z2))continue;
    if(ndd(x,z)||ndd(x1,z1)||ndd(x2,z2))continue;cand.push([r,x,z,a,b])}}
  if(!cand.length)return false;const[r,x,z,a,b]=cand[R()*cand.length|0];r.stair=kind;
  const un={kind,cx:x,cz:z,s:[a,b],inn:[-a,-b],tn:[-b,a],O:{x:x*S+a*S/2,z:z*S+b*S/2},cells:[[x,z],[x-a,z-b]],entry:[x-2*a,z-2*b],H1};
  un.cells.concat([un.entry]).forEach(c=>sset.add(c.join()));this.stairs.push(un)}
 let sc=[];for(const r of this.rooms){if(r===this.lockRoom||r.stair||(r.x1-r.x0+1)*(r.z1-r.z0+1)<6)continue;
  for(let z=r.z0;z<=r.z1;z++)for(let x=r.x0;x<=r.x1;x++){if(d0[z][x]<0||ndd(x,z)||sset.has(x+','+z))continue;const sd=dirs.filter(([a,b])=>g[z+b][x+a]===1);if(sd.length===1)sc.push([x,z,sd[0]])}}
 if(!sc.length)return false;
 const[sx,sz,ss]=sc[R()*sc.length|0];this.start={cell:[sx,sz],s:ss,x:sx*S-ss[0]*.4,z:sz*S-ss[1]*.4,bx:sx*S+ss[0]*(S/2-.48),bz:sz*S+ss[1]*(S/2-.48),yaw:Math.atan2(ss[0],ss[1])};
 const dist=this.dist=this.bfs(sx,sz),nd=ndd;
 const fl=[];for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===0&&dist[z][x]>=0)fl.push([x,z]);
 this.walk=[];for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(dist[z][x]>=0)this.walk.push([x,z]);
 let far=null,fd=0;for(const[x,z]of fl)if(dist[z][x]>fd&&Props.side([x,z])&&rs[z][x]<0&&!sset.has(x+','+z)){fd=dist[z][x];far=[x,z]}
 if(!far)return false;this.exit=far;
 const keys=this.keys=[];if(P.duct)keys.push([-100,0]);if(this.lockRoom){const r=this.lockRoom;keys.push([(r.x0+r.x1)>>1,(r.z0+r.z1)>>1])}
 const sp=P.nF>3?5:6,pool=fl.filter(c=>dist[c[1]][c[0]]>3&&!(c[0]===sx&&c[1]===sz)&&Math.abs(far[0]-c[0])+Math.abs(far[1]-c[1])>3&&!nd(c[0],c[1])&&!sset.has(c.join())).shuf(),rp=pool.filter(c=>rs[c[1]][c[0]]>=0);
 for(const c of rp.concat(pool)){if(keys.length>=P.nF)break;if(keys.every(k=>k[0]<-50||Math.abs(k[0]-c[0])+Math.abs(k[1]-c[1])>sp))keys.push(c)}
 if(keys.length<P.nF)return false;
 const used=this.resv=new Set([...keys.map(k=>k.join()),far.join(),[sx,sz].join(),...sset]),free=fl.filter(c=>dist[c[1]][c[0]]>3&&!nd(c[0],c[1])).shuf();
 const take=(pref,minD)=>{const w=R()<pref;for(const m of[w,!w])for(let i=0;i<free.length;i++){const c=free[i];if((rs[c[1]][c[0]]>=0)===m&&dist[c[1]][c[0]]>=(minD||0)&&!used.has(c.join())){used.add(c.join());free.splice(i,1);return c}}return null};
 const place=(t,c)=>{if(!c)return;const s=Props.side(c);let x=c[0]*S+(R()-.5)*.8,z=c[1]*S+(R()-.5)*.8;if(s){x=c[0]*S+s[0]*1.05+(s[0]?0:(R()-.5)*1.2);z=c[1]*S+s[1]*1.05+(s[1]?0:(R()-.5)*1.2)}this.items.push({t,x,z,a:R()*6.28,taken:false,i:this.items.length})};
 if(this.lockRoom)place('key',take(1,4));
 if(P.vent)place('screwdriver',take(.5,2));
 for(let i=0;i<P.notes;i++)place('note',take(.85,3));for(let i=0;i<P.bats;i++)place('battery',take(.65));for(let i=0;i<P.bots;i++)place('bottle',take(.5));
 if(P.vent){const vc=fl.filter(c=>!nd(c[0],c[1])&&!used.has(c.join())&&Props.side(c)&&dist[c[1]][c[0]]>2).shuf();const A=vc[0];let B=null;if(!A)return false;for(const c of vc)if(Math.abs(c[0]-A[0])+Math.abs(c[1]-A[1])>=9){B=c;break}if(!B)return false;
  [A,B].forEach(c=>{used.add(c.join());const s=Props.side(c);this.vents.push({gx:c[0],gz:c[1],s,wx:c[0]*S+s[0]*(S/2),wz:c[1]*S+s[1]*(S/2),x:c[0]*S+s[0]*(S/2-.5),z:c[1]*S+s[1]*(S/2-.5),fx:c[0]*S+s[0]*(S/2-1.1),fz:c[1]*S+s[1]*(S/2-1.1),open:false,prog:0,ang:0,i:this.vents.length})})}
 this.enemyStart=fl.filter(([x,z])=>dist[z][x]>8).shuf()[0]||far;return true},
bfs(sx,sz){const d=Array.from({length:this.D},()=>Array(this.W).fill(-1)),q=[[sx,sz]];d[sz][sx]=0;
 while(q.length){const[x,z]=q.shift();for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Z=z+b;if(this.pass(X,Z)&&d[Z][X]<0){d[Z][X]=d[z][x]+1;q.push([X,Z])}}}return d},
next(f,t){if(f[0]===t[0]&&f[1]===t[1])return t;const par={},k=c=>c[0]+','+c[1],q=[f];par[k(f)]=null;
 while(q.length){const c=q.shift();if(c[0]===t[0]&&c[1]===t[1])break;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=[c[0]+a,c[1]+b];if(this.pass(n[0],n[1])&&!(k(n) in par)){par[k(n)]=c;q.push(n)}}}
 let c=t;if(!(k(c) in par))return f;while(par[k(c)]&&k(par[k(c)])!==k(f))c=par[k(c)];return c},
unlock(d){d.locked=false;const r=this.lockRoom;if(r)for(let z=r.z0;z<=r.z1;z++)for(let x=r.x0;x<=r.x1;x++)this.walk.push([x,z])},
cell(x,z){return[Math.round(x/this.S),Math.round(z/this.S)]},
wp(c){return{x:c[0]*this.S,z:c[1]*this.S}},
wall(x,z){const c=this.cell(x,z),v=this.g[c[1]]&&this.g[c[1]][c[0]];return v===undefined||v===1},
hitCol(x,z){for(const c of this.col)if(!c.off&&x>c.x0&&x<c.x1&&z>c.z0&&z<c.z1)return true;return false},
blocked(x,z,r){if((this.lockers||[]).some(l=>Math.hypot(x-l.cx,z-l.cz)<.55+r*.3))return true;const q=r*.75;for(const c of this.col)if(!c.off&&x>c.x0-q&&x<c.x1+q&&z>c.z0-q&&z<c.z1+q)return true;
 return this.wall(x+r,z+r)||this.wall(x-r,z+r)||this.wall(x+r,z-r)||this.wall(x-r,z-r)},
los(ax,az,bx,bz){const d=Math.hypot(bx-ax,bz-az),n=Math.ceil(d/.5);for(let i=1;i<n;i++){const t=i/n;if(this.wall(ax+(bx-ax)*t,az+(bz-az)*t))return false}
 for(const dr of this.doors){if(dr.o>.4)continue;const X=dr.axis==='x',a=X?ax:az,b=X?bx:bz,p=X?dr.wx:dr.wz;if((a-p)*(b-p)<0){const t=(p-a)/(b-a),lat=X?az+(bz-az)*t:ax+(bx-ax)*t;if(Math.abs(lat-(X?dr.wz:dr.wx))<1.5)return false}}return true},
FLK:['g','roomOf','rooms','doors','dmap','col','items','keys','lockRoom','start','dist','walk','exit','resv','enemyStart','src','lockers','fuses','lamps','xd','stairs','vents','theme','mkf','fp','wallMat'],
save(f){const o=this.FL[f]={};for(const k of this.FLK)o[k]=this[k]},
use(f){const o=this.FL[f];for(const k of this.FLK)this[k]=o[k];this.fi=f;Props._mk=this.mkf},
unitAt(x,z,st){for(const u of (st||this.stairs)){const dx=x-u.O.x,dz=z-u.O.z,uu=dx*u.inn[0]+dz*u.inn[1],t=dx*u.tn[0]+dz*u.tn[1];if(uu>-.3&&uu<6.01&&Math.abs(t)<1.5)return{u:uu,t,un:u}}return null},
gy(x,z,st){if(!(st||this.stairs).length)return 0;const r=this.unitAt(x,z,st);if(!r)return 0;const{u,un}=r;if(u<3.6)return un.kind==='up'?un.H1:-un.H1;const q=Math.min(1,(u-3.6)/2.4),k=Math.min(7,Math.floor(q*8)),m=un.H1*(1-(k+1)/8);return un.kind==='up'?m:-m},
make(scene,seed,multi){const real=Math.random;if(seed!=null)Math.random=mulberry(seed);try{this.buildAll(scene,!!multi)}finally{Math.random=real}},
buildAll(scene,multi){const R=Math.random;this.root=scene;this.pool=[];this.items=[];this.lockLight=null;this.FL=[];this.FG=[];
 const F=multi?(R()<.5?3:4):1,TH=F===1?['house']:F===3?['basement','house','attic']:['basement','house','house2','attic'],nF=Array(F).fill(F===1?4:1);
 if(F>1&&F<4)nF[R()*F|0]+=4-F;
 const vf=new Set();if(F>1){const idx=[...Array(F).keys()].shuf(),nv=F>=4?2:1;for(let i=0;i<nv;i++)vf.add(idx[i])}
 const nt=Array(F).fill(Math.floor(6/F)),rem=6-nt.reduce((a,b)=>a+b,0);for(let i=0;i<rem;i++)nt[R()*F|0]++;
 const exF=F===1?0:1,plan=[];
 for(let f=0;f<F;f++)plan.push({theme:TH[f],nF:nF[f],duct:vf.has(f),vent:vf.has(f),lock:nF[f]-(vf.has(f)?1:0)>=1&&R()<.55,up:f<F-1,down:f>0,start:f===F-1,exit:f===exF,notes:nt[f],bats:F===1?9:3,bots:F===1?7:3});
 for(let i=0;i<5;i++){const l=new THREE.PointLight(0xffb070,0,12);scene.add(l);this.pool.push(l)}
 let fb=0;
 for(let f=0;f<F;f++){this.fi=f;this.fp=plan[f];let ok=false;for(let i=0;i<120&&!ok;i++)ok=this.gen(i>60);if(!ok)throw new Error('Level generation failed (floor '+f+')');
  this.doors.forEach(d=>{d.id+=f*100});const grp=new THREE.Group();scene.add(grp);this.FG.push(grp);this.fuseBase=fb;fb+=this.keys.length;this.build(grp);this.save(f)}
 for(let f=0;f<F;f++)for(const u of this.FL[f].stairs){u.to=u.kind==='up'?f+1:f-1;u.pn=this.FL[u.to].stairs.find(s=>s.kind===(u.kind==='up'?'down':'up'))}
 this.nF=F;this.sf=F-1;this.ef=F>1?(R()*(F-1)|0):0;this.exitFloor=exF;this.XD=this.FL[exF].xd;this.noteTotal=nt.reduce((a,b)=>a+b,0);this.FG.forEach((g,i)=>g.visible=i===this.sf);this.use(this.sf)},
build(scene){const S=this.S,H=this.H,W=this.W,D=this.D,g=this.g,T=this.theme=THEMES[this.fp.theme];this.src=[];this.lockers=[];this.fuses=[];this.lamps=[];
 const wt=T.wall==='brick'?this.brick():this.paper(T.wall),bsm=T.wall==='brick',ft=bsm?this.tex(T.floor,true,10,1):this.planks(T.floor,1),ct=bsm?this.tex('#171715',false,6,1):this.planks('#120d09',1);
 this.wallMat=new THREE.MeshStandardMaterial({map:wt,roughness:.95,color:bsm?0xa8a298:0x8f8a7c});
 const ws=[];for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===1){let nb=false;for(let a=-1;a<=1&&!nb;a++)for(let b=-1;b<=1;b++){const r=g[z+b];if(r&&r[x+a]!==undefined&&r[x+a]!==1){nb=true;break}}if(nb)ws.push([x,z])}
 const im=new THREE.InstancedMesh(new THREE.BoxGeometry(S,H,S),this.wallMat,ws.length),m=new THREE.Matrix4();ws.forEach(([x,z],i)=>{m.setPosition(x*S,H/2,z*S);im.setMatrixAt(i,m)});im.frustumCulled=false;scene.add(im);
 const cells=[],pit=new Set();for(const u of this.stairs)if(u.kind==='down')u.cells.forEach(c=>pit.add(c.join()));
 for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]!==1)cells.push([x,z]);
 const quad=(rot,mat,list,y)=>{const geo=new THREE.PlaneGeometry(S,S);geo.rotateX(rot);const q=new THREE.InstancedMesh(geo,mat,list.length),m4=new THREE.Matrix4();list.forEach(([x,z],i)=>{m4.setPosition(x*S,y,z*S);q.setMatrixAt(i,m4)});q.frustumCulled=false;scene.add(q)};
 quad(-Math.PI/2,new THREE.MeshStandardMaterial({map:ft,roughness:.9,color:0xb0a090}),cells.filter(c=>!pit.has(c.join())),0);quad(Math.PI/2,new THREE.MeshStandardMaterial({map:ct,roughness:.9,color:0x908070}),cells,H);
 Props.build(scene)},
updLights(px,pz,dt,black,t){const src=this.src,pool=this.pool;this._lt-=dt;const re=this._lt<=0;if(re)this._lt=.25;const cand=this._c||(this._c=[]);cand.length=0;
 for(const s of src){
  if(s.mat){let k=0;if(s.mode!=='d'&&!(black>0)){k=1;if(s.mode==='f'){const w=Math.sin(t*(7+s.ph)+s.ph*5)+Math.sin(t*19+s.ph);if(w>1.35)k=.08;if(this.safe)k=.7+.15*Math.sin(t*1.3+s.ph)}else if(Math.random()<.004&&!this.safe)k=.4}
   s.k=k;if(k!==s.lk){s.lk=k;s.mat.color.copy(s.col).multiplyScalar(s.mode==='d'?.12:.25+.75*k);s.sp.material.opacity=s.mode==='d'?0:.32*k}}
  const dx=s.x-px,dz=s.z-pz,d2=dx*dx+dz*dz;if(d2>324)continue;
  const I=s.I();if(I<=.01)continue;if(re||s.vis===undefined)s.vis=d2<9?true:this.los(px,pz,s.x,s.z);
  s.sc=Math.sqrt(d2)+(s.vis?0:9);cand.push(s)}
 cand.sort((a,b)=>a.sc-b.sc);
 for(let i=0;i<pool.length;i++){const l=pool[i],s=cand[i];if(!s||(black>0&&!s.mat&&s.keep!==true&&false)){l.intensity=0;continue}l.position.set(s.x,s.y,s.z);l.color.copy(s.col);l.distance=s.d;l.intensity=s.I()}}};

Level.paper=unseeded(Level.paper);Level.planks=unseeded(Level.planks);Level.tex=unseeded(Level.tex);

/* helpers for code that has to touch another floor (multiplayer events) */
Level.withFloor=function(f,fn){const o=this.fi;if(o===f)return fn();this.use(f);try{return fn()}finally{this.use(o)}};
Level.doorById=function(id){const F=this.FL[Math.floor(id/100)];return F?F.doors.find(d=>d.id===id):null};
