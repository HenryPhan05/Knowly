import { StyleSheet, Text, View, ScrollView, Button } from 'react-native'
import React from 'react'
import { useContext } from 'react'
import { ThemeContext, ThemeProvider } from '@/components/ThemeContext'


export default function HomeLayout() {
  return (
    <View style={styles.container}>
      <KnowlyApp />
      <View style={styles.centeredContent}>
        <TodaysTask title="Complete project proposal" isCompleted={false} />
        <TodaysTask title="Review team feedback" isCompleted={true} />
        <DeadlineTasks time="2024-06-30 23:59" />
      </View>
    </View>
  );
}
// this is the main component for the home screen, it will contain the header and the main content of the home screen
const KnowlyApp = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Knowly</Text>
      </View>
    </View>
  )
}
// Almost done this, need to work on the button and add some more features to it
const TodaysTask = ({ title, isCompleted }: { title: string; isCompleted: boolean }) => {
  return (
    <View style={styles.taskWrapper}>
      <view style={styles.TaskCard}>
        <Text>{title}</Text>
        <Button title={isCompleted ? "Completed" : "Press to Complete"} onPress={() => {}} />
      </view>

    </View>
  )}
// Messing around with the deadline tasks component, will add more features to it later on.
  const DeadlineTasks = ({ time }: { time: string }) => {
    return (
      <View style={styles.taskWrapper}>
        <View style={styles.TaskCard}>
        <Text>Deadline: {time}</Text>
      </View>
      </View>
    );
  }

//const { isDark, toggleTheme } = useContext(ThemeContext)!;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'black',
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#737ACB',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskWrapper: {
    marginVertical: 6,
  },
  TaskCard:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#737ACB',
    padding: 16,
    borderRadius: 16,
  }
});
