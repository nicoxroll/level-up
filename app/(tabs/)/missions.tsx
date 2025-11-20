import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Trophy, Target, Flame, Star, CheckCircle } from 'lucide-react-native';

export default function MissionsScreen() {
  const missions = [
    {
      id: 1,
      title: 'Primera Semana',
      description: 'Completa 7 entrenamientos en una semana',
      progress: 5,
      total: 7,
      completed: false,
      icon: Flame,
      color: '#FF6B6B',
      reward: 'Insignia "Fuego"',
    },
    {
      id: 2,
      title: 'Fuerza Máxima',
      description: 'Levanta 1000kg en total',
      progress: 756,
      total: 1000,
      completed: false,
      icon: Target,
      color: '#4ECDC4',
      reward: 'Insignia "Fuerza"',
    },
    {
      id: 3,
      title: 'Consistencia',
      description: 'Entrena 30 días seguidos',
      progress: 12,
      total: 30,
      completed: false,
      icon: Star,
      color: '#FFD700',
      reward: 'Insignia "Leyenda"',
    },
    {
      id: 4,
      title: 'Maestro del Peso',
      description: 'Completa 50 series perfectas',
      progress: 50,
      total: 50,
      completed: true,
      icon: Trophy,
      color: '#00FF88',
      reward: 'Insignia "Maestro"',
    },
  ];

  const getProgressPercentage = (progress: number, total: number) => {
    return Math.min((progress / total) * 100, 100);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MISIONES</Text>
      <Text style={styles.subtitle}>
        ¡Completa desafíos y gana recompensas!
      </Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {missions.map((mission) => (
          <View key={mission.id} style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: mission.color + '20' },
                ]}
              >
                <mission.icon size={24} color={mission.color} />
              </View>
              <View style={styles.missionInfo}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionDescription}>
                  {mission.description}
                </Text>
              </View>
              {mission.completed && <CheckCircle size={24} color="#00FF88" />}
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressPercentage(
                        mission.progress,
                        mission.total
                      )}%`,
                      backgroundColor: mission.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {mission.progress}/{mission.total}
              </Text>
            </View>

            <Text style={styles.rewardText}>Recompensa: {mission.reward}</Text>
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
  missionCard: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  missionInfo: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  missionDescription: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'right',
  },
  rewardText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: '600',
  },
});
