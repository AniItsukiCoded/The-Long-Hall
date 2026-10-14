const b64a=(s,T)=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return new T(u.buffer)};
function buildBoiled(){const g=new THREE.Group(),tl=new THREE.TextureLoader();
 BOILED.parts.forEach(p=>{const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(b64a(p.p,Float32Array),3));geo.setAttribute('normal',new THREE.BufferAttribute(b64a(p.nm,Float32Array),3));geo.setAttribute('uv',new THREE.BufferAttribute(b64a(p.uv,Float32Array),2));
  geo.setIndex(new THREE.BufferAttribute(b64a(p.ix,p.i32?Uint32Array:Uint16Array),1));const T=window.LHT;let ok,er;if(T){T.pend++;T.total++;ok=()=>{T.pend--};er=()=>{T.pend--;T.fail++}}const t=tl.load(p.tex,ok,undefined,er);t.flipY=false;t.anisotropy=4;
  const m=new THREE.MeshStandardMaterial({map:t,roughness:.9,metalness:0,emissive:0x240606,side:THREE.DoubleSide,transparent:p.blend,alphaTest:p.blend?.4:0,depthWrite:!p.blend});
  const me=new THREE.Mesh(geo,m);me.frustumCulled=false;g.add(me)});return g}
const EDUMMY={x:-9999,z:-9999,hidden:true,noisy:false,crouch:false,lk:null,yaw:0};
class Enemy{
constructor(scene,c){this.g=new THREE.Group();this.pv=new THREE.Group();this.g.add(this.pv);scene.add(this.g);const p=Level.wp(c);this.g.position.set(p.x,0,p.z);
 this.light=new THREE.PointLight(0xff1a1a,.6,7);this.light.position.set(0,2.4,.7);this.g.add(this.light);
 this.state='patrol';this.T=null;this.lost=0;this.t=0;this.dist=99;this.st=0;this.found=false;this.seen=false;this.cool=0;this.kill=false;this.wait=0;this.inv=0;this.it=0;this.cfg={spd:1,hear:11,sight:16};
 this.acc=0;this.mv=false;this.g.rotation.y=Math.random()*6.28;this.fl=0;this.goF=null;this.noise=null;this.wf=15+Math.random()*25;this.pfl=0;
 this.pv.add(buildBoiled())}
face(x,z,k=.15){const a=Math.atan2(x-this.g.position.x,z-this.g.position.z);let d=a-this.g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));this.g.rotation.y+=d*k}
/* rotate toward heading a at a limited turn rate; returns the remaining angle error */
turn(a,dt,rate){let d=a-this.g.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));const m=Math.max(-rate*dt,Math.min(rate*dt,d));this.g.rotation.y+=m;return d-m}
blk(x,z){const r=.32;return Level.wall(x+r,z+r)||Level.wall(x-r,z+r)||Level.wall(x+r,z-r)||Level.wall(x-r,z-r)||Level.col.some(c=>c.riser&&x>c.x0-r&&x<c.x1+r&&z>c.z0-r&&z<c.z1+r)}
anim(dt){this.t+=dt;const ch=this.state==='chase'||this.state==='scare';this.pv.rotation.z=Math.sin(this.t*(ch?7:2.2))*(ch?.07:.05)+(this.state==='stare'?Math.sin(this.t*.9)*.06:0);
 this.pv.rotation.x=(ch?.2:0)+Math.sin(this.t*1.7)*.03+(this.wait>0&&this.state!=='scare'?.14:0);
 /* heavy walking bob in time with his footsteps */
 this.pv.position.y=this.mv?Math.abs(Math.sin(this.acc/this.stride*Math.PI))*(ch?.1:.06):this.pv.position.y*.8;this.mv=false;
 this.light.intensity=this.fl!==this.pfl?0:Level.safe?.6:.4+Math.random()*.4;
 const gp=this.g.position,ty=Level.fy(this.fl)+(Level.gy?Level.gy(gp.x,gp.z):0);gp.y+=(ty-gp.y)*Math.min(1,dt*12)}
startClimb(un){const up=this.goF>this.fl,A=Level.ANX,h=Level.FH/2,S=Level.S,ox=un.out[0],w=(p,t,y)=>[un.O.x+ox*p,un.O.z+un.tz*t,y],ex=un.entry[0]*S,ez=un.entry[1]*S,sg=up?1:-1,m=A.f1+.8;
 /* route through the fire door into the annex, up (or down) both flights over the mid landing, and back through the door on the other floor */
 const pts=up?[[ex,ez,0],w(0,0,0),w(2.3,-.85,0),w(A.f0,-.85,0),w(A.f1,-.85,h),w(m,-.85,h),w(m,.85,h),w(A.f1,.85,h),w(A.f0,.85,2*h),w(2.3,0,2*h),w(0,0,2*h),[ex,ez,2*h]]
  :[[ex,ez,0],w(0,0,0),w(2.3,.85,0),w(A.f0,.85,0),w(A.f1,.85,-h),w(m,.85,-h),w(m,-.85,-h),w(A.f1,-.85,-h),w(A.f0,-.85,-2*h),w(2.3,0,-2*h),w(0,0,-2*h),[ex,ez,-2*h]],seg=[];let len=0;
 for(let i=1;i<pts.length;i++){const d=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1],pts[i][2]-pts[i-1][2]);seg.push(d);len+=d}
 const dr=Level.dmap[un.cx+','+un.cz];if(dr&&!dr.locked){dr.target=1;dr.rate=2.6;if(this.onDoor)this.onDoor(dr)}
 this.cl={un,pts,seg,len,d:0,from:this.fl,to:up?this.fl+1:this.fl-1,sw:false};this.state='travel';this.T=null}
climbStep(dt){const c=this.cl,un=c.un;this.anim(dt);c.d+=dt*2.7;let d=c.d,i=0;while(i<c.seg.length&&d>c.seg[i]){d-=c.seg[i];i++}
 let a,b,k;if(i>=c.seg.length){a=b=c.pts[c.pts.length-1];k=0}else{a=c.pts[i];b=c.pts[i+1];k=d/c.seg[i]}
 const x=a[0]+(b[0]-a[0])*k,z=a[1]+(b[1]-a[1])*k,y=a[2]+(b[2]-a[2])*k,gp=this.g.position,dx=x-gp.x,dz=z-gp.z;
 if(dx*dx+dz*dz>1e-6)this.g.rotation.y=Math.atan2(dx,dz);gp.x=x;gp.z=z;gp.y=Level.fy(c.from)+y;this.mv=true;this.acc+=dt*2.7;
 if(this.nextStep===undefined)this.nextStep=this.acc+this.stride;if(this.acc>=this.nextStep){this.nextStep=this.acc+this.stride;this.footstep()}
 if(!c.sw&&c.d>c.len/2){c.sw=true;this.fl=c.to;const dr=Level.withFloor(c.to,()=>Level.dmap[un.cx+','+un.cz]);if(dr&&!dr.locked){dr.target=1;dr.rate=2.6}}
 if(c.d>=c.len){this.cl=null;this.fl=c.to;if(this.onStairs)this.onStairs(un)}}
get stride(){return this.state==='chase'?2:1.3}
/* direct pursuit: once he can see you up close he walks straight at YOU, not at the middle of your cell (that is why corners used to be safe) */
direct(dt,sp,P){const g=this.g.position,mx=P.x-g.x,mz=P.z-g.z,md=Math.hypot(mx,mz);if(md<.05||this.wait>0)return;
 const err=Math.abs(this.turn(Math.atan2(mx,mz),dt,8)),v=Math.min(sp*dt*(err>1.2?.3:err>.6?.75:1),Math.max(0,md-.3)),h=this.g.rotation.y,nx=g.x+Math.sin(h)*v,nz=g.z+Math.cos(h)*v;
 if(!this.blk(nx,nz)){g.x=nx;g.z=nz}else if(!this.blk(nx,g.z))g.x=nx;else if(!this.blk(g.x,nz))g.z=nz;this.acc+=v;this.mv=v>0}
go(dt,sp){if(this.wait>0)return;const g=this.g.position,c=Level.cell(g.x,g.z),w=Level.wp(Level.next(c,this.T)),mx=w.x-g.x,mz=w.z-g.z,md=Math.hypot(mx,mz);if(md<.04)return;
 if(md<.5&&c[0]===this.T[0]&&c[1]===this.T[1]){const v=Math.min(md,sp*dt);this.face(w.x,w.z,Math.min(1,dt*8));g.x+=mx/md*v;g.z+=mz/md*v;this.acc+=v;this.mv=true;return}
 /* steer: turn at a limited rate, slow down for sharp turns, move along the facing direction */
 const err=Math.abs(this.turn(Math.atan2(mx,mz),dt,this.state==='chase'?5.5:3.2)),v=sp*dt*(err>1.2?.1:err>.6?.5:1),h=this.g.rotation.y,nx=g.x+Math.sin(h)*v,nz=g.z+Math.cos(h)*v;
 if(!this.blk(nx,nz)){g.x=nx;g.z=nz}else if(!this.blk(nx,g.z))g.x=nx;else if(!this.blk(g.x,nz))g.z=nz;
 this.acc+=v;this.mv=v>0}
footstep(){if(!Aud.ctx)return;if(this.fl!==this.pfl){Aud.estep(.2,0,this.state==='chase');return}const P=this.lis||this.pl,g=this.g.position,dx=g.x-P.x,dz=g.z-P.z,d=Math.hypot(dx,dz)||1,ch=this.state==='chase',lo=d<6||Level.los(g.x,g.z,P.x,P.z),yw=P.yaw||0,pan=(dx*Math.cos(yw)-dz*Math.sin(yw))/d;Aud.estep(Math.max(0,1-d/32)*(lo?1:.55)*(P.hidden?.7:1),pan,ch)}
check(l,kill){this.state='check';this.lk=l;this.kill=kill;this.st=0}
/* noises carry through the whole house: no distance limit, and he will take the stairs to reach one on another floor */
hearNoise(x,z,fl){if(fl===undefined)fl=this.fl;if(this.state==='chase'||this.state==='check'||this.state==='stare'||this.state==='scare')return;
 if(fl!==this.fl){this.goF=fl;this.noise={x,z};this.state='travel';this.T=null;return}
 this.goF=null;this.noise=null;this.state='investigate';this.T=Level.cell(x,z);this.inv=0;this.it=0}
/* opens any closed, unlocked door in front of him; locked doors stay shut until the player unlocks them */
doors(){const g=this.g.position,fx=Math.sin(this.g.rotation.y),fz=Math.cos(this.g.rotation.y),ch=this.state==='chase';for(const d of Level.doors){if(d.locked||d.target>=.5||d.o>=.5)continue;const dx=d.wx-g.x,dz=d.wz-g.z,dd=Math.hypot(dx,dz);if(dd<2.1&&(dd<1||dx*fx+dz*fz>0)){d.target=1;d.rate=ch?9:2.6;this.wait=ch?.3:.8;if(this.onDoor)this.onDoor(d);const LP=this.lis||this.pl,pd=Math.hypot(d.wx-LP.x,d.wz-LP.z);if(pd<24){Aud.dopen(Math.max(.2,1-pd/24));if(ch)setTimeout(()=>Aud.bang&&pd<14&&Aud.dclose(.8),180)}break}}}
/* what he perceives of one player */
eval(P){const g=this.g.position,cf=this.cfg,vis=!P.hidden,d=Math.hypot(P.x-g.x,P.z-g.z),ch0=this.state==='chase',fx=Math.sin(this.g.rotation.y),fz=Math.cos(this.g.rotation.y),dot=d>.01?((P.x-g.x)*fx+(P.z-g.z)*fz)/d:1,sr=cf.sight*(P.crouch?.55:1);
 const lo=vis&&d<sr+8&&Level.los(g.x,g.z,P.x,P.z),sees=lo&&d<sr&&(d<(ch0?9:4.5)||dot>(ch0?-.25:.42)),hears=vis&&P.noisy&&d<cf.hear*(lo?1:.6);return{d,lo,sees,hears}}
cansee(P){return!!this.eval(P).sees}
/* PL is one player, or a list of players (multiplayer): he hunts whichever he sees, else hears, else the nearest */
update(dt,PL,keys){if(this.cl){this.climbStep(dt);return}const list=Array.isArray(PL)?PL:[PL],g=this.g.position,cf=this.cfg;let P=list[0]||EDUMMY,E=null,bs=-1e9;
 for(const q of list){const e=this.eval(q),sc=(e.sees?2000:e.hears?1000:0)-e.d;if(sc>bs){bs=sc;P=q;E=e}}if(!E)E=this.eval(P);
 const d=E.d,sees=E.sees,hears=E.hears,csp=(3.4+keys*.35)*cf.spd;this.pl=this.pl||P;this.tgt=P;this.dist=d;this.anim(dt);this.chaseStart=false;this.cool=Math.max(0,this.cool-dt);this.wait=Math.max(0,this.wait-dt);
 this.seen=sees;this.lo=E.lo;this.doors();
 const a0=this.acc;
 this.think(dt,P,keys,sees,hears,csp);
 if(this.acc>a0&&this.acc>=this.nextStep){this.nextStep=this.acc+this.stride;this.footstep()}else if(this.nextStep===undefined)this.nextStep=this.acc+this.stride}
/* multiplayer client: follow the host's enemy */
puppet(dt){const g=this.g.position,n=this.net;this.wait=0;this.anim(dt);if(!n)return;this.state=n.s;
 const sb=this.sb,s=sb?sampleBuf(sb.buf,performance.now()-ivDelay(sb)):null;
 if(s){g.x=s.x;g.z=s.z;this.g.rotation.y=s.yaw}else{g.x=n.x;g.z=n.z;this.g.rotation.y=n.r}
 const m=Math.hypot(g.x-(this.lx??g.x),g.z-(this.lz??g.z));this.lx=g.x;this.lz=g.z;if(m>1e-4){this.acc+=m;this.mv=true}
 if(this.nextStep===undefined)this.nextStep=this.acc+this.stride;if(this.acc>=this.nextStep){this.nextStep=this.acc+this.stride;this.footstep()}}
think(dt,P,keys,sees,hears,csp){const g=this.g.position,cf=this.cfg;
 if(this.state==='check'||this.state==='stare'){const l=this.lk;
  if(sees){this.state='chase';this.last=Level.cell(P.x,P.z);this.chaseStart=true}
  else if(this.state==='check'){this.T=[l.gx,l.gz];if(Math.hypot(l.px-g.x,l.pz-g.z)<.4){this.state='stare';this.st=0}else{this.go(dt,csp*.8);return}}
  if(this.state==='stare'){this.face(l.cx,l.cz,Math.min(1,dt*5));this.st+=dt;if(this.kill){if(this.st>.9)this.found=true}else if(this.st>5){this.state='patrol';this.T=null;this.cool=10}return}}
 if(sees||(hears&&this.lo)){if(this.state!=='chase')this.chaseStart=true;this.state='chase';this.lost=0;this.last=Level.cell(P.x,P.z);this.goF=null;this.noise=null}
 else if(hears&&this.state!=='chase'&&this.state!=='check'&&this.state!=='stare'){this.state='investigate';this.T=Level.cell(P.x,P.z);this.inv=0;this.it=0;this.goF=null}
 else if(this.state==='chase'){this.lost+=dt;if(this.lost>6){this.state='patrol';this.T=null}}
 if(this.state==='chase'&&P.hidden&&P.lk&&!this.cool&&Math.hypot(P.lk.cx-g.x,P.lk.cz-g.z)<5){this.check(P.lk,false);return}
 /* between floors: walk to the nearest stair shaft and climb the real flights */
 if(this.goF!=null&&this.goF!==this.fl&&this.state!=='chase'){this.state='travel';const S=Level.S,un=Level.stairs.slice().sort((p,q)=>Math.hypot(p.entry[0]*S-g.x,p.entry[1]*S-g.z)-Math.hypot(q.entry[0]*S-g.x,q.entry[1]*S-g.z))[0];
  if(!un){this.goF=null;this.state='patrol';this.T=null}
  else{this.T=un.entry;if(Math.hypot(g.x-un.entry[0]*S,g.z-un.entry[1]*S)<.6){this.startClimb(un);return}this.go(dt,2.9*cf.spd);return}}
 else if(this.state==='travel'){this.state='patrol';this.T=null}
 if(this.state==='patrol'&&Level.nF>1){this.wf-=dt;if(this.wf<=0){this.wf=25+Math.random()*35;const fs=[];for(let i=0;i<Level.nF;i++)if(i!==this.fl)fs.push(i);if(Math.random()<.5)this.goF=this.pfl!==this.fl?this.pfl:fs[Math.random()*fs.length|0];else this.goF=fs[Math.random()*fs.length|0]}}
 const c=Level.cell(g.x,g.z);
 if(this.state==='investigate'){this.it+=dt;if(this.it>45){this.state='patrol';this.T=null;return}
  if(c[0]===this.T[0]&&c[1]===this.T[1]){this.inv+=dt;this.g.rotation.y+=dt*Math.sin(this.inv*1.6)*1.5;if(this.inv>3.5){this.state='patrol';this.T=null}return}
  this.go(dt,2.9*cf.spd);return}
 if(this.state==='chase')this.T=this.last;else if(!this.T||(c[0]===this.T[0]&&c[1]===this.T[1])){const f=Level.walk;this.T=f[Math.random()*f.length|0]}
 if(this.state==='chase'&&!P.hidden&&P.x>-9000){const dd=Math.hypot(P.x-g.x,P.z-g.z);if(dd<8&&Level.los(g.x,g.z,P.x,P.z)){this.direct(dt,csp,P);return}}
 this.go(dt,this.state==='chase'?csp:1.7*cf.spd)}}
