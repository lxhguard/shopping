var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//加载数据库模块
var mongoose = require("mongoose");
// 引入jwt token工具
const JwtUtil = require('./public/utils/jwt');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static('public'));//将文件设置成静态
//app.use(express.static(path.join(__dirname, 'public')));


//解决跨域
app.all('*', function (req, res, next) {
  //将外源设为指定的域，比如：http://localhost:8080
  res.header("Access-Control-Allow-Origin", "*");
  //将Access-Control-Allow-Credentials设为true  允许携带cookie
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  //返回数据格式为json字符串
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

/* 请求拦截器 
*/
app.use(function (req, res, next) {
  //获得token值
  var token = req.headers["authorization"];
  //得到前端请求的 接口路径
  var url = req.url;

  // 把登陆，注册，发送验证码请求去掉了，其他的多有请求都需要进行token校验
  if (
    url != "/users/login" &&
    url != "/users/register" &&
    url != "/users/sendemail" &&
    url != "/users/" 
  ) {
    console.log("进入app.js的axios的token拦截器");

    let jwt = new JwtUtil(token);
    let result = jwt.verifyToken();
    // 如果考验通过就next，否则就返回登陆信息不正确（与jwt.js返回有关）
    if (result == "err") {
      console.log("token已过期，被拦截器拦截");
      console.log(result);
      res.send({ status: 403, msg: "尚未登录(登录已过期),请重新登录!" });
    } else {
      console.log("token没过期,驶出拦截器,进入对应的路由");
      next();
    }
  } else {
    //放过 登录, 注册, 验证码 请求
    next();
  }
});



app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//连接数据库
mongoose.connect('mongodb://localhost:27777/blog', function (err) {
  if (err) {
    console.log(err);
    console.log('数据库连接失败！');
  } else {
    console.log("数据库连接成功！");
  }
});


module.exports = app;
