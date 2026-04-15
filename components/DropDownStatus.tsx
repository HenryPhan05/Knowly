import { useTheme } from '@/hook/useTheme';
import { taskProgress } from '@/styles/theme';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
type TaskStatus = 'Not started' | 'In progress' | 'Done!';
type DropDownStatusProps = {
  selected: TaskStatus;
  onChange: (value: TaskStatus) => void;
};
const DropDownStatus = ({ selected, onChange }: DropDownStatusProps) => {
  const options: TaskStatus[] = ["Not started", "In progress", "Done!"];
  const [open, setOpen] = useState<boolean>(false);
  const theme = useTheme();
  const getColor = (value: string) => {
    if (value === "Done!") return taskProgress.done;
    if (value === "In progress") return taskProgress.inProgress;
    return theme.colors.notStartedButton;
  };


  return (

    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: getColor(selected) }]}
        onPress={() => setOpen(!open)}
      >
        <Text style={{ color: "#000" }}>{selected}</Text>
        {selected && (<Text>{open ? "▲" : "▼"}</Text>)}
      </TouchableOpacity>

      {selected && open && (
        <View style={styles.dropdown}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selected === option && {
                  backgroundColor: getColor(option),
                },
              ]}
              onPress={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

export default DropDownStatus

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 30,

  },
  button: {

    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
    top: 30,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  option: {
    padding: 10,
  },
});