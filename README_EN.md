# MERN Boilerplate Generator

> [Bahasa Indonesia](README.md) | [English](README_EN.md)

> Generate a full-stack project in seconds.  
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

Follow the interactive prompts:
1. **Project name** — name of the project folder (no spaces)
2. **Database type** — choose database: `mongodb`, `postgres`, or `mysql`
3. **DB username & password** (for postgres/mysql only) — database credentials
4. **Database name** — database name for your project
5. **Frontend language** — select `js` or `ts` to dynamically generate React Vite
6. **GitHub Username** — your GitHub username for SSH push automation
7. **Backend port** — default `5000`
8. **Frontend port** — default `5173`
9. **NGINX port** — default `80`

After generation is complete, enter the project folder and run:

```bash
cd <project-name>
./run.sh
```

> **⚠️ Important**: The boilerplate creates the **project structure + connection config**, but does **not create the database/user on the server**. Make sure your database server is running and the database is created before running `run.sh`:

```bash
# MongoDB (auto-creates database, ready to use)
sudo systemctl start mongod

# PostgreSQL — create user & database first
sudo systemctl start postgresql
sudo -u postgres psql -c "CREATE USER <user> WITH PASSWORD '<pass>';"
sudo -u postgres psql -c "CREATE DATABASE <db_name> OWNER <user>;"

# MySQL — create database first
sudo systemctl start mysql
mysql -u root -p -e "CREATE DATABASE <db_name>;"
```

---

## 🗄️ Database Support

| Database      | ORM        | Connection String (`.env`)                         |
|---------------|------------|----------------------------------------------------|
| **MongoDB**   | Mongoose   | `MONGO_URI=mongodb://127.0.0.1:27017/{name}`       |
| **PostgreSQL**| Prisma v6  | `DATABASE_URL=postgresql://{user}:{pass}@localhost:5432/{name}` |
| **MySQL**     | Prisma v6  | `DATABASE_URL=mysql://{user}:{pass}@localhost:3306/{name}`      |

The script automatically handles:
- **MongoDB**: installs `mongoose` + `express-mongo-sanitize`
- **PostgreSQL / MySQL**: installs `@prisma/client` + `prisma@6.19.3`, generates Prisma Client via `postinstall` script, pushes schema to database

> **Credential prompts**: When selecting `postgres` or `mysql`, the script will ask for a database username and password (defaults: `postgres`/`postgres` for PostgreSQL, `root`/`(empty)` for MySQL).

> **Express 5 note**: This boilerplate uses **Express 5.2.1** (stable). The admin panel wildcard route is already updated to the new syntax: `/admin/{*path}` (not `/admin/*` as in Express 4).

---

## 🛠️ GitHub Automation (SSH & GH CLI)

This boilerplate supports automated pushing to GitHub using the **SSH** protocol.

**Recommendations:**
- Install [GitHub CLI (gh)](https://cli.github.com/) to allow the script to **automatically create the repository** in your GitHub account without opening a browser.
- Use an SSH Key for security and convenience (avoiding password/token prompts for every push).

---

## 📁 Generated Structure

### MongoDB
```
<project-name>/
├── backend/
│   ├── src/
│   │   ├── config/db.js        ← MongoDB Connection (Mongoose)
│   │   ├── controllers/        ← Auth HTTP Logic
│   │   ├── services/           ← Business Logic & Database Queries
│   │   ├── models/             ← User Schema (Mongoose)
│   │   ├── routes/             ← Express Router
│   │   ├── middlewares/        ← Auth (JWT), RBAC, Error Handler
│   │   └── views/admin/        ← Admin Panel (React TS)
│   ├── app.js                  ← Express Setup
│   ├── server.js               ← Entry Point
│   └── .env                    ← Auto-generated Config
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
│   │   └── schema.prisma       ← User Model (Prisma)
│   ├── src/
│   │   ├── config/db.js        ← Database Connection (Prisma Client)
│   │   ├── controllers/        ← Auth HTTP Logic
│   │   ├── services/           ← Business Logic & Prisma Queries
│   │   ├── routes/             ← Express Router
│   │   ├── middlewares/        ← Auth (JWT), RBAC, Error Handler
│   │   └── views/admin/        ← Admin Panel (React TS)
│   ├── app.js                  ← Express Setup
│   ├── server.js               ← Entry Point
│   └── .env                    ← Auto-generated Config
│
├── frontend/                   ← React + Vite (Atomic Design)
├── nginx/nginx.conf
└── run.sh
```

---

## 🌐 API Endpoints

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | /api/auth/register    | Register new user        |
| POST   | /api/auth/login       | User login               |
| GET    | /api/auth/me          | Get current user profile |
| PUT    | /api/auth/profile     | Update user profile      |
| GET    | /api/auth/users       | Get all users (Admin only) |
| GET    | /admin                | Admin Panel Dashboard    |

---

## 🛡️ Security Features (Built-in)

The generated backend comes pre-hardened with:
- **Helmet**: Secure HTTP headers.
- **Rate Limiting**: Protection against Brute Force/DoS.
- **HPP**: Protection against HTTP Parameter Pollution.
- **Size Limiting**: JSON body size limits.
- **NoSQL Injection Protection** (MongoDB only): Input sanitization for MongoDB.
- **Authentication**: JWT-based auth with bcrypt password hashing, RBAC (admin/owner/member).

---

## ⚙️ Manual NGINX Setup

If NGINX setup failed during generation, copy it manually:

```bash
sudo cp <project>/nginx/nginx.conf /etc/nginx/sites-available/<project>
sudo ln -s /etc/nginx/sites-available/<project> /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload
```

---

## 🛠️ Prerequisites

- **Node.js** v18+ & **npm**
- **Database server** (choose one):
  - **MongoDB** — for `mongodb` mode
  - **PostgreSQL** — for `postgres` mode
  - **MySQL** — for `mysql` mode
- **NGINX** (optional, for production)

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

| Layer    | Technology                                    |
|----------|-----------------------------------------------|
| Backend  | Express.js 5, Prisma ORM 6 / Mongoose 9      |
| Frontend | React 19, Vite 8, React Router 7              |
| Database | MongoDB / PostgreSQL / MySQL                   |
| Proxy    | NGINX                                         |
| Design   | Atomic Design Pattern                          |

---

## 💻 WSL & Linux Compatibility

This boilerplate is fully compatible with **Ubuntu/Debian** and **WSL (Windows Subsystem for Linux)**.

**WSL Tips:**
- Ensure your chosen database server is running (MongoDB/PostgreSQL/MySQL).
- If using NGINX in WSL, ensure ports don't conflict with Windows services.

---

## 💡 Troubleshooting

### MongoDB
1. **Check Status**: Run `mongosh` or `mongo`. If you see a connection error, the database is not running.
2. **Start**: `sudo systemctl start mongod` (Linux) or `sudo service mongodb start` (WSL)
3. **WSL2 (Database on Windows)**: If MongoDB is installed on Windows, change `127.0.0.1` in `.env` to your Windows IP address.

### PostgreSQL
1. **Check Status**: `pg_isready`
2. **Start**: `sudo systemctl start postgresql`
3. **Create database** (if needed): `createdb -U postgres <db_name>`
4. **Check credentials**: Ensure `DATABASE_URL` in `.env` matches your PostgreSQL user/password.

### MySQL
1. **Check Status**: `sudo systemctl status mysql`
2. **Start**: `sudo systemctl start mysql`
3. **Create database** (if needed): `mysql -u root -e "CREATE DATABASE <db_name>;"`
4. **Check credentials**: Ensure `DATABASE_URL` in `.env` matches your MySQL user/password.

> **General tip**: If Prisma fails to push the schema (`prisma db push`), make sure your database server is running and the credentials in `.env` are correct. You can manually push with `npx prisma db push` from the `backend/` directory.

**Script Execution:**
In Linux/WSL, you **must** use `./` before the script name. Example: `./run.sh`.
