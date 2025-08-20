import ScreenSearchLayout from '@/components/screens/ScreenSearchLayout';
import Loader from '@/components/ui/Loader';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { appColors } from '@/utils/colors';
import { totalVenezuela } from '@/utils/moneyFormat';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Alert, FlatList, Platform, RefreshControl, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import FastFilters from '../components/FastFilters';
import OrderApprovalCard from '../components/OrderApprovalCard';
import OrderApprovalFilterModal from '../components/OrderApprovalFilterModal';
import OrderApprovalInfoModal from '../components/OrderAprovalInfoModal';
import ProductListModal from '../components/ProductListModal/ProductListModal';
import { useOrderApproval } from '../hooks/useOrdersApproval';
import { OrderFilters } from '../types/OrderFilters';
export default function OrderApprovalScreen() {
    const [searchText, setSearchText] = useState('')
    const [filterVisible, setFilterVisible] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    //Hide the search bar and filters
    const {
        handleScroll,
        headerVisible,
        showScrollTop,
    } = useScrollHeader();


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
        loadingProducts,
        zones,
        sellers,
        loadFilters,
        filters,
        setFilters,
        statusList,
        activeFiltersCount,
        sortDate,
        setSortDate,
        sortMount,
        setSortMount,
        showStatus,
        setShowStatus,
        mount,
        setMount,
        // openModalMount,
        // setModalMount,

    } = useOrderApproval(searchText);

    const onCooldownPress = () => {
        const msg = `Espera ${cooldown} segundos antes de refrescar nuevamente`
        if (Platform.OS === 'android') {
            ToastAndroid.show(msg, ToastAndroid.SHORT)
        } else {
            Alert.alert('Aviso', msg)
        }
    }

    const handleApplyFilters = (newFilters: OrderFilters) => {
        setFilters(newFilters);
        setFilterVisible(false);
    };

    if (loading) return <Loader />


    return (
        <>
            <ScreenSearchLayout
                title={`${totalOrders} Pedidos`}
                subtitle={`Total ${totalVenezuela(totalUSD)} $`}
                searchText={searchText}
                setSearchText={setSearchText}
                placeholder="Cliente o número de pedido..."
                onFilterPress={() => setFilterVisible(true)}
                filterCount={activeFiltersCount}
                extrafilter={true}
                headerVisible={headerVisible}
                extraFiltersComponent={
                    <FastFilters
                        sortDate={sortDate}
                        setSortDate={setSortDate}
                        sortMount={sortMount}
                        setSortMount={setSortMount}
                        showStatus={showStatus}
                        setShowStatus={setShowStatus}
                        openModalMount={true}
                        setModalMount={setSortDate}
                      // mount={mount}
                      //  setMount={setMount}
                    />
                }

            >


                {!canRefresh && cooldown > 0 && (
                    <TouchableOpacity
                        onPress={onCooldownPress}
                        activeOpacity={0.8}
                        className="absolute  bg-black/60 px-3 py-0.5 rounded-full z-10 top-0 right-4"
                    >
                        <Text className="text-white text-xs">
                            Espera {cooldown}s para refrescar
                        </Text>
                    </TouchableOpacity>
                )}

                {showScrollTop && (
                    <TouchableOpacity
                        onPress={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
                        className="absolute   bg-primary dark:bg-dark-primary p-4 rounded-full right-4 bottom-32 z-20 shadow-lg"
                    >
                        <Ionicons name="arrow-up" size={24} color="white" />
                    </TouchableOpacity>
                )}


                <FlatList
                    ref={flatListRef}

                    data={orders} //just use locally with JSON
                    keyExtractor={(item, index) => `${item.fact_num}-${index}`}
                    renderItem={({ item }) => (
                        <OrderApprovalCard
                            item={item}
                            onPress={() => handleOpenInfoModal(item)}
                            detailModal={() => handleOpenProductsModal(item)}
                            changeRevisado={(factNumber, newStatus) =>
                                handleChangeRevisado(item.fact_num, newStatus)
                            }
                        />
                    )}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    onScroll={handleScroll} // Call handlescroll
                    scrollEventThrottle={16} //-trigger the  scroll every ~16ms (aprox 60fps).


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
            </ScreenSearchLayout>

            {/* Modales */}
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
                />
            )}

            {filterVisible && (
                <OrderApprovalFilterModal
                    visible={filterVisible}
                    onClose={() => setFilterVisible(false)}
                    filters={filters}
                    dataFilters={{
                        zones,
                        sellers,
                        statusList
                    }}
                    onApply={handleApplyFilters}

                />
            )}
        </>
    );
}


