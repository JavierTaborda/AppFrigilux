import api from "@/lib/axios";
import { statusOptions, Vendors, Zones } from "../types/OrderFilters";

export const getOrdersToApproval = async () => {
  const response = await api.get("orders/approval");
  return response.data;
};

export const getPedidosFiltrados = async ({
  dateIni,
  dateEnd,
  estatus,
  cancelled,
  vendor,
}: {
  dateIni?: string;
  dateEnd?: string;
  estatus?: string;
  cancelled?: boolean;
  vendor?: string;
}) => {
  const response = await api.get("orders/approval/filters", {
    params: {
      dateIni,
      dateEnd,
      estatus,
      cancelled,
      vendor,
    },
  });
  return response.data;
};

export const getOrderProducts = async (fact_num: number) => {
  const response = await api.get(`/orders/rengpedidos/${fact_num}`);
   return response.data;

};

export const changeRevisado = async (fact_num: number, status: string) => {
  try {
    const response = await api.patch(`/orders/${fact_num}`, {
      status,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return { success: false, error };
  }
};

export const getZones = async () => {
  const response =  await api.get("/zones");
  const zones: Zones[] = response.data;
   const filterZones = zones
     .map((zon: Zones) =>
       typeof zon.zon_des === "string" ? zon.zon_des.trim() : ""
     )
     .filter((value, index, self) => value && self.indexOf(value) === index);
  return ["TODOS", ...filterZones];
};



export const getVendors = async () => {
  const response = await api.get("/vendors");
  const vendors: Vendors[] = response.data;

  const sellerNames = vendors
    .map((ven: Vendors) =>
      typeof ven.ven_des === "string" ? ven.ven_des.trim() : ""
    )
    .filter((value, index, self) => value && self.indexOf(value) === index);

  return ["TODOS", ...sellerNames];
};

export const getStatus = async () => {
  const statusOptionsList: statusOptions[] = [
    { label: "Todos", value: "" },
    { label: "Por Revisar", value: "0" },
    { label: "Revisado", value: "1" },
    { label: "Anulado", value: "anulada" },
  ];
  return statusOptionsList;
};
