import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Check, ChevronLeft, Dumbbell, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface WorkoutData {
  routine: string;
  completed: boolean;
  scheduled?: boolean;
  stopped?: boolean;
  duration?: number;
  exercises?: number;
  partialCompletion?: string;
  weekly?: boolean;
}

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [workoutData, setWorkoutData] = useState<Record<string, WorkoutData>>(
    {}
  );
  const [showAddRoutine, setShowAddRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineDate, setNewRoutineDate] = useState('');
  const [isWeekly, setIsWeekly] = useState(false);
  const [selectedDayForRoutine, setSelectedDayForRoutine] = useState('');
  const [userRoutines, setUserRoutines] = useState<any[]>([]);

  // Cargar workouts desde AsyncStorage
  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const storedWorkouts = await AsyncStorage.getItem('completedWorkouts');
        if (storedWorkouts) {
          setWorkoutData(JSON.parse(storedWorkouts));
        }
      } catch (error) {
        console.error('Error loading workouts:', error);
      }
    };
    loadWorkouts();
  }, []);

  // Cargar rutinas del usuario desde AsyncStorage
  useEffect(() => {
    const loadUserRoutines = async () => {
      try {
        const storedRoutines = await AsyncStorage.getItem('userRoutines');
        if (storedRoutines) {
          setUserRoutines(JSON.parse(storedRoutines));
        }
      } catch (error) {
        console.error('Error loading user routines:', error);
      }
    };
    loadUserRoutines();
  }, []);

  // Datos de ejemplo para rutinas programadas (además de las completadas)
  const scheduledWorkouts: Record<string, WorkoutData> = {
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

  // Combinar workouts completados con programados
  const allWorkoutData = { ...scheduledWorkouts, ...workoutData };

  const markedDates = Object.keys(allWorkoutData).reduce((acc, date) => {
    const workout = allWorkoutData[date];
    acc[date] = {
      marked: true,
      dotColor: workout.completed
        ? '#FFFFFF'
        : workout.stopped ?? false
        ? '#888888'
        : workout.scheduled ?? false
        ? '#AAAAAA'
        : '#666666',
      selected: selectedDate === date,
      selectedColor: '#FFFFFF',
      selectedTextColor: '#000000',
    };
    return acc;
  }, {} as Record<string, any>);

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    setSelectedDayForRoutine(day.dateString);
  };

  const selectedWorkout = selectedDate && allWorkoutData[selectedDate];

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
                        : selectedWorkout.stopped ?? false
                        ? 'Detenido'
                        : selectedWorkout.scheduled ?? false
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
                  {selectedWorkout.partialCompletion && (
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Progreso:</Text>
                      <Text style={styles.statValue}>
                        {selectedWorkout.partialCompletion}
                      </Text>
                    </View>
                  )}
                  {selectedWorkout.duration && (
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Duración:</Text>
                      <Text style={styles.statValue}>
                        {Math.floor(selectedWorkout.duration / 60)}:
                        {(selectedWorkout.duration % 60)
                          .toString()
                          .padStart(2, '0')}
                      </Text>
                    </View>
                  )}
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
                      (selectedWorkout.stopped ?? false) && styles.stoppedDot,
                      (selectedWorkout.scheduled ?? false) &&
                        !selectedWorkout.completed &&
                        !(selectedWorkout.stopped ?? false) &&
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
        {Object.entries(allWorkoutData)
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
              {workout.duration && (
                <Text style={styles.workoutItemDuration}>
                  {Math.floor(workout.duration / 60)}:
                  {(workout.duration % 60).toString().padStart(2, '0')}
                </Text>
              )}
            </View>
          ))}

        <Text style={styles.sectionTitle}>Rutinas Detenidas</Text>
        {Object.entries(allWorkoutData)
          .filter(([_, workout]) => workout.stopped ?? false)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .slice(0, 3)
          .map(([date, workout]) => (
            <View key={date} style={styles.workoutItem}>
              <View style={styles.workoutItemHeader}>
                <Text style={styles.workoutItemDate}>
                  {new Date(date).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
                <View style={[styles.statusDot, styles.stoppedDot]} />
              </View>
              <Text style={styles.workoutItemName}>{workout.routine}</Text>
              {workout.partialCompletion && (
                <Text style={styles.workoutItemDuration}>
                  {workout.partialCompletion}
                </Text>
              )}
            </View>
          ))}

        <Text style={styles.sectionTitle}>Rutinas Programadas</Text>
        {Object.entries(allWorkoutData)
          .filter(
            ([date, workout]) =>
              (workout.scheduled ?? false) &&
              !workout.completed &&
              !(workout.stopped ?? false) &&
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
      <TouchableOpacity
        style={[styles.fab, !selectedDate && styles.fabDisabled]}
        onPress={() => selectedDate && setShowAddRoutine(true)}
        disabled={!selectedDate}
      >
        <Plus size={24} color="#000000" />
      </TouchableOpacity>

      {/* Modal para agregar rutina */}
      <Modal
        visible={showAddRoutine}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddRoutine(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Programar Rutina</Text>

            <Text style={styles.subTitle}>Seleccionar Rutina</Text>
            <ScrollView
              style={styles.routinesList}
              showsVerticalScrollIndicator={false}
            >
              {userRoutines.length === 0 ? (
                <Text style={styles.emptyText}>No tienes rutinas creadas</Text>
              ) : (
                userRoutines.map((routine) => (
                  <TouchableOpacity
                    key={routine.id}
                    style={[
                      styles.routineOption,
                      newRoutineName === routine.name &&
                        styles.routineOptionSelected,
                    ]}
                    onPress={() => setNewRoutineName(routine.name)}
                  >
                    <Dumbbell size={20} color="#FFFFFF" />
                    <View style={styles.routineOptionInfo}>
                      <Text style={styles.routineOptionName}>
                        {routine.name}
                      </Text>
                      <Text style={styles.routineOptionDetails}>
                        {routine.exercises.length} ejercicios
                      </Text>
                    </View>
                    {newRoutineName === routine.name && (
                      <Check size={16} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            <TextInput
              style={styles.dateInput}
              placeholder="Fecha (YYYY-MM-DD)"
              placeholderTextColor="#888888"
              value={selectedDayForRoutine}
              onChangeText={setSelectedDayForRoutine}
              editable={!selectedDate}
            />
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setIsWeekly(!isWeekly)}
              >
                {isWeekly && <Check size={16} color="#FFFFFF" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>Repetir semanalmente</Text>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddRoutine(false);
                  setNewRoutineName('');
                  setNewRoutineDate('');
                  setIsWeekly(false);
                  setSelectedDayForRoutine('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={async () => {
                  if (newRoutineName && selectedDayForRoutine) {
                    try {
                      const updatedWorkouts = { ...allWorkoutData };

                      if (isWeekly) {
                        // Programar para las próximas 4 semanas
                        const baseDate = new Date(selectedDayForRoutine);
                        for (let week = 0; week < 4; week++) {
                          const weekDate = new Date(baseDate);
                          weekDate.setDate(baseDate.getDate() + week * 7);
                          const weekDateString = weekDate
                            .toISOString()
                            .split('T')[0];

                          updatedWorkouts[weekDateString] = {
                            routine: newRoutineName,
                            completed: false,
                            scheduled: true,
                            weekly: true,
                          };
                        }
                      } else {
                        // Programar solo para la fecha seleccionada
                        updatedWorkouts[selectedDayForRoutine] = {
                          routine: newRoutineName,
                          completed: false,
                          scheduled: true,
                        };
                      }

                      setWorkoutData(updatedWorkouts);
                      await AsyncStorage.setItem(
                        'completedWorkouts',
                        JSON.stringify(updatedWorkouts)
                      );
                      setShowAddRoutine(false);
                      setNewRoutineName('');
                      setNewRoutineDate('');
                      setIsWeekly(false);
                      setSelectedDayForRoutine('');

                      const message = isWeekly
                        ? `Rutina "${newRoutineName}" programada semanalmente por 4 semanas`
                        : `Rutina "${newRoutineName}" programada para ${selectedDayForRoutine}`;

                      Alert.alert('¡Rutina programada!', message);
                    } catch (error) {
                      console.error('Error saving routine:', error);
                      Alert.alert('Error', 'No se pudo guardar la rutina');
                    }
                  } else {
                    Alert.alert(
                      'Error',
                      'Por favor selecciona una rutina y una fecha'
                    );
                  }
                }}
              >
                <Text style={styles.addButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  calendar: {
    marginBottom: 16,
  },
  workoutDetails: {
    backgroundColor: '#111111',
    padding: 16,
    marginBottom: 16,
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
  stoppedDot: {
    backgroundColor: '#888888',
  },
  scheduledDot: {
    backgroundColor: '#AAAAAA',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 16,
    fontWeight: '300',
    letterSpacing: 1,
  },
  workoutItem: {
    backgroundColor: '#111111',
    padding: 12,
    marginBottom: 6,
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
  workoutItemDuration: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '300',
    letterSpacing: 0.5,
    marginTop: 4,
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
    bottom: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    // For web compatibility
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    // React Native Web uses boxShadow
    boxShadow: '0px 4px 8px rgba(255, 255, 255, 0.3)',
  },
  fabDisabled: {
    backgroundColor: '#666666',
    shadowOpacity: 0.1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111111',
    borderRadius: 0,
    padding: 20,
    width: '90%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  dateInput: {
    backgroundColor: '#000000',
    color: '#FFFFFF',
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#333333',
  },
  addButton: {
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  addButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 16,
  },
  routinesList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  routineOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 12,
    marginBottom: 6,
    gap: 12,
  },
  routineOptionSelected: {
    backgroundColor: '#333333',
  },
  routineOptionInfo: {
    flex: 1,
  },
  routineOptionName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  routineOptionDetails: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '300',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
    fontWeight: '300',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 8,
  },
});
