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
  { id:"c1", title:"Create An LMS Website With LearnPress", author:"Determined-Poitras", durationWeeks:2, students:156, priceOld:29, priceNew:0,  img:"c1.png", featured:true },
  { id:"c2", title:"Design a website with ThimPress",       author:"Determined-Poitras", durationWeeks:2, students:156, priceOld:59, priceNew:49, img:"c2.png", featured:true },
  { id:"c3", title:"Mastering WordPress for Beginners",     author:"Determined-Poitras", durationWeeks:3, students:220, priceOld:39, priceNew:0,  img:"c3.png", featured:true },
  { id:"c4", title:"Advanced SEO Strategy 2025",            author:"Determined-Poitras", durationWeeks:4, students:310, priceOld:79, priceNew:59, img:"c4.png", featured:false },
  { id:"c5", title:"Photography Essentials",                author:"Determined-Poitras", durationWeeks:2, students:120, priceOld:29, priceNew:0,  img:"c5.png", featured:false },
  { id:"c6", title:"Content Writing for Growth",            author:"Determined-Poitras", durationWeeks:2, students:156, priceOld:39, priceNew:29, img:"c6.png", featured:false },
];

const IMG_BASE_HP        = "./HomePage/featured/";      
const ICON1_HP           = "./HomePage/featured/icon1.png";     
const ICON2_HP           = "./HomePage/featured/icon2.png";  
const COURSE_LISTING_URL = "./courselisting.html";         

function priceHTML(c){
  if (c.priceNew === 0)  return `<span class="old">$${c.priceOld.toFixed(1)}</span><span class="free">Free</span>`;
  if (c.priceOld && c.priceNew < c.priceOld)
    return `<span class="old">$${c.priceOld.toFixed(1)}</span><span class="new">$${c.priceNew.toFixed(1)}</span>`;
  return `<span class="new">$${c.priceNew.toFixed(1)}</span>`;
}

function cardTplHome(c){
  return `
  <div class="course-card">
    <div class="card-img"><img src="${IMG_BASE_HP + c.img}" alt="${c.title}"></div>
    <div class="card-body">
      <p class="author">by ${c.author}</p>
      <h3 class="card-title">${c.title}</h3>
      <div class="card-meta">
        <div class="meta-item"><img src="${ICON1_HP}" alt="duration"><span>${c.durationWeeks} Weeks</span></div>
        <div class="meta-item"><img src="${ICON2_HP}" alt="students"><span>${c.students} Students</span></div>
      </div>
    </div>
    <div class="card-footer">
      <div class="price">${priceHTML(c)}</div>
      <a class="more" href="${COURSE_LISTING_URL}">View More</a>
    </div>
  </div>`;
}

(function renderFeatured(){
  const grid = document.querySelector(".featured-grid");
  if (!grid) return;
  const list = COURSES.filter(c=>c.featured).slice(0,6);
  grid.innerHTML = list.map(cardTplHome).join("");
})();


