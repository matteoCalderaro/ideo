// this substitutes the the css :target and :checked which open/close the navbar and the popup

const allLinks = document.querySelectorAll('a:link');
const checkbox = document.querySelector('#navi-toggle');
const popup = document.querySelector('#popup');

allLinks.forEach((link) => {
  const href = link.getAttribute('href');

  if (href === '#') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  if (href !== '#' && href.startsWith('#') && href !== '#popup') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = document.querySelector(href);
      section.scrollIntoView({ behavior: 'smooth' });
      checkbox.checked = false;
      popup.style.visibility = 'hidden';
    });
  }
  if (href == '#popup') {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      popup.style.visibility = 'visible';
      popup.style.opacity = '1';
      popup.firstElementChild.style.opacity = '1';
      popup.firstElementChild.style.transform =
        'translate(-50%, -50%) scale(1)';
    });
  }
});

///////////////////////////////////////////////////////////
// Sticky navigation
const header = document.querySelector('.header__text-box');

const obs = new IntersectionObserver(
  (entries) => {
    const ent = entries[0];
    console.log(ent);
    const button = document.querySelector('.navigation__button');
    const background = document.querySelector('.navigation__background');
    const nav = document.querySelector('.navigation__nav');
    if (ent.isIntersecting === false) {
      button.style.display = 'block';
      background.style.display = 'block';
      nav.style.display = 'block';
    }
    if (ent.isIntersecting === true) {
      button.style.display = 'none';
      background.style.display = 'none';
      nav.style.display = 'none';
    }
  },
  {
    // In the viewport (null means viewport)
    root: null,
    threshold: 0,
    rootMargin: '-150px',
  }
);
obs.observe(header);

// navigation__button;
// navigation__background;
// navigation__nav;


window.onload = function() {
  var video = document.getElementById("myVideo");
  video.currentTime = 0;  // Reset the video to the start
};