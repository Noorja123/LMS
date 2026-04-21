const Lecture = require('../models/Lecture');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

// @desc    Get lectures for a course
// @route   GET /api/courses/:courseId/lectures
const getLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ courseId: req.params.courseId });
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload lecture
// @route   POST /api/courses/:courseId/lectures
const createLecture = async (req, res) => {
  const { title, videoUrl, pdfUrl } = req.body;
  try {
    const lecture = new Lecture({
      title,
      courseId: req.params.courseId,
      videoUrl,
      pdfUrl
    });
    const createdLecture = await lecture.save();
    
    const course = await Course.findById(req.params.courseId);
    if (course && course.students.length > 0) {
      const notifications = course.students.map(studentId => ({
        userId: studentId,
        message: `New lecture added: ${title} in course ${course.title}`,
        type: 'lecture'
      }));
      await Notification.insertMany(notifications);

      const io = req.app.get('io');
      if (io) {
        course.students.forEach(studentId => {
          io.emit(`notification_${studentId}`, { message: `New lecture added: ${title}`, type: 'lecture' });
        });
      }
    }

    res.status(201).json(createdLecture);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLectures, createLecture };
