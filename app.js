const express = require('express');
const app = express();
var path = require('path');

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(process.env.PORT || 5000, () => console.log('app listening on port 5000!'))