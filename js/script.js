/* ============================================
   NEXUSCORE — Interactive JavaScript
   Premium animations & interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ===== 1. CUSTOM CURSOR =====
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorDot = document.getElementById('cursorDot');

  if (cursorGlow && cursorDot) {
    let mouseX = -100, mouseY = -100;
    let glowX = -100, glowY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorGlow.style.opacity = '1';
      cursorDot.style.opacity = '1';
    });
  }

  // ===== 2. NAVIGATION =====
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  });

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    });
  }

  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      if (hamburger) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 150;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ===== 3. PARTICLE CANVAS =====
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mousePX = -1000;
    let mousePY = -1000;

    function resizeCanvas() {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePX = e.clientX - rect.left;
      mousePY = e.clientY - rect.top;
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.5 ? '0,240,255' : '168,85,247';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        const dx = mousePX - this.x;
        const dy = mousePY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x -= dx * force * 0.01;
          this.y -= dy * force * 0.01;
        }
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + this.color + ',' + this.opacity + ')';
        ctx.fill();
      }
    }

    function initParticles() {
      const count = Math.min(Math.floor(canvas.width * canvas.height / 8000), 100);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - dist / 150) * 0.2;
            ctx.strokeStyle = 'rgba(0,240,255,' + opacity + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      drawConnections();
      requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
  }

  // ===== 4. NETWORK MAP SVG =====
  const networkSvg = document.getElementById('networkSvg');
  const networkContainer = document.getElementById('networkContainer');
  let networkNodes = [];

  if (networkSvg && networkContainer) {
    function drawNetworkLines() {
      const nodes = networkContainer.querySelectorAll('.network-node');
      networkNodes = Array.from(nodes);
      if (nodes.length < 2) return;

      networkSvg.innerHTML = '';
      const containerRect = networkContainer.getBoundingClientRect();
      const positions = [];

      nodes.forEach((node, i) => {
        const rect = node.getBoundingClientRect();
        positions.push({
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2
        });
        node.style.opacity = '0';
        node.style.transform = 'scale(0)';
        setTimeout(() => {
          node.style.transition = 'all 0.6s cubic-bezier(0.16,1,0.3,1)';
          node.style.opacity = '1';
          node.style.transform = 'scale(1)';
        }, 100 + i * 80);
      });

      const connections = [
        [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],
        [1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[1,9],
        [9,3],[7,2],[6,4],[8,5]
      ];

      const svgNS = 'http://www.w3.org/2000/svg';

      connections.forEach(function(conn) {
        var from = conn[0];
        var to = conn[1];
        if (positions[from] && positions[to]) {
          var line = document.createElementNS(svgNS, 'line');
          line.setAttribute('x1', positions[from].x);
          line.setAttribute('y1', positions[from].y);
          line.setAttribute('x2', positions[to].x);
          line.setAttribute('y2', positions[to].y);
          line.style.stroke = 'rgba(0,240,255,0.1)';
          line.style.strokeWidth = '1';
          line.style.strokeDasharray = '4';
          networkSvg.appendChild(line);

          var glow = document.createElementNS(svgNS, 'line');
          glow.setAttribute('x1', positions[from].x);
          glow.setAttribute('y1', positions[from].y);
          glow.setAttribute('x2', positions[to].x);
          glow.setAttribute('y2', positions[to].y);
          glow.style.stroke = 'rgba(0,240,255,0.03)';
          glow.style.strokeWidth = '4';
          glow.style.filter = 'blur(2px)';
          networkSvg.appendChild(glow);
        }
      });
    }

    drawNetworkLines();
    window.addEventListener('resize', drawNetworkLines);
  }

  // ===== 5. MAGNETIC BUTTONS =====
  document.querySelectorAll('[data-magnetic]').forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });
    btn.addEventListener('mouseleave', function() {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  // ===== 6. 3D TILT =====
  document.querySelectorAll('[data-tilt]').forEach(function(card) {
    var inner = card.querySelector('.service-card-inner, .team-card-inner, .stat-card-inner, .about-card');
    var glow = card.querySelector('.card-glow');

    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rotateX = (y - cy) / cy * -8;
      var rotateY = (x - cx) / cx * 8;

      if (inner) {
        inner.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02,1.02,1.02)';
      }
      if (glow) {
        glow.style.setProperty('--mouse-x', x + 'px');
        glow.style.setProperty('--mouse-y', y + 'px');
      }
    });

    card.addEventListener('mouseleave', function() {
      if (inner) {
        inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      }
    });
  });

  // ===== 7. SCROLL ANIMATIONS (AOS) =====
  var aosElements = document.querySelectorAll('[data-aos]');
  var aosObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var delay = parseInt(entry.target.getAttribute('data-aos-delay')) || 0;
        setTimeout(function() {
          entry.target.classList.add('aos-animate');
        }, delay);
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  aosElements.forEach(function(el) { aosObserver.observe(el); });

  // ===== 8. ANIMATED COUNTER =====
  var countEls = document.querySelectorAll('[data-count]');
  var counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  countEls.forEach(function(el) { counterObserver.observe(el); });

  function animateCounter(el, target) {
    var duration = 2000;
    var steps = 60;
    var increment = target / steps;
    var current = 0;
    var stepCount = 0;

    function format(n) {
      if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
      if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
      return Math.floor(n).toString();
    }

    var timer = setInterval(function() {
      stepCount++;
      current += increment;
      if (stepCount >= steps) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = format(current);
    }, duration / steps);
  }

  // ===== 9. NEWSLETTER FORM =====
  var newsletterForm = document.getElementById('newsletterForm');
  var formMessage = document.getElementById('formMessage');

  if (newsletterForm && formMessage) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = document.getElementById('newsletterEmail').value.trim();

      if (!email) {
        formMessage.textContent = 'Please enter your email address.';
        formMessage.className = 'form-message error';
        return;
      }

      var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
        formMessage.textContent = 'Please enter a valid email.';
        formMessage.className = 'form-message error';
        return;
      }

      formMessage.textContent = 'Thanks for subscribing! Check your inbox.';
      formMessage.className = 'form-message success';
      newsletterForm.reset();

      setTimeout(function() {
        formMessage.textContent = '';
        formMessage.className = 'form-message';
      }, 4000);
    });
  }

  // ===== 10. MARQUEE TICKER =====
  var tickerTrack = document.getElementById('tickerTrack');
  if (tickerTrack) {
    var spans = tickerTrack.querySelectorAll('span');
    if (spans.length > 0) {
      var content = spans[0].textContent;
      if (spans.length < 2) {
        var clone = document.createElement('span');
        clone.textContent = content;
        tickerTrack.appendChild(clone);
      }
    }
  }

  // ===== 11. TEXT UNSCRAMBLE EFFECT =====
  var heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    var textSpans = heroTitle.querySelectorAll('span');
    textSpans.forEach(function(span, idx) {
      var original = span.textContent;
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
      var iters = 0;

      function scramble() {
        if (iters > 20) {
          span.textContent = original;
          return;
        }
        var scrambled = original.split('').map(function(char, i) {
          if (char === ' ') return ' ';
          if (i < iters * 0.5) return original[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        span.textContent = scrambled;
        iters++;
        setTimeout(scramble, 40 + idx * 20);
      }

      setTimeout(scramble, idx * 300);
    });
  }

  // ===== 12. SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      var id = anchor.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== 13. TIMELINE ACTIVE STATE =====
  var timelineItems = document.querySelectorAll('.timeline-item');
  var tlObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      var dot = entry.target.querySelector('.marker-dot');
      if (dot) {
        if (entry.isIntersecting) {
          dot.style.background = 'var(--cyan)';
          dot.style.boxShadow = '0 0 20px rgba(0,240,255,0.3), 0 0 0 6px rgba(0,240,255,0.1)';
        } else {
          dot.style.background = 'var(--bg-base)';
          dot.style.boxShadow = '0 0 0 4px rgba(0,240,255,0.05)';
        }
      }
    });
  }, { threshold: 0.3 });

  timelineItems.forEach(function(item) { tlObserver.observe(item); });

  // ===== 14. NETWORK NODE HOVER =====
  if (networkNodes.length > 0) {
    networkNodes.forEach(function(node) {
      node.addEventListener('mouseenter', function() {
        var lines = document.querySelectorAll('#networkSvg line');
        if (!networkContainer) return;
        var cr = networkContainer.getBoundingClientRect();
        var nr = node.getBoundingClientRect();
        var nx = nr.left - cr.left + nr.width / 2;
        var ny = nr.top - cr.top + nr.height / 2;

        lines.forEach(function(line) {
          var x1 = parseFloat(line.getAttribute('x1'));
          var y1 = parseFloat(line.getAttribute('y1'));
          var dist = Math.sqrt(Math.pow(x1 - nx, 2) + Math.pow(y1 - ny, 2));
          if (dist < 10) {
            line.style.stroke = 'rgba(0,240,255,0.4)';
            line.style.strokeWidth = '2';
          }
        });
      });

      node.addEventListener('mouseleave', function() {
        var lines = document.querySelectorAll('#networkSvg line');
        lines.forEach(function(line) {
          line.style.stroke = 'rgba(0,240,255,0.1)';
          line.style.strokeWidth = '1';
        });
      });
    });
  }

  // ===== 15. HERO PARALLAX =====
  var heroContent = document.querySelector('.hero-content');
  var heroBg = document.querySelector('.hero-bg');

  if (heroContent && heroBg) {
    window.addEventListener('mousemove', function(e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 20;
      var y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroContent.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      heroBg.style.transform = 'translate(' + (-x * 0.5) + 'px, ' + (-y * 0.5) + 'px)';
    });
  }

  console.log('NexusCore — Interactive experience initialized.');

});