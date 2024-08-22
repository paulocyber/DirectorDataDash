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
    title: string;
    displayCalendar?: boolean;
    displayInputSearch?: boolean;
    descriptionHref?: string;
    href?: string;
    collumns: ItemsCollumns[]
    data: T[];
    loading: boolean;
    dateRange?: RangeValue<DateValue>;
    setFilterSearch?: (value: string) => void
    searchFilter?: string;
    handleDateRangePicker?: (date: RangeValue<DateValue>) => void;
    renderCell: (item: T, columnUid: string) => React.ReactNode;
    detail?: (value: string) => void;
    handleRefreshClick: () => void;
    handleCleanFilter?: () => void;
    generatePDF?: () => void;
}

export default function ContainerTable<T>({ title, displayCalendar, collumns, data, renderCell, detail, handleRefreshClick, loading, descriptionHref, href, dateRange, handleDateRangePicker, displayInputSearch, setFilterSearch, searchFilter, handleCleanFilter, generatePDF }: ContainerTableProps<T>) {
    const [limit, setLimit] = useState(0)

    const fetchMore = () => {
        if (limit < data.length) {
            setLimit(limit + 10);
        }
    };

    return (
        <>
            <ToolBar
                title={title}
                displayCalendar={displayCalendar}
                handleRefreshClick={handleRefreshClick}
                href={href}
                descriptionHref={descriptionHref}
                dateRange={dateRange}
                handleDateRangePicker={handleDateRangePicker}
                displayInputSearch={displayInputSearch}
                setFilterSearch={setFilterSearch}
                searchFilter={searchFilter}
                handleCleanFilter={handleCleanFilter}
                generatePDF={generatePDF}
            />
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