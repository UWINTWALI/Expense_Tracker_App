document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const paraMsg= document.getElementById('para-msg');

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // OR  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            console.error('Login failed:', errorMessage);
            alert('Login failed');
            return;
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        alert('Login successful');
        window.location.href = 'expense.html';
    } catch (error) {
        // console.error('Error:', error);
        paraMsg.textContent = 'Error Occured!';
    }
});
