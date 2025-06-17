import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getDailyWorkouts = async () => {
  try {
    const response = await api.get('/workouts/daily');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const completeWorkout = async (workoutId) => {
  try {
    const response = await api.post('/workouts/complete', { workoutId });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const getWorkoutHistory = async () => {
  try {
    const response = await api.get('/workouts/history');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
export const getProgress = async () => {
  try {
    const response = await api.get('/progress');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.post('/user/profile/update', profileData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
export const getLeaderboard = async () => {
  try {
    const response = await api.get('/leaderboard');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
export const submitFeedback = async (feedback) => {
  try {
    const response = await api.post('/feedback', { feedback });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};