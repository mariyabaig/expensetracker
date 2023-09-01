import React ,{useState} from "react";
import { DateTime } from "luxon";
import { Pie } from "react-chartjs-2";
import { CSVLink, CSVDownload } from "react-csv";

const Modal = ({ isOpen, onClose, data }) => {
  // Calculate data for the Pie chart
  const [csvData, setCsvData] = useState([]);

  const categoryAmounts = data.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += parseFloat(expense.amount);
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(categoryAmounts),
    datasets: [
      {
        data: Object.values(categoryAmounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          
        ],
      },
    ],
  };

  const tableData = data.map((expense, index) => ({
    Amount: expense.amount,
    Category: expense.category,
    Date: DateTime.fromISO(expense.date).toFormat("dd LLL yyyy"),
  }));

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-opacity  ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 backdrop-filter backdrop-blur-3xl bg-black opacity-60"></div>
      <div className="bg-white p-4 rounded-lg w-90 max-w-screen-md relative">
        <h2 className="text-lg font-semibold mb-4">All Entries</h2>
        <div className=" flex items-center justify-center">
        {/* First Row - Table */}
        <div className="mb-4" >
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-dark-blue">
              <tr>
                <th className="py-2 px-2 whitespace-nowrap">Amount</th>
                <th className="py-2 px-2 whitespace-nowrap">Category</th>
                <th className="py-2 px-2 whitespace-nowrap">Date</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.map((expense, index) => (
                <tr key={index}>
                  <td className="py-2 px-2 whitespace-nowrap">{expense.amount}</td>
                  <td className="py-2 px-2 whitespace-nowrap">{expense.category}</td>
                  <td className="py-2 px-2 whitespace-nowrap">
                    {DateTime.fromISO(expense.date).toFormat("dd LLL yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Second Row - Pie Chart */}
        <div className="mt-4">
          <Pie data={pieChartData} />
        </div>
        </div>
        <div>
        <div className="mt-4">
          <CSVLink
            data={tableData}
            filename={"expense_data.csv"}
            className="bg-dark-blue text-light-gray rounded-md px-2 py-1"
          >
            Export CSV
          </CSVLink>
        </div>
          <button
            className="mt-4 bg-dark-blue text-light-gray rounded-md px-2 py-1"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
