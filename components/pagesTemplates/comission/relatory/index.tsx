"use client";

// React
import { useCallback, useContext, useMemo, useState } from "react";
import { AuthContext } from "@/providers/auth";

// Dados
import ComissionInfoCard from "@/data/dataCards/commision";
import vibrantPalette from "@/data/pallets/vibrant.json";

// Componentes
import Container from "@/components/ui/container";
import ToolBar from "@/components/ui/toolBar";
import GraphicContainer from "@/components/ui/sciences/container";
import InfoCard from "@/components/ui/InfoCard";

// Bibliotecas
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import { setupApiClient } from "@/utils/fetchs/api";

// Tipagem
import {
  ItemsComissionCalculation1Data,
  ItemsCommissionCalculationData,
} from "@/types/comission";
import { InfiniteScroll } from "@/utils/InfiniteScroll";
interface LayoutCommitteeReportProps {
  data: ItemsComissionCalculation1Data[];
}

// function transform(raw: ItemsCommissionCalculationData[]) {
//   return raw.map((r) => ({
//     Vendedor: r.sellerName,
//     totalSale: r.totalSale,
//     totalCommission: r.totalCommission,
//     client: r.commission.client?.value ?? 0,
//     valuePerSale: r.commission.valuePerSale?.value ?? 0,
//     paymentMethod: r.commission.paymentMethod?.value ?? 0,
//     saleValue: r.commission.saleValue?.value ?? 0,
//     defaultCommission: r.commission.default?.value ?? 0,
//   }));
// }

export default function LayoutCommitteeReport({
  data,
}: LayoutCommitteeReportProps) {
  const [commissionDetails, setCommisionDetails] = useState(data);
  const [limit, setLimit] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);

  // const infoCard = ComissionInfoCard({ data: commissionDetails });
  const infoCard = useMemo(
    () => ComissionInfoCard({ data: commissionDetails }),
    [commissionDetails]
  );

  // const comissions = transform(commissionDetails);

  const { token } = useContext(AuthContext);

  const api = setupApiClient(token);

  async function handleRefresh() {
    setLoading(true);

    const data = await api.get("/v1/commissions");

    setCommisionDetails(data.data.returnObject.body);
    setLoading(false);
  }

  // const fetchMore = useCallback(() => {
  //   if (limit < data.length) {
  //     setLimit((prev) => prev + 10);
  //   }
  // }, [limit, data.length]);

  // const dataLimit = data.slice(0, limit);

  return (
    <section className="py-1 text-gray-800">
      <InfoCard data={infoCard} />

      <div className="grid grid-cols-1 gap-4">
        <div className="col-span-1">
          <Container>
            <ToolBar
              title="Relatório de comissão"
              handleRefreshClick={() => handleRefresh()}
            />
          </Container>
        </div>
        {/* <Container>
            <ToolBar
              title="Relatório de comissão"
              handleRefreshClick={() => handleRefresh()}
            />
            <main className="p-4 w-full">
              <GraphicContainer loading={loading}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comissions}
                    margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Vendedor" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || payload.length === 0)
                          return null;

                        const data = payload[0].payload;

                        return (
                          <div className="bg-white w-80 border rounded-md p-4 shadow-lg text-gray-800">
                            <p className="font-bold mb-2">{data.Vendedor}</p>
                            <div className="text-sm space-y-1">
                              <p>
                                Total das vendas:{" "}
                                {formatCurrency(data.totalSale)}
                              </p>
                              <p>
                                Total de comissão:{" "}
                                {formatCurrency(data.totalCommission)}
                              </p>
                              <p>
                                Comissão por cliente:{" "}
                                {formatCurrency(data.client)}
                              </p>
                              <p>
                                Comissão por venda:{" "}
                                {formatCurrency(data.valuePerSale)}
                              </p>
                              <p>
                                Comissão por métodos de pagamento:{" "}
                                {formatCurrency(data.paymentMethod)}
                              </p>
                              <p>
                                Comissão por Valor de venda:{" "}
                                {formatCurrency(data.saleValue)}
                              </p>
                              <p>
                                Valor da comissão padrão:{" "}
                                {formatCurrency(data.defaultCommission)}
                              </p>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={10}
                      layout="vertical"
                      align="center"
                      verticalAlign="bottom"
                      content={({ payload }) => (
                        <div className="flex justify-center space-x-4 py-2">
                          {(payload as any[]).map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <svg
                                width={10}
                                height={10}
                                viewBox="0 0 10 10"
                                className="rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-gray-800 text-sm">
                                {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    <Bar
                      dataKey="client"
                      stackId="a"
                      name="Cliente"
                      fill={vibrantPalette[0]}
                    />
                    <Bar
                      dataKey="valuePerSale"
                      stackId="a"
                      name="Por vendas"
                      fill={vibrantPalette[1]}
                    />
                    <Bar
                      dataKey="paymentMethod"
                      stackId="a"
                      name="Metodo de pagamento"
                      fill={vibrantPalette[2]}
                    />
                    <Bar
                      dataKey="saleValue"
                      stackId="a"
                      name="Valor de venda"
                      fill={vibrantPalette[3]}
                    />
                    <Bar
                      dataKey="defaultCommission"
                      stackId="a"
                      name="Valor padrão da comissão"
                      fill={vibrantPalette[4]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </GraphicContainer>
            </main>
          </Container>
        </div>

        <main className="col-span-1">
          <Container>
            <main className="p-5">
              <h1 className="font-extrabold sm:text-xl truncate pr-2 text-lg text-gray-800">
                Detalhes por Vendedor
              </h1>
              <div className="overflow-y-auto h-[250px]">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500">
                    <tr>
                      <th className="py-2">Vendedor</th>
                      <th className="py-2">Total Venda</th>
                      <th className="py-2">Total Comissão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataLimit.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="py-2">{item.sellerName}</td>
                        <td className="py-2">
                          {formatCurrency(item.totalSale)}
                        </td>
                        <td className="py-2">
                          {formatCurrency(item.totalCommission)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <InfiniteScroll fetchMore={fetchMore} />
            </main>
          </Container>
        </main>*/}
      </div>
    </section>
  );
}
