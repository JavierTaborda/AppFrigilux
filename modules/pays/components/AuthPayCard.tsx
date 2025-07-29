import { Text, View } from 'react-native';
import { AuthPay } from '../types/AuthPay';

interface Props {
  item: AuthPay;
}

export default function AuthPayCard({ item }: Props) {
  return (
    <View className="overflow-hidden bg-componentbg dark:bg-dark-componentbg rounded-xl p-2.5 shadow-md border border-gray-200 dark:border-gray-700 mb-4 gap-1">
      {/* Beneficiario */}
      <Text className="text-lg font-semibold text-black dark:text-white mb-1">
        {item.beneficiario}
      </Text>

      {/* Empresa y Clase Gasto */}
      <View className="flex-row flex-wrap justify-center  gap-2 mb-2 ">
        <Text className="text-xs text-white bg-green-400 px-2 py-0.5 rounded-full">
          {item.empresa}
        </Text>
        <Text className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
          {item.clasegasto}
        </Text>
      </View>

      {/* Saldo */}
      <View>
        <Text className="text-xs text-foreground dark:text-gray-400">Saldo documento:</Text>
        <View className="flex-row items-end justify-between w-full">
          <Text className="text-xl font-medium text-black dark:text-white">
            {parseFloat(item.montoneto).toLocaleString()} {item.monedaproveedor === 'DOLARES' ? '$' : 'Bs'}
          </Text>
          <Text className="text-sm font-medium text-black dark:text-white">
            {item.tasacambio} Bs
          </Text>
        </View>
      </View>

      {/* Autorizado */}
      <View>
        <Text className="text-xs text-foreground dark:text-gray-400">Monto autorizado:</Text>
        <View className="flex-row items-end justify-between w-full">
          <Text className="text-xl font-semibold text-green-700">
            {parseFloat(item.autorizadopagar).toLocaleString()} {item.monedaproveedor === 'DOLARES' ? '$' : 'Bs'}
          </Text>
          <Text className="text-sm font-medium text-black dark:text-white">
            {item.tasacambio} Bs
          </Text>
        </View>
      </View>
      <View>
        <Text className="text-xs text-foreground dark:text-gray-400">{item.banco}</Text>
      </View>

      {/* Documento, Emisión, Vencimiento */}
      <View className="flex-row justify-between items-center">
        <View>
          {/* <Text className="text-xs text-foreground dark:text-gray-400">Documento:</Text> */}
          <Text className="text-sm text-black dark:text-white">{item.tipodocumento}-{item.numerodocumento}</Text>
        </View>

        <View>
          <Text className="text-xs text-foreground dark:text-gray-400">Emisión:</Text>
          <Text className="text-sm text-black dark:text-white">{item.fechaemision}</Text>
        </View>
        <View>
          <Text className="text-xs text-foreground dark:text-gray-400">Vencimiento:</Text>
          <Text className="text-sm text-black dark:text-white">{item.fechavencimiento}</Text>
        </View>
        <View>
          {/* <Text className="text-xs text-foreground dark:text-gray-400">Documento:</Text> */}
          <Text className="text-sm text-black dark:text-white">{item.registradopor}</Text>
        </View>
      </View>

      {/* Observación */}
      {item.observacion && (
        <Text className="text-xs text-foreground dark:text-gray-400 mt-2">
          {item.observacion.slice(0, 200)}
          {item.observacion.length > 200 ? '...' : ''}
        </Text>
      )}
    </View>
  );
}
