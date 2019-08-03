var mongoose = require("mongoose");

//菜品的表结构
module.exports = new mongoose.Schema({
  //关联字段 - 店铺id
  info: {
    //类型
    type: mongoose.Schema.Types.ObjectId,
    //引用
    ref: "Shop"
  },
  //评价内容
  content: {
    type: String,
    default: "该用户没写内容"
  },
  //发表图片
  picsurl: {
    type: Array,
    default: []
  },
  //添加时间
  addTime: {
    type: Date,
    default: new Date()
  }
});
