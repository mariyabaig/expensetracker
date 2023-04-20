import React from "react";
import { Link } from "react-router-dom";
import dashboardIcon from "../assets/business-report.png";
import expensesIcon from "../assets/expenses.png";
import incomeIcon from "../assets/income.png";

const Navbar = () => {
  return (
    <div className="card ">
      <div className="card-overlay"></div>
      <ul className="flex flex-row justify-between ">
        <li>
          <Link to="/">
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
      </ul>
    </div>
  );
};

export default Navbar;
