import { formatCurrency } from "@/utils/mask/moneyMask"

// Tipagem
interface itemsPaidAndUnpaidBills {
    VALOR_PGM: string,
    CENTRO_CUSTO: string,
    NOME_PSS: string,
    STATUS_PGM: string,
    DATA_VENCIMENTO_PGM: string,
    DESCRICAO_PGM: string,
    GRUPO_CENTRO: string,
    NUMERO_DOCUMENTO_PGM: string,
    DESCRICAO_FRM: string
}

type listPaidAndUnpaidBills = {
    itemsPaidAndUnpaidBills: itemsPaidAndUnpaidBills[]
}

export function TableBillsToPay({ itemsPaidAndUnpaidBills }: listPaidAndUnpaidBills) {

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
                                #
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Data
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Valor
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Descrição
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Natureza Do Custo
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Categoria Da Despesa
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Centro De Custo
                            </th>
                            <th
                                scope="col"
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                            >
                                Forma de Pagamento
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300 dark:divide-gray-300 text-gray-500 dark:text-gray-800">
                        {itemsPaidAndUnpaidBills.slice(0, 20).map((itemBillsToPay, index) => (
                            <tr
                                className="cursor-pointer hover:bg-gray-200 text-sm hover:scale-[1.01] text-gray-800"
                                key={index}
                            >
                                <td className="px-4 py-4  whitespace-nowrap">
                                    <p className={`p-[0.6em] rounded-full ${itemBillsToPay.STATUS_PGM != "2" ? "bg-blue-500" : "bg-green-500"}`}></p>
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    <h2 className="font-medium ">{itemBillsToPay.DATA_VENCIMENTO_PGM.split(' ')[0]}</h2>
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {formatCurrency(Number(itemBillsToPay.VALOR_PGM.replace(",", ".")))}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {itemBillsToPay.NUMERO_DOCUMENTO_PGM}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {itemBillsToPay.GRUPO_CENTRO}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {itemBillsToPay.NOME_PSS}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {itemBillsToPay.CENTRO_CUSTO}
                                </td>

                                <td className="px-4 py-4  whitespace-nowrap">
                                    {itemBillsToPay.DESCRICAO_FRM}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}