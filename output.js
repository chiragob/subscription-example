'use strict'

const { send,buffer,text,json,createError } = require('micro')
const { router,get,post,options } = require('microrouter')
const cors = require('micro-cors')()

const subscription = ((req, res) => {
  send(res, 200, "In Subscription")
})

const notfound = (req, res) => { send(res, 200,"this is base request") }

module.exports =  router(
  get('/subscription/',subscription),
  options('/*', notfound)
)
