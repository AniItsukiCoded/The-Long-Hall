/* THE LONG HALLS: loading screen. Real steps (page, fonts, world build, first frames) plus a short minimum
   so it never flashes. After a death reload (a run is saved) it is nearly instant. */
(function(){
 const el=document.getElementById('loading'),bar=document.getElementById('ldfill'),tx=document.getElementById('ldtxt'),tip=document.getElementById('ldtip');
 if(!el)return;
 let quick=false;try{quick=!!sessionStorage.getItem('lhrun')}catch(e){}
 const TIPS=['Shut doors behind you.','Lockers are your only shelter.','Throw a bottle and he will go and look.','Crouch to stay quiet.','Spare batteries are used with R.','Sprinting is loud.'];
 if(tip)tip.textContent=quick?'':TIPS[Math.random()*TIPS.length|0];
 const MIN=quick?500:2000,t0=performance.now();let target=.06,shown=0,failed=false,fin=false;
 const set=(p,t)=>{if(p>target)target=p;if(t&&!failed)tx.textContent=t};
 function fail(msg){failed=true;tx.textContent=msg;tx.classList.add('err');bar.style.background='#7a1b1b'}
 function finish(){if(fin)return;fin=true;el.classList.add('out');setTimeout(()=>{el.classList.add('hidden');document.dispatchEvent(new Event('lhloaded'))},600)}
 function tick(){if(failed)return;const lim=Math.min(target,(performance.now()-t0)/MIN);shown+=(lim-shown)*.2;
  if(lim>=1&&shown>.995){bar.style.width='100%';finish();return}bar.style.width=(shown*100).toFixed(1)+'%';requestAnimationFrame(tick)}
 requestAnimationFrame(tick);
 window.LHBoot={run(fn){
  if(typeof THREE==='undefined'){return fail('Could not load the 3D engine. Check your connection or network filter, then refresh.')}
  const go=()=>{set(.4,'Loading fonts');
   const fonts=document.fonts&&document.fonts.ready?Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,2500))]):Promise.resolve();
   fonts.then(()=>{set(.6,'Building the halls');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
     try{fn()}catch(e){console.error(e);return fail('Something went wrong while loading. Refresh the page.')}
     set(.9,'Waking up');requestAnimationFrame(()=>requestAnimationFrame(()=>set(1,'')))}))})};
  if(document.readyState==='complete')go();else addEventListener('load',go)}};
 /* safety net: if nothing ever calls run (a script failed to load) */
 setTimeout(()=>{if(!fin&&!failed&&target<.5)fail('Some files failed to load. Refresh the page.')},15000);
})();
