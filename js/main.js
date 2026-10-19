/* =====================================================
   OLDE WILLOW TREE CAFE — Main JavaScript
   ===================================================== */

(function () {
  'use strict';

  /* ---- Loader ---- */
  window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(function () {
        loader.classList.add('hidden');
      }, 900);
    }
  });

  /* ---- Header Scroll Effect ---- */
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', function () {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  /* ---- Active Nav Link ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observerNav = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(function (section) { observerNav.observe(section); });

  /* ---- Mobile Nav ---- */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMobileNav() {
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', openMobileNav);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---- Smooth Scroll for All Anchor Links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Menu Tabs ---- */
  window.switchTab = function (tabName) {
    // Hide all panels
    document.querySelectorAll('.menu-panel').forEach(function (panel) {
      panel.classList.remove('active');
    });
    // Deactivate all tabs
    document.querySelectorAll('.menu-tab').forEach(function (tab) {
      tab.classList.remove('active');
    });
    // Activate target
    const panel = document.getElementById('panel-' + tabName);
    const tab   = document.getElementById('tab-' + tabName);
    if (panel) panel.classList.add('active');
    if (tab)   tab.classList.add('active');
  };

  /* ---- Scroll Reveal Animation ---- */
  const revealEls = document.querySelectorAll('.reveal');

  const observerReveal = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('visible');
        }, i * 80);
        observerReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(function (el) { observerReveal.observe(el); });

  /* ---- Rating Bar Animation ---- */
  const barFills = document.querySelectorAll('.rating-bar-fill');
  const observerBars = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        barFills.forEach(function (bar) {
          const width = bar.style.width;
          bar.style.width = '0%';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              bar.style.width = width;
            });
          });
        });
        observerBars.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const reviewsSection = document.getElementById('reviews');
  if (reviewsSection) observerBars.observe(reviewsSection);

  /* ---- Back to Top ---- */
  const backTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) {
      backTop.classList.add('visible');
    } else {
      backTop.classList.remove('visible');
    }
  }, { passive: true });

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Today's Hours Dynamic Display ---- */
  function updateTodayHours() {
    const todayEl = document.getElementById('todayHours');
    if (!todayEl) return;
    const day = new Date().getDay(); // 0=Sun,1=Mon,...,6=Sat
    const openDays = { 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
    if (openDays[day]) {
      todayEl.innerHTML = '<span style="color:var(--clr-green);font-weight:700;">Open Today</span> · 8:00 AM – 3:00 PM';
    } else {
      todayEl.innerHTML = '<span style="color:#e87070;font-weight:700;">Closed Today</span> · Open Wed–Sat 8AM–3PM';
    }
  }
  updateTodayHours();

  /* ---- Announcement Bar rotating messages ---- */
  const announcements = [
    '🍂 Now Open <span>Wed – Sat · 8:00 AM – 3:00 PM</span> &nbsp;|&nbsp; Fresh homemade specials daily &nbsp;|&nbsp; 📍 10 N College St, Myerstown, PA',
    '☕ Start your morning right — homemade waffles &amp; fresh brewed coffee await! &nbsp;|&nbsp; <span>Rated 4.8⭐ by our community</span>',
    '🏠 Dining + Shopping — visit our attached <span>Primitive Craft Shop</span> after your meal! &nbsp;|&nbsp; Open Wed–Sat',
  ];
  let annIdx = 0;
  const annBar = document.querySelector('.announcement-bar');

  if (annBar) {
    setInterval(function () {
      annIdx = (annIdx + 1) % announcements.length;
      annBar.style.opacity = '0';
      setTimeout(function () {
        annBar.innerHTML = announcements[annIdx];
        annBar.style.opacity = '1';
      }, 400);
    }, 5000);
    annBar.style.transition = 'opacity 0.4s ease';
  }

  /* ---- Gallery Lightbox (Simple) ---- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img = item.querySelector('img');
      if (!img) return;
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;cursor:zoom-out;animation:fadeIn 0.3s ease;';
      const image = document.createElement('img');
      image.src = img.src;
      image.alt = img.alt;
      image.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5);';
      overlay.appendChild(image);
      document.body.appendChild(overlay);
      overlay.addEventListener('click', function () {
        document.body.removeChild(overlay);
      });
    });
  });

  /* ---- Menu Card hover tilt effect ---- */
  const cards = document.querySelectorAll('.menu-card, .event-card');
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      const tiltX = (y / rect.height) * 6;
      const tiltY = -(x / rect.width) * 6;
      card.style.transform = 'translateY(-6px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.style.transition = 'all 0.35s cubic-bezier(0.4,0,0.2,1)';
    });
  });

})();
