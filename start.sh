#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════╗
# ║         MERN Boilerplate Generator — start.sh               ║
# ║  Usage: ./start.sh → fill project & database name           ║
# ╚══════════════════════════════════════════════════════════════╝

# ─── Colors ─────────────────────────────────────────────────────
RESET='\033[0m'
BOLD='\033[1m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'

# ─── Banner ──────────────────────────────────────────────────────
[ -t 1 ] && clear
echo -e "${PURPLE}${BOLD}"
echo "  ███╗   ███╗███████╗██████╗ ███╗   ██╗"
echo "  ████╗ ████║██╔════╝██╔══██╗████╗  ██║"
echo "  ██╔████╔██║█████╗  ██████╔╝██╔██╗ ██║"
echo "  ██║╚██╔╝██║██╔══╝  ██╔══██╗██║╚██╗██║"
echo "  ██║ ╚═╝ ██║███████╗██║  ██║██║ ╚████║"
echo "  ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝"
echo -e "${RESET}"
echo -e "${CYAN}${BOLD}  MERN Boilerplate Generator${RESET}"
echo -e "${CYAN}  Express MVC + React Atomic Design + NGINX${RESET}"
echo ""
echo -e "──────────────────────────────────────────────"
echo ""

# ─── Detect script directory ────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="${SCRIPT_DIR}/templates"

# ─── Helper: read input (safe for piped & interactive)
ask() {
  local prompt="$1"
  local default="$2"
  local varname="$3"

  if [ -t 0 ]; then
    # Interactive terminal
    if [ -n "$default" ]; then
      read -rp "$(echo -e "${BOLD}${prompt} [${default}]: ${RESET}")" value
      value="${value:-$default}"
    else
      read -rp "$(echo -e "${BOLD}${prompt}: ${RESET}")" value
    fi
  else
    # Piped input
    read -r value
    [ -z "$value" ] && value="$default"
  fi

  printf -v "$varname" '%s' "$value"
}

# ─── Prerequisite Check ─────────────────────────────────────────
check_command() {
  if ! command -v "$1" &>/dev/null; then
    echo -e "${RED}✗ '$1' not found. Please install it first.${RESET}"
    exit 1
  fi
}

echo -e "${BOLD}🔍 Checking prerequisites...${RESET}"
check_command node
check_command npm
check_command git

# GitHub CLI (gh): Optional but highly recommended
if ! command -v gh &>/dev/null; then
  echo -e "${YELLOW}⚠ GitHub CLI (gh) not found. Repo automation will be limited.${RESET}"
  echo -e "${YELLOW}  Install: sudo apt install gh && gh auth login${RESET}"
else
  echo -e "${GREEN}✓ gh (GitHub CLI) — Available${RESET}"
fi

# nginx: required for production proxy, optional for development
if command -v nginx &>/dev/null; then
  echo -e "${GREEN}✓ node, npm, git, nginx — OK${RESET}"
else
  echo -e "${YELLOW}⚠ nginx not found — NGINX setup will be skipped.${RESET}"
  echo -e "${YELLOW}  Install: sudo apt install nginx${RESET}"
  NGINX_MISSING=true
fi

# MongoDB Check
echo -e "${BOLD}🍃 Checking MongoDB...${RESET}"
if command -v mongosh &>/dev/null || command -v mongo &>/dev/null; then
  if mongosh --eval "db.adminCommand('ping')" --quiet &>/dev/null || mongo --eval "db.adminCommand('ping')" --quiet &>/dev/null; then
    echo -e "${GREEN}✓ MongoDB is running.${RESET}"
  else
    echo -e "${YELLOW}⚠ MongoDB is installed but seems to be stopped.${RESET}"
    echo -e "${YELLOW}  Run: sudo systemctl start mongod (Linux) or sudo service mongodb start (WSL)${RESET}"
  fi
else
  echo -e "${RED}✗ MongoDB (mongosh/mongo) not found. Please ensure it is installed.${RESET}"
fi
echo ""

# ─── Input Phase ────────────────────────────────────────────────
while true; do
  echo -ne "${BOLD}📁 Project name (no spaces, e.g., my-app): ${RESET}"
  read -r PROJECT_NAME
  if [[ -z "$PROJECT_NAME" ]]; then
    echo -e "${RED}  ✗ Project name cannot be empty.${RESET}"
  elif [[ "$PROJECT_NAME" =~ [[:space:]] ]]; then
    echo -e "${RED}  ✗ Project name cannot contain spaces.${RESET}"
  else
    break
  fi
done

while true; do
  echo -ne "${BOLD}🍃 MongoDB database name (e.g., my_app_db): ${RESET}"
  read -r DB_NAME
  if [[ -z "$DB_NAME" ]]; then
    echo -e "${RED}  ✗ Database name cannot be empty.${RESET}"
  else
    break
  fi
done

echo -ne "${BOLD}👤 GitHub Username (for push automation): ${RESET}"
read -r GITHUB_USER

echo -ne "${BOLD}🔌 Express backend port [5000]: ${RESET}"
read -r BACKEND_PORT
BACKEND_PORT="${BACKEND_PORT:-5000}"

echo -ne "${BOLD}🌐 React frontend port [5173]: ${RESET}"
read -r FRONTEND_PORT
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

echo -ne "${BOLD}🚦 NGINX port [80]: ${RESET}"
read -r NGINX_PORT
NGINX_PORT="${NGINX_PORT:-80}"

# ─── Confirmation ─────────────────────────────────────────────────
echo ""
echo -e "──────────────────────────────────────────────"
echo -e "${BOLD}  Project Configuration:${RESET}"
echo ""
echo -e "  ${CYAN}Project Name    :${RESET} ${PROJECT_NAME}"
echo -e "  ${CYAN}Database        :${RESET} ${DB_NAME}"
echo -e "  ${CYAN}GitHub User     :${RESET} ${GITHUB_USER:-None}"
echo -e "  ${CYAN}Backend Port    :${RESET} ${BACKEND_PORT}"
echo -e "  ${CYAN}Frontend Port   :${RESET} ${FRONTEND_PORT}"
echo -e "  ${CYAN}NGINX Port      :${RESET} ${NGINX_PORT}"
echo -e "  ${CYAN}Directory       :${RESET} $(pwd)/${PROJECT_NAME}"
echo ""
echo -e "──────────────────────────────────────────────"
echo ""

echo -ne "${BOLD}❓ Proceed? [y/N]: ${RESET}"
read -r CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}  Cancelled.${RESET}"
  exit 0
fi

echo ""

# ─── Target Directories ─────────────────────────────────────────
TARGET_DIR="$(pwd)/${PROJECT_NAME}"
BACKEND_DIR="${TARGET_DIR}/backend"
FRONTEND_DIR="${TARGET_DIR}/frontend"
NGINX_DIR="${TARGET_DIR}/nginx"

# ─── Check if directory exists ──────────────────────────────────
if [[ -d "$TARGET_DIR" ]]; then
  echo -e "${RED}✗ Folder '${PROJECT_NAME}' already exists. Please choose another name.${RESET}"
  exit 1
fi

# ════════════════════════════════════════════════════════════════
# STEP 1 — Folder structure
# ════════════════════════════════════════════════════════════════
echo -e "${BOLD}[1/6] 📂 Creating folder structure...${RESET}"
mkdir -p "$TARGET_DIR"
cp -r "${TEMPLATE_DIR}/backend"  "$BACKEND_DIR"
cp -r "${TEMPLATE_DIR}/frontend" "$FRONTEND_DIR"
cp -r "${TEMPLATE_DIR}/nginx"    "$NGINX_DIR"
echo -e "${GREEN}  ✓ Folder created: ${TARGET_DIR}${RESET}"

# ════════════════════════════════════════════════════════════════
# STEP 2 — Placeholder substitution
# ════════════════════════════════════════════════════════════════
echo -e "${BOLD}[2/6] 🔧 Configuring project...${RESET}"

find "$TARGET_DIR" -type f \( \
  -name "*.js"   -o -name "*.jsx"  -o -name "*.json" \
  -o -name "*.css" -o -name "*.html" \
  -o -name "*.conf" -o -name "*.example" \
\) | while IFS= read -r f; do
  sed -i \
    -e "s|{{PROJECT_NAME}}|${PROJECT_NAME}|g" \
    -e "s|{{DB_NAME}}|${DB_NAME}|g" \
    -e "s|{{BACKEND_PORT}}|${BACKEND_PORT}|g" \
    -e "s|{{FRONTEND_PORT}}|${FRONTEND_PORT}|g" \
    -e "s|{{NGINX_PORT}}|${NGINX_PORT}|g" \
    "$f"
done

echo -e "${GREEN}  ✓ Placeholders replaced.${RESET}"

# ════════════════════════════════════════════════════════════════
# STEP 3 — Security
# ════════════════════════════════════════════════════════════════
echo -e "${BOLD}[3/6] 🛡️ Setting up backend security...${RESET}"
sleep 0.3
echo -e "${GREEN}  ✓ Security configured.${RESET}"

# ════════════════════════════════════════════════════════════════
# STEP 4 — .env files
# ════════════════════════════════════════════════════════════════
echo -e "${BOLD}[4/6] 🔐 Creating .env files...${RESET}"

# Generate random JWT Secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

cat > "${BACKEND_DIR}/.env" <<EOF
PORT=${BACKEND_PORT}
MONGO_URI=mongodb://127.0.0.1:27017/${DB_NAME}
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=30d
NODE_ENV=development
EOF

cat > "${FRONTEND_DIR}/.env" <<EOF
VITE_API_URL=http://localhost:${BACKEND_PORT}/api
EOF
echo -e "${GREEN}  ✓ .env files created.${RESET}"

# ════════════════════════════════════════════════════════════════
# STEP 5 — Dependencies
# ════════════════════════════════════════════════════════════════
echo -e "${BOLD}[5/6] 📦 Installing npm dependencies (this may take a while)...${RESET}"
echo -e "  → Backend..."
if ! (cd "$BACKEND_DIR" && npm install); then
  echo -e "${RED}✗ Backend dependencies failed to install.${RESET}"
  exit 1
fi

echo -e "  → Frontend..."
if ! (cd "$FRONTEND_DIR" && npm install); then
  echo -e "${RED}✗ Frontend dependencies failed to install.${RESET}"
  exit 1
fi
echo -e "${GREEN}  ✓ Dependencies installed.${RESET}"

# ════════════════════════════════════════════════════════════════
# Create run.sh
# ════════════════════════════════════════════════════════════════
cat > "${TARGET_DIR}/run.sh" <<RUNSCRIPT
#!/usr/bin/env bash
RESET='\033[0m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'

SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

BACKEND_PORT="${BACKEND_PORT}"
FRONTEND_PORT="${FRONTEND_PORT}"
PROJECT_NAME="${PROJECT_NAME}"

echo -e "\${BOLD}🚀 Starting \${PROJECT_NAME}...\${RESET}"

cleanup() {
  echo ""
  echo -e "\${YELLOW}⏹ Stopping processes...\${RESET}"
  kill \$BACKEND_PID \$FRONTEND_PID 2>/dev/null
  echo -e "\${CYAN}Done. Application stopped.\${RESET}"
  exit 0
}

trap cleanup SIGINT SIGTERM

kill_port() {
  local port=\$1
  pid=\$(lsof -ti tcp:\$port 2>/dev/null)
  [ -n "\$pid" ] && kill -9 \$pid 2>/dev/null
}
kill_port "\$BACKEND_PORT"
kill_port "\$FRONTEND_PORT"

# Check for node_modules
if [ ! -d "\$SCRIPT_DIR/backend/node_modules" ] || [ ! -d "\$SCRIPT_DIR/frontend/node_modules" ]; then
  echo -e "\${RED}✗ node_modules missing. Running npm install...\${RESET}"
  (cd "\$SCRIPT_DIR/backend" && npm install)
  (cd "\$SCRIPT_DIR/frontend" && npm install)
fi

(cd "\$SCRIPT_DIR/backend" && npm run dev) &
BACKEND_PID=\$!
sleep 2
(cd "\$SCRIPT_DIR/frontend" && npm run dev) &
FRONTEND_PID=\$!

echo ""
echo -e "\${GREEN}\${BOLD}✅ Application is running!\${RESET}"
echo -e "  Backend  → http://localhost:\${BACKEND_PORT}/api"
echo -e "  Frontend → http://localhost:\${FRONTEND_PORT}"
echo ""
echo -e "  Press \${BOLD}Ctrl+C\${RESET} to stop."

wait
RUNSCRIPT

chmod +x "${TARGET_DIR}/run.sh"

# Save GitHub Username to project folder
if [[ -n "$GITHUB_USER" ]]; then
  echo "$GITHUB_USER" > "${TARGET_DIR}/.github_user"
fi

# ════════════════════════════════════════════════════════════════
# STEP 6 — Git
# ════════════════════════════════════════════════════════════════
echo -e "${BOLD}[6/6] 🚀 Initializing Git...${RESET}"
cd "$TARGET_DIR"
echo -ne "${BOLD}❓ Initialize Git repository? [Y/n]: ${RESET}"
read -r GIT_CONFIRM
if [[ ! "$GIT_CONFIRM" =~ ^[Nn]$ ]]; then
  git init -q
  cat > .gitignore <<EOF
node_modules/
.env
dist/
build/
*.log
.DS_Store
.vscode/
.idea/
EOF
  git add .
  git commit -m "Initial commit: MERN Boilerplate Generated" -q
  echo -e "${GREEN}  ✓ Local repository initialized.${RESET}"

  echo -ne "${BOLD}❓ Push to GitHub now? [y/N]: ${RESET}"
  read -r PUSH_CONFIRM
  if [[ "$PUSH_CONFIRM" =~ ^[Yy]$ ]]; then
    DEFAULT_REPO_URL="git@github.com:${GITHUB_USER}/${PROJECT_NAME}.git"
    if command -v gh &>/dev/null; then
      gh repo create "$PROJECT_NAME" --public --source=. --remote=origin --push --ssh
    else
      echo -e "${CYAN}🚀 Using SSH URL: $DEFAULT_REPO_URL${RESET}"
      git remote add origin "$DEFAULT_REPO_URL" 2>/dev/null
      git branch -M main
      git push -u origin main
    fi
  fi
fi

cd "$SCRIPT_DIR"

# ════════════════════════════════════════════════════════════════
# SUMMARY
# ════════════════════════════════════════════════════════════════
echo ""
echo -e "══════════════════════════════════════════════"
echo -e "${GREEN}${BOLD}  ✅ Project '${PROJECT_NAME}' created successfully!${RESET}"
echo -e "══════════════════════════════════════════════"
echo ""
echo -e "  How to run:"
echo -e "  ${CYAN}cd ${PROJECT_NAME} && ./run.sh${RESET}"
echo ""
echo -e "  Endpoints:"
echo -e "  ${CYAN}http://localhost:${BACKEND_PORT}/api${RESET}   ← Backend API"
echo -e "  ${CYAN}http://localhost:${FRONTEND_PORT}${RESET}       ← Frontend React"
echo ""
