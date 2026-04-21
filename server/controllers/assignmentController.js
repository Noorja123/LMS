const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

// @desc    Get assignments for a course
// @route   GET /api/assignments/:courseId
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ courseId: req.params.courseId });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all assignments for enrolled courses
// @route   GET /api/assignments/student/me
const getStudentAssignments = async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user.id });
    const courseIds = courses.map(c => c._id);
    // Populate courseId so we can show course title
    const assignments = await Assignment.find({ courseId: { $in: courseIds } }).populate('courseId', 'title');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an assignment
// @route   POST /api/assignments
const createAssignment = async (req, res) => {
  const { title, description, dueDate } = req.body;
  const courseId = req.params.courseId;
  try {
    const assignment = new Assignment({
      title,
      description,
      courseId,
      dueDate,
      createdBy: req.user.id
    });
    const createdAssignment = await assignment.save();
    
    const course = await Course.findById(courseId);
    if (course && course.students.length > 0) {
      const notifications = course.students.map(studentId => ({
        userId: studentId,
        message: `New assignment posted: ${title} in course ${course.title}`,
        type: 'assignment'
      }));
      await Notification.insertMany(notifications);

      const io = req.app.get('io');
      if (io) {
        course.students.forEach(studentId => {
          io.emit(`notification_${studentId}`, { message: `New assignment: ${title}`, type: 'assignment' });
        });
      }
    }
    
    res.status(201).json(createdAssignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAssignments, createAssignment, getStudentAssignments };
