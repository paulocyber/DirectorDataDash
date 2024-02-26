import React from "react";

// Biblioteca
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCashRegister,
  faCoins,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

// Dados
import { valuesDavs } from "../../utils/valuesDavs";

// Utils
import { formatCurrency } from "../../utils/ApplyMask";

const InfoCardDavs = () => {
  const { valueDav } = valuesDavs();

  return (
    <div className="mt-5 ">
      <div className="mb-5 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md z-10">
          {/* <div className="bg-blue-500 mx-4 rounded-xl overflow-hidden text-white shadow-black-500/40 shadow-lg absolute -mt-4 grid md:h-16 h-14 md:w-16 w-14 place-items-center"> */}
          <div className="bg-[#fa6602] mx-4 rounded-xl overflow-hidden text-white shadow-black-500/40 shadow-lg absolute -mt-4 grid md:h-16 h-14 md:w-16 w-14 place-items-center">
            <FontAwesomeIcon icon={faCoins} className="w-5 h-5" />
          </div>
          <div className="p-4 text-right">
            <p className="block antialiased font-sans md:text-sm text-xs leading-normal font-normal text-blue-gray-600">
              Valor da DAVs
            </p>
            <h4 className="block antialiased tracking-normal font-sans md:text-2xl text-xl font-semibold leading-snug text-blue-gray-900">
              {formatCurrency(valueDav)}
            </h4>
          </div>
          {/* <div className="border-t border-blue-gray-50 p-4">
            <p className="block antialiased font-sans md:text-base text-sm leading-relaxed font-normal text-blue-gray-600">
              <strong className="text-green-500">+55%</strong>&nbsp;Do que na
              semana passada
            </p>
          </div> */}
        </div>

        <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md z-10">
          <div className="bg-[#fa6602] mx-4 rounded-xl overflow-hidden text-white shadow-black-500/40 shadow-lg absolute -mt-4 grid md:h-16 h-14 md:w-16 w-14 place-items-center">
            <FontAwesomeIcon icon={faCashRegister} className="w-5 h-5" />
          </div>
          <div className="p-4 text-right">
            <p className="block antialiased font-sans md:text-sm text-xs leading-normal font-normal text-blue-gray-600">
              Total de vendas
            </p>
            <h4 className="block antialiased tracking-normal font-sans md:text-2xl text-xl font-semibold leading-snug text-blue-gray-900">
              R$ 53k
            </h4>
          </div>
          {/* <div className="border-t border-blue-gray-50 p-4">
            <p className="block antialiased font-sans md:text-base text-sm leading-relaxed font-normal text-blue-gray-600">
              <strong className="text-green-500">+55%</strong>&nbsp;Do que na
              semana passada
            </p>
          </div> */}
        </div>

        <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md z-10">
          <div className="bg-[#fa6602] mx-4 rounded-xl overflow-hidden text-white shadow-black-500/40 shadow-lg absolute -mt-4 grid md:h-16 h-14 md:w-16 w-14 place-items-center">
            <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
          </div>
          <div className="p-4 text-right">
            <p className="block antialiased font-sans md:text-sm text-xs leading-normal font-normal text-blue-gray-600">
              Total de clientes atendidos
            </p>
            <h4 className="block antialiased tracking-normal font-sans md:text-2xl text-xl font-semibold leading-snug text-blue-gray-900">
              50
            </h4>
          </div>
          {/* <div className="border-t border-blue-gray-50 p-4">
            <p className="block antialiased font-sans md:text-base text-sm leading-relaxed font-normal text-blue-gray-600">
              <strong className="text-green-500">+55%</strong>&nbsp;Do que na
              semana passada
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default InfoCardDavs;
