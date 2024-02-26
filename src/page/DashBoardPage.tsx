// Componentes
import DasBoardHome from "../components/DasBoardHome";
import FilterDate from "../components/FilterDate";
import InfoCardDasboard from "../components/InfoCardDisplay";

// Bibliotecas

import { useState } from "react";

const DashBoardPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const dateFormated = selectedDate && selectedDate.toLocaleDateString("en-US");

  return (
    <>
      <InfoCardDasboard />
      <DasBoardHome />
    </>
  );
};

export default DashBoardPage;
