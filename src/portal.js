import './portal-style.css'
import { createClient } from '@supabase/supabase-js'

/* Use VITE_SUPABASE_ANON_KEY if available, otherwise fall back to VITE_SUPABASE_PUBLISHABLE_KEY */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const sb = createClient(SUPABASE_URL, SUPABASE_KEY)

const ic = n => `<svg class="i" viewBox="0 0 24 24">${({
  shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  mail:'<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  eye:'<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  home:'<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  calendar:'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  award:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
  wallet:'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  loader:'<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>'
})[n]||''}</svg>`

const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const kes = n => 'KSH '+Number(n).toLocaleString()
const fmtDate = d => new Date(d).toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'})
const fmtFull = d => new Date(d).toLocaleString('en-KE',{day:'numeric',month:'long',year:'numeric',hour:'numeric',minute:'2-digit'})
const $ = s => document.querySelector(s)
const iso = () => new Date().toISOString()

let currentUser = null
let studentData = null
let portalView = 'dashboard'

/* ── toast ── */
function toast(msg, type='ok') {
  const el = document.getElementById('toasts'); if (!el) return
  const t = document.createElement('div'); t.className = 'toast '+type
  t.innerHTML = `${ic(type==='warn'?'bell':'check')}<div>${esc(msg)}</div>`
  el.append(t); setTimeout(()=>{t.style.transition='.3s';t.style.opacity=0;setTimeout(()=>t.remove(),300)},5000)
}

/* ── spinner ── */
const spinner = () => `<div class="spinner-wrap"><div class="spinner">${ic('loader')}</div><p>Loading…</p></div>`

/* ── error page ── */
function renderError(title, msg) {
  const app = document.getElementById('app'); if (!app) return
  app.innerHTML = `<div class="auth-page"><div class="auth-card">
    <div class="auth-logo">${ic('shield')}<h1>${esc(title)}</h1><p style="color:var(--bad)">${esc(msg)}</p></div>
    <button class="btn p auth-btn" onclick="location.reload()">${ic('home')}Try Again</button>
    <div class="auth-links"><button onclick="location.href='/'">← Go to Admin App</button></div>
  </div></div>`
}

/* ── 404 page ── */
function render404() {
  const app = document.getElementById('app'); if (!app) return
  app.innerHTML = `<div class="auth-page"><div class="auth-card" style="text-align:center">
    <div style="font-size:80px;font-weight:800;color:var(--ac);line-height:1">404</div>
    <h2 style="margin:12px 0 4px">Page Not Found</h2>
    <p class="mut">The page you're looking for doesn't exist.</p>
    <button class="btn p auth-btn" style="margin-top:20px" onclick="location.href='/portal.html'">${ic('home')}Back to Portal</button>
  </div></div>`
}

/* ── auth check ── */
async function init() {
  const app = document.getElementById('app')
  if (!app) return
  app.innerHTML = spinner()
  try {
    const { data, error } = await sb.auth.getSession()
    if (error) throw error
    if (data?.session) {
      currentUser = data.session.user
      await loadStudentData()
      renderPortal()
    } else {
      renderLogin()
    }
  } catch (err) {
    console.error('Portal init error:', err)
    renderLogin()
  }
}

async function loadStudentData() {
  try {
    const { data } = await sb.from('students').select('*').eq('user_id', currentUser.id).maybeSingle()
    studentData = data
  } catch (err) {
    console.warn('Could not load student data:', err)
    studentData = null
  }
}

/* ══════════════════════════════
   AUTH PAGES
   ══════════════════════════════ */

function renderLogin() {
  $('#app').innerHTML = `<div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">${ic('shield')}<h1>Sentinel</h1><p>Student Portal</p></div>
      <form id="login-form">
        <div class="fld"><label>Email</label><div class="input-icon">${ic('mail')}<input name="email" type="email" required placeholder="your@email.com"></div></div>
        <div class="fld"><label>Password</label><div class="input-icon">${ic('lock')}<input name="password" type="password" required placeholder="Enter password" id="pw">
        <button type="button" class="pw-toggle" data-act="togglepw" data-target="pw">${ic('eye')}</button></div></div>
        <button class="btn p auth-btn" type="submit">${ic('user')}Sign In</button>
      </form>
      <div class="auth-links">
        <button data-act="showForgot">Forgot password?</button>
        <span>·</span>
        <button data-act="showSignup">Create an account</button>
      </div>
    </div>
  </div>`
  $('#login-form').onsubmit = async e => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const btn = e.target.querySelector('.auth-btn')
    btn.innerHTML = `<span class="mini-spinner"></span>Signing in…`; btn.disabled = true
    const { error } = await sb.auth.signInWithPassword({ email: fd.get('email'), password: fd.get('password') })
    if (error) { toast(error.message, 'warn'); btn.innerHTML = `${ic('user')}Sign In`; btn.disabled = false }
    else { toast('Welcome back!'); init() }
  }
}

function renderSignup() {
  $('#app').innerHTML = `<div class="auth-page">
    <div class="auth-card" style="max-width:520px">
      <div class="auth-logo">${ic('shield')}<h1>Create Account</h1><p>Join Sentinel Student Portal</p></div>
      <form id="signup-form">
        <div class="two"><div class="fld"><label>Full name</label><input name="full_name" required></div>
        <div class="fld"><label>Phone</label><input name="phone" placeholder="07XX XXX XXX"></div></div>
        <div class="fld"><label>Email</label><div class="input-icon">${ic('mail')}<input name="email" type="email" required placeholder="your@email.com"></div></div>
        <div class="two"><div class="fld"><label>Password</label><div class="input-icon">${ic('lock')}<input name="password" type="password" required minlength="6" id="pw1"><button type="button" class="pw-toggle" data-act="togglepw" data-target="pw1">${ic('eye')}</button></div></div>
        <div class="fld"><label>Confirm password</label><div class="input-icon">${ic('lock')}<input name="confirm" type="password" required minlength="6" id="pw2"><button type="button" class="pw-toggle" data-act="togglepw" data-target="pw2">${ic('eye')}</button></div></div></div>
        <div class="two"><div class="fld"><label>Parent/Guardian name</label><input name="parent_name"></div>
        <div class="fld"><label>Parent phone</label><input name="parent_phone"></div></div>
        <div class="fld tc-check"><label><input type="checkbox" name="terms" required> I agree to the <button type="button" data-act="showTerms" style="color:var(--ac);text-decoration:underline;font-weight:600;background:none;border:none;cursor:pointer">Terms & Conditions</button></label></div>
        <button class="btn p auth-btn" type="submit">${ic('user')}Create Account</button>
      </form>
      <div class="auth-links"><button data-act="showLogin">Already have an account? Sign in</button></div>
    </div>
  </div>`
  $('#signup-form').onsubmit = async e => {
    e.preventDefault()
    const fd = new FormData(e.target)
    if (fd.get('password') !== fd.get('confirm')) return toast('Passwords do not match', 'warn')
    const btn = e.target.querySelector('.auth-btn')
    btn.innerHTML = `<span class="mini-spinner"></span>Creating…`; btn.disabled = true
    const { data, error } = await sb.auth.signUp({ email: fd.get('email'), password: fd.get('password') })
    if (error) { toast(error.message, 'warn'); btn.innerHTML = `${ic('user')}Create Account`; btn.disabled = false; return }
    // Create student record linked to auth user
    if (data.user) {
      const admNo = 'ADM-' + Date.now().toString(36).toUpperCase()
      await sb.from('students').insert({
        user_id: data.user.id,
        full_name: fd.get('full_name').trim(),
        phone: fd.get('phone').trim(),
        parent_name: fd.get('parent_name').trim(),
        parent_phone: fd.get('parent_phone').trim(),
        admission_number: admNo,
        accepted_terms: true,
        email: fd.get('email').trim()
      })
    }
    toast('Account created! Check your email to verify, then sign in.')
    renderLogin()
  }
}

function renderForgotPassword() {
  $('#app').innerHTML = `<div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">${ic('shield')}<h1>Reset Password</h1><p>Enter your email to receive a reset link</p></div>
      <form id="forgot-form">
        <div class="fld"><label>Email</label><div class="input-icon">${ic('mail')}<input name="email" type="email" required placeholder="your@email.com"></div></div>
        <button class="btn p auth-btn" type="submit">${ic('mail')}Send Reset Link</button>
      </form>
      <div class="auth-links"><button data-act="showLogin">← Back to Sign in</button></div>
    </div>
  </div>`
  $('#forgot-form').onsubmit = async e => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const btn = e.target.querySelector('.auth-btn')
    btn.innerHTML = `<span class="mini-spinner"></span>Sending…`; btn.disabled = true
    const { error } = await sb.auth.resetPasswordForEmail(fd.get('email'), { redirectTo: window.location.origin + '/portal.html#reset' })
    if (error) { toast(error.message, 'warn'); btn.innerHTML = `${ic('mail')}Send Reset Link`; btn.disabled = false }
    else { toast('Reset link sent to your email!'); renderLogin() }
  }
}

function renderResetPassword() {
  $('#app').innerHTML = `<div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">${ic('shield')}<h1>New Password</h1><p>Enter your new password</p></div>
      <form id="reset-form">
        <div class="fld"><label>New password</label><div class="input-icon">${ic('lock')}<input name="password" type="password" required minlength="6" id="rpw"><button type="button" class="pw-toggle" data-act="togglepw" data-target="rpw">${ic('eye')}</button></div></div>
        <button class="btn p auth-btn" type="submit">${ic('lock')}Set New Password</button>
      </form>
    </div>
  </div>`
  $('#reset-form').onsubmit = async e => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const btn = e.target.querySelector('.auth-btn')
    btn.innerHTML = `<span class="mini-spinner"></span>Saving…`; btn.disabled = true
    const { error } = await sb.auth.updateUser({ password: fd.get('password') })
    if (error) { toast(error.message, 'warn'); btn.innerHTML = `${ic('lock')}Set New Password`; btn.disabled = false }
    else { toast('Password updated!'); init() }
  }
}

function renderTerms() {
  $('#app').innerHTML = `<div class="auth-page">
    <div class="auth-card" style="max-width:640px;text-align:left">
      <h2 style="display:flex;justify-content:space-between;align-items:center">Terms & Conditions <button class="ib" data-act="showSignup">${ic('x')}</button></h2>
      <div style="max-height:60vh;overflow:auto;line-height:1.8;color:var(--mut)">
        <h3 style="color:var(--ink);margin:16px 0 8px">1. Enrollment</h3>
        <p>By creating an account, you agree to provide accurate personal and contact information. Students under 18 must have a parent or guardian listed.</p>
        <h3 style="color:var(--ink);margin:16px 0 8px">2. Attendance</h3>
        <p>Students are expected to attend all scheduled sessions. Attendance is tracked and forms part of your course completion requirements.</p>
        <h3 style="color:var(--ink);margin:16px 0 8px">3. Fees</h3>
        <p>Course fees must be paid according to the agreed schedule. Certificates will only be issued upon full fee payment and course completion.</p>
        <h3 style="color:var(--ink);margin:16px 0 8px">4. Certificates</h3>
        <p>Certificates are issued upon completion of all course topics and clearance of all outstanding fees. Each certificate has a unique verification code.</p>
        <h3 style="color:var(--ink);margin:16px 0 8px">5. Code of Conduct</h3>
        <p>Students must maintain professional conduct at all times. Any violation may result in suspension or termination of enrollment.</p>
        <h3 style="color:var(--ink);margin:16px 0 8px">6. Privacy</h3>
        <p>Your personal data is stored securely and will not be shared with third parties. Each student account is isolated — you can only access your own data.</p>
      </div>
    </div>
  </div>`
}

/* ══════════════════════════════
   STUDENT PORTAL (logged in)
   ══════════════════════════════ */

function renderPortal() {
  if (!studentData) {
    $('#app').innerHTML = `<div class="auth-page"><div class="auth-card"><div class="auth-logo">${ic('shield')}<h1>Setup Required</h1><p>Your student profile hasn't been linked yet. Contact the administrator.</p></div><button class="btn p auth-btn" data-act="logout">${ic('logout')}Sign Out</button></div></div>`
    return
  }
  const tabs = [['dashboard','home','Dashboard'],['attendance','calendar','Attendance'],['progress','target','Progress'],['certificates','award','Certificates'],['notes','book','Notes'],['fees','wallet','Fees'],['profile','user','Profile']]
  $('#app').innerHTML = `<div class="portal-shell">
    <header class="portal-header">
      <div class="brand-sm">${ic('shield')}<b>Sentinel</b><span class="mut" style="margin-left:4px">Student Portal</span></div>
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-weight:600">${esc(studentData.full_name)}</span>
        <div class="av" style="width:34px;height:34px;font-size:14px">${esc(studentData.full_name[0])}</div>
        <button class="ib" data-act="logout" title="Sign out">${ic('logout')}</button>
      </div>
    </header>
    <nav class="portal-nav">${tabs.map(([v,i,l])=>`<button class="pnav ${portalView===v?'on':''}" data-act="ptab" data-id="${v}">${ic(i)}<span>${l}</span></button>`).join('')}</nav>
    <main class="portal-main" id="pmain">${portalContent()}</main>
  </div>`
}

function portalContent() {
  return {dashboard:pDashboard,attendance:pAttendance,progress:pProgress,certificates:pCertificates,notes:pNotes,fees:pFees,profile:pProfile}[portalView]()
}

async function fetchMyData(table, extra='') {
  const { data } = await sb.from(table).select('*').eq('student_id', studentData.id)
  return data || []
}

function pDashboard() {
  return `<div class="p-welcome">
    <h1>Welcome, ${esc(studentData.full_name.split(' ')[0])}! 👋</h1>
    <p class="mut">Admission: <b style="font-family:monospace;color:var(--ac)">${esc(studentData.admission_number||'—')}</b></p>
  </div>
  <div class="pgrid">
    <button class="pcard" data-act="ptab" data-id="attendance">
      <div class="pc-icon" style="background:var(--okb);color:var(--ok)">${ic('calendar')}</div>
      <h3>Sign Attendance</h3><p class="mut">Mark yourself present for today</p>
    </button>
    <button class="pcard" data-act="ptab" data-id="progress">
      <div class="pc-icon" style="background:#ede9fe;color:#7c3aed">${ic('target')}</div>
      <h3>My Progress</h3><p class="mut">Track your topic completion</p>
    </button>
    <button class="pcard" data-act="ptab" data-id="certificates">
      <div class="pc-icon" style="background:#fef3c7;color:#b45309">${ic('award')}</div>
      <h3>Certificates</h3><p class="mut">View and download certificates</p>
    </button>
    <button class="pcard" data-act="ptab" data-id="fees">
      <div class="pc-icon" style="background:var(--ac2);color:var(--ac)">${ic('wallet')}</div>
      <h3>Fee Status</h3><p class="mut">Check payments and balance</p>
    </button>
  </div>
  <div class="pcard" style="margin-top:20px;text-align:left">
    <h3>Your Details</h3>
    <div class="pdetail"><span>Phone</span><b>${esc(studentData.phone||'—')}</b></div>
    <div class="pdetail"><span>Email</span><b>${esc(studentData.email||'—')}</b></div>
    <div class="pdetail"><span>Parent</span><b>${esc(studentData.parent_name||'—')} · ${esc(studentData.parent_phone||'—')}</b></div>
    <div class="pdetail"><span>Schedule</span><b>${esc(studentData.availability_days||'daily')} ${studentData.availability_start||''} – ${studentData.availability_end||''}</b></div>
    <div class="pdetail"><span>Type</span><b>${studentData.is_fulltime?'Full-time':'Part-time'}</b></div>
  </div>`
}

function pAttendance() {
  const today = new Date().toISOString().slice(0,10)
  return `<h2>Attendance</h2>
  <div class="pcard" style="text-align:center;padding:32px">
    <h3>Today — ${fmtDate(new Date())}</h3>
    <p class="mut" style="margin:8px 0 20px">Sign your attendance for the day</p>
    <div style="display:flex;gap:12px;justify-content:center">
      <button class="btn p" data-act="signIn" style="padding:14px 32px">${ic('check')}Sign In</button>
      <button class="btn" data-act="signOut" style="padding:14px 32px">${ic('logout')}Sign Out</button>
    </div>
    <div id="att-status" style="margin-top:16px"></div>
  </div>
  <div class="pcard" style="margin-top:16px;text-align:left"><h3>Recent Attendance</h3><div id="att-list">${spinner()}</div></div>`
}

function pProgress() {
  return `<h2>My Progress</h2><div id="progress-list">${spinner()}</div>`
}

function pCertificates() {
  return `<h2>My Certificates</h2><div id="cert-list">${spinner()}</div>`
}

function pNotes() {
  return `<h2>Course Notes</h2><div id="notes-list">${spinner()}</div>`
}

function pFees() {
  return `<h2>Fee Status</h2><div id="fees-list">${spinner()}</div>`
}

function pProfile() {
  const s = studentData
  return `<h2>My Profile</h2>
  <div class="pcard" style="text-align:left">
    <div style="display:flex;gap:16px;align-items:center;margin-bottom:20px">
      <div class="av" style="width:64px;height:64px;font-size:26px">${esc(s.full_name[0])}</div>
      <div><h3>${esc(s.full_name)}</h3><span class="mut">${esc(s.admission_number||'—')}</span></div>
    </div>
    <div class="pdetail"><span>Phone</span><b>${esc(s.phone||'—')}</b></div>
    <div class="pdetail"><span>Email</span><b>${esc(s.email||'—')}</b></div>
    <div class="pdetail"><span>Parent name</span><b>${esc(s.parent_name||'—')}</b></div>
    <div class="pdetail"><span>Parent phone</span><b>${esc(s.parent_phone||'—')}</b></div>
    <div class="pdetail"><span>Full-time</span><b>${s.is_fulltime?'Yes':'No'}</b></div>
    <div class="pdetail"><span>Availability</span><b>${esc(s.availability_days||'daily')} ${s.availability_start||''} – ${s.availability_end||''}</b></div>
    <div class="pdetail"><span>Joined</span><b>${fmtDate(s.created_at)}</b></div>
  </div>`
}

/* ── load async portal data ── */
async function loadPortalData() {
  if (!studentData) return
  const sid = studentData.id

  // Attendance
  const attEl = document.getElementById('att-list')
  if (attEl) {
    const { data: att } = await sb.from('attendance').select('*').eq('student_id', sid).order('date', { ascending: false }).limit(20)
    attEl.innerHTML = (att||[]).length ? (att||[]).map(a =>
      `<div class="pdetail"><span>${a.date}</span><b><span class="badge ${a.status==='present'?'active':'soon'}">${a.status}</span>${a.check_in?' · In: '+fmtFull(a.check_in):''}${a.check_out?' · Out: '+fmtFull(a.check_out):''}</b></div>`
    ).join('') : '<p class="mut">No attendance records yet.</p>'
  }

  // Check today's attendance status
  const attStatus = document.getElementById('att-status')
  if (attStatus) {
    const today = new Date().toISOString().slice(0,10)
    const { data: todayAtt } = await sb.from('attendance').select('*').eq('student_id', sid).eq('date', today).maybeSingle()
    if (todayAtt) {
      attStatus.innerHTML = `<span class="badge active" style="font-size:14px;padding:8px 16px">✓ Signed in today at ${todayAtt.check_in?fmtFull(todayAtt.check_in):'—'}</span>`
    }
  }

  // Progress
  const progEl = document.getElementById('progress-list')
  if (progEl) {
    const { data: enr } = await sb.from('enrollments').select('*').eq('student_id', sid)
    if (!enr?.length) { progEl.innerHTML = '<div class="pcard"><p class="mut">Not enrolled in any courses yet.</p></div>'; return }
    let html = ''
    for (const e of enr) {
      const { data: course } = await sb.from('courses').select('*').eq('id', e.course_id).maybeSingle()
      const { data: topics } = await sb.from('course_topics').select('*').eq('course_id', e.course_id).order('sort_order')
      const { data: prog } = await sb.from('progress').select('*').eq('student_id', sid)
      const done = (topics||[]).filter(t => (prog||[]).find(p => p.topic_id===t.id && p.completed)).length
      const total = (topics||[]).length
      const pct = total ? Math.round(done/total*100) : 0
      html += `<div class="pcard" style="text-align:left;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3>${esc(course?.name||'—')}</h3><span class="badge ${pct>=100?'active':'soon'}">${pct}%</span></div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
        ${(topics||[]).map(t => {
          const completed = (prog||[]).find(p=>p.topic_id===t.id)?.completed
          return `<div class="pdetail"><span>${completed?'✅':'⬜'} ${esc(t.name)}</span><b>${t.points} pts</b></div>`
        }).join('')}
      </div>`
    }
    progEl.innerHTML = html
  }

  // Certificates
  const certEl = document.getElementById('cert-list')
  if (certEl) {
    const { data: certs } = await sb.from('certificates').select('*').eq('student_id', sid)
    if (!certs?.length) { certEl.innerHTML = '<div class="pcard"><p class="mut">No certificates yet. Complete a course to earn one!</p></div>'; return }
    certEl.innerHTML = (certs||[]).map(c => {
      return `<div class="pcard" style="text-align:left;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>${ic('award')}<b style="margin-left:8px">Certificate</b><br><span class="mut" style="font-family:monospace">${esc(c.cert_code)}</span></div>
          <span class="badge ${c.admin_approved?'active':'soon'}">${c.admin_approved?'Approved':'Pending'}</span>
        </div>
        ${c.issued_at?`<small class="mut" style="display:block;margin-top:8px">Issued: ${fmtDate(c.issued_at)}</small>`:''}
      </div>`
    }).join('')
  }

  // Notes
  const notesEl = document.getElementById('notes-list')
  if (notesEl) {
    const { data: notes } = await sb.from('notes').select('*')
    if (!notes?.length) { notesEl.innerHTML = '<div class="pcard"><p class="mut">No notes uploaded yet.</p></div>'; return }
    notesEl.innerHTML = (notes||[]).map(n =>
      `<div class="pcard" style="text-align:left;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
        <div>${ic('file')}<b style="margin-left:8px">${esc(n.title)}</b></div>
        ${n.file_url?`<a href="${esc(n.file_url)}" target="_blank" class="btn" style="font-size:12px;padding:6px 12px">${ic('file')}Download</a>`:''}</div>`
    ).join('')
  }

  // Fees
  const feesEl = document.getElementById('fees-list')
  if (feesEl) {
    const { data: enr } = await sb.from('enrollments').select('*').eq('student_id', sid)
    if (!enr?.length) { feesEl.innerHTML = '<div class="pcard"><p class="mut">No enrollment records.</p></div>'; return }
    let total = 0, paid = 0
    let html = ''
    for (const e of enr) {
      const { data: course } = await sb.from('courses').select('*').eq('id', e.course_id).maybeSingle()
      total += Number(e.fees_total||0); paid += Number(e.fees_paid||0)
      const bal = Number(e.fees_total||0) - Number(e.fees_paid||0)
      html += `<div class="pcard" style="text-align:left;margin-bottom:12px">
        <h3>${esc(course?.name||'—')}</h3>
        <div class="pdetail"><span>Total Fees</span><b>${kes(e.fees_total)}</b></div>
        <div class="pdetail"><span>Paid</span><b style="color:var(--ok)">${kes(e.fees_paid)}</b></div>
        <div class="pdetail"><span>Balance</span><b style="color:${bal>0?'var(--bad)':'var(--ok)'}">${kes(bal)}</b></div>
        ${e.fees_due_date?`<div class="pdetail"><span>Due Date</span><b>${fmtDate(e.fees_due_date)}</b></div>`:''}
        <div class="progress-bar" style="margin-top:8px"><div class="progress-fill" style="width:${e.fees_total?Math.min(100,e.fees_paid/e.fees_total*100):0}%"></div></div>
      </div>`
    }
    const bal = total - paid
    feesEl.innerHTML = `<div class="pcard" style="text-align:center;margin-bottom:16px;background:${bal>0?'var(--warnb)':'var(--okb)'}">
      <h3 style="margin-bottom:4px">${bal>0?'Outstanding Balance':'All Clear!'}</h3>
      <div style="font-size:28px;font-weight:800;color:${bal>0?'var(--warn)':'var(--ok)'}">${kes(bal)}</div>
      <p class="mut">Total: ${kes(total)} · Paid: ${kes(paid)}</p>
    </div>` + html
  }
}

/* ── attendance actions ── */
async function signAttendance(type) {
  if (!studentData) return
  const today = new Date().toISOString().slice(0,10)
  const { data: existing } = await sb.from('attendance').select('*').eq('student_id', studentData.id).eq('date', today).maybeSingle()
  if (type === 'in') {
    if (existing) { toast('Already signed in today', 'warn'); return }
    const { error } = await sb.from('attendance').insert({ student_id: studentData.id, date: today, check_in: iso(), status: 'present', signed_by: 'self' })
    if (error) toast('Failed: '+error.message, 'warn')
    else { toast('Signed in! ✓'); portalView = 'attendance'; renderPortal(); setTimeout(loadPortalData, 200) }
  } else {
    if (!existing) { toast('Sign in first', 'warn'); return }
    const { error } = await sb.from('attendance').update({ check_out: iso() }).eq('id', existing.id)
    if (error) toast('Failed: '+error.message, 'warn')
    else { toast('Signed out! ✓'); portalView = 'attendance'; renderPortal(); setTimeout(loadPortalData, 200) }
  }
}

/* ── events ── */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return
  const id = b.dataset.id
  const acts = {
    showLogin: () => renderLogin(),
    showSignup: () => renderSignup(),
    showForgot: () => renderForgotPassword(),
    showTerms: () => renderTerms(),
    togglepw: () => { const inp = document.getElementById(b.dataset.target); if(inp){inp.type=inp.type==='password'?'text':'password'; b.innerHTML=ic(inp.type==='password'?'eye':'eyeoff')} },
    logout: async () => { await sb.auth.signOut(); currentUser=null; studentData=null; toast('Signed out'); renderLogin() },
    ptab: () => { portalView = id; renderPortal(); setTimeout(loadPortalData, 100) },
    signIn: () => signAttendance('in'),
    signOut: () => signAttendance('out'),
  }
  acts[b.dataset.act]?.()
})

/* ── 404 hash check ── */
if (window.location.hash === '#reset') {
  sb.auth.getSession().then(({data:{session}}) => {
    if (session) renderResetPassword()
    else renderLogin()
  })
} else {
  init()
}

// Auto-load data after render
const observer = new MutationObserver(() => {
  if (document.getElementById('att-list') || document.getElementById('progress-list') || document.getElementById('cert-list') || document.getElementById('notes-list') || document.getElementById('fees-list')) {
    loadPortalData()
  }
})
observer.observe(document.getElementById('app'), { childList: true, subtree: true })
