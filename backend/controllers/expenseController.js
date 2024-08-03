const db = require('../db');

// Add a new category

const addCategory = (req, res) => {
  const { category_name } = req.body;
  // console.log("User object: ", req.user); // Debugging line
  // const userId = req.user ? req.user.user_id : null;
  const userId = req.user.user_id;

  if (!category_name)
    return res.status(400).json({ error: 'Category name is required' });
  if (!userId)
    return res.status(403).json({ error: 'Forbidden: User not authenticated' });

  db.query(
    'INSERT INTO Categories (user_id, category_name) VALUES (?, ?)',
    [userId, category_name],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        message: 'Category added successfully',
        category_id: results.insertId,
      });
    },
  );
};

// Add a new expense
const addExpense = (req, res) => {
  const { category_id, amount, date, description } = req.body;
  const userId = req.user.user_id;
  db.query(
    'INSERT INTO Expenses (user_id, category_id, amount, date, description) VALUES (?, ?, ?, ?, ?)',
    [userId, category_id, amount, date, description],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Expense added successfully' });
    },
  );
};

// _________________________________________DASHBOARD___________________________________

// Get spending summary for the logged-in user

const getSpendingSummary = (req, res) => {
  const userId = req.user.user_id;
  db.query(
    `
        SELECT c.category_name, SUM(e.amount) AS total_amount
        FROM Expenses e
        JOIN Categories c ON e.category_id = c.category_id
        WHERE e.user_id = ?
        GROUP BY c.category_name
        `,
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ categories: results });
    },
  );
};

// Get all expenses On dashboard for the logged-in user
const getExpenses = (req, res) => {
  const userId = req.user.user_id;
  const categoryId = req.query.category_id;

  let query = 'SELECT * FROM Expenses WHERE user_id = ?';
  const params = [userId];

  if (categoryId) {
    query += ' AND category_id = ?';
    params.push(categoryId);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};
//get total of all expenses
const getTotalExpense = (req, res) => {
  const userId = req.user.user_id;
  db.query(
    'SELECT SUM(amount) AS total_amount FROM Expenses WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results[0]);
    },
  );
};

// Get all categories
const getCategories = (req, res) => {
  const userId = req.user.user_id;
  db.query(
    'SELECT * FROM Categories WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
    },
  );
};

//Get Total  categories for each
const getTotalForEachCategory = (req, res) => {
  const userId = req.user.user_id;
  const categoryId = req.query.category_id;
  db.query(
    'SELECT SUM(amount) AS total_amount FROM expenses WHERE user_id = ? and  category_id= ?',
    [userId, categoryId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results[0]);
    },
  );
};

// Delete category and its associated expenses
const deleteCategory = (req, res) => {
  const categoryId = req.params.category_id;
  const userId = req.user.user_id;

  db.query(
    'DELETE FROM expenses WHERE user_id = ? AND category_id = ?',
    [userId, categoryId],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      db.query(
        'DELETE FROM categories WHERE user_id = ? AND category_id = ?',
        [userId, categoryId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });
          res
            .status(200)
            .json({
              message: 'Category and associated expenses deleted successfully',
            });
        },
      );
    },
  );
};

// delete expenses from list on dashboard

const deleteExpense = (req, res) => {
  const expenseId = req.params.expense_id;
  const userId = req.user.user_id; // Ensure you are using authentication and the user ID is available

  db.query(
    'DELETE FROM expenses WHERE expense_id = ? AND user_id = ?',
    [expenseId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json('Error deleting expense..');
      }
      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({
            error: 'Expense not found or not authorized to delete this expense',
          });
      }
      res.status(200).json({ message: 'Expense deleted successfully' });
    },
  );
};
// Edit Expense
const editExpense = (req, res) => {
  const expenseId = req.params.expense_id;
    const userId = req.user.user_id; // Ensure you are using authentication and the user ID is available
    const { amount, date, description } = req.body;

  db.query(
    'UPDATE expenses SET  amount=? ,date= ?, description =? WHERE expense_id = ? AND user_id = ?',
    [amount, date, description, expenseId, userId],
    (err, results) => {
      if (err) {
        return res.status(500).json('Error updating expense..');
      }
      res.status(200).json({ message: 'Expense Updated successfully' });
    },
  );
};

// Other controller functions...

module.exports = {
  addCategory,
  getCategories,
  addExpense,
  getExpenses,
  getSpendingSummary,
  getTotalExpense,
  getTotalForEachCategory,
  deleteCategory,
  deleteExpense,
  editExpense,
};
