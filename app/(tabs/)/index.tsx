import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Trophy, Calendar, Dumbbell, TrendingUp } from 'lucide-react-native';

export default function HomeScreen() {
  const stats = [
    { icon: Trophy, label: 'Entrenamientos', value: '12', color: '#FFD700' },
    { icon: Calendar, label: 'Esta Semana', value: '5/7', color: '#00FF88' },
    { icon: Dumbbell, label: 'Series Totales', value: '156', color: '#FF6B6B' },
    { icon: TrendingUp, label: 'Progreso', value: '+15%', color: '#4ECDC4' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LEVELUP</Text>
      <Text style={styles.subtitle}>¡Bienvenido de vuelta!</Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Tu Progreso</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <stat.icon size={24} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Próximo Entrenamiento</Text>
        <View style={styles.nextWorkoutCard}>
          <Text style={styles.workoutTitle}>Rutina Superior</Text>
          <Text style={styles.workoutDetails}>6 ejercicios • 45 minutos</Text>
          <Text style={styles.workoutTime}>Hoy a las 18:00</Text>
        </View>

        <Text style={styles.sectionTitle}>Logros Recientes</Text>
        <View style={styles.achievementCard}>
          <Trophy size={32} color="#FFD700" />
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>¡Primera Semana!</Text>
            <Text style={styles.achievementDesc}>
              Completaste 7 entrenamientos seguidos
            </Text>
          </View>
        </View>
      </ScrollView>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 30,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    width: '48%',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
    textAlign: 'center',
  },
  nextWorkoutCard: {
    backgroundColor: '#111111',
    borderWidth: 2,
    borderColor: '#00FF88',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  workoutTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  workoutDetails: {
    fontSize: 14,
    color: '#888888',
    marginTop: 4,
  },
  workoutTime: {
    fontSize: 16,
    color: '#00FF88',
    marginTop: 8,
    fontWeight: '600',
  },
  achievementCard: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementInfo: {
    marginLeft: 16,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
  },
});
