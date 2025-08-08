import { formatDateMMM_dot_dd_yyyy } from '@/utils/datesFormat';
import { totalVenezuela } from '@/utils/moneyFormat';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { OrderApproval } from '../types/OrderApproval';

interface Props {
  item: OrderApproval;
  onPress?: () => void;
}

export default function OrderApprovalCard({ item, onPress }: Props) {
  const isAnulada = item.anulada === 1;
  const isRevisado = item.revisado === '1';

  return (
    <Pressable
      onPress={onPress}
      className={`
        rounded-2xl p-4 mb-4 border shadow-sm relative
        ${isAnulada 
          ? 'bg-red-50 dark:bg-dark-error/20 border-red-300 dark:border-red-700' 
          : 'bg-white dark:bg-dark-componentbg border-gray-200 dark:border-gray-700'}
        active:scale-[0.98] transition-all duration-150
      `}
    >
      {/* Factura */}
      <Text className="text-lg font-extrabold text-black dark:text-white tracking-tight">
        Factura #{item.fact_num}
      </Text>

      {/* Fecha */}
      <View className="flex-row items-center mb-3">
        <Ionicons
          name="calendar-outline"
          size={14}
          color="gray"
          style={{ marginRight: 4 }}
        />
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {formatDateMMM_dot_dd_yyyy(item.fec_emis.date)}
        </Text>
      </View>

      {/* Cliente */}
      <View className="mb-2">
        <Text className="text-sm text-gray-500 dark:text-gray-400">Cliente:</Text>
        <Text className="text-base font-medium text-black dark:text-white leading-snug">
          {item.co_cli} - {item.cli_des}
        </Text>
      </View>

      {/* Total Neto */}
      <View className="mb-3">
        <Text className="text-sm text-gray-500 dark:text-gray-400">Total Neto</Text>
        <Text className="text-xl font-bold text-primary dark:text-dark-primary">
          {totalVenezuela(item.tot_neto)} US$
        </Text>
      </View>

      {/* Estado */}
      <View
        className={`flex-row items-center px-3 py-1 rounded-full self-start
          ${isRevisado 
            ? 'bg-green-100 dark:bg-green-700/40' 
            : 'bg-yellow-100 dark:bg-yellow-700/40'}
        `}
      >
        <Ionicons
          name={isRevisado ? 'checkmark-circle' : 'alert-circle'}
          size={14}
          color={isRevisado ? '#16a34a' : '#eab308'}
          style={{ marginRight: 6 }}
        />
        <Text
          className={`text-xs font-semibold ${
            isRevisado ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'
          }`}
        >
          {isRevisado ? 'Revisado' : 'Por Revisar'}
        </Text>
      </View>

      {/* Botón flotante */}
      <Pressable
        className="absolute top-3 right-3 flex-row items-center px-3 py-1 rounded-full bg-primary dark:bg-dark-primary active:scale-95"
        onPress={onPress}
      >
        <Ionicons name="eye-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
        <Text className="text-xs font-semibold text-white">Detalles</Text>
      </Pressable>
    </Pressable>
  );
}
