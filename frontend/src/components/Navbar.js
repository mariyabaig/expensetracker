import React from "react";
import { Link ,useNavigate} from "react-router-dom";
import dashboardIcon from "../assets/business-report.png";
import expensesIcon from "../assets/expenses.png";
import shutdown from "../assets/shutdown.png";
import incomeIcon from "../assets/income.png";
import icon from "../assets/manage.png";

const Navbar = ({setIsLoggedin,handleLogout}) => {
    const navigate = useNavigate();


  return (
    <div>
     <div className="h-18 flex items-center bg-green">
      <ul>
        <li className="flex items-center text-5xl p-3">
          BudgetBuddy  <img src={icon} alt="Dashboard Icon" className="h-20"/> 
        </li>
      </ul>
     </div>
      <ul className="flex flex-row h-16 justify-evenly items-center bg-dark-blue text-light-gray text-md ">
        <li >
          <Link to="/dashboard">
         <img src={dashboardIcon} alt="Dashboard Icon" /> 
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/income">
            <img src={incomeIcon} alt="Income Icon" /> 
            Income
          </Link>
        </li>
        <li>
          <Link to="/expenses">
          <img src={expensesIcon} alt="Expenses Icon" /> 
            Expenses
          </Link>
        </li>
        <li>
          <button onClick={handleLogout}>
         <img src={shutdown} alt="Expenses Icon" /> 
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
