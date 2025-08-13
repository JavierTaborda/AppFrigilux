import FilterModal from "@/components/ui/FilterModal";
import { useThemeStore } from "@/stores/useThemeStore";
import { appColors } from "@/utils/colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

interface OrderApprovalFilterModalProps {
  visible: boolean;
  onClose: () => void;
  dataFilters: {
    zones: string[];
    sellers: string[];
  };
  filters: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
    seller?: string;
    zone?: string;
  };
  onApply: (newFilters: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
    seller?: string;
    zone?: string;
  }) => void;
}

export default function OrderApprovalFilterModal({
  visible,
  onClose,
  onApply,
  filters,
  dataFilters,
}: OrderApprovalFilterModalProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(filters.startDate);
  const [endDate, setEndDate] = useState<Date | undefined>(filters.endDate);
  const [status, setStatus] = useState<string | undefined>(filters.status);
  const [zone, setZone] = useState<string | undefined>(filters.zone);
  const [seller, setSeller] = useState<string | undefined>(filters.seller);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const { theme } = useThemeStore();

  const statusOptions = [
    { label: "Todos", value: "" },
    { label: "Por Revisar", value: "0" },
    { label: "Revisado", value: "1" },
    { label: "Anulado", value: "anulada" },
  ];

  // Abrir pickers
  const openStartPicker = () => {
    if (Platform.OS === "ios") {
      setShowStartPicker(true);
    } else {
      setShowStartPicker(true);
    }
  };

  const openEndPicker = () => {
    if (Platform.OS === "ios") {
      setShowEndPicker(true);
    } else {
      setShowEndPicker(true);
    }
  };

  return (
    <FilterModal
      visible={visible}
      onClose={onClose}
      onApply={() => onApply({ startDate, endDate, status, zone, seller })}
      onClean={() => {
        setStartDate(undefined);
        setEndDate(undefined);
        setStatus(undefined);
        setZone(undefined);
        setSeller(undefined);
        onApply({});
      }}
      title="Filtrar Pedidos"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-background dark:bg-dark-background"
      >
        {/* Fecha inicial */}
        <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
          Desde
        </Text>
        <TouchableOpacity
          className="bg-muted dark:bg-dark-muted p-3 rounded-xl mb-3"
          onPress={openStartPicker}
        >
          <Text className="text-foreground dark:text-dark-foreground">
            {startDate ? startDate.toLocaleDateString() : "Seleccionar fecha"}
          </Text>
        </TouchableOpacity>

        {/* Fecha final */}
        <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
          Hasta
        </Text>
        <TouchableOpacity
          className="bg-muted dark:bg-dark-muted p-3 rounded-xl mb-3"
          onPress={openEndPicker}
        >
          <Text className="text-foreground dark:text-dark-foreground">
            {endDate ? endDate.toLocaleDateString() : "Seleccionar fecha"}
          </Text>
        </TouchableOpacity>

        {/* Estatus */}
        <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
          Estatus
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-5">
          {statusOptions.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              className={`px-4 py-2 rounded-full border ${
                status === opt.value
                  ? "bg-primary border-primary"
                  : "bg-transparent border-muted"
              }`}
              onPress={() => setStatus(opt.value)}
            >
              <Text
                className={`text-sm ${
                  status === opt.value
                    ? "text-white"
                    : "text-foreground dark:text-dark-foreground"
                }`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Zona */}
        <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
          Zona
        </Text>
        <View className="bg-muted dark:bg-dark-muted p-3 rounded-xl mb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dataFilters.zones.map((value) => (
              <TouchableOpacity
                key={value}
                className={`px-4 py-2 rounded-full border ${
                  zone === value
                    ? "bg-primary border-primary"
                    : "bg-transparent border-muted"
                } mr-2`}
                onPress={() => setZone(value)}
              >
                <Text
                  className={`text-sm ${
                    zone === value
                      ? "text-white"
                      : "text-foreground dark:text-dark-foreground"
                  }`}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Vendedor */}
        <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
          Vendedor
        </Text>
        <View className="bg-muted dark:bg-dark-muted p-3 rounded-xl mb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dataFilters.sellers.map((value) => (
              <TouchableOpacity
                key={value}
                className={`px-4 py-2 rounded-full border ${
                  seller === value
                    ? "bg-primary border-primary"
                    : "bg-transparent border-muted"
                } mr-2`}
                onPress={() => setSeller(value)}
              >
                <Text
                  className={`text-sm ${
                    seller === value
                      ? "text-white"
                      : "text-foreground dark:text-dark-foreground"
                  }`}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* iOS - Modal Picker desde abajo */}
      {showStartPicker && Platform.OS === "ios" && (
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutDown}
          className=" bg-componentbg dark:bg-dark-componentbg p-5 rounded-3xl shadow-xl"
        >
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="inline"
            onChange={(event, selectedDate) => {
           
              if (selectedDate) setStartDate(selectedDate);
               
            }}
          accentColor={theme === 'dark' ? appColors.dark.primary.DEFAULT : appColors.primary.DEFAULT}
          />
          <View className="flex-row justify-end mt-3">
            <TouchableOpacity
              onPress={() => setShowStartPicker(false)}
              className="px-4 py-2"
            >
              <Text className="text-primary">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {showEndPicker && Platform.OS === "ios" && (
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutDown}
          className="absolute bottom-0 left-0 right-0 bg-componentbg dark:bg-dark-componentbg p-5 rounded-t-3xl shadow-lg"
        >
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="inline"
            onChange={(event, selectedDate) => {
              if (selectedDate) setEndDate(selectedDate);
            }}
            themeVariant={theme === "dark" ? "dark" : "light"}
          />
          <View className="flex-row justify-end mt-3">
            <TouchableOpacity
              onPress={() => setShowEndPicker(false)}
              className="px-4 py-2"
            >
              <Text className="text-primary">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Android - Picker nativo */}
      {showStartPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          design="material"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
          
          positiveButton={{label: 'OK', textColor: appColors.primary.DEFAULT}}

      
        />
      )}

      {showEndPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
          accentColor={
            theme === "dark" ? appColors.dark.primary.DEFAULT : appColors.primary.DEFAULT
          }
          themeVariant={theme === "dark" ? "dark" : "light"}
        />
      )}
    </FilterModal>
  );
}
