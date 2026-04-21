const Course = require('../models/Course');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all courses
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('teacherId', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
const createCourse = async (req, res) => {
  const { title, description } = req.body;
  try {
    const course = new Course({
      title,
      description,
      teacherId: req.user.id
    });
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this course' });
    }
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.teacherId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    course.students.push(req.user.id);
    await course.save();
    res.json({ message: 'Successfully enrolled', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Schedule a lecture and notify teacher
// @route   POST /api/courses/:id/schedule
const scheduleLecture = async (req, res) => {
  const { timing } = req.body;
  if (!timing) return res.status(400).json({ message: 'Timing is required' });
  
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    const notification = new Notification({
      userId: course.teacherId,
      message: `Admin scheduled a lecture for ${course.title} at ${new Date(timing).toLocaleString()}`,
      type: 'lecture'
    });
    await notification.save();
    
    const io = req.app.get('io');
    if (io) {
      io.emit(`notification_${course.teacherId}`, { message: notification.message, type: 'lecture' });
    }
    
    res.json({ message: 'Lecture scheduled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCourses, createCourse, updateCourse, deleteCourse, enrollCourse, scheduleLecture };
