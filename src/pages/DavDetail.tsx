// Componentes
import InfoCards from '../components/InfoCards'
import MainComponent from '../components/MainComponent'
import DetailDav from '../components/DetailDav/DetailDav'
import OrderDetailsTable from '../components/tables/OrderDetailsTable'

// Dadps
import { GetDavDetailsById } from '../data/davDetailsCard'
import { UseApiData } from '../data/useApiData'

// Biblioteca
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import { Link, useParams } from 'react-router-dom'

// Tipagem
import { columnProp } from '../models/types'

const DavDetail = () => {
    const { id } = useParams();
    const { infoDetaildCard } = GetDavDetailsById()

    let query = `select iif(prv.referencia_prv is null, prd.codigo_prd, prv.codigo_prv) as codigo_prd, prd.descricao_prd, prd.referencia_prd, sdi.qtde_sdi,  sdi.valor_bruto_sdi, sdi.valor_desconto_sdi, sdi.valor_acrescimo_sdi, sdi.valor_liquido_sdi, sdi.perc_desconto_sdi, sdi.status_sdi, alm.descricao_alm, sdi.item_promocao_sdi, sdi.qtde_disponivel_sdi from saidas_itens sdi inner join produtos prd on prd.id_prd = sdi.id_prd inner join empresas emp on emp.id_emp = sdi.id_emp inner join almoxarifados alm on alm.id_alm = sdi.id_alm left join v_funcionarios fnc on fnc.id_pss = sdi.id_pss left join cores crs on crs.id_crs = prd.id_crs left join produtos_variacoes prv on (prv.id_prd = sdi.id_prd and prv.codigo_prv = sdi.codigo_prv and prv.id_prv = sdi.id_prv and sdi.id_gri = prv.id_gri) left join ambientes amb on amb.id_amb = sdi.id_amb left join tabelas_precos tbp on tbp.id_tbp = sdi.id_tbp left join tipos_separacao tsp on tsp.id_tsp = sdi.id_tsp where sdi.id_sds = ${id} and prd.tipo_prd in('R', 'S', 'P') and sdi.id_item_sdi > 0 and sdi.produtopai_kit_sdi is false order by id_item_sdi, id_prd_composto, id_sequenciainsumokit_sdi`;

    const { data, loading } = UseApiData({ query });

    const columns: columnProp[] = [
        { id: 1, headerName: "Codigo do Produto" },
        { id: 2, headerName: "Almoxarifado" },
        { id: 3, headerName: "Produto" },
        { id: 4, headerName: "Promoção" },
        { id: 5, headerName: "Desconto" },
        { id: 6, headerName: "Quantidade Disponivel" },
        { id: 7, headerName: "Quantidade da Saida" },
        { id: 7, headerName: "Referencia do Produto" },
        { id: 8, headerName: "Status da Saida" },
        { id: 9, headerName: "Valor do Acrescimo" },
        { id: 10, headerName: "Valor Bruto" },
        { id: 11, headerName: "Valor Desconto" },
        { id: 11, headerName: "Valor Liquido" },
    ];

    return (
        <div className="">
            <InfoCards infoData={infoDetaildCard} />
            <MainComponent>
                <div className="md:flex items-center justify-between w-full ">
                    <div className="pb-5 flex justify-between items-center w-full p-5">
                        <h1 className="font-bold md:text-lg text-sm">Detalhe da DAV</h1>
                        <div className="flex items-center hover:scale-[1.03] justify-center items-center md:px-3 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                            <Link
                                to="/"
                                className="flex items-center justify-center "
                            >
                                <FontAwesomeIcon
                                    className='w-3 h-3 flex'
                                    icon={faAngleLeft}
                                />
                                <span className="flex mr-2 md:text-sm text-xs px-1 text-center">retorna</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <DetailDav />
            </MainComponent>
            <MainComponent>
                <div className="md:flex items-center justify-between p-5">
                    <div className="p-1">
                        <h1 className="font-bold md:text-lg text-sm">Produtos da DAV</h1>
                    </div>
                    <div className="flex items-center hover:scale-[1.03] justify-center items-center md:px-3 px-1 py-1 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                        <Link
                            to="/"
                            className="flex items-center justify-center "
                        >
                            <FontAwesomeIcon
                                className='w-3 h-3 flex'
                                icon={faAngleLeft}
                            />
                            <span className="flex mr-2 md:text-sm text-xs px-1 text-center">retorna</span>
                        </Link>
                    </div>
                </div>
                <OrderDetailsTable columns={columns} data={data} loading={loading} />
            </MainComponent>
        </div>
    )
}

export default DavDetail