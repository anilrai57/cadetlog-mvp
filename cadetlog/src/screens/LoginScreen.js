import React from "react";
import { SafeAreaView, View, Text, TextInput, Pressable } from "react-native";
import ScreenHeader from "../components/ScreenHeader";

export default function LoginScreen({
  screen,
  setScreen,
  crewId,
  setCrewId,
  password,
  setPassword,
  login,
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScreenHeader title="CADETLOG" showTabs={false} screen={screen} setScreen={setScreen} />
      <View style={{ padding: 16 }}>
        <Text style={{ color: "#555", marginBottom: 18 }}>
          Supporting structured cadet training. Login allowed only for active cadets.
        </Text>

        <Text style={{ fontSize: 12, color: "#555", marginBottom: 8, marginTop: 12 }}>Crew ID</Text>
        <TextInput
          value={crewId}
          onChangeText={setCrewId}
          placeholder="e.g. AE12345"
          autoCapitalize="characters"
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 10,
            padding: 12,
          }}
        />

        <Text style={{ fontSize: 12, color: "#555", marginBottom: 8, marginTop: 12 }}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 10,
            padding: 12,
          }}
        />

        <Pressable
          onPress={login}
          style={{
            backgroundColor: "#111",
            padding: 14,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 18,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}