import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import CustomFlatList from "@/components/ui/CustomFlatList";
import Loader from "@/components/ui/Loader";
import { useAuthStore } from "@/stores/useAuthStore";
import { totalVenezuela } from "@/utils/moneyFormat";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import FastFilters from "../components/FastFilters";
import OrderApprovalCard from "../components/OrderApprovalCard";
import OrderApprovalFilterModal from "../components/OrderApprovalFilterModal";
import OrderApprovalInfoModal from "../components/OrderAprovalInfoModal";
import ProductListModal from "../components/ProductListModal/ProductListModal";
import MountRangeModal from "../components/RangeMountModal";
import { useOrderApproval } from "../hooks/useOrdersApproval";
import { OrderApproval } from "../types/OrderApproval";
import { OrderFilters } from "../types/OrderFilters";
export default function OrderApprovalScreen() {
  const { role } = useAuthStore();
  const [searchText, setSearchText] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [modalMountVisible, setModalMountVisible] = useState(false);
  const hasPermission = role === "admin" || role === "gerenteVenta";
  const [headerVisible, setHeaderVisible] = useState(true); //// Only if use extrafilter={true} on ScreenSearchLayout

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
    mountRange,
    setMountRange,
    mountRangeActive,
    maxMonto,
  } = useOrderApproval(searchText);

  const handleApplyFilters = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    setFilterVisible(false);
  };
  const handleApplyMountRange = (min: number | null, max: number | null) => {
    setMountRange({ min, max });
  };

  const renderOrderItem = useCallback(
    ({ item }: { item: OrderApproval }) => (
      <OrderApprovalCard
        item={item}
        onPress={() => handleOpenInfoModal(item)}
        detailModal={() => handleOpenProductsModal(item)}
        changeRevisado={(factNumber, newStatus) =>
          handleChangeRevisado(item.fact_num, newStatus)
        }
        hasPermission={hasPermission}
      />
    ),
    [
      handleOpenInfoModal,
      handleOpenProductsModal,
      handleChangeRevisado,
      hasPermission,
    ]
  );
  if (loading) return <Loader />;

  return (
    <>
      <ScreenSearchLayout
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
            openModalMount={modalMountVisible}
            setModalMountVisible={setModalMountVisible}
            mountRangeActive={mountRangeActive}
          />
        }
      >
        <CustomFlatList
          //data={orders}
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => `${item.fact_num}-${index}`}
          refreshing={refreshing}
          canRefresh={canRefresh}
          handleRefresh={handleRefresh}
          cooldown={cooldown}
          onHeaderVisibleChange={setHeaderVisible} // Only if use extrafilter={true} on ScreenSearchLayout
          showtitle={true}
          title={`${totalOrders} pedidos`}
          subtitle={`con total ${totalVenezuela(totalUSD)}$`}
          ListEmptyComponent={
            <View className="p-10 items-center">
              <Text>No se encontraron pedidos...</Text>
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
          total={selectedOrder && parseFloat(selectedOrder?.tot_neto)}
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
            statusList,
          }}
          onApply={handleApplyFilters}
        />
      )}
      {modalMountVisible && (
        <MountRangeModal
          visible={modalMountVisible}
          onClose={() => setModalMountVisible(false)}
          onApply={handleApplyMountRange}
          initialMin={mountRange?.min}
          initialMax={mountRange?.max}
          maxMonto={maxMonto}
        />
      )}
    </>
  );
}
