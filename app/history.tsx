import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Trophy, Clock, Flame } from 'lucide-react-native';

export default function HistoryScreen() {
  const router = useRouter();

  // Datos de ejemplo del historial
  const historyData = [
    {
      date: '2025-11-20',
      routine: 'Rutina Superior',
      duration: '45 min',
      exercises: 6,
      calories: 320,
    },
    {
      date: '2025-11-19',
      routine: 'Full Body',
      duration: '52 min',
      exercises: 8,
      calories: 380,
    },
    {
      date: '2025-11-18',
      routine: 'Rutina Inferior',
      duration: '38 min',
      exercises: 5,
      calories: 280,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>HISTORIAL</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Trophy size={24} color="#FFD700" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Entrenamientos</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color="#00FF88" />
            <Text style={styles.statNumber}>7.2h</Text>
            <Text style={styles.statLabel}>Tiempo Total</Text>
          </View>
          <View style={styles.statCard}>
            <Flame size={24} color="#FF6B6B" />
            <Text style={styles.statNumber}>2,340</Text>
            <Text style={styles.statLabel}>Calorías</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Entrenamientos Recientes</Text>

        {historyData.map((item, index) => (
          <View key={index} style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text style={styles.routineText}>{item.routine}</Text>
            </View>

            <View style={styles.historyStats}>
              <View style={styles.statItem}>
                <Clock size={16} color="#888888" />
                <Text style={styles.statItemText}>{item.duration}</Text>
              </View>
              <View style={styles.statItem}>
                <Trophy size={16} color="#888888" />
                <Text style={styles.statItemText}>
                  {item.exercises} ejercicios
                </Text>
              </View>
              <View style={styles.statItem}>
                <Flame size={16} color="#888888" />
                <Text style={styles.statItemText}>{item.calories} cal</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 20,
    fontWeight: '600',
  },
  historyCard: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#888888',
  },
  routineText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 4,
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItemText: {
    fontSize: 14,
    color: '#CCCCCC',
    marginLeft: 6,
  },
});
