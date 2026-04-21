const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');

// @desc    Get submissions for an assignment
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ assignmentId: req.params.assignmentId }).populate('studentId', 'name email');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit an assignment
const submitAssignment = async (req, res) => {
  const { fileUrl } = req.body;
  try {
    const submission = new Submission({
      assignmentId: req.params.assignmentId,
      studentId: req.user.id,
      fileUrl
    });
    const createdSubmission = await submission.save();
    res.status(201).json(createdSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade submission
const gradeSubmission = async (req, res) => {
  const { marks, feedback } = req.body;
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    
    submission.marks = marks;
    submission.feedback = feedback;
    const updatedSubmission = await submission.save();

    const assignment = await Assignment.findById(submission.assignmentId);

    // Notify student
    await Notification.create({
      userId: submission.studentId,
      message: `Your assignment "${assignment?.title || 'task'}" was graded: ${marks}`,
      type: 'grade'
    });

    const io = req.app.get('io');
    if (io) {
      io.emit(`notification_${submission.studentId}`, { message: 'Your assignment has been graded', type: 'grade' });
    }

    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSubmissions, submitAssignment, gradeSubmission };
