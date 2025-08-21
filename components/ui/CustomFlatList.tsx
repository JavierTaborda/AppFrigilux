import { useScrollHeader } from '@/hooks/useScrollHeader';
import { appColors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';
import { JSX, useRef } from 'react';
import { Alert, FlatList, Platform, RefreshControl, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';

interface GenericFlatListProps<T> {
  data: T[];
  renderItem: ({ item }: { item: T }) => JSX.Element;
  keyExtractor: (item: T, index: number) => string;
  refreshing?: boolean;
  onRefresh?: () => void;
  canRefresh?: boolean;
  cooldown?: number;
}

export function GenericFlatList<T>({
  data,
  renderItem,
  keyExtractor,
  refreshing = false,
  onRefresh,
  canRefresh = true,
  cooldown = 0,
}: GenericFlatListProps<T>) {
  const flatListRef = useRef<FlatList<T>>(null);
  const { handleScroll, showScrollTop } = useScrollHeader();

  const onCooldownPress = () => {
    const msg = `Espera ${cooldown} segundos antes de refrescar nuevamente`;
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Aviso', msg);
    }
  };

  return (
    <View className="flex-1">
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
          onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
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
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          onRefresh && (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              enabled={canRefresh}
               progressViewOffset={100}

              colors={[
                appColors.primary.DEFAULT,
                appColors.primary.light,
                appColors.secondary.DEFAULT,
              ]}
              tintColor={appColors.primary.DEFAULT}
            />
          )
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-mutedForeground dark:text-dark-mutedForeground text-center">
              No se encontraron registros...
            </Text>
          </View>
        }
      />
    </View>
  );
}
