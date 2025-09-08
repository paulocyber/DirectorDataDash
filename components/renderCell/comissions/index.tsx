// Tipagem
import { ItemsComissionData } from "@/types/comission";

// Utils
import { convertMaskPercent } from "@/utils/mask/formatPercent";

// Biblioteca
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

// Tipagem
interface RenderCellProps {
  item: ItemsComissionData;
  columnKey: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const RenderCell = ({
  item,
  columnKey,
  onEdit,
  onDelete,
}: RenderCellProps) => {
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
          {convertMaskPercent(item.commissionPercentage.toString())}
        </span>
      );
    case "valorPorVenda":
      return (
        <span className="text-gray-600">
          {convertMaskPercent(item.valuePerSale.toString())}
        </span>
      );
    case "valorDeVenda":
      return (
        <span className="text-gray-600">
          {convertMaskPercent(item.saleValue.toString())}
        </span>
      );
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

    case "acoes":
      return (
        <div className="">
          <button
            onClick={() => onEdit && onEdit(item.id)}
            className="p-1 text-blue-600  hover:text-blue-800 cursor-pointer"
            title="Editar"
          >
            <FaPencilAlt size={18} />
          </button>
          <button
            onClick={() => onDelete && onDelete(item.id)}
            className="p-1 text-red-600 hover:text-red-800"
            title="Excluir"
          >
            <FaTrashAlt size={18} />
          </button>
        </div>
      );
  }
};
