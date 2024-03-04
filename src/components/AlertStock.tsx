// Bibliotecas
import { motion } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";

// Dados
import DataStock from "./../data/DataStock.json";
import { useState } from "react";

const AlertStock = () => {
  const [closeWarning, setCloseWarning] = useState(true);

  const productsLowStock = DataStock.estoque.filter(
    (product) => product.quantidade < product.itens_abaixo_minimo
  );

  return (
    <>
      {productsLowStock && closeWarning && (
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: 50,
              x: [-2, 2, -2, 0],
              transition: { duration: 2, loop: Infinity },
            }}
            transition={{ duration: 0.5 }}
            className="z-20 text-white flex flex-col shrink-0 grow-0 justify-around 
                fixed bottom-0 right-0 right-5 
                mr-1 mb-5 lg:mr-5 lg:mb-5 xl:mr-10 xl:mb-10"
          >
            <motion.div
              animate={{
                x: [-8, 8, -8, 0],
                transition: { duration: 0.5, loop: Infinity },
              }}
              className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-red rounded-md text-red-100 bg-red-700 border border-red-700 "
            >
              <div slot="avatar">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="feather feather-alert-octagon w-10 h-10 mx-2"
                >
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>

              <div className="text-xl font-bold  max-w-full flex-initial flex items-center">
                <div className="pr-5 flex">
                  Há produtos com estoque baixo. Por favor, verifique.
                </div>
                <div className="flex pr-2 ">
                  <button
                    onClick={() => setCloseWarning(!closeWarning)}
                    className="flex p-1 flex items-center justify-center transition duration-300 transform  hover:bg-black hover:bg-opacity-50 rounded-full"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AlertStock;
