import FilterModal from "@/components/ui/FilterModal";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

interface Props {
  visible: boolean;
  onClose: () => void;
  onApply: (min: number | null, max: number | null) => void;
  initialMin?: number | null;
  initialMax?: number | null;
  maxMonto?: number | null;
}

export default function MountRangeModal({
  visible,
  onClose,
  onApply,
  initialMin = null,
  initialMax = null,
  maxMonto = null,
}: Props) {
  const [min, setMin] = useState(initialMin ? initialMin.toString() : "");
  const [max, setMax] = useState(initialMax ? initialMax.toString() : "");

  useEffect(() => {
    setMin(initialMin ? initialMin.toString() : "");
    setMax(initialMax ? initialMax.toString() : "");
  }, [initialMin, initialMax, visible]);

  const minValue = min ? Number(min) : null;
  const maxValue = max ? Number(max) : null;
  const isInvalidRange = minValue !== null && maxValue !== null && minValue > maxValue;

  const handleApply = () => {
    if (isInvalidRange) return alert("Rango inválido");
    onApply(minValue, maxValue);
    onClose();
  };

  const handleClear = () => {
    setMin("");
    setMax("");
    onApply(null, null);
    onClose();
  };

  return (
    <FilterModal
      visible={visible}
      onClean={handleClear}
      onClose={onClose}
      onApply={handleApply}
      title="Rango de Montos a Filtrar"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start' }}
          keyboardShouldPersistTaps="handled"
          className="px-4 py-1"
        >
          <View className="flex-row gap-4 mb-6">
            <View className="flex-1">
              <Text className="mb-1 text-sm">Mínimo</Text>
              <TextInput
                testID="min-input"
                accessibilityLabel="Monto mínimo"
                accessibilityHint="Ingresa el monto mínimo para filtrar"
                keyboardType="numeric"
                value={min}
                onChangeText={setMin}
                placeholder="0"
                className={`border rounded px-3 py-2 ${
                  isInvalidRange ? "border-red-500" : "border-gray-300 dark:border-dark-mutedForeground"
                }`}
              />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-sm">Máximo</Text>
              <TextInput
                testID="max-input"
                accessibilityLabel="Monto máximo"
                accessibilityHint="Ingresa el monto máximo para filtrar"
                keyboardType="numeric"
                value={max}
                onChangeText={setMax}
                placeholder={maxMonto ? maxMonto.toString() : "∞"}
                className={`border rounded px-3 py-2 ${
                  isInvalidRange ? "border-red-500" : "border-gray-300 dark:border-dark-mutedForeground"
                }`}
              />
            </View>
          </View>

          {isInvalidRange && (
            <Text className="text-red-500 text-xs mb-4">
              El mínimo no puede ser mayor que el máximo
            </Text>
          )}

          <View className="h-10" />
        </ScrollView>
      </KeyboardAvoidingView>
    </FilterModal>
  );
}