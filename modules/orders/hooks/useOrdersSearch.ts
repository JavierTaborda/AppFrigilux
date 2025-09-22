import { useCallback, useState } from "react";
import { getPedidosFiltrados } from "../services/OrderApprovalService";
import { OrderApproval } from "../types/OrderApproval";
import { OrderFilters } from "../types/OrderFilters";


export function useOrderApproval(searchText: string) {
      const [loading, setLoading] = useState(true);
      const [refreshing, setRefreshing] = useState(false);
      const [canRefresh, setCanRefresh] = useState(true);
      const [cooldown, setCooldown] = useState(0);
      const [orders, setOrders] = useState<OrderApproval[]>([]);

      const [filters, setFilters] = useState<OrderFilters>({});
      
        //error
        const [error, setError] = useState<string | null>(null);

    const loadFilters = useCallback(() => {
        // placeholder to compute or refresh available filters if needed
    }, []);

    const getOrders = useCallback(() => {
        setLoading(true);
        setError(null);
        getPedidosFiltrados(filters)
            .then((data) => {
                setOrders(data);
                loadFilters();
            })
            .catch((err) => {
                console.error(err);
                setError(
                    "No logramos acceder a los pedidos... Intenta de nuevo en un momento"
                );
            })
            .finally(() => setLoading(false));
    }, [filters, loadFilters]);
return{
    loading,
    refreshing,
    canRefresh,
    cooldown,
    orders,
    filters,
    error,
    getOrders,
    setFilters,
}
}