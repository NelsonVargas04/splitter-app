# app-dividir-gastos

Proyecto "app-dividir-gastos" — una app sencilla para registrar personas y gastos, y calcular cómo dividirlos.

Estructura:
- server/: API Node + Express
- client/: Cliente React + Vite

Requisitos:
- Node.js 16+ y npm

Cómo ejecutar (en PowerShell):

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

Abrir el navegador en `http://localhost:5173` (frontend) y la API en `http://localhost:3000`.

Notas:
- Ejecuta backend y frontend en terminales separadas.
- Si quieres que arranquen con un comando simultáneo, puedo añadir un script raíz con `concurrently`.
