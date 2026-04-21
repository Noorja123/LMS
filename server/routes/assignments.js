const express = require('express');
const router = express.Router();
const { getAssignments, createAssignment, getStudentAssignments } = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/student/me', protect, authorize('student'), getStudentAssignments);

router.route('/:courseId')
  .get(protect, getAssignments)
  .post(protect, authorize('teacher', 'admin'), createAssignment);

module.exports = router;
