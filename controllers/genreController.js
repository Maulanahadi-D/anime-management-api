const db = require('../db/database');

// GET all genres
const getAllGenres = async (req, res) => {
    try {
        const [genres] = await db.query('SELECT * FROM genres ORDER BY genre_name');
        res.json({ success: true, data: genres });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET genre by ID
const getGenreById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [genre] = await db.query('SELECT * FROM genres WHERE id = ?', [id]);
        
        if (genre.length === 0) {
            return res.status(404).json({ error: 'Genre not found' });
        }
        
        // Get anime in this genre
        const [anime] = await db.query(`
            SELECT a.id, a.title, a.episodes, a.studio
            FROM anime a
            JOIN anime_genres ag ON a.id = ag.anime_id
            WHERE ag.genre_id = ?
        `, [id]);
        
        res.json({ 
            success: true, 
            data: {
                ...genre[0],
                anime_count: anime.length,
                anime_list: anime
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST create genre
const createGenre = async (req, res) => {
    try {
        const { genre_name } = req.body;
        
        // Check if genre already exists
        const [existing] = await db.query('SELECT id FROM genres WHERE genre_name = ?', [genre_name]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Genre already exists' });
        }
        
        const [result] = await db.query(
            'INSERT INTO genres (genre_name) VALUES (?)',
            [genre_name]
        );
        
        res.status(201).json({
            success: true,
            message: 'Genre created successfully',
            data: { id: result.insertId, genre_name }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT update genre
const updateGenre = async (req, res) => {
    try {
        const { id } = req.params;
        const { genre_name } = req.body;
        
        const [result] = await db.query(
            'UPDATE genres SET genre_name = ? WHERE id = ?',
            [genre_name, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Genre not found' });
        }
        
        res.json({ success: true, message: 'Genre updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE genre
const deleteGenre = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if genre is used by any anime
        const [used] = await db.query('SELECT id FROM anime_genres WHERE genre_id = ? LIMIT 1', [id]);
        if (used.length > 0) {
            return res.status(400).json({ error: 'Cannot delete genre that is used by anime' });
        }
        
        const [result] = await db.query('DELETE FROM genres WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Genre not found' });
        }
        
        res.json({ success: true, message: 'Genre deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllGenres,
    getGenreById,
    createGenre,
    updateGenre,
    deleteGenre
};