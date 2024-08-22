// Tipagem
import { SelectionDescription } from "@/utils/types/selectionDescription";
interface SelectingCostCenterProps {
    filters: SelectionDescription[];
    setFilters: React.Dispatch<React.SetStateAction<SelectionDescription[]>>;
}

export function SelectingCostCenter({ filters, setFilters }: SelectingCostCenterProps) {

    const handleSelectingCostCenter = (description: string, index: number, color: string) => {
        const selecting: SelectionDescription = { id: index, description: description, color: color };
        
        const itemsExists = filters.some(item => item.id === index);

        if (itemsExists) {
            setFilters(filters.filter(item => item.id !== index));
        } else {
            setFilters([...filters, selecting]);
        }
    };

    return { handleSelectingCostCenter };
}
