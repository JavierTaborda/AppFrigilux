import api from "@/lib/axios";
import type {
  AccountReceivable,
  AccountReceivableDetail,
} from "../types/AccountsReceivable";

export const getAllAccountsReceivable = async (): Promise<AccountReceivable[]> => {
  try {
    const response = await api.get<AccountReceivable[]>("/accounts-receivable/all");
    return response.data;
  } catch (error) {
    console.error("Error obteniendo cuentas por cobrar:", error);
    throw error;
  }
};

export const getAccountsReceivableByClient = async (
  clientCode: string,
): Promise<AccountReceivableDetail[]> => {
  try {
    const normalizedCode = clientCode.trim();
    if (!normalizedCode) {
      throw new Error("El código del cliente es requerido.");
    }

    const response = await api.get<AccountReceivableDetail[]>(
      "/accounts-receivable",
      {
        params: { co_cli: normalizedCode },
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error obteniendo detalle de cuentas por cobrar:", error);
    throw error;
  }
};