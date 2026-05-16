const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/', statsController.getStatistics);
router.get('/users/:user_id', statsController.getUserStats);
router.get('/anime/:anime_id', statsController.getAnimeStats);

module.exports = router;