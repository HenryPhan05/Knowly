import React from "react";
import { StyleSheet, Switch, View } from "react-native";

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export default function ToggleSwitch({ value, onValueChange }: Props) {
  return (
    <View style={styles.container}>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
});