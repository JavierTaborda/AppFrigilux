import CustomDateTimePicker from "@/components/inputs/CustomDateTimePicker";
import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import CustomFlatList from "@/components/ui/CustomFlatList";
import FilterModal from "@/components/ui/FilterModal";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRefreshControl } from "@/utils/userRefreshControl";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
    getLoginHistory,
    LoginHistoryEntry,
} from "../services/LoginHistoryService";

const methodLabels = {
  password: "Contraseña",
  email_otp: "Código por correo",
  sms_otp: "Código por SMS",
} as const;

export default function LoginHistoryScreen() {
  const { role } = useAuthStore();
  const currentMonth = getCurrentMonthRange();
  const [entries, setEntries] = useState<LoginHistoryEntry[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [startDate, setStartDate] = useState(currentMonth.startDate);
  const [endDate, setEndDate] = useState(currentMonth.endDate);
  const [pendingStartDate, setPendingStartDate] = useState(
    currentMonth.startDate,
  );
  const [pendingEndDate, setPendingEndDate] = useState(currentMonth.endDate);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const { refreshing, canRefresh, cooldown, wrapRefresh, cleanup } =
    useRefreshControl(10);

  useEffect(() => cleanup, [cleanup]);

  const loadHistory = useCallback(
    async (rangeStart: Date, rangeEnd: Date, showLoader = true) => {
      if (showLoader) setLoading(true);
      try {
        setEntries(await getLoginHistory(rangeStart, rangeEnd));
      } catch {
        Alert.alert("Error", "No se pudo consultar el historial de accesos.");
      } finally {
        if (showLoader) setLoading(false);
      }
    },
    [],
  );

  const applyFilters = useCallback(async () => {
    setStartDate(pendingStartDate);
    setEndDate(pendingEndDate);
    setFilterVisible(false);
    setShowStartPicker(false);
    setShowEndPicker(false);
    await loadHistory(pendingStartDate, pendingEndDate);
  }, [loadHistory, pendingEndDate, pendingStartDate]);

  const clearFilters = useCallback(() => {
    const monthRange = getCurrentMonthRange();
    setPendingStartDate(monthRange.startDate);
    setPendingEndDate(monthRange.endDate);
    setStartDate(monthRange.startDate);
    setEndDate(monthRange.endDate);
    setShowStartPicker(false);
    setShowEndPicker(false);
  }, []);

  const closeFilters = useCallback(() => {
    setShowStartPicker(false);
    setShowEndPicker(false);
    setFilterVisible(false);
  }, []);

  const openFilters = useCallback(() => {
    setPendingStartDate(startDate);
    setPendingEndDate(endDate);
    setFilterVisible(true);
  }, [endDate, startDate]);

  const refreshHistory = useCallback(() => {
    wrapRefresh(
      async () => loadHistory(startDate, endDate, false),
      () => Alert.alert("Error", "No se pudo actualizar el historial."),
    );
  }, [endDate, loadHistory, startDate, wrapRefresh]);

  useFocusEffect(
    useCallback(() => {
      if (role === "1") void loadHistory(startDate, endDate);
    }, [endDate, loadHistory, role, startDate]),
  );

  const filteredEntries = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return entries;

    return entries.filter((entry) =>
      [
        entry.user_email,
        entry.user_name,
        entry.role,
        methodLabels[entry.method],
        entry.platform,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [entries, searchText]);

  if (role !== "1") {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-dark-background">
        <Ionicons name="lock-closed-outline" size={42} color="#9ca3af" />
        <Text className="mt-3 text-center text-foreground dark:text-dark-foreground">
          Esta pantalla está disponible solo para administradores.
        </Text>
      </View>
    );
  }

  if (loading) return <LoginHistorySkeleton />;

  return (
    <ScreenSearchLayout
      searchText={searchText}
      setSearchText={setSearchText}
      placeholder="Usuario, correo o método..."
      onFilterPress={openFilters}
      filterCount={isCurrentMonth(startDate, endDate) ? 0 : 1}
      headerVisible={false}
    >
      <CustomFlatList
        data={filteredEntries}
        renderItem={({ item }) => <LoginHistoryCard entry={item} />}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        canRefresh={canRefresh}
        handleRefresh={refreshHistory}
        cooldown={cooldown}
        title={`${filteredEntries.length} ${filteredEntries.length === 1 ? "acceso" : "accesos"}`}
        ListEmptyComponent={
          <Text className="py-10 text-center text-foreground dark:text-dark-foreground">
            {entries.length === 0
              ? "Todavía no hay accesos registrados."
              : "No se encontraron accesos con esa búsqueda."}
          </Text>
        }
      />
      <FilterModal
        visible={filterVisible}
        onClose={closeFilters}
        onClean={clearFilters}
        onApply={applyFilters}
        title="Filtrar accesos"
      >
        <ScrollView
          className="bg-background dark:bg-dark-background"
          contentContainerClassName="px-4 pb-4"
          showsVerticalScrollIndicator
        >
          <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
            Desde
          </Text>
          <TouchableOpacity
            className="mb-3 rounded-xl bg-muted p-3 dark:bg-dark-muted"
            onPress={() => setShowStartPicker(true)}
          >
            <Text className="text-foreground dark:text-dark-foreground">
              {pendingStartDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <CustomDateTimePicker
              value={pendingStartDate}
              onChange={(_, selectedDate) => {
                if (selectedDate) setPendingStartDate(selectedDate);
              }}
              onClose={() => setShowStartPicker(false)}
            />
          )}

          <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
            Hasta
          </Text>
          <TouchableOpacity
            className="mb-3 rounded-xl bg-muted p-3 dark:bg-dark-muted"
            onPress={() => setShowEndPicker(true)}
          >
            <Text className="text-foreground dark:text-dark-foreground">
              {pendingEndDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <CustomDateTimePicker
              value={pendingEndDate}
              onChange={(_, selectedDate) => {
                if (selectedDate) setPendingEndDate(selectedDate);
              }}
              onClose={() => setShowEndPicker(false)}
            />
          )}
        </ScrollView>
      </FilterModal>
    </ScreenSearchLayout>
  );
}

function getCurrentMonthRange() {
  const now = new Date();
  return {
    startDate: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
    endDate: new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    ),
  };
}

function isCurrentMonth(startDate: Date, endDate: Date) {
  const currentMonth = getCurrentMonthRange();
  return (
    startDate.getTime() === currentMonth.startDate.getTime() &&
    endDate.getTime() === currentMonth.endDate.getTime()
  );
}

function LoginHistoryCard({ entry }: { entry: LoginHistoryEntry }) {
  return (
    <View className="mb-2 rounded-2xl border border-gray-200 bg-componentbg p-4 dark:border-gray-700 dark:bg-dark-componentbg">
      <View className="flex-row items-start">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
          <Ionicons name="log-in-outline" size={21} color="#16a34a" />
        </View>
        <View className="ml-3 min-w-0 flex-1">
          <Text className="font-bold text-foreground dark:text-dark-foreground">
            {entry.user_name || "Usuario sin nombre"}
          </Text>
          <Text
            className="mt-0.5 text-sm text-gray-500 dark:text-gray-400"
            numberOfLines={1}
          >
            {entry.user_email || "Correo no disponible"}
          </Text>
        </View>
        <Text className="ml-2 text-xs font-semibold text-primary dark:text-dark-primary">
          {methodLabels[entry.method]}
        </Text>
      </View>
      <View className="mt-3 flex-row justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(entry.created_at)}
        </Text>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {entry.platform || "Plataforma no disponible"}
        </Text>
      </View>
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Fecha no disponible"
    : date.toLocaleString();
}

function LoginHistorySkeleton() {
  const placeholder = "bg-gray-200 dark:bg-gray-700";

  return (
    <View className="flex-1">
      <View className="flex-1 animate-pulse rounded-t-3xl bg-background px-4 pt-3 dark:bg-dark-background">
        <View className={`mb-3 h-11 rounded-xl ${placeholder}`} />
        <View className={`mb-3 h-4 w-2/5 rounded ${placeholder}`} />
        {Array.from({ length: 6 }).map((_, index) => (
          <View
            key={index}
            className="mb-2 rounded-2xl border border-gray-200 bg-componentbg p-4 dark:border-gray-700 dark:bg-dark-componentbg"
          >
            <View className="flex-row items-center">
              <View className={`h-10 w-10 rounded-xl ${placeholder}`} />
              <View className="ml-3 flex-1">
                <View className={`h-4 w-2/5 rounded ${placeholder}`} />
                <View className={`mt-2 h-3 w-3/5 rounded ${placeholder}`} />
              </View>
              <View className={`h-3 w-1/5 rounded ${placeholder}`} />
            </View>
            <View className={`mt-3 h-3 w-1/2 rounded ${placeholder}`} />
          </View>
        ))}
      </View>
    </View>
  );
}
