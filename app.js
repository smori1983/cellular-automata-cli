'use strict';

var lib = require('./lib');
var BitArray = require('node-bitarray');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var interval;

app.use(express.static(path.join(__dirname, '/public')));

server.listen(3000, function(){
  console.log('server started');
});

app.get('/rules', function (req, res) {
  //(rules 0-255)
  // var rules = [];
  // for (var i = 0; i < 256; i++) {
  //   var rule = {
  //     bits: BitArray.parse(i, true).join(''),
  //     id: i
  //   };
  //   rules.push(rule);
  // }

  // 'The Embodied Mind' format inputs.
  var rules = [
    {bits:'01111000', id:0},
    {bits:'11100110', id:1},
    {bits:'01101000', id:2},
    {bits:'10010000', id:3},
  ];

  res.setHeader('Content-Type', 'application/json');
  res.status(200).send(rules);
});

io.on('connection', function (socket) {

  socket.on('kill', function (){
    clearInterval(interval);
    console.log('{ animation: "complete" }');
  });

  socket.on('click', function (data) {
    console.log(data);
    clearInterval(interval);

    var ca = new lib.Automation(data.rule, 80);

    interval = setInterval(function () {
      ca.render();
      ca.bump();
    }, 100);
  });

});
