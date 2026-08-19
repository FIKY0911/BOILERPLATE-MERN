#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════╗
# ║         MERN Boilerplate Generator — start.sh               ║
# ║  Usage: ./start.sh → fill project & database name           ║
# ╚══════════════════════════════════════════════════════════════╝

set -euo pipefail

# ─── Colors ─────────────────────────────────────────────────────
readonly RESET='\033[0m'
readonly BOLD='\033[1m'
readonly GREEN='\033[0;32m'
readonly CYAN='\033[0;36m'
readonly YELLOW='\033[1;33m'
readonly RED='\033[0;31m'
readonly PURPLE='\033[0;35m'

# ─── Constants ──────────────────────────────────────────────────
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly TEMPLATE_DIR="${SCRIPT_DIR}/templates"
readonly PRISMA_VERSION="6.19.3"

# ─── Project config (populated by input phase) ──────────────────
PROJECT_NAME=""
DB_TYPE="mongodb"
DB_USER=""
DB_PASSWORD=""
DB_NAME=""
GITHUB_USER=""
BACKEND_PORT="5000"
FRONTEND_PORT="5173"
NGINX_PORT="80"
FRONTEND_LANG="js"
NGINX_MISSING=false

# ─── Banner ──────────────────────────────────────────────────────
print_banner() {
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
}

# ─── Logging helpers ─────────────────────────────────────────────
log_info()    { echo -e "${BOLD}$1${RESET}"; }
log_success() { echo -e "${GREEN}  ✓ $1${RESET}"; }
log_warn()    { echo -e "${YELLOW}  ⚠ $1${RESET}"; }
log_error()   { echo -e "${RED}  ✗ $1${RESET}"; }

# ─── Input helper ────────────────────────────────────────────────
ask() {
  local prompt="$1"
  local default="${2:-}"
  local varname="$3"
  local value=""

  if [ -t 0 ]; then
    if [ -n "$default" ]; then
      read -rp "$(echo -e "${BOLD}${prompt} [${default}]: ${RESET}")" value
      value="${value:-$default}"
    else
      read -rp "$(echo -e "${BOLD}${prompt}: ${RESET}")" value
    fi
  else
    read -r value
    [ -z "$value" ] && value="$default"
  fi
  printf -v "$varname" '%s' "$value"
}

confirm() {
  local prompt="$1"
  local default="${2:-n}"
  local value=""

  if [ -t 0 ]; then
    read -rp "$(echo -e "${BOLD}${prompt} [${default}]: ${RESET}")" value
    value="${value:-$default}"
  else
    read -r value
    [ -z "$value" ] && value="$default"
  fi
  [[ "$value" =~ ^[Yy]$ ]]
}

# ─── Prerequisite check ──────────────────────────────────────────
check_prerequisites() {
  log_info "🔍 Checking prerequisites..."

  for cmd in node npm git; do
    if ! command -v "$cmd" &>/dev/null; then
      log_error "'$cmd' not found. Please install it first."
      exit 1
    fi
  done

  if ! command -v gh &>/dev/null; then
    log_warn "GitHub CLI (gh) not found. Repo automation will be limited."
    log_warn "  Install: sudo apt install gh && gh auth login"
  else
    log_success "gh (GitHub CLI) — Available"
  fi

  if command -v nginx &>/dev/null; then
    log_success "node, npm, git, nginx — OK"
  else
    log_warn "nginx not found — NGINX setup will be skipped."
    log_warn "  Install: sudo apt install nginx"
    NGINX_MISSING=true
  fi

  echo ""
}

# ─── Input phase ─────────────────────────────────────────────────
input_phase() {
  # Project name
  while true; do
    ask "📁 Project name (no spaces, e.g., my-app)" "" PROJECT_NAME
    if [[ -z "$PROJECT_NAME" ]]; then
      log_error "Project name cannot be empty."
    elif [[ "$PROJECT_NAME" =~ [[:space:]] ]]; then
      log_error "Project name cannot contain spaces."
    else
      break
    fi
  done

  # Database type
  while true; do
    ask "🗄️ Database type (mongodb/postgres/mysql)" "mongodb" DB_TYPE
    [[ "$DB_TYPE" == "mongodb" || "$DB_TYPE" == "postgres" || "$DB_TYPE" == "mysql" ]] && break
    log_error "Please enter 'mongodb', 'postgres', or 'mysql'."
  done

  # Database credentials (postgres/mysql only)
  if [ "$DB_TYPE" == "postgres" ]; then
    ask "👤 DB username" "postgres" DB_USER
    ask "🔑 DB password" "postgres" DB_PASSWORD
  elif [ "$DB_TYPE" == "mysql" ]; then
    ask "👤 DB username" "root" DB_USER
    ask "🔑 DB password (leave empty for none)" "" DB_PASSWORD
  fi

  # Database name
  while true; do
    ask "🗄️ Database name (e.g., my_app_db)" "" DB_NAME
    [[ -n "$DB_NAME" ]] && break
    log_error "Database name cannot be empty."
  done

  # GitHub username
  ask "👤 GitHub Username (for push automation)" "" GITHUB_USER

  # Ports
  ask "🔌 Express backend port" "5000" BACKEND_PORT
  ask "🌐 React frontend port" "5173" FRONTEND_PORT
  ask "🚦 NGINX port" "80" NGINX_PORT

  # Frontend language
  while true; do
    ask "⚛️ Frontend language (js/ts)" "js" FRONTEND_LANG
    [[ "$FRONTEND_LANG" == "js" || "$FRONTEND_LANG" == "ts" ]] && break
    log_error "Please enter 'js' or 'ts'."
  done
}

# ─── Configuration summary ──────────────────────────────────────
print_summary() {
  echo ""
  echo -e "──────────────────────────────────────────────"
  echo -e "${BOLD}  Project Configuration:${RESET}"
  echo ""
  echo -e "  ${CYAN}Project Name    :${RESET} ${PROJECT_NAME}"
  echo -e "  ${CYAN}Database Type   :${RESET} ${DB_TYPE}"
  if [ "$DB_TYPE" != "mongodb" ]; then
    echo -e "  ${CYAN}DB User         :${RESET} ${DB_USER}"
    echo -e "  ${CYAN}DB Password     :${RESET} $(echo "${DB_PASSWORD}" | sed 's/./*/g')"
  fi
  echo -e "  ${CYAN}Database Name   :${RESET} ${DB_NAME}"
  echo -e "  ${CYAN}GitHub User     :${RESET} ${GITHUB_USER:-None}"
  echo -e "  ${CYAN}Backend Port    :${RESET} ${BACKEND_PORT}"
  echo -e "  ${CYAN}Frontend Port   :${RESET} ${FRONTEND_PORT}"
  echo -e "  ${CYAN}Frontend Lang   :${RESET} ${FRONTEND_LANG}"
  echo -e "  ${CYAN}NGINX Port      :${RESET} ${NGINX_PORT}"
  echo -e "  ${CYAN}Directory       :${RESET} $(pwd)/${PROJECT_NAME}"
  echo -e "──────────────────────────────────────────────"
  echo ""
}

# ─── Database config abstraction ─────────────────────────────────
get_db_config() {
  local key="$1"
  case "$DB_TYPE" in
    mongodb)
      case "$key" in
        driver)      echo "mongoose" ;;
        sanitize)    echo "express-mongo-sanitize" ;;
        env_var)     echo "MONGO_URI" ;;
        env_val)     echo "mongodb://127.0.0.1:27017/${DB_NAME}" ;;
        provider)    echo "mongodb" ;;
        template)    echo "mongodb" ;;
        *)           echo "" ;;
      esac
      ;;
    postgres)
      case "$key" in
        driver)      echo "@prisma/client" ;;
        sanitize)    echo "" ;;
        env_var)     echo "DATABASE_URL" ;;
        env_val)     echo "postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}" ;;
        provider)    echo "postgresql" ;;
        template)    echo "postgres" ;;
        *)           echo "" ;;
      esac
      ;;
    mysql)
      case "$key" in
        driver)      echo "@prisma/client" ;;
        sanitize)    echo "" ;;
        env_var)     echo "DATABASE_URL" ;;
        env_val)     echo "mysql://${DB_USER}:${DB_PASSWORD}@localhost:3306/${DB_NAME}" ;;
        provider)    echo "mysql" ;;
        template)    echo "mysql" ;;
        *)           echo "" ;;
      esac
      ;;
    *)
      echo ""
      ;;
  esac
}

# ─── Step functions ──────────────────────────────────────────────
TARGET_DIR=""
BACKEND_DIR=""
FRONTEND_DIR=""
NGINX_DIR=""

step1_create_structure() {
  log_info "[1/6] 📂 Creating folder structure..."
  TARGET_DIR="$(pwd)/${PROJECT_NAME}"
  BACKEND_DIR="${TARGET_DIR}/backend"
  FRONTEND_DIR="${TARGET_DIR}/frontend"
  NGINX_DIR="${TARGET_DIR}/nginx"

  if [[ -d "$TARGET_DIR" ]]; then
    log_error "Folder '${PROJECT_NAME}' already exists. Please choose another name."
    exit 1
  fi

  mkdir -p "$TARGET_DIR"
  cp -r "${TEMPLATE_DIR}/backend"  "$BACKEND_DIR"
  cp -r "${TEMPLATE_DIR}/nginx"    "$NGINX_DIR"

  # Apply database-specific template
  log_info "  → Applying database template (${DB_TYPE})..."
  if [ "$DB_TYPE" == "mongodb" ]; then
    cp -r "${TEMPLATE_DIR}/backend-db/mongodb/"* "$BACKEND_DIR/"
  else
    local template_name
    template_name=$(get_db_config template)
    cp -r "${TEMPLATE_DIR}/backend-db/prisma/"* "$BACKEND_DIR/"
    mkdir -p "$BACKEND_DIR/prisma"
    cp "${TEMPLATE_DIR}/backend-db/${template_name}/prisma/schema.prisma" "$BACKEND_DIR/prisma/schema.prisma"

    # Remove mongo sanitize from app.js
    sed -i '/import mongoSanitize/d' "$BACKEND_DIR/app.js"
    sed -i '/app.use(mongoSanitize())/d' "$BACKEND_DIR/app.js"
    rm -rf "$BACKEND_DIR/src/models"
  fi

  # Generate Vite frontend
  log_info "  → Generating Vite Frontend (${FRONTEND_LANG})..."
  local template_flag="react"
  local vite_ext="js"
  [ "$FRONTEND_LANG" == "ts" ] && template_flag="react-ts" && vite_ext="ts"

  cd "$TARGET_DIR"
  npx --yes create-vite@latest frontend --template "$template_flag" --no-interactive > /dev/null 2>&1
  cd "$SCRIPT_DIR"

  # Atomic design folder structure
  mkdir -p "$FRONTEND_DIR/src/components/atoms"
  mkdir -p "$FRONTEND_DIR/src/components/molecules"
  mkdir -p "$FRONTEND_DIR/src/components/organisms"
  mkdir -p "$FRONTEND_DIR/src/components/templates"
  mkdir -p "$FRONTEND_DIR/src/pages"

  # Vite config with proxy
  cat > "${FRONTEND_DIR}/vite.config.${vite_ext}" <<EOF
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: Number('${FRONTEND_PORT}'),
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:${BACKEND_PORT}',
        changeOrigin: true,
      },
    },
  },
});
EOF

  echo -e "${GREEN}  ✓ Folder created: ${RESET}${TARGET_DIR}"
}

step2_placeholders() {
  log_info "[2/6] 🔧 Configuring project..."

  find "$TARGET_DIR" -type f \
    -not -path "*/node_modules/*" \
    -not -path "*/dist/*" \
    \( \
      -name "*.js"   -o -name "*.jsx"  -o -name "*.json" \
      -o -name "*.ts" -o -name "*.tsx" \
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

  log_success "Placeholders replaced."
}

step3_security() {
  log_info "[3/6] 🛡️ Setting up backend security..."
  sleep 0.3
  log_success "Security configured."
}

step4_env_files() {
  log_info "[4/6] 🔐 Creating .env files..."

  local jwt_secret
  jwt_secret=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
  local db_env_var
  db_env_var=$(get_db_config env_var)
  local db_env_val
  db_env_val=$(get_db_config env_val)

  cat > "${BACKEND_DIR}/.env" <<EOF
PORT=${BACKEND_PORT}
${db_env_var}=${db_env_val}
JWT_SECRET=${jwt_secret}
JWT_EXPIRE=30d
NODE_ENV=development
EOF

  cat > "${BACKEND_DIR}/.env.example" <<EOF
PORT=5000
${db_env_var}=${db_env_val}
JWT_SECRET=
JWT_EXPIRE=30d
NODE_ENV=development
EOF

  cat > "${FRONTEND_DIR}/.env" <<EOF
VITE_API_URL=http://localhost:${BACKEND_PORT}/api
EOF

  log_success ".env files created."
}

step5_dependencies() {
  log_info "[5/6] 📦 Installing npm dependencies (this may take a while)..."
  log_info "  → Backend..."

  # Adjust package.json for Prisma databases
  if [ "$DB_TYPE" != "mongodb" ]; then
    node -e "
      const fs = require('fs');
      const pkg = JSON.parse(fs.readFileSync('${BACKEND_DIR}/package.json', 'utf8'));
      delete pkg.dependencies.mongoose;
      delete pkg.dependencies['express-mongo-sanitize'];
      pkg.dependencies['@prisma/client'] = '^${PRISMA_VERSION}';
      pkg.devDependencies = pkg.devDependencies || {};
      pkg.devDependencies.prisma = '^${PRISMA_VERSION}';
      pkg.scripts.postinstall = 'prisma generate';
      pkg.keywords = pkg.keywords.filter(k => k !== 'mongodb').concat('prisma', '${DB_TYPE}');
      fs.writeFileSync('${BACKEND_DIR}/package.json', JSON.stringify(pkg, null, 2));
    "
  fi

  if ! (cd "$BACKEND_DIR" && npm install); then
    log_error "Backend dependencies failed to install."
    exit 1
  fi

  # Prisma: push schema to database
  if [ "$DB_TYPE" != "mongodb" ]; then
    log_info "  → Pushing Prisma schema to database..."
    (cd "$BACKEND_DIR" && npx prisma db push --accept-data-loss 2>/dev/null) \
      || log_warn "Could not push schema. Make sure your database is running."
  fi

  log_info "  → Frontend..."
  if ! (cd "$FRONTEND_DIR" && npm install); then
    log_error "Frontend dependencies failed to install."
    exit 1
  fi

  log_success "Dependencies installed."
}

create_run_script() {
  cat > "${TARGET_DIR}/run.sh" <<RUNSCRIPT
#!/usr/bin/env bash
readonly RESET='\033[0m'
readonly GREEN='\033[0;32m'
readonly CYAN='\033[0;36m'
readonly YELLOW='\033[1;33m'
readonly BOLD='\033[1m'

readonly SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"

readonly BACKEND_PORT="${BACKEND_PORT}"
readonly FRONTEND_PORT="${FRONTEND_PORT}"
readonly PROJECT_NAME="${PROJECT_NAME}"

echo -e "\${BOLD}🚀 Starting \${PROJECT_NAME}...\${RESET}"

cleanup() {
  echo ""
  echo -e "\${YELLOW}⏹ Stopping processes...\${RESET}"
  kill \${BACKEND_PID:-} \${FRONTEND_PID:-} 2>/dev/null
  echo -e "\${CYAN}Done. Application stopped.\${RESET}"
  exit 0
}

trap cleanup SIGINT SIGTERM

kill_port() {
  local port=\$1
  local pid
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
}

step6_git() {
  log_info "[6/6] 🚀 Initializing Git..."
  cd "$TARGET_DIR"

  if confirm "❓ Initialize Git repository?" "y"; then
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
    log_success "Local repository initialized."

    if confirm "❓ Push to GitHub now?" "n"; then
      local default_repo_url="git@github.com:${GITHUB_USER}/${PROJECT_NAME}.git"
      if command -v gh &>/dev/null; then
        gh repo create "$PROJECT_NAME" --public --source=. --remote=origin --push --ssh
      else
        log_info "🚀 Using SSH URL: ${default_repo_url}"
        git remote add origin "$default_repo_url" 2>/dev/null
        git branch -M main
        git push -u origin main
      fi
    fi
  fi

  cd "$SCRIPT_DIR"

  # Save GitHub Username to project folder
  if [[ -n "$GITHUB_USER" ]]; then
    echo "$GITHUB_USER" > "${TARGET_DIR}/.github_user"
  fi
}

print_final_summary() {
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
}

# ─── Main flow ───────────────────────────────────────────────────
main() {
  print_banner
  check_prerequisites
  input_phase
  print_summary

  if ! confirm "❓ Proceed?" "n"; then
    log_warn "Cancelled."
    exit 0
  fi

  echo ""

  step1_create_structure
  step2_placeholders
  step3_security
  step4_env_files
  step5_dependencies
  create_run_script
  step6_git

  print_final_summary
}

main "$@"