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

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ── Scroll-Reveal Animations ───────────────────────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');

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

fadeEls.forEach(el => revealObserver.observe(el));

// ── Animated Counter (Stats Section) ──────────────────────────────────────────
function animateCounter(el, target, duration) {
  const start     = performance.now();
  const formatter = new Intl.NumberFormat('en-US');

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
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
        animateCounter(el, target, 1800);
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
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── Particle Background ────────────────────────────────────────────────────────
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['#00ff88', '#00d4ff', '#7c3aed', '#ffffff'];
  const count  = 30;

  for (let i = 0; i < count; i++) {
    const p    = document.createElement('div');
    const size = Math.random() * 3 + 1;

    p.classList.add('particle');
    Object.assign(p.style, {
      width:            `${size}px`,
      height:           `${size}px`,
      left:             `${Math.random() * 100}%`,
      background:       colors[Math.floor(Math.random() * colors.length)],
      animationDuration:`${Math.random() * 15 + 12}s`,
      animationDelay:   `${Math.random() * 12}s`,
    });

    container.appendChild(p);
  }
})();

// ── Smooth Scroll (fallback for older browsers) ────────────────────────────────
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

// ── Wallet State ───────────────────────────────────────────────────────────────
const walletState = {
  connected: false,
  address: null,
  wallet: null,
  pendingPlan: null,
  pendingSol: null,
};

// Simulated truncated wallet address
function generateMockWalletAddress() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789';
  const rand = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return rand(4) + '...' + rand(4);
}

// ── Wallet Modal ───────────────────────────────────────────────────────────────
const walletModal   = document.getElementById('walletModal');
const walletClose   = document.getElementById('walletModalClose');
const connectBtns   = document.querySelectorAll('#connectWalletBtn, .connect-wallet-trigger');

function openWalletModal() {
  if (walletState.connected) return;
  walletModal.classList.add('open');
  const card = walletModal.querySelector('.wallet-modal-card');
  if (card && card.focus) card.focus();
}

function closeWalletModal() {
  walletModal.classList.remove('open');
}

connectBtns.forEach(btn => btn.addEventListener('click', openWalletModal));

walletClose && walletClose.addEventListener('click', closeWalletModal);

// Close on backdrop click
walletModal && walletModal.addEventListener('click', (e) => {
  if (e.target === walletModal) closeWalletModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeWalletModal();
    closePaymentModal();
  }
});

// ── Wallet Option Click → Simulate Connection ──────────────────────────────────
document.querySelectorAll('.wallet-option').forEach(option => {
  option.addEventListener('click', () => {
    const walletName = option.dataset.wallet;

    // Show loading state
    option.classList.add('wallet-option-loading');
    option.disabled = true;
    option.querySelector('.wallet-option-name').textContent = 'Connecting...';

    setTimeout(() => {
      walletState.connected = true;
      walletState.wallet    = walletName;
      walletState.address   = generateMockWalletAddress();

      closeWalletModal();
      updateNavbarWalletButton();

      option.classList.remove('wallet-option-loading');
      option.disabled = false;
      option.querySelector('.wallet-option-name').textContent = walletName;

      // If the user clicked a Buy button before connecting, open payment modal now
      if (walletState.pendingPlan) {
        openPaymentModal(walletState.pendingPlan, walletState.pendingSol);
        walletState.pendingPlan = null;
        walletState.pendingSol  = null;
      }
    }, 1000);
  });
});

function updateNavbarWalletButton() {
  const btn = document.getElementById('connectWalletBtn');
  if (!btn) return;

  btn.className = 'wallet-connected nav-cta';
  btn.innerHTML = walletState.address;
  btn.disabled  = true;
}

// ── Payment Modal ──────────────────────────────────────────────────────────────
const paymentModal      = document.getElementById('paymentModal');
const paymentDesc       = document.getElementById('paymentModalDesc');
const paymentCancelBtn  = document.getElementById('paymentCancelBtn');
const paymentConfirmBtn = document.getElementById('paymentConfirmBtn');

function openPaymentModal(plan, sol) {
  paymentDesc.textContent = `Confirm Payment — ${sol} SOL to PumpAnalyzer for the ${plan} plan. Confirm?`;
  paymentModal.classList.add('open');
}

function closePaymentModal() {
  paymentModal && paymentModal.classList.remove('open');
}

paymentCancelBtn && paymentCancelBtn.addEventListener('click', closePaymentModal);

paymentModal && paymentModal.addEventListener('click', (e) => {
  if (e.target === paymentModal) closePaymentModal();
});

paymentConfirmBtn && paymentConfirmBtn.addEventListener('click', () => {
  closePaymentModal();
  showToast('Payment sent! 🎉');
});

// ── Buy SOL Buttons ────────────────────────────────────────────────────────────
document.querySelectorAll('.buy-sol-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!walletState.connected) {
      // Store purchase intent — payment modal will open after wallet connects
      walletState.pendingPlan = btn.dataset.plan;
      walletState.pendingSol  = btn.dataset.sol;
      openWalletModal();
      return;
    }
    openPaymentModal(btn.dataset.plan, btn.dataset.sol);
  });
});

// ── Toast ──────────────────────────────────────────────────────────────────────
const toastEl = document.getElementById('toast');

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 3500);
}
