document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Please log in to access the dashboard');
    window.location.href = 'login.html';
  }

  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  };

  async function fetchTotalExpense() {
    try {
      const response = await fetch('http://localhost:3000/api/expenses/total', {
        headers,
      });
      const data = await response.json();
      const totalAmount = data.total_amount ? parseFloat(data.total_amount) : 0;
      document.getElementById('total-expense-amount').textContent =
        totalAmount.toFixed(2);
    } catch (error) {
      console.error('Error fetching total expense:', error);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch('http://localhost:3000/api/categories', {
        headers,
      });
      const categories = await response.json();
      const categoryCards = document.getElementById('category-cards');
      const categoryFilter = document.getElementById('category-filter');

      categories.forEach((category) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-category-id', category.category_id);
        card.innerHTML = `
                    <h2>${category.category_name}</h2>
                    <p>$<span id="total-${category.category_id}">0.00</span></p>
                    <div class="three-dots">...</div>
                `;
        categoryCards.appendChild(card);

        const option = document.createElement('option');
        option.value = category.category_id;
        option.textContent = category.category_name;
        categoryFilter.appendChild(option);
      });

      fetchTotalForCategories(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async function fetchTotalForCategories(categories) {
    try {
      for (const category of categories) {
        const response = await fetch(
          `http://localhost:3000/api/categories/total?category_id=${category.category_id}`,
          { headers },
        );
        const data = await response.json();
        const totalAmount = data.total_amount
          ? parseFloat(data.total_amount)
          : 0;
        const totalElement = document.getElementById(
          `total-${category.category_id}`,
        );
        if (totalElement) {
          totalElement.textContent = totalAmount.toFixed(2);
        }
      }
    } catch (error) {
      console.error('Error fetching total for categories:', error);
    }
  }

  async function fetchSpendingSummary() {
    try {
      const response = await fetch(
        'http://localhost:3000/api/spending-summary',
        { headers },
      );
      const data = await response.json();

      const ctx = document.getElementById('spending-chart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.categories.map((cat) => cat.category_name),
          datasets: [
            {
              label: 'Amount Spent',
              data: data.categories.map(
                (cat) => parseFloat(cat.total_amount) || 0,
              ),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching spending summary:', error);
    }
  }

  async function fetchExpenses() {
    try {
      const response = await fetch('http://localhost:3000/api/expenses', {
        headers,
      });
      const expenses = await response.json();
      const expenseItems = document.getElementById('expense-items');
      expenseItems.innerHTML = ''; // Clear existing expenses

      expenses.forEach((expense) => {
        const amount = expense.amount ? parseFloat(expense.amount) : 0;
        const item = document.createElement('div');
        item.className = 'expense-item';
        item.setAttribute('data-expense-id', expense.expense_id);
        item.innerHTML = `
        <p class="element-width">${expense.description}</p>
                <p class="element-width">$${amount.toFixed(2)}</p>
                <p class="element-width">${new Date(expense.date).toLocaleDateString()}</p>
                    <button class="edit-btn element-width-btn">Edit</button>
                    <button class="delete-btn element-width-btn">Delete</button>
                `;
        expenseItems.appendChild(item);
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  }

  async function filterExpensesByCategory(categoryId) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/expenses?category_id=${categoryId}`,
        { headers },
      );
      const expenses = await response.json();
      const expenseItems = document.getElementById('expense-items');
      expenseItems.innerHTML = ''; // Clear existing expenses

      expenses.forEach((expense) => {
        const amount = expense.amount ? parseFloat(expense.amount) : 0;
        const item = document.createElement('div');
        item.className = 'expense-item';
        item.setAttribute('data-expense-id', expense.expense_id);
        item.innerHTML = `
        <p class="element-width">${expense.description}</p>
                <p class="element-width">$${amount.toFixed(2)}</p>
                <p class="element-width">${new Date(expense.date).toLocaleDateString()}</p>
                    <button class="edit-btn element-width-btn">Edit</button>
                    <button class="delete-btn element-width-btn">Delete</button>
                `;
        expenseItems.appendChild(item);
      });
    } catch (error) {
      console.error('Error filtering expenses by category:', error);
    }
  }

  async function deleteCategory(categoryId) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/categories/${categoryId}`,
        {
          method: 'DELETE',
          headers,
        },
      );
      const data = await response.json();
      if (response.ok) {
        document
          .querySelector(`.card[data-category-id="${categoryId}"]`)
          .remove();
        const option = document.querySelector(
          `#category-filter option[value="${categoryId}"]`,
        );
        if (option) {
          option.remove();
        }
        fetchTotalExpense();
        fetchSpendingSummary();
        fetchExpenses();
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }

  async function deleteExpense(expenseId) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/expenses/${expenseId}`,
        {
          method: 'DELETE',
          headers,
        },
      );
      const data = await response.json();
      if (response.ok) {
        document
          .querySelector(`.expense-item[data-expense-id="${expenseId}"]`)
          .remove();
        fetchTotalExpense();
        fetchSpendingSummary();
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  }

  async function editExpense(expenseId, amount, date, description) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/expenses/${expenseId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify({ amount, date, description }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        fetchExpenses();
        fetchTotalExpense();
        fetchSpendingSummary();
        alert('Expense updated successfully');
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error editing expense:', error);
    }
  }

  // Function to format date for display
  function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  document
    .getElementById('category-filter')
    .addEventListener('change', (event) => {
      const categoryId = event.target.value;
      if (categoryId === 'all') {
        fetchExpenses();
      } else {
        filterExpensesByCategory(categoryId);
      }
    });

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('three-dots')) {
      const categoryId = event.target
        .closest('.card')
        .getAttribute('data-category-id');
      if (categoryId) {
        deleteCategory(categoryId);
      }
    } else if (event.target.classList.contains('delete-btn')) {
      const expenseId = event.target
        .closest('.expense-item')
        .getAttribute('data-expense-id');
      if (expenseId) {
        deleteExpense(expenseId);
      }
    } else if (event.target.classList.contains('edit-btn')) {
      const expenseItem = event.target.closest('.expense-item');
      const expenseId = expenseItem.getAttribute('data-expense-id');
      const amount = prompt(
        'Enter new amount:',
        expenseItem.children[0].textContent.slice(1),
      );
      let date = prompt(
        'Enter new date (YYYY-MM-DD):',
        formatDateForDisplay(expenseItem.children[1].textContent),
      );
      const description = prompt(
        'Enter new description:',
        expenseItem.children[2].textContent,
      );

      if (expenseId && description && amount && date) {
        editExpense(expenseId, parseFloat(amount), date, description);
      }
    }
  });

  fetchTotalExpense();
  fetchCategories();
  fetchSpendingSummary();
  fetchExpenses();
  
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            localStorage.removeItem('token'); // Remove token from local storage
            window.location.href = 'index.html'; // Redirect to Home page
        } else {
            const errorMessage = await response.json();
            console.error('Logout failed:', errorMessage);
            alert('Logout failed');
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
});
  
});