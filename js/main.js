const C = window.CONTENT, $ = id => document.getElementById(id);
// ---------- music ----------
const bgm = $('bgm'), mb = $('musicBtn'); let started = false;
function startMusic() { if (!bgm || !mb || started) return; started = true; bgm.volume = .35; bgm.play().then(() => { mb.classList.remove('hidden'); mb.classList.add('on') }).catch(() => {}) }
if (mb && bgm) mb.onclick = () => { if (bgm.paused) { bgm.play(); mb.classList.add('on') } else { bgm.pause(); mb.classList.remove('on') } };
document.addEventListener('play', e => { if (bgm && mb && e.target.tagName === 'VIDEO' && !bgm.paused) { bgm.pause(); mb.classList.remove('on') } }, true);
// ---------- confetti ----------
const cv = $('confetti'), ctx = cv.getContext('2d'); let parts = [], raf = 0;
const fit = () => { cv.width = innerWidth; cv.height = innerHeight }; fit(); addEventListener('resize', fit);
function boom() {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const cols = ['#FFD23F', '#FF4F8B', '#2EC4B6', '#fff', '#9B6BFF'];
  for (let i = 0; i < 160; i++) parts.push({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 15, vy: Math.random() * -13 - 2, s: Math.random() * 6 + 4, c: cols[i % 5], l: 130 });
  if (!raf) raf = requestAnimationFrame(tick);
}
function tick() {
  ctx.clearRect(0, 0, cv.width, cv.height); parts = parts.filter(p => p.l > 0);
  parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.l--; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.s, p.s * 1.6) });
  raf = parts.length ? requestAnimationFrame(tick) : 0;
}
// ---------- intro prank ----------
const steps = [
  ["Guess whose birthday it is today? 🎉", "Tell me!"],
  ["It's Mahatma Gandhi's birthday! 🇮🇳 Happy Gandhi Jayanti!", "Umm… is that it?"],
  ["Okay okay, just joking 😜 wait…", "Wait, what?"],
  ["It's PARIMA's birthday!! 🎂🥳", "Start the party 🎈"]
];
let si = 0;
function showStep() { $('introText').textContent = steps[si][0]; $('introBtn').textContent = steps[si][1]; if (si === 3) boom() }
$('introBtn').onclick = () => {
  startMusic();
  if (si < 3) { si++; showStep(); return }
  $('intro').classList.add('hidden'); $('party').classList.remove('hidden'); scrollTo(0, 0);
};
showStep();
// ---------- memories ----------
function ph(src) { const d = document.createElement('div'); d.className = 'ph'; d.textContent = 'Add your file here: ' + src; return d }
function media(type, src) {
  const el = document.createElement(type === 'video' ? 'video' : 'img');
  el.src = src;
  if (type === 'video') { el.controls = true; el.playsInline = true; el.preload = 'metadata' } else { el.alt = ''; el.loading = 'lazy' }
  el.addEventListener('error', () => el.replaceWith(ph(src)), { once: true });
  return el;
}
C.memories.forEach(m => {
  const card = document.createElement('article'); card.className = 'mem';
  card.append(media(m.type, m.src));
  const p = document.createElement('p'); p.textContent = m.caption; card.append(p);
  if (m.spotify) { const f = document.createElement('iframe'); f.loading = 'lazy'; f.allow = 'encrypted-media'; f.title = 'Song for this memory'; f.src = 'https://open.spotify.com/embed/track/' + m.spotify; card.append(f) }
  $('memList').append(card);
});
C.solo.forEach(s => $('soloList').append(media('image', s)));
(C.reels || []).forEach(r => {
  const d = document.createElement('article'); d.className = 'reel'; const v = media('video', r.src);
  v.addEventListener('play', () => document.querySelectorAll('#reelList video').forEach(o => o !== v && o.pause()));
  d.append(v); if (r.caption) { const p = document.createElement('p'); p.textContent = r.caption; d.append(p) }
  $('reelList').append(d);
});
// ---------- cake ----------
const NS = 'http://www.w3.org/2000/svg', spots = [[92,142],[128,124],[192,124],[228,142],[118,176],[202,176]];
$('t1').textContent = C.cakeText[0]; $('t2').textContent = C.cakeText[1];
const cg = $('candles'), candles = [], wraps = [];
spots.slice(0, C.wishes.length).forEach(([x, y], i) => {
  const o = document.createElementNS(NS, 'g'); o.setAttribute('transform', `translate(${x} ${y})`);
  o.innerHTML = `<g class="candle"><rect x="-3.2" y="-18" width="6.4" height="24" rx="1.5" fill="#fff"/><path d="M0 -16C-7 -28 7 -40 0 -52S-7 -76 0 -86" fill="none" stroke="#B8860B" stroke-width="5" stroke-linecap="round"/><path d="M-.8 -16C-7.8 -28 6.2 -40 -.8 -52S-7.8 -76 -.8 -86" fill="none" stroke="#FFE680" stroke-width="1.6" stroke-linecap="round"/><ellipse class="flame" cx="0" cy="-97" rx="5" ry="10" fill="url(#fl)"/></g>`;
  o.__y = y; wraps.push(o); candles[i] = o.firstChild;
});
wraps.slice().sort((a, b) => a.__y - b.__y).forEach(o => cg.append(o));
const btn = $('cakeBtn'), wait = ms => new Promise(r => setTimeout(r, ms));
btn.onclick = async () => {
  btn.disabled = true;
  for (let i = 0; i < candles.length; i++) {
    candles[i].classList.add('in'); $('bubble').textContent = `Candle ${i + 1}: ${C.wishes[i]}`; await wait(1800);
  }
  $('bubble').textContent = 'All candles are lit! Close your eyes and make a wish 🤞';
  btn.textContent = 'Make a wish 🌟'; btn.disabled = false;
  btn.onclick = async () => {
    btn.classList.add('hidden');
    for (let n = 10; n > 0; n--) { $('count').textContent = n; await wait(1000) }
    $('count').textContent = '🌬️ Blow!'; $('cake').classList.add('out'); candles.forEach(c => c.classList.add('out')); boom();
    await wait(1800); $('count').textContent = '';
    $('uniText').textContent = C.universe; $('universe').classList.remove('hidden');
    $('letter').innerHTML = C.letter.map(t => `<p>${t}</p>`).join('') + `<p class="sig">${C.signature}</p>`;
    $('reelSec').classList.remove('hidden'); $('letterSec').classList.remove('hidden'); flowers($('letter')); $('universe').scrollIntoView();
  };
};

function flowers(el) {
  const cols = ['#8E5BD6', '#FFFFFF', '#B38CF0', '#FFFFFF'], box = document.createElement('div'); box.className = 'flowers';
  for (let i = 0; i < 34; i++) {
    const edge = Math.random() < .7, x = edge ? (Math.random() < .5 ? Math.random() * 14 : 86 + Math.random() * 12) : Math.random() * 94, y = Math.random() * 96;
    const s = document.createElement('span'); s.style.cssText = `left:${x}%;top:${y}%;transform:rotate(${Math.random() * 360}deg)`;
    s.innerHTML = `<svg viewBox="-10 -10 20 20" width="19" height="19">${[0, 72, 144, 216, 288].map(a => `<ellipse cy="-5" rx="3.2" ry="5" fill="${cols[i % 4]}" stroke="#0002" stroke-width=".4" transform="rotate(${a})"/>`).join('')}<circle r="2" fill="#F5C842"/></svg>`;
    box.append(s);
  }
  el.append(box);
}
// gandhi image + pop animation on intro
const gi = $('gandhi'); gi.onerror = () => gi.remove();
const _show = showStep;
showStep = function () { _show(); const t = $('introText'); t.classList.remove('pop'); void t.offsetWidth; t.classList.add('pop'); gi.classList.toggle('hidden', !(si === 1 || si === 2)) };
showStep();
// cards slide in on scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .15 });
document.querySelectorAll('.mem').forEach(c => io.observe(c));