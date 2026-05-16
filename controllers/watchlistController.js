const db = require('../db/database');

// GET all watchlists with filters
const getAllWatchlists = async (req, res) => {
    try {
        const { user_id, status } = req.query;
        let query = `
            SELECT w.*, u.username, a.title as anime_title
            FROM watchlists w
            JOIN users u ON w.user_id = u.id
            JOIN anime a ON w.anime_id = a.id
            WHERE 1=1
        `;
        const params = [];

        if (user_id) {
            query += ' AND w.user_id = ?';
            params.push(user_id);
        }
        if (status) {
            query += ' AND w.status = ?';
            params.push(status);
        }

        query += ' ORDER BY w.id DESC';
        
        const [watchlists] = await db.query(query, params);
        res.json({ success: true, data: watchlists });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET watchlist by user
const getWatchlistByUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        
        const [watchlists] = await db.query(`
            SELECT w.*, a.title, a.episodes, a.studio, a.release_year,
                   (SELECT AVG(rating) FROM reviews WHERE anime_id = a.id) as avg_rating
            FROM watchlists w
            JOIN anime a ON w.anime_id = a.id
            WHERE w.user_id = ?
            ORDER BY FIELD(w.status, 'Watching', 'Plan to Watch', 'Completed')
        `, [user_id]);
        
        // Group by status
        const grouped = {
            watching: watchlists.filter(w => w.status === 'Watching'),
            plan_to_watch: watchlists.filter(w => w.status === 'Plan to Watch'),
            completed: watchlists.filter(w => w.status === 'Completed')
        };
        
        res.json({ 
            success: true, 
            data: {
                total: watchlists.length,
                grouped,
                all: watchlists
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST create watchlist entry
const createWatchlist = async (req, res) => {
    try {
        const { user_id, anime_id, status } = req.body;
        
        // Check if already in watchlist
        const [existing] = await db.query(
            'SELECT id FROM watchlists WHERE user_id = ? AND anime_id = ?',
            [user_id, anime_id]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Anime already in watchlist' });
        }
        
        const [result] = await db.query(
            'INSERT INTO watchlists (user_id, anime_id, status) VALUES (?, ?, ?)',
            [user_id, anime_id, status || 'Plan to Watch']
        );
        
        res.status(201).json({
            success: true,
            message: 'Added to watchlist successfully',
            data: { id: result.insertId, user_id, anime_id, status: status || 'Plan to Watch' }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT update watchlist status
const updateWatchlist = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const [result] = await db.query(
            'UPDATE watchlists SET status = ? WHERE id = ?',
            [status, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Watchlist entry not found' });
        }
        
        res.json({ success: true, message: 'Watchlist updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE watchlist entry
const deleteWatchlist = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.query('DELETE FROM watchlists WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Watchlist entry not found' });
        }
        
        res.json({ success: true, message: 'Removed from watchlist successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllWatchlists,
    getWatchlistByUser,
    createWatchlist,
    updateWatchlist,
    deleteWatchlist
};