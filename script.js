/* ===== PARTICLES CANVAS ===== */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.size = Math.random() * 1.5 + 0.2;
    this.vx = (Math.random() - 0.5) * 0.15;
    this.vy = (Math.random() - 0.5) * 0.15;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6 ? '212,168,67' : '245,237,224';
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

// Mouse interaction
let mx = W/2, my = H/2;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    const dx = particles[i].x - mx, dy = particles[i].y - my;
    const d = Math.sqrt(dx*dx + dy*dy);
    if (d < 100) {
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mx, my);
      ctx.strokeStyle = `rgba(212,168,67,${0.12 * (1 - d/100)})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    for (let j = i+1; j < particles.length; j++) {
      const dx2 = particles[i].x - particles[j].x;
      const dy2 = particles[i].y - particles[j].y;
      const d2 = Math.sqrt(dx2*dx2+dy2*dy2);
      if (d2 < 80) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(212,168,67,${0.06*(1-d2/80)})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      }
    }
  }
}

function loop() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(loop);
}
loop();

/* ===== CURSOR ===== */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let cx = 0, cy = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; cur.style.left = cx-5+'px'; cur.style.top = cy-5+'px'; });
(function animRing() {
  rx += (cx - rx) * 0.1; ry += (cy - ry) * 0.1;
  ring.style.left = rx-20+'px'; ring.style.top = ry-20+'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.classList.add('hover'); ring.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cur.classList.remove('hover'); ring.classList.remove('hover'); });
});

/* ===== NAV SCROLL ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===== INTERSECTION OBSERVER ===== */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .tl-item').forEach(el => obs.observe(el));

/* ===== MODAL ===== */
function openModal() {
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}
function closeOnOverlay(e) {
  if (e.target === document.getElementById('modal')) closeModal();
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function sendMsg() {
  const name = document.getElementById('m-name').value.trim();
  const email = document.getElementById('m-email').value.trim();
  const msg = document.getElementById('m-msg').value.trim();
  if (!name || !email || !msg) {
    alert('Please fill in all fields!'); return;
  }
  // Open email client with prefilled message
  const subject = encodeURIComponent(`Hiring Inquiry from ${name}`);
  const body = encodeURIComponent(`Hi Soumya ,\n\n${msg}\n\nFrom: ${name}\nEmail: ${email}`);
  window.open(`mailto:swainsoumya7750@gmail.com?subject=${subject}&body=${body}`);
  document.getElementById('m-success').style.display = 'block';
  document.getElementById('m-name').value = '';
  document.getElementById('m-email').value = '';
  document.getElementById('m-msg').value = '';
}
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.sk-fill').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
    }
  });
}, { threshold: 0.3 });
const skillSection = document.getElementById('skills');
if (skillSection) skillObs.observe(skillSection);
