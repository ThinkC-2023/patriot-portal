/* Patriot Ultra Blocker — Portal JS */

// ── NAV scroll effect ─────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── Mobile nav toggle ────────────────────────────────
const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // close on link click
  navLinks.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── Animated stat counters ────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  if (isNaN(target)) return;
  const duration = 1600;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOut(progress) * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statNums = document.querySelector('.hero-stats');
if (statNums) statsObserver.observe(statNums);

// ── Terminal simulation ───────────────────────────────
const termBody = document.getElementById('termBody');
if (termBody) {
  const events = [
    { delay: 300,  type: 'info',  text: 'Patriot Ultra Blocker v1.0.1 starting...' },
    { delay: 700,  type: 'info',  text: 'WMI connection pool initialized' },
    { delay: 1100, type: 'info',  text: 'Loading IOC database... Apps=2841 Ransom=14829 Net=38204' },
    { delay: 1600, type: 'info',  text: 'Geo+Time module: 2 rule(s) active · Allow: ID' },
    { delay: 2000, type: 'info',  text: 'Honeypot: 18 file(s) active (max 20/folder)' },
    { delay: 2500, type: 'info',  text: '[SHIELD ACTIVE] Monitoring engine started' },
    { delay: 3400, type: 'block', text: 'BLOCK · mimikatz.exe · EDR Killer (SHA256)' },
    { delay: 4200, type: 'warn',  text: 'ALERT · 185.220.101.42:3389 · CN → RDP · Weekend Rule' },
    { delay: 5100, type: 'block', text: 'BLOCK · massren.exe · Rename burst 912 files/4s' },
    { delay: 6000, type: 'allow', text: 'RESTORED · report_q4.docx · AutoRollback · 1 file' },
    { delay: 7000, type: 'info',  text: 'URLhaus sync: +284 hosts · DB v2026.03.28' },
    { delay: 8200, type: 'warn',  text: 'ALERT · certutil.exe · LOLBin download · score+12' },
    { delay: 9400, type: 'block', text: 'BLOCK · cobalt_s4.exe · C2 Beacon DGA · score 34' },
    { delay: 10600,type: 'info',  text: 'HashCache: 4821 entries · scan cycle 14/20' },
  ];

  let lines = [];
  const MAX_LINES = 14;

  function addLine(type, text, ts) {
    const line = document.createElement('div');
    line.className = 't-line';

    const timeSpan = document.createElement('span');
    timeSpan.className = 't-time';
    timeSpan.textContent = ts;

    const typeSpan = document.createElement('span');
    const msg = document.createElement('span');

    if (type === 'block') {
      typeSpan.className = 't-block';
      typeSpan.textContent = '✗';
      msg.className = 't-proc';
    } else if (type === 'allow') {
      typeSpan.className = 't-allow';
      typeSpan.textContent = '✓';
      msg.className = 't-proc';
    } else if (type === 'warn') {
      typeSpan.className = 't-warn';
      typeSpan.textContent = '!';
      msg.className = 't-proc';
    } else {
      typeSpan.className = 't-info';
      typeSpan.textContent = '·';
      msg.className = 't-info';
    }

    msg.textContent = ' ' + text;
    line.append(timeSpan, typeSpan, msg);

    // remove cursor from previous last
    const prev = termBody.querySelector('.t-cursor');
    if (prev) prev.remove();

    lines.push(line);
    if (lines.length > MAX_LINES) {
      lines[0].remove();
      lines.shift();
    }
    termBody.appendChild(line);

    // add cursor to last line
    const cursor = document.createElement('span');
    cursor.className = 't-cursor';
    line.appendChild(cursor);

    termBody.scrollTop = termBody.scrollHeight;
  }

  function getTS() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
  }

  events.forEach(ev => {
    setTimeout(() => addLine(ev.type, ev.text, getTS()), ev.delay);
  });

  // loop after all done
  setTimeout(() => {
    let idx = 6;
    setInterval(() => {
      const ev = events[idx % events.length];
      if (idx >= 6) addLine(ev.type, ev.text, getTS());
      idx++;
    }, 2500);
  }, 12000);
}

// ── Ticker duplicate for seamless loop ───────────────
const ticker = document.getElementById('ticker');
if (ticker) {
  ticker.innerHTML += ticker.innerHTML;
}

// ── Fade-in on scroll ─────────────────────────────────
const fades = document.querySelectorAll('.fade-in');
if (fades.length) {
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  fades.forEach(el => fadeObs.observe(el));
}

// ── Code copy ─────────────────────────────────────────
function copyCode(btn) {
  const text = btn.dataset.code || '';
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.style.color = 'var(--success)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.color = '';
    }, 1800);
  });
}
window.copyCode = copyCode;

// ── Docs: active sidebar link on scroll ──────────────
const docLinks = document.querySelectorAll('.doc-nav-link[href^="#"]');
if (docLinks.length) {
  const sections = [...docLinks].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const docObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        docLinks.forEach(l => l.classList.remove('active'));
        const active = [...docLinks].find(l => l.getAttribute('href') === '#' + entry.target.id);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(s => docObs.observe(s));
}
