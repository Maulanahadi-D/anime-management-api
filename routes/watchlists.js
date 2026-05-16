const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');

router.get('/', watchlistController.getAllWatchlists);
router.get('/user/:user_id', watchlistController.getWatchlistByUser);
router.post('/', watchlistController.createWatchlist);
router.put('/:id', watchlistController.updateWatchlist);
router.delete('/:id', watchlistController.deleteWatchlist);

module.exports = router;