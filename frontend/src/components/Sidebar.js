import React from "react";
import { Link, useNavigate } from "react-router-dom";
import dashboardIcon from "../assets/business-report.png";
import expensesIcon from "../assets/expenses.png";
import shutdown from "../assets/shutdown.png";
import incomeIcon from "../assets/income.png";

const Sidebar = ({ setIsLoggedin, handleLogout }) => {
  const navigate = useNavigate();

  const isSmallScreen = window.innerWidth <= 640;

  if (isSmallScreen) {
    return (
      <nav className="bg-dark-blue text-light-gray text-md">
        <ul className="flex justify-between px-4 py-2">
          <li>
            <Link to="/">
              <img src={dashboardIcon} alt="Dashboard Icon" />
            </Link>
          </li>
          <li>
            <Link to="/income">
              <img src={incomeIcon} alt="Income Icon" />
            </Link>
          </li>
          <li>
            <Link to="/expenses">
              <img src={expensesIcon} alt="Expenses Icon" />
            </Link>
          </li>
          <li>
            <button onClick={handleLogout}>
              <img src={shutdown} alt="Logout Icon" />
            </button>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <div>
      <ul className="flex flex-col h-full w-64 justify-evenly bg-dark-blue text-light-gray text-md">
        <li>
          <Link to="/">
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/income">
            <span className="hidden sm:inline">Income</span>
          </Link>
        </li>
        <li>
          <Link to="/expenses">
            <span className="hidden sm:inline">Expenses</span>
          </Link>
        </li>
        <li>
          <button onClick={handleLogout}>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
