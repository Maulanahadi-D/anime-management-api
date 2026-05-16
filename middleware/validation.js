const Joi = require('joi');

// Validation schemas
const schemas = {
    // Anime validation
    anime: {
        create: Joi.object({
            title: Joi.string().required().max(100).messages({
                'string.empty': 'Title is required',
                'string.max': 'Title cannot exceed 100 characters'
            }),
            episodes: Joi.number().integer().min(1).max(9999).required(),
            studio: Joi.string().max(100).allow(null),
            release_year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
            genre_ids: Joi.array().items(Joi.number().integer())
        }),
        update: Joi.object({
            title: Joi.string().max(100),
            episodes: Joi.number().integer().min(1).max(9999),
            studio: Joi.string().max(100).allow(null),
            release_year: Joi.number().integer().min(1900).max(new Date().getFullYear()),
            genre_ids: Joi.array().items(Joi.number().integer())
        })
    },

    // Genre validation
    genre: {
        create: Joi.object({
            genre_name: Joi.string().required().max(50).messages({
                'string.empty': 'Genre name is required'
            })
        }),
        update: Joi.object({
            genre_name: Joi.string().max(50)
        })
    },

    // User validation
    user: {
        create: Joi.object({
            username: Joi.string().required().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/).messages({
                'string.empty': 'Username is required',
                'string.min': 'Username must be at least 3 characters',
                'string.pattern.base': 'Username can only contain letters, numbers, and underscore'
            }),
            email: Joi.string().required().email().max(100).messages({
                'string.empty': 'Email is required',
                'string.email': 'Must be a valid email address'
            }),
            password: Joi.string().required().min(6).max(100).messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters'
            })
        }),
        update: Joi.object({
            username: Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/),
            email: Joi.string().email().max(100),
            password: Joi.string().min(6).max(100)
        })
    },

    // Review validation
    review: {
        create: Joi.object({
            user_id: Joi.number().integer().required(),
            anime_id: Joi.number().integer().required(),
            rating: Joi.number().integer().min(1).max(10).required().messages({
                'number.min': 'Rating must be between 1 and 10',
                'number.max': 'Rating must be between 1 and 10'
            }),
            comment: Joi.string().max(1000).allow(null, '')
        }),
        update: Joi.object({
            rating: Joi.number().integer().min(1).max(10),
            comment: Joi.string().max(1000).allow(null, '')
        })
    },

    // Watchlist validation
    watchlist: {
        create: Joi.object({
            user_id: Joi.number().integer().required(),
            anime_id: Joi.number().integer().required(),
            status: Joi.string().valid('Plan to Watch', 'Watching', 'Completed').default('Plan to Watch')
        }),
        update: Joi.object({
            status: Joi.string().valid('Plan to Watch', 'Watching', 'Completed').required()
        })
    }
};

// Validation middleware factory
const validate = (schemaType, action) => {
    return (req, res, next) => {
        const schema = schemas[schemaType]?.[action];
        if (!schema) {
            return next();
        }

        const { error, value } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors
            });
        }

        req.body = value;
        next();
    };
};

module.exports = { validate, schemas };