import React from "react";
import { Pressable, Text } from "react-native";

export default function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 18,
        marginRight: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: selected ? "#111" : "#d9d9d9",
        backgroundColor: selected ? "#111" : "#fff",
      }}
    >
      <Text style={{ color: selected ? "#fff" : "#111", fontSize: 13, fontWeight: "600" }}>
        {label}
      </Text>
    </Pressable>
  );
}