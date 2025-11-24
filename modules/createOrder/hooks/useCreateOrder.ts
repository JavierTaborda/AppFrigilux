import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { getItemsByGoals } from "../services/CreateOrderService";
import { order } from "../types/order";
import { OrderItem } from "../types/orderItem";

const useCreateOrder = (searchText: string) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [neworder, setOrders] = useState<order[]>([]);
  const [canRefresh, setCanRefresh] = useState(true);
  const [productItems, setProductsItems] = useState<OrderItem[]>([]);
  const [allproductItems, setAllProductsItems] = useState<OrderItem[]>([]);
  const [notUsed, setNotUsed] = useState<boolean>(false);
  const [sortByAvailable, setSortByAvailable] = useState<boolean>(false);
  const [sortByAssigned, setSortByAssigned] = useState<boolean>(false);


  const loadItems = async () => {
    setLoading(true);
    try {
      const result = await getItemsByGoals();
      setAllProductsItems(result);
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );
  const createOrder = async () => {
    setLoading(true);
    try {
      // Simulación API: aquí harías fetch a tu backend NestJS
      await new Promise((res) => setTimeout(res, 1000));
      return { success: true };
    } catch (error) {
      return { success: false, error: "No se pudo crear el pedido." };
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setRefreshing(true);
    setCanRefresh(false);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError("Error refreshing data");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setCanRefresh(true);
    }
  };

  useEffect(() => {

    setLoading(true);

    let filtered: OrderItem[] = [...allproductItems];

    // Search filter
    if (searchText.length >= 3) {
      const lower = searchText.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.artdes?.toLowerCase().includes(lower) ||
          order.codart?.toLowerCase().includes(lower)
      );
    }

    setProductsItems(filtered);
    setLoading(false)

  }
    , [allproductItems, searchText])

  return {
    loading,
    error,
    canRefresh,
    createOrder,
    handleRefresh,
    refreshing,
    neworder,
    productItems,
    notUsed, setNotUsed,
    sortByAvailable, setSortByAvailable,
    sortByAssigned, setSortByAssigned
  };
};

export default useCreateOrder;
