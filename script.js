// Theme toggle (saved in localStorage)
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeBtn.innerHTML = theme === 'dark' ? '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' : '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
applyTheme(localStorage.getItem('theme') || 'dark');
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
});

// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navbar = document.getElementById('navbar');
menuBtn.addEventListener('click', () => {
  const open = navbar.classList.toggle('menu-open');
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.textContent = open ? '✕' : '☰';
});
document.querySelectorAll('#navLinks a').forEach(a => a.addEventListener('click', () => {
  navbar.classList.remove('menu-open');
  menuBtn.textContent = '☰';
  menuBtn.setAttribute('aria-expanded', 'false');
}));

// Project search and filter
const searchInput = document.getElementById('projectSearch');
const filterBtns = document.querySelectorAll('.filter-btn');

const noResults = document.getElementById('noResults');
let activeFilter = 'all';

function filterProjects() {
  const q = searchInput.value.trim().toLowerCase();
  let visible = 0;
  document.querySelectorAll('.project-card').forEach(card => {
    const text = (card.textContent + ' ' + card.dataset.tech + ' ' + card.dataset.year).toLowerCase();
    const matchCat = activeFilter === 'all' || card.dataset.category === activeFilter;
    const matchText = !q || text.includes(q);
    const show = matchCat && matchText;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  noResults.classList.toggle('show', visible === 0);
}
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  filterProjects();
}));
searchInput.addEventListener('input', filterProjects);

// Contact form (Formspree)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (form.website.value) return; // honeypot caught a bot
  if (form.action.includes('YOUR_FORM_ID')) {
    status.textContent = 'Form not connected yet. Please email mavisaur@gmail.com directly.';
    return;
  }
  status.textContent = 'Sending…';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      form.reset();
      status.textContent = 'Thanks! Your message has been sent.';
    } else {
      status.textContent = 'Something went wrong. Please try again or email me directly.';
    }
  } catch {
    status.textContent = 'Network error. Please try again.';
  }
});

// ID card: drag to move, click to flip
(function () {
  const scene = document.getElementById('idScene');
  const card = document.getElementById('idCard');
  let baseX = 0, baseY = 0;
  let startX = 0, startY = 0, dragging = false, moved = false;

  function place(x, y, r) { scene.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`; }

  card.addEventListener('pointerdown', (e) => {
    dragging = true; moved = false;
    startX = e.clientX; startY = e.clientY;
    card.setPointerCapture(e.pointerId);
    scene.style.transition = 'none';
  });
  card.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
    if (!moved) return;
    place(baseX + dx, baseY + dy, 0);
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      const dx = e.clientX - startX, dy = e.clientY - startY;
      baseX = Math.max(-150, Math.min(150, baseX + dx));
      baseY = Math.max(-80, Math.min(200, baseY + dy));
      scene.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      place(baseX, baseY, 0);
    } else {
      card.classList.toggle('flipped');
    }
  }
  card.addEventListener('pointerup', endDrag);
  card.addEventListener('pointercancel', endDrag);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); }
  });
  place(0, 0, 0);
})();

// Tries common image extensions so "Choou 1" works as .jpg, .jpeg, .png, or .webp
const EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
function setSrc(img, base, onFail) {
  let i = 0;
  img.onerror = () => {
    i++;
    if (i < EXTS.length) img.src = base + EXTS[i];
    else if (onFail) onFail();
  };
  img.src = base + EXTS[0];
}

// ===== Project folders =====
// To add works, put the images in /assets and list them under the right folder.
const FOLDERS = [
  { id: 'choou', name: 'Choou Thumbnails', category: 'Thumbnails', year: '2025', tech: 'Photoshop', images: [
    { base: 'assets/Choou 1', title: 'Paquito 1 Hit Thumbnail' },
    { base: 'assets/Choou 2', title: 'Paquito New Build Thumbnail' },
    { base: 'assets/Choou 3', title: 'Paquito New Combo Thumbnail' },
    { base: 'assets/Choou 4', title: '1 hit combo Thumbnail' },
    { base: 'assets/Choou 5', title: 'New trick Thumbnail' },
    { base: 'assets/Choou 6', title: 'Paquito vs Thamuz Thumbnail' },
    { base: 'assets/Choou 7', title: 'Immortal Glory Thumbnail' },
    { base: 'assets/Choou 8', title: 'OP item Thumbnail' },
    { base: 'assets/Choou 9', title: 'Paquito vs YSS and Alice Thumbnail' },
    { base: 'assets/Choou 10', title: 'Paquito vs Barats Thumbnail' },
    { base: 'assets/Choou 11', title: 'How to be a pro Thumbnail' },
    { base: 'assets/Choou 12', title: 'Chou winstreak Thumbnail' }
  ] },
  { id: 'yuzuke', name: 'Yuzuke Thumbnails', category: 'Thumbnails', year: '2025', tech: 'Photoshop', images: [
    { base: 'assets/Yuzuke (1)', title: 'Yuzuke Thumbnail 1' },
    { base: 'assets/Yuzuke (2)', title: 'Yuzuke Thumbnail 2' },
    { base: 'assets/Yuzuke (3)', title: 'Yuzuke Thumbnail 3' },
    { base: 'assets/Yuzuke (4)', title: 'Yuzuke Thumbnail 4' },
    { base: 'assets/Yuzuke (5)', title: 'Yuzuke Thumbnail 5' },
    { base: 'assets/Yuzuke (6)', title: 'Yuzuke Thumbnail 6' },
    { base: 'assets/Yuzuke (7)', title: 'Yuzuke Thumbnail 7' },
    { base: 'assets/Yuzuke (8)', title: 'Yuzuke Thumbnail 8' },
    { base: 'assets/Yuzuke (9)', title: 'Yuzuke Thumbnail 9' },
    { base: 'assets/Yuzuke (10)', title: 'Yuzuke Thumbnail 10' }
  ] },
  { id: 'logo', name: 'Logo Designs', category: 'Logo', year: '2025', tech: 'Photoshop, Visual Branding', images: [
    { base: 'assets/logo (1)', title: 'Adjacent Logo' },
    { base: 'assets/logo (2)', title: 'Zeratek Logo' },
    { base: 'assets/logo (3)', title: 'JB Haircut Logo' },
    { base: 'assets/logo (4)', title: 'My own Logo' },
    { base: 'assets/logo (5)', title: 'KFC Logo' },
    { base: 'assets/logo (6)', title: 'Mavi Logo' },
    { base: 'assets/logo (7)', title: 'Styxx for YouTube Logo' }
  ] },
  { id: 'banner', name: 'Banner Designs', category: 'Banner', year: '2025', tech: 'Photoshop', images: [
    { base: 'assets/banner (1)', title: 'Zeratek Banner' },
    { base: 'assets/banner (2)', title: 'Insection Banner' },
    { base: 'assets/banner (3)', title: 'Erlindang Banner' },
    { base: 'assets/banner (4)', title: 'Insection FB Banner' },
    { base: 'assets/banner (5)', title: 'Adjacent Banner' },
    { base: 'assets/banner (6)', title: 'Fobi Banner' },
    { base: 'assets/banner (7)', title: 'Katsuo Banner' }
  ] },
  { id: 'poster', name: 'Poster & Pubmat Designs', category: 'Poster/Pubmat', year: '2024', tech: 'Photoshop, Campaign Design', images: [
    { base: 'assets/Pubmat (1)', title: 'Silid Scan Pubmat' },
    { base: 'assets/Pubmat (2)', title: 'Fright Night Pubmat' },
    { base: 'assets/Pubmat (3)', title: 'Pawn Hero Pubmat' },
    { base: 'assets/Pubmat (4)', title: 'Pawn Hero 2 Pubmat' },
    { base: 'assets/Pubmat (5)', title: 'Artist Pubmat' },
    { base: 'assets/Pubmat (6)', title: 'Krav Cafe Pubmat' },
    { base: 'assets/Pubmat (7)', title: 'Decent gig Pubmat' },
    { base: 'assets/Pubmat (8)', title: 'Anniversary Pubmat' }
  ] }
];

const grid = document.getElementById('projectGrid');
FOLDERS.forEach((f) => {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'glass project-card folder-card reveal';
  card.dataset.category = f.category;
  card.dataset.year = f.year;
  card.dataset.tech = f.tech;

  const tab = document.createElement('span');
  tab.className = 'folder-tab';

  const preview = document.createElement('span');
  preview.className = 'folder-preview';
  if (f.images.length) {
    const img = document.createElement('img');
    img.alt = '';
    setSrc(img, f.images[0].base, () => img.remove());
    preview.appendChild(img);
  } else {
    const empty = document.createElement('span');
    empty.className = 'folder-empty';
    empty.textContent = 'No works yet';
    preview.appendChild(empty);
  }

  const info = document.createElement('span');
  info.className = 'folder-info';
  const name = document.createElement('strong');
  name.textContent = f.name;
  const meta = document.createElement('small');
  meta.textContent = f.images.length + (f.images.length === 1 ? ' work' : ' works') + ' · ' + f.category + ' · ' + f.year;
  info.append(name, meta);

  card.append(tab, preview, info);
  card.addEventListener('click', () => openFolder(f));
  grid.appendChild(card);
});

// Folder popup
const fm = document.getElementById('folderModal');
const fdGrid = document.getElementById('fdGrid');
const fdEmpty = document.getElementById('fdEmpty');
function openFolder(f) {
  document.getElementById('fdTitle').textContent = f.name;
  document.getElementById('fdMeta').textContent = f.images.length + ' work(s) · ' + f.category + ' · ' + f.year + ' · ' + f.tech;
  fdGrid.innerHTML = '';
  fdEmpty.hidden = f.images.length > 0;
  f.images.forEach((im) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'fd-item';
    const img = document.createElement('img');
    img.alt = im.title;
    img.loading = 'lazy';
    setSrc(img, im.base);
    const cap = document.createElement('span');
    cap.textContent = im.title;
    b.append(img, cap);
    b.addEventListener('click', () => openViewer(img.src, im.title));
    fdGrid.appendChild(b);
  });
  fm.hidden = false;
  document.body.style.overflow = 'hidden';
  fm.querySelector('.lb-close').focus();
}
function closeFolder() {
  fm.hidden = true;
  document.body.style.overflow = '';
}
fm.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeFolder));

// Image viewer with zoom (opens on top of the folder popup)
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbStage = document.getElementById('lbStage');
const lbEmpty = document.getElementById('lbEmpty');
const lbCaption = document.getElementById('lbCaption');
function openViewer(src, title) {
  lbCaption.textContent = title;
  lbStage.classList.remove('zoomed');
  lbEmpty.hidden = true;
  lbImg.hidden = false;
  lbImg.onerror = () => { lbImg.hidden = true; lbEmpty.hidden = false; };
  lbImg.src = src;
  lbImg.style.transformOrigin = 'center';
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('lbClose').focus();
}
function closeViewer() {
  lb.hidden = true;
  lbImg.removeAttribute('src');
  document.body.style.overflow = fm.hidden ? '' : 'hidden';
}
lbStage.addEventListener('mousemove', (e) => {
  const r = lbStage.getBoundingClientRect();
  lbImg.style.transformOrigin =
    ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
});
lbStage.addEventListener('click', () => lbStage.classList.toggle('zoomed'));
document.getElementById('lbClose').addEventListener('click', closeViewer);
document.getElementById('lbBackdrop').addEventListener('click', closeViewer);

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!lb.hidden) closeViewer();
  else if (!fm.hidden) closeFolder();
});

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));