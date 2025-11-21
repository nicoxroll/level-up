import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PlayerStats {
  level: number;
  experience: number;
  experienceToNext: number;
  availablePoints: number;
  stats: {
    fuerza: number;
    velocidad: number;
    resistencia: number;
    constancia: number;
    tecnica: number;
  };
}

interface PlayerContextType {
  playerStats: PlayerStats;
  updateStats: (newStats: Partial<PlayerStats>) => void;
  gainExperience: (xp: number) => void;
  distributePoint: (statKey: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    level: 1,
    experience: 0,
    experienceToNext: 100,
    availablePoints: 0,
    stats: {
      fuerza: 10,
      velocidad: 10,
      resistencia: 10,
      constancia: 10,
      tecnica: 10,
    },
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const storedStats = await AsyncStorage.getItem('playerStats');
        if (storedStats) {
          setPlayerStats(JSON.parse(storedStats));
        }
      } catch (error) {
        console.error('Error loading player stats:', error);
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const saveStats = async () => {
      try {
        await AsyncStorage.setItem('playerStats', JSON.stringify(playerStats));
      } catch (error) {
        console.error('Error saving player stats:', error);
      }
    };
    saveStats();
  }, [playerStats]);

  const updateStats = (newStats: Partial<PlayerStats>) => {
    setPlayerStats(prev => ({ ...prev, ...newStats }));
  };

  const gainExperience = (xp: number) => {
    setPlayerStats(prev => {
      let newExp = prev.experience + xp;
      let newLevel = prev.level;
      let newExpToNext = prev.experienceToNext;
      let newPoints = prev.availablePoints;

      while (newExp >= newExpToNext) {
        newExp -= newExpToNext;
        newLevel += 1;
        newExpToNext = newLevel * 100; // Example: each level requires level*100 XP
        newPoints += 1; // Gain a point per level
      }

      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        experienceToNext: newExpToNext,
        availablePoints: newPoints,
      };
    });
  };

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
    <PlayerContext.Provider value={{ playerStats, updateStats, gainExperience, distributePoint }}>
      {children}
    </PlayerContext.Provider>
  );
};