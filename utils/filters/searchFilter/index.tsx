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
    if (!search) return data;

    const query = search.toLowerCase();

    return data.filter((item) => {
        if (filterBy) {
            const value = item[filterBy];
            if (typeof value === "string") {
                return value.toLowerCase().includes(query);
            }
        } else {
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
