const express = require('express');
var proxy = require('express-http-proxy');
const fs = require('fs')
const path = require('path');
const app = express();
const https = require('https');
var http = require('http');


app.use(express.static('./build'));
app.use(express.static('./static'));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});

var http = require('http');
http.createServer(app).listen(process.env.CLIENT_HTTP_PORT, function(data, err){
 console.log("serveur started", data, err)});
