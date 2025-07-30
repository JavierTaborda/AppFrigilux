import { useThemeStore } from "@/stores/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Platform, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  searchText: string;
  setSearchText: (text: string) => void;
  placeHolderText: string;
};

export default function SearchBar({ searchText, setSearchText, placeHolderText }: Props) {
  const { theme } = useThemeStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const inputHeight= Platform.select({
  android: 40,
  ios: 38,
});


  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: searchText.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [searchText]);

  return (
    <View className="flex-row items-center bg-componentbg dark:bg-dark-componentbg rounded-full px-4">
      <Ionicons name="search-outline" size={20} color={theme === "dark" ? "white" : "gray"} />

      <TextInput
        style={{
          height: inputHeight,
        }}
        className="ml-2 flex-1 text-black dark:text-white"
        value={searchText}
        onChangeText={setSearchText}
        placeholder={placeHolderText ? placeHolderText : "Buscar..."}
        placeholderTextColor={theme === "dark" ? "#ccc" : "#666"}
      />

      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity onPress={() => setSearchText("")}>
          <Ionicons
            name="close-circle"
            size={20}
            color={theme === "dark" ? "white" : "grey"}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}