/* PumpAnalyzer — script.js */

// ── Sticky Navbar ──────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  const handleNavbarScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();
}

// ── Hamburger / Mobile Menu ────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ── Scroll-Reveal Animations ───────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));

// ── Animated Counter (Stats Section) ──────────────────────────────────────────
function animateCounter(el, target, duration) {
  const start     = performance.now();
  const formatter = new Intl.NumberFormat('en-US');

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = formatter.format(current);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target, 2000);
        statsObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stats-value[data-target]').forEach(el => {
  statsObserver.observe(el);
});

// ── FAQ Accordion ──────────────────────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-answer').classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      i.querySelector('.faq-icon').textContent = '+';
    });

    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      btn.querySelector('.faq-icon').textContent = '×';
    }
  });
});

// ── Particle Background ────────────────────────────────────────────────────────
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['#00ff88', '#00d4ff', '#7c3aed', '#ffffff'];
  const count  = 20;

  for (let i = 0; i < count; i++) {
    const p    = document.createElement('div');
    const size = Math.random() * 3 + 1;

    p.classList.add('particle');
    Object.assign(p.style, {
      width:             `${size}px`,
      height:            `${size}px`,
      left:              `${Math.random() * 100}%`,
      background:        colors[Math.floor(Math.random() * colors.length)],
      animationDuration: `${Math.random() * 15 + 12}s`,
      animationDelay:    `${Math.random() * 12}s`,
    });

    container.appendChild(p);
  }
})();

// ── Smooth Scroll ─────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Connect Wallet Buttons — stub for custom implementation ───────────────────
// TODO: Add your wallet connection logic here.
// All "Connect Wallet" buttons have the class .connect-wallet-btn
// The navbar button has id="connectWalletBtn"
// The hero button has id="heroConnectBtn"
// Pricing plan buttons: id="freePlanBtn", and buttons with data-plan attribute
