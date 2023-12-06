// Componentes
import DasBoardHome from "../components/DasBoardHome";
import FilterDate from "../components/FilterDate";
import InfoCardDasboard from "../components/InfoCardDisplay";


// Bibliotecas

import { useState } from "react";

const DashBoard = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const dateFormated = selectedDate && selectedDate.toLocaleDateString('en-US')

    return (
        <>
            <InfoCardDasboard />
            <FilterDate selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <DasBoardHome dateFormated={dateFormated} />
        </>
    )
}

export default DashBoard