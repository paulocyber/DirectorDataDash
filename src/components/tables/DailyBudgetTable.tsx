// Tipagem
import { DailyBudgetTableProps } from '../../models/types'

import { useState } from 'react';

// Utils
import InfiniteScroll from '../../utils/InfiniteScroll';
import { formatDate } from '../../utils/mask/applyMask';
import { formatCurrency } from './../../utils/mask/applyMask';

const DailyBudgetTable = ({ columns, data, loading }: DailyBudgetTableProps) => {
    const [limit, setLimit] = useState(0);

    const fetchMore = () => {
        if (limit < data.length) {
            setLimit(limit + 10);
        }
    };

    return (
        <div className="flex w-full pb-6 h-[450px] flex-col px-5">
            <div id="scrollArea" className="overflow-auto rounded-[24px]">
                {!loading && (
                    <table className="min-w-full divide-y">
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
                            {data.slice(0, limit).map((billToPay, index) => (
                                <tr key={index} className="cursor-pointer hover:bg-gray-200 text-gray-800 text-sm">

                                    <td className="px-4 py-4  whitespace-nowrap">
                                        <p className={`p-[0.6em] rounded-full ${billToPay.STATUS_PGM != 2 ? "bg-red-500" : "bg-green-500"}`}></p>
                                    </td>

                                    <td className="px-4 py-4  whitespace-nowrap">
                                        <h2 className="font-medium ">{formatDate(billToPay.DATA_VENCIMENTO_PGM)}</h2>
                                    </td>

                                    <td className="px-4 py-4  whitespace-nowrap">{formatCurrency(Number(billToPay.VALOR_PGM.replace(",", ".")))}</td>

                                    <td className="px-4 py-4  whitespace-nowrap">{billToPay.DESCRICAO_PGM}</td>

                                    <td className="px-4 py-4  whitespace-nowrap">
                                        <div className="flex items-center justify-center">
                                            <div className=" relative inline-block text-left dropdown">
                                                <span className="rounded-full shadow-sm"
                                                >
                                                    <button className="inline-flex justify-center w-full px-3 py-1 text-sm font-medium leading-5 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-full hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                                                        type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
                                                        <span>Fixa</span>
                                                        <svg className="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                        </svg>
                                                    </button>
                                                </span>
                                            </div>
                                            <div className="opacity-0 invisible transition-all duration-300 transform origin-top-right -translate-y-2 scale-95 z-50">
                                                <div className="absolute right-0 w-40 mt-7 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
                                                    <div className="py-1">
                                                        <button className=" flex justify-between w-full px-2 py-2 text-sm leading-5 text-left" role="menuitem" >Variavel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4  whitespace-nowrap">
                                        {billToPay.GRUPO_CENTRO}
                                    </td>

                                    <td className="px-4 py-4  whitespace-nowrap">
                                        {billToPay.CENTRO_CUSTO}
                                    </td>

                                    <td className="px-4 py-4  whitespace-nowrap">
                                        {billToPay.NOME_PSS}
                                    </td>

                                    <td className="px-4 py-4  whitespace-nowrap">
                                        <div className="flex items-center justify-center">
                                            <div className=" relative inline-block text-left dropdown">
                                                <span className="rounded-full shadow-sm"
                                                >
                                                    <button className="inline-flex justify-center w-full px-3 py-1 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-full hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800"
                                                        type="button" aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
                                                        <span>Mensal</span>
                                                        <svg className="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                                    </button>
                                                </span>
                                            </div>
                                            <div className="opacity-0 invisible transition-all duration-300 transform origin-top-right -translate-y-2 scale-95 z-50">
                                                <div className="absolute right-0 w-40 mt-7 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
                                                    <div className="py-1">
                                                        <button className="text-gray-700 flex justify-between w-full px-2 py-2 text-sm leading-5 text-left" role="menuitem" >Variavel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            <>{!loading && <InfiniteScroll loading={loading} fetchMore={fetchMore} />}</>
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}

export default DailyBudgetTable