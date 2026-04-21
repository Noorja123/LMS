const express = require('express');
const router = express.Router();
const { getLectures, createLecture } = require('../controllers/lectureController');
const { protect, authorize } = require('../middleware/auth');

router.route('/:courseId')
  .get(protect, getLectures)
  .post(protect, authorize('teacher', 'admin'), createLecture);

module.exports = router;
