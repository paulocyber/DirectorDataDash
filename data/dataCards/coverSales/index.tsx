// Utils
import { sumValuesByKey } from "@/utils/functions/sumValues";
import { formatCurrency } from "@/utils/mask/money";

// Bibliotecas
import { FaHandshake, FaStore, FaUsers, FaUserSlash } from "react-icons/fa";

// Tipagem
import { ItemsDavData } from "@/types/davs";
interface CoverSalesProps {
  coverSales: ItemsDavData[];
}

export default function CoverSalesInfoCard({ coverSales }: CoverSalesProps) {
  const filterByCurveA = coverSales.filter((item) =>
    item.NOME_CLIENTE_SDS.startsWith("A-")
  );
  const filterByCurveB = coverSales.filter((item) =>
    item.NOME_CLIENTE_SDS.startsWith("B-")
  );
  const filterByCurveNull = coverSales.filter(
    (item) => item.NOME_CLIENTE_SDS === ""
  );

  const directSales = sumValuesByKey(
    filterByCurveA,
    (item) => item.VALOR_LIQUIDO_SDS
  );
  const salesBySeller = sumValuesByKey(
    filterByCurveB,
    (item) => item.VALOR_LIQUIDO_SDS
  );
  const salesWithoutRegistration = sumValuesByKey(
    filterByCurveNull,
    (item) => item.VALOR_LIQUIDO_SDS
  );

  const infoDetailCard = [
    {
      icon: <FaStore className="w-5 h-5 text-white" />,
      title: "Loja: Venda Direta",
      value: formatCurrency(directSales),
      amount: `${filterByCurveA.length}`,
    },
    {
      icon: <FaHandshake className="w-5 h-5 text-white" />,
      title: "Via Vendedor",
      value: formatCurrency(salesBySeller),
      amount: `${filterByCurveB.length}`,
    },
    {
      icon: <FaUserSlash className="w-5 h-5 text-white" />,
      title: "Sem Cadastro",
      value: formatCurrency(salesWithoutRegistration),
      amount: `${filterByCurveNull.length}`,
    },
  ];

  return infoDetailCard;
}
