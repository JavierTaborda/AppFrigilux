import { useThemeStore } from "@/stores/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

type DrawerItemProps = {
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  currentPath: string;
};

export function DrawerItem({
  href,
  icon,
  label,
  currentPath,
}: DrawerItemProps) {
  const { theme } = useThemeStore();
  const router = useRouter();
  const isDark = theme === "dark";
  const isActive = currentPath === href;

  const bgClass = isActive
    ? "bg-primary-light dark:bg-dark-primary"
    : "bg-componentbg dark:bg-dark-componentbg";

  const handlePress = () => {
    router.push(href);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`flex-row items-center py-3 px-3 rounded-2xl ${bgClass}`}
    >
      <Ionicons name={icon} size={20} color={isDark ? "white" : "black"} />
      <Text className="ms-2 font-medium text-sm text-foreground dark:text-dark-foreground">
        {label}
      </Text>
    </TouchableOpacity>
  );
}