const Service = require('../models/Service');

// 1. ดึงข้อมูลบริการทั้งหมด
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลบริการได้', error: error.message });
    }
};

// 2. ดึงข้อมูลบริการตาม ID
exports.getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'ไม่พบข้อมูลบริการนี้' });
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล', error: error.message });
    }
};

// 3. เพิ่มบริการใหม่
exports.createService = async (req, res) => {
    try {
        const { name, description, price, imageUrl, category } = req.body;
        const newService = new Service({ name, description, price, imageUrl, category });
        await newService.save();
        res.status(201).json({ message: 'เพิ่มบริการสำเร็จ', service: newService });
    } catch (error) {
        res.status(400).json({ message: 'ไม่สามารถเพิ่มบริการได้', error: error.message });
    }
};

// 4. ลบบริการ
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ message: 'ไม่พบข้อมูลบริการที่ต้องการลบ' });
        res.status(200).json({ message: 'ลบบริการเรียบร้อยแล้ว' });
    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
};