import { useTheme } from '@/hook/useTheme';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

import { logo } from '@/styles/theme';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';

import { useAuth } from '@/hook/useAuth';
import { deleteTask } from '@/lib/supabaseImplemented';
import { TaskDetail } from '@/lib/type';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTaskDetail } from '@/lib/supabaseImplemented';
type TaskStatus = 'Not started' | 'In progress' | 'Done!';
const ViewTask = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const style = styles(theme);
  const params = useLocalSearchParams<any>();

  const getParam = (param: any) => (
    Array.isArray(param) ? param[0] : param
  )
  const [task, setTask] = useState({
    title: getParam(params.title),
    subtitle: getParam(params.subtitle),
    description: getParam(params.description),
    status: getParam(params.status) as TaskStatus,
    start_date: getParam(params.start_date),
    end_date: getParam(params.end_date),
    start_time: getParam(params.start_time),
    end_time: getParam(params.end_time),
  });
  const taskId = getParam(params.id);
  useFocusEffect(
    React.useCallback(() => {
      if (!user) return;
      const fetchTask = async () => {
        const allTasks = await getTaskDetail(user.id);
        const found = allTasks.find(t => String(t.id) === taskId);
        if (found) setTask(found);
      };
      fetchTask();
    }, [user, taskId])
  );

  const title = task.title;
  const subtitle = task.subtitle;
  const description = task.description;
  const status = task.status;
  const startDate = task.start_date;
  const endDate = task.end_date;
  const startTime = task.start_time;
  const endTime = task.end_time;

  const [selectStatus, setSelectedStatus] = useState<TaskStatus>('Not started');
  const handleStatus = (selectedStatus: TaskStatus) => {
    setSelectedStatus(selectedStatus);
  }
  const handleEditTask = (task: TaskDetail) => {
    router.push({
      pathname: "/(tabs)/task/taskDetail/editTask/[id]",
      params: task,
    })
  }
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      router.back();
    }
    catch (err: any) {
      alert(err.message);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor: theme.colors.background }}>
      <ScrollView style={style.body}>
        <View style={style.taskSection}>
          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 11, color: theme.colors.progressText, fontWeight: 'bold' }}>TASK TITLE</Text>
            <View style={style.titleSection}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: theme.colors.text }}>{title}</Text>
            </View>
          </View>
          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 11, color: theme.colors.progressText, fontWeight: 'bold' }}>TASK SUBTITLE</Text>
            <View style={style.titleSection}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: theme.colors.text }}>{subtitle}</Text>
            </View>
          </View>
          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 11, color: theme.colors.progressText, fontWeight: 'bold' }}>DESCRIPTION</Text>
            <View style={style.descriptionSection}>
              <ScrollView showsVerticalScrollIndicator={true}>
                <Text style={{ fontSize: 14, color: theme.colors.text }}>{description}</Text>
              </ScrollView>
            </View>
          </View>
          <View style={{ gap: 5 }}>
            <Text style={{ fontSize: 11, color: theme.colors.progressText, fontWeight: 'bold' }}>STATUS</Text>
            <View style={style.titleSection}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: theme.colors.text }}>{status}</Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20, }} >
          <Text style={{ fontSize: 18, fontWeight: "900", color: theme.colors.text }}>Schedule Details</Text>
          <View style={style.scheduleSection} >
            <Text style={{ color: logo.text, fontSize: 14, fontWeight: "bold" }}>START TIME</Text>
            <View style={style.dateSection} >
              <Text style={{ fontSize: 14, fontWeight: "bold", color: theme.colors.text }}>{startDate}</Text>
              <FontAwesome name='calendar' size={20} />
            </View>
            <View style={style.dateSection}>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: theme.colors.text }}>{startTime}</Text>
              <AntDesign name='clock-circle' size={20} />
            </View>
          </View>

          <View style={style.scheduleSection} >
            <Text style={{ color: logo.text, fontSize: 14, fontWeight: "bold" }}>END TIME</Text>
            <View style={style.dateSection} >
              <Text style={{ fontSize: 14, fontWeight: "bold", color: theme.colors.text }}>{endDate}</Text>
              <FontAwesome name='calendar' size={20} />
            </View>
            <View style={style.dateSection}>
              <Text style={{ fontSize: 14, fontWeight: "bold", color: theme.colors.text }}>{endTime}</Text>
              <AntDesign name='clock-circle' size={20} />
            </View>
          </View>
        </View>

        <View style={{ gap: 10, marginBottom: 30, }}>
          <TouchableOpacity
            onPress={() => handleEditTask(params)}
            activeOpacity={0.7}>
            <View style={style.editButton}>
              <FontAwesome name='edit' size={20} color={"#FFF"} />
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }}>Edit Task</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7}
            onPress={() => handleDeleteTask(taskId)}>
            <View style={style.deleteButton}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }}>Delete Task</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView >
    </SafeAreaView>
  )
}

export default ViewTask

const styles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: StatusBar.currentHeight,
  },
  taskSection: {
    width: 342,

    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: 24,
    gap: 8,
  },
  titleSection: {
    width: 294,
    height: 60,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 16,
  },
  descriptionSection: {
    width: 294,
    height: 120,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 16,
  },
  scheduleSection: {
    width: 342,
    height: 174,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    gap: 10,

  },
  dateSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 302,
    height: 44,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  editButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: 342,
    height: 56,
    borderRadius: 100,
    backgroundColor: logo.text,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: 342,
    height: 56,
    borderRadius: 100,
    backgroundColor: theme.colors.errorText,
  }
})