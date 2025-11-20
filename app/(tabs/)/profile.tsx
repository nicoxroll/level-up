import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import {
  User,
  Settings,
  LogOut,
  Trophy,
  Calendar,
  Dumbbell,
  TrendingUp,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

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
    { icon: Trophy, label: 'Logros', value: '12', color: '#FFD700' },
    { icon: Calendar, label: 'Días Activos', value: '45', color: '#00FF88' },
    { icon: Dumbbell, label: 'Rutinas', value: '8', color: '#FF6B6B' },
    { icon: TrendingUp, label: 'Mejor Mes', value: 'Marzo', color: '#4ECDC4' },
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
      </View>

      <Text style={styles.sectionTitle}>Estadísticas</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <stat.icon size={20} color={stat.color} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Cuenta</Text>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Settings size={20} color="#CCCCCC" />
          <Text style={styles.menuItemText}>Configuración</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Trophy size={20} color="#FFD700" />
          <Text style={styles.menuItemText}>Mis Logros</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <LogOut size={20} color="#FF4444" />
          <Text style={[styles.menuItemText, styles.logoutText]}>
            Cerrar Sesión
          </Text>
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#333333',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  userEmail: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
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
    marginBottom: 40,
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
    fontSize: 20,
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
  menuContainer: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  menuItemText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutText: {
    color: '#FF4444',
  },
});
