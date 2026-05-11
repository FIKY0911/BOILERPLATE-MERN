# MERN Boilerplate Generator

> Generate full-stack MERN project dalam hitungan detik.  
> **Express MVC** (Backend) + **React Atomic Design** (Frontend) + **NGINX** (Reverse Proxy)

---

## 🚀 Quick Start

```bash
git clone <repo-url>
cd BOILERPLATE-MERN
chmod +x start.sh
./start.sh
```

Ikuti prompt interaktif:
1. **Nama project** — nama folder project yang akan dibuat (tanpa spasi)
2. **Nama database** — nama MongoDB database
3. **Port backend** — default `5000`
4. **Port frontend** — default `5173`
5. **Port NGINX** — default `80`
6. **Git/GitHub** — otomatis inisialisasi repo dan push ke GitHub via **SSH** (mendukung `gh` CLI)

Setelah selesai, masuk ke folder project dan jalankan:

```bash
cd <nama-project>
./run.sh
```

---

## 🛠️ GitHub Automation (SSH & GH CLI)

Boilerplate ini mendukung push otomatis ke GitHub menggunakan protokol **SSH**.

**Rekomendasi:**
- Install [GitHub CLI (gh)](https://cli.github.com/) agar script bisa **membuat repository otomatis** di akun GitHub Anda tanpa buka browser.
- Gunakan SSH Key untuk keamanan dan kenyamanan (bebas dari input password/token setiap push).

---

## 📁 Struktur yang Dihasilkan

```
<project-name>/
│
├── backend/                    ← Express MVC REST API
│   ├── src/
│   │   ├── config/db.js        ← Koneksi MongoDB
│   │   ├── controllers/        ← Logic CRUD
│   │   ├── models/             ← Mongoose Schema
│   │   ├── routes/             ← Express Router
│   │   └── middlewares/        ← Error Handler, Not Found
│   ├── app.js                  ← Express setup
│   ├── server.js               ← Entry point
│   └── .env                    ← Konfigurasi otomatis
│
├── frontend/                   ← React + Vite (Atomic Design)
│   └── src/
│       ├── components/
│       │   ├── atoms/          ← Button, Input, Badge, Spinner
│       │   ├── molecules/      ← FormField, SearchBar, ItemCard
│       │   ├── organisms/      ← Navbar, ItemForm, ItemList
│       │   ├── templates/      ← MainLayout
│       │   └── pages/          ← HomePage, ItemsPage, ItemDetailPage
│       ├── hooks/              ← useItems (custom CRUD hook)
│       ├── services/           ← Axios API service
│       ├── App.jsx
│       └── index.css           ← Premium dark theme
│
├── nginx/
│   └── nginx.conf              ← Reverse proxy config
│
└── run.sh                      ← Jalankan backend + frontend
```

---

## 🌐 API Endpoints

| Method | Endpoint       | Deskripsi          |
|--------|----------------|--------------------|
| GET    | /api/items     | Ambil semua items  |
| GET    | /api/items/:id | Ambil item by ID   |
| POST   | /api/items     | Buat item baru     |
| PUT    | /api/items/:id | Update item        |
| DELETE | /api/items/:id | Hapus item         |

---

## ⚙️ NGINX Setup Manual

Jika NGINX tidak ter-setup otomatis, salin manual:

```bash
sudo cp <project>/nginx/nginx.conf /etc/nginx/sites-available/<project>
sudo ln -s /etc/nginx/sites-available/<project> /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload
```

---

## 🛠️ Prerequisites

- **Node.js** v18+ & **npm**
- **MongoDB** (berjalan lokal)
- **NGINX**

```bash
# Ubuntu/Debian
sudo apt install nginx
sudo systemctl start mongodb
```

---

## 📦 Tech Stack

| Layer    | Teknologi                        |
|----------|----------------------------------|
| Backend  | Express.js, Mongoose, Morgan     |
| Frontend | React 18, Vite, React Router     |
| Database | MongoDB                          |
| Proxy    | NGINX                            |
| Design   | Atomic Design Pattern            |

---

## 💻 WSL & Linux Compatibility

Boilerplate ini sepenuhnya kompatibel dengan **Ubuntu/Debian** dan **WSL (Windows Subsystem for Linux)**.

**Tips WSL:**
- Pastikan MongoDB berjalan di Windows atau di dalam distro WSL Anda (`sudo service mongodb start`).
- Jika menggunakan NGINX di WSL, pastikan port tidak bentrok dengan Windows.

---

## 💡 Troubleshooting MongoDB

Jika backend tidak bisa menyambung ke MongoDB:

1. **Cek Status**: Jalankan `mongosh` atau `mongo`. Jika muncul error connection, berarti database belum jalan.
2. **Jalankan MongoDB**:
   - **Linux Native**: `sudo systemctl start mongod`
   - **WSL**: `sudo service mongodb start`
3. **Cek Port**: Secara default boilerplate menggunakan port `27017`.
4. **WSL2 (Database di Windows)**: Jika MongoDB terinstall di Windows (bukan di WSL), ganti `127.0.0.1` di file `.env` backend menjadi IP Windows Anda (cek via `ipconfig` di CMD).

**Tips Eksekusi Script:**
Di Linux/WSL, Anda **harus** menambahkan `./` sebelum nama script untuk menjalankannya dari folder saat ini. Contoh: `./run.sh` atau `./delete_project.sh`.
