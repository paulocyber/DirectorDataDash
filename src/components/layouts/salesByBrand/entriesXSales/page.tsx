'use client'

// Componentes
import Container from "@/components/ui/container"
import ToolBar from "@/components/ui/toolbar"
import { renderCell } from "@/components/cells/entriesXSales"
import Table from "@/components/ui/table"
import InfoCard from "@/components/ui/InfoCard"

// Biblioteca
import { CgShoppingCart } from "react-icons/cg"
import { FaDollarSign } from "react-icons/fa"
import { BiTrendingUp } from "react-icons/bi"

// Dados
import columns from "@/data/columns/entriesXSales/columns.json"

// Tipagem
import { EntriesXSales } from "@/types/entriesXSales"
interface LayoutEntriesXSalesProps {
    entriesSalesData: EntriesXSales[]
}

export default function LayoutEntriesXSalesPage({ entriesSalesData }: LayoutEntriesXSalesProps) {
    const fakeInfoCardData = [
        {
            icon: <CgShoppingCart />,
            title: "Total Purchase",
            value: "75000"
        },
        {
            icon: <FaDollarSign />,
            title: "Total Sales",
            value: "150000"
        },
        {
            icon: <BiTrendingUp />,
            title: "Total Cost",
            value: "500000"
        }
    ];


    return (
        <div className="flex flex-col">
            <InfoCard data={fakeInfoCardData} />
            <Container>
                <ToolBar
                    title="Entrada X Saída"
                    handleRefreshClick={() => console.log("Ativou  ")}
                    handleCleanFilter={() => console.log("Ativou")}
                />
                <Table data={entriesSalesData} columns={columns} renderCell={renderCell} loading={false} />
            </Container>
        </div>
    )
}   