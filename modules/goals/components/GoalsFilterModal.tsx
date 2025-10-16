import FilterModal from "@/components/ui/FilterModal";
import React from "react";
import {
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

interface GoalsFilterModalProps {
  visible: boolean;
  onClose: () => void;

  onApply: () => void;
  hasPermission: boolean;
}

export default function GoalsFilterModal({
  visible,
  onClose,
  onApply,
  hasPermission,
}: GoalsFilterModalProps) {
  return (
    <FilterModal
      visible={visible}
      onClose={onClose}
      onApply={() => void onApply}
      onClean={() => {}}
      title="Filtrar Metas de Venta"
    >
      <ScrollView
        showsVerticalScrollIndicator={true}
        className="bg-background dark:bg-dark-background px-4"
      ></ScrollView>
    </FilterModal>
  );
}

interface PropsShowDateIos {
  onPress: () => void;
  children: React.ReactNode;
}

export function ShowDateIos({ onPress, children }: PropsShowDateIos) {
  if (Platform.OS !== "ios") return <>{children}</>;

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutDown.duration(150)}
      className="bg-componentbg dark:bg-dark-componentbg p-2 m-1 rounded-3xl shadow-inner"
    >
      {children}
      <View className="flex-row justify-end mt-3">
        <TouchableOpacity onPress={onPress} className="px-4 py-2">
          <Text className="text-primary">Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
