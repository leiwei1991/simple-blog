var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    author:  String,
    title:   String,
    content: String,
    pv:      Number,
    createTime: Number
});

module.exports = Schema;