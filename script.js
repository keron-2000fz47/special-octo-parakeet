/* PumpAnalyzer — script.js */

// ── Wallet State ───────────────────────────────────────────────────────────────
const walletState = {
  connected: false,
  address: null,
  wallet: null,
  pendingPlan: null,
  pendingSol: null
};

const mockAddresses = [
  'Ab3dR...f9Kz',
  'Xy7mP...2wQn',
  'Gh5kL...8vBt',
  'Mn9jF...4rDs',
  'Pq2eW...6cYu'
];

// ── DOM References ─────────────────────────────────────────────────────────────
const navbar          = document.getElementById('navbar');
const connectWalletBtn= document.getElementById('connectWalletBtn');
const heroConnectBtn  = document.getElementById('heroConnectBtn');
const walletModal     = document.getElementById('walletModal');
const closeWalletBtn  = document.getElementById('closeWalletModal');
const paymentModal    = document.getElementById('paymentModal');
const paymentDetails  = document.getElementById('paymentDetails');
const cancelPayment   = document.getElementById('cancelPayment');
const confirmPayment  = document.getElementById('confirmPayment');
const freePlanBtn     = document.getElementById('freePlanBtn');
const toast           = document.getElementById('toast');

// ── Toast ──────────────────────────────────────────────────────────────────────
function showToast(msg) {
  if (!toast) return;
  toast.removeAttribute('hidden');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.setAttribute('hidden', ''), 300);
  }, 3000);
}

// ── Wallet Modal ───────────────────────────────────────────────────────────────
function openWalletModal() {
  if (!walletModal) return;
  walletModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closeWalletModal() {
  if (!walletModal) return;
  walletModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

if (closeWalletBtn) {
  closeWalletBtn.addEventListener('click', closeWalletModal);
}

// Close on backdrop click
if (walletModal) {
  walletModal.addEventListener('click', (e) => {
    if (e.target === walletModal) closeWalletModal();
  });
}

// Wallet option click
document.querySelectorAll('.wallet-option').forEach(option => {
  option.addEventListener('click', () => {
    const walletName    = option.dataset.wallet;
    const nameEl        = option.querySelector('.wallet-option-name');
    const originalText  = nameEl ? nameEl.textContent : walletName;

    // Loading state
    option.classList.add('loading');
    if (nameEl) nameEl.textContent = 'Connecting...';

    setTimeout(() => {
      // Restore
      option.classList.remove('loading');
      if (nameEl) nameEl.textContent = originalText;

      // Connect
      walletState.connected = true;
      walletState.wallet    = walletName;
      walletState.address   = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];

      // Update navbar button → connected indicator
      updateNavbarWalletUI();

      // Close modal
      closeWalletModal();
      showToast(`✅ ${walletName} connected!`);

      // Handle pending plan
      if (walletState.pendingPlan) {
        const plan = walletState.pendingPlan;
        const sol  = walletState.pendingSol;
        walletState.pendingPlan = null;
        walletState.pendingSol  = null;
        openPaymentModal(plan, sol);
      }
    }, 1000);
  });
});

function updateNavbarWalletUI() {
  if (!connectWalletBtn) return;
  if (walletState.connected) {
    const span = document.createElement('span');
    span.className = 'wallet-connected';
    span.innerHTML = `<span class="wallet-dot"></span>${walletState.address}`;
    connectWalletBtn.replaceWith(span);
  }
}

// ── Payment Modal ──────────────────────────────────────────────────────────────
function openPaymentModal(plan, sol) {
  if (!paymentModal || !paymentDetails) return;
  paymentDetails.textContent = `You are about to pay ${sol} SOL for the ${plan} plan. Please confirm the transaction.`;
  paymentModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
  if (!paymentModal) return;
  paymentModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

if (cancelPayment) {
  cancelPayment.addEventListener('click', closePaymentModal);
}

if (paymentModal) {
  paymentModal.addEventListener('click', (e) => {
    if (e.target === paymentModal) closePaymentModal();
  });
}

if (confirmPayment) {
  confirmPayment.addEventListener('click', () => {
    const details = paymentDetails ? paymentDetails.textContent : '';
    const planMatch = details.match(/for the (\w+) plan/);
    const plan = planMatch ? planMatch[1] : 'Pro';
    closePaymentModal();
    showToast(`Payment sent! 🎉 Welcome to ${plan}`);
  });
}

// ── Buy Plan Buttons ───────────────────────────────────────────────────────────
document.querySelectorAll('[data-plan]').forEach(btn => {
  btn.addEventListener('click', () => {
    const plan = btn.dataset.plan;
    const sol  = btn.dataset.sol;
    if (!walletState.connected) {
      walletState.pendingPlan = plan;
      walletState.pendingSol  = sol;
      openWalletModal();
    } else {
      openPaymentModal(plan, sol);
    }
  });
});

// ── Free Plan Button ───────────────────────────────────────────────────────────
if (freePlanBtn) {
  freePlanBtn.addEventListener('click', () => {
    if (!walletState.connected) {
      openWalletModal();
    } else {
      showToast("✅ You're on the Free plan!");
    }
  });
}

// ── Connect Wallet Triggers ────────────────────────────────────────────────────
if (connectWalletBtn) {
  connectWalletBtn.addEventListener('click', () => {
    if (!walletState.connected) openWalletModal();
  });
}

if (heroConnectBtn) {
  heroConnectBtn.addEventListener('click', () => {
    if (!walletState.connected) openWalletModal();
    else showToast('✅ Wallet already connected: ' + walletState.address);
  });
}

// ── Sticky Navbar ──────────────────────────────────────────────────────────────
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
        animateCounter(el, target, 2000); // 2s ease-out as per spec
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
  const count  = 20; // lightweight: 20 dots for performance

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
