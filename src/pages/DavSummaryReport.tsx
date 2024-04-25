// Components
import InfoCards from '../components/InfoCards'
import MainComponent from '../components/MainComponent'
import Loading from '../components/Loading'
import TableDavs from '../components/tables/TableDavs'

// Dados
import { davDetailsCard } from '../data/davDetailsCard'
import { UseApiData } from '../data/useApiData'

// Bibliotecas
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'

import { useState } from 'react'

// Tipagem
import { columnProp } from '../models/types'

const DavSummaryReport = () => {
    const [animation, setAnimation] = useState(false);

    const { infoDetaildCard } = davDetailsCard()

    let query = `select a.id_pss, a.id_frm, a.id_emp, a.id_rcb, a.sigla_emp, a.numero_documento_rcb as n_dav, a.id_origem, a.datahora_lancamento_rcb, a.datahora_pagamento_rcb, a.data_vencimento_rcb, a.atraso_rcb, a.valor_rcb, a.juros_rcb, a.multa_rcb, iif(a.restante_rcb < 0.00,0.00,a.restante_rcb)as restante_rcb, a.restante_sem_juros_rcb, a.valor_pago_rcb, a.nome_pss as nome_pss, a.apelido_pss, a.id_fnc, a.nome_fnc as vendedor, a.status_rcb, a.descricao_frm as forma_pagamento,  a.valor_acrescimos_rci, a.valor_desconto_rci, a.descricao_rcb from v_recebimentos a where a.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and a.status_rcb in('1','4') and a.status_pss = 'A' and coalesce(a.insolvente_rcb,'N') = 'N' and (EXTRACT(YEAR FROM a.data_vencimento_rcb) = EXTRACT(YEAR FROM CURRENT_DATE) and EXTRACT(MONTH FROM a.data_vencimento_rcb) = EXTRACT(MONTH FROM CURRENT_DATE) and EXTRACT(DAY FROM a.data_vencimento_rcb) = EXTRACT(DAY FROM CURRENT_DATE) or EXTRACT(YEAR FROM a.datahora_lancamento_rcb) = EXTRACT(YEAR FROM CURRENT_DATE) and EXTRACT(MONTH FROM a.datahora_lancamento_rcb) = EXTRACT(MONTH FROM CURRENT_DATE) and EXTRACT(DAY FROM a.datahora_lancamento_rcb) = EXTRACT(DAY FROM CURRENT_DATE)) order by a.id_emp, a.data_vencimento_rcb, nome_pss`;

    const { data, loading, handleRefresh } = UseApiData({ query });

    const columns: columnProp[] = [
        { id: 1, headerName: "Número DAV" },
        { id: 2, headerName: "Cliente" },
        { id: 2, headerName: "Vendedor" },
        { id: 3, headerName: "Valor Bruto" },
        { id: 4, headerName: "Valor Sem Juros" },
        { id: 5, headerName: "Multa" },
        { id: 6, headerName: "Data Vencimento" },
    ];

    return (
        <div className="h-screen ">
            <InfoCards infoData={infoDetaildCard} />
            <MainComponent>
                <div className="md:flex items-center justify-between w-full ">
                    <div className="pb-5 flex justify-between items-center w-full p-5">
                        <h1 className="font-bold md:text-lg text-sm">Relatório Diário</h1>
                        <div className="flex">
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
                        </div>
                    </div>
                </div>
                <div className="md:flex w-full">
                    {loading ? (
                        <div className="flex justify-center items-center w-full pb-6 h-[450px] flex-col">
                            <Loading />
                        </div>
                    ) : (
                        <TableDavs columns={columns} data={data} loading={loading} />
                    )}
                </div>
            </MainComponent>
        </div>
    )
}

export default DavSummaryReport