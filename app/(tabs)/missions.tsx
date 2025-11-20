import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Trophy, Target, Flame, Star, CheckCircle, Gift } from 'lucide-react-native';
import { useState } from 'react';

export default function MissionsScreen() {
  const [playerXP, setPlayerXP] = useState(245); // Estado global debería venir de un contexto

  const [missions, setMissions] = useState([
    {
      id: 1,
      title: 'Primera Semana',
      description: 'Completa 7 entrenamientos en una semana',
      progress: 5,
      total: 7,
      completed: false,
      claimed: false,
      icon: Flame,
      reward: 'Insignia "Fuego"',
      xpReward: 100,
    },
    {
      id: 2,
      title: 'Fuerza Máxima',
      description: 'Levanta 1000kg en total',
      progress: 756,
      total: 1000,
      completed: false,
      claimed: false,
      icon: Target,
      reward: 'Insignia "Fuerza"',
      xpReward: 150,
    },
    {
      id: 3,
      title: 'Consistencia',
      description: 'Entrena 30 días seguidos',
      progress: 12,
      total: 30,
      completed: false,
      claimed: false,
      icon: Star,
      reward: 'Insignia "Leyenda"',
      xpReward: 200,
    },
    {
      id: 4,
      title: 'Maestro del Peso',
      description: 'Completa 50 series perfectas',
      progress: 50,
      total: 50,
      completed: true,
      claimed: true,
      icon: Trophy,
      reward: 'Insignia "Maestro"',
      xpReward: 75,
    },
  ]);

  const claimReward = (missionId: number) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) return;

    // Agregar XP al jugador
    setPlayerXP(prev => prev + mission.xpReward);

    // Marcar como reclamada
    setMissions(prev => prev.map(m =>
      m.id === missionId ? { ...m, claimed: true } : m
    ));

    Alert.alert(
      '¡Recompensa Reclamada!',
      `Has ganado ${mission.xpReward} XP por completar "${mission.title}"`,
      [{ text: '¡Genial!' }]
    );
  };

  const getProgressPercentage = (progress: number, total: number) => {
    return Math.min((progress / total) * 100, 100);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MISIONES</Text>
      <Text style={styles.subtitle}>Completa desafíos y gana recompensas</Text>

      {/* XP Total */}
      <View style={styles.xpCard}>
        <Star size={20} color="#FFFFFF" />
        <Text style={styles.xpText}>{playerXP} XP Total</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {missions.map((mission) => (
          <View key={mission.id} style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <View style={styles.iconContainer}>
                <mission.icon size={24} color="#FFFFFF" />
              </View>
              <View style={styles.missionInfo}>
                <Text style={styles.missionTitle}>{mission.title}</Text>
                <Text style={styles.missionDescription}>{mission.description}</Text>
              </View>
              {mission.completed && mission.claimed && <CheckCircle size={24} color="#FFFFFF" />}
              {mission.completed && !mission.claimed && <Gift size={24} color="#FFFFFF" />}
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${getProgressPercentage(mission.progress, mission.total)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {mission.progress}/{mission.total}
              </Text>
            </View>

            <View style={styles.rewardContainer}>
              <Text style={styles.rewardText}>Recompensa: {mission.reward}</Text>
              <Text style={styles.xpRewardText}>+{mission.xpReward} XP</Text>
            </View>

            {mission.completed && !mission.claimed && (
              <TouchableOpacity
                style={styles.claimButton}
                onPress={() => claimReward(mission.id)}
              >
                <Text style={styles.claimButtonText}>Reclamar Recompensa</Text>
              </TouchableOpacity>
            )}
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
  missionCard: {
    backgroundColor: '#111111',
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
    fontWeight: '300',
    marginBottom: 4,
    letterSpacing: 1,
  },
  missionDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333333',
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'right',
  },
  rewardText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  xpCard: {
    backgroundColor: '#111111',
    padding: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  xpText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 1,
  },
  rewardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  xpRewardText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  claimButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
