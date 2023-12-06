// Bibliotecas
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Dadso
import DataVendas from './../data/DataVendas.json'
import dataStock from './../data/DataStock.json'

// Utils
import { ToggleFilterBtn } from '../utils/ToggleFilterBtn';

// React
import { FunctionComponent } from 'react';

// Tipagem 
interface DashBoardProps {
    dateFormated: string | null
}

const DasBoardHome: FunctionComponent<DashBoardProps> = ({ dateFormated }) => {
    // Desativa e ativa Dropwdown do filter
    const { filterState, HandfilterState } = ToggleFilterBtn()
    console.log(dateFormated)
    

    // Vendas
    const salesBySeller: { [key: string]: number } = {};
    DataVendas.vendas.forEach((sale: any) => {
        if (salesBySeller[sale.vendedor]) {
            salesBySeller[sale.vendedor] += sale.total_venda;
        } else {
            salesBySeller[sale.vendedor] = sale.total_venda;
        }
    });

    const chartData = Object.keys(salesBySeller).map((seller) => ({
        vendedor: seller,
        totalVendas: salesBySeller[seller],
    }));


    // console.log("Lucro por vendas ", dadosLucro)

    return (
        <div className="md:ml-auto md:mx-0 px-5 xl:w-[82%] ">
            <div className="col-span-12 md:pb-0 mb-5">
                <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">

                    <div className="bg-white shadow-lg rounded-xl p-5" id="chartpie">

                        <div className='flex items-center justify-between w-full'>
                            <div className='p-1 pb-5'>
                                <h1 className='font-bold text-lg'>Lucro por Produto</h1>
                            </div>

                            <div className="relative">
                                <button onClick={() => { HandfilterState("ProfitFilter") }} id="dropdown-button" className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                                    <span className="mr-2 text-sm">Produtos</span>
                                    {filterState.ProfitFilter ? (
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000" stroke-width="1.5">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM16.0303 13.0303L12.5303 16.5303C12.2374 16.8232 11.7626 16.8232 11.4697 16.5303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L11.25 14.1893V8C11.25 7.58579 11.5858 7.25 12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V14.1893L14.9697 11.9697C15.2626 11.6768 15.7374 11.6768 16.0303 11.9697C16.3232 12.2626 16.3232 12.7374 16.0303 13.0303Z" fill="#000000"></path>
                                        </svg>
                                    ) : (
                                        <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000" stroke-width="1.5">
                                            <path d="M4.0001 3H20.0002C20.5525 3 21.0002 3.44764 21.0002 3.99987L21.0004 5.58569C21.0005 5.85097 20.8951 6.10538 20.7075 6.29295L14.293 12.7071C14.1055 12.8946 14.0001 13.149 14.0001 13.4142L14.0001 19.7192C14.0001 20.3698 13.3887 20.8472 12.7576 20.6894L10.7576 20.1894C10.3124 20.0781 10.0001 19.6781 10.0001 19.2192L10.0001 13.4142C10.0001 13.149 9.89474 12.8946 9.7072 12.7071L3.29299 6.29289C3.10545 6.10536 3.0001 5.851 3.0001 5.58579V4C3.0001 3.44772 3.44781 3 4.0001 3Z" fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    )
                                    }
                                </button>
                                <div id="dropdown-menu" className={
                                    filterState.ProfitFilter ?
                                        " absolute right-0 z-40 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1" :
                                        "hidden absolute right-0 z-40 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1"
                                }>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Produtos</a>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Lucros</a>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Quantidades Vendidas</a>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Data</a>
                                </div>
                            </div>

                        </div>
                        {/* <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={dadosLucro}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="produto" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="lucro" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
 */}

                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-5" id="chartpie">

                        <div className='flex items-center justify-between w-full'>
                            <div className='p-1 pb-5'>
                                <h1 className='font-bold text-lg'>Estoque</h1>
                            </div>

                            <div className="relative">
                                <button onClick={() => HandfilterState("ClientsFilter")} id="dropdown-button" className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                                    <span className="mr-2 text-sm">Filtros</span>

                                    {filterState.ClientsFilter ? (
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000" stroke-width="1.5">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM16.0303 13.0303L12.5303 16.5303C12.2374 16.8232 11.7626 16.8232 11.4697 16.5303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L11.25 14.1893V8C11.25 7.58579 11.5858 7.25 12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V14.1893L14.9697 11.9697C15.2626 11.6768 15.7374 11.6768 16.0303 11.9697C16.3232 12.2626 16.3232 12.7374 16.0303 13.0303Z" fill="#000000"></path>
                                        </svg>
                                    ) : (
                                        <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000" stroke-width="1.5">
                                            <path d="M4.0001 3H20.0002C20.5525 3 21.0002 3.44764 21.0002 3.99987L21.0004 5.58569C21.0005 5.85097 20.8951 6.10538 20.7075 6.29295L14.293 12.7071C14.1055 12.8946 14.0001 13.149 14.0001 13.4142L14.0001 19.7192C14.0001 20.3698 13.3887 20.8472 12.7576 20.6894L10.7576 20.1894C10.3124 20.0781 10.0001 19.6781 10.0001 19.2192L10.0001 13.4142C10.0001 13.149 9.89474 12.8946 9.7072 12.7071L3.29299 6.29289C3.10545 6.10536 3.0001 5.851 3.0001 5.58579V4C3.0001 3.44772 3.44781 3 4.0001 3Z" fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    )
                                    }

                                </button>
                                <div id="dropdown-menu" className={
                                    filterState.ClientsFilter ?
                                        "absolute right-0 mt-2 z-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1" :
                                        "hidden absolute right-0 z-40 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1"
                                }
                                >
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Produtos</a>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Lucros</a>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Quantidades Vendidas</a>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Data</a>
                                </div>
                            </div>

                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dataStock.estoque}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="produto" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantidade" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>


                    </div>
                </div>


            </div>
            <div className="col-span-12 mt-5 mb-10">
                <div className="grid gap-2 grid-cols-1 lg:grid-cols-1">
                    <div className="bg-white shadow-lg rounded-xl p-5" id="chartpie">

                        <div className='flex items-center justify-between w-full'>
                            <div className='p-1 pb-5'>
                                <h1 className='font-bold text-lg'>Vendas</h1>
                            </div>

                            <div className="relative">
                                <button onClick={() => HandfilterState("SalesFilter")} id="dropdown-button" className="inline-flex justify-center items-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                                    <span className="mr-2 text-sm">Filtros</span>

                                    {filterState.SalesFilter ? (
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000" stroke-width="1.5">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM16.0303 13.0303L12.5303 16.5303C12.2374 16.8232 11.7626 16.8232 11.4697 16.5303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L11.25 14.1893V8C11.25 7.58579 11.5858 7.25 12 7.25C12.4142 7.25 12.75 7.58579 12.75 8V14.1893L14.9697 11.9697C15.2626 11.6768 15.7374 11.6768 16.0303 11.9697C16.3232 12.2626 16.3232 12.7374 16.0303 13.0303Z" fill="#000000"></path>
                                        </svg>
                                    ) : (
                                        <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000" stroke-width="1.5">
                                            <path d="M4.0001 3H20.0002C20.5525 3 21.0002 3.44764 21.0002 3.99987L21.0004 5.58569C21.0005 5.85097 20.8951 6.10538 20.7075 6.29295L14.293 12.7071C14.1055 12.8946 14.0001 13.149 14.0001 13.4142L14.0001 19.7192C14.0001 20.3698 13.3887 20.8472 12.7576 20.6894L10.7576 20.1894C10.3124 20.0781 10.0001 19.6781 10.0001 19.2192L10.0001 13.4142C10.0001 13.149 9.89474 12.8946 9.7072 12.7071L3.29299 6.29289C3.10545 6.10536 3.0001 5.851 3.0001 5.58579V4C3.0001 3.44772 3.44781 3 4.0001 3Z" fill="#000000" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                    )
                                    }

                                </button>
                                <div id="dropdown-menu" className={
                                    filterState.SalesFilter ?
                                        "absolute right-0 mt-2 z-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1" :
                                        "hidden absolute right-0 z-40 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-1 space-y-1"
                                }>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Produtos</a>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Lucros</a>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Quantidades Vendidas</a>
                                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100 cursor-pointer rounded-md">Data</a>
                                </div>
                            </div>

                        </div>

                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="vendedor" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="totalVendas" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                        {/* <ResponsiveContainer width="100%" height={250}>
                            <LineChart
                                data={dadosVendas}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="data" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="totalVendas" stroke="#8884d8" />
                                <Line type="monotone" dataKey="produto" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer> */}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default DasBoardHome