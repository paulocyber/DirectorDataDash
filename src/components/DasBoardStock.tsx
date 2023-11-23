// Bibliotecas
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import InfoCardStock from "./InfoCardStock"

const DasBoardStock = () => {
    const stock = [
        {
            fabricante: 'Fabricante A',
            quantidadeEstoque: 100,
            numeroProdutos: 50,
            itensEstoqueMinimo: 10,
            valorEstoque: 5000,
            localizacao: 'Localização A'
        },
        {
            fabricante: 'Fabricante B',
            quantidadeEstoque: 150,
            numeroProdutos: 70,
            itensEstoqueMinimo: 15,
            valorEstoque: 9500,
            localizacao: 'Localização B'
        },
        {
            fabricante: 'Fabricante C',
            quantidadeEstoque: 120,
            numeroProdutos: 90,
            itensEstoqueMinimo: 15,
            valorEstoque: 9100,
            localizacao: 'Localização C'
        },
        {
            fabricante: 'Fabricante E',
            quantidadeEstoque: 190,
            numeroProdutos: 60,
            itensEstoqueMinimo: 10,
            valorEstoque: 7520,
            localizacao: 'Localização E'
        },

    ];
    // Maior para o menor 
    const sortedStockData = [...stock].sort((a, b) => b.valorEstoque - a.valorEstoque);

    return (
        <div className="md:ml-auto md:mx-0 px-5 xl:w-[82%] flex">
            <div className="col-span-12 md:pb-0 mb-5 w-[80%] mr-5">
                <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 md:w-full">
                    <div className="bg-white shadow-lg rounded-xl p-5 lg:col-span-1">
                        <div className="flex items-center justify-between w-full">
                            <div className="p-1 pb-5">
                                <h1 className="font-bold text-lg">Valor do Estoque por Fabricante</h1>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={sortedStockData}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="fabricante" type="category" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="valorEstoque" fill="#3B82F6" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-5 lg:col-span-1">
                        <div className="flex items-center justify-between w-full">
                            <div className="p-1 pb-5">
                                <h1 className="font-bold text-lg">Quantidade de estoque por localização</h1>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={sortedStockData}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="fabricante" type="category" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="valorEstoque" fill="#3B82F6" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-5 lg:col-span-2">
                        <div className="flex items-center justify-between w-full">
                            <div className="p-1 pb-5">
                                <h1 className="font-bold text-lg">Itens com Estoque Mínimo</h1>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={sortedStockData}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="fabricante" type="category" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="valorEstoque" fill="#3B82F6" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>


                </div>

            </div>
            <div className="w-2/5 flex bg-white shadow-lg p-5 flex-col">
                <div className="">
                    <h1 className="font-bold text-lg">Top 10 Produtos</h1>
                </div>

                <ResponsiveContainer width="100%" height={730}>
                    <BarChart
                        data={sortedStockData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="fabricante" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="valorEstoque" fill="#3B82F6" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>

            </div>
        </div >


        // <div className="md:ml-auto md:mx-0 px-5 xl:w-[82%] ">
        //     <div className="col-span-12 md:pb-0 mb-5">
        //         <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 md:w-4/5">

        //             <div className="bg-white shadow-lg rounded-xl p-5" id="chartpie">

        //                 <div className='flex items-center justify-between w-full'>
        //                     <div className='p-1 pb-5'>
        //                         <h1 className='font-bold text-lg'>Valor do Estoque por Fabricante</h1>
        //                     </div>
        //                 </div>
        //                 <ResponsiveContainer width="100%" height={300}>
        //                     <BarChart
        //                         data={sortedStockData}
        //                         layout="vertical"
        //                         margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        //                     >
        //                         <CartesianGrid strokeDasharray="3 3" />
        //                         <XAxis type="number" />
        //                         <YAxis dataKey="fabricante" type="category" />
        //                         <Tooltip />
        //                         <Legend />
        //                         <Bar dataKey="valorEstoque" fill="#3B82F6" barSize={20} />
        //                     </BarChart>
        //                 </ResponsiveContainer>
        //             </div>

        //             <div className="bg-white shadow-lg rounded-xl p-5" id="chartpie">

        //                 <div className='flex items-center justify-between w-full'>
        //                     <div className='p-1 pb-5'>
        //                         <h1 className='font-bold text-lg'>Valor do Estoque por Fabricante</h1>
        //                     </div>
        //                 </div>
        //                 <ResponsiveContainer width="100%" height={300}>
        //                     <BarChart
        //                         data={sortedStockData}
        //                         layout="vertical"
        //                         margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        //                     >
        //                         <CartesianGrid strokeDasharray="3 3" />
        //                         <XAxis type="number" />
        //                         <YAxis dataKey="fabricante" type="category" />
        //                         <Tooltip />
        //                         <Legend />
        //                         <Bar dataKey="valorEstoque" fill="#3B82F6" barSize={20} />
        //                     </BarChart>
        //                 </ResponsiveContainer>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default DasBoardStock