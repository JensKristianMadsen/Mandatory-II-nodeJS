const mysql = require('mysql');

const coon = mysql.createConnection({

    host : 'localhost',
    user : 'root',
    password : '',
    database : 'login_system'
});

coon.connect((err) =>{
    if(err) throw err;
    console.log('Database Connected..');
});

module.exports = coon;