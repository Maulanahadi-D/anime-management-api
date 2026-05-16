const db = require('../db/database');

// GET all users
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, username, email FROM users ORDER BY id');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [user] = await db.query('SELECT id, username, email FROM users WHERE id = ?', [id]);
        
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Get user's reviews
        const [reviews] = await db.query(`
            SELECT r.*, a.title as anime_title
            FROM reviews r
            JOIN anime a ON r.anime_id = a.id
            WHERE r.user_id = ?
        `, [id]);
        
        // Get user's watchlist
        const [watchlist] = await db.query(`
            SELECT w.*, a.title, a.episodes, a.studio
            FROM watchlists w
            JOIN anime a ON w.anime_id = a.id
            WHERE w.user_id = ?
        `, [id]);
        
        res.json({ 
            success: true, 
            data: {
                ...user[0],
                total_reviews: reviews.length,
                total_watchlist: watchlist.length,
                recent_reviews: reviews.slice(0, 5),
                watchlist: watchlist
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST create user
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if email already exists
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        // Check if username already exists
        const [existingUser] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        
        const [result] = await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, password]
        );
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { id: result.insertId, username, email }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        
        const [result] = await db.query(
            'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
            [username, email, password, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Delete related records first
        await db.query('DELETE FROM reviews WHERE user_id = ?', [id]);
        await db.query('DELETE FROM watchlists WHERE user_id = ?', [id]);
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};