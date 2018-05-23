var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    category: { type: Schema.ObjectId, ref: 'Category', required: true }, // reference to the associated category
    title: { type: String, required: true, max: 200 },
    description: { type: String, required: true, max: 5000 },
    user: { type: Schema.ObjectId, ref: 'User' }
});

// Virtual property for Item's url
ItemSchema
    .virtual('url')
    .get(function() {
        return '/catalog/item/' + this._id;
    });

// Export model
module.exports = mongoose.model('Item', ItemSchema);