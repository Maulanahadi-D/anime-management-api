const jwt = require('jsonwebtoken');
const db = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_anime_2024';

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token tidak disertakan' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Opsional: cek token di database (agar bisa di-revoke saat logout)
        const [rows] = await db.query(
            'SELECT * FROM auth_tokens WHERE token = ? AND (expires_at IS NULL OR expires_at > NOW())',
            [token]
        );
        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Token tidak valid atau sudah kadaluarsa' });
        }

        req.user = { id: decoded.userId, username: decoded.username };
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Token tidak sah' });
    }
};

module.exports = authenticateToken;