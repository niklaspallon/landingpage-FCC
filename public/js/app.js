document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  html.classList.add('js');

  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Smooth scrolling now handled via CSS (html{scroll-behavior:smooth} + scroll-padding-top)
  // On mobile, close the menu after a short delay to avoid scroll jank
  if (navLinks) {
    navLinks.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          setTimeout(() => navLinks.classList.remove('active'), 250);
        }
      });
    });
  }

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .section .section-inner').forEach(el => io.observe(el));

  // Active nav link on scroll
  const sections = document.querySelectorAll('main section[id]');
  const linkFor = id => document.querySelector(`.nav-links a[href="#${id}"]`);
  const onScroll = () => {
    let activeId = null;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top < 140 && rect.bottom > 140) activeId = sec.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => a.removeAttribute('aria-current'));
    if (activeId) {
      const l = linkFor(activeId);
      if (l) l.setAttribute('aria-current', 'true');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Move hero images inline before CTA on small screens
  const heroCopy = document.querySelector('.hero-copy');
  const heroInner = document.querySelector('.hero-inner');
  const ctaRow = document.querySelector('.hero-copy .cta-row');
  const heroMedia = document.querySelector('.hero-media');
  const originalPlacement = { parent: heroInner, next: heroMedia ? heroMedia.nextSibling : null };

  function placeHeroMedia() {
    if (!heroCopy || !heroMedia || !ctaRow) return;
    const isSmall = window.matchMedia('(max-width: 640px)').matches;
    if (isSmall) {
      if (heroMedia.parentElement !== heroCopy) {
        heroCopy.insertBefore(heroMedia, ctaRow);
      }
      heroMedia.classList.add('inline');
    } else {
      // restore to original position next to hero-copy
      if (heroMedia.parentElement !== originalPlacement.parent) {
        originalPlacement.parent.insertBefore(heroMedia, originalPlacement.next);
      }
      heroMedia.classList.remove('inline');
    }
  }

  placeHeroMedia();
  window.addEventListener('resize', placeHeroMedia);
});
