"use client";

// Tipagem
interface SearchParamsProps<T extends Record<string, any>> {
  data: T[];
  search: string;
}

export function searchFilter<T extends Record<string, any>>({
  data,
  search,
}: SearchParamsProps<T>): T[] {
  const query = search.toLowerCase();

  return data.filter((item) => {
    // Verifica todos os valores do objeto
    return Object.values(item).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(query);
      }
      // Adicione lógica se o valor for um objeto
      if (typeof value === "object" && value !== null) {
        return Object.values(value).some(
          (subValue) =>
            typeof subValue === "string" &&
            subValue.toLowerCase().includes(query)
        );
      }
      return false;
    });
  });
}
