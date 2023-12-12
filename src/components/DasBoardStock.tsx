// Bibliotecas
import { ResponsiveContainer } from 'recharts';

// Dados
import DataStock from './../data/DataStock.json'

// Componente
import StockTable from "./StockTable";
import CustomBarChart from './../scenes/CustomBarChart';

// Utils
import { calculateProfit } from '../utils/FunctionStock';

const DasBoardStock = () => {

    // Maior para o menor 
    const sortedStockData = [...DataStock.estoque].sort((a, b) => b.valor_estoque - a.valor_estoque);
    const topTenProducts = sortedStockData.slice(0, 10);

    // Lucro por produto 
    const profits = calculateProfit()
    console.log("lucro por produto", profits)

    return (
        <div className="md:ml-auto md:mx-0 px-5 xl:w-[82%] md:flex">
            <div className="col-span-12 md:pb-0 mb-5 md:w-full w-[100%] mr-5">
                <div className="grid gap-3 grid-cols-1 lg:grid-cols-2 md:w-full">

                    <div className="bg-white shadow-lg rounded-xl p-5 lg:col-span-1">
                        <h1 className='font-bold md:text-lg text-sm'>Valor do Estoque</h1>
                        <ResponsiveContainer width="100%" height={300}>
                            <CustomBarChart data={sortedStockData} DescriptionData={"fabricante"} typeData={"category"} InformationData={"valor_estoque"} />
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white shadow-lg rounded-xl p-5 lg:col-span-1">
                        <h1 className='font-bold md:text-lg text-sm'>Lucro por Produto</h1>
                        <ResponsiveContainer width="100%" height={300}>
                            <CustomBarChart data={profits} DescriptionData={"produto"} typeData={"category"} InformationData={"lucro"} />
                        </ResponsiveContainer>
                        {/* <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={sortedStockData}
                                layout="vertical"
                                margin={{ top: 20, right: 10, left: 20, bottom: 2 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="localizacao" type="category" tick={{ fontSize: 16 }} tickFormatter={(value) => {
                                    const maxLength = 15;
                                    if (value.length > maxLength) {

                                        return `${value.substring(0, maxLength)}...`;
                                    }
                                    return value;
                                }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantidade" fill="#3B82F6" barSize={10} />
                            </BarChart>
                        </ResponsiveContainer> */}
                    </div>

                    <StockTable />

                </div>
            </div>

            <div className="md:w-2/5 flex bg-white rounded-lg shadow-lg mb-5 p-5 flex-col">
                <h1 className='font-bold md:text-lg text-sm'>Top 10 produtos</h1>
                <div className="w-full ">
                    <div className='w-full h-[790px]'>
                        <CustomBarChart data={topTenProducts} DescriptionData={"fabricante"} typeData={"category"} InformationData={"valor_estoque"} />
                    </div>
                    {/* <ResponsiveContainer width="100%" height={790}>
                        <BarChart
                            layout="vertical"
                            data={topTenProducts}
                            margin={{ top: 10, right: 10, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="fabricante" type="category" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="valor_estoque" fill="#3B82F6" barSize={50} />
                        </BarChart>
                    </ResponsiveContainer> */}
                </div>
            </div>
        </div >

    )
}

export default DasBoardStock