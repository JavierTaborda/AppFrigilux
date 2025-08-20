import { useAuthStore } from '@/stores/useAuthStore';
import { formatDatedd_dot_MMM_yyyy } from '@/utils/datesFormat';
import { currencyDollar, totalVenezuela } from '@/utils/moneyFormat';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut } from 'react-native-reanimated';
import { OrderApproval } from '../types/OrderApproval';

interface Props {
  item: OrderApproval;
  onPress?: () => void;
  detailModal?: () => void;
  changeRevisado: (factNum: number, newStatus: string) => void;
}

export default function OrderApprovalCard({ item, onPress, changeRevisado, detailModal }: Props) {
  const isAnulada = item.anulada === 1;
  const isRevisado = item.revisado === '1';
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  //Role and permission of user 
  const { role } = useAuthStore();
  const hasPermission = role === 'admin' || role === 'gerenteVenta'


  const handlePressChangeStatus = async () => {
    setIsLoadingStatus(true);

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await changeRevisado(item.fact_num, isRevisado ? '0' : '1');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al actualizar el estado. Por favor intente de nuevo.');
    } finally {
      setIsLoadingStatus(false);
    }
  }

  const handlePressInfoModal = () => {
    onPress?.();//check if onPress is defined
  };
  const handlePressDetailsModal = () => {
    detailModal?.();
  };

  return (
    <Animated.View

      entering={FadeInDown.duration(300).damping(200).springify()} exiting={FadeOut.duration(100)}
      className={`rounded-xl p-2 mb-2 border shadow-sm shadow-black/10 ${isAnulada
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


        <Pressable className="flex-1  gap-1 w-4/6" onPress={handlePressInfoModal}>
          <View className="flex-row items-center gap-2">
            {/* <Ionicons name="document-text-outline" size={16} color="gray" /> */}
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
              Pedido #{item.fact_num}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            {/* <Ionicons name="calendar-outline" size={14} color="gray" /> */}
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {formatDatedd_dot_MMM_yyyy(item.fec_emis.date)}
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

          <View className="flex-row items-center gap-2">
            {/* <Text className="text-sm text-gray-500 dark:text-gray-400">Total</Text> */}
            {/* <Ionicons name="cash-outline" size={14} color="gray" /> */}
            <Text
              className={`text-xl font-bold ${isAnulada
                ? 'line-through text-error dark:text-dark-error'
                : 'text-primary dark:text-dark-primary'
                }`}
            >
              {totalVenezuela(item.tot_neto)} {currencyDollar}
            </Text>
          </View>

          {hasPermission ?
            <View className="flex-row items-center gap-2">
             
              <Text
                className={`text-xs font-normal text-gray-500 dark:text-gray-400`}
              >
                {item.zon_des.trim()} - {item.ven_des.trim()}
              </Text>
            </View> : null}
        </Pressable>

        {/* Buttons */}
        <View className="flex-col justify-center gap-3 w-2/6 ">
          <TouchableOpacity
            onPress={handlePressDetailsModal}
            className="flex-row items-center justify-center px-4 py-2 rounded-full bg-primary dark:bg-dark-primary active:scale-95"
            style={{ minWidth: 100 }}
          >
            {/* <Ionicons name="list" size={16} color="#fff" /> */}
            <Text className="text-sm font-semibold text-white ml-1">Ver Detalles</Text>
          </TouchableOpacity>

          {!isAnulada && (
            <TouchableOpacity
              onPress={handlePressChangeStatus}
              disabled={isLoadingStatus}
              className={`flex-row items-center justify-center px-4 py-2 rounded-full ${isRevisado
                ? 'bg-green-100 dark:bg-green-700/40'
                : 'bg-yellow-100 dark:bg-yellow-700/40'
                }`}
              style={{ minWidth: 100 }}
            >
              {isLoadingStatus ? (
                <ActivityIndicator size="small" color={isRevisado ? 'green' : 'orange'} />
              ) : (
                <>
                  <Ionicons
                    name={isRevisado ? 'checkmark-circle' : 'alert-circle'}
                    size={16}
                    color={isRevisado ? 'green' : 'orange'}
                  />
                  <Text
                    className={`ml-1 font-semibold ${isRevisado
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-yellow-700 dark:text-yellow-300'
                      }`}
                  >
                    {isRevisado ? 'Revisado' : 'Por Revisar'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}