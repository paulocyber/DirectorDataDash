// Tipagem
import { tableProp } from '../../models/types'

// Biblioteca
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';

// Utils
import { formatCurrency, formatDate } from '../../utils/mask/applyMask';
import InfiniteScroll from '../../utils/InfiniteScroll';

const TableDavs = ({ columns, data, loading }: tableProp) => {
    const [limit, setLimit] = useState(0);

    const history = useNavigate();

    const handleClick = (ID_ORIGEM: string) => {
        history(`/detaildav/${ID_ORIGEM}`);
    };

    const fetchMore = () => {
        if (limit < data.length) {
            setLimit(limit + 10);
        }
    };

    return (
        <div className="flex w-full pb-6 h-[450px] flex-col px-5">
            <div id="scrollArea" className="overflow-auto rounded-[24px]">
                {!loading && (
                    <table className="min-w-full divide-y ">
                        <thead className="bg-[#fa6602] sticky top-0 z-10">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                                    >
                                        {column.headerName}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300 dark:divide-gray-300 text-gray-500 dark:text-gray-800">
                            {data.slice(0, limit).map((dav, index) => (
                                <tr
                                    className={`cursor-pointer hover:bg-gray-200 text-sm hover:scale-[1.01] ${parseInt(dav.ATRASO_RCB) < 0
                                        ? "text-red-500"
                                        : "text-gray-800"
                                        }`}
                                    onClick={() => handleClick(dav.ID_ORIGEM)}
                                    key={index}
                                >
                                    <td className="px-4 py-4  whitespace-nowrap">
                                        <h2 className="font-medium ">{dav.ID_ORIGEM}</h2>
                                    </td>

                                    <td className="px-4 py-4  whitespace-nowrap">
                                        {dav.NOME_PSS}
                                    </td>

                                    <td className="px-4 py-4  whitespace-nowrap">
                                        {dav.VENDEDOR}
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {formatCurrency(Number(dav.VALOR_RCB.replace(",", ".")))}
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {formatCurrency(
                                            Number(dav.RESTANTE_SEM_JUROS_RCB.replace(",", "."))
                                        )}
                                    </td>

                                    <td className=" whitespace-nowrap">
                                        {formatCurrency(Number(dav.MULTA_RCB.replace(",", ".")))}
                                    </td>

                                    <td className=" whitespace-nowrap">
                                        {formatDate(dav.DATA_VENCIMENTO_RCB)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!loading && <InfiniteScroll loading={loading} fetchMore={fetchMore} />}
            </div>
        </div>
    )
}

export default TableDavs