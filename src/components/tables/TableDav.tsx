// React
import { useState } from "react";

// Framework
import { useRouter } from 'next/router';

// Utils
import { formatCurrency } from "@/utils/mask/moneyMask";
import { formatDate } from "@/utils/mask/dataMask";

// Tipagem
import { listPorp } from "@/pages/davsummaryreport";
import { InfiniteScroll } from "@/utils/ScrollInfinity/InfiniteScroll";

export function TableDav({ listDav }: listPorp) {
    const [limit, setLimit] = useState(0);

    const router = useRouter();

    const handleClick = (ID_ORIGEM: string) => {
        router.push(`/detaildav/${ID_ORIGEM}`);
    };

    const fetchMore = () => {
        if (limit < listDav.length) {
            setLimit(limit + 10);
        }
    };

    return (
        <div className="flex w-full pb-6 h-[450px] flex-col px-5">
            <div id="scrollArea" className="overflow-auto rounded-[24px]">
                <table className="min-w-full divide-y ">
                    <thead className="bg-[#fa6602] sticky top-0 z-10">
                        <tr>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Número DAV
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Cliente
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Vendedor
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Valor Bruto
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Valor Sem Juros
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Multa
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Data Vencimento
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300 dark:divide-gray-300 text-gray-500 dark:text-gray-800">
                        {listDav.slice(0, limit).map((itemDav, index) => (
                            <tr
                                className={`cursor-pointer hover:bg-gray-200 text-sm hover:scale-[1.01] ${parseInt(itemDav.ATRASO_RCB) < 0
                                    ? "text-red-500"
                                    : "text-gray-800"
                                    }`}
                                onClick={() => handleClick(itemDav.ID_ORIGEM)}
                                key={index}
                            >
                                <td className="px-4 py-4  whitespace-nowrap">
                                    <h2 className="font-medium ">{itemDav.ID_ORIGEM}</h2>
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {itemDav.NOME_PSS}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {itemDav.VENDEDOR}
                                </td>

                                <td className="px-4 py-4 whitespace-nowrap">
                                    {formatCurrency(Number(itemDav.VALOR_RCB.replace(",", ".")))}
                                </td>

                                <td className="px-4 py-4 whitespace-nowrap">
                                    {formatCurrency(
                                        Number(itemDav.RESTANTE_SEM_JUROS_RCB.replace(",", "."))
                                    )}
                                </td>

                                <td className=" whitespace-nowrap">
                                    {formatCurrency(Number(itemDav.MULTA_RCB.replace(",", ".")))}
                                </td>

                                <td className=" whitespace-nowrap">
                                    {formatDate(itemDav.DATA_VENCIMENTO_RCB)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Scroll Infinito */}
                <InfiniteScroll fetchMore={fetchMore} />
            </div>
        </div>
    )
}