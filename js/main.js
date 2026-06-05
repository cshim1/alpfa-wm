/* ============================================
   ALPFA W&M — Main JS
   ============================================ */

// ============================================
// CUSTOM CURSOR
// ============================================

const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');

if (dot && ring) {
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with lerp for smooth trail
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover effect on interactive elements
  const interactives = document.querySelectorAll(
    'a, button, .btn, .event-card, .feature-card, .tier-card, .board-card, .gallery-item, .sponsor-name'
  );

  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });
}

// ============================================
// NAV SCROLL EFFECT
// ============================================

const nav = document.getElementById('nav');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ============================================
// MOBILE NAV
// ============================================

const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close on nav link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================
// SCROLL REVEAL
// ============================================

const revealEls = document.querySelectorAll('[data-reveal]');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.style.transitionDelay || '0s';
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ============================================
// STAT COUNTER ANIMATION
// ============================================

function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();

  const tick = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString() + suffix;
  };

  requestAnimationFrame(tick);
}

const statNums = document.querySelectorAll('[data-count]');

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statObserver.observe(el));

// ============================================
// IMAGE LOAD — show img, hide placeholder
// ============================================

document.querySelectorAll('.image-frame img').forEach(img => {
  if (img.complete && img.naturalWidth > 0) {
    img.classList.add('loaded');
    const placeholder = img.nextElementSibling;
    if (placeholder && placeholder.classList.contains('img-placeholder')) {
      placeholder.style.display = 'none';
    }
  } else {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
      const placeholder = img.nextElementSibling;
      if (placeholder && placeholder.classList.contains('img-placeholder')) {
        placeholder.style.display = 'none';
      }
    });
  }
});

// ============================================
// HERO LOGO — 3D TILT + SHINE
// ============================================

(function() {
  const wrap = document.querySelector('.hero-logo-wrap');
  if (!wrap) return;

  // create shine overlay
  const shine = document.createElement('div');
  shine.className = 'hero-logo-shine';
  wrap.appendChild(shine);

  document.addEventListener('mousemove', function(e) {
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / 18;
    const dy = (e.clientY - cy) / 18;

    wrap.style.transform = `perspective(700px) rotateY(${dx}deg) rotateX(${-dy}deg) scale(1.04)`;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    shine.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.08) 40%, transparent 65%)`;
    shine.style.opacity = '1';
  });

  wrap.addEventListener('mouseleave', function() {
    wrap.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1)';
    shine.style.opacity = '0';
  });
})();
