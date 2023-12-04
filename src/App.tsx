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
      <Routes>
        <Route path='/' element={<DashBoard />} />
        <Route path='/stock' element={<StockProducts />} />
      </Routes>
      <AlertStock />
    </Router>
  );
}

export default App;
