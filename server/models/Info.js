var mongoose = require("mongoose");
var infosSchema = require("../schemas/info");

module.exports = mongoose.model("Info", infosSchema);
