import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Chrome } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Navigate to main app
        router.replace('/(tabs)');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'myapp://',
        },
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (data?.url) {
        await WebBrowser.openBrowserAsync(data.url);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesión con Google');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Levelup</Text>
      <TouchableOpacity style={styles.loginButton} onPress={handleGoogleLogin}>
        <Chrome size={24} color="#4285F4" />
        <Text style={styles.loginButtonText}>Continuar con Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 48,
    fontWeight: '200',
    color: '#FFFFFF',
    marginBottom: 50,
    letterSpacing: 6,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    elevation: 5,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#3C4043',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
});
