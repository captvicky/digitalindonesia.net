/* =========================================================
   GunaWisese Digital Kreasi — Interactive Features
   ========================================================= */

(function () {
  'use strict';

  // ---- Parallax Hero Background ----
  var heroSection = document.getElementById('hero');
  var heroBg = document.querySelector('.hero__bg');

  function initParallax() {
    if (!heroSection || !heroBg) return;
    var bgUrl = heroSection.getAttribute('data-parallax-bg');
    if (bgUrl) {
      heroBg.style.backgroundImage = 'url(' + bgUrl + ')';
    }
  }

  function updateParallax() {
    if (!heroSection || !heroBg) return;
    var scrollTop = window.scrollY;
    var heroTop = heroSection.offsetTop;
    var heroHeight = heroSection.offsetHeight;
    var offset = scrollTop - heroTop;

    // Efek parallax: bergerak lebih lambat dari scroll
    if (offset > 0 && offset < heroHeight) {
      heroBg.style.transform = 'translateY(' + (offset * 0.4) + 'px)';
    } else if (offset <= 0) {
      heroBg.style.transform = 'translateY(0px)';
    }
  }

  initParallax();
  window.addEventListener('scroll', updateParallax);
  window.addEventListener('resize', updateParallax);

  // ---- Active nav link on scroll ----
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav__link');

  function updateActiveNav() {
    var current = '';
    sections.forEach(function (section) {
      var top = section.offsetTop - 120;
      var bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('nav__link--active');
      if (link.dataset.section === current) {
        link.classList.add('nav__link--active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  window.addEventListener('load', updateActiveNav);

  // ---- Scroll to Explore ----
  var scrollLabel = document.querySelector('.hero__scroll');
  if (scrollLabel) {
    scrollLabel.addEventListener('click', function () {
      var aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ---- Smooth scroll for nav links ----
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ---- Smooth scroll for CTA button ----
  var cta = document.querySelector('.nav__cta');
  if (cta) {
    cta.addEventListener('click', function (e) {
      e.preventDefault();
      var contact = document.getElementById('contact');
      if (contact) {
        contact.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

})();
