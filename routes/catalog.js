const express = require('express');
const router = express.Router();
const mid = require('../middleware/user_middleware');

// Require controller modules.
const category_controller = require('../controllers/categoryController');
const user_controller = require('../controllers/userController');
const item_controller = require('../controllers/itemController');

/// CATEGORY ROUTES ///

// GET catalog homepage
router.get('/', category_controller.index);

// GET request to create a Category. Check login status.
router.get('/category/create', mid.requiresLogin, category_controller.category_create_get);

// POST request to create a Category.
router.post('/category/create', category_controller.category_create_post);

// GET request to delete a Category.
router.get('/category/:id/delete', mid.requiresLogin, category_controller.category_delete_get);

// POST request to delete a Category.
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request to update a Category.
router.get('/category/:id/update', mid.requiresLogin, category_controller.category_update_get);

// POST request to update a Category.
router.post('/category/:id/update', category_controller.category_update_post);

// GET request for one Category.
router.get('/category/:id', category_controller.category_detail);

// GET request for all Categories.
router.get('/categories', category_controller.category_list);


/// ITEM ROUTES ///

// GET request to create an item.
router.get('/item/create', mid.requiresLogin, item_controller.item_create_get);

// POST request to create an item.
router.post('/item/create', item_controller.item_create_post);

// GET request to delete an item.
router.get('/item/:id/delete', mid.requiresLogin, item_controller.item_delete_get);

// POST request to delete an item.
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET request to update an item.
router.get('/item/:id/update', mid.requiresLogin, item_controller.item_update_get);

// POST request to update an item.
router.post('/item/:id/update', item_controller.item_update_post);

// GET request for one item.
router.get('/item/:id', item_controller.item_detail);

// GET request for all items.
router.get('/items', item_controller.item_list);


module.exports = router;