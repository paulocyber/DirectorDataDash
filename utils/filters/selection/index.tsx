// Bibliotecas
import vibrantPalette from '@/data/pallets/vibrant.json';

// Tipagem
type DescriptionItems = {
    id: number;
    description: string;
    value?: number;
    color: string;
}

interface FilterSelectingProps<T> {
    data: T[];
    primaryKey: keyof T;
    secondaryKey: keyof T;
    limit?: number;
    filter?: { description: string; color: string }[];
    extraKey?: keyof T;
    showExtraKey?: boolean;
}

export function HandleSelectionFilters({
    selections,
    setSelections
}: {
    selections: DescriptionItems[],
    setSelections: (value: DescriptionItems[]) => void
}) {

    const handleSelecting = (
        description: string,
        index: number,
        color: string,
        value?: number
    ) => {
        const selecting: DescriptionItems = {
            id: index,
            description: Array.isArray(description) ? description[0] : description,
            color,
            ...(value !== undefined ? { value } : {})
        };

        const itemsExist = selections.some((item) => item.id === index);
        
        itemsExist
            ? setSelections(selections.filter((item) => item.id !== index))
            : setSelections([...selections, selecting]);
    }

    return handleSelecting
}

export function FilterSelecting<T>({
    data,
    primaryKey,
    secondaryKey,
    limit,
    filter = [],
    extraKey,
    showExtraKey = false,
    sortDescending = false,
}: FilterSelectingProps<T> & { sortDescending?: boolean }) {

    const grouped = data.reduce<Record<string, {
        count: number;
        secondaryValues: Set<string>;
        groupedValues?: Set<string>;
    }>>((acc, item) => {
        const primary = String(item[primaryKey]);
        const secondary = String(item[secondaryKey]);

        if (!acc[primary]) {
            acc[primary] = { count: 0, secondaryValues: new Set() };
            if (showExtraKey && extraKey) {
                acc[primary].groupedValues = new Set();
            }
        }

        acc[primary].count++;
        acc[primary].secondaryValues.add(secondary);

        if (showExtraKey && extraKey) {
            acc[primary].groupedValues!.add(String(item[extraKey]));
        }

        return acc;
    }, {});

    const groups = Object.entries(grouped).map(([description, { secondaryValues, groupedValues }]) => {
        const numericValues = Array.from(secondaryValues)
            .map(val => Number(val.replace(',', '.')))
            .filter(n => !isNaN(n));

        const value = numericValues.reduce((sum, n) => sum + n, 0);

        return {
            description,
            value,
            groupedDescription: groupedValues ? Array.from(groupedValues) : [],
        };
    });

    const sortedGroups = sortDescending
        ? [...groups].sort((a, b) => b.value - a.value)
        : groups;

    const limitedGroups = typeof limit === 'number'
        ? sortedGroups.slice(0, limit)
        : sortedGroups;

    const selectGroup = limitedGroups
        .map((item, index) => ({
            ...item,
            color: filter.find(f => f.description === item.description)?.color
                ?? vibrantPalette[index % vibrantPalette.length],
        }))
        .filter(item =>
            filter.length === 0 || filter.some(f => f.description === item.description)
        );

    return { selectGroup };
}
