const express = require('express')
const routes = require('./routes/api/index')
const port = process.env.PORT || 3000
const app = new express()
const bodyParser = require('body-parser')

// use middleware
app.use(bodyParser.urlencoded({ extended: true }))

// use router
app.use('/api/', routes)

app.listen(port, () => console.log(`server is listening to port ${port}`))
