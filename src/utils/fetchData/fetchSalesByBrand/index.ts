// Services
import { setupApiClient } from "@/service/api/api";

// Utils
import { groupSumByBrand } from "@/utils/filters/salesByBrand/groupSumByBrand";
import { groupSumByStock } from "@/utils/filters/stock/groupSumByStock";
import { billsToPayQueries } from "@/utils/queries/billstoPay";
import { SalesByBrand } from "@/utils/queries/salesByBrand";
import { Stock } from "@/utils/queries/stock";
import getDate from "@/utils/date/currentDate";
import { groupSumBySupplier } from "@/utils/filters/billsToPay/groupSumBySupplier";

// Tipagem
import { SalesByBrandType } from "@/utils/types/SalesByBrand";
import { StockByBrand } from "@/utils/types/stock";
import { BillsToPayItem } from "@/utils/types/billsToPay";
interface FetchSalesByBrandProps {
  dateInit: string;
  dateEnd: string;
  setLoading: (value: boolean) => void;
  setSalesByBrand: (sales: SalesByBrandType[]) => void;
  setStockByBrand: (sales: StockByBrand[]) => void;
}

export async function fetchSalesByBrand({
  setLoading,
  setSalesByBrand,
  setStockByBrand,
  dateInit,
  dateEnd,
}: FetchSalesByBrandProps) {
  const apiClient = setupApiClient();

  const { year } = getDate();

  setLoading(true);

  const playCell = SalesByBrand({ dateInit, dateEnd, emp: "1" });
  const playCustom = SalesByBrand({ dateInit, dateEnd, emp: "2" });
  const playUp = SalesByBrand({ dateInit, dateEnd, emp: "3" });
  const { stockByBrand } = Stock();
  const { openBillFromSuppliers } = billsToPayQueries({ year });

  const [respSalesPlayCell, respSalesPlayCustom, respSalesPlayUp, respStock, respDebt] =
    await Promise.all([
      apiClient.post("/v1/find-db-query", { query: playCell }),
      apiClient.post("/v1/find-db-query", { query: playCustom }),
      apiClient.post("/v1/find-db-query", { query: playUp }),
      apiClient.post("/v1/find-db-query", { query: stockByBrand }),
      apiClient.post("/v1/find-db-query", { query: openBillFromSuppliers })
    ]);

  const combinedSalesData = [
    ...respSalesPlayCell.data.returnObject.body,
    ...respSalesPlayCustom.data.returnObject.body,
    ...respSalesPlayUp.data.returnObject.body,
  ];

  const sumByBrand = groupSumByBrand(combinedSalesData);
  const sumOfStockByBrand = groupSumByStock(respStock.data.returnObject.body);
  const sumOfDebt: BillsToPayItem[] = respDebt.data.returnObject.body;

  const listStockByBrand = sumOfStockByBrand.map((stock) => {
    const groupedData = sumOfDebt.find((debt) => debt.APELIDO_PSS === stock.key);
    return {
      brand: stock.key,
      valueInStock: stock.value,
      debtValue: groupedData ? parseFloat(groupedData.VALOR_PGM.replace(',', '.')) : 0,
    };
  });

  setSalesByBrand(sumByBrand);
  setStockByBrand(listStockByBrand);

  setLoading(false);
}
