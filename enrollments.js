(() => {
  const LS = { USER: "app.user", ENROLL: "app.enrollments" };

  function getUser() {
    try { return JSON.parse(localStorage.getItem(LS.USER)); } catch { return null; }
  }
  function requireUser() {
    let u = getUser();
    if (!u) { u = { id: "u-demo", name: "Demo User" }; localStorage.setItem(LS.USER, JSON.stringify(u)); }
    return u;
  }

  const readMap = () => { try { return JSON.parse(localStorage.getItem(LS.ENROLL) || "{}"); } catch { return {}; } };
  const writeMap = (m) => localStorage.setItem(LS.ENROLL, JSON.stringify(m));

  function list(userId) { return readMap()[userId] || []; }
  function has(userId, courseId) { return new Set(list(userId)).has(courseId); }
  function add(userId, courseId) {
    const m = readMap(); const s = new Set(m[userId] || []);
    s.add(courseId); m[userId] = [...s]; writeMap(m);
  }
  function del(userId, courseId) {
    const m = readMap(); const s = new Set(m[userId] || []);
    s.delete(courseId); m[userId] = [...s]; writeMap(m);
  }

  window.EnrollAPI = { requireUser, list, has, add, del };
})();

