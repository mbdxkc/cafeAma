/* =========================================================
   utils.js
   common ui interactions
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     mobile navigation toggle
     --------------------------------------------------------- */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.mobile-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.contains('is-active');

      menu.classList.toggle('is-active');
      toggle.setAttribute('aria-expanded', !isOpen);

      // prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // close menu on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-active')) {
        menu.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // close menu when clicking a link
    menu.addEventListener('click', function (e) {
      if (e.target.matches('a')) {
        menu.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------------------------------------------------------
     modal handling
     --------------------------------------------------------- */
  function initModals() {
    document.addEventListener('click', function (e) {
      // open modal
      var trigger = e.target.closest('[data-modal-open]');
      if (trigger) {
        var modalId = trigger.getAttribute('data-modal-open');
        var modal = document.getElementById(modalId);
        var overlay = document.querySelector('.overlay');

        if (modal) {
          modal.classList.add('is-active');
          if (overlay) overlay.classList.add('is-active');
          document.body.style.overflow = 'hidden';
        }
        return;
      }

      // close modal
      var closer = e.target.closest('[data-modal-close]');
      if (closer || e.target.matches('.overlay')) {
        closeAllModals();
      }
    });

    // close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });
  }

  function closeAllModals() {
    var modals = document.querySelectorAll('.modal.is-active');
    var overlay = document.querySelector('.overlay.is-active');

    modals.forEach(function (modal) {
      modal.classList.remove('is-active');
    });

    if (overlay) overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  /* ---------------------------------------------------------
     smooth scroll for anchor links
     --------------------------------------------------------- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      var headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
      var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // update url without triggering scroll
      history.pushState(null, '', targetId);
    });
  }

  /* ---------------------------------------------------------
     scroll spy for nav highlighting
     --------------------------------------------------------- */
  function initScrollSpy() {
    // Only run on homepage (has section anchors)
    var sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;

    var navLinks = document.querySelectorAll('.navbar-link[href^="#"], .mobile-menu-link[href^="#"]');
    var homeLinks = document.querySelectorAll('.navbar-link[href="/"], .mobile-menu-link[href="/"]');
    if (navLinks.length === 0) return;

    var headerHeight = 100;

    function updateActiveLink() {
      var scrollPosition = window.scrollY + headerHeight + 50;
      var currentSection = null;

      sections.forEach(function(section) {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = section.getAttribute('id');
        }
      });

      // Remove all active states
      navLinks.forEach(function(link) {
        link.classList.remove('is-active');
      });
      homeLinks.forEach(function(link) {
        link.classList.remove('is-active');
      });

      // Add active state to current section link or home if at top
      if (currentSection) {
        document.querySelectorAll('.navbar-link[href="#' + currentSection + '"], .mobile-menu-link[href="#' + currentSection + '"]')
          .forEach(function(link) {
            link.classList.add('is-active');
          });
      } else if (window.scrollY < 200) {
        // At top of page, highlight home
        homeLinks.forEach(function(link) {
          link.classList.add('is-active');
        });
      }
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink(); // Run on init
  }

  /* ---------------------------------------------------------
     initialize
     --------------------------------------------------------- */
  function init() {
    initMobileNav();
    initModals();
    initSmoothScroll();
    initScrollSpy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
