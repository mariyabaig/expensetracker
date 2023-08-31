import React from "react";
import chart from "../assets/data-management.png";
import money from "../assets/money.png";
import Credit from "../components/Credit";

const Home = () => {
  return (
    <div className="bg-gray-200">
      <nav className="h-20 flex items-center p-12 text-3xl">
        ManageMoney
      </nav>
      <div className="grid grid-cols-2 h-screen">
        <div className="h-full flex flex-col p-32">
          <span className="my-10 p-2 bg-slate-100 w-3/4 rounded-md text-sm text-lack font-bold">
            ManageMoney is now available for free!
          </span>
          <span className="text-5xl">
            Efficient Money{" "}
            <span className="flex items-center">
              <img src={chart} alt="Dashboard Icon" className="w-12 mr-2" />{" "}
              <img src={money} alt="Dashboard Icon" className="w-12 mr-2" />
              Tracking
            </span>
            & Management
          </span>
          <span className="my-10 text-sm text-gray-600">
            Take full control of your money and achieve financial stability with
            ManageMoney.
          </span>

        </div>
        <div className="bg-green rounded-md flex flex-col justify-center items-center h-4/5" >
          <Credit />
          <div className="flex gap-4 m-6">
            <button className="bg-indigo-900 text-white px-4 py-2 rounded-md">
              Log In
            </button>
            <button className="bg-indigo-900 text-white px-4 py-2 rounded-md">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
