export type calculateTotalsPedidoResults = {
    totalBruto: number;
    totalIVA: number;
    totalNeto: number;
    bsBruto: number;
    ivaBS: number;
    totalNetoBS: number;
};

export const calculateTotalsPedido = (
    tot_bruto_usd: number,
    IVA: number,
    tasa_v: number,

): calculateTotalsPedidoResults => {

    const totalBruto = Number(tot_bruto_usd.toFixed(2));
    const totalIVA = Number((totalBruto * IVA).toFixed(2));
    const totalNeto = Number((totalBruto + totalIVA).toFixed(2));

    const bsBruto = Number((totalBruto * tasa_v).toFixed(2));
    const ivaBS = Number((totalIVA * tasa_v).toFixed(2));

    const totalNetoBS = Number((bsBruto + ivaBS).toFixed(2));

    return { totalBruto, totalIVA, totalNeto, bsBruto, ivaBS, totalNetoBS };
};