// Componentes
import DasBoardHome from "../components/DasBoardHome";
import InfoCardDisplay from "../components/InfoCardDisplay"

// Bibliotecas


const DashBoard = () => {


    return (
        <main className="bg-gray-100 flex flex-col w-full h-[100vh] md:overflow-hidden overflow-auto">
            <InfoCardDisplay />
            <DasBoardHome />
        </main>
    )
}

export default DashBoard