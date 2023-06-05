import React from "react";
import { Link ,useNavigate} from "react-router-dom";
import dashboardIcon from "../assets/business-report.png";
import expensesIcon from "../assets/expenses.png";
import shutdown from "../assets/shutdown.png";
import incomeIcon from "../assets/income.png";

const Sidebar = ({setIsLoggedin,handleLogout}) => {
    const navigate = useNavigate();

  // const handleLogout = () => {
  //   localStorage.clear();
  //   setIsLoggedin(false);
  //   navigate('/');
  // };
  return (
    <div>
     
      <ul className="flex flex-col h-full w-64 justify-evenly bg-dark-blue text-light-gray text-md ">
        <li>
          <Link to="/">
            {/* <img src={dashboardIcon} alt="Dashboard Icon" /> */}
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/income">
            {/* <img src={incomeIcon} alt="Income Icon" /> */}
            Income
          </Link>
        </li>
        <li>
          <Link to="/expenses">
            {/* <img src={expensesIcon} alt="Expenses Icon" /> */}
            Expenses
          </Link>
        </li>
        <li>
          <button onClick={handleLogout}>
            {/* <img src={shutdown} alt="Expenses Icon" /> */}
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
