const db = require('../db/database');

// GET all anime with pagination and filters
const getAllAnime = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { studio, min_episodes, max_episodes, genre } = req.query;

        let query = `
            SELECT a.*, 
                   GROUP_CONCAT(g.genre_name) as genres
            FROM anime a
            LEFT JOIN anime_genres ag ON a.id = ag.anime_id
            LEFT JOIN genres g ON ag.genre_id = g.id
            WHERE 1=1
        `;
        let countQuery = 'SELECT COUNT(*) as total FROM anime a WHERE 1=1';
        const params = [];
        const countParams = [];

        if (studio) {
            query += ' AND a.studio = ?';
            countQuery += ' AND studio = ?';
            params.push(studio);
            countParams.push(studio);
        }
        if (min_episodes) {
            query += ' AND a.episodes >= ?';
            countQuery += ' AND episodes >= ?';
            params.push(min_episodes);
            countParams.push(min_episodes);
        }
        if (max_episodes) {
            query += ' AND a.episodes <= ?';
            countQuery += ' AND episodes <= ?';
            params.push(max_episodes);
            countParams.push(max_episodes);
        }

        query += ' GROUP BY a.id ORDER BY a.id LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [anime] = await db.query(query, params);
        const [[{ total }]] = await db.query(countQuery, countParams);

        res.json({
            success: true,
            data: anime,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET anime by ID
const getAnimeById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [anime] = await db.query(`
            SELECT a.*, 
                   GROUP_CONCAT(DISTINCT g.genre_name) as genres,
                   AVG(r.rating) as avg_rating,
                   COUNT(r.id) as total_reviews
            FROM anime a
            LEFT JOIN anime_genres ag ON a.id = ag.anime_id
            LEFT JOIN genres g ON ag.genre_id = g.id
            LEFT JOIN reviews r ON a.id = r.anime_id
            WHERE a.id = ?
            GROUP BY a.id
        `, [id]);

        if (anime.length === 0) {
            return res.status(404).json({ error: 'Anime not found' });
        }

        res.json({ success: true, data: anime[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST create new anime
const createAnime = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        const { title, episodes, studio, release_year, genre_ids } = req.body;
        
        const [result] = await connection.query(
            'INSERT INTO anime (title, episodes, studio, release_year) VALUES (?, ?, ?, ?)',
            [title, episodes, studio, release_year]
        );
        
        const animeId = result.insertId;
        
        // Insert genres
        if (genre_ids && genre_ids.length > 0) {
            const genreValues = genre_ids.map(genreId => [animeId, genreId]);
            await connection.query(
                'INSERT INTO anime_genres (anime_id, genre_id) VALUES ?',
                [genreValues]
            );
        }
        
        await connection.commit();
        
        res.status(201).json({
            success: true,
            message: 'Anime created successfully',
            data: { id: animeId, ...req.body }
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// PUT update anime
const updateAnime = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        const { id } = req.params;
        const { title, episodes, studio, release_year, genre_ids } = req.body;
        
        // Check if anime exists
        const [existing] = await connection.query('SELECT id FROM anime WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Anime not found' });
        }
        
        // Update anime
        await connection.query(
            'UPDATE anime SET title = ?, episodes = ?, studio = ?, release_year = ? WHERE id = ?',
            [title, episodes, studio, release_year, id]
        );
        
        // Update genres (delete existing and insert new)
        if (genre_ids) {
            await connection.query('DELETE FROM anime_genres WHERE anime_id = ?', [id]);
            const genreValues = genre_ids.map(genreId => [id, genreId]);
            await connection.query(
                'INSERT INTO anime_genres (anime_id, genre_id) VALUES ?',
                [genreValues]
            );
        }
        
        await connection.commit();
        
        res.json({
            success: true,
            message: 'Anime updated successfully'
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// DELETE anime
const deleteAnime = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        const { id } = req.params;
        
        // Delete related records first
        await connection.query('DELETE FROM anime_genres WHERE anime_id = ?', [id]);
        await connection.query('DELETE FROM reviews WHERE anime_id = ?', [id]);
        await connection.query('DELETE FROM watchlists WHERE anime_id = ?', [id]);
        await connection.query('DELETE FROM anime WHERE id = ?', [id]);
        
        await connection.commit();
        
        res.json({
            success: true,
            message: 'Anime deleted successfully'
        });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

module.exports = {
    getAllAnime,
    getAnimeById,
    createAnime,
    updateAnime,
    deleteAnime
};