export const calculateTotalByKey = <T>(
  data: T[],
  getValue: (item: T) => string | undefined
): number => {
  return data.reduce((total: number, item: T) => {
    const value = getValue(item);

    // Verifica se o valor é válido antes de chamar .replace()
    if (!value) return total;

    const numericValue = parseFloat(value.replace(",", "."));
    return total + (isNaN(numericValue) ? 0 : numericValue);
  }, 0);
};
