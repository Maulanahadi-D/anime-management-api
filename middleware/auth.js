// Simple API key authentication (optional)
const API_KEY = process.env.API_KEY || 'anime-management-secret-key-2024';

const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== API_KEY) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized: Invalid or missing API key'
        });
    }
    
    next();
};

// Basic logging middleware
const logger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    next();
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            error: 'Duplicate entry: Record already exists'
        });
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW') {
        return res.status(400).json({
            success: false,
            error: 'Invalid reference: Foreign key constraint failed'
        });
    }
    
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

// Not found middleware
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        error: `Cannot ${req.method} ${req.originalUrl} - Route not found`
    });
};

module.exports = { authenticate, logger, errorHandler, notFound };