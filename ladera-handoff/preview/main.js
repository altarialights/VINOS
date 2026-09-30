(() => {
 'use strict';
 const cfg=JSON.parse(document.getElementById('motion-data').textContent);
 const track=document.querySelector('.track'),stage=document.querySelector('.stage');
 const chapters=[...document.querySelectorAll('.chapter')];
 const layers=Object.fromEntries(['bottle','grapes','glass','leaves'].map(k=>[k,document.querySelector('[data-layer='+k+']')]));
 const bg=document.querySelector('.backdrop'),dots=[...document.querySelectorAll('.chapter-dots a')];
 const media=matchMedia('(min-width:768px) and (min-height:650px) and (prefers-reduced-motion:no-preference)');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let enabled=false,raf=0,active=-1;
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const mix=(a,b,t)=>a+(b-a)*t;
 function setMode(){
  enabled=media.matches;document.documentElement.classList.toggle('enhanced',enabled);active=-1;
  if(!enabled){chapters.forEach(c=>{c.style.opacity='';c.style.pointerEvents='';c.inert=false;c.removeAttribute('aria-hidden');c.style.transform=''});}
  request();
 }
 function render(){
  raf=0;if(!enabled||document.hidden)return;
  const rect=track.getBoundingClientRect(),height=stage.clientHeight;
  const position=clamp(-rect.top/(track.offsetHeight-height))*4;
  const lo=Math.min(3,Math.floor(position)),hi=lo+1;
  const raw=position>=4?1:clamp((position-lo-(1-cfg.transitionFraction))/cfg.transitionFraction);
  const t=raw*raw*(3-2*raw);const a=cfg.desktop[lo],b=cfg.desktop[hi];
  const current=t<.5?lo:hi;
  for(const k of Object.keys(layers)){
   const v=a[k],w=b[k],el=layers[k];
   el.style.left=mix(v.xPct,w.xPct,t)+'%';el.style.top=mix(v.yPct,w.yPct,t)+'%';
   el.style.height=mix(v.heightPct,w.heightPct,t)+'%';
   el.style.transform=`translate(-50%,-50%) rotate(${mix(v.rotationDeg,w.rotationDeg,t)}deg)`;
   el.style.opacity=mix(v.opacity,w.opacity,t);
  }
  bg.style.transform=`translate(${mix(a.background.xPct,b.background.xPct,t)}%,${mix(a.background.yPct,b.background.yPct,t)}%) scale(${mix(a.background.scale,b.background.scale,t)})`;
  chapters.forEach((c,i)=>{
   // Fade old text out before new text appears; no simultaneous overprint.
   let op=0;if(i===lo)op=clamp(1-t*2.4);if(i===hi)op=clamp((t-.58)/.42);
   if(position>=4)op=i===4?1:0;
   c.style.opacity=op;c.style.pointerEvents=op>.85?'auto':'none';
   c.inert=op<=.85;c.setAttribute('aria-hidden',op<=.85?'true':'false');
  });
  if(active!==current){active=current;dots.forEach((d,i)=>d.setAttribute('aria-current',i===current?'true':'false'));}
 }
 function request(){if(!raf&&!document.hidden)raf=requestAnimationFrame(render);}
 addEventListener('scroll',request,{passive:true});addEventListener('resize',setMode,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else request()});
 media.addEventListener('change',setMode);setMode();
 const menu=document.getElementById('menu-dialog');
 document.querySelector('.menu-toggle').addEventListener('click',()=>menu.showModal());
 document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const id=a.getAttribute('href').slice(1);const target=document.getElementById(id);if(!target)return;
  if(menu.open)menu.close();
  const i=chapters.findIndex(c=>c.id===id);
  if(enabled&&i>=0){e.preventDefault();const top=track.getBoundingClientRect().top+scrollY+(track.offsetHeight-stage.clientHeight)*i/4;scrollTo({top,behavior:reduced.matches?'auto':'smooth'});history.replaceState(null,'','#'+id);}
 }));
 const formats=[...document.querySelectorAll('[data-format]')];
 formats.forEach(b=>b.addEventListener('click',()=>formats.forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'))));
 const demo=document.getElementById('demo-dialog'),msg=document.getElementById('demo-message');
 function show(s){msg.textContent=s;demo.showModal()}
 document.querySelector('[data-shop]').addEventListener('click',()=>{
  const input=document.getElementById('quantity');if(!input.reportValidity())return;
  const f=formats.find(x=>x.getAttribute('aria-pressed')==='true').textContent;
  show(`Selección: ${input.value} × ${f}. Demostración: no hay precio, stock o tienda conectados. No se ha creado ningún pedido.`);
 });
 document.querySelector('[data-retailers]').addEventListener('click',()=>show('Todavía no hay puntos de venta verificados en esta demostración.'));
 const date=document.getElementById('date');const now=new Date();date.min=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 document.querySelector('#tasting-form').addEventListener('submit',e=>{e.preventDefault();if(!e.target.reportValidity())return;show(`Consulta de demostración para ${date.value}, ${document.getElementById('persons').value} personas. No se ha enviado ni realizado una reserva.`)});
 document.querySelector('[data-info]').addEventListener('click',()=>show('Prototipo de dirección de arte con recursos fijos. Marca, vino y escenas de demostración. No es una tienda publicada ni una prueba de rendimiento en iOS o Android.'));
})();
