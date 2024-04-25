// Componentes
import PieChartComponent from "../Sciences/PieChartComponent";
import BarChartComponent from "../Sciences/BarChartComponent";
import DescriptionsGraphic from "../Sciences/DescriptionsGraphic";

// Dados
import { CostCenterSummary } from "../../utils/CostCenterSum";

const AccountsPayableChart = () => {
  const { topCostCenters, topCostCenterDescriptions } = CostCenterSummary()

  return (
    <>
      <div className="flex w-full">
        <div className="p-4 md:w-1/2 h-[400px]">
          <PieChartComponent data={topCostCenters} />
        </div>
        <div className="p-4 md:w-1/2 h-[400px]">
          <BarChartComponent data={topCostCenters} />
        </div>

      </div>

      <div>
        <DescriptionsGraphic data={topCostCenterDescriptions} />
      </div>
    </>
  );
};

export default AccountsPayableChart;
