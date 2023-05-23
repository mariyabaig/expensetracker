import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";

const Income = () => {
  const [income, setIncome] = useState({
    amount: "",
    date: "",
    category: "",
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState();

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await fetch("http://localhost:8000/expenses", {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            authtoken: localStorage.getItem("authtoken"),
            // "Authorization": `Bearer ${token}` // Send the token in the Authorization header
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
    fetchIncome();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = income;

    try {
      const response = await fetch("http://localhost:8000/addincome", {
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

      const newIncome = await response.json();
      setSubmittedData([...submittedData, newIncome]);
      setIncome({
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
    setIncome(submittedData[index]);
  };

  const handleDelete = (index) => {
    const newData = [...submittedData];
    newData.splice(index, 1);
    setSubmittedData(newData);
  };

  const totalIncome = submittedData.reduce((total, data) => {
    return total + parseInt(data.amount);
  }, 0);

  const groupByMonth = (data) => {
    return data.reduce((results, curr) => {
      const date = new Date(curr.date);
      const month = date.toLocaleString("default", { month: "long" });
      if (!results[month]) {
        results[month] = { data: [], total: 0 };
      }
      results[month].data.push(curr);
      results[month].total += parseInt(curr.amount);
      return results;
    }, {});
  };

  const groupedData = groupByMonth(submittedData);

  const handleMonthClick = (month) => {
    setSelectedMonth((prevMonth) => (prevMonth === month ? null : month));
  };

  const todaysData = (data) => {
    const today = DateTime.local().toISODate(); // Get today's date in ISO format
    return data.reduce((results, curr) => {
      const currDate = DateTime.fromISO(curr.date).toISODate(); // Convert income date to ISO format
      if (currDate === today) {
        // Compare income date with today's date
        if (!results[today]) {
          results[today] = { data: [], total: 0 };
        }
        results[today].data.push(curr); // Push current data item to today's data array
        results[today].total += parseInt(curr.amount); // Add current data item's amount to today's total
      }
      return results;
    }, {});
  };

  const today = DateTime.local().toISODate();
  const todaysIncome = todaysData(submittedData)[today]; // Call todaysData function to get today's data

  return (
    <>
      <div className="flex flex-row">
        <div className="card my-5 mx-5">
          <div className="card-overlay"></div>
          <h3 className="font-bold">Total Income: {totalIncome}</h3>
          <form onSubmit={handleSubmit}>
            <label className="flex flex-row items-center text-left px-3 py-2">
              Income Amount
              <input
                type="number"
                value={income.amount}
                onChange={(event) =>
                  setIncome({ ...income, amount: event.target.value })
                }
                required
              />
            </label>
            <label className="flex flex-row items-center text-left px-3 py-2">
              Date
              <input
                type="date"
                value={income.date}
                onChange={(event) =>
                  setIncome({ ...income, date: event.target.value })
                }
                required
              />
            </label>
            <label className="flex flex-row items-center text-left px-3 py-2">
              Category
              <select
                value={income.category}
                onChange={(event) =>
                  setIncome({ ...income, category: event.target.value })
                }
              >
                <option value="">Select</option>
                <option value="Food">Salary</option>
                <option value="Transportation">Refund</option>
                <option value="Housing">Others</option>
              </select>
            </label>
            <button className="bg-blue-300 mt-4" type="submit">
              {editIndex !== null ? "Save Changes" : "Submit"}
            </button>
          </form>
        </div>

        <div className="my-5 mx-5">
          {submittedData.length > 0 ? (
            <>
              <div className="flex">
                <div className="flex flex-row ">
                  {todaysIncome && todaysIncome.total && (
                    <div className="card my-3 text-center">
                      <div className="card-overlay"></div>
                      <h3 className="text-md text-center font-bold">
                        {DateTime.local().toFormat("dd LLL yyyy")}'s Incomes
                      </h3>
                      <p>Total: ${todaysIncome.total}</p>
                      <table>
                        <thead>
                          <tr className="">
                            <th>Category</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {todaysIncome.data.map((income, index) => (
                            <tr key={index}>
                              <td>{income.category}</td>
                              <td>${income.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {(!todaysIncome || !todaysIncome.total) && (
                    <div>
                      <h3>Today's Income</h3>
                      <p>No data for today</p>
                    </div>
                  )}
                </div>
              </div>
              {Object.entries(groupedData).map(([month, data]) => (
                <div className="card" key={month}>
                  <div className="card-overlay"></div>
                  <h2 onClick={() => handleMonthClick(month)} className="font-bold">
                    {month}'s total: {data.total}
                  </h2>

                  {selectedMonth === month && (
                    <table>
                      <tbody>
                        {data.data.map((item, index) => (
                          <tr key={index}>
                            <td>{item.amount}</td>
                            <td>{item.category}</td>
                            <td>
                              {DateTime.fromISO(item.date).toFormat("dd LLL yy")}
                            </td>
                            <td>
                              <button onClick={() => handleEdit(index)}>Edit</button>
                              <button onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))}
            </>
          ) : (
            <span>No submitted data</span>
          )}
        </div>
      </div>
    </>
  );
};

export default Income;
