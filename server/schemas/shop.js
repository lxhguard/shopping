var mongoose = require("mongoose");

//商家店铺信息的表结构
module.exports = new mongoose.Schema({
  //店铺名
  shop_name: {
    type: String,
    default: "鑫海连锁店"
  },
  //店铺图片-路径
  shoppic_url: {
    type: String,
    default: "http://localhost:3883/public/images/uploads/shop-default.jpg"
  },
  //商铺地址
  address: {
    type: String,
    default: "西安-长安区-gogo街区"
  },
  //商铺类型
  type: {
    type: String,
    default: "快餐店"
  },
  //推荐菜
  recommendation: {
    type: Array,
    default: []
  },
  //评价
  comments: {
    type: Array,
    default: []
  },
  //星级
  rates: {
    type: Number,
    default: 0
  },
  //电话
  phone: {
    type: String,
    default: "177 2950 0777"
  },
  //营业时间
  banking_time: {
    type: String,
    default: "周一至周日 12:00-21:30"
  },
  //提供用品：如wifi,parking,,,
  provide: {
    type: Array,
    default: []
  }
});
