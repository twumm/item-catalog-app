var Item = require('/models/item');

// Display list of all items.
exports.item_list = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Item list');
};

// Display detail page for a specific item.
exports.item_detail = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Item detail: ' + req.params.id);
};

// Display Item create form on GET.
exports.item_create_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Item create GET');
};

// Handle Item create on POST.
exports.item_create_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Item create POST');
};

// Display Item delete form on GET.
exports.item_delete_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Item delete GET');
};

// Handle Item delete on POST.
exports.item_delete_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Item delete POST');
};

// Display Item update form on GET.
exports.item_update_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Item update GET');
};

// Handle Item update on POST.
exports.item_update_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: Item update POST');
};