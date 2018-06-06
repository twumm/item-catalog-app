const Item = require('../models/item');
const Category = require('../models/category');
const User = require('../models/user');

const async = require('async');

// Require validation and sanitisation modules
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all items.
exports.item_list = function(req, res, next) {
    Item.find({}, 'title')
        .populate('category')
        .exec(function(err, list_items) {
            if (err) { return next(err) }
            res.render('item_list', { title: 'Items', item_list: list_items });
        })
        // res.send('NOT IMPLEMENTED: Item list');
};

// Display detail page for a specific item.
exports.item_detail = function(req, res, next) {
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id)
                .populate('category')
                .populate('user')
                .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('item_detail', { title: 'Item detail', item: results.item });
    });
    // res.send('NOT IMPLEMENTED: Item detail: ' + req.params.id);
};

// Display Item create form on GET.
exports.item_create_get = function(req, res, next) {

    // Get category and user data
    async.parallel({
        category: function(callback) {
            Category.find({}, 'title').exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('item_form', { title: 'Create item', categories: results.category })
    });

    // res.send('NOT IMPLEMENTED: Item create GET');
};

// Handle Item create on POST.
exports.item_create_post = [

    //Validate fields
    body('title', 'Title must not be empty').isLength({ min: 1 }).trim(),
    body('description', 'Description must not be empty').isLength({ min: 1 }).trim(),
    body('category', 'Category must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize all fields with the wildcard
    sanitizeBody('*').trim().escape(),

    // Process the request
    (req, res, next) => {
        // Extract validation errors
        const errors = validationResult(req);

        // Create an item with the values from the field
        const item = new Item({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            user: req.session.userId
        });

        if (!errors.isEmpty()) { // There were errors in the form so send user back with errors
            res.render('item_form', { title: 'Error in update', item: req.body.item, category: req.body.category, user: req.body.user, errors: errors.array() });
        } else {
            item.save(function(err) {
                if (err) { return next(err); }
                // Successful, redirect to the new category
                res.redirect(item.url);
            });
        }
    }
]

// Display Item delete form on GET.
exports.item_delete_get = function(req, res, next) {
    Item.findById(req.params.id)
        .populate('user category')
        .exec(function(err, item) {
            if (err) {
                return next(err);
            } else if (item.user.id !== req.session.userId) {
                res.render('item_detail', { title: 'Item detail', item: item, category: item.category, error: 'You do not own this item' })
            } else {
                // Successful so render delete page
                res.render('item_delete', { title: 'Delete item', item: item })
            }

        });
    // res.send('NOT IMPLEMENTED: Item delete GET');
};

// Handle Item delete on POST.
exports.item_delete_post = function(req, res, next) {
    // Find and delete item
    Item.findById(req.params.id).exec(function(err, item) {
            if (err) { return next(err); }
            Item.findByIdAndRemove(req.params.id, function deleteItem(err) {
                if (err) { return next(err); }
                // Successful, so render main items page
                res.redirect('/catalog/items');
            })
        })
        // res.send('NOT IMPLEMENTED: Item delete POST');
};

// Display Item update form on GET.
exports.item_update_get = function(req, res, next) {

    // Get item, category and user details
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id)
                .populate('category')
                .populate('user')
                .exec(callback);
        },
        category: function(callback) {
            Category.find(callback);
        },
        user: function(callback) {
            User.find(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.item == null) { // No item found
            const err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        // Success
        res.render('item_form', { title: 'Update item', item: results.item, categories: results.category, users: results.user });
    });
    // res.send('NOT IMPLEMENTED: Item update GET');
};

// Handle Item update on POST.
exports.item_update_post = [

    // Validate fields
    body('title', 'Title must not be empty').isLength({ min: 1 }).trim(),
    body('description', 'Description must not be empty').isLength({ min: 1 }).trim(),
    body('category', 'Category must not be empty').isLength({ min: 1 }).trim(),
    body('user', 'User must not be empty').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('*').trim().escape(),

    // Process the request.
    (req, res, next) => {

        // Get errors from the validation.
        const errors = validationResult(req);

        // Create an item variable to store the updates.
        const item = new Item({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            user: req.body.item,
            _id: req.params.id
        });

        // Check for errors from validation
        if (!errors.isEmpty()) { // There were errors in the form so send user back with errors
            res.render('item_form', { title: 'Error in update', item: req.body.item, category: req.body.category, user: req.body.user, errors: errors.array() });
        } else {
            // Proceed to update the item
            Item.findByIdAndUpdate(req.params.id, item, function(err, updatedItem) {
                if (err) { return next(err); }
                // Successful, so redirect item with updates
                res.redirect(updatedItem.url);
            });
        }
    }
]

/*function(req, res, next) {
    res.send('NOT IMPLEMENTED: Item update POST');
};*/