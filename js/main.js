/* ============================================
   CRHLS – Main JavaScript (Fixed)
   ============================================ */

(function () {
  'use strict';

  // ── NAVIGATION ──────────────────────────────
  const header    = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');
  const backTop   = document.querySelector('.back-top');

  function onScroll() {
    const y = window.scrollY;
    if (header)  header.classList.toggle('scrolled', y > 50);
    if (backTop) backTop.classList.toggle('show', y > 400);
    revealInView();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navMenu.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', e => {
      if (header && !header.contains(e.target) && navMenu.classList.contains('open')) closeMenu();
    });
  }

  function closeMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Active nav link
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) link.classList.add('active');
  });

  // ── SCROLL REVEAL ────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  function revealInView() {
    const vh = window.innerHeight;
    revealEls.forEach(el => {
      if (el.classList.contains('in')) return;
      const top = el.getBoundingClientRect().top;
      // Generous threshold — reveal anything within or near the viewport
      if (top < vh + 80) el.classList.add('in');
    });
  }

  // Run on DOMContentLoaded, scroll, AND load
  document.addEventListener('DOMContentLoaded', () => {
    revealInView();
    onScroll();
  });

  window.addEventListener('load', () => {
    revealInView();
    // Second pass after fonts/images settle
    setTimeout(revealInView, 200);
  });

  // Hard failsafe: force-reveal ALL elements after 1.2 s
  // (covers browsers that throttle IO on file:// or slow connections)
  setTimeout(() => {
    revealEls.forEach(el => el.classList.add('in'));
  }, 1200);

  // Intersection Observer (progressive enhancement on top of the above)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  // ── COUNTER ANIMATION ────────────────────────
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const step     = target / (duration / 16);
    let   current  = 0;

    const tick = () => {
      current += step;
      if (current >= target) {
        el.textContent = target.toLocaleString() + suffix;
      } else {
        el.textContent = Math.floor(current).toLocaleString() + suffix;
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-target]').forEach(el => cio.observe(el));
  }

  // ── BACK TO TOP ──────────────────────────────
  if (backTop) {
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── CONTACT FORM ─────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn  = this.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
      btn.disabled  = true;

      setTimeout(() => {
        btn.innerHTML        = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = '#15803d';
        form.reset();
        setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; }, 3500);
      }, 1600);
    });
  }

  // ── NEWSLETTER FORM ──────────────────────────
  const newsForm = document.getElementById('newsletterForm');
  if (newsForm) {
    newsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = this.querySelector('button[type="submit"]');
      btn.textContent = '✓ Subscribed!';
      btn.disabled    = true;
      this.reset();
      setTimeout(() => { btn.textContent = 'Subscribe'; btn.disabled = false; }, 3000);
    });
  }

  // ── SMOOTH SCROLL ────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

})();
