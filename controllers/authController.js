const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. สมัครสมาชิก
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'กรุณากรอก username, email และ password ให้ครบถ้วน' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
    }

    // Check existing
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: 'ชื่อผู้ใช้หรืออีเมลมีผู้ใช้งานแล้ว' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Log success summary (no sensitive data)
    console.log(`New user registered: ${newUser._id} (${newUser.email})`);

    res.status(201).json({ 
      message: 'สมัครสมาชิกสำเร็จ',
      user: { id: newUser._id, username: newUser.username, email: newUser.email }
    });
  } catch (err) {
    // Better error reporting
    console.error('Register error:', err);

    // Duplicate key error (unique constraint)
    if (err.code === 11000) {
      return res.status(409).json({ message: 'ชื่อผู้ใช้หรืออีเมลมีผู้ใช้งานแล้ว', error: err.message });
    }

    // Return generic error for other cases
    res.status(500).json({ message: 'ไม่สามารถสมัครสมาชิกได้', error: err.message });
  }
};

// 2. เข้าสู่ระบบ
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key-default',
      { expiresIn: '7d' }
    );
    res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ', token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'ไม่สามารถเข้าสู่ระบบได้', error: err.message });
  }
};

// 3. ดึงข้อมูลผู้ใช้
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ใช้' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้', error: err.message });
  }
};
