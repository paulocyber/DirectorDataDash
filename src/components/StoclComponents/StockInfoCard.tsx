// Bibliotecas
import StorageIcon from "@mui/icons-material/Storage";
import LocalOffer from "@mui/icons-material/LocalOffer";
import WarningIcon from "@mui/icons-material/Warning";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const StockInfoCard = () => {
  return (
    <div className="flex flex-wrap">
      <div className="mt-2 w-full bg-white lg:w-6/12 xl:w-3/12 px-5 mb-4 ">
        <div className="relative flex flex-col min-w-0 break-words rounded-lg rounded mb-3 xl:mb-0 shadow-lg font-sans">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap ">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1 ">
                <h5 className="text-blueGray-400 uppercase font-bold text-lg ">
                  Quantidade Estoque
                </h5>
                <span className="font-semibold text-base text-blueGray-700">
                  R$ 0,00
                </span>
              </div>
              <div className="relative w-auto pl-4 flex-initial">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-blue-500">
                  <StorageIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4 ">
        <div className="relative flex flex-col min-w-0 break-words rounded-lg bg-white mb-3 xl:mb-0 shadow-lg font-sans">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-blueGray-400 uppercase font-bold text-lg">
                  Número de Produtos
                </h5>
                <span className="font-semibold text-base text-blueGray-700">
                  0
                </span>
              </div>
              <div className="relative w-auto pl-4 flex-initial">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-blue-500">
                  <LocalOffer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4">
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-3 xl:mb-0 shadow-lg font-sans">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-blueGray-400 uppercase font-bold text-lg">
                  Itens Estoque Mínimo
                </h5>
                <span className="font-semibold text-base text-blueGray-700">
                  0
                </span>
              </div>
              <div className="relative w-auto pl-4 flex-initial">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-blue-500">
                  <WarningIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 w-full lg:w-6/12 xl:w-3/12 px-5 mb-4">
        <div className="relative flex flex-col min-w-0 break-words bg-white rounded-lg mb-3 xl:mb-0 shadow-lg font-sans">
          <div className="flex-auto p-4">
            <div className="flex flex-wrap">
              <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
                <h5 className="text-blueGray-400 uppercase font-bold text-lg">
                  Valor do Estoque
                </h5>
                <span className="font-semibold text-base text-blueGray-700">
                  0
                </span>
              </div>
              <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-gradient-to-br from-gray-600 to-black shadow-red-500/40">
                <div className="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full bg-blue-500">
                  <AttachMoneyIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockInfoCard;
