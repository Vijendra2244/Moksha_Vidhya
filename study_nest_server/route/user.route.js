const express = require('express');
const { registerUser, loginUser, logoutUser} = require('../controllers/user.controller');
const {verifyRole} = require('../middleware/auth.middleware')

const router = express.Router();

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

//  protected route for admins only
router.get('/admin-only', verifyRole(['admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});

// protected route for instructors and admins
router.get('/instructor', verifyRole(['admin', 'instructor']), (req, res) => {
  res.status(200).json({ message: 'Hello Instructor or Admin!' });
});

module.exports = router;
