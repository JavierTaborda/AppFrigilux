import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

import SplashScreen from "@/components/SplashScreen";
import { useAuthProviderStore } from "@/stores/useAuthProviderStore";
import { useThemeStore } from "@/stores/useThemeStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { hydrate } = useThemeStore();
  const { showSplash, initializeApp } = useAuthProviderStore();

  const splashOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  // Estado para asegurar que la UI se monte antes de init
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const init = async () => {
      try {
        // Pequeño delay para asegurar que UI se renderizó
        await new Promise((res) => setTimeout(res, 500));

        await hydrate();
        await initializeApp();
      } catch (e) {
        console.log("Error initializing app:", e);
      }
    };

    init();
  }, [isMounted]);

  useEffect(() => {
    if (!showSplash) {
      Animated.sequence([
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSplash]);

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      {showSplash && (
        <Animated.View style={[styles.absoluteFill, { opacity: splashOpacity }]}>
          <SplashScreen />
        </Animated.View>
      )}
      {!showSplash && (
        <Animated.View style={[styles.absoluteFill, { opacity: contentOpacity }]}>
          {children}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
});
