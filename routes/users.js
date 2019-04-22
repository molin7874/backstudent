var express = require('express');
var router = express.Router();
var db = require('../config/db')
var jwt = require('jsonwebtoken');
/* GET users listing. */
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
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next){
  res.render("./login");
})
router.get('/countdivison', function(req, res){
  db.query("SELECT COUNT(DISTINCT division) as divison FROM stuinfo", function(err, rows){
    if(err){
      console.log(err)
    } else if (rows){
      res.json(rows)
    }
  })
})
router.get('/countpeople', function(req, res){
  db.query("SELECT COUNT(DISTINCT username)as people FROM stuinfo", function(err, rows){
    if(err){
      console.log(err)
    } else if (rows){
      res.json(rows)
    }
  })
})
router.get('/countgrade', function(req, res){
  db.query("SELECT COUNT(DISTINCT grade) as grade FROM stuinfo", function(err, rows){
    if(err){
      console.log(err)
    } else if (rows){
      res.json(rows)
    }
  })
})
router.get('/countactivity', function(req, res){
  db.query("SELECT COUNT(DISTINCT name) as activity FROM activitylist", function(err, rows){
    if(err){
      console.log(err)
    } else if (rows){
      res.json(rows)
    }
  })
})
router.get('/register', function(req, res, next){
  res.render("./register");
})
router.get('/viewbyid', function(req,res){
  let id = req.query.id
  let isadmin = req.query.isadmin
  if(isadmin === '1'){
    db.query("select * from stuinfo where id = '"+id+"'", function(err, rows){
      if(err){
        console.log(err)
      } else if(rows){
        res.json(rows)
      }
    })
  } else if (isadmin !== '1'){
    return res.json({
      code: '-5',
      msg: '无权编辑会员数据'
    })
  }
})
router.get('/getstudydivision', function(req, res){
  let division = 'study'
  db.query("select * from stuinfo where division ='"+division+"' ", function(err, rows){
    if(err) {
      res.send(err)
    } else if (rows){
      res.json(rows)
    }
  })
})
router.get('/getsportsdivision', function(req, res){
  let division = 'sport'
  db.query("select * from stuinfo where division ='"+division+"' ", function(err, rows){
    if(err) {
      res.send(err)
    } else if (rows){
      res.json(rows)
    }
  })
})
router.get('/getorganizesdivision', function(req, res){
  let division = 'organize'
  db.query("select * from stuinfo where division ='"+division+"' ", function(err, rows){
    if(err) {
      res.send(err)
    } else if (rows){
      res.json(rows)
    }
  })
})
// 修改学习部数据
router.post('/editstudy', function(req, res){
  let query = req.body
  // 是否是管理员
  if(query.isadmin !=='1'){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === '1') {
    db.query("update stuinfo set username = '"+query.username+"', division = '"+query.division+"' where id = '"+query.id+"'", function(err, rows){
      if (err) {
        res.send(err)
      } else if (rows){
        res.send({
          code: '0',
          msg: '修改成功'
        })
      }
    })
  }
})
router.post('/delstudy', function(req, res){
  let query = req.body
  // 是否是管理员
  if(query.isadmin !== '1'){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === '1') {
    db.query("delete from stuinfo where id = '"+query.id+"'", function(err, rows){
      if (err) {
        res.send(err)
      } else if (rows){
        res.send({
          code: '0',
          msg: '删除成功'
        })
      }
    })
  }
})
router.post('/editsports', function(req, res){
  let query = req.body
  if(query.isadmin !== '1'){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === '1') {
    db.query("update stuinfo set username = '"+query.username+"', division = '"+query.division+"' where id = '"+query.id+"'", function(err, rows){
      if (err) {
        res.send(err)
      } else if (rows){
        res.send({
          code: '0',
          msg: '修改成功'
        })
      }
    })
  }
})
router.post('/delsports', function(req, res){
  let query = req.body
  if(query.isadmin !== '1'){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === '1') {
    db.query("delete from stuinfo where username = '"+query.username+"'", function(err, rows){
      if (err) {
        res.send(err)
      } else if (rows){
        res.send({
          code: '0',
          msg: '删除成功'
        })
      }
    })
  }
})
router.post('/editorganize', function(req, res){
  let query = req.body
  if(query.isadmin !== '1'){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === '1') {
    db.query("update stuinfo set username = '"+query.username+"', division = '"+query.division+"' where id = '"+query.id+"'", function(err, rows){
      if (err) {
        res.send(err)
      } else if (rows){
        res.send({
          code: '0',
          msg: '修改成功'
        })
      }
    })
  }
})
router.post('/delorganize', function(req, res){
  let query = req.body
  if(query.isadmin !== '1'){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === '1') {
    db.query("delete from stuinfo where username = '"+query.username+"'", function(err, rows){
      if (err) {
        res.send(err)
      } else if (rows){
        res.send({
          code: '0',
          msg: '删除成功'
        })
      }
    })
  }
})
router.get('/countgrade', function(req, res){
  console.log(req.query)
  let gradelist = []
  let grade = ['大一', '大二', '大三', '大四']
  db.query("select sum(case when grade='大一' then 1 else 0 end) as total1,sum(case when grade='大二' then 1 else 0 end) as total2,sum(case when grade='大三' then 1 else 0 end) as total3,sum(case when grade='大四' then 1 else 0 end) as total4 from stuinfo", function(err, rows){
    if(err){
      console.log(err)
    } else if(rows){
      // console.log(rows[0].total1)
      res.send([rows[0].total1, rows[0].total2, rows[0].total3, rows[0].total4])
    }
  })
})
router.get('/countmajor', function(req, res){
  let res1 = ['计算机', '会计', '软件工程']
  let res2 = []
    db.query("select sum(case when major='计算机' then 1 else 0 end) as value1, sum(case when major='会计' then 1 else 0 end) as value2 , sum(case when major='软件' then 1 else 0 end) as value3 from stuinfo", function(err, rows){
      if (err){
        console.log(err)
      } else if (rows){
        res.send([rows[0].value1, rows[0].value2, rows[0].value3])
      }
    })
})
router.get('/countmajortype', function(req, res){
  let query = req.query
  console.log('查询参数',query)

})
router.get('/getstudentsDetail', function(req, res){
  let query = req.query.id
  db.query("select * from userdetail where id= '"+query +"'", function(err, rows){
    if(err){
      console.log(err)
    } else if(rows) {
      res.json(rows)
    }
  })
})
// 新增活动
router.post('/addactivity', function(req, res){
  let query = req.body
  db.query("insert into activitylist(name, begintime, endTime, remark,type, typename) values('"+query.name+"','"+query.begintime+"','"+query.endTime+"','"+query.remark+"', '"+query.type+"', '"+query.typename +"')", function(err, rows){
    if(err){
      console.log(err)
    } else if (rows){
      res.send({
        code: '0',
        msg: '新增成功'
      })
    }
  })
})
// 获取活动列表
router.get('/activityType', function(req, res){
  db.query("select * from activitytype",function(err, rows){
    if(err){
      console.log(err)
    } else if(rows){
      res.send({
        code: '0',
        data: rows
      })
    }
  })
})
router.get('/viewactivitybyid', function(req,res){
  let id = req.query.id
  let isadmin = req.query.isadmin
    db.query("select * from activitylist where id = '"+id+"'", function(err, rows){
      if(err){
        console.log(err)
      } else if(rows){
        res.json(rows)
      }
    })
   
  // else if (isadmin !== '1'){
  //   return res.json({
  //     code: '-5',
  //     msg: '无权编辑会员数据'
  //   })
  // }
})
router.get('/getactivityist', function(req,res){
    db.query("select * from activitylist ", function(err, rows){
      if(err){
        console.log(err)
      } else if(rows){
        res.json(rows)
      }
    })
})
// 删除活动列表
router.post('/delactivity', function(req, res){
  let query = req.body
  if(query.isadmin !== '1'){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === '1') {
    db.query("delete from activitylist where id = '"+query.id+"'", function(err, rows){
      if (err) {
        res.send(err)
      } else if (rows){
        res.send({
          code: '0',
          msg: '删除成功'
        })
      }
    })
  }
})
// 编辑活动列表
router.post('/editactivity', function(req, res){
  let query = req.body
  console.log(query)
  if(query.isadmin !== '1'){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === '1') {
    db.query("update activitylist set name = '"+query.name+"', begintime = '"+query.begintime+"', endTime = '"+query.endTime+"', remark = '"+query.remark+"' where id = '"+query.id+"'", function(err, rows){
      if (err) {
        res.send(err)
      } else if (rows){
        res.send({
          code: '0',
          msg: '修改成功'
        })
      }
    })
  }
})
module.exports = router;