import React from "react";
import { View, Text } from "react-native";

export default function Tile({ title, value }) {
  return (
    <View
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: "#e6e6e6",
        borderRadius: 12,
        padding: 12,
        margin: 6,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 12, color: "#555" }}>{title}</Text>
      <Text style={{ fontSize: 18, marginTop: 6, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}