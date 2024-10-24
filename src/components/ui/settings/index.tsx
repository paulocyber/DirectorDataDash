// Bibliotecas
import { Checkbox } from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { useRecoilState } from "recoil";

// Componentes
import { Input } from "../input";

// React
import { useState } from "react";

// Utils
import { searchFilter } from "@/utils/filters/searchFilter";

// Atoms
import { brandsAtom } from "@/atom/brandsAtom";

// Tipagem
import { BrandData } from "@/types/brands";

interface SettingsProps {
    brands: BrandData[];
}

export function Settings({ brands: brandsData }: SettingsProps) {
    const [searchsParams, setSearchParams] = useState<string>('')
    const [selectedBrands, setSelectedBrands] = useRecoilState(brandsAtom)

    const handleCheckboxChange = (brandId: string) => {
        setSelectedBrands((prevSelected) => {
            if (prevSelected.includes(brandId)) {
                return prevSelected.filter((id) => id !== brandId);
            } else {
                return [...prevSelected, brandId];
            }
        });
    };

    const filterSearch = searchFilter({ data: brandsData, search: searchsParams })

    return (
        <div className="w-full flex">
            <div className="w-44 flex-col border-r p-2">
                <nav className="flex flex-col">
                    <button className="inline-flex my-2 items-center rounded-md text-sm font-medium bg-blue-600 text-white h-10 px-4 transition-colors duration-200 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                        Marcas
                    </button>
                </nav>
            </div>

            <div className="w-full flex-grow p-4">
                <div className="flex flex-col mb-4">
                    <div className="flex items-center mb-2">
                        <Input
                            size="sm"
                            placeholder="Digite alguma coisa"
                            value={searchsParams}
                            onChange={(e) => setSearchParams(e.target.value)}
                            startContent={<CiSearch className="w-4 h-4 text-gray-500" />}
                            className="flex-grow"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[240px] overflow-auto">
                    {filterSearch.map((item) => (
                        <div key={item.ID_MRC} className="flex items-center">
                            <Checkbox
                                classNames={{ label: "truncate w-28" }}
                                className="rounded-lg"
                                isSelected={selectedBrands.includes(item.ID_MRC)}
                                onChange={() => handleCheckboxChange(item.ID_MRC)}
                            >
                                {item.DESCRICAO_MRC}
                            </Checkbox>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}