/* ── Mobile menu toggle ─────────────────────────────── */
(function () {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var body = document.body;

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  /* Close menu when a link is tapped */
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      body.style.overflow = '';
    });
  });

  /* ── Nav scroll effect: bg + hide/show ────────────── */
  var nav = document.getElementById('nav');
  var lastScrollY = 0;
  var scrollThreshold = 40;

  window.addEventListener('scroll', function () {
    var currentY = window.scrollY;

    // Background blur toggle
    if (currentY > scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Hide on scroll down, show on scroll up
    if (currentY > lastScrollY && currentY > scrollThreshold) {
      nav.classList.add('nav--hidden');
    } else {
      nav.classList.remove('nav--hidden');
    }

    lastScrollY = currentY;
  }, { passive: true });
})();

/* ── Scroll Animation System (IntersectionObserver) ──── */
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Hero entrance on page load ─────────────────────── */
  var hero = document.querySelector('.hero');
  if (!prefersReduced) {
    /* Double-rAF ensures the browser has painted opacity:0 before
       we trigger the transition to opacity:1 */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add('hero--entered');
      });
    });
  } else {
    hero.classList.add('hero--entered');
  }

})();

/* ── Scroll animations (upgraded) ───────────────────── */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Split section headlines into word spans ────── */
  var headlines = document.querySelectorAll(
    '.about__headline, .what-we-buy__headline, .pricing__headline,' +
    '.regulations__headline, .locations__headline, .services__headline, .gateway__headline, .cta__headline, .contact__headline'
  );

  headlines.forEach(function (h) {
    // Remove fade-in class — we handle these ourselves
    h.classList.remove('fade-in');

    var text = h.textContent;
    var words = text.split(/\s+/);
    // Preserve the ::before pseudo-element by keeping it implicit
    h.innerHTML = '';
    words.forEach(function (word) {
      var span = document.createElement('span');
      span.className = 'section-word';
      span.textContent = word;
      h.appendChild(document.createTextNode(' '));
      h.appendChild(span);
    });

    if (reduced) return;

    // Make headline visible (words handle their own reveal)
    h.style.opacity = '1';
    h.style.transform = 'none';
  });

  if (reduced) return;

  /* ── 2. Headline word observer ────────────────────── */
  var headlineObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var words = e.target.querySelectorAll('.section-word');
      words.forEach(function (w, i) {
        w.style.transitionDelay = (i * 80) + 'ms';
        // Force reflow before adding class
        void w.offsetWidth;
        w.classList.add('revealed');
      });
      headlineObs.unobserve(e.target);
    });
  }, { threshold: 0.2 });

  headlines.forEach(function (h) { headlineObs.observe(h); });

  /* ── 3. Stagger What We Buy cards ─────────────────── */
  var cards = document.querySelectorAll('.what-we-buy__card');
  cards.forEach(function (card) {
    card.classList.remove('fade-in');
    card.classList.add('stagger-card');
  });

  var cardObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      // Find all sibling cards in this grid and stagger them
      var grid = e.target.parentElement;
      if (grid._staggerDone) return;
      grid._staggerDone = true;
      var siblings = grid.querySelectorAll('.stagger-card');
      siblings.forEach(function (c, i) {
        c.style.transitionDelay = (i * 100) + 'ms';
        void c.offsetWidth;
        c.classList.add('revealed');
        cardObs.unobserve(c);
      });
    });
  }, { threshold: 0.1 });

  cards.forEach(function (c) { cardObs.observe(c); });

  /* ── 4. Stagger pricing table rows ────────────────── */
  var tableWraps = document.querySelectorAll('.pricing__table-wrap');
  tableWraps.forEach(function (tableWrap) {
    var rows = tableWrap.querySelectorAll('tbody tr');
    rows.forEach(function (row) {
      row.classList.add('stagger-row');
    });

    var rowObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        rows.forEach(function (row, i) {
          row.style.transitionDelay = (i * 50) + 'ms';
          void row.offsetWidth;
          row.classList.add('revealed');
        });
        rowObs.unobserve(e.target);
      });
    }, { threshold: 0.1 });
    rowObs.observe(tableWrap);
  });

  /* ── 5. Standard fade-in (everything else) ────────── */
  document.querySelectorAll('.fade-in').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
  });
  var fadeObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade-in').forEach(function (el) { fadeObs.observe(el); });
})();

/* ── Stat count-up animation ─────────────────────────── */
(function () {
  var els = document.querySelectorAll('[data-count-to]');
  if (!els.length) return;

  var duration = 1500;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateValue(el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value = Math.round(easeOutCubic(progress) * target);
      el.textContent = prefix + value;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  var countObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        animateValue(e.target);
        countObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(function (el) { countObs.observe(el); });
})();

/* ── Lenis smooth scroll ─────────────────────────────── */
(function () {
  var lenis = new Lenis({
    duration: 1.2,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
})();

/* ── Parallax on background images ───────────────────── */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var wraps = document.querySelectorAll('[data-parallax]');
  if (!wraps.length) return;

  function updateParallax() {
    var wh = window.innerHeight;
    wraps.forEach(function (wrap) {
      var rect = wrap.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > wh) return;
      // progress: 0 when section enters bottom, 1 when it exits top
      var progress = (wh - rect.top) / (wh + rect.height);
      // map 0..1 to -80..+80
      var offset = (progress - 0.5) * 160;
      wrap.firstElementChild.style.setProperty('--parallax', offset + 'px');
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
})();
