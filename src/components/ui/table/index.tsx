'use client'

// React
import { useState } from "react";

// Biblioteca
import { TableBody, TableCell, TableColumn, TableHeader, TableRow, Table as TableUi } from "@nextui-org/react";

// Utils
import { InfiniteScroll } from './../../../utils/infiniteScroll/index';

// Componentes
import Loading from "../loading";

// Tipagem
type Itemscolumns = {
    name: string;
    uid: string;
}

interface ContainerTableProps<T> {
    columns: Itemscolumns[];
    data: T[];
    loading: boolean;
    detail?: (idOrigem: string, idPss?: string) => void;
    renderCell: (item: T, columnUid: string) => React.ReactNode;
}

export default function Table<T>({ columns, data, loading, renderCell, detail }: ContainerTableProps<T>) {
    const [limit, setLimit] = useState(0)

    const fetchMore = () => {
        if (limit < data.length) {
            setLimit(limit + 10);
        }
    };

    const dataLimit = data.slice(0, limit)

    if (loading) {
        return (
            <main className="flex w-full h-[450px] justify-center items-center">
                <Loading />
            </main>
        );
    }

    return (
        <main className="flex flex-col w-full px-4 pb-8">
            <div className="relative px-4 lg:overflow-y-auto overflow-auto max-h-[420px] h-full">
                <TableUi
                    id="content"
                    isHeaderSticky
                    removeWrapper
                    classNames={{
                        wrapper: "border-none",
                        th: "bg-[#fa6602] text-white font-bold text-sm capitalize text-center",
                        thead: "border-none",
                        tr: `hover:bg-gray-100 transition duration-150 ease-in-out ${detail && 'cursor-pointer'}`,
                        tbody: "text-gray-700",
                    }}
                    aria-label="Table"
                >
                    <TableHeader>
                        {columns.map((column) =>
                            <TableColumn key={column.uid} className="text-center font-semibold">{column.name}</TableColumn>
                        )}
                    </TableHeader>
                    <TableBody
                        emptyContent={"Nenhum dado foi encontrado 😞 "}
                        items={dataLimit.map((item, index) => ({
                            ...item,
                            uniqueKey: `${(item as any).ID_SDS}-${index}`, // Combina ID_SDS com índice
                        }))}
                    >
                        {(item) => (
                            <TableRow
                                key={(item as any).uniqueKey} // Usa o uniqueKey gerado no map
                                className="hover:bg-gray-50 border-b last:border-b-0"
                            >
                                {columns.map((column) => (
                                    <TableCell
                                        onClick={() => {
                                            const idOrigem = (item as any).ID_SDS;
                                            const idPss = (item as any).ID_PSS;

                                            detail && detail(idOrigem, idPss);
                                        }}
                                        key={`${(item as any).ID_SDS}-${column.uid}`} // Garante unicidade
                                        className="text-center text-sm text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out"
                                    >
                                        <div className="whitespace-nowrap overflow-hidden overflow-ellipsis truncate lg:w-full">
                                            {renderCell(item, column.uid)}
                                        </div>
                                    </TableCell>
                                ))}
                            </TableRow>
                        )}
                    </TableBody>

                </TableUi>
                <InfiniteScroll fetchMore={fetchMore} />
            </div>
        </main>
    )
}