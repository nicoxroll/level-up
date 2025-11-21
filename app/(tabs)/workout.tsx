import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  Check,
  CheckCircle,
  ChevronLeft,
  Dumbbell,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  Square,
  Timer,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { usePlayer } from '@/contexts/PlayerContext';

interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  restTime: number;
  completedSets: boolean[];
  isPaused?: boolean;
}

interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
}

export default function WorkoutScreen() {
  const router = useRouter();
  const { gainExperience } = usePlayer();
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(
    null
  );
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isRestPaused, setIsRestPaused] = useState(false);
  const [showRoutineSelector, setShowRoutineSelector] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(
    null
  );
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [exerciseTime, setExerciseTime] = useState(0);

  const [availableRoutines, setAvailableRoutines] = useState<WorkoutRoutine[]>(
    []
  );

  // Load routines from storage
  useEffect(() => {
    const loadRoutines = async () => {
      try {
        const storedRoutines = await AsyncStorage.getItem('userRoutines');
        if (storedRoutines) {
          const userRoutines = JSON.parse(storedRoutines);
          setAvailableRoutines(userRoutines);
          // Set first routine as default if available
          if (userRoutines.length > 0 && !selectedRoutine) {
            const firstRoutine = userRoutines[0];
            setExercises(firstRoutine.exercises.map((ex: any) => ({ ...ex })));
            setSelectedRoutine(firstRoutine);
            setActiveExerciseIndex(null); // Start with no exercise active
          }
        } else {
          // Default routines if none saved
          const defaultRoutines: WorkoutRoutine[] = [
            {
              id: '1',
              name: 'Rutina Superior',
              exercises: [
                {
                  id: '1',
                  name: 'Press de Banca',
                  sets: 3,
                  reps: '10',
                  weight: '80kg',
                  restTime: 60,
                  completedSets: [false, false, false],
                },
                {
                  id: '2',
                  name: 'Dominadas',
                  sets: 3,
                  reps: '8',
                  weight: 'Peso Corporal',
                  restTime: 90,
                  completedSets: [false, false, false],
                },
                {
                  id: '3',
                  name: 'Curl de Bíceps',
                  sets: 3,
                  reps: '12',
                  weight: '25kg',
                  restTime: 45,
                  completedSets: [false, false, false],
                },
              ],
            },
            {
              id: '2',
              name: 'Rutina Full Body',
              exercises: [
                {
                  id: '4',
                  name: 'Sentadillas',
                  sets: 4,
                  reps: '12',
                  weight: '60kg',
                  restTime: 75,
                  completedSets: [false, false, false, false],
                },
                {
                  id: '5',
                  name: 'Press Militar',
                  sets: 3,
                  reps: '10',
                  weight: '50kg',
                  restTime: 60,
                  completedSets: [false, false, false],
                },
                {
                  id: '6',
                  name: 'Remo con Barra',
                  sets: 3,
                  reps: '8',
                  weight: '70kg',
                  restTime: 90,
                  completedSets: [false, false, false],
                },
              ],
            },
            {
              id: '3',
              name: 'Rutina Inferior',
              exercises: [
                {
                  id: '7',
                  name: 'Peso Muerto',
                  sets: 4,
                  reps: '6',
                  weight: '100kg',
                  restTime: 120,
                  completedSets: [false, false, false, false],
                },
                {
                  id: '8',
                  name: 'Extensiones de Piernas',
                  sets: 3,
                  reps: '15',
                  weight: '40kg',
                  restTime: 60,
                  completedSets: [false, false, false],
                },
                {
                  id: '9',
                  name: 'Elevaciones de Gemelos',
                  sets: 4,
                  reps: '20',
                  weight: '30kg',
                  restTime: 45,
                  completedSets: [false, false, false, false],
                },
              ],
            },
          ];
          setAvailableRoutines(defaultRoutines);
          if (defaultRoutines.length > 0 && !selectedRoutine) {
            const firstRoutine = defaultRoutines[0];
            setExercises(firstRoutine.exercises.map((ex: any) => ({ ...ex })));
            setSelectedRoutine(firstRoutine);
            setActiveExerciseIndex(null); // Start with no exercise active
          }
        }
      } catch (error) {
        console.error('Error loading routines:', error);
      }
    };
    loadRoutines();
  }, []);

  useEffect(() => {
    let interval: number;

    if (isWorkoutActive) {
      interval = setInterval(() => {
        setTotalTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  useEffect(() => {
    let restInterval: number;

    if (isResting && restTimeLeft > 0 && !isRestPaused) {
      restInterval = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            // Move to next exercise
            if (activeExerciseIndex !== null && activeExerciseIndex < exercises.length - 1) {
              setActiveExerciseIndex(activeExerciseIndex + 1);
              setExerciseTime(0);
            } else {
              // End workout
              setIsWorkoutActive(false);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(restInterval);
  }, [isResting, restTimeLeft, isRestPaused]);

  useEffect(() => {
    let interval: number;

    if (activeExerciseIndex !== null && !isResting && isWorkoutActive) {
      interval = setInterval(() => {
        setExerciseTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [activeExerciseIndex, isResting, isWorkoutActive]);

  const toggleWorkout = () => {
    setIsWorkoutActive(!isWorkoutActive);
  };

  const skipExercise = () => {
    if (
      activeExerciseIndex !== null &&
      activeExerciseIndex < exercises.length - 1
    ) {
      selectExercise(activeExerciseIndex + 1);
    }
  };

  const resetWorkout = () => {
    setActiveExerciseIndex(null);
    setIsResting(false);
    setRestTimeLeft(0);
    setTotalTime(0);
    setIsWorkoutActive(false);
    setIsRestPaused(false);
    const resetExercises = exercises.map((ex) => ({
      ...ex,
      completedSets: ex.completedSets.map(() => false),
      isPaused: false,
    }));
    setExercises(resetExercises);
  };

  const toggleRestPause = () => {
    setIsRestPaused(!isRestPaused);
  };

  const stopWorkout = async () => {
    setIsWorkoutActive(false);
    setIsResting(false);
    setRestTimeLeft(0);

    // Guardar el workout detenido como parcialmente completado
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const completedSets = exercises.reduce(
        (total, exercise) =>
          total + exercise.completedSets.filter((set) => set).length,
        0
      );
      const totalSets = exercises.reduce(
        (total, exercise) => total + exercise.sets,
        0
      );

      const workoutData = {
        date: today,
        routine: selectedRoutine?.name || 'Rutina Personalizada',
        completed: false, // No completado totalmente
        partialCompletion: `${completedSets}/${totalSets} series`,
        duration: totalTime,
        exercises: exercises.length,
        stopped: true,
      };

      const existingWorkouts = await AsyncStorage.getItem('completedWorkouts');
      const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : {};
      workouts[today] = workoutData;
      await AsyncStorage.setItem('completedWorkouts', JSON.stringify(workouts));

      Alert.alert(
        'Workout Detenido',
        `Has completado ${completedSets}/${totalSets} series en ${formatTime(
          totalTime
        )}`
      );
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const selectRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine);
    setExercises(routine.exercises.map((ex) => ({ ...ex, isPaused: false })));
    setActiveExerciseIndex(0); // Start with first exercise
    setIsResting(false);
    setRestTimeLeft(0);
    setTotalTime(0);
    setIsWorkoutActive(true);
    setExerciseTime(0);
    setIsRestPaused(false);
    setShowRoutineSelector(false);
  };

  const selectExercise = (index: number) => {
    const updatedExercises = [...exercises];

    if (activeExerciseIndex !== null && activeExerciseIndex !== index) {
      // Pause the currently active exercise
      updatedExercises[activeExerciseIndex].isPaused = true;
    }

    // Unpause the selected exercise
    updatedExercises[index].isPaused = false;

    setExercises(updatedExercises);
    setActiveExerciseIndex(index);
    setIsResting(false);
    setRestTimeLeft(0);
    setIsRestPaused(false);
  };

  const completeEntireRoutine = async () => {
    const completedExercises = exercises.map((exercise) => ({
      ...exercise,
      completedSets: exercise.completedSets.map(() => true),
    }));
    setExercises(completedExercises);
    setIsWorkoutActive(false);
    setIsResting(false);
    setRestTimeLeft(0);

    // Update quest progress for workout completion
    if ((global as any).updateQuestProgress) {
      (global as any).updateQuestProgress('daily', 1); // Daily workout completed
      (global as any).updateQuestProgress('weekly', 1); // Weekly workout completed
      (global as any).updateQuestProgress('monthly', 1); // Monthly workout completed
    }

    // Gain XP
    gainExperience(50);

    // Guardar el workout completado en AsyncStorage
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const workoutData = {
        date: today,
        routine: selectedRoutine?.name || 'Rutina Personalizada',
        completed: true,
        duration: totalTime,
        exercises: completedExercises.length,
      };

      const existingWorkouts = await AsyncStorage.getItem('completedWorkouts');
      const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : {};
      workouts[today] = workoutData;
      await AsyncStorage.setItem('completedWorkouts', JSON.stringify(workouts));

      Alert.alert(
        '¡Rutina Completada!',
        `Has completado ${selectedRoutine?.name || 'tu rutina'} en ${formatTime(
          totalTime
        )}`
      );
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].completedSets[setIndex] = true;
    setExercises(updatedExercises);

    // Si es la última serie del ejercicio, iniciar descanso
    const allSetsCompleted = updatedExercises[
      exerciseIndex
    ].completedSets.every((set) => set);
    if (allSetsCompleted) {
      // Iniciar descanso
      setIsResting(true);
      setRestTimeLeft(exercises[exerciseIndex].restTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowRoutineSelector(true)}
          style={styles.routineSelector}
        >
          <Dumbbell size={20} color="#FFFFFF" />
          <Text style={styles.routineSelectorText}>
            {selectedRoutine?.name || 'Seleccionar Rutina'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(totalTime)}</Text>
        <Text style={styles.timerLabel}>Tiempo Total</Text>
      </View>

      {isResting && (
        <View style={styles.restContainer}>
          <Timer size={48} color="#FFFFFF" />
          <Text style={styles.restText}>{formatTime(restTimeLeft)}</Text>
          <Text style={styles.restLabel}>Descanso</Text>
          <View style={styles.restControls}>
            <TouchableOpacity
              onPress={toggleRestPause}
              style={styles.restControlButton}
            >
              {isRestPaused ? (
                <Play size={20} color="#FFFFFF" />
              ) : (
                <Pause size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsResting(false)}
              style={styles.restControlButton}
            >
              <SkipForward size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Ejercicios</Text>

        {exercises.map((exercise, index) => (
          <View
            key={exercise.id}
            style={[
              styles.exerciseCard,
              activeExerciseIndex === index && styles.activeExerciseCard,
            ]}
          >
            <View style={styles.exerciseHeader}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetails}>
                  {exercise.weight} • {exercise.reps} reps
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  if (activeExerciseIndex === index) {
                    // Toggle pause for the active exercise
                    const updatedExercises = [...exercises];
                    updatedExercises[index].isPaused =
                      !updatedExercises[index].isPaused;
                    setExercises(updatedExercises);
                  } else {
                    // Select a different exercise
                    selectExercise(index);
                  }
                }}
                style={[
                  styles.exercisePlayButton,
                  activeExerciseIndex === index && styles.activePlayButton,
                ]}
              >
                {activeExerciseIndex === index ? (
                  exercises[index].isPaused ? (
                    <Play size={20} color="#000000" />
                  ) : (
                    <Pause size={20} color="#000000" />
                  )
                ) : (
                  <Play size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.setsContainer}>
              {exercise.completedSets?.map((completed, setIndex) => (
                <TouchableOpacity
                  key={setIndex}
                  style={[styles.setButton, completed && styles.completedSet]}
                  onPress={() => !completed && completeSet(index, setIndex)}
                  disabled={completed}
                >
                  <Text
                    style={[
                      styles.setText,
                      completed && styles.completedSetText,
                    ]}
                  >
                    {setIndex + 1}
                  </Text>
                  {completed && <Check size={12} color="#000000" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {exercises.length === 0 && (
          <View style={styles.currentExerciseCard}>
            <Text style={styles.exerciseName}>
              No hay ejercicios disponibles
            </Text>
            <Text style={styles.exerciseDetails}>
              Selecciona una rutina para comenzar
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          onPress={completeEntireRoutine}
          style={styles.bottomControlButton}
        >
          <CheckCircle size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={skipExercise}
          style={styles.bottomControlButton}
          disabled={
            activeExerciseIndex === null ||
            activeExerciseIndex >= exercises.length - 1
          }
        >
          <SkipForward size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={resetWorkout}
          style={styles.bottomControlButton}
        >
          <RotateCcw size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={stopWorkout}
          style={styles.bottomControlButton}
        >
          <Square size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Modal para seleccionar rutina */}
      <Modal
        visible={showRoutineSelector}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRoutineSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Rutina</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {availableRoutines.map((routine) => (
                <TouchableOpacity
                  key={routine.id}
                  style={[
                    styles.routineOption,
                    selectedRoutine?.id === routine.id &&
                      styles.selectedRoutine,
                  ]}
                  onPress={() => selectRoutine(routine)}
                >
                  <Dumbbell size={24} color="#FFFFFF" />
                  <View style={styles.routineInfo}>
                    <Text style={styles.routineName}>{routine.name}</Text>
                    <Text style={styles.routineDetails}>
                      {routine.exercises.length} ejercicios
                    </Text>
                    <Text style={styles.exerciseList}>
                      {routine.exercises.map(ex => ex.name).join(', ')}
                    </Text>
                  </View>
                  {selectedRoutine?.id === routine.id && (
                    <Check size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowRoutineSelector(false)}
            >
              <Text style={styles.closeModalText}>Cerrar</Text>
            </TouchableOpacity>
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
  timerContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  timerText: {
    fontSize: 32,
    fontWeight: '200',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  timerLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  restContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  restText: {
    fontSize: 28,
    fontWeight: '200',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    marginTop: 6,
    letterSpacing: 2,
  },
  restLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '300',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
    fontWeight: '300',
    letterSpacing: 1,
  },
  exerciseCard: {
    backgroundColor: '#111111',
    padding: 16,
    marginBottom: 12,
  },
  activeExerciseCard: {
    backgroundColor: '#222222',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exerciseInfo: {
    flex: 1,
  },
  exercisePlayButton: {
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 0,
  },
  activePlayButton: {
    backgroundColor: '#FFFFFF',
  },
  currentExerciseCard: {
    backgroundColor: '#111111',
    padding: 16,
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
    marginBottom: 8,
    letterSpacing: 1,
  },
  exerciseDetails: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  setsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  setButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 50,
    justifyContent: 'center',
  },
  completedSet: {
    backgroundColor: '#FFFFFF',
  },
  setText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  completedSetText: {
    color: '#000000',
  },
  restControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 20,
  },
  restControlButton: {
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 0,
  },
  routineSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 0,
    gap: 8,
  },
  routineSelectorText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
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
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
  },
  routineOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  selectedRoutine: {
    backgroundColor: '#333333',
  },
  routineInfo: {
    flex: 1,
  },
  routineName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 1,
  },
  routineDetails: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  exerciseList: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '300',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  closeModalButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  closeModalText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#111111',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  bottomControlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    minWidth: 50,
    minHeight: 50,
  },
});
