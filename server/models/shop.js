var mongoose = require("mongoose");
var shopsSchema = require("../schemas/shop");

module.exports = mongoose.model("Shop", shopsSchema);
