import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function WorkoutCard({ workout, onComplete }) {
  return (
    <View style={[styles.card, workout.completed && styles.completedCard]}>
      <View style={styles.cardContent}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.workoutDetails}>
          {workout.duration} • {workout.difficulty}
        </Text>
        <Text style={styles.workoutDescription}>
          {workout.description}
        </Text>
      </View>
      
      <TouchableOpacity
        style={[styles.button, workout.completed && styles.completedButton]}
        onPress={onComplete}
        disabled={workout.completed}
      >
        <Ionicons
          name={workout.completed ? 'checkmark-circle' : 'radio-button-off'}
          size={24}
          color={workout.completed ? '#4CAF50' : '#007AFF'}
        />
        <Text style={[styles.buttonText, workout.completed && styles.completedButtonText]}>
          {workout.completed ? 'Completed' : 'Mark Complete'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#f8f9fa',
    opacity: 0.8,
  },
  cardContent: {
    marginBottom: 12,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  workoutDescription: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  completedButton: {
    backgroundColor: '#e8f5e8',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  completedButtonText: {
    color: '#4CAF50',
  },
});
// This component represents a single workout card in the workout list.
// It displays the workout name, details, description, and a button to mark it as complete.