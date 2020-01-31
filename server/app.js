if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// const express = require('express')
const routes = require('./routes/api/index')
const port = process.env.PORT || 3000
const cors = require('cors')
const bodyParser = require('body-parser')

// 引入swagger
// const swaggerJsDoc = require('swagger-jsdoc')
// const swaggerUi = require('swagger-ui-express')

// const app = new express()
const app = require('express')()
// socket setup
const http = require('http').Server(app);
const io = require('socket.io')(http);

// use middleware
app.use(cors())
// parser json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

io.on('connection', (socket) => {
  console.log('a user is connected', socket.id)
  require('./middlewares/socket')(socket)

})

// use router
//app.use('/api/', routes)
require('./routes/api/index')(app)

// app.listen(port, () => console.log(`server is listening to port ${port}`))
http.listen(port, () => console.log(`server is listening to port ${port}`))

// module.exports = app
module.exports = http

