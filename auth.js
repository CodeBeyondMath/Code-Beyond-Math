(function () {
  'use strict';

  const sb = window.supabaseClient;
  let currentUser = null;

  function $id(id) { return document.getElementById(id); }

  function getInitials(str) {
    if (!str) return '?';
    const parts = str.trim().split(/[\s@]+/);
    return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
  }

  function showErr(id, msg) {
    const el = $id(id);
    if (!el) return;
    el.textContent = msg;
    el.style.display = msg ? 'block' : 'none';
  }

  // ── Auth state ────────────────────────────────────────────
  async function init() {
    const { data: { session } } = await sb.auth.getSession();
    if (session) { currentUser = session.user; updateNavUser(session.user); }

    sb.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user ?? null;
      if (currentUser) {
        updateNavUser(currentUser);
        closeModal();
      } else {
        updateNavGuest();
        if ($id('profile-page')?.classList.contains('active')) window.showMain?.();
      }
    });
  }

  // ── Nav ───────────────────────────────────────────────────
  function updateNavUser(user) {
    const btn = $id('nav-auth-btn');
    if (!btn) return;
    const name = user.user_metadata?.display_name || user.email;
    btn.innerHTML = `<span class="nav-avatar">${getInitials(name)}</span>`;
    btn.title = name;
    btn.onclick = () => window.showProfile?.();
  }

  function updateNavGuest() {
    const btn = $id('nav-auth-btn');
    if (!btn) return;
    btn.innerHTML = 'Autentificare';
    btn.title = '';
    btn.onclick = () => openModal();
  }

  // ── Modal open / close ────────────────────────────────────
  function openModal(tab) {
    const modal = $id('auth-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('auth-modal--open'));
    switchTab(tab || 'login');
    showErr('login-error', '');
    showErr('register-error', '');
  }

  function closeModal() {
    const modal = $id('auth-modal');
    if (!modal) return;
    modal.classList.remove('auth-modal--open');
    setTimeout(() => { modal.style.display = 'none'; }, 280);
  }

  function switchTab(tab) {
    const isLogin = tab === 'login';
    $id('login-form').style.display    = isLogin ? 'block' : 'none';
    $id('register-form').style.display = isLogin ? 'none'  : 'block';
    $id('tab-login-btn').classList.toggle('active', isLogin);
    $id('tab-register-btn').classList.toggle('active', !isLogin);
  }

  // ── Login ─────────────────────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault();
    const email    = $id('login-email').value.trim();
    const password = $id('login-password').value;
    const btn      = e.target.querySelector('[type=submit]');
    btn.disabled = true; btn.textContent = 'Se conectează...';

    const { error } = await sb.auth.signInWithPassword({ email, password });
    btn.disabled = false; btn.textContent = 'Intră în cont';
    if (error) showErr('login-error', translateError(error.message));
  }

  // ── Register ──────────────────────────────────────────────
  async function handleRegister(e) {
    e.preventDefault();
    const name  = $id('reg-name').value.trim();
    const email = $id('reg-email').value.trim();
    const pw    = $id('reg-password').value;
    const pw2   = $id('reg-password2').value;

    if (pw !== pw2) { showErr('register-error', 'Parolele nu coincid.'); return; }
    if (pw.length < 6) { showErr('register-error', 'Parola trebuie să aibă minim 6 caractere.'); return; }

    const btn = e.target.querySelector('[type=submit]');
    btn.disabled = true; btn.textContent = 'Se creează...';

    const { data, error } = await sb.auth.signUp({
      email, password: pw,
      options: { data: { display_name: name } }
    });

    if (!error && data?.user) {
      await sb.from('profiles').insert({
        id: data.user.id,
        username: name
      });
    }

    btn.disabled = false; btn.textContent = 'Creează cont';

    if (error) showErr('register-error', translateError(error.message));
    else showErr('register-error', '✓ Cont creat! Verifică-ți emailul pentru confirmare.');
  }

  // ── Forgot password ───────────────────────────────────────
  async function handleForgot() {
    const email = $id('login-email').value.trim();
    if (!email) { showErr('login-error', 'Introdu emailul mai întâi.'); return; }
    const { error } = await sb.auth.resetPasswordForEmail(email);
    showErr('login-error', error ? translateError(error.message) : '✓ Email de resetare trimis!');
  }

  // ── Logout ────────────────────────────────────────────────
  async function handleLogout() {
    await sb.auth.signOut();
  }

  // ── Profile page ──────────────────────────────────────────
  async function showProfile() {
    if (!currentUser) { openModal('login'); return; }
    window._showPageRaw?.('profile-page');
    await renderProfile(currentUser);
  }

  async function renderProfile(user) {
    const container = $id('profile-content');
    if (!container) return;

    const name     = user.user_metadata?.display_name || user.email.split('@')[0];
    const initials = getInitials(name);
    const joined   = new Date(user.created_at).toLocaleDateString('ro-RO', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    let totalSubs = 0, acceptedSubs = 0, recentSubs = [];
    try {
      const { data } = await sb
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);
      if (data) {
        recentSubs    = data;
        totalSubs     = data.length;
        acceptedSubs  = data.filter(s => s.status === 'Accepted').length;
      }
    } catch (_) {}

    const rate = totalSubs ? Math.round(acceptedSubs / totalSubs * 100) : 0;

    container.innerHTML = `
      <div class="profile-hero">
        <div class="profile-avatar-lg">${initials}</div>
        <div class="profile-meta">
          <h2 class="profile-name">${escHtml(name)}</h2>
          <p class="profile-email">${escHtml(user.email)}</p>
          <p class="profile-joined">Membru din ${joined}</p>
        </div>
        <button class="profile-logout-btn" id="profile-logout-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Deconectare
        </button>
      </div>

      <div class="profile-stats-row">
        <div class="profile-stat-card">
          <span class="profile-stat-num">${totalSubs}</span>
          <span class="profile-stat-lbl">Trimiteri</span>
        </div>
        <div class="profile-stat-card">
          <span class="profile-stat-num">${acceptedSubs}</span>
          <span class="profile-stat-lbl">Acceptate</span>
        </div>
        <div class="profile-stat-card">
          <span class="profile-stat-num">${rate}%</span>
          <span class="profile-stat-lbl">Rată succes</span>
        </div>
      </div>

      <h3 class="profile-section-title">Trimiteri recente</h3>
      ${recentSubs.length === 0
        ? '<p class="profile-empty">Nu ai trimis nicio soluție încă. <button class="link-btn" onclick="window.showProblems?.()">Încearcă o problemă!</button></p>'
        : buildSubmissionsTable(recentSubs)
      }
    `;

    $id('profile-logout-btn').addEventListener('click', handleLogout);
  }

  function buildSubmissionsTable(subs) {
    const rows = subs.map(s => {
      const title = (window.PROBLEM_TITLES || {})[s.problem_id] || s.problem_id;
      const date  = new Date(s.created_at).toLocaleDateString('ro-RO');
      const cls   = statusCls(s.status);
      return `<tr>
        <td><a href="#" class="sub-prob-link" onclick="window.showProblem?.('${s.problem_id}');return false;">${escHtml(title)}</a></td>
        <td>${escHtml(s.language_name || '-')}</td>
        <td><span class="sub-badge sub-badge--${cls}">${escHtml(s.status || 'N/A')}</span></td>
        <td>${s.time_ms != null ? s.time_ms + ' ms' : '-'}</td>
        <td>${date}</td>
      </tr>`;
    }).join('');
    return `<div class="subs-table-wrap">
      <table class="subs-table">
        <thead><tr><th>Problemă</th><th>Limbaj</th><th>Status</th><th>Timp</th><th>Dată</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  function statusCls(s) {
    if (!s) return 'pending';
    if (s === 'Accepted') return 'ok';
    if (s === 'Processing' || s === 'In Queue') return 'pending';
    if (s === 'Time Limit Exceeded') return 'tle';
    if (s.includes('Error') || s.includes('error')) return 'err';
    return 'wrong';
  }

  function translateError(msg) {
    if (!msg) return 'Eroare necunoscută.';
    if (msg.includes('Invalid login')) return 'Email sau parolă incorectă.';
    if (msg.includes('Email not confirmed')) return 'Confirmă-ți emailul înainte de a te autentifica.';
    if (msg.includes('already registered')) return 'Există deja un cont cu acest email.';
    if (msg.includes('Password should')) return 'Parola trebuie să aibă minim 6 caractere.';
    return msg;
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Wire up events ────────────────────────────────────────
  function attachEvents() {
    const modal = $id('auth-modal');
    const box   = modal?.querySelector('.auth-modal-box');

    modal?.addEventListener('click', e => { if (!box.contains(e.target)) closeModal(); });
    $id('auth-modal-close')?.addEventListener('click', closeModal);

    $id('tab-login-btn')?.addEventListener('click', () => switchTab('login'));
    $id('tab-register-btn')?.addEventListener('click', () => switchTab('register'));

    $id('login-form')?.addEventListener('submit', handleLogin);
    $id('register-form')?.addEventListener('submit', handleRegister);
    $id('forgot-password-btn')?.addEventListener('click', handleForgot);

    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  // ── Expose ────────────────────────────────────────────────
  window.openAuthModal  = openModal;
  window.closeAuthModal = closeModal;
  window.showProfile    = showProfile;
  window.currentUser    = () => currentUser;
  window.PROBLEM_TITLES = {};

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { attachEvents(); init(); });
  } else {
    attachEvents();
    init();
  }
})();
