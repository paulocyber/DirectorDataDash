// Bibliotecas
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import SideBar from './components/SideBar';
import DashBoard from './page/DashBoard';
import StockProducts from './page/StockProducts';

function App() {
  return (
    <Router>
      <SideBar />
      <Routes>
        <Route path='/' element={<DashBoard />} />
        <Route path='/stock' element={<StockProducts />} />
      </Routes>
    </Router>
  );
}

export default App;
