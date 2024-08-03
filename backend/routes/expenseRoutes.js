//expenseRoute.js

const express = require('express');
const router = express.Router();
const { getExpenses, addExpense, getSpendingSummary, addCategory, getCategories, getTotalExpense,
    getTotalForEachCategory,deleteCategory,deleteExpense, editExpense} = require('../controllers/expenseController');
const authenticate = require('../middleware/authenticate');

router.get('/expenses', authenticate, getExpenses);
router.post('/expenses', authenticate, addExpense);
router.post('/categories', authenticate, addCategory);
router.get('/categories', authenticate, getCategories);
router.get('/expenses/total', authenticate, getTotalExpense);
router.get('/spending-summary', authenticate, getSpendingSummary);
router.put('/expenses/:expense_id', authenticate, editExpense);
router.delete('/expenses/:expense_id', authenticate, deleteExpense);
router.get('/categories/total', authenticate, getTotalForEachCategory);
router.delete('/categories/:category_id', authenticate, deleteCategory);

module.exports = router;
