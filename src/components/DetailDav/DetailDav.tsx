// Pages
import { DetailDavPorp } from "@/pages/detaildav/[ID_ORIGEM]";

// Utils
import { formatCurrency } from "@/utils/mask/moneyMask";

export function ItemsDavDetail({ listDavFinalized }: DetailDavPorp) {
    return (
        <>
            <div
                className="bg-white  rounded-xl w-[90%] mx-auto pb-5"
            >
                {listDavFinalized?.map((item, index) => (
                    <div key={index} className="">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4 ">
                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Número da DAV:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.ID_SDS}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Empresa:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.EMPRESA}
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
                                    Tipo de venda:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.TIPO_VENDA_SDS}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Cliente:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.CLIENTE}
                                </p>
                            </div>


                        </div>

                        <div className="border-b w-full my-3"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Almoxarifado:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.ALMOXARIFADO}
                                </p>
                            </div>


                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Valor Desconto:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {formatCurrency(Number(item.VALOR_DESCONTO_SDS.replace(",", ".")))}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Data da saída:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.DATAHORA_SDS.split(' ')[0]}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Data da finalização:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.DATAHORA_FINALIZACAO_SDS.split(' ')[0]}
                                </p>
                            </div>

                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Status:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.STATUS_SDS}
                                </p>
                            </div>

                        </div>

                        <div className="border-b w-full my-3"></div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
                            <div className="">
                                <h2 className="font-bold text-gray-600 text-base uppercase">
                                    Vendedor:
                                </h2>
                                <p className="text-gray-600 font-semibold text-sm">
                                    {item.VENDEDOR}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </>
    )
}