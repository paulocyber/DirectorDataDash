// import { listPorp } from "@/pages/detaildav/[ID_ORIGEM]";
import { InfiniteScroll } from "@/utils/ScrollInfinity/InfiniteScroll";
import { formatCurrency } from "@/utils/mask/moneyMask";
import { useRouter } from "next/router";
import { useState } from "react";

interface productsDav {
    CODIGO_PRD: string,
    DESCRICAO_PRD: string,
    REFERENCIA_PRD: string,
    QTDE_SDI: string,
    VALOR_BRUTO_SDI: string,
    VALOR_DESCONTO_SDI: string,
    VALOR_ACRESCIMO_SDI: string,
    VALOR_LIQUIDO_SDI: string,
    PERC_DESCONTO_SDI: string,
    STATUS_SDI: string,
    DESCRICAO_ALM: string,
    ITEM_PROMOCAO_SDI: string,
    QTDE_DISPONIVEL_SDI: string
}

type listPorp = {
    prodcutsDav: productsDav[]
}

export function TableProductDav({ prodcutsDav }: listPorp) {
    const [limit, setLimit] = useState(0);

    const router = useRouter();

    const handleClick = (ID_ORIGEM: string) => {
        router.push(`/detaildav/${ID_ORIGEM}`);
    };

    const fetchMore = () => {
        if (limit < prodcutsDav.length) {
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
                                Codigo do Produto
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Almoxarifado
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Produto
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Promoção
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Desconto
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Quantidade Disponivel
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Quantidade da Saida
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Referencia do Produto
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Status da Saida
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Valor do Acrescimo
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
                                Valor Desconto
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Valor Liquido
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300 dark:divide-gray-300 text-gray-500 dark:text-gray-800">
                        {prodcutsDav.slice(0, limit).map((listProduct, index) => (
                            <tr key={index} className="cursor-pointer hover:bg-gray-200 text-gray-800 text-sm">
                                <td className="px-4 py-4  whitespace-nowrap">
                                    <h2 className="font-medium ">{listProduct.CODIGO_PRD}</h2>
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {listProduct.DESCRICAO_ALM}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {listProduct.DESCRICAO_PRD}
                                </td>

                                <td className="px-4 py-4 whitespace-nowrap">
                                    {listProduct.ITEM_PROMOCAO_SDI ? "Sim" : "Não"}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {listProduct.PERC_DESCONTO_SDI}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {listProduct.QTDE_DISPONIVEL_SDI}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {listProduct.QTDE_SDI}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {listProduct.REFERENCIA_PRD}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {listProduct.STATUS_SDI}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {listProduct.VALOR_ACRESCIMO_SDI}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {formatCurrency(Number(listProduct.VALOR_BRUTO_SDI.replace(",", ".")))}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {formatCurrency(Number(listProduct.VALOR_DESCONTO_SDI.replace(",", ".")))}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {formatCurrency(Number(listProduct.VALOR_LIQUIDO_SDI.replace(",", ".")))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <InfiniteScroll fetchMore={fetchMore} />
            </div>
        </div>
    )
}