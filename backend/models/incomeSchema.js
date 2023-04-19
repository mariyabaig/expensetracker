const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: false,
    },
    
});

const income = new mongoose.model("income",incomeSchema);