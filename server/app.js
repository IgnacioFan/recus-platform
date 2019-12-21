const express = require('express')
const routes = require('./routes/api/index')
const port = process.env.PORT || 3000
const cors = require('cors')
const bodyParser = require('body-parser')
const app = new express()
app.use(cors())

// use middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// use router
app.use('/api/', routes)

app.listen(port, () => console.log(`server is listening to port ${port}`))
