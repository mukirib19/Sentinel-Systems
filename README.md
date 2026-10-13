# 🛡 Sentinel Systems

A multi-module business management platform for network administration, student/class management, and sales tracking.

## Modules

### 📡 Network Management
- WiFi client management with daily/hourly/custom plans
- Real-time payment tracking with receipts
- Professional invoices per client (data-isolated)
- Tenda router monitoring (192.168.0.1)
- Export to Excel, CSV, JSON

### 🎓 Classes & Students
- Student enrollment with full onboarding
- Course management with topics and pricing
- Attendance tracking (admin + self-service)
- Progress tracking with points system
- Certificate generation and verification
- Fee management with balance tracking
- PDF notes per course

### 🔐 Student Portal
- Supabase Auth (signup, login, forgot/reset password)
- Isolated student data (Row Level Security)
- Self-service attendance, progress view, fee status
- Certificate viewing and download

### 💰 Sales & Reports
- Revenue dashboards with 14-day charts
- Plan mix analysis
- Export to Excel/CSV
- Print-ready reports

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npx vite

# Build for production
npx vite build
```

- **Admin App**: http://localhost:5173
- **Student Portal**: http://localhost:5173/portal.html

### Router Proxy (optional)
```bash
node proxy-server.js
# Runs at http://localhost:3377
```

## Setup

1. Copy `.env.example` to `.env` and fill in your Supabase credentials
2. Run `schema.sql` in Supabase SQL Editor
3. Create Supabase Storage buckets: `student-ids`, `notes`, `logos`

## Tech Stack

- **Frontend**: Vanilla JS + Vite
- **Backend**: Supabase (Postgres + Auth + Storage)
- **Notifications**: CallMeBot WhatsApp API
- **Styling**: Custom CSS, Plus Jakarta Sans font

## License

MIT
