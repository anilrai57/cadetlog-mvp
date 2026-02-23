import React from "react";
import { SafeAreaView, ScrollView, Text, TextInput, View, Pressable } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import Chip from "../components/Chip";
import { CATEGORIES } from "../constants/masterData";

export default function EditEntryScreen({
  screen,
  setScreen,
  selectedEntry,
  setSelectedEntry,
  editDate,
  setEditDate,
  editCategory,
  setEditCategory,
  editHours,
  setEditHours,
  editDesc,
  setEditDesc,
  saveEditedEntry,
  deleteSelectedEntry,
}) {
  function sectionTitle(text) {
    return <Text style={{ fontSize: 12, color: "#555", marginBottom: 8, marginTop: 12 }}>{text}</Text>;
  }

  if (!selectedEntry) {
    // safety fallback
    setScreen("log");
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScreenHeader title="Edit Work Entry" showTabs={true} screen={screen} setScreen={setScreen} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {sectionTitle("Entry Date (YYYY-MM-DD)")}
        <TextInput
          value={editDate}
          onChangeText={setEditDate}
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 }}
        />

        {sectionTitle("Category (Select one)")}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} selected={editCategory === c} onPress={() => setEditCategory(c)} />
          ))}
        </View>

        {sectionTitle("Hours (0.5 steps)")}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            onPress={() => setEditHours((h) => Math.max(0.5, Math.round((h - 0.5) * 10) / 10))}
            style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 10 }}
          >
            <Text style={{ fontWeight: "800" }}>-</Text>
          </Pressable>

          <Text style={{ marginHorizontal: 16, fontSize: 16, fontWeight: "900" }}>
            {editHours.toFixed(1)} hrs
          </Text>

          <Pressable
            onPress={() => setEditHours((h) => Math.min(24, Math.round((h + 0.5) * 10) / 10))}
            style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 10 }}
          >
            <Text style={{ fontWeight: "800" }}>+</Text>
          </Pressable>
        </View>

        {sectionTitle("Description (max 300)")}
        <TextInput
          value={editDesc}
          onChangeText={setEditDesc}
          placeholder="Write short note..."
          multiline
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginTop: 6, height: 90 }}
        />

        <Pressable
          onPress={saveEditedEntry}
          style={{ backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 18 }}
        >
          <Text style={{ color: "#fff", fontWeight: "900" }}>Save Changes</Text>
        </Pressable>

        <Pressable
          onPress={deleteSelectedEntry}
          style={{
            borderWidth: 1,
            borderColor: "#d33",
            padding: 14,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ fontWeight: "900", color: "#d33" }}>Delete Entry</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setSelectedEntry(null);
            setScreen("log");
          }}
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