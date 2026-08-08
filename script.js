const header = document.querySelector('.site-header');
const button = document.querySelector('.menu-button');
button.addEventListener('click', () => {
  const open = header.classList.toggle('open');
  button.setAttribute('aria-expanded', open);
});
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => header.classList.remove('open')));
document.querySelector('#year').textContent = new Date().getFullYear();
