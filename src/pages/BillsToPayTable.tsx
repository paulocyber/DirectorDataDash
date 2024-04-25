// Dados
import { BillysToPayCard } from '../data/BillysToPayCard'

// Componentes
import InfoCards from '../components/InfoCards'
import MainComponent from '../components/MainComponent'
import DailyBudgetTable from '../components/tables/DailyBudgetTable';

import { useState } from 'react';

// Biblioteca
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faSync } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

// Tipagem
import { columnProp } from '../models/types';

// Dados
import { UseApiData } from '../data/useApiData';

const BillsToPayTable = () => {
    const [animation, setAnimation] = useState(false);

    const { infoBillyToPay } = BillysToPayCard()

    const columns: columnProp[] = [
        { id: 1, headerName: "#" },
        { id: 2, headerName: "Data" },
        { id: 3, headerName: "Valor" },
        { id: 4, headerName: "Descrição" },
        { id: 5, headerName: "Natureza Do Custo" },
        { id: 6, headerName: "Categoria Da Despesa" },
        { id: 7, headerName: "Centro De Custo" },
        { id: 8, headerName: "Fornecedor " },
        { id: 9, headerName: "Frequencia  " }
    ]

    let query = "select pgm.data_vencimento_pgm, pgm.valor_pgm, pgm.descricao_pgm, pgm.id_grc||' - '||pgm.descricao_grc as grupo_centro, pgm.id_cnt||' - '||pgm.descricao_cnt as centro_custo, pgm.nome_pss, pgm.status_pgm from v_pagamentos pgm  where  pgm.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and pgm.data_vencimento_pgm = '2024-03-01' order by pgm.data_vencimento_pgm, pgm.id_pss"

    const { data, loading } = UseApiData({ query });

    return (
        <div className='h-screen'>
            <InfoCards infoData={infoBillyToPay} />
            <MainComponent>
                <div className="md:flex items-center justify-between w-full ">
                    <div className="pb-5 flex justify-between items-center w-full p-5">
                        <h1 className="font-bold md:text-lg text-sm">Orçamento Diário</h1>
                        <div className="flex w-[20%]">
                            <button
                                onMouseEnter={() => setAnimation(true)}
                                onMouseLeave={() => setAnimation(false)}
                                className="hover:scale-[1.03] justify-center items-center w-full md:px-3 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                            >
                                <span className="mr-2 md:text-sm text-xs">Atualizar</span>
                                <FontAwesomeIcon
                                    icon={faSync}
                                    className={animation ? "animate-spin" : ""}
                                />
                            </button>
                            <Link
                                to="/billstopay"
                                className="hover:scale-[1.03] mx-2 justify-center items-center flex w-full md:px-3 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
                            >
                                <FontAwesomeIcon
                                    icon={faChevronLeft}
                                />
                                <span className="ml-2 md:text-sm text-xs">Retornar</span>

                            </Link>
                        </div>
                    </div>
                </div>
                <DailyBudgetTable columns={columns} data={data} loading={loading} />
            </MainComponent>
        </div>
    )
}

export default BillsToPayTable