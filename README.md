<p align="center">
  <img src="https://img.shields.io/badge/SplitApp-Expense%20Splitter-7c4dff?style=for-the-badge&logo=cashapp&logoColor=white" alt="SplitApp" />
</p>

<h1 align="center">💸 SplitApp</h1>

<p align="center">
  <strong>Split expenses effortlessly with friends, groups & QR codes.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/MUI-7.3-007FFF?style=flat-square&logo=mui&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-5.0-443E38?style=flat-square&logo=npm&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## ✨ Features

### 📊 Dashboard
- Personalized greeting with notification center
- Real-time **balance overview** — see what you're owed and what you owe at a glance
- Monthly spending summary with pending events counter
- Quick stats: events, friends & groups count
- Recent events feed with category icons, participant count & payment status

### 👥 Groups & Friends
- Create groups with **12 custom icons** (sports, work, food, travel, parties, etc.) and **16 color themes**
- Add friends via **10-digit friend codes**
- Search & filter groups and friends instantly
- Member avatars with initials and send friend requests

### 📷 QR Scanner
- **Dual-mode scanning**: Split a bill or Add a friend
- Live camera with animated scan line & glowing corners
- Flash/torch toggle for low-light scanning
- Auto-detect bills → shows total → split with your group in one tap
- Scan friend QR codes or deep links (`splitapp://friend/<code>`)

### 📋 Event Detail
- Visual progress bar for payment collection
- Summary: paid / pending / remaining amounts
- Full participant list with payment status, method & timestamp
- **Remind pending** button to nudge unpaid members

### 👤 Profile
- Avatar upload & editable personal info
- **Payment accounts**: Mercado Pago, CBU, Bank Alias, or QR-scanned accounts
- Notification preferences (push, email, SMS, auto-reminders)
- Privacy & security settings
- 🌗 **Dark / Light mode** toggle

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 · TypeScript · Vite · MUI 7 |
| **State** | Zustand |
| **Routing** | React Router v6 |
| **QR** | html5-qrcode · qrcode.react |
| **Backend** | Node.js · Express · TypeScript |
| **Styling** | Emotion (CSS-in-JS) · MUI Theme |

---

## 📁 Project Structure

```
splitapp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddFriend/       # Friend code & QR sharing
│   │   │   ├── BottomNavBar/    # Navigation (Dashboard · Groups · QR · Profile)
│   │   │   ├── CreateGroup/     # Group creation with icons & colors
│   │   │   └── Page/
│   │   │       ├── PageDashboard/    # Main dashboard
│   │   │       ├── PageEventDetail/  # Event payment tracking
│   │   │       ├── PageGroups/       # Groups & friends management
│   │   │       ├── PageLogin/        # Authentication
│   │   │       ├── PageProfile/      # User settings & accounts
│   │   │       ├── PageQR/           # QR scanner (bills & friends)
│   │   │       ├── PageRegister/     # Sign up
│   │   │       └── PageVerify/       # Email verification
│   │   ├── models/          # TypeScript interfaces & types
│   │   ├── services/        # API service layer
│   │   ├── stores/          # Zustand state management
│   │   └── utils/           # Animations & helpers
│   └── vite.config.ts
│
└── server/                  # Express API
    ├── index.ts             # TypeScript entry
    └── index.js             # JavaScript entry
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ and **npm**

### Installation

```bash
# Clone the repository
git clone https://github.com/NelsonVargas04/splitter-app.git
cd splitter-app
```

### Run the Backend

```bash
cd server
npm install
npm start
```

> API runs on **http://localhost:3000**

### Run the Frontend

```bash
cd client
npm install
npm run dev
```

> App runs on **http://localhost:5173**

> 💡 **Tip:** Run backend and frontend in separate terminals.

---

## 🛣️ Roadmap

- [ ] Real-time notifications with WebSockets
- [ ] Push notifications (PWA)
- [ ] Payment integrations (Mercado Pago, Stripe)
- [ ] Expense categories & analytics charts
- [ ] Multi-language support (i18n)
- [ ] Export reports to PDF/CSV

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with 💜 by <a href="https://github.com/NelsonVargas04">Nelson Vargas</a>
</p>
