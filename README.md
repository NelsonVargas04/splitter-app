# SplitApp

SplitApp — a simple app to register people and expenses, and calculate how to split them.

Structure:
- server/: API Node + Express
- client/: Client React + Vite

Requirements:
- Node.js 16+ and npm

How to run (in PowerShell):

1) Backend
```powershell
cd 'C:\Proyectos\gastos-app\server'
npm install
npm start
```

2) Frontend
```powershell
cd 'C:\Proyectos\gastos-app\client'
npm install
npm run dev
```

Open the browser at `http://localhost:5173` (frontend) and the API at `http://localhost:3000`.

Notes:
- Run backend and frontend in separate terminals.
- If you want them to start with a single simultaneous command, a root script with `concurrently` can be added.
