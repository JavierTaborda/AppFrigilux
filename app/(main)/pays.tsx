import { useThemeStore } from '@/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';

const data = [
  {
    "Empresa": "CYBERLUX",
    "Área gasto": "CONTABILIDAD",
    "Documento tipo": "FACT - 196",
    "Documento número": "FACT - 196",
    "Beneficiario": "MAQUINAS FISCALES",
    "Descripción": "HOMOLOGACIÓN IMAO FISCAL COLEGIO...",
    "Fecha emisión": "30 may. 2024",
    "Fecha vencimiento": "30 may. 2024",
    "Total documento": 660.00,
    "Total saldo": 660.00,
    "Tasa documento": 36.45,
    "Moneda proveedor": "DOLARES",
    "Monto autorizado": 660.00,
    "Tasa autorizada": 36.45,
    "Autorizado pagar con": "Dólares EMDOM II",
    "Registrado por": "jimaplica"
  },
  {
    "Empresa": "EMDOM II",
    "Área gasto": "LEGALES",
    "Documento tipo": "FACT - 158",
    "Documento número": "FACT - 158",
    "Beneficiario": "REDU ADQUIRIDO TRABAJO DE TIENDA...",
    "Descripción": "REDU ADQUIRIDO TRABAJO DE TIENDA...",
    "Fecha emisión": "6 may. 2024",
    "Fecha vencimiento": "6 may. 2024",
    "Total documento": 9.320,
    "Total saldo": 9.320,
    "Tasa documento": 51.35,
    "Moneda proveedor": "BOLIVARES",
    "Monto autorizado": 9.320,
    "Tasa autorizada": 51.35,
    "Autorizado pagar con": "Dólares EMDOM II",
    "Registrado por": "legalas"
  },
  {
    "Empresa": "AVANTI BY FRIGILUX",
    "Área gasto": "PATROCINIO",
    "Documento tipo": "Deuda",
    "Documento número": "FACT - 2467",
    "Beneficiario": "UCVFC",
    "Descripción": "PATROCINIO MES ABRIL 2025",
    "Fecha emisión": "1 feb. 2024",
    "Fecha vencimiento": "1 feb. 2024",
    "Total documento": 10.000,
    "Total saldo": 10.000,
    "Tasa documento": 66.79,
    "Moneda proveedor": "DOLARES",
    "Monto autorizado": 10.000,
    "Tasa autorizada": 66.79,
    "Autorizado pagar con": "Dólares EMDOM II",
    "Registrado por": "mtfigueroa"
  },
  {
    "Empresa": "AVANTI BY FRIGILUX",
    "Área gasto": "MEDIOS",
    "Documento tipo": "Deuda",
    "Documento número": "FACT - 2489",
    "Beneficiario": "SACHERAS NACIONALES...",
    "Descripción": "CONTRATOS MES ABRIL...",
    "Fecha emisión": "18 jun. 2024",
    "Fecha vencimiento": "18 jun. 2024",
    "Total documento": 2.200,
    "Total saldo": 2.200,
    "Tasa documento": 66.79,
    "Moneda proveedor": "DOLARES",
    "Monto autorizado": 2.200,
    "Tasa autorizada": 66.79,
    "Autorizado pagar con": "Dólares EMDOM II",
    "Registrado por": "mtfigueroa"
  },
  {
    "Empresa": "AVANTI BY FRIGILUX",
    "Área gasto": "PATROCINIO",
    "Documento tipo": "Deuda",
    "Documento número": "FACT - 2488",
    "Beneficiario": "ESTADIO MONUMENTAL SIMÓN BOLÍVAR",
    "Descripción": "SEGUIMIENTO DE LAS MEJORAS...",
    "Fecha emisión": "1 may. 2024",
    "Fecha vencimiento": "1 may. 2024",
    "Total documento": 50000.00,
    "Total saldo": 50000.00,
    "Tasa documento": 66.79,
    "Moneda proveedor": "DOLARES",
    "Monto autorizado": 50000.00,
    "Tasa autorizada": 66.79,
    "Autorizado pagar con": "Dólares EMDOM II",
    "Registrado por": "mtfigueroa"
  },
  {
    "Empresa": "AVANTI BY FRIGILUX",
    "Área gasto": "MERCADEO",
    "Documento tipo": "Presupuesto",
    "Documento número": "APM-748",
    "Beneficiario": "ALEJANDRA JOSÉ CONEJ...",
    "Descripción": "FOTOS SESIÓN + IMAGEN DE PORTADAS...",
    "Fecha emisión": "14 feb. 2025",
    "Fecha vencimiento": "24 abr. 2025",
    "Total documento": 400.00,
    "Total saldo": 400.00,
    "Tasa documento": 60.02,
    "Moneda proveedor": "BOLIVARES",
    "Monto autorizado": 400.00,
    "Tasa autorizada": 60.02,
    "Autorizado pagar con": "Dólares EMDOM II",
    "Registrado por": "mtfigueroa"
  }
]
;

export default function AuthorizationScreen() {
  const { theme } = useThemeStore();

  const totalAutorizadoVED = data
    .filter((d) => d["Moneda proveedor"] === "BOLIVARES")
    .reduce((acc, item) => acc + item["Monto autorizado"], 0);

  const totalAutorizadoUSD = data
    .filter((d) => d["Moneda proveedor"] === "DOLARES")
    .reduce((acc, item) => acc + item["Monto autorizado"], 0);

  return (
    <View className="flex-1 bg-white dark:bg-background px-4 pt-4">
      {/* HEADER */}
      <View className="bg-primary py-4 px-4 rounded-xl mb-4">
        <Text className="text-white font-bold text-lg">Autorización Pagos</Text>
        <Text className="text-white mt-1">1 Documentos</Text>
        <Text className="text-white font-semibold mt-1">
          Total autorizado: {totalAutorizadoVED.toLocaleString()} VED / {totalAutorizadoUSD.toLocaleString()} $
        </Text>
      </View>

      {/* BUSCADOR */}
      <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 mb-2">
        <Ionicons name="search-outline" size={20} color={theme === 'dark' ? 'white' : 'black'} />
        <TextInput
          placeholder="Buscar..."
          placeholderTextColor={theme === 'dark' ? '#ccc' : '#666'}
          className="ml-2 flex-1 text-black dark:text-white"
        />
        <TouchableOpacity className="ml-2">
          <Ionicons name="filter-outline" size={22} color={theme === 'dark' ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>

      {/* LISTA */}
      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item["Documento número"]}-${index}`}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
            <Text className="text-base font-semibold text-black dark:text-white mb-1">{item["Beneficiario"]}</Text>

            <View className="flex-row flex-wrap gap-2 mb-2">
              <Text className="text-xs text-white bg-green-600 px-2 py-0.5 rounded-full">
                {item["Empresa"]}
              </Text>
              <Text className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
                {item["Área gasto"]}
              </Text>
            </View>

            <View className="mb-1">
              <Text className="text-xs text-foregraund dark:text-gray-400">Saldo documento:</Text>
              <Text className="text-sm font-medium text-black dark:text-white">
                {item["Total saldo"].toLocaleString()} {item["Moneda proveedor"] === 'DOLARES' ? '$' : 'Bs'}
              </Text>
            </View>

            <View className="mb-1">
              <Text className="text-xs text-foregraund dark:text-gray-400">Monto autorizado:</Text>
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
        )}
      />
    </View>
  );
}
