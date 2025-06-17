# 1. Launch EC2 instance with Amazon Linux 2
# 2. SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# 3. Install Docker
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo usermod -a -G docker ec2-user

# 4. Create and deploy app
mkdir workout-app && cd workout-app
# Copy your files here (package.json, Dockerfile, etc.)
docker build -t workout-app .
docker run -d -p 80:80 workout-app