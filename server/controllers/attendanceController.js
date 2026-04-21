const Attendance = require('../models/Attendance');

// @desc    Mark attendance
const markAttendance = async (req, res) => {
  const { courseId, studentId, date, status } = req.body;
  try {
    const existing = await Attendance.findOne({ courseId, studentId, date: { $gte: new Date(new Date(date).setHours(0,0,0,0)), $lt: new Date(new Date(date).setHours(23,59,59,999)) } });
    if(existing) return res.status(400).json({ message: "Attendance already marked for today" });

    const attendance = new Attendance({ courseId, studentId, date, status, verified: false });
    const created = await attendance.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get course attendance
const getCourseAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ courseId: req.params.courseId }).populate('studentId', 'name email');
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Attendance
const verifyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) return res.status(404).json({ message: 'Record not found' });
    
    attendance.verified = true;
    await attendance.save();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { markAttendance, getCourseAttendance, verifyAttendance };
