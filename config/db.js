let mysql = require('mysql')
//连接mysql
let pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '741852',
  database: 'student'
})
//CURD
function query(sql, callback) {
  console.log('SQL> '+sql);
  pool.getConnection(function(err, connection) {
    connection.query(sql, function(err, rows) {
      callback(err, rows)
      connection.release()
    })
  })
}
exports.query = query
