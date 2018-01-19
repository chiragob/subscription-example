module.exports = {
    'websitebuilder': {
      'no-website-allow': {
        'value': 5,
        'validate': () => { return true }
      },
      'no-web-page-allow': {
        'value': 20,
        'validate': () => { return true }
      }
    },
    'todo': {
      'no-project-allow': {
        'value': 2,
        'validate': () => { return false }
      },
      'no-user-allow': {
        'value': 25,
        'validate': () => { return true }
      }
    }
  }
