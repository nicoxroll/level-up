import { Calendar, Dumbbell, TrendingUp, Trophy } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const stats = [
    { icon: Trophy, label: 'Entrenamientos', value: '12' },
    { icon: Calendar, label: 'Esta Semana', value: '5/7' },
    { icon: Dumbbell, label: 'Series Totales', value: '156' },
    { icon: TrendingUp, label: 'Progreso', value: '+15%' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LEVELUP</Text>
      <Text style={styles.subtitle}>¡Bienvenido de vuelta!</Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estadísticas Resumidas */}
        <Text style={styles.sectionTitle}>Esta Semana</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <stat.icon size={20} color="#FFFFFF" />
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
          <Trophy size={24} color="#FFFFFF" />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '200',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '300',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 16,
    fontWeight: '300',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#111111',
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
    marginTop: 8,
    letterSpacing: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  nextWorkoutCard: {
    backgroundColor: '#111111',
    padding: 20,
    marginBottom: 20,
  },
  workoutTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 1,
  },
  workoutDetails: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  workoutTime: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  achievementCard: {
    backgroundColor: '#111111',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementInfo: {
    marginLeft: 16,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 1,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
});
