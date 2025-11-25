import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
