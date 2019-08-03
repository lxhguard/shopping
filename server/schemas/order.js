var mongoose = require("mongoose");

//用户订单的表结构
module.exports = new mongoose.Schema({
  //关联字段 - 用户id
  info: {
    //类型
    type: mongoose.Schema.Types.ObjectId,
    //引用
    ref: "Info"
  },
  //店铺名
  order_shopname: {
    type: String,
    default: ""
  },
  //订购内容
  order_content: {
    type: Array,
    default: []
  },
  //订购地址
  order_address: {
    type: String,
    default: ""
  },
  //总价格
  all_money: {
    type: Number,
    default: 0
  },
  //添加时间
  order_time: {
    type: Date,
    default: new Date()
  }
});
