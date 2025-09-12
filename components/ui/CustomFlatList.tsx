import { useScrollHeader } from "@/hooks/useScrollHeader";
import { appColors } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  FlatListProps,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from "react-native";
import Animated from "react-native-reanimated";
import TitleText from "./TitleText";

type Props<T> = {
  data: T[];
  renderItem: FlatListProps<T>["renderItem"];
  keyExtractor: FlatListProps<T>["keyExtractor"];
  refreshing: boolean;
  canRefresh: boolean;
  handleRefresh: () => void;
  cooldown?: number;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  onHeaderVisibleChange?: (visible: boolean) => void;
  showtitle?: boolean;
  title?: string;
  subtitle?: string;
  numColumns?: number;
  showScrollTopButton?: boolean;
};

const AnimatedFlatList = Animated.FlatList;

function CustomFlatList<T>({
  data,
  renderItem,
  keyExtractor,
  refreshing,
  canRefresh,
  handleRefresh,
  cooldown,
  ListEmptyComponent,
  onHeaderVisibleChange,
  showtitle = true,
  title,
  subtitle,
  numColumns = 1,
  showScrollTopButton = true,
}: Props<T>) {
  const flatListRef = useRef<any>(null); // Cambia el tipo a 'any' para Animated.FlatList

  const { handleScroll, showScrollTop, headerVisible } = useScrollHeader();

  useEffect(() => {
    if (onHeaderVisibleChange) {
      onHeaderVisibleChange(headerVisible);
    }
  }, [headerVisible]);

  const onCooldownPress = () => {
    const msg = `Espera ${cooldown} segundos antes de refrescar nuevamente`;
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      alert(msg);
    }
  };

  return (
    <>
      {/* Aviso de cooldown */}
      {!canRefresh && cooldown ? (
        <TouchableOpacity
          onPress={onCooldownPress}
          activeOpacity={0.8}
          style={styles.cooldownBadge}
        >
          <Text style={styles.cooldownText}>
            Espera {cooldown}s para refrescar
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* Botón scroll top */}
      {showScrollTop && showScrollTopButton && (
        <TouchableOpacity
          onPress={() =>
            flatListRef.current?.scrollToIndex({ index: 0, animated: true })
          }
          style={styles.scrollTopButton}
          className="bg-primary dark:bg-dark-primary p-4 rounded-full shadow-lg"
          accessibilityLabel="Subir al inicio"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-up" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Lista */}
      <AnimatedFlatList
        ref={flatListRef} // Asegúrate que AnimatedFlatList use esta ref
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onScroll={handleScroll} // ahora sí funciona con useAnimatedScrollHandler
        scrollEventThrottle={16}
        progressViewOffset={100}
        key={numColumns} // force  re-render to change numColumns
        numColumns={numColumns}
        columnWrapperStyle={
          numColumns > 1 ? { justifyContent: "space-between" } : undefined
        }
        refreshControl={
          canRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              {...(Platform.OS === "android" && {
                enabled: canRefresh,
                progressViewOffset: 100,
                colors: [
                  appColors.primary.DEFAULT,
                  appColors.primary.light,
                  appColors.secondary.DEFAULT,
                ],
              })}
              tintColor={appColors.primary.DEFAULT}
              title="Recargando..."
              titleColor={appColors.primary.DEFAULT}
            />
          ) : undefined
        }
        ListHeaderComponent={
          showtitle ? (
            <View className="pb-1">
              <TitleText title={title} subtitle={subtitle} />
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          ListEmptyComponent ?? (
            <View style={styles.emptyWrapper}>
              <Text style={styles.emptyText}>No se encontraron datos...</Text>
            </View>
          )
        }
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
        removeClippedSubviews
      />
    </>
  );
}

export default React.memo(CustomFlatList) as typeof CustomFlatList;

const styles = StyleSheet.create({
  cooldownBadge: {
    position: "absolute",
    top: 0,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    zIndex: 10,
  },
  cooldownText: {
    color: "#fff",
    fontSize: 12,
  },
  scrollTopButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 1000,
    elevation: 10,
  },
  listContent: {
    paddingBottom: 200,
    paddingHorizontal: 16,
  },
  headerWrapper: {
    paddingBottom: 4,
  },
  emptyWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
  },
});
