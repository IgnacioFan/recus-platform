const express = require('express')
const routes = require('./routes/api/index')
const port = process.env.PORT || 3000
const app = new express()
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')

// use middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

// use router
app.use('/api/', routes)

app.listen(port, () => console.log(`server is listening to port ${port}`))
