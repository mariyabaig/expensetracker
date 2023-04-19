require("dotenv").config();
const express = require('express')
const app = express()
const mongoose = require("mongoose");
require("./db/connection");


const port = process.env.PORT || 8000;

app.get("/",(req,res)=>{
  res.json("server start")})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})