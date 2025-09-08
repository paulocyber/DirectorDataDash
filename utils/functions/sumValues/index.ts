export const sumValuesByKey = <T>(
  data: T[],
  getValue: (item: T) => string | undefined
): number => {
  const total = data.reduce((acc: number, item: T) => {
    const value = getValue(item);
    if (!value) return acc;

    const numericValue = parseFloat(value.replace(",", "."));
    return acc + (isNaN(numericValue) ? 0 : numericValue);
  }, 0);

  // Arredonda para 2 casas decimais e retorna como número
  return parseFloat(total.toFixed(2));
};
