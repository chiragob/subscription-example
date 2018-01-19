/* eslint-disable */
import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'
import io from 'socket.io-client'

export const socket = io('http://localhost:5555', {
  transports: ['websocket'],
  upgrade: false,
  query: {
   'authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YTBjMTU1YTQxZWJkYzAwMWZmNjlmNTMiLCJpYXQiOjE1MTQxNzgyMjIsImV4cCI6MTUxNDE4MTg1MiwiYXVkIjoiaHR0cHM6Ly95b3VyZG9tYWluLmNvbSIsImlzcyI6ImZlYXRoZXJzIiwic3ViIjoiYW5vbnltb3VzIn0.Mdjmp46QN1CwdbudnAAjQE8DEuki0GZPOAXfuib7fb4'
 }
}); //, path: '/mom'

 socket.on("connect", function(){
     console.log('io connected!')
 });

 socket.on("error", function(err){
     console.log('Error:', err)
 });

export const app = feathers().configure(socketio(socket));
export const msgService = app.service('message')
