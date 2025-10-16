import { useRefreshControl } from "@/utils/userRefreshControl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getGoals } from "../services/GoalsService";
import { Goals } from "../types/Goals";

export function useGoalsResumen(searchText: string) {
  const [goals, setGoals] = useState<Goals[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allGoals, setAllGoals] = useState<Goals[]>([]);

  //filters states
  const [notUsed, setNotUsed] = useState<boolean>(false);
  const [sortByUsed, setSortByUsed] = useState<boolean>(false);
  const [sortByAssigned, setSortByAssigned] = useState<boolean>(false);

  const { refreshing, canRefresh, cooldown, wrapRefresh, cleanup } =
    useRefreshControl(10);

  const loadGoals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getGoals();
      const filteredGoals = result.filter((goal) => goal.artdes !== "");

      setAllGoals(filteredGoals);
    } catch (err) {
      console.error("Error cargando metas:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  //refresh data logic
  useEffect(() => cleanup, []); //destroy second plane of the cooldown
  const handleRefresh = useCallback(() => {
    wrapRefresh(
      () => loadGoals(),
      () => setError("Ocurrió un error al cargar los datos...")
    );
  }, [wrapRefresh]);

  // InitialLoad
  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  useEffect(() => {
    if (searchText.length === 0) {
      setGoals(allGoals);
    } else if (searchText.length >= 3) {
      const lower = searchText.toLowerCase();
      const filtered = allGoals.filter(
        (goal) =>
          goal.artdes?.toLowerCase().includes(lower) ||
          goal.codart?.toLowerCase().includes(lower)
      );
      setGoals(filtered);
    }
  }, [searchText, allGoals]);

  // memo
  const resumen = useMemo(() => {
    const totalAsignada =
      goals.reduce((sum, g) => sum + (g.asignado || 0), 0) || 0;
    const totalUtilizado =
      goals.reduce((sum, g) => sum + (g.utilizado || 0), 0) || 0;
    const totalDisponible = totalAsignada - totalUtilizado;
    const totalPercent = totalAsignada > 0 ? totalUtilizado / totalAsignada : 0;
    const totalArticles = goals.length;

    return {
      totalAsignada,
      totalUtilizado,
      totalDisponible,
      totalPercent,
      totalArticles,
    };
  }, [goals]);

  return {
    goals,
    loadGoals,
    loading,
    error,
    ...resumen,
    // refresh
    handleRefresh,
    refreshing,
    canRefresh,
    cooldown,
    // filters
    notUsed,
    setNotUsed,
    sortByUsed,
    setSortByUsed,
    sortByAssigned,
    setSortByAssigned,
  };
}
