import { appColors } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  // onApply: (filters: { startDate?: Date; endDate?: Date; status?: string }) => void;
}

export default function FilterModal({ visible, onClose }: FilterModalProps) {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<string | undefined>();

  const statusOptions = [
    { label: "Todos", value: "" },
    { label: "Por Revisar", value: "0" },
    { label: "Revisado", value: "1" },
    { label: "Anulado", value: "anulada" },
  ];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50 justify-end">
        <Animated.View
          entering={FadeInUp}
          exiting={FadeOutDown}
          className="bg-background dark:bg-dark-background rounded-t-3xl p-5 max-h-[85%]"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
              Filtrar pedidos
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={appColors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Fecha inicial */}
            <Text className="mb-1 font-medium text-mutedForeground dark:text-dark-mutedForeground">
              Desde
            </Text>
            <TouchableOpacity
              className="bg-muted dark:bg-dark-muted p-3 rounded-xl mb-3"
              onPress={() => {
                Platform.OS === "ios"
                  ? console.log("Abrir Date Picker iOS")
                  : setStartDate(new Date());
              }}
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
              onPress={() => {
                Platform.OS === "ios"
                  ? console.log("Abrir Date Picker iOS")
                  : setEndDate(new Date());
              }}
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
          </ScrollView>

          {/* Botones */}
          <View className="flex-row gap-3 mt-3">
            <TouchableOpacity
              className="flex-1 p-3 rounded-xl border border-muted"
              onPress={() => {
                setStartDate(undefined);
                setEndDate(undefined);
                setStatus(undefined);
              }}
            >
              <Text className="text-center text-foreground dark:text-dark-foreground font-semibold">
                Limpiar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 p-3 rounded-xl bg-primary"
              onPress={() => {
                // onApply({ startDate, endDate, status });
                onClose();
              }}
            >
              <Text className="text-center text-white font-semibold">
                Aplicar
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
