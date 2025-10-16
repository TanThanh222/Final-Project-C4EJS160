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
  { id: "c1", title: "Create An LMS Website With LearnPress", author: "Determined-Poitras", instructor: "Kenny White", category: "Development", level: "Beginner", rating: 4.7, durationWeeks: 2, students: 156, priceOld: 29, priceNew: 0, img: "c1.png", featured: true },
  { id: "c2", title: "Design a website with ThimPress", author: "Determined-Poitras", instructor: "John Doe", category: "Design", level: "Intermediate", rating: 4.5, durationWeeks: 2, students: 156, priceOld: 59, priceNew: 49, img: "c2.png", featured: true },
  { id: "c3", title: "Mastering WordPress for Beginners", author: "Determined-Poitras", instructor: "Kenny White", category: "Development", level: "Beginner", rating: 4.2, durationWeeks: 3, students: 220, priceOld: 39, priceNew: 0, img: "c3.png", featured: true },
  { id: "c4", title: "Advanced SEO Strategy 2025", author: "Determined-Poitras", instructor: "John Doe", category: "Marketing", level: "Expert", rating: 4.8, durationWeeks: 4, students: 310, priceOld: 79, priceNew: 59, img: "c4.png", featured: false },
  { id: "c5", title: "Photography Essentials", author: "Determined-Poitras", instructor: "Kenny White", category: "Photography", level: "All levels", rating: 4.1, durationWeeks: 2, students: 120, priceOld: 29, priceNew: 0, img: "c5.png", featured: false },
  { id: "c6", title: "Content Writing for Growth", author: "Determined-Poitras", instructor: "John Doe", category: "Content Writing", level: "Intermediate", rating: 4.3, durationWeeks: 2, students: 156, priceOld: 39, priceNew: 29, img: "c6.png", featured: false },
  { id: "c7", title: "JavaScript From Zero To Hero", author: "Determined-Poitras", instructor: "Kenny White", category: "Development", level: "Beginner", rating: 4.6, durationWeeks: 3, students: 500, priceOld: 49, priceNew: 0, img: "c1.png", featured: false },
  { id: "c8", title: "Figma UI/UX Crash Course", author: "Determined-Poitras", instructor: "John Doe", category: "Design", level: "Beginner", rating: 4.4, durationWeeks: 2, students: 180, priceOld: 39, priceNew: 19, img: "c2.png", featured: false },
  { id: "c9", title: "Email Marketing Playbook", author: "Determined-Poitras", instructor: "John Doe", category: "Marketing", level: "Intermediate", rating: 4.0, durationWeeks: 2, students: 96, priceOld: 29, priceNew: 0, img: "c4.png", featured: false },
  { id: "c10", title: "Portrait Photography Basics", author: "Determined-Poitras", instructor: "Kenny White", category: "Photography", level: "Beginner", rating: 3.9, durationWeeks: 2, students: 80, priceOld: 29, priceNew: 19, img: "c5.png", featured: false },
];

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const IMG_BASE_CL = "./HomePage/featured/";
const ICON1_CL = "./HomePage/featured/icon1.png";
const ICON2_CL = "./HomePage/featured/icon2.png";
const COURSE_DETAIL_URL = "./CourseSingle/index.html";

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
  if (state.categories.size) list = list.filter(c => state.categories.has(c.category));
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

const gridEl = $(".featured");
const pagerEl = $(".pagination");

function renderCourses() {
  if (!gridEl || !pagerEl) return;

  const filtered = applyFilters();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  state.page = Math.min(state.page, totalPages);

  const start = (state.page - 1) * state.pageSize;
  const pageData = filtered.slice(start, start + state.pageSize);

  gridEl.innerHTML = pageData.map(courseCardTpl).join("") || `
      <div style="grid-column:1 / -1; text-align:center; padding:40px 0;">
        Không tìm thấy khóa học nào phù hợp.
      </div>
    `;

  pagerEl.innerHTML = "";
  const btn = (label, page, disabled = false, active = false) => {
    const a = document.createElement("a");
    a.href = "#"; a.textContent = label;
    if (disabled) a.style.pointerEvents = "none";
    if (active) { a.style.background = "#000"; a.style.color = "#fff"; }
    a.addEventListener("click", e => { e.preventDefault(); if (!disabled) { state.page = page; renderCourses(); } });
    return a;
  };
  pagerEl.appendChild(btn("‹", Math.max(1, state.page - 1), state.page === 1));
  for (let p = 1; p <= totalPages; p++) pagerEl.appendChild(btn(String(p), p, false, p === state.page));
  pagerEl.appendChild(btn("›", Math.min(totalPages, state.page + 1), state.page === totalPages));
}

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

const groups = $$(".filter-group");
const catGroup = groups.find(g => g.querySelector("h3")?.textContent.includes("Course Category"));
const insGroup = groups.find(g => g.querySelector("h3")?.textContent.includes("Instructors"));
const priceGroup = groups.find(g => g.querySelector("h3")?.textContent.trim() === "Price");
const levelGroup = groups.find(g => g.querySelector("h3")?.textContent.trim() === "Level");
const reviewGroup = groups.find(g => g.querySelector("h3")?.textContent.trim() === "Review");

if (catGroup) {
  catGroup.addEventListener("change", () => {
    state.categories.clear();
    catGroup.querySelectorAll("li").forEach(li => {
      const cb = li.querySelector('input[type="checkbox"]');
      if (cb?.checked) state.categories.add(readLabelText(li));
    });
    state.page = 1; renderCourses();
  });
}
if (insGroup) {
  insGroup.addEventListener("change", () => {
    state.instructors.clear();
    insGroup.querySelectorAll("li").forEach(li => {
      const cb = li.querySelector('input[type="checkbox"]');
      if (cb?.checked) state.instructors.add(readLabelText(li));
    });
    state.page = 1; renderCourses();
  });
}
if (priceGroup) {
  priceGroup.addEventListener("change", () => {
    state.price.clear();
    priceGroup.querySelectorAll("li").forEach(li => {
      const cb = li.querySelector('input[type="checkbox"]');
      if (cb?.checked) {
        const label = readLabelText(li);
        if (label !== "All") state.price.add(label);
      }
    });
    state.page = 1; renderCourses();
  });
}
if (levelGroup) {
  levelGroup.addEventListener("change", () => {
    state.levels.clear();
    levelGroup.querySelectorAll("li").forEach(li => {
      const cb = li.querySelector('input[type="checkbox"]');
      if (cb?.checked) state.levels.add(readLabelText(li));
    });
    state.page = 1; renderCourses();
  });
}
if (reviewGroup) {
  reviewGroup.addEventListener("change", () => {
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
}

renderCourses();
