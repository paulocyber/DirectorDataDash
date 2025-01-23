"use client";

// Tipagem
interface SearchParamsProps<T extends Record<string, any>> {
  data: T[];
  search: string;
}

export function searchFilter<T extends Record<string, any>>({
  data,
  search,
  filterBy,
}: SearchParamsProps<T> & { filterBy?: keyof T }): T[] {
  if (!search) return data; // Retorna todos os itens se a pesquisa estiver vazia

  const query = search.toLowerCase();

  return data.filter((item) => {
    if (filterBy) {
      // Filtra por uma chave específica se fornecida
      const value = item[filterBy];
      if (typeof value === "string") {
        return value.toLowerCase().includes(query);
      }
    } else {
      // Caso contrário, verifica todos os campos
      return Object.values(item).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(query);
        }
        if (typeof value === "object" && value !== null) {
          return Object.values(value).some(
            (subValue) =>
              typeof subValue === "string" &&
              subValue.toLowerCase().includes(query)
          );
        }
        return false;
      });
    }
    return false;
  });
}

