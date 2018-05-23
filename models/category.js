var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
    title: { type: String, required: true },
    user: { type: Schema.ObjectId, ref: 'User', required: true },
});

// Virtual property for category's url
CategorySchema
    .virtual('url')
    .get(function() {
        return '/catalog/category/' + this._id;
    });

// Export module
module.exports = mongoose.model('Category', CategorySchema);