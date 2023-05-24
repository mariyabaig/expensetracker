import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import {
  groupByMonth,
  calculateTotal,
  todaysData,
  handleMonthClick,
  groupByCategory,
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
        console.log('Submitted Data Dates:');
        submittedData.forEach((item) => {
          if (item && item.date) {
            console.log(item.date);
          } else {
            console.log('Invalid data object:', item);
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
      console.log(expense)
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
      <div className="flex flex-row">
        <div className="card my-5 mx-5">
          <div className="card-overlay"></div>
          <h3 className="font-bold">Total Expenses : {totalExpenses}</h3>
          <form onSubmit={handleSubmit}>
            {/* render sum of all the submitted expenses */}

            <label className="flex flex-row items-center text-left px-3 py-2">
              Expense Amount
              <input
                type="number"
                value={expense.amount}
                onChange={(event) =>
                  setExpense({ ...expense, amount: event.target.value })
                }
                required
              />
            </label>
            <label className="flex flex-row items-center text-left px-3 py-2">
              Date
              <input
                type="date"
                value={expense.date}
                onChange={(event) =>
                  setExpense({ ...expense, date: event.target.value })
                }
                required
              />
            </label>
            <label className="flex flex-row items-center text-left px-3 py-2">
              Category
              <select
                value={expense.category}
                onChange={(event) =>
                  setExpense({ ...expense, category: event.target.value })
                }
                required
              >
                <option value="">--Select a category--</option>
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Housing">Housing</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
              </select>
            </label>
            <button className="bg-blue-300 mt-4" type="submit">
              {editIndex !== null ? "Save Changes" : "Submit"}
            </button>
          </form>
        </div>
        {/* Display submitted data if there is any */}
        {submittedData.length > 0 ? (
          <div className=" my-5 mx-5">
            <div className="flex">
              <div className="flex flex-row ">
                {todaysExpense && todaysExpense.total && (
                  <div className="card today my-3 text-center">
                    <div className="card-overlay"></div>
                    <h3 className="text-md text-center font-bold">
                      {DateTime.local().toFormat("dd LLL yyyy")}'s Expenses
                    </h3>
                    <p>Total: ${todaysExpense.total}</p>
                    <table>
                      <thead>
                        <tr className="">
                          <th>Category</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todaysExpense.data.map((expense, index) => (
                          <tr key={index}>
                            <td>{expense.category}</td>
                            <td>${expense.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <Pie
                      data={{
                        labels: todaysExpense.data.map(
                          (expense) => expense.category
                        ),
                        datasets: [
                          {
                            data: Object.values(
                              todaysExpense.data.reduce((acc, expense) => {
                                if (!acc[expense.category]) {
                                  acc[expense.category] = 0;
                                }
                                acc[expense.category] += parseInt(
                                  expense.amount
                                );
                                return acc;
                              }, {})
                            ),
                          },
                        ],
                      }}
                    />
                  </div>
                )}

                {(!todaysExpense || !todaysExpense.total) && (
                  <div>
                    <h3>Today's expense</h3>
                    <p>No data for today</p>
                  </div>
                )}
              </div>
              <div className="months mx-5">
                <label className="flex flex-row items-center">
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
                      <div className="card">
                        <div className="card-overlay"></div>
                        <table>
                          <tbody>
                            {data.data.map((item, index) => (
                              <tr key={index}>
                                <td className="px-3">${item.amount}</td>
                                <td className="px-3">{item.category}</td>
                                <td className="px-3">
                                  {DateTime.fromISO(item.date).toFormat(
                                    "dd LLL yy"
                                  )}
                                </td>
                                <td className="flex m-2">
                                  <button
                                    className="bg-blue-500 px-2 py-2 rounded mx-2"
                                    onClick={() => handleEdit(index)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="bg-blue-500 px-2 py-2 rounded mx-2"
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

            <div className="card">
             
              <label className="flex flex-row items-center text-center">
                
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  onClick={console.log(selectedDate)}
                  required
                />
              </label>
              
             
              {/* Conditionally display details */}
  {submittedData.filter((item) => item.date === selectedDate).length > 0 ? (
    <div>
      {/* Display details for selected date */}
      {submittedData
        .filter((item) => item.date === selectedDate)
        .map((item, index) => (
          <div >
            <table key={index} className="table">
            <td >{item.amount}</td>
            <td > {item.category}</td>
            <td >{item.date}</td>
           
            {/* Add additional details here */}
            </table>
          </div>
        ))}
    </div>
  ) : (
    <p>No details found for selected date.</p>
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
