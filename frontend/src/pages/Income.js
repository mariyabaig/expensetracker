import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import Modal from "../components/Modal";
import {
  groupByMonth,
  calculateTotal,
  todaysData,
  handleMonthClick,
  groupByCategory,
} from "../util";
import "chart.js/auto";
import { Pie } from "react-chartjs-2";

const Income = () => {
  const [income, setIncome] = useState({
    amount: "",
    date: "",
    category: "",
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const totalIncome = calculateTotal(submittedData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [showMore, setShowMore] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(
    DateTime.now().toFormat("MMMM") // Change "LLL" to "MMMM"
  );

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const response = await fetch("http://localhost:8000/income", {
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



  const [selectedDate, setSelectedDate] = useState(DateTime.now().toISODate());
  const groupedData = groupByMonth(submittedData);

  const todaysIncome = todaysData(submittedData)[DateTime.local().toISODate()];
  console.log(todaysIncome);

  const groupIncomeByCategory = groupByCategory(submittedData);

  return (
    <>
      {/* <div className="flex flex-row">
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
                <option value="Salary">Salary</option>
                <option value="Refund">Refund</option>
                <option value="Others">Others</option>
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
                  {todaysIncome && todaysIncome.total !== 0 ? (
                    <div className="card my-3 text-center">
                      <div className="card-overlay"></div>
                      <h3 className="text-md text-center font-bold">
                        {DateTime.local().toFormat("dd LLL yyyy")}'s Incomes
                      </h3>
                      <p>Total: ${todaysIncome.total}</p>
                      <table>
                        <tbody>
                          {todaysIncome.data &&
                            todaysIncome.data.map((income, index) => (
                              <tr key={index}>
                                <td>{income.category}</td>
                                <td>${income.amount}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <Pie
                        data={{
                          labels: todaysIncome.data.map(
                            (income) => income.category
                          ),
                          datasets: [
                            {
                              data: Object.values(
                                todaysIncome.data.reduce((acc, income) => {
                                  if (!acc[income.category]) {
                                    acc[income.category] = 0;
                                  }
                                  acc[income.category] += parseInt(
                                    income.amount
                                  );
                                  return acc;
                                }, {})
                              ),
                            },
                          ],
                        }}
                      />
                    </div>
                  ) : (
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
                  <h2
                    onClick={() =>
                      handleMonthClick(month, selectedMonth, setSelectedMonth)
                    }
                    className="font-bold"
                  >
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
                              {DateTime.fromISO(item.date).toFormat(
                                "dd LLL yy"
                              )}
                            </td>
                            <td>
                              <button onClick={() => handleEdit(index)}>
                                Edit
                              </button>
                              <button onClick={() => handleDelete(index)}>
                                Delete
                              </button>
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
      </div> */}
      <div className="grid grid-cols-3 grid-rows-1 gap-12 m-6">
       
        <form onSubmit={handleSubmit} className="float-left">
          <div className="relative py-3 px-2 ">
            {/* <div className="absolute inset-0 bg-gradient-to-r from-green to-green shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-xl"></div>  */}
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-xl sm:p-12">
              <div className="max-w-md mx-auto">
                <div>
                  <h1 className="text-xl font-semibold">
                    Add your incomes now
                  </h1>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-sm sm:leading-7">
                    <div className="relative">
                      <input
                        autoComplete="off"
                        value={income.amount}
                        id="amount"
                        name="amount"
                        type="number"
                        className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                        placeholder="income amount"
                        onChange={(event) =>
                          setIncome({
                            ...income,
                            amount: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="relative">
                      <input
                        autoComplete="off"
                        type="date"
                        value={income.date}
                        onChange={(event) =>
                          setIncome({
                            ...income,
                            date: event.target.value,
                          })
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
                        value={income.category}
                        onChange={(event) =>
                          setIncome({
                            ...income,
                            category: event.target.value,
                          })
                        }
                        required
                        className="h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                      >
                        <option value="">Select</option>
                        <option value="Salary">Salary</option>
                        <option value="Refund">Refund</option>
                        <option value="Others">Others</option>
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
        {submittedData.length > 0 ? (
          <>
            <div className="relative py-3 px-2 ">
              <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-xl sm:p-12">
                <label className="text-xl font-semibold">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    onClick={() => console.log(selectedDate)}
                    required
                  />
                  {"     "}'s expense
                </label>
                {/* {selectedDate === DateTime.now().toISODate() ? (
                    <h1>Today's incomes</h1>
                  ) : (
                    <h1>
                      {" "}
                      {DateTime.fromISO(selectedDate).toFormat("dd LLL yy")}
                      's incomes
                    </h1>
                  )} */}
                {submittedData.filter((item) => item.date === selectedDate)
                  .length > 0 ? (
                  <div className="w-full">
                    <table className="table-auto w-full" id="table-to-xls">
                      <thead className="text-xs font-semibold uppercase text-dark-blue ">
                        <tr>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="font-semibold ">Amount</div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="font-semibold ">Category</div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="font-semibold ">Date</div>
                          </th>
                          <th className="py-3 px-2 whitespace-nowrap">
                            <div className="font-semibold ">Actions</div>
                          </th>
                        </tr>
                      </thead>
                      {/* Table body */}
                      <tbody className="text-sm">
                        {/* Display details for selected date */}
                        {submittedData

                          .filter((item) => item.date === selectedDate)
                          .map((expense, index) => (
                            <tr key={index}>
                              <td className="py-3 px-2 whitespace-nowrap">
                                {expense.amount}
                                <div className="font-medium text-gray-800"></div>
                              </td>
                              <td className="py-3 px-2 whitespace-nowrap">
                                {expense.category}
                              </td>
                              <td className="py-3 px-2 whitespace-nowrap">
                                {DateTime.fromISO(expense.date).toFormat(
                                  "dd LLL yyyy"
                                )}
                              </td>
                              <td className="py-3 px-2 whitespace-nowrap">
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
            </div>
            <div className="relative py-3 px-2 ">
              <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-xl sm:p-12">
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
                  {Object.entries(groupedData).map(([month, data]) =>
                    selectedMonth === month ? (
                      <table
                        className="table-auto w-full"
                        id="table-to-xls"
                        key={month}
                      >
                        <thead className="text-xs font-semibold uppercase text-dark-blue">
                          <tr>
                            <th className="py-3 px-2 whitespace-nowrap">
                              <div className="font-semibold ">Amount</div>
                            </th>
                            <th className="py-3 px-2 whitespace-nowrap">
                              <div className="font-semibold ">Category</div>
                            </th>
                            <th className="py-3 px-2 whitespace-nowrap">
                              <div className="font-semibold ">Date</div>
                            </th>
                            <th className="py-3 px-2 whitespace-nowrap">
                              <div className="font-semibold ">Actions</div>
                            </th>
                          </tr>
                        </thead>
                        {/* Table body */}
                        <tbody className="text-sm">
                          {data.data

                            .slice(0, showMore ? data.data.length : 4)
                            .map((expense, index) => (
                              <tr key={index}>
                                <td className="py-3 px-2 whitespace-nowrap">
                                  <div>
                                    {expense.amount}
                                    <div className="font-medium text-gray-800"></div>
                                  </div>
                                </td>
                                <td className="py-3 px-2 whitespace-nowrap">
                                  <div>{expense.category}</div>
                                </td>
                                <td className="py-3 px-2 whitespace-nowrap">
                                  <div>
                                    {DateTime.fromISO(expense.date).toFormat(
                                      "dd LLL yyyy"
                                    )}
                                  </div>
                                </td>
                                <td className="py-3 px-2 whitespace-nowrap">
                                  <div>
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
                                <td className="py-3 px-2 whitespace-nowrap"></td>
                              </tr>
                            ))}
                        </tbody>
                        <div className="mt-4 flex flex-row justify-center">
                          <button
                            className="bg-dark-blue text-light-gray rounded-md text-sm"
                            onClick={() => setIsModalOpen(true)}
                          >
                            Show More
                          </button>
                        </div>

                        {/* Modal */}
                        {/* <Modal
                          isOpen={isModalOpen}
                          onClose={() => setIsModalOpen(false)}
                          data={Object.values(groupedData).flatMap(
                            (data) => data.data
                          )}
                        /> */}
                      </table>
                    ) : null
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <span>No data submitted yet</span>
        )}
      </div>
      {isModalOpen && selectedMonth && groupedData[selectedMonth] && (
  <Modal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    data={groupedData[selectedMonth].data}
  />
)}

 </>   
  );
};

export default Income;
