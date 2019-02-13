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
router.get('/getstudydivision', function(req, res){
  let division = '学习部'
  db.query("selec * from stuinfo where division ='"+division+"' ", function(err, rows){
    if(err) {
      res.send(err)
    } else if (rows){
      res.json(rows)
    }
  })
})
router.get('/getsportsdivision', function(req, res){
  let division = '体育部'
  db.query("selec * from stuinfo where division ='"+division+"' ", function(err, rows){
    if(err) {
      res.send(err)
    } else if (rows){
      res.json(rows)
    }
  })
})
router.get('/getorganizesdivision', function(req, res){
  let division = '组织部'
  db.query("selec * from stuinfo where division ='"+division+"' ", function(err, rows){
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
module.exports = router;