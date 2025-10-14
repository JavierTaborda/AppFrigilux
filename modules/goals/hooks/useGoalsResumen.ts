import { useCallback, useState } from "react";
import { getGoals } from "../services/GoalsService";
import { Goals } from "../types/Goals";

export function useGoalsResumen(searchText: string) {
    const [goals, setGoals] = useState<Goals[]>([]);

    const [filters, setFilters] = useState<string>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const loadGoals = useCallback(async () => {
        try {
            const result = await getGoals()
            setGoals(result);

        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
            console.error("Error cargando filtros:", error);
        }
    }, []);


    // const activeFiltersCount =
    //     Object.values(filters).filter((v) => v !== undefined && v !== "").length ?? 0;

 
   // const totalAsignada:number =goals?.reduce((sum, g)=> sum + g.asignado,0);
    const totalAsignada:number =12750;
    const totalUtilizado:number =goals?.reduce((sum, g)=> sum + g.utilizado,0);
    const totalDisponible:number = totalAsignada-totalUtilizado;
    const totalPorcent:number=totalUtilizado/totalAsignada;
    return {
        goals,
        loadGoals,
        loading,
        error,
        totalAsignada,
        totalUtilizado,
        totalDisponible,
        totalPorcent

    };
}
