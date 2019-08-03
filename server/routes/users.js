var express = require('express');
var router = express.Router();
var Info = require("../models/Info");
var Say = require("../models/Say");
var Shop = require("../models/shop");
var Order = require("../models/order");

//图片接收模块
var multer = require('multer');
//发送邮件模块
var nodemailer = require("nodemailer");
// 引入jwt token工具
const JwtUtil = require('../public/utils/jwt');
//图片接收模块
var multer = require('multer');




//定义一个全局变量接收邮件验证码
var emailcode;
/** 发送邮件：验证码 */
router.post("/sendemail",function(req,res,next){
  let userRemail = req.body.user_email;
  console.log(userRemail);
  //发件人的邮件授权
  var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    service: "qq",
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
      user: "741183972@qq.com",
      //我的CardDev密码：dfaywetbufuibfic
      //这里密码不是qq密码，是你设置的smtp密码
      pass: "kxrjpmympgaebdbd"
    }
  });
   //验证码: 生成4位随机数
  var randomFns =(1000 + Math.round(Math.random() * 10000 - 1000));
  //验证码抛出块作用域，保存后在注册接口验证是否相等
  emailcode = randomFns;
  console.log('打印验证码');
  console.log(randomFns);
  //发件人 邮箱信息
  var mailOptions = {
    from: '741183972@qq.com', // 发件地址
    to: userRemail, // 收件列表
    subject: '验证码如下:', // 标题
    //text和html两者只支持一种,邮件信息只能是字符串
    // text: 'Hello world ?', // 标题
    html: randomFns.toString() // html 内容
  };
  // 发送邮件的结果
  transporter.sendMail(mailOptions, function (error, info) {
    
    if (error) {
      console.log("发送错误");
      return console.log(error);
    }
    console.log("Message sent: " + info.response);
    console.log('验证码邮件发送成功！');
    res.send({status:200,msg:'验证码已发送至您的邮箱，请查收。'})
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  var shop = new Shop({
    shop_name: "胖之味果木烤鸭",
    shoppic_url: "http://localhost:3883/public/images/uploads/比格比萨.png",
    address:
      "雁塔区电子正街北山门东街32号（电子四路十字路口东，北山门村村口向东300米）",
    recommendation: [
      "刚烤好的鸭",
      "一排鸭子",
      "岐山擀面皮",
      "红油金针菇",
      "烤鸭单人餐",
      "红油海带丝",
      "小葱拌豆腐",
      "老北京烤鸭",
      "牛奶蘑菇汤",
      "内蒙丰镇月饼",
      "薄饼"
    ],
    rates: 5,
    phone: "17612956773",
    provide: ["wifi"]
  })
    .save()
    .then(function(newshop) {
      console.log(newshop);
      res.send("user.js path /users/ respond with a resource");
    });
});

/* 注册 */
router.post("/register", function(req, res, next) {
  let register_email = req.body.user_email;
  let register_password = req.body.user_password;
  let register_verification_code = req.body.verification_code;
  console.log(req.body)
  if (register_verification_code == emailcode) {
    console.log('验证码正确')
    Info.findOne({
      email: register_email
    }).then(function(info) {
      //如果用户名存在，则返回信息告诉注册者已经存在
      console.log(info);
      if (info) {
        res.send({ status: 201, msg: "email已经存在，请重新命名" });
      } else {
        //如果用户名不存在，则保存到数据库
        var newUser = new Info({
          password: register_password,
          email: register_email
        })
          .save()
          .then(function(newUser) {
            console.log("保存新用户成功，新用户信息如下：");
            console.log(newUser);
            res.send({ status: 200, msg: "恭喜你注册用户成功" });
          });
      }
    });
  } else {
    res.send({ status: 201, msg: "你输入的验证码不对！" });
  }
});

/**登录 */
router.post("/login", function(req, res, next) {
  console.log(req.body);
  // res.send({
  //   status: 200,
  //   msg: "登陆成功",
  // });
  //获得前端传来的数据
  var user_email = req.body.user_email;
  var user_password = req.body.user_password;

  //查询数据库中相同用户名和密码的记录是否存在，如果存在则登录成功
  Info.findOne({
    email: user_email,
    password: user_password
  }).then(function(userInfo) {
    //userInfo是这条记录的所有信息
    console.log(userInfo);
    if (!userInfo) {
      //用户信息不存在,即空记录
      console.log("[SELECT ERROR] -  这条（用户名密码）记录不存在");
      res.send({ status: 400, msg: "email或者密码错误!" });
      return;
    }
    // 登陆成功，添加token验证
    let userId = userInfo._id;
    // 将用户id传入并生成token
    let jwt = new JwtUtil(userId);
    let token = jwt.generateToken();
    // 将 token 返回给客户端
    res.send({
      status: 200,
      msg: "登陆成功",
      token: token,
      email: userInfo.email
    });
  });
});

/**获得用户信息 */
router.get("/info",function(req,res,next){
  //console.log('进入 /info');
  var user_email = req.query.email;
  Info.findOne({
    email: user_email
  }).then(function(userInfo) {
    res.send({ status: 200, msg: "获得用户信息", info: userInfo });
  });
  
})

/**获得用户的订单 */
router.get("/myorder",function(req,res,next){
  var email = req.query.email;
  Info.findOne({
    email: email
  }).then(function(info) {
    var id = info._id;
    Order.find().then(function(allorder){
      console.log(allorder);
      res.send({
        status: 200,
        msg: "已经获得用户所有订单",
        allorders: allorder
      });
    })
  });
})

/**编辑用户信息 */
router.post("/editinfo", function(req, res, next) {
  var user_info = req.body;
  Info.findOne({
    email: user_info.email
  }).then(function(info) {
    info.sex = user_info.sex;
    info.nickname = user_info.nickname;
    info.disc = user_info.disc;
    info.age = user_info.age;
    info.address = user_info.address;
    return info.save();
  }).then(function(newinfo){
    res.send({ status: 200, msg: "修改信息成功", info: newinfo });
  });
});

/**获得所有 美食商家的 店铺信息 */
router.get("/getallshops",function(req,res,next){
  Shop.find().then(function(shoplist) {
    res.send({status:200, shoplist: shoplist });
  });
});

/**一个 美食商家的 店铺信息 */
router.get("/getoneshop", function(req, res, next) {
  Shop.find({
    _id:req.query.id
  }).then(function(shopInformation) {
    res.send({ status: 200, shopInformation: shopInformation });
  });
});

/**用户提交的订单 */
router.post("/complateorder",function(req,res,next){
  var email = req.body.email;
  var foodlist = req.body.foodlist;
  var totalmoney = req.body.totalmoney;
  var totalnum = req.body.totalnum;
  var order_address = req.body.inputValue;
  var order_shopname = req.body.order_shopname;
  var infoid;
  Info.findOne({
    email:email
  }).then(function(info){
      infoid = info._id; 
      info.allmoney += totalmoney;
      info.order_num++;
      return info.save();
  }).then(function(newinfo){
    var neworder = new Order({
      info: infoid,
      order_shopname: order_shopname,
      order_content: foodlist,
      order_address: order_address,
      all_money: totalmoney
    })
      .save()
      .then(function(thing) {
        res.send({
          status: 200,
          msg: "恭喜您，下单成功，商家正在派送中..."
        });
      });
  })
  

  
});

/**用户对店铺的评价 */
router.post("/postcomment",function(req,res,next){
  var shopid = req.body.id;
  var comment = req.body.comment;
  var info = req.body.info;
  var SubmitComment = {
    info: info, //评价人的信息
    comment: comment, //评价内容
    shopid: shopid, //评价的商家id
    date: new Date(), //评价发表的时间
    ucomments: [] //评价被回复的集合
  };
  Shop.findOne({
    _id: shopid
  }).then(function(shopThing){
    shopThing.comments.unshift(SubmitComment);
    return shopThing.save();//保存评价
  }).then(function(thing){
    res.send({ status: 200, msg: "评价发表成功" });
  });
})

module.exports = router;
