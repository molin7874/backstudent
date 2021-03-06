var express = require('express')
var router = express.Router()
var db = require('../config/db')
var jwt = require('jsonwebtoken');
var config = require('../config/token');
var formidable = require('formidable');
var fs = require("fs");
let path = require("path");
/* 路由拦截 */
router.use('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //这个表示任意域名都可以访问，这样写不能携带cookie了。
//res.header('Access-Control-Allow-Origin', 'http://www.baidu.com'); //这样写，只有www.baidu.com 可以访问。
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, stdtoken, STDTOKEN');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//设置方法
  if (req.method == 'OPTIONS') {
    res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
  }
  else {
    next();
  }
});
router.use('*', function(req,res,next){
  if(req.url=== '/' || req.url === '/adduser') {
    // console.log(req.headers.token)
    console.log(req.url)
    console.log('请求路劲为登录')
    next()
  }else if (req.header('STDTOKEN')){
    let token = req.header('STDTOKEN')
    db.query("select token from stuinfo where token = '"+token+"'", function(err, rows){
      if (err){
        res.send(err)
        return
      }else {
        let secretOrPrivateKey="suiyi"
        jwt.verify(token, secretOrPrivateKey, function(err, decode){
          if (err) {
            console.log(err + token)
            return res.send({
              code: '-4',
              msg: 'token失效'
            })
          } else {
            console.log(decode)
            // res.json({
            //   code: '0',
            //   msg: '成功' + decode
            // })
            next()
          }
        })
      }
    })
  }
})
router.get('/api/selectAll', function(req, res, next) {
  db.query('select * from account', function(err, rows) {
    if (err) {
      res.status(403)
    } else {
      res.json(rows)
    }
  })
})
router.get('/', function(req, res, next) {
  res.send('欢迎进来')
})
router.post('/', function(req, res, next){
  var query = req.body;
 if (query.username != '' && query.password !== ''){
  db.query("select username,isadmin, password, userimg from stuinfo where username = '"+query.username+"' and password = '"+query.password+"'", function(err, rows){
    if (err) {
      return res.send('查询失败' + err)
    } else if(rows.length !== 0 && rows[0].username === query.username && rows[0].password === query.password) {
      console.log('结果', rows)
         let content ={name:req.body.username}
         let secretOrPrivateKey="suiyi"
         let token = jwt.sign(content, secretOrPrivateKey, {
           expiresIn: 60*2  // 1小时过期
       });
       db.query("update stuinfo set token= '"+token+"' where username = '"+query.username+"'", function(err, rows){
         if(err) {
           console.log('存入失败' + err)
         } else {
           console.log('存入成功')
           console.log('22', rows)
         }
       })
       res.send({
         'code': '0',
         'msg':'登陆成功',
         'token':token,
         'username':req.body.username,
         'isadmin': rows[0].isadmin,
         'img': rows[0].userimg,
         'id': rows[0].id
       })
    } else {
      res.send({
        code: '-5',
        msg: '参数有误'
      })
    }
  })
 } else {
   res.send({
     code: '-4',
     msg: '参数不能为空'
   })
 }
})
router.post('/adduser',function(req, res, next) {
  var username = req.body.username
  var grade = req.body.grade
  var password = req.body.password
  var major = req.body.major
  db.query(
    "insert into stuinfo(username, grade, password, major, token, isadmin) values('"+username+"','"+grade+"','"+password+"','"+major+"', 'null', 0)",
    function(err, rows) {
      if (err) {
       return res.json({
         code: '-4',
         msg: '更新失败'+err
       })
      } else {
        res.json({
          code: '0',
          msg: '注册成功, 欢迎' + username,
        })
      }
    }
  )
})
router.post('/api/admin/checkuser',function (req,res){
  let id = req.body.id
  let token = req.headers.token
  db.query("select token from stuinfo where token = '"+token+"'", function(err, rows){
    if (err){
      res.send(err)
      return
    }else {
      let secretOrPrivateKey="suiyi"
      let token = req.body.token
      jwt.verify(token, secretOrPrivateKey, function(err, decode){
        if (err) {
          console.log(err + token)
          res.json({
            code: '-3',
            msg: '错误' + err
          })
        } else {
          console.log(decode)
          res.json({
            code: '0',
            msg: '成功' + decode
          })
        }
      })
    }
  })
})
router.post('/upload', function (req,res, next) {
  var form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.keepExtensions = true
  form.uploadDir = "./public/images"
  form.maxFieldsSize = 2 * 1024 * 1024
  form.parse(req, function(err, fields, files) {
      let returnname = ''
      let ran = parseInt(Math.random() * 89999 + 10000);
      let extname = path.extname(files.file.name);
      let oldpath=__dirname+'/'+files.file.path
      let newpath = __dirname + '/public/images/' + ran + extname;
      // console.log("files:",files)  //这里能获取到图片的信息
      // console.log(files.file.path)
      // console.log(files)
      // console.log(fields)
      returnname = path.basename(oldpath)
      db.query("update stuinfo set userimg = '"+returnname+"' where username = 'admin'", function(err, rows){
        if(err){
          console.log('图片插入错误',err)
        } else if(rows) {
          console.log('插入图片成功', rows)
        }
      })
      fs.rename(oldpath,newpath,function (err) {
          if (err){
              console.log('重命名不成功'+ err);
              return;
          }
          console.log('重命名成功');
      })
      res.send({
        code: '0',
        msg: '发送成功',
        name: returnname
    })
  })
  // console.log(req.file);//获取到的文件
})
module.exports = router
