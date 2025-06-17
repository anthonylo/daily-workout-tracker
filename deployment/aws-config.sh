#!/bin/bash

# AWS Infrastructure Setup for EC2 Cluster Deployment

# 1. Create VPC and Security Groups (using AWS CLI)
echo "Creating VPC and Security Groups..."

# Create VPC
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)
aws ec2 create-tags --resources $VPC_ID --tags Key=Name,Value=workout-app-vpc

# Create Internet Gateway
IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID

# Create Subnets (2 public subnets in different AZs)
SUBNET1_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone us-east-1a --query 'Subnet.SubnetId' --output text)
SUBNET2_ID=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone us-east-1b --query 'Subnet.SubnetId' --output text)

# Create Route Table
RT_ID=$(aws ec2 create-route-table --vpc-id $VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID

# Associate subnets with route table
aws ec2 associate-route-table --subnet-id $SUBNET1_ID --route-table-id $RT_ID
aws ec2 associate-route-table --subnet-id $SUBNET2_ID --route-table-id $RT_ID

# Create Security Group for EC2 instances
SG_ID=$(aws ec2 create-security-group --group-name workout-app-sg --description "Security group for workout app" --vpc-id $VPC_ID --query 'GroupId' --output text)

# Allow HTTP, HTTPS, and SSH
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0

echo "VPC ID: $VPC_ID"
echo "Security Group ID: $SG_ID"
echo "Subnet 1 ID: $SUBNET1_ID"
echo "Subnet 2 ID: $SUBNET2_ID"

# 2. User Data Script for EC2 instances
cat > user-data.sh << 'EOF'
#!/bin/bash
yum update -y
yum install -y docker git

# Start Docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone your app (replace with your actual repository)
cd /home/ec2-user
git clone https://github.com/yourusername/workout-tracker.git
cd workout-tracker

# Build and run the application
docker-compose up -d --build

# Install CloudWatch agent for monitoring
yum install -y amazon-cloudwatch-agent
EOF

# 3. Create Launch Template
aws ec2 create-launch-template \
    --launch-template-name workout-app-template \
    --launch-template-data '{
        "ImageId": "ami-0abcdef1234567890",
        "InstanceType": "t3.micro",
        "SecurityGroupIds": ["'$SG_ID'"],
        "UserData": "'$(base64 -w 0 user-data.sh)'",
        "IamInstanceProfile": {"Name": "EC2-CloudWatch-Role"},
        "TagSpecifications": [{
            "ResourceType": "instance",
            "Tags": [{"Key": "Name", "Value": "workout-app-instance"}]
        }]
    }'

# 4. Create Application Load Balancer
ALB_ARN=$(aws elbv2 create-load-balancer \
    --name workout-app-alb \
    --subnets $SUBNET1_ID $SUBNET2_ID \
    --security-groups $SG_ID \
    --query 'LoadBalancers[0].LoadBalancerArn' --output text)

# Create Target Group
TG_ARN=$(aws elbv2 create-target-group \
    --name workout-app-targets \
    --protocol HTTP \
    --port 80 \
    --vpc-id $VPC_ID \
    --health-check-path / \
    --health-check-interval-seconds 30 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3 \
    --query 'TargetGroups[0].TargetGroupArn' --output text)

# Create Listener
aws elbv2 create-listener \
    --load-balancer-arn $ALB_ARN \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=forward,TargetGroupArn=$TG_ARN

# 5. Create Auto Scaling Group
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name workout-app-asg \
    --launch-template LaunchTemplateName=workout-app-template,Version='$Latest' \
    --min-size 2 \
    --max-size 6 \
    --desired-capacity 2 \
    --target-group-arns $TG_ARN \
    --vpc-zone-identifier "$SUBNET1_ID,$SUBNET2_ID" \
    --health-check-type ELB \
    --health-check-grace-period 300

echo "Infrastructure created successfully!"
echo "Load Balancer ARN: $ALB_ARN"
echo "Target Group ARN: $TG_ARN"