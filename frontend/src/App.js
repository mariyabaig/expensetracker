import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
   <>
   <BrowserRouter>
  <Navbar/>
   <Routes>
   <Route exact path = "/" element={<Login/>}/>
   <Route exact path = "/register" element={<Register/>}/>
    <Route exact path = "/dashboard" element={<Dashboard/>}/>
    <Route exact path = "/income" element={<Income/>}/>
    <Route exact path = "/expenses" element={<Expenses/>}/>
   </Routes>
   </BrowserRouter>
   </>
  );
}

export default App;
