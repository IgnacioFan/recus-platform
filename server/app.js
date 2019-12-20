const express = require('express')
const routes = require('./routes/api/index')
const bodyParser = require('body-parser')


const app = new express()
const port = process.env.PORT || 3000
// use middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// use router
app.use('/api/', routes)

app.listen(port, () => console.log(`server is listening to port ${port}`))
