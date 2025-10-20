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
  const courseId = new URLSearchParams(location.search).get("id");

  const btn = document.querySelector(".price-row .btn, .price-row button, aside.hero-card .btn");
  if (!btn) return;

  const priceRow = btn.closest(".price-row") || document.querySelector(".price-row");
  let unBtn = priceRow ? priceRow.querySelector(".btn-unenroll") : null;
  if (!unBtn && priceRow) {
    unBtn = document.createElement("button");
    unBtn.className = "btn-unenroll";
    unBtn.style.marginLeft = "8px";
    unBtn.textContent = "Hủy đăng ký";
    priceRow.appendChild(unBtn);
  }

  (function injectStyle(){
    if (document.getElementById("unenroll-style")) return;
    const st = document.createElement("style"); st.id = "unenroll-style";
    st.textContent = `
      .btn-unenroll{padding:8px 12px;border-radius:8px;border:1px solid #dc2626;background:#fff;color:#dc2626;cursor:pointer;font-weight:600}
      .btn-unenroll:hover{background:#dc2626;color:#fff}
    `;
    document.head.appendChild(st);
  })();

  function refresh() {
    if (!courseId) { btn.disabled = true; btn.textContent = "Thiếu course id"; if (unBtn) unBtn.style.display = "none"; return; }

    if (EnrollAPI.has(user.id, courseId)) {
      btn.textContent = "Vào học";
      btn.onclick = () => alert("Bắt đầu học khóa: " + courseId);

      if (unBtn) {
        unBtn.style.display = "inline-block";
        unBtn.onclick = () => { EnrollAPI.del(user.id, courseId); refresh(); };
      }
    } else {
      btn.textContent = "Đăng ký";
      btn.onclick = () => { EnrollAPI.add(user.id, courseId); refresh(); };

      if (unBtn) unBtn.style.display = "none";
    }
  }
  refresh();
})();


