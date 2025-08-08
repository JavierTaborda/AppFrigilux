import Loader from '@/components/ui/Loader'
import SearchBar from '@/components/ui/SearchBar'
import TitleText from '@/components/ui/TitleText'
import { appColors } from '@/utils/colors'
import { totalVenezuela } from '@/utils/moneyFormat'
import { useState } from 'react'
import { Alert, FlatList, Platform, RefreshControl, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import OrderApprovalCard from '../components/OrderApprovalCard'
import OrderApprovalDetailModal from '../components/OrderApprovalDetailModal'
import { useAuthPays } from '../hooks/useOrdersApproval'
import { OrderApproval } from '../types/OrderApproval'

export default function OrderApprovalScreen() {
    const [searchText, setSearchText] = useState('')
    const {
        filteredOrders,
        loading,
        refreshing,
        totalOrders,
        totalUSD,
        handleRefresh,
        canRefresh,
        cooldown,
    } = useAuthPays(searchText)
    const [selectedOrder, setSelectedOrder] = useState<OrderApproval | null>(null);

    const [modalVisible, setModalVisible] = useState(false);

    const handleOpenAuthModal = (order: OrderApproval) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };
    //TODO: Implement the change of revisado
    const handleChangeRevisado = (fact_num: number, newStatus: string) => {
      
        const msg = newStatus === '1' ? `Pedido ${fact_num} marcado como Revisado` : `Pedido ${fact_num} marcado como Por Revisado`;
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
            Alert.alert('Estado actualizado', msg);
        }
    };


    const onCooldownPress = () => {
        const msg = `Espera ${cooldown} segundos antes de refrescar nuevamente`
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
            Alert.alert('Aviso', msg)
        }
    }

    if (loading) return <Loader />

    return (
        <>
            <View className="flex-1 bg-primary dark:bg-dark-primary pt-4 gap-3">
                <TitleText
                    title={`${totalOrders} Pedidos`}
                    subtitle={`Total ${totalVenezuela(totalUSD)} $`}
                />
                <View className="flex-1 bg-background dark:bg-dark-background rounded-t-3xl gap-4 px-4 pt-4 shadow-lg">
                    {!canRefresh && cooldown > 0 && (
                        <TouchableOpacity
                            onPress={onCooldownPress}
                            activeOpacity={0.8}
                            className="absolute  bg-black/60 px-3 py-0.5 rounded-full z-10 right-4"
                        >
                            <Text className="text-white text-xs">
                                Espera {cooldown}s para refrescar
                            </Text>
                        </TouchableOpacity>
                    )}
                    <View className="flex-row overflow-hidden p-1">
                        <View className="w-4/5">
                            <SearchBar
                                searchText={searchText}
                                setSearchText={setSearchText}
                                placeHolderText=""
                            />
                        </View>
                    </View>
                    {/* Overlay */}

                    <FlatList
                        data={filteredOrders}
                        keyExtractor={(item, index) => `${item.fact_num}-${index}`}
                        renderItem={({ item }) => <OrderApprovalCard item={item} 
                        onPress={() => handleOpenAuthModal(item)} 
                        changeRevisado={()=>handleChangeRevisado}/>}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                enabled={canRefresh}
                                colors={[appColors.primary.DEFAULT, appColors.primary.light, appColors.secondary.DEFAULT]}
                                tintColor={appColors.primary.DEFAULT}
                            />
                        }
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center py-10">
                                <Text className="text-mutedForeground dark:text-dark-mutedForeground text-center">
                                    No se encontraron pedidos...
                                </Text>
                            </View>
                        }
                    />
                </View>
            </View>
            {modalVisible && (

                <OrderApprovalDetailModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    order={selectedOrder || undefined}

                />

            )}
        </>
    )
}
