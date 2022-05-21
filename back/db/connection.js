var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'semantic_kansei'
});


connection.connect();

let db = {};

db.query = function(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, function(error, results, fields) {
            if (error) throw reject(error);
            resolve(results);
        });
    })
}

module.exports = db;