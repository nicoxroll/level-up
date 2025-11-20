import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Calendar as CalendarIcon,
  Plus,
} from 'lucide-react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useState } from 'react';

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');

  // Datos de ejemplo para el calendario
  const workoutData: {
    [key: string]: { routine: string; completed: boolean; scheduled?: boolean };
  } = {
    '2024-11-20': { routine: 'Rutina Superior', completed: true },
    '2024-11-19': { routine: 'Rutina Full Body', completed: true },
    '2024-11-18': { routine: 'Rutina Inferior', completed: false },
    '2024-11-21': {
      routine: 'Rutina Superior',
      completed: false,
      scheduled: true,
    },
    '2024-11-22': {
      routine: 'Rutina Full Body',
      completed: false,
      scheduled: true,
    },
    '2024-11-25': {
      routine: 'Rutina Superior',
      completed: false,
      scheduled: true,
    },
    '2024-11-27': {
      routine: 'Rutina Inferior',
      completed: false,
      scheduled: true,
    },
  };

  const markedDates = Object.keys(workoutData).reduce((acc, date) => {
    const workout = workoutData[date];
    acc[date] = {
      marked: true,
      dotColor: workout.completed
        ? '#FFFFFF'
        : workout.scheduled
        ? '#888888'
        : '#666666',
      selected: selectedDate === date,
      selectedColor: '#FFFFFF',
      selectedTextColor: '#000000',
    };
    return acc;
  }, {} as any);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const selectedWorkout = selectedDate && workoutData[selectedDate];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>CALENDARIO</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#000000',
            calendarBackground: '#000000',
            textSectionTitleColor: '#FFFFFF',
            selectedDayBackgroundColor: '#FFFFFF',
            selectedDayTextColor: '#000000',
            todayTextColor: '#FFFFFF',
            dayTextColor: '#FFFFFF',
            textDisabledColor: '#888888',
            dotColor: '#FFFFFF',
            selectedDotColor: '#000000',
            arrowColor: '#FFFFFF',
            monthTextColor: '#FFFFFF',
            indicatorColor: '#FFFFFF',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
          style={styles.calendar}
        />

        {selectedDate && (
          <View style={styles.workoutDetails}>
            <Text style={styles.selectedDate}>
              {new Date(selectedDate).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            {selectedWorkout ? (
              <>
                <Text style={styles.routineName}>
                  {selectedWorkout.routine}
                </Text>
                <View style={styles.workoutStats}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Estado:</Text>
                    <Text style={styles.statValue}>
                      {selectedWorkout.completed
                        ? 'Completado'
                        : selectedWorkout.scheduled
                        ? 'Programado'
                        : 'Pendiente'}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Tipo:</Text>
                    <Text style={styles.statValue}>
                      {selectedWorkout.routine}
                    </Text>
                  </View>
                  {selectedWorkout.completed && (
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>EXP Ganada:</Text>
                      <Text style={styles.statValue}>+50 XP</Text>
                    </View>
                  )}
                </View>
                <View style={styles.statusContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      selectedWorkout.completed && styles.completedDot,
                      selectedWorkout.scheduled &&
                        !selectedWorkout.completed &&
                        styles.scheduledDot,
                    ]}
                  />
                </View>
              </>
            ) : (
              <Text style={styles.noWorkoutText}>
                No hay entrenamiento programado
              </Text>
            )}
          </View>
        )}

        <Text style={styles.sectionTitle}>Rutinas Completadas</Text>
        {Object.entries(workoutData)
          .filter(([_, workout]) => workout.completed)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .slice(0, 5)
          .map(([date, workout]) => (
            <View key={date} style={styles.workoutItem}>
              <View style={styles.workoutItemHeader}>
                <Text style={styles.workoutItemDate}>
                  {new Date(date).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <View style={[styles.statusDot, styles.completedDot]} />
              </View>
              <Text style={styles.workoutItemName}>{workout.routine}</Text>
            </View>
          ))}

        <Text style={styles.sectionTitle}>Rutinas Programadas</Text>
        {Object.entries(workoutData)
          .filter(
            ([date, workout]) =>
              workout.scheduled &&
              !workout.completed &&
              new Date(date) >= new Date()
          )
          .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
          .map(([date, workout]) => (
            <View key={date} style={styles.workoutItem}>
              <View style={styles.workoutItemHeader}>
                <Text style={styles.workoutItemDate}>
                  {new Date(date).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <View style={[styles.statusDot, styles.scheduledDot]} />
              </View>
              <Text style={styles.workoutItemName}>{workout.routine}</Text>
            </View>
          ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Plus size={24} color="#000000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  calendar: {
    marginBottom: 20,
  },
  workoutDetails: {
    backgroundColor: '#111111',
    padding: 20,
    marginBottom: 20,
  },
  selectedDate: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  routineName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '300',
    marginBottom: 12,
    letterSpacing: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#888888',
  },
  completedDot: {
    backgroundColor: '#FFFFFF',
  },
  scheduledDot: {
    backgroundColor: '#888888',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
    marginTop: 20,
    fontWeight: '300',
    letterSpacing: 1,
  },
  workoutItem: {
    backgroundColor: '#111111',
    padding: 16,
    marginBottom: 8,
  },
  workoutItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutItemDate: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  workoutItemName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  workoutStats: {
    marginTop: 12,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  noWorkoutText: {
    fontSize: 16,
    color: '#888888',
    fontWeight: '300',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#FFFFFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
