(function () {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
  } else {
    initHeader();
  }
  function initHeader() {
    const headerEl = document.querySelector('.header-overall');
    const navToggleEl = document.querySelector('.nav-toggle');
    if (!headerEl || !navToggleEl) return;
    navToggleEl.addEventListener('click', () => {
      const open = headerEl.classList.toggle('is-open');
      navToggleEl.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('is-locked', open);
    });
    document.addEventListener('click', (e) => {
      if (!headerEl.contains(e.target)) {
        headerEl.classList.remove('is-open');
        navToggleEl.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('is-locked');
      }
    });
  }
})();

const COURSES = [
  { id: "c1",  title: "Create An LMS Website With LearnPress", author: "Determined-Poitras", instructor: "Kenny White", category: "Development",      level: "Beginner",     rating: 4.7, durationWeeks: 2, students: 156, priceOld: 29, priceNew: 0,  img: "./HomePage/featured/c1.png", featured: true },
  { id: "c2",  title: "Design a website with ThimPress",      author: "Determined-Poitras", instructor: "John Doe",     category: "Design",           level: "Intermediate", rating: 4.5, durationWeeks: 2, students: 156, priceOld: 59, priceNew: 49, img: "./HomePage/featured/c2.png", featured: true },
  { id: "c3",  title: "Mastering WordPress for Beginners",    author: "Determined-Poitras", instructor: "Kenny White",  category: "Development",      level: "Beginner",     rating: 4.2, durationWeeks: 3, students: 220, priceOld: 39, priceNew: 0,  img: "./HomePage/featured/c3.png", featured: true },
  { id: "c4",  title: "Advanced SEO Strategy 2025",           author: "Determined-Poitras", instructor: "John Doe",     category: "Marketing",        level: "Expert",       rating: 4.8, durationWeeks: 4, students: 310, priceOld: 79, priceNew: 59, img: "./HomePage/featured/c4.png", featured: false },
  { id: "c5",  title: "Photography Essentials",               author: "Determined-Poitras", instructor: "Kenny White",  category: "Photography",      level: "All levels",   rating: 4.1, durationWeeks: 2, students: 120, priceOld: 29, priceNew: 0,  img: "./HomePage/featured/c5.png", featured: false },
  { id: "c6",  title: "Content Writing for Growth",           author: "Determined-Poitras", instructor: "John Doe",     category: "Content Writing",  level: "Intermediate", rating: 4.3, durationWeeks: 2, students: 156, priceOld: 39, priceNew: 29, img: "./HomePage/featured/c6.png", featured: false },
  { id: "c7",  title: "JavaScript From Zero To Hero",         author: "Determined-Poitras", instructor: "Kenny White",  category: "Development",      level: "Beginner",     rating: 4.6, durationWeeks: 3, students: 500, priceOld: 49, priceNew: 0,  img: "./HomePage/featured/c1.png", featured: false },
  { id: "c8",  title: "Figma UI/UX Crash Course",             author: "Determined-Poitras", instructor: "John Doe",     category: "Design",           level: "Beginner",     rating: 4.4, durationWeeks: 2, students: 180, priceOld: 39, priceNew: 19, img: "./HomePage/featured/c2.png", featured: false },
  { id: "c9",  title: "Email Marketing Playbook",             author: "Determined-Poitras", instructor: "John Doe",     category: "Marketing",        level: "Intermediate", rating: 4.0, durationWeeks: 2, students: 96,  priceOld: 29, priceNew: 0,  img: "./HomePage/featured/c4.png", featured: false },
  { id: "c10", title: "Portrait Photography Basics",          author: "Determined-Poitras", instructor: "Kenny White",  category: "Photography",      level: "Beginner",     rating: 3.9, durationWeeks: 2, students: 80,  priceOld: 29, priceNew: 19, img: "./HomePage/featured/c5.png", featured: false },
];
window.COURSES = COURSES;

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const IMG_BASE_CL       = "./HomePage/featured/";
const ICON1_CL          = "./HomePage/featured/icon1.png";
const ICON2_CL          = "./HomePage/featured/icon2.png";
const COURSE_DETAIL_URL = "./coursesingle.html";

function priceHTML(c) {
  if (c.priceNew === 0) return `<span class="old">$${c.priceOld.toFixed(1)}</span><span class="free">Free</span>`;
  if (c.priceOld && c.priceNew < c.priceOld)
    return `<span class="old">$${c.priceOld.toFixed(1)}</span><span class="new">$${c.priceNew.toFixed(1)}</span>`;
  return `<span class="new">$${c.priceNew.toFixed(1)}</span>`;
}
function courseCardTpl(c) {
  return `
    <div class="course-card" data-id="${c.id}">
      <div class="card-img"><img src="${IMG_BASE_CL + c.img}" alt="${c.title}"></div>
      <div class="card-body">
        <p class="author">by ${c.author}</p>
        <h3 class="card-title">${c.title}</h3>
        <div class="card-meta">
          <div class="meta-item"><img src="${ICON1_CL}" alt="duration"><span>${c.durationWeeks} Weeks</span></div>
          <div class="meta-item"><img src="${ICON2_CL}" alt="students"><span>${c.students} Students</span></div>
        </div>
      </div>
      <div class="card-footer">
        <div class="price">${priceHTML(c)}</div>
        <a class="more" href="${COURSE_DETAIL_URL}?id=${encodeURIComponent(c.id)}">View More</a>
      </div>
    </div>`;
}
window.courseCardTpl = courseCardTpl;

const state = {
  q: "", categories: new Set(), instructors: new Set(),
  price: new Set(), levels: new Set(), ratingMin: null,
  page: 1, pageSize: 6
};
const normalize = (str) => str.toLowerCase().normalize('NFKC');

function applyFilters() {
  let list = COURSES.slice();
  if (state.q) {
    const q = normalize(state.q);
    list = list.filter(c =>
      normalize(c.title).includes(q) ||
      normalize(c.author).includes(q) ||
      normalize(c.category).includes(q)
    );
  }
  if (state.categories.size)  list = list.filter(c => state.categories.has(c.category));
  if (state.instructors.size) list = list.filter(c => state.instructors.has(c.instructor));
  if (state.price.size) {
    list = list.filter(c => {
      const isFree = c.priceNew === 0;
      return (state.price.has("Free") && isFree) || (state.price.has("Paid") && !isFree);
    });
  }
  if (state.levels.size) list = list.filter(c => state.levels.has(c.level));
  if (state.ratingMin != null) list = list.filter(c => c.rating >= state.ratingMin);
  return list;
}

const gridEl  = $(".featured");
const pagerEl = $(".pagination");

function renderCourses() {
  if (!gridEl || !pagerEl) return;

  const filtered   = applyFilters();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  state.page       = Math.min(state.page, totalPages);

  const start    = (state.page - 1) * state.pageSize;
  const pageData = filtered.slice(start, start + state.pageSize);

  gridEl.innerHTML = pageData.map(courseCardTpl).join("") || `
    <div style="grid-column:1 / -1; text-align:center; padding:40px 0;">
      Không tìm thấy khóa học nào phù hợp.
    </div>`;

  pagerEl.innerHTML = "";
  const btn = (label, page, disabled = false, active = false) => {
    const a = document.createElement("a");
    a.href = "#"; a.textContent = label;
    if (disabled) a.style.pointerEvents = "none";
    if (active) { a.style.background = "#000"; a.style.color = "#fff"; }
    a.addEventListener("click", e => {
      e.preventDefault();
      if (!disabled) { state.page = page; renderCourses(); }
    });
    return a;
  };
  pagerEl.appendChild(btn("‹", Math.max(1, state.page - 1), state.page === 1));
  for (let p = 1; p <= totalPages; p++) pagerEl.appendChild(btn(String(p), p, false, p === state.page));
  pagerEl.appendChild(btn("›", Math.min(totalPages, state.page + 1), state.page === totalPages));
}
window.renderCourses = renderCourses;

const searchInput = $(".search-box input");
if (searchInput) {
  searchInput.addEventListener("input", e => {
    state.q = e.target.value.trim(); state.page = 1; renderCourses();
  });
}
function readLabelText(li) {
  const raw = li.textContent.trim();
  return raw.replace(/\(\s*\d[\d,]*\s*\)$/, "").trim();
}
const groups     = $$(".filter-group");
const catGroup   = groups.find(g => g.querySelector("h3")?.textContent.includes("Course Category"));
const insGroup   = groups.find(g => g.querySelector("h3")?.textContent.includes("Instructors"));
const priceGroup = groups.find(g => g.querySelector("h3")?.textContent.trim() === "Price");
const levelGroup = groups.find(g => g.querySelector("h3")?.textContent.trim() === "Level");
const reviewGroup= groups.find(g => g.querySelector("h3")?.textContent.trim() === "Review");

if (catGroup)   catGroup.addEventListener("change", () => { state.categories.clear();  catGroup.querySelectorAll("li").forEach(li => { const cb = li.querySelector('input[type="checkbox"]'); if (cb?.checked) state.categories.add(readLabelText(li)); }); state.page = 1; renderCourses(); });
if (insGroup)   insGroup.addEventListener("change", () => { state.instructors.clear(); insGroup.querySelectorAll("li").forEach(li => { const cb = li.querySelector('input[type="checkbox"]'); if (cb?.checked) state.instructors.add(readLabelText(li)); }); state.page = 1; renderCourses(); });
if (priceGroup) priceGroup.addEventListener("change", () => { state.price.clear();       priceGroup.querySelectorAll("li").forEach(li => { const cb = li.querySelector('input[type="checkbox"]'); if (cb?.checked) { const label = readLabelText(li); if (label !== "All") state.price.add(label); } }); state.page = 1; renderCourses(); });
if (levelGroup) levelGroup.addEventListener("change", () => { state.levels.clear();     levelGroup.querySelectorAll("li").forEach(li => { const cb = li.querySelector('input[type="checkbox"]'); if (cb?.checked) state.levels.add(readLabelText(li)); }); state.page = 1; renderCourses(); });
if (reviewGroup)reviewGroup.addEventListener("change", () => {
  let min = null;
  reviewGroup.querySelectorAll("li").forEach(li => {
    const cb = li.querySelector('input[type="checkbox"]');
    if (cb?.checked) {
      const stars = (li.textContent.match(/★/g) || []).length;
      min = Math.max(min ?? 0, stars);
    }
  });
  state.ratingMin = min ? (min - 0.5) : null;
  state.page = 1; renderCourses();
});

renderCourses();

(() => {
  if (!window.EnrollAPI || !window.COURSES) return;
  const user = EnrollAPI.requireUser();

  const css = `
    .badge-enrolled{display:inline-block;padding:4px 8px;border-radius:999px;background:#e6fff2;color:#059669;font:600 12px/1.2 system-ui;margin-right:8px}
    .course-card.enrolled{outline:1px solid #bbf7d0}
    .btn-enroll{margin-left:auto;padding:8px 12px;border-radius:8px;border:1px solid #111;background:#fff;cursor:pointer;font-weight:600}
    .btn-enroll:hover{background:#111;color:#fff}
    .btn-unenroll{margin-left:8px;padding:8px 12px;border-radius:8px;border:1px solid #dc2626;background:#fff;color:#dc2626;cursor:pointer;font-weight:600}
    .btn-unenroll:hover{background:#dc2626;color:#fff}
  `;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  const grid = document.querySelector(".all-courses .featured");
  if (!grid) return;
  const wrap = document.createElement("section");
  wrap.id = "my-courses-section";
  wrap.className = "my-courses-section";
  wrap.innerHTML = `
    <div class="ac-top-container" style="margin:12px 0 8px"><h3 class="page-subtitle">Khóa học đã đăng ký</h3></div>
    <div id="my-courses" class="featured"></div>
  `;
  grid.parentElement.insertBefore(wrap, grid);

  function enhanceCard(cardEl, courseId) {
    const footer = cardEl.querySelector(".card-footer"); if (!footer) return;

    if (EnrollAPI.has(user.id, courseId)) {
      cardEl.classList.add("enrolled");

      if (!footer.querySelector(".badge-enrolled")) {
        const b = document.createElement("span");
        b.className = "badge-enrolled"; b.textContent = "Đã đăng ký";
        footer.prepend(b);
      }

      const more = footer.querySelector(".more");
      if (more) {
        const url = new URL(more.getAttribute("href"), location.href);
        url.searchParams.set("id", courseId);
        more.textContent = "Vào học";
        more.setAttribute("href", url.pathname + url.search);
      }

      if (!footer.querySelector(".btn-unenroll")) {
        const u = document.createElement("button");
        u.className = "btn-unenroll"; u.textContent = "Hủy đăng ký";
        u.addEventListener("click", (e) => {
          e.preventDefault();
          EnrollAPI.del(user.id, courseId);
          renderMy();
          safeReRender();
        });
        footer.appendChild(u);
      }
      return;
    }

    if (!footer.querySelector(".btn-enroll")) {
      const btn = document.createElement("button");
      btn.className = "btn-enroll"; btn.textContent = "Đăng ký";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        EnrollAPI.add(user.id, courseId);
        renderMy();
        safeReRender();
      });
      footer.appendChild(btn);
    }
  }

  const myWrap = document.getElementById("my-courses");
  function renderMy() {
    const ids  = EnrollAPI.list(user.id);
    const data = window.COURSES.filter(c => ids.includes(c.id));
    myWrap.innerHTML = data.length
      ? data.map(window.courseCardTpl).join("")
      : '<div style="grid-column:1/-1;padding:16px 0;color:#666">Chưa đăng ký khóa nào.</div>';
    myWrap.querySelectorAll(".course-card").forEach(card => enhanceCard(card, card.dataset.id));
  }

  const _renderCourses = window.renderCourses;
  function safeReRender() {
    if (typeof _renderCourses === "function") _renderCourses();
    document.querySelectorAll(".all-courses .featured .course-card").forEach(card => {
      const id = card.getAttribute("data-id");
      if (id) enhanceCard(card, id);
    });
  }

  renderMy();
  safeReRender();

  window.renderCourses = () => { safeReRender(); };
})();
