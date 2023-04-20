import React, { useState } from "react";

const Expenses = () => {
  const [expense, setExpense] = useState({
    amount: "",
    date: "",
    category: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(setExpense);
  };

  return (
    <>
    <div>
    <div className="card">
      <div className="card-overlay"></div>
      <form
            onSubmit={handleSubmit}

          >
            <label >
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
            <label >
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
            <label >
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
          </div>
    </>
  );
};

export default Expenses;
