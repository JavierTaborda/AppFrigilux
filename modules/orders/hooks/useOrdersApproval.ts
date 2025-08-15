import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Platform, ToastAndroid } from "react-native";
import { getOrderProducts, getOrdersToApproval, getSellers, getStatus, getZones } from "../services/OrderApprovalService";
import { OrderApproval, OrderApprovalProduct } from "../types/OrderApproval";
import { OrderFilters, statusOptions } from "../types/OrderFilters";
import { applyOrderFilters } from "../utils/applyOrderFilters";

export function useOrderApproval(searchText: string) {
  // Estado de pedidos, loading, refrescando y control cooldown
  // Orders, loading state, refreshing state, and cooldown control
  const [ordersAproval, setOrdersAproval] = useState<OrderApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(true);
  const [cooldown, setCooldown] = useState(0);
  const [orders, setOrders] = useState<OrderApproval[]>([]);//just use locally with JSON 

  //filters
  const [zones, setZones] = useState<string[]>([]);
  const [sellers, setSellers] = useState<string[]>([]);
  const [statusList, setStatusList] = useState<statusOptions[]>([]);

  const [filters, setFilters] = useState<OrderFilters>({
    // startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dais
    // endDate: new Date(), // hoy
  });


  // Referencia para guardar el id del timeout y poder limpiarlo
  // Ref to store the timeout id for cleanup
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * startCooldown inicia un contador regresivo de segundos usando setTimeout recursivo.
   * Disminuye el estado cooldown cada segundo hasta llegar a 0 y limpia el timeout.
   *
   * startCooldown starts a countdown timer using recursive setTimeout.
   * It decreases cooldown state every second until reaching 0, then clears the timeout.
   */
  function startCooldown(seconds: number) {
    setCooldown(seconds);

    function tick() {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          return 0;
        }
        timeoutRef.current = setTimeout(tick, 1000);
        return prev - 1;
      });
    }

    timeoutRef.current = setTimeout(tick, 1000);
  }

  /**
   * fetchOrders carga la lista de pedidos desde el backend y actualiza estados de carga.
   *
   * fetchOrders loads the order list from backend and updates loading states.
   */
  const fetchOrders = useCallback(() => {
    setLoading(true);
    getOrdersToApproval()
      .then((data) => {
        setOrdersAproval(data);
        loadFilters();
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /**
   * handleRefresh maneja el evento de refrescar (pull-to-refresh).
   * Si el cooldown está activo, muestra un toast o alerta.
   * Si no, inicia la recarga y el cooldown.
   *
   * handleRefresh handles the pull-to-refresh event.
   * If cooldown is active, shows a toast or alert.
   * Otherwise, triggers reload and starts cooldown.
   */
  const handleRefresh = useCallback(() => {
    if (!canRefresh) {

      return;
    }

    setRefreshing(true);
    setCanRefresh(false);
    startCooldown(30); // Iniciar cooldown de 30 segundos

    getOrdersToApproval()
      .then((data) => {
        setOrdersAproval(data);
        //loadFilters();
      })
      .catch(console.error)
      .finally(() => {
        setRefreshing(false);
        timeoutRef.current = setTimeout(() => {
          setCanRefresh(true);
        }, 30000);
      });
  }, [canRefresh, cooldown]);

  /**
   * useEffect para limpiar el timeout cuando el hook o componente se desmonta,
   * evitando fugas de memoria.
   *
   * useEffect cleans up the timeout when hook/component unmounts,
   * preventing memory leaks.
   */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Refrescar la lista cuando la pantalla gana foco
  // Refresh the list when screen gains focus
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  /**
   * useMemo para filtrar pedidos y calcular totales
   * según texto de búsqueda y lista actual.
   *
   * useMemo to filter orders and calculate totals
   * based on search text and current list.
   */


  const { filteredOrders, totalOrders, totalUSD } = useMemo(() => {
    const filtered = applyOrderFilters(ordersAproval, filters, searchText);

    const totalUSD = filtered
      .filter((order) => order.anulada !== 1)
      .reduce((acc, order) => {
        const monto =
          typeof order.tot_neto === "string"
            ? parseFloat(order.tot_neto)
            : order.tot_neto || 0;
        return acc + monto;
      }, 0);

    return {
      filteredOrders: filtered,
      totalOrders: filtered.length,
      totalUSD,
    };
  }, [ordersAproval, searchText, filters]);

  // just use locally with JSON
  useEffect(() => {
    setOrders(filteredOrders);
  }, [filteredOrders]);

  const handleChangeRevisado = async (fact_num: number, newStatus: string) => {
    // await updateOrderStatus(fact_num, newStatus); // replace local call with backend update
    setOrders(prev =>
      prev.map(order =>
        order.fact_num === fact_num
          ? { ...order, revisado: newStatus }
          : order
      )
    );

    const msg =
      newStatus === '1'
        ? `Pedido ${fact_num} marcado como Revisado`
        : `Pedido ${fact_num} marcado como Por Revisar`;

    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Estado actualizado', msg);
    }
  };

  //Modals and data
  const [selectedOrder, setSelectedOrder] = useState<OrderApproval>();
  const [modalInfoVisible, setModalInfoVisible] = useState(false);
  const [modalProductsVisible, setModalProductsVisible] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<OrderApprovalProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const handleOpenInfoModal = (order: OrderApproval) => {
    setSelectedOrder(order);
    setModalInfoVisible(true);
  };
  const handleOpenProductsModal = async (item: OrderApproval) => {
    try {

      setSelectedOrder(item);
      setLoadingProducts(true);
      const products = await getOrderProducts(item.fact_num);
      setSelectedProducts(products);
      setModalProductsVisible(true);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los productos del pedido' + error);
    } finally {
      setLoadingProducts(false);
    }
  };
  const loadFilters = useCallback(async () => {
    try {
      const [zonesData, sellersData, statusData] = await Promise.all([
        getZones(),
        getSellers(),
        getStatus(),
      ]);
      setZones(zonesData);
      setSellers(sellersData);
      setStatusList(statusData);
    } catch (error) {
      console.error("Error cargando filtros:", error);
    }
  }, []);

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== ""
  ).length ?? 0;


  return {
    filteredOrders,
    loading,
    refreshing,
    totalOrders,
    totalUSD,
    handleRefresh,
    canRefresh,
    cooldown,
    orders,//just use locally with JSON
    handleChangeRevisado,
    handleOpenInfoModal,
    handleOpenProductsModal,
    modalInfoVisible,
    setModalInfoVisible,
    modalProductsVisible,
    setModalProductsVisible,
    selectedOrder,
    selectedProducts,
    loadingProducts,
    sellers,
    zones,
    loadFilters,
    filters,
    setFilters,
    statusList,
    activeFiltersCount
  };
}
