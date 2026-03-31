import { StyleSheet, Text, View, ScrollView, Button } from 'react-native'
import React from 'react'
import { useContext } from 'react'
import { ThemeContext, ThemeProvider } from '@/components/ThemeContext'

const KnowlyApp = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>Knowly</Text>
      </View>
    </View>
  )
}

const Deadlines = [
  { id: 1, title: 'Project Proposal', dueDate: '2024-07-01' },
  { id: 2, title: 'Midterm Report', dueDate: '2024-08-15' },
  { id: 3, title: 'Final Presentation', dueDate: '2024-09-30' },
];

export default function HomeLayout() {
  return (
    <View style={styles.container}>
      <KnowlyApp />
      <View style={styles.centeredContent}>
        <Text style={styles.text}>Home Screen</Text>
      </View>
    </View>
  );
}

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
  },
  logoText: {
    fontSize: 30,
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
  }
});

/*import { ThemeContext } from '@/components/ThemeContext'
export default function Home() {
  const { isDark, toggleTheme } = useContext(ThemeContext)!;*/