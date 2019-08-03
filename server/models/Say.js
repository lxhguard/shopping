var mongoose = require("mongoose");
var saysSchema = require("../schemas/say");

module.exports = mongoose.model("Say", saysSchema);
