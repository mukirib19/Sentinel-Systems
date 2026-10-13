import './style.css'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
const DAY = 864e5
const PLANS = { weekly: { label: 'Weekly', amount: 100, days: 7 }, monthly: { label: 'Monthly', amount: 400, days: 30 }, hourly: { label: 'Hourly', amount: 0, days: 0 }, custom: { label: 'Custom', amount: 0, days: 1 } }
const COURSE_CATS = { computer_packages: 'Computer Packages', adobe: 'Adobe', networking: 'Networking & PC Repair', webdev: 'Web Development', general: 'General' }

/* ── icons ── */
const P = {
  shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  dash:'<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  wallet:'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  chart:'<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
  plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  edit:'<path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>',
  trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  undo:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  down:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  up:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
  wifi:'<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.86a10 10 0 0 1 14 0"/><path d="M8.5 16.43a5 5 0 0 1 7 0"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  print:'<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  receipt:'<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v.5"/><path d="M12 6v.5"/>',
  scan:'<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 7v10"/><path d="M12 7v10"/><path d="M17 7v10"/>',
  router:'<rect width="18" height="8" x="3" y="11" rx="2"/><path d="M12 11V3"/><path d="m8 7 4-4 4 4"/><circle cx="7" cy="15" r="1" fill="currentColor"/><circle cx="12" cy="15" r="1" fill="currentColor"/>',
  settings:'<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  invoice:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h8"/><path d="M8 9h2"/>',
  school:'<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>',
  book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>',
  calendar:'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  award:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  home:'<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  star:'<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a.53.53 0 0 0 .4.29l5.16.753a.53.53 0 0 1 .294.904L16.9 12.56a.53.53 0 0 0-.152.469l.88 5.13a.53.53 0 0 1-.77.56L12.4 16.24a.53.53 0 0 0-.494 0L7.47 18.72a.53.53 0 0 1-.77-.56l.88-5.13a.53.53 0 0 0-.152-.47L3.56 8.92a.53.53 0 0 1 .294-.904l5.16-.753a.53.53 0 0 0 .4-.29z"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  layers:'<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  monitor:'<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>'
}
const ic = n => `<svg class="i" viewBox="0 0 24 24">${P[n]||''}</svg>`

/* ── settings ── */
function getSetting(k, d='') { return localStorage.getItem('stl_'+k) || d }
function setSetting(k, v) { localStorage.setItem('stl_'+k, v) }
const BIZ = { get name(){ return getSetting('biz_name','Sentinel WiFi') }, get tagline(){ return getSetting('biz_tagline','Fast · Reliable · Always On') }, get phone(){ return getSetting('biz_phone','') }, get address(){ return getSetting('biz_address','') } }

/* ── local-first store ── */
const LS = 'sentinel_v2'
const EMPTY = {clients:[],payments:[],students:[],courses:[],course_topics:[],enrollments:[],attendance:[],progress:[],certificates:[],notes:[]}
let db = JSON.parse(localStorage.getItem(LS) || JSON.stringify(EMPTY))
// Ensure all arrays exist
for (const k of Object.keys(EMPTY)) if (!db[k]) db[k] = []
const save = () => localStorage.setItem(LS, JSON.stringify(db))
const iso = () => new Date().toISOString()
const ts = d => Date.parse(d)
function put(t, row) {
  row.updated_at = iso(); row.synced = false
  const i = db[t].findIndex(r => r.id === row.id)
  i < 0 ? db[t].push(row) : (db[t][i] = row)
  save(); sync()
}
function putR(t, row) { put(t, row); render() } // put + render

let syncing = false, syncState = 'ok'
async function sync() {
  if (syncing || !navigator.onLine) return
  syncing = true; setSync('syncing')
  try {
    const tables = Object.keys(EMPTY)
    for (const t of tables) {
      const dirty = db[t].filter(r => !r.synced)
      if (dirty.length) {
        const { error } = await sb.from(t).upsert(dirty.map(({synced,...r})=>r))
        if (error) throw error
        dirty.forEach(r => r.synced = true)
      }
    }
    for (const t of tables) {
      const { data, error } = await sb.from(t).select('*')
      if (error) { console.warn('sync pull skip '+t, error); continue }
      for (const r of data) {
        const l = db[t].find(x => x.id === r.id)
        if (!l) db[t].push({...r, amount: r.amount != null ? Number(r.amount) : undefined, synced:true})
        else if (l.synced && ts(r.updated_at) > ts(l.updated_at)) Object.assign(l, r, { amount: r.amount != null ? Number(r.amount) : undefined, synced:true })
      }
    }
    save(); setSync('ok')
  } catch (e) { console.warn('sync failed', e); setSync('err') }
  syncing = false
}
function setSync(s) { syncState = s; const el = document.querySelector('.sync'); if (el) el.outerHTML = syncPill() }
const syncPill = () => `<span class="sync ${syncState}"><i></i><span>${{ok:'Backed up',syncing:'Syncing…',err:'Offline'}[syncState]}</span></span>`

/* ── helpers ── */
const $ = s => document.querySelector(s)
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const live = a => a.filter(r => !r.deleted_at)
const kes = n => 'KSH '+Number(n).toLocaleString()
const fmt = d => new Date(d).toLocaleString('en-KE',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'})
const fmtDate = d => new Date(d).toLocaleDateString('en-KE',{day:'numeric',month:'long',year:'numeric'})
const fmtFull = d => new Date(d).toLocaleString('en-KE',{day:'numeric',month:'long',year:'numeric',hour:'numeric',minute:'2-digit'})
const dur = ms => { const h=Math.floor(ms/36e5); return h>=24?`${Math.floor(h/24)}d ${h%24}h`:h>=1?`${h}h ${Math.floor(ms/6e4)%60}m`:`${Math.max(1,Math.floor(ms/6e4))}m` }
const lastPay = id => live(db.payments).filter(p=>p.client_id===id).sort((a,b)=>ts(b.paid_at)-ts(a.paid_at))[0]
function status(c) {
  if (c.deleted_at) return {k:'gone',t:'Deleted',p:0}
  const p = lastPay(c.id); if (!p) return {k:'none',t:'No plan',p:0}
  const ms = ts(p.expires_at)-Date.now(), total = p.days?p.days*DAY:36e5
  if (ms<=0) return {k:'expired',t:'Expired '+dur(-ms)+' ago',p:0,pay:p}
  return {k:ms<DAY?'soon':'active',t:dur(ms)+' left',p:Math.min(100,ms/total*100),pay:p}
}
const statusLabel = k => ({active:'Active',soon:'Due soon',expired:'Expired',none:'No plan',gone:'Deleted'}[k])
const cname = id => db.clients.find(c=>c.id===id)?.name||'Unknown'
const cphone = id => db.clients.find(c=>c.id===id)?.phone||''
const sum = a => a.reduce((s,p)=>s+Number(p.amount||0),0)
const stat = (i,l,v,pre='') => `<div class="card stat"><div class="l">${ic(i)}${l}</div><div class="v" data-count="${v}" data-pre="${pre}">0</div></div>`
function countUp(el) {
  const to=+el.dataset.count,pre=el.dataset.pre||'',t0=performance.now()
  const f = n => { const k=Math.min(1,(n-t0)/600); el.textContent=pre+Math.round(to*(1-Math.pow(1-k,3))).toLocaleString(); k<1&&requestAnimationFrame(f) }
  requestAnimationFrame(f)
}

/* ── receipt & cert codes (HMAC) ── */
async function hmacCode(data) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw',enc.encode('sentinel_2024'),{name:'HMAC',hash:'SHA-256'},false,['sign'])
  const sig = await crypto.subtle.sign('HMAC',key,enc.encode(data))
  return Array.from(new Uint8Array(sig)).map(b=>b.toString(36)).join('').slice(0,8).toUpperCase()
}
async function genReceiptCode(pid,cid,amt,date) { return 'SNT-'+await hmacCode(`${pid}|${cid}|${amt}|${date}`) }
async function genCertCode(sid,cid) { return 'CERT-'+await hmacCode(`${sid}|${cid}|cert`) }
async function genAdmissionNo(name,date) { return 'ADM-'+await hmacCode(`${name}|${date}`) }

/* ── notifications ── */
function toast(msg,type='ok') {
  const t=document.createElement('div'); t.className='toast '+type
  t.innerHTML=`${ic(type==='warn'?'bell':'check')}<div>${esc(msg)}</div>`
  $('#toasts').append(t); setTimeout(()=>{t.style.transition='.3s';t.style.opacity=0;setTimeout(()=>t.remove(),300)},6000)
}
function notify(msg,type) {
  toast(msg,type)
  const ph=getSetting('wa_phone'), key=getSetting('wa_key')
  if (ph&&key) fetch(`https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(ph)}&text=${encodeURIComponent('Sentinel: '+msg)}&apikey=${key}`,{mode:'no-cors'}).catch(()=>{})
}
function checkExpiry() {
  for (const c of live(db.clients)) {
    const p = lastPay(c.id)
    if (p && ts(p.expires_at)<=Date.now() && !p.notified_expiry) {
      p.notified_expiry=true; put('payments',p)
      notify(`${c.name}'s ${PLANS[p.plan]?.label||''} plan has expired.`,'warn')
    }
  }
}

/* ── modals ── */
const modal = h => { const m=$('#modal'); m.innerHTML=`<div class="scrim" data-act="close"></div><div class="sheet">${h}</div>`; m.classList.add('on'); setTimeout(()=>m.querySelector('input')?.focus(),50) }
const close = () => $('#modal').classList.remove('on')
const head = t => `<h2>${t}<button class="ib" data-act="close" aria-label="Close">${ic('x')}</button></h2>`
function formModal(title,body,btn,fn) {
  modal(`${head(title)}<form>${body}<button class="btn p" style="width:100%;justify-content:center">${btn}</button></form>`)
  const f=$('.sheet form')
  f.onclick = e => { const b=e.target.closest('[data-plan]'); if(!b)return; f.querySelectorAll('[data-plan]').forEach(x=>x.classList.toggle('on',x===b)); f.plan.value=b.dataset.plan; const p=PLANS[b.dataset.plan]; if(p.amount){f.amount.value=p.amount;if(f.days)f.days.value=p.days} else if(f.amount)f.amount.select(); updateTimeFields(f) }
  f.onsubmit = e => { e.preventDefault(); fn(Object.fromEntries(new FormData(f))); close() }
}
function updateTimeFields(f) {
  const tfs = f.querySelector('.time-fields')
  const dfs = f.querySelector('.day-fields')
  if (!tfs) return
  const plan = f.plan?.value
  if (plan === 'hourly') { tfs.style.display='grid'; if(dfs)dfs.style.display='none' }
  else { tfs.style.display='none'; if(dfs)dfs.style.display='grid' }
}

/* ══════════════════════════════════════════
   MODULE: LANDING PAGE
   ══════════════════════════════════════════ */
let currentModule = localStorage.getItem('stl_module') || 'landing'
let view = 'dash', q='', filter='all', showDeleted=false, range=30
let studView = 'list', studQ='', courseView='list', courseQ=''

function renderLanding() {
  $('#app').innerHTML = `<div class="landing">
    <div class="landing-header"><div class="brand-big"><b>${ic('shield')}</b><div><h1>Sentinel</h1><p>Business Management Platform</p></div></div>${syncPill()}</div>
    <div class="module-grid">
      <button class="module-card" data-act="openmod" data-id="network">
        <div class="mc-icon net">${ic('wifi')}</div>
        <h3>Network Management</h3>
        <p>WiFi clients, payments, plans & router monitoring</p>
        <span class="mc-stat">${live(db.clients).length} clients</span>
      </button>
      <button class="module-card" data-act="openmod" data-id="classes">
        <div class="mc-icon cls">${ic('school')}</div>
        <h3>Classes & Students</h3>
        <p>Student enrollment, courses, attendance & certificates</p>
        <span class="mc-stat">${live(db.students).length} students · ${live(db.courses).length} courses</span>
      </button>
      <button class="module-card" data-act="openmod" data-id="sales">
        <div class="mc-icon sal">${ic('chart')}</div>
        <h3>Sales & Reports</h3>
        <p>Revenue reports, invoices, receipts & exports</p>
        <span class="mc-stat">${kes(sum(live(db.payments)))} total</span>
      </button>
    </div>
    <div class="landing-footer">
      <button class="btn" data-act="verify">${ic('scan')}Verify Receipt/Certificate</button>
      <button class="btn" data-act="goSettings">${ic('settings')}Settings</button>
    </div>
  </div>`
}

/* ══════════════════════════════════════════
   MODULE: NETWORK (existing WiFi management)
   ══════════════════════════════════════════ */
const NTITLES = {dash:['Dashboard','Network overview'],clients:['Clients','Everyone on the network'],pay:['Transactions','All payments'],rep:['Reports','Revenue & plans']}

function renderNetwork() {
  const [t,s] = NTITLES[view]
  const sb2 = getSetting('served_by','')
  $('#app').innerHTML = `<div class="shell"><aside class="side"><div class="brand" data-act="backlanding" style="cursor:pointer"><b>${ic('shield')}</b>Sentinel</div>
  ${[['dash','dash','Dashboard'],['clients','users','Clients'],['pay','wallet','Payments'],['rep','chart','Reports']].map(([v,i,l])=>`<button class="nav ${view===v?'on':''}" data-act="nav" data-id="${v}">${ic(i)}${l}</button>`).join('')}
  <div style="flex:1"></div>
  <button class="nav" data-act="verify">${ic('scan')}Verify</button>
  <button class="nav" data-act="goSettings">${ic('settings')}Settings</button>
  ${sb2?`<div style="padding:8px 12px;font-size:11px;color:var(--mut)">Served by: <b>${esc(sb2)}</b></div>`:''}
  </aside>
  <main class="main"><div class="top"><div><h1>${t}</h1><p class="sub">${s}</p></div><div style="display:flex;gap:10px;align-items:center">${syncPill()}<button class="btn p" data-act="addClient">${ic('plus')}<span>Add client</span></button></div></div>
  <div id="v">${{dash:netDash,clients:netClients,pay:netPay,rep:netRep}[view]()}</div></main></div>`
  document.querySelectorAll('[data-count]').forEach(el=>countUp(el))
  if (view==='clients') netList()
  if (view==='dash') updateRouterWidget()
}

function netDash() {
  const cs=live(db.clients),ps=live(db.payments),st=cs.map(status)
  const m0=new Date();m0.setDate(1);m0.setHours(0,0,0,0)
  const days=[...Array(14)].map((_,i)=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-13+i);return d})
  const vals=days.map(d=>sum(ps.filter(p=>ts(p.paid_at)>=+d&&ts(p.paid_at)<+d+DAY)))
  const mx=Math.max(...vals,1)
  const attn=cs.filter(c=>['expired','soon'].includes(status(c).k))
  return `<div class="grid4">${stat('wallet','Revenue this month',sum(ps.filter(p=>ts(p.paid_at)>=+m0)),'KSH ')}${stat('wifi','Active',st.filter(s=>s.k==='active'||s.k==='soon').length)}${stat('clock','Due soon',st.filter(s=>s.k==='soon').length)}${stat('bell','Expired',st.filter(s=>s.k==='expired').length)}</div>
  <div class="cols"><div class="card"><h3>Revenue, last 14 days</h3><div class="chart">${vals.map((v,i)=>`<div class="bar" style="--h:${v/mx*100}%"><em>${kes(v)}</em><i style="animation-delay:${i*40}ms"></i>${days[i].getDate()}</div>`).join('')}</div></div>
  <div style="display:flex;flex-direction:column;gap:14px">
  <div class="card"><h3>Needs attention</h3>${attn.length?attn.slice(0,4).map(c=>{const s=status(c);return`<div class="tr"><div class="who"><div class="av">${esc(c.name[0])}</div><div><b>${esc(c.name)}</b><small>${s.t}</small></div></div><span class="badge ${s.k}">${statusLabel(s.k)}</span></div>`}).join(''):`<div class="empty">${ic('check')}<br>All clear.</div>`}</div>
  <div class="card stat" id="router-widget"><div class="l">${ic('router')}Router Status</div><div style="margin-top:8px"><button class="btn" style="width:100%;justify-content:center;font-size:13px" data-act="routercheck">${ic('wifi')}Check Router</button></div></div>
  </div></div>
  <div class="card" style="margin-top:14px"><h3>Recent payments</h3>${netTxs(ps.sort((a,b)=>ts(b.paid_at)-ts(a.paid_at)).slice(0,6))}</div>`
}

function attendanceSummary() {
  const today = new Date().toISOString().slice(0,10)
  const att = live(db.attendance).filter(a => a.date === today)
  if (!att.length) return `<div class="empty">${ic('calendar')}<br>No attendance records today.</div>`
  return att.map(a => {
    const s = db.students.find(x=>x.id===a.student_id)
    return `<div class="tr"><div class="who"><div class="av">${esc((s?.full_name||'?')[0])}</div><div><b>${esc(s?.full_name||'Unknown')}</b><small>${a.check_in?fmt(a.check_in):'Not checked in'}</small></div></div><span class="badge active">${a.status}</span></div>`
  }).join('')
}

const netTxs = a => a.length ? a.map(p=>`<div class="tr"><div class="who"><div class="av">${esc(cname(p.client_id)[0])}</div><div><b>${esc(cname(p.client_id))}</b><small>${PLANS[p.plan]?.label||p.plan} · ${p.days?p.days+' days':p.start_time+'-'+p.end_time} · ${fmt(p.paid_at)}${p.receipt_code?` · <span style="font-family:monospace;color:var(--ac)">${p.receipt_code}</span>`:''}</small></div></div><div style="display:flex;align-items:center;gap:4px"><b>${kes(p.amount)}</b><button class="ib" title="Receipt" data-act="viewreceipt" data-id="${p.id}">${ic('receipt')}</button></div></div>`).join('') : `<div class="empty">${ic('wallet')}<br>No payments yet.</div>`

function netPay() {
  return `<div class="tools"><button class="btn" data-act="exportxl">${ic('down')}Export Excel</button><button class="btn" data-act="importdata">${ic('up')}Import</button><button class="btn" data-act="exportjson">${ic('file')}Backup</button></div><div class="card">${netTxs(live(db.payments).sort((a,b)=>ts(b.paid_at)-ts(a.paid_at)))}</div>`
}

function netClients() {
  return `<div class="tools"><div class="search">${ic('search')}<input id="q" value="${esc(q)}" placeholder="Search clients" autocomplete="off"><div class="sug" hidden></div></div>
  ${['all','active','soon','expired'].map(f=>`<button class="chip ${filter===f?'on':''}" data-act="filter" data-id="${f}">${f==='all'?'All':statusLabel(f)}</button>`).join('')}
  <button class="chip ${showDeleted?'on':''}" data-act="trash">Deleted</button></div><div class="card" id="list"></div>`
}
function netList() {
  const el=$('#list'); if(!el)return
  const n=q.trim().toLowerCase()
  const rows=db.clients.filter(c=>!!c.deleted_at===showDeleted&&(!n||c.name.toLowerCase().includes(n)||(c.phone||'').includes(n))&&(filter==='all'||status(c).k===filter)).sort((a,b)=>a.name.localeCompare(b.name))
  el.innerHTML = rows.length ? rows.map((c,i)=>{
    const s=status(c),p=s.pay
    return `<div class="row" style="animation-delay:${Math.min(i,12)*25}ms"><div class="who"><div class="av">${esc(c.name[0].toUpperCase())}</div><div><b>${esc(c.name)}</b><small>${esc(c.phone||'No phone')}</small></div></div>
    <div class="c2">${p?`<b>${kes(p.amount)}</b><br><span class="mut">${PLANS[p.plan]?.label||p.plan}, ${fmt(p.paid_at)}</span>`:'<span class="mut">No payments</span>'}</div>
    <div class="c3"><span class="badge ${s.k}">${statusLabel(s.k)}</span> <span class="mut">${c.deleted_at?'':s.t}</span>${p&&!c.deleted_at?`<div class="meter ${s.k}"><i style="--p:${s.p}%"></i></div>`:''}</div>
    <div class="acts">${c.deleted_at?`<button class="ib" title="Restore" data-act="restore" data-id="${c.id}">${ic('undo')}</button>`:`<button class="ib" title="Invoice" data-act="geninv" data-id="${c.id}">${ic('invoice')}</button><button class="ib" title="Pay" data-act="paym" data-id="${c.id}">${ic('wallet')}</button><button class="ib" title="History" data-act="hist" data-id="${c.id}">${ic('clock')}</button><button class="ib" title="Edit" data-act="editClient" data-id="${c.id}">${ic('edit')}</button><button class="ib d" title="Delete" data-act="delClient" data-id="${c.id}">${ic('trash')}</button>`}</div></div>`
  }).join('') : `<div class="empty">${ic('users')}<br>${n?`No match for "${esc(q)}".`:'No clients yet.'}</div>`
}

function netRep() {
  const from=range?Date.now()-range*DAY:0,ps=live(db.payments).filter(p=>ts(p.paid_at)>=from).sort((a,b)=>ts(b.paid_at)-ts(a.paid_at))
  const by=Object.keys(PLANS).map(k=>({k,n:ps.filter(p=>p.plan===k).length,v:sum(ps.filter(p=>p.plan===k))})),tot=sum(ps)||1
  const col={weekly:'#0f766e',monthly:'#0b1b2b',custom:'#d97706',hourly:'#7c3aed'}
  return `<div class="tools">${[[7,'7d'],[30,'30d'],[90,'90d'],[0,'All']].map(([r,l])=>`<button class="chip ${range===r?'on':''}" data-act="range" data-id="${r}">${l}</button>`).join('')}<span style="flex:1"></span><button class="btn" data-act="exportxl">${ic('down')}Excel</button><button class="btn" data-act="csv">${ic('down')}CSV</button><button class="btn" data-act="print">${ic('print')}Print</button></div>
  <div class="grid4" style="grid-template-columns:repeat(3,1fr)">${stat('wallet','Revenue',sum(ps),'KSH ')}${stat('chart','Payments',ps.length)}${stat('users','Avg',Math.round(sum(ps)/(ps.length||1)),'KSH ')}</div>
  <div class="card"><h3>Plan mix</h3><div class="stack">${by.map(b=>`<i style="flex:${b.v||1};background:${col[b.k]||'#999'}"></i>`).join('')}</div>${by.map(b=>`<div class="tr"><span><span class="badge" style="background:${col[b.k]||'#999'};color:#fff">${PLANS[b.k]?.label||b.k}</span> <span class="mut">${b.n} payments</span></span><b>${kes(b.v)} <span class="mut">${Math.round(b.v/tot*100)}%</span></b></div>`).join('')}</div>
  <div class="card" style="margin-top:14px;overflow:auto"><h3>Transactions</h3><table class="tbl"><tr><th>Receipt</th><th>Date</th><th>Client</th><th>Plan</th><th>Amount</th><th>Served By</th></tr>${ps.map(p=>`<tr><td style="font-family:monospace;font-weight:600;color:var(--ac)">${esc(p.receipt_code||'—')}</td><td>${fmt(p.paid_at)}</td><td>${esc(cname(p.client_id))}</td><td>${PLANS[p.plan]?.label||p.plan}</td><td><b>${kes(p.amount)}</b></td><td>${esc(p.served_by||'—')}</td></tr>`).join('')}</table></div>`
}

/* ── pay fields with time support ── */
function payFields() {
  const sb2 = getSetting('served_by','')
  return `<div class="chips">${Object.entries(PLANS).map(([k,p],i)=>`<button type="button" class="chip ${i?'':'on'}" data-plan="${k}">${p.label}<small>${p.amount?'KSH '+p.amount:k==='hourly'?'Set time':'You set it'}</small></button>`).join('')}</div>
  <input type="hidden" name="plan" value="weekly">
  <div class="day-fields two"><div class="fld"><label>Amount (KSH)</label><input name="amount" type="number" min="1" step="any" required value="100"></div><div class="fld"><label>Days of access</label><input name="days" type="number" min="1" required value="7"></div></div>
  <div class="time-fields two" style="display:none"><div class="fld"><label>Amount (KSH)</label><input name="hourly_amount" type="number" min="1" step="any" value="50"></div><div></div><div class="fld"><label>Start time</label><input name="start_time" type="time" value="16:00"></div><div class="fld"><label>End time</label><input name="end_time" type="time" value="04:00"></div></div>
  <div class="fld"><label>Served by</label><input name="served_by" value="${esc(sb2)}" placeholder="Your name"></div>`
}

async function addPayment(cid, d) {
  const isHourly = d.plan === 'hourly'
  const amount = Number(isHourly ? d.hourly_amount : d.amount)
  const days = isHourly ? 0 : Number(d.days)
  const now = new Date()
  let expiresAt
  if (isHourly) {
    const [eh,em] = (d.end_time||'04:00').split(':').map(Number)
    const exp = new Date(now); exp.setHours(eh,em,0,0)
    if (exp <= now) exp.setDate(exp.getDate()+1) // next day if end time is past
    expiresAt = exp.toISOString()
  } else {
    expiresAt = new Date(+now+days*DAY).toISOString()
  }
  const pid = crypto.randomUUID()
  const receiptCode = await genReceiptCode(pid,cid,amount,now.toISOString())
  if (d.served_by) setSetting('served_by', d.served_by)
  put('payments',{id:pid,client_id:cid,plan:d.plan,amount,days,start_time:d.start_time||null,end_time:d.end_time||null,paid_at:now.toISOString(),expires_at:expiresAt,notified_expiry:false,receipt_code:receiptCode,served_by:d.served_by||getSetting('served_by',''),created_at:iso(),deleted_at:null})
  notify(`${cname(cid)} paid ${kes(amount)} — ${isHourly?d.start_time+'-'+d.end_time:days+' days'}. Receipt: ${receiptCode}`)
  render()
}

function clientForm(c) {
  formModal(c?'Edit client':'Add client',`<div class="fld"><label>Full name</label><input name="name" required value="${esc(c?.name||'')}" placeholder="e.g. Benard Otieno"></div><div class="fld"><label>Phone</label><input name="phone" value="${esc(c?.phone||'')}" placeholder="07XX XXX XXX"></div>${c?'':payFields()}`,c?'Save changes':'Add client & record payment', d => {
    const id=c?.id||crypto.randomUUID()
    put('clients',{...(c||{id,created_at:iso(),deleted_at:null}),name:d.name.trim(),phone:d.phone.trim()})
    if(!c) addPayment(id,d)
    render()
  })
}

/* ── router ── */
let routerData = {status:'idle',count:0,users:[],lastCheck:null}
async function fetchRouter() {
  routerData.status='checking'; updateRouterWidget()
  try {
    const r = await fetch('http://localhost:3377/api/router/clients',{signal:AbortSignal.timeout(6000)})
    const d = await r.json()
    if (d.ok) { routerData={status:'online',count:d.count,users:d.users||[],lastCheck:iso()} }
    else { routerData.status='unreachable'; routerData.lastCheck=iso() }
  } catch {
    try { await fetch('http://192.168.0.1',{mode:'no-cors',signal:AbortSignal.timeout(3000)}); routerData={status:'reachable',count:-1,users:[],lastCheck:iso()} }
    catch { routerData.status='unreachable'; routerData.lastCheck=iso() }
  }
  updateRouterWidget()
}
function updateRouterWidget() {
  const el=document.getElementById('router-widget'); if(!el)return
  const colors={idle:'var(--mut)',checking:'var(--warn)',online:'var(--ok)',reachable:'var(--ok)',unreachable:'var(--bad)'}
  const texts={idle:'Not checked',checking:'Checking…',online:`${routerData.count} device${routerData.count!==1?'s':''} online`,reachable:'Router online (open admin for details)',unreachable:'Router unreachable'}
  el.innerHTML=`<div class="l" style="color:${colors[routerData.status]}">${ic(routerData.status==='online'?'wifi':'router')}${texts[routerData.status]}</div>
  ${routerData.count>0?`<div style="margin:10px 0;max-height:120px;overflow:auto">${routerData.users.map(u=>`<div class="tr" style="padding:4px 0"><small><b>${esc(u.name||u.hostname||'Device')}</b> — ${esc(u.ip||'')}</small></div>`).join('')}</div>`:''}
  <div style="display:flex;gap:8px;margin-top:10px"><button class="btn" style="flex:1;justify-content:center;font-size:13px" data-act="routercheck">${ic('wifi')}Ping</button><a href="http://192.168.0.1" target="_blank" class="btn" style="flex:1;justify-content:center;font-size:13px;text-decoration:none">${ic('settings')}Admin</a></div>
  ${routerData.lastCheck?`<small class="mut" style="display:block;text-align:center;margin-top:6px">Last: ${fmt(routerData.lastCheck)}</small>`:''}`
}

/* ── excel/csv/import ── */
function exportExcel() {
  const ps=live(db.payments).sort((a,b)=>ts(b.paid_at)-ts(a.paid_at))
  let h=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table><tr>${['Receipt','Date','Client','Phone','Plan','Days/Time','Amount','Expires','Served By'].map(x=>`<th style="background:#0f766e;color:#fff;font-weight:bold;padding:8px">${x}</th>`).join('')}</tr>`
  for(const p of ps) h+=`<tr><td>${esc(p.receipt_code||'')}</td><td>${fmtFull(p.paid_at)}</td><td>${esc(cname(p.client_id))}</td><td>${esc(cphone(p.client_id))}</td><td>${PLANS[p.plan]?.label||p.plan}</td><td>${p.days?p.days+' days':(p.start_time||'')+'-'+(p.end_time||'')}</td><td>${p.amount}</td><td>${fmtFull(p.expires_at)}</td><td>${esc(p.served_by||'')}</td></tr>`
  h+=`<tr><td colspan="6" style="font-weight:bold">TOTAL</td><td style="font-weight:bold">${sum(ps)}</td><td></td><td></td></tr></table></body></html>`
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([h],{type:'application/vnd.ms-excel'})); a.download=`sentinel-${new Date().toISOString().slice(0,10)}.xls`; a.click(); toast('Excel downloaded')
}
function importData() {
  const inp=document.createElement('input');inp.type='file';inp.accept='.csv,.json'
  inp.onchange=async e=>{const f=e.target.files[0];if(!f)return;const t=await f.text()
    try{if(f.name.endsWith('.json')){const d=JSON.parse(t);for(const k of Object.keys(EMPTY))if(d[k])for(const r of d[k])if(!db[k].find(x=>x.id===r.id))db[k].push({...r,synced:false})}else{const lines=t.split('\n').map(l=>l.split(',').map(v=>v.replace(/^"|"$/g,'').trim()));const hdr=lines[0].map(h=>h.toLowerCase());const ni=hdr.indexOf('client')>=0?hdr.indexOf('client'):hdr.indexOf('name');const ai=hdr.indexOf('amount');for(let r=1;r<lines.length;r++){const row=lines[r];if(!row[ni])continue;const name=row[ni];let cl=live(db.clients).find(c=>c.name.toLowerCase()===name.toLowerCase());if(!cl){cl={id:crypto.randomUUID(),name,phone:'',created_at:iso(),updated_at:iso(),deleted_at:null,synced:false};db.clients.push(cl)}}}save();render();sync();toast(`Imported from ${f.name}`)}catch(err){toast('Import failed: '+err.message,'warn')}}
  inp.click()
}

/* ── invoice & receipt generators ── */
function generateInvoice(cid) {
  const c=db.clients.find(x=>x.id===cid);if(!c)return toast('Not found','warn')
  const payments=live(db.payments).filter(p=>p.client_id===cid).sort((a,b)=>ts(b.paid_at)-ts(a.paid_at))
  const invNo='INV-'+Date.now().toString(36).toUpperCase(),total=sum(payments)
  const w=window.open('','_blank')
  w.document.write(`<!DOCTYPE html><html><head><title>${invNo}</title><style>*{margin:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;color:#0b1b2b;padding:40px;max-width:800px;margin:0 auto}.header{display:flex;justify-content:space-between;margin-bottom:40px;padding-bottom:20px;border-bottom:3px solid #0f766e}.logo{font-size:28px;font-weight:800;color:#0f766e}.logo small{display:block;font-size:12px;font-weight:400;color:#64748b}.inv-meta{text-align:right;font-size:13px;color:#64748b}.inv-meta b{display:block;font-size:22px;color:#0b1b2b}table{width:100%;border-collapse:collapse;margin-bottom:24px}th{background:#f6f8fa;text-align:left;padding:10px 12px;font-size:12px;text-transform:uppercase;color:#64748b;border-bottom:2px solid #e5e9ef}td{padding:12px;border-bottom:1px solid #e5e9ef}.total td{border-top:2px solid #0f766e;font-weight:700;font-size:16px;background:#e6f4f2}.footer{text-align:center;margin-top:40px;color:#64748b;font-size:12px}@media print{button{display:none}}.pb{position:fixed;top:20px;right:20px;background:#0f766e;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-weight:700;cursor:pointer}</style></head><body>
  <button class="pb" onclick="print()">🖨 Print</button>
  <div class="header"><div class="logo">🛡 ${esc(BIZ.name)}<small>${esc(BIZ.tagline)}</small></div><div class="inv-meta"><b>${invNo}</b>${fmtDate(new Date())}<br>PAID</div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:30px"><div><h4 style="font-size:11px;text-transform:uppercase;color:#64748b;margin-bottom:8px">Bill To</h4><p><b>${esc(c.name)}</b><br>${esc(c.phone||'')}<br>Client since ${fmtDate(c.created_at)}</p></div><div><h4 style="font-size:11px;text-transform:uppercase;color:#64748b;margin-bottom:8px">From</h4><p><b>${esc(BIZ.name)}</b><br>${esc(BIZ.phone)}</p></div></div>
  <table><tr><th>#</th><th>Date</th><th>Plan</th><th>Duration</th><th>Receipt</th><th style="text-align:right">Amount</th></tr>
  ${payments.map((p,i)=>`<tr><td>${i+1}</td><td>${fmtDate(p.paid_at)}</td><td>${PLANS[p.plan]?.label||p.plan}</td><td>${p.days?p.days+' days':(p.start_time||'')+'-'+(p.end_time||'')}</td><td style="font-family:monospace">${esc(p.receipt_code||'—')}</td><td style="text-align:right">${kes(p.amount)}</td></tr>`).join('')}
  <tr class="total"><td colspan="5">TOTAL</td><td style="text-align:right">${kes(total)}</td></tr></table>
  <div class="footer"><p>Thank you for choosing ${esc(BIZ.name)}!</p></div></body></html>`)
  w.document.close()
}

async function viewReceipt(pid) {
  const p=db.payments.find(x=>x.id===pid);if(!p)return
  if(!p.receipt_code){p.receipt_code=await genReceiptCode(p.id,p.client_id,p.amount,p.paid_at);save()}
  const c=db.clients.find(x=>x.id===p.client_id)
  const w=window.open('','_blank')
  w.document.write(`<!DOCTYPE html><html><head><title>${p.receipt_code}</title><style>*{margin:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;display:flex;justify-content:center;padding:40px;background:#f6f8fa}.r{background:#fff;width:380px;padding:32px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,.08)}.rh{text-align:center;padding-bottom:20px;border-bottom:2px dashed #e5e9ef;margin-bottom:20px}.rh h1{font-size:22px;color:#0f766e}.rr{display:flex;justify-content:space-between;padding:8px 0;font-size:14px}.d{border:none;border-top:2px dashed #e5e9ef;margin:16px 0}.ab{text-align:center;background:#e6f4f2;border-radius:12px;padding:16px;margin:16px 0}.ab .a{font-size:32px;font-weight:800;color:#0f766e}.cb{text-align:center;background:#f6f8fa;border-radius:10px;padding:14px;margin-top:16px;border:1px solid #e5e9ef}.cb .c{font-family:monospace;font-size:20px;font-weight:800;color:#0f766e}.ft{text-align:center;margin-top:20px;padding-top:16px;border-top:2px dashed #e5e9ef;color:#64748b;font-size:11px}@media print{body{background:#fff;padding:0}.r{box-shadow:none}button{display:none}}.pb{position:fixed;top:20px;right:20px;background:#0f766e;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-weight:700;cursor:pointer}</style></head><body>
  <button class="pb" onclick="print()">🖨 Print</button>
  <div class="r"><div class="rh"><h1>🛡 ${esc(BIZ.name)}</h1><small style="color:#64748b">${esc(BIZ.tagline)}</small></div>
  <div class="rr" style="color:#64748b;font-size:12px;text-transform:uppercase"><span>Receipt</span><span>${fmtDate(p.paid_at)}</span></div>
  <div class="rr"><span>Client</span><b>${esc(c?.name||'Unknown')}</b></div>
  <div class="rr"><span>Phone</span><b>${esc(c?.phone||'N/A')}</b></div>
  <div class="rr"><span>Plan</span><b>${PLANS[p.plan]?.label||p.plan}</b></div>
  <div class="rr"><span>Duration</span><b>${p.days?p.days+' days':(p.start_time||'')+' → '+(p.end_time||'')}</b></div>
  <div class="rr"><span>Valid Until</span><b>${fmtDate(p.expires_at)}</b></div>
  <div class="rr"><span>Served By</span><b>${esc(p.served_by||'Staff')}</b></div>
  <hr class="d"><div class="ab"><div class="a">${kes(p.amount)}</div><small style="color:#64748b">Amount Paid</small></div>
  <div class="cb"><div class="c">${esc(p.receipt_code)}</div><small style="color:#64748b">Verification Code</small></div>
  <div class="ft"><p>${fmtFull(p.paid_at)}</p><p style="margin-top:4px">Thank you!</p></div></div></body></html>`)
  w.document.close()
}

/* ── verifier (receipts + certificates) ── */
function openVerifier() {
  modal(`${head('Verify Receipt or Certificate')}
  <div style="text-align:center;margin-bottom:16px">${ic('scan')}<p class="mut" style="margin-top:8px">Enter a receipt code (SNT-...) or certificate code (CERT-...)</p></div>
  <div class="fld"><label>Code</label><input id="verify-input" placeholder="SNT-XXXXXXXX or CERT-XXXXXXXX" style="font-family:monospace;font-size:18px;text-align:center;letter-spacing:.1em;text-transform:uppercase"></div>
  <button class="btn p" style="width:100%;justify-content:center" data-act="verifygo">${ic('search')}Verify</button>
  <div id="verify-result" style="margin-top:16px"></div>`)
}
async function runVerify() {
  const code=$('#verify-input')?.value?.trim().toUpperCase();if(!code)return toast('Enter a code','warn')
  const el=$('#verify-result'); el.innerHTML='<div style="text-align:center;color:var(--mut)">Verifying…</div>'
  // Check receipts
  if(code.startsWith('SNT-')){
    for(const p of db.payments){
      const gen=await genReceiptCode(p.id,p.client_id,p.amount,p.paid_at)
      if(gen===code){const c=db.clients.find(x=>x.id===p.client_id);el.innerHTML=`<div class="card" style="background:var(--okb);border-color:var(--ok)"><div style="display:flex;align-items:center;gap:10px;color:var(--ok);font-weight:700;margin-bottom:12px">${ic('check')} Receipt Verified</div><div style="display:flex;justify-content:space-between;padding:4px 0"><span class="mut">Client</span><b>${esc(c?.name)}</b></div><div style="display:flex;justify-content:space-between;padding:4px 0"><span class="mut">Amount</span><b>${kes(p.amount)}</b></div><div style="display:flex;justify-content:space-between;padding:4px 0"><span class="mut">Date</span><b>${fmtFull(p.paid_at)}</b></div><div style="display:flex;justify-content:space-between;padding:4px 0"><span class="mut">Served By</span><b>${esc(p.served_by||'Staff')}</b></div></div>`;return}
    }
  }
  // Check certificates
  if(code.startsWith('CERT-')||code.startsWith('ADM-')){
    const cert=db.certificates.find(x=>x.cert_code===code)
    if(cert){const s=db.students.find(x=>x.id===cert.student_id);const co=db.courses.find(x=>x.id===cert.course_id);el.innerHTML=`<div class="card" style="background:var(--okb);border-color:var(--ok)"><div style="display:flex;align-items:center;gap:10px;color:var(--ok);font-weight:700;margin-bottom:12px">${ic('check')} Certificate Verified</div><div style="display:flex;justify-content:space-between;padding:4px 0"><span class="mut">Student</span><b>${esc(s?.full_name||'Unknown')}</b></div><div style="display:flex;justify-content:space-between;padding:4px 0"><span class="mut">Admission</span><b>${esc(s?.admission_number||'—')}</b></div><div style="display:flex;justify-content:space-between;padding:4px 0"><span class="mut">Course</span><b>${esc(co?.name||'—')}</b></div><div style="display:flex;justify-content:space-between;padding:4px 0"><span class="mut">Issued</span><b>${cert.issued_at?fmtDate(cert.issued_at):'—'}</b></div></div>`;return}
  }
  el.innerHTML=`<div class="card" style="background:var(--badb);border-color:var(--bad)"><div style="display:flex;align-items:center;gap:10px;color:var(--bad);font-weight:700">${ic('x')} Not Found</div><p class="mut" style="margin-top:8px">This code does not match any record.</p></div>`
}

/* ══════════════════════════════════════════
   MODULE: CLASSES & STUDENTS
   ══════════════════════════════════════════ */
let classTab = 'students' // students | courses | attendance | progress | certificates | notes

function renderClasses() {
  $('#app').innerHTML = `<div class="shell"><aside class="side"><div class="brand" data-act="backlanding" style="cursor:pointer"><b>${ic('shield')}</b>Sentinel</div>
  ${[['students','users','Students'],['courses','book','Courses'],['attendance','calendar','Attendance'],['progress','target','Progress'],['certificates','award','Certificates'],['notes','file','Notes']].map(([v,i,l])=>`<button class="nav ${classTab===v?'on':''}" data-act="classTab" data-id="${v}">${ic(i)}${l}</button>`).join('')}
  <div style="flex:1"></div>
  <button class="nav" data-act="verify">${ic('scan')}Verify</button>
  <button class="nav" data-act="goSettings">${ic('settings')}Settings</button>
  </aside>
  <main class="main"><div class="top"><div><h1>${{students:'Students',courses:'Courses',attendance:'Attendance',progress:'Progress',certificates:'Certificates',notes:'Notes'}[classTab]}</h1><p class="sub">${{students:'All registered students',courses:'Manage courses & topics',attendance:'Daily attendance tracking',progress:'Student progress & completion',certificates:'Certificate management',notes:'PDF notes & materials'}[classTab]}</p></div>
  <div style="display:flex;gap:10px;align-items:center">${syncPill()}${classTab==='students'?`<button class="btn p" data-act="addStudent">${ic('plus')}<span>Add student</span></button>`:classTab==='courses'?`<button class="btn p" data-act="addCourse">${ic('plus')}<span>Add course</span></button>`:classTab==='notes'?`<button class="btn" data-act="addNote">${ic('plus')}<span>Upload PDF</span></button>`:''}</div></div>
  <div id="v">${{students:studentsView,courses:coursesView,attendance:attendanceView,progress:progressView,certificates:certificatesView,notes:notesView}[classTab]()}</div></main></div>`
  document.querySelectorAll('[data-count]').forEach(el=>countUp(el))
}

/* ── students ── */
function studentsView() {
  const sts=live(db.students)
  return `<div class="tools"><div class="search">${ic('search')}<input id="sq" value="${esc(studQ)}" placeholder="Search students" autocomplete="off"></div><button class="btn" data-act="exportStudents">${ic('down')}Export</button></div>
  <div class="grid4" style="grid-template-columns:repeat(3,1fr)">${stat('users','Total Students',sts.length)}${stat('star','Full-time',sts.filter(s=>s.is_fulltime).length)}${stat('book','Enrollments',live(db.enrollments).length)}</div>
  <div class="card" id="slist">${studentsList(sts)}</div>`
}
function studentsList(sts) {
  const n=studQ.trim().toLowerCase()
  const rows=sts.filter(s=>!n||s.full_name.toLowerCase().includes(n)||(s.phone||'').includes(n)||(s.admission_number||'').toLowerCase().includes(n)).sort((a,b)=>a.full_name.localeCompare(b.full_name))
  if(!rows.length) return `<div class="empty">${ic('users')}<br>${n?'No match.':'No students yet. Add one to get started.'}</div>`
  return rows.map((s,i)=>{
    const enr=live(db.enrollments).filter(e=>e.student_id===s.id)
    const courseName = enr.length ? db.courses.find(c=>c.id===enr[0].course_id)?.name||'—' : '—'
    const feesPaid = enr.reduce((t,e)=>t+Number(e.fees_paid||0),0)
    const feesTotal = enr.reduce((t,e)=>t+Number(e.fees_total||0),0)
    return `<div class="row" style="animation-delay:${Math.min(i,12)*25}ms"><div class="who"><div class="av">${esc(s.full_name[0].toUpperCase())}</div><div><b>${esc(s.full_name)}</b><small>${esc(s.admission_number||'No admission #')} · ${esc(s.phone||'No phone')}</small></div></div>
    <div class="c2"><b>${esc(courseName)}</b><br><span class="mut">${s.is_fulltime?'Full-time':'Part-time'} · ${s.availability_days||'daily'} ${s.availability_start||''}-${s.availability_end||''}</span></div>
    <div class="c3">${feesTotal>0?`<span class="mut">Fees: ${kes(feesPaid)}/${kes(feesTotal)}</span><div class="meter ${feesPaid>=feesTotal?'active':'soon'}"><i style="--p:${Math.min(100,feesPaid/feesTotal*100)}%"></i></div>`:'<span class="mut">No fees</span>'}</div>
    <div class="acts"><button class="ib" title="View" data-act="viewStudent" data-id="${s.id}">${ic('user')}</button><button class="ib" title="Edit" data-act="editStudent" data-id="${s.id}">${ic('edit')}</button><button class="ib d" title="Delete" data-act="delStudent" data-id="${s.id}">${ic('trash')}</button></div></div>`
  }).join('')
}

function studentFormModal(s) {
  const courses = live(db.courses)
  const courseOpts = courses.map(c=>`<option value="${c.id}">${esc(c.name)} (${esc(COURSE_CATS[c.category]||c.category)}) — ${kes(c.price)}</option>`).join('')
  formModal(s?'Edit Student':'Add Student',`
  <div class="two"><div class="fld"><label>Full name</label><input name="full_name" required value="${esc(s?.full_name||'')}"></div><div class="fld"><label>Phone</label><input name="phone" value="${esc(s?.phone||'')}"></div></div>
  <div class="two"><div class="fld"><label>Parent/Guardian name</label><input name="parent_name" value="${esc(s?.parent_name||'')}"></div><div class="fld"><label>Parent phone</label><input name="parent_phone" value="${esc(s?.parent_phone||'')}"></div></div>
  <div class="fld"><label>Email</label><input name="email" type="email" value="${esc(s?.email||'')}"></div>
  <div class="two"><div class="fld"><label>Full-time?</label><select name="is_fulltime"><option value="true" ${s?.is_fulltime!==false?'selected':''}>Full-time</option><option value="false" ${s?.is_fulltime===false?'selected':''}>Part-time</option></select></div>
  <div class="fld"><label>Availability</label><select name="availability_days"><option value="daily" ${(s?.availability_days||'daily')==='daily'?'selected':''}>Daily</option><option value="weekdays" ${s?.availability_days==='weekdays'?'selected':''}>Weekdays</option><option value="weekends" ${s?.availability_days==='weekends'?'selected':''}>Weekends</option><option value="custom" ${s?.availability_days==='custom'?'selected':''}>Custom</option></select></div></div>
  <div class="two"><div class="fld"><label>Start time</label><input name="availability_start" type="time" value="${s?.availability_start||'09:00'}"></div><div class="fld"><label>End time</label><input name="availability_end" type="time" value="${s?.availability_end||'17:00'}"></div></div>
  ${!s?`<div class="fld"><label>Enroll in course</label><select name="course_id"><option value="">— Select course —</option>${courseOpts}</select></div>
  <div class="two"><div class="fld"><label>Fees paid (KSH)</label><input name="fees_paid" type="number" min="0" value="0"></div><div class="fld"><label>Expected payment date</label><input name="fees_due_date" type="date"></div></div>`:''}
  `, s?'Save changes':'Add student', async d => {
    const id = s?.id || crypto.randomUUID()
    const admNo = s?.admission_number || await genAdmissionNo(d.full_name, iso())
    put('students',{...(s||{id,created_at:iso(),deleted_at:null}),full_name:d.full_name.trim(),phone:d.phone.trim(),email:d.email?.trim()||'',parent_name:d.parent_name.trim(),parent_phone:d.parent_phone.trim(),is_fulltime:d.is_fulltime==='true',availability_days:d.availability_days,availability_start:d.availability_start,availability_end:d.availability_end,admission_number:admNo,accepted_terms:true})
    if(!s && d.course_id) {
      const course = db.courses.find(c=>c.id===d.course_id)
      put('enrollments',{id:crypto.randomUUID(),student_id:id,course_id:d.course_id,enrolled_at:iso(),status:'active',fees_total:Number(course?.price||0),fees_paid:Number(d.fees_paid||0),fees_due_date:d.fees_due_date?new Date(d.fees_due_date).toISOString():null,created_at:iso(),deleted_at:null})
      // Create progress entries for all topics in the course
      for(const t of live(db.course_topics).filter(t=>t.course_id===d.course_id)) {
        put('progress',{id:crypto.randomUUID(),student_id:id,topic_id:t.id,completed:false,completed_at:null,marked_by:'',created_at:iso(),deleted_at:null})
      }
    }
    toast(s?'Student updated':'Student added — Admission: '+admNo)
    render()
  })
}

function viewStudentModal(sid) {
  const s=db.students.find(x=>x.id===sid);if(!s)return
  const enr=live(db.enrollments).filter(e=>e.student_id===sid)
  const att=live(db.attendance).filter(a=>a.student_id===sid).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,10)
  const prog=live(db.progress).filter(p=>p.student_id===sid)
  const totalPts=prog.reduce((t,p)=>{const tp=db.course_topics.find(x=>x.id===p.topic_id);return t+(tp?.points||0)},0)
  const earnedPts=prog.filter(p=>p.completed).reduce((t,p)=>{const tp=db.course_topics.find(x=>x.id===p.topic_id);return t+(tp?.points||0)},0)

  modal(`${head(esc(s.full_name))}
  <div style="display:flex;gap:14px;margin-bottom:16px"><div class="av" style="width:56px;height:56px;font-size:22px">${esc(s.full_name[0])}</div><div><b style="font-size:18px">${esc(s.full_name)}</b><br><span class="mut">${esc(s.admission_number||'—')} · ${s.is_fulltime?'Full-time':'Part-time'}</span><br><span class="mut">${esc(s.phone||'')} · ${esc(s.email||'')}</span></div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;font-size:13px">
    <div><span class="mut">Parent:</span> <b>${esc(s.parent_name||'—')}</b></div>
    <div><span class="mut">Parent Phone:</span> <b>${esc(s.parent_phone||'—')}</b></div>
    <div><span class="mut">Availability:</span> <b>${esc(s.availability_days||'daily')} ${s.availability_start||''}-${s.availability_end||''}</b></div>
    <div><span class="mut">Points:</span> <b>${earnedPts}/${totalPts}</b></div>
  </div>
  <h3 style="margin-bottom:8px">Courses</h3>
  ${enr.length?enr.map(e=>{const co=db.courses.find(c=>c.id===e.course_id);return`<div class="tr"><div><b>${esc(co?.name||'—')}</b><br><span class="mut">Fees: ${kes(e.fees_paid)}/${kes(e.fees_total)}${e.fees_due_date?' · Due: '+fmtDate(e.fees_due_date):''}</span></div><span class="badge ${e.status==='completed'?'active':'soon'}">${e.status}</span></div>`}).join(''):'<div class="mut">Not enrolled in any course</div>'}
  <h3 style="margin:16px 0 8px">Recent Attendance</h3>
  ${att.length?att.map(a=>`<div class="tr"><span>${a.date}</span><span class="badge active">${a.status}</span></div>`).join(''):'<div class="mut">No attendance records</div>'}
  <div style="margin-top:16px;display:flex;gap:8px">
    <button class="btn p" style="flex:1;justify-content:center" data-act="studentInvoice" data-id="${sid}">${ic('invoice')}Invoice</button>
    <button class="btn" style="flex:1;justify-content:center" data-act="enrollStudent" data-id="${sid}">${ic('book')}Enroll</button>
  </div>`)
}

/* ── courses ── */
function coursesView() {
  const cs = live(db.courses)
  return `<div class="tools"><div class="search">${ic('search')}<input id="cq" value="${esc(courseQ)}" placeholder="Search courses" autocomplete="off"></div></div>
  <div class="grid4" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">${cs.filter(c=>!courseQ||c.name.toLowerCase().includes(courseQ.toLowerCase())).map(c=>{
    const topics=live(db.course_topics).filter(t=>t.course_id===c.id)
    const enrolled=live(db.enrollments).filter(e=>e.course_id===c.id).length
    return `<div class="card" style="cursor:pointer" data-act="viewCourse" data-id="${c.id}">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px"><div><h3 style="margin-bottom:2px">${esc(c.name)}</h3><span class="badge" style="background:var(--ac2);color:var(--ac)">${esc(COURSE_CATS[c.category]||c.category)}</span></div><div class="acts"><button class="ib" title="Edit" data-act="editCourse" data-id="${c.id}">${ic('edit')}</button><button class="ib d" title="Delete" data-act="delCourse" data-id="${c.id}">${ic('trash')}</button></div></div>
      <p class="mut" style="margin-bottom:10px">${esc(c.description||'No description')}</p>
      <div style="display:flex;justify-content:space-between;font-size:13px"><span><b>${kes(c.price)}</b></span><span class="mut">${topics.length} topics · ${enrolled} enrolled</span></div>
    </div>`
  }).join('')}</div>`
}

function courseFormModal(c) {
  formModal(c?'Edit Course':'Add Course',`
  <div class="fld"><label>Course name</label><input name="name" required value="${esc(c?.name||'')}"></div>
  <div class="two"><div class="fld"><label>Category</label><select name="category">${Object.entries(COURSE_CATS).map(([k,v])=>`<option value="${k}" ${c?.category===k?'selected':''}>${v}</option>`).join('')}</select></div>
  <div class="fld"><label>Price (KSH)</label><input name="price" type="number" min="0" required value="${c?.price||0}"></div></div>
  <div class="fld"><label>Description</label><input name="description" value="${esc(c?.description||'')}"></div>
  `, c?'Save changes':'Add course', d => {
    const id=c?.id||crypto.randomUUID()
    put('courses',{...(c||{id,created_at:iso(),deleted_at:null,is_active:true}),name:d.name.trim(),category:d.category,price:Number(d.price),description:d.description.trim()})
    toast(c?'Course updated':'Course added')
    render()
  })
}

function viewCourseModal(cid) {
  const c=db.courses.find(x=>x.id===cid);if(!c)return
  const topics=live(db.course_topics).filter(t=>t.course_id===cid).sort((a,b)=>a.sort_order-b.sort_order)
  modal(`${head(esc(c.name))}
  <div style="margin-bottom:16px"><span class="badge" style="background:var(--ac2);color:var(--ac)">${esc(COURSE_CATS[c.category]||c.category)}</span> <b>${kes(c.price)}</b><p class="mut" style="margin-top:4px">${esc(c.description||'')}</p></div>
  <h3 style="margin-bottom:10px">Topics <button class="ib" data-act="addTopic" data-id="${cid}" title="Add topic">${ic('plus')}</button></h3>
  ${topics.length?topics.map((t,i)=>`<div class="tr"><div><b>${i+1}. ${esc(t.name)}</b><br><span class="mut">${t.points} points</span></div><div style="display:flex;gap:2px"><button class="ib" title="Edit" data-act="editTopic" data-id="${t.id}">${ic('edit')}</button><button class="ib d" title="Delete" data-act="delTopic" data-id="${t.id}">${ic('trash')}</button></div></div>`).join(''):`<div class="mut">No topics yet. Add topics to track student progress.</div>`}`)
}

function topicFormModal(courseId,t) {
  const maxOrder = live(db.course_topics).filter(x=>x.course_id===courseId).length
  formModal(t?'Edit Topic':'Add Topic',`
  <div class="fld"><label>Topic name</label><input name="name" required value="${esc(t?.name||'')}"></div>
  <div class="two"><div class="fld"><label>Order</label><input name="sort_order" type="number" min="0" value="${t?.sort_order??maxOrder+1}"></div>
  <div class="fld"><label>Points</label><input name="points" type="number" min="1" value="${t?.points||10}"></div></div>
  `, t?'Save':'Add topic', d => {
    const id=t?.id||crypto.randomUUID()
    put('course_topics',{...(t||{id,course_id:courseId,created_at:iso(),deleted_at:null}),name:d.name.trim(),sort_order:Number(d.sort_order),points:Number(d.points)})
    toast(t?'Topic updated':'Topic added')
    close(); viewCourseModal(courseId)
  })
}

/* ── attendance ── */
function attendanceView() {
  const today=new Date().toISOString().slice(0,10)
  const sts=live(db.students)
  const todayAtt=live(db.attendance).filter(a=>a.date===today)
  return `<div class="grid4" style="grid-template-columns:repeat(3,1fr)">${stat('users','Total Students',sts.length)}${stat('check','Present Today',todayAtt.filter(a=>a.status==='present').length)}${stat('clock','Absent',sts.length-todayAtt.filter(a=>a.status==='present').length)}</div>
  <div class="card"><h3>Attendance — ${fmtDate(new Date())}</h3>
  ${sts.length?sts.map(s=>{
    const a=todayAtt.find(x=>x.student_id===s.id)
    return `<div class="tr"><div class="who"><div class="av">${esc(s.full_name[0])}</div><div><b>${esc(s.full_name)}</b><small>${esc(s.admission_number||'')}</small></div></div>
    <div style="display:flex;gap:6px;align-items:center">${a?`<span class="badge active">${a.status}${a.check_in?' · '+fmt(a.check_in):''}</span>`:`<button class="btn p" style="padding:6px 12px;font-size:12px" data-act="markPresent" data-id="${s.id}">Mark Present</button><button class="btn" style="padding:6px 12px;font-size:12px" data-act="markAbsent" data-id="${s.id}">Absent</button>`}</div></div>`
  }).join(''):`<div class="empty">${ic('users')}<br>No students.</div>`}</div>`
}

function markAttendance(sid, status) {
  const today=new Date().toISOString().slice(0,10)
  const existing=live(db.attendance).find(a=>a.student_id===sid&&a.date===today)
  if(existing) return toast('Already marked')
  put('attendance',{id:crypto.randomUUID(),student_id:sid,date:today,check_in:status==='present'?iso():null,check_out:null,status,signed_by:getSetting('served_by','admin'),created_at:iso(),deleted_at:null})
  toast(`Marked ${db.students.find(x=>x.id===sid)?.full_name||'student'} as ${status}`)
  render()
}

/* ── progress ── */
function progressView() {
  const sts=live(db.students)
  return `<div class="card">${sts.length?sts.map(s=>{
    const prog=live(db.progress).filter(p=>p.student_id===s.id)
    const total=prog.length,done=prog.filter(p=>p.completed).length
    const pct=total?Math.round(done/total*100):0
    return `<div class="row" style="grid-template-columns:2fr 1fr auto"><div class="who"><div class="av">${esc(s.full_name[0])}</div><div><b>${esc(s.full_name)}</b><small>${done}/${total} topics · ${pct}%</small></div></div>
    <div><div class="meter active" style="width:100%"><i style="--p:${pct}%"></i></div></div>
    <button class="ib" title="Manage progress" data-act="manageProgress" data-id="${s.id}">${ic('target')}</button></div>`
  }).join(''):`<div class="empty">${ic('target')}<br>No students yet.</div>`}</div>`
}

function manageProgressModal(sid) {
  const s=db.students.find(x=>x.id===sid);if(!s)return
  const enr=live(db.enrollments).filter(e=>e.student_id===sid)
  let html = head('Progress — '+esc(s.full_name))
  for(const e of enr) {
    const co=db.courses.find(c=>c.id===e.course_id);if(!co)continue
    const topics=live(db.course_topics).filter(t=>t.course_id===co.id).sort((a,b)=>a.sort_order-b.sort_order)
    html += `<h3 style="margin:12px 0 8px">${esc(co.name)}</h3>`
    for(const t of topics) {
      const p=live(db.progress).find(x=>x.student_id===sid&&x.topic_id===t.id)
      const done=p?.completed
      html += `<div class="tr"><div><b>${esc(t.name)}</b><br><span class="mut">${t.points} pts${done?' · Completed '+fmtDate(p.completed_at):''}</span></div>
      <button class="btn ${done?'':'p'}" style="padding:6px 12px;font-size:12px" data-act="toggleProgress" data-id="${t.id}" data-sid="${sid}">${done?ic('check')+' Done':ic('target')+' Mark complete'}</button></div>`
    }
  }
  if(!enr.length) html += '<div class="mut">Not enrolled in any course.</div>'
  modal(html)
}

function toggleProgress(topicId,sid) {
  let p=live(db.progress).find(x=>x.student_id===sid&&x.topic_id===topicId)
  if(!p) { p={id:crypto.randomUUID(),student_id:sid,topic_id:topicId,completed:false,completed_at:null,marked_by:'',created_at:iso(),deleted_at:null} }
  p.completed = !p.completed
  p.completed_at = p.completed ? iso() : null
  p.marked_by = getSetting('served_by','admin')
  put('progress',p)
  // Check if all topics in the course are completed
  const topic=db.course_topics.find(x=>x.id===topicId)
  if(topic && p.completed) {
    const allTopics=live(db.course_topics).filter(t=>t.course_id===topic.course_id)
    const allDone=allTopics.every(t=>live(db.progress).find(x=>x.student_id===sid&&x.topic_id===t.id)?.completed)
    if(allDone) {
      const s=db.students.find(x=>x.id===sid)
      const co=db.courses.find(x=>x.id===topic.course_id)
      notify(`🎉 ${s?.full_name||'Student'} has completed all topics in ${co?.name||'course'}!`)
      // Update enrollment status
      const enr=live(db.enrollments).find(e=>e.student_id===sid&&e.course_id===topic.course_id)
      if(enr) { enr.status='completed'; put('enrollments',enr) }
    }
  }
  toast(p.completed?'Marked as complete':'Unmarked')
  manageProgressModal(sid)
}

/* ── certificates ── */
function certificatesView() {
  const certs=live(db.certificates)
  return `<div class="tools"><button class="btn" data-act="genCertManual">${ic('plus')}Add Legacy Certificate</button></div>
  <div class="card">${certs.length?certs.map(c=>{
    const s=db.students.find(x=>x.id===c.student_id)
    const co=db.courses.find(x=>x.id===c.course_id)
    return `<div class="tr"><div class="who"><div class="av">${esc((s?.full_name||'?')[0])}</div><div><b>${esc(s?.full_name||'Unknown')}</b><small>${esc(co?.name||'—')} · <span style="font-family:monospace;color:var(--ac)">${esc(c.cert_code)}</span></small></div></div>
    <div style="display:flex;gap:6px;align-items:center">
      ${c.admin_approved?`<span class="badge active">Approved</span>`:`<button class="btn p" style="padding:6px 12px;font-size:12px" data-act="approveCert" data-id="${c.id}">Approve</button>`}
      <button class="ib" title="View" data-act="viewCert" data-id="${c.id}">${ic('award')}</button>
    </div></div>`
  }).join(''):`<div class="empty">${ic('award')}<br>No certificates yet. Complete a course and approve to generate one.</div>`}</div>`
}

async function generateCertificateForStudent(sid,cid) {
  const existing=live(db.certificates).find(c=>c.student_id===sid&&c.course_id===cid)
  if(existing) return toast('Certificate already exists for this course','warn')
  const code = await genCertCode(sid,cid)
  put('certificates',{id:crypto.randomUUID(),student_id:sid,course_id:cid,cert_code:code,issued_at:iso(),is_eligible:true,admin_approved:false,fees_cleared:false,created_at:iso(),deleted_at:null})
  toast('Certificate generated: '+code)
  render()
}

function manualCertModal() {
  const sts=live(db.students),cs=live(db.courses)
  formModal('Add Legacy Certificate',`
  <div class="fld"><label>Student</label><select name="student_id" required>${sts.map(s=>`<option value="${s.id}">${esc(s.full_name)}</option>`).join('')}</select></div>
  <div class="fld"><label>Course</label><select name="course_id" required>${cs.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></div>
  <div class="fld"><label>Certificate code (leave blank for auto)</label><input name="cert_code" placeholder="CERT-XXXXXXXX"></div>
  `,'Add Certificate', async d => {
    const code = d.cert_code.trim() || await genCertCode(d.student_id,d.course_id)
    put('certificates',{id:crypto.randomUUID(),student_id:d.student_id,course_id:d.course_id,cert_code:code.toUpperCase(),issued_at:iso(),is_eligible:true,admin_approved:true,fees_cleared:true,created_at:iso(),deleted_at:null})
    toast('Legacy certificate added: '+code)
    render()
  })
}

function viewCertificate(certId) {
  const c=db.certificates.find(x=>x.id===certId);if(!c)return
  const s=db.students.find(x=>x.id===c.student_id)
  const co=db.courses.find(x=>x.id===c.course_id)
  const w=window.open('','_blank')
  w.document.write(`<!DOCTYPE html><html><head><title>Certificate — ${esc(s?.full_name||'')}</title><style>*{margin:0;box-sizing:border-box}body{display:flex;justify-content:center;padding:40px;background:#f6f8fa;font-family:'Segoe UI',system-ui,sans-serif}.cert{width:800px;background:#fff;border:4px double #0f766e;border-radius:16px;padding:60px;text-align:center;position:relative}.cert::before{content:'';position:absolute;inset:12px;border:1px solid #e6f4f2;border-radius:12px}h1{font-size:36px;color:#0f766e;margin-bottom:8px}h2{font-size:14px;color:#64748b;text-transform:uppercase;letter-spacing:.15em;margin-bottom:40px}.name{font-size:32px;font-weight:800;color:#0b1b2b;border-bottom:2px solid #0f766e;display:inline-block;padding:8px 40px;margin-bottom:16px}.course{font-size:20px;color:#0b1b2b;margin:16px 0}.date{color:#64748b;font-size:14px;margin-top:30px}.code{font-family:monospace;font-size:14px;color:#0f766e;margin-top:20px;padding:10px;background:#e6f4f2;border-radius:8px;display:inline-block}@media print{body{background:#fff;padding:0}button{display:none}}.pb{position:fixed;top:20px;right:20px;background:#0f766e;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-weight:700;cursor:pointer}</style></head><body>
  <button class="pb" onclick="print()">🖨 Print</button>
  <div class="cert"><h1>🛡 ${esc(BIZ.name)}</h1><h2>Certificate of Completion</h2>
  <p style="font-size:16px;color:#64748b;margin-bottom:16px">This is to certify that</p>
  <div class="name">${esc(s?.full_name||'Unknown')}</div>
  <div class="course">has successfully completed the course<br><b style="font-size:24px;color:#0f766e">${esc(co?.name||'—')}</b></div>
  <div class="date">Date: ${fmtDate(c.issued_at||new Date())}</div>
  <div style="display:flex;justify-content:space-around;margin-top:40px;padding-top:20px;border-top:1px solid #e5e9ef"><div><div style="width:200px;border-top:1px solid #0b1b2b;padding-top:8px;font-size:12px;color:#64748b">Administrator</div></div><div><div style="width:200px;border-top:1px solid #0b1b2b;padding-top:8px;font-size:12px;color:#64748b">Director</div></div></div>
  <div class="code">Certificate Code: ${esc(c.cert_code)} · Admission: ${esc(s?.admission_number||'—')}</div>
  </div></body></html>`)
  w.document.close()
}

/* ── notes ── */
function notesView() {
  const ns=live(db.notes)
  const courses=live(db.courses)
  return `<div class="grid4" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px">${courses.map(c=>{
    const cn=ns.filter(n=>n.course_id===c.id)
    return `<div class="card"><h3>${esc(c.name)}</h3>${cn.length?cn.map(n=>`<div class="tr"><div><b>${esc(n.title)}</b><br><small class="mut">${fmt(n.uploaded_at||n.created_at)}</small></div><div style="display:flex;gap:2px">${n.file_url?`<a href="${esc(n.file_url)}" target="_blank" class="ib" title="Download">${ic('down')}</a>`:''}  <button class="ib d" title="Delete" data-act="delNote" data-id="${n.id}">${ic('trash')}</button></div></div>`).join(''):'<div class="mut" style="font-size:12px;padding:8px 0">No notes uploaded yet.</div>'}</div>`
  }).join('')}${!courses.length?`<div class="empty">${ic('book')}<br>Add courses first.</div>`:''}</div>`
}

function addNoteModal() {
  const courses=live(db.courses)
  formModal('Upload Note',`
  <div class="fld"><label>Course</label><select name="course_id" required>${courses.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}</select></div>
  <div class="fld"><label>Title</label><input name="title" required placeholder="e.g. Excel Basics"></div>
  <div class="fld"><label>PDF link (URL or Supabase Storage link)</label><input name="file_url" required placeholder="https://..."></div>
  `,'Upload', d => {
    put('notes',{id:crypto.randomUUID(),course_id:d.course_id,topic_id:null,title:d.title.trim(),file_url:d.file_url.trim(),uploaded_at:iso(),created_at:iso(),deleted_at:null})
    toast('Note added'); render()
  })
}

/* ── student invoice ── */
function studentInvoice(sid) {
  const s=db.students.find(x=>x.id===sid);if(!s)return
  const enr=live(db.enrollments).filter(e=>e.student_id===sid)
  const invNo='SINV-'+Date.now().toString(36).toUpperCase()
  const total=enr.reduce((t,e)=>t+Number(e.fees_total||0),0)
  const paid=enr.reduce((t,e)=>t+Number(e.fees_paid||0),0)
  const w=window.open('','_blank')
  w.document.write(`<!DOCTYPE html><html><head><title>${invNo}</title><style>*{margin:0;box-sizing:border-box}body{font-family:'Segoe UI',system-ui,sans-serif;padding:40px;max-width:800px;margin:0 auto}.h{display:flex;justify-content:space-between;margin-bottom:40px;padding-bottom:20px;border-bottom:3px solid #0f766e}.l{font-size:28px;font-weight:800;color:#0f766e}.l small{display:block;font-size:12px;font-weight:400;color:#64748b}table{width:100%;border-collapse:collapse}th{background:#f6f8fa;text-align:left;padding:10px 12px;font-size:12px;text-transform:uppercase;color:#64748b;border-bottom:2px solid #e5e9ef}td{padding:12px;border-bottom:1px solid #e5e9ef}.t td{border-top:2px solid #0f766e;font-weight:700;background:#e6f4f2}@media print{button{display:none}}.pb{position:fixed;top:20px;right:20px;background:#0f766e;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-weight:700;cursor:pointer}</style></head><body>
  <button class="pb" onclick="print()">🖨 Print</button>
  <div class="h"><div class="l">🛡 ${esc(BIZ.name)}<small>Student Invoice</small></div><div style="text-align:right;color:#64748b"><b style="display:block;font-size:22px;color:#0b1b2b">${invNo}</b>${fmtDate(new Date())}</div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:30px"><div><h4 style="font-size:11px;text-transform:uppercase;color:#64748b;margin-bottom:8px">Student</h4><p><b>${esc(s.full_name)}</b><br>${esc(s.phone||'')}<br>Admission: ${esc(s.admission_number||'—')}</p></div><div><h4 style="font-size:11px;text-transform:uppercase;color:#64748b;margin-bottom:8px">From</h4><p><b>${esc(BIZ.name)}</b></p></div></div>
  <table><tr><th>Course</th><th>Fees Total</th><th>Fees Paid</th><th>Balance</th><th>Due Date</th></tr>
  ${enr.map(e=>{const co=db.courses.find(c=>c.id===e.course_id);return`<tr><td>${esc(co?.name||'—')}</td><td>${kes(e.fees_total)}</td><td>${kes(e.fees_paid)}</td><td><b>${kes(e.fees_total-e.fees_paid)}</b></td><td>${e.fees_due_date?fmtDate(e.fees_due_date):'—'}</td></tr>`}).join('')}
  <tr class="t"><td>TOTAL</td><td>${kes(total)}</td><td>${kes(paid)}</td><td>${kes(total-paid)}</td><td></td></tr></table></body></html>`)
  w.document.close()
}

/* ── settings modal ── */
function settingsModal() {
  formModal('Settings',`
  <div class="fld"><label>Your name (Served by)</label><input name="served_by" value="${esc(getSetting('served_by',''))}" required></div>
  <div class="fld"><label>WhatsApp number (international, e.g. 2547XXXXXXXX)</label><input name="wa_phone" value="${esc(getSetting('wa_phone',''))}" placeholder="2547XXXXXXXX"></div>
  <div class="fld"><label>CallMeBot API key</label><input name="wa_key" value="${esc(getSetting('wa_key',''))}" placeholder="Your API key"></div>
  <div class="fld"><label>Business name</label><input name="biz_name" value="${esc(getSetting('biz_name','Sentinel WiFi'))}"></div>
  <div class="fld"><label>Tagline</label><input name="biz_tagline" value="${esc(getSetting('biz_tagline','Fast · Reliable · Always On'))}"></div>
  <div class="fld"><label>Business phone</label><input name="biz_phone" value="${esc(getSetting('biz_phone',''))}"></div>
  `,'Save Settings', d => {
    for(const[k,v]of Object.entries(d)) setSetting(k,v)
    toast('Settings saved'); render()
  })
}

/* ── enroll modal ── */
function enrollModal(sid) {
  const courses=live(db.courses)
  formModal('Enroll Student',`
  <div class="fld"><label>Course</label><select name="course_id" required>${courses.map(c=>`<option value="${c.id}">${esc(c.name)} — ${kes(c.price)}</option>`).join('')}</select></div>
  <div class="two"><div class="fld"><label>Fees paid (KSH)</label><input name="fees_paid" type="number" min="0" value="0"></div><div class="fld"><label>Due date</label><input name="fees_due_date" type="date"></div></div>
  `,'Enroll', d => {
    const course=db.courses.find(c=>c.id===d.course_id)
    put('enrollments',{id:crypto.randomUUID(),student_id:sid,course_id:d.course_id,enrolled_at:iso(),status:'active',fees_total:Number(course?.price||0),fees_paid:Number(d.fees_paid||0),fees_due_date:d.fees_due_date?new Date(d.fees_due_date).toISOString():null,created_at:iso(),deleted_at:null})
    for(const t of live(db.course_topics).filter(t=>t.course_id===d.course_id)) {
      if(!live(db.progress).find(p=>p.student_id===sid&&p.topic_id===t.id))
        put('progress',{id:crypto.randomUUID(),student_id:sid,topic_id:t.id,completed:false,completed_at:null,marked_by:'',created_at:iso(),deleted_at:null})
    }
    toast('Student enrolled'); close(); render()
  })
}

function exportStudentsExcel() {
  const sts=live(db.students)
  let h=`<html><head><meta charset="utf-8"></head><body><table><tr>${['Admission #','Name','Phone','Email','Parent','Parent Phone','Full-time','Availability'].map(x=>`<th style="background:#0f766e;color:#fff;font-weight:bold;padding:8px">${x}</th>`).join('')}</tr>`
  for(const s of sts) h+=`<tr><td>${esc(s.admission_number||'')}</td><td>${esc(s.full_name)}</td><td>${esc(s.phone||'')}</td><td>${esc(s.email||'')}</td><td>${esc(s.parent_name||'')}</td><td>${esc(s.parent_phone||'')}</td><td>${s.is_fulltime?'Yes':'No'}</td><td>${esc(s.availability_days||'')} ${s.availability_start||''}-${s.availability_end||''}</td></tr>`
  h+=`</table></body></html>`
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([h],{type:'application/vnd.ms-excel'}));a.download=`sentinel-students-${new Date().toISOString().slice(0,10)}.xls`;a.click();toast('Students exported')
}

/* ══════════════════════════════════════════
   RENDER ROUTER
   ══════════════════════════════════════════ */
function render() {
  if(currentModule==='landing') renderLanding()
  else if(currentModule==='network') renderNetwork()
  else if(currentModule==='classes') renderClasses()
  else if(currentModule==='sales') { view='rep'; currentModule='network'; renderNetwork() }
  document.querySelectorAll('[data-count]').forEach(el=>countUp(el))
}

/* ══════════════════════════════════════════
   GLOBAL EVENT DELEGATION
   ══════════════════════════════════════════ */
document.addEventListener('click', e => {
  const b=e.target.closest('[data-act]'); if(!b){document.querySelector('.sug')?.setAttribute('hidden','');return}
  const id=b.dataset.id, sid=b.dataset.sid
  const c=db.clients.find(x=>x.id===id)
  const acts = {
    // Navigation
    openmod: () => { currentModule=id; localStorage.setItem('stl_module',id); view='dash'; classTab='students'; render() },
    backlanding: () => { currentModule='landing'; localStorage.setItem('stl_module','landing'); render() },
    nav: () => { view=id; render() },
    classTab: () => { classTab=id; render() },
    // Network
    addClient: () => clientForm(),
    editClient: () => clientForm(c),
    delClient: () => { put('clients',{...c,deleted_at:iso()}); toast(c.name+' deleted'); render() },
    restore: () => { put('clients',{...c,deleted_at:null}); render() },
    paym: () => formModal('Record payment — '+esc(c.name),payFields(),'Record payment',d=>addPayment(id,d)),
    hist: () => { const cl=db.clients.find(x=>x.id===id); modal(`${head(esc(cl?.name||''))}${live(db.payments).filter(p=>p.client_id===id).sort((a,b)=>ts(b.paid_at)-ts(a.paid_at)).map(p=>`<div class="tr"><div><b>${kes(p.amount)}</b><br><small class="mut">${PLANS[p.plan]?.label||p.plan} · ${p.days?p.days+'d':(p.start_time+'-'+p.end_time)} · ${fmt(p.paid_at)} · <span style="font-family:monospace;color:var(--ac)">${p.receipt_code||''}</span></small></div><div style="display:flex;gap:2px"><button class="ib" title="Receipt" data-act="viewreceipt" data-id="${p.id}">${ic('receipt')}</button><button class="ib d" data-act="delpay" data-id="${p.id}">${ic('trash')}</button></div></div>`).join('')||'<div class="empty">No payments.</div>'}
    <div style="margin-top:14px"><button class="btn p" style="width:100%;justify-content:center" data-act="geninv" data-id="${id}">${ic('invoice')}Invoice</button></div>`) },
    delpay: () => { const p=db.payments.find(x=>x.id===id); put('payments',{...p,deleted_at:iso()}); close(); render() },
    filter: () => { filter=id; render() },
    trash: () => { showDeleted=!showDeleted; render() },
    range: () => { range=+id; render() },
    pick: () => { q=id; render() },
    // Export/Import
    csv: () => { const r=[['Receipt','Date','Client','Plan','Amount','Served By']].concat(live(db.payments).map(p=>[p.receipt_code||'',p.paid_at,cname(p.client_id),p.plan,p.amount,p.served_by||''])); const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([r.map(x=>x.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')],{type:'text/csv'}));a.download='sentinel.csv';a.click() },
    exportxl: () => exportExcel(),
    importdata: () => importData(),
    exportjson: () => { const d={...Object.fromEntries(Object.keys(EMPTY).map(k=>[k,live(db[k])])),exported_at:iso()};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d,null,2)],{type:'application/json'}));a.download='sentinel-backup.json';a.click();toast('Backup exported') },
    print: () => window.print(),
    // Receipts & Invoices
    viewreceipt: () => viewReceipt(id),
    geninv: () => generateInvoice(id),
    verify: () => openVerifier(),
    verifygo: () => runVerify(),
    // Router
    routercheck: () => fetchRouter(),
    // Settings
    goSettings: () => settingsModal(),
    close,
    // Students
    addStudent: () => studentFormModal(),
    editStudent: () => studentFormModal(db.students.find(x=>x.id===id)),
    delStudent: () => { const s=db.students.find(x=>x.id===id); put('students',{...s,deleted_at:iso()}); toast(s.full_name+' deleted'); render() },
    viewStudent: () => viewStudentModal(id),
    enrollStudent: () => { close(); enrollModal(id) },
    studentInvoice: () => { close(); studentInvoice(id) },
    exportStudents: () => exportStudentsExcel(),
    // Courses
    addCourse: () => courseFormModal(),
    editCourse: () => courseFormModal(db.courses.find(x=>x.id===id)),
    delCourse: () => { const co=db.courses.find(x=>x.id===id); put('courses',{...co,deleted_at:iso()}); toast(co.name+' deleted'); render() },
    viewCourse: () => viewCourseModal(id),
    addTopic: () => topicFormModal(id),
    editTopic: () => { const t=db.course_topics.find(x=>x.id===id); topicFormModal(t.course_id,t) },
    delTopic: () => { const t=db.course_topics.find(x=>x.id===id); put('course_topics',{...t,deleted_at:iso()}); toast('Topic deleted'); close() },
    // Attendance
    markPresent: () => markAttendance(id,'present'),
    markAbsent: () => markAttendance(id,'absent'),
    // Progress
    manageProgress: () => manageProgressModal(id),
    toggleProgress: () => toggleProgress(id,b.dataset.sid),
    // Certificates
    approveCert: () => { const ct=db.certificates.find(x=>x.id===id); ct.admin_approved=true; put('certificates',ct); toast('Certificate approved'); render() },
    viewCert: () => viewCertificate(id),
    genCertManual: () => manualCertModal(),
    // Notes
    addNote: () => addNoteModal(),
    delNote: () => { const n=db.notes.find(x=>x.id===id); put('notes',{...n,deleted_at:iso()}); toast('Note deleted'); render() },
  }
  acts[b.dataset.act]?.()
})

document.addEventListener('input', e => {
  if(e.target.id==='q'){q=e.target.value;if(view==='clients')netList()}
  if(e.target.id==='sq'){studQ=e.target.value;const el=$('#slist');if(el)el.innerHTML=studentsList(live(db.students))}
  if(e.target.id==='cq'){courseQ=e.target.value;render()}
})
document.addEventListener('keydown', e => {
  if(e.key==='Escape') close()
  if(e.key==='Enter'&&e.target.id==='verify-input') runVerify()
})
addEventListener('online', sync)

/* ── init ── */
render(); sync(); checkExpiry()
setInterval(checkExpiry,30000); setInterval(sync,60000)
