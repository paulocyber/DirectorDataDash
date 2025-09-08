// Bibliotecas
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

// Tipagem
import { ItemsSellers } from "@/types/sellers";
interface RenderCellProps {
  item: ItemsSellers;
  columnKey: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function RenderCell({
  item,
  columnKey,
  onEdit,
  onDelete,
}: RenderCellProps) {
  switch (columnKey) {
    case "nome":
      return (
        <span className="text-gray-600">
          {item.externalId} - {item.name}
        </span>
      );
    case "email":
      return <span className="text-gray-600">{item.email}</span>;
    case "telefone":
      return <span className="text-gray-600">{item.phone}</span>;
    case "cpf":
      return <span className="text-gray-600">{item.cpf}</span>;
    case "acoes":
      return (
        <div className="">
          <button
            onClick={() => onEdit && onEdit(item.id)}
            className="p-1 text-blue-600 hover:text-blue-800"
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
}
