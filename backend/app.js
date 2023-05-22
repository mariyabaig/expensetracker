require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./db/connection");
const expenses = require("./models/expenseSchema");
const Income = require("./models/incomeSchema");
const User = require("./models/userSchema")
var cors = require("cors");
const expense = require("./routes/expense");
const auth = require("./routes/auth")
const income = require("./routes/income")

const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

// app.use('/register',require('./routes/router'))
app.get("/",(req,res)=>{
    res.json("server start")
})

 app.use(expense)
 app.use(auth)
 app.use(income)

app.listen (port, ()=>{
console.log(`server is start port number ${port}`);
});


// // Load environment variables from the .env file
// require("dotenv").config();

// // Import the express package
// const express = require('express')

// // Create a new express application
// const app = express()

// // Import the mongoose package for database connections
// const mongoose = require("mongoose");

// // Connect to the database using the connection defined in ./db/connection.js
// require("./db/connection");

// // Import the expenseSchema model for expenses
// const expenses = require("./models/expenseSchema");

// // Import the incomeSchema model for income
// const income = require("./models/incomeSchema");

// // Import the cors package for cross-origin resource sharing
// var cors = require("cors");

// // Load the income routes
// const Income = require("./routes/income");

// // Load the expense routes
// const Expense = require("./routes/expense");
// const auth = require("./routes/auth")
// // Define the port to listen on, using the environment variable or defaulting to 8000
// const port = process.env.PORT || 8000;

// // Enable CORS for all routes
// app.use(cors())

// // Use the income routes middleware
// app.use(Income);

// // Use the expense routes middleware
// app.use(Expense);
// app.use(auth)
// // Define a route to handle requests to the root URL
// app.get("/",(req,res)=>{
//   res.json("server start")
// })




// // Start the server and listen on the specified port
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
