const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

const handler = require('feathers-errors/handler');
const notFound = require('feathers-errors/not-found');
const memory = require('feathers-memory');
const auth = require('feathers-authentication');
const local = require('feathers-authentication-local');
const jwt = require('feathers-authentication-jwt');
const hook1s = require('feathers-authentication-hooks');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const rethinkdb = require('./rethinkdb');
const subscription = require('flowz-subscription')
const app = feathers();

// Load app configuration
app.configure(configuration());
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', feathers.static(app.get('public')));

// Set up Plugins and providers
app.configure(hooks());
app.configure(rethinkdb);
app.configure(rest());
//app.configure(socketio());



app.configure(auth({
 path: '/authentication', // the authentication service path
 header: 'Authorization', // the header to use when using JWT auth
 entity: 'user', // the entity that will be added to the request, socket, and context.params. (ie. req.user, socket.user, context.params.user)
 service: 'users', // the service to look up the entity
 passReqToCallback: true, // whether the request object should be passed to the strategies `verify` function
 session: false, // whether to use sessions
 secret: 'abcdefghigk',
 cookie: {
  enabled: false, // whether cookie creation is enabled
  name: 'feathers-jwt', // the cookie name
  httpOnly: false, // when enabled, prevents the client from reading the cookie.
  secure: true // whether cookies should only be available over HTTPS
 },
 jwt: {
  header: { type: 'access' }, // by default is an access token but can be any type
  subject: 'anonymous', // Typically the entity id associated with the JWT
  issuer: 'feathers', // The issuing server, application or resource
  algorithm: 'HS256', // the algorithm to use
  expiresIn: '1d' // the access token expiry
 }
}))
  .configure(local())
  .configure(jwt())
  .use('/users', memory())
// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Configure a middleware for 404s and the error handler
app.use(notFound());
app.use(handler());


// // Add a hook to the user service that automatically replaces
// // the password with a hash of the password before saving it.
// app.service('users').hooks({
//   before: {
//     find: [
//       auth.hooks.authenticate('jwt')
//     ],
//     create: [
//       local.hooks.hashPassword({ passwordField: 'password' })
//     ]
//   }
// });


app.hooks(appHooks);
let authToken = ''
console.log("======socket connection===auth==", authToken)
app.configure(socketio({
  wsEngine:'uws'
},function(io) {
  console.log("===22222===socket connection===auth==", authToken)
  // Registering Socket.io middleware
  io.on('connection',function (socket) {
    console.log("===333===socket connection===auth==", authToken)
     authToken = socket.handshake.query.authorization
     console.log("======socket connection===auth==", authToken)

    socket.use((packet, next) => {
      console.log("=========1111========socket middleware call===request=====", socket.id,"========",packet, authToken)
      subscription.socketSubscription(authToken, packet, next)
      // if (packet.doge === true) return next();
      // next(new Error('Not a doge error'));
    })

  })

}))

module.exports = app;
