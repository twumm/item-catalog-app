const User = require('../models/user');

// Check if user is logged in
exports.requiresLogin = function(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        // var err = new Error('You must be logged in to view this page.');
        // err.status = 401;
        res.redirect('/users/user/signup');
        // return next(err);
    }
}

// Get user details
exports.userLoggedIn = function(req, res, next) {
    if (req.session && req.session.userId) {
        User.findById(req.session.userId)
            .exec(function(err, result) {
                if (err) {
                    return next(err);
                } else {
                    return result.user;
                }
            });
    }
}