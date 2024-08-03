
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401).json({ error: 'Unauthorized' });// Unauthorized

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, decoded) => {
        if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
        req.user = { user_id: decoded.user_id }; // user should contain user details
        next();
    });
};

module.exports = authenticate;





