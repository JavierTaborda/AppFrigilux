import { useAuthStore } from "@/stores/useAuthStore";
import { isAxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAccountsReceivableByClient,
  getAllAccountsReceivable,
} from "../services/AccountsReceivableService";
import type {
  AccountReceivable,
  AccountReceivableDetail,
  AccountReceivableFilters,
  AccountReceivableTotals,
} from "../types/AccountsReceivable";

export function useAccountsReceivable() {
  const { token, signOutSoft } = useAuthStore();
  const [allAccounts, setAllAccounts] = useState<AccountReceivable[]>([]);
  const [filters, setFilters] = useState<AccountReceivableFilters>({
    clientQuery: "",
    currency: "",
    documentType: "",
  });
  const [details, setDetails] = useState<AccountReceivableDetail[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadAccounts = useCallback(async () => {
    if (!token) {
      setError("La sesión ha expirado. Inicia sesión nuevamente.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setAllAccounts(await getAllAccountsReceivable());
      setHasLoaded(true);
    } catch (requestError) {
      if (isAxiosError(requestError) && requestError.response?.status === 401) {
        await signOutSoft();
        return;
      }

      if (isAxiosError(requestError) && requestError.response?.status === 400) {
        setError("No se pudieron cargar las cuentas por cobrar.");
      } else {
        setError("No se pudo consultar las cuentas por cobrar.");
      }
    } finally {
      setLoading(false);
    }
  }, [signOutSoft, token]);

  useEffect(() => {
    const loadTask = setTimeout(() => {
      void loadAccounts();
    }, 0);

    return () => clearTimeout(loadTask);
  }, [loadAccounts]);

  const loadDetails = useCallback(
    async (clientCode: string) => {
      if (!clientCode.trim()) {
        setDetailsError("El código del cliente es requerido.");
        return;
      }

      if (!token) {
        setDetailsError("La sesión ha expirado. Inicia sesión nuevamente.");
        return;
      }

      setDetailsLoading(true);
      setDetailsError(null);
      try {
        setDetails(await getAccountsReceivableByClient(clientCode));
      } catch (requestError) {
        if (isAxiosError(requestError) && requestError.response?.status === 401) {
          await signOutSoft();
          return;
        }
        setDetailsError("No se pudo cargar el detalle del cliente.");
      } finally {
        setDetailsLoading(false);
      }
    },
    [signOutSoft, token],
  );

  const accounts = useMemo(() => {
    const query = filters.clientQuery.trim().toLowerCase();

    return allAccounts.filter((account) => {
      const matchesClient =
        !query ||
        account.co_cli.toLowerCase().includes(query) ||
        account.cli_des.toLowerCase().includes(query);
      return matchesClient;
    });
  }, [allAccounts, filters]);

  const totals = accounts.reduce<AccountReceivableTotals>(
    (result, account) => {
      const credit = Number(account.mont_cre);
      const balance = Number(account.monto);
      result.balance += balance;

      if (credit > 0) {
        result.credit += credit;
        result.difference += Number(account.diferencia);
      } else {
        result.noCreditBalance += balance;
      }

      return result;
    },
    { credit: 0, balance: 0, difference: 0, noCreditBalance: 0 },
  );

  return {
    accounts,
    allAccounts,
    filters,
    setFilters,
    loading,
    error,
    hasLoaded,
    loadAccounts,
    loadDetails,
    details,
    detailsLoading,
    detailsError,
    totals,
  };
}