
export type TotalsResult = {
    totalGross: number;
    discountAmount: number;
    subtotal: number;
    iva: number;
    total: number;
};

export const calculateTotals = (
    price: number,
    quantity: number,
    discountStr: string,
    ivaRate: number = 0.16
): TotalsResult => {
    const totalGross = price * quantity;

    const discounts = discountStr
        .split("+")
        .map((d) => Number(d.trim()))
        .filter((n) => !isNaN(n) && n > 0);

    let current = totalGross;
    discounts.forEach((percent) => {
        current -= (current * percent) / 100;
    });

    const discountAmount = Number((totalGross - current).toFixed(2));
    const subtotal = Number((totalGross - discountAmount).toFixed(2));
    const iva = Number((subtotal * ivaRate).toFixed(2));
    const total = Number((subtotal + iva).toFixed(2));

    return { totalGross, discountAmount, subtotal, iva, total };
};