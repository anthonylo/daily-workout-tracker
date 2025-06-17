const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const WORKOUTS_FILE = path.join(__dirname, '../data/workouts.json');
const HISTORY_FILE = path.join(__dirname, '../data/history.json');

// Load workout data
const loadWorkouts = () => {
  try {
    const data = fs.readFileSync(WORKOUTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading workouts:', error);
    return { exercises: [] };
  }
};

// Load history data
const loadHistory = () => {
  try {
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { history: [] };
  }
};

// Save history data
const saveHistory = (history) => {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

// Get daily workouts
router.get('/daily', (req, res) => {
  try {
    const workoutData = loadWorkouts();
    const exercises = workoutData.exercises;
    
    // Generate 5 random workouts
    const shuffled = exercises.sort(() => 0.5 - Math.random());
    const dailyWorkouts = shuffled.slice(0, 5).map(exercise => ({
      id: uuidv4(),
      ...exercise,
      completed: false
    }));

    res.json({
      date: new Date().toISOString().split('T')[0],
      workouts: dailyWorkouts
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate daily workouts' });
  }
});

// Mark workout as complete
router.post('/complete', (req, res) => {
  try {
    const { workoutId } = req.body;
    
    if (!workoutId) {
      return res.status(400).json({ error: 'Workout ID required' });
    }

    // Here you would typically update a database
    // For this example, we'll just return success
    res.json({ 
      message: 'Workout completed successfully',
      workoutId,
      completedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete workout' });
  }
});

// Get workout history
router.get('/history', (req, res) => {
  try {
    const history = loadHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load history' });
  }
});

module.exports = router;
// Save workout history
// This function would typically be called after a workout is completed
// to save the history entry
const saveWorkoutHistory = (workout) => {
  const history = loadHistory();
  history.history.push(workout);
  saveHistory(history);
};