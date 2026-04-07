import { ftdevolucion } from "./ftdevolucion";

export interface dtdevolucion  {
    devonum: number;
    prednum: number;
    fechadespacho: string | null; // ISO String
    pednum: number;
    codven: string;
    vendes: string;
    codzon?: string;  
    zondes?: string;
    recibidopor?: string;
    fecharecibido?: string; // ISO String
    obsrecibido?: string;
    chofer?: string;
    placa?: string;
    revisionpor?: string;
    fecharevision?: string; // ISO String
    obsrevision?: string;
    enviorevision: string; // Char(1)
    tecnicopor?: string;
    fechatecnico?: string; // ISO String
    obstecnico?: string;
    enviotecnico: string; // Char(1)
    almacenpor?: string;
    fechaalmacen?: string; // ISO String
    obsalmacen?: string;
    envioalmacen: string; // Char(1)
    tiempofactura?: string;
    ftdevolucion?: ftdevolucion;
}
