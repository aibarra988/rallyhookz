var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.set('port', (process.env.PORT || 1337));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


// ENDPOINTS

app.get('/', function (req, res) {
  res.send('Hello World! Now go away.');
});

app.post('/debug', function (req, res) {
    console.log('** /debug hit - payload:', JSON.stringify(req.body));
    res.sendStatus(200);
});


// LISTENER

app.listen(app.get('port'), function () {
  console.log('Listening on port', app.get('port'), '...');
});
