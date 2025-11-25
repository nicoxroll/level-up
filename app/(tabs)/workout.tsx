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
import { List } from 'react-native-paper';

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
  const [isWorkoutPaused, setIsWorkoutPaused] = useState(false);
  const [availableRoutines, setAvailableRoutines] = useState<WorkoutRoutine[]>(
    []
  );
  const [isAdmin, setIsAdmin] = useState(true); // Por ahora, usuario admin
  const [showCreateRoutineModal, setShowCreateRoutineModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<WorkoutRoutine | null>(
    null
  );
  const [newRoutineName, setNewRoutineName] = useState('');
  const [availableExercises, setAvailableExercises] = useState<
    WorkoutExercise[]
  >([
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
  ]);

  // Estados para el conteo regresivo y control de rutina
  const [isRoutineStarted, setIsRoutineStarted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);

  // Estados para el toggle de controles
  const [showControls, setShowControls] = useState(false);

  // Estado para el modal de resumen de rutina completada
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionStats, setCompletionStats] = useState<any>(null);

  // Load routines from storage
  useEffect(() => {
    const loadRoutines = async () => {
      try {
        const storedRoutines = await AsyncStorage.getItem('userRoutines');
        if (storedRoutines) {
          const userRoutines = JSON.parse(storedRoutines);
          setAvailableRoutines(userRoutines);
          // Set first routine as default if available
          if (userRoutines.length > 0) {
            const firstRoutine = userRoutines[0];
            setExercises(
              firstRoutine.exercises.map((ex: any) => ({
                ...ex,
                isPaused: false,
              }))
            );
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
          await saveRoutinesToStorage(defaultRoutines); // Save defaults to storage
          if (defaultRoutines.length > 0) {
            const firstRoutine = defaultRoutines[0];
            setExercises(
              firstRoutine.exercises.map((ex: any) => ({
                ...ex,
                isPaused: false,
              }))
            );
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

    if (activeExerciseIndex !== null && !isWorkoutPaused) {
      interval = setInterval(() => {
        setTotalTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [activeExerciseIndex, isWorkoutPaused]);

  useEffect(() => {
    let restInterval: number;

    if (isResting && restTimeLeft > 0 && !isRestPaused) {
      restInterval = setInterval(() => {
        setRestTimeLeft((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(restInterval);
  }, [isResting, restTimeLeft, isRestPaused]);

  // Efecto para el conteo regresivo
  useEffect(() => {
    let countdownInterval: number;

    if (countdown !== null && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev !== null && prev <= 1) {
            setShowCountdown(false);
            setIsRoutineStarted(true);
            return null;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [countdown]);

  const toggleWorkout = () => {
    setIsWorkoutActive(!isWorkoutActive);
  };

  const startRoutine = () => {
    if (!exercises || exercises.length === 0) {
      Alert.alert('Error', 'No hay ejercicios para comenzar');
      return;
    }

    setShowCountdown(true);
    setCountdown(3);
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
    setIsWorkoutPaused(false);
    setIsRoutineStarted(false); // Reset routine state
    if (exercises && Array.isArray(exercises) && exercises.length > 0) {
      const resetExercises = exercises.map((ex) => ({
        ...ex,
        completedSets: ex.completedSets?.map(() => false) || [],
        isPaused: false,
      }));
      setExercises(resetExercises);
    }
  };

  const toggleWorkoutPause = () => {
    setIsWorkoutPaused(!isWorkoutPaused);
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
      if (exercises && exercises.length > 0) {
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

        const existingWorkouts = await AsyncStorage.getItem(
          'completedWorkouts'
        );
        const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : {};
        workouts[today] = workoutData;
        await AsyncStorage.setItem(
          'completedWorkouts',
          JSON.stringify(workouts)
        );

        Alert.alert(
          'Workout Detenido',
          `Has completado ${completedSets}/${totalSets} series en ${formatTime(
            totalTime
          )}`
        );
        router.back(); // Navigate back after saving
      }
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const selectRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine);
    setExercises(routine.exercises.map((ex) => ({ ...ex, isPaused: false })));
    setActiveExerciseIndex(null);
    setIsResting(false);
    setRestTimeLeft(0);
    setTotalTime(0);
    setIsRestPaused(false);
    setIsWorkoutPaused(false);
    setIsRoutineStarted(false); // Reset routine state
    setShowRoutineSelector(false);
  };

  const selectExercise = (index: number) => {
    if (!exercises || exercises.length === 0) return;

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
    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      Alert.alert('Error', 'No hay ejercicios para completar');
      return;
    }

    // Verificar si todos los ejercicios están completados
    const allExercisesCompleted = exercises.every(
      (exercise) => exercise.completedSets?.every((set) => set) || false
    );

    if (!allExercisesCompleted) {
      Alert.alert(
        'Error',
        'Completa todos los ejercicios antes de finalizar la rutina'
      );
      return;
    }

    try {
      setIsWorkoutActive(false);
      setIsResting(false);
      setRestTimeLeft(0);

      // Calcular estadísticas
      const totalSets = exercises.reduce(
        (total, exercise) => total + exercise.sets,
        0
      );
      const completedSets = exercises.reduce(
        (total, exercise) =>
          total + exercise.completedSets.filter((set) => set).length,
        0
      );

      // Obtener estadísticas de workouts anteriores para comparación
      const existingWorkouts = await AsyncStorage.getItem('completedWorkouts');
      const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : {};
      const workoutDates = Object.keys(workouts).sort().slice(-7); // Últimos 7 días

      const avgDuration =
        workoutDates.length > 0
          ? workoutDates.reduce(
              (sum, date) => sum + (workouts[date].duration || 0),
              0
            ) / workoutDates.length
          : totalTime;

      const avgExercises =
        workoutDates.length > 0
          ? workoutDates.reduce(
              (sum, date) => sum + (workouts[date].exercises || 0),
              0
            ) / workoutDates.length
          : exercises.length;

      const stats = {
        duration: totalTime,
        exercises: exercises.length,
        sets: `${completedSets}/${totalSets}`,
        avgDuration: Math.round(avgDuration),
        avgExercises: Math.round(avgExercises),
        xpGained: 10, // XP fijo por completar rutina
        improvement:
          totalTime < avgDuration
            ? 'Mejor tiempo'
            : totalTime > avgDuration
            ? 'Tiempo similar'
            : 'Tiempo promedio',
      };

      setCompletionStats(stats);
      setShowCompletionModal(true);

      // Update quest progress for workout completion
      if ((global as any).updateQuestProgress) {
        (global as any).updateQuestProgress('daily', 1); // Daily workout completed
        (global as any).updateQuestProgress('weekly', 1); // Weekly workout completed
        (global as any).updateQuestProgress('monthly', 1); // Monthly workout completed
      }

      // Guardar el workout completado en AsyncStorage
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const workoutData = {
        date: today,
        routine: selectedRoutine?.name || 'Rutina Personalizada',
        completed: true,
        duration: totalTime,
        exercises: exercises.length,
      };

      workouts[today] = workoutData;
      await AsyncStorage.setItem('completedWorkouts', JSON.stringify(workouts));
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Hubo un problema al guardar el workout');
    }
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    if (!exercises || exercises.length === 0) return;

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

  const completeExercise = (exerciseIndex: number) => {
    if (
      !exercises ||
      exercises.length === 0 ||
      exerciseIndex < 0 ||
      exerciseIndex >= exercises.length
    ) {
      console.error('Invalid exercise index or exercises array');
      return;
    }

    const updatedExercises = [...exercises];
    const exercise = updatedExercises[exerciseIndex];

    if (!exercise || !exercise.completedSets) {
      console.error('Exercise or completedSets is undefined');
      return;
    }

    // Marcar todas las series como completadas
    updatedExercises[exerciseIndex].completedSets = exercise.completedSets.map(
      () => true
    );
    setExercises(updatedExercises);

    // Iniciar descanso después de completar el ejercicio
    setIsResting(true);
    setRestTimeLeft(exercise.restTime);
  };

  const saveRoutinesToStorage = async (routines: WorkoutRoutine[]) => {
    try {
      await AsyncStorage.setItem('userRoutines', JSON.stringify(routines));
    } catch (error) {
      console.error('Error saving routines:', error);
    }
  };

  const createRoutine = () => {
    setNewRoutineName('');
    setEditingRoutine(null);
    setShowCreateRoutineModal(true);
  };

  const editRoutine = (routine: WorkoutRoutine) => {
    setNewRoutineName(routine.name);
    setEditingRoutine(routine);
    setShowCreateRoutineModal(true);
  };

  const saveRoutine = async () => {
    if (!newRoutineName.trim()) {
      Alert.alert('Error', 'El nombre de la rutina no puede estar vacío');
      return;
    }

    let updatedRoutines = [...availableRoutines];

    if (editingRoutine) {
      // Edit existing routine
      const index = updatedRoutines.findIndex(
        (r) => r.id === editingRoutine.id
      );
      if (index !== -1) {
        updatedRoutines[index] = { ...editingRoutine, name: newRoutineName };
      }
    } else {
      // Create new routine
      const newRoutine: WorkoutRoutine = {
        id: Date.now().toString(),
        name: newRoutineName,
        exercises: [],
      };
      updatedRoutines.push(newRoutine);
    }

    setAvailableRoutines(updatedRoutines);
    await saveRoutinesToStorage(updatedRoutines);
    setShowCreateRoutineModal(false);
    setNewRoutineName('');
    setEditingRoutine(null);
  };

  const deleteRoutine = async (routineId: string) => {
    Alert.alert(
      'Eliminar Rutina',
      '¿Estás seguro de que quieres eliminar esta rutina?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const updatedRoutines = availableRoutines.filter(
              (r) => r.id !== routineId
            );
            setAvailableRoutines(updatedRoutines);
            await saveRoutinesToStorage(updatedRoutines);
            if (selectedRoutine?.id === routineId) {
              setSelectedRoutine(null);
              setExercises([]);
            }
          },
        },
      ]
    );
  };

  const addExerciseToRoutine = (
    routineId: string,
    exercise: WorkoutExercise
  ) => {
    const updatedRoutines = availableRoutines.map((r) => {
      if (r.id === routineId) {
        return {
          ...r,
          exercises: [
            ...r.exercises,
            { ...exercise, id: Date.now().toString() },
          ],
        };
      }
      return r;
    });
    setAvailableRoutines(updatedRoutines);
    saveRoutinesToStorage(updatedRoutines);
  };

  const removeExerciseFromRoutine = (routineId: string, exerciseId: string) => {
    const updatedRoutines = availableRoutines.map((r) => {
      if (r.id === routineId) {
        return {
          ...r,
          exercises: r.exercises.filter((e) => e.id !== exerciseId),
        };
      }
      return r;
    });
    setAvailableRoutines(updatedRoutines);
    saveRoutinesToStorage(updatedRoutines);
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

        <View style={styles.headerControls}>
          {isResting ? (
            <View style={styles.restTimerContainer}>
              <Timer size={24} color="#FFFFFF" />
              <Text style={styles.restTimerText}>
                {formatTime(restTimeLeft)}
              </Text>
              <Text style={styles.restTimerLabel}>Descanso</Text>
            </View>
          ) : (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(totalTime)}</Text>
              <Text style={styles.timerLabel}>Tiempo Total</Text>
            </View>
          )}

          {isRoutineStarted && (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={toggleWorkoutPause}
                style={styles.headerButton}
                disabled={activeExerciseIndex === null}
              >
                {isWorkoutPaused ? (
                  <Play
                    size={20}
                    color={activeExerciseIndex !== null ? '#FFFFFF' : '#666666'}
                  />
                ) : (
                  <Pause
                    size={20}
                    color={activeExerciseIndex !== null ? '#FFFFFF' : '#666666'}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={skipExercise}
                style={styles.headerButton}
                disabled={
                  activeExerciseIndex === null ||
                  activeExerciseIndex >= exercises.length - 1
                }
              >
                <SkipForward
                  size={20}
                  color={
                    activeExerciseIndex !== null &&
                    activeExerciseIndex < exercises.length - 1
                      ? '#FFFFFF'
                      : '#666666'
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={completeEntireRoutine}
                style={styles.headerButton}
              >
                <CheckCircle size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={resetWorkout}
                style={styles.headerButton}
              >
                <RotateCcw size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={stopWorkout}
                style={styles.headerButton}
              >
                <Square size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {!isRoutineStarted && (
            <View style={styles.headerButtons}>
              <TouchableOpacity
                onPress={() => setShowRoutineSelector(true)}
                style={styles.headerButton}
              >
                <Dumbbell size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Ejercicios</Text>
        {!isRoutineStarted ? (
          <View style={styles.startRoutineContainer}>
            <Text style={styles.startRoutineText}>
              {selectedRoutine?.name || 'Rutina Seleccionada'}
            </Text>
            <Text style={styles.startRoutineSubtext}>
              {exercises?.length || 0} ejercicios • Prepárate para comenzar
            </Text>
            <TouchableOpacity
              style={styles.startRoutineButton}
              onPress={startRoutine}
            >
              <Play size={24} color="#000000" />
              <Text style={styles.startRoutineButtonText}>Comenzar Rutina</Text>
            </TouchableOpacity>
          </View>
        ) : exercises && exercises.length > 0 ? (
          exercises.map((exercise, index) => {
            const allSetsCompleted =
              exercise.completedSets?.every((set) => set) || false;
            return (
              <List.Accordion
                key={exercise.id}
                title={exercise.name}
                description={`${exercise.weight} • ${exercise.reps} reps • ${
                  exercise.completedSets?.filter((set) => set).length || 0
                }/${exercise.sets} series`}
                titleStyle={styles.accordionTitle}
                descriptionStyle={styles.accordionDescription}
                style={[
                  styles.accordion,
                  allSetsCompleted && styles.completedAccordion,
                ]}
                theme={{
                  colors: {
                    primary: '#FFFFFF',
                    background: 'transparent',
                  },
                }}
              >
                <View style={styles.accordionContent}>
                  {/* Controles del ejercicio */}
                  <View style={styles.exerciseControls}>
                    <TouchableOpacity
                      onPress={() => completeExercise(index)}
                      style={[
                        styles.completeExerciseButton,
                        allSetsCompleted && styles.completedExerciseButton,
                      ]}
                      disabled={allSetsCompleted}
                    >
                      <CheckCircle
                        size={20}
                        color={allSetsCompleted ? '#000000' : '#4CAF50'}
                      />
                      <Text style={styles.completeExerciseText}>
                        {allSetsCompleted ? 'Completado' : 'Completar Todo'}
                      </Text>
                    </TouchableOpacity>

                    <View style={styles.exerciseActionButtons}>
                      <TouchableOpacity
                        onPress={() => {
                          if (activeExerciseIndex === index) {
                            // Toggle pause for the active exercise
                            if (exercises && exercises.length > 0) {
                              const updatedExercises = [...exercises];
                              updatedExercises[index].isPaused =
                                !updatedExercises[index].isPaused;
                              setExercises(updatedExercises);
                            }
                          } else {
                            // Select a different exercise
                            selectExercise(index);
                          }
                        }}
                        style={styles.exerciseActionButton}
                      >
                        {activeExerciseIndex === index ? (
                          exercises &&
                          exercises[index] &&
                          exercises[index].isPaused ? (
                            <Play size={16} color="#FFFFFF" />
                          ) : (
                            <Pause size={16} color="#FFFFFF" />
                          )
                        ) : (
                          <Play size={16} color="#FFFFFF" />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          if (
                            activeExerciseIndex !== null &&
                            activeExerciseIndex < exercises.length - 1
                          ) {
                            selectExercise(activeExerciseIndex + 1);
                          }
                        }}
                        style={styles.exerciseActionButton}
                        disabled={
                          activeExerciseIndex === null ||
                          activeExerciseIndex >= exercises.length - 1
                        }
                      >
                        <SkipForward size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Series individuales */}
                  <Text style={styles.seriesTitle}>Series:</Text>
                  {exercise.completedSets?.map((completed, setIndex) => (
                    <View key={setIndex} style={styles.setItem}>
                      <View style={styles.setInfo}>
                        <Text style={styles.setNumber}>
                          Serie {setIndex + 1}
                        </Text>
                        <Text style={styles.setDetails}>
                          {exercise.weight} • {exercise.reps} reps
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.setCheckButton,
                          completed && styles.completedSetButton,
                        ]}
                        onPress={() =>
                          !completed && completeSet(index, setIndex)
                        }
                        disabled={completed}
                      >
                        <Check
                          size={16}
                          color={completed ? '#000000' : '#FFFFFF'}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </List.Accordion>
            );
          })
        ) : (
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

      {/* Modal de conteo regresivo */}
      <Modal
        visible={showCountdown}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {}}
      >
        <View style={styles.countdownOverlay}>
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>{countdown}</Text>
            <Text style={styles.countdownSubtext}>¡Prepárate!</Text>
          </View>
        </View>
      </Modal>

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

      {/* Modal de resumen de rutina completada */}
      <Modal
        visible={showCompletionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCompletionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.completionModalContent}>
            <View style={styles.completionHeader}>
              <CheckCircle size={48} color="#4CAF50" />
              <Text style={styles.completionTitle}>¡Rutina Completada!</Text>
              <Text style={styles.completionSubtitle}>
                {selectedRoutine?.name || 'Rutina Personalizada'}
              </Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Tiempo Total</Text>
                <Text style={styles.statValue}>
                  {formatTime(completionStats?.duration || 0)}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Ejercicios</Text>
                <Text style={styles.statValue}>
                  {completionStats?.exercises || 0}
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Series Completadas</Text>
                <Text style={styles.statValue}>
                  {completionStats?.sets || '0/0'}
                </Text>
              </View>
            </View>

            <View style={styles.comparisonContainer}>
              <Text style={styles.comparisonTitle}>
                Comparado con la semana anterior
              </Text>
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Tiempo promedio</Text>
                <Text style={styles.comparisonValue}>
                  {formatTime(completionStats?.avgDuration || 0)}
                </Text>
              </View>
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Ejercicios promedio</Text>
                <Text style={styles.comparisonValue}>
                  {completionStats?.avgExercises || 0}
                </Text>
              </View>
              <Text style={styles.improvementText}>
                {completionStats?.improvement || ''}
              </Text>
            </View>

            <View style={styles.xpContainer}>
              <Text style={styles.xpText}>
                +{completionStats?.xpGained || 0} XP
              </Text>
              <Text style={styles.xpLabel}>Puntos de experiencia ganados</Text>
            </View>

            <View style={styles.completionActions}>
              <TouchableOpacity
                style={styles.trainAgainButton}
                onPress={() => {
                  setShowCompletionModal(false);
                  // Reiniciar la rutina para volver a entrenar
                  resetWorkout();
                  setTimeout(() => startRoutine(), 500);
                }}
              >
                <Text style={styles.trainAgainButtonText}>
                  Volver a Entrenar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.finishButton}
                onPress={() => {
                  setShowCompletionModal(false);
                  router.back();
                }}
              >
                <Text style={styles.finishButtonText}>Finalizar</Text>
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
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
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
  workoutPauseButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#333333',
    borderRadius: 0,
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
  completedExerciseCard: {
    backgroundColor: '#222222',
    borderWidth: 2,
    borderColor: '#4CAF50',
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
  completeExerciseButton: {
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 0,
  },
  completedExerciseButton: {
    backgroundColor: '#4CAF50',
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 70,
  },
  createRoutineButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  createRoutineText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  routineOptionContainer: {
    marginBottom: 8,
  },
  routineActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  editButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '300',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '300',
  },
  routineNameInput: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderRadius: 0,
  },
  exercisesList: {
    maxHeight: 150,
    marginBottom: 16,
  },
  exerciseInRoutine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222222',
    padding: 12,
    marginBottom: 4,
  },
  exerciseInRoutineText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
  },
  removeExerciseButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeExerciseText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  availableExercisesList: {
    maxHeight: 150,
    marginBottom: 16,
  },
  availableExercise: {
    backgroundColor: '#333333',
    padding: 12,
    marginBottom: 4,
  },
  availableExerciseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
  },
  availableExerciseDetails: {
    color: '#CCCCCC',
    fontSize: 14,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#333333',
    padding: 12,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    flex: 1,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '300',
  },
  bottomControlText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 0.5,
    marginTop: 4,
    textAlign: 'center',
  },
  startRoutineContainer: {
    backgroundColor: '#111111',
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  startRoutineText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
    marginBottom: 8,
    letterSpacing: 1,
  },
  startRoutineSubtext: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  startRoutineButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    gap: 12,
  },
  startRoutineButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  accordion: {
    backgroundColor: '#111111',
    marginBottom: 8,
  },
  completedAccordion: {
    backgroundColor: '#222222',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  accordionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 1,
  },
  accordionDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  accordionContent: {
    backgroundColor: '#0A0A0A',
    padding: 16,
  },
  disabledText: {
    color: '#666666',
  },
  countdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontSize: 120,
    fontWeight: '200',
    color: '#4CAF50',
    fontFamily: 'monospace',
    letterSpacing: 4,
  },
  countdownSubtext: {
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 16,
    fontWeight: '300',
    letterSpacing: 1,
  },
  exerciseControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  completeExerciseText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '300',
    marginLeft: 8,
  },
  exerciseActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  exerciseActionButton: {
    backgroundColor: '#333333',
    padding: 8,
    borderRadius: 0,
  },
  seriesTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  setItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222222',
    padding: 12,
    marginBottom: 8,
    borderRadius: 0,
  },
  setInfo: {
    flex: 1,
  },
  setNumber: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  setDetails: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  setCheckButton: {
    backgroundColor: '#333333',
    padding: 8,
    borderRadius: 0,
  },
  completedSetButton: {
    backgroundColor: '#4CAF50',
  },
  controlsToggleContainer: {
    backgroundColor: '#111111',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  controlsToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  controlsToggleIcon: {
    transform: [{ rotate: '0deg' }],
  },
  controlsToggleIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  controlsToggleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  expandableControls: {
    backgroundColor: '#111111',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    overflow: 'hidden',
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  controlButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 70,
    marginBottom: 12,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 0.5,
    marginTop: 4,
    textAlign: 'center',
  },
  headerControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    backgroundColor: '#111111',
    padding: 8,
    borderRadius: 0,
  },
  restTimerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  restTimerText: {
    fontSize: 20,
    fontWeight: '200',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  restTimerLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  completionModalContent: {
    backgroundColor: '#111111',
    borderRadius: 0,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  completionHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  completionTitle: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: 2,
  },
  completionSubtitle: {
    fontSize: 18,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  statLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  comparisonContainer: {
    backgroundColor: '#222222',
    padding: 16,
    marginBottom: 24,
    borderRadius: 0,
  },
  comparisonTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  comparisonValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  improvementText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  xpContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  xpText: {
    fontSize: 32,
    color: '#FFD700',
    fontWeight: '600',
    letterSpacing: 2,
  },
  xpLabel: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  completionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  trainAgainButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    flex: 1,
    alignItems: 'center',
    borderRadius: 0,
  },
  trainAgainButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  finishButton: {
    backgroundColor: '#333333',
    padding: 16,
    flex: 1,
    alignItems: 'center',
    borderRadius: 0,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
});
