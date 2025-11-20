import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Dumbbell, Play, Timer } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function WorkoutTabScreen() {
  const router = useRouter();

  const startWorkout = () => {
    router.push('/workout');
  };

  const currentWorkout = {
    name: 'Rutina Superior',
    exercises: 6,
    duration: '45 min',
    nextExercise: 'Press de Banca',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ENTRENAMIENTO</Text>

      <View style={styles.currentWorkoutCard}>
        <View style={styles.workoutHeader}>
          <Dumbbell size={32} color="#FFFFFF" />
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutName}>{currentWorkout.name}</Text>
            <Text style={styles.workoutDetails}>
              {currentWorkout.exercises} ejercicios • {currentWorkout.duration}
            </Text>
          </View>
        </View>

        <Text style={styles.nextExercise}>
          Próximo: {currentWorkout.nextExercise}
        </Text>

        <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
          <Play size={20} color="#000000" />
          <Text style={styles.startButtonText}>Comenzar Entrenamiento</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Timer size={24} color="#00FF88" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Series Hoy</Text>
        </View>
        <View style={styles.statCard}>
          <Dumbbell size={24} color="#FFD700" />
          <Text style={styles.statNumber}>85%</Text>
          <Text style={styles.statLabel}>Completado</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  currentWorkoutCard: {
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: '#00FF88',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  workoutInfo: {
    marginLeft: 16,
    flex: 1,
  },
  workoutName: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  workoutDetails: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  nextExercise: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00FF88',
    padding: 16,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
    marginLeft: 8,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
});
