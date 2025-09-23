import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    getOrdersToApproval,
    getPedidosFiltrados
} from "../services/OrderService";
import { OrderApproval } from "../types/OrderApproval";
import { useOrderFilters } from "./useOrderFilters";
import { useOrderModals } from "./useOrderModals";

export function useOrderSearch(searchText: string) {
    /* -------------------------------------------------------------------------- */
    /*                                  ESTADOS                                  */
    /* -------------------------------------------------------------------------- */
   
    const [orders, setOrders] = useState<OrderApproval[]>([]); 
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // control de cooldown
    const [canRefresh, setCanRefresh] = useState(true);
    const [cooldown, setCooldown] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // filtros

    const { filters, loadFilters, sellers, zones, statusList, setFilters, } = useOrderFilters();
    const modalsData = useOrderModals();

    /* -------------------------------------------------------------------------- */
    /*                               UTILS - HELPERS                              */
    /* -------------------------------------------------------------------------- */
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

    /* -------------------------------------------------------------------------- */
    /*                            DATA FETCHING FUNCTIONS                         */
    /* -------------------------------------------------------------------------- */


    const fetchOrders = useCallback(() => {
        setLoading(true);
        setError(null);
        console.log("hola")

        getPedidosFiltrados(filters)
            .then((data) => {
                setOrders(data);
                loadFilters();
            })
            .catch(() =>
                setError("No logramos acceder a los pedidos... Intenta de nuevo en un momento")
            )
            .finally(() => setLoading(false));
    }, [filters, loadFilters]);

    /* -------------------------------------------------------------------------- */
    /*                               USER INTERACTION                             */
    /* -------------------------------------------------------------------------- */
    const handleRefresh = useCallback(() => {
        if (!canRefresh) return;

        setError(null);
        setRefreshing(true);
        setCanRefresh(false);
        startCooldown(30);

        getOrdersToApproval()
            .then((data) => setOrders(data))
            .catch(() => setError("Ocurrió un error al cargar los datos..."))
            .finally(() => {
                setRefreshing(false);
                timeoutRef.current = setTimeout(() => setCanRefresh(true), 30000);
            });
    }, [canRefresh]);

    /* -------------------------------------------------------------------------- */
    /*                                 USE EFFECTS                                */
    /* -------------------------------------------------------------------------- */
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [fetchOrders])
    );

    /* -------------------------------------------------------------------------- */
    /*                                   MEMOS                                    */
    /* -------------------------------------------------------------------------- */
    const { totalOrders, totalUSD } = useMemo(() => {
    
        const totalUSD = orders
            .filter((order) => order.anulada !== 1)
            .reduce((acc, order) => acc + (parseFloat(order.tot_neto as string) || 0), 0);

        return { totalOrders: orders.length, totalUSD };
    }, [orders, searchText, filters]);

    const activeFiltersCount =
        Object.values(filters).filter((value) => value !== undefined && value !== "").length ?? 0;

    /* -------------------------------------------------------------------------- */
    /*                                  RETURN                                    */
    /* -------------------------------------------------------------------------- */
    return {
        orders,
        totalOrders,
        totalUSD,
        loading,
        refreshing,
        error,

        // refresh
        handleRefresh,
        canRefresh,
        cooldown,
        fetchOrders,

        // modales

        ...modalsData,

        // filtros
        sellers,
        zones,
        statusList,
        filters,
        setFilters,
        activeFiltersCount,
    };
}
