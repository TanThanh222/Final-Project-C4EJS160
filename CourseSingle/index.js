const header = document.querySelector('.header-overall');
const toggle  = document.querySelector('.nav-toggle');

toggle.addEventListener('click', () => {
  const open = header.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

document.addEventListener('click', (e)=>{
  if (!header.contains(e.target)) {
    header.classList.remove('is-open');
    toggle.setAttribute('aria-expanded','false');
  }
});

(() => {
  if (!window.EnrollAPI) return;
  const user = EnrollAPI.requireUser();
  const qs = new URLSearchParams(location.search);
  const courseId = qs.get("id");
  const btn = document.querySelector(".price-row .btn, .price-row button, aside.hero-card .btn");
  if (!btn) return;

  function refresh() {
    if (!courseId) { btn.disabled = true; btn.textContent = "Thiếu course id"; return; }
    if (EnrollAPI.has(user.id, courseId)) {
      btn.textContent = "Vào học";
      btn.onclick = () => alert("Bắt đầu học khóa: " + courseId);
    } else {
      btn.textContent = "Đăng ký";
      btn.onclick = () => { EnrollAPI.add(user.id, courseId); refresh(); };
    }
  }
  refresh();
})();

