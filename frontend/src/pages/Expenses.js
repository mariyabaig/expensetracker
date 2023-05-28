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
  const [selectedMonth, setSelectedMonth] = useState(
    DateTime.now().toFormat("LLL")
  );
  const [selectedDate, setSelectedDate] = useState(DateTime.now().toISODate());

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

  // const todaysExpense = todaysData(submittedData)[DateTime.local().toISODate()];

  const groupExpensesByCategory = groupByCategory(submittedData, "expense");

  return (
    <>
      <div className=" py-6 sm:py-12 x">
        <form onSubmit={handleSubmit}>
          <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-green to-green shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-xl"></div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-xl sm:p-12">
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
                          <option value="Transportation">Transportation</option>
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
      <div className="h-screen">
        {submittedData.length > 0 ? (
          <>
            <div className="date flex flex-col items-center">
              <label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  onClick={console.log(selectedDate)}
                  required
                />
              </label>
              {selectedDate === DateTime.now().toISODate() ? (
                <h1>Today's Expenses</h1>
              ) : (
                <h1> {DateTime.fromISO(selectedDate).toFormat(
                  "dd LLL yy"
                )}'s Expenses</h1>
              )}
              {submittedData.filter((item) => item.date === selectedDate)
                .length > 0 ? (
                <div className="max-h-[400px] overflow-y-scroll w-full">
                  <table className="table-auto w-full" id="table-to-xls">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                      <tr>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Amount
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Category
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">Date</div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Actions
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                      {/* Display details for selected date */}
                      {submittedData
                        .filter((item) => item.date === selectedDate)
                        .map((expense, index) => (
                          <tr key={index}>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                {expense.amount}
                                <div className="font-medium text-gray-800"></div>
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center ">
                                {expense.category}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center ">
                                {DateTime.fromISO(expense.date).toFormat(
                                  "dd LLL yyyy"
                                )}
                              </div>
                            </td>
                            <td className="p-2 whitespace-nowrap">
                              <div className="text-center">
                                <button
                                  className="mx-2"
                                  onClick={() => handleEdit(index)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="mx-2"
                                  onClick={() => handleDelete(index)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="h-60 flex justify-center items-center">
                  No details found for selected date.
                </p>
              )}
            </div>
            {/* <div className="todays-data">
            {todaysExpense && todaysExpense.total && (
              <table className="table-auto w-full" id="table-to-xls">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center"> Amount</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Category</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-semibold text-center">Actions</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {todaysExpense.data.map((expense, index) => (
                    <tr key={index}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">
                          {expense.amount}
                          <div className="font-medium text-gray-800"></div>
                        </div>
                      </td>

                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center "> {expense.category}</div>
                      </td>

                      <td className="p-2 whitespace-nowrap">
                        <div className="text-center">
                          <button
                            className="mx-2"
                            onClick={() => handleEdit(index)}
                          >
                            Edit
                          </button>
                          <button
                            className="mx-2"
                            onClick={() => handleDelete(index)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {(!todaysExpense || !todaysExpense.total) && (
              <div>
                <h3>Today's expense</h3>
                <p>No data for today</p>
              </div>
            )}
 </div> */}
            <>
              <div className="months flex">
                <label>
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
                <div className="max-h-[400px] overflow-y-scroll w-full">
                  <table className="table-auto w-full" id="table-to-xls">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                      <tr>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Amount
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Category
                          </div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">Date</div>
                        </th>
                        <th className="p-2 whitespace-nowrap">
                          <div className="font-semibold text-center">
                            Actions
                          </div>
                        </th>
                      </tr>
                    </thead>

                    {Object.entries(groupedData).map(([month, data]) => (
                      <tbody
                        className="text-sm divide-y divide-gray-100"
                        key={month}
                      >
                        {selectedMonth === month &&
                          data.data.map((expense, index) => (
                            <tr key={index}>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-center">
                                  {expense.amount}
                                  <div className="font-medium text-gray-800"></div>
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-center ">
                                  {expense.category}
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-center ">
                                  {DateTime.fromISO(expense.date).toFormat(
                                    "dd LLL yyyy"
                                  )}
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div className="text-center">
                                  <button
                                    className="mx-2"
                                    onClick={() => handleEdit(index)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="mx-2"
                                    onClick={() => handleDelete(index)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    ))}
                  </table>
                </div>
              </div>
            </>
          </>
        ) : (
          <span>No data submitted yet</span>
        )}
      </div>
    </>
  );
};

export default Expenses;
