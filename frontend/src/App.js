import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import './App.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState,useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";

function App() { 
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userName, setUserName] = useState("")

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedin(false);}
    // Fetch user details when the component mounts
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await fetch("http://localhost:8000/getuser", {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              authtoken: localStorage.getItem("authtoken"),
            },
          });
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setUserName(data.name);
          console.log(data.name); // Log the updated user name
        } catch (err) {
          console.error(err);
          // Handle error
        }
      };
    
      // Fetch user details only if the user is logged in
      if (isLoggedin) {
        fetchUserDetails();
      }
    }, [isLoggedin]);
    
  
  return (
  
    <BrowserRouter>
     <ToastContainer/>
    {isLoggedin && <Navbar isLoggedin={isLoggedin} handleLogout={handleLogout} />}
     
   
      <Routes>
        <Route exact path="/"  element={<Home/>}/>
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
        <Route exact path="/login" element={<Login setIsLoggedin={setIsLoggedin}/>} ></Route> 
        <Route path="/register" element={<Register/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

