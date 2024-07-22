// Biblioteca
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";

// React
import { MutableRefObject, RefObject } from "react";

// Tipagem
type ItemsCollumns = {
    name: string;
    uid: string;
}

interface TableGrid<T> {
    collumns: ItemsCollumns[];
    data: T[];
    detail?: (value: string) => void;
    renderCell: (item: T, columnUid: string) => React.ReactNode;
    ref?: RefObject<HTMLTableElement> | MutableRefObject<HTMLTableElement | null>
}

export default function TableGrid<T>({ collumns, data, renderCell, detail, ref }: TableGrid<T>) {

    return (
        <Table id="content" isHeaderSticky removeWrapper isStriped={true} classNames={{ th: "bg-[#fa6602] text-white", table: "", thead: "", tr: "cursor-pointer hover:bg-gray-200 text-lg hover:scale-[1.01]" }} aria-label="Example empty table">
            <TableHeader>
                {collumns.map((column) =>
                    <TableColumn key={column.uid}>{column.name}</TableColumn>
                )}
            </TableHeader>
            <TableBody emptyContent={"Nenhum dados foi encontrado :( "} items={data}>
                {(item) => (
                    <TableRow key={(item as any).ID_SDS}>
                        {collumns.map((column) => (
                            <TableCell onClick={() => detail && detail((item as any).ID_SDS)} key={column.uid}>
                                {renderCell(item, column.uid)}
                            </TableCell>
                        ))}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}