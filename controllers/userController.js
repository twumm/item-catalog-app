const User = require('../models/user');
// const session = require('express-session');

// Require validation and sanitisation modules
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display register user form on GET
exports.user_signup_get = function(req, res, next) {
  // res.send('NOT IMPLEMENTED: User create GET');
  res.render('user_signup', { title: 'Sign-up' });
}

// Sign-up user.
exports.user_signup_post = [

  // Validate field from the sign-up form
  body('first_name', 'First name must not be empty').isLength({ min: 1 }).trim(),
  body('family_name', 'Family name must not be empty').isLength({ min: 1 }).trim(),
  body('username', 'Username must not be empty').isLength({ min: 1 }).trim(),
  body('email', 'First name must not be empty').isLength({ min: 1 }).trim().isEmail(),
  body('password', 'Password must be at least 6 characters.').isLength({ min: 6 }),

  // Sanitize all fields.
  sanitizeBody('*').trim().escape(),

  // Process the request.
  (req, res, next) => {
    // Extract validation errors from the request.
    const errors = validationResult(req);

    // Create a user object with the data provided by the user.
    const user = new User({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    if (!errors.isEmpty()) {
      // There are errors so render the sign-up form with the data.
      res.render('user_signup', { title: 'Error in sign up details', user: user, errors: errors.mapped() });
    } else {
      user.save(function(err) {
        if (err) { return next(err); }
        // Successful so redirect to user profile/details.
        req.session.userId = user._id;
        res.redirect('/catalog');
      });
    }
  }
];

// Display User login form on GET.
exports.user_login_get = function(req, res, next) {
  res.render('user_login', { title: 'Login' });
  // res.send('NOT IMPLEMENTED: User create GET');
};

// Handle User login on POST.
exports.user_login_post = [

  // Validate fields.
  body('userDetail', 'Email must not be empty').isLength({ min: 1 }).trim(),
  // body('password', 'Password must not be empty').isLength({ min: 1 }),

  // Sanitize values.
  sanitizeBody('*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from the request.
    const errors = validationResult(req);

    // Create user object with the data entered.
    const userData = new User({
      userDetail: req.body.userDetail,
      password: req.body.password
    });

    // Check if there are errors in the form values.
    if (!errors.isEmpty()) {
      // There are errors so render form with the values.
      res.render('user_login', { title: 'Login error34', user: userData, errors: errors });
    } else {
      User.authenticate(req.body.userDetail, req.body.password, function(error, user) {
        if (error || !user) {
          // const err = new Error('Wrong email or password.');
          // err.status.401
          res.render('user_login', { title: 'Login error', error: 'Wrong email or password', user: userData });
          // return next(err);
        } else {
          req.session.userId = user._id;
          res.redirect('/catalog');
        }
      })
    }
  }
];

// Log out the user.
exports.user_logout_get = function(req, res, next) {
  if (req.session) {
    // Delete the session object
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
}

// Display list of all Users.
exports.user_list = function(req, res, next) {
  User.find()
    .sort([
      ['family_name', 'ascending']
    ])
    .exec(function(err, list_users) {
      if (err) { return next(err) }
      res.render('user_list', { title: 'Users', user_list: list_users, userLoggedIn: req.session.userId });
    });
  // res.send('NOT IMPLEMENTED: User list');
};

// Display detail page for a specific User.
exports.user_detail = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User detail: ' + req.params.id);
};

// Display User delete form on GET.
exports.user_delete_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User delete GET');
};

// Handle User delete on POST.
exports.user_delete_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User delete POST');
};

// Display User update form on GET.
exports.user_update_get = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User update GET');
};

// Handle User update form on POST.
exports.user_update_post = function(req, res, next) {
  res.send('NOT IMPLEMENTED: User update POST');
};