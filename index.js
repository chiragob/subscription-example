'use strict'

const { send, buffer, text ,json, createError } = require('micro')
const { router, get, post, options } = require('microrouter')
const rethinkDBObj = require('rethinkdb')
const cors = require('micro-cors')()

const defaultPack = require('./subpackage.js')
// let config = require('config')
console.log(defaultPack)
let Promise = require('promise')
const rp = require('request-promise')

const subscription = cors(async(req, res) => {
  if(req.params !== undefined && req.params['_']!== undefined ) {
    let subscriptionPath = req.params['_']
    if (subscriptionPath.substring(subscriptionPath.lastIndexOf('/') + 1, subscriptionPath.length).length <= 0) {
      subscriptionPath = subscriptionPath.substring(0, subscriptionPath.lastIndexOf('/'))
    }
    // console.log(subscriptionPath,'====', subscriptionPath.split('/'))
    subscriptionPath = subscriptionPath.split('/')
    await findSubscription(subscriptionPath)
    .then((result) => {
      // console.log('==Final Obj==', result)
      // console.log(result.validate())
      if (result.validate()) {
        send(res, 200, 'Subscription page')
      } else {
        send(res, 403, 'Subscription not available')
      }
    })
    .catch((err) => {
      if (err) { }
      send(res, 403, 'Subscription not available')
      return false
    })
  } else {
    send(res, 403, 'Subscription Path not available')
  }
})

async function findSubscription (arrPath) {
  return new Promise((resolve, reject) => {
    let obj = defaultPack
    arrPath.forEach(function (val, idx) {
      // console.log("\n\n==1==Path=", val, idx, '====Obj Val=', obj[val])
      if (obj[val] !== undefined) {
        obj = obj[val]
        console.log('===obj=', obj)
      } else {
        reject(null)
      }
    })
    resolve(obj)
  })
}

const notfound = cors((req, res) => send(res, 200, 'this is base page'))

module.exports = router(
  get('/subscription/*', subscription),
  get('/subscription', subscription),
  post('/subscription', subscription),
  options('/*', notfound)
)
