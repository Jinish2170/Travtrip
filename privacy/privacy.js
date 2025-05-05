// script.js
// Adds smooth scrolling, back-to-top button, and active nav highlighting

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for in-page anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', e => {
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', `#${targetId}`);
        }
      });
    });
  
    // Create back-to-top button
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.textContent = '↑';
    backToTop.title = 'Back to top';
    Object.assign(backToTop.style, {
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      padding: '0.5rem 0.75rem',
      fontSize: '1.5rem',
      display: 'none',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-link').trim(),
      color: '#ffffff',
      cursor: 'pointer',
      zIndex: 1000
    });
    document.body.appendChild(backToTop);
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  
    window.addEventListener('scroll', () => {
      backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
  
    // Active navigation link highlighting
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const sections = Array.from(navLinks)
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
  
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          if (navLinks[index]) navLinks[index].classList.add('active');
        }
      });
    });
  });
  