# MERN Boilerplate Generator

> [Bahasa Indonesia](README.md) | [English](README_EN.md)

> Generate a full-stack MERN project in seconds.  
> **Express MVC** (Backend) + **React Atomic Design** (Frontend) + **NGINX** (Reverse Proxy)

---

## 🚀 Quick Start

```bash
git clone <repo-url>
cd BOILERPLATE-MERN
chmod +x start.sh
./start.sh
```

Follow the interactive prompts:
1. **Project name** — name of the project folder to be created (no spaces)
2. **Database name** — MongoDB database name
3. **GitHub Username** — your GitHub username for SSH push automation
4. **Backend port** — default `5000`
5. **Frontend port** — default `5173`
6. **NGINX port** — default `80`

After generation is complete, enter the project folder and run:

```bash
cd <project-name>
./run.sh
```

---

## 🛠️ GitHub Automation (SSH & GH CLI)

This boilerplate supports automated pushing to GitHub using the **SSH** protocol.

**Recommendations:**
- Install [GitHub CLI (gh)](https://cli.github.com/) to allow the script to **automatically create the repository** in your GitHub account without opening a browser.
- Use an SSH Key for security and convenience (avoiding password/token prompts for every push).

---

## 📁 Generated Structure

```
<project-name>/
│
├── backend/                    ← Express MVC REST API
│   ├── src/
│   │   ├── config/db.js        ← MongoDB Connection
│   │   ├── controllers/        ← CRUD Logic
│   │   ├── models/             ← Mongoose Schema
│   │   ├── routes/             ← Express Router
│   │   └── middlewares/        ← Error Handler, Not Found, Security
│   ├── app.js                  ← Express Setup (Helmet, Rate-limit)
│   ├── server.js               ← Entry Point
│   └── .env                    ← Auto-generated Config
│
├── frontend/                   ← React + Vite (Atomic Design)
│   └── src/
│       ├── components/
│       │   ├── atoms/          ← Button, Input, Badge, Spinner
│       │   ├── molecules/      ← FormField, SearchBar, ItemCard
│       │   ├── organisms/      ← Navbar, ItemForm, ItemList
│       │   ├── templates/      ← MainLayout
│       │   └── pages/          ← HomePage, ItemsPage
│       ├── hooks/              ← useItems (Custom CRUD Hook)
│       ├── services/           ← Axios API Service
│       ├── App.jsx
│       └── index.css           ← Premium Dark Theme
│
├── nginx/
│   └── nginx.conf              ← Reverse Proxy Config
│
└── run.sh                      ← Runs Backend + Frontend simultaneously
```

---

## 🌐 API Endpoints

| Method | Endpoint       | Description        |
|--------|----------------|--------------------|
| GET    | /api/items     | Get all items      |
| GET    | /api/items/:id | Get item by ID     |
| POST   | /api/items     | Create new item    |
| PUT    | /api/items/:id | Update item        |
| DELETE | /api/items/:id | Delete item        |

---

## 🛡️ Security Features (Built-in)

The generated backend comes pre-hardened with:
- **Helmet**: Secure HTTP headers.
- **Rate Limiting**: Protection against Brute Force/DoS.
- **NoSQL Injection**: Input sanitization for MongoDB.
- **HPP**: Protection against HTTP Parameter Pollution.
- **Size Limiting**: JSON body size limits.

---

## ⚙️ Manual NGINX Setup

If NGINX setup failed during generation, copy it manually:

```bash
sudo cp <project>/nginx/nginx.conf /etc/nginx/sites-available/<project>
sudo ln -s /etc/nginx/sites-available/<project> /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload
```

---

## 💻 WSL & Linux Compatibility

This boilerplate is fully compatible with **Ubuntu/Debian** and **WSL (Windows Subsystem for Linux)**.

**WSL Tips:**
- Ensure MongoDB is running either on Windows or inside your WSL distro (`sudo service mongodb start`).
- If using NGINX in WSL, ensure ports don't conflict with Windows services.

---

## 💡 Troubleshooting MongoDB

If the backend cannot connect to MongoDB:

1. **Check Status**: Run `mongosh` or `mongo`. If you see a connection error, the database is not running.
2. **Start MongoDB**:
   - **Linux Native**: `sudo systemctl start mongod`
   - **WSL**: `sudo service mongodb start`
3. **Check Port**: Default port is `27017`.
4. **WSL2 (Database on Windows)**: If MongoDB is installed on Windows (not in WSL), change `127.0.0.1` in the backend `.env` to your Windows IP address (check via `ipconfig` in CMD).

**Script Execution Tip:**
In Linux/WSL, you **must** use `./` before the script name to execute it from the current directory. Example: `./run.sh`.
