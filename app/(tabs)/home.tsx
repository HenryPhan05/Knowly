import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeLayout() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>Knowly</Text>
        <View style={styles.profilePlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Today's Focus Section */}
        <Text style={styles.sectionTitle}>Today's Focus</Text>
        <TodaysTask title="Do homework" isCompleted={false} />
        <TodaysTask title="Go Shopping" isCompleted={true} />
        <TodaysTask title="Do the chores" isCompleted={false} />

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>ADD NEW FOCUS</Text>
        </TouchableOpacity>

        {/* Upcoming Deadlines Section */}
        <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
        <DeadlineTasks
          title="Finish Knowly"
          label="CRITICAL"
          time="In 2 days"
        />
        <DeadlineTasks
          title="Finish WebDev Project"
          label="PROJECT"
          time="In 5 days"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const TodaysTask = ({
  title,
  isCompleted,
}: {
  title: string;
  isCompleted: boolean;
}) => {
  return (
    <View style={styles.taskCard}>
      <View style={styles.taskLeftSection}>
        <View
          style={[styles.checkbox, isCompleted && styles.checkboxChecked]}
        />
        <View>
          <Text style={[styles.taskTitle, isCompleted && styles.completedText]}>
            {title}
          </Text>
          {isCompleted && (
            <Text style={styles.completedLabel}>✓ Completed</Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const DeadlineTasks = ({
  title,
  label,
  time,
}: {
  title: string;
  label: string;
  time: string;
}) => {
  return (
    <View style={styles.deadlineCard}>
      <View style={styles.deadlineIndicator} />
      <View style={styles.deadlineInfo}>
        <View style={styles.deadlineHeader}>
          <Text style={styles.deadlineLabel}>{label}</Text>
          <Text style={styles.deadlineTime}>{time}</Text>
        </View>
        <Text style={styles.deadlineTitle}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#737ACB",
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3E5D8",
  },
  content: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 15,
  },
  // Task Card Styles
  taskCard: {
    flexDirection: "row",
    backgroundColor: "#F0F4FF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  taskLeftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: "#737ACB",
    borderRadius: 4,
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: "#2D6A4F",
    borderColor: "#2D6A4F",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  completedText: {
    color: "#8E8E8E",
  },
  completedLabel: {
    fontSize: 12,
    color: "#8E8E8E",
  },
  deleteButton: {
    backgroundColor: "#FF0000",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#5C63D1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  // Deadline Styles
  deadlineCard: {
    flexDirection: "row",
    backgroundColor: "#F0F4FF",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  deadlineIndicator: {
    width: 6,
    backgroundColor: "#5C63D1",
  },
  deadlineInfo: {
    flex: 1,
    padding: 16,
  },
  deadlineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  deadlineLabel: {
    color: "#5C63D1",
    fontWeight: "800",
    fontSize: 12,
  },
  deadlineTime: {
    color: "#8E8E8E",
    fontSize: 12,
  },
  deadlineTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
});
