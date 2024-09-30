'use client'

// React
import { useState } from "react";

// Biblioteca
import { TableBody, TableCell, TableColumn, TableHeader, TableRow, Table as TableUi } from "@nextui-org/react";

// Utils
import { InfiniteScroll } from "@/utils/InfiniteScroll";

// Componentes
import Loading from "../loading";

// Tipagem
type ItemsCollumns = {
    name: string;
    uid: string;
}

interface ContainerTableProps<T> {
    collumns: ItemsCollumns[];
    data: T[];
    loading: boolean;
    detail?: (value: string) => void;
    renderCell: (item: T, columnUid: string) => React.ReactNode;
}

export default function Table<T>({ collumns, data, loading, renderCell, detail }: ContainerTableProps<T>) {
    const [limit, setLimit] = useState(0)

    const fetchMore = () => {
        if (limit < data.length) {
            setLimit(limit + 10);
        }
    };

    const dataLimit = data.slice(0, limit)

    if (loading) {
        return (
            <main className="flex w-full pb-6 h-[450px] flex-col px-5">
                <div className="flex h-full w-full justify-center items-center">
                    <Loading />
                </div>
            </main>
        )
    }

    return (
        <main className="flex overflow-y-auto overflow-x-hidden h-[420px] w-full pb-8 flex-col px-5">
            <div className="px-4">
                <TableUi 
                    id="content" 
                    isHeaderSticky 
                    removeWrapper 
                    classNames={{ 
                        th: "bg-[#fa6602] text-white text-sm ", 
                        table: "rounded-lg", 
                        thead: "", 
                        tr: "cursor-pointer hover:bg-gray-200 border-b-2 transition duration-200 ease-in-out", 
                        tbody: "" 
                    }} 
                    aria-label="Table"
                >
                    <TableHeader>
                        {collumns.map((column) =>
                            <TableColumn key={column.uid} className="text-center font-semibold">{column.name}</TableColumn>
                        )}
                    </TableHeader>
                    <TableBody emptyContent={"Nenhum dado foi encontrado 😞 "} items={dataLimit}>
                        {(item) => (
                            <TableRow key={(item as any).ID_SDS} className="border-b">
                                {collumns.map((column) => (
                                    <TableCell 
                                        onClick={() => detail && detail((item as any).ID_SDS)} 
                                        key={column.uid} 
                                        className="py-4 px-2 text-center hover:bg-gray-100 transition duration-150 ease-in-out"
                                    >
                                        {renderCell(item, column.uid)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        )}
                    </TableBody>
                </TableUi>
            </div>
            <InfiniteScroll fetchMore={fetchMore} />
        </main>
    )
}