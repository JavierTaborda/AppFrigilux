
import Loader from '@/components/ui/Loader'
import SearchBar from '@/components/ui/SearchBar'
import TitleText from '@/components/ui/TitleText'
import { appColors } from '@/utils/colors'
import { totalVenezuela } from '@/utils/moneyFormat'
import { useState } from 'react'
import { Alert, FlatList, Platform, RefreshControl, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import OrderApprovalCard from '../components/OrderApprovalCard'
import OrderApprovalInfoModal from '../components/OrderAprovalInfoModal'
import ProductListModal from '../components/ProductListModal'
import { useOrderApproval } from '../hooks/useOrdersApproval'

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
        handleChangeRevisado,
        orders, //just use locally with JSON
        handleOpenInfoModal,
        handleOpenProductsModal,

        setModalInfoVisible,
        modalInfoVisible,
        setModalProductsVisible,
        modalProductsVisible,
        selectedOrder,
        selectedProducts,
        loadingProducts
    } = useOrderApproval(searchText)


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
                        data={orders}//just use locally with JSON . use filteredOrders
                        keyExtractor={(item, index) => `${item.fact_num}-${index}`}
                        renderItem={({ item }) =>
                            <OrderApprovalCard item={item}
                                onPress={() => handleOpenInfoModal(item)}
                                detailModal={() => handleOpenProductsModal(item)}
                                changeRevisado={(factNumber: number, newStatus: string) => handleChangeRevisado(item.fact_num, newStatus)}
                            />
                        }
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
            {modalInfoVisible && (
                <OrderApprovalInfoModal
                    visible={modalInfoVisible}
                    onClose={() => setModalInfoVisible(false)}
                    order={selectedOrder || undefined}
                />
            )}
            {modalProductsVisible && (
                <ProductListModal
                    visible={modalProductsVisible}
                    onClose={() => setModalProductsVisible(false)}
                    products={selectedProducts}
                    loading={loadingProducts}
                    tasa={selectedOrder?.tasa || "1"} 
                />
            )}
        </>
    )
}
