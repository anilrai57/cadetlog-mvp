import React, { useMemo, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";

const RANKS = ["Deck Cadet", "Engine Cadet", "ETO Cadet"];

const SHIP_TYPES = [
  "Oil Tanker",
  "Product Tanker",
  "Chemical Tanker",
  "LPG Carrier",
  "LNG Carrier",
  "Bulk Carrier",
  "Container Vessel",
  "Offshore Vessel",
  "Other",
];

const CATEGORIES = [
  "Navigation Watch",
  "Deck Maintenance",
  "Deck Operations",
  "E/R Operations",
  "Machinery Maintenance",
  "LSA / FFA",
  "Cargo Operations",
  "Mooring Stations",
  "Ship Housekeeping Work",
  "Documentation & Reporting",
  "Unproductive Work",
  "Rest / Holiday",
  "Study Time",
  "Other",
];
const STORAGE_KEYS = {
  ship: "CADETLOG_ship_v1",
  entries: "CADETLOG_entries_v1",
  entryDate: "CADETLOG_entryDate_v1"
};

async function saveToStorage(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // ignore in MVP
  }
}

async function loadFromStorage(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function Chip({ label, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 18,
        marginRight: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: selected ? "#111" : "#d9d9d9",
        backgroundColor: selected ? "#111" : "#fff",
      }}
    >
      <Text style={{ color: selected ? "#fff" : "#111", fontSize: 13, fontWeight: "600" }}>
        {label}
      </Text>
    </Pressable>
  );
}

function Tile({ title, value }) {
  return (
    <View
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: "#e6e6e6",
        borderRadius: 12,
        padding: 12,
        margin: 6,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 12, color: "#555" }}>{title}</Text>
      <Text style={{ fontSize: 18, marginTop: 6, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}

function ScreenHeader({ title, showTabs, screen, setScreen }) {
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

function sectionTitle(text) {
  return <Text style={{ fontSize: 12, color: "#555", marginBottom: 8, marginTop: 12 }}>{text}</Text>;
}

export default function App() {
  const [screen, setScreen] = useState("login"); // login | home | ship | log | add | dash | export

  // Login (MVP demo)
  const [crewId, setCrewId] = useState("");
  const [password, setPassword] = useState("");
 // ✅ ADD THIS LINE HERE
  const [hydrated, setHydrated] = useState(false);

  // Mock profile (later: fetched from server)
  const [profile] = useState({
    fullName: "Sample Cadet",
    rank: RANKS[0],
    bomid: "BOM56877",
  });

  // Ship details (voyage)
  const [ship, setShip] = useState({
    shipName: "MV Ocean Star",
    shipType: SHIP_TYPES[0],
    signOn: "2026-02-01",
    signOff: "",
  });

  // Daily entry form
  const [entryDate, setEntryDate] = useState("2026-02-22");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [hours, setHours] = useState(2.0);
  const [desc, setDesc] = useState("");
// ✅ ADD RIGHT HERE
const [selectedEntry, setSelectedEntry] = useState(null);

// Edit form fields
const [editDate, setEditDate] = useState("");
const [editCategory, setEditCategory] = useState(CATEGORIES[0]);
const [editHours, setEditHours] = useState(2.0);
const [editDesc, setEditDesc] = useState("");
  // Entries (later: local DB + sync)
  const [entries, setEntries] = useState([]);

useEffect(() => {
  (async () => {
    const savedShip = await loadFromStorage(STORAGE_KEYS.ship, null);
    const savedEntries = await loadFromStorage(STORAGE_KEYS.entries, null);
    const savedEntryDate = await loadFromStorage(STORAGE_KEYS.entryDate, null);

    if (savedShip) setShip(savedShip);
    if (Array.isArray(savedEntries)) setEntries(savedEntries);

    if (savedEntryDate) setEntryDate(savedEntryDate);
     setHydrated(true); 
  })();
}, []);
useEffect(() => {
  if (!hydrated) return;
  saveToStorage(STORAGE_KEYS.ship, ship);
}, [hydrated, ship]);

useEffect(() => {
  if (!hydrated) return;
  saveToStorage(STORAGE_KEYS.entries, entries);
}, [hydrated, entries]);

useEffect(() => {
  if (!hydrated) return;
  saveToStorage(STORAGE_KEYS.entryDate, entryDate);
}, [hydrated, entryDate]);


  const todaysEntries = useMemo(() => entries.filter((e) => e.date === entryDate), [entries, entryDate]);

  const monthlyTotals = useMemo(() => {
    const monthKey = entryDate.slice(0, 7);
    const inMonth = entries.filter((e) => e.date.startsWith(monthKey));
    const totals = {};
    let totalHours = 0;
    for (const e of inMonth) {
      totals[e.category] = (totals[e.category] || 0) + e.hours;
      totalHours += e.hours;
    }
    return { totals, totalHours };
  }, [entries, entryDate]);

  const unproductiveHours = monthlyTotals.totals["Unproductive Work"] || 0;
  const docHours = monthlyTotals.totals["Documentation & Reporting"] || 0;
  const studyHours = monthlyTotals.totals["Study Time"] || 0;

  function login() {
    if (!crewId.trim() || !password.trim()) {
      Alert.alert("Missing details", "Please enter Crew ID and password.");
      return;
    }
    setScreen("home");
  }

  function requireShipDetails() {
    if (!ship.shipName.trim() || !ship.signOn.trim() || !ship.shipType.trim()) {
      Alert.alert("Ship details required", "Please fill My Ship Details before logging work.");
      setScreen("ship");
      return false;
    }
    return true;
  }

  function saveEntry() {
    if (!requireShipDetails()) return;

    if (!desc.trim()) {
      Alert.alert("Description required", "Please add a short description (max 300 characters).");
      return;
    }
    if (desc.length > 300) {
      Alert.alert("Too long", "Please keep description within 300 characters.");
      return;
    }
    if (!category) {
      Alert.alert("Category required", "Please select a category.");
      return;
    }

    const newEntry = {
      id: String(Date.now()),
      date: entryDate,
      category,
      hours,
      desc,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setDesc("");

    if (category === "Unproductive Work") {
      Alert.alert(
        "Alert (MVP demo)",
        "In the full build, this will send an email alert to cadets@angloeastern.com after sync."
      );
    }

    setScreen("log");
  }

  // HELPER FUNCTION
  function openEditEntry(entry) {
  setSelectedEntry(entry);
  setEditDate(entry.date);
  setEditCategory(entry.category);
  setEditHours(entry.hours);
  setEditDesc(entry.desc);
  setScreen("edit");
}

function saveEditedEntry() {
  if (!selectedEntry) return;

  if (!editDesc.trim()) {
    Alert.alert("Description required", "Please add a short description (max 300 characters).");
    return;
  }
  if (editDesc.length > 300) {
    Alert.alert("Too long", "Please keep description within 300 characters.");
    return;
  }
  if (!editCategory) {
    Alert.alert("Category required", "Please select a category.");
    return;
  }
  if (!editDate || editDate.length < 10) {
    Alert.alert("Date required", "Please enter date in YYYY-MM-DD format.");
    return;
  }

  const updated = {
    ...selectedEntry,
    date: editDate,
    category: editCategory,
    hours: editHours,
    desc: editDesc,
  };

  setEntries((prev) => prev.map((e) => (e.id === selectedEntry.id ? updated : e)));

  // Optional: update current entryDate so user sees edited item immediately
  setEntryDate(editDate);

  setSelectedEntry(null);
  setScreen("log");
}

function deleteSelectedEntry() {
  if (!selectedEntry) return;

  Alert.alert(
    "Delete entry?",
    "This will permanently delete the selected entry.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setEntries((prev) => prev.filter((e) => e.id !== selectedEntry.id));
          setSelectedEntry(null);
          setScreen("log");
        },
      },
    ]
  );
}

// ✅ PASTE HERE — RIGHT AFTER saveEntry()

async function clearAllData() {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.ship,
    STORAGE_KEYS.entries,
    STORAGE_KEYS.entryDate,
  ]);

  setShip({
    shipName: "MV Ocean Star",
    shipType: SHIP_TYPES[0],
    signOn: "2026-02-01",
    signOff: "",
  });
  setEntries([]);
  setEntryDate("2026-02-22");

  Alert.alert("Cleared", "All saved data cleared.");
}
  // ---------- Screens ----------
  if (screen === "login") {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScreenHeader title="CADETLOG" showTabs={false} screen={screen} setScreen={setScreen} />
        <View style={{ padding: 16 }}>
          <Text style={{ color: "#555", marginBottom: 18 }}>
            Supporting structured cadet training. Login allowed only for active cadets.
          </Text>

          {sectionTitle("Crew ID")}
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

          {sectionTitle("Password")}
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
            style={{ backgroundColor: "#111", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 18 }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (screen === "home") {
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

          

{/* ✅ ADD THIS RIGHT BELOW */}
<Pressable
  onPress={clearAllData}
  style={{
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10
  }}
>
  <Text style={{ fontWeight: "800" }}>Clear All Data</Text>
</Pressable>

        </View>
      </SafeAreaView>
    );
  }

  if (screen === "ship") {
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
              <Chip key={t} label={t} selected={ship.shipType === t} onPress={() => setShip((p) => ({ ...p, shipType: t }))} />
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

  if (screen === "log") {
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

  if (screen === "add") {
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
            <Text style={{ marginHorizontal: 16, fontSize: 16, fontWeight: "900" }}>{hours.toFixed(1)} hrs</Text>
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
// ADD THE EDIT SCREEN
if (screen === "edit") {
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

  if (screen === "dash") {
    const rows = Object.entries(monthlyTotals.totals).sort((a, b) => b[1] - a[1]);
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
              rows.map(([cat, hrs]) => (
                <View
                  key={cat}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 14,
                    borderBottomWidth: 1,
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

  if (screen === "export") {
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

  return null;
}
