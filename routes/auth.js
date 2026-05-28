const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_anime_2024';

// REGISTER - membuat user baru (public)
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'Semua field harus diisi' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password minimal 6 karakter' });
    }

    try {
        // Cek duplikat username
        const [existingUser] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(409).json({ success: false, message: 'Username sudah digunakan' });
        }
        // Cek duplikat email
        const [existingEmail] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingEmail.length > 0) {
            return res.status(409).json({ success: false, message: 'Email sudah digunakan' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        // Buat token langsung
        const token = jwt.sign(
            { userId: result.insertId, username: username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        await db.query(
            'INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
            [result.insertId, token]
        );

        res.status(201).json({
            success: true,
            message: 'Registrasi berhasil',
            token,
            user: { id: result.insertId, username, email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
});

// LOGIN - public
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password diperlukan' });
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Username atau password salah' });
        }
        const user = users[0];

        // Kompatibilitas: cek apakah password di database sudah hash bcrypt ($2b$)
        let isValid = false;
        if (user.password.startsWith('$2b$')) {
            isValid = await bcrypt.compare(password, user.password);
        } else {
            // password masih plain text (user lama), bandingkan langsung
            isValid = (password === user.password);
            if (isValid) {
                // Upgrade ke hash untuk keamanan
                const hashed = await bcrypt.hash(password, 10);
                await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id]);
            }
        }

        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Username atau password salah' });
        }

        const token = jwt.sign(
            { userId: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        await db.query(
            'INSERT INTO auth_tokens (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))',
            [user.id, token]
        );

        res.json({ success: true, message: 'Login berhasil', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
    }
});

// LOGOUT - hapus token (wajib token)
router.post('/logout', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        await db.query('DELETE FROM auth_tokens WHERE token = ?', [token]);
    }
    res.json({ success: true, message: 'Logout berhasil' });
});

module.exports = router;