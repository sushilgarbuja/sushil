/* ==========================================================================
   SUSHIL GARBUJA — script.js
   Vanilla JS only. No frameworks, no build step.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initStickyHeader();
  initMobileMenu();
  initSmoothScrollAndActiveNav();
  initRidgeProgress();
  initScrollReveal();
  initTypingEffect();
  initCounters();
  initProjectFilter();
  initContactForm();
  initBackToTop();
  initCurrentYear();
  initSourceProtection();
  initBlogModal();
});

/* ---------- 1. THEME TOGGLE (dark/light, persisted in localStorage) ---------- */
function initThemeToggle() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const icon = toggleBtn.querySelector('i');
  const STORAGE_KEY = 'sg-theme';

  const applyTheme = (theme) => {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      toggleBtn.setAttribute('aria-label', 'Switch to dark mode');
      toggleBtn.setAttribute('aria-pressed', 'true');
    } else {
      root.removeAttribute('data-theme');
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      toggleBtn.setAttribute('aria-label', 'Switch to light mode');
      toggleBtn.setAttribute('aria-pressed', 'false');
    }
  };

  // Load saved preference, otherwise respect system preference once.
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });
}

/* ---------- 2. STICKY HEADER ---------- */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- 3. MOBILE MENU ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });

  // Close the mobile menu whenever a nav link is tapped.
  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    });
  });
}

/* ---------- 4. SMOOTH SCROLL + ACTIVE NAV INDICATOR ---------- */
function initSmoothScrollAndActiveNav() {
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  // Native CSS smooth-scroll already handles the animation (html { scroll-behavior: smooth }),
  // so JS just needs to track which section is active.
  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- 5. SCROLL PROGRESS BAR ---------- */
function initRidgeProgress() {
  const fill = document.getElementById('scrollProgressFill');
  if (!fill) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    fill.style.width = `${progress * 100}%`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* ---------- 6. SCROLL REVEAL (Intersection Observer) ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('[data-reveal]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-reveal-delay');
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add('in-view');
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------- 7. HERO TYPING EFFECT ---------- */
function initTypingEffect() {
  const target = document.getElementById('typingTarget');
  if (!target) return;

  const fullText = target.getAttribute('data-full-text') || target.textContent.trim();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    target.textContent = fullText;
    return;
  }

  target.textContent = '';
  let i = 0;
  const speed = 18; // ms per character

  const type = () => {
    if (i <= fullText.length) {
      target.textContent = fullText.slice(0, i);
      i += 1;
      requestAnimationFrame(() => setTimeout(type, speed));
    }
  };

  // Start once the hero is visible, so the effect greets the visitor on load.
  type();
}

/* ---------- 8. COUNTER ANIMATION (Achievements) ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(eased * target);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ---------- 9. PROJECT FILTERING ---------- */
function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  const emptyState = document.getElementById('filterEmpty');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');
      let visibleCount = 0;

      cards.forEach((card) => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        const matches = filter === 'all' || categories.includes(filter);
        card.classList.toggle('filtered-out', !matches);
        if (matches) visibleCount += 1;
      });

      emptyState.classList.toggle('hidden', visibleCount !== 0);
    });
  });
}

/* ---------- 10. CONTACT FORM VALIDATION (front-end only, no backend) ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: { input: document.getElementById('fieldName'), error: document.getElementById('errorName') },
    email: { input: document.getElementById('fieldEmail'), error: document.getElementById('errorEmail') },
    subject: { input: document.getElementById('fieldSubject'), error: document.getElementById('errorSubject') },
    message: { input: document.getElementById('fieldMessage'), error: document.getElementById('errorMessage') },
  };
  const note = document.getElementById('formNote');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setError = (key, message) => {
    const { input, error } = fields[key];
    const row = input.closest('.form-row');
    error.textContent = message;
    row.classList.toggle('has-error', Boolean(message));
  };

  const validate = () => {
    let isValid = true;

    if (!fields.name.input.value.trim()) {
      setError('name', 'Please enter your name.');
      isValid = false;
    } else {
      setError('name', '');
    }

    const emailValue = fields.email.input.value.trim();
    if (!emailValue) {
      setError('email', 'Please enter your email.');
      isValid = false;
    } else if (!emailPattern.test(emailValue)) {
      setError('email', 'Please enter a valid email address.');
      isValid = false;
    } else {
      setError('email', '');
    }

    if (!fields.subject.input.value.trim()) {
      setError('subject', 'Please enter a subject.');
      isValid = false;
    } else {
      setError('subject', '');
    }

    if (!fields.message.input.value.trim()) {
      setError('message', 'Please write a short message.');
      isValid = false;
    } else {
      setError('message', '');
    }

    return isValid;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    note.classList.remove('success');

    if (!validate()) {
      note.textContent = 'Please fix the highlighted fields and try again.';
      return;
    }

    // IMPORTANT: There is no backend on this static site.
    // Nothing is actually sent anywhere — this only confirms the form works client-side.
    note.textContent =
      'This form is currently front-end only, so your message was not sent to a server. Please reach out directly by phone or email above.';
    note.classList.add('success');
    form.reset();
  });

  // Clear individual field errors as the person types.
  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('input', () => setError(key, ''));
  });
}

/* ---------- 11. BACK TO TOP ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggleVisibility = () => {
    btn.classList.toggle('visible', window.scrollY > 480);
  };
  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- 12. CURRENT YEAR ---------- */
function initCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = String(new Date().getFullYear());
}

/* ---------- 13b. BLOG POST MODAL ---------- */
function initBlogModal() {
  const overlay = document.getElementById('blogModalOverlay');
  if (!overlay) return;

  const modal = document.getElementById('blogModal');
  const closeBtn = document.getElementById('blogModalClose');
  const titleEl = document.getElementById('blogModalTitle');
  const categoryEl = document.getElementById('blogModalCategory');
  const dateEl = document.getElementById('blogModalDate');
  const bodyEl = document.getElementById('blogModalBody');

  // Full post content, keyed by the data-post id set on each "Read More" link.
  const posts = {
    1: {
      category: 'Technology',
      date: 'Jan 10, 2026',
      title: 'Why Rural Municipalities Need Better Websites',
      body: `
        <p>Most municipality websites in Nepal are built once, launched, and then quietly forgotten. Notices go stale, phone numbers are wrong, and the "downloads" page still points to a PDF from three fiscal years ago. For a citizen trying to find a form or a service fee, that's the difference between a five-minute visit and a wasted trip to the ward office.</p>
        <h3>What actually gets used</h3>
        <p>In my experience building systems for local government, the pages that see real traffic are narrow and practical: current notices, downloadable forms, contact details for each ward, and a clear list of services with their fees and required documents. Everything else is decoration.</p>
        <ul>
          <li>A notice board that staff can update without calling a developer</li>
          <li>Search that actually finds documents, not just page titles</li>
          <li>Mobile-first layout, since most visitors are on phones</li>
        </ul>
        <h3>The maintenance problem</h3>
        <p>The bigger issue isn't the first build, it's what happens after handover. A simple admin panel that ward staff can use themselves keeps a site alive far longer than any one-time design refresh.</p>
      `,
    },
    2: {
      category: 'AI',
      date: 'Dec 2, 2025',
      title: 'Getting Started with AI Tools as a Solo Developer',
      body: `
        <p>Working alone on client projects means every hour matters. Over the past year I've folded AI coding assistants into my daily workflow, not to write entire features unsupervised, but to remove the parts of the job that eat time without adding much value.</p>
        <h3>Where it actually helps</h3>
        <ul>
          <li>Scaffolding boilerplate for a new Django app or REST endpoint</li>
          <li>Writing first-draft documentation and README files</li>
          <li>Explaining an unfamiliar error message or stack trace quickly</li>
          <li>Generating test cases for edge conditions I might overlook</li>
        </ul>
        <h3>Where I still do it myself</h3>
        <p>Architecture decisions, database schema design, and anything touching authentication or payments still get my full attention line by line. AI output is a starting point, not a final answer, and treating it otherwise is how bugs slip into production.</p>
        <p>The real skill isn't prompting well, it's knowing which parts of a project are safe to delegate and which ones need a human who understands the business behind the code.</p>
      `,
    },
    3: {
      category: 'Web Development',
      date: 'Oct 18, 2025',
      title: 'Django for Small Government Projects',
      body: `
        <p>When a municipality or small government office needs a web system, the temptation is to reach for whatever framework is trending. In practice, Django has been the better fit for almost every public-sector project I've worked on.</p>
        <h3>Why it fits small teams</h3>
        <ul>
          <li>The built-in admin panel means non-technical staff can manage records without extra tooling</li>
          <li>Batteries-included structure keeps a one- or two-person team from reinventing the wheel</li>
          <li>Strong conventions make it easier to hand a project off to another developer later</li>
        </ul>
        <h3>Practical trade-offs</h3>
        <p>Django isn't the fastest choice for a highly interactive front end, and for those parts I still lean on plain JavaScript or a lightweight framework where needed. But for the core of a government system, forms, records, permissions, and reporting, it stays reliable long after the initial handover.</p>
      `,
    },
    4: {
      category: 'IT Tips',
      date: 'Sep 5, 2025',
      title: 'A Simple IT Maintenance Checklist for Small Offices',
      body: `
        <p>Most office IT problems aren't dramatic, they're small things left unchecked for too long. A short weekly routine prevents the majority of issues I get called in to fix.</p>
        <h3>Weekly</h3>
        <ul>
          <li>Confirm backups actually completed, not just that the job ran</li>
          <li>Check disk space on the main server or shared drive</li>
          <li>Restart networking equipment that's been up for weeks without a reboot</li>
        </ul>
        <h3>Monthly</h3>
        <ul>
          <li>Apply pending OS and software updates during a low-traffic window</li>
          <li>Review user accounts and remove access for anyone who has left</li>
          <li>Test that the backup can actually be restored, not just that it exists</li>
        </ul>
        <p>None of this is complicated, it just needs to happen on a schedule instead of after something breaks.</p>
      `,
    },
    5: {
      category: 'Nepal Technology',
      date: 'Jul 22, 2025',
      title: 'Digital Transformation Outside the Big Cities',
      body: `
        <p>Digital transformation conversations in Nepal tend to center on Kathmandu, but the more interesting shifts are happening in smaller municipality offices where a single system change can affect an entire ward's daily workflow.</p>
        <h3>What changes first</h3>
        <p>It's rarely a big flashy platform. It starts with something small: digitizing a paper registration process, putting recommendation letters online, or letting staff search old records instead of digging through filing cabinets.</p>
        <ul>
          <li>Reduced waiting time for citizens requesting basic documents</li>
          <li>Fewer duplicate or lost paper records</li>
          <li>Staff spending less time on repetitive manual entry</li>
        </ul>
        <h3>What makes it stick</h3>
        <p>Training matters more than the software itself. A system nobody in the office knows how to use ends up abandoned within a year, no matter how well it was built.</p>
      `,
    },
    6: {
      category: 'Tutorials',
      date: 'May 14, 2025',
      title: 'Building Your First REST API with Django',
      body: `
        <p>A short, practical path for getting a working REST API up with Django, aimed at developers who are comfortable with Python but new to building APIs.</p>
        <h3>The basics</h3>
        <ul>
          <li>Start with Django REST Framework rather than building serialization by hand</li>
          <li>Define your models first, then let serializers mirror them closely</li>
          <li>Use viewsets and routers to avoid repetitive URL configuration</li>
        </ul>
        <h3>Common early mistakes</h3>
        <ul>
          <li>Skipping pagination, which causes problems the moment a table grows</li>
          <li>Returning raw model data without validating input on write requests</li>
          <li>Leaving debug mode and permissive CORS settings on in production</li>
        </ul>
        <p>Once the core endpoints work, add authentication and permissions early rather than bolting them on at the end. It's much harder to retrofit access control onto an API that was designed without it.</p>
      `,
    },
  };

  let lastFocused = null;

  const openModal = (id) => {
    const post = posts[id];
    if (!post) return;

    categoryEl.textContent = post.category;
    dateEl.textContent = post.date;
    titleEl.textContent = post.title;
    bodyEl.innerHTML = post.body;

    lastFocused = document.activeElement;
    overlay.hidden = false;
    document.body.classList.add('modal-open');
    // Next frame, so the transition actually animates in.
    requestAnimationFrame(() => overlay.classList.add('visible'));
    closeBtn.focus();
  };

  const closeModal = () => {
    overlay.classList.remove('visible');
    document.body.classList.remove('modal-open');
    const onEnd = () => {
      overlay.hidden = true;
      overlay.removeEventListener('transitionend', onEnd);
    };
    overlay.addEventListener('transitionend', onEnd);
    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll('.read-more[data-post]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openModal(link.getAttribute('data-post'));
    });
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.hidden) closeModal();
  });
}

/* ---------- 13. RIGHT-CLICK / VIEW-SOURCE DETERRENT ----------
   Note: this only discourages casual right-click / shortcut access.
   Anyone who really wants the source can still get it (view-source:,
   browser dev tools opened before load, saved page, network tab, etc.),
   since the browser must download the HTML/CSS/JS to render the page.
   Treat this as a light deterrent, not real protection. */
function initSourceProtection() {
  // Block the right-click context menu everywhere on the page.
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  // Block common "view source" / dev tools keyboard shortcuts.
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    const blockedCombo =
      key === 'f12' ||
      (event.ctrlKey && event.shiftKey && ['i', 'j', 'c'].includes(key)) || // devtools panels
      (event.ctrlKey && key === 'u') || // view-source
      (event.metaKey && event.altKey && ['i', 'j', 'c'].includes(key)); // Safari/Mac devtools

    if (blockedCombo) {
      event.preventDefault();
    }
  });

  // Discourage dragging images out to save them.
  document.addEventListener('dragstart', (event) => {
    if (event.target.tagName === 'IMG') event.preventDefault();
  });
}