import { useThemeStore } from "@/stores/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

type Props = {
  searchText: string;
  setSearchText: (text: string) => void;
  placeHolderText?: string;
  isFull?: boolean;
};

export default function SearchBar({
  searchText,
  setSearchText,
  placeHolderText = "Buscar...",
  isFull = false,
}: Props) {
  const { isDark } = useThemeStore();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(searchText);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const inputWidthAnim = useRef(new Animated.Value(1)).current;

  const inputHeight = Platform.select({ android: 40, ios: 38 });

  // Sync internal state when searchText changes externally
  useEffect(() => {
    setInputValue(searchText);
  }, [searchText]);

  // Debounce search updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchText(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // Show/hide clear button
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: inputValue.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: inputValue.length > 0 ? 1 : 0,
      useNativeDriver: true,
    }).start();
  }, [inputValue]);

  // Animate width when needed
  useEffect(() => {
    if (!isFull) return;
    Animated.timing(inputWidthAnim, {
      toValue: isFocused ? 0.95 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, isFull]);

  const handleCancel = () => {
    Keyboard.dismiss();
    setIsFocused(false);
  };

  return (
    <View className="flex-row items-center py-1">
      <Animated.View
        className="flex-row items-center px-4 bg-componentbg dark:bg-dark-componentbg rounded-full "//shadow-sm shadow-black/10
        style={{
          flex: inputWidthAnim,
          //elevation: Platform.OS === "android" ? 2 : 0,
        }}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={isDark ? "white" : "gray"}
        />
        <TextInput
          style={{ height: inputHeight }}
          className="ml-2 flex-1 text-black dark:text-white"
          value={inputValue}
          onChangeText={setInputValue}
          placeholder={placeHolderText}
          placeholderTextColor={isDark ? "#ccc" : "#666"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => !inputValue && setIsFocused(false)}
          returnKeyType="search"
          autoCorrect={false}
        />
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <TouchableOpacity
            onPress={() => setInputValue("")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Borrar texto"
            accessibilityHint="Limpia el texto de búsqueda"
            accessible
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={isDark ? "white" : "grey"}
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {isFocused && isFull && (
        <TouchableOpacity
          onPress={handleCancel}
          className="ml-2"
          activeOpacity={0.6}
          accessibilityLabel="Cancelar búsqueda"
          accessibilityHint="Cierra el campo de búsqueda y oculta el botón cancelar"
        >
          <Text className="text-primary dark:text-dark-primary font-medium text-lg">
            Cancelar
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
