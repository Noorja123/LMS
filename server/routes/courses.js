const express = require('express');
const router = express.Router();
const { getCourses, createCourse, updateCourse, deleteCourse, enrollCourse, scheduleLecture } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getCourses)
  .post(protect, authorize('teacher', 'admin'), createCourse);

router.route('/:id')
  .put(protect, authorize('teacher', 'admin'), updateCourse)
  .delete(protect, authorize('teacher', 'admin'), deleteCourse);

router.post('/:id/enroll', protect, authorize('student'), enrollCourse);

router.post('/:id/schedule', protect, authorize('admin'), scheduleLecture);

module.exports = router;
