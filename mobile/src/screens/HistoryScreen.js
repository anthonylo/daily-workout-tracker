import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { getWorkoutHistory } from '../services/api';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await getWorkoutHistory();
      setHistory(data.history || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text style={styles.historyDate}>{item.date}</Text>
      <Text style={styles.historyStats}>
        {item.completed}/{item.total} workouts completed
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout History</Text>
      </View>
      
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.date}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.list}
      />
    </View>
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
  },
  list: {
    padding: 15,
  },
  historyItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  historyStats: {
    fontSize: 14,
    color: '#666',
  },
});
// This file defines the HistoryScreen component for displaying workout history.
// It fetches the history from an API and displays it in a list format.