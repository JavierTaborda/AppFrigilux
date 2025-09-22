const currencyDollar = "$";

const totalVenezuela = (value: string | number): string => {
  // Convert to number
  const number = typeof value === "string" ? parseFloat(value) : value;

  // two decimals
  const fixedNumber = Number(number.toFixed(2));

  // Format with thousands and decimal commas
  return `${fixedNumber.toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export { currencyDollar, totalVenezuela };

