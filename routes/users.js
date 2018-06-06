const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Require controllers
const user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/// USER ROUTES /// 

// GET request to sign-up users.
router.get('/user/signup', user_controller.user_signup_get);

// POST request to sign-up users.
router.post('/user/signup', user_controller.user_signup_post);

// GET request to create user.
router.get('/user/login', user_controller.user_login_get);

// POST request to create user.
router.post('/user/login', user_controller.user_login_post);

// GET request to logout the user
router.get('/user/logout', user_controller.user_logout_get);

// GET request to delete user.
router.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete user.
router.post('/user/:id/delete', user_controller.user_delete_post);

// GET request to update user.
router.get('/user/:id/update', user_controller.user_update_get);

// POST request to update user.
router.get('/user/:id/update', user_controller.user_update_post);

// GET request for one user.
router.get('/user/:id', user_controller.user_detail);

// GET request for list of users.
router.get('/users', user_controller.user_list);

module.exports = router;