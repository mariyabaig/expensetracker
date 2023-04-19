const express = require("express");
const router = express.Router();
const income = require("../models/incomeSchema");

// Route 1: Add an income for a user
router.post("/addincome", async (req, res) => {
  try {
    const { amount, date, category } = req.body;
    const income = new income({
      amount,
      date,
      category,
    });
    const savedIncome = await income.save();
    res.json(savedIncome);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Route 2: Get all incomes of a user
router.get("/income", async (req, res) => {
  try {
    const incomes = await income.find();
    res.json(incomes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Route 3: Get a specific income of a user
router.get("/income/:id", async (req, res) => {
  try {
    const income = await income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ error: "income not found" });
    }
    res.json(income);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Route 4: Delete an income of a user
router.delete("/deleteincome/:id", async (req, res) => {
  try {
    const income = await income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ error: "income not found" });
    }
    await income.remove();
    res.json({ msg: "income deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// Route 5: EDIT an income of a user
router.put("/editincome/:id", async (req, res) => {
    try {
      const { amount, date, category } = req.body;
      let income = await income.findById(req.params.id);
      if (!income) {
        return res.status(404).json({ error: "income not found" });
      }
      income.amount = amount;
      income.date = date;
      income.category = category;
      await income.save();
      res.json(income);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  });

module.exports = router;
