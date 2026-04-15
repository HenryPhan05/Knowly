// task List
import DropDownStatus from '@/components/DropDownStatus'
import Header from '@/components/Header'
import { ThemeContext } from '@/components/ThemeContext'
import { useAuth } from '@/hook/useAuth'
import { useTheme } from '@/hook/useTheme'
import { addNewTask, deleteTask, getTaskDetail, updateTaskDetail } from '@/lib/supabaseImplemented'
import type { TaskDetail } from '@/lib/type'
import { logo as logoColor, taskProgress } from '@/styles/theme'
import { FontAwesome } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import React, { useContext, useState } from 'react'
import { Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

type TaskStatus = 'Not started' | 'In progress' | 'Done!';
const toSupabaseDate = (date: string): string => {
  if (!date) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const parts = date.split('/');
  if (parts.length === 3) {
    const [mm, dd, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
  }
  return date;
};
const formatDate = (text: string) => {
  const cleaned = text.replace(/\D/g, '');
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
};
// convert hour for user
const toSupabaseTime = (time: string): string => {
  if (!time) return '';
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
  return time;
};

const formatTime = (text: string) => {
  const cleaned = text.replace(/\D/g, '');
  if (cleaned.length <= 2) return cleaned;
  return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
};
const Index = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const { isDark } = useContext(ThemeContext)!;
  const style = styles(theme);
  const [selectStatus, setSelectedStatus] = useState<TaskStatus>('Not started');
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAddTask, setAddTask] = useState<boolean>(false);
  const [newTask, setNewTask] = useState({
    title: '',
    subtitle: '',
    description: '',
    status: 'Not started' as TaskStatus,
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  })

  const [tasks, setTasks] = useState<TaskDetail[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);


  const getDaysLeft = (endDate: string) => {
    if (!endDate) return '';

    const [year, month, day] = endDate.split('-').map(Number);
    const end = new Date(year, month - 1, day);

    const today = new Date();


    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diff = end.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
    if (days === 0) return 'today!';
    return `${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} overdue`;
  };
  const isValidDate = (date: string) => {
    if (!date) return false;

    const parts = date.split('/');
    if (parts.length !== 3) return false;

    const [mm, dd, yyyy] = parts.map(Number);

    if (!mm || !dd || !yyyy) return false;

    const test = new Date(yyyy, mm - 1, dd);

    return (
      test.getFullYear() === yyyy &&
      test.getMonth() === mm - 1 &&
      test.getDate() === dd
    );
  };
  //check valid of date- time
  const isPastDateTime = (dateStr: string, timeStr: string) => {
    const date = toSupabaseDate(dateStr);
    const time = toSupabaseTime(timeStr);

    const input = new Date(`${date}T${time}`);
    const now = new Date();

    return input < now;
  };
  //fetchTasks from supabase
  useFocusEffect(
    React.useCallback(() => {
      if (!user) return;
      const fetchTasks = async () => {
        try {
          setLoading(true);
          const data = await getTaskDetail(user.id);
          setTasks(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchTasks();
    }, [user])
  );
  const handleStatus = (selectedStatus: TaskStatus) => {
    setSelectedStatus(selectedStatus);
  }

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {

      const updatedTask = tasks.map((task) =>
        task.id === taskId ?
          { ...task, status: newStatus }
          : task
      );
      setTasks(updatedTask);
      await updateTaskDetail(taskId, { status: newStatus })

    }
    catch (err) {
      throw err;
    }
  }
  const handleAddTask = async () => {
    setAddTask(true);
    if (
      !newTask.title ||
      !newTask.subtitle ||
      !newTask.startDate ||
      !newTask.endDate ||
      !newTask.startTime ||
      !newTask.endTime
    ) {
      setErrorMsg("Need to complete all");
      return;
    }
    if (!isValidDate(newTask.startDate) || !isValidDate(newTask.endDate)) {

      setErrorMsg("Invalid date and time")
      return;
    }
    if (toSupabaseDate(newTask.endDate) < toSupabaseDate(newTask.startDate)) {
      setErrorMsg("End date must be after start date!");
      return;
    }

    if (isPastDateTime(newTask.endDate, newTask.endTime)) {

      setErrorMsg("End time cannot be in the past")
      return;
    }


    if (!user?.id) {
      alert("dont have user");
      return;
    }

    if (!newTask.title) return;
    // when done  --> add later
    if (!user?.id) {
      alert("dont have user");
      return;
    }
    try {
      const createdTask = await addNewTask({
        user_id: user.id,
        title: newTask.title,
        subtitle: newTask.subtitle,
        description: newTask.description,
        start_date: toSupabaseDate(newTask.startDate),
        end_date: toSupabaseDate(newTask.endDate),
        start_time: toSupabaseTime(newTask.startTime),
        end_time: toSupabaseTime(newTask.endTime),
        status: newTask.status,
      })
      if (createdTask) {
        setTasks((prev) => [...prev, createdTask]);
        setShowModal(false);
      }
      setNewTask({
        title: '',
        subtitle: '',
        description: '',
        status: 'Not started',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
      })
      setErrorMsg("");
      setAddTask(false);
    }
    catch (err: any) {
      alert(err.message);

    }
  }
  const handleDeleteTask = async (taskId: string) => {
    try {
      const newTaskList = tasks.filter((task) => task.id !== taskId);
      setTasks(newTaskList);
      await deleteTask(taskId);
    }
    catch (err) {
      throw err;
    }
  }
  const handlePressTask = (task: TaskDetail) => {
    router.push({
      pathname: "/task/taskDetail/ViewTask",
      params: task
    });
  };

  return (
    // isloading ==>
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ margin: 10 }}>
        <Header />
      </View >
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <Text style={style.headingText}>Tasks & Deadlines</Text>
        <View style={style.propressCard}>
          <Text style={style.progressHeading}>PROGRESS</Text>
          <Text style={style.numberProgress}>
            {tasks.length === 0 ? '0' : Math.round((tasks.filter(t => t.status === 'Done!').length / tasks.length) * 100)}%{' '}
            <Text style={style.completedText}>COMPLETED</Text>
          </Text>
          <View style={{ width: 294, height: 8, backgroundColor: isDark ? '#ECF1FF' : '#CDDDFE', borderRadius: 100 }}>
            <View style={{ width: tasks.length === 0 ? 0 : (tasks.filter(t => t.status === 'Done!').length / tasks.length) * 294, height: 8, backgroundColor: theme.colors.completedCheckbox, borderRadius: 100 }} />

          </View>
        </View>
        <View style={{}}>
          <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>

            <TouchableOpacity activeOpacity={0.7} onPress={() => handleStatus("Not started")}>
              <View style={{ alignItems: 'center', justifyContent: 'center', width: 100, height: 28, backgroundColor: selectStatus === "Not started" ? theme.colors.notStartedButton : "#ECF1FF", borderRadius: 5, marginBottom: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", }}>Not started</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={() => handleStatus("In progress")}>
              <View style={{ alignItems: 'center', justifyContent: 'center', width: 100, height: 28, backgroundColor: selectStatus === "In progress" ? taskProgress.inProgress : "#ECF1FF", borderRadius: 5, marginBottom: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", }}>In progress</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={() => handleStatus("Done!")}>
              <View style={{ alignItems: 'center', justifyContent: 'center', width: 100, height: 28, backgroundColor: selectStatus === "Done!" ? taskProgress.done : "#ECF1FF", borderRadius: 5, marginBottom: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: "700", }}>Done!</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </View>

      <ScrollView style={style.body} contentContainerStyle={{ flexDirection: 'column', alignItems: 'center', }}  >
        {/**header */}



        <View style={{ marginBottom: 20 }}>


          <View style={{ marginBottom: 10 }}>
            <View style={{ gap: 10 }}>
              {tasks.map((task) => (
                task.status === selectStatus && (

                  <View key={task.id} style={style.taskCard} >
                    {/**card section */}
                    <View style={style.subTitleSection}>

                      <View style={style.editSection}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: logoColor.text }}>{task.subtitle}</Text>
                        <TouchableOpacity key={task.id}
                          activeOpacity={0.7}
                          onPress={() => {
                            handlePressTask(task);
                          }}>
                          <FontAwesome name="eye" size={15} color={isDark ? "#FFF" : "#000"} />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity onPress={() => handleDeleteTask(task.id)}>
                        <FontAwesome name='remove' size={15} color={theme.colors.errorText} />
                      </TouchableOpacity>
                    </View>
                    <View style={style.titleSection}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: theme.colors.text }}>{task.title}</Text>
                      <View style={{ alignItems: 'center', justifyContent: 'center', width: 92, height: 26, backgroundColor: taskProgress.notStarted, borderRadius: 5, marginBottom: 10 }}>
                        <DropDownStatus selected={task.status}
                          onChange={(value) => handleUpdateTaskStatus(task.id, value)} />
                      </View>
                    </View>
                    <View>
                      <Text style={{ fontStyle: 'italic', fontSize: 12, color: theme.colors.progressText }}>{getDaysLeft(task.end_date)}</Text>
                    </View>
                  </View>

                )))}
            </View>
          </View>
        </View >
      </ScrollView >
      {/**modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={{

          flex: 1,
          justifyContent: 'center',
          marginBottom: 80,
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: 20
        }}>
          <View style={{
            backgroundColor: theme.colors.background,
            borderRadius: 12,
            padding: 20
          }}>

            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: theme.colors.text }}>
              New Task
            </Text>

            <TextInput
              placeholder="Title..."
              placeholderTextColor={theme.colors.progressText}
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5, color: theme.colors.text }}
            />

            <TextInput
              placeholder="Subtitle"
              value={newTask.subtitle}
              placeholderTextColor={theme.colors.progressText}
              onChangeText={(text) => setNewTask({ ...newTask, subtitle: text })}
              style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5, color: theme.colors.text }}
            />


            <TextInput
              placeholder="Description"
              placeholderTextColor={theme.colors.progressText}
              value={newTask.description}
              onChangeText={(text) => setNewTask({ ...newTask, description: text })}
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                marginBottom: 10,
                padding: 8,
                borderRadius: 5,
                height: 70,
                textAlignVertical: 'top',
                color: theme.colors.text,
              }}
            />
            {/* Start Date + Start Time */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
              <TextInput
                placeholder="Start MM/DD/YYYY"
                placeholderTextColor={theme.colors.progressText}
                value={newTask.startDate}
                keyboardType="numeric"
                maxLength={10}
                onChangeText={(text) => setNewTask({ ...newTask, startDate: formatDate(text) })}
                style={{ flex: 1, borderWidth: 1, padding: 8, borderRadius: 5, color: theme.colors.text }}
              />
              <TextInput
                placeholder="HH:MM"
                placeholderTextColor={theme.colors.progressText}
                value={newTask.startTime}
                keyboardType="numeric"
                maxLength={5}
                onChangeText={(text) => setNewTask({ ...newTask, startTime: formatTime(text) })}
                style={{ width: 80, borderWidth: 1, padding: 8, borderRadius: 5, color: theme.colors.text }}
              />
            </View>


            {/* End Date + End Time */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
              <TextInput
                placeholder="End MM/DD/YYYY"
                placeholderTextColor={theme.colors.progressText}
                value={newTask.endDate}
                keyboardType="numeric"
                maxLength={10}
                onChangeText={(text) => setNewTask({ ...newTask, endDate: formatDate(text) })}
                style={{ flex: 1, borderWidth: 1, padding: 8, borderRadius: 5, color: theme.colors.text }}
              />
              <TextInput
                placeholder="HH:MM"
                placeholderTextColor={theme.colors.progressText}
                value={newTask.endTime}
                keyboardType="numeric"
                maxLength={5}
                onChangeText={(text) => setNewTask({ ...newTask, endTime: formatTime(text) })}
                style={{ width: 80, borderWidth: 1, padding: 8, borderRadius: 5, color: theme.colors.text }}
              />

            </View>
            {/**error msg */}
            {errorMsg && isAddTask && (
              <Text style={{ color: theme.colors.errorText, marginBottom: 2, }}>{errorMsg}</Text>
            )}
            {/* Status */}
            <DropDownStatus
              selected={newTask.status}
              onChange={(value) => setNewTask({ ...newTask, status: value })}
            />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20
            }}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={{ color: 'red', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleAddTask}>
                <Text style={{ color: 'green', fontWeight: 'bold' }}>Add</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
      {/**handle new task */}
      <TouchableOpacity
        style={style.addTask}
        activeOpacity={0.8}
        onPress={() => {
          setShowModal(true)
        }}
      >
        <Text style={{ color: "#fff", fontSize: 11, fontWeight: 'bold' }}>ADD NEW TASK</Text>
      </TouchableOpacity >
    </SafeAreaView >
  )
}

export default Index

const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({

    body: {
      flex: 1,
      flexDirection: 'column',

      backgroundColor: theme.colors.background,
      padding: StatusBar.currentHeight,
      marginTop: 10,
    },
    textBody: {
      fontFamily: "Inter",
    },


    headingText: {
      fontSize: 35,
      fontWeight: '800',
      color: theme.colors.text,
      marginBottom: 5,
    },
    propressCard: {
      width: 342,
      height: 148,
      borderRadius: 24,
      backgroundColor: theme.colors.cardBackground,
      padding: 24,
      gap: 15,
      marginBottom: 30,

    },
    progressHeading: {
      color: theme.colors.progressText,
      fontSize: 14,
      fontWeight: '900',
    },
    numberProgress: {
      fontSize: 36,
      fontWeight: 'bold',
      color: theme.colors.completedCheckbox,
    },
    completedText: {
      fontSize: 13,
      color: theme.colors.completedCheckbox,
    },
    taskCard: {
      width: 342,
      height: 106,
      borderRadius: 12,
      backgroundColor: theme.colors.cardBackground,
      borderLeftWidth: 5,
      borderLeftColor: logoColor.text,
      padding: 10,
      gap: 7,
    },
    subTitleSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',

    },
    editSection: {
      flexDirection: 'row',
      gap: 10,
    },
    titleSection: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    addTask: {
      position: "absolute",
      bottom: 30,
      right: 20,
      width: 131,
      height: 36,
      borderRadius: 30,
      backgroundColor: logoColor.text,
      justifyContent: "center",
      alignItems: "center",
    },
  })