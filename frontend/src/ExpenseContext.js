import React, { createContext, useContext, useState } from "react";

const ExpenseContext = createContext();

export const ExpenseContextProvider = ({ children }) => {
  const [expensesData, setExpensesData] = useState([]); // Initialize with empty array

  // Other context-related code and functions

  return (
    <ExpenseContext.Provider
      value={{
        expensesData,
        setExpensesData,
        // Other values and functions you want to provide
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => {
  return useContext(ExpenseContext);
};
