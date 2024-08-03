document.addEventListener('DOMContentLoaded', function () {
    
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const paraMsg = document.getElementById('para-msg');
        // const confirmPassword = document.getElementById('confirmPassword').value;
    
        // if (password !== confirmPassword) {
        //     alert('Passwords do not match');
        //     return;
        // }

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
        
            if (response.ok) {
                paraMsg.textContent = 'User registered Successfully!';
                window.location.href = 'login.html';
            } else {
                const errorData = await response.json();
                alert(errorData.error);
                paraMsg.textContent = 'Data Error!';
            }
        } catch (error) {
            paraMsg.textContent='Error Occured!'
            console.error('Error:', error);
        }
    });

});