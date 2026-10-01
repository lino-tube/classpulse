/* Demo authentication and role guards. This is intentionally browser-side only. */
(function () {
  const SESSION_KEY = 'classpulse_auth';
  const ACCOUNTS = {
    student: { email: 'st12344@rcconnect.edu.za', password: 'Student123', role: 'Student' },
    lecturer: { email: 'lecturer@rcconnect.edu.za', password: 'Lecturer123', role: 'Lecturer' }
  };

  function getAuth() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
    catch (e) { return null; }
  }

  function saveAuth(account) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email: account.email, role: account.role, loggedIn: true }));
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
  }

  function guardPage() {
    const requiredRole = document.body.dataset.role;
    if (!requiredRole || requiredRole === 'public') return;
    const auth = getAuth();
    if (!auth || !auth.loggedIn) {
      window.location.replace('index.html');
      return;
    }
    if (requiredRole === 'student' && auth.role !== 'Student') {
      window.location.replace('lecturer-dashboard.html');
      return;
    }
    if (requiredRole === 'lecturer' && auth.role !== 'Lecturer') {
      window.location.replace('student-dashboard.html');
    }
  }

  function initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    const error = document.getElementById('loginError');
    const existing = getAuth();
    if (existing && existing.loggedIn) {
      window.location.replace(existing.role === 'Student' ? 'student-dashboard.html' : 'lecturer-dashboard.html');
      return;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      error.classList.remove('show');
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const role = document.getElementById('role').value;

      if (!email || !password || !role) {
        error.textContent = 'Please enter your email, password and select your role.';
        error.classList.add('show');
        return;
      }

      const account = Object.values(ACCOUNTS).find(item => item.email === email);
      if (!account || account.password !== password) {
        error.textContent = 'Incorrect email or password.';
        error.classList.add('show');
        return;
      }
      if (account.role !== role) {
        error.textContent = 'The selected role does not match this account.';
        error.classList.add('show');
        return;
      }
      saveAuth(account);
      window.location.href = role === 'Student' ? 'student-dashboard.html' : 'lecturer-dashboard.html';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    guardPage();
    initLogin();
    document.querySelectorAll('[data-logout]').forEach(button => button.addEventListener('click', logout));
  });

  window.ClassPulseAuth = { getAuth, logout, guardPage };
})();
