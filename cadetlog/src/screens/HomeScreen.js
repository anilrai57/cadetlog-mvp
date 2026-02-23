import React from "react";
import { SafeAreaView, View, Text, Pressable } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import Tile from "../components/Tile";

export default function HomeScreen({
  screen,
  setScreen,
  profile,
  ship,
  entryDate,
  monthlyTotals,
  unproductiveHours,
  docHours,
  studyHours,
  clearAllData,
}) {
  const voyageStatus = ship.signOff ? "Voyage Closed" : "Sailing (Sign-off blank)";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScreenHeader title="Home" showTabs={true} screen={screen} setScreen={setScreen} />
      <View style={{ padding: 16 }}>
        <View style={{ backgroundColor: "#fff", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#eee" }}>
          <Text style={{ fontSize: 14, fontWeight: "800" }}>{profile.fullName}</Text>
          <Text style={{ color: "#555", marginTop: 4 }}>
            {profile.rank} • {profile.bomid}
          </Text>

          <View style={{ height: 10 }} />
          <Text style={{ color: "#555" }}>Ship: {ship.shipName}</Text>
          <Text style={{ color: "#555", marginTop: 4 }}>Type: {ship.shipType}</Text>
          <Text style={{ color: "#555", marginTop: 4 }}>Status: {voyageStatus}</Text>
          <Text style={{ color: "#555", marginTop: 4 }}>Entry Date: {entryDate}</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 12 }}>
          <Tile title="Total Hours (month)" value={monthlyTotals.totalHours.toFixed(1)} />
          <Tile title="Unproductive (month)" value={unproductiveHours.toFixed(1)} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Tile title="Documentation (month)" value={docHours.toFixed(1)} />
          <Tile title="Study Time (month)" value={studyHours.toFixed(1)} />
        </View>

        <Pressable
          onPress={() => setScreen("log")}
          style={{ backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 10 }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Go to Daily Log</Text>
        </Pressable>

        <Pressable
          onPress={clearAllData}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            padding: 14,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Text style={{ fontWeight: "800" }}>Clear All Data</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}