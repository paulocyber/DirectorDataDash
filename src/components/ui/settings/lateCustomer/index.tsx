// Componentes
import { Input } from "../../input"

// Bibliotecas
import { CiSearch } from "react-icons/ci"
import { Checkbox, Tooltip } from "@heroui/react"
import { useAtom } from "jotai"
import { peopleAtom } from "@/atom/people"

// Utils
import { useState } from "react"
import { searchFilter } from "@/utils/filters/searchFilter"

// Tipagem
interface SettingsLateCustomerProps {
    employees?: { ID_PSS: string, NOME_PSS: string, APELIDO_PSS: string }[]
}

export function SettingsLateCustomer({ employees }: SettingsLateCustomerProps) {
    const [search, setSearch] = useState<string>('')
    const [peopleSelect, setPeopleSelect] = useAtom(peopleAtom)

    const filterSearch = searchFilter({ data: employees || [], search })

    const handleCheckboxChange = (people: string) => {
        setPeopleSelect((prevSelected) => {
            if (prevSelected.includes(people)) {
                return prevSelected.filter((description) => description !== people);
            } else {
                return [...prevSelected, people];
            }
        });
    };

    return (
        <main className="w-full">
            <section className="mb-4">
                <h3 className="text-gray-700 font-medium text-base">Vendedores</h3>
            </section>
            <div className="w-full flex-grow">
                <div className="flex flex-col mb-4">
                    <div className="flex items-center">
                        <Input
                            size="sm"
                            placeholder="Digite alguma coisa"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            startContent={<CiSearch className="w-4 h-4 text-gray-500" />}
                            className="flex-grow focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>
                {filterSearch.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 h-full max-h-[240px] py-2 overflow-auto">
                            {filterSearch?.map((people) => (
                                <div key={people.ID_PSS} className="flex items-center transition-all duration-300 ease-in-out">
                                    <Tooltip content={`${people.ID_PSS} - ${people.APELIDO_PSS}`}>
                                        <Checkbox
                                            classNames={{ label: "truncate w-[10em] truncate text-gray-700 text-sm font-medium" }}
                                            className="rounded-lg"
                                            isSelected={peopleSelect.includes(people.ID_PSS)}
                                            onChange={() => handleCheckboxChange(people.ID_PSS)}
                                        >
                                            {people.APELIDO_PSS && /^\*\*$/.test(people.APELIDO_PSS) ? people.APELIDO_PSS : people.NOME_PSS}
                                        </Checkbox>
                                    </Tooltip>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-gray-500 text-sm text-center pb-3">
                        Nenhum fornecedor encontrado.
                    </p>
                )}
            </div>
        </main >
    );
}