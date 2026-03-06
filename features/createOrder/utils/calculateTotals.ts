
export type ProfitRenglonResult = {
    unitUsd: number;
    unitBs: number;
    reng_neto: number;
    reng_iva: number;
    reng_total: number;
    reng_neto_usd:number;
};


export const calculateTotals = (
    priceUsd: number,
    quantity: number,
    discountStr: string,
    tasa: number,
    ivaRate: number,
): ProfitRenglonResult => {

    const discounts = discountStr
        .split("+")
        .map(d => Number(d.trim()))
        .filter(n => !isNaN(n) && n > 0);

    let unitUsd = priceUsd;
    
    discounts.forEach(percent => {
        unitUsd = unitUsd - (unitUsd * percent / 100);
    }); 

    
    const prec_vta_bs = Number((unitUsd * tasa));

    const reng_neto_usd = Number((unitUsd * quantity));
    const reng_neto = Number((prec_vta_bs * quantity));

    const reng_iva = Number((reng_neto * ivaRate));
    const reng_total = Number((reng_neto + reng_iva))

    return { unitUsd, unitBs: prec_vta_bs, reng_neto, reng_iva, reng_total, reng_neto_usd };
};