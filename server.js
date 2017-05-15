'use strict';
let app = require('./app');

app.set('port', 3001);

let server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
