// Theme: dark by default, follows the visitor's system setting, remembers their toggle choice
(() => {
  const root = document.documentElement;
  const isLight = () => root.dataset.theme ? root.dataset.theme === 'light' : matchMedia('(prefers-color-scheme: light)').matches;
  document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
    const sync = () => btn.setAttribute('aria-checked', String(isLight()));
    sync();
    btn.addEventListener('click', () => {
      root.dataset.theme = isLight() ? 'dark' : 'light';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
      sync();
    });
  });
})();

// Navbar border on scroll + mobile menu
(() => {
  const bar = document.querySelector('.navbar');
  const links = document.querySelector('.nav-links');
  const menu = document.getElementById('menu');
  addEventListener('scroll', () => bar.classList.toggle('scrolled', scrollY > 8), { passive: true });
  if (menu) {
    menu.addEventListener('click', () => menu.setAttribute('aria-expanded', links.classList.toggle('open')));
    links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); } });
  }
})();

// Highlight the nav link for the section in view (home page only)
(() => {
  const anchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = anchors.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!sections.length) return;
  const update = () => {
    const y = scrollY + innerHeight * 0.35;
    let current = sections[0];
    for (const s of sections) if (s.offsetTop <= y) current = s;
    if (innerHeight + scrollY >= document.body.scrollHeight - 4) current = sections[sections.length - 1];
    anchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
  };
  addEventListener('scroll', update, { passive: true });
  update();
})();

// Copy email
(() => {
  const btn = document.getElementById('copy'), mail = document.getElementById('mail');
  if (!btn || !mail) return;
  btn.addEventListener('click', () => {
    const fallback = () => getSelection().selectAllChildren(mail);
    if (!navigator.clipboard) return fallback();
    navigator.clipboard.writeText(mail.textContent.trim()).then(() => {
      btn.textContent = 'Copied'; setTimeout(() => btn.textContent = 'Copy', 1500);
    }, fallback);
  });
})();

const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// Photo lightbox
(() => {
  const box = document.getElementById('lightbox');
  if (!box) return;
  const img = box.querySelector('img'), cap = box.querySelector('.lb-cap');
  document.querySelectorAll('button.photo').forEach(btn => btn.addEventListener('click', () => {
    img.src = btn.dataset.full; img.alt = btn.dataset.caption || '';
    cap.textContent = btn.dataset.caption || '';
    box.showModal();
  }));
  box.querySelector('.lb-close').addEventListener('click', () => box.close());
  box.addEventListener('click', e => { if (e.target === box) box.close(); });
})();
