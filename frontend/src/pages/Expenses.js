import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import {
  groupByMonth,
  calculateTotal,
  todaysData,
  handleMonthClick,
} from "../util";

const Expenses = () => {
  const [expense, setExpense] = useState({
    amount: "",
    date: "",
    category: "",
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState();

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
            {/* This block of code is conditional rendering
            It only renders if submittedData is not null (meaning data has been submitted)
            It displays the submitted data in a card format
           The submitted data is accessed from the submittedData state variable
           Each piece of data (amount, date, category) is displayed in a separate <p> element */}
            {/* {submittedData && (
            <div className="card">
            <div className="card-overlay"></div>
            <h2>Submitted Data</h2>
            <p>Amount: {submittedData.amount}</p>
            <p>Date: {submittedData.date}</p>
            <p>Category: {submittedData.category}</p>
            </div>
            )} */}
            <div className="flex">
                <div className="flex flex-row ">
                  {todaysExpense && todaysExpense.total && (
                    <div className="card my-3 text-center">
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
                    </div>
                  )}

                  {(!todaysExpense || !todaysExpense.total) && (
                    <div>
                      <h3>Today's expense</h3>
                      <p>No data for today</p>
                    </div>
                  )}
                </div>
              </div>
            {Object.entries(groupedData).map(([month, data]) => (
              <>
                <div className="card my-5 mx-5">
                  <div className="card-overlay"></div>
                  <h2
                    key={month}
                    className="font-bold"
                    onClick={() => handleMonthClick(month,selectedMonth,setSelectedMonth)}
                  >
                    {month}'s total :{data.total}
                  </h2>
                  {/* Map over the submittedData array and display each object */}
                  {selectedMonth === month && (
                    <table>
                      {data.data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.amount}</td>
                          <td>{item.category}</td>
                          <td>
                            {DateTime.fromISO(item.date).toFormat("dd LLL yy")}
                          </td>
                          <span>
                            <button onClick={() => handleEdit(index)}>
                              Edit
                            </button>

                            <button onClick={() => handleDelete(index)}>
                              Delete
                            </button>
                          </span>
                        </tr>
                      ))}
                    </table>
                  )}
                </div>
              </>
            ))}
          </div>
        ) : (
          <span>No data submitted yet</span>
        )}
      </div>
    </>
  );
};

export default Expenses;
