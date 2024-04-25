import { useState } from "react";

// Biblioteca
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// Componentes
import SideBar from "./components/menu/SideBar";
import HeaderBar from "./components/menu/HeaderBar";
import DavSummaryReport from "./pages/DavSummaryReport";
import DavDetail from "./pages/DavDetail";
import BillsToPay from "./pages/BillsToPay";
import BillsToPayTable from "./pages/BillsToPayTable";

function App() {
  const [toggleMenuClosed, setToggleMenuClosed] = useState(false);

  return (
    <Router>
      <div className={toggleMenuClosed ? "transition-all ease-in-out duration-300 top-0 left-0 right-0 bottom-0 fixed bg-black bg-opacity-50 z-50" : ""}>
        <SideBar showMenu={toggleMenuClosed} isClose={setToggleMenuClosed} />
      </div>
      <HeaderBar isOpen={setToggleMenuClosed} />
      <main className="bg-[#edf3fb] flex flex-col w-full ">
        <div className="md:ml-auto md:mx-0 xl:w-[82%] md:flex flex-col w-full px-3">
          <Routes>
            <Route path="/" element={<DavSummaryReport />} />
            <Route path="/detaildav/:id" element={<DavDetail />} />
            <Route path="/billstopay" element={<BillsToPay />} />
            <Route path="/billstopay/table" element={<BillsToPayTable />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
