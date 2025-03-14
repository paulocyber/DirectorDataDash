// Bibliotecas
import { Checkbox } from "@heroui/react"
import { useAtom } from "jotai"

// Atom
import { enterprisesAtom } from "@/atom/employees"

// React
import { useState } from "react"

// Tipagem
interface SettingsSalesProps {
    enterprises?: { ID_EMP: string, SIGLA_EMP: string }[]
}

export function SettingsSales({ enterprises }: SettingsSalesProps) {
    const [employees, setEmployees] = useAtom(enterprisesAtom)

    const filteredEnterprises = enterprises?.filter((company) => company.ID_EMP !== "100");

    const handleCheckboxChange = (idCompany: string) => {
        setEmployees((prevSelected) => {
            if (prevSelected.includes(idCompany)) {
                return prevSelected.filter((description) => description !== idCompany);
            } else {
                return [...prevSelected, idCompany];
            }
        });
    };

    return (
        <main className="w-full">
            <section className="">
                <h3 className="text-gray-700 font-medium text-base">Empresas</h3>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[240px] py-4 overflow-auto">
                {filteredEnterprises?.map((company) => (
                    <div
                        key={company.ID_EMP}
                        className="flex items-center duration-300"
                    >
                        <Checkbox
                            classNames={{
                                label: "truncate w-[6.4em] text-gray-800 text-sm font-medium",
                            }}
                            isSelected={employees.includes(company.ID_EMP)}
                            onChange={() => handleCheckboxChange(company.ID_EMP)}
                            className="rounded-lg"
                        >
                            {company.SIGLA_EMP}
                        </Checkbox>
                    </div>
                ))}
            </div>
        </main>
    )
}