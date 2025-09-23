import { useCallback, useState } from "react";
import { getStatus, getVendors, getZones } from "../services/OrderService";
import { OrderFilters, statusOptions } from "../types/OrderFilters";

export function useOrderFilters() {
    const [zones, setZones] = useState<string[]>([]);
    const [sellers, setSellers] = useState<string[]>([]);
    const [statusList, setStatusList] = useState<statusOptions[]>([]);
    const [filters, setFilters] = useState<OrderFilters>({});
   

    const loadFilters = useCallback(async () => {
        try {
            const [zonesData, sellersData, statusData] = await Promise.all([
                getZones(),
                getVendors(),
                getStatus(),
            ]);
            setZones(zonesData);
            setSellers(sellersData);
            setStatusList(statusData);
        } catch (error) {
            console.error("Error cargando filtros:", error);
        }
    }, []);


    const activeFiltersCount =
        Object.values(filters).filter((v) => v !== undefined && v !== "").length ?? 0;

    return {
        zones,
        sellers,
        statusList,
        filters,
        setFilters,
        activeFiltersCount,
        loadFilters,
    };
}
