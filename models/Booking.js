const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    status: { type: String, default: 'pending' },
    // เก็บข้อมูลผู้จอง (อ้างอิงผู้ใช้)
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // การสร้างความสัมพันธ์ (Reference) ไปยัง Services
    serviceId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service', 
        required: true 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);