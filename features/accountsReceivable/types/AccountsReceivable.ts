export type AccountReceivable = {
  co_cli: string;
  cli_des: string;
  moneda?: string;
  mont_cre: number;
  monto: number;
  diferencia: number;
};

export type AccountReceivableDetail = {
  renglon: string;
  tipo_doc: string;
  nro_doc: number;
  moneda: string;
  monto: number;
  fec_emis: string;
  co_cli: string;
  cli_des: string;
  observa: string | null;
  origen: string | null;
  origen_d: string | null;
};

export type AccountReceivableFilters = {
  clientQuery: string;
  currency: string;
  documentType: string;
};

export type AccountReceivableTotals = {
  credit: number;
  balance: number;
  difference: number;
  noCreditBalance: number;
};