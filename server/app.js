if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// const express = require('express')
const routes = require('./routes/api/index')
const port = process.env.PORT || 3000
const cors = require('cors')
const bodyParser = require('body-parser')

// const passport = require('./config/passport')
// const helpers = require('./_helpers')
// 引入swagger
// const swaggerJsDoc = require('swagger-jsdoc')
// const swaggerUi = require('swagger-ui-express')

// const app = new express()
const app = require('express')()
// socket setup
const http = require('http').Server(app);
const socketio = require('socket.io')(http);
const events = require('events')

const db = require('./models')
const Order = db.Order

// use middleware
app.use(cors())
// parser json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


//app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
// app.use(flash())
//app.use(passport.initialize())
//app.use(passport.session())
// app.use((req, res, next) => {
//   res.locals.success_messages = req.flash('success_messages')
//   res.locals.error_messages = req.flash('error_messages')
//   res.locals.user = req.user
//   next()
// })

// use router
//app.use('/api/', routes)
require('./routes/api/index')(app)

socketio.on('connection', (socket) => {
  console.log('a user is connected', socket.id)

  socket.emit('status', 'hello socket!')

  socket.on('pending', (length) => {
    console.log('pending length:', length)
  })

  socket.on('unpaid', (length) => {
    console.log('unpaid length:', length)
  })

  Order.scope('todayOrder').count({ where: { state: 'pending' } }).then((nums => {
    socket.emit('pending', nums)
  }))

  Order.scope('todayOrder').count({ where: { state: 'unpaid' } }).then((nums => {
    socket.emit('unpaid', nums)
  }))

  // var eventEmitter = new events.EventEmitter()
  // eventEmitter.on('pendingEvent', (data) => {
  //   console.log('pending does fire!!!!!!!!!!!!!!!!!!!!!')
  //   //data = 2
  //   socket.emit('pending', data)
  // })

  // eventEmitter.on('unpaidEvent', (data) => {
  //   console.log('unpaid does fire ===================')
  //   data =3
  //   socket.emit('unpaid', data)
  // })

  //exports.emitter = eventEmitter

})

// app.listen(port, () => console.log(`server is listening to port ${port}`))
http.listen(port, () => console.log(`server is listening to port ${port}`))

// module.exports = app
module.exports = http

