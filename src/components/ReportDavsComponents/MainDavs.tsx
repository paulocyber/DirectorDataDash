import React from "react";

// Componentes
import TableDavs from "../table/TableDavs";

// Dados
import davJson from "./../../data/Dav.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

// Tipagem
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
  Seller: string
}

const MainDavs = () => {
  const columns: Column[] = [
    { id: 1, headerName: "Número DAV" },
    { id: 2, headerName: "Cliente" },
    { id: 3, headerName: "Vendedor" },
    { id: 4, headerName: "Atendente" },
    { id: 5, headerName: "Data" },
  ];

  return (
    <div className="col-span-12 md:pb-0 mb-[4em] w-full">
      <div className="grid gap-1 grid-cols-1 lg:grid-cols-1 px-5">
        <div className="bg-white shadow-lg rounded-xl p-5">
          <div className="flex items-center justify-between w-full mb-5">
            <div className="p-1 pb-5">
              <h1 className="font-bold md:text-lg text-sm">Relatório mensal</h1>
            </div>
            <div className="relative flex">
              <button className="inline-flex mx-8 justify-center items-center w-full md:px-3 px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                <span className="mr-2 md:text-sm text-xs">Filtro</span>
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="#000000"
                >
                  <path
                    d="M3 6H21"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M7 12L17 12"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M11 18L13 18"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
              {/* <button className="inline-flex justify-center items-center w-full md:px-3 px-2 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"> */}
              <button className="inline-flex justify-center items-center w-full md:px-3 px-2 py-2 text-sm font-medium text-white bg-blue-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                <span className="mr-2 md:text-sm text-xs">Atualizar</span>
                <FontAwesomeIcon icon={faSync} />
              </button>
            </div>
          </div>
          <div className="md:flex w-full">
            <TableDavs columns={columns} dados={davJson} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDavs;
