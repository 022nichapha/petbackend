const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

// ตั้งค่าเส้นทาง
router.post('/register', authController.register);
router.post('/login', authController.login);
// เส้นทาง /me ป้องกันด้วย token
router.get('/me', authenticateToken, authController.getUser);

module.exports = router;