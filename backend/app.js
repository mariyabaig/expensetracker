// Load environment variables from the .env file
require("dotenv").config();

// Import the express package
const express = require('express')

// Create a new express application
const app = express()

// Import the mongoose package for database connections
const mongoose = require("mongoose");

// Connect to the database using the connection defined in ./db/connection.js
require("./db/connection");

// Import the expenseSchema model for expenses
const expenses = require("./models/expenseSchema");

// Import the incomeSchema model for income
const income = require("./models/incomeSchema");

// Import the cors package for cross-origin resource sharing
var cors = require("cors");

// Load the income routes
const Income = require("./routes/income");

// Load the expense routes
const Expense = require("./routes/expense");

// Define the port to listen on, using the environment variable or defaulting to 8000
const port = process.env.PORT || 8000;

// Enable CORS for all routes
app.use(cors())

// Use the income routes middleware
app.use(Income);

// Use the expense routes middleware
app.use(Expense);

// Define a route to handle requests to the root URL
app.get("/",(req,res)=>{
  res.json("server start")
})

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
