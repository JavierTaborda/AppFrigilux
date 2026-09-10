import AsyncStorage from "@react-native-async-storage/async-storage";

const LOGIN_HISTORY_DISABLED_KEY = "loginHistoryDisabled";

function getKey(userId: string) {
  return `${LOGIN_HISTORY_DISABLED_KEY}:${userId}`;
}

export async function getLoginHistoryDisabled(userId?: string): Promise<boolean> {
  if (!userId) return false;

  try {
    return (await AsyncStorage.getItem(getKey(userId))) === "true";
  } catch {
    return false;
  }
}

export async function setLoginHistoryDisabled(
  userId: string,
  value: boolean,
): Promise<void> {
  await AsyncStorage.setItem(getKey(userId), value ? "true" : "false");
}
