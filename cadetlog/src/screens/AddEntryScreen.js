import React from "react";
import { SafeAreaView, ScrollView, Text, TextInput, View, Pressable } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import Chip from "../components/Chip";
import { CATEGORIES } from "../constants/masterData";

export default function AddEntryScreen({
  screen,
  setScreen,
  entryDate,
  setEntryDate,
  category,
  setCategory,
  hours,
  setHours,
  desc,
  setDesc,
  saveEntry,
}) {
  function sectionTitle(text) {
    return <Text style={{ fontSize: 12, color: "#555", marginBottom: 8, marginTop: 12 }}>{text}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScreenHeader title="Add Work Entry" showTabs={true} screen={screen} setScreen={setScreen} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {sectionTitle("Entry Date (YYYY-MM-DD)")}
        <TextInput
          value={entryDate}
          onChangeText={setEntryDate}
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 }}
        />

        {sectionTitle("Category (Select one)")}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
          ))}
        </View>

        {sectionTitle("Hours (0.5 steps)")}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => setHours((h) => Math.max(0.5, Math.round((h - 0.5) * 10) / 10))}
            style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 10 }}
          >
            <Text style={{ fontWeight: "800" }}>-</Text>
          </Pressable>

          <Text style={{ marginHorizontal: 16, fontSize: 16, fontWeight: "900" }}>
            {hours.toFixed(1)} hrs
          </Text>

          <Pressable
            onPress={() => setHours((h) => Math.min(24, Math.round((h + 0.5) * 10) / 10))}
            style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 10 }}
          >
            <Text style={{ fontWeight: "800" }}>+</Text>
          </Pressable>
        </View>

        {sectionTitle("Description (max 300)")}
        <TextInput
          value={desc}
          onChangeText={setDesc}
          placeholder="Write short note..."
          multiline
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginTop: 6, height: 90 }}
        />

        <Pressable
          onPress={saveEntry}
          style={{ backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 18 }}
        >
          <Text style={{ color: "#fff", fontWeight: "900" }}>Save Entry</Text>
        </Pressable>

        <Pressable
          onPress={() => setScreen("log")}
          style={{
            padding: 14,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 10,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <Text style={{ fontWeight: "800" }}>Back</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}