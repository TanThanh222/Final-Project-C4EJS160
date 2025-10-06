const header = document.querySelector('.header-overall');
  const toggle  = document.querySelector('.nav-toggle');

  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // đóng khi click ngoài menu
  document.addEventListener('click', (e)=>{
    if (!header.contains(e.target)) {
      header.classList.remove('is-open');
      toggle.setAttribute('aria-expanded','false');
    }
  });