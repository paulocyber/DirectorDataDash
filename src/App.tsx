// Bibliotecas
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import SideBar from './components/SideBar';
import DashBoard from './page/DashBoard';
import StockProducts from './page/StockProducts';
import AlertStock from './components/AlertStock';

function App() {
  return (
    <Router>
      <SideBar />
      <main className="bg-gray-100 flex flex-col w-full h-[100vh] md:overflow-hidden overflow-auto">
        <Routes>
          <Route path='/' element={<DashBoard />} />
          <Route path='/stock' element={<StockProducts />} />
        </Routes>
      </main>
      <AlertStock />
    </Router >
  );
}

export default App;
