# MERN Boilerplate Generator

> [Bahasa Indonesia](README.md) | [English](README_EN.md)

> Generate full-stack project dalam hitungan detik.  
> **Express MVC** (Backend) + **React Atomic Design** (Frontend) + **NGINX** (Reverse Proxy)
> 
> 🔄 **Multi-Database**: MongoDB (Mongoose) · PostgreSQL (Prisma) · MySQL (Prisma)

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
2. **Database type** — pilih database: `mongodb`, `postgres`, atau `mysql`
3. **DB username & password** (khusus postgres/mysql) — kredensial database
4. **Nama database** — nama database yang akan digunakan
5. **Frontend language** — pilih `js` atau `ts` untuk men-generate React Vite
6. **Port backend** — default `5000`
7. **Port frontend** — default `5173`
8. **Port NGINX** — default `80`
9. **Git/GitHub** — otomatis inisialisasi repo dan push ke GitHub via **SSH** (mendukung `gh` CLI)

Setelah selesai, masuk ke folder project dan jalankan:

```bash
cd <nama-project>
./run.sh
```

> **⚠️ Penting**: Boilerplate membuat **struktur project + konfigurasi koneksi**, tetapi **tidak membuat database/user di server**. Pastikan database server sudah berjalan dan database-nya sudah dibuat sebelum `run.sh`:

```bash
# MongoDB (auto-create database, langsung bisa)
sudo systemctl start mongod

# PostgreSQL — buat user & database dulu
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE USER <user> WITH PASSWORD '<pass>';"
sudo -u postgres psql -c "CREATE DATABASE <nama_db> OWNER <user>;"

# MySQL — buat database dulu
sudo systemctl start mysql
mysql -u root -p -e "CREATE DATABASE <nama_db>;"
```

---

## 🗄️ Dukungan Database

| Database      | ORM        | Connection String (`.env`)                         |
|---------------|------------|----------------------------------------------------|
| **MongoDB**   | Mongoose   | `MONGO_URI=mongodb://127.0.0.1:27017/{nama}`       |
| **PostgreSQL**| Prisma v6  | `DATABASE_URL=postgresql://{user}:{pass}@localhost:5432/{nama}` |
| **MySQL**     | Prisma v6  | `DATABASE_URL=mysql://{user}:{pass}@localhost:3306/{nama}`      |

Script otomatis mengatur:
- **MongoDB**: instalasi `mongoose` + `express-mongo-sanitize`
- **PostgreSQL / MySQL**: instalasi `@prisma/client` + `prisma@6.19.3`, generate Prisma Client via `postinstall`, push schema ke database

> **Prompt kredensial**: Saat memilih `postgres` atau `mysql`, script akan meminta username dan password database (dengan default: `postgres`/`postgres` untuk PostgreSQL, `root`/`(kosong)` untuk MySQL).

> **Catatan Express 5**: Boilerplate menggunakan **Express 5.2.1** (stable). Wildcard route admin panel sudah diupdate ke sintaks baru: `/admin/{*path}` (bukan `/admin/*` di Express 4).

---

## 🛠️ GitHub Automation (SSH & GH CLI)

Boilerplate ini mendukung push otomatis ke GitHub menggunakan protokol **SSH**.

**Rekomendasi:**
- Install [GitHub CLI (gh)](https://cli.github.com/) agar script bisa **membuat repository otomatis** di akun GitHub Anda tanpa buka browser.
- Gunakan SSH Key untuk keamanan dan kenyamanan (bebas dari input password/token setiap push).

---

## 📁 Struktur yang Dihasilkan

### MongoDB
```
<project-name>/
├── backend/
│   ├── src/
│   │   ├── config/db.js        ← Koneksi MongoDB (Mongoose)
│   │   ├── controllers/        ← Logic HTTP Auth
│   │   ├── services/           ← Business Logic & Database Queries
│   │   ├── models/             ← User Schema (Mongoose)
│   │   ├── routes/             ← Express Router
│   │   ├── middlewares/        ← Auth (JWT), RBAC, Error Handler
│   │   └── views/admin/        ← Admin Panel (React TS)
│   ├── app.js                  ← Express setup
│   ├── server.js               ← Entry point
│   └── .env                    ← Konfigurasi otomatis
│
├── frontend/                   ← React + Vite (Atomic Design)
│   └── src/
│       ├── components/{atoms,molecules,organisms,templates}/
│       ├── pages/
│       ├── App.{jsx,tsx}
│       └── index.css
│
├── nginx/nginx.conf
└── run.sh
```

### PostgreSQL / MySQL
```
<project-name>/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       ← Model User (Prisma)
│   ├── src/
│   │   ├── config/db.js        ← Koneksi Database (Prisma Client)
│   │   ├── controllers/        ← Logic HTTP Auth
│   │   ├── services/           ← Business Logic & Prisma Queries
│   │   ├── routes/             ← Express Router
│   │   ├── middlewares/        ← Auth (JWT), RBAC, Error Handler
│   │   └── views/admin/        ← Admin Panel (React TS)
│   ├── app.js                  ← Express setup
│   ├── server.js               ← Entry point
│   └── .env                    ← Konfigurasi otomatis
│
├── frontend/                   ← React + Vite (Atomic Design)
├── nginx/nginx.conf
└── run.sh
```

---

## 🌐 API Endpoints

| Method | Endpoint             | Deskripsi          |
|--------|----------------------|--------------------|
| POST   | /api/auth/register    | Daftar user baru   |
| POST   | /api/auth/login       | Login user         |
| GET    | /api/auth/me          | Ambil profil user  |
| PUT    | /api/auth/profile     | Update profil user |
| GET    | /api/auth/users       | Ambil daftar user (Admin only) |
| GET    | /admin                | Halaman Admin Panel |

---

## 🔐 Autentikasi & Keamanan

Boilerplate ini sudah dilengkapi dengan sistem autentikasi menggunakan **JWT (JSON Web Token)** dan **bcryptjs**.

### Fitur:
- **Password Hashing**: Meng-hash password secara otomatis menggunakan `bcryptjs`.
- **JWT Generation**: Method bawaan untuk menghasilkan token bagi user yang terautentikasi.
- **Auth Middleware**: Middleware `protect` untuk mengamankan route dan `authorize` untuk akses berdasarkan role (admin/owner/member).
- **Security Middleware**: Helmet, Rate Limiting, HPP, body size limiter.
- **NoSQL Injection Protection** (khusus MongoDB): Mencegah serangan NoSQL injection.
- **Setup JWT Secret**: Tambahkan string aman Anda sendiri ke `JWT_SECRET` di file `.env`.

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
- **Database server** (pilih salah satu):
  - **MongoDB** — untuk mode `mongodb`
  - **PostgreSQL** — untuk mode `postgres`
  - **MySQL** — untuk mode `mysql`
- **NGINX** (opsional, untuk production)

```bash
# Ubuntu/Debian
sudo apt install nginx

# MongoDB
sudo systemctl start mongod

# PostgreSQL
sudo systemctl start postgresql

# MySQL
sudo systemctl start mysql
```

---

## 📦 Tech Stack

| Layer    | Teknologi                          |
|----------|------------------------------------|
| Backend  | Express.js 5, Prisma ORM 6 / Mongoose 9  |
| Frontend | React 19, Vite 8, React Router 7  |
| Database | MongoDB / PostgreSQL / MySQL       |
| Proxy    | NGINX                              |
| Design   | Atomic Design Pattern               |

---

## 💻 WSL & Linux Compatibility

Boilerplate ini sepenuhnya kompatibel dengan **Ubuntu/Debian** dan **WSL (Windows Subsystem for Linux)**.

**Tips WSL:**
- Pastikan database server berjalan (MongoDB/PostgreSQL/MySQL).
- Jika menggunakan NGINX di WSL, pastikan port tidak bentrok dengan Windows.

---

## 💡 Troubleshooting MongoDB

Jika backend tidak bisa menyambung ke MongoDB:

1. **Cek Status**: Jalankan `mongosh` atau `mongo`. Jika error connection, database belum jalan.
2. **Jalankan MongoDB**:
   - **Linux Native**: `sudo systemctl start mongod`
   - **WSL**: `sudo service mongodb start`
3. **Cek Port**: Default port `27017`.
4. **WSL2 (Database di Windows)**: Jika MongoDB terinstall di Windows, ganti `127.0.0.1` di `.env` menjadi IP Windows (cek via `ipconfig` di CMD).

## 💡 Troubleshooting PostgreSQL

1. **Cek Status**: `pg_isready`
2. **Jalankan**: `sudo systemctl start postgresql`
3. **Buat database** (jika belum ada): `createdb -U postgres <nama_db>`
4. **Cek kredensial**: Pastikan `DATABASE_URL` di `.env` sesuai dengan user/password PostgreSQL Anda.

## 💡 Troubleshooting MySQL

1. **Cek Status**: `sudo systemctl status mysql`
2. **Jalankan**: `sudo systemctl start mysql`
3. **Buat database** (jika belum ada): `mysql -u root -e "CREATE DATABASE <nama_db>;"`
4. **Cek kredensial**: Pastikan `DATABASE_URL` di `.env` sesuai dengan user/password MySQL Anda.

> **Tips umum**: Jika Prisma gagal push schema (`prisma db push`), pastikan database server sedang berjalan dan kredensial di `.env` benar. Anda bisa push manual dengan `npx prisma db push` dari folder `backend/`.

**Tips Eksekusi Script:**
Di Linux/WSL, Anda **harus** menambahkan `./` sebelum nama script. Contoh: `./run.sh`.
