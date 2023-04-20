import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {

  return (
    <div className="card ">
      <div className="card-overlay"></div>
      <ul className="flex flex-row justify-between items-center ">
        <li className=" flex flex-col items-center">
          <Link to="/">Dashboard</Link>
        </li>
        <li className=" flex flex-col items-center ">
          <Link to="/income">Income</Link>
        </li>
        <li className=" flex flex-col items-center ">
          <Link to="/expenses">Expenses</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
