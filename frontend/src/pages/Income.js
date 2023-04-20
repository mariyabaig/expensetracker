import React, { useState } from "react";
import { DateTime } from "luxon";
const Income = () => {
  // Set up state for the form inputs and submitted data
  const [income, setIncome] = useState({
    amount: "",
    date: "",
    category: "",
  });
  // Set up an array to store submitted data
  const [submittedData, setSubmittedData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      amount: income.amount,
      date: income.date,
      category: income.category,
    };
    if (editIndex !== null) {
      // Edit existing data object
      const newData = [...submittedData];
      newData[editIndex] = data;
      setSubmittedData(newData);
      setEditIndex(null);
    } else {
      // Add new data object
      setSubmittedData([...submittedData, data]);
    }
    setIncome({
      amount: "",
      date: "",
      category: "",
    });
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
  //sum of all the submitted Income using reduce
  const totalIncome = submittedData.reduce((total, data) => {
    return total + parseInt(data.amount);
  }, 0);

  // This state variable is used to store the submitted data from the form
  //  It is initialized to null because no data has been submitted yet
  // const [submittedData, setSubmittedData] = useState(null);

  return (
    <>
      <div className="flex flex-row">
        <div className="card my-5 mx-5">
          <div className="card-overlay"></div>
          <h3 className="font-bold">Total Income : {totalIncome}</h3>
          <form onSubmit={handleSubmit}>
            {/* render sum of all the submitted Income */}
           
            <label className="flex flex-row items-center text-left px-3 py-2">
              income Amount
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
        {/* Display submitted data if there is any */}
        {submittedData.length > 0 && (
          <div className="card  my-5 mx-5">
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
            <h2 className="font-bold">Submitted Data</h2>
            {/* Map over the submittedData array and display each object */}
            <table>
          
             <tbody>
                {submittedData.map((data, index) => (
                  <tr key={index}>
                    <td>{data.amount}</td>
                    <td>{data.category}</td>
                    <td>{DateTime.fromISO(data.date).toFormat(
                                  "dd LLL yy"
                                )}</td>
                  <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                   
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

export default Income;
