var mongoose = require("mongoose");
var foodsSchema = require("../schemas/food");

module.exports = mongoose.model("Food", foodsSchema);
