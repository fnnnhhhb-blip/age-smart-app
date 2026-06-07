# AgeSmart - Age Verification & Subscription Platform

A desktop application (Windows .exe) for age verification and subscription management with built-in proxy browser support.

## Apps

### User App (`user-app/`)
- **Sign up / Login** — User authentication
- **Age Verification** — Date of birth + ID document upload
- **Subscription Plans** — Free / Premium / Enterprise tiers
- **Proxy Browser** — Built-in link browser with HTTP/SOCKS5 proxy support
- **Settings** — Profile, notifications, security

### Admin App (`admin-app/`)
- **Dashboard Overview** — User stats, verification queue, platform health
- **User Management** — View, search, approve/reject, ban, delete users
- **Verification Management** — Review and manage age verification requests
- **Subscription Control** — Monitor plans, revenue, change user plans
- **Proxy Configuration** — Add/remove/toggle proxy servers
- **App Settings** — Configure all user app options (pricing, limits, toggles)

## Development

```bash
# User App (port 5173)
cd user-app
npm install
npm run dev

# Admin App (port 5174)
cd admin-app
npm install
npm run dev
```

## Build Windows .exe

```bash
# User App
cd user-app
npm run build:win

# Admin App
cd admin-app
npm run build:win
```

The `.exe` installers will be in `user-app/dist-build/` and `admin-app/dist-build/`.

## Tech Stack

- **Electron** — Native desktop app framework
- **React 18** — UI library
- **TypeScript** — Type safety
- **Vite** — Build tool
- **Lucide React** — Icons
- **electron-builder** — Windows/Mac/Linux packaging

## Default Credentials

- **Admin Panel**: password `admin123`
