const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { verify, verifyAdmin } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/register', asyncHandler(userController.registerUser));
router.post('/login', asyncHandler(userController.loginUser));

router.get('/details', verify, asyncHandler(userController.retrieveUser));
router.patch('/update-password', verify, asyncHandler(userController.updatePassword));

router.patch('/:id/set-as-admin', verify, verifyAdmin, asyncHandler(userController.setAsAdmin));

module.exports = router;
