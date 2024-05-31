// Paleta
import { filterDescription } from "@/atom/FilterDescription";

// Biblioteca
import { useRecoilState } from "recoil";

// Dados
import { vibrantPalette } from "@/data/dashBoardColorPalette";

// Tipagem
interface descriptionGraphic {
    data: { description: string; value: number }[];
}

interface filterSelectionFilter {
    description: string;
    color: string;
    id: number;
}

export function DescriptionsGraphic({ data }: descriptionGraphic) {
    const [filterCostCenter, setFilterCostCenter] = useRecoilState(filterDescription)

    const handleSelectingCostCenter = (description: string, index: number, color: string) => {
        const Selecting: filterSelectionFilter = { id: index, description: description, color: color }

        const itemsExists = filterCostCenter.some(item => item.id === index)

        if (itemsExists) {
            setFilterCostCenter(filterCostCenter.filter(item => item.id !== index))
        } else {
            setFilterCostCenter([...filterCostCenter, Selecting]);
        }
    }

    return (
        <div className="p-5 z-10">
            <div className="py-4 px-6">

                <div className="flex w-full items-center">
                    {data.map((topCostCenters, index) => (
                        <div key={index} className="flex" onClick={() => handleSelectingCostCenter(topCostCenters.description, index, vibrantPalette[index % vibrantPalette.length])}>
                            <div className="flex items-center">
                                <p className="relative inline-block h-4 w-4 rounded-full border-2 border-white object-cover object-center " style={{ backgroundColor: vibrantPalette[index % vibrantPalette.length] }}></p>
                            </div>
                            <p className="text-[10.4px] px-2 font-bold cursor-pointer">{topCostCenters.description}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}