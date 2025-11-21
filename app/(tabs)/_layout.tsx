import { Tabs } from 'expo-router';
import {
  Home,
  CheckCircle,
  Dumbbell,
  Calendar,
  List,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.replace('/');
          return;
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        router.replace('/');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000000',
        }}
      >
        <ActivityIndicator size="large" color="#00FF88" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#333333',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#888888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: 'Misiones',
          tabBarIcon: ({ color, size }) => (
            <CheckCircle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Entrenar',
          tabBarIcon: ({ color, size }) => (
            <Dumbbell size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: 'Rutinas',
          tabBarIcon: ({ color, size }) => (
            <List size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
