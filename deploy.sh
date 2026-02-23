#!/bin/bash

# ==============================================
# TIGER VAI - DEPLOYMENT SCRIPT
# ==============================================
# This script deploys the application to VPS

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}TIGER VAI - DEPLOYMENT SCRIPT${NC}"
echo -e "${GREEN}============================================${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo -e "${YELLOW}Please copy .env.example to .env and configure it:${NC}"
    echo "cp .env.example .env"
    echo "nano .env"
    exit 1
fi

# Load environment variables
echo -e "${YELLOW}Loading environment variables...${NC}"
export $(cat .env | grep -v '^#' | xargs)

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker compose down 2>/dev/null || true

# Build images
echo -e "${GREEN}Building Docker images...${NC}"
docker compose build --no-cache

# Start containers
echo -e "${GREEN}Starting containers...${NC}"
docker compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Check status
echo -e "${GREEN}Container status:${NC}"
docker compose ps

# Show logs
echo -e "${YELLOW}============================================${NC}"
echo -e "${GREEN}Deployment completed!${NC}"
echo -e "${YELLOW}============================================${NC}"
echo ""
echo -e "Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "Backend API: ${GREEN}http://localhost:4000${NC}"
echo -e "MinIO Console: ${GREEN}http://localhost:9001${NC}"
echo -e "Meilisearch: ${GREEN}http://localhost:7700${NC}"
echo ""
echo -e "To view logs, run: ${YELLOW}docker compose logs -f${NC}"
echo -e "To stop, run: ${YELLOW}docker compose down${NC}"
echo ""
