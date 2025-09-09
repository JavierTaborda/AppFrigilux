import { useThemeStore } from "@/stores/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

type DrawerItemProps = {
  href: Href;
  icon?: keyof typeof Ionicons.glyphMap;
  emoji?: string;
  label: string;
  currentPath: string;
};

export function DrawerItem({
  href,
  icon,
  label,
  currentPath,
  emoji,
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
      className={`flex-row items-center py-2 px-3 rounded-2xl ${bgClass}`}
    >
      {icon && (
        <Ionicons name={icon} size={24} color={isDark ? "white" : "black"} />
      )}
      {emoji && (
        <>
          <Text className="text-xl"> {emoji}</Text>
        </>
      )}
      <Text className="ms-2 font-medium text-sm text-foreground dark:text-dark-foreground">
        {label}
      </Text>
    </TouchableOpacity>
  );
}
