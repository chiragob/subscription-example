let app = require('express')()
let subscription = require('../subscription/index')

let totalWebsite = 11
app.use(subscription.subscription)

subscription.secureService.validate = (route, params, secureRouteInfo) => {
    return new Promise((resolve, reject) => {
      console.log(secureRouteInfo.value,"====", totalWebsite)
      if (route === '/website' && secureRouteInfo.value >= totalWebsite) {
        resolve(true)
      }
      resolve(false)
    })
  }

app.get('/website', function (req, res) {
  res.send('Express call response')
})

app.get('/message', function (req, res) {
  res.send('Express call response')
})

app.post('/website', function (req, res) {
  res.send('Express call response')
})

app.listen(7001)
