const subscription = require('flowz-subscription')
module.exports.subscription = subscription
module.exports = function () {
  // Add your custom middleware here. Remember, that
  // in Express the order matters
  const app = this // eslint-disable-line no-unused-vars
  app.use(subscription.subscription)
  let totalMessage = 11
  subscription.moduleResource.moduleName = 'todo'
  subscription.moduleResource.registerAppModule = {
    'project': {
      'create': 'project/new',
      'read': 'project/new',
      'update': 'project/update'
    },
    'task': {
      'create': 'task/new',
      'delete': 'task/delete'
    },
    'message': {
      'create': 'message',
      'find': 'message',
      'update': 'message',
      'delete': 'message',
      'put':'/message',
      'post':'/message',
      'get':'/message'
    }
  }
  subscription.moduleResource.appRoles = ['Admin', 'ProjectManage', 'TeamLead']
  subscription.registeredAppModulesRole()

  subscription.secureService.validate = (route, params, secureRouteInfo) => {
    return new Promise((resolve, reject) => {
      console.log(secureRouteInfo.value, '====', totalMessage)
      if ((route === '/message' || route === 'message') && secureRouteInfo.value >= totalMessage) {
        resolve(true)
      }
      resolve(false)
    })
  }
}
