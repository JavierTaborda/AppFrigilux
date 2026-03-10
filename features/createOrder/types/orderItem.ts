export type OrderItem = {
  codart: string;
  artdes: string;
  price: number;
  price2: number;
  codven?: string; 
  asignado?: number;
  utilizado?: number; 
  available: number; //asignado - utilizado
  quantity: number;
  img?:string
  discount?: string;
  cos_pro_un?: number;
  ult_cos_un?: number;
  ult_cos_om?: number;
  cos_pro_om?: number;
  tip_imp?: string;
  co_cat?:string;
  cat_art?:{
    cat_des?:string;
  }
  
}
