const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth');

// list users (admin)
router.get('/', auth, userController.getUsers);

// get single user (admin or profile)
router.get('/:id', auth, userController.getUser);

// update user
router.put('/:id', auth, userController.updateUser);

// soft-delete user
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;