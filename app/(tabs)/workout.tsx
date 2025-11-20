import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Play, Pause, Check, Timer, SkipForward, RotateCcw, Square, CheckCircle, Dumbbell } from 'lucide-react-native';
import { useState, useEffect } from 'react';

interface WorkoutExercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  restTime: number;
  completedSets: boolean[];
}

interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
}

export default function WorkoutScreen() {
  const router = useRouter();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isRestPaused, setIsRestPaused] = useState(false);
  const [showRoutineSelector, setShowRoutineSelector] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<WorkoutRoutine | null>(null);

  // Rutinas disponibles
  const availableRoutines: WorkoutRoutine[] = [
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

  // Rutina actual (inicialmente la primera)
  const [exercises, setExercises] = useState<WorkoutExercise[]>(
    availableRoutines[0].exercises.map(ex => ({ ...ex }))
  );

  useEffect(() => {
    let interval: number;

    if (isWorkoutActive) {
      interval = setInterval(() => {
        setTotalTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isWorkoutActive]);

  useEffect(() => {
    let restInterval: number;

    if (isResting && restTimeLeft > 0 && !isRestPaused) {
      restInterval = setInterval(() => {
        setRestTimeLeft(prev => {
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

  const toggleWorkout = () => {
    setIsWorkoutActive(!isWorkoutActive);
  };

  const skipExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setIsResting(false);
      setRestTimeLeft(0);
    }
  };

  const resetWorkout = () => {
    setCurrentExercise(0);
    setIsResting(false);
    setRestTimeLeft(0);
    setTotalTime(0);
    setIsWorkoutActive(false);
    setIsRestPaused(false);
    const resetExercises = exercises.map(ex => ({
      ...ex,
      completedSets: ex.completedSets.map(() => false)
    }));
    setExercises(resetExercises);
  };

  const toggleRestPause = () => {
    setIsRestPaused(!isRestPaused);
  };

  const stopWorkout = () => {
    setIsWorkoutActive(false);
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const selectRoutine = (routine: WorkoutRoutine) => {
    setSelectedRoutine(routine);
    setExercises(routine.exercises.map(ex => ({ ...ex })));
    setCurrentExercise(0);
    setIsResting(false);
    setRestTimeLeft(0);
    setTotalTime(0);
    setIsWorkoutActive(false);
    setIsRestPaused(false);
    setShowRoutineSelector(false);
  };

  const completeEntireRoutine = () => {
    const completedExercises = exercises.map(exercise => ({
      ...exercise,
      completedSets: exercise.completedSets.map(() => true)
    }));
    setExercises(completedExercises);
    setIsWorkoutActive(false);
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const completeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].completedSets[setIndex] = true;
    setExercises(updatedExercises);

    // Si es la última serie del ejercicio, pasar al siguiente
    const allSetsCompleted = updatedExercises[exerciseIndex].completedSets.every(set => set);
    if (allSetsCompleted && exerciseIndex < exercises.length - 1) {
      setCurrentExercise(exerciseIndex + 1);
      setIsResting(true);
      setRestTimeLeft(exercises[exerciseIndex + 1].restTime);
    } else if (allSetsCompleted) {
      // Workout completado
      setIsWorkoutActive(false);
    } else {
      // Iniciar descanso
      setIsResting(true);
      setRestTimeLeft(exercises[exerciseIndex].restTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentEx = exercises[currentExercise];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowRoutineSelector(true)} style={styles.routineSelector}>
          <Dumbbell size={20} color="#FFFFFF" />
          <Text style={styles.routineSelectorText}>
            {selectedRoutine?.name || 'Seleccionar Rutina'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleWorkout} style={styles.mainPlayButton}>
          {isWorkoutActive ? (
            <Pause size={32} color="#000000" />
          ) : (
            <Play size={32} color="#000000" />
          )}
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
            <TouchableOpacity onPress={toggleRestPause} style={styles.restControlButton}>
              {isRestPaused ? <Play size={20} color="#FFFFFF" /> : <Pause size={20} color="#FFFFFF" />}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsResting(false)} style={styles.restControlButton}>
              <SkipForward size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Ejercicio Actual</Text>

        <View style={styles.currentExerciseCard}>
          <Text style={styles.exerciseName}>{currentEx.name}</Text>
          <Text style={styles.exerciseDetails}>
            {currentEx.weight} • {currentEx.reps} reps
          </Text>

          <View style={styles.setsContainer}>
            {currentEx.completedSets.map((completed, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.setButton, completed && styles.completedSet]}
                onPress={() => !completed && completeSet(currentExercise, index)}
                disabled={completed}
              >
                <Text style={[styles.setText, completed && styles.completedSetText]}>
                  {index + 1}
                </Text>
                {completed && <Check size={12} color="#000000" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Próximos Ejercicios</Text>
        {exercises.slice(currentExercise + 1).map((exercise, index) => (
          <View key={exercise.id} style={styles.upcomingExercise}>
            <Text style={styles.upcomingName}>{exercise.name}</Text>
            <Text style={styles.upcomingDetails}>
              {exercise.sets} series • {exercise.reps} reps
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Controles</Text>
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={completeEntireRoutine} style={styles.controlButton}>
            <CheckCircle size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Completar Rutina</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={skipExercise} style={styles.controlButton} disabled={currentExercise >= exercises.length - 1}>
            <SkipForward size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Saltar Ejercicio</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetWorkout} style={styles.controlButton}>
            <RotateCcw size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Reiniciar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={stopWorkout} style={styles.controlButton}>
            <Square size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Detener</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
                    selectedRoutine?.id === routine.id && styles.selectedRoutine
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
    fontSize: 20,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  mainPlayButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 0,
    elevation: 8,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  timerContainer: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  timerText: {
    fontSize: 48,
    fontWeight: '200',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    letterSpacing: 4,
  },
  timerLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '300',
    letterSpacing: 1,
  },
  restContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  restText: {
    fontSize: 36,
    fontWeight: '200',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    marginTop: 8,
    letterSpacing: 3,
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
    fontWeight: '300',
    letterSpacing: 1,
  },
  currentExerciseCard: {
    backgroundColor: '#111111',
    padding: 20,
    marginBottom: 20,
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
  upcomingExercise: {
    backgroundColor: '#111111',
    padding: 16,
    marginBottom: 8,
  },
  upcomingName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  upcomingDetails: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '300',
    letterSpacing: 0.5,
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
  controlsContainer: {
    gap: 12,
  },
  controlButton: {
    backgroundColor: '#111111',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
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
});