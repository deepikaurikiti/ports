// =============================================
//   DEEPIKA URIKITI — PORTFOLIO JAVASCRIPT
// =============================================

// ---- Custom Cursor ----
(function initCursor() {
  const moveCursor = (e) => {
    document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
  };
  document.addEventListener('mousemove', moveCursor);
})();

// ---- Particle System ----
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let mouse = { x: null, y: null };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => {
    resize();
    initParticleArray();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.3;
      this.color = Math.random() > 0.5
        ? `rgba(252, 188, 29, ${this.opacity})`
        : `rgba(255, 255, 255, ${this.opacity * 0.8})`;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      // Mouse repulsion
      if (mouse.x && mouse.y) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          this.x += (dx / dist) * force * 1.5;
          this.y += (dy / dist) * force * 1.5;
        }
      }
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticleArray() {
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    particles = Array.from({ length: Math.min(count, 100) }, () => new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / 150) * 0.35;
          ctx.strokeStyle = `rgba(252, 188, 29, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  initParticleArray();
  animate();
})();

// ---- Navbar Scroll Effect ----
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
      if (link) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
})();

// ---- Role Text Typewriter ----
(function initTypewriter() {
  const roles = [
    'AI/ML Engineer',
    'Deep Learning Dev',
    'NLP Enthusiast',
    'Computer Vision Dev',
    'Python Developer',
  ];
  const el = document.getElementById('role-animated');
  if (!el) return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function type() {
    const current = roles[roleIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 90;
    }

    if (!isDeleting && charIndex === current.length) {
      isDeleting = true;
      typeSpeed = 1800; // Pause before delete
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400;
    }
    setTimeout(type, typeSpeed);
  }
  setTimeout(type, 800);
})();

// ---- Stat Counter Animation (Hero + About) ----
(function initCounters() {
  const stats = document.querySelectorAll('.stat-number, .astat-num');
  if (!stats.length) return;

  function animateCount(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = Math.round(current);
    }, 16);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
})();

// ---- Scroll Reveal (data-reveal) ----
(function initScrollReveal() {
  const reveals = document.querySelectorAll('[data-reveal]');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, i * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
})();

// ---- Reveal on Scroll ----
(function initReveal() {
  const elements = document.querySelectorAll('.stat-card, .placeholder-content');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();

// ---- Smooth Scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Skills Tab Filter ----
(function initSkillsFilter() {
  const tabs = document.querySelectorAll('.skills-tab');
  const cards = document.querySelectorAll('.skill-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;

      cards.forEach((card, i) => {
        const match = category === 'all' || card.dataset.category === category;
        if (match) {
          card.classList.remove('hidden');
          // Stagger re-entry animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.96)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, i * 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Initialize with active tab
  const activeTab = document.querySelector('.skills-tab.active');
  if (activeTab) {
    activeTab.click();
  }
})();


window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});

// ---- Experience Section ----
(function initExperience() {

  // ---- Carousel factory ----
  function makeCarousel(carouselId, prevBtnId, nextBtnId, dotsId) {
    const carousel = document.getElementById(carouselId);
    const prevBtn  = document.getElementById(prevBtnId);
    const nextBtn  = document.getElementById(nextBtnId);
    const dotsEl   = document.getElementById(dotsId);
    if (!carousel) return;

    const cards = carousel.querySelectorAll('.exp-card');
    let current = 0;

    // How many cards fit at once
    function visibleCount() {
      const w = carousel.parentElement.offsetWidth;
      if (w < 700) return 1;
      if (w < 1024) return 2;
      return 3;
    }

    const total = cards.length;

    // Build dots
    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      const pages = Math.ceil(total / visibleCount());
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('span');
        dot.className = 'exp-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsEl) return;
      const page = Math.floor(current / visibleCount());
      dotsEl.querySelectorAll('.exp-dot').forEach((d, i) => {
        d.classList.toggle('active', i === page);
      });
    }

    function goTo(page) {
      const vc = visibleCount();
      const maxPage = Math.ceil(total / vc) - 1;
      const targetPage = Math.max(0, Math.min(page, maxPage));
      current = targetPage * vc;

      // Slide
      const cardW = cards[0] ? cards[0].offsetWidth + 24 : 0; // 24 = gap
      carousel.style.transform = `translateX(-${current * cardW}px)`;

      updateDots();
      updateArrows();
    }

    function updateArrows() {
      if (!prevBtn || !nextBtn) return;
      const vc = visibleCount();
      prevBtn.classList.toggle('hidden', current === 0);
      nextBtn.classList.toggle('hidden', current + vc >= total);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
      goTo(Math.floor(current / visibleCount()) - 1);
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      goTo(Math.floor(current / visibleCount()) + 1);
    });

    // Touch/swipe support
    let touchStartX = 0;
    carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goTo(Math.floor(current / visibleCount()) + 1);
        else goTo(Math.floor(current / visibleCount()) - 1);
      }
    });

    // Init
    buildDots();
    updateArrows();
    window.addEventListener('resize', () => {
      buildDots();
      goTo(0);
    });
  }

  makeCarousel('carousel-career',      'career-prev',      'career-next',      'career-dots');
  makeCarousel('carousel-involvement', 'involvement-prev', 'involvement-next', 'involvement-dots');
  makeCarousel('carousel-hackathons',  'hackathons-prev',  'hackathons-next',  'hackathons-dots');

  // ---- Tab switching ----
  const tabs = document.querySelectorAll('.exp-tab');
  const wraps = {
    career:      document.querySelector('.exp-carousel-wrap:not([id])') || document.querySelectorAll('.exp-carousel-wrap')[0],
    involvement: document.getElementById('involvement-wrap'),
    hackathons:  document.getElementById('hackathons-wrap'),
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      Object.entries(wraps).forEach(([key, el]) => {
        if (!el) return;
        el.style.display = key === target ? 'block' : 'none';
      });
    });
  });

  // ---- Modal open/close ----
  document.querySelectorAll('.exp-learn-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.modal;
      const overlay = document.getElementById(modalId);
      if (overlay) {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const overlay = document.getElementById(btn.dataset.close);
      if (overlay) closeModal(overlay);
    });
  });

  // Close on overlay backdrop click
  document.querySelectorAll('.exp-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.exp-modal-overlay.open').forEach(o => closeModal(o));
    }
  });

})();

// ===== VISITOR COUNTER =====
(() => {
  const countEl = document.getElementById('visitor-count');
  if (!countEl) return;

  const namespace = 'deepikaurikiti-portfolio2026';
  const counter = 'visits';
  const alreadyCountedThisSession = sessionStorage.getItem('du-portfolio-visited');
  const endpoint = alreadyCountedThisSession
    ? `https://api.counterapi.dev/v1/${namespace}/${counter}`
    : `https://api.counterapi.dev/v1/${namespace}/${counter}/up`;

  fetch(endpoint)
    .then(res => res.json())
    .then(json => {
      const data = json.data || json;
      const value = data.count ?? data.up_count ?? data.value;
      countEl.textContent = value != null ? Number(value).toLocaleString() : '—';
      sessionStorage.setItem('du-portfolio-visited', '1');
    })
    .catch(() => {
      countEl.textContent = '—';
    });
})();
