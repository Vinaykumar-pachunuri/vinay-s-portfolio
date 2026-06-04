/* Vinay Kumar Pachunuri — Portfolio Scripts */

/* ── PARTICLES ── */
const pc = document.getElementById('particles');
for(let i=0;i<35;i++){
  const s=document.createElement('span');
  const left=Math.random()*100;
  const delay=Math.random()*8;
  const dur=6+Math.random()*8;
  const dx=(Math.random()-0.5)*80;
  s.style.cssText=`left:${left}%;bottom:0;--d:${dur}s;--delay:${delay}s;--dx:${dx}px;`;
  pc.appendChild(s);
}

/* ── CURSOR ── */
/* ── MAGNETIC TRAIL CURSOR ── */
const dot   = document.getElementById('cur-dot');
const ring  = document.getElementById('cur-ring');
const tc    = document.getElementById('trail-canvas');
const ctx2  = tc.getContext('2d');
let mx=0, my=0, rx=0, ry=0;
const trail = [];
const TRAIL_LEN = 22;
const TRAIL_COLS = ['#00d4ff','#00e8cc','#00ffcc','#3af5d0','#60eaff'];

/* resize canvas to full window */
function resizeCanvas(){tc.width=window.innerWidth;tc.height=window.innerHeight;}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
  trail.unshift({x: mx, y: my});
  if(trail.length > TRAIL_LEN) trail.pop();
});

/* ring lags behind mouse */
(function animR(){
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';

  /* draw trail on canvas */
  ctx2.clearRect(0, 0, tc.width, tc.height);
  for(let i = 1; i < trail.length; i++){
    const p  = trail[i];
    const pp = trail[i-1];
    const t  = 1 - i / trail.length;       /* 1 at head, 0 at tail  */
    const r  = Math.max(0.5, 5 * t);       /* radius shrinks        */
    const a  = t * 0.75;                   /* alpha fades           */
    const col= TRAIL_COLS[i % TRAIL_COLS.length];

    /* connecting line segment */
    ctx2.beginPath();
    ctx2.moveTo(pp.x, pp.y);
    ctx2.lineTo(p.x,  p.y);
    ctx2.strokeStyle = col;
    ctx2.globalAlpha = a * 0.45;
    ctx2.lineWidth   = r * 1.2;
    ctx2.lineCap     = 'round';
    ctx2.stroke();

    /* glow dot at each point */
    ctx2.globalAlpha = a * 0.65;
    ctx2.fillStyle   = col;
    ctx2.shadowColor = col;
    ctx2.shadowBlur  = 8;
    ctx2.beginPath();
    ctx2.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx2.fill();
    ctx2.shadowBlur  = 0;
  }
  ctx2.globalAlpha = 1;

  requestAnimationFrame(animR);
})();

/* hover / click states */
document.querySelectorAll('a,button,.srv-card,.proj-card,.cert-card,.edu-card,.exp-card,.nav-menu a').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hov'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hov'));
});
document.addEventListener('mousedown', () => document.body.classList.add('clk'));
document.addEventListener('mouseup',   () => document.body.classList.remove('clk'));

/* ── SPARKS ON CLICK ── */
const cols=['#00d4ff','#00ffcc','#ff2d9b','#ffffff','#7b61ff'];
document.addEventListener('click',e=>{
  for(let i=0;i<12;i++){
    const p=document.createElement('div');
    p.className='spark';
    const angle=Math.random()*360,dist=35+Math.random()*55;
    p.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;background:${cols[Math.floor(Math.random()*cols.length)]};--dx:${Math.cos(angle*Math.PI/180)*dist}px;--dy:${Math.sin(angle*Math.PI/180)*dist}px;box-shadow:0 0 5px currentColor;`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),700);
  }
});

/* ── SCROLL PROGRESS ── */
const prog=document.getElementById('scroll-prog');
window.addEventListener('scroll',()=>{
  prog.style.width=(window.scrollY/(document.body.scrollHeight-innerHeight)*100)+'%';
  document.getElementById('to-top').classList.toggle('show',window.scrollY>400);
});

/* ── REVEAL ── */
const ro=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.08});
document.querySelectorAll('.reveal').forEach((el,i)=>{
  el.style.transitionDelay=(i%5)*.09+'s';
  ro.observe(el);
});

/* ── SKILL BARS ── */
const sbo=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){
    e.target.querySelectorAll('.skill-bar-fill').forEach(b=>{
      b.style.width=b.dataset.pct+'%';
    });
    sbo.unobserve(e.target);
  }
}),{threshold:.3});
document.querySelectorAll('.skills-col').forEach(c=>sbo.observe(c));

/* ── CIRCULAR SKILLS ── */
const ciro=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){
    e.target.querySelectorAll('.circ-fill').forEach(c=>{
      const r=47, circ=2*Math.PI*r;
      const pct=parseInt(c.dataset.pct)/100;
      c.style.strokeDashoffset=circ*(1-pct);
    });
    ciro.unobserve(e.target);
  }
}),{threshold:.3});
document.querySelectorAll('.circ-grid').forEach(g=>ciro.observe(g));

/* ── TYPED TEXT ── */
const typed=document.getElementById('typed');
const words=['Aspiring Data Analyst | SQL | Power BI | Python'];
let wi=0,ci=0,del=false;
function typeIt(){
  const w=words[0];
  if(ci<w.length){typed.textContent=w.slice(0,++ci);setTimeout(typeIt,75);}
}
setTimeout(typeIt,800);

/* ── ACTIVE NAV ── */
const secs=document.querySelectorAll('section[id]');
const nls=document.querySelectorAll('.nav-menu a');
const no=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){
    nls.forEach(a=>a.classList.remove('active'));
    const a=document.querySelector(`.nav-menu a[href="#${e.target.id}"]`);
    if(a)a.classList.add('active');
  }
}),{threshold:.4});
secs.forEach(s=>no.observe(s));

/* ── CARD TILT ── */
document.querySelectorAll('.srv-card,.proj-card,.cert-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(700px) rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transition='transform .5s cubic-bezier(.22,1,.36,1)';
    card.style.transform='';
    setTimeout(()=>card.style.transition='',500);
  });
});

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-cyan,.btn-ghost,.form-submit').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.22;
    const y=(e.clientY-r.top-r.height/2)*.22;
    btn.style.transform=`translate(${x}px,${y}px)`;
  });
  btn.addEventListener('mouseleave',()=>{
    btn.style.transition='transform .4s cubic-bezier(.22,1,.36,1)';
    btn.style.transform='';
    setTimeout(()=>btn.style.transition='',400);
  });
});

/* ── PROFILE FLOAT ── */
const picWrap=document.querySelector('.pic-glow-wrap');
if(picWrap){
  let t=0;
  (function fl(){
    t+=.018;
    picWrap.style.transform=`translateY(${Math.sin(t)*12}px)`;
    requestAnimationFrame(fl);
  })();
}

/* ── STAT COUNTERS ── */
const ctrObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.querySelectorAll('.stat-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        let cur = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = cur;
          if(cur >= target) clearInterval(timer);
        }, 40);
      });
      ctrObs.unobserve(e.target);
    }
  });
}, {threshold: 0.5});
document.querySelectorAll('.stat-card').forEach(c => {
  const numEl = c.querySelector('.stat-num');
  if(numEl) numEl.textContent = '0';
  ctrObs.observe(c.closest('section') || c.parentElement);
});

/* ── FORM HANDLER ── */
async function handleFormSubmit(e){
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');
  btn.textContent = 'Sending...';
  btn.style.opacity = '0.7';
  try {
    const res = await fetch(e.target.action, {
      method:'POST',
      body: new FormData(e.target),
      headers:{'Accept':'application/json'}
    });
    if(res.ok){
      status.textContent = '✅ Message sent! I will get back to you soon.';
      status.style.color = 'var(--cyan2)';
      e.target.reset();
    } else {
      status.textContent = '❌ Oops! Something went wrong. Email me directly: pachunurivinaykumar@gmail.com';
      status.style.color = 'var(--pink)';
    }
  } catch(err){
    status.textContent = '❌ Could not send. Email me: pachunurivinaykumar@gmail.com';
    status.style.color = 'var(--pink)';
  }
  status.style.display = 'block';
  btn.textContent = 'Send Message ✉';
  btn.style.opacity = '1';
}