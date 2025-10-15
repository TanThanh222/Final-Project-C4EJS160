const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

const STORE_KEY = 'edupress_users';
const SESSION_KEY = 'edupress_current_user';
const loadUsers = () => JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
const saveUsers = arr => localStorage.setItem(STORE_KEY, JSON.stringify(arr));
const setCurrent = email => sessionStorage.setItem(SESSION_KEY, email);
const getCurrent = () => sessionStorage.getItem(SESSION_KEY);
const logoutCurrent = () => sessionStorage.removeItem(SESSION_KEY);

function genToken(len = 32) {
  const a = new Uint8Array(len);
  crypto.getRandomValues(a);
  return [...a].map(x => x.toString(16).padStart(2, '0')).join('');
}

function handleResetFromHash() {
  const hash = new URLSearchParams(location.hash.slice(1));
  const token = hash.get('reset');
  const email = hash.get('email');
  if (!token || !email) return;

  const users = loadUsers();
  const user = users.find(u => u.email === email.toLowerCase());
  if (!user || !user.resetTokenHash || !user.resetTokenExp) {
    alert('Token không hợp lệ.'); location.hash = ''; return;
  }
  if (Date.now() > user.resetTokenExp) { alert('Token đã hết hạn.'); location.hash = ''; return; }
  if (token !== user.resetTokenHash) { alert('Token không đúng.'); location.hash = ''; return; }

  const newPw = prompt('Nhập mật khẩu mới (>= 6 ký tự):');
  if (!newPw || newPw.length < 6) { alert('Mật khẩu quá ngắn.'); location.hash = ''; return; }

  sha256(newPw).then(hash => {
    user.passwordHash = hash;
    delete user.resetTokenHash;
    delete user.resetTokenExp;
    saveUsers(users);
    alert('Đặt lại mật khẩu thành công! Hãy đăng nhập lại.');
    location.hash = '';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('JS loaded ✅');

  const header = document.querySelector('.header-overall');
  const toggle = document.querySelector('.nav-toggle');
  if (header && toggle) {
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        header.classList.remove('is-open');
        toggle.setAttribute('aria-expanded','false');
      }
    });
  }

  const eyeButtons = document.querySelectorAll('.eye');
  console.log('Found eye buttons:', eyeButtons.length);
  eyeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = button.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      // toggle
      if (input.type === 'password') {
        input.type = 'text';
        input.classList.add('show-password');
        button.textContent = '🙈';
      } else {
        input.type = 'password';
        input.classList.remove('show-password');
        button.textContent = '👁';
      }
      console.log(`Eye clicked → target: ${targetId}, type: ${input.type}`);
    });
  });

  $('#register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#reg-email').value.trim().toLowerCase();
    const username = $('#reg-username').value.trim();
    const pw = $('#reg-password').value;
    const pw2 = $('#reg-confirm').value;

    if (!emailRe.test(email)) return alert('Email không hợp lệ');
    if (username.length < 3) return alert('Username tối thiểu 3 ký tự');
    if (pw.length < 6) return alert('Mật khẩu tối thiểu 6 ký tự');
    if (pw !== pw2) return alert('Xác nhận mật khẩu không khớp');

    const users = loadUsers();
    if (users.some(u => u.email === email || u.username === username)) {
      return alert('Email hoặc Username đã tồn tại');
    }

    const passwordHash = await sha256(pw);
    users.push({
      id: crypto.randomUUID(),
      email, username, passwordHash,
      createdAt: Date.now()
    });
    saveUsers(users);
    setCurrent(email);
    alert('Đăng ký thành công!');
  });

  $('#login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identity = $('#login-identity').value.trim();
    const pw = $('#login-password').value;
    const passwordHash = await sha256(pw);

    const users = loadUsers();
    const user = users.find(u => u.email === identity.toLowerCase() || u.username === identity);
    if (!user) return alert('Tài khoản không tồn tại');
    if (user.passwordHash !== passwordHash) return alert('Mật khẩu không đúng');

    setCurrent(user.email);
    if ($('#remember')?.checked) localStorage.setItem('edupress_last_identity', identity);
    alert('Đăng nhập thành công!');
  });

  const modal = $('#forgot-modal');
  $('#forgot-link')?.addEventListener('click', (e) => {
    e?.preventDefault();
    modal?.classList.remove('hidden');
  });
  $('#forgot-close')?.addEventListener('click', () => modal?.classList.add('hidden'));

  $('#forgot-send')?.addEventListener('click', () => {
    const email = $('#forgot-email').value.trim().toLowerCase();
    const users = loadUsers();
    const user = users.find(u => u.email === email);
    $('#forgot-msg').textContent = '';
    if (!user) { $('#forgot-msg').textContent = 'Nếu email tồn tại, chúng tôi đã gửi hướng dẫn.'; return; }

    const token = genToken(24);
    user.resetTokenHash = token;
    user.resetTokenExp = Date.now() + 15 * 60 * 1000;
    saveUsers(users);

    const link = `${location.origin}${location.pathname}#reset=${token}&email=${encodeURIComponent(email)}`;
    $('#forgot-msg').innerHTML = `Link đặt lại (demo): <a href="${link}">${link}</a>`;
  });

  handleResetFromHash();
});

