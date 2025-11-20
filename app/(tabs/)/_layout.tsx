import { Tabs } from 'expo-router';
import {
  Home,
  CheckCircle,
  Dumbbell,
  Calendar,
  User,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function TabLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/');
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.replace('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => (
            <Home size={20} color={focused ? '#FFFFFF' : '#888888'} />
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'Misiones',
          tabBarIcon: ({ focused }) => (
            <CheckCircle size={20} color={focused ? '#FFFFFF' : '#888888'} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Entrenar',
          tabBarIcon: ({ focused }) => (
            <Dumbbell size={24} color={focused ? '#FFFFFF' : '#888888'} />
          ),
          tabBarItemStyle: {
            marginTop: -10,
          },
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ focused }) => (
            <Calendar size={20} color={focused ? '#FFFFFF' : '#888888'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <User size={20} color={focused ? '#FFFFFF' : '#888888'} />
          ),
        }}
      />
    </Tabs>
  );
}
