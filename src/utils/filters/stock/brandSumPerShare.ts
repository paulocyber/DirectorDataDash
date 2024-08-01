import { Stock } from "@/utils/types/stock";

export function groupSumByStock(data: Stock[]): { brand: string; value: number }[] {
    const groupedData = data.reduce((acc: Record<string, { brand: string; value: number }>, stock) => {
        if (!acc[stock.ID_MARCA]) {
          acc[stock.ID_MARCA] = {
            brand: stock.MARCA,
            value: 0
          };
        }// preço de custo + qtde stock
        acc[stock.ID_MARCA].value += parseFloat(stock.TOTAL_VALOR_COMPRA.toString()); 
        return acc;
      }, {}); // Inicializa o acumulador como um objeto vazio
    
      return Object.values(groupedData);
}