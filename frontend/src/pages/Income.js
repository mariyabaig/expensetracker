import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import Modal from "../components/Modal";
import {
  groupByMonth,
  calculateTotal,
  todaysData,
} from "../util";
import "chart.js/auto";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Income = () => {
  const [income, setIncome] = useState({
    amount: "",
    date: "",
    category: "",
  });

  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const totalIncome = calculateTotal(submittedData);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedModalData, setSelectedModalData] = useState([]); // Data for the active modal
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
        toast.error("Error fetching data. Try again later.")
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
      toast.success("Income added.")
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again in some minutes.")
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


  return (
    <>
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
                <label className="text-md font-semibold">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    onClick={() => console.log(selectedDate)}
                    required
                  />
                </label>

                {submittedData.filter((item) => item.date === selectedDate)
                  .length > 0 ? (
                  <div className="w-full h-[300px] overflow-auto my-5">
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

                      <tbody className="text-sm ">
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
                    <div className="mt-4 flex flex-row justify-center">
                      <button
  className="bg-dark-blue text-light-gray rounded-md text-sm p-2"
  onClick={() => {
    setSelectedModalData(submittedData.filter(item => item.date === selectedDate));
    setShowDateModal(true);
  }}
>
  Show More
</button>
                      </div>
                  </div>
                  
                ) : (
                  <p className="h-60 flex justify-center items-center">
                    No details found for selected date.
                  </p>
                )}
              </div>
            </div>
            <div className="relative py-3 px-2  ">
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
                <div className="my-5 w-full  h-[300px] overflow-auto">
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
                            onClick={() => {
                              setSelectedModalData(
                                groupedData[selectedMonth].data
                              );
                              setShowMonthModal(true);
                            }}
                          >
                            Show More
                          </button>
                        </div>

                       
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
      {showMonthModal && (
        <Modal
          isOpen={showMonthModal}
          onClose={() => setShowMonthModal(false)}
          data={selectedModalData}
        />
      )}

      {showDateModal && (
        <Modal
          isOpen={showDateModal}
          onClose={() => setShowDateModal(false)}
          data={selectedModalData}
        />
      )}
    </>
  );
};

export default Income;
