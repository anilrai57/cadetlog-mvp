import React, { useMemo } from "react";
import { SafeAreaView, View, Text, FlatList, Pressable } from "react-native";
import ScreenHeader from "../components/ScreenHeader";

export default function LogScreen({
  screen,
  setScreen,
  entryDate,
  entries,
  requireShipDetails,
  openEditEntry,
}) {
  const todaysEntries = useMemo(() => entries.filter((e) => e.date === entryDate), [entries, entryDate]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScreenHeader title={`Daily Log (${entryDate})`} showTabs={true} screen={screen} setScreen={setScreen} />
      <View style={{ padding: 16, flex: 1 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={() => {
              if (!requireShipDetails()) return;
              setScreen("add");
            }}
            style={{ backgroundColor: "#111", padding: 12, borderRadius: 12, flex: 1, alignItems: "center" }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>Add Entry</Text>
          </Pressable>

          <Pressable
            onPress={() => setScreen("dash")}
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              padding: 12,
              borderRadius: 12,
              flex: 1,
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "800" }}>Dashboard</Text>
          </Pressable>
        </View>

        <Text style={{ marginTop: 14, marginBottom: 8, color: "#555" }}>Entries for {entryDate}</Text>

        <FlatList
          data={todaysEntries}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => openEditEntry(item)}>
              <View style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 12 }}>
                <Text style={{ fontWeight: "800" }}>{item.category}</Text>
                <Text style={{ color: "#555", marginTop: 4 }}>{item.hours.toFixed(1)} hrs</Text>
                <Text style={{ color: "#111", marginTop: 8 }}>{item.desc}</Text>
                <Text style={{ color: "#777", marginTop: 8, fontSize: 12 }}>Tap to edit</Text>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={<Text style={{ color: "#777" }}>No entries yet for this date.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}