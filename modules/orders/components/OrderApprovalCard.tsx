import { formatDateMMM_dot_dd_yyyy } from '@/utils/datesFormat';
import { totalVenezuela } from '@/utils/moneyFormat';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { OrderApproval } from '../types/OrderApproval';
interface Props {
  item: OrderApproval;
  onPress?: () => void;
  changeRevisado?: (factNum: number, status: string) => void;
}

function RevisadoBadge({
  revisado,
  factNum,
  changeRevisado,
}: {
  revisado: boolean;
  factNum: number;
  changeRevisado?: (factNum: number, status: string) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => changeRevisado?.(factNum, revisado ? '0' : '1')}
      className={`flex-row items-center w-full px-3 py-2 rounded-full shadow-sm shadow-black/10 ${revisado
          ? 'bg-green-100 dark:bg-green-700/40'
          : 'bg-yellow-100 dark:bg-yellow-700/40'
        }`}
    >
      <Ionicons
        name={revisado ? 'checkmark-circle' : 'alert-circle'}
        size={14}
        color={revisado ? 'green' : 'orange'}
      />
      <Text
        className={`text-sm font-semibold ml-1 ${revisado
            ? 'text-green-700 dark:text-green-300'
            : 'text-yellow-700 dark:text-yellow-300'
          }`}
      >
        {revisado ? 'Revisado' : 'Por Revisar'}
      </Text>
    </TouchableOpacity>
  );
}
function AnuladaBadge() {
  return (
    <View className="absolute top-1 right-2 bg-red-500 dark:bg-red-600/50 rounded-full px-2 z-10">
      <Text className="text-xs text-white font-bold">Anulado</Text>
    </View>
  );
}

export default function OrderApprovalCard({ item, onPress, changeRevisado }: Props) {
  const isAnulada = item.anulada === 1;
  const isRevisado = item.revisado === '1';

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row  rounded-2xl p-3 mb-4 border shadow-sm shadow-black/10  active:scale-[0.99] ${isAnulada
        ? 'bg-red-50 dark:bg-dark-error/20 border-red-300 dark:border-red-300'
        : 'bg-white dark:bg-dark-componentbg border-gray-200 dark:border-gray-700'
        }`}
    >
      {isAnulada && <AnuladaBadge />}

      <View className="flex-row justify-between items-start  w-4/6 ">
        {/* Información principal */}
        <View className="flex-1 space-y-2 pr-4 gap-1">

          <View className='flex-row items-center justify-between'>
            <Text className="text-lg font-bold text-foreground dark:text-dark-foreground tracking-tight leading-tight">
              {`Pedido #${item.fact_num} `}
            </Text>

            <View className="flex-row items-center gap-1">
              <Ionicons name="calendar-outline" size={14} color="gray" />
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateMMM_dot_dd_yyyy(item.fec_emis.date)}
              </Text>
            </View>
          </View>

          <View>
            <Text className="text-base font-normal text-foreground dark:text-dark-foreground leading-snug">
              {item.co_cli.trim()} - {item.cli_des}
            </Text>
          </View>

          <View>
            <Text className='text-md text-gray-500 dark:text-gray-400 '>Total</Text>

            <Text className={`text-xl font-bold text-primary dark:text-dark-primary ${isAnulada ? 'line-through' : ''}`}>
              {totalVenezuela(item.tot_neto)} {item.moneda}
            </Text>
          </View>
        </View>
      </View>

      {/* Botones y estado */}
      <View className="flex-row items-center p-1  w-2/6 ">
        <View className="flex-1 justify-center gap-3">


          <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center px-3 py-2 rounded-full bg-primary dark:bg-dark-primary active:scale-95  shadow-sm"
          >
            <Ionicons name="list" size={14} color="#fff" />
            <Text className="text-sm font-semibold text-white ml-1">Ver Detalles</Text>
          </TouchableOpacity>
          <RevisadoBadge
            revisado={isRevisado}
            factNum={item.fact_num}
            changeRevisado={changeRevisado}
          />
        </View>
      </View>

    </Pressable>
  );
}