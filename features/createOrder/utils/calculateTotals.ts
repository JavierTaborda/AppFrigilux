export type TotalsResult = {
    totalGross: number;     
    discountAmount: number; 
    subtotal: number;        
    iva: number;             
    total: number;           
    finalUnitPrice: number;  
};

// export const calculateTotals = (
//     price: number,
//     quantity: number,
//     discountStr: string,
//     ivaRate: number,
// ): TotalsResult => {
//     const totalGross = price * quantity;

//     const discounts = discountStr
//         .split("+")
//         .map((d) => Number(d.trim()))
//         .filter((n) => !isNaN(n) && n > 0);

//     let subtotal = totalGross;
//     let finalUnitPrice = price;

//     discounts.forEach((percent) => {
//         subtotal -= (subtotal * percent) / 100;
//         finalUnitPrice -= (finalUnitPrice * percent) / 100;
//     });

//     const discountAmount = Number((totalGross - subtotal).toFixed(2));
//     subtotal = Number(subtotal.toFixed(2));
//     finalUnitPrice = Number(discountAmount >0 ?finalUnitPrice.toFixed(2): price);

//     const iva = Number((subtotal * ivaRate).toFixed(2));
//     const total = Number((subtotal + iva).toFixed(2));

//     return { totalGross, discountAmount, subtotal, iva, total, finalUnitPrice };
// };

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