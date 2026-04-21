const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, authorize('admin', 'teacher'), getUsers)
  .post(protect, authorize('admin'), createUser);

router.route('/:id')
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
