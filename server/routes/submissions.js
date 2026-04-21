const express = require('express');
const router = express.Router();
const { getSubmissions, submitAssignment, gradeSubmission } = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');

router.route('/:assignmentId')
  .get(protect, authorize('teacher', 'admin'), getSubmissions)
  .post(protect, authorize('student'), submitAssignment);

router.put('/:id/grade', protect, authorize('teacher', 'admin'), gradeSubmission);

module.exports = router;
