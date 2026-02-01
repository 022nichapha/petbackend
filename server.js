require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// 2. Import Routes (แก้ไข Path ให้ถูกต้อง)
// ต้องมั่นใจว่าคุณสร้างไฟล์ authRoutes.js ไว้ในโฟลเดอร์ routes แล้ว
const authRoutes = require('./routes/authRoutes'); 
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

const app = express();

// 3. เชื่อมต่อฐานข้อมูล
connectDB();

// 4. Middlewares
app.use(cors());
app.use(express.json());
// Serve uploaded files
const uploadPath = process.env.UPLOAD_PATH || './uploads';
app.use('/uploads', express.static(path.resolve(uploadPath)));

// 5. Routes Definition
// ระบบจะตรวจสอบว่าไฟล์ Router ที่ Import มาพร้อมใช้งานหรือไม่
if (authRoutes) app.use('/api/auth', authRoutes);
if (serviceRoutes) app.use('/api/services', serviceRoutes);
if (bookingRoutes) app.use('/api/bookings', bookingRoutes);
if (uploadRoutes) app.use('/api/uploads', uploadRoutes);

// 6. Global Error Handler
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.stack);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
});

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is flying on port ${PORT}`);
    console.log(`📌 API Base URL: http://localhost:${PORT}/api`);
});