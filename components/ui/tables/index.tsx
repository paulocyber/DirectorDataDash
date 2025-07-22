"use client";

// React
import { useState } from "react";

// Biblioteca
import {
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Table as TableUi,
} from "@heroui/react";

// Utils
import { InfiniteScroll } from "@/utils/InfiniteScroll";

// Componentes
import Loading from "../loading";

// Tipagem
type Itemscolumns = {
  name: string;
  uid: string;
};

interface ContainerTableProps<T> {
  columns: Itemscolumns[];
  data: T[];
  loading: boolean;
  detail?: (idOrigem: string, idPss?: string) => void;
  renderCell: (item: T, columnUid: string) => React.ReactNode;
}

export default function Table<T>({
  columns,
  data,
  loading,
  renderCell,
  detail,
}: ContainerTableProps<T>) {
  const [limit, setLimit] = useState(0);

  const fetchMore = () => {
    if (limit < data.length) {
      setLimit(limit + 10);
    }
  };

  const dataLimit = data.slice(0, limit);

  if (loading) {
    return (
      <main className="flex w-full h-[450px] justify-center items-center">
        <Loading />
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full pb-8">
      <div className="relative px-4 lg:overflow-y-auto overflow-auto max-h-[520px] h-full">
        <TableUi
          id="content"
          isHeaderSticky
          removeWrapper
          classNames={{
            wrapper: "bg-white rounded-lg shadow-lg overflow-hidden",
            th: "bg-gradient-to-b from-orange-400 to-orange-600 text-white font-bold text-sm uppercase tracking-wide text-center px-4 py-3",
            thead: "",
            tr: `hover:bg-gray-50 transition duration-150 ease-in-out ${detail && "cursor-pointer"}`,
            tbody: "bg-white",
          }}
          aria-label="Table"
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn
                key={column.uid}
                className="text-center font-semibold"
              >
                {column.name}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody
            emptyContent="Nenhum dado foi encontrado 😞 "
            items={dataLimit.map((item, index) => ({
              ...item,
              uniqueKey: `${(item as any).ID_SDS}-${index}`, // Gera uma chave única
            }))}
          >
            {(item) => (
              <TableRow
                key={(item as any).uniqueKey}
                className="hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
              >
                {columns.map((column) => (
                  <TableCell
                    onClick={() => {
                      const idOrigem = (item as any).ID_SDS;
                      const idPss = (item as any).ID_PSS;
                      detail && detail(idOrigem, idPss);
                    }}
                    key={`${(item as any).ID_SDS}-${column.uid}`}
                    className="text-center text-sm text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out px-4"
                  >
                    <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {renderCell(item, column.uid)}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </TableUi>{" "}
        <InfiniteScroll fetchMore={fetchMore} />
      </div>
    </main>
  );
}
