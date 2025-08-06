import { useThemeStore } from "@/stores/useThemeStore";
import { appColors } from "@/utils/colors";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type CustomPickerProps = {
  selectedValue: string;
  onValueChange: (value: string) => void;
  items: { label: string; value: string }[];
  icon?: keyof typeof FontAwesome.glyphMap;
  placeholder?: string;
  error?: string;
};

export default function CustomPicker({
  selectedValue,
  onValueChange,
  items,
  icon = "list",
  placeholder = "Seleccione una opción",
  error,
}: CustomPickerProps) {
  const { theme } = useThemeStore();
  const [touched, setTouched] = useState(false);
  const [iosModalVisible, setIosModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const isValid = !!selectedValue;
  const selectedLabel =
    items.find((i) => i.value === selectedValue)?.label || placeholder;

  const handleValueChange = (value: string) => {
    try {
      onValueChange(value);
      setTouched(true);
    } catch (err) {
      console.error("Error al cambiar el valor del Picker:", err);
    }
  };

  return (
    <View>
      {/* Contenedor principal */}
      <View
        className={`flex-row items-center rounded-xl px-4 border ${touched && !isValid
            ? "border-red-500 dark:border-red-300"
            : "border-gray-300 dark:border-gray-600"
          } bg-transparent dark:bg-dark-componentbg`}
      >
        <FontAwesome
          name={icon}
          size={20}
          color={
            touched && !isValid
              ? appColors.error
              : appColors.placeholdercolor
          }
        />

        {/* Android: Picker inline */}
        {Platform.OS === "android" && (
          <View className="flex-1">
            <Picker
              selectedValue={selectedValue}
              onValueChange={handleValueChange}
              style={{
                color: isValid
                  ? theme === "dark"
                    ? appColors.dark.foreground
                    : appColors.foreground
                  : theme === "dark"
                    ? appColors.dark.foreground
                    : appColors.placeholdercolor,


                backgroundColor: "transparent",
              }}
            >
              <Picker.Item
                label={placeholder}
                value=""
                color={
                  theme === "dark"
                    ? appColors.dark.primary.DEFAULT
                    : appColors.primary.DEFAULT
                }
              />
              {items.map((item) => (
                <Picker.Item
                  key={item.value}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>
        )}

        {/* iOS: open modal */}
        {Platform.OS === "ios" && (
          <Pressable
            className="flex-1 py-3"
            onPress={() => setIosModalVisible(true)}
          >
            <Text className="text-lg text-foreground dark:text-dark-foreground">
              {selectedLabel}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Mensaje de error */}
      {touched && !isValid && (
        <Text className="text-red-500 text-xs mt-1">
          {error || "Seleccione una opción"}
        </Text>
      )}

      {/* iOS: Modal tipo bottom sheet */}
      {Platform.OS === "ios" && (
        <Modal
          transparent
          visible={iosModalVisible}
          animationType="slide"
          onRequestClose={() => setIosModalVisible(false)}
        >
          <Pressable
            className="flex-1 justify-end"
            onPress={() => setIosModalVisible(false)}
          >
            <Pressable
              style={{ paddingBottom: insets.bottom }}
              className="bg-white dark:bg-dark-componentbg rounded-t-2xl overflow-hidden"
              onPress={() => { }}
            >
              {/* Botón cerrar */}
              <Pressable
                className="absolute top-2 right-3 z-10 p-2"
                onPress={() => setIosModalVisible(false)}
              >
                <Text className="text-primary dark:text-dark-primary font-semibold text-base">
                  Cerrar
                </Text>
              </Pressable>

              {/* Picker inside modal */}
              <Picker
                selectedValue={selectedValue}
                onValueChange={handleValueChange}
              >
                <Picker.Item
                  label={placeholder}
                  value=""
                  color={
                    theme === "dark"
                      ? appColors.dark.secondary.DEFAULT
                      : appColors.secondary.DEFAULT
                  }
                />
                {items.map((item) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}