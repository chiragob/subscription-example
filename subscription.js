//
// let defaultPlan = [
//   {
//     route: '/website',
//     method: 'post',
//     no: 5
//   },
//   {
//     route: '/message',
//     method: 'create',
//     value: 20
//   },
//   {
//     route: '/message',
//     method: 'get',
//     value: 15
//   },
//   {
//     route: '/website',
//     method: 'get',
//     value: 10
//   }
// ]
let rp = require('request-promise')
let defaultConfig = {
  'subscriptionURL': '/subscription_page',
  'userDetailURL': 'http://ec2-54-88-11-110.compute-1.amazonaws.com/api/userdetails'
}

let subscriptionURL = defaultConfig.subscriptionURL
let userDetailURL = defaultConfig.userDetailURL

if (process.env['subscriptionURL'] !== '') {
  subscriptionURL = process.env['subscriptionURL']
}
if (process.env['userDetailURL'] !== '') {
  userDetailURL = process.env['userDetailURL']
}

let secureService = {
  validate: (route, params, secureRouteInfo) => {
    return new Promise((resolve, reject) => {
      resolve(false)
    })
  }
}

module.exports.secureService = secureService

module.exports.subscription = async function (req, res, next) {
  // console.log('Subscription Request:', req.headers.authorization)
  // console.log('==1=>' + _.escapeRegExp(req.baseUrl + req._parsedUrl.pathname) + '<==')
  if (req.headers.authorization !== undefined) {
    let userDetail = await getUserPackage(req.headers.authorization).catch((err) => { if (err) {} })
    // console.log('==userDetail=>', userDetail.data)
    if (userDetail.data.package !== undefined && userDetail.data.package.details !== undefined) {
      if (isPlanExpired(userDetail.data.package.expiredOn)) {
        console.log('planExpire===>')
        res.redirect(401, subscriptionURL)
        return false
      }

      let userPlan = userDetail.data.package.details
      let mainRoute = req.baseUrl + req._parsedUrl.pathname
      let mainMethod = req.method.replace("'", '')
      let regExpmainRoute = new RegExp('^' + mainRoute, 'i')
      let regExpmainMethod = new RegExp('^' + mainMethod, 'i')
      console.log('==1=>' + mainRoute + '<==>' + mainMethod + '<==')
      let findObj = userPlan.find((o) => { return regExpmainRoute.test(o.route) && regExpmainMethod.test(o.method) })
      if (findObj !== undefined) {
        // call validate method
        //console.log('====== Find Obj :', findObj)
        try {
          console.log(secureService.validate.toString())
          if (typeof secureService.validate === 'function') {
            let isSecure = await secureService.validate(mainRoute, req, findObj)
            if (isSecure !== true) {
              res.redirect(401, subscriptionURL)
              return false
            }
          } else {
            res.redirect(401, subscriptionURL)
            return false
          }
        } catch (e) {
          res.redirect(401, subscriptionURL)
          return false
        }
      }
    }
  }
  next()
}

let isPlanExpired = (expiryDate) => {
  let expiryDateObj = new Date((new Date(expiryDate)))
  // console.log('current Time==>', (new Date()).toGMTString())
  // console.log('expiryDateObj==>', expiryDateObj)
  if (expiryDateObj < new Date((new Date()).toGMTString())) {
    return true
  }
  return false
}

let getUserPackage = async function (authorization) {
  return new Promise((resolve, reject) => {
    var options = {
      uri: userDetailURL,
      headers: {
        'authorization': authorization
      }
    }
    rp(options)
    .then(function (userDetail) {
      resolve(JSON.parse(userDetail))
    })
    .catch(function (err) {
      if (err) {
      }
      resolve(null)
    })
  })
}
