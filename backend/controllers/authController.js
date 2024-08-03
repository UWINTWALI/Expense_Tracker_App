const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO Users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User registered successfully! ' });
    });
};


const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [results] = await db.promise().query('SELECT * FROM Users WHERE email = ?', [email]);
        if (results.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ user_id: user.user_id }, process.env.SECRET_ACCESS_KEY, { expiresIn: '1h' });
        
        res.cookie('token', token, { httpOnly: true, path: '/' }); // Ensure the path is '/'
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const logoutHandler = (req, res) => {
    res.clearCookie('token', { httpOnly: true, path: '/' }); // Ensure the path is '/'
    res.status(200).json({ message: 'Logout successful' });
};

module.exports = { register, login, logoutHandler };
