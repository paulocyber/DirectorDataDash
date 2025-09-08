"use client";

// Tipagem
interface SearchParamsProps<T extends Record<string, any>> {
  data: T[];
  search: string;
  startsWithOnly?: boolean;
}

export function searchFilter<T extends Record<string, any>>({
  data,
  search,
  filterBy,
  startsWithOnly,
}: SearchParamsProps<T> & { filterBy?: keyof T }): T[] {
  if (!search) return data;

  const query = search.toLowerCase().trim();

  return data.filter((item) => {
    const checkValue = (value: any): boolean => {
      if (typeof value !== "string") return false;
      const val = value.toLowerCase();
      return startsWithOnly ? val.startsWith(query) : val.includes(query);
    };

    if (filterBy) {
      return checkValue(item[filterBy]);
    } else {
      return Object.values(item).some((value) => {
        if (typeof value === "string") {
          return checkValue(value);
        }
        if (typeof value === "object" && value !== null) {
          return Object.values(value).some(
            (sub) => typeof sub === "string" && checkValue(sub)
          );
        }
        return false;
      });
    }
  });
}
