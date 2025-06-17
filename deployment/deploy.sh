#!/bin/bash

# Workout Tracker Deployment Script for AWS EC2

echo "🏋️ Deploying Workout Tracker to AWS EC2..."

# Configuration
APP_NAME="workout-tracker"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

# Install Docker (Ubuntu/Amazon Linux)
install_docker() {
    log_info "Installing Docker..."
    
    # Check if running on Amazon Linux
    if grep -q "Amazon Linux" /etc/os-release 2>/dev/null; then
        sudo yum update -y
        sudo yum install -y docker
        sudo service docker start
        sudo usermod -a -G docker ec2-user
        
        # Install Docker Compose
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
        
    # Ubuntu/Debian
    elif grep -q "Ubuntu\|Debian" /etc/os-release 2>/dev/null; then
        sudo apt-get update
        sudo apt-get install -y docker.io docker-compose
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -a -G docker $USER
    else
        log_error "Unsupported OS. Please install Docker manually."
        exit 1
    fi
    
    log_info "Docker installed successfully. Please log out and back in to use Docker without sudo."
}

# Deploy application
deploy_app() {
    log_info "Stopping existing containers..."
    docker-compose -f $DOCKER_COMPOSE_FILE down 2>/dev/null || true
    
    log_info "Building and starting containers..."
    docker-compose -f $DOCKER_COMPOSE_FILE up -d --build
    
    if [ $? -eq 0 ]; then
        log_info "Application deployed successfully!"
        log_info "API will be available at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3001"
        log_info "Health check: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3001/health"
    else
        log_error "Deployment failed!"
        exit 1
    fi
}

# Show logs
show_logs() {
    log_info "Showing application logs..."
    docker-compose -f $DOCKER_COMPOSE_FILE logs -f
}

# Main deployment flow
main() {
    log_info "Starting deployment process..."
    
    # Check if Docker is available
    if ! check_docker; then
        log_warn "Docker not found. Installing..."
        install_docker
        log_info "Please log out and back in, then run this script again."
        exit 0
    fi
    
    # Deploy the application
    deploy_app
    
    # Show status
    log_info "Container status:"
    docker-compose -f $DOCKER_COMPOSE_FILE ps
    
    log_info "Deployment complete! 🎉"
    log_info "To view logs: docker-compose logs -f"
    log_info "To stop: docker-compose down"
}

# Script execution
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "logs")
        show_logs
        ;;
    "stop")
        log_info "Stopping application..."
        docker-compose -f $DOCKER_COMPOSE_FILE down
        ;;
    "restart")
        log_info "Restarting application..."
        docker-compose -f $DOCKER_COMPOSE_FILE restart
        ;;
    *)
        echo "Usage: $0 [deploy|logs|stop|restart]"
        exit 1
        ;;
esac