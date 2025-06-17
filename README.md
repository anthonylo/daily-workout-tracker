--- README.md ---
# Daily Workout Tracker

A mobile app that generates 5 random simple workouts daily with progress tracking.

## Features
- Daily workout generation (5 random exercises)
- Progress tracking and completion status
- Workout history
- Simple, intuitive interface

## Tech Stack
- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express
- **Database**: JSON file storage (easily upgradeable to MongoDB)
- **Deployment**: AWS EC2 with Docker

## Quick Start

### Mobile App
```bash
cd mobile
npm install
npm start
```

### Backend API
```bash
cd backend
npm install
npm start
```

### Deployment
See deployment instructions in `/deployment/README.md`

## API Endpoints
- `GET /api/workouts/daily` - Get today's workouts
- `POST /api/workouts/complete` - Mark workout as complete
- `GET /api/workouts/history` - Get workout history
