const Props={
glow(c0){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,c0+'1)');g.addColorStop(.3,c0+'.3)');g.addColorStop(1,c0+'0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)},
cv(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)},
side(cell){const E=cell;return[[1,0],[-1,0],[0,1],[0,-1]].find(([a,b])=>Level.g[E[1]+b]&&Level.g[E[1]+b][E[0]+a]===1)},

dot(){return this._dot||(this._dot=this.cv(32,32,(x)=>{const g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.45,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,32,32)}))},
held(){const M=THREE.MeshStandardMaterial,mat=(c,o={})=>new M(Object.assign({color:c,emissive:c,emissiveIntensity:.28,roughness:.5,metalness:.2,depthTest:false,fog:false},o)),H={};
 const add=(g,geo,m,x,y,z,rx=0,ry=0,rz=0)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);o.renderOrder=20;g.add(o);return o};
 const gm=mat(0x4fa35c,{transparent:true,opacity:.85,roughness:.15}),br=mat(0xb08a3a,{metalness:.9,roughness:.35}),bk=mat(0x202020),cu=mat(0xd8a020);
 let g=new THREE.Group();add(g,new THREE.CylinderGeometry(.04,.046,.2,12),gm,0,0,0);add(g,new THREE.CylinderGeometry(.016,.04,.08,12),gm,0,.14,0);add(g,new THREE.CylinderGeometry(.018,.018,.02,10),mat(0x6a4a2a),0,.19,0);H.bottle=g;
 g=new THREE.Group();add(g,new THREE.CylinderGeometry(.034,.034,.14,12),bk,0,0,0);add(g,new THREE.CylinderGeometry(.036,.036,.06,12),cu,0,-.01,0);add(g,new THREE.CylinderGeometry(.014,.014,.025,10),br,0,.08,0);H.battery=g;
 g=new THREE.Group();add(g,new THREE.TorusGeometry(.04,.012,8,16),br,0,.08,0);add(g,new THREE.BoxGeometry(.016,.16,.016),br,0,-.04,0);[-.02,-.07].forEach(y=>add(g,new THREE.BoxGeometry(.04,.014,.014),br,.026,y,0));H.key=g;
 g=new THREE.Group();add(g,new THREE.CylinderGeometry(.02,.02,.12,10),cu,0,-.04,0);add(g,new THREE.CylinderGeometry(.006,.006,.12,6),mat(0xb0b0b0,{metalness:.9}),0,.08,0);H.screwdriver=g;
 return H},
bed(scene){if(!Level.fp.start)return;const S=Level.S,st=Level.start,s=st.s,M=THREE.MeshStandardMaterial,g=new THREE.Group(),fr=new M({color:0x23211e,roughness:.7,metalness:.6}),mt=new M({map:this.noise(),color:0x77766a,roughness:1}),pl=new M({color:0x9a958a,roughness:1}),bl=new M({color:0x3a2a22,roughness:1});
 const bx=(w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o};
 [-.92,.92].forEach(x=>[-.4,.4].forEach(z=>bx(.05,.4,.05,x,.2,z,fr)));bx(2,.05,.9,0,.4,0,fr);bx(.05,.75,.9,-.98,.58,0,fr);bx(1.9,.14,.82,0,.5,0,mt);bx(.5,.1,.5,-.62,.62,0,pl).rotation.y=.08;
 bx(1,.06,.84,.5,.6,0,bl);bx(.8,.05,.5,.1,.64,.18,bl).rotation.y=.35;bx(.35,.04,.6,-.15,.62,-.1,bl).rotation.z=.1;
 g.position.set(st.bx,0,st.bz);g.rotation.y=Math.atan2(-s[0],-s[1]);scene.add(g);
 const hx=s[0]?.45:1.02,hz=s[0]?1.02:.45;Level.col.push({x0:st.bx-hx,x1:st.bx+hx,z0:st.bz-hz,z1:st.bz+hz})},
wood(){return this._w||(this._w=this.cv(128,128,(x,w,h)=>{x.fillStyle='#3d2b1d';x.fillRect(0,0,w,h);for(let i=0;i<8;i++){x.fillStyle=`rgba(0,0,0,${.12+Math.random()*.15})`;x.fillRect(0,i*16,w,2)}for(let i=0;i<700;i++){const v=Math.random()*60|0;x.fillStyle=`rgba(${v},${v*.7|0},${v*.5|0},.2)`;x.fillRect(Math.random()*w,Math.random()*h,Math.random()*14+2,1)}}))},
doorTex(n){return this.cv(256,512,(x,w,h)=>{x.scale(2,2);w=128;h=256;x.fillStyle='#1d1610';x.fillRect(0,0,w,h);for(let i=0;i<420;i++){const v=Math.random()*40|0;x.fillStyle=`rgba(${v+20},${v+10},${v},.25)`;x.fillRect(Math.random()*w,Math.random()*h,.6+Math.random()*1.4,10+Math.random()*50)}
 x.strokeStyle='rgba(0,0,0,.65)';x.lineWidth=4;x.strokeRect(14,18,w-28,92);x.strokeRect(14,128,w-28,108);x.strokeStyle='rgba(120,90,50,.18)';x.lineWidth=1;x.strokeRect(17,21,w-34,86);x.strokeRect(17,131,w-34,102);
 x.fillStyle='#2b2415';x.fillRect(41,113,46,24);x.fillStyle='#8a7a4a';x.fillRect(43,115,42,20);x.fillStyle='#141008';x.font='bold 16px Georgia';x.textAlign='center';x.fillText(String(n).padStart(2,'0'),64,131);
 for(let i=0;i<5;i++){const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.35)');x.fillStyle=g;x.fillRect(Math.random()*w,0,4+Math.random()*8,h)}})},
doors(scene){const H=Level.H,M=THREE.MeshStandardMaterial,fr=new M({color:0x15110d,roughness:.85}),mk=(rx,ry)=>{const t=Level.wallMat.map.clone();t.repeat.set(rx,ry);t.needsUpdate=true;return new M({map:t,roughness:.95})},mo=mk(.25,1),ml=mk(.5,.3),br=new M({color:0xb08a3a,metalness:.9,roughness:.35}),lm=new M({color:0x5a0a0a,emissive:0x701010,roughness:.5});
 Level.doors.forEach((d,i)=>{const g=new THREE.Group();g.position.set(d.wx,0,d.wz);g.rotation.y=d.axis==='x'?Math.PI/2:0;scene.add(g);
  const bx=(w,h,dd,x,y,z,m,p=g)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,dd),m);o.position.set(x,y,z);p.add(o);return o};
  const fire=!!d.fire,HM=fire?this.hm():null,pm=fire?(()=>{const hp=HM.paint,a=d.out<0?[mo,mo,mo,mo,mo,hp]:[mo,mo,mo,mo,hp,mo],c=d.out<0?[ml,ml,ml,ml,ml,hp]:[ml,ml,ml,ml,hp,ml];return{a,c}})():null,frm=fire?HM.steelD:fr;
  [-1,1].forEach(s=>bx(.75,H,.3,s*1.125,H/2,0,fire?pm.a:mo));bx(1.5,H-2.3,.3,0,2.3+(H-2.3)/2,0,fire?pm.c:ml);
  [-1,1].forEach(s=>bx(.09,2.3,.36,s*.795,1.15,0,frm));bx(1.68,.09,.36,0,2.3,0,frm);
  const rm=Level.rooms.find(r=>r.doors.includes(d)),num=rm?rm.id+1:i+1,hg=new THREE.Group();hg.position.set(-.72,0,0);g.add(hg);
  bx(1.44,2.25,.07,.72,1.125,0,fire?new M({map:this.fireTex(),roughness:.45,metalness:.6}):new M({map:this.doorTex(num),roughness:.7}),hg);[-1,1].forEach(s=>bx(.05,.05,.1,1.25,1.05,s*.07,br,hg));
  d.lm=d.locked?this.lockGear(hg,d):new THREE.Group();d.lm.visible=d.locked;d.hg=hg;
  const X=d.axis==='x';[-1,1].forEach(s=>{const c=s*1.125;Level.col.push(X?{x0:d.wx-.15,x1:d.wx+.15,z0:d.wz+c-.375,z1:d.wz+c+.375}:{x0:d.wx+c-.375,x1:d.wx+c+.375,z0:d.wz-.15,z1:d.wz+.15})});
  d.pc=X?{x0:d.wx-.06,x1:d.wx+.06,z0:d.wz-.75,z1:d.wz+.75,off:false}:{x0:d.wx-.75,x1:d.wx+.75,z0:d.wz-.06,z1:d.wz+.06,off:false};Level.col.push(d.pc)})},
lockGear(hg,d){const M=THREE.MeshStandardMaterial,G=new THREE.Group();hg.add(G);
 const iron=new M({color:0x2b2b2e,metalness:.85,roughness:.42}),rust=new M({color:0x5a3a24,metalness:.7,roughness:.6}),brass=new M({color:0x9a7424,metalness:1,roughness:.28}),dark=new M({color:0x050505,roughness:1}),red=new THREE.MeshBasicMaterial({color:0xff2418,fog:false});
 if(!this._tape)this._tape=new M({roughness:.8,map:this.cv(256,32,(x,w,h)=>{x.fillStyle='#d9b21a';x.fillRect(0,0,w,h);x.fillStyle='#111';for(let i=-2;i<14;i++){x.beginPath();x.moveTo(i*24,0);x.lineTo(i*24+12,0);x.lineTo(i*24-4,h);x.lineTo(i*24-16,h);x.fill()}for(let i=0;i<300;i++){x.fillStyle=`rgba(0,0,0,${Math.random()*.25})`;x.fillRect(Math.random()*w,Math.random()*h,2,2)}})});
 const bx=(w,h,dd,x,y,z,m,rz=0)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,dd),m);o.position.set(x,y,z);o.rotation.z=rz;G.add(o);return o};
 const cy=(r,h,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,8),m);o.rotation.x=Math.PI/2;o.position.set(x,y,z);G.add(o)};
 const glowT=this.glow('rgba(255,40,30,');d.lg=[];
 [1,-1].forEach(sd=>{
  [.42,1.82].forEach(y=>{bx(1.44,.14,.03,.72,y,sd*.052,iron);bx(1.44,.025,.034,.72,y+.075,sd*.054,rust);for(let i=0;i<7;i++)cy(.02,.02,.1+i*.2,y,sd*.074,rust)});
  bx(.26,.46,.03,1.22,1.08,sd*.052,iron);[.88,1.28].forEach(y=>cy(.018,.02,1.22,y,sd*.074,rust));
  const body=bx(.19,.22,.08,1.22,.98,sd*.1,brass);bx(.15,.03,.082,1.22,1.06,sd*.1,iron);
  const sh=new THREE.Mesh(new THREE.TorusGeometry(.055,.014,8,18,Math.PI),brass);sh.position.set(1.22,1.09,sd*.1);G.add(sh);
  const kh=new THREE.Mesh(new THREE.CircleGeometry(.02,12),dark);kh.position.set(1.22,.99,sd*.142);kh.rotation.y=sd>0?0:Math.PI;G.add(kh);bx(.009,.04,.002,1.22,.955,sd*.142,dark);
  [[.18,1.78,1.2,1.1,0],[.18,.46,1.2,.92,1]].forEach(([x0,y0,x1,y1,k])=>{const n=13;for(let i=0;i<=n;i++){const t=i/n,x=x0+(x1-x0)*t,y=y0+(y1-y0)*t-Math.sin(Math.PI*t)*(k?-.05:.06),a=Math.atan2(y1-y0,x1-x0);
   const l=new THREE.Mesh(new THREE.TorusGeometry(.032,.0085,6,10),i%2?iron:rust);l.position.set(x,y,sd*(.074+.01*(i%2)));l.rotation.z=a;if(i%2)l.rotation.x=Math.PI/2;l.scale.x=1.35;G.add(l)}});
  [[.72,1.28,.1],[.72,.74,-.08]].forEach(([x,y,r])=>{const t=new THREE.Mesh(new THREE.PlaneGeometry(1.46,.1),this._tape);t.position.set(x,y,sd*.0385);t.rotation.set(0,sd>0?0:Math.PI,r);G.add(t)});
  const lamp=bx(.09,.09,.05,1.22,1.42,sd*.062,iron),bulb=new THREE.Mesh(new THREE.SphereGeometry(.03,10,8),red);bulb.position.set(1.22,1.42,sd*.092);G.add(bulb);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowT,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true,opacity:.7}));sp.scale.set(.55,.55,1);sp.position.set(1.22,1.42,sd*.12);G.add(sp);d.lg.push(sp)});
 const X=d.axis==='x',lx=X?d.wx:d.wx+.5,lz=X?d.wz-.5:d.wz;Level.src.push({x:lx,y:1.4,z:lz,col:new THREE.Color(0xff2a20),d:5,I:()=>d.locked?.55+Math.random()*.15:0});
 return G},
fixtures(scene){const S=Level.S,H=Level.H,R=Math.random,src=Level.src,gt=this.glow('rgba(255,190,110,'),gr=this.glow('rgba(255,50,40,'),geo=new THREE.BoxGeometry(.55,.07,.55),cw=new THREE.Color(0xffb070),cr=new THREE.Color(0xff2a20);
 const add=(x,z,mode)=>{const col=mode==='r'?cr:cw,mat=new THREE.MeshBasicMaterial({color:col.clone()}),mesh=new THREE.Mesh(geo,mat);mesh.position.set(x,H-.04,z);scene.add(mesh);
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:mode==='r'?gr:gt,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true,opacity:.18}));sp.scale.set(1.6,1.6,1);sp.position.set(x,H-.4,z);scene.add(sp);
  src.push({x,y:H-.45,z,mode,col,mat,sp,d:mode==='r'?6:8,i:mode==='r'?.5:.46,ph:R()*6,k:1,lk:-1,vis:true,I(){return mode==='d'?0:this.k*this.i}})};
 for(const a of[1,11,21])for(const s0 of[1,11])for(const o of[3,7]){const p=s0+o;[[a,p],[p,a]].forEach(([x,z])=>{if(Level.g[z][x]!==0)return;const near=Math.hypot(x-1,z-1)<11,r=R();add(x*S,z*S,near?'n':r<.06?'r':r<.34?'d':r<.52?'f':'n')})}
 Level.rooms.forEach(r=>{const x=(r.x0+r.x1)>>1,z=(r.z0+r.z1)>>1,q=R();add(x*S,z*S,r===Level.lockRoom?'r':q<.45?'d':q<.65?'f':'n')});
 add(Level.exit[0]*S,Level.exit[1]*S,'r')},
pipes(scene){const S=Level.S,H=Level.H,g=Level.g,rs=Level.roomOf,A=[],B=[];
 for(let z=1;z<Level.D-1;z++)for(let x=1;x<Level.W-1;x++)if(g[z][x]===0&&rs[z][x]<0&&Math.random()<Level.theme.pipe){
  const hx=g[z][x-1]!==1&&g[z][x+1]!==1&&g[z-1][x]===1&&g[z+1][x]===1,hz=g[z-1][x]!==1&&g[z+1][x]!==1&&g[z][x-1]===1&&g[z][x+1]===1,o=(Math.random()<.5?-1:1)*1.25;
  if(hx)A.push([x*S,H-.28,z*S+o]);else if(hz)B.push([x*S+o,H-.28,z*S])}
 const mat=new THREE.MeshStandardMaterial({color:0x34322d,roughness:.7,metalness:.6}),mk=(arr,r0,r2)=>{if(!arr.length)return;const im=new THREE.InstancedMesh(new THREE.CylinderGeometry(.075,.075,S,8),mat,arr.length),m=new THREE.Matrix4(),q=new THREE.Quaternion().setFromEuler(new THREE.Euler(r0,0,r2)),sc=new THREE.Vector3(1,1,1);
  arr.forEach((p,i)=>{m.compose(new THREE.Vector3(p[0],p[1],p[2]),q,sc);im.setMatrixAt(i,m)});scene.add(im)};
 mk(A,0,Math.PI/2);mk(B,Math.PI/2,0)},
stains(scene){const S=Level.S,fl=Level.walk,t=this.cv(128,128,(x,w,h)=>{for(let i=0;i<7;i++){const px=40+Math.random()*48,py=40+Math.random()*48,r=10+Math.random()*24,gr=x.createRadialGradient(px,py,0,px,py,r);gr.addColorStop(0,'rgba(70,8,6,.55)');gr.addColorStop(1,'rgba(70,8,6,0)');x.fillStyle=gr;x.fillRect(0,0,w,h)}}),
 mat=new THREE.MeshStandardMaterial({map:t,transparent:true,depthWrite:false,roughness:.4,polygonOffset:true,polygonOffsetFactor:-2});
 for(let i=0;i<70;i++){const c=fl[Math.random()*fl.length|0];if(Level.g[c[1]][c[0]]!==0||Level.resv.has(c.join()))continue;const m=new THREE.Mesh(new THREE.PlaneGeometry(2,2),mat);m.rotation.set(-Math.PI/2,0,Math.random()*6);m.position.set(c[0]*S+(Math.random()-.5),.015,c[1]*S+(Math.random()-.5));scene.add(m)}},
rooms(scene){const S=Level.S,g=Level.g,R=Math.random,M=THREE.MeshStandardMaterial,D4=[[1,0],[-1,0],[0,1],[0,-1]],
 wood=new M({map:this.wood(),roughness:.85}),metal=new M({map:this.noise(),color:0x6d7d74,roughness:.55,metalness:.65}),dm=new M({color:0x1e211f,roughness:.8,metalness:.4}),rust=new M({map:this.noise(),color:0x6a4a36,roughness:.75,metalness:.5}),
 cloth=[0x4a2a2a,0x2a3040,0x3a3a2a,0x30403a].map(c=>new M({color:c,roughness:1}));
 const bx=(g,w,h,d,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o},cy=(g,r,h,x,y,z,m,s=12)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,s),m);o.position.set(x,y,z);g.add(o);return o};
 const K={
  crate(){const g=new THREE.Group(),s=.8+R()*.3;bx(g,s,s,s,0,s/2,0,wood);bx(g,s+.04,.07,s+.04,0,s*.2,0,dm);bx(g,s+.04,.07,s+.04,0,s*.8,0,dm);if(R()<.5){const t=.45+R()*.15;bx(g,t,t,t,(R()-.5)*.2,s+t/2,(R()-.5)*.2,wood).rotation.y=R()}return{g,w:s,d:s}},
  shelf(){const g=new THREE.Group();[-.72,.72].forEach(x=>[-.2,.2].forEach(z=>bx(g,.05,2,.05,x,1,z,metal)));[.12,.7,1.28,1.86].forEach(y=>{bx(g,1.5,.04,.45,0,y,0,wood);if(y<1.8)for(let i=0;i<3;i++)if(R()<.7){const w=.2+R()*.25,h=.15+R()*.25;bx(g,w,h,.28,-.55+i*.55+(R()-.5)*.1,y+.02+h/2,0,R()<.5?cloth[R()*4|0]:wood)}});return{g,w:1.5,d:.45}},
  barrel(){const g=new THREE.Group();cy(g,.3,.9,0,.45,0,rust);[.2,.7].forEach(y=>cy(g,.31,.04,0,y,0,dm));return{g,w:.64,d:.64}},
  desk(){const g=new THREE.Group();bx(g,1.5,.06,.75,0,.76,0,wood);[-.7,.7].forEach(x=>bx(g,.05,.74,.7,x,.37,0,wood));bx(g,1.4,.5,.04,0,.5,-.33,wood);bx(g,.4,.18,.6,.45,.62,.02,wood);
   const l=new THREE.Group();cy(l,.07,.02,0,0,0,dm);cy(l,.012,.28,0,.15,0,dm);bx(l,.14,.08,.14,0,.3,0,new THREE.MeshBasicMaterial({color:0x6a5a3a}));l.position.set(-.5,.79,-.1);g.add(l);
   bx(g,.3,.005,.4,-.1,.8,.1,new M({color:0x9a9684,roughness:1})).rotation.y=.4;
   const c=new THREE.Group();bx(c,.42,.05,.42,0,.45,0,wood);bx(c,.42,.5,.04,0,.72,-.2,wood);[-1,1].forEach(a=>[-1,1].forEach(b=>bx(c,.04,.45,.04,a*.18,.22,b*.18,dm)));c.position.set((R()-.5)*.5,0,.62);c.rotation.y=(R()-.5)*1.2;g.add(c);return{g,w:1.5,d:.75}},
  cabinet(){const g=new THREE.Group();bx(g,.9,1.9,.45,0,.95,0,metal);bx(g,.02,1.8,.02,0,.95,.23,dm);[-.2,.2].forEach(x=>bx(g,.03,.12,.04,x,1.0,.24,dm));return{g,w:.9,d:.45}},
  boiler(){const g=new THREE.Group();cy(g,.55,2.3,0,1.15,0,rust,16);[.4,1.2,2.0].forEach(y=>cy(g,.57,.06,0,y,0,dm,16));cy(g,.09,1.0,.2,2.8,.1,dm,8);cy(g,.09,.5,-.15,1.4,.58,dm,8).rotation.x=Math.PI/2;
   const ga=new THREE.Mesh(new THREE.CircleGeometry(.09,16),new THREE.MeshBasicMaterial({color:0xff2a1a}));ga.position.set(0,1.5,.56);g.add(ga);return{g,w:1.2,d:1.2}},
  cot(){const g=new THREE.Group();[-.85,.85].forEach(x=>[-.35,.35].forEach(z=>bx(g,.04,.35,.04,x,.17,z,dm)));bx(g,1.9,.05,.8,0,.36,0,dm);bx(g,1.8,.12,.72,0,.44,0,cloth[R()*4|0]);bx(g,.4,.1,.5,-.7,.55,0,new M({color:0x8a8678,roughness:1}));return{g,w:1.9,d:.85}},
  chair(){const g=new THREE.Group();bx(g,.45,.05,.45,0,.45,0,wood);bx(g,.45,.5,.04,0,.72,-.2,wood);[-1,1].forEach(a=>[-1,1].forEach(b=>bx(g,.04,.45,.04,a*.19,.22,b*.19,dm)));return{g,w:.5,d:.5}},
 ...this.extra({bx,cy,wood,metal,dm,cloth,M,R})};
 this._occ=new Set();
 const th={storage:['crate','crate','shelf','barrel','crate','sidetable','trunk','bucket','shelf'],study:['desk','bookcase','bookcase','armchair','sidetable','cabinet','clock','table','candles'],bedroom:['bed','dresser','wardrobe','sidetable','chair','dresser','plant','trunk','candles'],parlor:['armchair','armchair','sidetable','clock','bookcase','plant','dresser'],boiler:['boiler','boiler','barrel','crate','crate'],cells:['cot','cabinet','barrel','chair','bucket','stool','trunk']},cnt={storage:5,study:5,bedroom:5,parlor:5,boiler:4,cells:4},names=Level.theme.rooms;
 const rug=this.cv(128,96,(x,w,h)=>{x.fillStyle='#3a1c19';x.fillRect(0,0,w,h);x.strokeStyle='#6b5030';x.lineWidth=4;x.strokeRect(6,6,w-12,h-12);x.strokeStyle='rgba(0,0,0,.4)';x.strokeRect(14,14,w-28,h-28);for(let i=0;i<400;i++){const v=Math.random()*50|0;x.fillStyle=`rgba(${v},${v},${v},.2)`;x.fillRect(Math.random()*w,Math.random()*h,2,2)}}),rm=new M({map:rug,roughness:1});
 Level.rooms.forEach(r=>{const tn=names[R()*names.length|0];r.theme=tn;const cells=[];
  for(let z=r.z0;z<=r.z1;z++)for(let x=r.x0;x<=r.x1;x++){if(Level.resv.has(x+','+z)||Level.lockers.some(l=>l.gx===x&&l.gz===z)||D4.some(([a,b])=>g[z+b][x+a]===2))continue;const sd=D4.filter(([a,b])=>g[z+b][x+a]===1);if(sd.length)cells.push([x,z,sd])}
  cells.shuf();const n=Math.min(cells.length,cnt[tn]+2+(R()*3|0));
  for(let i=0;i<n;i++){const[x,z,sd]=cells[i],s=sd[R()*sd.length|0],k=th[tn][R()*th[tn].length|0],o=K[k](),w=o.w,d=o.d,sh=(R()-.5)*Math.max(0,1.9-w),t=[-s[1],s[0]],px=x*S+s[0]*(S/2-d/2-.03)+t[0]*sh,pz=z*S+s[1]*(S/2-d/2-.03)+t[1]*sh;
   this._occ.add(x+','+z+','+s);o.g.position.set(px,0,pz);o.g.rotation.y=k==='chair'?R()*6.28:Math.atan2(-s[0],-s[1]);scene.add(o.g);
   if(k!=='chair'){const hx=s[0]?d/2:w/2,hz=s[0]?w/2:d/2;Level.col.push({x0:px-hx,x1:px+hx,z0:pz-hz,z1:pz+hz})}}
  if((tn==='study'||tn==='bedroom'||tn==='parlor'||tn==='cells')&&!r.stair&&R()<.8){const cx=(r.x0+r.x1)>>1,cz=(r.z0+r.z1)>>1;if(!Level.resv.has(cx+','+cz)){const m=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.8),rm);m.rotation.set(-Math.PI/2,0,(R()<.5?0:Math.PI/2));m.position.set(cx*S,.012,cz*S);scene.add(m)}}});
 this.hall(scene,K,rm)},
items(scene){const M=THREE.MeshStandardMaterial,br=new M({color:0xb08a3a,metalness:.9,roughness:.35}),gl={battery:this.glow('rgba(170,255,120,'),bottle:this.glow('rgba(150,255,210,'),key:this.glow('rgba(255,205,90,'),note:this.glow('rgba(255,250,225,'),screwdriver:this.glow('rgba(255,150,90,'),fuse:this.glow('rgba(255,210,90,')},
 note=this.cv(64,80,(x,w,h)=>{x.fillStyle='#b9b08e';x.fillRect(0,0,w,h);x.fillStyle='rgba(30,25,15,.55)';for(let i=0;i<9;i++)x.fillRect(8,10+i*7,w-16-(i%3)*10,1.5)}),gm=new M({color:0x3f7a46,transparent:true,opacity:.8,roughness:.2}),
 bm=new M({color:0x1c1c1c,roughness:.5,metalness:.5}),bc=new M({color:0xd8a020,roughness:.5}),nm=new M({map:note,roughness:1,side:THREE.DoubleSide});
 const cyl=(g,r1,r2,h,m,x,y)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,10),m);o.rotation.z=Math.PI/2;o.position.set(x,y,0);g.add(o)};
 this._scene=scene;
 this._mk=it=>{const g=new THREE.Group();g.position.set(it.x,0,it.z);g.rotation.y=it.a;g.scale.setScalar(1.5);scene.add(g);
  if(it.t==='battery'){cyl(g,.04,.04,.15,bm,0,.045);cyl(g,.042,.042,.07,bc,0,.045);cyl(g,.015,.015,.03,br,.09,.045)}
  else if(it.t==='bottle'){cyl(g,.036,.04,.17,gm,0,.04);cyl(g,.014,.025,.09,gm,.12,.04)}
  else if(it.t==='key'){const r=new THREE.Mesh(new THREE.TorusGeometry(.035,.01,6,12),br);r.rotation.x=Math.PI/2;r.position.set(-.08,.02,0);g.add(r);const s=new THREE.Mesh(new THREE.BoxGeometry(.14,.012,.012),br);s.position.set(.02,.02,0);g.add(s);[.06,.085].forEach(x=>{const t=new THREE.Mesh(new THREE.BoxGeometry(.012,.012,.03),br);t.position.set(x,.02,.012);g.add(t)})}
  else if(it.t==='fuse'){const c=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.13,10),new M({color:0xd8b040,metalness:.8,roughness:.3,emissive:0x553300}));c.rotation.z=Math.PI/2;g.add(c);const cp=new THREE.Mesh(new THREE.CylinderGeometry(.034,.034,.025,10),new M({color:0x999999,metalness:.9,roughness:.3}));cp.rotation.z=Math.PI/2;cp.position.x=.07;g.add(cp)}
  else if(it.t==='screwdriver'){const h=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.11,8),bc);h.rotation.z=Math.PI/2;h.position.set(-.05,.03,0);g.add(h);const sh=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.12,6),new M({color:0xaaaaaa,metalness:.9,roughness:.3}));sh.rotation.z=Math.PI/2;sh.position.set(.07,.03,0);g.add(sh)}
  else{const p=new THREE.Mesh(new THREE.PlaneGeometry(.26,.32),nm);p.rotation.x=-Math.PI/2;p.position.y=.012;g.add(p)}
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:gl[it.t],blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true,opacity:.5}));sp.scale.set(.6,.6,1);sp.position.set(it.x,.24,it.z);scene.add(sp);it.g=g;it.sp=sp};
 Level.mkf=this._mk;Level.items.forEach(it=>this._mk(it))},
dropItem(t,x,z,nid){let it=nid===undefined?Level.items.find(i=>i.taken&&i.t===t):null;if(it){it.x=x;it.z=z;it.a=Math.random()*6.28;it.taken=false;it.g.position.set(x,0,z);it.g.rotation.y=it.a;it.sp.position.set(x,.24,z);it.g.visible=true;it.sp.visible=true}
 else{it={t,x,z,a:Math.random()*6.28,taken:false,i:Level.items.length};if(nid!==undefined){it.nid=nid;it.drop=true}Level.items.push(it);this._mk(it)}return it},
build(scene){this.doors(scene);this.fusesExit(scene);this.lockers(scene);this.bed(scene);this.rooms(scene);this.fixtures(scene);this.pipes(scene);this.stains(scene);this.items(scene);this.stairsB(scene);this.ventsB(scene);this.trapsB(scene)},
fusesExit(scene){const S=Level.S,M=THREE.MeshStandardMaterial,gt=this.glow('rgba(255,170,60,');Level.fuses=[];
 const dark=new M({color:0x1d1b18,roughness:.9}),brass=new M({color:0xb08a3a,metalness:.9,roughness:.35});
 Level.keys.forEach((k,i)=>{const duct=k[0]<-50,p=duct&&Level.duct?{x:Level.duct.fuse.x,z:Level.duct.fuse.z}:Level.wp(k),g=new THREE.Group();g.position.set(p.x,0,p.z);scene.add(g);
  if(!duct){const ped=new THREE.Mesh(new THREE.BoxGeometry(.4,.8,.4),dark);ped.position.y=.4;g.add(ped);
  const top=new THREE.Mesh(new THREE.BoxGeometry(.52,.05,.52),brass);top.position.y=.83;g.add(top)}
  const f=new THREE.Group();f.position.y=duct?3.6:1.25;g.add(f);
  f.add(new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.34,16),new M({color:0xffe0a0,transparent:true,opacity:.4,emissive:0xff9a2a,emissiveIntensity:.9,roughness:.1})));
  [-.2,.2].forEach(y=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.07,16),brass);c.position.y=y;f.add(c)});
  f.add(new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.32),new THREE.MeshBasicMaterial({color:0xffe6a8,fog:false})));
  const h=new THREE.Sprite(new THREE.SpriteMaterial({map:gt,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true}));h.scale.set(1.6,1.6,1);f.add(h);
  const n=16,pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(new Float32Array(n*3),3));
  const sp=new THREE.Points(pg,new THREE.PointsMaterial({map:this.dot(),color:0xffc060,size:.06,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));g.add(sp);
  const l={intensity:1};
  const fz={g,f,l,sp,n,x:p.x,z:p.z,i:Level.fuseBase+i,by:duct?3.6:1.25,duct,taken:false};Level.fuses.push(fz);Level.src.push({x:p.x,y:duct?3.9:1.4,z:p.z,col:new THREE.Color(0xffa640),d:7,I:()=>fz.taken?0:fz.l.intensity});if(!duct)Level.col.push({x0:p.x-.27,x1:p.x+.27,z0:p.z-.27,z1:p.z+.27})});
 // exit door
 if(!Level.fp.exit){Level.xd=null;return}
 const E=Level.exit,p=Level.wp(E),d=this.side(E)||[0,-1],g=new THREE.Group();g.position.set(p.x+d[0]*(S/2-.1),0,p.z+d[1]*(S/2-.1));g.rotation.y=Math.atan2(-d[0],-d[1]);scene.add(g);
 const fm=new M({color:0x15171a,metalness:.8,roughness:.5});
 const door=new THREE.Mesh(new THREE.BoxGeometry(1.5,2.55,.1),new M({roughness:.6,metalness:.6,map:this.cv(128,256,(x,w,h)=>{x.fillStyle='#3a3d40';x.fillRect(0,0,w,h);for(let i=0;i<900;i++){x.fillStyle=`rgba(0,0,0,${Math.random()*.3})`;x.fillRect(Math.random()*w,Math.random()*h,2,2)}x.fillStyle='#b8860b';for(let i=0;i<8;i++){x.save();x.translate(0,200+i*0);x.restore()}x.fillStyle='#a8861a';for(let i=-2;i<10;i++){x.beginPath();x.moveTo(i*20,h-30);x.lineTo(i*20+10,h-30);x.lineTo(i*20-10,h);x.lineTo(i*20-20,h);x.fill()}x.strokeStyle='#111';x.lineWidth=4;x.strokeRect(6,6,w-12,h-12)})}));
 door.position.y=1.275;g.add(door);
 [[-.81,1.3,.12,2.7],[.81,1.3,.12,2.7]].forEach(a=>{const m=new THREE.Mesh(new THREE.BoxGeometry(a[2],a[3],.24),fm);m.position.set(a[0],a[1],0);g.add(m)});
 const tp=new THREE.Mesh(new THREE.BoxGeometry(1.74,.14,.24),fm);tp.position.y=2.62;g.add(tp);
 const sg=new THREE.Mesh(new THREE.PlaneGeometry(.9,.24),new THREE.MeshBasicMaterial({map:this.cv(256,64,(x,w,h)=>{x.fillStyle='#000';x.fillRect(0,0,w,h);x.fillStyle='#ff3030';x.font='bold 46px Georgia';x.textAlign='center';x.fillText('EXIT',128,48)}),fog:false}));sg.position.set(0,2.88,.13);g.add(sg);
 const glow=new THREE.Mesh(new THREE.PlaneGeometry(1.5,2.55),new THREE.MeshBasicMaterial({color:0xffffff,fog:false}));glow.position.set(0,1.275,-.07);glow.visible=false;g.add(glow);
 const lt={color:new THREE.Color(0xff2020),intensity:1.2};Level.src.push({x:g.position.x-d[0]*.9,y:2.2,z:g.position.z-d[1]*.9,col:lt.color,d:9,I:()=>lt.intensity});
 Level.xd={g,door,glow,lt,sg,x:g.position.x,z:g.position.z,open:false,t:0};
},
 lockers(scene){const S=Level.S;Level.lockers=[];const used=[...Level.keys,Level.exit],cand=[];
 for(let z=1;z<Level.D-1;z++)for(let x=1;x<Level.W-1;x++)if(!Level.g[z][x]&&Level.dist[z][x]>3&&!used.some(u=>u[0]===x&&u[1]===z)&&!Level.resv.has(x+','+z)&&![[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>Level.g[z+b][x+a]===2)){const s=this.side([x,z]);if(s)cand.push([x,z,s])}
 cand.shuf().forEach(([x,z,s])=>{if(Level.lockers.length>=18||Level.lockers.some(l=>Math.abs(l.gx-x)+Math.abs(l.gz-z)<4))return;
  const c=Level.wp([x,z]),lx=c.x+s[0]*(S/2-.42),lz=c.z+s[1]*(S/2-.42),L=this.locker(scene,lx,lz,Math.atan2(-s[0],-s[1]),10+Level.lockers.length*3+(Math.random()*3|0));
  Level.lockers.push({gx:x,gz:z,cx:lx,cz:lz,px:c.x,pz:c.z,nx:-s[0],nz:-s[1],yaw:Math.atan2(s[0],s[1]),hg:L,ang:0,open:false})});
 if(!Level.lockLight){Level.lockLight=new THREE.PointLight(0xc8b48a,0,3);(Level.root||scene).add(Level.lockLight)}
},
noise(){return this._n||(this._n=this.cv(128,128,(x,w,h)=>{x.fillStyle='#8a948e';x.fillRect(0,0,w,h);for(let i=0;i<1400;i++){const v=Math.random()*70|0;x.fillStyle=`rgba(${v},${v},${v},.25)`;x.fillRect(Math.random()*w,Math.random()*h,2,2)}}))},
doorOut(n){return this.cv(128,256,(x,w,h)=>{x.fillStyle='#46554d';x.fillRect(0,0,w,h);for(let i=0;i<1600;i++){const v=Math.random()*60|0;x.fillStyle=`rgba(${v},${v},${v},.25)`;x.fillRect(Math.random()*w,Math.random()*h,2,2)}
 for(let i=0;i<6;i++){const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(90,40,10,0)');g.addColorStop(.6,'rgba(90,40,10,.35)');g.addColorStop(1,'rgba(40,15,5,.5)');x.fillStyle=g;x.fillRect(Math.random()*w,0,3+Math.random()*6,h)}
 x.strokeStyle='#111';x.lineWidth=5;x.strokeRect(3,3,w-6,h-6);x.fillStyle='#b8b09a';x.fillRect(40,110,48,30);x.fillStyle='#222';x.font='bold 22px Georgia';x.textAlign='center';x.fillText(String(n).padStart(2,'0'),64,133)})},
doorIn(){return this.cv(128,256,(x,w,h)=>{x.fillStyle='#1f2220';x.fillRect(0,0,w,h);x.strokeStyle='rgba(200,195,180,.3)';x.lineWidth=1;for(let i=0;i<40;i++){x.beginPath();const a=Math.random()*w,b=Math.random()*h;x.moveTo(a,b);x.lineTo(a+(Math.random()-.5)*40,b+(Math.random()-.5)*60);x.stroke()}
 x.strokeStyle='rgba(200,195,180,.5)';x.lineWidth=2;x.beginPath();for(let i=0;i<5;i++){x.moveTo(30+i*6,60);x.lineTo(30+i*6,84)}x.moveTo(26,80);x.lineTo(60,64);x.stroke()})},
back(){return this._b||(this._b=new THREE.MeshStandardMaterial({roughness:.9,map:this.cv(128,256,(x,w,h)=>{x.fillStyle='#1b1d1b';x.fillRect(0,0,w,h);x.strokeStyle='rgba(190,185,170,.55)';x.lineWidth=1.5;
 for(let g=0;g<14;g++){const bx=14+(g%4)*26,by=24+((g/4)|0)*18;for(let i=0;i<4;i++){x.beginPath();x.moveTo(bx+i*4,by);x.lineTo(bx+i*4,by+12);x.stroke()}x.beginPath();x.moveTo(bx-2,by+10);x.lineTo(bx+16,by+2);x.stroke()}
 x.fillStyle='rgba(110,10,10,.7)';x.beginPath();x.ellipse(64,170,15,19,0,0,7);x.fill();for(let i=0;i<5;i++){x.beginPath();x.ellipse(50+i*7,146-(i%3==1?6:0),3,12,(i-2)*.12,0,7);x.fill()}
 x.strokeStyle='rgba(90,8,8,.5)';for(let i=0;i<8;i++){x.beginPath();x.moveTo(64+(i-4)*5,190);x.lineTo(64+(i-4)*5+3,240);x.stroke()}})}))},
locker(scene,lx,lz,ang,num){const M=THREE.MeshStandardMaterial,g=new THREE.Group();g.position.set(lx,0,lz);g.rotation.y=ang;scene.add(g);
 const W=.9,H=2.1,D=.7,t=.03,mo=this._mo||(this._mo=new M({map:this.noise(),color:0x6d7d74,roughness:.55,metalness:.65})),mi=this._mi||(this._mi=new M({color:0x1e211f,roughness:.8,metalness:.4})),
 cl=this._cl||(this._cl=new M({color:0x2a1616,roughness:1})),cl2=this._c2||(this._c2=new M({color:0x15181f,roughness:1})),lt=this._lt||(this._lt=new M({color:0x2b1d12,roughness:.7})),sv=this._sv||(this._sv=new M({color:0x9a9a94,metalness:.9,roughness:.3}));
 const bx=(w,h,d,x,y,z,m,p=g)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);p.add(o);return o};
 bx(W,H,t,0,H/2,-D/2,this.back());bx(t,H,D,-W/2,H/2,0,mo);bx(t,H,D,W/2,H/2,0,mo);bx(W,t,D,0,H,0,mo);bx(W,t,D,0,.02,0,mi);
 // interior: shelf, rail, hanging clothes, boots, bottle
 bx(W-.06,.03,.32,0,1.9,-.17,mi);bx(.2,.12,.16,.2,1.97,-.18,cl2);const bt=new THREE.Mesh(new THREE.CylinderGeometry(.03,.035,.2,10),new M({color:0x3a5a3a,transparent:true,opacity:.7}));bt.position.set(-.2,2.02,-.2);g.add(bt);
 bx(W-.08,.022,.022,0,1.76,-.3,sv);
 bx(.34,.7,.09,.2,1.38,-.28,cl);bx(.09,.55,.08,.01,1.42,-.28,cl);bx(.09,.55,.08,.39,1.42,-.28,cl);bx(.3,.9,.07,-.2,1.28,-.29,cl2);bx(.08,.12,.08,.2,1.78,-.28,cl);
 bx(.13,.14,.28,-.17,.1,-.08,lt);bx(.13,.14,.28,-.01,.1,-.1,lt);bx(.08,.03,.2,.25,.04,-.1,mo);
 // hinged door (front only)
 const hg=new THREE.Group();hg.position.set(-W/2+.02,0,D/2-.015);g.add(hg);const dw=W-.04,om=new M({map:this.doorOut(num),roughness:.55,metalness:.6}),im=new M({map:this.doorIn(),roughness:.8});
 [[1.25,.675],[.15,2.02]].forEach(([h,y])=>{const o=new THREE.Mesh(new THREE.BoxGeometry(dw,h,.03),[mo,mo,mo,mo,om,im]);o.position.set(dw/2,y,0);hg.add(o)});
 for(let i=0;i<10;i++){bx(dw-.08,.012,.075,dw/2,1.32+i*.066,0,mo,hg).rotation.x=.7}
 bx(.03,.72,.03,.02,1.65,0,mo,hg);bx(.03,.72,.03,dw-.02,1.65,0,mo,hg);bx(.03,.14,.05,dw-.08,1.0,.04,sv,hg);
 return hg},
update(dt,t,P){Level.lockers.forEach(l=>{l.ang+=((l.open?-1.9:0)-l.ang)*Math.min(1,dt*7);l.hg.rotation.y=l.ang});Level.fuses.forEach(f=>{if(f.taken)return;f.f.rotation.y=t*1.5;f.f.position.y=(f.by||1.25)+Math.sin(t*2+f.i)*.07;f.l.intensity=.9+.25*Math.sin(t*7+f.i)+(Math.random()<.03?-.5:0);
  const a=f.sp.geometry.attributes.position;for(let i=0;i<f.n;i++){const ph=i*1.7+f.i,r=.12+.1*((i%3)/2),y=((t*.25+i/f.n)%1);a.setXYZ(i,Math.cos(t*.8+ph)*r,1.0+y*.7,Math.sin(t*.8+ph)*r)}a.needsUpdate=true});
 const x=Level.xd;if(x&&x.open){x.t+=dt;x.glow.visible=true;x.door.position.y=Math.min(4,1.275+x.t*1.1)}
 Level.doors.forEach(d=>{d.o+=(d.target-d.o)*Math.min(1,dt*(d.rate||6));if(Math.abs(d.target-d.o)<.01)d.o=d.target;d.hg.rotation.y=d.o*d.sw*1.7;d.pc.off=d.o>.45;d.lm.visible=d.locked;if(d.locked&&d.lg)d.lg.forEach(q=>q.material.opacity=.45+.35*Math.sin(t*3.2+d.id))});
 Level.traps.forEach(t=>{t.ang+=((t.armed?0:1.4)-t.ang)*Math.min(1,dt*20);if(t.jA){t.jA.rotation.x=-t.ang;t.jB.rotation.x=t.ang}});
 Level.vents.forEach(v=>{v.ang+=((v.open?1.45:0)-v.ang)*Math.min(1,dt*6);if(v.hg)v.hg.rotation.x=v.ang});
 Level.items.forEach(it=>{if(it.taken)return;it.sp.material.opacity=.3+.25*Math.sin(t*2.4+it.i*1.3)})}};

Object.assign(Props,{
extra(c){const{bx,cy,wood,dm,cloth,M,R}=c,P=this,mah=new M({map:this.wood(),color:0xb89070,roughness:.75}),gold=new M({color:0x9a7424,metalness:.9,roughness:.35}),pap=new M({color:0x8a8470,roughness:1}),
 bk=[0x4a1c1c,0x1c2a44,0x2c3a22,0x4a3a1c,0x2a2a2a,0x5a2a3a].map(h=>new M({color:h,roughness:.9})),vase=new M({color:0x3a4a44,roughness:.3});
 return{
  lantern(){const g=new THREE.Group();cy(g,.12,.03,0,.015,0,dm,8);bx(g,.2,.02,.2,0,.28,0,dm);[[-.09,-.09],[.09,-.09],[-.09,.09],[.09,.09]].forEach(([a,b])=>bx(g,.015,.26,.015,a,.15,b,dm));bx(g,.16,.22,.16,0,.15,0,new M({color:0xffd9a0,transparent:true,opacity:.35,emissive:0xffa040,emissiveIntensity:.5}));P.flame(g,0,.15,0);cy(g,.012,.14,0,.34,0,dm,6);return{g,w:.4,d:.4}},
  table(){const g=new THREE.Group();bx(g,1.1,.06,.8,0,.74,0,mah);[-.48,.48].forEach(x=>[-.33,.33].forEach(z=>bx(g,.06,.72,.06,x,.36,z,mah)));bx(g,.5,.004,.4,(R()-.5)*.3,.775,(R()-.5)*.2,pap).rotation.y=R();
   cy(g,.03,.14,.3,.85,0,pap,8);P.flame(g,.3,.95,0);return{g,w:1.1,d:.8}},
  trunk(){const g=new THREE.Group();bx(g,.95,.42,.55,0,.21,0,wood);bx(g,.98,.1,.58,0,.46,0,mah);[-.3,.3].forEach(x=>bx(g,.05,.46,.6,x,.23,0,dm));bx(g,.08,.1,.02,0,.38,.29,gold);return{g,w:.98,d:.6}},
  bucket(){const g=new THREE.Group();const c=cy(g,.17,.32,0,.16,0,dm,10);bx(g,.36,.01,.01,0,.33,0,dm);if(R()<.5)bx(g,.2,.01,.2,.1,.02,.2,new M({color:0x3a0a08,roughness:.4})).rotation.y=R();return{g,w:.4,d:.4}},
  stool(){const g=new THREE.Group();cy(g,.18,.05,0,.45,0,wood,10);[0,2.1,4.2].forEach(a=>bx(g,.04,.44,.04,Math.cos(a)*.13,.22,Math.sin(a)*.13,wood));return{g,w:.4,d:.4}},
  candles(){const g=new THREE.Group();cy(g,.16,.04,0,.02,0,gold,10);cy(g,.025,1.3,0,.67,0,gold,6);bx(g,.5,.025,.025,0,1.32,0,gold);[-.24,0,.24].forEach(x=>{cy(g,.025,.12,x,1.4,0,pap,6);P.flame(g,x,1.5,0)});return{g,w:.5,d:.4}},
  dresser(){const g=new THREE.Group();bx(g,1.2,.9,.5,0,.45,0,mah);bx(g,1.28,.05,.56,0,.92,0,wood);[.2,.45,.7].forEach(y=>{bx(g,1.1,.02,.02,0,y+.1,.255,dm);[-.3,.3].forEach(x=>bx(g,.05,.03,.03,x,y,.265,gold))});
   bx(g,.4,.01,.3,(R()-.5)*.4,.945,0,pap);if(R()<.6)cy(g,.06,.22,.35,1.04,0,vase,10);return{g,w:1.25,d:.55}},
  bookcase(){const g=new THREE.Group();bx(g,1.3,2.1,.04,0,1.05,-.17,wood);[-.63,.63].forEach(x=>bx(g,.05,2.1,.36,x,1.05,0,mah));[.03,.5,.95,1.4,1.85,2.1].forEach(y=>bx(g,1.3,.04,.36,0,y,0,mah));
   [.05,.52,.97,1.42].forEach(y=>{let x=-.58;while(x<.52){const w=.07+R()*.08,h=.22+R()*.14;if(R()<.8)bx(g,w,h,.24,x+w/2,y+.02+h/2,0,bk[R()*6|0]);x+=w+(R()<.15?.12:.005)}});return{g,w:1.3,d:.4}},
  clock(){const g=new THREE.Group();bx(g,.5,.3,.36,0,.15,0,mah);bx(g,.4,1.4,.3,0,1.0,0,mah);bx(g,.56,.5,.34,0,1.95,0,mah);const f=new THREE.Mesh(new THREE.CircleGeometry(.17,20),new THREE.MeshBasicMaterial({color:0x5a5440}));f.position.set(0,1.95,.175);g.add(f);
   bx(g,.01,.12,.005,0,1.99,.18,dm);bx(g,.09,.01,.005,.04,1.95,.18,dm);cy(g,.07,.02,0,.85,.16,gold,12).rotation.x=Math.PI/2;bx(g,.015,.5,.01,0,.85,.16,gold);return{g,w:.56,d:.4}},
  wardrobe(){const g=new THREE.Group();bx(g,1.1,2.1,.55,0,1.05,0,mah);bx(g,1.16,.07,.6,0,2.14,0,wood);bx(g,.02,1.9,.02,0,1.05,.28,dm);[-.08,.08].forEach(x=>bx(g,.03,.14,.03,x,1.05,.29,gold));[-.27,.27].forEach(x=>bx(g,.44,1.6,.01,x,1.05,.277,dm));return{g,w:1.16,d:.6}},
  sidetable(){const g=new THREE.Group();bx(g,.6,.04,.45,0,.7,0,mah);[-.25,.25].forEach(x=>[-.18,.18].forEach(z=>bx(g,.04,.68,.04,x,.34,z,mah)));bx(g,.5,.12,.4,0,.6,0,mah);
   if(R()<.5){cy(g,.07,.22,0,.83,0,vase,10);for(let i=0;i<3;i++){const s=bx(g,.01,.3,.01,(R()-.5)*.1,1.0,(R()-.5)*.1,dm);s.rotation.z=(R()-.5)*.6}}
   else{const l=new THREE.Group();cy(l,.06,.02,0,0,0,dm);cy(l,.012,.24,0,.13,0,dm);bx(l,.16,.12,.16,0,.3,0,new THREE.MeshBasicMaterial({color:0x3a2e1a}));l.position.set(0,.72,0);g.add(l)}return{g,w:.62,d:.47}},
  armchair(){const g=new THREE.Group(),c=cloth[R()*4|0];bx(g,.85,.35,.8,0,.3,0,c);bx(g,.85,.8,.22,0,.75,-.3,c);[-.4,.4].forEach(x=>bx(g,.14,.3,.7,x,.55,.02,c));[-.38,.38].forEach(x=>[-.35,.35].forEach(z=>bx(g,.06,.12,.06,x,.06,z,wood)));return{g,w:.9,d:.85}},
  bed(){const g=new THREE.Group(),c=cloth[R()*4|0];[-.95,.95].forEach(x=>[-.4,.4].forEach(z=>bx(g,.06,.3,.06,x,.15,z,mah)));bx(g,2.0,.12,.9,0,.36,0,mah);bx(g,1.9,.2,.82,0,.5,0,pap);bx(g,1.2,.08,.84,.3,.62,0,c);bx(g,.4,.12,.55,-.7,.66,0,pap);bx(g,.06,.9,.95,-1.0,.6,0,mah);bx(g,.06,.55,.95,1.0,.45,0,mah);return{g,w:2.05,d:.95}},
  plant(){const g=new THREE.Group();cy(g,.2,.35,0,.17,0,new M({color:0x5a3a28,roughness:.9}),10);for(let i=0;i<7;i++){const s=bx(g,.015,.5+R()*.5,.015,0,.6,0,dm);s.position.set((R()-.5)*.1,.55+R()*.1,(R()-.5)*.1);s.rotation.set((R()-.5)*.9,0,(R()-.5)*.9)}return{g,w:.45,d:.45}}}},
flame(g,x,y,z){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:this._cg||(this._cg=this.glow('rgba(255,160,70,')),blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true,opacity:.6}));s.scale.set(.42,.42,1);s.position.set(x,y,z);s.userData.flame=true;g.add(s)},
portrait(k){return this.cv(128,160,(x,w,h)=>{x.fillStyle=['#3a3224','#2a2e2a','#3a2a2a','#2e2a36'][k%4];x.fillRect(0,0,w,h);const g=x.createRadialGradient(64,70,10,64,80,90);g.addColorStop(0,'rgba(120,100,70,.5)');g.addColorStop(1,'rgba(0,0,0,.7)');x.fillStyle=g;x.fillRect(0,0,w,h);
 if(k%4!==3){x.fillStyle='#14100c';x.beginPath();x.ellipse(64,64,24,32,0,0,6.3);x.fill();x.fillRect(30,100,68,60);x.fillStyle='rgba(120,100,70,.18)';x.beginPath();x.ellipse(64,64,20,28,0,0,6.3);x.fill();
  x.fillStyle='#050403';[54,74].forEach(X=>{x.beginPath();x.ellipse(X,60,4,6,0,0,6.3);x.fill()})}
 else{x.strokeStyle='rgba(0,0,0,.75)';x.lineWidth=5;for(let i=0;i<7;i++){x.beginPath();x.moveTo(Math.random()*w,0);x.lineTo(Math.random()*w,h);x.stroke()}}
 for(let i=0;i<220;i++){const v=Math.random()*80|0;x.fillStyle=`rgba(${v},${v},${v},.14)`;x.fillRect(Math.random()*w,Math.random()*h,2,2)}})},
web(){return this._web||(this._web=this.cv(128,128,(x)=>{x.strokeStyle='rgba(210,210,200,.5)';x.lineWidth=1;for(let i=0;i<=6;i++){const a=i/6*Math.PI/2;x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(a)*128,Math.sin(a)*128);x.stroke()}
 for(let r=18;r<128;r+=16){x.beginPath();for(let i=0;i<=6;i++){const a=i/6*Math.PI/2,rr=r*(.85+Math.random()*.3);x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr)}x.stroke()}}))},
smear(){return this._sm||(this._sm=this.cv(64,128,(x,w,h)=>{x.fillStyle='rgba(90,6,4,.8)';for(let i=0;i<5;i++){const px=8+Math.random()*48,l=30+Math.random()*90;x.fillRect(px,6,2+Math.random()*4,l);x.beginPath();x.arc(px+1,6+l,3+Math.random()*3,0,6.3);x.fill()}
 const gr=x.createRadialGradient(32,14,0,32,14,28);gr.addColorStop(0,'rgba(90,6,4,.85)');gr.addColorStop(1,'rgba(90,6,4,0)');x.fillStyle=gr;x.fillRect(0,0,w,40)}))},
hall(scene,K,rm){const S=Level.S,H=Level.H,g=Level.g,rs=Level.roomOf,R=Math.random,D4=[[1,0],[-1,0],[0,1],[0,-1]],M=THREE.MeshStandardMaterial,occ=this._occ,
 HK=Level.theme.hk||['lantern','sidetable','clock','dresser','plant','armchair','bookcase','sidetable','dresser','table','trunk','candles','wardrobe','bucket','stool','table'],
 bad=(x,z)=>Level.resv.has(x+','+z)||Level.lockers.some(l=>l.gx===x&&l.gz===z)||D4.some(([a,b])=>g[z+b][x+a]===2)||Level.items.some(it=>Math.hypot(it.x-x*S,it.z-z*S)<2.4),
 cells=[];for(let z=1;z<Level.D-1;z++)for(let x=1;x<Level.W-1;x++)if(g[z][x]===0){const sd=D4.filter(([a,b])=>g[z+b][x+a]===1);if(sd.length)cells.push([x,z,sd])}
 const face=s=>Math.atan2(-s[0],-s[1]),tg=s=>[-s[1],s[0]];
 /* furniture along hall walls */
 for(const[x,z,sd]of cells){if(rs[z][x]>=0||R()>.62||bad(x,z))continue;const s=sd[R()*sd.length|0],o=K[HK[R()*HK.length|0]](),w=o.w,d=o.d,sh=(R()-.5)*Math.max(0,1.6-w),t=tg(s),px=x*S+s[0]*(S/2-d/2-.03)+t[0]*sh,pz=z*S+s[1]*(S/2-d/2-.03)+t[1]*sh;
  o.g.position.set(px,0,pz);o.g.rotation.y=face(s);scene.add(o.g);occ.add(x+','+z+','+s);const hx=s[0]?d/2:w/2,hz=s[0]?w/2:d/2;Level.col.push({x0:px-hx,x1:px+hx,z0:pz-hz,z1:pz+hz})}
 /* long runner rugs down the halls */
 const rg=new THREE.PlaneGeometry(3,1.1);for(const[x,z,sd]of cells){if(rs[z][x]>=0||R()>.4)continue;const hx=g[z][x-1]!==1&&g[z][x+1]!==1&&g[z-1][x]===1&&g[z+1][x]===1,hz=g[z-1][x]!==1&&g[z+1][x]!==1&&g[z][x-1]===1&&g[z][x+1]===1;if(!hx&&!hz)continue;
  const m=new THREE.Mesh(rg,rm);m.rotation.set(-Math.PI/2,0,hx?0:Math.PI/2);m.position.set(x*S,.011,z*S);scene.add(m)}
 /* portraits */
 const pm=[0,1,2,3].map(k=>new M({map:this.portrait(k),roughness:1})),fm=new M({color:0x1c120a,roughness:.7}),pg=new THREE.PlaneGeometry(.52,.68),fg=new THREE.BoxGeometry(.66,.84,.05);let np=0;
 for(const[x,z,sd]of cells){for(const s of sd){if(np>170||R()>.27||occ.has(x+','+z+','+s))continue;np++;occ.add(x+','+z+','+s);const t=tg(s),sh=(R()-.5)*1.4,G=new THREE.Group();
  G.position.set(x*S+s[0]*(S/2-.03)+t[0]*sh,1.6,z*S+s[1]*(S/2-.03)+t[1]*sh);G.rotation.y=face(s);const f=new THREE.Mesh(fg,fm),p=new THREE.Mesh(pg,pm[R()*4|0]);p.position.z=.03;G.add(f,p);G.rotation.z=(R()-.5)*.06;scene.add(G)}}
 /* boarded-up windows */
 const wm=new THREE.MeshBasicMaterial({color:0x05080f}),pl=new M({map:this.wood(),color:0x8a7050,roughness:.9});let nw=0;
 for(const[x,z,sd]of cells){if(rs[z][x]>=0||nw>40||R()>.12)continue;const s=sd[R()*sd.length|0];if(occ.has(x+','+z+','+s))continue;occ.add(x+','+z+','+s);nw++;const G=new THREE.Group();G.position.set(x*S+s[0]*(S/2-.02),1.75,z*S+s[1]*(S/2-.02));G.rotation.y=face(s);scene.add(G);
  const b=(w,h,d,xx,yy,zz,m,rz)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(xx,yy,zz);o.rotation.z=rz||0;G.add(o)};
  b(.9,1.2,.02,0,0,.01,wm);b(1.0,.07,.08,0,.62,.03,fm);b(1.0,.07,.08,0,-.62,.03,fm);[-.5,.5].forEach(xx=>b(.07,1.3,.08,xx,0,.03,fm));b(1.15,.16,.03,0,.3,.07,pl,.08);b(1.15,.16,.03,0,-.05,.07,pl,-.06);b(1.15,.16,.03,0,-.4,.07,pl,.04)}
 /* cobwebs in the corners */
 const wb=new THREE.MeshBasicMaterial({map:this.web(),transparent:true,depthWrite:false,side:THREE.DoubleSide,opacity:.8}),wgm=new THREE.PlaneGeometry(1.1,1.1);let nc=0;
 for(const[x,z,sd]of cells){if(sd.length<2||nc>130||R()>.8)continue;const s1=sd[0],s2=sd.find(q=>q[0]*s1[0]+q[1]*s1[1]===0);if(!s2)continue;nc++;const t1=tg(s1),m=new THREE.Mesh(wgm,wb);
  m.position.set(x*S+s1[0]*(S/2-.015)+s2[0]*(S/2-.55),H-.55,z*S+s1[1]*(S/2-.015)+s2[1]*(S/2-.55));m.rotation.y=face(s1);if(t1[0]*s2[0]+t1[1]*s2[1]>0)m.scale.x=-1;scene.add(m)}
 /* heavy ceiling beams over the halls, like a farmhouse */
 {const bm=new M({map:this.wood(),color:0x4a3c30,roughness:.9}),A=[],B=[];for(const[x,z]of cells){if(rs[z][x]>=0||R()>.5)continue;const hx=g[z][x-1]!==1&&g[z][x+1]!==1&&g[z-1][x]===1&&g[z+1][x]===1,hz=g[z-1][x]!==1&&g[z+1][x]!==1&&g[z][x-1]===1&&g[z][x+1]===1;if(hx)A.push([x*S,z*S]);else if(hz)B.push([x*S,z*S])}
  [[A,new THREE.BoxGeometry(.3,.24,S-.1)],[B,new THREE.BoxGeometry(S-.1,.24,.3)]].forEach(([arr,geo])=>{if(!arr.length)return;const im=new THREE.InstancedMesh(geo,bm,arr.length),m4=new THREE.Matrix4();arr.forEach((q,i)=>{m4.setPosition(q[0],H-.12,q[1]);im.setMatrixAt(i,m4)});scene.add(im)})}
 /* broken boards and loose paper on the floor */
 {const fw=Level.walk,bm=new M({map:this.wood(),color:0x5a4634,roughness:.95}),pm2=new M({color:0x6f6a58,roughness:1,side:THREE.DoubleSide}),nb=110,np2=70,I1=new THREE.InstancedMesh(new THREE.BoxGeometry(1.1,.035,.13),bm,nb),I2=new THREE.InstancedMesh(new THREE.PlaneGeometry(.24,.31),pm2,np2),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),sc=new THREE.Vector3(1,1,1);
  const put=(im,i,ex,ey,ez,yy)=>{let c=fw[R()*fw.length|0],tr=0;while(Level.resv.has(c.join())&&tr++<8)c=fw[R()*fw.length|0];v.set(c[0]*S+(R()-.5)*2.6,yy,c[1]*S+(R()-.5)*2.6);e.set(ex,ey,ez);q.setFromEuler(e);m4.compose(v,q,sc);im.setMatrixAt(i,m4)};
  for(let i=0;i<nb;i++)put(I1,i,0,R()*6.28,R()<.2?.25:0,.03);for(let i=0;i<np2;i++)put(I2,i,-Math.PI/2,0,R()*6.28,.012);scene.add(I1,I2)}
 /* blood smears on the walls */
 const sm=new M({map:this.smear(),transparent:true,depthWrite:false,roughness:.6}),sg=new THREE.PlaneGeometry(.5,1);let ns=0;
 for(const[x,z,sd]of cells){if(ns>45||R()>.09)continue;const s=sd[R()*sd.length|0],t=tg(s),sh=(R()-.5)*1.6,m=new THREE.Mesh(sg,sm);ns++;m.position.set(x*S+s[0]*(S/2-.012)+t[0]*sh,1.25,z*S+s[1]*(S/2-.012)+t[1]*sh);m.rotation.y=face(s);scene.add(m)}}
});

Props.cv=unseeded(Props.cv);

Object.assign(Props,{bxm(g,w,h,d,x,y,z,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);return o}});

{const _di=Props.dropItem;Props.dropItem=function(t,x,z,nid,fl){if(fl!==undefined&&fl!==Level.fi){const o=Level.fi;Level.use(fl);try{return _di.call(this,t,x,z,nid)}finally{Level.use(o)}}return _di.call(this,t,x,z,nid)}}

Object.assign(Props,{trapsB(scene){if(!Level.traps.length)return;const M=THREE.MeshStandardMaterial,rust=new M({color:0x6a3a22,metalness:.7,roughness:.55}),dk=new M({color:0x2a2420,metalness:.6,roughness:.6}),bx=this.bxm;
 for(const t of Level.traps){const g=new THREE.Group();g.position.set(t.x,.02,t.z);g.rotation.y=Math.random()*6.28;scene.add(g);bx(g,.5,.03,.16,0,0,0,dk);
  const mk=s=>{const j=new THREE.Group();j.position.set(0,.02,s*.07);g.add(j);bx(j,.62,.025,.3,0,0,s*.15,rust);for(let k=-2;k<=2;k++)bx(j,.04,.09,.04,k*.12,.05,s*.29,dk);return j};t.jA=mk(1);t.jB=mk(-1)}}});

/* ======================================================================================================
   Merged-box batching, hospital materials, the steel stair annexes and the riser vents / duct run
   ====================================================================================================== */
Object.assign(Props,{
/* collects axis boxes per material and merges them into one mesh per material (a stairwell is hundreds of boxes) */
batch(){const L=new Map();
 return{box(m,w,h,d,x,y,z,rx=0,ry=0,rz=0){let a=L.get(m);if(!a)L.set(m,a=[]);a.push([w,h,d,x,y,z,rx,ry,rz])},
  done(parent){const mt=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),v=new THREE.Vector3(),sc=new THREE.Vector3(1,1,1),out=[];
   for(const[m,a]of L){const tl=m.userData.tile||1,pos=[],nor=[],uvs=[],idx=[];let off=0;
    for(const[w,h,d,x,y,z,rx,ry,rz]of a){const g=new THREE.BoxGeometry(w,h,d),uv=g.attributes.uv;
     for(let f=0;f<6;f++){const fw=f<2?d:w,fh=f<2?h:f<4?d:h;for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,uv.getX(i)*fw/tl,uv.getY(i)*fh/tl)}}
     e.set(rx,ry,rz);q.setFromEuler(e);mt.compose(v.set(x,y,z),q,sc);g.applyMatrix4(mt);
     const P=g.attributes.position.array,Nn=g.attributes.normal.array,U=g.attributes.uv.array,I=g.index.array;
     for(let i=0;i<P.length;i++){pos.push(P[i]);nor.push(Nn[i])}for(let i=0;i<U.length;i++)uvs.push(U[i]);for(let i=0;i<I.length;i++)idx.push(I[i]+off);off+=P.length/3;g.dispose()}
    const G=new THREE.BufferGeometry();G.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));G.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));G.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));G.setIndex(idx);
    const me=new THREE.Mesh(G,m);parent.add(me);out.push(me)}
   return out}}},
rep(t){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t},
/* painted hospital plaster: pale green-grey, water stains, peeling patches */
hPaint(){return this._hp||(this._hp=this.rep(this.cv(256,256,(x,w,h)=>{x.fillStyle='#9ba698';x.fillRect(0,0,w,h);
 for(let i=0;i<40;i++){const px=Math.random()*w,py=Math.random()*h,r=20+Math.random()*50,g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,Math.random()<.5?'rgba(20,28,20,.2)':'rgba(225,230,205,.09)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2)}
 for(let i=0;i<9;i++){const px=Math.random()*w,ww=6+Math.random()*22,hh=50+Math.random()*170,g=x.createLinearGradient(0,0,0,hh);g.addColorStop(0,'rgba(70,46,10,.5)');g.addColorStop(1,'rgba(70,46,10,0)');x.fillStyle=g;x.fillRect(px,0,ww,hh)}
 for(let i=0;i<8;i++){const px=Math.random()*w,py=Math.random()*h;x.fillStyle='rgba(56,58,50,.85)';x.beginPath();let a=0;for(let k=0;k<9;k++){const r=5+Math.random()*16;x.lineTo(px+Math.cos(a)*r,py+Math.sin(a)*r);a+=.7}x.closePath();x.fill();x.strokeStyle='rgba(205,210,190,.4)';x.lineWidth=1.4;x.stroke()}
 for(let i=0;i<6;i++){x.strokeStyle='rgba(20,20,16,.45)';x.lineWidth=1;x.beginPath();let X=Math.random()*w,Y=Math.random()*h;x.moveTo(X,Y);for(let k=0;k<7;k++){X+=(Math.random()-.5)*18;Y+=Math.random()*16;x.lineTo(X,Y)}x.stroke()}
 for(let i=0;i<9000;i++){const v=Math.random()*70|0;x.fillStyle=`rgba(${v},${v},${v},.13)`;x.fillRect(Math.random()*w,Math.random()*h,1,1)}})))},
/* glossy wall tile, 4x4 per texture, cracked and filthy */
hTile(){return this._ht||(this._ht=this.rep(this.cv(128,128,(x,w,h)=>{x.fillStyle='#26302c';x.fillRect(0,0,w,h);
 for(let r=0;r<4;r++)for(let c=0;c<4;c++){const v=(Math.random()-.5)*26,X=c*32+1,Y=r*32+1;x.fillStyle=`rgb(${(143+v)|0},${(170+v)|0},${(156+v)|0})`;x.fillRect(X,Y,30,30);const g=x.createLinearGradient(X,Y,X+30,Y+30);g.addColorStop(0,'rgba(255,255,255,.2)');g.addColorStop(.5,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(0,0,0,.18)');x.fillStyle=g;x.fillRect(X,Y,30,30);
  if(Math.random()<.12){x.strokeStyle='rgba(20,20,16,.7)';x.lineWidth=1;x.beginPath();x.moveTo(X+Math.random()*30,Y);x.lineTo(X+Math.random()*30,Y+30);x.stroke()}
  if(Math.random()<.06){x.fillStyle='rgba(30,34,30,.85)';x.fillRect(X+2,Y+2,26,26)}}
 const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(20,14,6,.4)');x.fillStyle=g;x.fillRect(0,0,w,h);
 for(let i=0;i<2500;i++){const v=Math.random()*60|0;x.fillStyle=`rgba(${v},${v},${v},.12)`;x.fillRect(Math.random()*w,Math.random()*h,1,1)}})))},
/* diamond-plate steel with rust */
hPlate(){return this._hl||(this._hl=this.rep(this.cv(128,128,(x,w,h)=>{x.fillStyle='#565d62';x.fillRect(0,0,w,h);
 for(let r=0;r<8;r++)for(let c=0;c<8;c++){const X=c*16+8,Y=r*16+8,flip=(r+c)%2?1:-1;x.save();x.translate(X,Y);x.rotate(flip*Math.PI/4);x.fillStyle='rgba(0,0,0,.45)';x.fillRect(-6,-1.2,12,3.4);x.fillStyle='#8a9297';x.fillRect(-6,-2,12,3);x.fillStyle='rgba(255,255,255,.18)';x.fillRect(-6,-2,12,1);x.restore()}
 for(let i=0;i<9;i++){const px=Math.random()*w,py=Math.random()*h,r=10+Math.random()*30,g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'rgba(120,58,20,.55)');g.addColorStop(1,'rgba(120,58,20,0)');x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2)}
 for(let i=0;i<30;i++){x.strokeStyle='rgba(20,20,20,.35)';x.beginPath();const X=Math.random()*w,Y=Math.random()*h;x.moveTo(X,Y);x.lineTo(X+(Math.random()-.5)*30,Y+(Math.random()-.5)*8);x.stroke()}
 for(let i=0;i<1500;i++){const v=Math.random()*60|0;x.fillStyle=`rgba(${v},${v},${v},.15)`;x.fillRect(Math.random()*w,Math.random()*h,1,1)}})))},
hHaz(){return this._hz||(this._hz=this.rep(this.cv(64,32,(x,w,h)=>{x.fillStyle='#b8941a';x.fillRect(0,0,w,h);x.fillStyle='#151513';for(let i=-2;i<8;i++){x.beginPath();x.moveTo(i*16,0);x.lineTo(i*16+8,0);x.lineTo(i*16-4,h);x.lineTo(i*16-12,h);x.fill()}
 for(let i=0;i<260;i++){x.fillStyle=`rgba(0,0,0,${Math.random()*.4})`;x.fillRect(Math.random()*w,Math.random()*h,2,1)}})))},
hm(){if(this._hm)return this._hm;const M=THREE.MeshStandardMaterial,mk=(o,t)=>{const m=new M(o);m.userData.tile=t||1;return m},nz=this.rep(this.noise());
 return this._hm={paint:mk({map:this.hPaint(),color:0xd0d8cc,roughness:.95},2.4),tile:mk({map:this.hTile(),color:0xc4dad0,roughness:.3,metalness:.05},1.2),plate:mk({map:this.hPlate(),color:0xbcc4c8,roughness:.5,metalness:.65},1),
  steel:mk({map:nz,color:0x4f605d,roughness:.55,metalness:.7},1),steelD:mk({color:0x262d2f,roughness:.6,metalness:.6},1),rail:mk({color:0x707a76,roughness:.4,metalness:.85},1),haz:mk({map:this.hHaz(),roughness:.7,metalness:.2},.5),
  dark:mk({color:0x0e1110,roughness:.9},1),rust:mk({map:nz,color:0x7a4a30,roughness:.8,metalness:.5},1),duct:mk({map:nz,color:0xa4aeaa,roughness:.45,metalness:.78},1)}},
fireTex(){return this._fd||(this._fd=this.cv(128,256,(x,w,h)=>{x.fillStyle='#46534d';x.fillRect(0,0,w,h);
 for(let i=0;i<260;i++){const v=Math.random()*50|0;x.fillStyle=`rgba(${v},${v+6},${v},.25)`;x.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,6+Math.random()*30)}
 x.fillStyle='rgba(0,0,0,.4)';x.fillRect(0,0,w,5);x.fillRect(0,h-5,w,5);x.fillRect(0,0,5,h);x.fillRect(w-5,0,5,h);
 x.fillStyle='#10171a';x.fillRect(36,34,56,84);x.strokeStyle='rgba(140,160,150,.55)';x.lineWidth=1;for(let i=0;i<=56;i+=8){x.beginPath();x.moveTo(36+i,34);x.lineTo(36+i,118);x.stroke()}for(let i=0;i<=84;i+=8){x.beginPath();x.moveTo(36,34+i);x.lineTo(92,34+i);x.stroke()}
 x.fillStyle='#2c3531';x.fillRect(32,30,64,5);x.fillRect(32,117,64,5);x.fillRect(32,30,5,92);x.fillRect(91,30,5,92);
 x.fillStyle='#8c948c';x.fillRect(14,138,100,7);x.fillStyle='rgba(0,0,0,.4)';x.fillRect(14,145,100,3);
 x.fillStyle='#d4d8cc';x.font='bold 15px Arial';x.textAlign='center';x.fillText('STAIR',64,176);x.font='bold 10px Arial';x.fillText('KEEP CLOSED',64,192);
 x.fillStyle='#37403c';x.fillRect(6,206,116,44);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(6,206,116,3);
 for(let i=0;i<7;i++){const px=Math.random()*w,hh=40+Math.random()*120,g=x.createLinearGradient(0,h-hh,0,h);g.addColorStop(0,'rgba(110,58,24,0)');g.addColorStop(1,'rgba(110,58,24,.55)');x.fillStyle=g;x.fillRect(px,h-hh,5+Math.random()*10,hh)}
 for(let i=0;i<1800;i++){const v=Math.random()*70|0;x.fillStyle=`rgba(${v},${v},${v},.12)`;x.fillRect(Math.random()*w,Math.random()*h,1,1)}}))},
/* painted stencil / sign, transparent background */
stencil(w,h,fn){const m=new THREE.MeshStandardMaterial({map:this.cv(w,h,(x,W,H)=>{x.clearRect(0,0,W,H);fn(x,W,H)}),transparent:true,roughness:.9,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2});return m},
exitSign(){return this._ex||(this._ex=new THREE.MeshBasicMaterial({fog:false,map:this.cv(128,48,(x,w,h)=>{x.fillStyle='#02150a';x.fillRect(0,0,w,h);x.strokeStyle='#14a04a';x.lineWidth=3;x.strokeRect(3,3,w-6,h-6);x.fillStyle='#38ff78';x.font='bold 26px Arial';x.textAlign='center';x.fillText('STAIRS',w/2,34)})}))}
});

/* ---------- the stairwell: a steel hospital stair annex on the OUTSIDE of the boundary wall ---------- */
Object.assign(Props,{
stairsB(scene){if(!Level.stairs.length)return;
 const L=Level,A=L.ANX,FH=L.FH,H=L.H,h=FH/2,N=A.N,tr=A.tr,ri=h/N,f0=A.f0,f1=A.f1,pe=A.pe,run=f1-f0,al=Math.atan2(h,run),Ls=Math.hypot(run,h),M=this.hm(),rnd=mulberry(777+L.fi*31),nm=L.theme.name;
 for(const un of L.stairs){
  const b=this.batch(),B=(m,...a)=>b.box(m,...a),up=un.up,dn=un.dn,g=new THREE.Group(),ox=un.out[0];
  g.position.set(un.O.x,0,un.O.z);g.rotation.y=ox>0?Math.PI/2:-Math.PI/2;scene.add(g);
  const wp=(p,t)=>({x:un.O.x+ox*p,z:un.O.z+un.tz*t}),rect=(p0,p1,t0,t1,tall)=>{const a=wp(p0,t0),c=wp(p1,t1);L.col.push({tall:!!tall,x0:Math.min(a.x,c.x),x1:Math.max(a.x,c.x),z0:Math.min(a.z,c.z),z1:Math.max(a.z,c.z)})};
  const mesh=(geo,mat,x,y,z,rx=0,ry=0,rz=0)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.rotation.set(rx,ry,rz);g.add(o);return o};
  /* floors: lobby + landing, and a base slab under the flights on the lowest floor */
  B(M.plate,3,.1,f0+1.5,0,-.05,(f0-1.5)/2);
  if(!dn)B(M.plate,3,.1,pe-f0,0,-.05,(f0+pe)/2);
  /* walls: paint above, glossy tile dado below, tile also lines the lobby */
  const wl=pe-1.5+.2,wc=(1.5+pe+.2)/2;
  B(M.paint,.2,FH,wl,-1.6,FH/2,wc);B(M.paint,.2,FH,wl,1.6,FH/2,wc);B(M.paint,3.4,FH,.2,0,FH/2,pe+.1);B(M.paint,3,FH-H,.2,0,H+(FH-H)/2,1.4);
  for(const s of[-1,1]){B(M.tile,.03,1.35,3,s*1.485,.675,0);B(M.dark,.035,.07,3,s*1.485,1.385,0);B(M.paint,.03,H-1.42,3,s*1.485,1.42+(H-1.42)/2,0);
   B(M.tile,.03,1.35,f0-1.5,s*1.485,.675,(1.5+f0)/2);B(M.dark,.035,.07,f0-1.5,s*1.485,1.385,(1.5+f0)/2)}
  B(M.paint,3,.04,3,0,H-.02,0);
  if(!dn)B(M.tile,3,1.35,.03,0,.675,pe-.015);
  /* flights: ascending on the t<0 side (A), descending toward the floor above on the t>0 side (B) */
  if(up){
   B(M.plate,3,.1,pe-f1,0,h-.05,(f1+pe)/2);for(const s of[-1,1])B(M.steel,.14,.28,pe-f1,s*1.35,h-.24,(f1+pe)/2);
   for(const s of[-1,1]){B(M.tile,.03,1.35,pe-f1,s*1.485,h+.675,(f1+pe)/2);B(M.dark,.035,.07,pe-f1,s*1.485,h+1.385,(f1+pe)/2)}
   B(M.tile,3,1.35,.03,0,h+.675,pe-.015);
   for(const[cx,sg]of[[-.85,1],[.85,-1]]){
    for(let k=0;k<N;k++){const top=sg>0?ri*(k+1):h+ri*(k+1),p0=sg>0?f0+k*tr:f1-k*tr-tr,pr=sg>0?p0+.0175:p0+tr-.0175,pn=sg>0?p0+.05:p0+tr-.05;
     B(M.plate,1.3,.045,tr,cx,top-.0225,p0+tr/2);B(M.steelD,1.3,ri,.035,cx,top-ri/2,pr);B(M.haz,1.3,.012,.07,cx,top+.006,pn)}
    const yb=sg>0?0:h,rx=sg>0?-al:al;
    for(const s of[-1,1])B(M.steel,.07,.3,Ls,cx+s*.615,yb+h/2-.16,(f0+f1)/2,rx);
    for(const t of[cx<0?-1.4:1.4,cx<0?-.28:.28]){for(const dy of[.95,.5])B(M.rail,.05,.05,Ls,t,yb+h/2+ri+dy,(f0+f1)/2,rx);
     for(let k=0;k<=N;k+=3){const top=sg>0?ri*(k+1):h+ri*(k+1),p=sg>0?f0+k*tr+.1:f1-k*tr-.1;B(M.rail,.045,.95,.045,t,top+.475-ri*.5,p)}}
    /* sloped tile dado on the outer wall */
    B(M.tile,.03,1.1,Ls,cx<0?-1.485:1.485,yb+h/2+ri+.25,(f0+f1)/2,rx)}}
  /* well between the flights and guards on any open void */
  B(M.rail,.4,.05,.05,0,.95,f0-.02);B(M.rail,.4,.05,.05,0,.5,f0-.02);for(const s of[-1,1])B(M.rail,.05,.95,.05,s*.2,.475,f0-.02);
  rect(f0-.05,f1,-.25,.25);
  const guard=(t0,t1,bars)=>{const cx=(t0+t1)/2,w=t1-t0;B(M.rail,w,.05,.05,cx,.95,f0-.02);B(M.rail,w,.05,.05,cx,.5,f0-.02);for(let t=t0;t<=t1+.01;t+=bars?.14:w/2)B(M.rail,.04,bars?.95:.95,.04,t,.475,f0-.02);B(M.haz,w,.012,.3,cx,.006,f0-.2)};
  if(!up){guard(-1.5,-.2,false);rect(f0-.05,f1,-1.5,-.2)}
  if(!dn){guard(.2,1.5,true);rect(f0-.05,f1,.2,1.5)}
  /* roof over the shaft on the top floor */
  if(!up)B(M.paint,3.4,.1,wl,0,FH+.05,wc);
  /* pipes and conduit along the right wall */
  for(const y of[FH-.45,FH-.7]){B(M.rust,.1,.1,wl,1.43,y,wc);}
  for(let p=2;p<pe;p+=1.6)B(M.steelD,.05,.34,.12,1.43,FH-.58,p);
  /* hazard strip on the lobby threshold */
  B(M.haz,3,.012,.25,0,.006,1.5);

  /* ----- non-merged details ----- */
  const sg=this.stencil(256,96,(x,w,hh)=>{x.fillStyle='#1c1f1b';x.font='bold 40px Arial Black,Arial';x.textAlign='left';x.fillText('STAIR '+(un.id?'B':'A'),10,44);x.font='bold 22px Arial';x.fillText(nm,10,80);x.beginPath();x.moveTo(214,24);x.lineTo(242,24);x.lineTo(228,6);x.fill();x.fillRect(223,24,10,22);x.fillRect(223,60,10,22);x.beginPath();x.moveTo(214,82);x.lineTo(242,82);x.lineTo(228,98);x.fill()});
  mesh(new THREE.PlaneGeometry(1.5,.56),sg,-1.495,2.25,2.3,0,Math.PI/2,0);
  const ps=this.stencil(128,64,(x,w,hh)=>{x.fillStyle='#3a1210';x.font='bold 30px Arial Black,Arial';x.textAlign='center';x.fillText('NO',64,28);x.fillText('ENTRY',64,58)});
  if(!up)mesh(new THREE.PlaneGeometry(.9,.45),ps,-.85,1.3,f0-.06,0,Math.PI,0);
  const exs=this.exitSign();
  mesh(new THREE.PlaneGeometry(.6,.22),exs,0,2.62,.2,0,0,0);mesh(new THREE.PlaneGeometry(.6,.22),exs,0,2.62,-.2,0,Math.PI,0);
  const gl=this.glow('rgba(60,255,120,');
  for(const zz of[.35,-.35]){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:gl,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true,opacity:.35}));sp.scale.set(1.3,.8,1);sp.position.set(0,2.62,zz);g.add(sp)}
  {const w=wp(0,0);L.src.push({x:w.x+ox*.5,y:2.4,z:w.z,col:new THREE.Color(0x38ff78),d:4,I:()=>.22});L.src.push({x:w.x-ox*.5,y:2.4,z:w.z,col:new THREE.Color(0x38ff78),d:4,I:()=>.22})}
  /* window on the far wall above the landing: wire glass, a little cold light */
  if(up){const wy=h+1.7,gm=new THREE.MeshBasicMaterial({fog:false,map:this.cv(128,128,(x,w,hh)=>{const gr=x.createLinearGradient(0,0,0,hh);gr.addColorStop(0,'#2a3c4a');gr.addColorStop(1,'#0e161c');x.fillStyle=gr;x.fillRect(0,0,w,hh);x.strokeStyle='rgba(150,170,160,.35)';x.lineWidth=1;for(let i=0;i<=w;i+=10){x.beginPath();x.moveTo(i,0);x.lineTo(i,hh);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(w,i);x.stroke()}
    x.strokeStyle='rgba(0,0,0,.8)';x.lineWidth=2;x.beginPath();x.moveTo(30,0);x.lineTo(60,50);x.lineTo(40,80);x.lineTo(70,128);x.stroke()})});
   mesh(new THREE.PlaneGeometry(1.2,1.5),gm,0,wy,pe-.02,0,Math.PI,0);
   B(M.steelD,1.4,.1,.1,0,wy+.8,pe-.04);B(M.steelD,1.4,.1,.1,0,wy-.8,pe-.04);B(M.steelD,.1,1.7,.1,-.65,wy,pe-.04);B(M.steelD,.1,1.7,.1,.65,wy,pe-.04);B(M.steelD,.06,1.5,.08,0,wy,pe-.04);B(M.steelD,1.2,.06,.08,0,wy,pe-.04);
   const w=wp(pe-.8,0);L.src.push({x:w.x,y:wy,z:w.z,col:new THREE.Color(0x7a9ab8),d:6,I:()=>.3})}
  /* lamps: wall bulkheads, some flickering, some dead */
  const warm=new THREE.Color(0xcfe8d8),lgeo=new THREE.BoxGeometry(.26,.12,.1),lamp=(p,t,y,vis)=>{const w=wp(p,t),r=rnd(),mode=r<.25?'d':r<.55?'f':'n';
   if(!vis){L.src.push({x:w.x,y,z:w.z,col:warm,d:7,I:()=>.7});return}
   const col=warm.clone(),mat=new THREE.MeshBasicMaterial({color:col.clone()}),o=mesh(lgeo,mat,t,y,p,0,t<0?Math.PI/2:-Math.PI/2,0);o.position.x=t<0?-1.45:1.45;
   const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:this.glow('rgba(190,240,215,'),blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true,opacity:.18}));sp.scale.set(1.6,1.6,1);sp.position.set(t<0?-1.2:1.2,y,p);g.add(sp);
   L.src.push({x:w.x,y,z:w.z,mode,col,mat,sp,d:8,i:.5,ph:rnd()*6,k:1,lk:-1,vis:true,I(){return mode==='d'?0:this.k*this.i}})};
  lamp(2.3,-1,3.1,true);lamp(2.3,1,3.1,true);
  if(up){lamp((f0+f1)/2,-1,h/2+2.5,true);lamp((f1+pe)/2,1,h+2.3,true)}
  if(dn){lamp((f0+f1)/2,1,-h/2+2.5,false);lamp((f1+pe)/2,-1,-h+2.3,false)}
  /* abandoned hospital clutter */
  const steel=M.rail,tire=M.dark;
  {/* wheelchair in the lobby corner */
   const wc2=new THREE.Group();wc2.position.set(-1.0,0,.9);wc2.rotation.y=.5;g.add(wc2);const wb=(m,w,hh,d,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),m);o.position.set(x,y,z);wc2.add(o)};
   wb(M.steelD,.5,.05,.45,0,.5,0);wb(M.steelD,.5,.5,.05,0,.78,-.22);[-.27,.27].forEach(x=>{wb(steel,.03,.03,.5,x,.7,0);const wh=new THREE.Mesh(new THREE.TorusGeometry(.3,.02,6,16),steel);wh.rotation.y=Math.PI/2;wh.position.set(x,.3,-.05);wc2.add(wh);const wf=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.03,10),tire);wf.rotation.z=Math.PI/2;wf.position.set(x,.07,.3);wc2.add(wf)});
   rect(.55,1.25,-1.35,-.65)}
  {/* IV stand + drip bag */
   const iv=new THREE.Group();iv.position.set(1.15,0,.7);g.add(iv);const ib=(m,w,hh,d,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),m);o.position.set(x,y,z);iv.add(o)};
   ib(steel,.03,1.8,.03,0,.9,0);ib(steel,.6,.03,.03,0,1.8,0);ib(steel,.04,.04,.4,0,.03,0);ib(steel,.4,.04,.04,0,.03,0);const bg=new THREE.Mesh(new THREE.BoxGeometry(.1,.2,.04),new THREE.MeshStandardMaterial({color:0xb8c4b0,transparent:true,opacity:.6,roughness:.2}));bg.position.set(.2,1.68,0);iv.add(bg);rect(.5,.9,1.0,1.3)}
  {/* overturned cart against the far wall of the mid landing */
   if(up){const gu=new THREE.Group();gu.position.set(.9,h+.2,8.42);gu.rotation.set(0,Math.PI/2+.1,.35);g.add(gu);const gb=(m,w,hh,d,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),m);o.position.set(x,y,z);gu.add(o)};
    gb(M.steelD,.5,.06,1.1,0,.4,0);gb(M.paint,.44,.1,1.0,0,.47,0);[-.2,.2].forEach(x=>[-.45,.45].forEach(z=>gb(steel,.03,.4,.03,x,.2,z)));rect(8.28,pe-.05,.3,1.45)}}
  {/* fire extinguisher cabinet */
   const fx=new THREE.Mesh(new THREE.BoxGeometry(.1,.5,.34),new THREE.MeshStandardMaterial({color:0x7a1612,roughness:.6,metalness:.3}));fx.position.set(1.44,1.5,2.4);g.add(fx);const cy=new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,.36,10),new THREE.MeshStandardMaterial({color:0xa02018,roughness:.4,metalness:.5}));cy.position.set(1.36,1.45,2.4);g.add(cy)}
  /* scattered paper and stains */
  const pap=new THREE.MeshStandardMaterial({color:0x9a9a88,roughness:1}),stm=new THREE.MeshBasicMaterial({map:this.cv(64,64,(x,w,hh)=>{const gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(40,6,4,.65)');gr.addColorStop(.6,'rgba(30,8,4,.3)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(0,0,64,64)}),transparent:true,depthWrite:false,fog:true});
  for(let i=0;i<9;i++){const p=.4+rnd()*(f0+.8),t=(rnd()-.5)*2.6,o=mesh(new THREE.PlaneGeometry(.22,.3),pap,t,.012,p,-Math.PI/2,0,rnd()*6.28)}
  for(let i=0;i<3;i++){const s=.5+rnd()*.9;mesh(new THREE.PlaneGeometry(s,s),stm,(rnd()-.5)*2,.014,.5+rnd()*2.4,-Math.PI/2,0,rnd()*6.28)}
  if(up)for(let i=0;i<4;i++)mesh(new THREE.PlaneGeometry(.22,.3),pap,(rnd()-.5)*2.6,h+.012,f1+.2+rnd()*1.2,-Math.PI/2,0,rnd()*6.28);
  b.done(g)}}
});

/* ---------- vents: a riser duct against the wall, a shaft through the ceiling, a duct run in the space above the rooms ---------- */
Object.assign(Props,{
ventsB(scene){if(!Level.vents.length||!Level.duct)return;
 const L=Level,D=L.duct,M=this.hm(),b=this.batch(),B=(m,...a)=>b.box(m,...a),du=M.duct,dk=M.steelD,TOP=3.3,CE=4.55,T=.06,W=1.3,warm=new THREE.Color(0xffa04a);
 const gt=this.cv(128,96,(x,w,h)=>{x.fillStyle='#74786f';x.fillRect(0,0,w,8);x.fillRect(0,h-8,w,8);x.fillRect(0,0,8,h);x.fillRect(w-8,0,8,h);for(let y=16;y<h-10;y+=12)x.fillRect(8,y,w-16,6);[[14,14],[w-14,14],[14,h-14],[w-14,h-14]].forEach(([a,c])=>{x.fillStyle='#2a2d2a';x.beginPath();x.arc(a,c,5,0,6.3);x.fill();x.fillStyle='#9a9f9a';x.fillRect(a-4,c-1,8,2)})}),
  gm=new THREE.MeshStandardMaterial({map:gt,transparent:true,alphaTest:.4,side:THREE.DoubleSide,roughness:.5,metalness:.7});
 /* risers */
 for(const v of L.vents){const g=new THREE.Group();g.position.set(v.wx,0,v.wz);g.rotation.y=Math.atan2(-v.s[0],-v.s[1]);scene.add(g);
  const rb=this.batch(),B=(m,...a)=>rb.box(m,...a);
  /* local +z points out into the room; the shaft occupies z -1.4..0 */
  B(du,1.4,.12,T,0,.06,-T/2);B(du,1.4,TOP-.87,T,0,.87+(TOP-.87)/2,-T/2);B(du,.4,.75,T,-.5,.495,-T/2);B(du,.4,.75,T,.5,.495,-T/2);
  B(du,T,TOP,1.4,-.67,TOP/2,-.7);B(du,T,TOP,1.4,.67,TOP/2,-.7);B(du,1.4,TOP,T,0,TOP/2,-1.37);
  for(const y of[.9,1.9,2.9]){B(dk,1.48,.09,.04,0,y,.01);B(dk,1.48,.09,.04,0,y,-1.41);B(dk,.04,.09,1.44,-.72,y,-.7);B(dk,.04,.09,1.44,.72,y,-.7)}
  /* frame round the grille opening */
  B(dk,1.1,.06,.05,0,.1,.02);B(dk,1.1,.06,.05,0,.89,.02);B(dk,.06,.84,.05,-.52,.5,.02);B(dk,.06,.84,.05,.52,.5,.02);
  /* ladder up the back of the shaft */
  for(let y=.35;y<TOP;y+=.3)B(M.rail,.8,.03,.03,0,y,-1.32);B(M.rail,.03,TOP,.03,-.4,TOP/2,-1.32);B(M.rail,.03,TOP,.03,.4,TOP/2,-1.32);
  /* the grille, hinged along its bottom edge */
  const hg=new THREE.Group();hg.position.set(0,.12,.02);g.add(hg);const gr=new THREE.Mesh(new THREE.PlaneGeometry(1,.75),gm);gr.position.set(0,.375,0);hg.add(gr);v.hg=hg;
  /* a dim caged bulb inside lights the shaft and leaks out through the slats */
  const bu=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),new THREE.MeshBasicMaterial({color:0xffb060}));bu.position.set(.5,1.3,-1.2);g.add(bu);
  L.src.push({x:v.cx,y:1.2,z:v.cz,col:warm,d:5,I:()=>.45});
  rb.done(g);
  L.col.push({riser:true,tall:true,x0:v.cx-.72,x1:v.cx+.72,z0:v.cz-.72,z1:v.cz+.72})}
 /* the duct run above the ceilings. Nodes are the corners of the polyline at plenum height; horizontal pieces join them. */
 const P=D.P,nodes=[];for(let i=0;i<P.length;i++)if(Math.abs(P[i].y-D.YP)<.01)nodes.push(P[i]);
 const dirOf=(a,c)=>[Math.sign(c.x-a.x),Math.sign(c.z-a.z)],cy=TOP+(CE-TOP)/2,pH=CE-TOP+2*T;
 for(let i=0;i<nodes.length;i++){const n=nodes[i],open=[];if(i>0)open.push(dirOf(n,nodes[i-1]));if(i<nodes.length-1)open.push(dirOf(n,nodes[i+1]));
  const riser=(i===0||i===nodes.length-1);
  B(du,W+2*T,T,W+2*T,n.x,CE+T/2,n.z);if(!riser)B(du,W+2*T,T,W+2*T,n.x,TOP-T/2,n.z);
  for(const[dx,dz]of[[1,0],[-1,0],[0,1],[0,-1]])if(!open.some(o=>o[0]===dx&&o[1]===dz)){if(dx)B(du,T,pH,W+2*T,n.x+dx*(W/2+T/2),cy,n.z);else B(du,W+2*T,pH,T,n.x,cy,n.z+dz*(W/2+T/2))}
  /* the node squares above a riser need their own floor ring where the shaft is not */
 }
 let lampT=0;
 for(let i=0;i<nodes.length-1;i++){const a=nodes[i],c=nodes[i+1],d=dirOf(a,c),len=Math.hypot(c.x-a.x,c.z-a.z)-W,mx=(a.x+c.x)/2,mz=(a.z+c.z)/2;if(len<=.01)continue;
  if(d[0]){B(du,len,T,W+2*T,mx,TOP-T/2,mz);B(du,len,T,W+2*T,mx,CE+T/2,mz);B(du,len,pH,T,mx,cy,mz-W/2-T/2);B(du,len,pH,T,mx,cy,mz+W/2+T/2);for(let k=-len/2+.5;k<len/2;k+=2)B(dk,.08,pH+.06,W+.16,mx+k,cy,mz)}
  else{B(du,W+2*T,T,len,mx,TOP-T/2,mz);B(du,W+2*T,T,len,mx,CE+T/2,mz);B(du,T,pH,len,mx-W/2-T/2,cy,mz);B(du,T,pH,len,mx+W/2+T/2,cy,mz);for(let k=-len/2+.5;k<len/2;k+=2)B(dk,W+.16,pH+.06,.08,mx,cy,mz+k)}
  /* caged service lamps along the run */
  const nl=Math.max(1,Math.round(len/4));for(let k=0;k<nl;k++){const t=(k+.5)/nl-.5,lx=mx+(d[0]?t*len:0),lz=mz+(d[1]?t*len:0);
   const bu=new THREE.Mesh(new THREE.BoxGeometry(.16,.06,.16),new THREE.MeshBasicMaterial({color:0xffb060}));bu.position.set(lx,CE-.05,lz);scene.add(bu);
   const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:this.glow('rgba(255,170,80,'),blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true,opacity:.3}));sp.scale.set(1.1,1.1,1);sp.position.set(lx,CE-.2,lz);scene.add(sp);
   L.src.push({x:lx,y:3.95,z:lz,col:warm,d:6,I:()=>.55});lampT++}}
 b.done(scene)}
});
