// React
import React from "react";

// Bibliotecas
import { TooltipProps } from "recharts";

// Utils
import { formatCurrency } from "@/utils/mask/money";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

// Tipagem
interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  dataKey: string;
  valueKey?: string;
  payload?: any[];
}

export const Tooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  dataKey,
  valueKey,
}) => {
  if (active && payload && payload.length > 0) {
    const item = payload[0].payload[dataKey];
    const value = valueKey ? payload[0].payload[valueKey] : undefined;
    const isArray = Array.isArray(item);

    return (
      <div className="bg-white md:w-full w-48 mb-4 border rounded-md p-4 shadow-lg">
        {isArray ? (
          item.map((i: any, idx: number) => (
            <p key={idx} className="text-xs font-medium text-gray-700">
              {i}
            </p>
          ))
        ) : (
          <p className="text-xs truncate font-medium text-gray-700">
            {item ?? "Sem dados disponíveis"}
          </p>
        )}
        <p
          className={`text-lg font-bold ${
            item === "Valor em atraso" ? "text-red-500" : "text-emerald-500"
          } mt-2`}
        >
          {value !== undefined ? formatCurrency(value) : ""}
        </p>
      </div>
    );
  }
  return null;
};
