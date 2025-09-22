import { formatDatedd_dot_MMM_yyyy } from '@/utils/datesFormat';
import { currencyDollar, totalVenezuela } from '@/utils/moneyFormat';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { OrderApproval } from '../types/OrderApproval';

interface Props {
  item: OrderApproval;
  onPress?: () => void;
  detailModal?: () => void;
  hasPermission: boolean;
}

function OrderSearchCard({ item, onPress, detailModal, hasPermission }: Props) {
  const isAnulada = item.anulada === 1;
  const formattedDate = useMemo(
    () => formatDatedd_dot_MMM_yyyy(item.fec_emis),
    [item.fec_emis]
  );

  const handlePressInfoModal = () => {
    onPress?.();
  };

  const handlePressDetailsModal = () => {
    detailModal?.();
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300).damping(200).springify()}
      exiting={FadeOut.duration(100)}
      className={`rounded-xl py-2 px-3 mb-2 border shadow-sm shadow-black/10 ${
        isAnulada
          ? 'bg-red-50 dark:bg-dark-error/20 border-red-300 dark:border-red-300'
          : 'bg-componentbg dark:bg-dark-componentbg border-gray-200 dark:border-gray-700'
      }`}
    >
      <Pressable className="flex-row gap-2" style={{ minHeight: 110 }}>
        {/* Band Anulado */}
        {isAnulada && (
          <Animated.View
            entering={FadeIn.duration(300)}
            className="absolute top-1 right-2 bg-red-500/80 dark:bg-red-600/50 rounded-full px-2 z-10"
          >
            <Text className="text-xs text-white font-bold">Anulado</Text>
          </Animated.View>
        )}

        <Pressable className="flex-1 gap-1 w-4/6" onPress={handlePressInfoModal}>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
              Pedido #{item.fact_num}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Ionicons name="person-outline" size={14} color="gray" />
            <Text
              className="text-base text-foreground dark:text-dark-foreground flex-shrink"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.co_cli.trim()} - {item.cli_des}
            </Text>
          </View>

          <View className="flex-row items-center justify-normal gap-2">
            <Text className="text-sm pt-1 text-gray-500 dark:text-gray-400">
              Total
            </Text>
            <Text
              className={`text-xl font-bold ${
                isAnulada
                  ? 'line-through text-error dark:text-dark-error'
                  : 'text-primary dark:text-dark-primary'
              }`}
            >
              {totalVenezuela(item.tot_neto)} {currencyDollar}
            </Text>
          </View>

          {hasPermission ? (
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-normal text-gray-500 dark:text-gray-400">
                {item.zon_des.trim()} - {item.ven_des.trim()}
              </Text>
            </View>
          ) : null}
        </Pressable>

        {/* Botón Ver Detalles */}
        <View className="flex-col justify-center gap-3 w-2/6">
          <TouchableOpacity
            onPress={handlePressDetailsModal}
            className="flex-row items-center justify-center px-4 py-2 rounded-full bg-primary dark:bg-dark-primary active:scale-95"
            style={{ minWidth: 100 }}
          >
            <Text className="text-sm font-semibold text-white ml-1">
              Ver detalles
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default React.memo(OrderSearchCard);
