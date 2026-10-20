import { useEffect, useState } from "react";
import { View } from "react-native";

import AccountDeletionScreen from "@/components/screens/AccountDeletionScreen";
import MaintenanceScreen from "@/components/screens/MaintenanceScreen";
import SplashScreen from "@/components/SplashScreen";
import { supabase } from "@/lib/supabase";
import { useAppStatusStore } from "@/stores/useAppStatus";
import { useAuthProviderStore } from "@/stores/useAuthProviderStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { hydrate } = useThemeStore();
  const { showSplash, initializeApp } = useAuthProviderStore();
  const {
    maintenance,
    maintenanceMessage,
    accountDeletionRequested,
    deletionMessage,
    loading: appStatusLoading,
    checkAppStatus,
  } = useAppStatusStore();

  const { session } = useAuthStore();

  // esperar primer render
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // refresh de sesión en supabase
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "TOKEN_REFRESHED" && session) {
          useAuthStore.getState().setSession(session);
          useAuthStore.getState().setToken(session.access_token);
        }
      },
    );
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  // init de la app
  useEffect(() => {
    if (!isMounted) return;

    const init = async () => {
      try {
        await new Promise((res) => setTimeout(res, 500)); // delay pequeño
        await hydrate();
        await initializeApp();
      } catch (e) {
        console.log("Error initializing app:", e);
      }
    };
    init();
  }, [isMounted]);

  useEffect(() => {
    const runChecks = async () => {
      const userId = useAuthStore.getState().userId;
      await checkAppStatus(userId);
    };
    if (!showSplash) runChecks();
  }, [showSplash, session]);

  // useEffect(() => {
  //   if (!session) return;

  //   checkAppStatus(session.user.id);
  // }, [session]);

  // useEffect(() => {
  //   if (!session || showSplash) return;

  //   checkAppStatus(session.user.id);
  // }, [session, showSplash]);

  if (maintenance) {
    return <MaintenanceScreen message={maintenanceMessage} />;
  }

  if (accountDeletionRequested) {
    return <AccountDeletionScreen message={deletionMessage} />;
  }

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      <View className="flex-1">{children}</View>
      {(showSplash || appStatusLoading) && (
        <View className="absolute inset-0">
          <SplashScreen />
        </View>
      )}
    </View>
  );
}
