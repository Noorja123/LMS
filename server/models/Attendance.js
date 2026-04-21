const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], required: true },
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
