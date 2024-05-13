import { listPorp } from "@/pages/detaildav/[ID_ORIGEM]";
import { formatDate } from "@/utils/mask/dataMask";
import { formatCurrency } from "@/utils/mask/moneyMask";

export function ItemsDavDetail({ listDav }: listPorp) {
    // console.log("dados: ", listDav)
    return (
        <>
            {listDav?.map((item) => (
                <div
                    className="bg-white  rounded-xl w-[90%] mx-auto pb-5"
                >
                    <div className="pt-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Número da DAV:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.ID_ORIGEM}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Empresa:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.SIGLA_EMP}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Apelido:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.APELIDO_PSS}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Descrição do Recibo:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.DESCRICAO_RCB}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    ID do Recibo:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.ID_RCB}
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
                                    {formatCurrency(Number(item.VALOR_RCB.replace(",", ".")))}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Juros:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {formatCurrency(Number(item.JUROS_RCB.replace(",", ".")))}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Multa:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {formatCurrency(Number(item.MULTA_RCB.replace(",", ".")))}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Restante do Recibo:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {formatCurrency(
                                        Number(item.RESTANTE_RCB.replace(",", "."))
                                    )}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Restante do Recibo Sem Juros:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {formatCurrency(
                                        Number(item.RESTANTE_SEM_JUROS_RCB.replace(",", "."))
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
                                        Number(item.VALOR_PAGO_RCB.replace(",", "."))
                                    )}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Valor do Acrecimo:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.VALOR_ACRESCIMOS_RCI}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Valor do Desconto:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.VALOR_DESCONTO_RCI}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Status do Recibo:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.STATUS_RCB}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Data do Lançamento:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.DATAHORA_LANCAMENTO_RCB.split(' ')[0]}
                                </p>
                            </div>
                        </div>

                        <div className="border-b w-full my-3"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 pb-5">


                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Data do Pagamento:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.DATAHORA_PAGAMENTO_RCB.split(' ')[0]}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Data do Vencimento:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.DATA_VENCIMENTO_RCB.split(' ')[0]}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Vendedor:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.VENDEDOR}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Id Financeiro:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.ID_FNC}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}