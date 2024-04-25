import React, { useState } from 'react'

// Tipagem
import { OrderDetailsTableProps } from '../../models/types';

// Utils
import { formatCurrency } from '../../utils/mask/applyMask';
import InfiniteScroll from '../../utils/InfiniteScroll';

// Componentes
import Loading from '../Loading';

const OrderDetailsTable = ({ columns, data, loading }: OrderDetailsTableProps) => {
  const [limit, setLimit] = useState(0);

  const fetchMore = () => {
    if (limit < data.length) {
      setLimit(limit + 10);
    }
  };

  if (loading) {
    return (
      <div className='h-[400px] flex items-center justify-center'>
        <Loading />
      </div>
    )
  }


  return (
    <div className="col-span-12 md:pb-0 mb-[4em] px-[2em]">
      <div className="flex w-full pb-6 h-[450px] flex-col">
        <div id="scrollArea" className="overflow-auto rounded-[24px]">
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
              {data.slice(0, limit).map((davItens, index) => (
                <tr key={index} className="cursor-pointer hover:bg-gray-200 text-gray-800 text-sm">
                  <td className="px-4 py-4  whitespace-nowrap">
                    <h2 className="font-medium ">{davItens.CODIGO_PRD}</h2>
                  </td>

                  <td className="px-4 py-4  whitespace-nowrap">
                    {davItens.DESCRICAO_ALM}
                  </td>

                  <td className="px-4 py-4  whitespace-nowrap">
                    {davItens.DESCRICAO_PRD}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    {davItens.ITEM_PROMOCAO_SDI ? "Sim" : "Não"}
                  </td>

                  <td className="px-4 py-4  whitespace-nowrap">
                    {davItens.PERC_DESCONTO_SDI}
                  </td>

                  <td className="px-4 py-4  whitespace-nowrap">
                    {davItens.QTDE_DISPONIVEL_SDI}
                  </td>

                  <td className="px-4 py-4  whitespace-nowrap">
                    {davItens.QTDE_SDI}
                  </td>

                  <td className="px-4 py-4  whitespace-nowrap">
                    {davItens.REFERENCIA_PRD}
                  </td>

                  <td className="px-4 py-4  whitespace-nowrap">
                    {davItens.STATUS_SDI}
                  </td>

                  <td className="px-4 py-4  whitespace-nowrap">
                    {davItens.VALOR_ACRESCIMO_SDI}
                  </td>

                  <td className="px-4 py-4  whitespace-nowrap">
                    {formatCurrency(Number(davItens.VALOR_BRUTO_SDI.replace(",", ".")))}
                  </td>

                  <td className="px-4 py-4  whitespace-nowrap">
                    {formatCurrency(Number(davItens.VALOR_DESCONTO_SDI.replace(",", ".")))}
                  </td>

                  <td className="px-4 py-4  whitespace-nowrap">
                    {formatCurrency(Number(davItens.VALOR_LIQUIDO_SDI.replace(",", ".")))}
                  </td>
                </tr>
              ))}
              {!loading && <InfiniteScroll loading={loading} fetchMore={fetchMore} />}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsTable