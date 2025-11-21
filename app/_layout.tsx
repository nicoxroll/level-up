import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { PlayerProvider } from '@/contexts/PlayerContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <PlayerProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </PlayerProvider>
  );
}
