import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressTracker({ completed, total }) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Progress</Text>
        <Text style={styles.stats}>{completed}/{total}</Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${percentage}%` }
          ]} 
        />
      </View>
      
      <Text style={styles.percentage}>{Math.round(percentage)}% Complete</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stats: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  percentage: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
});
