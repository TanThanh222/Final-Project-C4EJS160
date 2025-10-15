// ===== Short helpers =====
const $  = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

const USERS_KEY   = "edupress_users";
const SESSION_KEY = "edupress_current_user";
const LAST_EMAIL  = "edupress_last_email";

const loadUsers  = () => JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
const saveUsers  = (arr) => localStorage.setItem(USERS_KEY, JSON.stringify(arr));
const setCurrent = (email) => sessionStorage.setItem(SESSION_KEY, email);
const getCurrent = () => sessionStorage.getItem(SESSION_KEY);
const logoutCurr = () => sessionStorage.removeItem(SESSION_KEY);

function setEye(btn, shown) {
  btn.setAttribute("aria-pressed", shown ? "true" : "false");
  btn.setAttribute("aria-label", shown ? "Hide password" : "Show password");
  btn.textContent = shown ? "🙈" : "👁";
}

async function onRegister(e) {
  e.preventDefault();
  const email = $("#reg-email").value.trim().toLowerCase();
  const username = $("#reg-username").value.trim();
  const pw = $("#reg-password").value;
  const pw2 = $("#reg-confirm").value;

  if (!emailRe.test(email)) return alert("Email không hợp lệ");
  if (username.length < 3)  return alert("Username tối thiểu 3 ký tự");
  if (pw.length < 6)        return alert("Mật khẩu tối thiểu 6 ký tự");
  if (pw !== pw2)           return alert("Xác nhận mật khẩu không khớp");

  const users = loadUsers();
  if (users.some(u => u.email === email)) return alert("Email đã tồn tại trên hệ thống");

  const passwordHash = await sha256(pw);
  users.push({
    id: crypto.randomUUID(),
    email,
    username,
    passwordHash,
    createdAt: Date.now()
  });
  saveUsers(users);
  setCurrent(email);
  alert("Đăng ký thành công!");
}

async function onLogin(e) {
  e.preventDefault();
  const email = $("#login-email").value.trim().toLowerCase();
  const pw    = $("#login-password").value;
  const remember = $("#remember")?.checked;

  if (!emailRe.test(email)) return alert("Email không hợp lệ");
  if (!pw) return alert("Vui lòng nhập mật khẩu");

  const users = loadUsers();
  const user  = users.find(u => u.email === email);
  if (!user) return alert("Tài khoản không tồn tại");

  const passwordHash = await sha256(pw);
  if (user.passwordHash !== passwordHash) return alert("Mật khẩu không đúng");

  setCurrent(email);
  if (remember) localStorage.setItem(LAST_EMAIL, email);
  else localStorage.removeItem(LAST_EMAIL);
  alert("Đăng nhập thành công!");
}

async function onForgotSend() {
  const email = $("#forgot-email").value.trim().toLowerCase();
  const msg   = $("#forgot-msg");
  msg.textContent = "";

  if (!emailRe.test(email)) { msg.textContent = "Email không hợp lệ."; return; }

  const users = loadUsers();
  const user  = users.find(u => u.email === email);
  if (!user) { msg.textContent = "Email chưa đăng ký trên hệ thống."; return; }

  const newPw = prompt("Nhập mật khẩu mới (>= 6 ký tự):");
  if (!newPw || newPw.length < 6) { msg.textContent = "Mật khẩu quá ngắn hoặc đã hủy."; return; }

  user.passwordHash = await sha256(newPw);
  saveUsers(users);
  msg.textContent = "Đổi mật khẩu thành công. Hãy đăng nhập lại.";
}

function openModal(el){ if(!el) return; el.classList.remove("hidden"); document.body.style.overflow="hidden"; el.querySelector("input")?.focus(); }
function closeModal(el){ if(!el) return; el.classList.add("hidden");   document.body.style.overflow=""; }

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS loaded ✅");

  const last = localStorage.getItem(LAST_EMAIL);
  if (last && $("#login-email")) $("#login-email").value = last;

  const header = document.querySelector(".header-overall");
  const toggle = document.querySelector(".nav-toggle");
  if (header && toggle) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", (e) => {
      if (!header.contains(e.target)) {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded","false");
      }
    });
  }

  $$(".eye").forEach(btn => {
    setEye(btn, false);
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      setEye(btn, show);
    });
  });

  $("#register-form")?.addEventListener("submit", onRegister);
  $("#login-form")?.addEventListener("submit", onLogin);

  const modal = $("#forgot-modal");
  $("#forgot-link") ?.addEventListener("click", (e)=>{ e.preventDefault(); openModal(modal); });
  $("#forgot-close")?.addEventListener("click", ()=> closeModal(modal));
  modal?.addEventListener("click", (e)=>{ if (e.target === modal) closeModal(modal); });
  document.addEventListener("keydown", (e)=>{ if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) closeModal(modal); });

  $("#forgot-send")?.addEventListener("click", onForgotSend);
});

window.auth = { getCurrent, logout: () => { logoutCurr(); alert("Đã đăng xuất."); } };


