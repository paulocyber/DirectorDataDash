// Framework - Servidor
import { setupApiClient } from "@/service/api/api";
import { canSSRAuth } from "../permissions/canSSRAuth";

// Utils
import getDate from "../date/currentDate";
import { SalesByBrand } from "../queries/salesByBrand";
import { Stock } from "../queries/stock";
import { groupSumByBrand } from "../filters/salesByBrand/groupSumByBrand";
import { groupSumByStock } from "../filters/stock/groupSumByStock";
import { billsToPayQueries } from "../queries/billstoPay";
import { groupSumBySupplier } from "../filters/billsToPay/groupSumBySupplier";
import { BillsToPayItem } from "../types/billsToPay";

export const getSalesByBrandPageProps = canSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);
  const { today, year } = getDate();

  const playCell = SalesByBrand({ dateInit: today, dateEnd: today, emp: "1" });
  const playCustom = SalesByBrand({
    dateInit: today,
    dateEnd: today,
    emp: "2",
  });
  const playUp = SalesByBrand({ dateInit: today, dateEnd: today, emp: "3" });
  const { stockByBrand } = Stock();
  const { openBillFromSuppliers } = billsToPayQueries({ year });

  const [
    respSalesPlayCell,
    respSalesPlayCustom,
    respSalesPlayUp,
    respStock,
    respDebt,
  ] = await Promise.all([
    apiClient.post("/v1/find-db-query", { query: playCell }),
    apiClient.post("/v1/find-db-query", { query: playCustom }),
    apiClient.post("/v1/find-db-query", { query: playUp }),
    apiClient.post("/v1/find-db-query", { query: stockByBrand }),
    apiClient.post("/v1/find-db-query", { query: openBillFromSuppliers }),
  ]);

  const combinedSalesData = [
    ...respSalesPlayCell.data.returnObject.body,
    ...respSalesPlayCustom.data.returnObject.body,
    ...respSalesPlayUp.data.returnObject.body,
  ];

  const sumByBrand = groupSumByBrand(combinedSalesData);
  const sumOfStockByBrand = groupSumByStock(
    respStock.data.returnObject.body,
    "brand"
  );
  const sumOfDebt: BillsToPayItem[] = respDebt.data.returnObject.body;

  const listStockByBrand = sumOfStockByBrand.map((stock) => {
    const groupedData = sumOfDebt.find((debt) => debt.APELIDO_PSS === stock.key);
    return {
      brand: stock.key,
      valueInStock: stock.value,
      debtValue: groupedData ? parseFloat(groupedData.VALOR_PGM.replace(',', '.')) : 0,
    };
  });
  
  return {
    props: {
      listSalesByBrand: sumByBrand,
      listStockByBrand: listStockByBrand,
    },
  };
});
