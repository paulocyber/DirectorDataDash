// Componentes
import Loading from "../../loading";
import Table from "../../table";
import ToolBar from "../../toolbar";

// Utils
import { InfiniteScroll } from "@/utils/InfiniteScroll";

// React
import { ReactNode, useState } from "react";

// Tipagem
import { DateValue, RangeValue } from "@nextui-org/react";
type ItemsCollumns = {
    name: string;
    uid: string;
}

interface ContainerTableProps<T> {
    collumns: ItemsCollumns[];
    data: T[];
    loading: boolean;
    renderCell: (item: T, columnUid: string) => React.ReactNode;
    detail?: (value: string) => void;
}

export default function ContainerTable<T>({ collumns, data, loading, renderCell, detail }: ContainerTableProps<T>) {
    const [limit, setLimit] = useState(0)

    const fetchMore = () => {
        if (limit < data.length) {
            setLimit(limit + 10);
        }
    };

    return (
        <>
            <main className="flex w-full pb-6 h-[450px] flex-col px-5">
                {
                    loading
                        ?
                        <div className="flex h-full w-full justify-center items-center">
                            <Loading />
                        </div>
                        :
                        <div className="overflow-auto">
                            <Table collumns={collumns} data={data.slice(0, limit)} renderCell={renderCell} detail={detail} />
                            <InfiniteScroll fetchMore={fetchMore} />
                        </div>
                }
            </main>
        </>
    )
}