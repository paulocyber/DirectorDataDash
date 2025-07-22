// Next
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Utils
import { setupApiClient } from "@/utils/fetchs/api";
import getCurrentDateDetails from "@/utils/getDate";
import { SalesQueries } from "@/utils/querys/sales";
import { StockQueries } from "@/utils/querys/stocks";
import { billsToPayQueries } from "@/utils/querys/billsToPay";
import { groupBySum } from "@/utils/filters/groupBySum";
import { suppliersQueries } from "@/utils/querys/suppliers";

// Componentes

// Dados
import { redirectMap } from "@/data/rulesByUsers";
import LayoutSalesByBrand from "@/components/pagesTemplates/salesByBrand";

export default async function SalesByBrand() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("@nextauth.token")?.value;
  const role = (await cookieStore).get("@nextauth.role")?.value || "";
  const api = setupApiClient(token as string);

  if (
    role !== "admin" &&
    role !== "diretoria" &&
    role !== "financeiro" &&
    role !== "estoque" &&
    Object.prototype.hasOwnProperty.call(redirectMap, role)
  ) {
    return redirect(redirectMap[role]);
  }

  const { today, year } = getCurrentDateDetails();

  const { SalesByBrand: playcell } = SalesQueries({
    dateInit: today,
    dateEnd: today,
    companys: ["1"],
    brands: ["PEINING", "KIMASTER", "B-MAX", "INOVA", "DEVIA", "HREBOS"],
  });
  const { SalesByBrand: playCustom } = SalesQueries({
    dateInit: today,
    dateEnd: today,
    companys: ["2"],
    brands: ["PEINING", "KIMASTER", "B-MAX", "INOVA", "DEVIA", "HREBOS"],
  });
  const { SalesByBrand: playUp } = SalesQueries({
    dateInit: today,
    dateEnd: today,
    companys: ["3"],
    brands: ["PEINING", "KIMASTER", "B-MAX", "INOVA", "DEVIA", "HREBOS"],
  });
  const { SalesByBrand: playCovers } = SalesQueries({
    dateInit: today,
    dateEnd: today,
    companys: ["4"],
    brands: ["PEINING", "KIMASTER", "B-MAX", "INOVA", "DEVIA", "HREBOS"],
  });
  const { stockByBrand } = StockQueries({
    dateInit: "",
    dateEnd: "",
    brands: ["PEINING", "KIMASTER", "B-MAX", "INOVA", "DEVIA", "HREBOS"],
  });
  const { debtBySuppliers } = billsToPayQueries({
    year,
    brands: [
      "BASIC INOVA",
      "INOVA HENRIQUE",
      "INOVA COMPRA DE MERCADORIA",
      "ITO INOVA",
      "LEANDRO INOVA",
      "MIA",
      "TOMY INOVA",
      "KIMASTER",
      "PEINING",
      "DEVIA",
      "B-MAX",
      "INOVA",
    ],
  });
  const { buyBySuppliers } = billsToPayQueries({
    dateInit: today,
    dateEnd: today,
    brands: [
      "BASIC INOVA",
      "INOVA HENRIQUE",
      "INOVA COMPRA DE MERCADORIA",
      "ITO INOVA",
      "LEANDRO INOVA",
      "MIA",
      "TOMY INOVA",
      "KIMASTER",
      "PEINING",
      "DEVIA",
      "B-MAX",
      "INOVA",
    ],
  });
  const suppliers = suppliersQueries();

  const [
    responsePlayCell,
    responsePlayCustom,
    responsePlayUp,
    responsePlayCovers,
    responseStock,
    responseDebt,
    responseBuy,
    responseSuppliers,
  ] = await Promise.all([
    api.post("/v1/find-db-query", { query: playcell }),
    api.post("/v1/find-db-query", { query: playCustom }),
    api.post("/v1/find-db-query", { query: playUp }),
    api.post("/v1/find-db-query", { query: playCovers }),
    api.post("/v1/find-db-query", { query: stockByBrand }),
    api.post("/v1/find-db-query", { query: debtBySuppliers }),
    api.post("/v1/find-db-query", { query: buyBySuppliers }),
    api.post("/v1/find-db-query", { query: suppliers }),
  ]);

  const salesData = [
    ...responsePlayCell.data.returnObject.body,
    ...responsePlayCustom.data.returnObject.body,
    ...responsePlayUp.data.returnObject.body,
    ...responsePlayCovers.data.returnObject.body,
  ];

  const aggregatedSalesByBrand = groupBySum(salesData, {
    key: "MARCAS",
    labelKey: "MARCAS",
    valueKey: "VALOR_BRUTO_SDI",
  }).sort((a, b) => b.value - a.value);

  const aggregatedStockByBrand = groupBySum(
    responseStock.data.returnObject.body,
    {
      key: "MARCA",
      labelKey: "MARCAS",
      valueKey: "TOTAL_VALOR_COMPRA",
    }
  ).sort((a, b) => b.value - a.value);

  const salesAndBuy = aggregatedSalesByBrand
    .map((sales) => {
      const match = responseBuy.data.returnObject.body.find(
        (buy: any) => buy.APELIDO_PSS === sales.MARCAS
      );

      return {
        MARCAS: sales.MARCAS,
        VALOR_ESTOQUE: sales.value,
        VALOR_DEBITO: match ? parseFloat(match.VALOR_PGM.replace(",", ".")) : 0,
      };
    })
    .sort((a, b) => b.VALOR_ESTOQUE - a.VALOR_ESTOQUE);

  const debtAndStock = aggregatedStockByBrand.map((stock) => {
    const match = responseDebt.data.returnObject.body.find(
      (debt: any) => debt.APELIDO_PSS === stock.MARCAS
    );

    return {
      MARCAS: stock.MARCAS,
      VALOR_ESTOQUE: stock.value,
      VALOR_DIVIDA: match ? parseFloat(match.VALOR_PGM.replace(",", ".")) : 0,
    };
  });

  return (
    <LayoutSalesByBrand
      salesAndBuyData={salesAndBuy}
      debtAndStockData={debtAndStock}
      suppliersData={responseSuppliers.data.returnObject.body}
    />
  );
}
