var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    name: String,
    password: String,
    gender: String,
    bio: String,
    avatar: String
});


module.exports = Schema;