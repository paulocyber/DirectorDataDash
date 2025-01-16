// Tipagem
type GroupByOptions<T> = {
  key: keyof T;
  valueKey: keyof T & (string | number | null);
};

export function groupSumBy<T>(
  data: T[],
  options: GroupByOptions<T>
): { brand: string; value: number }[] {
  const { key, valueKey } = options;

  const groupedData = data.reduce(
    (acc: Record<string, { brand: string; value: number }>, item) => {
      const groupKey = item[key] as unknown as string;

      if (!acc[groupKey]) {
        acc[groupKey] = {
          brand: item[key] as unknown as string,
          value: 0,
        };
      }

      const value = item[valueKey];
      // Verifica se o valor é null ou undefined
      if (value != null) {
        // Verifica tanto null quanto undefined
        acc[groupKey].value += parseFloat(value.toString());
      }

      return acc;
    },
    {}
  );

  return Object.values(groupedData);
}
