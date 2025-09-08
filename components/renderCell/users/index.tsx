// Tipagem
import { ItemsUsers } from "@/types/users";

// Bibliotecas
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

// Tipagem
interface RenderCellProps {
  item: ItemsUsers;
  columnKey: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function RenderCell({
  item,
  columnKey,
  onEdit,
  onDelete,
}: RenderCellProps) {
  switch (columnKey) {
    case "#":
      return <span className="text-gray-600">{item.id}</span>;
    case "nome":
      return <span className="text-gray-600">{item.username}</span>;
    case "regra":
      return <span className="text-gray-600">{item.role}</span>;
    case "ativo":
      return (
        <span className="text-gray-600">{item.ativo ? "sim" : "não"}</span>
      );
    case "criado_em":
      const date = new Date(item.atualizado_em);
      return (
        <span className="text-gray-600">
          {date.toLocaleDateString("pt-BR")}
        </span>
      );
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

    default:
      null;
  }
}
