import FilterModal from "@/components/ui/FilterModal";
import { useThemeStore } from "@/stores/useThemeStore";
import { appColors } from "@/utils/colors";
import Slider from "@react-native-community/slider";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

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
  initialMin = 0,
  initialMax = null,
  maxMonto = 1000,
}: Props) {
  const { isDark } = useThemeStore();
  const [min, setMin] = useState(initialMin || 0);
  const [max, setMax] = useState(initialMax || maxMonto || 1000);

  useEffect(() => {
    setMin(initialMin || 0);
    setMax(initialMax || maxMonto || 1000);
  }, [initialMin, initialMax, visible]);

  const handleApply = () => {
    if (min > max) return alert("Rango inválido");
    onApply(min, max);
    onClose();
  };

  const handleClear = () => {
    setMin(0);
    setMax(maxMonto || 1000);
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
      >
        <View className="px-4 py-2">
          <Text className="mb-2">Monto mínimo: {min}</Text>
          <Slider
            minimumValue={0}
            maximumValue={maxMonto || 1000}
            step={1}
            value={min}
            onValueChange={setMin}
            minimumTrackTintColor={isDark ? appColors.dark.primary.DEFAULT : appColors.primary.DEFAULT}
            maximumTrackTintColor={isDark ? appColors.dark.placeholdercolor : appColors.componentbg}

            thumbTintColor={isDark ? appColors.dark.error : appColors.componentbg}
          />

          <Text className="mb-2 mt-6">Monto máximo: {max}</Text>
          <Slider
            minimumValue={0}
            maximumValue={maxMonto || 1000}
            step={1}
            value={max}
            onValueChange={setMax}
            minimumTrackTintColor="#2563eb"
            maximumTrackTintColor="#d1d5db"
            thumbTintColor='red'
          />
        </View>
      </KeyboardAvoidingView>
    </FilterModal>
  );
}
