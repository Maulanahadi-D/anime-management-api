const db = require('../db/database');

// Get comprehensive statistics
const getStatistics = async (req, res) => {
    try {
        // Total counts
        const [[totalAnime]] = await db.query('SELECT COUNT(*) as total FROM anime');
        const [[totalUsers]] = await db.query('SELECT COUNT(*) as total FROM users');
        const [[totalReviews]] = await db.query('SELECT COUNT(*) as total FROM reviews');
        const [[totalWatchlists]] = await db.query('SELECT COUNT(*) as total FROM watchlists');
        
        // Top rated anime
        const [topRated] = await db.query(`
            SELECT a.id, a.title, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
            FROM anime a
            JOIN reviews r ON a.id = r.anime_id
            GROUP BY a.id
            ORDER BY avg_rating DESC
            LIMIT 5
        `);
        
        // Most watched anime
        const [mostWatched] = await db.query(`
            SELECT a.id, a.title, COUNT(w.id) as watchlist_count,
                   SUM(CASE WHEN w.status = 'Completed' THEN 1 ELSE 0 END) as completed_count
            FROM anime a
            JOIN watchlists w ON a.id = w.anime_id
            GROUP BY a.id
            ORDER BY watchlist_count DESC
            LIMIT 5
        `);
        
        // Studio statistics
        const [studioStats] = await db.query(`
            SELECT studio, COUNT(*) as anime_count, AVG(episodes) as avg_episodes
            FROM anime
            WHERE studio IS NOT NULL
            GROUP BY studio
            ORDER BY anime_count DESC
            LIMIT 10
        `);
        
        // Genre popularity
        const [genreStats] = await db.query(`
            SELECT g.genre_name, COUNT(DISTINCT ag.anime_id) as anime_count,
                   AVG(r.rating) as avg_rating
            FROM genres g
            LEFT JOIN anime_genres ag ON g.id = ag.genre_id
            LEFT JOIN anime a ON ag.anime_id = a.id
            LEFT JOIN reviews r ON a.id = r.anime_id
            GROUP BY g.id
            ORDER BY anime_count DESC
        `);
        
        // Yearly anime releases
        const [yearlyStats] = await db.query(`
            SELECT release_year, COUNT(*) as anime_count
            FROM anime
            WHERE release_year IS NOT NULL
            GROUP BY release_year
            ORDER BY release_year DESC
        `);
        
        // User activity statistics
        const [userActivity] = await db.query(`
            SELECT u.username, COUNT(DISTINCT r.id) as review_count,
                   COUNT(DISTINCT w.id) as watchlist_count
            FROM users u
            LEFT JOIN reviews r ON u.id = r.user_id
            LEFT JOIN watchlists w ON u.id = w.user_id
            GROUP BY u.id
            ORDER BY review_count DESC
            LIMIT 10
        `);
        
        // Rating distribution
        const [ratingDistribution] = await db.query(`
            SELECT rating, COUNT(*) as count
            FROM reviews
            GROUP BY rating
            ORDER BY rating DESC
        `);
        
        // Watchlist status distribution
        const [statusDistribution] = await db.query(`
            SELECT status, COUNT(*) as count
            FROM watchlists
            GROUP BY status
        `);
        
        res.json({
            success: true,
            data: {
                overview: {
                    total_anime: totalAnime.total,
                    total_users: totalUsers.total,
                    total_reviews: totalReviews.total,
                    total_watchlist_entries: totalWatchlists.total
                },
                top_rated_anime: topRated,
                most_watched_anime: mostWatched,
                studio_statistics: studioStats,
                genre_popularity: genreStats,
                yearly_releases: yearlyStats,
                user_activity: userActivity,
                rating_distribution: ratingDistribution,
                watchlist_status: statusDistribution
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user-specific statistics
const getUserStats = async (req, res) => {
    try {
        const { user_id } = req.params;
        
        const [[userExists]] = await db.query('SELECT id FROM users WHERE id = ?', [user_id]);
        if (!userExists) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const [[reviewCount]] = await db.query(
            'SELECT COUNT(*) as total FROM reviews WHERE user_id = ?', [user_id]
        );
        
        const [[avgRating]] = await db.query(
            'SELECT AVG(rating) as avg_rating FROM reviews WHERE user_id = ?', [user_id]
        );
        
        const [watchlistStats] = await db.query(`
            SELECT status, COUNT(*) as count
            FROM watchlists
            WHERE user_id = ?
            GROUP BY status
        `, [user_id]);
        
        const [recentReviews] = await db.query(`
            SELECT r.*, a.title as anime_title
            FROM reviews r
            JOIN anime a ON r.anime_id = a.id
            WHERE r.user_id = ?
            ORDER BY r.id DESC
            LIMIT 10
        `, [user_id]);
        
        res.json({
            success: true,
            data: {
                user_id,
                total_reviews: reviewCount.total,
                average_rating: avgRating.avg_rating || 0,
                watchlist_summary: watchlistStats,
                recent_reviews: recentReviews
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get anime-specific statistics
const getAnimeStats = async (req, res) => {
    try {
        const { anime_id } = req.params;
        
        const [[animeExists]] = await db.query('SELECT id, title FROM anime WHERE id = ?', [anime_id]);
        if (!animeExists) {
            return res.status(404).json({ error: 'Anime not found' });
        }
        
        const [[ratingStats]] = await db.query(`
            SELECT AVG(rating) as avg_rating, 
                   MIN(rating) as min_rating,
                   MAX(rating) as max_rating,
                   COUNT(*) as total_reviews
            FROM reviews
            WHERE anime_id = ?
        `, [anime_id]);
        
        const [ratingBreakdown] = await db.query(`
            SELECT rating, COUNT(*) as count
            FROM reviews
            WHERE anime_id = ?
            GROUP BY rating
            ORDER BY rating DESC
        `, [anime_id]);
        
        const [watchlistStats] = await db.query(`
            SELECT status, COUNT(*) as count
            FROM watchlists
            WHERE anime_id = ?
            GROUP BY status
        `, [anime_id]);
        
        res.json({
            success: true,
            data: {
                anime: animeExists,
                ratings: ratingStats,
                rating_breakdown: ratingBreakdown,
                watchlist_stats: watchlistStats
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getStatistics,
    getUserStats,
    getAnimeStats
};