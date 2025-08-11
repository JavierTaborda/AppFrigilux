import BottomModal from "@/components/ui/BottomModal";
import { formatDateMMM_dot_dd_yyyy } from "@/utils/datesFormat";
import { totalVenezuela } from "@/utils/moneyFormat";
import { Ionicons } from "@expo/vector-icons";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { OrderApproval } from "../types/OrderApproval";

type Props = {
    visible: boolean;
    onClose: () => void;
    order?: OrderApproval;
};

export default function OrderModal({ visible, onClose, order }: Props) {
    if (!order) return null;

    const isAnulada = order.anulada === 1;
    const isRevisado = order.revisado === '1';

    return (
        <BottomModal visible={visible} onClose={onClose} heightPercentage={0.85}>
            {/* Header */}
            <Text
                className='text-2xl font-extrabold mb-2 text-primary dark:text-dark-foreground'
            >
                Pedido #{order.fact_num}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
                {/* Pedido Anulado */}
                {isAnulada && (
                    <View className="bg-red-100 dark:bg-red-400 border-l-4 border-red-500 dark:border-red-800 p-4 rounded-lg mb-4">
                        <View className="flex-row items-center mb-1">
                            <Ionicons name="close-circle-outline" size={20} color="red" />
                            <Text className="ml-2 font-semibold text-red-800 dark:text-red-100">
                                Pedido Anulado
                            </Text>
                        </View>
                        <Text className="text-red-700 dark:text-red-100 text-sm">
                            Este pedido ha sido anulado
                        </Text>
                    </View>
                )}

                {/* Detalles del pedido */}
                <Row label="Fecha de Emisión" value={formatDateMMM_dot_dd_yyyy(order.fec_emis.date)} />
                <Row label="Zona" value={order.zon_des} />
                <Row label="Cliente" value={order.cli_des} multiline />
                <Row label="Dirección Entrega" value={order.dir_ent} multiline />
                <Row label="Tasa" value={`${order.tasa} BS`} />
                <Row label="Condición" value={order.cond_des} />
                <Row label="Comentario" value={order.comentario || '-'} multiline />

                {/* Total Neto */}
                <View className={`rounded-lg p-4 my-4 ${isAnulada ? 'bg-red-400' : 'bg-green-600'}`}>
                    <Text className="text-white opacity-80 text-sm mb-1">Total Neto</Text>
                    <Text className={`text-white font-bold text-3xl ${isAnulada ? 'line-through' : ''}`}>
                        {totalVenezuela(order.tot_neto)} {order.moneda}
                    </Text>
                </View>
                {/* Estado visual */}
                <View className="flex-row gap-2 mb-4">
                    <View className={`flex-1 ${isRevisado ? 'bg-green-100 dark:bg-green-800' : 'bg-yellow-100 dark:bg-yellow-800'} rounded-lg p-4`}>
                        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">
                            Estado
                        </Text>
                        <Text className={`text-base font-semibold ${isRevisado ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                            {isRevisado ? 'Revisado' : 'Por Revisar'}
                        </Text>
                    </View>  
                </View>
            </ScrollView>

            {/* Botón aceptar */}
            <TouchableOpacity
                onPress={onClose}
                className="bg-primary dark:bg-dark-primary rounded-full py-3 mt-2 flex-row justify-center items-center"
            >
                <Ionicons name="arrow-back-outline" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">Aceptar</Text>
            </TouchableOpacity>
        </BottomModal>
    );
}

// Componente fila para etiqueta y valor
function Row({
    label,
    value,
    multiline = false,
}: {
    label: string;
    value: string;
    multiline?: boolean;
}) {
    return (
        <View className="bg-componentbg dark:bg-dark-componentbg rounded-lg px-4 py-2 mb-2 shadow-sm shadow-black/10">
            <Text className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {label}
            </Text>
            <Text
                className={`text-base text-foreground dark:text-dark-foreground ${multiline ? '' : 'truncate'
                    }`}
                numberOfLines={multiline ? undefined : 1}
            >
                {value}
            </Text>
        </View>
    );
}

