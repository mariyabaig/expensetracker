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

