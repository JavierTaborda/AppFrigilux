const totalVenezuela = (value: string | number): string => {
    const numero = typeof value === "string" ? parseFloat(value) : value;
    return numero.toLocaleString("es-VE");
};


export { totalVenezuela };

