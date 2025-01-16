export const calculateTotalByKey = <T>(
  data: T[],
  getValue: (item: T) => string
): number => {
  return data.reduce((total: number, item: T) => {
    const numericValue = parseFloat(getValue(item).replace(",", "."));
    return total + (isNaN(numericValue) ? 0 : numericValue);
  }, 0);
};
