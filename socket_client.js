var socket = require('socket.io-client')('ws://172.16.230.151:4038', {reconnect: true})
//var socket = require('socket.io-client')('ws://localhost:4038', {reconnect: true})

socket.on('connect', function () {
  console.log('socket is connected')}
)
socket.on('disconnect', function () {console.log('socket is disconnected')})
