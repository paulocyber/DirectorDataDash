// Paleta
import { vibrantPalette } from "@/data/dashBoardColorPalette";

// Tipagem
export interface descriptionGraphic {
    data: { description: string; value: number }[];
}

export function DescriptionsGraphic({ data }: descriptionGraphic) {
    return (
        <div className="p-5">
            <div className="py-4 px-6">

                <div className="flex w-full items-center">
                    {data.map((topCostCenters, index) => (
                        <div key={index} className="flex">
                            <p className={`p-[0.4em] rounded-full`} style={{ backgroundColor: vibrantPalette[index % vibrantPalette.length] }}></p>
                            <p className="text-[10.2px] px-2 font-bold cursor-pointer">{topCostCenters.description}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}