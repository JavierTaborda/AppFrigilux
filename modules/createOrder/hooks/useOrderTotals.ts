import { OrderItem } from "../types/orderItem";


export const applyDiscounts = (price: number, discountStr: string) => {
    if (!discountStr?.trim()) return price;

    const discounts = discountStr
        .split("+")
        .map((d) => Number(d.trim()))
        .filter((n) => !isNaN(n) && n > 0);

    return discounts.reduce((acc, d) => acc * (1 - d / 100), price);
};

export const useOrderTotals = (items: OrderItem[]) => {
    const totalGross = items.reduce((acc, item) => {
        return acc + item.price * (item.quantity ?? 1);
    }, 0);

    const total = items.reduce((acc, item) => {
        const finalPrice = applyDiscounts(item.price, item.discount ?? "");
        return acc + finalPrice * (item.quantity ?? 1);
    }, 0);

    const IVA = total * 0.16;
    const totalWithIVA = total + IVA;

    return {
        totalGross,
        total,
        IVA,
        totalWithIVA,
        discountAmount: totalGross - total,
    };
};
