import { useCallback, useEffect, useMemo, useState } from "react";
import { getPedidos } from "../services/HomeScreenServices";
import Pedidos from "../types/Pedidos";

// show Mil / Millon
const formatAbbreviated = (value: number | string): string => {
  const number = typeof value === "string" ? parseFloat(value) : value;
  if (number >= 1_000_000) return `$ ${(number / 1_000_000).toFixed(1)} Mill`;
  if (number >= 1_000) return `$ ${(number / 1_000).toFixed(1)} Mil`;
  return `$ ${number.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export function useHomeScreen() {
  const [pedidos, setPedidos] = useState<Pedidos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getData = useCallback(() => {
    
    setLoading(true);
    setError(null)
    getPedidos()
      .then((data) => setPedidos(data || []))
      .catch((err) => {
        console.error(err);
        setError("Ocurrió un error al cargar los datos...");
      })

      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  // Totals  by day + labels
  const totalsByDate = useMemo(() => {
    const grouped: Record<string, number> = pedidos.reduce(
      (acc, pedido) => {
        const date = pedido.fec_emis?.split("T")[0];
        const tot = Number(pedido.tot_neto) || 0;
        if (date) acc[date] = (acc[date] || 0) + tot;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(grouped)
      .map(([x, y]) => ({
        x,
        y: y || 0,
        label: formatAbbreviated(y || 0),
        dayLabel: new Date(x).getDate().toString(),
      }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
  }, [pedidos]);

  // Totals
  const totalPedidos = pedidos.length;
  const totalNeto = pedidos.reduce(
    (acc, p) => acc + (Number(p.tot_neto) || 0),
    0
  );

  return {
    getData,
    pedidos,
    loading,
    error,
    totalsByDate,
    totalPedidos,
    totalNeto,
  };
}
