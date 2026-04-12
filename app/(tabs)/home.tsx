import Header from "@/components/Header";
import { ThemeContext } from "@/components/ThemeContext";
import { useAuth } from "@/hook/useAuth";
import { useTheme } from "@/hook/useTheme";
import { addTodo, deleteTodo, getTaskDetail, getTodos, toggleTodo } from "@/lib/supabaseImplemented";
import type { TaskDetail } from "@/lib/type";
import { logo, taskProgress } from "@/styles/theme";
import { useFocusEffect } from "expo-router";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Todo = {
  id: number;
  title: string;
  is_completed: boolean;
  date: string;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext)!;
  // ===== TODOS =====
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // ===== TASKS =====
  const [tasks, setTasks] = useState<TaskDetail[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      if (!user) return;
      setIsLoading(true);
      // fetch todos today
      const fetchTodos = async () => {
        try {
          const data = await getTodos(user.id);
          setTodos(data);
        } catch (err) {
          console.error(err);
        }
      };

      // fetch upcoming tasks
      const fetchTasks = async () => {
        try {
          const data = await getTaskDetail(user.id);
          setTasks(data);
        } catch (err) {
          console.error(err);
        }
      };

      fetchTodos();
      fetchTasks();
      setIsLoading(false)
    }, [user])
  );

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim() || !user) return;
    try {
      const created = await addTodo(user.id, newTodoTitle.trim());
      setTodos(prev => [...prev, created]);
      setNewTodoTitle('');
      setShowAddModal(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleTodo = async (id: number, current: boolean) => {
    try {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, is_completed: !current } : t));
      await toggleTodo(id, !current);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setTodos(prev => prev.filter(t => t.id !== id));
      await deleteTodo(id);
    } catch (err) {
      console.error(err);
    }
  };


  const upcomingTasks = tasks
    .filter(t => t.status !== 'Done!')
    .sort((a, b) => {
      if (!a.end_date) return 1;
      if (!b.end_date) return -1;
      return new Date(a.end_date).getTime() - new Date(b.end_date).getTime();
    });

  const getDaysLeft = (endDate: string) => {
    if (!endDate) return '';
    const [year, month, day] = endDate.split('-').map(Number);
    const end = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diff = end.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `In ${days} day${days > 1 ? 's' : ''}`;
    if (days === 0) return 'Today!';
    return `${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} overdue`;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'In progress') return 'IN PROGRESS';
    if (status === 'Not started') return 'NOT STARTED';
    return status.toUpperCase();
  };
  if (isLoading) {
    return (
      <View style={[styles.isLoading, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size='large' />
      </View>
    )
  }
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, }]}>
      {/* Header */}
      <View style={{ margin: 10 }}>
        <Header />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ===== TODAY'S FOCUS ===== */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Today&apos;s Focus</Text>


        <View style={[styles.todoContainer, { backgroundColor: theme.colors.cardBackground }]}>
          {todos.length === 0 ? (
            <Text style={{ color: theme.colors.progressText, padding: 12, textAlign: 'center' }}>
              No tasks for today!
            </Text>
          ) : (
            <ScrollView
              style={{ maxHeight: 220 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {todos.map(todo => (
                <View key={todo.id} style={[styles.todoItem, { borderBottomColor: theme.colors.background }]}>
                  <TouchableOpacity
                    style={styles.todoLeft}
                    onPress={() => handleToggleTodo(todo.id, todo.is_completed)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkbox, todo.is_completed && styles.checkboxChecked]} />
                    <View>
                      <Text style={[
                        styles.todoTitle,
                        { color: theme.colors.text },
                        todo.is_completed && styles.completedText
                      ]}>
                        {todo.title}
                      </Text>
                      {todo.is_completed && <Text style={styles.completedLabel}>✓ Completed</Text>}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteTodo(todo.id)}>
                    <View style={styles.deleteButton}>
                      <Text style={styles.deleteText}>✕</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Add button bên trong container */}
          <TouchableOpacity
            style={styles.addFocusButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addFocusText}>+ ADD NEW FOCUS</Text>
          </TouchableOpacity>
        </View>

        {/* ===== UPCOMING DEADLINES ===== */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Upcoming Deadlines</Text>

        <View style={[styles.todoContainer, { backgroundColor: theme.colors.cardBackground }]}>
          {upcomingTasks.length === 0 ? (
            <Text style={{ color: theme.colors.progressText, padding: 12, textAlign: 'center' }}>
              No upcoming tasks 🎉
            </Text>
          ) : (
            <ScrollView
              style={{ maxHeight: 260 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {upcomingTasks.map(task => (
                <View key={task.id} style={[styles.deadlineItem, { borderBottomColor: theme.colors.background }]}>
                  <View style={[styles.deadlineIndicator, {
                    backgroundColor: logo.text,
                  }]} />
                  <View style={styles.deadlineInfo}>
                    <View style={styles.deadlineHeader}>
                      <Text style={[styles.deadlineLabel, {
                        color: task.status === "Not started" ? taskProgress.notStarted :
                          task.status === "In progress" ? taskProgress.inProgress :
                            taskProgress.done,
                        fontSize: 12,
                        fontWeight: '900',
                      }]}
                      >
                        {getStatusLabel(task.status)}
                      </Text>
                      <Text style={{ color: theme.colors.progressText, fontSize: 12 }}>
                        {getDaysLeft(task.end_date)}
                      </Text>
                    </View>
                    <Text style={[styles.deadlineTitle, { color: theme.colors.text }]}>{task.title}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

      </ScrollView>

      {/* Modal Add Todo */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>New Focus</Text>
            <TextInput
              placeholder="What do you want to focus on?"
              placeholderTextColor={theme.colors.progressText}
              value={newTodoTitle}
              onChangeText={setNewTodoTitle}
              style={[styles.modalInput, { color: theme.colors.text }]}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => { setShowAddModal(false); setNewTodoTitle(''); }}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddTodo}>
                <Text style={{ color: 'green', fontWeight: 'bold' }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  isLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logoText: { fontSize: 32, fontWeight: "900", color: logo.text },
  profilePlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#F3E5D8" },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  sectionTitle: { fontSize: 22, fontWeight: "700", marginTop: 20, marginBottom: 12 },

  // Todo container
  todoContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  todoLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkbox: {
    width: 22, height: 22,
    borderWidth: 2, borderColor: logo.text,
    borderRadius: 4, marginRight: 12,
  },
  checkboxChecked: { backgroundColor: "#2D6A4F", borderColor: "#2D6A4F" },
  todoTitle: { fontSize: 15, fontWeight: "600" },
  completedText: { color: "#8E8E8E", textDecorationLine: 'line-through' },
  completedLabel: { fontSize: 11, color: "#8E8E8E" },
  deleteButton: {
    width: 28, height: 28,
    borderRadius: 5,
    backgroundColor: '#FF4444',
    justifyContent: 'center', alignItems: 'center',
  },
  deleteText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  addFocusButton: {
    padding: 14,
    alignItems: 'center',
  },
  addFocusText: { color: logo.text, fontWeight: '700', fontSize: 13 },

  // Deadline
  deadlineItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  deadlineIndicator: { width: 5 },
  deadlineInfo: { flex: 1, padding: 14 },
  deadlineHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  deadlineLabel: { fontWeight: '800', fontSize: 11 },
  deadlineTitle: { fontSize: 15, fontWeight: '700' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
