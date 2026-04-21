const express = require('express');
const router = express.Router();
const { markAttendance, getCourseAttendance, verifyAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student', 'teacher', 'admin'), markAttendance);
router.get('/:courseId', protect, getCourseAttendance);
router.put('/:id/verify', protect, authorize('teacher', 'admin'), verifyAttendance);

module.exports = router;
