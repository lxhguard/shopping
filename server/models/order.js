var mongoose = require("mongoose");
var ordersSchema = require("../schemas/order");

module.exports = mongoose.model("Order", ordersSchema);
