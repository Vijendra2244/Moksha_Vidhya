const express = require('express');
const { registerUser} = require('../controllers/user.controller');
const {verifyRole} = require('../middleware/auth.middleware')

const router = express.Router();

// Public Routes
router.post('/register', registerUser);

//  protected route for admins only
router.get('/admin-only', verifyRole(['admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});

// protected route for instructors and admins
router.get('/instructor', verifyRole(['admin', 'instructor']), (req, res) => {
  res.status(200).json({ message: 'Hello Instructor or Admin!' });
});

module.exports = router;
