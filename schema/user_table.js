var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema ({
    name: String,
    phone: Number,
    city: String,
    email: String
});

module.exports = mongoose.model('admin',myschema);