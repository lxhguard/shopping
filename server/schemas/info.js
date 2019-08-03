var mongoose = require('mongoose');

//用户信息的表结构
module.exports = new mongoose.Schema({
  //昵称
  nickname: {
    type: String,
    default: "小萌新一枚"
  },
  //密码
  password: String,
  //邮箱
  email: String,
  //性别,
  sex: {
    type: String,
    default: "不告诉你"
  },
  //总计消费金额
  allmoney: {
    type: Number,
    default: 0
  },
  //总共下单数量
  order_num: {
    type: Number,
    default: 0
  },
  //年龄
  age: {
    type: Number,
    default: 18
  },
  //居住地址
  address: {
    type: String,
    default: "地球哦"
  },
  //头像路径
  avatarurl: {
    type: String,
    default: "http://localhost:3883/public/images/uploads/default.png"
  },
  //个人简介
  disc: {
    type: String,
    default: "此人很懒，还没写个人简介"
  },
  //关注
  cult: {
    type: Number,
    default: 0
  },
  //粉丝
  fan: {
    type: Number,
    default: 0
  }
});