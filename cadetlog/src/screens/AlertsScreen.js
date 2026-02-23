import React from "react";
import { SafeAreaView, View, Text, Pressable, FlatList, Alert } from "react-native";
import ScreenHeader from "../components/ScreenHeader";

export default function AlertsScreen({ screen, setScreen, alerts, clearPendingAlerts }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScreenHeader title="Alerts Queue" showTabs={true} screen={screen} setScreen={setScreen} />
      <View style={{ padding: 16, flex: 1 }}>
        <Text style={{ color: "#555", marginBottom: 10 }}>
          These are Unproductive Work alerts saved offline. In the next phase, they will be auto-sent to office when online.
        </Text>
        <Text style={{ marginBottom: 10, fontWeight: "900" }}>Queued alerts: {alerts.length}</Text>

        <Pressable
          onPress={() => {
            Alert.alert("Confirm", "Clear all pending alerts?", [
              { text: "Cancel", style: "cancel" },
              { text: "Clear", style: "destructive", onPress: clearPendingAlerts },
            ]);
          }}
          style={{
            borderWidth: 1,
            borderColor: "#d33",
            padding: 12,
            borderRadius: 12,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "#d33", fontWeight: "900" }}>Clear Pending Alerts</Text>
        </Pressable>

        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <View style={{ borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 12 }}>
              <Text style={{ fontWeight: "900" }}>{item.status.toUpperCase()}</Text>
              <Text style={{ color: "#555", marginTop: 6 }}>Crew ID: {item.crewId}</Text>
              <Text style={{ color: "#555", marginTop: 6 }}>
                {item.date} • {item.hours.toFixed(1)} hrs
              </Text>
              <Text style={{ color: "#555", marginTop: 6 }}>
                {item.shipName} ({item.shipType})
              </Text>
              <Text style={{ marginTop: 8 }}>{item.desc}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: "#777" }}>No queued alerts.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}