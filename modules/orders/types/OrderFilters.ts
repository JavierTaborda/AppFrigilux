export type OrderStatus="0" | "1" | "anulada" | "" | undefined

export type OrderFilters = {
  startDate?: Date;
  endDate?: Date;
  status?: OrderStatus
  seller?: string;
  zone?: string;
};

export type statusOptions= { label: string; value: OrderStatus }