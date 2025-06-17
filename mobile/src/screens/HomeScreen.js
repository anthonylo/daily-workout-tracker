import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import WorkoutCard from '../components/WorkoutCard';
import ProgressTracker from '../components/ProgressTracker';
import { getDailyWorkouts, completeWorkout } from '../services/api';

export default function HomeScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDailyWorkouts();
  }, []);

  const loadDailyWorkouts = async () => {
    try {
      const data = await getDailyWorkouts();
      setWorkouts(data.workouts || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load workouts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCompleteWorkout = async (workoutId) => {
    try {
      await completeWorkout(workoutId);
      setWorkouts(prev => 
        prev.map(workout => 
          workout.id === workoutId 
            ? { ...workout, completed: true }
            : workout
        )
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update workout');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDailyWorkouts();
  };

  const completedCount = workouts.filter(w => w.completed).length;

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading today's workouts...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Today's Workouts</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      <ProgressTracker 
        completed={completedCount} 
        total={workouts.length} 
      />

      <View style={styles.workoutsList}>
        {workouts.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onComplete={() => handleCompleteWorkout(workout.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  workoutsList: {
    padding: 15,
  },
});
// This file defines the HomeScreen component for the fitness app.