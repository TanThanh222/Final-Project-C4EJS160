const header1 = document.querySelector('.header-overall');
  const toggle1  = document.querySelector('.nav-toggle');

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

const COURSES = [
  { id:"c1", title:"Create An LMS Website With LearnPress", author:"Determined-Poitras", durationWeeks:2, students:156, priceOld:29, priceNew:0, img:"c1.png", featured:true },
  { id:"c2", title:"Design a website with ThimPress", author:"Determined-Poitras", durationWeeks:2, students:156, priceOld:59, priceNew:49, img:"c2.png", featured:true },
  { id:"c3", title:"Create An LMS Website With LearnPress", author:"Determined-Poitras", durationWeeks:2, students:156, priceOld:29, priceNew:0, img:"c3.png", featured:true },
  { id:"c4", title:"Create An LMS Website With LearnPress", author:"Determined-Poitras", durationWeeks:2, students:156, priceOld:29, priceNew:0, img:"c4.png", featured:false },
  { id:"c5", title:"Create An LMS Website With LearnPress", author:"Determined-Poitras", durationWeeks:2, students:156, priceOld:29, priceNew:0, img:"c5.png", featured:false },
  { id:"c6", title:"Create An LMS Website With LearnPress", author:"Determined-Poitras", durationWeeks:2, students:156, priceOld:29, priceNew:0, img:"c6.png", featured:false },
];

const IMG_BASE = "./Home Page/featured/";

function priceHTML(c){
  if (c.priceNew === 0) return `<span class="old">$${c.priceOld.toFixed(1)}</span><span class="free">Free</span>`;
  if (c.priceOld && c.priceNew < c.priceOld) return `<span class="old">$${c.priceOld.toFixed(1)}</span><span class="new">$${c.priceNew.toFixed(1)}</span>`;
  return `<span class="new">$${c.priceNew.toFixed(1)}</span>`;
}

function cardTpl(c){
  return `
  <div class="course-card">
    <div class="card-img">
      <img src="${IMG_BASE + c.img}" alt="${c.title}">
    </div>
    <div class="card-body">
      <p class="author">by ${c.author}</p>
      <h3 class="card-title">${c.title}</h3>
      <div class="card-meta">
        <div class="meta-item">
          <img src="./Home Page/featured/icon1.png" alt="duration">
          <span>${c.durationWeeks} Weeks</span>
        </div>
        <div class="meta-item">
          <img src="./Home Page/featured/icon2.png" alt="students">
          <span>${c.students} Students</span>
        </div>
      </div>
    </div>
    <div class="card-footer">
      <div class="price">${priceHTML(c)}</div>
      <a class="more" href="./Course Listing/index.html">View More</a>
    </div>
  </div>`;
}

(function renderFeatured(){
  const grid = document.querySelector(".featured-grid");
  if (!grid) return;
  const list = COURSES.filter(c=>c.featured).slice(0,6);
  grid.innerHTML = list.map(cardTpl).join("");
})();
