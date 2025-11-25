import { usePlayer } from '@/contexts/PlayerContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Dumbbell,
  LogOut,
  Settings,
  TrendingUp,
  Trophy,
  User,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Polygon, Svg } from 'react-native-svg';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const { playerStats, distributePoint } = usePlayer();

  const statLabels = [
    'Fuerza',
    'Velocidad',
    'Resistencia',
    'Constancia',
    'Técnica',
  ];
  const statKeys = [
    'fuerza',
    'velocidad',
    'resistencia',
    'constancia',
    'tecnica',
  ];

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
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  const stats = [
    { icon: Trophy, label: 'Logros', value: '12' },
    { icon: Calendar, label: 'Días Activos', value: '45' },
    { icon: Dumbbell, label: 'Rutinas', value: '8' },
    { icon: TrendingUp, label: 'Mejor Mes', value: 'Marzo' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>PERFIL</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <User size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.userEmail}>
          {user?.email || 'usuario@email.com'}
        </Text>
        <Text style={styles.memberSince}>Miembro desde enero 2024</Text>

        {/* Barra de Progreso del Nivel */}
        <View style={styles.levelProgressCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelText}>Nivel {playerStats.level}</Text>
            <Text style={styles.expText}>
              {playerStats.experience}/{playerStats.experienceToNext} XP
            </Text>
          </View>
          <View style={styles.expBar}>
            <View
              style={[
                styles.expFill,
                {
                  width: `${
                    (playerStats.experience / playerStats.experienceToNext) *
                    100
                  }%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Estadísticas</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <stat.icon size={20} color="#FFFFFF" />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Gráfico de Estadísticas */}
      <View style={styles.statsChartCard}>
        <View style={styles.radarContainer}>
          {/* Círculos de fondo */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, index) => (
            <View
              key={index}
              style={[
                styles.radarCircle,
                { width: 160 * scale, height: 160 * scale },
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
                    transform: [{ rotate: `${index * 72}deg` }],
                  },
                ]}
              />
            );
          })}

          {/* Área de estadísticas */}
          <Svg width="200" height="200" style={{ position: 'absolute' }}>
            <Polygon
              points={radarPoints.map((p) => `${p.x},${p.y}`).join(' ')}
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
                  },
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
                  + {statLabels[index]} (
                  {playerStats.stats[key as keyof typeof playerStats.stats]})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
          <Text style={styles.achievementDesc}>
            Completaste 7 entrenamientos seguidos
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Cuenta</Text>
      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/(tabs)/routines')}
        >
          <Dumbbell size={20} color="#FFFFFF" />
          <Text style={styles.menuItemText}>Mis Rutinas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Settings size={20} color="#FFFFFF" />
          <Text style={styles.menuItemText}>Configuración</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Trophy size={20} color="#FFFFFF" />
          <Text style={styles.menuItemText}>Mis Logros</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <LogOut size={20} color="#FFFFFF" />
          <Text style={styles.menuItemText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: '200',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 4,
  },
  profileCard: {
    backgroundColor: '#111111',
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userEmail: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 1,
  },
  memberSince: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 0.5,
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
    marginBottom: 40,
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
  menuContainer: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    padding: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  statsChartCard: {
    backgroundColor: '#111111',
    padding: 20,
    marginBottom: 30,
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
  levelProgressCard: {
    backgroundColor: '#222222',
    padding: 16,
    marginTop: 16,
    borderRadius: 0,
    width: '100%',
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
  },
  expFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
});
