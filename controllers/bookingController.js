const Booking = require('../models/Booking');
const Service = require('../models/Service');

// สร้างการจองใหม่
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, customerName, phoneNumber, appointmentDate } = req.body;
    
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'ไม่พบบริการที่ระบุ' });
    
    const newBooking = new Booking({
      serviceId,
      customerId: req.userId, // เชื่อมโยงกับ ID จาก Token
      customerName,
      phoneNumber,
      appointmentDate,
      status: 'pending'
    });
    
    const savedBooking = await newBooking.save();
    const populatedBooking = await Booking.findById(savedBooking._id).populate('serviceId');
    
    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถสร้างการจองได้', error: error.message });
  }
};

// ดึงการจองทั้งหมดของผู้ใช้ที่ล็อกอิน
exports.getAllBookings = async (req, res) => {
  try {
    // ดึงเฉพาะรายการที่เป็นของ user คนนั้น
    const bookings = await Booking.find({ customerId: req.userId })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลการจองได้', error: error.message });
  }
};

// ดึงข้อมูลการจองตาม ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('serviceId');
    if (!booking) return res.status(404).json({ message: 'ไม่พบการจอง' });
    
    // ตรวจสอบว่าเป็นเจ้าของการจองจริงไหม
    if (booking.customerId?.toString() !== req.userId) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึงข้อมูลนี้' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// ปรับปรุงข้อมูลการจอง
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'ไม่พบการจอง' });
    if (booking.customerId?.toString() !== req.userId) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์แก้ไข' });
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('serviceId');
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// ลบการจอง
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'ไม่พบรายการ' });
    if (booking.customerId?.toString() !== req.userId) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์ลบ' });
    }
    
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบการจองเรียบร้อยแล้ว' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// อัปเดตสถานะการจอง (เช่น accepted / rejected / completed)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'กรุณาระบุสถานะ' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'ไม่พบการจอง' });

    // ตรวจเฉพาะเจ้าของรายการหรือผู้ที่มีสิทธิ์
    if (booking.customerId?.toString() !== req.userId) {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์แก้ไขสถานะ' });
    }

    booking.status = status;
    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถอัปเดตสถานะได้', error: error.message });
  }
};

// ค้นหาการจองตามชื่อผู้จอง (สาธารณะ)
exports.getBookingsByCustomerName = async (req, res) => {
  try {
    const name = req.params.customerName;
    const bookings = await Booking.find({ customerName: new RegExp(name, 'i') })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'ไม่สามารถค้นหาการจองได้', error: error.message });
  }
};