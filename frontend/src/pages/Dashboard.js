import React from 'react';

const Dashboard = () => {
  return (
    <div className='h-full  m-12 flex flex-col justify-center'>

      
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-md font-semibold mb-2">Welcome to Your Expense Tracker Dashboard</h2>
        <p className="text-gray-600">
          Here, you can manage and track your expenses, view your spending patterns, and more.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-md font-semibold mb-2">Your Current Month's Summary</h2>
        {/* Display charts or statistics related to the current month's expenses */}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-md font-semibold mb-2">Recent Expenses</h2>
        {/* Display a list of recent expenses */}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-md font-semibold mb-2">Expense Categories</h2>
        {/* Display a breakdown of expenses by category */}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-md font-semibold mb-2">Tips for Managing Your Expenses</h2>
        <p className="text-gray-600">
          Here are some useful tips for managing and optimizing your expenses to achieve your financial goals.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
