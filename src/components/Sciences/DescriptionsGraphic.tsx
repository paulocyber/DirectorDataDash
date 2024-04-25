// Tipagem
import { FilterItem, descriptionGraphic } from '../../models/types'

// Dados
import { vibrantPalette } from '../../data/PaletteData'

// Biblioteca
import { useRecoilState } from 'recoil'

// Atom
import { filterDescription } from '../../atom/filterAtom'

const DescriptionsGraphic = ({ data }: descriptionGraphic) => {
    const [costCenter, setCostCenter] = useRecoilState(filterDescription);

    const handleClick = (description: string, index: number) => {
        const newItem: FilterItem = { id: index, description: description };

        // Verificar se o item já está no costCenter por seu índice
        const itemExists = costCenter.some(item => item.id === index);

        if (itemExists) {
            // Remover o item do costCenter se já existir
            setCostCenter(costCenter.filter(item => item.id !== index));
        } else {
            // Adicionar o novo item ao costCenter
            setCostCenter([...costCenter, newItem]);
        }
    }

    return (
        <div className="p-5">
            <div className="py-4 px-6">

                <div className="flex items-center mb-2">
                    {data.map((topCostCenters, index) => (
                        <div key={index} onClick={() => handleClick(topCostCenters.description, index)} className="flex w-full items-center">
                            <p className={`p-[0.4em] rounded-full`} style={{ backgroundColor: vibrantPalette[index % vibrantPalette.length] }}></p>
                            <p className="text-[10.2px] px-2 font-bold cursor-pointer">{topCostCenters.description}</p>
                        </div>
                    ))
                    }
                </div>
            </div>
        </div>
    )
}

export default DescriptionsGraphic