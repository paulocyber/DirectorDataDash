// Biblioteca
import { useParams } from 'react-router-dom';

// Dados
import { UseApiData } from '../../data/useApiData';

// Componentes
import Loading from '../Loading';

// Utils
import { formatCurrency, formatDate } from '../../utils/mask/applyMask';

const DetailDav = () => {
    const { id } = useParams();

    let query = `select a.id_pss, a.id_frm, a.id_emp, a.id_rcb, a.sigla_emp, a.numero_documento_rcb as n_dav, a.id_origem, a.datahora_lancamento_rcb, a.datahora_pagamento_rcb, a.data_vencimento_rcb, a.atraso_rcb, a.valor_rcb, a.juros_rcb, a.multa_rcb, iif(a.restante_rcb < 0.00,0.00,a.restante_rcb) as restante_rcb, a.restante_sem_juros_rcb, a.valor_pago_rcb, a.nome_pss as nome_pss, a.apelido_pss, a.id_fnc, a.nome_fnc as vendedor, a.status_rcb, a.descricao_frm as forma_pagamento,  a.valor_acrescimos_rci, a.valor_desconto_rci, a.descricao_rcb from v_recebimentos a where a.id_emp in(4,1,2,3,5,6,7,8,9,10,11) and a.status_rcb in('1','4') and a.status_pss = 'A' and coalesce(a.insolvente_rcb,'N') = 'N' and EXTRACT(YEAR FROM a.data_vencimento_rcb) = EXTRACT(YEAR FROM CURRENT_DATE) and a.ID_ORIGEM = '${id}' order by a.id_emp, a.data_vencimento_rcb, nome_pss`;

    const { data, loading } = UseApiData({ query });

    if (loading) {
        return (
            <div className='h-[400px] flex items-center justify-center'>
                <Loading />
            </div>
        )
    }

    return (
        <>
            {
                data.map((dav, index) => (
                    <div
                        key={index}
                        className="bg-white  rounded-xl w-[90%] mx-auto pb-5"
                    >
                        <div className="pt-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Número da DAV:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {dav.ID_ORIGEM}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Empresa:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {dav.SIGLA_EMP}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Apelido:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {dav.APELIDO_PSS}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Descrição do Recibo:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {dav.DESCRICAO_RCB}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        ID do Recibo:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {dav.ID_RCB}
                                    </p>
                                </div>
                            </div>

                            <div className="border-b w-full my-3"></div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Valor do Recibo:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {formatCurrency(Number(dav.VALOR_RCB.replace(",", ".")))}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Juros:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {formatCurrency(Number(dav.JUROS_RCB.replace(",", ".")))}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Multa:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {formatCurrency(Number(dav.MULTA_RCB.replace(",", ".")))}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Restante do Recibo:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {formatCurrency(
                                            Number(dav.RESTANTE_RCB.replace(",", "."))
                                        )}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Restante do Recibo Sem Juros:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {formatCurrency(
                                            Number(dav.RESTANTE_SEM_JUROS_RCB.replace(",", "."))
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="border-b w-full my-3"></div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Valor Pago do Recibo:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {formatCurrency(
                                            Number(dav.VALOR_PAGO_RCB.replace(",", "."))
                                        )}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Valor do Acrecimo:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {dav.VALOR_ACRESCIMOS_RCI}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Valor do Desconto:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {dav.VALOR_DESCONTO_RCI}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Vendedor:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {dav.VENDEDOR}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Status do Recibo:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {dav.STATUS_RCB}
                                    </p>
                                </div>
                            </div>

                            <div className="border-b w-full my-3"></div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 pb-5">
                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Data do Lançamento:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {formatDate(dav.DATAHORA_LANCAMENTO_RCB)}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Data do Pagamento:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {dav.DATAHORA_PAGAMENTO_RCB}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Data do Vencimento:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {formatDate(dav.DATA_VENCIMENTO_RCB)}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Vendedor:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {dav.VENDEDOR}
                                    </p>
                                </div>

                                <div className="">
                                    <h2 className="font-bold text-gray-600 text-base uppercase">
                                        Id Financeiro:
                                    </h2>
                                    <p className="text-gray-600 font-semibold text-sm">
                                        {dav.ID_FNC}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default DetailDav