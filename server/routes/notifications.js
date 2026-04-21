const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort('-createdAt').limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/mark-all-read', protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, isRead: false }, { isRead: true });
    res.json({ message: "All marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
