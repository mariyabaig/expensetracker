import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import {
  groupByMonth,
  calculateTotal,
  todaysData,
  handleMonthClick,
  groupByCategory,
  calculateTotalMonth,
} from "../util";
import "chart.js/auto";
import { Pie } from "react-chartjs-2";

const Expenses = () => {
  const [expense, setExpense] = useState({
    amount: "",
    date: "",
    category: "",
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState();
  const [selectedDate, setSelectedDate] = useState();

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("http://localhost:8000/expenses", {
          method: "GET",
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
        setSubmittedData(data);
        console.log("Submitted Data Dates:");
        submittedData.forEach((item) => {
          if (item && item.date) {
            console.log(item.date);
          } else {
            console.log("Invalid data object:", item);
          }
        });
      } catch (err) {
        console.error(err);
        // Handle error
      }
    };
    fetchExpenses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = expense;
    try {
      const response = await fetch("http://localhost:8000/addexpense", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newExpense = await response.json();
      setSubmittedData([...submittedData, newExpense]);
      setExpense({
        amount: "",
        date: "",
        category: "",
      });
    } catch (err) {
      console.error(err);
      console.log(expense);
      // Handle error
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setExpense(submittedData[index]);
  };

  const handleDelete = (index) => {
    const newData = [...submittedData];
    newData.splice(index, 1);
    setSubmittedData(newData);
  };

  const totalExpenses = calculateTotal(submittedData);

  const groupedData = groupByMonth(submittedData);

  const todaysExpense = todaysData(submittedData)[DateTime.local().toISODate()];

  const groupExpensesByCategory = groupByCategory(submittedData, "expense");

  return (
    <>
      <div className="">
        <div className="min-h-screen py-6 sm:py-12 x">
          <form onSubmit={handleSubmit}>
            <div className="relative py-3 sm:max-w-xl sm:mx-auto float-left">
              <div className="absolute inset-0 bg-gradient-to-r from-green to-green shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
              <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                <div className="max-w-md mx-auto">
                  <div>
                    <h1 className="text-2xl font-semibold">
                      Add your expenses now
                    </h1>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                      <div className="relative">
                        <input
                          autocomplete="off"
                          value={expense.amount}
                          id="amount"
                          name="amount"
                          type="number"
                          className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                          placeholder="Expense amount"
                          onChange={(event) =>
                            setExpense({
                              ...expense,
                              amount: event.target.value,
                            })
                          }
                        />
                        <label
                          htmlFor="email"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        >
                          Expense Amount
                        </label>
                      </div>

                      <div className="relative">
                        <input
                          autocomplete="off"
                          type="date"
                          value={expense.date}
                          onChange={(event) =>
                            setExpense({ ...expense, date: event.target.value })
                          }
                          required
                          id="date"
                          name="date"
                          className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                          placeholder="Date"
                        />
                        <label
                          htmlFor="date"
                          className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                        ></label>
                      </div>

                      <div className="relative">
                        <label>
                          <select
                            value={expense.category}
                            onChange={(event) =>
                              setExpense({
                                ...expense,
                                category: event.target.value,
                              })
                            }
                            required
                          >
                            <option value="">Expense Category</option>
                            <option value="Food">Food</option>
                            <option value="Transportation">
                              Transportation
                            </option>
                            <option value="Housing">Housing</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Utilities">Utilities</option>
                          </select>
                        </label>
                      </div>
                      <div className="relative">
                        <button className="bg-dark-blue text-light-gray rounded-md px-2 py-1">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {submittedData.length > 0 ? (
          <div className="">
            <div className="">
              <div>
                {todaysExpense && todaysExpense.total && (
                  <div className="">
                    
                    <h3 className="text-md font-bold">Today's Expenses</h3>
                    {/* <p>Total: ${todaysExpense.total}</p> */}
                    
                      
                       
                          <div className="container">
                          
                          
                            <table className="text-left w-full">
                              <thead className="bg-black flex text-white w-full">
                                <tr className="flex w-full mb-4">
                                  Today's Expenses : ${todaysExpense.total}
                          
                                </tr>
                              </thead>
                             
                              <tbody className="bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full" style= {{height: "50vh"}}>
                              {todaysExpense.data.map((expense, index) => (
                                <tr key={index}  className="flex w-full mb-4">
                                  <td className="p-4 w-1/4">{expense.category}</td>
                                  <td className="p-4 w-1/4">${expense.amount}</td>
                                  <td className="p-4 w-1/4">       <button
                                
                                onClick={() => handleEdit(index)}
                              >
                                Edit
                              </button>
                              </td>
                              <td>
                              <button className="p-4 w-1/4"
                               
                                onClick={() => handleDelete(index)}
                              >
                                Delete
                              </button></td>
                                 
                                </tr>
                          
                          ))}
                              </tbody>
                            </table>
                          </div>

                          
                      
                 
                  </div>
                  
                )}

                {(!todaysExpense || !todaysExpense.total) && (
                  <div>
                    <h3>Today's expense</h3>
                    <p>No data for today</p>
                  </div>
                )}
              </div>
              <div className="months flex">
                <label className="">
                  <select
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    onClick={console.log(selectedMonth)}
                    required
                  >
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </label>
                {Object.entries(groupedData).map(([month, data]) => (
                  <div key={month}>
                    {selectedMonth === month && (
                     <div className="container">
                          
                          
                      <table className="text-left w-full">
                        <thead className="bg-black flex text-white w-full">
                          <tr className="flex w-full mb-4">
                           {month}'s Expenses
                    
                          </tr>
                        </thead>
                        <tbody className="bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full" style= {{height: "50vh"}}>
                          {data.data.map((item, index) => (
                             <tr key={index}  className="flex w-full mb-4">
                              <td className="p-4 w-1/4">${item.amount}</td>
                              <td className="p-4 w-1/4">{item.category}</td>
                              <td className="p-4 w-1/4">
                                {DateTime.fromISO(item.date).toFormat(
                                  "dd LLL yy"
                                )}
                              </td>
                              <td className="p-4 w-1/4">
                                <button
                                  className="bg-dark-blue px-2 py-2 rounded mx-2"
                                  onClick={() => handleEdit(index)}
                                >
                                  Edit
                                </button>
                                </td>
                                <td className="p-4 w-1/4">
                                <button
                                  className="bg-dark-blue  px-2 py-2 rounded mx-2"
                                  onClick={() => handleDelete(index)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="date">
              <label className="items-center">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  onClick={console.log(selectedDate)}
                  required
                />
              </label>

              {/* Conditionally display details */}
              {submittedData.filter((item) => item.date === selectedDate)
                .length > 0 ? (
                <div>
                  {/* Display details for selected date */}
                  {submittedData
                    .filter((item) => item.date === selectedDate)
                    .map((item, index) => (
                      <div>
                        <table key={index} className="table">
                          <td>{item.amount}</td>
                          <td> {item.category}</td>
                          <td>
                            {" "}
                            {DateTime.fromISO(item.date).toFormat("dd LLL yy")}
                          </td>
                          <td>
                            <button
                              className="bg-dark-blue px-2 py-2 rounded mx-2"
                              onClick={() => handleEdit(index)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-dark-blue  px-2 py-2 rounded mx-2"
                              onClick={() => handleDelete(index)}
                            >
                              Delete
                            </button>
                          </td>

                          {/* Add additional details here */}
                        </table>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="h-60 flex justify-center items-center">
                  No details found for selected date.
                </p>
              )}
            </div>
          </div>
        ) : (
          <span>No data submitted yet</span>
        )}
      </div>
    </>
  );
};

export default Expenses;
