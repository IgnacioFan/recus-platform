const express = require('express')
const routes = require('./routes/api/index')
const port = process.env.PORT || 3000
var cors = require('cors')
const app = new express()
app.use(cors())
// use middleware


// use router
app.use('/api/', routes)

app.listen(port, () => console.log(`server is listening to port ${port}`))
