import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Calendar as CalendarIcon } from 'lucide-react-native';

export default function CalendarTabScreen() {
  // Datos de ejemplo para el calendario
  const calendarData = [
    { date: '2025-11-20', routine: 'Rutina Superior', completed: true },
    { date: '2025-11-19', routine: 'Rutina Full Body', completed: true },
    { date: '2025-11-18', routine: 'Rutina Inferior', completed: false },
    { date: '2025-11-21', routine: 'Rutina Superior', completed: false },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CALENDARIO</Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Próximos Entrenamientos</Text>

        {calendarData.map((item, index) => (
          <View key={index} style={styles.calendarItem}>
            <View style={styles.dateContainer}>
              <CalendarIcon size={20} color="#888888" />
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <Text style={styles.routineText}>{item.routine}</Text>
            <View
              style={[
                styles.statusIndicator,
                item.completed && styles.completed,
              ]}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.scheduleButton}>
          <Text style={styles.scheduleButtonText}>Agendar Nueva Rutina</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
    fontWeight: '600',
  },
  calendarItem: {
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 8,
  },
  routineText: {
    fontSize: 16,
    color: '#CCCCCC',
    fontWeight: '500',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888888',
    position: 'absolute',
    right: 16,
    top: 16,
  },
  completed: {
    backgroundColor: '#00FF88',
  },
  scheduleButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
});
