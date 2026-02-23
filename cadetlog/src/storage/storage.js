import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  ship: "CADETLOG_ship_v1",
  entries: "CADETLOG_entries_v1",
  entryDate: "CADETLOG_entryDate_v1",
  alerts: "CADETLOG_alerts_v1",
};

export async function saveToStorage(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // ignore in MVP
  }
}

export async function loadFromStorage(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

export async function clearAllStorage() {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ship,
      STORAGE_KEYS.entries,
      STORAGE_KEYS.entryDate,
      STORAGE_KEYS.alerts,
    ]);
  } catch (e) {
    // ignore in MVP
  }
}