"use client";

// Componentes
import Container from "@/components/ui/container";
import InfoCard from "@/components/ui/InfoCard";
import Table from "@/components/ui/tables";
import { renderCell } from "@/components/renderCell/davs/products";

// Next
import Link from "next/link";

// Bibliotecas
import { IoMdArrowBack } from "react-icons/io";

// Dados
import DavInfoCard from "@/data/dataCards/dav";
import columns from "@/data/columns/dav/products/columns.json";

// Utils
import { formatCurrency } from "@/utils/mask/money";

// Tipagem
import { DavProductItemData, ItemsDavData } from "@/types/davs";
import { Badge } from "@heroui/react";
interface LayoutDetailDavProps {
  davDetailData: ItemsDavData[];
  productsData: DavProductItemData[];
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-gray-800 uppercase">
        {label}
      </span>
      <span className="mt-1 text-sm text-gray-600">{value}</span>
    </div>
  );
}

export default function LayoutDetailDav({
  davDetailData,
  productsData,
}: LayoutDetailDavProps) {
  const infoCard = DavInfoCard({ davs: davDetailData, detail: true });

  const totalLucro = productsData.reduce((acc, item) => {
    const valorLiquido = Number(item.VALOR_LIQUIDO_SDI.replace(",", "."));
    const qtde = Number(item.QTDE_SDI.replace(",", "."));
    const precoCusto = Number(item.PRECO_CUSTO_SDI.replace(",", "."));
    return acc + (valorLiquido - qtde * precoCusto);
  }, 0);

  const totalValorVenda = productsData.reduce((acc, item) => {
    const valorLiquido = Number(item.VALOR_LIQUIDO_SDI.replace(",", "."));
    return acc + valorLiquido;
  }, 0);

  const percentLucro =
    totalValorVenda > 0
      ? Number(((totalLucro / totalValorVenda) * 100).toFixed(2))
      : 0;

  return (
    <>
      <InfoCard data={infoCard} />
      <section className="py-4">
        <Container>
          <div className="flex flex-col w-full lg:flex-row gap-8">
            <div className="w-full flex flex-col gap-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-md">
                <h1 className="text-xl font-extrabold text-gray-800">
                  Detalhes da DAV
                </h1>
                <Link href="/davs/table">
                  <div className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow bg-gradient-to-b from-orange-400 to-orange-600 transition">
                    <IoMdArrowBack className="w-5 h-5" />
                    Voltar
                  </div>
                </Link>
              </div>

              <div className="p-6 rounded-2xl flex-1 w-full mx-auto items-center justify-center">
                {davDetailData.length === 0 ? (
                  <p className="text-center text-gray-500">
                    Nenhum detalhe encontrado para essa DAV.
                  </p>
                ) : (
                  davDetailData.map((item) => (
                    <div key={item.ID_SDS} className="flex flex-col ">
                      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        <InfoField label="Número" value={item.ID_SDS} />
                        <InfoField label="Empresa" value={item.EMPRESA} />
                        <InfoField label="Apelido" value={item.CLIENTE} />
                        <InfoField
                          label="Tipo venda"
                          value={item.TIPO_VENDA_SDS}
                        />
                        <InfoField
                          label="Desconto"
                          value={formatCurrency(
                            Number(item.VALOR_DESCONTO_SDS.replace(",", "."))
                          )}
                        />
                        <InfoField
                          label="Forma de pagamento"
                          value={item.FORMAPAGAMENTO}
                        />
                        <InfoField
                          label="Saída"
                          value={item.DATAHORA_SDS.split(" ")[0]}
                        />
                        <InfoField
                          label="Finalização"
                          value={item.DATAHORA_FINALIZACAO_SDS.split(" ")[0]}
                        />
                        <InfoField label="Vendedor" value={item.VENDEDOR} />
                        <InfoField label="Status" value={item.STATUS_SDS} />
                        <InfoField label="Cliente" value={item.CLIENTE} />
                        <InfoField
                          label="Almoxarifado"
                          value={item.ALMOXARIFADO}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Container>
        <Container>
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-md">
            <h1 className="text-xl font-extrabold text-gray-800">Produtos</h1>
            <Link href="/davs/table">
              <div className="flex items-center gap-2 px-4 py-2 text-white rounded-lg shadow bg-gradient-to-b from-orange-400 to-orange-600 transition">
                <IoMdArrowBack className="w-5 h-5" />
                Voltar
              </div>
            </Link>
          </div>
          <section className="pt-4">
            <Table
              columns={columns}
              data={productsData}
              renderCell={renderCell}
              loading={false}
            />
          </section>
          <div className="flex justify-end items-center gap-4 py-2 mr-5 ">
            <span className="text-sm font-semibold text-gray-700">
              Total lucro:
            </span>
            <div className="relative inline-flex items-center">
              <Badge
                content={`${percentLucro.toFixed(0)}%`}
                color={
                  percentLucro > 0
                    ? "success"
                    : percentLucro === 0
                      ? "default"
                      : "danger"
                }
                placement="top-right"
                size="sm"
                classNames={{
                  badge:
                    "rounded-full top-[-10%] text-white text-xs font-semibold shadow",
                }}
              >
                <span className="text-xl font-extrabold text-emerald-600">
                  {formatCurrency(totalLucro)}
                </span>
              </Badge>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
