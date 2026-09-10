import { appTheme } from "@/utils/appTheme";
import {
    getLoginHistoryDisabled,
    setLoginHistoryDisabled,
} from "@/utils/loginHistoryPreference";
import MaterialIcons from "@react-native-vector-icons/material-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Switch, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

export default function LoginHistoryToggle({ userId }: { userId?: string }) {
  const [disabled, setDisabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const scale = useSharedValue(1);
  const initialized = useRef(false);

  useEffect(() => {
    let mounted = true;

    const loadPreference = async () => {
      const value = await getLoginHistoryDisabled(userId);
      if (mounted) {
        setDisabled(value);
        initialized.current = true;
      }
    };

    void loadPreference();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const handleChange = async (value: boolean) => {
    if (!userId) return;

    setDisabled(value);
    setIsSaving(true);
    scale.value = withSpring(0.98);

    try {
      await setLoginHistoryDisabled(userId, value);
    } finally {
      setIsSaving(false);
      scale.value = withSpring(1);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!initialized.current) return null;

  return (
    <Animated.View
      style={animatedStyle}
      className="my-1 min-h-[48px] w-[80%] flex-row items-center justify-between rounded-xl bg-componentbg px-4 py-3 dark:bg-dark-componentbg"
    >
      <View className="mr-3 flex-1 flex-row items-center gap-3">
        <MaterialIcons
          name={disabled ? "visibility-off" : "history"}
          size={21}
          color={disabled ? appTheme.warning : appTheme.success}
        />
        <View className="flex-1">
          <Text className="text-base font-medium text-foreground dark:text-dark-foreground">
            No registrar mis accesos
          </Text>
          <Text className="text-xs text-mutedForeground dark:text-dark-mutedForeground">
            {disabled
              ? "El tracking está desactivado"
              : "El tracking está activo"}
          </Text>
        </View>
      </View>

      {isSaving ? (
        <ActivityIndicator size="small" color={appTheme.primary.DEFAULT} />
      ) : (
        <Switch value={disabled} onValueChange={handleChange} />
      )}
    </Animated.View>
  );
}
