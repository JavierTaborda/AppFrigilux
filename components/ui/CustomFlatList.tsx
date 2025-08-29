// components/ui/ScreenFlatList.tsx
import { useScrollHeader } from "@/hooks/useScrollHeader";
import { appColors } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  FlatList,
  FlatListProps,
  Platform,
  RefreshControl,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import TitleText from "./TitleText";

type Props<T> = {
  data: T[];
  renderItem: FlatListProps<T>["renderItem"];
  keyExtractor: FlatListProps<T>["keyExtractor"];
  refreshing: boolean;
  canRefresh: boolean;
  handleRefresh: () => void;
  cooldown: number;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  onHeaderVisibleChange?: (visible: boolean) => void;
  showtitle:boolean
  title?:string;
  subtitle?:string;
};

export default function CustomFlatList<T>({
  data,
  renderItem,
  keyExtractor,
  refreshing,
  canRefresh,
  handleRefresh,
  cooldown,
  ListEmptyComponent,
  onHeaderVisibleChange,
  showtitle=true,
  title,
  subtitle
}: Props<T>) {
  const flatListRef = useRef<FlatList<T>>(null);


  const { handleScroll, showScrollTop,headerVisible } = useScrollHeader();

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
      {!canRefresh && cooldown > 0 && (
        <TouchableOpacity
          onPress={onCooldownPress}
          activeOpacity={0.8}
          className="absolute bg-black/60 px-3 py-0.5 rounded-full z-10 top-0 right-4"
        >
          <Text className="text-white text-xs">
            Espera {cooldown}s para refrescar
          </Text>
        </TouchableOpacity>
      )}

      {showScrollTop && (
        <TouchableOpacity
          onPress={() =>
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
          }
          className="absolute bg-primary dark:bg-dark-primary p-4 rounded-full right-4 bottom-28 z-20 shadow-lg"
        >
          <Ionicons name="arrow-up" size={24} color="white" />
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 145 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        progressViewOffset={100}
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
          
          showtitle ? <TitleText title={title} subtitle={subtitle} /> : undefined
        }

        ListEmptyComponent={
          ListEmptyComponent ?? (
            <View className="flex-1 items-center justify-center py-10">
              <Text className="text-mutedForeground dark:text-dark-mutedForeground text-center">
                No se encontraron datos...
              </Text>
            </View>
          )
        }
      />
    </>
  );
}
