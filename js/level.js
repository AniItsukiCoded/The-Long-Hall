/* Deterministic helpers: every player in a party builds the SAME halls from a shared seed.
   Comparator-based shuffles are engine specific, so shuffles use Fisher-Yates on Math.random (seeded during a build). */
if(!Array.prototype.shuf)Object.defineProperty(Array.prototype,'shuf',{value:function(){for(let i=this.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)),t=this[i];this[i]=this[j];this[j]=t}return this},enumerable:false});
Math._r=Math._r||Math.random;
const unseeded=f=>function(...a){const s=Math.random;Math.random=Math._r;try{return f.apply(this,a)}finally{Math.random=s}};
const mulberry=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const THEMES={
 basement:{name:'BASEMENT',wall:'brick',floor:'#2b2b28',rooms:['storage','boiler','cells','storage'],hk:['crate','barrel','shelf','bucket','trunk','crate','barrel','cabinet','boiler'],pipe:.92,fog:.14},
 house:{name:'GROUND FLOOR',wall:'#2a2519',floor:'#1f150d',rooms:['study','parlor','bedroom','storage'],hk:null,pipe:.15,fog:.115},
 house2:{name:'SECOND FLOOR',wall:'#1b2a24',floor:'#241a12',rooms:['bedroom','study','parlor','bedroom'],hk:null,pipe:.1,fog:.115},
 attic:{name:'ATTIC',wall:'#33261a',floor:'#2a2018',rooms:['storage','bedroom','storage','study'],hk:['trunk','crate','candles','stool','table','bucket','trunk','plant'],pipe:.05,fog:.1}};
/* stairwells: two steel hospital stair annexes bolted onto the OUTSIDE of the boundary wall (west and east), the same two on every floor so the flights really connect the floors */
const SHAFTS=[{w:'W',z:6},{w:'E',z:16}];
const Level={S:3,H:3.2,FH:4.9,W:23,D:23,fy(f){return f*Level.FH},
/* annex layout, measured outward (p) from the door plane in the boundary wall: 1.5 m lobby, 1.6 m landing, 14 steps, 1.6 m mid landing */
ANX:{f0:3.1,N:14,tr:.28,f1:7.02,pe:8.62,hw:1.5,gap:.2},FL:[],FG:[],nF:1,sf:0,ef:0,stairs:[],vents:[],g:[],doors:[],dmap:{},col:[],rooms:[],items:[],keys:[],src:[],pool:[],lockers:[],fuses:[],lamps:[],_lt:0,
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
 const rs=this.roomOf=Array.from({length:D},()=>Array(W).fill(-1));this.rooms=[];this.doors=[];this.dmap={};this.items=[];this.col=[];this.stairs=[];this.vents=[];this.duct=null;this.traps=[];this.xd=null;
 for(const a of L)for(let i=1;i<=W-2;i++){g[i][a]=0;g[a][i]=0}
 if(!nocut)for(let k=1;k<L.length-1;k++){const a=L[k];for(let j=0;j<L.length-1;j++){if(R()<.2)for(let i=L[j]+1;i<L[j+1];i++)g[i][a]=1;if(R()<.2)for(let i=L[j]+1;i<L[j+1];i++)g[a][i]=1}}
 const room=(x0,z0,x1,z1)=>{const id=this.rooms.length;this.rooms.push({id,x0,z0,x1,z1,doors:[]});for(let z=z0;z<=z1;z++)for(let x=x0;x<=x1;x++){g[z][x]=0;rs[z][x]=id}};
 const split=(x0,z0,x1,z1,dp)=>{const w=x1-x0+1,h=z1-z0+1,cv=w>=7,ch=h>=7;
  if((cv||ch)&&R()<(dp?.4:.7)){if(cv&&(!ch||R()<.5)){const m=x0+((w-1)>>1);split(x0,z0,m-1,z1,dp+1);split(m+1,z0,x1,z1,dp+1)}else{const m=z0+((h-1)>>1);split(x0,z0,x1,m-1,dp+1);split(x0,m+1,x1,z1,dp+1)}}else room(x0,z0,x1,z1)};
 for(const a of L.slice(0,-1))for(const b of L.slice(0,-1)){if(R()>.04)split(a+2,b+2,a+8,b+8,0)}
 const noDoor=new Set();if(P.shafts)for(const sh of SHAFTS)for(let d=-1;d<=1;d++)noDoor.add((sh.w==='W'?2:W-3)+','+(sh.z+d));
 const setDoor=(x,z)=>{g[z][x]=2};
 for(const r of this.rooms){const o=[];
  for(let x=r.x0;x<=r.x1;x++){o.push([x,r.z0-1,0,-1,'z']);o.push([x,r.z1+1,0,1,'z'])}
  for(let z=r.z0;z<=r.z1;z++){o.push([r.x0-1,z,-1,0,'x']);o.push([r.x1+1,z,1,0,'x'])}
  const c=o.filter(([x,z,a,b,ax])=>{if(g[z][x]!==1||noDoor.has(x+','+z))return false;const X=x+a,Z=z+b;if(X<1||Z<1||X>W-2||Z>D-2||g[Z][X]===1)return false;
   if(ax==='z')return g[z][x-1]===1&&g[z][x+1]===1;return g[z-1][x]===1&&g[z+1][x]===1}).shuf();
  const n=1+(R()<.4?1:0)+((r.x1-r.x0+1)*(r.z1-r.z0+1)>=40&&R()<.6?1:0);let k=0;
  for(const[x,z]of c){if(k>=n)break;if(dirs.some(([a,b])=>g[z+b][x+a]===2))continue;setDoor(x,z);k++}}
 /* the stairwell doors: a fire door set into the boundary wall itself */
 const sdoor=[];if(P.shafts)for(let si=0;si<SHAFTS.length;si++){const sh=SHAFTS[si],cx=sh.w==='W'?0:W-1;g[sh.z][cx]=2;sdoor.push({si,cx,cz:sh.z})}
 const reach=()=>{const d=Array.from({length:D},()=>Array(W).fill(0)),q=[[1,1]];d[1][1]=1;while(q.length){const[x,z]=q.pop();for(const[a,b]of dirs){const X=x+a,Z=z+b;if(g[Z]&&g[Z][X]!==undefined&&g[Z][X]!==1&&!d[Z][X]){d[Z][X]=1;q.push([X,Z])}}}return d};
 for(let it=0;it<90;it++){const r=reach();let un=false;for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===0&&!r[z][x])un=true;if(!un)break;
  const c=[];for(let z=2;z<D-2;z++)for(let x=2;x<W-2;x++)if(g[z][x]===1){
   if(g[z][x-1]!==1&&g[z][x+1]!==1&&g[z-1][x]===1&&g[z+1][x]===1&&r[z][x-1]!==r[z][x+1])c.push([x,z]);
   else if(g[z-1][x]!==1&&g[z+1][x]!==1&&g[z][x-1]===1&&g[z][x+1]===1&&r[z-1][x]!==r[z+1][x])c.push([x,z])}
  if(!c.length)return false;const[x,z]=c[R()*c.length|0];setDoor(x,z)}
 {const r=reach();for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===0&&!r[z][x])return false}
 for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===2){const ax=(g[z][x-1]!==1&&g[z][x+1]!==1)?'x':'z',d={gx:x,gz:z,axis:ax,wx:x*S,wz:z*S,o:0,target:0,locked:false,sw:R()<.5?1:-1,id:this.doors.length};
  if(P.shafts&&(x===0||x===W-1)&&sdoor.some(q=>q.cx===x&&q.cz===z)){d.fire=true;d.out=x===0?-1:1;d.stairId=sdoor.findIndex(q=>q.cx===x&&q.cz===z)}
  this.doors.push(d);this.dmap[x+','+z]=d;(ax==='x'?[[x-1,z],[x+1,z]]:[[x,z-1],[x,z+1]]).forEach(([a,b])=>{const q=rs[b][a];if(q>=0)this.rooms[q].doors.push(d)})}
 const d0=this.bfs(1,1);this.lockRoom=null;
 if(P.lock){const lc=this.rooms.filter(r=>!r.stair&&r.doors.length===1&&(r.x1-r.x0+1)*(r.z1-r.z0+1)>=9&&d0[(r.z0+r.z1)>>1][(r.x0+r.x1)>>1]>8);
  if(!lc.length)return false;const r=lc[R()*lc.length|0];r.doors[0].locked=true;this.lockRoom=r}
 const ndd=(x,z)=>dirs.some(([a,b])=>g[z+b][x+a]===2);
 /* stair annexes: the door cell sits in the boundary wall, the stairwell itself is built OUTSIDE the 23x23 grid */
 const sset=new Set();
 if(P.shafts)for(const q of sdoor){const sh=SHAFTS[q.si],ox=sh.w==='W'?-1:1,ex=q.cx-ox,ez=q.cz;
  if(g[ez][ex]!==0)return false;
  const un={kind:'annex',id:q.si,side:sh.w,cx:q.cx,cz:q.cz,out:[ox,0],tz:ox<0?1:-1,O:{x:q.cx*S,z:q.cz*S},cells:[[q.cx,q.cz]],entry:[ex,ez],up:!!P.up,dn:!!P.down};
  sset.add(q.cx+','+q.cz);sset.add(ex+','+ez);this.stairs.push(un)}
 let sc=[];for(const r of this.rooms){if(r===this.lockRoom||r.stair||(r.x1-r.x0+1)*(r.z1-r.z0+1)<6)continue;
  for(let z=r.z0;z<=r.z1;z++)for(let x=r.x0;x<=r.x1;x++){if(d0[z][x]<0||ndd(x,z)||sset.has(x+','+z))continue;const sd=dirs.filter(([a,b])=>g[z+b][x+a]===1);if(sd.length===1)sc.push([x,z,sd[0]])}}
 if(!sc.length)return false;
 const[sx,sz,ss]=sc[R()*sc.length|0];this.start={cell:[sx,sz],s:ss,x:sx*S-ss[0]*.4,z:sz*S-ss[1]*.4,bx:sx*S+ss[0]*(S/2-.48),bz:sz*S+ss[1]*(S/2-.48),yaw:Math.atan2(ss[0],ss[1])};
 const dist=this.dist=this.bfs(sx,sz),nd=ndd;
 const fl=[];for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(g[z][x]===0&&dist[z][x]>=0)fl.push([x,z]);
 this.walk=[];for(let z=0;z<D;z++)for(let x=0;x<W;x++)if(dist[z][x]>=0)this.walk.push([x,z]);
 let far=null,fd=0;for(const[x,z]of fl)if(dist[z][x]>fd&&Props.side([x,z])&&rs[z][x]<0&&!sset.has(x+','+z)){fd=dist[z][x];far=[x,z]}
 if(!far)return false;this.exit=far;
 const keys=this.keys=[];if(P.duct)keys.push([-99,1]);if(this.lockRoom){const r=this.lockRoom;keys.push([(r.x0+r.x1)>>1,(r.z0+r.z1)>>1])}
 const sp=P.nF>3?5:6,pool=fl.filter(c=>dist[c[1]][c[0]]>3&&!(c[0]===sx&&c[1]===sz)&&Math.abs(far[0]-c[0])+Math.abs(far[1]-c[1])>3&&!nd(c[0],c[1])&&!sset.has(c.join())).shuf(),rp=pool.filter(c=>rs[c[1]][c[0]]>=0);
 for(const c of rp.concat(pool)){if(keys.length>=P.nF)break;if(keys.every(k=>k[0]<-50||Math.abs(k[0]-c[0])+Math.abs(k[1]-c[1])>sp))keys.push(c)}
 if(keys.length<P.nF)return false;
 const used=this.resv=new Set([...keys.map(k=>k.join()),far.join(),[sx,sz].join(),...sset]),free=fl.filter(c=>dist[c[1]][c[0]]>3&&!nd(c[0],c[1])).shuf();
 const take=(pref,minD)=>{const w=R()<pref;for(const m of[w,!w])for(let i=0;i<free.length;i++){const c=free[i];if((rs[c[1]][c[0]]>=0)===m&&dist[c[1]][c[0]]>=(minD||0)&&!used.has(c.join())){used.add(c.join());free.splice(i,1);return c}}return null};
 const place=(t,c)=>{if(!c)return;const s=Props.side(c);let x=c[0]*S+(R()-.5)*.8,z=c[1]*S+(R()-.5)*.8;if(s){x=c[0]*S+s[0]*1.05+(s[0]?0:(R()-.5)*1.2);z=c[1]*S+s[1]*1.05+(s[1]?0:(R()-.5)*1.2)}this.items.push({t,x,z,a:R()*6.28,taken:false,i:this.items.length})};
 if(this.lockRoom){const ld=this.lockRoom.doors[0],ki=free.findIndex(c=>rs[c[1]][c[0]]<0&&Math.abs(c[0]-ld.gx)+Math.abs(c[1]-ld.gz)<=6&&!used.has(c.join()));if(ki>=0){const c=free.splice(ki,1)[0];used.add(c.join());place('key',c)}else place('key',take(1,4))}
 for(let i=0;i<(P.loose|0);i++)place('fuse',take(.6,3));
 if(P.vent)place('screwdriver',take(.5,2));
 for(let i=0;i<P.notes;i++)place('note',take(.85,3));for(let i=0;i<P.bats;i++)place('battery',take(.65));for(let i=0;i<P.bots;i++)place('bottle',take(.5));
 if(P.vent){const sn=c=>this.stairs.some(u=>Math.abs(u.entry[0]-c[0])+Math.abs(u.entry[1]-c[1])<=4),vc=fl.filter(c=>!nd(c[0],c[1])&&!used.has(c.join())&&Props.side(c)&&dist[c[1]][c[0]]>2&&!sn(c)).shuf();const A=vc[0];let B=null;if(!A)return false;for(const c of vc)if(Math.abs(c[0]-A[0])+Math.abs(c[1]-A[1])>=9){B=c;break}if(!B)return false;
  /* each vent is a real riser duct standing against the wall: a grille at the bottom, a shaft that climbs through the ceiling into the duct space above the rooms */
  [A,B].forEach(c=>{used.add(c.join());const s=Props.side(c),px=c[0]*S,pz=c[1]*S;this.vents.push({gx:c[0],gz:c[1],s,wx:px+s[0]*(S/2-1.4),wz:pz+s[1]*(S/2-1.4),x:px+s[0]*(S/2-1.9),z:pz+s[1]*(S/2-1.9),fx:px+s[0]*(S/2-2.35),fz:pz+s[1]*(S/2-2.35),cx:px+s[0]*(S/2-.7),cz:pz+s[1]*(S/2-.7),open:false,prog:0,ang:0,i:this.vents.length})});
  this.duct=this.mkDuct(this.vents[0],this.vents[1])}
 if(P.traps){const tc=fl.filter(c=>dist[c[1]][c[0]]>4&&!used.has(c.join())&&!nd(c[0],c[1])).shuf();for(const c of tc){if(this.traps.length>=P.traps)break;if(this.traps.every(t=>Math.hypot(t.cx-c[0],t.cz-c[1])>3)){used.add(c.join());this.traps.push({cx:c[0],cz:c[1],x:c[0]*S+(R()-.5)*1.2,z:c[1]*S+(R()-.5)*1.2,armed:true,ang:0,i:this.traps.length})}}}
 this.enemyStart=fl.filter(([x,z])=>dist[z][x]>8).shuf()[0]||far;return true},
bfs(sx,sz){const d=Array.from({length:this.D},()=>Array(this.W).fill(-1)),q=[[sx,sz]];d[sz][sx]=0;
 while(q.length){const[x,z]=q.shift();for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+a,Z=z+b;if(this.pass(X,Z)&&d[Z][X]<0){d[Z][X]=d[z][x]+1;q.push([X,Z])}}}return d},
next(f,t){if(f[0]===t[0]&&f[1]===t[1])return t;const par={},k=c=>c[0]+','+c[1],q=[f];par[k(f)]=null;
 while(q.length){const c=q.shift();if(c[0]===t[0]&&c[1]===t[1])break;for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){const n=[c[0]+a,c[1]+b];if(this.pass(n[0],n[1])&&!(k(n) in par)){par[k(n)]=c;q.push(n)}}}
 let c=t;if(!(k(c) in par))return f;while(par[k(c)]&&k(par[k(c)])!==k(f))c=par[k(c)];return c},
unlock(d){d.locked=false;const r=this.lockRoom;if(r)for(let z=r.z0;z<=r.z1;z++)for(let x=r.x0;x<=r.x1;x++)this.walk.push([x,z])},
cell(x,z){return[Math.round(x/this.S),Math.round(z/this.S)]},
wp(c){return{x:c[0]*this.S,z:c[1]*this.S}},
wall(x,z){const c=this.cell(x,z),r=this.g[c[1]],v=r&&r[c[0]];if(v===undefined)return !this.inAnnex(x,z);return v===1},
inAnnex(x,z){for(const u of this.stairs){const p=(x-u.O.x)*u.out[0],t=(z-u.O.z)*u.tz;if(p>1.45&&p<this.ANX.pe+.05&&Math.abs(t)<this.ANX.hw)return true}return false},
hitCol(x,z){for(const c of this.col)if(!c.off&&x>c.x0&&x<c.x1&&z>c.z0&&z<c.z1)return true;return false},
blocked(x,z,r){if((this.lockers||[]).some(l=>Math.hypot(x-l.cx,z-l.cz)<.55+r*.3))return true;const q=r*.75;for(const c of this.col)if(!c.off&&x>c.x0-q&&x<c.x1+q&&z>c.z0-q&&z<c.z1+q)return true;
 return this.wall(x+r,z+r)||this.wall(x-r,z+r)||this.wall(x+r,z-r)||this.wall(x-r,z-r)},
los(ax,az,bx,bz){const d=Math.hypot(bx-ax,bz-az),n=Math.ceil(d/.5);for(let i=1;i<n;i++){const t=i/n;if(this.wall(ax+(bx-ax)*t,az+(bz-az)*t))return false}
 for(const c of this.col){if(!c.tall)continue;let t0=0,t1=1;const dx=bx-ax,dz=bz-az,P=[-dx,dx,-dz,dz],Q=[ax-c.x0,c.x1-ax,az-c.z0,c.z1-az];let hit=true;for(let k=0;k<4;k++){if(P[k]===0){if(Q[k]<0){hit=false;break}}else{const r=Q[k]/P[k];if(P[k]<0){if(r>t1){hit=false;break}if(r>t0)t0=r}else{if(r<t0){hit=false;break}if(r<t1)t1=r}}}if(hit&&t0<=t1)return false}
 for(const dr of this.doors){if(dr.o>.4)continue;const X=dr.axis==='x',a=X?ax:az,b=X?bx:bz,p=X?dr.wx:dr.wz;if((a-p)*(b-p)<0){const t=(p-a)/(b-a),lat=X?az+(bz-az)*t:ax+(bx-ax)*t;if(Math.abs(lat-(X?dr.wz:dr.wx))<1.5)return false}}return true},
FLK:['g','roomOf','rooms','doors','dmap','col','items','keys','lockRoom','start','dist','walk','exit','resv','enemyStart','src','lockers','fuses','lamps','xd','stairs','vents','duct','traps','chunks','theme','mkf','fp','wallMat'],
save(f){const o=this.FL[f]={};for(const k of this.FLK)o[k]=this[k]},
use(f){const o=this.FL[f];for(const k of this.FLK)this[k]=o[k];this.fi=f;Props._mk=this.mkf},
/* position relative to a stair annex: p = metres outward from the door plane, t = lateral (t<0 is the ascending flight, t>0 the descending one) */
unitAt(x,z,st){for(const u of (st||this.stairs)){const p=(x-u.O.x)*u.out[0],t=(z-u.O.z)*u.tz;if(p>1.45&&p<this.ANX.pe+.3&&Math.abs(t)<this.ANX.hw+.2)return{p,t,un:u}}return null},
/* walking height inside an annex, relative to the floor you are on. Ascend by the t<0 flight, swap floors on the mid landing, keep going; the descent mirrors it on the t>0 flight */
gy(x,z,st,py){const SS=st||this.stairs;if(!SS.length)return 0;const r=this.unitAt(x,z,SS);if(!r)return 0;const{p,t,un}=r,A=this.ANX,h=this.FH/2;
 if(p<A.f0)return 0;
 if(p<A.f1){const b=Math.max(0,(p-A.f0)/(A.f1-A.f0));return t<0?(un.up?h*b:0):(un.dn?-h*b:0)}
 if(py!==undefined)return py>=0?(un.up?h:0):(un.dn?-h:0);
 return t<0?(un.up?h:0):(un.dn?-h:0)},
/* the duct between two vents: a polyline (x,z,eye height) that climbs the first riser, runs through the space above the ceilings and comes down the second riser */
mkDuct(a,b){const Y0=.5,YP=3.85,pt=(x,z,y)=>({x,z,y}),m0=v=>pt(v.wx-v.s[0]*.55,v.wz-v.s[1]*.55,Y0),P=[m0(a),pt(a.cx,a.cz,Y0),pt(a.cx,a.cz,YP)];
 if(a.cx!==b.cx&&a.cz!==b.cz)P.push(pt(b.cx,a.cz,YP));
 P.push(pt(b.cx,b.cz,YP),pt(b.cx,b.cz,Y0),m0(b));
 const seg=[];let len=0;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i].x-P[i-1].x,P[i].z-P[i-1].z,P[i].y-P[i-1].y);seg.push(d);len+=d}
 /* the loose fuse lies on the longest horizontal stretch of the run */
 let bi=-1,bl=0;for(let i=1;i<P.length;i++){if(Math.abs(P[i].y-P[i-1].y)<.01&&seg[i-1]>bl){bl=seg[i-1];bi=i}}
 const f0=P[bi-1],f1=P[bi];return{P,seg,len,fuse:{x:(f0.x+f1.x)/2,z:(f0.z+f1.z)/2},YP,Y0}},
make(scene,seed,multi){const real=Math.random;if(seed!=null)Math.random=mulberry(seed);try{this.buildAll(scene,!!multi)}finally{Math.random=real}},
buildAll(scene,multi){const R=Math.random;Props._hm=null;this.root=scene;this.pool=[];this.items=[];this.lockLight=null;this.FL=[];this.FG=[];
 const F=multi?(R()<.5?3:4):1,TH=F===1?['house']:F===3?['basement','house','attic']:['basement','house','house2','attic'],nF=Array(F).fill(F===1?4:1);
 if(F>1&&F<4)nF[R()*F|0]+=4-F;
 const vf=new Set();if(F===1)vf.add(0);else{const idx=[...Array(F).keys()].shuf(),nv=F>=4?2:1;for(let i=0;i<nv;i++)vf.add(idx[i])}
 const nt=Array(F).fill(Math.floor(6/F)),rem=6-nt.reduce((a,b)=>a+b,0);for(let i=0;i<rem;i++)nt[R()*F|0]++;
 const exF=F===1?0:1,plan=[];
 for(let f=0;f<F;f++)plan.push({theme:TH[f],nF:nF[f],duct:vf.has(f),vent:vf.has(f),lock:nF[f]-(vf.has(f)?1:0)>=1&&R()<.3,loose:1,shafts:F>1,up:f<F-1,down:f>0,traps:3,start:f===F-1,exit:f===exF,notes:nt[f],bats:F===1?9:3,bots:F===1?7:3});
 for(let i=0;i<5;i++){const l=new THREE.PointLight(0xffb070,0,12);scene.add(l);this.pool.push(l)}
 let fb=0;
 for(let f=0;f<F;f++){this.fi=f;this.fp=plan[f];let ok=false;for(let i=0;i<120&&!ok;i++)ok=this.gen(i>60);if(!ok)throw new Error('Level generation failed (floor '+f+')');
  this.doors.forEach(d=>{d.id+=f*100});const grp=new THREE.Group();grp.position.y=f*this.FH;scene.add(grp);this.FG.push(grp);this.fuseBase=fb;fb+=this.keys.length;this.build(grp);this.save(f)}
 this.nF=F;this.sf=F-1;this.ef=F>1?(R()*(F-1)|0):0;this.exitFloor=exF;this.XD=this.FL[exF].xd;this.noteTotal=nt.reduce((a,b)=>a+b,0);this.FG.forEach((g,i)=>g.visible=i===this.sf);this.use(this.sf)},
build(scene){const S=this.S,H=this.H,FH=this.FH,W=this.W,D=this.D,g=this.g,T=this.theme=THEMES[this.fp.theme];this.src=[];this.lockers=[];this.fuses=[];this.lamps=[];
 const wt=T.wall==='brick'?this.brick():this.paper(T.wall),bsm=T.wall==='brick',ft=bsm?this.tex(T.floor,true,10,1):this.planks(T.floor,1),ct=bsm?this.tex('#171715',false,6,1):this.planks('#120d09',1);
 this.wallMat=new THREE.MeshStandardMaterial({map:wt,roughness:.95,color:bsm?0xc4bcb0:0xb4ac9a});
 const fm=new THREE.MeshStandardMaterial({map:ft,roughness:.9,color:0xc8b8a4}),cm=new THREE.MeshStandardMaterial({map:ct,roughness:.9,color:0xa89886});
 /* everything is split into 9 m chunks so far away parts of the house are simply not drawn */
 const CK=9;this.chunks={};const chunk=key=>{let c=this.chunks[key];if(!c){c=new THREE.Group();const p=key.split(',').map(Number);c.userData={chunk:1,cx:(p[0]+.5)*CK,cz:(p[1]+.5)*CK};scene.add(c);this.chunks[key]=c}return c};
 const ck=(x,z)=>Math.floor(x*S/CK)+','+Math.floor(z*S/CK);
 const sh=new Set(),vh=new Set(this.vents.map(v=>v.gx+','+v.gz));for(const u of this.stairs)u.cells.forEach(c=>sh.add(c.join()));
 const walls={},floors={},ceils={};
 for(let z=0;z<D;z++)for(let x=0;x<W;x++){if(g[z][x]===1){let nb=false;for(let a=-1;a<=1&&!nb;a++)for(let b=-1;b<=1;b++){const r=g[z+b];if(r&&r[x+a]!==undefined&&r[x+a]!==1){nb=true;break}}if(nb)(walls[ck(x,z)]=walls[ck(x,z)]||[]).push([x,z])}
  else{const k=ck(x,z),id=x+','+z;if(!sh.has(id))(floors[k]=floors[k]||[]).push([x,z]);if(!vh.has(id))(ceils[k]=ceils[k]||[]).push([x,z])}}
 const mkInst=(base,mat,list,key,y)=>{const geo=base.clone(),p=key.split(',').map(Number);geo.boundingSphere=new THREE.Sphere(new THREE.Vector3((p[0]+.5)*CK,y,(p[1]+.5)*CK),9);const q=new THREE.InstancedMesh(geo,mat,list.length),m4=new THREE.Matrix4();list.forEach(([x,z],i)=>{m4.setPosition(x*S,y,z*S);q.setMatrixAt(i,m4)});chunk(key).add(q)};
 const WH=FH-.05,wgeo=new THREE.BoxGeometry(S,WH,S),fg=new THREE.PlaneGeometry(S,S),cg=new THREE.PlaneGeometry(S,S);fg.rotateX(-Math.PI/2);cg.rotateX(Math.PI/2);
 for(const k in walls)mkInst(wgeo,this.wallMat,walls[k],k,WH/2);for(const k in floors)mkInst(fg,fm,floors[k],k,0);for(const k in ceils)mkInst(cg,cm,ceils[k],k,H);
 /* the ceiling above a riser duct is cut away; what is left of that cell is three plates around the shaft */
 for(const v of this.vents){const sx=v.s[0],sz=v.s[1],cx=v.gx*S,cz=v.gz*S,m=(x0,x1,z0,z1)=>{if(x1-x0<.01||z1-z0<.01)return;const q=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),cm);q.rotation.x=Math.PI/2;q.position.set((x0+x1)/2,H,(z0+z1)/2);scene.add(q)};
  /* riser: .7 either side of the axis, from the wall face .. 1.4 m out */
  if(sx){const wf=cx+sx*1.5,fr=cx+sx*.1,xa=Math.min(wf,fr),xb=Math.max(wf,fr);m(cx-1.5,xa,cz-1.5,cz+1.5);m(xb,cx+1.5,cz-1.5,cz+1.5);m(xa,xb,cz-1.5,cz-.7);m(xa,xb,cz+.7,cz+1.5)}
  else{const wf=cz+sz*1.5,fr=cz+sz*.1,za=Math.min(wf,fr),zb=Math.max(wf,fr);m(cx-1.5,cx+1.5,cz-1.5,za);m(cx-1.5,cx+1.5,zb,cz+1.5);m(cx-1.5,cx-.7,za,zb);m(cx+.7,cx+1.5,za,zb)}}
 Props.build(scene);
 for(const c of scene.children.slice()){if(c.userData&&c.userData.chunk)continue;if(c.isLight)continue;let hasL=false;c.traverse(o=>{if(o.isLight)hasL=true});if(hasL)continue;
  if(c.isInstancedMesh){c.frustumCulled=false;continue}if(!c.position.x&&!c.position.z)continue;
  scene.remove(c);chunk(Math.floor(c.position.x/CK)+','+Math.floor(c.position.z/CK)).add(c)}
 if(scene.updateMatrixWorld&&THREE.Vector3){scene.updateMatrixWorld(true);const v=new THREE.Vector3(),fy=this.fy(this.fi),warm=new THREE.Color(0xffa850);scene.traverse(o=>{if(o.userData&&o.userData.flame&&o.getWorldPosition){o.getWorldPosition(v);const ph=Math.random()*6,L=this;this.src.push({x:v.x,y:v.y-fy,z:v.z,col:warm,d:7,I:()=>L.safe?.55:.55+.14*Math.sin(performance.now()/1000*6+ph)})}})}},
/* which floors / chunks are drawn this frame */
updVis(px,pz,pf){for(let f=0;f<this.nF;f++){let v=f===pf;if(!v&&Math.abs(f-pf)===1)for(const u of this.FL[pf].stairs)if(Math.hypot(px-(u.O.x+u.out[0]*5),pz-u.O.z)<12){v=true;break}this.FG[f].visible=v}
 for(let f=0;f<this.nF;f++){if(!this.FG[f].visible)continue;const ch=this.FL[f].chunks;for(const k in ch){const c=ch[k],dx=c.userData.cx-px,dz=c.userData.cz-pz;c.visible=dx*dx+dz*dz<1156}}},
updLights(px,pz,dt,black,t){const src=this.src,pool=this.pool;this._lt-=dt;const re=this._lt<=0;if(re)this._lt=.25;const cand=this._c||(this._c=[]);cand.length=0;
 for(const s of src){
  if(s.mat){let k=0;if(s.mode!=='d'&&!(black>0)){k=1;if(s.mode==='f'){const w=Math.sin(t*(7+s.ph)+s.ph*5)+Math.sin(t*19+s.ph);if(w>1.35)k=.08;if(this.safe)k=.7+.15*Math.sin(t*1.3+s.ph)}else if(Math.random()<.004&&!this.safe)k=.4}
   s.k=k;if(k!==s.lk){s.lk=k;s.mat.color.copy(s.col).multiplyScalar(s.mode==='d'?.12:.25+.75*k);s.sp.material.opacity=s.mode==='d'?0:.32*k}}
  const dx=s.x-px,dz=s.z-pz,d2=dx*dx+dz*dz;if(d2>324)continue;
  const I=s.I();if(I<=.01)continue;if(re||s.vis===undefined)s.vis=d2<9?true:this.los(px,pz,s.x,s.z);
  s.sc=Math.sqrt(d2)+(s.vis?0:9);cand.push(s)}
 cand.sort((a,b)=>a.sc-b.sc);
 for(let i=0;i<pool.length;i++){const l=pool[i],s=cand[i];if(!s||(black>0&&!s.mat&&s.keep!==true&&false)){l.intensity=0;continue}l.position.set(s.x,s.y+this.fy(this.fi),s.z);l.color.copy(s.col);l.distance=s.d;l.intensity=s.I()*(this.lk||1)}}};

Level.paper=unseeded(Level.paper);Level.planks=unseeded(Level.planks);Level.tex=unseeded(Level.tex);

/* helpers for code that has to touch another floor (multiplayer events) */
Level.withFloor=function(f,fn){const o=this.fi;if(o===f)return fn();this.use(f);try{return fn()}finally{this.use(o)}};
Level.doorById=function(id){const F=this.FL[Math.floor(id/100)];return F?F.doors.find(d=>d.id===id):null};
