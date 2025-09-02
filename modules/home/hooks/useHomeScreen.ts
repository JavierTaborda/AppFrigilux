import { useCallback, useEffect, useState } from "react";
import { getPedidos } from "../services/HomeScreenServices";
import Pedidos from "../types/Pedidos";

export function useHomeScreen() {
  const [pedidos, setPedidos] = useState<Pedidos[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = useCallback(() => {
    setLoading(true);
    getPedidos()
      .then((data) => {
        setPedidos(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return {
    getData,
    pedidos,
    loading,

  };
}
