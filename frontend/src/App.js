import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import './App.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState } from "react";

function App() { 
  const [isLoggedin, setIsLoggedin] = useState(false);
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedin(false);
    
  }
  return (
    <BrowserRouter>
      <Navbar isLoggedin={isLoggedin} handleLogout={handleLogout} />
      <Routes>
        <Route
          exact
          path="/dashboard"
          element={isLoggedin ? <Dashboard setIsLoggedin={setIsLoggedin}/> : <Login setIsLoggedin={setIsLoggedin}/> }
        />
        <Route
          exact
          path="/income"
          element={isLoggedin ? <Income setIsLoggedin={setIsLoggedin}/> : <Login setIsLoggedin={setIsLoggedin}/> }
        />
        <Route
          exact
          path="/expenses"
          element={isLoggedin ? <Expenses setIsLoggedin={setIsLoggedin}/> : <Login setIsLoggedin={setIsLoggedin}/> }
        />
        <Route exact path="/" element={<Login setIsLoggedin={setIsLoggedin}/>} ></Route> 
        <Route path="/register" element={<Register/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

