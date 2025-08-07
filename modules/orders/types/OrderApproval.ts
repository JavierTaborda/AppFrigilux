export interface OrderApproval{
  fact_num: number;
  estatus: string;
  comentario: string;
  saldo: string;
  fec_emis: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  fec_venc: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  co_cli: string;
  cli_des: string;
  credito: number;
  co_ven: string;
  ven_des: string;
  co_tran: string;
  des_tran: string;
  dir_ent: string;
  forma_pag: string;
  cond_des: string;
  revisado: string;
  tot_bruto: string;
  tot_neto: string;
  glob_desc: string;
  iva: string;
  impresa: number;
  aux02: string;
  tasa: string;
  moneda: string;
  anulada: number;
  co_zon: string;
  zon_des: string;
  reng_max: number;
}