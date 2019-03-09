var express = require('express');
var router = express.Router();
var db = require('../config/db')
var jwt = require('jsonwebtoken');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next){
  res.render("./login");
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
router.post('/editstudy', function(req, res){
  let query = req.body
  if(query.isadmin !== 1){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === 1) {
    db.query("update stuinfo set '"+query.tagname+"'= '"+query.name+"' where username = '"+query.username+"'", function(err, rows){
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
  if(query.isadmin !== '1'){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === 1) {
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
  if(query.isadmin !== 1){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === 1) {
    db.query("update stuinfo set '"+query.tagname+"'= '"+query.name+"' where username = '"+query.username+"'", function(err, rows){
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
  if(query.isadmin !== 1){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === 1) {
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
  if(query.isadmin !== 1){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === 1) {
    db.query("update stuinfo set '"+query.tagname+"'= '"+query.name+"' where username = '"+query.username+"'", function(err, rows){
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
  if(query.isadmin !== 1){
    return res.send ({
      code: '-5',
      msg: '权限不够'
    })
  } else if(query.isadmin === 1) {
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
module.exports = router;