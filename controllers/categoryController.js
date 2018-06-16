const Category = require('../models/category');
const User = require('../models/user');
const Item = require('../models/item');

const async = require('async');

// Require validation and sanitisation modules
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Site home page.
exports.index = function(req, res, next) {
  async.parallel({
      category_count: function(callback) {
        Category.count({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      user_count: function(callback) {
        User.count({}, callback);
      },
      item_count: function(callback) {
        Item.count({}, callback);
      },
      user: function(callback) {
        User.findById(req.session.userId)
          .exec(callback);
      }
    }, function(err, results) {
      res.render('index', { title: 'Item Catalog Home', error: err, data: results, user: results.user, userLoggedIn: req.session.userId });
    })
    // res.send('NOT IMPLEMENTED: Site Home Page');
}

// Display list of all Categories.
exports.category_list = function(req, res, next) {
  async.parallel({
      categories: function(callback) {
        Category.find({}, 'title user')
          .exec(callback);
      },
      user: function(callback) {
        User.findById(req.session.userId)
          .exec(callback);
      }
    }, function(err, results) {
      if (err) { return next(err); }
      res.render('category_list', { title: 'Category List', category_list: results.categories, user: results.user, userLoggedIn: req.session.userId });
    })
    // res.send('NOT IMPLEMENTED: Category list');
};

// Display detail page for a specific Category.
exports.category_detail = function(req, res, next) {
  async.parallel({
    category: function(callback) {
      Category.findById(req.params.id)
        .populate('user')
        .exec(callback);
    },
    item: function(callback) {
      Item.find({ 'category': req.params.id })
        .populate('user')
        .exec(callback);
    },
    user: function(callback) {
      User.findById(req.session.userId)
        .exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.category == null) { // No results.
      var err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
    // Successful, so render
    res.render('category_detail', { title: 'Category detail', category: results.category, items: results.item, user: results.user, userLoggedIn: req.session.userId });
  });
};

// Display Category create form on GET.
exports.category_create_get = function(req, res, next) {
  User.findById(req.session.userId).exec(function(err, user) {
    if (err) { return next(err); }
    res.render('category_form', { title: 'Create category', user: user, userLoggedIn: req.session.userId });
  })
};

// Handle Category create on POST.
exports.category_create_post = [

  // Validate field.
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  // body('user', 'User must not be empty.').isLength({ min: 1 }).trim(),

  // Sanitize field.
  sanitizeBody('*'),

  // Process the request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors (if any) from the request.
    const errors = validationResult(req);

    // Create a new category item.
    const category = new Category({
      title: req.body.title,
      user: req.session.userId
    });

    // If there are errors. Render form again with sanitized values/error messages.
    if (!errors.isEmpty()) {
      res.render('category_form', { title: 'Create category', category: req.body, errors: errors.array(), userLoggedIn: req.session.userId });
      return;
    } else {
      category.save(function(err) {
        if (err) { return next(err); }
        // Successful, redirect to the new category
        res.redirect('/catalog/categories');
      });
    }
  }

];
// res.send('NOT IMPLEMENTED: Category create post');

// Display Category delete form on GET.
exports.category_delete_get = function(req, res, next) {
  Category.findById(req.params.id, 'title')
    .populate('user')
    .exec(function(err, category) {
      if (err) {
        return next(err);
      } else if (category.user.id !== req.session.userId) {
        req.session.error = 'Cannot delete. You do not own this category.';
        res.redirect('/catalog/category/' + category.id);
        delete req.session.error;
      } else {
        res.render('category_delete', { title: 'Delete category', category: category, user: category.user, userLoggedIn: req.session.userId });
      }
    })
    // res.send('NOT IMPLEMENTED: Category delete get');
};

// Handle Category delete on POST.
exports.category_delete_post = function(req, res, next) {

  // Query for category and items in the category
  async.parallel({
    category: function(callback) {
      Category.findById(req.params.id)
        .populate('user')
        .exec(callback);
    },
    items: function(callback) {
      Item.find({ 'category': req.params.id })
        .exec(callback);
    }
  }, function(err, results) {
    if (err) return next(err);

    if (results.items.length > 0) { // If there is at least one item in the category
      res.redirect('/catalog/categories')
    } else if (results.category.user.id == req.session.userId) {
      // No items in the category so proceed to delete
      Category.findByIdAndRemove(req.params.id, function deleteCategory(err) {
        if (err) { return next(err); }
        // Deleted successfully so redirect
        res.redirect('/catalog/categories')
      });
    } else {
      res.redirect('/catalog/categories')
    }

  });
  //res.send('NOT IMPLEMENTED: Category delete post');
};

// Display Category update form on GET.
exports.category_update_get = function(req, res, next) {

  // Get the category and user details
  async.parallel({
    category: function(callback) {
      Category.findById(req.params.id)
        .populate('user')
        .exec(callback);
    },
    item: function(callback) {
      Item.find({ 'category': req.params.id })
        .exec(callback);
    }
  }, function(err, results) {
    if (err) {
      return next(err);
    } else if (results.category.user.id !== req.session.userId) {
      res.render('category_detail', { title: 'Category detail', category: results.category, user: results.category.user, items: results.item, error: 'You do not own this category.', userLoggedIn: req.session.userId })
    } else {
      res.render('category_form', { title: 'Edit Category', category: results.category, user: results.category.user, users: results.user, userLoggedIn: req.session.userId });
    }
  });
  // res.send('NOT IMPLEMENTED: Category update get');
};

// Handle Category update on POST.
exports.category_update_post = [

  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  // body('user', 'User must not be empty.').isLength({ min: 1 }).trim(),

  // Sanitize field.
  sanitizeBody('*'),

  // Process the request
  (req, res, next) => {
    // Extract the validation errors (if any) from the request.
    const errors = validationResult(req);

    // Query category from db.
    Category.findById(req.params.id)
      .populate('user')
      .exec(function(err, category) {
        if (err) {
          return next(err)
        } else {
          // Create a category with the updated values
          const categoryUpdate = new Category({
            title: req.body.title,
            user: category.user,
            _id: category.id //This is required, or a new ID will be assigned!
          });
          // Check for errors in validation form
          if (!errors.isEmpty()) {
            res.redirect('/catalog/categories');
            return;
          } else {
            Category.findByIdAndUpdate(req.params.id, categoryUpdate, function(err, updatedCategory) {
              if (err) { return next(err); }
              // Successful so redirect to the updated item's page.
              res.redirect('/catalog/categories');
            });
          }
        }
      });
  }
];