import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Check,
  ChevronLeft,
  Plus,
  Star,
  Target,
  Trophy,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  xpReward: number;
  isCompleted: boolean;
  isAccepted: boolean;
  progress?: number;
  total?: number;
  deadline?: string;
  createdAt?: string;
}

export default function MissionsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  );
  const [quests, setQuests] = useState<Quest[]>([]);
  const [userXP, setUserXP] = useState(0);

  // Load user data and quests
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedXP = await AsyncStorage.getItem('userXP');
        const storedQuests = await AsyncStorage.getItem('userQuests');
        const lastResetDate = await AsyncStorage.getItem('lastQuestReset');

        if (storedXP) {
          setUserXP(parseInt(storedXP));
        }

        const now = new Date();
        const today = now.toDateString();
        const thisWeek = getWeekNumber(now);
        const thisMonth = now.getMonth();

        let questsToLoad = storedQuests ? JSON.parse(storedQuests) : null;

        // Reset logic for daily/weekly/monthly quests
        if (!lastResetDate || lastResetDate !== today) {
          if (questsToLoad) {
            // Reset daily quests
            questsToLoad = questsToLoad.map((quest: Quest) => {
              if (
                quest.type === 'daily' &&
                quest.isAccepted &&
                !quest.isCompleted
              ) {
                return { ...quest, isAccepted: false, progress: 0 };
              }
              return quest;
            });
          }

          await AsyncStorage.setItem('lastQuestReset', today);
        }

        if (!questsToLoad) {
          // Initialize with default quests
          questsToLoad = [
            // Daily Quests
            {
              id: 'daily_1',
              title: 'Primer Entrenamiento',
              description: 'Completa tu primera rutina de ejercicios',
              type: 'daily',
              xpReward: 50,
              isCompleted: false,
              isAccepted: false,
              createdAt: new Date().toISOString(),
            },
            {
              id: 'daily_2',
              title: 'Mantén el Ritmo',
              description: 'Entrena durante 30 minutos seguidos',
              type: 'daily',
              xpReward: 75,
              isCompleted: false,
              isAccepted: false,
              createdAt: new Date().toISOString(),
            },
            {
              id: 'daily_3',
              title: 'Fuerza Interior',
              description: 'Completa 3 series de un ejercicio',
              type: 'daily',
              xpReward: 100,
              isCompleted: false,
              isAccepted: false,
              createdAt: new Date().toISOString(),
            },

            // Weekly Quests
            {
              id: 'weekly_1',
              title: 'Semana Activa',
              description: 'Completa 5 entrenamientos en la semana',
              type: 'weekly',
              xpReward: 300,
              isCompleted: false,
              isAccepted: false,
              progress: 0,
              total: 5,
              createdAt: new Date().toISOString(),
            },
            {
              id: 'weekly_2',
              title: 'Maestro del Peso',
              description: 'Aumenta el peso en cualquier ejercicio',
              type: 'weekly',
              xpReward: 250,
              isCompleted: false,
              isAccepted: false,
              createdAt: new Date().toISOString(),
            },
            {
              id: 'weekly_3',
              title: 'Consistencia',
              description: 'Entrena 4 días diferentes en la semana',
              type: 'weekly',
              xpReward: 400,
              isCompleted: false,
              isAccepted: false,
              progress: 0,
              total: 4,
              createdAt: new Date().toISOString(),
            },

            // Monthly Quests
            {
              id: 'monthly_1',
              title: 'Mes de Victoria',
              description: 'Completa 20 entrenamientos en el mes',
              type: 'monthly',
              xpReward: 1000,
              isCompleted: false,
              isAccepted: false,
              progress: 0,
              total: 20,
              createdAt: new Date().toISOString(),
            },
            {
              id: 'monthly_2',
              title: 'Creador de Rutinas',
              description: 'Crea 3 rutinas personalizadas',
              type: 'monthly',
              xpReward: 500,
              isCompleted: false,
              isAccepted: false,
              progress: 0,
              total: 3,
              createdAt: new Date().toISOString(),
            },
            {
              id: 'monthly_3',
              title: 'Leyenda Fitness',
              description: 'Alcanza 5000 XP totales',
              type: 'monthly',
              xpReward: 2000,
              isCompleted: false,
              isAccepted: false,
              createdAt: new Date().toISOString(),
            },
          ];
        }

        setQuests(questsToLoad);
        await AsyncStorage.setItem('userQuests', JSON.stringify(questsToLoad));
      } catch (error) {
        console.error('Error loading quest data:', error);
      }
    };
    loadData();
  }, []);

  // Helper function to get week number
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const acceptQuest = async (questId: string) => {
    const updatedQuests = quests.map((quest) =>
      quest.id === questId ? { ...quest, isAccepted: true } : quest
    );
    setQuests(updatedQuests);
    await AsyncStorage.setItem('userQuests', JSON.stringify(updatedQuests));
    Alert.alert(
      '¡Misión Aceptada!',
      'La misión ha sido agregada a tus quests activos.'
    );
  };

  const completeQuest = async (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest) return;

    const updatedQuests = quests.map((q) =>
      q.id === questId ? { ...q, isCompleted: true } : q
    );
    const newXP = userXP + quest.xpReward;

    setQuests(updatedQuests);
    setUserXP(newXP);

    await AsyncStorage.setItem('userQuests', JSON.stringify(updatedQuests));
    await AsyncStorage.setItem('userXP', newXP.toString());

    Alert.alert(
      '¡Misión Completada!',
      `Has ganado ${quest.xpReward} XP. Total: ${newXP} XP`
    );
  };

  // Function to update quest progress
  const updateQuestProgress = async (
    questType: string,
    progressIncrement: number = 1
  ) => {
    const updatedQuests = quests.map((quest) => {
      if (quest.isAccepted && !quest.isCompleted && quest.type === questType) {
        const newProgress = (quest.progress || 0) + progressIncrement;
        const isCompleted = quest.total ? newProgress >= quest.total : false;

        if (isCompleted) {
          // Auto-complete the quest and award XP
          const newXP = userXP + quest.xpReward;
          setUserXP(newXP);
          AsyncStorage.setItem('userXP', newXP.toString());
          Alert.alert(
            '¡Misión Completada!',
            `Has ganado ${quest.xpReward} XP por "${quest.title}"`
          );
        }

        return {
          ...quest,
          progress: newProgress,
          isCompleted,
        };
      }
      return quest;
    });

    setQuests(updatedQuests);
    await AsyncStorage.setItem('userQuests', JSON.stringify(updatedQuests));
  };

  // Expose updateQuestProgress globally for other screens to use
  useEffect(() => {
    (global as any).updateQuestProgress = updateQuestProgress;
  }, [quests, userXP]);

  const filteredQuests = quests.filter((quest) => quest.type === activeTab);
  const activeQuests = quests.filter(
    (quest) => quest.isAccepted && !quest.isCompleted
  );
  const completedQuests = quests.filter((quest) => quest.isCompleted);

  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'daily':
        return <Calendar size={20} color="#FFFFFF" />;
      case 'weekly':
        return <Target size={20} color="#FFFFFF" />;
      case 'monthly':
        return <Trophy size={20} color="#FFFFFF" />;
      default:
        return <Target size={20} color="#FFFFFF" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>MISIONES</Text>
        <View style={styles.xpContainer}>
          <Star size={16} color="#FFD700" />
          <Text style={styles.xpText}>{userXP} XP</Text>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'daily' && styles.activeTab]}
          onPress={() => setActiveTab('daily')}
        >
          <Calendar
            size={16}
            color={activeTab === 'daily' ? '#000000' : '#FFFFFF'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'daily' && styles.activeTabText,
            ]}
          >
            Diarias
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
          onPress={() => setActiveTab('weekly')}
        >
          <Target
            size={16}
            color={activeTab === 'weekly' ? '#000000' : '#FFFFFF'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'weekly' && styles.activeTabText,
            ]}
          >
            Semanales
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'monthly' && styles.activeTab]}
          onPress={() => setActiveTab('monthly')}
        >
          <Trophy
            size={16}
            color={activeTab === 'monthly' ? '#000000' : '#FFFFFF'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'monthly' && styles.activeTabText,
            ]}
          >
            Mensuales
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active Quests */}
        {activeQuests.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Quests Activos</Text>
            {activeQuests.map((quest) => (
              <View key={quest.id} style={styles.questCard}>
                <View style={styles.questHeader}>
                  {getQuestIcon(quest.type)}
                  <View style={styles.questInfo}>
                    <Text style={styles.questTitle}>{quest.title}</Text>
                    <Text style={styles.questDescription}>
                      {quest.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.questFooter}>
                  <View style={styles.rewardContainer}>
                    <Star size={14} color="#FFD700" />
                    <Text style={styles.rewardText}>{quest.xpReward} XP</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => completeQuest(quest.id)}
                  >
                    <Check size={16} color="#000000" />
                    <Text style={styles.completeButtonText}>Completar</Text>
                  </TouchableOpacity>
                </View>
                {quest.progress !== undefined && quest.total && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${(quest.progress / quest.total) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {quest.progress}/{quest.total}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {/* Available Quests */}
        <Text style={styles.sectionTitle}>
          Misiones Disponibles (
          {filteredQuests.filter((q) => !q.isAccepted && !q.isCompleted).length}
          )
        </Text>
        {filteredQuests
          .filter((quest) => !quest.isAccepted && !quest.isCompleted)
          .map((quest) => (
            <View key={quest.id} style={styles.questCard}>
              <View style={styles.questHeader}>
                {getQuestIcon(quest.type)}
                <View style={styles.questInfo}>
                  <Text style={styles.questTitle}>{quest.title}</Text>
                  <Text style={styles.questDescription}>
                    {quest.description}
                  </Text>
                </View>
              </View>
              <View style={styles.questFooter}>
                <View style={styles.rewardContainer}>
                  <Star size={14} color="#FFD700" />
                  <Text style={styles.rewardText}>{quest.xpReward} XP</Text>
                </View>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => acceptQuest(quest.id)}
                >
                  <Plus size={16} color="#000000" />
                  <Text style={styles.acceptButtonText}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

        {/* Completed Quests */}
        {completedQuests.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              Completadas ({completedQuests.length})
            </Text>
            {completedQuests.map((quest) => (
              <View
                key={quest.id}
                style={[styles.questCard, styles.completedQuest]}
              >
                <View style={styles.questHeader}>
                  <Check size={20} color="#FFFFFF" />
                  <View style={styles.questInfo}>
                    <Text style={[styles.questTitle, styles.completedText]}>
                      {quest.title}
                    </Text>
                    <Text
                      style={[styles.questDescription, styles.completedText]}
                    >
                      {quest.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.rewardContainer}>
                  <Star size={14} color="#FFD700" />
                  <Text style={styles.rewardText}>{quest.xpReward} XP</Text>
                </View>
              </View>
            ))}
          </>
        )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    gap: 6,
  },
  xpText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
    paddingVertical: 10,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 20,
    fontWeight: '300',
    letterSpacing: 1,
  },
  questCard: {
    backgroundColor: '#111111',
    padding: 16,
    marginBottom: 8,
    borderRadius: 0,
  },
  completedQuest: {
    opacity: 0.7,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  questDescription: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '300',
    letterSpacing: 0.5,
    lineHeight: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rewardText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  acceptButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  completeButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
