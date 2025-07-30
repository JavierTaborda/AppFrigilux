import { dateMonthText } from '@/utils/datesFormat';
import { totalVenezuela } from '@/utils/moneyFormat';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthPay } from '../types/AuthPay';



interface Props {
  item: AuthPay;
}

export default function AuthPayCard({ item }: Props) {

  return (
    <View className="overflow-hidden bg-componentbg dark:bg-dark-componentbg rounded-xl p-3  border border-gray-200 dark:border-gray-700 mb-4 gap-2.5 min-h-[250px]">
      {/* Beneficiario */}
      <Text className="text-lg font-semibold text-black dark:text-white">
        {item.beneficiario}
      </Text>

      {/* Empresa y Clase Gasto */}
      <View className="flex-row flex-wrap justify-center  gap-2">
        <Text className="text-xs text-white bg-green-400 px-2 py-0.5 rounded-full">
          {item.empresa}
        </Text>
        <Text className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
          {item.clasegasto}
        </Text>
      </View>

      {/* Saldo */}
      <View className="flex-row items-end justify-between w-full">
        <View >
          <Text className="text-xs text-foreground dark:text-gray-400">Saldo documento</Text>
          <Text className="text-xl font-medium text-black dark:text-white">
            {totalVenezuela(item.montoneto)} {item.moneda}
          </Text>
        </View>
        <View className='gap-1'>
          <Text className="text-xs text-foreground dark:text-gray-400">Tasa documento</Text>
          <Text className="text-sm font-medium text-black dark:text-white">
            {totalVenezuela(item.tasacambio)} Bs
          </Text>
        </View>
      </View>
      {/*Auth*/}

      {item.autorizadopagar === '1' ? (
        <View className="flex-row items-end justify-between w-full">
          <View>
            <Text className="text-xs text-foreground dark:text-gray-400">Monto autorizado</Text>
            <Text className="text-xl font-semibold text-green-700">
              {totalVenezuela(item.montoautorizado)} {item.monedaautorizada}
            </Text>
          </View>
          <View className="gap-1">
            <Text className="text-xs text-foreground dark:text-gray-400">Tasa autorizada</Text>
            <Text className="text-sm font-medium text-black dark:text-white">
              {totalVenezuela(item.tasaautorizada)} Bs
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center">
          <View className="flex-row justify-center items-center w-3/5 rounded-xl bg-warning dark:bg-dark-warning px-2 py-1">
            <MaterialIcons name="cancel" size={16} color="white" />
            <Text className="text-sm text-white font-medium ml-1">
              No autorizado
            </Text>
          </View>
        </View>
      )}


      {/*Bank*/}
      {item.autorizadopagar === '1' && (
        <View>
          <Text className="text-xs text-foreground dark:text-gray-400">{item.bancopagador}</Text>
        </View>
      )}

      {/* Document, Emission, expiration */}
      <ScrollView
        horizontal
        contentContainerStyle={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: 2,
          gap: 12,
        }}
      >
        <View>
          <Text className="text-xs text-foreground dark:text-gray-400">Documento</Text>
          <Text className="text-sm text-black dark:text-white">{item.tipodocumento}-{item.numerodocumento}</Text>
        </View>

        <View>
          <Text className="text-xs text-foreground dark:text-gray-400">Emisión</Text>
          <Text className="text-sm text-black dark:text-white">{dateMonthText(item.fechaemision)}</Text>
        </View>

        <View>
          <Text className="text-xs text-foreground dark:text-gray-400">Vencimiento</Text>
          <Text className="text-sm text-black dark:text-white">{dateMonthText(item.fechavencimiento)}</Text>
        </View>

        <View>
          <Text className="text-xs text-foreground dark:text-gray-400">Registrado por</Text>
          <Text className="text-sm text-black dark:text-white">{item.registradopor}</Text>
        </View>

      </ScrollView>

      {/* Observación */}
      {item.observacion && (
        <Text className="text-xs text-foreground dark:text-gray-400 ">
          {item.observacion.slice(0, 200)}
          {item.observacion.length > 200 ? '...' : ''}
        </Text>
      )}
    </View>
  );
}
