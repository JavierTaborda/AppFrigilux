// import { ClientData } from "@/types/clients";
// import { router, useFocusEffect } from "expo-router";
// import { useCallback, useEffect, useState } from "react";
// import { Alert } from "react-native";
// import { getClients, getItemsByGoals } from "../services/CreateOrderService";
// import useCreateOrderStore from "../stores/useCreateOrderStore";
// import { order } from "../types/order";
// import { OrderItem } from "../types/orderItem";

// const useCreateOrder = (searchText: string) => {
//   const [loading, setLoading] = useState(false);
//   const [loadSummary, setLoadSummary] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [neworder, setOrders] = useState<order[]>([]);
//   const [canRefresh, setCanRefresh] = useState(true);
//   const [productItems, setProductsItems] = useState<OrderItem[]>([]);
//   const [allproductItems, setAllProductsItems] = useState<OrderItem[]>([]);
//   const [notUsed, setNotUsed] = useState<boolean>(false);
//   const [selectedUsedValue, setSelectedUsedValue] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [sortByUsed, setSortByUsed] = useState<boolean>(false);
//   const [sortByAvailable, setSortByAvailable] = useState<boolean>(false);
//   const [sortByAssigned, setSortByAssigned] = useState<boolean>(false);
//   const [clients, setClients] = useState<ClientData[]>([]);
//   const { items } = useCreateOrderStore();


//   const loadItems = async () => {
//     setLoading(true);
//     try {
//       const result = await getItemsByGoals();
//       setAllProductsItems(result);
//       useCreateOrderStore.getState().syncWithProducts(result);
//     } catch (error) {
//       return { error };
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       loadItems();
//     }, [])
//   );
//   const createOrder = async () => {
//     setLoading(true);
//     try {
//       await new Promise((res) => setTimeout(res, 1000));
//       return { success: true };
//     } catch (error) {
//       return { success: false, error: "No se pudo crear el pedido." };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setLoading(true);
//     setRefreshing(true);
//     setCanRefresh(false);
//     setError(null);

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     } catch (err) {
//       setError("Error refreshing data");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//       setCanRefresh(true);
//     }
//   };


//   const handleSummary = async () => {
//     setLoadSummary(true);
//     try {
//       const clients = await getClients();
//       setClients(clients);

//       router.push({
//         pathname: "/(main)/(tabs)/(createOrder)/order-summary",
//         params: { clients: JSON.stringify(clients) },
//       });
//     } catch {
//       Alert.alert("Ocurrió un error", "Por favor, intenta nuevamente.");
//     } finally {
//       setLoadSummary(false);
//     }
//   };

//   // Filter and sort products when dependencies change
//   useEffect(() => {
//     setLoading(true);

//     try {
   
//       let filtered: OrderItem[] = [...allproductItems];

//       // Search filter
//       if (searchText && searchText.length >= 3) {
//         const lower = searchText.toLowerCase();
//         filtered = filtered.filter(
//           (order) =>
//             order.artdes?.toLowerCase().includes(lower) ||
//             order.codart?.toLowerCase().includes(lower)
//         );
//       }
//       // Not used / used / fulfilled filters (guard optional numeric fields)
//       if (notUsed || selectedUsedValue === 'NO USADOS') {
//         filtered = filtered.filter((g) => (g.utilizado) < 1);
//       } else if (selectedUsedValue === 'USADOS') {
//         filtered = filtered.filter((g) => (g.utilizado) > 0);
//       } else if (selectedUsedValue === 'CUMPLIDAS') {
//         filtered = filtered.filter((g) => (g.utilizado  === (g.asignado)));
//       }

//       // Category filter (use artdes since OrderItem has no catdes)
//       if (selectedCategory && selectedCategory !== 'TODOS') {
//         filtered = filtered.filter((g) => (g.artdes ?? "").startsWith(selectedCategory));
//       }
//       // Sorting (guard optional numeric fields)
//       if (sortByUsed) {
//         filtered.sort((a, b) => (b.utilizado ?? 0) - (a.utilizado ?? 0));
//       }
//       if (sortByAssigned) {
//         filtered.sort((a, b) => (b.asignado ?? 0) - (a.asignado ?? 0));
//       }

//       setProductsItems(filtered);
//     }

//     catch {

//     }
//     finally {
//       setLoading(false);
//     }

//   }, [allproductItems, searchText, notUsed, selectedUsedValue, selectedCategory, sortByUsed, sortByAssigned]);

//   return {
//     loading,
//     error,
//     canRefresh,
//     createOrder,
//     handleRefresh,
//     refreshing,
//     neworder,
//     productItems,
//     notUsed, setNotUsed,
//     selectedUsedValue, setSelectedUsedValue,
//     selectedCategory, setSelectedCategory,
//     sortByUsed, setSortByUsed,
//     sortByAvailable, setSortByAvailable,
//     sortByAssigned, setSortByAssigned,
//     handleSummary,
//     clients,
//     loadSummary
//   };
// };

// export default useCreateOrder;


import { ClientData } from "@/types/clients";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { getClients, getExchangeRate, getItemsByGoals } from "../services/CreateOrderService";
import useCreateOrderStore from "../stores/useCreateOrderStore";
import { OrderItem } from "../types/orderItem";

const useCreateOrder = (searchText: string) => {
  const [loading, setLoading] = useState(false);
  const [loadSummary, setLoadSummary] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allproductItems, setAllProductsItems] = useState<OrderItem[]>([]);
  const [notUsed, setNotUsed] = useState<boolean>(false);
  const [selectedUsedValue, setSelectedUsedValue] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortByUsed, setSortByUsed] = useState<boolean>(false);
  const [sortByAvailable, setSortByAvailable] = useState<boolean>(false);
  const [sortByAssigned, setSortByAssigned] = useState<boolean>(false);
  const [clients, setClients] = useState<ClientData[]>([]);
  const { items } = useCreateOrderStore();

  // Load items from backend
  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [result, exchange] = await Promise.all([getItemsByGoals(), getExchangeRate()]);
      setAllProductsItems(result);
      useCreateOrderStore.getState().syncWithProducts(result, exchange);
    } catch (err) {
      console.error("loadItems error:", err);
      setError("Error cargando productos");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [loadItems])
  );

  const createOrder = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      return { success: true };
    } catch (err) {
      console.error("createOrder error:", err);
      return { success: false, error: "No se pudo crear el pedido." };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setCanRefresh(false);
    setError(null);
    try {
      await loadItems();
    } catch (err) {
      console.error("handleRefresh error:", err);
      setError("Error refreshing data");
    } finally {
      setRefreshing(false);
      setCanRefresh(true);
    }
  }, [loadItems]);

  // local canRefresh state (kept as before)
  const [canRefresh, setCanRefresh] = useState(true);

  const handleSummary = useCallback(async () => {
    setLoadSummary(true);
    try {
      const clientsResult = await getClients();
      setClients(clientsResult);

      router.push({
        pathname: "/(main)/(tabs)/(createOrder)/order-summary",
        params: { clients: JSON.stringify(clientsResult) },
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
        (g.artdes ?? "").startsWith(selectedCategory)
      );
    }

    if (sortByUsed) {
      filtered.sort((a, b) => (b.utilizado ?? 0) - (a.utilizado ?? 0));
    }

    if (sortByAssigned) {
      filtered.sort((a, b) => (b.asignado ?? 0) - (a.asignado ?? 0));
    }

    // If asking for only available items, filter here (keeps backward compatibility)
    if (sortByAvailable) {
      filtered = filtered.filter((p) => p.available);
    }

    return filtered;
  }, [allproductItems, searchText, notUsed, selectedUsedValue, selectedCategory, sortByUsed, sortByAssigned, sortByAvailable]);

  return {
    loading,
    error,
    canRefresh,
    createOrder,
    handleRefresh,
    refreshing,
    productItems: filteredProducts,
    filteredProducts, // exposed for backwards compat
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
  };
};

export default useCreateOrder;
