import { useThemeStore } from "@/stores/useThemeStore";
import { appTheme } from "@/utils/appTheme";
import Ionicons from "@react-native-vector-icons/ionicons";
import { DrawerToggleButton } from "expo-router/drawer";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function getTabIcon(
  routeName: string,
  focused: boolean,
): ComponentProps<typeof Ionicons>["name"] {
  switch (routeName) {
    case "(home)/index":
      return focused ? "home" : "home-outline";
    case "(profile)/index":
      return focused ? "person" : "person-outline";
    case "(logout)/index":
      return focused ? "exit" : "exit-outline";
    default:
      return "ellipse";
  }
}

export default function TabLayout() {
  const { isDark } = useThemeStore();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      // backBehavior="history"
      screenOptions={({ route }) => ({
        animationEnabled: true,

        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={getTabIcon(route.name, focused)}
            size={size}
            color={color}
          />
        ),
        //Button styles of tab
        tabBarButton: (props: any) => {
          const {
            onPress,
            onLongPress,
            accessibilityState,
            accessibilityLabel,
            testID,
            children,
          } = props;
          const focused = accessibilityState?.selected ?? false;

          //Color  ripple
          const rippleColor = focused
            ? appTheme.primary.DEFAULT
            : isDark
              ? "rgba(255,255,255,0.15)"
              : "rgba(0,0,0,0.08)";
          return (
            <Pressable
              onPress={onPress}
              onLongPress={onLongPress}
              accessibilityState={accessibilityState}
              accessibilityLabel={accessibilityLabel}
              testID={testID}
              android_ripple={{
                color: rippleColor,
                borderless: false,
                radius: 60,
              }}
            >
              <View
                style={{
                  borderRadius: 40,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {children}
              </View>
            </Pressable>
          );
        },
        // Tab bar visual styling
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: isDark
            ? appTheme.dark.background
            : appTheme.background,
          borderTopWidth: 1,
          borderTopColor: isDark ? appTheme.dark.separator : appTheme.separator,

          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },

        tabBarActiveTintColor: isDark
          ? appTheme.dark.primary.DEFAULT
          : appTheme.primary.DEFAULT,
        tabBarInactiveTintColor: appTheme.mutedForeground,
        //  Tab item style
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        // Header configuration
        headerShown: true,
        headerLeft: () => (
          <DrawerToggleButton
            tintColor={isDark ? appTheme.dark.foreground : appTheme.background}
          />
        ),
        headerStyle: {
          backgroundColor: isDark
            ? appTheme.dark.primary.DEFAULT
            : appTheme.primary.DEFAULT,
          borderBottomWidth: 0,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 2,
        },
        headerTintColor: isDark
          ? appTheme.dark.foreground
          : appTheme.background,
      })}
    >
      <Tabs.Screen name="(home)/index" options={{ title: "Inicio" }} />
      <Tabs.Screen name="(profile)/index" options={{ title: "Perfil" }} />
      <Tabs.Screen
        name="(logout)/index"
        options={{ title: "Salir", headerShown: false }}
      />

      {/* Hide only the buttons; href: null makes these routes unreachable in SDK 58. */}
      <Tabs.Screen
        name="(pays)/authPays"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: true,
          title: "Autorización de Pagos",
        }}
      />
      <Tabs.Screen
        name="(orders)/orderApproval"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: true,
          title: "Aprobación de Pedidos",
        }}
      />
      <Tabs.Screen
        name="(orders)/orderSearch"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: true,
          title: "Consultar Pedidos",
        }}
      />
      <Tabs.Screen
        name="(orders)/app-orders"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: true,
          title: "Pedidos creados desde la app",
        }}
      />
      <Tabs.Screen
        name="(admin)/login-history"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: true,
          title: "Historial de accesos",
        }}
      />
      <Tabs.Screen
        name="(accountsReceivable)/index"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: true,
          title: "Cuentas por cobrar",
        }}
      />
      <Tabs.Screen
        name="(createOrder)/create-order"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: true,
          title: "Registrar Pedido",
        }}
      />
      <Tabs.Screen
        name="(createOrder)/order-cancel"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: true,
          title: "Anular Pedidos",
        }}
      />
      <Tabs.Screen
        name="(createOrder)/order-summary"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: true,
          title: "",
        }}
      />
      <Tabs.Screen
        name="(goals)/goalsResumen"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: true,
          title: "Resumen Metas Ventas",
        }}
      />
      <Tabs.Screen
        name="(returnReport)/index"
        options={{
          tabBarItemStyle: { display: "none" },
          headerShown: true,
          title: "Registrar Devolución",
        }}
      />
    </Tabs>
  );
}
