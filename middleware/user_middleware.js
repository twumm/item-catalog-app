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