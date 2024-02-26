// Bibliotecas
import InventoryIcon from '@mui/icons-material/Inventory';

// Ultils
import { TotalProductsinStock } from '../utils/FunctionStock';
import { formatCurrency, formatValue } from '../utils/ApplyMask';

// Dados
import DataVendas from './../data/DataVendas.json'

const InfoCardDasboard = () => {
    // QUANTIDADE ESTOQUE
    const quantityInStocks = TotalProductsinStock();

    // Total de vendas
    const totalVendas = () => {
        const valueTotalVendas = DataVendas.vendas.map(
            (vendas) => vendas.total_venda
        )
        let ValueTotalVendas = 0
        for (let contador = 0; contador < valueTotalVendas.length; contador++) {
            ValueTotalVendas += valueTotalVendas[contador]
        }
        return ValueTotalVendas
    }

   

    const ValueTotalVendas = totalVendas()
    // console.log(ValueTotalVendas)
    return (
        <div className="mt-5 ">
            
            <div className="mb-5 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">

                <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md z-10">
                    <div className="bg-blue-500 mx-4 rounded-xl overflow-hidden text-white shadow-black-500/40 shadow-lg absolute -mt-4 grid md:h-16 h-14 md:w-16 w-14 place-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 ">
                            <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                            <path fill-rule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clip-rule="evenodd"></path>
                            <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
                        </svg>
                    </div>
                    <div className="p-4 text-right">
                        <p className="block antialiased font-sans md:text-sm text-xs leading-normal font-normal text-blue-gray-600">Lucro de Hoje</p>
                        <h4 className="block antialiased tracking-normal font-sans md:text-2xl text-xl font-semibold leading-snug text-blue-gray-900">R$ 53k</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-4">
                        <p className="block antialiased font-sans md:text-base text-sm leading-relaxed font-normal text-blue-gray-600">
                            <strong className="text-green-500">+55%</strong>&nbsp;Do que na semana passada
                        </p>
                    </div>
                </div>

                <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                    <div className="bg-blue-500 mx-4 rounded-xl overflow-hidden text-white shadow-black-500/40 shadow-lg absolute -mt-4 grid md:h-16 h-14 md:w-16 w-14 place-items-center">
                        <InventoryIcon />
                    </div>
                    <div className="p-4 text-right">
                        <p className="block antialiased font-sans md:text-sm text-xs leading-normal font-normal text-blue-gray-600">Estoque</p>
                        <h4 className="block antialiased tracking-normal font-sans md:text-2xl text-xl font-semibold leading-snug text-blue-gray-900">{formatValue(quantityInStocks)}</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-4">
                        <p className="block antialiased font-sans md:text-base text-sm leading-relaxed font-normal text-blue-gray-600">
                            <strong className="text-green-500">+3%</strong>&nbsp;Do que no mês passado
                        </p>
                    </div>
                </div>

                <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                    <div className="bg-blue-500 mx-4 rounded-xl overflow-hidden text-white shadow-black-500/40 shadow-lg absolute -mt-4 grid md:h-16 h-14 md:w-16 w-14 place-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"></path>
                        </svg>
                    </div>
                    <div className="p-4 text-right">
                        <p className="block antialiased font-sans md:text-sm text-xs leading-normal font-normal text-blue-gray-600">Total de  Vendas</p>
                        <h4 className="block antialiased tracking-normal font-sans md:text-2xl text-xl font-semibold leading-snug text-blue-gray-900">{formatCurrency(ValueTotalVendas)}</h4>
                    </div>
                    <div className="border-t border-blue-gray-50 p-4">
                        <p className="block antialiased font-sans md:text-base text-sm leading-relaxed font-normal text-blue-gray-600">
                            <strong className="text-green-500">+5%</strong>&nbsp;Do que ontem
                        </p>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default InfoCardDasboard