/* Player avatar: skinned character (js/player.js) with procedural animation. The source rig ships with a single static pose,
   so idle / walk / run / crouch are authored here as world-space bone rotations on top of the bind pose. */
const PModel={
 TINT:[0xffffff,0xaed0ff,0xffc49a,0xb6f0b0,0xe6b8ff,0xffe08a],
 b64(s,T){const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return new T(u.buffer)},
 init(){if(this.geo)return;const D=PLAYER_DATA,g=this.geo=new THREE.BufferGeometry(),f=s=>this.b64(s,Float32Array);
  g.setAttribute('position',new THREE.BufferAttribute(f(D.p),3));g.setAttribute('normal',new THREE.BufferAttribute(f(D.n),3));g.setAttribute('uv',new THREE.BufferAttribute(f(D.uv),2));
  g.setAttribute('skinIndex',new THREE.BufferAttribute(Uint16Array.from(this.b64(D.j,Uint8Array)),4));g.setAttribute('skinWeight',new THREE.BufferAttribute(f(D.w),4));
  g.setIndex(new THREE.BufferAttribute(this.b64(D.ix,Uint16Array),1));
  const t=this.tex=new THREE.TextureLoader().load(D.tex);t.flipY=false;t.anisotropy=4;
  /* bind-pose data */
  const n=D.names.length;this.N=n;this.id={};D.names.forEach((s,i)=>this.id[s]=i);this.par=D.par;
  this.Bq=D.bq.map(q=>new THREE.Quaternion(q[0],q[1],q[2],q[3]));this.Bp=D.bp.map(p=>new THREE.Vector3(p[0],p[1],p[2]));
  const I=this.id;this.L1=this.Bp[I.LeftUpLeg].y-this.Bp[I.LeftLeg].y;this.L2=this.Bp[I.LeftLeg].y-this.Bp[I.LeftFoot].y;this.hipY=this.Bp[I.Hips].y},
 create(slot){this.init();const D=PLAYER_DATA,n=this.N,bones=[],g=new THREE.Group(),inv=[];
  for(let i=0;i<n;i++){const b=new THREE.Bone();b.name=D.names[i];bones.push(b)}
  for(let i=0;i<n;i++){const p=this.par[i];let q=this.Bq[i].clone(),v=this.Bp[i].clone();if(p>=0){const pi=this.Bq[p].clone().invert();q=pi.clone().multiply(this.Bq[i]);v=v.sub(this.Bp[p]).applyQuaternion(pi);bones[p].add(bones[i])}
   bones[i].position.copy(v);bones[i].quaternion.copy(q);bones[i]._bq=q.clone();
   inv.push(new THREE.Matrix4().compose(this.Bp[i],this.Bq[i],new THREE.Vector3(1,1,1)).invert())}
  const mat=new THREE.MeshStandardMaterial({map:this.tex,color:this.TINT[slot%this.TINT.length],roughness:.9,metalness:0,emissive:new THREE.Color(this.TINT[slot%this.TINT.length]).multiplyScalar(.42),emissiveMap:this.tex,skinning:true,side:THREE.DoubleSide});
  const mesh=new THREE.SkinnedMesh(this.geo,mat);mesh.frustumCulled=false;mesh.add(bones[0]);g.add(mesh);mesh.updateMatrixWorld(true);mesh.bind(new THREE.Skeleton(bones,inv),new THREE.Matrix4());
  return{g,bones,mesh,mat,root:bones[0]}},
};
/* ---- network smoothing: snapshot interpolation ----
   Samples are placed on the SENDER's clock (so arrival jitter does not matter) and played back a fraction of a second
   in the past, tweening between two real samples. No chasing, no rubber-banding, no snapping. */
const _S={x:0,z:0,yaw:0};
function pushSample(o,s,ts){const now=performance.now();let t;
 if(!o.buf){o.buf=[];o.off=null;o.lastTs=null;o.sp=80}const b=o.buf;
 if(ts==null||isNaN(ts)){t=now}else{if(o.lastTs!=null&&ts<o.lastTs-2000){b.length=0;o.off=null}
  if(o.lastTs!=null){const g=ts-o.lastTs;if(g>0&&g<400)o.sp=o.sp*.9+g*.1}o.lastTs=ts;
  const d=now-ts;if(o.off==null||d<o.off)o.off=d;else o.off+=(d-o.off)*.02;t=ts+o.off}
 if(b.length&&t<=b[b.length-1].t)t=b[b.length-1].t+1;s.t=t;b.push(s);if(b.length>16)b.shift()}
const ivDelay=o=>Math.max(110,Math.min(220,1.6*(o.sp||80)+20));
function sampleBuf(b,rt){const n=b?b.length:0;if(!n)return null;if(rt<=b[0].t)return b[0];const L=b[n-1];if(rt>=L.t)return L;
 let i=n-2;while(i>0&&b[i].t>rt)i--;const p=b[i],c=b[i+1];
 if(Math.hypot(c.x-p.x,c.z-p.z)>5)return rt-p.t<c.t-rt?p:c;   /* a real teleport (respawn): never tween across it */
 const u=(rt-p.t)/(c.t-p.t);let dy=c.yaw-p.yaw;dy=Math.atan2(Math.sin(dy),Math.cos(dy));_S.x=p.x+(c.x-p.x)*u;_S.z=p.z+(c.z-p.z)*u;_S.yaw=p.yaw+dy*u;return _S}
const _X=new THREE.Vector3(1,0,0),_Y=new THREE.Vector3(0,1,0),_q1=new THREE.Quaternion(),_q2=new THREE.Quaternion();
class Avatar{
 constructor(nick,slot,scene){this.nick=nick;this.slot=slot;const m=PModel.create(slot);this.m=m;this.g=new THREE.Group();this.g.add(m.g);this.g.visible=false;
  this.D=PModel.N;this.d=Array.from({length:this.D},()=>new THREE.Quaternion());this.cum=Array.from({length:this.D},()=>new THREE.Quaternion());
  this.spitch=0;this.phase=Math.random()*6;this.t=Math.random()*9;this.spd=0;this.crouch=0;this.run=0;this.pitch=0;this.x=0;this.z=0;this.yaw=0;this.px=0;this.pz=0;this.has=false;this.shown=false;this.hidden=false;this.dead=false;this.gone=false;
  this.tag=this.mkTag(nick);this.tag.position.y=2.12;this.g.add(this.tag);if(scene)scene.add(this.g)}
 mkTag(s){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.font='italic 34px "IM Fell English",Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.lineWidth=7;x.strokeStyle='rgba(0,0,0,.85)';x.strokeText(s,128,34);x.fillStyle='#ece6d8';x.fillText(s,128,34);
  const t=new THREE.CanvasTexture(c),sp=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthWrite:false,fog:false,opacity:.9}));sp.scale.set(1.0,.25,1);return sp}
 /* net snapshot (x,z,yaw,pitch,crouch,run) */
 snap(x,z,yaw,pitch,cr,run,ts){if(!this.has){this.has=true;this.x=x;this.z=z;this.yaw=yaw;this.g.position.set(x,0,z)}pushSample(this,{x,z,yaw},ts);this.tx=x;this.tz=z;this.tyaw=yaw;this.pitch=pitch;this.cr=cr;this.rn=run}
 setScene(sc){if(this.g.parent)this.g.parent.remove(this.g);sc.add(this.g)}
 vis(v){this.g.visible=v}
 R(i,n,a){this.d[PModel.id[n]].setFromAxisAngle(i,a)}
 update(dt,lookerX,lookerZ){if(!this.has)return;const s=sampleBuf(this.buf,performance.now()-ivDelay(this));if(s){this.x=s.x;this.z=s.z;this.yaw=s.yaw}
  const sp=Math.hypot(this.x-this.px,this.z-this.pz)/Math.max(dt,1e-3);this.px=this.x;this.pz=this.z;this.spd+=(Math.min(sp,7)-this.spd)*Math.min(1,dt*8);
  this.spitch+=(this.pitch-this.spitch)*Math.min(1,dt*10);this.crouch+=((this.cr?1:0)-this.crouch)*Math.min(1,dt*10);this.run+=((this.rn&&this.spd>3.6?1:0)-this.run)*Math.min(1,dt*8);
  this.g.position.set(this.x,0,this.z);this.g.rotation.y=this.yaw+Math.PI;
  if(!this.g.visible)return;
  this.pose(dt);
  /* name tag: fade with distance */
  const d=Math.hypot(this.x-lookerX,this.z-lookerZ);this.tag.material.opacity=Math.max(0,Math.min(.9,(16-d)/6));this.tag.visible=this.tag.material.opacity>.02}
 pose(dt){const P=PModel,c=this.crouch,mv=Math.min(1,this.spd/1.2),run=this.run;this.t+=dt;
  const freq=this.spd*(c>.5?1.9:run>.5?.95:1.45)*(c>.5?1:1);this.phase+=dt*Math.max(freq,0)*Math.PI*(this.spd>.15?1:0);const ph=this.phase,t=this.t;
  const A=(.5+.26*run)*mv*(1-.6*c),K=(.75+.45*run)*mv;
  for(const q of this.d)q.identity();
  const al=c*.87,gm=-Math.asin(Math.min(1,P.L1*Math.sin(al)/P.L2)),kc=al-gm,drop=(P.L1+P.L2)-(P.L1*Math.cos(al)+P.L2*Math.cos(gm));
  for(const s of['Left','Right']){const f=s==='Left'?ph:ph+Math.PI,a=A*Math.sin(f)+al,kappa=K*Math.max(0,Math.cos(f))+.06*mv+kc;
   this.R(_X,s+'UpLeg',-a);this.R(_X,s+'Leg',kappa);this.R(_X,s+'Foot',(a-kappa)+(kappa*0)+.0);
   /* the knee flexes backwards: shin rotates behind the thigh. foot is kept flat to the ground */
   const arm=-A*.8*Math.sin(f)*(1-.5*c);this.R(_X,s+'Arm',-arm*0.0-arm);this.R(_X,s+'ForeArm',-(.12+run*1.1+.18*mv+.5*Math.max(0,-Math.sin(f))*mv*run))}
  const br=Math.sin(t*1.9)*.012,lean=run*.2+c*.34+mv*.04;
  this.R(_X,'Spine',lean*.5+br);this.R(_X,'Spine1',lean*.3-br);this.R(_X,'Spine2',lean*.2);
  this.R(_X,'Neck',-lean*.35-this.pitch*.3);this.R(_X,'Head',-lean*.3-this.pitch*.35);
  /* hip sway / bob */
  const bob=Math.abs(Math.sin(ph))*.035*mv*(1+run*.6)*(1-c*.6);
  this.m.g.position.y=-drop-bob+br*.2;
  /* twist shoulders slightly with stride */
  this.R(_Y,'Spine1',Math.sin(ph)*.12*mv);
  /* apply: top-down, rotations are authored in world space on top of the bind pose */
  const bones=this.m.bones,B=P.Bq,par=P.par;
  for(let i=0;i<this.D;i++){const p=par[i],cum=this.cum[i];if(p<0){cum.copy(this.d[i]);bones[i].quaternion.copy(bones[i]._bq);continue}
   /* cum = d * cumParent; local = inv(cumParent*Bp) * (cum*B) */
   cum.copy(this.d[i]).multiply(this.cum[p]);
   _q1.copy(this.cum[p]).multiply(B[p]).invert();_q2.copy(cum).multiply(B[i]);bones[i].quaternion.copy(_q1.multiply(_q2))}}
}
