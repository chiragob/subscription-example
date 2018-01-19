// Application hooks that run for every service
const logger = require('./hooks/logger');
const hooks = require('feathers-authentication-hooks');

// app.use(function (req, res, next) {
//   req.feathers.isHttp = true
//   next()
// })

module.exports = {
  before: {
    all: [
    ],
    find: [
       //hooks.queryWithCurrentUser({ idField: 'id', as: 'sentBy' })
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

function sub(hook) {
  console.log("hook call")

}
