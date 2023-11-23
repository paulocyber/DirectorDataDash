// Componentes
import DasBoardStock from "../components/DasBoardStock"
import InfoCardStock from "../components/InfoCardStock"

const StockProducts = () => {
    return (
        <main className="bg-gray-100 flex flex-col w-full h-[100vh] md:overflow-hidden overflow-auto">
            <InfoCardStock />
            <DasBoardStock />
        </main>
    )
}

export default StockProducts