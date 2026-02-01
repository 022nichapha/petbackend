const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// 1. ดึงรายการบริการทั้งหมด
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. เพิ่มรายการบริการใหม่
router.post('/', async (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  if (!name || !description || !price || !imageUrl) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
  }
  
  try {
    const service = new Service({ name, description, price, imageUrl });
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. แก้ไขข้อมูลบริการ
router.put('/:id', async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedService) return res.status(404).json({ message: 'ไม่พบรายการบริการ' });
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. ลบรายการบริการ
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'ไม่พบรายการที่ต้องการลบ' });
    res.json({ message: 'ลบรายการบริการเรียบร้อยแล้ว' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;