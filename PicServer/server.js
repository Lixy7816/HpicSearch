//加载express模块
var express = require('express');
var app = express();

app.use('/data', express.static('data'));
var server = app.listen(8081);
console.log("Picture server started successfully!");
