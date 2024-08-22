import { BillsToPayItem } from "@/utils/types/billsToPay";

export function groupSumBySupplier(
  data: BillsToPayItem[]
): { supplier: string; value: number }[] {
  const groupedData = data.reduce(
    (acc: Record<string, { supplier: string; value: number }>, billet) => {
      if (!acc[billet.APELIDO_PSS]) {
        acc[billet.APELIDO_PSS] = {
          supplier: billet.APELIDO_PSS,
          value: 0,
        };
      }
      acc[billet.APELIDO_PSS].value += parseFloat(billet.VALOR_PGM.toString());
      return acc;
    },
    {}
  );

  return Object.values(groupedData);
}
