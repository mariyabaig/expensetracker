import React, { useState, useEffect,useRef } from "react";
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
import { Pie, Bar } from "react-chartjs-2";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { DownloadTableExcel } from 'react-export-table-to-excel';

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

  const tableRef = useRef(null);
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore((prevState) => !prevState);
  };
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

 <div className="flex flex-row">
<Sidebar/>
{/* <Navbar/> */}
      <div className="w-3/4">
        <div className=" py-6 sm:py-12 ">
          <form onSubmit={handleSubmit}>
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
              {/* <div className="absolute inset-0 bg-gradient-to-r from-green to-green shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-xl"></div> */}
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
                          autoComplete="off"
                          value={expense.amount}
                          id="amount"
                          name="amount"
                          type="number"
                          className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                          placeholder="Expense amount"
                          onChange={(event) =>
                            setExpense({
                              ...expense,
                              amount: event.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="relative">
                        <input
                          autoComplete="off"
                          type="date"
                          value={expense.date}
                          onChange={(event) =>
                            setExpense({ ...expense, date: event.target.value })
                          }
                          required
                          id="date"
                          name="date"
                          className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                          placeholder="Date"
                        />
                      </div>

                      <div className="relative">
                        <select
                          value={expense.category}
                          onChange={(event) =>
                            setExpense({
                              ...expense,
                              category: event.target.value,
                            })
                          }
                          required
                          className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                        >
                          <option value="">Expense Category</option>
                          <option value="Food">Food</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Housing">Housing</option>
                          <option value="Entertainment">Entertainment</option>
                          <option value="Utilities">Utilities</option>
                        </select>
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
                    className="input-field"
                  />
                </label>
                {selectedDate === DateTime.now().toISODate() ? (
                  <h1>Today's Expenses</h1>
                ) : (
                  <h1>
                    {" "}
                    {DateTime.fromISO(selectedDate).toFormat("dd LLL yy")}'s
                    Expenses
                  </h1>
                )}
                {submittedData.filter((item) => item.date === selectedDate)
                  .length > 0 ? (
                  <div className="w-full">
                    {/* <Pie
                      data={{
                        labels: submittedData
                          .filter((item) => item.date === selectedDate)
                          .map((expense) => expense.category),
                        datasets: [
                          {
                            data: Object.values(
                              submittedData
                                .filter((item) => item.date === selectedDate)
                                .reduce((acc, expense) => {
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
                    /> */}
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
                            <div className="font-semibold text-center">
                              Date
                            </div>
                          </th>
                          <th className="p-2 whitespace-nowrap">
                            <div className="font-semibold text-center">
                              Actions

                            </div>
                            <button>Show all</button>
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

              
  <div className="months flex flex-col items-center my-5">
    <label className="items-center">
      <select
        value={selectedMonth}
        onChange={(event) => setSelectedMonth(event.target.value)}
        onClick={() => console.log(selectedMonth)}
        required
        className="select-style"
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

    <div className="my-5 w-full">
          <DownloadTableExcel
                    filename="users table"
                    sheet="users"
                    currentTableRef={tableRef.current}
                >

                   <button> Export excel </button>

                </DownloadTableExcel>
      {Object.entries(groupedData).map(([month, data]) =>
        selectedMonth === month ? (
          <table className="table-auto w-full" id="table-to-xls" key={month} ref={tableRef}>
            <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
              <tr>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Amount</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Category</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Date</div>
                </th>
                <th className="p-2 whitespace-nowrap">
                  <div className="font-semibold text-center">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
            {data.data.slice(0, showMore ? data.data.length : 4).map((expense, index) => (
              // {data.data.map((expense, index) => (
                <tr key={index}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      {expense.amount}
                      <div className="font-medium text-gray-800"></div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center ">{expense.category}</div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center ">
                      {DateTime.fromISO(expense.date).toFormat("dd LLL yyyy")}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="text-center">
                      <button className="mx-2" onClick={() => handleEdit(index)}>
                        Edit
                      </button>
                      <button className="mx-2" onClick={() => handleDelete(index)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <button onClick={()=>{handleShowMore()}}>{showMore ? 'Show less' : 'Show more'}</button>
          </table>
         
        ) : null
      )}
    </div>
  </div>
</>


          ) : (
            <span>No data submitted yet</span>
          )}
        </div>
      </div>

      <div className="w-1/4 bg-dark-blue">
        <h1 className="text-4xl">Hello</h1>
      </div>
     </div>
    </>
  );
};

export default Expenses;
