import { formatDateMMM_dot_dd_yyyy } from '@/utils/datesFormat';
import { totalVenezuela } from '@/utils/moneyFormat';
import { Pressable, Text, View } from 'react-native';
import { OrderApproval } from '../types/OrderApproval';

interface Props {
  item: OrderApproval
  onPress?: () => void;
}

export default function OrderApprovalCard({ item, onPress }: Props) {
  const isAnulada = item.anulada === 0;
  const isRevisado = item.revisado === '1';

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-xl p-4 mb-3 border shadow-sm ${
        isAnulada ? 'bg-error dark:bg-dark-error' : 'bg-white dark:bg-dark-componentbg'
      }`}
    >
      {/* Factura */}
      <Text className="text-lg font-bold text-black dark:text-white mb-1">
        Factura #{item.fact_num}
      </Text>

      {/* Fecha */}
      <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Fecha de emisión: {formatDateMMM_dot_dd_yyyy(item.fec_emis.date)}
      </Text>

      {/* Cliente */}
      <Text className="text-sm text-gray-500 dark:text-gray-400">
        Cliente: <Text className="font-medium text-black dark:text-white">{item.co_cli} - {item.cli_des}</Text>
      </Text>

      {/* Total Neto */}
      <View className="mt-2">
        <Text className="text-sm text-gray-500 dark:text-gray-400">Total Neto</Text>
        <Text className="text-lg font-semibold text-black dark:text-white">
          {totalVenezuela(item.tot_neto)} US$
        </Text>
      </View>

      {/* Revisado */}
      {isRevisado && (
        <View className="mt-3 self-start px-2 py-1 rounded-full bg-green-600">
          <Text className="text-xs font-semibold text-white">Revisado</Text>
        </View>
      )}
    </Pressable>
  );
}