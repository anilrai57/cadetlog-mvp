import React, { useMemo } from "react";
import { SafeAreaView, View, Text } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import Tile from "../components/Tile";

export default function DashboardScreen({
  screen,
  setScreen,
  monthlyTotals,
  unproductiveHours,
  docHours,
  studyHours,
}) {
  const rows = useMemo(() => Object.entries(monthlyTotals.totals).sort((a, b) => b[1] - a[1]), [monthlyTotals]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScreenHeader title="Dashboard" showTabs={true} screen={screen} setScreen={setScreen} />
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row" }}>
          <Tile title="Total Hours (month)" value={monthlyTotals.totalHours.toFixed(1)} />
          <Tile title="Unproductive (month)" value={unproductiveHours.toFixed(1)} />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Tile title="Documentation (month)" value={docHours.toFixed(1)} />
          <Tile title="Study Time (month)" value={studyHours.toFixed(1)} />
        </View>

        <Text style={{ marginTop: 14, marginBottom: 8, fontWeight: "900" }}>Category Totals</Text>
        <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#eee" }}>
          {rows.length === 0 ? (
            <Text style={{ padding: 14, color: "#555" }}>No entries for this month.</Text>
          ) : (
            rows.map(([cat, hrs], idx) => (
              <View
                key={cat}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 14,
                  borderBottomWidth: idx === rows.length - 1 ? 0 : 1,
                  borderBottomColor: "#f2f2f2",
                }}
              >
                <Text>{cat}</Text>
                <Text style={{ fontWeight: "900" }}>{hrs.toFixed(1)}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}