const db = require('../db/database');

// GET all reviews with filters
const getAllReviews = async (req, res) => {
    try {
        const { anime_id, user_id, min_rating } = req.query;
        let query = `
            SELECT r.*, u.username, a.title as anime_title
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN anime a ON r.anime_id = a.id
            WHERE 1=1
        `;
        const params = [];

        if (anime_id) {
            query += ' AND r.anime_id = ?';
            params.push(anime_id);
        }
        if (user_id) {
            query += ' AND r.user_id = ?';
            params.push(user_id);
        }
        if (min_rating) {
            query += ' AND r.rating >= ?';
            params.push(min_rating);
        }

        query += ' ORDER BY r.id DESC';
        
        const [reviews] = await db.query(query, params);
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST create review
const createReview = async (req, res) => {
    try {
        const { user_id, anime_id, rating, comment } = req.body;
        
        // Check if user already reviewed this anime
        const [existing] = await db.query(
            'SELECT id FROM reviews WHERE user_id = ? AND anime_id = ?',
            [user_id, anime_id]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'User already reviewed this anime' });
        }
        
        const [result] = await db.query(
            'INSERT INTO reviews (user_id, anime_id, rating, comment) VALUES (?, ?, ?, ?)',
            [user_id, anime_id, rating, comment]
        );
        
        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: { id: result.insertId, ...req.body }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT update review
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        
        const [result] = await db.query(
            'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
            [rating, comment, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        
        res.json({ success: true, message: 'Review updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE review
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.query('DELETE FROM reviews WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }
        
        res.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllReviews,
    createReview,
    updateReview,
    deleteReview
};