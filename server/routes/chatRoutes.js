const express = require('express');
const { getChats } = require('../controllers/chatController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateUser, getChats);

module.exports = router;
