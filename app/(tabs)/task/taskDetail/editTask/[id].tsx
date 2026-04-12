import { useTheme } from '@/hook/useTheme';
import { updateTaskDetail } from '@/lib/supabaseImplemented';
import { TaskStatus } from '@/lib/type';
import { logo, taskProgress } from '@/styles/theme';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
const fromSupabaseDate = (d: string) => {
  if (!d) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [yyyy, mm, dd] = d.split('-');
    return `${mm}/${dd}/${yyyy}`;
  }
  return d;
};
const EditTask = () => {
  const theme = useTheme();
  const style = styles(theme);

  const params = useLocalSearchParams<any>();
  const getParam = (p: any) => Array.isArray(p) ? p[0] : p;

  const taskId = getParam(params.id);

  const [editTitle, setEditTitle] = useState(getParam(params.title));
  const [editSubtitle, setEditSubtitle] = useState(getParam(params.subtitle));
  const [editDescription, setEditDescription] = useState(getParam(params.description));
  const [editStatus, setEditStatus] = useState<TaskStatus>(getParam(params.status));

  const [startDate, setStartDate] = useState(fromSupabaseDate(getParam(params.start_date) || ""));
  const [startClock, setStartClock] = useState((getParam(params.start_time) || "").slice(0, 5));

  const [endDate, setEndDate] = useState(fromSupabaseDate(getParam(params.end_date) || ""));
  const [endClock, setEndClock] = useState((getParam(params.end_time) || "").slice(0, 5));


  const [error, setError] = useState("");

  // ===== helpers =====

  const formatDate = (text: string) => {
    const c = text.replace(/\D/g, '');
    if (c.length <= 2) return c;
    if (c.length <= 4) return `${c.slice(0, 2)}/${c.slice(2)}`;
    return `${c.slice(0, 2)}/${c.slice(2, 4)}/${c.slice(4, 8)}`;
  };

  const formatTime = (text: string) => {
    const c = text.replace(/\D/g, '');
    if (c.length <= 2) return c;
    return `${c.slice(0, 2)}:${c.slice(2, 4)}`;
  };

  const isValidDate = (date: string) => {
    const r = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!r.test(date)) return false;
    const [m, d, y] = date.split('/').map(Number);
    const check = new Date(y, m - 1, d);
    return check.getMonth() === m - 1;
  };

  const isValidTime = (time: string) =>
    /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

  const parseDateTime = (date: string, time: string) => {
    const [m, d, y] = date.split('/').map(Number);
    const [h, min] = time.split(':').map(Number);
    return new Date(y, m - 1, d, h, min);
  };

  const handleUpdate = async () => {
    try {
      if (
        !isValidDate(startDate) ||
        !isValidDate(endDate) ||
        !isValidTime(startClock) ||
        !isValidTime(endClock)
      ) {
        setError("Invalid date or time");
        return;
      }

      const toSupabaseDate = (d: string) => {
        const parts = d.split('/');
        if (parts.length === 3) {
          const [mm, dd, yyyy] = parts;
          return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
        }
        return d;
      };
      await updateTaskDetail(taskId, {
        title: editTitle,
        subtitle: editSubtitle,
        description: editDescription,
        status: editStatus,
        start_date: toSupabaseDate(startDate),
        end_date: toSupabaseDate(endDate),
        start_time: startClock + ':00',
        end_time: endClock + ':00',
      });
      router.back();
    }
    catch (error: any) {

      setError(error.message);
    }
  };
  const handleCancel = () => {
    router.back();
  }
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: theme.colors.background }}>
      <ScrollView style={style.body}>

        {/* TASK */}
        <View style={style.taskSection}>
          <Text style={style.label}>TASK TITLE</Text>
          <View style={style.titleSection}>
            <TextInput value={editTitle} onChangeText={setEditTitle} style={style.input} />
          </View>

          <Text style={style.label}>TASK SUBTITLE</Text>
          <View style={style.titleSection}>
            <TextInput value={editSubtitle} onChangeText={setEditSubtitle} style={style.input} />
          </View>

          <Text style={style.label}>DESCRIPTION</Text>
          <View style={style.descriptionSection}>
            <TextInput
              value={editDescription}
              onChangeText={setEditDescription}
              multiline
              textAlignVertical="top"
              style={style.textarea}
            />
          </View>

          <Text style={style.label}>STATUS</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {["Not started", "In progress", "Done!"].map((s) => (
              <TouchableOpacity key={s} onPress={() => setEditStatus(s as TaskStatus)}>
                <View style={{
                  width: 90,
                  height: 35,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  backgroundColor:
                    editStatus === s
                      ? s === "Done!"
                        ? taskProgress.done
                        : s === "In progress"
                          ? taskProgress.inProgress
                          : theme.colors.notStartedButton
                      : "#ECF1FF"
                }}>
                  <Text style={{ fontWeight: 'bold' }}>{s}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* TIME */}
        <View style={style.scheduleSection}>
          <Text style={style.label}>START TIME</Text>

          <View style={style.dateSection}>
            <TextInput
              value={startDate}
              onChangeText={(t) => setStartDate(formatDate(t))}
              keyboardType="numeric"
              placeholder="MM/DD/YYYY"
              placeholderTextColor={theme.colors.text}
              style={style.input}
            />
          </View>

          <View style={style.dateSection}>
            <TextInput
              value={startClock}
              onChangeText={(t) => setStartClock(formatTime(t))}
              keyboardType="numeric"
              placeholder="HH:mm"
              placeholderTextColor={theme.colors.text}
              style={style.input}
            />
          </View>
        </View>

        <View style={style.scheduleSection}>
          <Text style={style.label}>END TIME</Text>

          <View style={style.dateSection}>
            <TextInput
              value={endDate}
              onChangeText={(t) => setEndDate(formatDate(t))}
              keyboardType="numeric"
              placeholder="MM/DD/YYYY"
              placeholderTextColor={theme.colors.text}
              style={style.input}
            />
          </View>

          <View style={style.dateSection}>
            <TextInput
              value={endClock}
              onChangeText={(t) => setEndClock(formatTime(t))}
              keyboardType="numeric"
              placeholder="HH:mm"
              placeholderTextColor={theme.colors.text}
              style={style.input}
            />
          </View>
        </View>

        {error ? <Text style={{ color: theme.colors.errorText }}>{error}</Text> : null}

        <TouchableOpacity onPress={handleUpdate}>
          <View style={style.editButton}>
            <Text style={{ color: "#fff", fontWeight: 'bold' }}>Save</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCancel}
        >
          <View style={style.cancelButton}>
            <Text style={{ color: logo.text, fontWeight: 'bold' }}>Cancel</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default EditTask;

const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: StatusBar.currentHeight,
    },
    label: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.colors.progressText,
    },
    input: {
      flex: 1,
      color: theme.colors.text,
    },
    textarea: {
      flex: 1,
      textAlignVertical: 'top',
      height: 120,
      color: theme.colors.text,
    },
    taskSection: {
      width: 342,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      padding: 24,
      gap: 8,
    },
    titleSection: {
      height: 60,
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      padding: 16,
    },
    descriptionSection: {
      height: 120,
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      padding: 16,
    },
    scheduleSection: {
      width: 342,
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 12,
      padding: 20,
      gap: 10,
      marginTop: 20,
    },
    dateSection: {
      height: 44,
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      justifyContent: 'center',
      paddingHorizontal: 16,
    },
    editButton: {
      marginTop: 20,
      width: 342,
      height: 56,
      borderRadius: 100,
      backgroundColor: logo.text,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelButton: {
      marginTop: 5,
      width: 342,
      height: 56,
      borderRadius: 100,
      backgroundColor: '#B0C4FF',
      justifyContent: 'center',
      alignItems: 'center',
    }
  });