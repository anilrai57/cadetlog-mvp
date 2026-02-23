import React from "react";
import { SafeAreaView, ScrollView, Text, TextInput, View, Pressable, Alert } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import Chip from "../components/Chip";
import { SHIP_TYPES } from "../constants/masterData";

export default function ShipScreen({ screen, setScreen, ship, setShip }) {
  function sectionTitle(text) {
    return <Text style={{ fontSize: 12, color: "#555", marginBottom: 8, marginTop: 12 }}>{text}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScreenHeader title="My Ship Details" showTabs={true} screen={screen} setScreen={setScreen} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {sectionTitle("Ship Name")}
        <TextInput
          value={ship.shipName}
          onChangeText={(v) => setShip((p) => ({ ...p, shipName: v }))}
          placeholder="e.g. MV Ocean Star"
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 }}
        />

        {sectionTitle("Ship Type (Select one)")}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {SHIP_TYPES.map((t) => (
            <Chip
              key={t}
              label={t}
              selected={ship.shipType === t}
              onPress={() => setShip((p) => ({ ...p, shipType: t }))}
            />
          ))}
        </View>

        {sectionTitle("Sign-on Date (YYYY-MM-DD)")}
        <TextInput
          value={ship.signOn}
          onChangeText={(v) => setShip((p) => ({ ...p, signOn: v }))}
          placeholder="2026-02-01"
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 }}
        />

        {sectionTitle("Sign-off Date (blank if sailing)")}
        <TextInput
          value={ship.signOff}
          onChangeText={(v) => setShip((p) => ({ ...p, signOff: v }))}
          placeholder=""
          style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 }}
        />

        <Pressable
          onPress={() => Alert.alert("Saved (MVP)", "Ship details saved locally (demo).")}
          style={{ backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 18 }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Save</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}