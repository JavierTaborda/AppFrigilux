

import { ClientData } from "@/types/clients";
import { useRefreshControl } from "@/utils/userRefreshControl";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import { CategoryArt } from "../interfaces/CategoryArt";
import { PedidoDTO } from "../interfaces/pedidoDTO";
import { getClients, getConditionsPay, getExchangeRate, getItemsByGoals, getIVA, insertOrder } from "../services/CreateOrderService";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { Conditions } from "../types/conditions";
import { OrderItem } from "../types/orderItem";

const useCreateOrder = (searchText: string) => {
  const [loading, setLoading] = useState(false);
  const [loadSummary, setLoadSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allproductItems, setAllProductsItems] = useState<OrderItem[]>([]);
  const [notUsed, setNotUsed] = useState<boolean>(false);
  const [selectedUsedValue, setSelectedUsedValue] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [sortByUsed, setSortByUsed] = useState<boolean>(false);
  const [sortByAvailable, setSortByAvailable] = useState<boolean>(false);
  const [sortByAssigned, setSortByAssigned] = useState<boolean>(false);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [conditionsPay, setCondtionsPay] = useState<Conditions[]>([]);


  const { refreshing, canRefresh, cooldown, wrapRefresh, cleanup } = useRefreshControl(10);
  const loadedRef = useRef(false);


  const loadItems = useCallback(async () => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setLoading(true);

    try {
      const [result, exchange, iva] = await Promise.all([
        getItemsByGoals(),
        getExchangeRate(),
        getIVA(),
      ]);

      setAllProductsItems(result);
      useCreateOrderStore.getState().syncWithProducts(result, exchange, iva);
    } catch (err) {
      setError("Error cargando productos");
    } finally {
      setLoading(false);
      loadedRef.current = false;
    }
  }, []);

  const categories:CategoryArt[] = useMemo(() => {

    const uniqueCats = new Map<string, string>();

    allproductItems.forEach(item => {
      const code = item.co_cat?.trim();
      const name = item.cat_art?.cat_des?.trim();
      if (code && name && !uniqueCats.has(code)) {
        uniqueCats.set(code, name);
      }
    });

    const list: CategoryArt[] = [
      { co_cat: "TODOS", cat_des: "TODOS" }
    ];

    const sortedCategories = Array.from(uniqueCats.entries())
      .map(([co_cat, cat_des]) => ({
        co_cat,
        cat_des
      }))
      .sort((a, b) => a.cat_des.localeCompare(b.cat_des));

    return list.concat(sortedCategories);
  }, [allproductItems]);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  const createOrder = useCallback(async (pedido: PedidoDTO) => {
    setLoading(true);

    try {
      const response = await insertOrder(pedido);
      const factNumber: string = response?.factNumber || "N/A";
      return { success: true, factNumber };

    } catch (err) {
      //console.error("createOrder error:", err);
      return { success: false, error: "No se pudo crear el pedido." };
    } finally {
      setLoading(false);
      loadedRef.current = false;
      router.push("/(main)/(tabs)/(createOrder)/create-order");
    }
  }, [loadItems]);

  // const handleRefresh = useCallback(async () => {
  //   if (canRefresh) return;
  //   loadedRef.current = true;
  //   setRefreshing(true);
  //   setCanRefresh(false);

  //   try {
  //     await loadItems();
  //   } finally {
  //     setRefreshing(false);
  //     setCanRefresh(true);
  //     loadedRef.current = false;
  //   }
  // }, [loadItems]);

  const handleRefresh = useCallback(() => {
    wrapRefresh(async () => {
      if (!canRefresh) return;
      loadedRef.current = true;

      try {
        await loadItems();
      } finally {
        loadedRef.current = false;
      }
    });
  }, [wrapRefresh, canRefresh, loadItems]);



  const handleSummary = useCallback(async () => {
    setLoadSummary(true);
    try {
      const [clientsResult, conditionsPay] = await Promise.all([getClients(), getConditionsPay()]);
      setClients(clientsResult);
      setCondtionsPay(conditionsPay);


      router.push({
        pathname: "/(main)/(tabs)/(createOrder)/order-summary",
        params: { clients: JSON.stringify(clientsResult), options: JSON.stringify(conditionsPay) },
      });
    } catch (err) {
      console.error("handleSummary error:", err);
      Alert.alert("Ocurrió un error", "Por favor, intenta nuevamente.");
    } finally {
      setLoadSummary(false);
    }
  }, []);

  // Filtering & sorting with useMemo (single stable memo)
  const filteredProducts = useMemo(() => {
    let filtered: OrderItem[] = [...allproductItems];

    if (searchText && searchText.length >= 3) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.artdes?.toLowerCase().includes(lower) ||
          order.codart?.toLowerCase().includes(lower)
      );
    }

    if (notUsed || selectedUsedValue === "NO USADOS") {
      filtered = filtered.filter((g) => (g.utilizado ?? 0) < 1);
    } else if (selectedUsedValue === "USADOS") {
      filtered = filtered.filter((g) => (g.utilizado ?? 0) > 0);
    } else if (selectedUsedValue === "CUMPLIDAS") {
      filtered = filtered.filter(
        (g) => (g.utilizado ?? 0) === (g.asignado ?? 0)
      );
    }

    if (selectedCategory && selectedCategory !== "TODOS") {
      filtered = filtered.filter((g) =>
        (g.co_cat ?? "").startsWith(selectedCategory)
      );
    }

    if (sortByUsed) {
      filtered.sort((a, b) => (b.utilizado ?? 0) - (a.utilizado ?? 0));
    }

    if (sortByAssigned) {
      filtered.sort((a, b) => (b.asignado ?? 0) - (a.asignado ?? 0));
    }


    if (sortByAvailable) {
      filtered = filtered.filter((p) => p.available);
    }

    return filtered;
  }, [allproductItems, searchText, notUsed, selectedUsedValue, selectedCategory, sortByUsed, sortByAssigned, sortByAvailable]);





  return {
    loading,
    error,
    canRefresh,
    cooldown,
    createOrder,
    handleRefresh,
    refreshing,
    productItems: filteredProducts,
    filteredProducts,
    notUsed,
    setNotUsed,
    selectedUsedValue,
    setSelectedUsedValue,
    selectedCategory,
    setSelectedCategory,
    sortByUsed,
    setSortByUsed,
    sortByAvailable,
    setSortByAvailable,
    sortByAssigned,
    setSortByAssigned,
    handleSummary,
    clients,
    loadSummary,
    categories
  };
};

export default useCreateOrder;
