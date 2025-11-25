import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { PlayerProvider } from '@/contexts/PlayerContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <PaperProvider>
      <PlayerProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </PlayerProvider>
    </PaperProvider>
  );
}
