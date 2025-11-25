import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  restTime: string;
}

export default function CreateRoutineScreen() {
  const router = useRouter();
  const [routineName, setRoutineName] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = availableExercises.filter(exercise =>
    exercise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableExercises = [
    'Press de Banca',
    'Sentadillas',
    'Dominadas',
    'Curl de Bíceps',
    'Extensiones de Tríceps',
    'Remo con Barra',
    'Press Militar',
    'Peso Muerto',
  ];

  const addExercise = (exerciseName: string) => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: 3,
      reps: '10',
      weight: '',
      restTime: '60',
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const updateExercise = (
    id: string,
    field: keyof Exercise,
    value: string | number
  ) => {
    setExercises(
      exercises.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const saveRoutine = async () => {
    if (!routineName.trim() || exercises.length === 0) {
      alert('Por favor, agrega un nombre y al menos un ejercicio.');
      return;
    }

    const newRoutine = {
      id: Date.now().toString(),
      name: routineName,
      exercises: exercises.map(ex => ({
        ...ex,
        restTime: parseInt(ex.restTime) || 60,
      })),
    };

    try {
      const existingRoutines = await AsyncStorage.getItem('userRoutines');
      const routines = existingRoutines ? JSON.parse(existingRoutines) : [];
      routines.push(newRoutine);
      await AsyncStorage.setItem('userRoutines', JSON.stringify(routines));
      alert('Rutina guardada exitosamente!');
      router.back();
    } catch (error) {
      console.error('Error saving routine:', error);
      alert('Error al guardar la rutina.');
    }
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
        <Text style={styles.title}>CREAR RUTINA</Text>
        <TouchableOpacity onPress={saveRoutine} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la rutina"
          placeholderTextColor="#888888"
          value={routineName}
          onChangeText={setRoutineName}
        />

        <Text style={styles.sectionTitle}>Ejercicios Agregados</Text>
        {exercises.map((exercise) => (
          <View key={exercise.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <TouchableOpacity onPress={() => removeExercise(exercise.id)}>
                <X size={20} color="#FF4444" />
              </TouchableOpacity>
            </View>

            <View style={styles.exerciseDetails}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Series</Text>
                <TextInput
                  style={styles.smallInput}
                  value={exercise.sets.toString()}
                  onChangeText={(value) =>
                    updateExercise(exercise.id, 'sets', parseInt(value) || 1)
                  }
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reps</Text>
                <TextInput
                  style={styles.smallInput}
                  value={exercise.reps}
                  onChangeText={(value) =>
                    updateExercise(exercise.id, 'reps', value)
                  }
                  placeholder="10"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Peso (kg)</Text>
                <TextInput
                  style={styles.smallInput}
                  value={exercise.weight}
                  onChangeText={(value) =>
                    updateExercise(exercise.id, 'weight', value)
                  }
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Descanso (s)</Text>
                <TextInput
                  style={styles.smallInput}
                  value={exercise.restTime}
                  onChangeText={(value) =>
                    updateExercise(exercise.id, 'restTime', value)
                  }
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Agregar Ejercicio</Text>
        <TextInput
          style={styles.input}
          placeholder="Buscar ejercicio..."
          placeholderTextColor="#888888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {filteredExercises.map((exercise) => (
          <TouchableOpacity
            key={exercise}
            style={styles.addExerciseButton}
            onPress={() => addExercise(exercise)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addExerciseText}>{exercise}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#00FF88',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  input: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
    fontWeight: '600',
  },
  exerciseCard: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    minWidth: 70,
  },
  label: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  smallInput: {
    backgroundColor: '#222222',
    borderWidth: 1,
    borderColor: '#444444',
    borderRadius: 6,
    padding: 8,
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  addExerciseText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginLeft: 12,
  },
});
