var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

let db = require("./db/connection");

var app = express();
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));
app.use('/index2', require('./routes/index2'));

app.post(`/insertData`, async(req, res) => {

    let today = new Date();
    console.log(`INSERT INTO main(fullname, date, result, part, raw) VALUES ("${req.body.fullname}", "${today}", '${req.body.result}', "${req.body.partNumber}", '${req.body.raw}')`)
    let result = await db.query(`INSERT INTO main(fullname, date, result, part, raw) VALUES ("${req.body.fullname}", "${today}", '${req.body.result}', "${req.body.partNumber}", '${req.body.raw}')`);

    if (result) {
        res.send({ status: true, error: [`row id : ${result.insertId}`] })
    } else {
        res.send({ status: false, error: ['problem to insert data to db'] })
    }

});

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


// module.exports = app;

app.listen(1401, function() {
    console.log(`Server is started on 1401`)
})