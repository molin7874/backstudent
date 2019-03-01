var express = require('express')
var router = express.Router()
var db = require('../config/db')
var jwt = require('jsonwebtoken');
var config = require('../config/token');
/* GET home page. */
router.get('/api/selectAll', function(req, res, next) {
  db.query('select * from account', function(err, rows) {
    if (err) {
      res.status(403)
    } else {
      console.log(req.cookies.name);
      res.json(rows)
    }
  })
})
router.get('/', function(req, res, next) {
  res.send('欢迎进来')
})
router.post('/', function(req, res, next){
  var query = req.body;
  // console.log("post请求：参数", query);
  // console.log(req.body)
  // res.send('hello , world');
 if (query.username != '' && query.password !== ''){
  db.query("select isadmin from stuinfo where username = '"+query.username+"'", function(err, rows){
    if (err) {
      return res.send('查询失败' + err)
    } else if(rows) {
      console.log('结果', rows)
      // req.secret='abcdedf';
         // res.cookie('name',id,{maxAge: 1000*60*60*24*30, signed:true})
         // console.log(req.cookies.name);                                                                                                           
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
         'isadmin': 1
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
          msg: '注册成功' + rows
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
module.exports = router
