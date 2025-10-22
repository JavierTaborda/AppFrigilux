import { useRefreshControl } from "@/utils/userRefreshControl";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getGoals, getSellersGoals } from "../services/GoalsService";
import { Goals } from "../types/Goals";
import { Seller } from "../types/Seller";



export function useGoalsResumen(searchText: string) {
  const [goals, setGoals] = useState<Goals[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allGoals, setAllGoals] = useState<Goals[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);

  // Filters
  const [notUsed, setNotUsed] = useState<boolean>(false);
  const [sortByUsed, setSortByUsed] = useState<boolean>(false);
  const [sortByAssigned, setSortByAssigned] = useState<boolean>(false);

  // Sellers selection
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [loadingSellers, setLoadingSellers] = useState(false);

  const { refreshing, canRefresh, cooldown, wrapRefresh, cleanup } = useRefreshControl(10);

  const [initialized, setInitialized] = useState(false);


  /** Load goals */
  const loadGoals = useCallback(async (sellers?: string[]) => {

    setLoading(true);
    setError(null);

    try {
      const result = await getGoals(sellers);

      setAllGoals(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  /** Load sellers */
  const loadSellers = useCallback(async () => {

    setLoadingSellers(true);
    try {
      const result = await getSellersGoals();
      setSellers(result.map((s) => ({ codven: s.codven, vendes: s.vendes.trim() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSellers(false);
    }
  }, []);

  /** Refresh data */
  useEffect(() => cleanup, []);

  const handleRefresh = useCallback(() => {

    wrapRefresh(
      () => loadGoals(selectedSellers && selectedSellers.length > 0 ? selectedSellers : undefined),
      () => setError("Ocurrió un error al cargar los datos..."));
  }, [wrapRefresh]);

  /** Initial load */
  // useEffect(() => {
  //   loadGoals();
  //   loadSellers();
  // }, [loadGoals, loadSellers]);

  // useEffect(() => {

  //   loadGoals(selectedSellers && selectedSellers.length > 0 ? selectedSellers : undefined)
  // }, [selectedSellers])


  useFocusEffect(
    useCallback(() => {
     
      loadSellers();
      loadGoals(selectedSellers.length > 0 ? selectedSellers : undefined);
      setError(null);
      setInitialized(true);


      return () => {
        cleanup();
      };
    }, [selectedSellers])
  );


  useEffect(() => {
    if (!initialized) return;
    loadGoals(selectedSellers.length > 0 ? selectedSellers : undefined);
  }, [selectedSellers]);


  /** Apply filters */
  useEffect(() => {
    setLoading(true);

    let filteredgoals: Goals[] = [...allGoals];

    // Search filter
    if (searchText.length >= 3) {
      const lower = searchText.toLowerCase();
      filteredgoals = filteredgoals.filter(
        (goal) =>
          goal.artdes?.toLowerCase().includes(lower) ||
          goal.codart?.toLowerCase().includes(lower)
      );
    }

    // Not used filter
    if (notUsed) {
      filteredgoals = filteredgoals.filter((g) => g.utilizado < 1);
    }

    // Sorting
    if (sortByUsed) {
      filteredgoals.sort((a, b) => b.utilizado - a.utilizado);
    }
    if (sortByAssigned) {
      filteredgoals.sort((a, b) => b.asignado - a.asignado);
    }

    setGoals(filteredgoals);
    setLoading(false)

  }, [allGoals, searchText, notUsed, sortByUsed, sortByAssigned]);

  /** Summary */
  const resumen = useMemo(() => {
    const totalAsignada = goals.reduce((sum, g) => sum + (g.asignado || 0), 0);
    const totalUtilizado = goals.reduce((sum, g) => sum + (g.utilizado || 0), 0);
    const totalDisponible = totalAsignada - totalUtilizado;
    const totalPercent = totalAsignada > 0 ? totalUtilizado / totalAsignada : 0;
    const totalArticles = goals.length;
    const totalFilters = selectedSellers.length > 0 ? 1 : 0;
    return { totalAsignada, totalUtilizado, totalDisponible, totalPercent, totalArticles, totalFilters };
  }, [goals]);

  return {
    loadGoals,
    goals,
    sellers,
    selectedSellers,
    setSelectedSellers,
    loading,
    loadingSellers,
    error,
    ...resumen,
    notUsed,
    setNotUsed,
    sortByUsed,
    setSortByUsed,
    sortByAssigned,
    setSortByAssigned,
    handleRefresh,
    refreshing,
    canRefresh,
    cooldown,
  };
}
