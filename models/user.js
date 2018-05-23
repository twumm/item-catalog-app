var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    first_name: { type: String, required: true, max: 100 },
    family_name: { type: String, required: true, max: 100 },
    username: { type: String, required: true, max: 40 }
});

// Virtual property for user's fullname
UserSchema
    .virtual('name')
    .get(function() {
        return this.first_name + ' ' + this.family_name;
    });

// Virtual property for user's url
UserSchema
    .virtual('url')
    .get(function() {
        return '/catalog/user/' + this._id;
    });

module.exports = mongoose.model('User', UserSchema);