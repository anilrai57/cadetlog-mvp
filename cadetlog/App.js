import React, { useMemo, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenHeader from "./src/components/ScreenHeader";
import Chip from "./src/components/Chip";
import Tile from "./src/components/Tile";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ShipScreen from "./src/screens/ShipScreen";
import LogScreen from "./src/screens/LogScreen";
import AddEntryScreen from "./src/screens/AddEntryScreen";
import EditEntryScreen from "./src/screens/EditEntryScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import ExportScreen from "./src/screens/ExportScreen";
import { RANKS, SHIP_TYPES, CATEGORIES } from "./src/constants/masterData";
import { STORAGE_KEYS, saveToStorage, loadFromStorage, clearAllStorage } from "./src/storage/storage";
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
    <LoginScreen
      screen={screen}
      setScreen={setScreen}
      crewId={crewId}
      setCrewId={setCrewId}
      password={password}
      setPassword={setPassword}
      login={login}
    />
  );
}
if (screen === "home") {
  return (
    <HomeScreen
      screen={screen}
      setScreen={setScreen}
      profile={profile}
      ship={ship}
      entryDate={entryDate}
      monthlyTotals={monthlyTotals}
      unproductiveHours={unproductiveHours}
      docHours={docHours}
      studyHours={studyHours}
      clearAllData={clearAllData}
    />
  );
}
  
  if (screen === "ship") {
  return <ShipScreen screen={screen} setScreen={setScreen} ship={ship} setShip={setShip} />;
}

  if (screen === "log") {
  return (
    <LogScreen
      screen={screen}
      setScreen={setScreen}
      entryDate={entryDate}
      entries={entries}
      requireShipDetails={requireShipDetails}
      openEditEntry={openEditEntry}
    />
  );
}

if (screen === "add") {
  return (
    <AddEntryScreen
      screen={screen}
      setScreen={setScreen}
      entryDate={entryDate}
      setEntryDate={setEntryDate}
      category={category}
      setCategory={setCategory}
      hours={hours}
      setHours={setHours}
      desc={desc}
      setDesc={setDesc}
      saveEntry={saveEntry}
    />
  );
}
// ADD THE EDIT SCREEN
if (screen === "edit") {
  return (
    <EditEntryScreen
      screen={screen}
      setScreen={setScreen}
      selectedEntry={selectedEntry}
      setSelectedEntry={setSelectedEntry}
      editDate={editDate}
      setEditDate={setEditDate}
      editCategory={editCategory}
      setEditCategory={setEditCategory}
      editHours={editHours}
      setEditHours={setEditHours}
      editDesc={editDesc}
      setEditDesc={setEditDesc}
      saveEditedEntry={saveEditedEntry}
      deleteSelectedEntry={deleteSelectedEntry}
    />
  );
}

  if (screen === "dash") {
  return (
    <DashboardScreen
      screen={screen}
      setScreen={setScreen}
      monthlyTotals={monthlyTotals}
      unproductiveHours={unproductiveHours}
      docHours={docHours}
      studyHours={studyHours}
    />
  );
}

  if (screen === "export") {
  return <ExportScreen screen={screen} setScreen={setScreen} />;
}

  return null;
}
