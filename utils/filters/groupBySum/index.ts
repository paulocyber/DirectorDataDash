// Tipagem do options, agora com labelKey
type GroupByOptions<T, K extends string> = {
  key: keyof T;
  valueKey: keyof T & (string | number | null);
  labelKey: K; // nome da propriedade no objeto de saída
};

// Tipo de retorno: { [P in K]: string; value: number }
type GroupedSumResult<K extends string> = {
  [P in K]: string;
} & { value: number };

export function groupBySum<T, K extends string>(
  data: T[],
  options: GroupByOptions<T, K>
): GroupedSumResult<K>[] {
  const { key, valueKey, labelKey } = options;

  // Acumulador indexado por string
  const acc = data.reduce((map: Record<string, GroupedSumResult<K>>, item) => {
    const groupKey = String(item[key]);
    if (!map[groupKey]) {
      // Inicializa o objeto com a chave dinâmica
      map[groupKey] = {
        [labelKey]: groupKey,
        value: 0,
      } as GroupedSumResult<K>;
    }

    const val = item[valueKey];
    if (val != null) {
      map[groupKey].value += parseFloat(String(val));
    }
    return map;
  }, {});

  return Object.values(acc);
}
