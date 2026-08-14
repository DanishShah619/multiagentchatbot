#!/bin/bash
# =============================================================================
# CortexAI — EC2 One-Shot Deployment Script
# Run this ONCE on a fresh Ubuntu 22.04 / 24.04 EC2 instance.
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh
# =============================================================================

set -euo pipefail   # Exit immediately on any error

REPO_URL="https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git"
APP_DIR="/var/www/cortexai"
COMPOSE_FILE="$APP_DIR/docker-compose.yml"

echo "============================================"
echo "   CortexAI Production Deployment Script   "
echo "============================================"

# ─────────────────────────────────────────────────────────────────────────────
# Step 1: System Update
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "[1/6] Updating system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y

# ─────────────────────────────────────────────────────────────────────────────
# Step 2: Install Docker & Docker Compose
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "[2/6] Installing Docker..."

if ! command -v docker &> /dev/null; then
    sudo apt-get install -y \
        ca-certificates \
        curl \
        gnupg \
        lsb-release

    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Allow current user to run docker without sudo
    sudo usermod -aG docker "$USER"
    newgrp docker <<DOCKER_GROUP
        echo "Docker group applied."
DOCKER_GROUP

    echo "✅ Docker installed successfully."
else
    echo "✅ Docker already installed. Skipping."
fi

docker --version
docker compose version

# ─────────────────────────────────────────────────────────────────────────────
# Step 3: Configure Swap Memory (prevents OOM on t3.small)
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "[3/6] Configuring 2GB swap memory..."

if [ ! -f /swapfile ]; then
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ 2GB swap configured."
else
    echo "✅ Swap already exists. Skipping."
fi

free -h

# ─────────────────────────────────────────────────────────────────────────────
# Step 4: Clone or Pull Repository
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "[4/6] Cloning or updating repository..."

sudo mkdir -p /var/www
sudo chown -R "$USER":"$USER" /var/www

if [ -d "$APP_DIR/.git" ]; then
    echo "Repository already exists. Pulling latest changes..."
    cd "$APP_DIR" && git pull --rebase
else
    git clone "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"
echo "✅ Repository ready at $APP_DIR"

# ─────────────────────────────────────────────────────────────────────────────
# Step 5: Check .env files exist
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "[5/6] Checking .env configuration files..."

ENV_FILES=(
    "backend/gateway/.env"
    "backend/services/auth/.env"
    "backend/services/auth/config/serviceAccountKey.json"
    "backend/services/chat/.env"
    "backend/services/agent/.env"
    "backend/services/billing/.env"
)

ALL_PRESENT=true
for FILE in "${ENV_FILES[@]}"; do
    if [ ! -f "$APP_DIR/$FILE" ]; then
        echo "❌  MISSING: $FILE"
        ALL_PRESENT=false
    else
        echo "✅  Found: $FILE"
    fi
done

if [ "$ALL_PRESENT" = false ]; then
    echo ""
    echo "⚠️  One or more .env files are missing!"
    echo "   Please create the missing files (see README for required variables)"
    echo "   then re-run this script."
    exit 1
fi

# ─────────────────────────────────────────────────────────────────────────────
# Step 6: Build & Start All Containers
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo "[6/6] Building and starting all Docker containers..."

cd "$APP_DIR"

# Stop any running containers first (for re-deployments)
docker compose down --remove-orphans 2>/dev/null || true

# Build fresh images and start all services in detached mode
docker compose up -d --build

echo ""
echo "============================================"
echo "   🚀 CortexAI is now LIVE!"
echo "============================================"
echo ""
echo "Useful monitoring commands:"
echo "  docker compose ps           — Check container status"
echo "  docker compose logs -f      — Stream all logs"
echo "  docker compose logs -f agent — Stream agent logs only"
echo "  docker compose restart gateway — Restart a specific service"
echo "  docker compose down         — Stop all containers"
echo ""
