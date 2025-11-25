import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ChevronLeft, Dumbbell, Plus, Trash2 } from 'lucide-react-native';
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

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  restTime: number;
}

interface WorkoutRoutine {
  id: string;
  name: string;
  exercises: Exercise[];
}

export default function RoutinesScreen() {
  const router = useRouter();
  const [routines, setRoutines] = useState<WorkoutRoutine[]>([]);
  const [showAddRoutine, setShowAddRoutine] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showEditRoutine, setShowEditRoutine] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<WorkoutRoutine | null>(
    null
  );
  const [currentRoutine, setCurrentRoutine] = useState<WorkoutRoutine | null>(
    null
  );
  const [editingRoutineName, setEditingRoutineName] = useState('');

  // Form states
  const [routineName, setRoutineName] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseSets, setExerciseSets] = useState('');
  const [exerciseReps, setExerciseReps] = useState('');
  const [exerciseWeight, setExerciseWeight] = useState('');
  const [exerciseRestTime, setExerciseRestTime] = useState('');
  const [exerciseSearch, setExerciseSearch] = useState('');

  // Available exercises database
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Press de Banca',
      sets: 3,
      reps: '10',
      weight: '80kg',
      restTime: 60,
    },
    {
      id: '2',
      name: 'Dominadas',
      sets: 3,
      reps: '8',
      weight: 'Peso Corporal',
      restTime: 90,
    },
    {
      id: '3',
      name: 'Curl de Bíceps',
      sets: 3,
      reps: '12',
      weight: '25kg',
      restTime: 45,
    },
    {
      id: '4',
      name: 'Sentadillas',
      sets: 4,
      reps: '12',
      weight: '60kg',
      restTime: 75,
    },
    {
      id: '5',
      name: 'Press Militar',
      sets: 3,
      reps: '10',
      weight: '50kg',
      restTime: 60,
    },
    {
      id: '6',
      name: 'Remo con Barra',
      sets: 3,
      reps: '8',
      weight: '70kg',
      restTime: 90,
    },
    {
      id: '7',
      name: 'Peso Muerto',
      sets: 4,
      reps: '6',
      weight: '100kg',
      restTime: 120,
    },
    {
      id: '8',
      name: 'Extensiones de Piernas',
      sets: 3,
      reps: '15',
      weight: '40kg',
      restTime: 60,
    },
    {
      id: '9',
      name: 'Elevaciones de Gemelos',
      sets: 4,
      reps: '20',
      weight: '30kg',
      restTime: 45,
    },
  ]);

  // Load routines from storage
  useEffect(() => {
    const loadRoutines = async () => {
      try {
        const storedRoutines = await AsyncStorage.getItem('userRoutines');
        if (storedRoutines) {
          setRoutines(JSON.parse(storedRoutines));
        }
      } catch (error) {
        console.error('Error loading routines:', error);
      }
    };
    loadRoutines();
  }, []);

  // Save routines to storage
  const saveRoutines = async (updatedRoutines: WorkoutRoutine[]) => {
    try {
      await AsyncStorage.setItem(
        'userRoutines',
        JSON.stringify(updatedRoutines)
      );
      setRoutines(updatedRoutines);
    } catch (error) {
      console.error('Error saving routines:', error);
    }
  };

  const createRoutine = () => {
    if (!routineName.trim()) {
      Alert.alert('Error', 'Ingresa un nombre para la rutina');
      return;
    }

    const newRoutine: WorkoutRoutine = {
      id: Date.now().toString(),
      name: routineName.trim(),
      exercises: [],
    };

    const updatedRoutines = [...routines, newRoutine];
    saveRoutines(updatedRoutines);
    setRoutineName('');
    setShowAddRoutine(false);
    setCurrentRoutine(newRoutine);

    // Update quest progress for routine creation
    if ((global as any).updateQuestProgress) {
      (global as any).updateQuestProgress('monthly', 1); // Monthly routine creation
    }
  };

  const addExerciseToRoutine = () => {
    if (!currentRoutine) return;

    if (!exerciseName.trim() || !exerciseSets || !exerciseReps) {
      Alert.alert('Error', 'Completa todos los campos obligatorios');
      return;
    }

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName.trim(),
      sets: parseInt(exerciseSets),
      reps: exerciseReps.trim(),
      weight: exerciseWeight.trim() || 'Peso Corporal',
      restTime: parseInt(exerciseRestTime) || 60,
    };

    const updatedRoutine = {
      ...currentRoutine,
      exercises: [...currentRoutine.exercises, newExercise],
    };

    const updatedRoutines = routines.map((r) =>
      r.id === currentRoutine.id ? updatedRoutine : r
    );

    saveRoutines(updatedRoutines);
    setCurrentRoutine(updatedRoutine);

    // Reset form
    setExerciseName('');
    setExerciseSets('');
    setExerciseReps('');
    setExerciseWeight('');
    setExerciseRestTime('');
    setShowAddExercise(false);
  };

  const addExistingExercise = (exercise: Exercise) => {
    if (!currentRoutine) return;

    const newExercise = { ...exercise, id: Date.now().toString() };
    const updatedRoutine = {
      ...currentRoutine,
      exercises: [...currentRoutine.exercises, newExercise],
    };

    const updatedRoutines = routines.map((r) =>
      r.id === currentRoutine.id ? updatedRoutine : r
    );

    saveRoutines(updatedRoutines);
    setCurrentRoutine(updatedRoutine);
  };

  const removeExercise = (exerciseId: string) => {
    if (!currentRoutine) return;

    const updatedRoutine = {
      ...currentRoutine,
      exercises: currentRoutine.exercises.filter((e) => e.id !== exerciseId),
    };

    const updatedRoutines = routines.map((r) =>
      r.id === currentRoutine.id ? updatedRoutine : r
    );

    saveRoutines(updatedRoutines);
    setCurrentRoutine(updatedRoutine);
  };

  const deleteRoutine = (routineId: string) => {
    Alert.alert(
      'Eliminar Rutina',
      '¿Estás seguro de que quieres eliminar esta rutina?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            const updatedRoutines = routines.filter((r) => r.id !== routineId);
            saveRoutines(updatedRoutines);
            if (currentRoutine?.id === routineId) {
              setCurrentRoutine(null);
            }
          },
        },
      ]
    );
  };

  const selectRoutine = (routine: WorkoutRoutine) => {
    setCurrentRoutine(routine);
  };

  const startEditRoutine = (routine: WorkoutRoutine) => {
    setEditingRoutine(routine);
    setEditingRoutineName(routine.name);
    setShowEditRoutine(true);
  };

  const saveEditedRoutine = () => {
    if (!editingRoutine || !editingRoutineName.trim()) {
      Alert.alert('Error', 'Ingresa un nombre válido para la rutina');
      return;
    }

    const updatedRoutine = {
      ...editingRoutine,
      name: editingRoutineName.trim(),
    };

    const updatedRoutines = routines.map((r) =>
      r.id === editingRoutine.id ? updatedRoutine : r
    );

    saveRoutines(updatedRoutines);

    // Update current routine if it's the one being edited
    if (currentRoutine?.id === editingRoutine.id) {
      setCurrentRoutine(updatedRoutine);
    }

    setShowEditRoutine(false);
    setEditingRoutine(null);
    setEditingRoutineName('');
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
        <Text style={styles.title}>RUTINAS</Text>
        <TouchableOpacity
          onPress={() => setShowAddRoutine(true)}
          style={styles.addButton}
        >
          <Plus size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!currentRoutine ? (
          // Lista de rutinas
          <>
            <Text style={styles.sectionTitle}>Mis Rutinas</Text>
            {routines.length === 0 ? (
              <Text style={styles.emptyText}>No tienes rutinas creadas</Text>
            ) : (
              routines.map((routine) => (
                <TouchableOpacity
                  key={routine.id}
                  style={styles.routineCard}
                  onPress={() => selectRoutine(routine)}
                >
                  <View style={styles.routineHeader}>
                    <Dumbbell size={24} color="#FFFFFF" />
                    <View style={styles.routineInfo}>
                      <Text style={styles.routineName}>{routine.name}</Text>
                      <Text style={styles.routineDetails}>
                        {routine.exercises.length} ejercicios
                      </Text>
                    </View>
                  </View>
                  <View style={styles.routineActions}>
                    <TouchableOpacity
                      onPress={() => startEditRoutine(routine)}
                      style={styles.editButton}
                    >
                      <Text style={styles.editButtonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteRoutine(routine.id)}
                      style={styles.deleteButton}
                    >
                      <Trash2 size={20} color="#FF4444" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </>
        ) : (
          // Vista de rutina específica
          <>
            <View style={styles.routineHeader}>
              <TouchableOpacity
                onPress={() => setCurrentRoutine(null)}
                style={styles.backToListButton}
              >
                <ChevronLeft size={20} color="#FFFFFF" />
                <Text style={styles.backToListText}>Volver</Text>
              </TouchableOpacity>
              <View style={styles.routineActions}>
                <TouchableOpacity
                  onPress={() => startEditRoutine(currentRoutine)}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteRoutine(currentRoutine.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={20} color="#FF4444" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.routineTitle}>{currentRoutine.name}</Text>

            <TouchableOpacity
              style={styles.addExerciseButton}
              onPress={() => setShowAddExercise(true)}
            >
              <Plus size={20} color="#000000" />
              <Text style={styles.addExerciseText}>Agregar Ejercicio</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Ejercicios</Text>
            {currentRoutine.exercises.length === 0 ? (
              <Text style={styles.emptyText}>
                No hay ejercicios en esta rutina
              </Text>
            ) : (
              currentRoutine.exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseDetails}>
                      {exercise.sets} series • {exercise.reps} reps •{' '}
                      {exercise.weight}
                    </Text>
                    <Text style={styles.exerciseRest}>
                      Descanso: {exercise.restTime}s
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeExercise(exercise.id)}
                    style={styles.removeExerciseButton}
                  >
                    <Trash2 size={16} color="#FF4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>

      {/* Modal para crear rutina */}
      <Modal
        visible={showAddRoutine}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddRoutine(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva Rutina</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la rutina"
              placeholderTextColor="#888888"
              value={routineName}
              onChangeText={setRoutineName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddRoutine(false);
                  setRoutineName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addModalButton]}
                onPress={createRoutine}
              >
                <Text style={styles.addButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar ejercicio */}
      <Modal
        visible={showAddExercise}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddExercise(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentLarge}>
            <Text style={styles.modalTitle}>Agregar Ejercicio</Text>

            <Text style={styles.subTitle}>Ejercicios Disponibles</Text>
            <TextInput
              style={styles.input}
              placeholder="Buscar ejercicios..."
              placeholderTextColor="#888888"
              value={exerciseSearch}
              onChangeText={setExerciseSearch}
            />
            <ScrollView
              style={styles.exercisesList}
              showsVerticalScrollIndicator={false}
            >
              {availableExercises
                .filter((exercise) =>
                  exercise.name
                    .toLowerCase()
                    .includes(exerciseSearch.toLowerCase())
                )
                .map((exercise) => (
                  <TouchableOpacity
                    key={exercise.id}
                    style={styles.exerciseOption}
                    onPress={() => addExistingExercise(exercise)}
                  >
                    <Dumbbell size={20} color="#FFFFFF" />
                    <View style={styles.exerciseOptionInfo}>
                      <Text style={styles.exerciseOptionName}>
                        {exercise.name}
                      </Text>
                      <Text style={styles.exerciseOptionDetails}>
                        {exercise.sets} series • {exercise.reps} reps •{' '}
                        {exercise.weight}
                      </Text>
                    </View>
                    <Plus size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.subTitle}>Crear Ejercicio Personalizado</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del ejercicio"
              placeholderTextColor="#888888"
              value={exerciseName}
              onChangeText={setExerciseName}
            />
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputSmall]}
                placeholder="Series"
                placeholderTextColor="#888888"
                value={exerciseSets}
                onChangeText={setExerciseSets}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.inputSmall]}
                placeholder="Reps"
                placeholderTextColor="#888888"
                value={exerciseReps}
                onChangeText={setExerciseReps}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Peso (opcional)"
              placeholderTextColor="#888888"
              value={exerciseWeight}
              onChangeText={setExerciseWeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Tiempo de descanso (segundos)"
              placeholderTextColor="#888888"
              value={exerciseRestTime}
              onChangeText={setExerciseRestTime}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddExercise(false);
                  setExerciseName('');
                  setExerciseSets('');
                  setExerciseReps('');
                  setExerciseWeight('');
                  setExerciseRestTime('');
                  setExerciseSearch('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addModalButton]}
                onPress={addExerciseToRoutine}
              >
                <Text style={styles.addButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar rutina */}
      <Modal
        visible={showEditRoutine}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditRoutine(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Rutina</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la rutina"
              placeholderTextColor="#888888"
              value={editingRoutineName}
              onChangeText={setEditingRoutineName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowEditRoutine(false);
                  setEditingRoutine(null);
                  setEditingRoutineName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addModalButton]}
                onPress={saveEditedRoutine}
              >
                <Text style={styles.addButtonText}>Guardar</Text>
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
  addButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    marginTop: 16,
    fontWeight: '300',
    letterSpacing: 1,
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  routineCard: {
    backgroundColor: '#111111',
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routineInfo: {
    marginLeft: 12,
    flex: 1,
  },
  routineName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  routineDetails: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '300',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  backToListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backToListText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  routineTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 1,
    marginBottom: 16,
  },
  addExerciseButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  addExerciseText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  exerciseCard: {
    backgroundColor: '#111111',
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  exerciseDetails: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  exerciseRest: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '300',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  removeExerciseButton: {
    padding: 8,
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
  modalContentLarge: {
    backgroundColor: '#111111',
    borderRadius: 0,
    padding: 20,
    width: '95%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 1,
  },
  subTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 16,
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
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputSmall: {
    flex: 1,
  },
  exercisesList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  exerciseOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 12,
    marginBottom: 6,
    gap: 12,
  },
  exerciseOptionInfo: {
    flex: 1,
  },
  exerciseOptionName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  exerciseOptionDetails: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '300',
    letterSpacing: 0.5,
    marginTop: 2,
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
  addModalButton: {
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
  routineActions: {
    flexDirection: 'row',
    gap: 8,
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
});
