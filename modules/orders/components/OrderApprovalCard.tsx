import { formatDateMMM_dot_dd_yyyy } from '@/utils/datesFormat';
import { totalVenezuela } from '@/utils/moneyFormat';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics'; // opcional
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
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

  const handlePressChangeStatus = () => {

    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Warning
    ) //touch feedback 
    changeRevisado(item.fact_num, isRevisado ? '0' : '1');
  };
  const handlePressInfoModal = () => {
    onPress?.();//cjheck if onPress is defined
  };
  const handlePressDetailsModal = () => {
   detailModal?.();
  };

  return (
    <Animated.View

      entering={FadeInDown.duration(300).damping(100).springify()} exiting={FadeOut.duration(100)}
      className={`rounded-xl p-4 mb-4 border shadow-sm shadow-black/10 ${isAnulada
        ? 'bg-red-50 dark:bg-dark-error/20 border-red-300 dark:border-red-300'
        : 'bg-white dark:bg-dark-componentbg border-gray-200 dark:border-gray-700'
        }`}
    >
      <Pressable className="flex-row gap-3" style={{ minHeight: 110 }}>
        {/* Band Anulado */}
        {isAnulada && (
          <Animated.View
            entering={FadeIn.duration(300)}

            className="absolute top-1 right-2 bg-red-500/80 dark:bg-red-600/50 rounded-full px-2 z-10"
          >
            <Text className="text-xs text-white font-bold">Anulado</Text>
          </Animated.View>
        )}

        {/* Información del pedido */}
        <Pressable className="flex-1 pr-4 gap-1" onPress={handlePressInfoModal}>
          <View className="flex-row items-center gap-2">
            <Ionicons name="document-text-outline" size={16} color="gray" />
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground">
              Pedido #{item.fact_num}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={14} color="gray" />
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {formatDateMMM_dot_dd_yyyy(item.fec_emis.date)}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Ionicons name="person-outline" size={14} color="gray" />
            <Text
              className="text-base text-foreground dark:text-dark-foreground"
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ maxWidth: '100%' }}
            >
              {item.co_cli.trim()} - {item.cli_des}
            </Text>
          </View>

          <View className="">
            <Text className="text-sm text-gray-500 dark:text-gray-400">Total</Text>
            <Text
              className={`text-xl font-bold ${isAnulada
                ? 'line-through text-error dark:text-dark-error'
                : 'text-primary dark:text-dark-primary'
                }`}
            >
              {totalVenezuela(item.tot_neto)} {item.moneda}
            </Text>
          </View>
        </Pressable>

        {/* Botones */}
        <View className="flex-col justify-center gap-3 w-2/6">
          <TouchableOpacity
            onPress={handlePressDetailsModal}
            className="flex-row items-center justify-center px-4 py-2 rounded-full bg-primary dark:bg-dark-primary active:scale-95"
            style={{ minWidth: 100 }}
          >
            <Ionicons name="list" size={16} color="#fff" />
            <Text className="text-sm font-semibold text-white ml-1">Detalles</Text>
          </TouchableOpacity>

          {!isAnulada && (
            <TouchableOpacity
              onPress={handlePressChangeStatus}
              className={`flex-row items-center justify-center px-4 py-2 rounded-full ${isRevisado
                ? 'bg-green-100 dark:bg-green-700/40'
                : 'bg-yellow-100 dark:bg-yellow-700/40'
                }`}
              style={{ minWidth: 100 }}
            >
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
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}