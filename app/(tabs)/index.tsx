import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Trophy, Calendar, Dumbbell, TrendingUp, Star, Zap, Target, Award, Users } from 'lucide-react-native';
import { Svg, Polygon } from 'react-native-svg';
import { useState } from 'react';

export default function HomeScreen() {
  // Estado del jugador
  const [playerStats, setPlayerStats] = useState({
    level: 3,
    experience: 245,
    experienceToNext: 300,
    availablePoints: 2, // Puntos para distribuir
    stats: {
      fuerza: 15,
      velocidad: 12,
      resistencia: 18,
      constancia: 14,
      tecnica: 16,
    }
  });

  const stats = [
    { icon: Trophy, label: 'Entrenamientos', value: '12' },
    { icon: Calendar, label: 'Esta Semana', value: '5/7' },
    { icon: Dumbbell, label: 'Series Totales', value: '156' },
    { icon: TrendingUp, label: 'Progreso', value: '+15%' },
  ];

  const statLabels = ['Fuerza', 'Velocidad', 'Resistencia', 'Constancia', 'Técnica'];
  const statKeys = ['fuerza', 'velocidad', 'resistencia', 'constancia', 'tecnica'];

  // Calcular posiciones para el gráfico de radar
  const getRadarPoints = () => {
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    const angleStep = (2 * Math.PI) / 5;

    return statKeys.map((key, index) => {
      const value = playerStats.stats[key as keyof typeof playerStats.stats];
      const maxValue = 20; // Valor máximo posible
      const normalizedValue = value / maxValue;
      const angle = index * angleStep - Math.PI / 2; // Empezar desde arriba

      return {
        x: centerX + Math.cos(angle) * radius * normalizedValue,
        y: centerY + Math.sin(angle) * radius * normalizedValue,
      };
    });
  };

  const radarPoints = getRadarPoints();

  const distributePoint = (statKey: string) => {
    if (playerStats.availablePoints > 0) {
      setPlayerStats(prev => ({
        ...prev,
        availablePoints: prev.availablePoints - 1,
        stats: {
          ...prev.stats,
          [statKey]: prev.stats[statKey as keyof typeof prev.stats] + 1,
        }
      }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LEVELUP</Text>
      <Text style={styles.subtitle}>¡Bienvenido de vuelta!</Text>

      {/* Información del Nivel */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <Star size={24} color="#FFFFFF" />
          <Text style={styles.levelText}>Nivel {playerStats.level}</Text>
          <Text style={styles.expText}>{playerStats.experience}/{playerStats.experienceToNext} XP</Text>
        </View>
        <View style={styles.expBar}>
          <View
            style={[
              styles.expFill,
              { width: `${(playerStats.experience / playerStats.experienceToNext) * 100}%` }
            ]}
          />
        </View>
        {playerStats.availablePoints > 0 && (
          <Text style={styles.pointsText}>
            {playerStats.availablePoints} puntos disponibles para distribuir
          </Text>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Gráfico de Estadísticas */}
        <Text style={styles.sectionTitle}>Estadísticas</Text>
        <View style={styles.statsChartCard}>
          <View style={styles.radarContainer}>
            {/* Círculos de fondo */}
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
              <View
                key={index}
                style={[
                  styles.radarCircle,
                  { width: 160 * scale, height: 160 * scale }
                ]}
              />
            ))}

            {/* Líneas del radar */}
            {statKeys.map((_, index) => {
              const angle = (index * 72 - 90) * (Math.PI / 180);
              return (
                <View
                  key={`line-${index}`}
                  style={[
                    styles.radarLine,
                    {
                      transform: [
                        { rotate: `${index * 72}deg` }
                      ]
                    }
                  ]}
                />
              );
            })}

            {/* Área de estadísticas */}
            <Svg width="200" height="200" style={{ position: 'absolute' }}>
              <Polygon
                points={radarPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="rgba(255,255,255,0.3)"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            </Svg>

            {/* Etiquetas de estadísticas */}
            {statLabels.map((label, index) => {
              const angle = (index * 72 - 90) * (Math.PI / 180);
              const x = 100 + Math.cos(angle) * 110;
              const y = 100 + Math.sin(angle) * 110;

              return (
                <Text
                  key={`label-${index}`}
                  style={[
                    styles.statLabelText,
                    {
                      left: x - 30,
                      top: y - 10,
                    }
                  ]}
                >
                  {label}
                </Text>
              );
            })}
          </View>

          {/* Controles de distribución de puntos */}
          {playerStats.availablePoints > 0 && (
            <View style={styles.distributionControls}>
              {statKeys.map((key, index) => (
                <TouchableOpacity
                  key={key}
                  style={styles.distributeButton}
                  onPress={() => distributePoint(key)}
                >
                  <Text style={styles.distributeButtonText}>
                    + {statLabels[index]} ({playerStats.stats[key as keyof typeof playerStats.stats]})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Tu Progreso</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <stat.icon size={24} color="#FFFFFF" />
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
          <Trophy size={32} color="#FFFFFF" />
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>¡Primera Semana!</Text>
            <Text style={styles.achievementDesc}>Completaste 7 entrenamientos seguidos</Text>
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
    padding: 12,
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
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
    padding: 16,
    marginBottom: 20,
  },
  workoutTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 1,
  },
  workoutDetails: {
    fontSize: 14,
    color: '#FFFFFF',
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
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementInfo: {
    marginLeft: 16,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 1,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  levelCard: {
    backgroundColor: '#111111',
    padding: 16,
    marginBottom: 20,
    borderRadius: 0,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  levelText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 1,
  },
  expText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  expBar: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  expFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  pointsText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  statsChartCard: {
    backgroundColor: '#111111',
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  radarContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  radarCircle: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 80,
  },
  radarLine: {
    position: 'absolute',
    width: 1,
    height: 160,
    backgroundColor: '#333333',
    top: 20,
  },
  statsArea: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  statLabelText: {
    position: 'absolute',
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
    textAlign: 'center',
    width: 60,
  },
  distributionControls: {
    width: '100%',
    gap: 8,
  },
  distributeButton: {
    backgroundColor: '#333333',
    padding: 12,
    alignItems: 'center',
    marginBottom: 4,
  },
  distributeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
});
