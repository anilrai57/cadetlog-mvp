import React from "react";
import { View, Text } from "react-native";
import Chip from "./Chip";

export default function ScreenHeader({ title, showTabs, screen, setScreen }) {
  const tabs = ["home", "ship", "log", "dash", "export"];
  return (
    <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee", backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 18, fontWeight: "800" }}>{title}</Text>
      {showTabs ? (
        <View style={{ flexDirection: "row", marginTop: 10, flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <Chip key={t} label={t.toUpperCase()} selected={screen === t} onPress={() => setScreen(t)} />
          ))}
        </View>
      ) : null}
    </View>
  );
}