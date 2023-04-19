const express = require("express");
const router = express.Router();
const expense = require("../models/expenseSchema");

// Route 1: Add an expense for a user
router.post("/addexpense", async (req, res) => {
  try {
    const { amount, date, category } = req.body;
    const expense = new expense({
      amount,
      date,
      category,
    });
    const savedExpense = await expense.save();
    res.json(savedExpense);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Route 2: Get all expenses of a user
router.get("/expense", async (req, res) => {
  try {
    const expenses = await expense.find();
    res.json(expenses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Route 3: Get a specific expense of a user
router.get("/expense/:id", async (req, res) => {
  try {
    const expense = await expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "expense not found" });
    }
    res.json(expense);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Route 4: Delete an expense of a user
router.delete("/deleteexpense/:id", async (req, res) => {
  try {
    const expense = await expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: "expense not found" });
    }
    await expense.remove();
    res.json({ msg: "expense deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Route 5: EDIT an expense of a user
router.put("/editexpense/:id", async (req, res) => {
    try {
      const { amount, date, category } = req.body;
      let expense = await expense.findById(req.params.id);
      if (!expense) {
        return res.status(404).json({ error: "expense not found" });
      }
      expense.amount = amount;
      expense.date = date;
      expense.category = category;
      await expense.save();
      res.json(expense);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });

module.exports = router;
// Note: Authentication is not required for this router.