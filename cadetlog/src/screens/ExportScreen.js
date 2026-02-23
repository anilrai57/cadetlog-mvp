import React from "react";
import { SafeAreaView, View, Text, Pressable, Alert } from "react-native";
import ScreenHeader from "../components/ScreenHeader";

export default function ExportScreen({ screen, setScreen }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScreenHeader title="Export (MVP Demo)" showTabs={true} screen={screen} setScreen={setScreen} />
      <View style={{ padding: 16 }}>
        <Text style={{ color: "#555" }}>
          In the full build, this screen will generate a PDF/Excel report from the server. For now it confirms the flow.
        </Text>

        <Pressable
          onPress={() => Alert.alert("Export (MVP)", "Later: PDF/Excel will be generated for the selected date range.")}
          style={{ backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 18 }}
        >
          <Text style={{ color: "#fff", fontWeight: "900" }}>Generate Report</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}