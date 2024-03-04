// Bibliotecas
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import SideBar from "./components/Menu/SideBar";
import AlertStock from "./components/AlertStock";
import DashBoardPage from "./page/DashBoardPage";
import DavsReport from "./page/DavsReport";

function App() {
  return (
    <Router>
      <SideBar />
      <main className="bg-[#edf3fb] flex flex-col w-full overflow-auto h-screen">
        <div className="md:ml-auto md:mx-0 xl:w-[82%] md:flex flex-col w-full px-3">
          <Routes>
            <Route path="/" element={<DavsReport />} />
            <Route path="/dashboard" element={<DashBoardPage />} />
          </Routes>
        </div>
      </main>
      {/* <AlertStock /> */}
    </Router>
  );
}

export default App;
