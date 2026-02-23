# Tiger Vai - Deployment Guide

## Quick Summary

This guide shows you how to deploy Tiger Vai to your VPS using Docker.

---

## Prerequisites

- VPS with Ubuntu 20.04+ or similar Linux distribution
- SSH access to your VPS
- Domain name pointed to your VPS IP (optional but recommended)
- At least 2GB RAM, 20GB storage

---

## Deployment Steps

### 1. SSH into your VPS

```bash
ssh user@your-vps-ip
```

### 2. Install Docker & Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 3. Clone Your Repository

```bash
# Navigate to your desired location
cd /var/www

# Clone your repo (replace with your repo URL)
git clone https://github.com/YOUR_USERNAME/tiger-vai-multi-vendor-main.git
cd tiger-vai-multi-vendor-main
```

### 4. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit the env file with your values
nano .env
```

**Important variables to set:**
- `ACCESS_TOKEN` - Generate a random string
- `REFRESH_TOKEN` - Generate a random string
- `MINIO_SECRET_KEY` - Set a secure password
- `MELISEACH_TOKEN` - Set a secure password
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID

### 5. Build and Start Containers

```bash
# Build all containers
docker compose build

# Start all services
docker compose up -d

# Check status
docker compose ps
```

### 6. Check Logs

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend
```

### 7. Setup Nginx Reverse Proxy (Optional but Recommended)

If you have a domain, setup Nginx:

```bash
# Install Nginx
sudo apt install nginx -y

# Create frontend config
sudo nano /etc/nginx/sites-available/tigerbhai.online
```

Add this configuration:

```nginx
# Frontend (HTTP redirect to HTTPS)
server {
    listen 80;
    server_name tigerbhai.online www.tigerbhai.online;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Backend API
server {
    listen 80;
    server_name api.tigerbhai.online;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/tigerbhai.online /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Setup SSL with Certbot (Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d tigerbhai.online -d www.tigerbhai.online

# Auto-renewal is setup automatically
```

---

## Common Commands

### Update the Application

```bash
cd /var/www/tiger-vai-multi-vendor-main

# Pull latest code
git pull origin main

# Rebuild and restart
docker compose down
docker compose build
docker compose up -d
```

### View Logs

```bash
# All logs
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend

# Last 100 lines
docker compose logs --tail=100
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart backend
docker compose restart frontend
```

### Stop Services

```bash
docker compose down
```

### Backup Database

```bash
# Backup MongoDB
docker exec tiger-vai-mongodb mongodump --archive=/data/db/backup-$(date +%Y%m%d).archive

# Copy from container
docker cp tiger-vai-mongodb:/data/db/backup-$(date +%Y%m%d).archive ./backups/
```

---

## Troubleshooting

### Containers not starting

```bash
# Check logs
docker compose logs

# Check disk space
df -h

# Check memory
free -h
```

### Port already in use

```bash
# Find what's using the port
sudo lsof -i :3000
sudo lsof -i :4000

# Kill the process
sudo kill -9 <PID>
```

### Frontend can't connect to backend

Make sure your frontend `.env` has:
```
BASE_URL=http://backend:80  # Not localhost!
```

### MinIO setup

After first deployment:

1. Visit `http://your-vps-ip:9001`
2. Login with `MINIO_ACCESS_KEY` and `MINIO_SECRET_KEY`
3. Create a bucket named `my-tiger-vai-bucket`
4. Set bucket policy to public read

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Setup SSL certificates
- [ ] Configure firewall (ufw)
- [ ] Disable root login
- [ ] Setup fail2ban
- [ ] Regular backups
- [ ] Monitor logs

---

## Auto-Deployment Setup (Optional)

To automatically deploy when you push to GitHub:

### 1. Create SSH Key on GitHub Actions

Go to: GitHub Repo → Settings → Secrets and variables → Actions

Add these secrets:
- `VPS_HOST` - Your VPS IP
- `VPS_USER` - Your VPS username
- `VPS_SSH_KEY` - Your private SSH key

### 2. Update GitHub Actions Workflow

The `.github/workflows/build.yml` needs to add deployment steps. Let me know if you want this setup.

---

## Support

If you need help:
1. Check logs: `docker compose logs -f`
2. Check container status: `docker compose ps`
3. Restart services: `docker compose restart`
