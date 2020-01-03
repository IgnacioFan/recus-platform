if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const routes = require('./routes/api/index')
const port = process.env.PORT || 3000
const cors = require('cors')
const bodyParser = require('body-parser')

// const passport = require('./config/passport')
// const helpers = require('./_helpers')
// 引入swagger
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')


const app = new express()

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
app.use('/api/', routes)

app.listen(port, () => console.log(`server is listening to port ${port}`))

module.exports = app