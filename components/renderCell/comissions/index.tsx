// Tipagem
import { ItemsComissionData } from "@/types/comission";

export const renderCell = (item: ItemsComissionData, columnKey: string) => {
  switch (columnKey) {
    case "vendedor":
      return (
        <span className="text-gray-600">
          {item.seller.externalId} - {item.seller.name}
        </span>
      );
    case "metodoPagamento":
      return (
        <span className="text-gray-600">
          {item.paymentMethodExternalId} - {item.paymentMethod}
        </span>
      );
    case "porcentagemComissão":
      return (
        <span className="text-gray-600 font-semibold">
          {item.commissionPercentage}
        </span>
      );
    case "valorVenda":
      return <span className="text-gray-600">{item.valuePerSale}</span>;
    case "cliente":
      return (
        <span className="text-gray-600">
          {item.clientExternalId} - {item.client}
        </span>
      );
    case "cliente":
      return (
        <span className="text-gray-600">
          {item.clientExternalId} - {item.client}
        </span>
      );
  }
};
