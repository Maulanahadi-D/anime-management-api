const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authenticateToken = require('./middleware/auth'); // middleware autentikasi
const authRoutes = require('./routes/auth');           // route login/logout
const animeRoutes = require('./routes/anime');
const genreRoutes = require('./routes/genres');
const userRoutes = require('./routes/users');
const reviewRoutes = require('./routes/reviews');
const watchlistRoutes = require('./routes/watchlists');
const statsRoutes = require('./routes/stats');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Anime Management API is running' });
});
app.use('/api/auth', authRoutes);
app.use(authenticateToken);

app.use('/api/anime', animeRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/watchlists', watchlistRoutes);
app.use('/api/stats', statsRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;