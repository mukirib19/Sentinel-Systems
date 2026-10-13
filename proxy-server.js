/**
 * Sentinel — Tenda Router Proxy Server
 * 
 * Bridges the browser to your Tenda router at 192.168.0.1
 * Bypasses CORS so Sentinel can read active connected devices.
 * 
 * Usage:
 *   node proxy-server.js
 * 
 * Then Sentinel fetches from http://localhost:3377/api/router/clients
 * instead of hitting the router directly.
 */

import http from 'node:http'

const ROUTER = 'http://192.168.0.1'
const PORT = 3377

const server = http.createServer(async (req, res) => {
  // CORS headers — allow the Vite dev server (and any origin) to call us
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end() }

  if (req.url === '/api/router/clients') {
    try {
      // Tenda common endpoints for online device list
      const endpoints = [
        '/goform/getOnlineList',           // Tenda AC5/AC6/AC8/AC10/AC11/AC15/AC18/AC1200
        '/goform/GetClientList',           // Tenda F9/FH1206
        '/goform/GetIPTV?ESSION=1',        // Older Tenda models
        '/cgi-bin/luci/admin/network/dhcp_leases', // OpenWrt-based
      ]

      for (const ep of endpoints) {
        try {
          const data = await fetchJSON(ROUTER + ep)
          // Tenda AC series returns { onlineList: [...] }
          if (data.onlineList) {
            const users = data.onlineList.map(d => ({
              name: d.hostName || d.hostname || 'Unknown',
              ip: d.ip || d.IP,
              mac: d.mac || d.MAC,
              speed: d.speed || d.uploadSpeed || '0',
              connected: true
            }))
            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ ok: true, count: users.length, users, source: ep }))
          }
          // Some models return { clientList: [...] }
          if (data.clientList) {
            const users = data.clientList.map(d => ({
              name: d.deviceName || d.hostName || 'Unknown',
              ip: d.ip || d.IP,
              mac: d.mac || d.MAC,
              connected: true
            }))
            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ ok: true, count: users.length, users, source: ep }))
          }
          // Try to parse any array response
          if (Array.isArray(data)) {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ ok: true, count: data.length, users: data, source: ep }))
          }
        } catch { continue }
      }

      // Fallback: try to at least confirm the router is reachable
      try {
        await fetchRaw(ROUTER)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ ok: true, count: -1, users: [], note: 'Router reachable but could not parse client list. Open admin panel manually.', reachable: true }))
      } catch {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        return res.end(JSON.stringify({ ok: false, count: 0, users: [], note: 'Router unreachable at ' + ROUTER }))
      }
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ ok: false, error: e.message }))
    }
  }

  if (req.url === '/api/router/ping') {
    try {
      await fetchRaw(ROUTER)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, reachable: true, router: ROUTER }))
    } catch {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, reachable: false, router: ROUTER }))
    }
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found', endpoints: ['/api/router/clients', '/api/router/ping'] }))
})

function fetchRaw(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { timeout: 5000 }, r => {
      let body = ''
      r.on('data', c => (body += c))
      r.on('end', () => resolve(body))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

function fetchJSON(url) {
  return fetchRaw(url).then(body => JSON.parse(body))
}

server.listen(PORT, () => {
  console.log(`\n  🛡  Sentinel Router Proxy`)
  console.log(`  ────────────────────────`)
  console.log(`  Router:  ${ROUTER}`)
  console.log(`  Proxy:   http://localhost:${PORT}`)
  console.log(`  ────────────────────────`)
  console.log(`  Endpoints:`)
  console.log(`    GET /api/router/clients  → Connected devices`)
  console.log(`    GET /api/router/ping     → Router reachability`)
  console.log(`\n  Press Ctrl+C to stop.\n`)
})
