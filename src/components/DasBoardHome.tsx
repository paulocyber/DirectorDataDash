// Bibliotecas
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

// Dados
import salesData from "./../data/BasesVendas.json";
import { useEffect, useState } from "react";

// Componentes

// Tipagem
type Requests = {
  Data: string;
  Pedido?: string; // Torna a propriedade Pedido opcional
  "Código Produto": string;
  Produto: string;
  "Qtde. Pedido": number;
};

type bestSellingProduct = {
  nome: string;
  quantidade: number;
};

const DasBoardHome = () => {
  const [topSellingProducts, setTopSellingProducts] = useState<
    bestSellingProduct[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const dataSales: Requests[] = salesData.Pedidos;

  useEffect(() => {
    const calculateBestSellingProducts = () => {
      const vendasPorProduto: { [codigoProduto: string]: bestSellingProduct } =
        {};

      dataSales.forEach((pedido) => {
        const codigoProduto = pedido["Código Produto"];

        if (vendasPorProduto[codigoProduto]) {
          vendasPorProduto[codigoProduto].quantidade += pedido["Qtde. Pedido"];
        } else {
          vendasPorProduto[codigoProduto] = {
            nome: pedido.Produto,
            quantidade: pedido["Qtde. Pedido"],
          };
        }
      });

      const orderedProducts: bestSellingProduct[] = Object.values(
        vendasPorProduto
      ).sort((produtoA, produtoB) => produtoB.quantidade - produtoA.quantidade);

      setTopSellingProducts(orderedProducts);
    };

    calculateBestSellingProducts();
  }, []);

  const handleProductClick = (productName: string) => {
    const isSelected = selectedProducts.includes(productName);
    let updatedSelection: string[] = [];

    if (isSelected) {
      updatedSelection = selectedProducts.filter(
        (item) => item !== productName
      );
    } else {
      updatedSelection = [...selectedProducts, productName];
    }

    setSelectedProducts(updatedSelection);
  };

  const filteredData =
    selectedProducts.length > 0
      ? topSellingProducts.filter((item) =>
          selectedProducts.includes(item.nome)
        )
      : topSellingProducts;

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF195E",
    "#19FFB1",
    "#FF5C19",
    "#196DFF",
    "#8A2BE2",
    "#FF1493",
    "#00FFFF",
    "#7FFF00",
    "#FFD700",
    "#FFA07A",
    "#20B2AA",
    "#FF00FF",
    "#1E90FF",
    "#FFFF00",
  ];

  return (
    <div className="col-span-12 md:pb-0 mb-[4em] w-full">
      <div className="grid gap-1 grid-cols-1 lg:grid-cols-1 px-5">
        <div className="bg-white shadow-lg rounded-xl p-5">
          <div className="flex items-center justify-between w-full mb-5">
            <div className="p-1 pb-5">
              <h1 className="font-bold md:text-lg text-sm">
                Produtos mais vendidos
              </h1>
            </div>
            <div className="relative">
              <button className="inline-flex justify-center items-center w-full md:px-3 px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                <span className="mr-2 md:text-sm text-xs">Produtos</span>
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#000000"
                >
                  <path
                    d="M3 6H21"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M7 12L17 12"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M11 18L13 18"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="md:flex w-full">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip
                  formatter={(value, name, props) => (
                    <>
                      <p>Produto: {props.payload.nome}</p>{" "}
                      <p>Quantidade: {value}</p>
                    </>
                  )}
                />
                <Pie
                  data={filteredData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="100%"
                  fill="#8884d8"
                  dataKey="quantidade"
                >
                  {topSellingProducts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-col md:w-1/4 h-[280px] overflow-auto">
              {topSellingProducts.map((entry, index) => (
                <div
                  key={`legend-${index}`}
                  onClick={() => handleProductClick(entry.nome)}
                  className="flex items-center"
                >
                  <div
                    className={`h-4 w-4 rounded-full mr-2 ${
                      selectedProducts.includes(entry.nome)
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <p style={{ fontSize: "12px" }}>{entry.nome}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="py-10">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <div className="flex flex-row  border-x-2 border-gray-300 shadow-sm p-4">
                  <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-blue-100 text-blue-500">
                    <svg
                      className="w-7 h-7"
                      xmlns="http://www.w3.org/2000/svg"
                      width="100"
                      height="100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="8" r="7" />
                      <polygon points="12 15 17 21 7 21 12 15" />
                    </svg>
                  </div>
                  <div className="flex flex-col flex-grow ml-4">
                    <div className="text-sm text-gray-700 font-semibold">
                      Melhor vendedor(a)
                    </div>
                    <div className="text-sm text-gray-600 font-semibold">
                      <strong className="text-green-500">Maria</strong>
                    </div>
                    <div className="font-bold text-lg ">120</div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <div className="flex flex-row border-r-2 screen-sx:border-x-2 border-gray-300 p-4">
                  <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-green-100 text-green-500">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col flex-grow ml-4">
                    <div className="text-sm text-gray-500">Pedidos</div>
                    <div className="font-bold text-lg">71</div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-6 md:col-span-3 w-full">
                <div className="flex flex-row  border-r-2 screen-sx:border-x-2 border-gray-300 p-4">
                  <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-orange-100 text-orange-500">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col flex-grow ml-4">
                    <div className="text-sm text-gray-500">Novos Clientes</div>
                    <div className="font-bold text-lg">10</div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 sm:col-span-6 md:col-span-3">
                <div className="flex flex-row border-r-2 screen-sx:border-x-2 border-gray-300 rounded p-4">
                  <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-red-100 text-red-500">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <div className="flex flex-col flex-grow ml-4">
                    <div className="text-sm text-gray-500">
                      Venda total desse mês
                    </div>
                    <div className="font-bold text-lg">15.220,00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DasBoardHome;
