const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  username: { type: String, unique: true, required: true, trim: true, max: 40 },
  email: { type: String, unique: true, required: true, trim: true },
  password: { type: String, required: true }
  // passwordConf: { type: String, required: true }
});

// Authenticate the input against database.
UserSchema.statics.authenticate = function(userInput, password, callback) {
  User.findOne({ $or: [{ username: userInput }, { email: userInput }] })
    .exec(function(err, user) {
      if (err) {
        return callback(err);
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      // Compare the password in the db to the password the user entered.
      bcrypt.compare(password, user.password, function(err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    })
}

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
    return '/users/user/' + this._id;
  });

// Hash the password before saving it to the database.
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) { return next(err); }
    // No error so hash the password
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);
module.exports = User;