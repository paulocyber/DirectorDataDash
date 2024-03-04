import React from "react";

// Mascara
import { formatDate } from "../../utils/ApplyMask";

interface Column {
  id: number;
  headerName: string;
}
interface DavData {
  "Dv.Number": string;
  Customer: string;
  Attendant: string;
  "Date.Attendance": string;
  "Dv.Value": number;
  Seller: string;
}
interface TableDavsProps {
  columns: Column[];
  data: DavData[];
}

const TableDavs: React.FC<TableDavsProps> = ({ columns, data }) => {
  return (
    <div className="flex w-full pb-6 h-[450px] flex-col">
      <div className="px-4 overflow-auto rounded-[24px]">
        <table className="min-w-full divide-y ">
          <thead className="bg-[#fa6602] sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  {column.headerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300 dark:divide-gray-300 text-gray-500 dark:text-gray-800">
            {data.map((dav, index) => (
              <tr key={index}>
                <td className="px-4 py-4 text-sm whitespace-nowrap">
                  <h2 className="text-sm font-medium text-gray-800">
                    {dav["Dv.Number"]}
                  </h2>
                </td>

                <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-900 whitespace-nowrap">
                  {dav.Customer}
                </td>

                <td className="px-4 py-4 text-sm whitespace-nowrap">
                  {dav.Attendant}
                </td>

                <td className="px-4 py-4 text-sm whitespace-nowrap">
                  {dav.Seller}
                </td>
                <td className="text-sm whitespace-nowrap">
                  {formatDate(dav["Date.Attendance"])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableDavs;
