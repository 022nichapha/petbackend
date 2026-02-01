const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
// ตรวจสอบว่าในโฟลเดอร์ middleware มีไฟล์ auth.js และส่งออก authenticateToken
const authenticateToken = require('../middleware/auth'); 

// Protected Routes (ต้องล็อกอิน)
router.post('/', authenticateToken, bookingController.createBooking); 
router.get('/', authenticateToken, bookingController.getAllBookings); 
// Public Route (ต้องวางก่อน ':id' เพื่อให้ไม่เกิด conflict)
router.get('/customer/:customerName', bookingController.getBookingsByCustomerName);

router.get('/:id', authenticateToken, bookingController.getBookingById); 
router.put('/:id', authenticateToken, bookingController.updateBooking); 
router.delete('/:id', authenticateToken, bookingController.deleteBooking); 
router.patch('/:id/status', authenticateToken, bookingController.updateBookingStatus); 

module.exports = router;