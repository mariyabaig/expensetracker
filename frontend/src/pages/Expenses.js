import React, { useState } from "react";

const Expenses = () => {
  // Set up state for the form inputs and submitted data
  const [expense, setExpense] = useState({
    amount: "",
    date: "",
    category: "",
  });
  // Set up an array to store submitted data
  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault()
    const data = {
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
    }
    if (editIndex !== null) {
      // Edit existing data object
      const newData = [...submittedData]
      newData[editIndex] = data
      setSubmittedData(newData)
      setEditIndex(null)
    } else {
      // Add new data object
      setSubmittedData([...submittedData, data])
    }
    setExpense({
      amount: "",
      date: "",
      category: "",
    })
  }

  const handleEdit = (index) => {
    setEditIndex(index);
    setExpense(submittedData[index]);
  };

  const handleDelete = (index) => {
    const newData = [...submittedData];
    newData.splice(index, 1);
    setSubmittedData(newData);
  };
  //sum of all the submitted expenses using reduce
  const totalExpenses = submittedData.reduce((total, data) => {
    return total + parseInt(data.amount)
  }, 0)

  // This state variable is used to store the submitted data from the form
  //  It is initialized to null because no data has been submitted yet
  // const [submittedData, setSubmittedData] = useState(null);

  return (
    <>
      <div>
        <div className="card">
          <div className="card-overlay"></div>
          <form onSubmit={handleSubmit}>
            {/* render sum of all the submitted expenses */}
            <h3 className="font-bold">Total Expenses : {totalExpenses}</h3>
            <label>
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
            <label>
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
            <label>
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
              Submit
            </button>
          </form>
        </div>
        {/* Display submitted data if there is any */}
        {submittedData.length > 0 && (
          <div className="card">
            <div className="card-overaly"></div>
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
            <h2 className="text-md">Submitted Data</h2>
            {/* Map over the submittedData array and display each object */}
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {submittedData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.amount}</td>
                    <td>{data.date}</td>
                    <td>{data.category}</td>
                    <td>
                      <button onClick={() => handleEdit(index)}>Edit</button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(index)}>
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
    </>
  );
};

export default Expenses;
