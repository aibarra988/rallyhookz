var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 1337));

app.get('/', function (req, res) {
  res.send('Hello World! Now go away.')
})

app.listen(app.get('port'), function () {
  console.log('Listening on port', app.get('port'), '...')
})
