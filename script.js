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

// ── Wallet Connection & Payment Flow ──────────────────────────────────────────
const walletModal    = document.getElementById('walletModal');
const paymentModal   = document.getElementById('paymentModal');
const paymentDetails = document.getElementById('paymentDetails');
const toast          = document.getElementById('toast');

let connectedWallet = null;
let pendingPlan     = null;

/** Show a toast notification */
function showToast(msg, durationMs = 3500) {
  if (!toast) return;
  toast.removeAttribute('hidden');
  toast.textContent = msg;
  void toast.offsetWidth; // force reflow so transition plays
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.setAttribute('hidden', ''), 350);
  }, durationMs);
}

/** Open the wallet selection modal */
function openWalletModal() {
  if (!walletModal) return;
  walletModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

/** Close the wallet modal */
function closeWalletModal() {
  if (!walletModal) return;
  walletModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

/** Update all wallet button UI to reflect connected state */
function setWalletConnectedUI(address) {
  const shortened = address.slice(0, 4) + '…' + address.slice(-4);

  document.querySelectorAll('.wA3qlCkq').forEach(el => {
    el.classList.remove('aoBJe4DN');
    el.classList.add('wallet-connected');
    el.innerHTML = `<span class="wallet-dot"></span>${shortened}`;
    el.disabled = true;
  });
}

/** Simulate wallet connection for a given wallet name */
function connectWallet(walletName) {
  closeWalletModal();
  showToast(`Connecting to ${walletName}…`);

  setTimeout(() => {
    const fakeAddress =
      'So1' +
      Math.random().toString(36).substring(2, 10).toUpperCase() +
      'pump' +
      Math.random().toString(36).substring(2, 6).toUpperCase();
    connectedWallet = { name: walletName, address: fakeAddress };

    setWalletConnectedUI(fakeAddress);
    showToast(`✓ ${walletName} connected: ${fakeAddress.slice(0, 4)}…${fakeAddress.slice(-4)}`);

    if (pendingPlan) {
      setTimeout(() => openPaymentModal(pendingPlan), 600);
      pendingPlan = null;
    }
  }, 1200);
}

/** Open the payment confirmation modal */
function openPaymentModal(plan) {
  if (!paymentModal || !paymentDetails) return;
  paymentDetails.textContent =
    `You are about to pay ${plan.sol} SOL for the ${plan.name} plan. ` +
    `This will be sent from your connected wallet.`;
  paymentModal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

/** Close the payment modal */
function closePaymentModal() {
  if (!paymentModal) return;
  paymentModal.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

// Wallet option clicks
document.querySelectorAll('.wallet-option').forEach(opt => {
  opt.addEventListener('click', () => {
    if (opt.classList.contains('loading')) return;
    opt.classList.add('loading');
    connectWallet(opt.dataset.wallet);
  });
});

// Close wallet modal button
const closeWalletBtn = document.getElementById('closeWalletModal');
if (closeWalletBtn) closeWalletBtn.addEventListener('click', closeWalletModal);

// Close modals on backdrop click
[walletModal, paymentModal].forEach(modal => {
  if (!modal) return;
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  });
});

// Cancel payment
const cancelPaymentBtn = document.getElementById('cancelPayment');
if (cancelPaymentBtn) cancelPaymentBtn.addEventListener('click', closePaymentModal);

// Confirm payment (stub — replace with real on-chain tx)
const confirmPaymentBtn = document.getElementById('confirmPayment');
if (confirmPaymentBtn) {
  confirmPaymentBtn.addEventListener('click', () => {
    closePaymentModal();
    showToast('⏳ Transaction submitted… waiting for confirmation.');
    setTimeout(() => {
      showToast('✓ Payment confirmed! Welcome to PumpAnalyzer.', 5000);
    }, 2500);
  });
}

// All "Connect Wallet" / plan-purchase triggers
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.aoBJe4DN');
  if (!btn) return;

  const plan      = btn.dataset.plan;
  const solAmount = btn.dataset.sol;

  if (plan && solAmount) {
    if (!connectedWallet) {
      pendingPlan = { name: plan, sol: solAmount };
      openWalletModal();
    } else {
      openPaymentModal({ name: plan, sol: solAmount });
    }
  } else {
    if (!connectedWallet) openWalletModal();
  }
});
