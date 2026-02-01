const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // ดึงค่า MONGO_URI จาก .env มาใช้งาน
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // ปิดแอปพลิเคชันหากเชื่อมต่อฐานข้อมูลไม่ได้
    }
};

module.exports = connectDB;