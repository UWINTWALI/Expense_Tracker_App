require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', expenseRoutes);

// Add Session Middleware
const session = require('express-session'); 

app.use(session({
    secret: process.env.SECRET_ACCESS_KEY,//your_secret_key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Use true in production with HTTPS
}));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

