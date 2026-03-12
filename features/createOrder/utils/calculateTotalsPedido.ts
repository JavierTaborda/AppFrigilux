export type calculateTotalsPedidoResults = {
    totalBruto: number;
    totalIVA: number;
    totalNeto: number;
    usdBruto: number;
    usdIva: number;
    totalNetoUsd: number;
};

export const calculateTotalsPedido = (
    tot_bruto_usd: number,
    tot_bruto_bs: number,
    IVA: number,
    tasa_v: number,

): calculateTotalsPedidoResults => {
    
    
    const usdBruto = Number(tot_bruto_usd.toFixed(2));
    const usdIva = Number((usdBruto * IVA).toFixed(2));
    const totalNetoUsd = Number((usdBruto + usdIva).toFixed(2));

    const totalBruto = Number((usdBruto * tasa_v).toFixed(2));
    const totalIVA = Number((usdIva * tasa_v).toFixed(2));

    const totalNeto = Number((totalNetoUsd* tasa_v).toFixed(2));
    
    //Calculate in Bs
    // let totalBruto = Number(tot_bruto_bs.toFixed(2));
    // const totalIVA = Number((totalBruto * IVA).toFixed(2));
    // const totalNeto = Number((totalBruto + totalIVA).toFixed(2));

    // const usdBruto = Number((totalBruto / tasa_v).toFixed(2));
    // const usdIva = Number((totalIVA / tasa_v).toFixed(2));

    // const totalNetoUsd = Number((usdBruto + usdIva).toFixed(2));
    // totalBruto = usdBruto *tasa_v

    return { totalBruto, totalIVA, totalNeto, usdBruto, usdIva, totalNetoUsd };
};