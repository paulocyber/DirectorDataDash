// Dados
import { filterDescription } from "@/atom/filterDescription";
import { vibrantPalette } from "@/data/graphicColorPalette";

// React
import { useRecoilState } from "recoil";

// Tipagem
interface DescriptionGraphicProps {
    data: { description: string; value: number }[];
}

interface FilterSelection {
    description: string;
    color: string;
    id: number;
}

export default function DescriptionGraphic({ data }: DescriptionGraphicProps) {
    const [filterCostCenter, setFilterCostCenter] = useRecoilState(filterDescription);

    const handleSelectingCostCenter = (description: string, index: number, color: string) => {
        const selecting: FilterSelection = { id: index, description: description, color: color };

        const itemsExists = filterCostCenter.some(item => item.id === index);

        if (itemsExists) {
            setFilterCostCenter(filterCostCenter.filter(item => item.id !== index));
        } else {
            setFilterCostCenter([...filterCostCenter, selecting]);
        }
    };

    return (
        <div className="p-5">
            <div className="py-4 px-6">
                <div className="flex w-full overflow-x-auto items-center">
                    {data.map((topCostCenters, index) => (
                        <div
                            key={index}
                            className="flex"
                            onClick={() => handleSelectingCostCenter(topCostCenters.description, index, vibrantPalette[index % vibrantPalette.length])}
                        >
                            <div className="flex items-center">
                                <p
                                    className="inline-block h-4 w-4 rounded-full border-2 border-white object-cover object-center"
                                    style={{ backgroundColor: vibrantPalette[index % vibrantPalette.length] }}
                                ></p>
                            </div>
                            <p className="text-[10.4px] px-2 font-bold cursor-pointer">{topCostCenters.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
