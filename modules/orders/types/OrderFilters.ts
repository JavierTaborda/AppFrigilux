export type OrderStatus = "0" | "1" | "anulada" | "" | undefined;

export type OrderFilters = {
  startDate?: Date;
  endDate?: Date;
  status?: OrderStatus;
  seller?: string;
  zone?: string;
};

export type statusOptions = { label: string; value: OrderStatus };

export type Vendors = {
  cod_ven: string;
  ven_des?: string;
};

export type Zones = {
  co_zon: string;
  zon_des?: string;
};
