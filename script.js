const body = document.body;
const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');
const navLinks = [...document.querySelectorAll('.nav-links a')];
const sections = [...document.querySelectorAll('main section[id]')];
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-links');

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
  header.classList.toggle('scrolled', window.scrollY > 20);
  backToTop.classList.toggle('show', window.scrollY > 600);
  const current = sections.reduce((active, section) => window.scrollY >= section.offsetTop - 160 ? section.id : active, 'home');
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

menuToggle.addEventListener('click', () => {
  const open = navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
navLinks.forEach(link => link.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelector('.theme-toggle').addEventListener('click', () => {
  body.classList.toggle('light');
  localStorage.setItem('portfolio-theme', body.classList.contains('light') ? 'light' : 'dark');
});
if (localStorage.getItem('portfolio-theme') === 'dark') body.classList.remove('light');

const phrases = ['Full Stack Python Developer', 'Software Developer', 'Problem Solver'];
const typingTarget = document.querySelector('.typing-text');
let phraseIndex = 0;
let characterIndex = phrases[0].length;
let deleting = true;
function typePhrase() {
  const phrase = phrases[phraseIndex];
  typingTarget.textContent = phrase.slice(0, characterIndex);
  if (deleting) {
    characterIndex -= 1;
    if (characterIndex < 1) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; }
  } else {
    characterIndex += 1;
    if (characterIndex > phrase.length) { deleting = true; setTimeout(typePhrase, 1400); return; }
  }
  setTimeout(typePhrase, deleting ? 45 : 85);
}
setTimeout(typePhrase, 1600);

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('pointerdown', event => {
    if (card.classList.contains('tools-card')) {
      card.classList.remove('is-touched');
      requestAnimationFrame(() => card.classList.add('is-touched'));
      setTimeout(() => card.classList.remove('is-touched'), 760);
    }
    const bounds = card.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'touch-ripple';
    ripple.style.left = `${event.clientX - bounds.left}px`;
    ripple.style.top = `${event.clientY - bounds.top}px`;
    card.querySelectorAll('.touch-ripple').forEach(existing => existing.remove());
    card.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
  card.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty('--tilt-x', `${(x - 0.5) * 8}deg`);
    card.style.setProperty('--tilt-y', `${(0.5 - y) * 8}deg`);
    card.style.setProperty('--spot-x', `${x * 100}%`);
    card.style.setProperty('--spot-y', `${y * 100}%`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
    card.style.setProperty('--spot-x', '50%');
    card.style.setProperty('--spot-y', '50%');
  });
});

document.querySelectorAll('#skills .skill-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  const animateCard = () => {
    card.classList.remove('skill-card-flip');
    requestAnimationFrame(() => card.classList.add('skill-card-flip'));
  };
  card.addEventListener('click', animateCard);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      animateCard();
    }
  });
});

document.querySelectorAll('[data-counter]').forEach(counter => {
  const counterObserver = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    const target = Number(counter.dataset.counter);
    let value = 0;
    const timer = setInterval(() => {
      value += 1;
      counter.textContent = value;
      if (value >= target) clearInterval(timer);
    }, 180);
    counterObserver.disconnect();
  }, { threshold: 1 });
  counterObserver.observe(counter);
});

const skillsProgressObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.skill-card-modern').forEach(card => {
      card.style.setProperty('--skill-level', `${card.dataset.level}%`);
      card.classList.add('progress-visible');
    });
    skillsProgressObserver.unobserve(entry.target);
  });
}, { threshold: 0.18 });
const skillsProgressSection = document.querySelector('.skills-section');
if (skillsProgressSection) skillsProgressObserver.observe(skillsProgressSection);

document.querySelectorAll('.skill-card-modern').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    card.style.setProperty('--tilt-x', `${(x - 0.5) * 5}deg`);
    card.style.setProperty('--tilt-y', `${(0.5 - y) * 5}deg`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--tilt-x', '0deg');
    card.style.setProperty('--tilt-y', '0deg');
  });
});

document.querySelectorAll('.filter').forEach(filter => filter.addEventListener('click', () => {
  document.querySelector('.filter.active').classList.remove('active');
  filter.classList.add('active');
  const selected = filter.dataset.filter;
  document.querySelectorAll('.project-card').forEach(project => {
    project.hidden = selected !== 'all' && project.dataset.category !== selected;
  });
}));

document.querySelector('.contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('.form-status');
  const fields = [...form.querySelectorAll('input, textarea')];
  const invalid = fields.find(field => !field.value.trim() || (field.type === 'email' && !field.validity.valid));
  fields.forEach(field => field.style.borderColor = '');
  if (invalid) {
    invalid.style.borderColor = '#ef8d9d';
    invalid.focus();
    status.textContent = 'Please complete the highlighted field.';
    status.style.color = '#ef8d9d';
    return;
  }
  status.textContent = 'Thanks — your message is ready to send. I’ll be in touch soon.';
  status.style.color = 'var(--green)';
  form.reset();
});
