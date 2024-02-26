// Bibliotecas
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// Dados
import DataStock from './../data/DataStock.json'

// Componente
import StockTable from "./StockTable";
import CustomVerticalBarChart from '../scenes/CustomVerticalBarChart';

// Utils
import { useEffect, useState } from 'react';


const DashboardStock = () => {
    const [stockData, setStockData] = useState<any[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    useEffect(() => {
        setStockData(DataStock.estoque);
    }, []);

    const COLORS = [
        '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF',
        '#FF195E', '#19FFB1', '#FF5C19', '#196DFF', '#8A2BE2',
        '#FF1493', '#00FFFF', '#7FFF00', '#FFD700', '#FFA07A',
        '#20B2AA', '#FF00FF', '#1E90FF', '#FFFF00'
    ];

    const handleProductClick = (productName: string) => {
        const isSelected = selectedProducts.includes(productName);
        let updatedSelection: string[] = [];

        if (isSelected) {
            updatedSelection = selectedProducts.filter(item => item !== productName); // Remove o produto selecionado
        } else {
            updatedSelection = [...selectedProducts, productName]; // Adiciona o produto selecionado
        }

        setSelectedProducts(updatedSelection);
    };

    const filteredData = selectedProducts.length > 0
        ? stockData.filter(item => selectedProducts.includes(item.produto))
        : stockData;

    return (
        <div className="col-span-12 md:pb-0 mb-5 w-full">
            <div className="grid gap-1 grid-cols-1 lg:grid-cols-1 px-5">
                <div className="bg-white shadow-lg rounded-xl p-5">
                    <div className='flex items-center justify-between w-full mb-5'>
                        <div className='p-1 pb-5'>
                            <h1 className='font-bold md:text-lg text-sm'>Estoque</h1>
                        </div>

                        <div className="relative">
                            <button className="inline-flex justify-center items-center w-full md:px-3 px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                                <span className="mr-2 md:text-sm text-xs">Produtos</span>
                                <svg width="20px" height="20px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                    <path d="M3 6H21" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M7 12L17 12" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M11 18L13 18" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className='md:flex w-full'>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Tooltip formatter={(value, name, props) => (<><p>Produto: {props.payload.produto}</p> <p>Quantidade: {value}</p></>)} />
                                <Pie
                                    data={filteredData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius="100%"
                                    fill="#8884d8"
                                    dataKey="quantidade"
                                >
                                    {filteredData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="flex flex-col md:w-1/4 h-[280px] overflow-auto">
                            {stockData.map((entry, index) => (
                                <div key={`legend-${index}`} onClick={() => handleProductClick(entry.produto)} className="flex items-center">
                                    <div className={`h-4 w-4 rounded-full mr-2 ${selectedProducts.includes(entry.produto) ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                                    <p style={{ fontSize: '12px' }}>{entry.produto}</p>
                                </div>
                            ))}

                        </div>
                    </div>
                    <div className='py-5'>
                        <h1 className='font-bold md:text-lg text-sm'>Produtos com Estoque baixo</h1>
                        <StockTable /> 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStock;