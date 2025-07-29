
import { Text, View } from 'react-native';

interface Props {
  item: any;
}

export default function DocumentCard({ item }: Props) {
  return (
    <View className="overflow-hidden bg-componentbg dark:bg-dark-componentbg rounded-xl px-4 py-3 shadow-md border border-gray-200 dark:border-gray-700 mb-4">
      <Text className="text-base font-semibold text-black dark:text-white mb-1">
        {item["Beneficiario"]}
      </Text>

      <View className="flex-row flex-wrap gap-2 mb-2">
        <Text className="text-xs text-white bg-green-600 px-2 py-0.5 rounded-full">
          {item["Empresa"]}
        </Text>
        <Text className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
          {item["Área gasto"]}
        </Text>
      </View>

      <View className="mb-1">
        <Text className="text-xs text-foregraund dark:text-gray-400">Saldo:</Text>
        <Text className="text-sm font-medium text-black dark:text-white">
          {item["Total saldo"].toLocaleString()} {item["Moneda proveedor"] === 'DOLARES' ? '$' : 'Bs'}
        </Text>
      </View>

      <View className="mb-1">
        <Text className="text-xs text-foregraund dark:text-gray-400">Autorizado:</Text>
        <Text className="text-sm font-semibold text-green-700">
          {item["Monto autorizado"].toLocaleString()} {item["Moneda proveedor"] === 'DOLARES' ? '$' : 'Bs'}
        </Text>
      </View>

      <View className="flex-row justify-between mt-2">
        <View>
          <Text className="text-xs text-foregraund dark:text-gray-400">Documento:</Text>
          <Text className="text-sm text-black dark:text-white">{item["Documento número"]}</Text>
        </View>
        <View>
          <Text className="text-xs text-foregraund dark:text-gray-400">Emisión:</Text>
          <Text className="text-sm text-black dark:text-white">{item["Fecha emisión"]}</Text>
        </View>
        <View>
          <Text className="text-xs text-foregraund dark:text-gray-400">Vencimiento:</Text>
          <Text className="text-sm text-black dark:text-white">{item["Fecha vencimiento"]}</Text>
        </View>
      </View>

      {item["Descripción"] && (
        <Text className="text-xs text-foregraund dark:text-gray-400 mt-2">
          {item["Descripción"].slice(0, 80)}{item["Descripción"].length > 80 ? '...' : ''}
        </Text>
      )}
    </View>
  );
}
