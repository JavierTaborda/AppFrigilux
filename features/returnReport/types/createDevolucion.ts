import { dtdevolucion } from "./dtdevolucion";

export interface CreateDevolucion {

    motivo: string;              
    estatus: string;            
    anulada: string;             
    cerrada: string;             
    codcli: string;              
    clides: string;              
    codart: string;              
    artdes: string;              
    codbarra?: string;           
    serial1: string;             
    registradopor: string;       
    fecharegistro: string;       
    obsregistro?: string;        
    factnum: number;             // Default 0  DB
    owneruser: number;           // Default 1  DB
    linkproforma?: string;      // VarChar(60)

    dtdevolucion: dtdevolucion; 

}