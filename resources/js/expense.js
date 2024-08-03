document.addEventListener('DOMContentLoaded', async () => {
  // Fetch categories and populate the category select

  const newCategory = document.getElementById('new-category');
  const helpMsg=document.getElementById('help-msg');
  newCategory.addEventListener('focus', function () {
    helpMsg.classList.add('help-msg-visible');
  });
  newCategory.addEventListener('blur', function () {
    helpMsg.classList.remove('help-msg-visible')
  });


  async function loadCategories() {
      try {
          const response = await fetch('http://localhost:3000/api/categories', {
              method: 'GET',
              headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
          });
          if (!response.ok) throw new Error('Failed to fetch categories');

          const categories = await response.json();
          const categorySelect = document.getElementById('category-select');
          categorySelect.innerHTML = '';

          categories.forEach(category => {
              const option = document.createElement('option');
              option.value = category.category_id;
              option.textContent = category.category_name;
              categorySelect.appendChild(option);
          });
      } catch (error) {
          console.error('Error loading categories:', error);
      }
  }

  loadCategories();

  //Handle form submission for adding category
  document
    .getElementById('category-form')
    .addEventListener('submit', async (event) => {
      event.preventDefault();

      const newCategory = document.getElementById('new-category').value.trim(); // Trim whitespace
      const paraMsg = document.getElementById('para-msg');

      try {
        const response = await fetch('http://localhost:3000/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify({ category_name: newCategory }), /// This should work if newCategory is defined
        });
          const token = localStorage.getItem('token');
          console.log('Token:', token);

        if (response.status !== 201) {
          const errorMessage = await response.text(); // Get the error message from the response
          console.error('Failed to add category:', errorMessage);
          paraMsg.textContent = 'Failed to add category';
          return; // Exit the function early
        }

        alert('Category added successfully');
        document.getElementById('category-form').reset();
        loadCategories(); // Assuming this function loads the updated categories
      } catch (error) {
        console.error('Error adding category:', error);
        paraMsg.textContent = 'An error occurred while adding the category';
      }
    });

  // Handle form submission for adding expense
  document
    .getElementById('expense-form')
    .addEventListener('submit', async (event) => {
      event.preventDefault();

      const categorySelect = document.getElementById('category-select');
      const category_id = categorySelect.value;
      const amount = document.getElementById('amount').value;
      const date = document.getElementById('date').value;
      const description = document.getElementById('description').value;

      try {
        const response = await fetch('http://localhost:3000/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
          body: JSON.stringify({ category_id, amount, date, description }),
        });

        if (!response.ok) throw new Error('Failed to add expense');

        alert('Expense added successfully');
        document.getElementById('expense-form').reset();
        loadCategories();
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    });
});
