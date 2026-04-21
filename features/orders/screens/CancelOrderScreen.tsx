import ScreenSearchLayout from "@/components/screens/ScreenSearchLayout";
import CustomFlatList from "@/components/ui/CustomFlatList";
import ErrorView from "@/components/ui/ErrorView";
import Loader from "@/components/ui/Loader";
import OrderApprovalInfoModal from "@/features/orders/components/OrderAprovalInfoModal";
import OrderFilterModal from "@/features/orders/components/OrderFilterModal";
import OrderSearchCard from "@/features/orders/components/OrderSearchCard";
import ProductListModal from "@/features/orders/components/ProductListModal/ProductListModal";
import { cancelOrder } from "@/features/orders/services/OrderService";
import { OrderApproval } from "@/features/orders/types/OrderApproval";
import { OrderFilters } from "@/features/orders/types/OrderFilters";
import { useAuthStore } from "@/stores/useAuthStore";
import { useOverlayStore } from "@/stores/useSuccessOverlayStore";
import { totalVenezuela } from "@/utils/moneyFormat";
import { useCallback, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useOrderSearch } from "../hooks/useOrdersSearch";

export default function CancelOrderScreen() {
  const { role } = useAuthStore();
  const [searchText, setSearchText] = useState("");
  const [filterVisible, setFilterVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const overlay = useOverlayStore();
  const hasPermission = role === "1" || role === "2";

  const {
    orders,
    loading,
    refreshing,
    totalOrders,
    totalUSD,
    handleRefresh,
    canRefresh,
    cooldown,
    filters,
    setFilters,
    sellers,
    zones,
    statusList,
    procesadoslist,
    handleOpenInfoModal,
    handleOpenProductsModal,
    setModalInfoVisible,
    modalInfoVisible,
    setModalProductsVisible,
    modalProductsVisible,
    selectedOrder,
    selectedProducts,
    loadingProducts,
    activeFiltersCount,
    error,
    fetchOrders,
  } = useOrderSearch(searchText, "0");

  const handleCancel = async (order: OrderApproval) => {
    if (!hasPermission) return;

    Alert.alert(
      "Confirmar anulación",
      `¿Deseas anular el pedido #${order.fact_num}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            setSaving(true);
            try {
              const result = await cancelOrder(order.fact_num);
              if (result.success) {
                overlay.show("success", {
                  title: `Pedido anulado`,
                  subtitle: `Pedido ${order.fact_num} anulado con éxito`,
                });

                await handleRefresh(filters, true);
              } else {
                throw result.error;
              }
            } catch (err) {
              overlay.show("error", {
                title: `Error al anular pedido`,
                subtitle: `No se pudo anular el pedido ${order.fact_num}, intente nuevamente.`,
              });
            } finally {
              setSaving(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleApplyFilters = (newFilters: OrderFilters) => {
    setFilters(newFilters);
    setFilterVisible(false);
  };

  const renderOrderItem = useCallback(
    ({ item }: { item: OrderApproval }) => (
      <OrderSearchCard
        item={item}
        onPress={() => handleOpenInfoModal(item)}
        detailModal={() => handleOpenProductsModal(item)}
        onCancel={() => handleCancel(item)}
        hasPermission={hasPermission}
        markComment={async (_fact_num, _newComment, _ven_des) => false}
      />
    ),
    [handleOpenInfoModal, handleOpenProductsModal, hasPermission],
  );

  if (loading) return <Loader />;

  if (error) {
    return <ErrorView error={error} getData={() => fetchOrders()} />;
  }

  return (
    <>
      <ScreenSearchLayout
        searchText={searchText}
        setSearchText={setSearchText}
        placeholder="Buscar por cliente o número..."
        onFilterPress={() => setFilterVisible(true)}
        filterCount={activeFiltersCount}
        extrafilter={false}
        headerVisible={false}
      >
        <CustomFlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item, index) => `${item.fact_num}-${index}`}
          refreshing={refreshing}
          canRefresh={canRefresh}
          handleRefresh={() => handleRefresh(filters, true)}
          cooldown={cooldown}
          showtitle={true}
          title={`${totalOrders} ${totalOrders > 1 ? "pedidos" : "pedido"}`}
          subtitle={`Total ${totalVenezuela(totalUSD)}$`}
          ListEmptyComponent={
            <View className="p-10 items-center">
              <Text className="text-foreground dark:text-dark-foreground">
                No se encontraron pedidos para anular.
              </Text>
            </View>
          }
        />
      </ScreenSearchLayout>

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
        <OrderFilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          filters={filters}
          dataFilters={{
            zones,
            sellers,
            statusList,
            procesadoslist,
          }}
          onApply={handleApplyFilters}
          hasPermission={hasPermission}
          isCancelScreen={true}
        />
      )}
    </>
  );
}
