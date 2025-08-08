import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getOrdersToApproval } from "../services/OrderApprovalService";
import { OrderApproval } from "../types/OrderApproval";

export function useAuthPays(searchText: string) {
  // Estado de pedidos, loading, refrescando y control cooldown
  // Orders, loading state, refreshing state, and cooldown control
  const [ordersAproval, setOrdersAproval] = useState<OrderApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(true);
  const [cooldown, setCooldown] = useState(0);

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
      .then(setOrdersAproval)
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
      .then(setOrdersAproval)
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
    const search = searchText.toLowerCase().trim();
    const filtered = ordersAproval.filter((order) =>
      order.cli_des?.toLowerCase().includes(search)
    );
    return {
      filteredOrders: filtered,
      totalOrders: filtered.length,
      totalUSD: filtered
      .filter((order) => order.anulada !== 1)
      .reduce(
        (acc, order) => acc + (parseFloat(order.tot_neto as string) || 0), 
        0
      ),
    };
  }, [ordersAproval, searchText]);

  return {
    filteredOrders,
    loading,
    refreshing,
    totalOrders,
    totalUSD,
    handleRefresh,
    canRefresh,
    cooldown,
  };
}
