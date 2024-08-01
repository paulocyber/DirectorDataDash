// Dados
import { vibrantPalette } from "@/data/graphicColorPalette";

// Tipagem
import { SelectionDescription } from "@/utils/types/selectionDescription";
interface DescriptionGraphicProps {
    data: { description: string; }[];
    setFilterSelection: (selection: SelectionDescription[]) => void;
    filterSelection: SelectionDescription[];
}

export default function DescriptionGraphic({ data, setFilterSelection, filterSelection }: DescriptionGraphicProps) {
    const handleSelecting = (description: string, index: number, color: string) => {
        const selecting: SelectionDescription = { id: index, description: description, color: color }

        const itemsExists = filterSelection.some(item => item.id === index)

        if (itemsExists) {
            setFilterSelection(filterSelection.filter(item => item.id !== index));
        } else {
            setFilterSelection([...filterSelection, selecting]);
        }
    }

    return (
        <div className="p-5">
            <div className="py-4 px-6">
                <div className="flex w-full overflow-x-auto items-center">
                    {data.map((info, index) => (
                        <div
                            key={index}
                            className="flex"
                            onClick={() => handleSelecting(info.description, index, vibrantPalette[index % vibrantPalette.length])}
                        >
                            <div className="flex items-center">
                                <p
                                    className="inline-block h-4 w-4 rounded-full border-2 border-white object-cover object-center"
                                    style={{ backgroundColor: vibrantPalette[index % vibrantPalette.length] }}
                                ></p>
                            </div>
                            <p className="text-[10.4px] px-2 font-bold cursor-pointer">{info.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}