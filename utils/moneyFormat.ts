const totalVenezuela = (value: string | number): string => {
    const number = typeof value === "string" ? parseFloat(value) : value;
    number.toFixed(2); // Ensure two decimal places
    return number.toLocaleString("es-VE");
};


export { totalVenezuela };

